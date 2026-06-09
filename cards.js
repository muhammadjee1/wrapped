/*
 * cards.js — one render function per story card. Each returns an HTML string
 * for the card body; the chrome (frame, progress, heart, tap zones) is added
 * by app.js. All numbers come from window.WRAPPED (data.js).
 */
const CARDS = (() => {
  const D = window.WRAPPED;
  const n = (x) => x.toLocaleString("en-US");
  const heatColors = ["--h0", "--h1", "--h2", "--h3", "--h4"];
  const WD_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const WD_LABEL = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  // ---- heatmap (texts) ----------------------------------------------------
  function heatMatrix(byHour, byWeekday, cross) {
    if (cross) return cross; // real 7x24 (Sun..Sat)
    const total = byHour.reduce((a, b) => a + b, 0) || 1;
    return byWeekday.map((wd) => byHour.map((h) => (wd * h) / total));
  }
  function bucket(t) {
    if (t <= 0) return 0;
    if (t < 0.12) return 1;
    if (t < 0.30) return 2;
    if (t < 0.58) return 3;
    return 4;
  }
  function heatRows(byHour, byWeekday, cross) {
    const m = heatMatrix(byHour, byWeekday, cross);
    const max = Math.max(...m.flat()) || 1;
    return WD_ORDER.map((wd, ri) => {
      const cells = m[wd].map((v, h) => {
        const b = bucket(v / max);
        const delay = (ri * 24 + h) * 4;
        return `<span class="cell" style="background:var(${heatColors[b]});animation-delay:${delay}ms"></span>`;
      }).join("");
      return `<div class="row"><span class="rl">${WD_LABEL[ri]}</span><div class="cells">${cells}</div></div>`;
    }).join("");
  }
  const heatAxis = `<div class="axis"><span style="grid-column:1">12a</span><span style="grid-column:7">6a</span><span style="grid-column:13">12p</span><span style="grid-column:19">6p</span><span style="grid-column:24">11p</span></div>`;
  const heatLegend = `<div class="legend reveal" style="--i:3">quiet ${heatColors.map((c) => `<i style="background:var(${c})"></i>`).join("")} loud</div>`;

  return [
    // 0 — COVER
    {
      id: "cover",
      render: () => `
        <div class="card cover" data-card>
          <div class="reveal kicker" style="--i:0">A Relationship Wrapped</div>
          <div class="reveal names" style="--i:1">${D.people.me}<span class="amp">&amp;</span>${D.people.her}</div>
          <div class="reveal win" style="--i:2">OUR FIRST SIX MONTHS · ${D.window.label}</div>
          <div class="reveal tapcue" style="--i:3">tap to begin →</div>
        </div>`,
    },

    // 1 — THE RECEIPTS (totals only)
    {
      id: "receipts",
      render: () => {
        const t = D.totals;
        const tile = (v, k, i) =>
          `<div class="tile reveal" style="--i:${i}"><div class="v num"><span data-count="${v}">0</span></div><div class="k">${k}</div></div>`;
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">By the numbers</div>
          <div class="reveal title" style="--i:0">The receipts.</div>
          <div class="grid">
            ${tile(t.messages, "Messages", 1)}
            ${tile(t.daysTalked, "Days talked", 2)}
            ${tile(t.dates, "Dates", 3)}
            ${tile(t.photos, "Photos shared", 4)}
            ${tile(t.reels, "Reels traded", 5)}
            ${tile(t.tiktoks, "TikToks traded", 6)}
          </div>
          <div class="reveal receipts-note" style="--i:7">${D.receiptsNote}</div>
        </div>`;
      },
    },

    // 2 — HOW IT STARTED (Instagram, he went first)
    {
      id: "started",
      render: () => {
        const f = D.firstText;
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">How it started · ${f.where}</div>
          <div class="reveal title" style="--i:0">He texted first.</div>
          <div class="reveal narrate" style="--i:1">${f.dateLabel}</div>
          <div class="spacer"></div>
          <div class="chat">
            <div class="bubble me reveal" style="--i:2"><span class="who">${D.people.me}</span>${f.me1}</div>
            <div class="bubble her reveal" style="--i:3"><span class="who">${D.people.her}</span>${f.her1}</div>
            <div class="bubble me reveal" style="--i:4"><span class="who">${D.people.me}</span>${f.me2}</div>
          </div>
          <div class="spacer"></div>
          <div class="reveal narrate" style="--i:5">${f.note}</div>
        </div>`;
      },
    },

    // 3 — THE SHAPE OF US (combined messages per month)
    {
      id: "shape",
      render: () => {
        const ms = D.shapeMonths;
        const maxMsg = Math.max(...ms.map((m) => m.msgs));
        const peakIdx = ms.findIndex((m) => m.msgs === maxMsg);
        const msgBars = ms.map((m, i) => {
          const h = Math.round((m.msgs / maxMsg) * 100);
          const cls = (i === peakIdx ? "peak " : "") + (m.partial ? "partial" : "");
          return `<div class="col ${cls}"><div class="bar" data-h="${h}"></div><div class="lbl">${m.label}</div></div>`;
        }).join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">Messages per month · all platforms</div>
          <div class="reveal title" style="--i:0">The shape of us.</div>
          <div class="reveal narrate" style="--i:1">${D.shapeNote}</div>
          <div class="spacer"></div>
          <div class="bars">${msgBars}</div>
          <div class="baseline"></div>
          <div class="peakcaption"><span>busiest: ${ms[peakIdx].label}</span><span>${n(ms[peakIdx].msgs)} msgs</span></div>
        </div>`;
      },
    },

    // 4 — WHEN WE TEXT
    {
      id: "when-text",
      render: () => `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">When we text</div>
          <div class="reveal title" style="--i:0">The ${D.peakHourLabel} spike.</div>
          <div class="reveal narrate" style="--i:1">${D.whenNote}</div>
          <div class="heat reveal" style="--i:2">${heatRows(D.byHour, D.byWeekday, D.hourWeekday)}${heatAxis}</div>
          ${heatLegend}
          <div class="heat-foot reveal" style="--i:4">
            <div class="box"><div class="k">Busiest hour</div><div class="v">${D.peakHourLabel}</div></div>
            <div class="box"><div class="k">All-time texts</div><div class="v num"><span data-count="${D.textsAllTime}">0</span></div></div>
          </div>
        </div>`,
    },

    // 5 — THE VOCABULARY (emoji)
    {
      id: "vocab",
      render: () => {
        const top = D.topEmoji.slice(0, 9);
        const cells = top.map((e, i) =>
          `<div class="emoji-cell reveal" style="--i:${i + 2}"><div class="e">${e.emoji}</div><div class="c num">${n(e.count)}</div></div>`
        ).join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">What we say</div>
          <div class="reveal title" style="--i:0">The vocabulary.</div>
          <div class="hero-stat reveal" style="--i:1">
            <div class="lead">we sent</div>
            <div class="big num"><span data-count="${D.emojisTotal}">0</span></div>
            <div class="lead sm">emojis. ${top[0].emoji} won, ${n(top[0].count)} times.</div>
          </div>
          <div class="eyebrow reveal" style="--i:2">Top emoji</div>
          <div class="emoji-grid">${cells}</div>
        </div>`;
      },
    },

    // 7 — WORDS OF ADORATION
    {
      id: "adoration",
      render: () => {
        const a = D.adoration;
        const cells = a.top.slice(0, 9).map((w, i) =>
          `<div class="adore-cell reveal" style="--i:${i + 2}"><div class="w">${w.word}</div><div class="c num">${n(w.count)}</div></div>`
        ).join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">What we call each other</div>
          <div class="reveal title" style="--i:0">Words of adoration.</div>
          <div class="reveal narrate" style="--i:1">${a.note}</div>
          <div class="adore-grid">${cells}</div>
          <div class="reveal adore-foot" style="--i:6">
            <b>He</b> says ${a.hisForHer.join(" · ")}. <b>She</b> says ${a.hersForHim.join(" · ")}.
            And “${a.shared.word}”? You’ve said it <span class="num">${n(a.shared.count)}</span> times.
          </div>
        </div>`;
      },
    },

    // 8 — EVERY CHANNEL
    {
      id: "channels",
      render: () => {
        const max = Math.max(...D.channels.map((c) => c.value));
        const rows = D.channels.map((c, i) => {
          const w = Math.round((c.value / max) * 100);
          return `
            <div class="row reveal" style="--i:${i + 2}">
              <div class="meta"><div class="name">${c.name}</div><div class="val num">${n(c.value)}</div></div>
              <div class="track"><div class="fill" data-w="${w}"></div></div>
            </div>
            <div class="role reveal" style="--i:${i + 2}">${c.role}</div>`;
        }).join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">Breadth, not depth</div>
          <div class="reveal title sm" style="--i:0">Every channel we talked through.</div>
          <div class="reveal narrate" style="--i:1">${D.channelsNote}</div>
          <div style="height:18px"></div>
          <div class="chan">${rows}</div>
        </div>`;
      },
    },

    // 8 — THE SNAPS (totals only)
    {
      id: "snaps",
      render: () => {
        const s = D.snaps;
        return `
        <div class="card single" data-card>
          <div class="reveal eyebrow center" style="--i:0">On Snapchat</div>
          <div class="reveal title center" style="--i:0">A 114-day streak.</div>
          <div class="reveal center" style="--i:1; margin-top:14px"><span class="big num"><span data-count="${s.total}">0</span></span></div>
          <div class="reveal unit center" style="--i:2">snaps exchanged</div>
          <div class="statrow reveal" style="--i:3">
            <div class="s"><div class="v num">${s.photos}</div><div class="k">Photos</div></div>
            <div class="s"><div class="v num">${s.videos}</div><div class="k">Videos</div></div>
            <div class="s"><div class="v num">${s.streak}</div><div class="k">Day streak</div></div>
          </div>
          <div class="reveal narrate center" style="--i:4; margin-top:20px; align-self:center">${s.note}</div>
        </div>`;
      },
    },

    // 11 — 14 DATES (places)
    {
      id: "dates",
      render: () => {
        const chips = D.datePlaces.map((p, i) =>
          `<span class="chip ${i % 4 === 0 ? "gold" : ""} reveal" style="--i:${i + 2}">${p}</span>`
        ).join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">In person</div>
          <div class="reveal title" style="--i:0">${D.datesSummary.all} dates.</div>
          <div class="reveal narrate" style="--i:1">${D.datesSummary.inPerson} in person, ${D.datesSummary.virtual} over FaceTime — from a first arcade night to a lakeside picnic.</div>
          <div class="spacer"></div>
          <div class="places">${chips}</div>
        </div>`;
      },
    },

    // 12 — THE TIMELINE (all 14 dates; milestones highlighted, rest muted)
    {
      id: "timeline",
      render: () => {
        const items = D.timeline.map((m, i) =>
          `<div class="tl-item ${m.tier}" style="--i:${i}">
            <div class="d num">${m.date}</div>
            <div class="l">${m.label}</div>
            <div class="s">${m.sub}</div>
          </div>`
        ).join("");
        return `
        <div class="card timeline-card" data-card>
          <div class="reveal eyebrow" style="--i:0">Every date · the firsts in colour</div>
          <div class="reveal title" style="--i:0">The milestones.</div>
          <div class="timeline">${items}</div>
        </div>`;
      },
    },

    // 13 — MADE IT OFFICIAL
    {
      id: "official",
      render: () => {
        const o = D.official;
        return `
        <div class="card single closing" data-card>
          <div class="reveal eyebrow center" style="--i:0">${o.dateLabel} · ${o.place}</div>
          <div class="reveal said-yes" style="--i:1">${o.line}</div>
          <div class="reveal narrate center" style="--i:2; margin-top:22px; align-self:center">${o.note}</div>
        </div>`;
      },
    },

    // 14 — CLOSING
    {
      id: "closing",
      render: () => `
        <div class="card closing" data-card>
          <div class="reveal eyebrow" style="--i:0">${D.window.label}</div>
          <div class="reveal big" style="--i:1">${D.closing.headline}</div>
          <div class="reveal sub" style="--i:2">${D.closing.sub}</div>
          <button class="restart reveal" style="--i:3" data-restart>↺ watch again</button>
        </div>`,
    },
  ];
})();
