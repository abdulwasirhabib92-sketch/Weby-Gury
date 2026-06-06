import { Groq } from 'groq-sdk';

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

    // Grab your Groq API key from Vercel settings
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is missing on Vercel.");
    }

    // Initialize the Groq client
    const groq = new Groq({ apiKey: apiKey });

    // Format the messages array using standard ChatCompletion format
    const formattedMessages = [
      {
        role: "system",
        content: "You are 'Studio Consultant', an automated, professional AI agent interface for GURU STUDIOS. Help clients navigate services like professional branding, luxury web design, photography, and high-end event media with confidence and wit."
      }
    ];

    // Append historical context if it exists
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        formattedMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.text
        });
      });
    }
    
    // Append the new incoming user message
    formattedMessages.push({
      role: 'user',
      content: currentMessage
    });

    // Query a fast, reliable model hosted on Groq (e.g., Llama 3)
    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama3-8b-8192',
    });

    const replyText = completion.choices[0]?.message?.content || "I processed your request but could not construct a text reply.";
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Direct Pipeline Error:", error);
    return res.status(500).json({ 
      error: "Internal pipeline exception raised", 
      details: error.message 
    });
  }
}
