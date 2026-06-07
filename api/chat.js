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

    // 3. Inject Contextual Guardrailed System Instruction
    // This strictly locks the AI to your website scope while allowing general pleasantries.
    formattedMessages.push({
      role: "system",
      content: `You are 'Studio Consultant', the official automated support assistant for GURU STUDIOS. 
      
YOUR CORE SCOPE:
- You ONLY communicate about GURU STUDIOS, how to navigate and use this website, and how to assist users with our services (branding, luxury web design, photography, high-end event media).
- You must guide users on how to make the most of their experience on our site.

HANDLING GENERAL INPUTS:
- If the user greets you (e.g., "Hi", "Hello"), replies with a pleasantry ("Thanks!", "Awesome"), or asks who you are, respond politely as 'Studio Consultant' and immediately steer the conversation back to how you can help them navigate the website.

STRICT BOUNDARIES (GUARDRAILS):
- If a user asks about completely unrelated topics (e.g., world history, math problems, coding help, recipes, or general knowledge questions outside of our website/services), you must politely decline to answer. 
- Example response for off-topic prompts: "I am only programmed to assist with questions regarding GURU STUDIOS, our website features, and our services. How can I help you navigate our studio today?"`
    });

    // 4. Robust Polymorphic History Normalization
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        if (msg) {
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
      temperature: 0.4, // Lowered slightly more to keep the AI focused and adhering strictly to the guardrails
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
