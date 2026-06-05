import { GoogleGenAI } from "@google/genai";

// Initialize using the modern, unified Google Gen AI SDK protocol
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Global CORS headers mapping
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
    const { currentMessage, conversationHistory } = req.body;

    if (!currentMessage) {
      return res.status(400).json({ reply: "No message received." });
    }

    // Map passed client thread logs directly into structured Gemini contents schemas
    const contentsPayload = [];
    
    if (Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        contentsPayload.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // Append the user's latest incoming conversational message turn
    contentsPayload.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    // Execute standard content generation sequence with system context constraints
    const responseInstance = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: "You are the Guru Studios Consultant. Your objective is to help clients understand design packages ($500+, 3-5 days turnaround), portraiture sessions ($250+, 3-5 days), and custom invitation suites ($400+, 5-7 days). Be brief, professional, and guide them to select their service or fill out the contact form."
      }
    });

    return res.status(200).json({
      reply: responseInstance.text || "Empty response from Gemini."
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      reply: "Server error while connecting to Gemini AI."
    });
  }
}
