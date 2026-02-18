// ===== Galerie Daten (anpassen, wenn du andere Pfade hast) =====
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
  // ===== Mobile Nav Toggle =====
  {
    const nav = document.querySelector(".nav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    if (nav && toggle && links) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("open");
        toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
      });

      links.addEventListener("click", (e) => {
        if (e.target && e.target.tagName === "A") {
          nav.classList.remove("open");
          toggle.textContent = "☰";
        }
      });
    }
  }

  // ===== Accordion (Leistungen) =====
  {
    const buttons = document.querySelectorAll(".acc-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".acc-item");
        if (item) item.classList.toggle("active");
      });
    });
  }

  // ===== Galerie (Tabs + Grid + Lightbox) =====
  {
    const tabs = document.getElementById("galleryTabs");
    const grid = document.getElementById("galleryGrid");

    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbTitle = document.getElementById("lbTitle");
    const lbCount = document.getElementById("lbCount");
    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");

    if (
      tabs &&
      grid &&
      lightbox &&
      lbImg &&
      lbTitle &&
      lbCount &&
      lbClose &&
      lbPrev &&
      lbNext
    ) {
      let currentCat =
        tabs.querySelector(".tab.active")?.dataset.cat ||
        Object.keys(GALLERY)[0] ||
        "";
      let currentIndex = 0;

      const itemsForCat = () => GALLERY[currentCat] || [];

      function renderGrid() {
        grid.dataset.cat = currentCat;
        grid.innerHTML = "";

        const items = itemsForCat();
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
        const items = itemsForCat();
        if (!items.length) return;

        const item = items[currentIndex];
        lbImg.src = item.src;
        lbTitle.textContent = item.title || "";
        lbCount.textContent = `${currentIndex + 1} / ${items.length}`;
      }

      function openLightbox(index) {
        const items = itemsForCat();
        if (!items.length) return;

        currentIndex = index;
        updateLightbox();
        lightbox.classList.add("open");
      }

      function closeLightbox() {
        lightbox.classList.remove("open");
      }

      function showNext(dir) {
        const items = itemsForCat();
        if (!items.length) return;

        currentIndex = (currentIndex + dir + items.length) % items.length;
        updateLightbox();
      }

      tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab");
        if (!btn) return;

        tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");

        currentCat = btn.dataset.cat || currentCat;
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
  }

  // ===== Bewertungen laden (assets/bewertungen.json) =====
  {
    const list = document.getElementById("reviewsList");
    if (list) {
      const stars = (n) => {
        const num = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
        return "★★★★★".slice(0, num) + "☆☆☆☆☆".slice(0, 5 - num);
      };

      const esc = (s) =>
        String(s ?? "").replace(/[&<>"]/g, (c) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
        }[c]));

      fetch("assets/bewertungen.json")
        .then((r) => r.json())
        .then((items) => {
          list.innerHTML = (items || [])
            .map((it) => {
              const name = esc(it.name || "Anonym");
              const txt = esc(it.text || it.message || "");
              const evt = esc(it.event || "");
              const date = esc(it.date || "");
              const starStr = stars(it.stars);
              const aria = `${parseInt(it.stars, 10) || 0} von 5 Sternen`;
              const meta = [evt, date].filter(Boolean).join(" • ");

              const metaHtml = meta
                ? `<small style="opacity:.75">Event: ${esc(meta)}</small>`
                : "";

              return `
<article class="review">
  <div class="review-head">
    <strong>${name}</strong>
    <span class="stars" aria-label="${aria}">${starStr}</span>
  </div>
  <p>${txt}</p>
  ${metaHtml}
</article>`;
            })
            .join("\n");
        })
        .catch(() => {
          list.innerHTML =
            '<p style="opacity:.8">Bewertungen konnten nicht geladen werden.</p>';
        });
    }
  }

  // ===== Bewertungsformular (Sterne + Submit -> Danke-Seite) =====
  {
    const form = document.getElementById("reviewForm");
    if (form) {
      const starsWrap = form.querySelector(".star-rating");
      const starBtns = starsWrap ? Array.from(starsWrap.querySelectorAll(".star")) : [];
      const starsInput = form.querySelector("#starsValue");
      const status = document.getElementById("reviewStatus");

      const setStars = (val) => {
        const n = Math.max(1, Math.min(5, parseInt(val, 10) || 5));
        if (starsInput) starsInput.value = String(n);

        starBtns.forEach((b) => {
          const v = parseInt(b.getAttribute("data-value") || "0", 10);
          b.classList.toggle("is-on", v <= n);
          b.setAttribute("aria-pressed", v <= n ? "true" : "false");
        });
      };

      // init
      setStars(starsInput ? starsInput.value : 5);

      starBtns.forEach((btn) => {
        btn.addEventListener("click", () => setStars(btn.getAttribute("data-value")));
        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setStars(btn.getAttribute("data-value"));
          }
        });
      });

      // Formspree submit via fetch + Redirect
      form.addEventListener("submit", async (e) => {
        const action = (form.getAttribute("action") || "").trim();
        if (!action) return;

        e.preventDefault();
        if (status) status.textContent = "Senden…";

        try {
          const fd = new FormData(form);
          if (!fd.get("stars")) fd.set("stars", (starsInput && starsInput.value) || "5");

          const res = await fetch(action, {
            method: "POST",
            body: fd,
            headers: { Accept: "application/json" },
          });

          if (res.ok) {
            if (status) status.textContent = "Gesendet ✓";
            window.location.href = "danke.html";
          } else {
            if (status) status.textContent = "Senden fehlgeschlagen. Bitte später erneut versuchen.";
          }
        } catch (err) {
          if (status) status.textContent = "Netzwerkfehler. Bitte später erneut versuchen.";
        }
      });
    }
  }

  // ===== Kontakt: Stageflow Custom Select (nur Desktop, nur Kontaktseite) =====
  {
    const isContact = document.body.classList.contains("page-contact");
    if (isContact) {
      const isDesktop = () => window.matchMedia("(min-width: 801px)").matches;

      const closeAll = (except = null) => {
        document.querySelectorAll(".sf-select.open").forEach((w) => {
          if (w !== except) w.classList.remove("open");
          const trig = w.querySelector(".sf-trigger");
          if (trig) trig.setAttribute("aria-expanded", "false");
        });
      };

      const build = (wrap) => {
        const select = wrap.querySelector("select");
        if (!select) return;

        if (wrap.dataset.sfBuilt === "1") return;
        wrap.dataset.sfBuilt = "1";

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "sf-trigger";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");

        const label = document.createElement("span");
        const arrow = document.createElement("span");
        arrow.className = "sf-arrow";

        trigger.appendChild(label);
        trigger.appendChild(arrow);

        const menu = document.createElement("div");
        menu.className = "sf-menu";
        menu.setAttribute("role", "listbox");

        const opts = Array.from(select.options);

        const syncLabel = () => {
          const opt = select.options[select.selectedIndex];
          label.textContent = opt ? opt.textContent : "";
        };

        const rebuildOptions = () => {
          menu.innerHTML = "";

          opts.forEach((opt, idx) => {
            const div = document.createElement("div");
            div.className = "sf-option";
            div.setAttribute("role", "option");
            div.dataset.index = String(idx);
            div.textContent = opt.textContent;

            if (idx === 0 && (opt.value === "" || opt.disabled)) {
              div.classList.add("is-placeholder");
            }

            const selected = select.selectedIndex === idx;
            div.setAttribute("aria-selected", selected ? "true" : "false");

            div.addEventListener("click", () => {
              select.selectedIndex = idx;
              select.dispatchEvent(new Event("change", { bubbles: true }));

              syncLabel();
              closeAll();
              trigger.focus();
            });

            menu.appendChild(div);
          });
        };

        trigger.addEventListener("click", () => {
          const willOpen = !wrap.classList.contains("open");
          closeAll(wrap);
          wrap.classList.toggle("open", willOpen);
          trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
          if (willOpen) rebuildOptions();
        });

        document.addEventListener("click", (e) => {
          if (!wrap.contains(e.target)) {
            wrap.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
          }
        });

        select.addEventListener("change", () => {
          syncLabel();
          menu.querySelectorAll(".sf-option").forEach((d, i) => {
            d.setAttribute("aria-selected", select.selectedIndex === i ? "true" : "false");
          });
        });

        syncLabel();
        wrap.appendChild(trigger);
        wrap.appendChild(menu);
      };

      const init = () => {
        if (!isDesktop()) {
          closeAll();
          return;
        }
        document.querySelectorAll(".sf-select").forEach(build);
      };

      init();

      window.addEventListener("resize", () => {
        closeAll();
        init();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAll();
      });
    }
  }

  // ===== Kontaktformular (Fallback mailto nur wenn action="#") =====
  {
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        const action = (form.getAttribute("action") || "").trim();
        if (action && action !== "#") return;

        e.preventDefault();
        const data = new FormData(form);

        let body = "";
        data.forEach((value, key) => {
          body += `${key}: ${value}\n`;
        });

        window.location.href =
          "mailto:info@stageflow-eventtechnik.de?subject=" +
          encodeURIComponent("Eventanfrage") +
          "&body=" +
          encodeURIComponent(body);
      });
    }
  }
});
