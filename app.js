// State Matrix Initialization Engine
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    leadRegistry: JSON.parse(localStorage.getItem('guru_lead_registry')) || [],
    activeServiceArea: '',
    quizStage: 0, // State Trackers for Requirement 3 Quiz Handling
    // Content Customization Registry for Requirement 4
    customTitle: localStorage.getItem('admin_title') || 'Creative Designs <br>That <span class="text-gradient">Speak for You</span>',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Bespoke identity, premium photography, and luxury event media engineered for modern brands.'
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
    applyAdminContentOverrides();
    initializeOnboardingState();
    registerCoreEvents();
    renderPortfolioFilters();
    syncAdminDashboard();
    initAIConsultantUI();
});

// REQUIREMENT 4: Dynamic Override Setter
function applyAdminContentOverrides() {
    document.getElementById('adminEditableTitle').innerHTML = GuruAgencyState.customTitle;
    document.getElementById('adminEditableSubtitle').textContent = GuruAgencyState.customSubtitle;
}

// REQUIREMENT 1: Structural Gatekeeper Onboarding Verification Check
function initializeOnboardingState() {
    const gatekeeper = document.getElementById('gatekeeperOverlay');
    const mainApp = document.getElementById('mainApplicationLayout');
    const displayUser = document.getElementById('displayUserName');
    const formNameField = document.getElementById('formName');

    if (GuruAgencyState.clientName) {
        gatekeeper.classList.add('hidden');
        mainApp.classList.remove('hidden');
        displayUser.textContent = GuruAgencyState.clientName;
        formNameField.value = GuruAgencyState.clientName;
    } else {
        gatekeeper.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
}

// System Event Routers & Registration Loops
function registerCoreEvents() {
    // Requirements Onboarding Inputs
    document.getElementById('gatekeeperBtn').addEventListener('click', captureUserIdentity);
    document.getElementById('gatekeeperNameInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') captureUserIdentity(); });
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

    // REQUIREMENT 4: Open Admin Dashboard & Bind live text parameters
    document.getElementById('adminTriggerLink').addEventListener('click', () => {
        const passPrompt = prompt("Enter Administrative Access Authentication Key:");
        if (passPrompt === "admin") {
            document.getElementById('adminDashboard').classList.remove('hidden');
        } else {
            alert("Access Denied. Invalid Authorization Paradigm.");
        }
    });
    
    document.getElementById('closeAdminBtn').addEventListener('click', () => {
        document.getElementById('adminDashboard').classList.add('hidden');
    });

    document.getElementById('adminSaveChangeBtn').addEventListener('click', () => {
        const newTitle = document.getElementById('adminInputTitle').value.trim();
        const newSubtitle = document.getElementById('adminInputSubtitle').value.trim();
        
        if(newTitle) {
            GuruAgencyState.customTitle = newTitle;
            localStorage.setItem('admin_title', newTitle);
        }
        if(newSubtitle) {
            GuruAgencyState.customSubtitle = newSubtitle;
            localStorage.setItem('admin_subtitle', newSubtitle);
        }
        
        applyAdminContentOverrides();
        alert("Dynamic layouts saved and updated successfully.");
    });
}

function captureUserIdentity() {
    const inputVal = document.getElementById('gatekeeperNameInput').value.trim();
    if (!inputVal) {
        alert("A client naming credential string is mandatory.");
        return;
    }
    
    GuruAgencyState.clientName = inputVal;
    localStorage.setItem('guru_client_name', inputVal);
    initializeOnboardingState();
    
    // Auto trigger interface panel components to show engagement metrics
    setTimeout(() => {
        const trigger = document.getElementById('aiTrigger');
        const windowUI = document.getElementById('aiChatWindow');
        windowUI.classList.remove('hidden'); 
        trigger.classList.add('hidden');
        triggerConsultantGreeting(inputVal);
    }, 400);
}

function clearUserIdentity() {
    localStorage.removeItem('guru_client_name');
    GuruAgencyState.clientName = '';
    GuruAgencyState.quizStage = 0;
    document.getElementById('gatekeeperNameInput').value = '';
    document.getElementById('formName').value = '';
    initializeOnboardingState();
}

function routeRequestToForm(serviceName) {
    const selector = document.getElementById('formService');
    selector.value = serviceName;
    
    const element = document.getElementById('contact');
    element.scrollIntoView({ behavior: 'smooth' });
    
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

    triggerConsultantGreeting(GuruAgencyState.clientName);
}

// REQUIREMENT 2: Explicit Greeting Pattern Injection
function triggerConsultantGreeting(name) {
    const messagesArea = document.getElementById('chatMessages');
    messagesArea.innerHTML = ''; 
    
    const greetingText = `Hello, welcome to Guru Studios, ${name || 'Explorer'}! I have initiated your onboarding track. Let's verify your architectural project readiness right away.`;
    appendChatBubble('assistant', greetingText);

    // REQUIREMENT 3: Start the understanding quiz instantly
    setTimeout(() => {
        appendChatBubble('assistant', "🤖 UNDERSTANDING QUIZ - QUESTION 1: Based on our matrix capabilities section, what are our three core media pillars?");
        GuruAgencyState.quizStage = 1;
    }, 1000);
}

function appendChatBubble(role, systemMessage) {
    const container = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', role);
    bubble.textContent = systemMessage;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function handleUserChatMessage() {
    const field = document.getElementById('chatInput');
    const promptStr = field.value.trim();
    if (!promptStr) return;

    appendChatBubble('user', promptStr);
    field.value = '';

    setTimeout(() => {
        const resolutionResponse = generateAIIntentResolution(promptStr);
        appendChatBubble('assistant', resolutionResponse);
    }, 650);
}

// REQUIREMENT 3: State-based sequential assessment engine logic
function generateAIIntentResolution(prompt) {
    const cleanQuery = prompt.toLowerCase();
    
    // Quiz Pipeline Stage 1
    if (GuruAgencyState.quizStage === 1) {
        if (cleanQuery.includes('design') && cleanQuery.includes('photography') && (cleanQuery.includes('invitation') || cleanQuery.includes('card'))) {
            GuruAgencyState.quizStage = 2;
            return "Spot on! Brilliant structure logic. Now for your final validation checkpoint: QUESTION 2: Who explicitly powers the underlying layout framework of Guru Studios as stated down in our footer brand guidelines?";
        } else {
            return "Not quite right. Hint: Take a look at the headers in our 'Creative Matrix' section above and name all three fields together.";
        }
    }

    // Quiz Pipeline Stage 2
    if (GuruAgencyState.quizStage === 2) {
        if (cleanQuery.includes('shadow studios') || cleanQuery.includes('shadow')) {
            GuruAgencyState.quizStage = 3; // Passed and completed
            return "Excellent! You scored 100% on your platform integration assessment. You have fully unlocked automated search context vectors! Ask me anything about our specific project deliverables or timelines.";
        } else {
            return "Incorrect signature check. Hint: Look at the very bottom right line in our global site layout footer.";
        }
    }

    // Standard Client NLP Fallback Routing Configuration Matrix
    const nameNode = GuruAgencyState.clientName ? `${GuruAgencyState.clientName}` : "my friend";
    let selectionMatch = null;
    for (const service of ServiceMatrix) {
        const matchedTag = service.tags.some(tag => cleanQuery.includes(tag));
        if (matchedTag) {
            selectionMatch = service;
            break;
        }
    }

    if (selectionMatch) {
        return `Excellent inquiry, ${nameNode}. Regarding ${selectionMatch.token}: our baseline parameters call for an estimated completion timeline of approximately ${selectionMatch.est}. Capital structure metrics begin from a mock range of ${selectionMatch.price}. Hit 'Request Package' to capture your targets instantly.`;
    }

    if (cleanQuery.includes('price') || cleanQuery.includes('cost') || cleanQuery.includes('how much')) {
        return `Asset configurations differ, ${nameNode}. Design and media packages scale from $150 upward depending on matrix complexity parameters. Check our Capabilities system grid for standard details.`;
    }

    return `Intriguing target sector conceptualization, ${nameNode}. Guru Studios handles Design vectors, Photography, and Invitations. Specify a specialized structural focus area like "Logo Design" or "Wedding Suites" to see timeline matrices.`;
}
