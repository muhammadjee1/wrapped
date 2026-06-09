/*
 * app.js — the story engine: builds the cards, wires tap / swipe / keyboard
 * navigation, scales the fixed canvas to fit the viewport, and replays the
 * per-card entrance animations (count-ups, growing bars) each time a card lands.
 */
(function () {
  const stage = document.getElementById("stage");
  const cardsLayer = document.getElementById("cards");

  let index = 0;
  const total = CARDS.length;
  // "still" mode (?still): skip animations so a screenshot shows the final card.
  const STILL = /(?:\?|&)still/.test(location.search);
  if (STILL) document.body.classList.add("still");

  // ---- build cards --------------------------------------------------------
  cardsLayer.innerHTML = CARDS.map((c) => c.render()).join("");
  const cardEls = Array.from(cardsLayer.querySelectorAll("[data-card]"));

  // ---- count-up animation -------------------------------------------------
  function countUp(el, target, dur = 620) {
    if (STILL) { el.textContent = Math.round(target).toLocaleString("en-US"); return; }
    const start = performance.now();
    const fmt = (v) => Math.round(v).toLocaleString("en-US");
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = fmt(target * e);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  // ---- activate a card: replay its animations -----------------------------
  function animateCard(el) {
    el.querySelectorAll("[data-count]").forEach((s) => {
      countUp(s, +s.getAttribute("data-count"));
    });
    // grow bars (shape of us)
    el.querySelectorAll(".bars .bar[data-h]").forEach((b, i) => {
      if (STILL) { b.style.height = b.getAttribute("data-h") + "%"; return; }
      b.style.height = "0%";
      setTimeout(() => (b.style.height = b.getAttribute("data-h") + "%"), 120 + i * 55);
    });
    // grow channel fills
    el.querySelectorAll(".chan .fill[data-w]").forEach((f, i) => {
      if (STILL) { f.style.width = f.getAttribute("data-w") + "%"; return; }
      f.style.width = "0%";
      setTimeout(() => (f.style.width = f.getAttribute("data-w") + "%"), 200 + i * 90);
    });
  }

  function show(i) {
    index = Math.max(0, Math.min(total - 1, i));
    cardEls.forEach((el, k) => {
      const active = k === index;
      el.classList.toggle("is-active", active);
      if (active) {
        // restart the reveal/animation by forcing reflow on the reveal nodes
        void el.offsetWidth;
        animateCard(el);
      }
    });
  }

  const next = () => show(index + 1);
  const prev = () => show(index - 1);

  // ---- tap zones ----------------------------------------------------------
  document.getElementById("tap-prev").addEventListener("click", prev);
  document.getElementById("tap-next").addEventListener("click", next);

  // restart button (event delegation — it lives inside a card)
  cardsLayer.addEventListener("click", (e) => {
    if (e.target.closest("[data-restart]")) {
      e.stopPropagation();
      show(0);
    }
  });

  // ---- keyboard -----------------------------------------------------------
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  });

  // ---- swipe --------------------------------------------------------------
  let sx = 0, sy = 0, t0 = 0;
  stage.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Date.now() - t0 < 600 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // ---- scale the fixed 360x760 stage to fit any viewport ------------------
  // Uniform scale-to-fit, sized to the *visible* viewport (visualViewport),
  // which excludes iOS Safari's address/search bar — so the card centers in the
  // visible area and the bottom bar never covers it. Extra bottom margin keeps
  // it clear of the home indicator too.
  const _q = new URLSearchParams(location.search);
  const _fvw = +_q.get("vw"), _fvh = +_q.get("vh"); // test override for headless verification
  function fit() {
    const vv = window.visualViewport;
    const vw = _fvw || (vv ? vv.width : window.innerWidth);
    const vh = _fvh || (vv ? vv.height : window.innerHeight);
    document.body.style.height = vh + "px"; // center within the visible area only
    const padX = 14, padTop = 14, padBottom = 34;
    const w = vw - padX * 2;
    const h = vh - padTop - padBottom;
    const s = Math.max(0.2, Math.min(w / 360, h / 760));
    // bias up by half the top/bottom padding gap so the bottom always clears
    // Safari's search bar / the home indicator.
    const bias = (padBottom - padTop) / 2;
    stage.style.transform = `translateY(${-bias}px) scale(${s})`;
  }
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", () => { fit(); setTimeout(fit, 250); });
  window.addEventListener("load", fit);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fit);
    window.visualViewport.addEventListener("scroll", fit);
  }
  fit();
  setTimeout(fit, 300); // catch iOS' late first-paint viewport report

  // ---- go (optional #N deep-link to start on a given card) ----------------
  const startAt = parseInt((location.hash || "").replace("#", ""), 10);
  show(Number.isFinite(startAt) ? startAt : 0);
})();
