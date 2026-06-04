const images = [
    "images/WhatsApp Image 2026-06-04 at 3.45.20 PM.jpeg",
    "images/WhatsApp Image 2026-06-04 at 3.45.21 PM.jpeg",
    "images/reward.webp",
    "images/WhatsApp_Image_2025-10-31_at_9.51.16_PM.jpeg",
    "images/IMG_20260304_114313.webp",
    "images/IMG-20260425-WA0004.webp"
];

const hero = document.querySelector(".hero");
const dots = document.querySelectorAll(".dots span");
const problemMessage = document.querySelector("#problemMessage");
const problemCards = document.querySelectorAll(".problem-card");
const sideProblemPanel = document.querySelector("#sideProblemPanel");
const sidePanelTitle = document.querySelector("#sidePanelTitle");
const sideIssues = document.querySelectorAll(".side-issue-list li");
const problemType = document.querySelector("#problemType");
const railThumbs = document.querySelectorAll(".rail-thumb");
const galleryItems = document.querySelectorAll(".gallery-item");
const navLinks = document.querySelectorAll(".nav-list a");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const leftArrow = document.querySelector(".left");
const rightArrow = document.querySelector(".right");
const i18n = new Proxy({}, {
    get: (_, prop) => window.campusI18n?.[prop]
});

let index = 0;
let selectedLocation = "Boys Hostel";

function getProblemDisplayName(problemName){
    if (i18n?.getLanguage() !== "hi") {
        return problemName;
    }

    const map = {
        "Water leakage": "पानी रिसाव",
        "Fan not working": "पंखा काम नहीं कर रहा",
        "Electricity issues": "बिजली की समस्या",
        "WiFi issues": "वाई-फाई समस्या",
        "Cleanliness concerns": "सफाई की चिंता",
        "Furniture damage": "फर्नीचर क्षति"
    };

    return map[problemName] || problemName;
}

function getLocationDisplayName(locationName) {
    if (i18n?.getLanguage() !== "hi") {
        return locationName;
    }

    const map = {
        "Boys Hostel": "लड़कों का हॉस्टल",
        "Girls Hostel": "लड़कियों का हॉस्टल",
        Campus: "कैम्पस"
    };

    return map[locationName] || locationName;
}

function changeSlide(i){
    index = i;

    hero.style.background =
    `url("${images[index]}") center/cover no-repeat`;

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
    });

    railThumbs.forEach(thumb => {
        thumb.classList.toggle("active", Number(thumb.dataset.slide) === index);
    });
}

if (rightArrow) {
    rightArrow.onclick = () => {
        index = (index + 1) % images.length;
        changeSlide(index);
    };
}

if (leftArrow) {
    leftArrow.onclick = () => {
        index = (index - 1 + images.length) % images.length;
        changeSlide(index);
    };
}

setInterval(()=>{
    index = (index + 1) % images.length;
    changeSlide(index);
},5000);

function setLocation(card){
    const isSameLocation = selectedLocation === card.dataset.location && card.classList.contains("active");
    const isHindi = i18n?.getLanguage() === "hi";

    if(isSameLocation){
        sideProblemPanel.hidden = false;
        return;
    }

    selectedLocation = card.dataset.location;
    showProblemSelection(card);
    problemCards.forEach(problemCard => problemCard.classList.remove("active"));
    card.classList.add("active");

    if(problemType.value.trim()){
        problemMessage.textContent = isHindi
            ? `${getProblemDisplayName(problemType.value.trim())} ${getLocationDisplayName(selectedLocation)} के लिए सक्रिय है।`
            : `${problemType.value.trim()} status is Active for ${selectedLocation}.`;
        updateProblemList(problemType.value);
        return;
    }

    problemMessage.textContent = isHindi
        ? `${getLocationDisplayName(selectedLocation)} की समस्याएँ देखने के लिए यूज़र समस्या पैनल पर जाएँ।`
        : `Put cursor in User Problem Panel to see ${selectedLocation} problems.`;
    updateProblemList("");
}

function showProblemSelection(){
    sideProblemPanel.hidden = false;
    sidePanelTitle.textContent = i18n?.getLanguage() === "hi"
        ? `${getLocationDisplayName(selectedLocation)} की समस्याएँ`
        : `${selectedLocation} Problems`;
}

function updateProblemMessage(problem){
    const cleanProblem = problem.trim();
    const isHindi = i18n?.getLanguage() === "hi";

    if(!cleanProblem){
        problemMessage.textContent = isHindi
            ? `${getLocationDisplayName(selectedLocation)} की समस्याएँ देखने के लिए यूज़र समस्या पैनल पर जाएँ।`
            : `Put cursor in User Problem Panel to see ${selectedLocation} problems.`;
        updateProblemList("");
        return;
    }

    problemMessage.textContent = isHindi
        ? `${getProblemDisplayName(cleanProblem)} ${getLocationDisplayName(selectedLocation)} के लिए सक्रिय है।`
        : `${cleanProblem} status is Active for ${selectedLocation}.`;
    problemMessage.classList.add("updated");
    updateProblemList(cleanProblem);

    setTimeout(() => {
        problemMessage.classList.remove("updated");
    }, 450);
}

function updateProblemList(problem){
    const searchText = problem.trim().toLowerCase();

    sideIssues.forEach(item => {
        const isSelected = item.dataset.problem.toLowerCase() === searchText;

        item.classList.toggle("selected", isSelected);
    });
}

function openSlideFromElement(element){
    const slideIndex = Number(element.dataset.slide);

    if(Number.isNaN(slideIndex)){
        return;
    }

    changeSlide(slideIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function activateGallerySlide(element){
    galleryItems.forEach(item => item.classList.remove("active"));
    element.classList.add("active");
    openSlideFromElement(element);
}

problemCards.forEach(card => {
    card.addEventListener("click", () => {
        setLocation(card);
    });
});

sideIssues.forEach(item => {
    item.addEventListener("mouseenter", () => {
        problemType.value = item.dataset.problem;
        updateProblemMessage(item.dataset.problem);
    });

    item.addEventListener("focusin", () => {
        problemType.value = item.dataset.problem;
        updateProblemMessage(item.dataset.problem);
    });

    item.addEventListener("click", () => {
        problemType.value = item.dataset.problem;
        updateProblemMessage(item.dataset.problem);
    });
});

problemType.addEventListener("input", event => {
    updateProblemMessage(event.target.value);
});

dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => changeSlide(dotIndex));
});

railThumbs.forEach(thumb => {
    thumb.addEventListener("click", () => openSlideFromElement(thumb));
});

galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        activateGallerySlide(item);
    });
});

function setActiveNavigation(){
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        link.classList.toggle("active", linkPage === currentPage);

        link.addEventListener("click", () => {
            navLinks.forEach(navLink => navLink.classList.remove("active"));
            link.classList.add("active");
            closeNavigation();
        });
    });
}

function translateHomeCopy(){
    const issueLabels = document.querySelectorAll(".side-issue-list li");
    const issueCopy = i18n?.getLanguage() === "hi"
        ? ["पानी रिसाव", "पंखा काम नहीं कर रहा", "बिजली की समस्या", "वाई-फाई समस्या", "सफाई की चिंता", "फर्नीचर क्षति"]
        : ["Water leakage", "Fan not working", "Electricity issues", "WiFi issues", "Cleanliness concerns", "Furniture damage"];

    issueLabels.forEach((item, index) => {
        if (issueCopy[index]) {
            item.textContent = issueCopy[index];
        }
    });
}

function openNavigation(){
    document.body.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
}

function closeNavigation(){
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openNavigation);
menuClose.addEventListener("click", closeNavigation);

document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
        closeNavigation();
    }
});

setActiveNavigation();
document.addEventListener("DOMContentLoaded", translateHomeCopy);

window.addEventListener("campus-language-change", () => {
    translateHomeCopy();
    if (!sideProblemPanel.hidden) {
        showProblemSelection();
        if (problemType.value.trim()) {
            updateProblemMessage(problemType.value);
        }
    }
});
