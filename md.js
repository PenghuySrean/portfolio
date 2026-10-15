// Shared helpers for content written in the admin page (Markdown + front matter).
(function () {
  const clean = (v) => v.trim().replace(/^["']|["']$/g, "");

  // Front matter: "key: value", and lists written as "key:" followed by "  - item" lines.
  window.parseFrontMatter = function (text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const meta = {};
    let body = text;
    if (m) {
      body = m[2];
      let listKey = null;
      m[1].split(/\r?\n/).forEach((line) => {
        const item = line.match(/^\s+-\s+(.*)$/);
        if (item && listKey) {
          meta[listKey].push(clean(item[1]));
          return;
        }
        const i = line.indexOf(":");
        if (i > 0 && !/^\s/.test(line)) {
          const key = line.slice(0, i).trim();
          const val = line.slice(i + 1).trim();
          if (val === "") {
            meta[key] = [];
            listKey = key;
          } else if (/^\[.*\]$/.test(val)) {
            meta[key] = val.slice(1, -1).split(",").map(clean).filter(Boolean);
            listKey = null;
          } else {
            meta[key] = clean(val);
            listKey = null;
          }
        }
      });
      Object.keys(meta).forEach((k) => {
        if (Array.isArray(meta[k]) && meta[k].length === 0) meta[k] = "";
      });
    }
    return { meta, body };
  };

  const videoFile = /\.(mp4|webm|mov)(\?|$)/i;
  const embedFor = (url) => {
    let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/i);
    if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
    m = url.match(/vimeo\.com\/(\d+)/i);
    if (m) return "https://player.vimeo.com/video/" + m[1];
    return "";
  };

  // A paragraph that holds only images (and line breaks) counts as an "image paragraph".
  const imageOnly = (el) => {
    if (!el || el.tagName !== "P") return false;
    const imgs = el.querySelectorAll("img");
    if (!imgs.length) return false;
    const rest = el.cloneNode(true);
    rest.querySelectorAll("img, br, a").forEach((n) => n.remove());
    return rest.textContent.trim() === "";
  };

  // Consecutive images become one row: 2 images = 2 columns, up to 4 columns across; 2 x 2 on a phone.
  const groupImages = (box, cols) => {
    if (cols === 1) return; // one image per line
    const kids = [...box.children];
    let i = 0;
    while (i < kids.length) {
      if (!imageOnly(kids[i])) {
        i++;
        continue;
      }
      let j = i;
      const run = [];
      while (j < kids.length && imageOnly(kids[j])) {
        run.push(kids[j]);
        j++;
      }
      const imgs = run.flatMap((p) => [...p.querySelectorAll("img")]);
      if (imgs.length >= 2) {
        const row = document.createElement("div");
        row.className = "gallery-row";
        row.style.setProperty("--cols", String(cols >= 2 ? Math.min(cols, 4) : Math.min(imgs.length, 4)));
        imgs.forEach((img) => {
          const a = document.createElement("a");
          a.href = img.getAttribute("src");
          a.target = "_blank";
          a.rel = "noopener";
          a.appendChild(img);
          row.appendChild(a);
        });
        run[0].replaceWith(row);
        run.slice(1).forEach((p) => p.remove());
      }
      i = j;
    }
  };

  // Markdown -> safe element. Images stay where you put them; video files and YouTube/Vimeo links become players.
  window.renderMd = function (md, opts) {
    const breaks = !!(opts && opts.breaks); // poems: keep every line break
    const raw = window.marked ? marked.parse(md || "", { breaks: breaks, gfm: true }) : "";
    const html = window.DOMPurify ? DOMPurify.sanitize(raw) : raw;
    const box = document.createElement("div");
    box.className = "md";
    box.innerHTML = html;
    box.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (videoFile.test(src)) {
        const v = document.createElement("video");
        v.controls = true;
        v.preload = "metadata";
        v.src = src;
        img.replaceWith(v);
      }
    });
    box.querySelectorAll("p").forEach((p) => {
      const a = p.querySelector("a");
      const url = (a ? a.href : p.textContent).trim();
      if (p.textContent.trim() !== (a ? a.textContent.trim() : url)) return;
      const src = embedFor(url);
      if (!src) return;
      const wrap = document.createElement("div");
      wrap.className = "embed";
      const f = document.createElement("iframe");
      f.src = src;
      f.loading = "lazy";
      f.allowFullscreen = true;
      f.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture; fullscreen");
      f.title = "Video";
      wrap.appendChild(f);
      p.replaceWith(wrap);
    });
    groupImages(box, opts && Number(opts.columns) ? Number(opts.columns) : 0);
    return box;
  };
})();
