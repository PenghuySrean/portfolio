// Musing page: lists posts from /posts (Markdown files written by the admin page) and shows a single post.
(function () {
  const root = document.querySelector("#posts");
  if (!root) return;
  const REPO = "PenghuySrean/portfolio";
  const params = new URLSearchParams(location.search);
  const wanted = params.get("post");

  const parse = (text) => {
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
  const clean = (html) => (window.DOMPurify ? DOMPurify.sanitize(html) : html);
  const fmt = (d) => {
    const t = new Date(d);
    return isNaN(t) ? "" : t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  async function listNames() {
    try {
      const r = await fetch("posts/index.json", { cache: "no-store" });
      if (r.ok) return (await r.json()).map((n) => (n.endsWith(".md") ? n : n + ".md"));
    } catch (e) {}
    const r = await fetch("https://api.github.com/repos/" + REPO + "/contents/posts?ref=main");
    if (!r.ok) return [];
    return (await r.json()).filter((f) => f.name.endsWith(".md")).map((f) => f.name);
  }

  async function load(name) {
    const r = await fetch("posts/" + name, { cache: "no-store" });
    if (!r.ok) return null;
    const p = parse(await r.text());
    p.slug = name.replace(/\.md$/, "");
    return p;
  }

  async function showPost(slug) {
    const p = await load(slug + ".md");
    const soon = document.querySelector(".coming-soon");
    if (soon) soon.remove();
    if (!p) {
      root.innerHTML = '<p class="placeholder">Post not found.</p>';
      return;
    }
    document.title = (p.meta.title || "Musing") + " · Penghuy Srean";
    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = p.meta.title || "Musing";
    const lead = document.querySelector(".lead");
    if (lead) lead.textContent = [fmt(p.meta.date), p.meta.tag].filter(Boolean).join(" · ");
    const img = p.meta.image ? '<img class="post-image" src="' + esc(p.meta.image) + '" alt="" />' : "";
    root.innerHTML =
      img +
      '<div class="post-body" id="post-body"></div>';
    const holder = document.getElementById("post-body");
    if (window.renderMd) holder.appendChild(renderMd(p.body, { columns: p.meta.columns }));
    else holder.innerHTML = clean(marked.parse(p.body));
  }

  async function showList() {
    const names = await listNames();
    const posts = (await Promise.all(names.map(load)))
      .filter(Boolean)
      .sort((a, b) => new Date(b.meta.date || 0) - new Date(a.meta.date || 0));
    if (!posts.length) return; // keep "Coming soon"
    const soon = document.querySelector(".coming-soon");
    if (soon) soon.remove();
    root.innerHTML =
      '<div class="grid post-grid">' +
      posts
        .map((p) => {
          const plain = p.body.replace(/[#*_>`!\[\]()]/g, "").replace(/\s+/g, " ").trim();
          return (
            '<a class="card" href="musing.html?post=' + encodeURIComponent(p.slug) + '">' +
            '<span class="meta">' + esc([fmt(p.meta.date), p.meta.tag].filter(Boolean).join(" · ")) + "</span>" +
            "<h3>" + esc(p.meta.title || p.slug) + "</h3>" +
            "<p>" + esc(plain.slice(0, 160)) + (plain.length > 160 ? "…" : "") + "</p></a>"
          );
        })
        .join("") +
      "</div>";
  }

  (wanted ? showPost(wanted) : showList()).catch(() => {});
})();
