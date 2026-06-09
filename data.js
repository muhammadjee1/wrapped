/*
 * data.js — every number the story shows, in one place.
 *
 * All values here are the real aggregates pulled from data/_summary.json,
 * data/imessage.json, data/snapchat.json and data/dates.json (as of 2026-06-08).
 * The eventual `merge` step can overwrite this file from dataset.json without
 * touching any of the UI. Anything not yet derived from data is marked TODO.
 */
window.WRAPPED = {
  people: {
    me: "Muhammad",
    her: "Haniya",
    herShort: "Hani",
  },

  window: { label: "Jan – Jun 2026", year: "2026" },

  // ---- Card 1: the receipts -------------------------------------------------
  totals: {
    messages: 49904,          // all five platforms
    meMessages: 24791,
    herMessages: 25113,
    daysTalked: 148,          // iMessage active days (texted essentially every day)
    dates: 14,                // 12 in-person + 2 virtual
    photos: 4180,             // combined unique (2,395 iMessage + 1,785 shared album)
    reels: 3997,              // Instagram reels traded
    tiktoks: 800,
    snaps: 301,
    tapbacks: 17951,          // iMessage reactions (own bucket — never summed in)
    callHours: 5.93,          // WhatsApp only so far
  },

  // ---- Card 2: how it started ----------------------------------------------
  firstText: {
    dateLabel: "Jan 12, 2026 · 10:35 PM",
    her: "hii this is haniya!",
    me: "hellooo",
    gapLabel: "7 minutes later",
    note: "She texted first. On iMessage. He took seven minutes to play it cool.",
  },

  // ---- Card 3: the shape of us (messages / month) --------------------------
  // iMessage byMonth (the spine of the relationship). June is a partial month.
  months: [
    { label: "JAN", value: 6456 },
    { label: "FEB", value: 6428 },
    { label: "MAR", value: 6421 },
    { label: "APR", value: 6051 },
    { label: "MAY", value: 6098 },
    { label: "JUN", value: 1289, partial: true },
  ],
  shapeNote:
    "Six months, barely a dip. You text like the first week never ended — " +
    "(June's still being written).",

  // ---- Card 4: when we text (hourly) ---------------------------------------
  // iMessage byHour, index 0..23 = 12am..11pm, Central time. Real marginal.
  byHour: [
    2249, 1287, 499, 387, 332, 181, 362, 284, 267, 577, 1147, 1337,
    1331, 1570, 2276, 1763, 2284, 1521, 1375, 1884, 2129, 2141, 2810, 2750,
  ],
  byWeekday: [4895, 4140, 5234, 4562, 4552, 4304, 5056], // Sun..Sat
  // Optional real 7x24 cross-tab (Sun..Sat rows). Null => app approximates it
  // from byHour x byWeekday. Drop the real matrix here when merge computes it.
  hourWeekday: null,
  peakHourLabel: "10 PM",
  whenNote: "Every square is one hour of one weekday, shaded by volume.",

  // ---- Card 5: the vocabulary ----------------------------------------------
  emojisTotal: 16537, // me 6,950 + her 9,587 (iMessage)
  topEmoji: [
    { emoji: "😭", count: 2614 },
    { emoji: "🙈", count: 1567 },
    { emoji: "😹", count: 1150 },
    { emoji: "🤭", count: 825 },
    { emoji: "☺️", count: 790 },
    { emoji: "😝", count: 642 },
    { emoji: "👀", count: 547 },
    { emoji: "😼", count: 537 },
    { emoji: "😽", count: 441 },
  ],
  vocabNote: "We said a lot. Mostly this.",

  // ---- Card 6: every channel (the breadth angle) ---------------------------
  channels: [
    { name: "iMessage", value: 32743, role: "home base — where it all began" },
    { name: "Instagram", value: 14790, role: "the firehose · 3,997 reels traded" },
    { name: "TikTok", value: 1611, role: "brainrot delivery · 800 sent" },
    { name: "Snapchat", value: 479, role: "snaps, not chats · 301 snaps" },
    { name: "WhatsApp", value: 281, role: "where we actually call" },
  ],
  channelsNote: "Not one app over a decade. Every app, over six months.",

  // ---- Card 7: the call channel --------------------------------------------
  calls: {
    hours: 5.93,
    count: 36,
    video: 29,
    voice: 7,
    sheStarted: 23,
    heStarted: 13,
    note: "WhatsApp is where you stop typing and just talk.",
  },

  // ---- Card 8: the snaps ----------------------------------------------------
  snaps: {
    total: 301,
    me: 119,
    her: 182,
    photos: 211,
    videos: 90,
    streak: 114,
    note: "A 114-day streak. 301 snaps. She out-snapped him, 182 to 119.",
  },

  // ---- Card 9 & 10: dates + milestones -------------------------------------
  datesSummary: { inPerson: 12, virtual: 2, all: 14, firstDate: "2026-01-16" },
  datePlaces: [
    "Fengcha", "Main Event arcade", "La La Land", "matcha in the rain",
    "escape room", "Meow Wolf", "a photobooth", "Founders Plaza planes",
    "his birthday in Las Colinas", "a lakeside picnic", "Museum of Illusions",
    "a double date",
  ],
  milestones: [
    { date: "Jan 16", label: "First date", sub: "Fengcha · arcade · Harvest Hall" },
    { date: "Jan 23", label: "First matcha & first shared umbrella", sub: "shopping in the rain" },
    { date: "Mar 27", label: "First kiss", sub: "+ first photobooth, after Ready or Not 2" },
    { date: "Apr 25", label: "His birthday — she planned all of it", sub: "gave her his Cornell sweatshirt" },
    { date: "May 8", label: "Made it official", sub: "he asked, she said yes" },
    { date: "May 29", label: "First double date", sub: "still going" },
  ],

  // ---- Card 11: made it official -------------------------------------------
  official: {
    dateLabel: "May 8, 2026",
    place: "Lakeside Park, Highland Park",
    line: "she said yes.",
    note: "Picnic blanket, ducks everywhere, heads on laps. He asked. She said yes.",
  },

  // ---- Card 12: closing -----------------------------------------------------
  closing: {
    headline: "and we're just getting started.",
    sub: "Six months down. Here's to the rest.",
  },
};
