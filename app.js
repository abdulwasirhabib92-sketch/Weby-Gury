// State Matrix Initialization Engine
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    leadRegistry: JSON.parse(localStorage.getItem('guru_lead_registry')) || [],
    activeServiceArea: '',
    
    // Front Page Content Customization Assets (Requirement 4 Configuration Matrices)
    customTitle: localStorage.getItem('admin_title') || 'Creative Designs <br>That <span class="text-gradient">Speak for You</span>',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Bespoke identity, premium photography, and luxury event media engineered for modern brands.',
    customLogoText: localStorage.getItem('admin_logo_text') || 'GURU',
    customImageUrl: localStorage.getItem('admin_image_url') || '',
    
    // Media Carousel Tracking Vectors
    carouselIndexes: { design: 0, photography: 0, invitations: 0 }
};

// PRODUCTION IMAGE POOLS: Curated real-world high-fidelity production samples
const ProductionImagePool = {
    design: [
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80", // Graphic Studio Studio Layout
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", // Geometric Branding Framework
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80"  // Modern Figma Prototyping
    ],
    photography: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80", // Premium DSLR Camera Lenses
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80", // Studio Flash Shoot Lighting
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"  // Premium Retail Commercial Product Shoot
    ],
    invitations: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", // Luxury Ribbon Ribbon Stationery
        "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80", // Elegant Floral Greeting Cards
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"  // High-End Corporate Gala Invitation Prints
    ]
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

document.addEventListener('DOMContentLoaded', () => {
    applyAdminContentOverrides();
    initializeOnboardingState();
    registerCoreEvents();
    renderPortfolioFilters();
    initAIConsultantUI();
    startAutomatedCarousels();
});

function applyAdminContentOverrides() {
    const titleEl = document.getElementById('adminEditableTitle');
    const subtitleEl = document.getElementById('adminEditableSubtitle');
    const logoEl = document.getElementById('mainBrandLogo');
    const targetPortfolioItem = document.getElementById('dynamicPortfolioItem1');

    if(titleEl) titleEl.innerHTML = GuruAgencyState.customTitle;
    if(subtitleEl) subtitleEl.textContent = GuruAgencyState.customSubtitle;
    if(logoEl) logoEl.innerHTML = `${GuruAgencyState.customLogoText}<span>STUDIOS</span>`;
    
    // Dynamic override logic via uploaded file values
    if(targetPortfolioItem && GuruAgencyState.customImageUrl) {
        targetPortfolioItem.style.backgroundImage = `url('${GuruAgencyState.customImageUrl}')`;
        targetPortfolioItem.style.opacity = "0.9"; 
    }
}

// MULTI-STAGE SPLASH SCREEN REGULATION (Quiz is integrated directly on the gatekeeper)
function initializeOnboardingState() {
    const gatekeeper = document.getElementById('gatekeeperOverlay');
    const mainApp = document.getElementById('mainApplicationLayout');
    const identityCard = document.getElementById('gatekeeperIdentityStep');
    const quizCard = document.getElementById('gatekeeperQuizStep');
    const displayUser = document.getElementById('displayUserName');

    if (!gatekeeper || !mainApp) return;

    if (GuruAgencyState.clientName) {
        gatekeeper.classList.add('hidden');
        mainApp.classList.remove('hidden');
        if(displayUser) displayUser.textContent = GuruAgencyState.clientName;
    } else {
        gatekeeper.classList.remove('hidden');
        mainApp.classList.add('hidden');
        identityCard.classList.remove('hidden');
        quizCard.classList.add('hidden');
    }
}

function registerCoreEvents() {
    const gatekeeperNextBtn = document.getElementById('gatekeeperNextBtn');
    const gatekeeperNameInput = document.getElementById('gatekeeperNameInput');
    const gatekeeperSubmitQuizBtn = document.getElementById('gatekeeperSubmitQuizBtn');
    const gatekeeperQuizInput = document.getElementById('gatekeeperQuizInput');
    const resetNameBtn = document.getElementById('resetNameBtn');
    const adminTrigger = document.getElementById('adminTriggerLink');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminSaveBtn = document.getElementById('adminSaveChangeBtn');
    const localFilePicker = document.getElementById('adminLocalFilePicker');

    if(gatekeeperNextBtn) gatekeeperNextBtn.addEventListener('click', proceedToOnboardingQuiz);
    if(gatekeeperNameInput) {
        gatekeeperNameInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') proceedToOnboardingQuiz(); });
    }
    
    if(gatekeeperSubmitQuizBtn) gatekeeperSubmitQuizBtn.addEventListener('click', finalizeOnboardingQuiz);
    if(gatekeeperQuizInput) {
        gatekeeperQuizInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') finalizeOnboardingQuiz(); });
    }

    if(resetNameBtn) resetNameBtn.addEventListener('click', clearUserIdentity);

    // DIRECT HARDWARE DEVICE STORAGE FILE INPUT UPLOADER READ RULES
    if(localFilePicker) {
        localFilePicker.addEventListener('change', (e) => {
            const uploadedFile = e.target.files[0];
            if(uploadedFile) {
                const binaryReader = new FileReader();
                binaryReader.onload = function(eventResult) {
                    const rawBase64Url = eventResult.target.result;
                    GuruAgencyState.customImageUrl = rawBase64Url;
                    localStorage.setItem('admin_image_url', rawBase64Url);
                };
                binaryReader.readAsDataURL(uploadedFile);
            }
        });
    }

    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selector = document.getElementById('formService');
            if(selector) selector.value = e.target.getAttribute('data-service-name');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });

    if(adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            if (prompt("Enter Administrative Access Authentication Key:") === "admin") {
                document.getElementById('adminDashboard').classList.remove('hidden');
            } else {
                alert("Access Denied.");
            }
        });
    }
    
    if(closeAdminBtn) closeAdminBtn.addEventListener('click', () => { document.getElementById('adminDashboard').classList.add('hidden'); });

    if(adminSaveBtn) {
        adminSaveBtn.addEventListener('click', () => {
            const newTitle = document.getElementById('adminInputTitle').value.trim();
            const newSubtitle = document.getElementById('adminInputSubtitle').value.trim();
            const newLogoText = document.getElementById('adminInputLogoText').value.trim();
            
            if(newTitle) { GuruAgencyState.customTitle = newTitle; localStorage.setItem('admin_title', newTitle); }
            if(newSubtitle) { GuruAgencyState.customSubtitle = newSubtitle; localStorage.setItem('admin_subtitle', newSubtitle); }
            if(newLogoText) { GuruAgencyState.customLogoText = newLogoText; localStorage.setItem('admin_logo_text', newLogoText); }
            
            applyAdminContentOverrides();
            alert("Dynamic parameters applied successfully to active viewports!");
        });
    }
}

// Next Step: Advance name entry to the integrated single-question landing quiz
function proceedToOnboardingQuiz() {
    const inputVal = document.getElementById('gatekeeperNameInput').value.trim();
    if (!inputVal) {
        alert("Please provide your authorization name string to move forward.");
        return;
    }
    GuruAgencyState.clientName = inputVal;
    
    document.getElementById('gatekeeperIdentityStep').classList.add('hidden');
    document.getElementById('quizGreetingName').textContent = inputVal;
    document.getElementById('gatekeeperQuizStep').classList.remove('hidden');
    document.getElementById('gatekeeperQuizInput').focus();
}

// Final Step: Evaluate the single question directly on the splash screen card, then destroy overlay
function finalizeOnboardingQuiz() {
    const quizResponse = document.getElementById('gatekeeperQuizInput').value.trim();
    if(!quizResponse) {
        alert("Please supply an operational answer regarding your interpretation of our core business capabilities.");
        return;
    }
    
    const cleanQuery = quizResponse.toLowerCase();
    if(cleanQuery.includes('design') || cleanQuery.includes('photo') || cleanQuery.includes('invite') || cleanQuery.includes('brand') || cleanQuery.includes('creative')) {
        alert(`Excellent estimation, ${GuruAgencyState.clientName}! That is entirely correct. We supply creative identity graphics, high-end photography sessions, and custom luxury invitation cards. Welcome to your layout workspace!`);
    } else {
        alert(`Interesting thoughts, ${GuruAgencyState.clientName}! To clarify, our agency focuses on vector brand design packages, premium photo coverages, and social invitation suites. Step inside to evaluate our work!`);
    }
    
    localStorage.setItem('guru_client_name', GuruAgencyState.clientName);
    initializeOnboardingState();
}

function clearUserIdentity() {
    localStorage.removeItem('guru_client_name');
    GuruAgencyState.clientName = '';
    document.getElementById('gatekeeperNameInput').value = '';
    document.getElementById('gatekeeperQuizInput').value = '';
    initializeOnboardingState();
}

// AUTOMATED TIMED PRODUCTION CAROUSELS: Smoothly rotates authentic images every 3 seconds
function startAutomatedCarousels() {
    const portfolioGridItems = document.querySelectorAll('.portfolio-item');
    
    // Set initial background image states from our image matrix pools instantly
    portfolioGridItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if(category && ProductionImagePool[category]) {
            const displayLayer = item.querySelector('.portfolio-display');
            if (displayLayer && !(displayLayer.id === 'dynamicPortfolioItem1' && GuruAgencyState.customImageUrl)) {
                displayLayer.style.backgroundImage = `url('${ProductionImagePool[category][0]}')`;
            }
        }
    });

    // Fire the automatic interval loops
    setInterval(() => {
        portfolioGridItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if(!category || !ProductionImagePool[category]) return;
            
            // Respect administrative priorities: avoid overriding item 1 if a manual upload exists
            if (item.querySelector('#dynamicPortfolioItem1') && GuruAgencyState.customImageUrl) return;

            const currentPool = ProductionImagePool[category];
            let targetIdx = GuruAgencyState.carouselIndexes[category];
            
            targetIdx = (targetIdx + 1) % currentPool.length;
            GuruAgencyState.carouselIndexes[category] = targetIdx;
            
            const elementDisplay = item.querySelector('.portfolio-display');
            if(elementDisplay) {
                elementDisplay.style.backgroundImage = `url('${currentPool[targetIdx]}')`;
            }
        });
    }, 3000);
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

// AI CONTEXT WIDGET: Purpose-built entirely to answer inquiries regarding core operations
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

    const messagesArea = document.getElementById('chatMessages');
    if(messagesArea) {
        messagesArea.innerHTML = '';
        appendChatBubble('assistant', `Hello there, welcome to Guru Studios workflow information center! I am fully synchronized to detail our design capabilities, photography packages, timelines, and execution parameters. Ask me any business question.`);
    }
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
        let selectionMatch = null;

        for (const service of ServiceMatrix) {
            if (service.tags.some(tag => cleanQuery.includes(tag))) {
                selectionMatch = service;
                break;
            }
        }

        if (selectionMatch) {
            feedbackResponse = `Regarding our specific ${selectionMatch.token} solutions: our typical delivery cycles average around ${selectionMatch.est}, with a professional investment cost tier starting at ${selectionMatch.price}. Click "Request Package" on the cards to auto-fill this area inside your brief!`;
        } else if (cleanQuery.includes('design') || cleanQuery.includes('graphic') || cleanQuery.includes('ui')) {
            feedbackResponse = "Our creative design wing engineers custom corporate vectors, custom brand logo identities ($300-$700), high-end posters ($150-$400), complex corporate branding manuals, and interactive Figma UI/UX digital interface assets.";
        } else if (cleanQuery.includes('photo') || cleanQuery.includes('shoot') || cleanQuery.includes('camera')) {
            feedbackResponse = "Our studio photography suites deliver professional event media capture coverage ($150/hr), premium headshot/portrait portfolios ($250-$600), and crisp e-commerce product visual mockups ($400-$1500).";
        } else if (cleanQuery.includes('invite') || cleanQuery.includes('card') || cleanQuery.includes('wedding')) {
            feedbackResponse = "We design premium social and corporate event materials, including complete luxury wedding suites ($200-$800), custom typography birthday invitations, and brand-aligned corporate event gala assets.";
        } else if (cleanQuery.includes('price') || cleanQuery.includes('cost') || cleanQuery.includes('expensive') || cleanQuery.includes('fee')) {
            feedbackResponse = "Our multi-disciplinary production packages operate on transparent fixed pricing. Basic custom invitations/posters begin from $75-$150, premium photoshoots range between $250-$1200, and comprehensive organizational branding guidelines settle up to $3,500+ depending on scope parameters.";
        } else {
            feedbackResponse = "Guru Studios is a premium design and content synthesis workspace offering brand layout engineering, studio photography shoots, and celebration print suites. Ask me any question about our services or pricing scales!";
        }

        appendChatBubble('assistant', feedbackResponse);
    }, 600);
}
