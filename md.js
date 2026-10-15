// Shared helpers for content written in the admin page (Markdown + front matter).
(function () {
  window.parseFrontMatter = function (text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const meta = {};
    let body = text;
    if (m) {
      body = m[2];
      m[1].split(/\r?\n/).forEach((line) => {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
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
    return box;
  };
})();
