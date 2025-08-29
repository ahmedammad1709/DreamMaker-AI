import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("Gemini key:", process.env.GEMINI_API_KEY);
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

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(message);
        const response = result.response.text();

        return new Response(JSON.stringify({ reply: response }), {
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
