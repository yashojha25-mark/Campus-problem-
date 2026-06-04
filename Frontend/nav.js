document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-list a");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const themeText = document.querySelector(".theme-text");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const savedTheme = localStorage.getItem("campusTheme") || "light";

  function closeNavigation() {
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (themeIcon) {
      themeIcon.textContent = isDark ? "☀" : "☾";
    }

    if (themeText) {
      themeText.textContent = isDark ? "Light" : "Dark";
    }

    localStorage.setItem("campusTheme", theme);
  }

  navLinks.forEach((link) => {
    const linkUrl = new URL(link.getAttribute("href"), window.location.href);
    const linkPage = linkUrl.pathname.split("/").pop() || "index.html";

    link.classList.toggle("active", linkPage === currentPage);
    link.addEventListener("click", closeNavigation);
  });

  menuToggle?.addEventListener("click", () => {
    document.body.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
  });

  menuClose?.addEventListener("click", closeNavigation);

  themeToggle?.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  applyTheme(savedTheme);
});
