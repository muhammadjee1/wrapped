/*
 * app.js — the story engine: builds the cards, wires tap / swipe / keyboard
 * navigation, drives the segmented progress bar, and replays the per-card
 * animations (number count-ups, growing bars) each time a card lands.
 */
(function () {
  const stage = document.getElementById("stage");
  const cardsLayer = document.getElementById("cards");
  const progress = document.getElementById("progress");

  let index = 0;
  const total = CARDS.length;
  // "still" mode (?still): skip animations so a screenshot shows the final card.
  const STILL = /(?:\?|&)still/.test(location.search);
  if (STILL) document.body.classList.add("still");

  // ---- build cards + progress segments ------------------------------------
  cardsLayer.innerHTML = CARDS.map((c) => c.render()).join("");
  const cardEls = Array.from(cardsLayer.querySelectorAll("[data-card]"));
  progress.innerHTML = CARDS.map(() => `<div class="seg"><i></i></div>`).join("");
  const segEls = Array.from(progress.children);

  // ---- count-up animation -------------------------------------------------
  function countUp(el, target, dur = 950) {
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
    // grow bars (shape of us) — small delay so the rise() reveal settles
    el.querySelectorAll(".bars .bar[data-h]").forEach((b, i) => {
      if (STILL) { b.style.height = b.getAttribute("data-h") + "%"; return; }
      b.style.height = "0%";
      setTimeout(() => (b.style.height = b.getAttribute("data-h") + "%"), 120 + i * 60);
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
    segEls.forEach((seg, k) => {
      seg.classList.toggle("done", k < index);
      seg.classList.toggle("active", k === index);
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

  // ---- go (optional #N deep-link to start on a given card) ----------------
  const startAt = parseInt((location.hash || "").replace("#", ""), 10);
  show(Number.isFinite(startAt) ? startAt : 0);
})();
