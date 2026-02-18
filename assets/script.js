const GALLERY = {
  geburtstag50: [
    { src: "assets/gallery/geburtstag50/1.jpg", title: "Geburtstag 50" },
    { src: "assets/gallery/geburtstag50/2.jpg", title: "Geburtstag 50" },
  ],

  hochzeit: [
    { src: "assets/gallery/hochzeit/1.jpg", title: "Hochzeit" },
    { src: "assets/gallery/hochzeit/2.jpg", title: "Hochzeit" },
  ],

  firma: [
    { src: "assets/gallery/firma/1.jpg", title: "Firmenfeier" },
    { src: "assets/gallery/firma/2.jpg", title: "Firmenfeier" },
    { src: "assets/gallery/firma/3.jpg", title: "Firmenfeier" },
    { src: "assets/gallery/firma/4.jpg", title: "Firmenfeier" },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  // ===== Galerie (nur wenn Galerie-Elemente vorhanden sind) =====
  const tabs = document.getElementById("galleryTabs");
  const grid = document.getElementById("galleryGrid");

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbCount = document.getElementById("lbCount");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  if (tabs && grid && lightbox && lbImg && lbTitle && lbCount && lbClose && lbPrev && lbNext) {
    let currentCat = tabs.querySelector(".tab.active")?.dataset.cat || Object.keys(GALLERY)[0] || "";
    let currentIndex = 0;

    function renderGrid() {
      grid.dataset.cat = currentCat;
      grid.innerHTML = "";

      const items = GALLERY[currentCat] || [];
      items.forEach((item, idx) => {
        const el = document.createElement("button");
        el.className = "g-item";
        el.type = "button";
        el.innerHTML = `
          <img src="${item.src}" alt="${item.title || "Event Bild"}" loading="lazy">
          <span class="g-overlay">${item.title || ""}</span>
        `;
        el.addEventListener("click", () => openLightbox(idx));
        grid.appendChild(el);
      });
    }

    function updateLightbox() {
      const items = GALLERY[currentCat] || [];
      if (!items.length) return;
      const item = items[currentIndex];

      lbImg.src = item.src;
      lbTitle.textContent = item.title || "";
      lbCount.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function openLightbox(index) {
      const items = GALLERY[currentCat] || [];
      if (!items.length) return;

      currentIndex = index;
      updateLightbox();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lbImg.src = "";
    }

    function showNext(delta) {
      const items = GALLERY[currentCat] || [];
      if (!items.length) return;

      currentIndex = (currentIndex + delta + items.length) % items.length;
      updateLightbox();
    }

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;

      tabs.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      currentCat = btn.dataset.cat;
      currentIndex = 0;
      renderGrid();
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => showNext(-1));
    lbNext.addEventListener("click", () => showNext(1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showNext(-1);
      if (e.key === "ArrowRight") showNext(1);
    });

    renderGrid();
  }

  // ===== Accordion (Leistungen) =====
  document.querySelectorAll(".acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("active");
    });
  });
});


// ===== Mobile Nav Toggle =====
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (nav && toggle && links) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
    });

    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.textContent = "☰";
      }
    });
  }
});


// ===== Review Form (klickbare Sterne + Danke-Seite) =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reviewForm");
  if (!form) return;

  const starsWrap = form.querySelector(".star-rating");
  const stars = form.querySelectorAll(".star");
  const starsValue = form.querySelector("#starsValue");
  const status = form.querySelector("#reviewStatus");

  function setStars(val){
    const v = Math.max(1, Math.min(5, Number(val) || 5));
    if (starsValue) starsValue.value = String(v);
    stars.forEach((btn) => {
      const on = Number(btn.dataset.value) <= v;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  // Default: 5 Sterne
  setStars(starsValue?.value || 5);

  stars.forEach((btn) => {
    btn.setAttribute("role","radio");
    btn.addEventListener("click", () => setStars(btn.dataset.value));
  });

  // Tastatur: Pfeile links/rechts, 1-5
  starsWrap?.addEventListener("keydown", (e) => {
    const current = Number(starsValue?.value || 5);
    if (e.key === "ArrowLeft") { e.preventDefault(); setStars(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); setStars(current + 1); }
    if (/^[1-5]$/.test(e.key)) { e.preventDefault(); setStars(e.key); }
  });

  // Formspree per AJAX abschicken -> Danke-Seite
  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action") || "";
    if (!action.includes("formspree.io")) return;

    e.preventDefault();
    if (status) status.textContent = "Wird gesendet…";

    try{
      const data = new FormData(form);
      const res = await fetch(action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (res.ok){
        window.location.href = "danke.html";
      } else {
        if (status) status.textContent = "Ups – das hat nicht geklappt. Bitte später nochmal versuchen.";
      }
    } catch(err){
      if (status) status.textContent = "Keine Verbindung. Bitte prüfe dein Internet und versuch es erneut.";
    }
  });
});


// ===== Bewertungen (JSON) laden und anzeigen =====
(function () {
  const list = document.getElementById("reviewsList");
  if (!list) return;

  fetch("assets/bewertungen.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("load failed");
      return r.json();
    })
    .then(items => {
      if (!Array.isArray(items) || items.length === 0){
        list.innerHTML = '<p style="opacity:.8">Noch keine Bewertungen vorhanden.</p>';
        return;
      }

      // Neueste zuerst (wenn date vorhanden)
      items.sort((a,b) => (b.date || "").localeCompare(a.date || ""));

      const starText = (n) => {
        const num = Math.max(0, Math.min(5, parseInt(n,10) || 0));
        return "★★★★★☆☆☆☆☆".slice(5 - num, 10 - num); // produces correct? Let's simpler below
      };

      const stars = (n) => {
        const num = Math.max(0, Math.min(5, parseInt(n,10) || 0));
        return "★★★★★".slice(0, num) + "☆☆☆☆☆".slice(0, 5 - num);
      };

      const esc = (s) => String(s ?? "").replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

      list.innerHTML = items.map(it => {
        const name = esc(it.name || "Anonym");
        const txt = esc(it.text || it.message || "");
        const evt = esc(it.event || "");
        const date = esc(it.date || "");
        const starStr = stars(it.stars);
        const aria = `${parseInt(it.stars,10)||0} von 5 Sternen`;

        const meta = [evt, date].filter(Boolean).join(" • ");
        return `
<article class="review">
  <div class="review-head">
    <strong>${name}</strong>
    <span class="stars" aria-label="${aria}">${starStr}</span>
  </div>
  <p>${txt}</p>
  ${meta ? `<small>Event: ${meta}</small>` : ``}
</article>`;
      }).join("\n");
    })
    .catch(() => {
      list.innerHTML = '<p style="opacity:.8">Bewertungen konnten nicht geladen werden.</p>';
    });
})();
