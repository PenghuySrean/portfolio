const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Section rail: highlight the section currently in view
const railLinks = document.querySelectorAll("[data-sec]");
if (railLinks.length && "IntersectionObserver" in window) {
  const setActive = (id) => railLinks.forEach((a) => a.classList.toggle("active", a.dataset.sec === id));
  const seen = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
    let best = null, bestRatio = 0;
    seen.forEach((r, id) => { if (r > bestRatio) { best = id; bestRatio = r; } });
    if (best) setActive(best);
  }, { rootMargin: "-20% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
  document.querySelectorAll("main > section[id]").forEach((s) => observer.observe(s));
}
