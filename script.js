const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Portfolio dropdown: click or tap to open, click elsewhere or press Escape to close
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".has-dropdown");
if (toggle && menu) {
  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!menu.classList.contains("open"));
  });
  document.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}
