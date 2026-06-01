const GuruAgencyState = {
    clientName: localStorage.getItem('guru_client_name') || '',
    adminPasscode: localStorage.getItem('guru_admin_password') || 'admin',

    customTitle: localStorage.getItem('admin_title') || 'Creative Designs',
    customSubtitle: localStorage.getItem('admin_subtitle') || 'Premium studio services',

    colors: {
        bg: localStorage.getItem('theme_color_bg') || '#0B0B0F',
        surface: localStorage.getItem('theme_color_surface') || '#12121A',
        indigo: localStorage.getItem('theme_color_indigo') || '#6366F1',
        fuchsia: localStorage.getItem('theme_color_fuchsia') || '#EC4899'
    },

    carouselIntervalTime: parseInt(localStorage.getItem('carousel_speed')) || 3
};

/* SAFE STORAGE PARSER */
function safeParse(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
}

let ProductionImagePools = {
    design: safeParse('pool_design', []),
    photography: safeParse('pool_photography', []),
    invitations: safeParse('pool_invitations', [])
};

let carouselTimer = null;

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    applyTheme();
    bindEvents();
    startCarousel();
    initChat();
}

/* THEME */
function applyTheme() {
    document.documentElement.style.setProperty('--bg-main', GuruAgencyState.colors.bg);
    document.documentElement.style.setProperty('--bg-surface', GuruAgencyState.colors.surface);
}

/* EVENTS */
function bindEvents() {

    const next = document.getElementById('gatekeeperNextBtn');
    if (next) next.onclick = () => {
        const name = document.getElementById('gatekeeperNameInput').value;
        if (!name) return;
        localStorage.setItem('guru_client_name', name);
        location.reload();
    };

    const reset = document.getElementById('resetNameBtn');
    if (reset) reset.onclick = () => {
        localStorage.removeItem('guru_client_name');
        location.reload();
    };

    const send = document.getElementById('chatSendBtn');
    if (send) send.onclick = chatReply;

    const input = document.getElementById('chatInput');
    if (input) input.addEventListener('keydown', e => {
        if (e.key === 'Enter') chatReply();
    });

    const admin = document.getElementById('adminTriggerLink');
    if (admin) admin.onclick = () => {
        const p = prompt("Admin key:");
        if (p === GuruAgencyState.adminPasscode) {
            document.getElementById('adminDashboard').classList.remove('hidden');
        }
    };
}

/* CHAT (SAFE VERSION) */
function chatReply() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    append('user', msg);
    input.value = '';

    setTimeout(() => {
        append('assistant', "I can help you with that. Please contact our studio for details.");
    }, 600);
}

function append(role, text) {
    const box = document.getElementById('chatMessages');
    if (!box) return;

    const div = document.createElement('div');
    div.textContent = text;
    div.className = role;
    box.appendChild(div);
}

/* CAROUSEL SAFE */
function startCarousel() {
    if (carouselTimer) clearInterval(carouselTimer);

    carouselTimer = setInterval(() => {
        Object.keys(ProductionImagePools).forEach(k => {
            const el = document.getElementById(`carouselDisplay-${k}`);
            const pool = ProductionImagePools[k];

            if (!el || pool.length === 0) return;

            const img = pool[Math.floor(Math.random() * pool.length)];
            el.style.backgroundImage = `url(${img})`;
        });
    }, GuruAgencyState.carouselIntervalTime * 1000);
}

/* ADMIN SAVE */
const save = document.getElementById('adminSaveChangeBtn');
if (save) {
    save.onclick = () => {
        GuruAgencyState.colors.bg = document.getElementById('themeColorBg').value;
        localStorage.setItem('theme_color_bg', GuruAgencyState.colors.bg);

        applyTheme();
        alert("Saved");
    };
}
