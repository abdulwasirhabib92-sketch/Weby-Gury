// Active Website Configuration Settings
const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    adminPasscode: localStorage.getItem('guru_admin_password') || 'admin',
    
    // Website Copy Text
    customTitle: localStorage.getItem('admin_title') || 'Creative Designs <br>That <span class="text-gradient">Speak for You</span>',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Beautiful branding, professional photography, and luxury event media engineered for modern brands.',
    customLogoText: localStorage.getItem('admin_logo_text') || 'GURU',
 
    // Website Custom Color Configuration
    colors: {
        bg: localStorage.getItem('theme_color_bg') || '#0B0B0F',
        surface: localStorage.getItem('theme_color_surface') || '#12121A',
        indigo: localStorage.getItem('theme_color_indigo') || '#6366F1',
        fuchsia: localStorage.getItem('theme_color_fuchsia') || '#EC4899',
    },
    
    // Portfolio Slide Rotation Speed Settings
    carouselIntervalTime: parseInt(localStorage.getItem('carousel_speed')) || 3, // In Seconds
};
 
// Image Library Database Mappings
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
 
// Applies user interface color choices
function applyStoredThemeColors() {
    document.documentElement.style.setProperty('--bg-main', GuruAgencyState.colors.bg);
    document.documentElement.style.setProperty('--bg-surface', GuruAgencyState.colors.surface);
    document.documentElement.style.setProperty('--accent-indigo', GuruAgencyState.colors.indigo);
    document.documentElement.style.setProperty('--accent-fuchsia', GuruAgencyState.colors.fuchsia);
}
 
// Cleans and prints texts safely
function applyAdminContentOverrides() {
    const titleEl = document.getElementById('adminEditableTitle');
    const subtitleEl = document.getElementById('adminEditableSubtitle');
    const logoEl = document.getElementById('mainBrandLogo');
 
    if (titleEl) {
        const parser = new DOMParser();
        const cleanDoc = parser.parseFromString(GuruAgencyState.customTitle, 'text/html');
        cleanDoc.querySelectorAll('script, img[onerror], iframe').forEach(el => el.remove());
        titleEl.innerHTML = cleanDoc.body.innerHTML;
    }
    if (subtitleEl) subtitleEl.textContent = GuruAgencyState.customSubtitle;
    if (logoEl) {
        logoEl.textContent = GuruAgencyState.customLogoText;
        const spanEl = document.createElement('span');
        spanEl.textContent = 'STUDIOS';
        logoEl.appendChild(spanEl);
    }
}
 
// Checks if visitor has entered their name
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
 
// Sets up all button click listeners
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
 
    if(durationSlider && durationLabel) {
        durationSlider.value = GuruAgencyState.carouselIntervalTime;
        durationLabel.textContent = GuruAgencyState.carouselIntervalTime;
        durationSlider.addEventListener('input', (e) => {
            durationLabel.textContent = e.target.value;
        });
    }
 
    // Image uploader interface helper
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
                        alert(`Successfully loaded ${loadedDataUris.length} images into your "${targetChannel}" category! Click the apply button to make them active.`);
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }
 
    // Password validation engine handling
    let generatedApprovalToken = null;
    if(triggerPasswordBtn) {
        triggerPasswordBtn.addEventListener('click', () => {
            const newPass = document.getElementById('adminNewPasswordInput').value.trim();
            if(!newPass) {
                alert("Please type a new admin password first.");
                return;
            }
 
            const verificationBlock = document.getElementById('passwordVerificationBlock');
            if(verificationBlock.classList.contains('hidden')) {
                const cryptoArray = new Uint32Array(1);
                window.crypto.getRandomValues(cryptoArray);
                generatedApprovalToken = (100000 + (cryptoArray[0] % 900000)).toString();
                
                alert(`Security confirmation code requested. Use this verification number: ${generatedApprovalToken}`);
                verificationBlock.classList.remove('hidden');
                triggerPasswordBtn.textContent = "Confirm Code & Update Password";
            } else {
                const userSubmittedCode = document.getElementById('adminPasswordAuthCode').value.trim();
                if(generatedApprovalToken && userSubmittedCode === generatedApprovalToken) {
                    GuruAgencyState.adminPasscode = newPass;
                    localStorage.setItem('guru_admin_password', newPass);
                    alert("Your admin security password has been changed successfully!");
                    generatedApprovalToken = null;
                    verificationBlock.classList.add('hidden');
                    document.getElementById('adminNewPasswordInput').value = "";
                    document.getElementById('adminPasswordAuthCode').value = "";
                    triggerPasswordBtn.textContent = "Verify Security & Update Password";
                } else {
                    alert("Incorrect security code. Password change canceled.");
                }
            }
        });
    }
 
    if(adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            if (prompt("Please enter the Admin Security Code:") === GuruAgencyState.adminPasscode) {
                document.getElementById('adminDashboard').classList.remove('hidden');
                syncColorPickersWithState();
            } else {
                alert("Incorrect code. Access Denied.");
            }
        });
    }
    
    if(closeAdminBtn) closeAdminBtn.addEventListener('click', () => { document.getElementById('adminDashboard').classList.add('hidden'); });
 
    if(adminSaveBtn) {
        adminSaveBtn.addEventListener('click', () => {
            if(durationSlider) {
                const finalSpeedValue = parseInt(durationSlider.value);
                GuruAgencyState.carouselIntervalTime = finalSpeedValue;
                localStorage.setItem('carousel_speed', finalSpeedValue);
            }
 
            GuruAgencyState.colors.bg = document.getElementById('themeColorBg').value;
            GuruAgencyState.colors.surface = document.getElementById('themeColorSurface').value;
            GuruAgencyState.colors.indigo = document.getElementById('themeColorIndigo').value;
            GuruAgencyState.colors.fuchsia = document.getElementById('themeColorFuchsia').value;
 
            localStorage.setItem('theme_color_bg', GuruAgencyState.colors.bg);
            localStorage.setItem('theme_color_surface', GuruAgencyState.colors.surface);
            localStorage.setItem('theme_color_indigo', GuruAgencyState.colors.indigo);
            localStorage.setItem('theme_color_fuchsia', GuruAgencyState.colors.fuchsia);
 
            applyStoredThemeColors();
            startAutomatedCarousels();
            
            alert("All your visual modifications have been applied to the live website!");
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
        alert("Please write your name to log in.");
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
        alert("Please enter a response so we can customize your dashboard.");
        return;
    }
    
    alert(`Thank you, ${GuruAgencyState.clientName}! Welcome to your dashboard workspace.`);
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
 
// Automated Image Slider Loop Control 
function startAutomatedCarousels() {
    if(activeCarouselTimerId) {
        clearInterval(activeCarouselTimerId);
        activeCarouselTimerId = null;
    }
 
    const channels = ['design', 'photography', 'invitations'];
    
    channels.forEach(channel => {
        const container = document.getElementById(`carouselDisplay-${channel}`);
        if(container && ProductionImagePools[channel] && ProductionImagePools[channel].length > 0) {
            container.style.backgroundImage = `url('${ProductionImagePools[channel][0]}')`;
        }
    });
 
    const speedSeconds = Math.max(1, GuruAgencyState.carouselIntervalTime);
 
    activeCarouselTimerId = setInterval(() => {
        channels.forEach(channel => {
            const container = document.getElementById(`carouselDisplay-${channel}`);
            const pool = ProductionImagePools[channel];
            if(!container || !pool || pool.length === 0) return;
 
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
 
// Chat Window Core Logic & Dialogues
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
        appendChatBubble('assistant', `Hello there! Welcome to Guru Studios. I am here to assist you with any questions you have about our design packages, photography services, pricing, or turnaround times. Feel free to ask anything!`);
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
        const query = promptStr.toLowerCase();
        let fluidReply = "";
 
        if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
            fluidReply = "Hello! Thanks for reaching out. What kind of project are you planning? I can give you pricing details and project timelines for any of our services.";
        } else if (query.includes('design') || query.includes('logo') || query.includes('poster') || query.includes('brand')) {
            fluidReply = "Our design services are customized exactly to your needs! We create custom high-quality business logos ranging from $300 to $700, as well as complete company branding sets. Most design projects take only 3 to 5 business days to complete. Are you launching a brand new business or updating an old look?";
        } else if (query.includes('photo') || query.includes('shoot') || query.includes('camera') || query.includes('portrait')) {
            fluidReply = "We offer professional photography sessions! Studio headshots and portrait packages start at $250. We also handle large commercial projects and event coverage. All photos go through professional editing and are ready within 3 to 5 business days. What type of shoot are you looking to schedule?";
        } else if (query.includes('invite') || query.includes('card') || query.includes('wedding')) {
            fluidReply = "Invitations are a wonderful specialty of ours! We design high-end printable sets for weddings, corporate galas, and private events. Custom sets range between $200 and $800 depending on complexity, and we finish layouts in about 5 to 7 days. Do you have a design theme or color palette in mind yet?";
        } else {
            fluidReply = "Thanks for sharing! To make sure I give you the perfect answers, could you let me know if you are interested in a graphic logo design, a photography session, or a custom invitation setup?";
        }
 
        appendChatBubble('assistant', fluidReply);
    }, 650);
}
