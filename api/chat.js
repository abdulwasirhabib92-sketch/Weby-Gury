import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentMessage, conversationHistory } = req.body;

    // Grab your Gemini API key from Vercel settings
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing on Vercel.");
    }

    // Initialize modern Google Gen AI client
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Format historical context
    const formattedContents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        formattedContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // FIX: Using currentMessage directly instead of promptStr
    formattedContents.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    // Query the flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: "You are 'Studio Consultant', an automated, professional AI agent interface for GURU STUDIOS. Help clients navigate services like professional branding, luxury web design, photography, and high-end event media with confidence and wit.",
      }
    });

    const replyText = response.text || "I processed your request but could not construct a text reply.";
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Direct Pipeline Error:", error);
    return res.status(500).json({ 
      error: "Internal pipeline exception raised", 
      details: error.message 
    });
  }
}
