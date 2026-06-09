/*
 * data.js — every number the story shows, in one place.
 *
 * Real aggregates from data/*.json (computed 2026-06-09 via extract/_wrapped_stats.cjs).
 * The eventual `merge`/dataset.json can overwrite this file without touching the UI.
 * NOTE: calls/FaceTime are intentionally excluded everywhere — the call data isn't
 * accurate yet, so no card uses it.
 */
window.WRAPPED = {
  people: { me: "Muhammad", her: "Haniya", herShort: "Hani" },
  window: { label: "Jan – Jun 2026", year: "2026" },

  // ---- Card: the receipts (totals only — never "who did more") --------------
  totals: {
    messages: 49904,
    daysTalked: 148,          // texted essentially every single day
    dates: 14,
    photos: 4180,             // 2,395 shared in chat + 1,785 taken on dates (album)
    reels: 3997,
    tiktoks: 800,
    perDay: 337,              // 49,904 / 148
  },
  receiptsNote: "About 337 messages a day. Every day. For six straight months.",

  // ---- Card: how it started (the REAL first contact — Instagram) -----------
  firstText: {
    where: "Instagram",
    dateLabel: "Dec 30, 2025",
    // he slid into her DMs with a bit — a fake "tech support" scam
    me1: "Hello dear, this is Apple tech support. We've detected a serious virus on your phone. Please send $500 in App Store gift cards immediately. Very urgent matter.",
    her1: "good try, u almost had me",
    me2: "worth a shot",
    note: "He messaged first — on Instagram, with a bit. She saw right through it. Six months later, here we are.",
  },

  // ---- Card: the shape of us (combined messages per month, all 5 platforms) -
  shapeMonths: [
    { label: "JAN", msgs: 7865 },
    { label: "FEB", msgs: 7146 },
    { label: "MAR", msgs: 8938 },
    { label: "APR", msgs: 11783 },
    { label: "MAY", msgs: 11602 },
    { label: "JUN", msgs: 2543, partial: true },
  ],
  shapeNote: "It didn't fade — it grew. The messages climbed right into spring (June's still being written).",

  // ---- Card: when we text (hourly, real iMessage marginals) -----------------
  byHour: [
    2249, 1287, 499, 387, 332, 181, 362, 284, 267, 577, 1147, 1337,
    1331, 1570, 2276, 1763, 2284, 1521, 1375, 1884, 2129, 2141, 2810, 2750,
  ],
  byWeekday: [4895, 4140, 5234, 4562, 4552, 4304, 5056], // Sun..Sat
  hourWeekday: null, // drop a real 7x24 (Sun..Sat) matrix here to replace the approximation
  peakHourLabel: "10 PM",
  textsAllTime: 32743,
  whenNote: "Each square is one hour of one weekday, shaded by volume.",

  // ---- Card: the vocabulary (emoji) ----------------------------------------
  emojisTotal: 16537,
  topEmoji: [
    { emoji: "😭", count: 2614 }, { emoji: "🙈", count: 1567 }, { emoji: "😹", count: 1150 },
    { emoji: "🤭", count: 825 },  { emoji: "☺️", count: 790 },  { emoji: "😝", count: 642 },
    { emoji: "👀", count: 547 },  { emoji: "😼", count: 537 },  { emoji: "😽", count: 441 },
  ],

  // ---- Card: words of adoration (real text scan, all platforms) ------------
  adoration: {
    top: [
      { word: "baby", count: 782 }, { word: "babe", count: 189 }, { word: "beautiful", count: 158 },
      { word: "cutie", count: 90 }, { word: "princess", count: 61 }, { word: "handsome", count: 52 },
      { word: "gorgeous", count: 29 }, { word: "my heart", count: 28 }, { word: "my girl", count: 28 },
    ],
    hisForHer: ["gorgeous", "princess", "wifey"],   // he says these; she basically doesn't
    hersForHim: ["handsome"],                        // her signature for him
    shared: { word: "baby", count: 782 },
    note: "The names you actually call each other.",
  },

  // ---- Card: every channel --------------------------------------------------
  channels: [
    { name: "iMessage", value: 32743, role: "home base — where it all lives" },
    { name: "Instagram", value: 14790, role: "the firehose · 3,997 reels traded" },
    { name: "TikTok", value: 1611, role: "brainrot delivery · 800 sent" },
    { name: "Snapchat", value: 479, role: "snaps, not chats · 301 snaps" },
    { name: "WhatsApp", value: 281, role: "the long-distance season · mostly photos" },
  ],
  channelsNote: "Not one app over a decade. Every app, over six months.",

  // ---- Card: the snaps (totals only) ---------------------------------------
  snaps: { total: 301, photos: 211, videos: 90, streak: 114, saved: 169,
    note: "A 114-day streak. 301 snaps. Mostly photos, the occasional 1-second video." },

  // ---- Card: 14 dates (the places) -----------------------------------------
  datesSummary: { inPerson: 12, virtual: 2, all: 14 },
  datePlaces: [
    "Fengcha", "Main Event arcade", "La La Land", "matcha in the rain",
    "escape room", "Meow Wolf", "a photobooth", "Founders Plaza planes",
    "his birthday in Las Colinas", "a lakeside picnic", "Museum of Illusions",
    "a double date",
  ],

  // ---- Card: the timeline (ALL 14 dates; milestones highlighted, rest muted)-
  // tier: "gold" = the headline moment · "mark" = a first · "muted" = a date
  timeline: [
    { date: "Jan 16", label: "First date", sub: "Fengcha · arcade · Harvest Hall", tier: "mark" },
    { date: "Jan 23", label: "First matcha & shared umbrella", sub: "shopping in the rain", tier: "mark" },
    { date: "Jan 29", label: "First virtual date", sub: "FaceTime at the mall", tier: "mark" },
    { date: "Feb 18", label: "Dubai layover", sub: "live snaps from the Burj Khalifa", tier: "muted" },
    { date: "Mar 04", label: "Escape room & Thai food", sub: "first date back from Pakistan", tier: "muted" },
    { date: "Mar 12", label: "Meow Wolf", sub: "the exhibit + dinner", tier: "muted" },
    { date: "Mar 27", label: "First kiss", sub: "+ first photobooth, after the movie", tier: "mark" },
    { date: "Apr 03", label: "Project Hail Mary", sub: "airplane-watching at Founders Plaza", tier: "muted" },
    { date: "Apr 16", label: "Tanger Outlets", sub: "shopping + a drive-thru", tier: "muted" },
    { date: "Apr 25", label: "His birthday — she planned all of it", sub: "gave her his Cornell sweatshirt", tier: "mark" },
    { date: "May 02", label: "First picnic", sub: "spotted a beaver · froyo", tier: "mark" },
    { date: "May 08", label: "Made it official", sub: "he asked, she said yes", tier: "gold" },
    { date: "May 17", label: "Movie night", sub: "Obsession · theater cuddles", tier: "muted" },
    { date: "May 29", label: "First double date", sub: "still going", tier: "mark" },
  ],

  // ---- Card: made it official ----------------------------------------------
  official: {
    dateLabel: "May 8, 2026",
    place: "Lakeside Park, Highland Park",
    line: "she said yes.",
    note: "Picnic blanket, ducks everywhere, heads on laps. He asked. She said yes.",
  },

  // ---- Card: closing --------------------------------------------------------
  closing: { headline: "and we're just getting started.", sub: "Six months down. Here's to the rest." },
};
