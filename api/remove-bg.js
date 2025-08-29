import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('.env.local file not found, using process.env');
  dotenv.config();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Log to help debug
  console.log("Remove BG API Key:", process.env.REMOVE_BG_API_KEY ? "Found (masked)" : "Not found");
  
  if (!process.env.REMOVE_BG_API_KEY) {
    return res.status(500).json({ error: "API key not configured. Please add REMOVE_BG_API_KEY to your .env.local file." });
  }

  try {
    // Handle formData from the request
    let file;
    
    if (req.formData) {
      // For Edge runtime or environments with formData support
      const formData = await req.formData();
      file = formData.get("image");
    } else {
      // For Node.js environments without native formData support
      // We need to parse the multipart form data manually
      // This is a simplified version - you might need a more robust solution
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid content type. Expected multipart/form-data" });
      }
      
      // Use a library like formidable or multer in a real implementation
      // For now, we'll just read the raw body
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      // Create a File-like object
      file = {
        arrayBuffer: async () => buffer,
        type: 'image/jpeg', // Assuming JPEG, adjust as needed
        name: 'upload.jpg'
      };
    }

    if (!file) return res.status(400).json({ error: "No image provided" });

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || 'image/jpeg' });

    // Using multipart/form-data manually with FormData
    const data = new FormData();
    data.append("image_file", blob, file.name || 'image.jpg');
    data.append("size", "auto");

    console.log("Sending request to remove.bg API...");
    
    const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { 
        "X-Api-Key": process.env.REMOVE_BG_API_KEY
      },
      body: data,
    });

    console.log("Response status:", removeBgRes.status);

    if (!removeBgRes.ok) {
      const errorText = await removeBgRes.text();
      console.error("Error from remove.bg API:", errorText);
      return res.status(removeBgRes.status).json({ error: `Failed to process image: ${removeBgRes.statusText}` });
    }

    const resultArrayBuffer = await removeBgRes.arrayBuffer();
    const buffer = Buffer.from(resultArrayBuffer);
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.end(buffer);

  } catch (err) {
    console.error("Error removing background:", err);
    res.status(500).json({ error: "Background removal failed: " + (err.message || "Unknown error") });
  }
}
