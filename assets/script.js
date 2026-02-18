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
  const toggle = document.querySelector(".nav-toggle");
  const linksWrap = document.querySelector(".nav-links");

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
  });

  // optional: beim Klick auf Link wieder schließen
  if (linksWrap) {
    linksWrap.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.textContent = "☰";
      }
    });
  }
});
