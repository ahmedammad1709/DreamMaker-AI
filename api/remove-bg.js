export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();

    // Call HuggingFace model
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: arrayBuffer,
      }
    );

    if (!hfRes.ok) {
      const errorText = await hfRes.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: hfRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const processedImage = await hfRes.blob();

    return new Response(processedImage, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error in remove-bg API:", err);
    return new Response(
      JSON.stringify({ error: "Background removal failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
