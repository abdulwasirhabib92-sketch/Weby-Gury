export default async function handler(req, res) {
  // Setup standard headers
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "Backend Config Error: Missing GEMINI_API_KEY variable on Vercel." });
    }

    // Construct the standard conversation history payload
    const contentsPayload = [];
    
    if (Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        contentsPayload.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // Add current user prompt
    contentsPayload.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    // Native fetch request to Google's official REST API endpoint
    const systemInstruction = "You are the Guru Studios Consultant. Help clients understand design packages ($500+, 3-5 days turnaround), portraiture sessions ($250+, 3-5 days), and custom invitation suites ($400+, 5-7 days). Be brief, professional, and guide them to fill out the contact form.";
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contentsPayload,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Google API Direct Error:", errorData);
      throw new Error(`Google API returned status code ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    const aiTextReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply: aiTextReply || "Empty response from Gemini endpoints."
    });

  } catch (error) {
    console.error("Direct Pipeline Error:", error);
    return res.status(500).json({
      reply: "Server function executed successfully, but failed to call Gemini API."
    });
  }
}
