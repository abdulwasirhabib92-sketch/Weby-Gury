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
let aiConversationHistoryLog = []; // Tracks the live discussion memory context
 
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
    const gatekeeperSubmitQuizBtn =
