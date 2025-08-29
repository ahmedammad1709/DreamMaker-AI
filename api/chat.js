export const config = { runtime: "edge" };

export default async function handler(req) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key not configured" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Call Gemini API directly using fetch
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "system",
                            parts: [
                                {
                                    text: "You are GenCraft AI, the official assistant for the GenCraft website. Always introduce yourself as GenCraft AI and explain that you help with image-to-text, text-to-image, and background removal. Never say you are Google’s AI model."
                                }
                            ]
                        },
                        {
                            role: "user",
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API error:", errorData);
            return new Response(JSON.stringify({ error: "Error from Gemini API" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Something went wrong." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
