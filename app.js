const GuruAgencyState = {
    clientName: localStorage.getItem("client") || "",
    adminPasscode: "admin"
};

let activeCarouselTimerId;

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    setupOnboarding();
    setupEvents();
    startCarousel();
    initChat();
}

function setupOnboarding() {
    if (GuruAgencyState.clientName) {
        document.getElementById("gatekeeperOverlay").classList.add("hidden");
        document.getElementById("mainApplicationLayout").classList.remove("hidden");
        document.getElementById("displayUserName").textContent = GuruAgencyState.clientName;
    }
}

function setupEvents() {

    document.getElementById("gatekeeperNextBtn").onclick = () => {
        const name = document.getElementById("gatekeeperNameInput").value;
        if (!name) return alert("Enter name");

        GuruAgencyState.clientName = name;
        document.getElementById("gatekeeperIdentityStep").classList.add("hidden");
        document.getElementById("gatekeeperQuizStep").classList.remove("hidden");
        document.getElementById("quizGreetingName").textContent = name;
    };

    document.getElementById("gatekeeperSubmitQuizBtn").onclick = () => {
        localStorage.setItem("client", GuruAgencyState.clientName);
        location.reload();
    };

    document.getElementById("resetNameBtn").onclick = () => {
        localStorage.removeItem("client");
        location.reload();
    };

    document.getElementById("leadForm").onsubmit = (e) => {
        e.preventDefault();
        alert("Submitted successfully!");
    };

    document.querySelectorAll(".btn-request").forEach(btn => {
        btn.onclick = () => {
            document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        };
    });

    document.getElementById("aiTrigger").onclick = () => {
        document.getElementById("aiChatWindow").classList.remove("hidden");
    };

    document.getElementById("aiClose").onclick = () => {
        document.getElementById("aiChatWindow").classList.add("hidden");
    };

    document.getElementById("chatSendBtn").onclick = sendMessage;
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;

    append("user", msg);
    input.value = "";

    setTimeout(() => {
        append("ai", "Guru AI: I can help with design, photography and invitations.");
    }, 500);
}

function append(role, text) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = "chat-bubble";
    div.textContent = text;
    box.appendChild(div);
}

function startCarousel() {
    const pools = {
        design: ["https://images.unsplash.com/photo-1"],
        photography: ["https://images.unsplash.com/photo-2"],
        invitations: ["https://images.unsplash.com/photo-3"]
    };

    activeCarouselTimerId = setInterval(() => {
        Object.keys(pools).forEach(key => {
            const el = document.getElementById(`carouselDisplay-${key}`);
            if (el) {
                el.style.backgroundImage = `url(${pools[key][0]})`;
            }
        });
    }, 3000);
}

function initChat() {}
