// Content that comes from the admin page:
//  - project pages: details text, images and videos (content/projects/<slug>.md)
//  - home page: profile photo and award certificates (content/profile.json, content/certificates.json)
//  - Making page: items grouped by category (making/*.md)
(function () {
  const REPO = "PenghuySrean/portfolio";
  const here = location.pathname;
  const inProjects = /\/projects\/[^/]+\.html$/.test(here);
  const base = inProjects ? "../" : "";
  const getJSON = async (p) => {
    try {
      const r = await fetch(base + p, { cache: "no-store" });
      return r.ok ? await r.json() : null;
    } catch (e) {
      return null;
    }
  };
  const getText = async (p) => {
    try {
      const r = await fetch(base + p, { cache: "no-store" });
      return r.ok ? await r.text() : null;
    } catch (e) {
      return null;
    }
  };
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- Project pages -------------------------------------------------------
  async function projectPage() {
    const slug = here.split("/").pop().replace(/\.html$/, "");
    const text = await getText("content/projects/" + slug + ".md");
    if (!text) return;
    const { meta, body } = parseFrontMatter(text);
    const sections = [...document.querySelectorAll("main section")];
    const find = (name) => sections.find((s) => (s.querySelector("h2") || {}).textContent === name);
    const details = find("Details");
    const demo = find("Demo");
    const hasBody = body.trim().length > 0;
    if (meta.tools || meta.skills) {
      const box = document.querySelector(".project-meta");
      if (box) {
        const mk = (label, v) => v ? '<div><dt>' + label + '</dt><dd>' + esc(v) + '</dd></div>' : "";
        box.innerHTML = mk("Tools", meta.tools) + mk("Skills", meta.skills);
      }
    }
    if (details && hasBody) {
      const ph = details.querySelector(".placeholder");
      if (ph) ph.remove();
      details.appendChild(renderMd(body));
    }
    if (demo) {
      const url = (meta.demo || "").trim();
      if (url) {
        const ph = demo.querySelector(".placeholder");
        if (ph) ph.remove();
        demo.appendChild(renderMd(url));
      } else if (hasBody) {
        demo.remove();
      }
    }
  }

  // ---- Home page: photo and certificates ----------------------------------
  async function homePage() {
    const profile = await getJSON("content/profile.json");
    if (profile && profile.photo) {
      const holder = document.querySelector(".photo-placeholder");
      if (holder) {
        const img = document.createElement("img");
        img.src = profile.photo;
        img.alt = "Penghuy Srean";
        const num = (v, d, lo, hi) => {
          const n = Number(v);
          return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;
        };
        const fx = num(profile.focus_x, 50, 0, 100);
        const fy = num(profile.focus_y, 50, 0, 100);
        const z = num(profile.zoom, 100, 100, 300) / 100;
        img.style.objectPosition = fx + "% " + fy + "%";
        img.style.transformOrigin = fx + "% " + fy + "%";
        if (z !== 1) img.style.transform = "scale(" + z + ")";
        holder.replaceWith(img);
      }
    }
    const certs = await getJSON("content/certificates.json");
    if (certs) {
      document.querySelectorAll("[data-cert]").forEach((li) => {
        const url = certs[li.getAttribute("data-cert")];
        const ph = li.querySelector(".cert-placeholder");
        if (url && ph) {
          const a = document.createElement("a");
          a.className = "cert-link";
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = "View certificate →";
          ph.replaceWith(a);
        }
      });
    }
  }

  // ---- Making page ----------------------------------------------------------
  const ORDER = ["Sketch", "Drawing", "Photography", "Poetry", "Music"];
  async function makingPage() {
    const root = document.querySelector("#making");
    if (!root) return;
    let names = [];
    const idx = await getJSON("making/index.json");
    if (idx) names = idx.map((n) => (n.endsWith(".md") ? n : n + ".md"));
    else {
      try {
        const r = await fetch("https://api.github.com/repos/" + REPO + "/contents/making?ref=main");
        if (r.ok) names = (await r.json()).filter((f) => f.name.endsWith(".md")).map((f) => f.name);
      } catch (e) {}
    }
    const items = (
      await Promise.all(
        names.map(async (n) => {
          const t = await getText("making/" + n);
          if (!t) return null;
          const p = parseFrontMatter(t);
          p.slug = n.replace(/\.md$/, "");
          return p;
        })
      )
    ).filter(Boolean);
    if (!items.length) return; // keep "Coming soon"
    const soon = document.querySelector(".coming-soon");
    if (soon) soon.remove();
    const groups = {};
    items.forEach((it) => {
      const c = it.meta.category || "Other";
      (groups[c] = groups[c] || []).push(it);
    });
    const cats = ORDER.filter((c) => groups[c]).concat(Object.keys(groups).filter((c) => !ORDER.includes(c)));
    cats.forEach((c) => {
      const sec = document.createElement("section");
      sec.id = "making-" + c.toLowerCase();
      const h = document.createElement("h2");
      h.textContent = c;
      sec.appendChild(h);
      const grid = document.createElement("div");
      grid.className = "making-grid";
      groups[c]
        .sort((a, b) => new Date(b.meta.date || 0) - new Date(a.meta.date || 0))
        .forEach((it) => {
          const card = document.createElement("article");
          card.className = "making-item";
          let html = "";
          if (it.meta.image) html += '<img src="' + esc(it.meta.image) + '" alt="' + esc(it.meta.title || "") + '" loading="lazy" />';
          if (it.meta.title) html += "<h3>" + esc(it.meta.title) + "</h3>";
          card.innerHTML = html;
          const isPoem = String(it.meta.category || "").toLowerCase() === "poetry";
          if (isPoem) card.classList.add("poem");
          if (it.body.trim()) card.appendChild(renderMd(it.body, { breaks: isPoem, columns: it.meta.columns }));
          const pics = Array.isArray(it.meta.gallery) ? it.meta.gallery.filter(Boolean) : [];
          if (pics.length) {
            const row = document.createElement("div");
            row.className = "gallery-row";
            pics.forEach((src) => {
              const a = document.createElement("a");
              a.href = src;
              a.target = "_blank";
              a.rel = "noopener";
              const im = document.createElement("img");
              im.src = src;
              im.alt = it.meta.title || "";
              im.loading = "lazy";
              a.appendChild(im);
              row.appendChild(a);
            });
            card.classList.add("has-gallery");
            card.appendChild(row);
          }
          if (card.querySelector(".gallery-row")) card.classList.add("has-gallery");
          if (it.meta.link) {
            const a = document.createElement("a");
            a.className = "more";
            a.href = it.meta.link;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = "Open →";
            card.appendChild(a);
          }
          grid.appendChild(card);
        });
      sec.appendChild(grid);
      root.appendChild(sec);
    });
  }

  if (inProjects) projectPage();
  else {
    homePage();
    makingPage();
  }
})();
