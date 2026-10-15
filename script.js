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

// Request CV: pop-up form that emails me through Web3Forms. Falls back to a plain email link until a key is set.
(function () {
  const link = document.querySelector("#request-cv");
  const dialog = document.querySelector("#cv-dialog");
  if (!link || !dialog || typeof dialog.showModal !== "function") return;
  const form = document.querySelector("#cv-form");
  const status = document.querySelector("#cv-status");
  const send = document.querySelector("#cv-send");
  const key = () => (document.querySelector('meta[name="cv-form-key"]') || {}).content || "";

  link.addEventListener("click", (e) => {
    if (!key()) return; // no key yet: keep the normal mailto link
    e.preventDefault();
    status.textContent = "";
    status.className = "cv-status";
    dialog.showModal();
  });
  document.querySelector("#cv-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get("botcheck")) return;
    data.append("access_key", key());
    data.append("subject", "CV request from " + data.get("name"));
    data.append("from_name", "Portfolio website");
    send.disabled = true;
    status.className = "cv-status";
    status.textContent = "Sending...";
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const out = await r.json();
      if (out.success) {
        form.reset();
        status.className = "cv-status ok";
        status.textContent = "Thank you. I will reply by email soon.";
      } else {
        throw new Error(out.message || "failed");
      }
    } catch (err) {
      status.className = "cv-status bad";
      status.innerHTML = 'Sorry, that did not send. Please email me at <a href="mailto:me.penghuy@gmail.com">me.penghuy@gmail.com</a>.';
    }
    send.disabled = false;
  });
})();
