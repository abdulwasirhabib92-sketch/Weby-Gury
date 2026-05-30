// State Matrix Initialization Engine
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    leadRegistry: JSON.parse(localStorage.getItem('guru_lead_registry')) || [],
    activeServiceArea: '',
    chatHistory: JSON.parse(localStorage.getItem('guru_chat_history')) || []
};

// Target Services Asset Matrix Knowledgebase
const ServiceMatrix = [
    { id: "logo", token: "Logo Design", category: "design", est: "3–5 Days", price: "$300 - $700", tags: ["logo", "branding", "identity", "vector"] },
    { id: "poster", token: "Poster Design", category: "design", est: "2–4 Days", price: "$150 - $400", tags: ["poster", "print", "flyer", "graphics"] },
    { id: "brand", token: "Branding Packages", category: "design", est: "7–14 Days", price: "$1,200 - $3,500", tags: ["branding package", "guidelines", "identity pack"] },
    { id: "uiux", token: "UI/UX Design", category: "design", est: "5–10 Days", price: "$800 - $2,500", tags: ["ui/ux", "wireframe", "interface", "figma", "app", "website"] },
    { id: "eventphoto", token: "Event Coverage", category: "photography", est: "3–5 Days", price: "$150/hr - $1,200/day", tags: ["event coverage", "wedding photography", "party", "shoot"] },
    { id: "portrait", token: "Portrait Shoots", category: "photography", est: "2–3 Days", price: "$250 - $600", tags: ["portrait", "headshot", "editorial portrait"] },
    { id: "productphoto", token: "Product Shoots", category: "photography", est: "3–5 Days", price: "$400 - $1,500", tags: ["product photo", "e-commerce", "commercial shoot"] },
    { id: "wedinvite", token: "Wedding Suites", category: "invitations", est: "4–7 Days", price: "$200 - $800", tags: ["wedding suite", "wedding invite", "rsvp"] },
    { id: "birthinvite", token: "Birthday/Social", category: "invitations", est: "2–3 Days", price: "$75 - $250", tags: ["birthday", "social card", "party invitation"] },
    { id: "corpinvite", token: "Corporate Events", category: "invitations", est: "3–5 Days", price: "$150 - $500", tags: ["corporate event", "gala card", "seminar invitation"] }
];

// Document Object Mapping Hooks
document.addEventListener('DOMContentLoaded', () => {
    initializeOnboardingState();
    registerCoreEvents();
    renderPortfolioFilters();
    syncAdminDashboard();
    initAIConsultantUI();
});

// Structural Onboarding Verification Check
function initializeOnboardingState() {
    const onboarding = document.getElementById('onboardingContainer');
    const welcome = document.getElementById('welcomeBackContainer');
    const displayUser = document.getElementById('displayUserName');
    const formNameField = document.getElementById('formName');

    if (GuruAgencyState.clientName) {
        onboarding.classList.add('hidden');
        welcome.classList.remove('hidden');
        displayUser.textContent = GuruAgencyState.clientName;
        formNameField.value = GuruAgencyState.clientName;
    } else {
        onboarding.classList.remove('hidden');
        welcome.classList.add('hidden');
    }
}

// System Event Routers & Registration Loops
function registerCoreEvents() {
    // Identity Capture Flow triggers
    document.getElementById('startJourneyBtn').addEventListener('click', captureUserIdentity);
    document.getElementById('userNameInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') captureUserIdentity(); });
    document.getElementById('resetNameBtn').addEventListener('click', clearUserIdentity);

    // Global Package Request Hooks
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const desiredService = e.target.getAttribute('data-service-name');
            routeRequestToForm(desiredService);
        });
    });

    // Intake Brief Submission Trigger
    document.getElementById('leadForm').addEventListener('submit', processBriefSubmission);

    // Terminal System Panel Interlock Triggers (Hidden Administrative Panel Mode)
    document.getElementById('adminTriggerLink').addEventListener('click', () => {
        document.getElementById('adminDashboard').classList.remove('hidden');
    });
    document.getElementById('closeAdminBtn').addEventListener('click', () => {
        document.getElementById('adminDashboard').classList.add('hidden');
    });
}

function captureUserIdentity() {
    const inputVal = document.getElementById('userNameInput').value.trim();
    if (!inputVal) return;
    
    GuruAgencyState.clientName = inputVal;
    localStorage.setItem('guru_client_name', inputVal);
    initializeOnboardingState();
    
    // Inject identity dynamically straight into active chatbot components
    triggerConsultantGreeting(inputVal);
}

function clearUserIdentity() {
    localStorage.removeItem('guru_client_name');
    GuruAgencyState.clientName = '';
    document.getElementById('userNameInput').value = '';
    document.getElementById('formName').value = '';
    initializeOnboardingState();
}

function routeRequestToForm(serviceName) {
    const selector = document.getElementById('formService');
    selector.value = serviceName;
    
    const element = document.getElementById('contact');
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Pulse animation logic
    const inputArea = document.querySelector('.contact-container');
    inputArea.style.borderColor = 'var(--accent-fuchsia)';
    setTimeout(() => { inputArea.style.borderColor = 'var(--border-subtle)'; }, 1200);
}

// Multi-Tier Filter Engine Implementation
function renderPortfolioFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const items = document.querySelectorAll('.portfolio-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetFilter = tab.getAttribute('data-filter');

            items.forEach(item => {
                if (targetFilter === 'all' || item.getAttribute('data-category') === targetFilter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Lightbox presentation layer mapping logic
    items.forEach(item => {
        item.addEventListener('click', () => {
            const styleClone = item.querySelector('.portfolio-display').style.backgroundImage;
            const lightbox = document.getElementById('lightbox');
            const content = document.getElementById('lightboxContent');
            
            content.style.backgroundImage = styleClone;
            content.style.backgroundSize = 'contain';
            content.style.backgroundPosition = 'center';
            content.style.backgroundRepeat = 'no-repeat';
            lightbox.classList.remove('hidden');
        });
    });

    document.getElementById('lightboxClose').addEventListener('click', () => {
        document.getElementById('lightbox').classList.add('hidden');
    });
}

// Production Brief Processing Data Layer
function processBriefSubmission(e) {
    e.preventDefault();
    
    const leadPayload = {
        timestamp: new Date().toLocaleString(),
        name: document.getElementById('formName').value,
        email: document.getElementById('formEmail').value,
        phone: document.getElementById('formPhone').value || 'N/A',
        service: document.getElementById('formService').value || 'General Consultation Inquiry',
        description: document.getElementById('formDesc').value || 'No brief submitted.'
    };

    GuruAgencyState.leadRegistry.push(leadPayload);
    localStorage.setItem('guru_lead_registry', JSON.stringify(GuruAgencyState.leadRegistry));
    
    alert(`Brief parsed successfully, ${leadPayload.name}. Our design directors will evaluate the timeline.`);
    document.getElementById('leadForm').reset();
    initializeOnboardingState();
    syncAdminDashboard();
}

// Admin Framework Integration Sync Component
function syncAdminDashboard() {
    document.getElementById('metricLeads').textContent = GuruAgencyState.leadRegistry.length;
    document.getElementById('metricUser').textContent = GuruAgencyState.clientName || "Anonymous Node";
    
    // Frequency calculations map algorithm logic
    if (GuruAgencyState.leadRegistry.length > 0) {
        const counts = GuruAgencyState.leadRegistry.reduce((acc, current) => {
            acc[current.service] = (acc[current.service] || 0) + 1;
            return acc;
        }, {});
        const highService = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        document.getElementById('metricInquiry').textContent = highService;
    }

    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    if (GuruAgencyState.leadRegistry.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No inbound operational briefs loaded in memory matrix database.</td></tr>`;
        return;
    }

    GuruAgencyState.leadRegistry.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: var(--accent-fuchsia); font-family: monospace;">${lead.timestamp}</td>
            <td><strong>${lead.name}</strong></td>
            <td>${lead.email}</td>
            <td><span style="background: rgba(99,102,241,0.15); padding: 0.25rem 0.5rem; border-radius: 4px; color: #a5b4fc;">${lead.service}</span></td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${lead.description}</td>
        `;
        tbody.appendChild(row);
    });
}

// AI Consulting Conversation Framework Subsystem
function initAIConsultantUI() {
    const trigger = document.getElementById('aiTrigger');
    const windowUI = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiClose');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');

    trigger.addEventListener('click', () => { windowUI.classList.remove('hidden'); trigger.classList.add('hidden'); });
    closeBtn.addEventListener('click', () => { windowUI.classList.add('hidden'); trigger.classList.remove('hidden'); });
    
    sendBtn.addEventListener('click', handleUserChatMessage);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleUserChatMessage(); });

    // Instantiation verification baseline mapping
    if (GuruAgencyState.chatHistory.length > 0) {
        renderStoredSessionBubbles();
    } else {
        triggerConsultantGreeting(GuruAgencyState.clientName);
    }
}

function triggerConsultantGreeting(name) {
    const messagesArea = document.getElementById('chatMessages');
    messagesArea.innerHTML = ''; // reset buffer logic safely
    
    const greetingText = name 
        ? `Ah, welcome back ${name}. Let's design something exceptional today. What specific creative project area or media domain are we exploring?` 
        : `Welcome to Guru Studios. I am your algorithmic Design Director Consultant. To unlock optimal workflow contexts, please supply your name in the hero zone above, or tell me: what creative medium are you pursuing today?`;
        
    appendChatBubble('assistant', greetingText);
}

function appendChatBubble(role, systemMessage) {
    const container = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', role);
    bubble.textContent = systemMessage;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

    // Cache metrics locally
    if(role !== 'greeting_reset') {
        GuruAgencyState.chatHistory.push({ role, text: systemMessage });
        // Max limit safety tracking mapping array bounds
        if(GuruAgencyState.chatHistory.length > 20) GuruAgencyState.chatHistory.shift();
        localStorage.setItem('guru_chat_history', JSON.stringify(GuruAgencyState.chatHistory));
    }
}

function renderStoredSessionBubbles() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    GuruAgencyState.chatHistory.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', msg.role);
        bubble.textContent = msg.text;
        container.appendChild(bubble);
    });
    container.scrollTop = container.scrollHeight;
}

function handleUserChatMessage() {
    const field = document.getElementById('chatInput');
    const promptStr = field.value.trim();
    if (!promptStr) return;

    appendChatBubble('user', promptStr);
    field.value = '';

    // Direct automated execution simulation logic block
    setTimeout(() => {
        const resolutionResponse = generateAIIntentResolution(promptStr);
        appendChatBubble('assistant', resolutionResponse);
    }, 650);
}

// Intent Parsing Engine Logic Block (Deterministic client NLP Simulation Matrix)
function generateAIIntentResolution(prompt) {
    const cleanQuery = prompt.toLowerCase();
    const nameNode = GuruAgencyState.clientName ? `${GuruAgencyState.clientName}` : "my friend";

    // Intent Keyword Matcher Matrix Routing Core
    let selectionMatch = null;
    for (const service of ServiceMatrix) {
        const matchedTag = service.tags.some(tag => cleanQuery.includes(tag));
        if (matchedTag) {
            selectionMatch = service;
            break;
        }
    }

    if (selectionMatch) {
        return `Excellent inquiry, ${nameNode}. Regarding ${selectionMatch.token}: our baseline design parameters call for an estimated completion timeline of approximately ${selectionMatch.est}. Capital structure projections for this asset start from a mock range of ${selectionMatch.price}. Let's create something structural and amazing for you—simply hit the request option on the card to configure your target form brief parameters instantly!`;
    }

    // Generic Fallback Operational Routing Vectors
    if (cleanQuery.includes('price') || cleanQuery.includes('cost') || cleanQuery.includes('how much')) {
        return `Understood, ${nameNode}. Asset configurations differ across media domains. Design packages vary from $150 to $3500 depending on complexity metrics. Check our visual Capabilities section above for the comprehensive pricing registry matrix.`;
    }
    
    if (cleanQuery.includes('time') || cleanQuery.includes('fast') || cleanQuery.includes('duration')) {
        return `Timelines track linearly with structural scope elements, ${nameNode}. Standard iterations require 2 to 5 production cycles, while expansive enterprise branding matrices may command up to 14 standard calendar operational days.`;
    }

    return `Intriguing conceptual focus area, ${nameNode}. Guru Studios addresses Design vectors, Photography, and Invitations directly. Tell me more about the project context, or specify a medium like "Logo Design" or "Wedding Suites" so I can output technical metrics.`;
}
