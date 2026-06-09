/*
 * frame.js — builds the scalloped, hand-drawn double border that wraps every
 * card (Austin Lau's signature stamp edge). Pure geometry, no deps.
 *
 * The card is locked to a fixed aspect ratio (see CSS --card-w/--card-h), so we
 * draw the path in a fixed viewBox and let it scale uniformly — scallops stay
 * round, never stretched.
 */
const FRAME = (() => {
  const W = 360;          // viewBox width  (matches --card aspect)
  const H = 760;          // viewBox height
  const M = 16;           // inset from the card edge
  const R = 18;           // corner radius
  const S = 13;           // scallop diameter (approx; evened out per edge)

  // A run of inward semicircle scallops along one straight edge.
  // (x0,y0)->(x1,y1) must be axis-aligned. `sweep` flips bulge direction.
  function scallops(x0, y0, x1, y1, sweep) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(2, Math.round(len / S));
    const d = len / n;
    const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
    const r = d / 2;
    let p = "";
    for (let i = 0; i < n; i++) {
      const nx = x0 + ux * d * (i + 1);
      const ny = y0 + uy * d * (i + 1);
      p += `A ${r} ${r} 0 0 ${sweep} ${nx.toFixed(2)} ${ny.toFixed(2)} `;
    }
    return p;
  }

  // Full wavy rounded-rect path. Scallops bulge inward (toward the center).
  function path() {
    const L = M, T = M, Rt = W - M, B = H - M;
    let p = `M ${L + R} ${T} `;
    p += scallops(L + R, T, Rt - R, T, 1);          // top  (bulge down/in)
    p += `Q ${Rt} ${T} ${Rt} ${T + R} `;            // TR corner
    p += scallops(Rt, T + R, Rt, B - R, 1);         // right (bulge left/in)
    p += `Q ${Rt} ${B} ${Rt - R} ${B} `;            // BR corner
    p += scallops(Rt - R, B, L + R, B, 1);          // bottom (bulge up/in)
    p += `Q ${L} ${B} ${L} ${B - R} `;              // BL corner
    p += scallops(L, B - R, L, T + R, 1);           // left  (bulge right/in)
    p += `Q ${L} ${T} ${L + R} ${T} `;              // TL corner
    p += "Z";
    return p;
  }

  // Build the SVG: a few stitch dashes at the very top, the scalloped frame,
  // and a faint inner line for the double-stroke look.
  function svg() {
    const d = path();
    return `
      <svg class="frame-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g class="frame-stitch">
          <line x1="${W * 0.30}" y1="6" x2="${W * 0.42}" y2="6"/>
          <line x1="${W * 0.46}" y1="6" x2="${W * 0.58}" y2="6"/>
          <line x1="${W * 0.62}" y1="6" x2="${W * 0.70}" y2="6"/>
        </g>
        <path class="frame-path" d="${d}"/>
      </svg>`;
  }

  return { svg };
})();
