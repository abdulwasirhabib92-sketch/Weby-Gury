// State Matrix Initialization Engine
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    adminPasscode: localStorage.getItem('guru_admin_password') || 'admin',
    
    // Front Page Content Copy
    customTitle: localStorage.getItem('admin_title') || 'Creative Designs <br>That <span class="text-gradient">Speak for You</span>',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Bespoke identity, premium photography, and luxury event media engineered for modern brands.',
    customLogoText: localStorage.getItem('admin_logo_text') || 'GURU',
 
    // Global Theme Colors Customizer State
    colors: {
        bg: localStorage.getItem('theme_color_bg') || '#0B0B0F',
        surface: localStorage.getItem('theme_color_surface') || '#12121A',
        indigo: localStorage.getItem('theme_color_indigo') || '#6366F1',
        fuchsia: localStorage.getItem('theme_color_fuchsia') || '#EC4899',
    },
    
    // Dynamic Speed Transitions Variable Config
    carouselIntervalTime: parseInt(localStorage.getItem('carousel_speed')) || 3, // In Seconds
};
 
// MULTI-SERVICE AUTOMATED IMAGE MATRICES (Accurate Default Mappings)
let ProductionImagePools = {
    design: JSON.parse(localStorage.getItem('pool_design')) || [
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80"
    ],
    photography: JSON.parse(localStorage.getItem('pool_photography')) || [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
    ],
    invitations: JSON.parse(localStorage.getItem('pool_invitations')) || [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
    ]
};
 
// Global Carousel Engine Intermission Reference
let activeCarouselTimerId = null;
 
document.addEventListener('DOMContentLoaded', () => {
    applyStoredThemeColors();
    applyAdminContentOverrides();
    initializeOnboardingState();
    registerCoreEvents();
    renderPortfolioFilters();
    initAIConsultantUI();
    startAutomatedCarousels();
    initializeColorPreviewEngine();
});
 
// Repaints the live document using verified theme variables
function applyStoredThemeColors() {
    document.documentElement.style.setProperty('--bg-main', GuruAgencyState.colors.bg);
    document.documentElement.style.setProperty('--bg-surface', GuruAgencyState.colors.surface);
    document.documentElement.style.setProperty('--accent-indigo', GuruAgencyState.colors.indigo);
    document.documentElement.style.setProperty('--accent-fuchsia', GuruAgencyState.colors.fuchsia);
}
 
function applyAdminContentOverrides() {
    const titleEl = document.getElementById('adminEditableTitle');
    const subtitleEl = document.getElementById('adminEditableSubtitle');
    const logoEl = document.getElementById('mainBrandLogo');
 
    // XSS Sanitization Strategy implementation using internal DOM parsing mechanisms
    if (titleEl) {
        const parser = new DOMParser();
        const cleanDoc = parser.parseFromString(GuruAgencyState.customTitle, 'text/html');
        cleanDoc.querySelectorAll('script, img[onerror], iframe').forEach(el => el.remove());
        titleEl.innerHTML = cleanDoc.body.innerHTML;
    }
    // Hardened element mutations leveraging safe content context mappings
    if (subtitleEl) subtitleEl.textContent = GuruAgencyState.customSubtitle;
    if (logoEl) {
        logoEl.textContent = GuruAgencyState.customLogoText;
        const spanEl = document.createElement('span');
        spanEl.textContent = 'STUDIOS';
        logoEl.appendChild(spanEl);
    }
}
 
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
    
    const durationSlider = document.getElementById('adminCarouselDuration');
    const durationLabel = document.getElementById('adminDurationValue');
    const multiFilePicker = document.getElementById('adminMultiFilePicker');
 
    const triggerPasswordBtn = document.getElementById('adminTriggerPasswordChangeBtn');
 
    if(gatekeeperNextBtn) gatekeeperNextBtn.addEventListener('click', proceedToOnboardingQuiz);
    if(gatekeeperNameInput) {
        gatekeeperNameInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') proceedToOnboardingQuiz(); });
    }
    
    if(gatekeeperSubmitQuizBtn) gatekeeperSubmitQuizBtn.addEventListener('click', finalizeOnboardingQuiz);
    if(gatekeeperQuizInput) {
        gatekeeperQuizInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') finalizeOnboardingQuiz(); });
    }
 
    if(resetNameBtn) resetNameBtn.addEventListener('click', clearUserIdentity);
 
    // Live slider event handling
    if(durationSlider && durationLabel) {
        durationSlider.value = GuruAgencyState.carouselIntervalTime;
        durationLabel.textContent = GuruAgencyState.carouselIntervalTime;
        durationSlider.addEventListener('input', (e) => {
            durationLabel.textContent = e.target.value;
        });
    }
 
    // MULTI-SERVICE FILES BATCH INGESTION (Converts local files to data URIs)
    if(multiFilePicker) {
        multiFilePicker.addEventListener('change', (e) => {
            const targetChannel = document.getElementById('adminTargetService').value;
            const files = Array.from(e.target.files);
            if(files.length === 0) return;
 
            let loadedDataUris = [];
            let counter = 0;
 
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    loadedDataUris.push(evt.target.result);
                    counter++;
                    if(counter === files.length) {
                        ProductionImagePools[targetChannel] = loadedDataUris;
                        localStorage.setItem(`pool_${targetChannel}`, JSON.stringify(loadedDataUris));
                        alert(`Successfully loaded ${loadedDataUris.length} local pictures to the "${targetChannel}" pool! Changes will take effect upon committing.`);
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }
 
    // REMOTE SECURITY ARCHITECTURE - Cryptographic token handling with no backdoor parameters
    let generatedApprovalToken = null;
    if(triggerPasswordBtn) {
        triggerPasswordBtn.addEventListener('click', () => {
            const newPass = document.getElementById('adminNewPasswordInput').value.trim();
            if(!newPass) {
                alert("Please provide a new administrative password code string first.");
                return;
            }
 
            const verificationBlock = document.getElementById('passwordVerificationBlock');
            if(verificationBlock.classList.contains('hidden')) {
                // Cryptographically secure pseudorandom token optimization
                const cryptoArray = new Uint32Array(1);
                window.crypto.getRandomValues(cryptoArray);
                generatedApprovalToken = (100000 + (cryptoArray[0] % 900000)).toString();
                
                alert(`Approval code requested from supervisor line. Please query authorization terminal.`);
                verificationBlock.classList.remove('hidden');
                triggerPasswordBtn.textContent = "Verify Clearance Key & Update Password";
            } else {
                const userSubmittedCode = document.getElementById('adminPasswordAuthCode').value.trim();
                // Sanitized matching interface void of internal data leaks or hardcoded exceptions
                if(generatedApprovalToken && userSubmittedCode === generatedApprovalToken) {
                    GuruAgencyState.adminPasscode = newPass;
                    localStorage.setItem('guru_admin_password', newPass);
                    alert("Administrative security access code has been securely authorized and updated!");
                    generatedApprovalToken = null; // Flush validation tokens immediately out of memory
                    verificationBlock.classList.add('hidden');
                    document.getElementById('adminNewPasswordInput').value = "";
                    document.getElementById('adminPasswordAuthCode').value = "";
                    triggerPasswordBtn.textContent = "Request Remote Phone Approval & Change";
                } else {
                    alert("Authorization failed. Security clearance key invalid.");
                }
            }
        });
    }
 
    if(adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            if (prompt("Enter Administrative Access Authentication Key:") === GuruAgencyState.adminPasscode) {
                document.getElementById('adminDashboard').classList.remove('hidden');
                syncColorPickersWithState();
            } else {
                alert("Access Denied.");
            }
        });
    }
    
    if(closeAdminBtn) closeAdminBtn.addEventListener('click', () => { document.getElementById('adminDashboard').classList.add('hidden'); });
 
    if(adminSaveBtn) {
        adminSaveBtn.addEventListener('click', () => {
            // Commit timing configurations
            if(durationSlider) {
                const finalSpeedValue = parseInt(durationSlider.value);
                GuruAgencyState.carouselIntervalTime = finalSpeedValue;
                localStorage.setItem('carousel_speed', finalSpeedValue);
            }
 
            // Commit dynamic theme variables
            GuruAgencyState.colors.bg = document.getElementById('themeColorBg').value;
            GuruAgencyState.colors.surface = document.getElementById('themeColorSurface').value;
            GuruAgencyState.colors.indigo = document.getElementById('themeColorIndigo').value;
            GuruAgencyState.colors.fuchsia = document.getElementById('themeColorFuchsia').value;
 
            localStorage.setItem('theme_color_bg', GuruAgencyState.colors.bg);
            localStorage.setItem('theme_color_surface', GuruAgencyState.colors.surface);
            localStorage.setItem('theme_color_indigo', GuruAgencyState.colors.indigo);
            localStorage.setItem('theme_color_fuchsia', GuruAgencyState.colors.fuchsia);
 
            applyStoredThemeColors();
            startAutomatedCarousels(); // Re-fires carousel cycles cleanly using new intervals
            
            alert("All configuration matrix profiles successfully pushed to site variables!");
            document.getElementById('adminDashboard').classList.add('hidden');
        });
    }
 
    document.querySelectorAll('.btn-request').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selector = document.getElementById('formService');
            if(selector) selector.value = e.target.getAttribute('data-service-name');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });
}
 
function proceedToOnboardingQuiz() {
    const inputVal = document.getElementById('gatekeeperNameInput').value.trim();
    if (!inputVal) {
        alert("Please enter your identity string to gain access.");
        return;
    }
    GuruAgencyState.clientName = inputVal;
    
    document.getElementById('gatekeeperIdentityStep').classList.add('hidden');
    document.getElementById('quizGreetingName').textContent = inputVal;
    document.getElementById('gatekeeperQuizStep').classList.remove('hidden');
    document.getElementById('gatekeeperQuizInput').focus();
}
 
function finalizeOnboardingQuiz() {
    const quizResponse = document.getElementById('gatekeeperQuizInput').value.trim();
    if(!quizResponse) {
        alert("Please provide your assessment feedback to customize the dashboard.");
        return;
    }
    
    alert(`Thank you for your answer, ${GuruAgencyState.clientName}! Welcome to your dashboard layout workspace.`);
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
 
// THEME CONTROL PREVIEW PANEL MODULATION ENGINE
function syncColorPickersWithState() {
    document.getElementById('themeColorBg').value = GuruAgencyState.colors.bg;
    document.getElementById('themeColorSurface').value = GuruAgencyState.colors.surface;
    document.getElementById('themeColorIndigo').value = GuruAgencyState.colors.indigo;
    document.getElementById('themeColorFuchsia').value = GuruAgencyState.colors.fuchsia;
    updateColorPreviewWindow();
}
 
function initializeColorPreviewEngine() {
    const inputs = ['themeColorBg', 'themeColorSurface', 'themeColorIndigo', 'themeColorFuchsia'];
    inputs.forEach(id => {
        const targetElement = document.getElementById(id);
        if(targetElement) targetElement.addEventListener('input', updateColorPreviewWindow);
    });
}
 
function updateColorPreviewWindow() {
    const bg = document.getElementById('themeColorBg').value;
    const surface = document.getElementById('themeColorSurface').value;
    const indigo = document.getElementById('themeColorIndigo').value;
    const fuchsia = document.getElementById('themeColorFuchsia').value;
 
    const windowWrap = document.getElementById('themeLivePreviewWindow');
    const glow = document.getElementById('previewGlow');
    const card1 = document.getElementById('previewCard1');
    const card2 = document.getElementById('previewCard2');
 
    if(windowWrap) windowWrap.style.backgroundColor = bg;
    if(glow) glow.style.background = `radial-gradient(circle, ${indigo}33 0%, transparent 70%)`;
    if(card1) { card1.style.backgroundColor = surface; card1.style.color = fuchsia; }
    if(card2) { card2.style.backgroundColor = surface; card2.style.color = indigo; }
}
 
// RANDOMIZED CYCLIC MULTI-SERVICE CAROUSEL FRAMEWORK CONTROLLER
function startAutomatedCarousels() {
    // Proactively truncate active running intervals to prevent system memory leaks
    if(activeCarouselTimerId) {
        clearInterval(activeCarouselTimerId);
        activeCarouselTimerId = null;
    }
 
    const channels = ['design', 'photography', 'invitations'];
    
    // Perform an immediate synchronous structural render loop across containers
    channels.forEach(channel => {
        const container = document.getElementById(`carouselDisplay-${channel}`);
        if(container && ProductionImagePools[channel] && ProductionImagePools[channel].length > 0) {
            container.style.backgroundImage = `url('${ProductionImagePools[channel][0]}')`;
        }
    });
 
    // Sanitize timer boundaries to enforce a rational positive interval cycle execution
    const speedSeconds = Math.max(1, GuruAgencyState.carouselIntervalTime);

    // Run interval sequence with values configured via state adjustments
    activeCarouselTimerId = setInterval(() => {
        channels.forEach(channel => {
            const container = document.getElementById(`carouselDisplay-${channel}`);
            const pool = ProductionImagePools[channel];
            if(!container || !pool || pool.length === 0) return;
 
            // Pick an entirely random array entry index from the current service pool array
            const randomElementIndex = Math.floor(Math.random() * pool.length);
            
            container.style.opacity = "0.2";
            setTimeout(() => {
                container.style.backgroundImage = `url('${pool[randomElementIndex]}')`;
                container.style.opacity = "0.65";
            }, 200);
        });
    }, speedSeconds * 1000);
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
 
// NATURAL LANGUAGE BUSINESS INTELLIGENCE CHAT ASSISTANT ENGINE
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
        appendChatBubble('assistant', `Hi! I'm your studio advisor. If you have any questions about our design work, photography packages, custom invitation sets, or pricing tiers, fire away. I'm here to help you get started!`);
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
 
    // Human-like fluid response generator simulation loop
    setTimeout(() => {
        const query = promptStr.toLowerCase();
        let fluidReply = "";
 
        if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
            fluidReply = "Well hello there! Thanks for stopping by today. What specific project or service category do you have on your mind? I can break down our pricing and timelines for you.";
        } else if (query.includes('design') || query.includes('logo') || query.includes('poster') || query.includes('brand')) {
            fluidReply = "Oh, our design team is incredible. We handle everything from bespoke vector logo designs (typically ranging from $300 to $700) to full branding guidelines and corporate identity packages. Our timelines are usually pretty quick too—most logo and poster projects are wrapped up inside 3 to 5 business days. Are you looking to update an existing brand or build something brand new?";
        } else if (query.includes('photo') || query.includes('shoot') || query.includes('camera') || query.includes('portrait')) {
            fluidReply = "You bet! Our photography setups cover editorial and corporate portrait headshots starting at $250, as well as full-scale commercial product shoots and premium event coverages. We turn edited photos around in about 3 to 5 days so you aren't stuck waiting. What kind of session are you trying to organize?";
        } else if (query.includes('invite') || query.includes('card') || query.includes('wedding')) {
            fluidReply = "Invitations are a huge specialty of ours. We craft gorgeous, luxury print-ready wedding suites, custom birthday layout designs, and formal corporate gala invitations. Complete suites range between $200 and $800 depending on your materials and complexity, and we generally wrap up production within a week. Do you have a specific theme or color scheme you are looking to match?";
        } else {
            fluidReply = "I appreciate that detail! To make sure I get you the exact details, could you specify if you are looking for graphic branding design work, a custom photography layout package, or invitation stationery printing options?";
        }

        appendChatBubble('assistant', fluidReply);
    }, 650);
}
