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
        if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
          const video = document.createElement("video");
          video.controls = true;
          video.preload = "metadata";
          video.playsInline = true;
          video.src = url.startsWith("/") ? url : base + url;
          demo.appendChild(video);
        } else {
          demo.appendChild(renderMd(url));
        }
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

  // ---- Artmaking page: category cards -> list of items -> one item ------------
  const ORDER = ["Sketch", "Drawing", "Photography", "Poetry", "Music"];
  const NOUN = { Poetry: ["poem", "poems"], Sketch: ["sketch", "sketches"], Drawing: ["drawing", "drawings"], Photography: ["photo", "photos"], Music: ["track", "tracks"] };
  const countLabel = (cat, n) => {
    const w = NOUN[cat] || ["item", "items"];
    return n + " " + (n === 1 ? w[0] : w[1]);
  };
  // categories shown as a plain gallery (just the pictures, newest first)
  const GALLERY_CATS = ["Sketch"];
  const allPics = (it) => {
    const out = [];
    const add = (s) => {
      if (s && !out.includes(s)) out.push(s);
    };
    add(it.meta.image);
    if (Array.isArray(it.meta.gallery)) it.meta.gallery.forEach(add);
    const re = /!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;
    let m;
    while ((m = re.exec(it.body || "")) !== null) add(m[1]);
    return out;
  };

  const plainTitle = (t) => String(t || "").replace(/^[\s_*#~-]+|[\s_*#~-]+$/g, "");
  const fmtDate = (d) => {
    const t = new Date(d);
    return isNaN(t) ? "" : t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  async function loadMaking() {
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
          p.category = p.meta.category || "Other";
          return p;
        })
      )
    ).filter(Boolean);
    items.sort((a, b) => new Date(b.meta.date || 0) - new Date(a.meta.date || 0));
    return items;
  }

  const picsOf = (it) => {
    const list = Array.isArray(it.meta.gallery) ? it.meta.gallery.filter(Boolean) : [];
    if (it.meta.image && !list.includes(it.meta.image)) list.unshift(it.meta.image);
    return list;
  };

  const galleryRow = (it) => {
    const pics = Array.isArray(it.meta.gallery) ? it.meta.gallery.filter(Boolean) : [];
    if (!pics.length) return null;
    const row = document.createElement("div");
    row.className = "gallery-row";
    pics.forEach((src) => {
      const a = document.createElement("a");
      a.href = src;
      a.target = "_blank";
      a.rel = "noopener";
      const im = document.createElement("img");
      im.src = src;
      im.alt = plainTitle(it.meta.title);
      im.loading = "lazy";
      a.appendChild(im);
      row.appendChild(a);
    });
    const nCols = Number(it.meta.columns);
    if (nCols >= 1) row.style.setProperty("--cols", String(Math.min(nCols, 4)));
    return row;
  };

  const setHead = (title, lead) => {
    const h1 = document.querySelector("main h1");
    if (h1) h1.textContent = title;
    const l = document.querySelector("main .lead");
    if (l) {
      if (lead) l.textContent = lead;
      else l.style.display = "none";
    }
    document.title = title + " · Penghuy Srean";
  };

  async function makingPage() {
    const root = document.querySelector("#making");
    if (!root) return;
    const items = await loadMaking();
    if (!items.length) return; // keep "Coming soon"
    const soon = document.querySelector(".coming-soon");
    if (soon) soon.remove();
    const params = new URLSearchParams(location.search);
    const wantItem = params.get("item");
    const wantCat = params.get("category");

    // 3) one item
    if (wantItem) {
      const it = items.find((x) => x.slug === wantItem);
      if (it) {
        const cat = it.category;
        const isPoem = cat.toLowerCase() === "poetry";
        setHead(plainTitle(it.meta.title) || it.slug, fmtDate(it.meta.date));
        const art = document.createElement("article");
        art.className = "making-item single" + (isPoem ? " poem" : "");
        const row = galleryRow(it);
        if (row) art.appendChild(row);
        if (it.meta.image && !(Array.isArray(it.meta.gallery) && it.meta.gallery.includes(it.meta.image))) {
          const im = document.createElement("img");
          im.className = "single-image";
          im.src = it.meta.image;
          im.alt = plainTitle(it.meta.title);
          art.appendChild(im);
        }
        let body = it.body || "";
        if (isPoem) body = body.replace(/^#{1,6}[ \t]+/gm, "").replace(/^([ \t]*\d+)\.(?=[ \t])/gm, "$1\\."); // a poem line is never a heading, and "1." is not a list
        if (body.trim()) art.appendChild(renderMd(body, { breaks: isPoem, columns: it.meta.columns }));
        if (it.meta.link) {
          const a = document.createElement("a");
          a.className = "more";
          a.href = it.meta.link;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = "Open →";
          art.appendChild(a);
        }
        root.appendChild(art);
        return;
      }
    }

    // 2) rows of one category
    if (wantCat) {
      const list = items.filter((x) => x.category.toLowerCase() === wantCat.toLowerCase());
      if (list.length) {
        const cat = list[0].category;
        if (!GALLERY_CATS.includes(cat)) setHead(cat, countLabel(cat, list.length));
        if (GALLERY_CATS.includes(list[0].category)) {
          // gallery categories: no rows, no titles; just the pictures, with an optional intro line above
          const gcat = list[0].category;
          const pages = (await getJSON("content/artmaking.json")) || {};
          const intro = String(pages["intro_" + gcat.toLowerCase()] || "").trim();
          setHead(gcat, "");
          if (intro) {
            const p = document.createElement("p");
            p.className = "category-intro";
            p.textContent = intro;
            root.appendChild(p);
          }
          const pics = [];
          list.forEach((it) => {
            allPics(it).forEach((src) => {
              if (src && !pics.includes(src)) pics.push(src);
            });
          });
          const wrap = document.createElement("div");
          wrap.className = "sketch-gallery";
          pics.forEach((src) => {
            const a = document.createElement("a");
            a.href = src;
            a.target = "_blank";
            a.rel = "noopener";
            const im = document.createElement("img");
            im.src = src;
            im.alt = gcat;
            im.loading = "lazy";
            a.appendChild(im);
            wrap.appendChild(a);
          });
          root.appendChild(wrap);
          return;
        }
        {
          const pages = (await getJSON("content/artmaking.json")) || {};
          const intro = String(pages["intro_" + cat.toLowerCase()] || "").trim();
          if (intro) {
            const p = document.createElement("p");
            p.className = "category-intro";
            p.textContent = intro;
            root.appendChild(p);
          }
        }
        const ul = document.createElement("ul");
        ul.className = "item-rows";
        list.forEach((it) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = "artmaking.html?item=" + encodeURIComponent(it.slug);
          const plain = (it.body || "").replace(/^#{1,6}[ \t]+/gm, "").replace(/[*_>`!\[\]()]/g, "").replace(/\s+/g, " ").trim();
          a.innerHTML =
            '<span class="row-meta">' + esc(fmtDate(it.meta.date)) + "</span>" +
            '<span class="row-title">' + esc(plainTitle(it.meta.title) || it.slug) + "</span>" +
            '<span class="row-excerpt">' + esc(plain.slice(0, 110)) + (plain.length > 110 ? "…" : "") + "</span>";
          li.appendChild(a);
          ul.appendChild(li);
        });
        root.appendChild(ul);
        return;
      }
    }

    // 1) category cards (only categories that have something)
    const groups = {};
    items.forEach((it) => (groups[it.category] = groups[it.category] || []).push(it));
    const cats = ORDER.filter((c) => groups[c]).concat(Object.keys(groups).filter((c) => !ORDER.includes(c)));
    const intros = (await getJSON("content/artmaking.json")) || {};
    const grid = document.createElement("div");
    grid.className = "grid cat-grid";
    cats.forEach((c) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = "artmaking.html?category=" + encodeURIComponent(c);
      const cover = picsOf(groups[c][0])[0];
      a.innerHTML =
        (cover ? '<img class="cms-card-cover" src="' + esc(cover) + '" alt="" loading="lazy" />' : "") +
        "<h3>" + esc(c) + "</h3><p>" + esc(countLabel(c, groups[c].length)) + "</p>" +
        (String(intros["intro_" + c.toLowerCase()] || "").trim()
          ? '<p class="card-intro">' + esc(String(intros["intro_" + c.toLowerCase()]).trim()) + "</p>"
          : "");
      grid.appendChild(a);
    });
    root.appendChild(grid);
  }

  if (inProjects) projectPage();
  else {
    homePage();
    makingPage();
  }
})();
