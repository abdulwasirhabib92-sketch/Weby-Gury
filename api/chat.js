import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  // 1. Configure Global CORS Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle Preflight OPTIONS requests safely
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject non-POST requests instantly
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Adaptive Stream and Body Parsing
    // Safely checks if req.body arrives as a raw string or parsed object
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { currentMessage, conversationHistory } = body || {};

    // Validate the incoming payload parameters
    if (!currentMessage) {
      return res.status(400).json({ error: "Missing currentMessage payload parameter" });
    }

    // Verify secret environment token is bound to host
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is missing on host settings.");
    }

    // Initialize the Groq SDK client instances
    const groq = new Groq({ apiKey });
    const formattedMessages = [];

    // 3. Inject Contextual System System Instruction
    // Note: Swap this system text to match your specific application context
    formattedMessages.push({
      role: "system",
      content: "You are an expert technical assistant. Provide accurate, production-ready code resolutions and clear descriptions with speed and precision."
    });

    // 4. Robust Polymorphic History Normalization
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        if (msg) {
          // Fallback mechanism: Captures standard data fields 'content' OR custom templates 'text'
          const extractionContent = msg.content || msg.text;
          
          if (extractionContent) {
            formattedMessages.push({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: String(extractionContent)
            });
          }
        }
      });
    }
    
    // Append the current active user message to the conversation tail
    formattedMessages.push({
      role: 'user',
      content: String(currentMessage)
    });

    // 5. Query Large Language Model Architecture via Groq Engine
    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5, // Reduced from 0.7 to enforce predictable, accurate logic tracking
      max_tokens: 1024
    });

    // Safely extract text payload response
    const replyText = completion.choices[0]?.message?.content || "No message generated.";
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Critical Execution Interrupted:", error);
    return res.status(500).json({ 
      error: "Internal pipeline exception raised", 
      details: error.message 
    });
  }
}
