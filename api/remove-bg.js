import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // let formidable handle it
  },
};

export default async function handler(req, res) {

  console.log("HF_API_KEY:", process.env.HF_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const fileBuffer = fs.readFileSync(file.filepath);

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: fileBuffer,
      }
    );

    if (!hfRes.ok) {
      const errorText = await hfRes.text();
      return res.status(hfRes.status).json({ error: errorText });
    }

    const buffer = Buffer.from(await hfRes.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.send(buffer);
  } catch (err) {
    console.error("Error in remove-bg API:", err);
    return res.status(500).json({ error: "Background removal failed." });
  }
}
