/*
 * cards.js — one render function per story card. Each returns an HTML string
 * for the card body; the chrome (frame, progress, heart, tap zones) is added
 * by app.js. All numbers come from window.WRAPPED (data.js).
 */
const CARDS = (() => {
  const D = window.WRAPPED;
  const n = (x) => x.toLocaleString("en-US");
  const heatColors = ["--h0", "--h1", "--h2", "--h3", "--h4"];

  // weekday rows in display order Mon..Sun; data.byWeekday is Sun..Sat
  const WD_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const WD_LABEL = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  function heatMatrix() {
    if (D.hourWeekday) return D.hourWeekday; // real 7x24 (Sun..Sat) when merge provides it
    // Approximate from the two real marginals (outer product, normalised).
    const total = D.byHour.reduce((a, b) => a + b, 0);
    return D.byWeekday.map((wd) =>
      D.byHour.map((h) => (wd * h) / total)
    );
  }

  function bucket(v, max) {
    if (v <= 0) return 0;
    const t = v / max;
    if (t < 0.12) return 1;
    if (t < 0.30) return 2;
    if (t < 0.58) return 3;
    return 4;
  }

  // ---- card definitions ---------------------------------------------------
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

    // 1 — THE RECEIPTS
    {
      id: "receipts",
      render: () => {
        const t = D.totals;
        const mePct = Math.round((t.meMessages / t.messages) * 1000) / 10;
        const herPct = Math.round((t.herMessages / t.messages) * 1000) / 10;
        const tile = (v, k, i) =>
          `<div class="tile reveal" style="--i:${i}"><div class="v num">${v}</div><div class="k">${k}</div></div>`;
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">By the numbers</div>
          <div class="reveal title" style="--i:0">The receipts.</div>
          <div class="grid">
            ${tile(`<span data-count="${t.messages}">0</span>`, "Messages", 1)}
            ${tile(`<span data-count="${t.daysTalked}">0</span>`, "Days talked", 2)}
            ${tile(`<span data-count="${t.dates}">0</span>`, "Dates", 3)}
            ${tile(`<span data-count="${t.photos}">0</span>`, "Photos shared", 4)}
            ${tile(`<span data-count="${t.reels}">0</span>`, "Reels traded", 5)}
            ${tile(`<span data-count="${t.tapbacks}">0</span>`, "Tapbacks", 6)}
          </div>
          <div class="split reveal" style="--i:7">
            <div class="track">
              <div class="me" style="width:${mePct}%"></div>
              <div class="her" style="width:${herPct}%"></div>
            </div>
            <div class="labels"><span>${D.people.me} · ${mePct}%</span><span>${herPct}% · ${D.people.her}</span></div>
          </div>
        </div>`;
      },
    },

    // 2 — HOW IT STARTED
    {
      id: "started",
      render: () => {
        const f = D.firstText;
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">How it started</div>
          <div class="reveal title" style="--i:0">She texted first.</div>
          <div class="reveal narrate" style="--i:1">${f.dateLabel}</div>
          <div class="spacer"></div>
          <div class="chat">
            <div class="bubble her reveal" style="--i:2"><span class="who">${D.people.her}</span>${f.her}</div>
            <div class="gap reveal" style="--i:3">— ${f.gapLabel} —</div>
            <div class="bubble me reveal" style="--i:4"><span class="who">${D.people.me}</span>${f.me}</div>
          </div>
          <div class="spacer"></div>
          <div class="reveal narrate" style="--i:5">${f.note}</div>
        </div>`;
      },
    },

    // 3 — THE SHAPE OF US
    {
      id: "shape",
      render: () => {
        const max = Math.max(...D.months.map((m) => m.value));
        const peakIdx = D.months.findIndex((m) => m.value === max);
        const cols = D.months
          .map((m, i) => {
            const h = Math.round((m.value / max) * 100);
            const cls = (i === peakIdx ? "peak " : "") + (m.partial ? "partial" : "");
            return `<div class="col ${cls}"><div class="bar" data-h="${h}"></div><div class="lbl">${m.label}</div></div>`;
          })
          .join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">Messages per month</div>
          <div class="reveal title" style="--i:0">The shape of us.</div>
          <div class="reveal narrate" style="--i:1">${D.shapeNote}</div>
          <div class="spacer"></div>
          <div class="bars">${cols}</div>
          <div class="baseline"></div>
          <div class="peakcaption"><span>busiest: ${D.months[peakIdx].label}</span><span>${n(max)} msgs</span></div>
        </div>`;
      },
    },

    // 4 — WHEN WE TEXT
    {
      id: "when",
      render: () => {
        const m = heatMatrix();
        const max = Math.max(...m.flat());
        const rows = WD_ORDER.map((wd, ri) => {
          const cells = m[wd]
            .map((v, h) => {
              const b = bucket(v, max);
              const delay = (ri * 24 + h) * 4;
              return `<span class="cell" style="background:var(${heatColors[b]});animation-delay:${delay}ms"></span>`;
            })
            .join("");
          return `<div class="row"><span class="rl">${WD_LABEL[ri]}</span><div class="cells">${cells}</div></div>`;
        }).join("");
        const legend = heatColors
          .map((c) => `<i style="background:var(${c})"></i>`)
          .join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">When we text</div>
          <div class="reveal title" style="--i:0">The ${D.peakHourLabel} spike.</div>
          <div class="reveal narrate" style="--i:1">${D.whenNote}</div>
          <div class="heat reveal" style="--i:2">
            ${rows}
            <div class="axis"><span style="grid-column:1">12a</span><span style="grid-column:7">6a</span><span style="grid-column:13">12p</span><span style="grid-column:19">6p</span><span style="grid-column:24">11p</span></div>
          </div>
          <div class="legend reveal" style="--i:3">quiet ${legend} loud</div>
          <div class="heat-foot reveal" style="--i:4">
            <div class="box"><div class="k">Busiest hour</div><div class="v">${D.peakHourLabel}</div></div>
            <div class="box"><div class="k">All time</div><div class="v num">${n(D.byHour.reduce((a,b)=>a+b,0))} <small>texts</small></div></div>
          </div>
        </div>`;
      },
    },

    // 5 — THE VOCABULARY
    {
      id: "vocab",
      render: () => {
        const top = D.topEmoji.slice(0, 9);
        const cells = top
          .map(
            (e, i) =>
              `<div class="emoji-cell reveal" style="--i:${i + 2}"><div class="e">${e.emoji}</div><div class="c num">${n(e.count)}</div></div>`
          )
          .join("");
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

    // 6 — EVERY CHANNEL
    {
      id: "channels",
      render: () => {
        const max = Math.max(...D.channels.map((c) => c.value));
        const rows = D.channels
          .map((c, i) => {
            const w = Math.round((c.value / max) * 100);
            return `
            <div class="row reveal" style="--i:${i + 2}">
              <div class="meta"><div class="name">${c.name}</div><div class="val num">${n(c.value)}</div></div>
              <div class="track"><div class="fill" data-w="${w}"></div></div>
            </div>
            <div class="role reveal" style="--i:${i + 2}">${c.role}</div>`;
          })
          .join("");
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

    // 7 — THE CALL CHANNEL
    {
      id: "calls",
      render: () => {
        const c = D.calls;
        return `
        <div class="card single" data-card>
          <div class="reveal eyebrow center" style="--i:0">The call channel · WhatsApp</div>
          <div class="reveal title center" style="--i:0">When we stop typing.</div>
          <div class="reveal center" style="--i:1; margin-top:20px">
            <span class="big num"><span data-count="${Math.round(c.hours)}">0</span><small>.${String(c.hours).split(".")[1]||0} h</small></span>
          </div>
          <div class="reveal unit center" style="--i:2">on ${c.count} calls</div>
          <div class="statrow reveal" style="--i:3">
            <div class="s"><div class="v num">${c.video}</div><div class="k">Video</div></div>
            <div class="s"><div class="v num">${c.voice}</div><div class="k">Voice</div></div>
            <div class="s"><div class="v num">${c.sheStarted}/${c.heStarted}</div><div class="k">She/He started</div></div>
          </div>
          <div class="reveal narrate center" style="--i:4; margin-top:22px; align-self:center">${c.note}</div>
        </div>`;
      },
    },

    // 8 — THE SNAPS
    {
      id: "snaps",
      render: () => {
        const s = D.snaps;
        return `
        <div class="card single" data-card>
          <div class="reveal eyebrow center" style="--i:0">On Snapchat</div>
          <div class="reveal title center" style="--i:0">A 114-day streak.</div>
          <div class="reveal center" style="--i:1; margin-top:18px">
            <span class="big num"><span data-count="${s.total}">0</span></span>
          </div>
          <div class="reveal unit center" style="--i:2">snaps exchanged</div>
          <div class="statrow reveal" style="--i:3">
            <div class="s"><div class="v num">${s.photos}</div><div class="k">Photos</div></div>
            <div class="s"><div class="v num">${s.videos}</div><div class="k">Videos</div></div>
            <div class="s"><div class="v num">${s.her}/${s.me}</div><div class="k">Her/Him</div></div>
          </div>
          <div class="reveal narrate center" style="--i:4; margin-top:22px; align-self:center">${s.note}</div>
        </div>`;
      },
    },

    // 9 — 14 DATES
    {
      id: "dates",
      render: () => {
        const chips = D.datePlaces
          .map((p, i) => `<span class="chip ${i % 4 === 0 ? "gold" : ""} reveal" style="--i:${i + 2}">${p}</span>`)
          .join("");
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

    // 10 — THE MILESTONES
    {
      id: "milestones",
      render: () => {
        const items = D.milestones
          .map(
            (m, i) => `
          <div class="tl-item reveal ${m.label.includes("official") ? "gold" : ""}" style="--i:${i + 1}">
            <div class="d num">${m.date}</div>
            <div class="l">${m.label}</div>
            <div class="s">${m.sub}</div>
          </div>`
          )
          .join("");
        return `
        <div class="card" data-card>
          <div class="reveal eyebrow" style="--i:0">The firsts</div>
          <div class="reveal title" style="--i:0">The milestones.</div>
          <div class="timeline">${items}</div>
        </div>`;
      },
    },

    // 11 — MADE IT OFFICIAL
    {
      id: "official",
      render: () => {
        const o = D.official;
        return `
        <div class="card single closing" data-card>
          <div class="reveal eyebrow center" style="--i:0">${o.dateLabel} · ${o.place}</div>
          <div class="reveal big" style="--i:1; font-family:var(--f-script); font-size:54px; line-height:1; margin-top:10px">${o.line}</div>
          <div class="reveal narrate center" style="--i:2; margin-top:22px; align-self:center">${o.note}</div>
        </div>`;
      },
    },

    // 12 — CLOSING
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
