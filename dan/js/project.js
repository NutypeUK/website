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

function getSlug() {
  // Works whether served as /projects/:slug (via redirect) or /project.html?slug=:slug
  const params = new URLSearchParams(location.search);
  if (params.get("slug")) return params.get("slug");
  const parts = location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

async function renderProject() {
  const slug = getSlug();
  const [settings, data] = await Promise.all([
    loadJSON("/dan/content/settings.json"),
    loadJSON("/dan/content/projects.json"),
  ]);

  const project = (data.projects || []).find((p) => p.slug === slug);
  if (!project) throw new Error(`Project not found: ${slug}`);

  renderLogo(document.getElementById("logo"), settings);

  document.title = `${project.title} — ${settings.siteName}`;
  document.getElementById("case-category").textContent = project.category || "";
  document.getElementById("case-title").textContent = project.title;
  document.getElementById("case-body").textContent = project.body || project.summary || "";

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  (project.images || []).forEach((src, i) => {
    gallery.appendChild(
      el(`<img class="${i === 0 ? "full" : ""}" src="${src}" alt="${project.title} — image ${i + 1}" loading="lazy">`)
    );
  });

  const footerContact = document.getElementById("footer-contact");
  footerContact.innerHTML = `<a href="mailto:${settings.email}">${settings.email}</a>${settings.phone ? " · " + settings.phone : ""}`;
}

renderProject().catch((err) => {
  console.error(err);
  document.getElementById("case-title").textContent = "Project not found";
  document.getElementById("case-body").textContent = "This project doesn't exist or isn't published.";
});
