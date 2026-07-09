function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderLogo(logoEl, settings) {
  logoEl.classList.remove("photo-mask");
  logoEl.style.removeProperty("--logo-photo");

  if (settings.logoImage) {
    logoEl.innerHTML = `<img src="${settings.logoImage}" alt="${settings.siteName}">`;
    return;
  }

  logoEl.textContent = (settings.siteName || "").trim().replace(/\s+/g, "\n");

  if (settings.logoPhotoMask) {
    logoEl.classList.add("photo-mask");
    logoEl.style.setProperty("--logo-photo", `url("${settings.logoPhotoMask}")`);
  }
}

async function renderHome() {
  const [settings, data] = await Promise.all([
    loadJSON("/dan/content/settings.json"),
    loadJSON("/dan/content/projects.json"),
  ]);

  document.title = `${settings.siteName} — Portfolio`;

  renderLogo(document.getElementById("logo"), settings);

  const navContact = document.getElementById("nav-contact");
  if (navContact) navContact.href = `mailto:${settings.email}`;

  const navCv = document.getElementById("nav-cv");
  if (navCv && settings.cvFile) {
    navCv.href = settings.cvFile;
    navCv.setAttribute("download", "My CV.pdf");
    navCv.style.display = "";
  }

  const bannerWrap = document.getElementById("banner-wrap");
  if (settings.headerBanner) {
    bannerWrap.appendChild(
      el(`<div class="banner"><img src="${settings.headerBanner}" alt="${settings.siteName}"></div>`)
    );
  }

  document.getElementById("intro-heading").textContent = settings.introHeading;
  document.getElementById("intro-text").textContent = settings.introText;

  const footerContact = document.getElementById("footer-contact");
  footerContact.innerHTML = `<a href="mailto:${settings.email}">${settings.email}</a>${settings.phone ? " · " + settings.phone : ""}`;

  // Homepage order follows the order projects are listed in the CMS
  // (drag to reorder there — no separate "order" number to keep in sync).
  const projects = (data.projects || []).filter((p) => p && p.published !== false);

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  if (projects.length === 0) {
    grid.appendChild(el(`<div class="empty">No projects yet.</div>`));
    return;
  }

  for (const p of projects) {
    const card = el(`
      <a class="card" href="/dan/projects/${p.slug}">
        <div class="thumb"><img src="${p.thumbnail}" alt="${p.title}" loading="lazy"></div>
        <div class="card-body">
          <div class="category">${p.category || ""}</div>
          <h3>${p.title}</h3>
          <p class="summary">${p.summary || ""}</p>
        </div>
      </a>
    `);
    grid.appendChild(card);
  }

  const embedUrl = toEmbedUrl(settings.showreelUrl);
  const showreelWrap = document.getElementById("showreel-wrap");
  if (embedUrl && settings.showreelHeading) {
    showreelWrap.appendChild(
      el(`
        <div class="showreel">
          <h2>${settings.showreelHeading}</h2>
          <div class="video-frame">
            <iframe src="${embedUrl}" title="${settings.showreelHeading}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      `)
    );
  }
}

renderHome().catch((err) => {
  console.error(err);
  const grid = document.getElementById("grid");
  if (grid) grid.innerHTML = `<div class="empty">Couldn't load projects.</div>`;
});
