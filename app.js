// State Matrix Initialization Engine
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    leadRegistry: JSON.parse(localStorage.getItem('guru_lead_registry')) || [],
    activeServiceArea: '',
    chatHistory: JSON.parse(localStorage.getItem('guru_chat_history')) || [],
    
    // Front Page Content Customization Assets (Requirement 4 Configuration Matrices)
    customTitle: localStorage.getItem('admin_title') || 'Creative Designs <br>That <span class="text-gradient">Speak for You</span>',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Bespoke identity, premium photography, and luxury event media engineered for modern brands.',
    customLogoText: localStorage.getItem('admin_logo_text') || 'GURU',
    customImageUrl: localStorage.getItem('admin_image_url') || ''
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
    initAIConsultantUI();
});

// REQUIREMENT 4: Apply Live Copy Changes & Image Additions
function applyAdminContentOverrides() {
    const titleEl = document.getElementById('adminEditableTitle');
    const subtitleEl = document.getElementById('adminEditableSubtitle');
    const logoEl = document.getElementById('mainBrandLogo');
    const targetPortfolioItem = document.getElementById('dynamicPortfolioItem1');

    if(titleEl) titleEl.innerHTML = GuruAgencyState.customTitle;
    if(subtitleEl) subtitleEl.textContent = GuruAgencyState.customSubtitle;
    if(logoEl) logoEl.innerHTML = `${GuruAgencyState.customLogoText}<span>STUDIOS</span>`;
    
    // Dynamic background image/logo updates hook
    if(targetPortfolioItem && GuruAgencyState.customImageUrl) {
        targetPortfolioItem.style.backgroundImage = `url('${GuruAgencyState.customImageUrl}')`;
        targetPortfolioItem.style.opacity = "0.75"; 
    }
}

// REQUIREMENT 1: Structural Onboarding Full-Screen Gatekeeper Layer
function initializeOnboardingState() {
    const gatekeeper = document.getElementById('gatekeeperOverlay');
    const mainApp = document.getElementById('mainApplicationLayout');
    const displayUser = document.getElementById('displayUserName');
    const formNameField = document.getElementById('formName');

    if (!gatekeeper || !mainApp) return;

    if (GuruAgencyState.clientName) {
        gatekeeper.classList.add('hidden');
        mainApp.classList.remove('hidden');
        if(displayUser) displayUser.textContent = GuruAgencyState.clientName;
        if(formNameField) formNameField.value = GuruAgencyState.clientName;
    } else {
        gatekeeper.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
}

// Event Routers
function registerCoreEvents() {
    const gatekeeperBtn = document.getElementById('gatekeeperBtn');
    const gatekeeperInput = document.getElementById('gatekeeperNameInput');
    const resetNameBtn = document.getElementById('resetNameBtn');
    const adminTrigger = document.getElementById('adminTriggerLink');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminSaveBtn = document.getElementById('adminSaveChangeBtn');

    if(gatekeeperBtn) gatekeeperBtn.addEventListener('click', captureUserIdentity);
    if(gatekeeperInput) {
        gatekeeperInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') captureUserIdentity(); });
    }
    if(resetNameBtn) resetNameBtn.addEventListener('click', clearUserIdentity);

    // Context card request selectors routing loop
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const desiredService = e.target.getAttribute('data-service-name');
            const selector = document.getElementById('formService');
            if(selector) selector.value = desiredService;
            
            const contactSection = document.getElementById('contact');
            if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Intake Submission Form Interlock
    const leadForm = document.getElementById('leadForm');
    if(leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Brief logged successfully, ${GuruAgencyState.clientName}! Our production managers are looking over the pipeline assets.`);
            leadForm.reset();
            initializeOnboardingState();
        });
    }

    // REQUIREMENT 4: Dynamic Admin Dashboard Authentication Gatekeeper Key Check
    if(adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            const tokenCheck = prompt("Enter Administrative Access Authentication Key:");
            if (tokenCheck === "admin") {
                const dashboard = document.getElementById('adminDashboard');
                if(dashboard) dashboard.classList.remove('hidden');
            } else {
                alert("Access Denied. Invalid Authorization Paradigm Code.");
            }
        });
    }
    
    if(closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            const dashboard = document.getElementById('adminDashboard');
            if(dashboard) dashboard.classList.add('hidden');
        });
    }

    if(adminSaveBtn) {
        adminSaveBtn.addEventListener('click', () => {
            const newTitle = document.getElementById('adminInputTitle').value.trim();
            const newSubtitle = document.getElementById('adminInputSubtitle').value.trim();
            const newLogoText = document.getElementById('adminInputLogoText').value.trim();
            const newImgUrl = document.getElementById('adminInputImageUrl').value.trim();
            
            if(newTitle) { GuruAgencyState.customTitle = newTitle; localStorage.setItem('admin_title', newTitle); }
            if(newSubtitle) { GuruAgencyState.customSubtitle = newSubtitle; localStorage.setItem('admin_subtitle', newSubtitle); }
            if(newLogoText) { GuruAgencyState.customLogoText = newLogoText; localStorage.setItem('admin_logo_text', newLogoText); }
            if(newImgUrl) { GuruAgencyState.customImageUrl = newImgUrl; localStorage.setItem('admin_image_url', newImgUrl); }
            
            applyAdminContentOverrides();
            alert("Dynamic parameters applied successfully to active layout viewports!");
        });
    }
}

function captureUserIdentity() {
    const inputField = document.getElementById('gatekeeperNameInput');
    if(!inputField) return;

    const inputVal = inputField.value.trim();
    if (!inputVal) {
        alert("Please enter a valid username string to enter the layout.");
        return;
    }
    
    GuruAgencyState.clientName = inputVal;
    localStorage.setItem('guru_client_name', inputVal);
    initializeOnboardingState();
    
    // Automatically trigger and display the creative chatbot consultant layout
    setTimeout(() => {
        const trigger = document.getElementById('aiTrigger');
        const windowUI = document.getElementById('aiChatWindow');
        if(windowUI) windowUI.classList.remove('hidden'); 
        if(trigger) trigger.classList.add('hidden');
        triggerConsultantGreeting(inputVal);
    }, 400);
}

function clearUserIdentity() {
    localStorage.removeItem('guru_client_name');
    GuruAgencyState.clientName = '';
    const gatekeeperInput = document.getElementById('gatekeeperNameInput');
    if(gatekeeperInput) gatekeeperInput.value = '';
    initializeOnboardingState();
}

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
}

// AI Consulting Conversation Subsystem
function initAIConsultantUI() {
    const trigger = document.getElementById('aiTrigger');
    const windowUI = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiClose');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');

    if(trigger && windowUI && closeBtn && sendBtn && input) {
        trigger.addEventListener('click', () => { windowUI.classList.remove('hidden'); trigger.classList.add('hidden'); });
        closeBtn.addEventListener('click', () => { windowUI.classList.add('hidden'); trigger.classList.remove('hidden'); });
        
        sendBtn.addEventListener('click', handleUserChatMessage);
        input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleUserChatMessage(); });
    }
    triggerConsultantGreeting(GuruAgencyState.clientName);
}

// REQUIREMENT 2: Personal Greeting Dynamic Setup
function triggerConsultantGreeting(name) {
    const messagesArea = document.getElementById('chatMessages');
    if(!messagesArea) return;
    messagesArea.innerHTML = ''; 
    
    const greetingText = `Hello, welcome to Guru Studios, ${name || 'Explorer'}!`;
    appendChatBubble('assistant', greetingText);

    // REQUIREMENT 3: Immediate Simple Interactive Knowledge Question
    setTimeout(() => {
        appendChatBubble('assistant', "🤖 QUICK CHECK: To unlock optimal media workflow contexts, tell me in your own words: what do you think this website does?");
    }, 1000);
}

function appendChatBubble(role, systemMessage) {
    const container = document.getElementById('chatMessages');
    if(!container) return;
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', role);
    bubble.textContent = systemMessage;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function handleUserChatMessage() {
    const field = document.getElementById('chatInput');
    if(!field) return;
    const promptStr = field.value.trim();
    if (!promptStr) return;

    appendChatBubble('user', promptStr);
    field.value = '';

    setTimeout(() => {
        const cleanQuery = promptStr.toLowerCase();
        let feedbackResponse = "";

        // REQUIREMENT 3: Check understanding for core workspace design keywords
        if (cleanQuery.includes('design') || cleanQuery.includes('photo') || cleanQuery.includes('invite') || cleanQuery.includes('brand') || cleanQuery.includes('creative')) {
            feedbackResponse = "Spot on! Exceptional understanding. We provide bespoke vector brand identity engineering, premium studio photography coverage, and tailored social or executive celebration suite invitations. Tell me about your strategic milestones context layout!";
        } else {
            feedbackResponse = "Interesting look at it! To clarify, Guru Studios primarily builds premium brand identity vector assets, digital device UI/UX interface systems, editorial photography shoots, and bespoke print invitations. Let me know what operational domains you are exploring today!";
        }

        appendChatBubble('assistant', feedbackResponse);
    }, 650);
}
