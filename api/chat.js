import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Use POST request only." });
  }

  try {
    const { currentMessage } = req.body;

    if (!currentMessage) {
      return res.status(400).json({ reply: "No message received." });
    }

    // Gemini model (stable + fast)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(currentMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      reply: text || "Empty response from Gemini."
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      reply: "Server error while connecting to Gemini AI."
    });
  }
}
