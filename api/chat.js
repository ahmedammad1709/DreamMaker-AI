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

        // Call Gemini API with a simpler request format
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: "You are GenCraft AI, the official assistant for the GenCraft website. Always be helpful and respond to this user message: " + message
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
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
