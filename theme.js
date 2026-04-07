// Simple dark/light theme toggle shared across pages
(function () {
  const STORAGE_KEY = "kc-theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = theme === "light" ? "🌙" : "☀️";
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const initial =
    saved === "light" || saved === "dark"
      ? saved
      : prefersLight
      ? "light"
      : "dark";

  applyTheme(initial);

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || initial;
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  });
})();

