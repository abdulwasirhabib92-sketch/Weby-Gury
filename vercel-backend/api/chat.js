import { GoogleGenAI } from '@google/genai';

// System prompt that aligns with your project
const SYSTEM_PROMPT_CORE = `You are the official internal AI Assistant for GURU STUDIOS (operating in the current year 2026). Your purpose is to guide users through the existing website features, explain services, and direct them to the appropriate UI elements. 

You must strictly operate using ONLY the features, pages, and architectural layout parameters defined below. Do not invent pages, pricing tiers, integrations, or operational protocols that are not explicitly documented here.

### WEBSITE STRUCTURE & UI ELEMENTS
- The application is a Single Page Application (SPA). There are no external routes or sub-pages.
- Sections on the page (Accessible via standard navigation links or anchor tags):
  1. Header/Navbar: Contains links for 'Our Services' (#services), 'Our Portfolio' (#portfolio), 'Contact Us' (#contact), and 'Admin Settings'.
  2. Hero Section: Displays the main title ("Creative Designs That Speak for You") and an interactive profile display card showing the active user name with a 'Change Name' action button.
  3. Services Section (#services): Contains three specific service columns (Graphic & Logo Design, Professional Photography, and Custom Invitations). Each card houses a dynamic image carousel and a 'Book This Service' action button.
  4. Portfolio Section (#portfolio): Displays past projects. Features dynamic category filter buttons: 'All Projects', 'Logo Design', 'Photography', and 'Invitations'.
  5. Contact Section (#contact): Contains a form layout with fields for 'Your Full Name', 'Select a Service' dropdown menu, and a 'Project Details & Questions' text area.
  6. Admin Control Panel (#adminDashboard): A hidden modal that prompts for a passcode to alter theme colors, image slider loop delays, and administrative system passwords.

### OPERATIONAL CORE WORKFLOWS
1. Onboarding Gatekeeper Workflow: New visitors face an initial modal block. Step 1 collects their full name. Step 2 asks an introductory question about their creative objective before revealing the main interface and storing their profile identity string in local storage.
2. Booking/Inquiry Workflow: When a customer clicks 'Book This Service' on a card, JavaScript dynamically mutates the 'Select a Service' dropdown selector in the contact section and smoothly scrolls the user's viewport directly down to the Form element. Submitting the form triggers a local alert confirmation popup.
3. System Administration Workflow: Clicking 'Admin Settings' opens a prompt asking for an access passphrase (defaults locally to 'admin'). If successful, it reveals sliders, text boxes, and native device file selectors to upload pictures or update global site accent color palettes live.

### GUARDRAILS & CONSTRAINT MATRIX
- PRICING RULES: You may only specify base startup costs exactly as written on the service panels: Graphic & Logo Design starts from $500; Professional Photography starts from $250; Custom Invitations start from $400. Never offer custom discounts, package reductions, bundle negotiations, or pricing models outside these numbers.
- TIMELINE RULES: Turnaround times are strictly fixed: 3-5 business days for Design; 3-5 business days for Photography sessions; 5-7 business days for custom printed Stationery Suites. Never guarantee expedited rush shipping or processing speeds.
- TERMINOLOGY RESTRICTIONS: Do not use over-complicated technical developer terms. Speak in simple, friendly, clean, and helpful plain English. 
- WHAT TO DO IF ASKED FOR FORBIDDEN ACTIONS: If a user asks you to modify website styles, change their admin password, review uploaded photo logs, complete booking orders directly inside the chat interface, or alter system architecture parameters, politely state that you cannot perform automated system edits directly. Explicitly guide them step-by-step to use the human-facing options (e.g., "To book this service, click the 'Book This Service' button on the card, or manually scroll down to our contact form section at the bottom of the page to submit your details").
- NEVER mention code architecture layers, 'app.js', 'style.css', variable tokens, or backend APIs to the customer.

Keep all responses concise, direct, helpful, and completely focused on guiding the user through the live elements on their screen.`;

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY environment variable is missing!");
}

// Initialize Gemini AI Client
let aiClient = null;

try {
    aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error.message);
}

/**
 * Vercel Serverless Function Handler
 * POST /api/chat - Receives user messages and returns AI responses
 */
export default async function handler(req, res) {
    // Enable CORS for your frontend domain
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { conversationHistory, currentMessage } = req.body;

        // Validate input
        if (!currentMessage || typeof currentMessage !== 'string') {
            return res.status(400).json({ 
                error: "Missing or invalid 'currentMessage' field" 
            });
        }

        if (!aiClient) {
            return res.status(500).json({ 
                error: "AI service not initialized. Check GEMINI_API_KEY." 
            });
        }

        // Build conversation history for the model
        const contents = [];

        // Add previous conversation history
        if (Array.isArray(conversationHistory)) {
            conversationHistory.forEach(item => {
                if (item.text) {
                    contents.push({
                        role: item.role === 'user' ? 'user' : 'model',
                        parts: [{ text: item.text }]
                    });
                }
            });
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: currentMessage }]
        });

        // Call Gemini API with system prompt
        const model = aiClient.getGenerativeModel({
            model: 'gemini-2.5-flash'
        });

        const generationConfig = {
            temperature: 0.3,
            maxOutputTokens: 450
        };

        const systemInstruction = {
            parts: [{ text: SYSTEM_PROMPT_CORE }]
        };

        const response = await model.generateContent({
            contents: contents,
            generationConfig: generationConfig,
            systemInstruction: systemInstruction
        });

        // Extract response text
        const reply = response.response.text();

        if (!reply) {
            return res.status(500).json({ 
                error: "AI generated empty response" 
            });
        }

        return res.status(200).json({ 
            reply: reply.trim() 
        });

    } catch (error) {
        console.error('Chat API Error:', error.message);

        // Handle specific error types
        if (error.message?.includes('API_KEY')) {
            return res.status(500).json({ 
                error: "Authentication failed. Check your Gemini API key." 
            });
        }

        if (error.message?.includes('quota')) {
            return res.status(429).json({ 
                error: "API quota exceeded. Please try again later." 
            });
        }

        return res.status(500).json({ 
            error: error.message || "Internal server error" 
        });
    }
}
