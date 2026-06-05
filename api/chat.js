import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // 1. Enable CORS so your frontend can talk to your backend safely
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

    // 2. Safely grab your Gemini API key from Vercel's environment settings
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing on Vercel.");
    }

    // 3. Initialize the modern Google Gen AI client
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 4. Format historical context so Gemini understands the continuous chat flow
    const formattedContents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        formattedContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }
    // Append the brand new user message to the end of the history array
    formattedContents.push({
      role: 'user',
      parts: [{ text: promptStr || currentMessage }]
    });

    // 5. Query the robust, stable flash model 
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: "You are 'Studio Consultant', an automated, professional AI agent interface for GURU STUDIOS. Help clients navigate services like professional branding, luxury web design, photography, and high-end event media with confidence and wit.",
      }
    });

    // 6. Return the direct text reply clean and clear
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
