/* Shared header, footer and helpers for every page.
   To add a page to the menu, add it to NAV below. */

const NAV = [
  {href:"index.html",     label:"Home"},
  {href:"track.html",     label:"Find your track"},
  {href:"roadmap.html",   label:"Career roadmap"},
  {href:"mentors.html",   label:"Mentors"},
  {href:"community.html", label:"Community"},
  {href:"about.html",     label:"About"},
  {href:"contact.html",   label:"Contact"}
];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Line icons (24px grid, stroke follows the text colour). */
const svgIcon = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  lang:svgIcon('<path d="M4 5h9M8.5 3v2M6 5c1 4 3 6 6 7M11 5c-1 4-4 7-7 8"/><path d="M13 20l4-9 4 9M14.5 17h5"/>'),
  cal:svgIcon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  shield:svgIcon('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  code:svgIcon('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M10 8l-2 2 2 2M14 8l2 2-2 2"/>'),
  doc:svgIcon('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'),
  mic:svgIcon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'),
  users:svgIcon('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.5-4 3-6 6-6s5.5 2 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 4.5 2 5 5"/>'),
  chat:svgIcon('<path d="M4 5h11a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2z"/><path d="M19 9h1a2 2 0 012 2v5a2 2 0 01-2 2h-1v3l-3-3"/>'),
  compass:svgIcon('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  briefcase:svgIcon('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18"/>'),
};

/* Brand mark: a sunflower seed that blooms (logo on hover, and the final call to action on scroll). */
const SEED_PATH = `<path d="M0 -19 C 11 -12 12 8 0 19 C -12 8 -11 -12 0 -19Z" fill="#2E1C0E" stroke="#F5B201" stroke-width="1.6"/><path d="M-6.5 -10 C -8.5 -2 -7.5 7 -2.5 15 M6.5 -10 C 8.5 -2 7.5 7 2.5 15" stroke="#F5D58A" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
const seedSVG = size => `<svg width="${size}" height="${size}" viewBox="-30 -30 60 60" aria-hidden="true"><g transform="rotate(25) scale(1.35)">${SEED_PATH}</g></svg>`;
function bloomParts(){
  let petals = "";
  for (let k = 0; k < 16; k++) petals += `<path class="lm-petal" style="--a:${k * 22.5}deg;--i:${k}" d="M-6 -15 Q -10 -30 0 -38 Q 10 -30 6 -15Z" fill="${k % 2 ? "#D98A00" : "#F5B201"}"/>`;
  let seeds = "";
  for (let i = 1; i <= 34; i++){ const t = Math.sqrt(i / 34), a = i * 2.39996, r = 13 * t; seeds += `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" r="${(0.7 + 1.2 * t).toFixed(1)}" fill="#F5B201"/>`; }
  return `${petals}<g class="lm-disc"><circle r="16" fill="#3A220E"/>${seeds}</g>`;
}
const bloomSVG = (size, cls = "") => `<svg class="${cls}" width="${size}" height="${size}" viewBox="-40 -40 80 80" aria-hidden="true">${bloomParts()}</svg>`;
const LOGO = `<svg class="logo-mark" viewBox="-40 -40 80 80" aria-hidden="true">${bloomParts()}<g class="lm-seed"><g transform="rotate(25) scale(1.9)">${SEED_PATH}</g></g></svg>`;

/* ---------- Helpers (used by page scripts) ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const mentorById = id => GH.mentors.find(m => m.id === id);
const fieldById = id => GH.fields.find(f => f.id === id);
const nativeName = id => (GH.languages.find(l => l.id === id) || {native:id}).native;

/* Pick the best mentors: native language first, then field. */
function matchMentors(lang, field){
  return GH.mentors
    .map(m => ({m, score:(m.languages.includes(lang) ? 10 : 0) + (m.fields.includes(field) ? 5 : 0)}))
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score)
    .map(x => x.m);
}

/* Mentor card HTML, shared by Home and Mentors pages. */
function mentorCard(m){
  const links = [
    m.linkedin && `<a href="${esc(m.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`,
    m.github && `<a href="${esc(m.github)}" target="_blank" rel="noopener">GitHub ↗</a>`
  ].filter(Boolean).join("");
  const fields = m.fields.map(f => fieldById(f)).filter(Boolean).map(f => f.label).join(", ");
  return `<article class="mentor">
    <div class="mentor-head"><span class="mono" aria-hidden="true">${esc(m.initials)}</span><div><h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div></div></div>
    <div class="langs">${m.languages.map(l => `<span>${esc(l)}</span>`).join("")}</div>
    <div class="skills">${m.skills.map(s => `<span>${esc(s)}</span>`).join("")}</div>
    <dl class="mentor-meta">
      <div><dt>Experience</dt><dd>${m.years} years</dd></div>
      <div><dt>Guides</dt><dd>${esc(fields)}</dd></div>
    </dl>
    <p>${esc(m.bio)}</p>
    <div class="mentor-foot">
      <a class="btn btn-ghost" href="contact.html?mentor=${m.id}">Talk to ${esc(m.name.split(" ")[0])}</a>
      ${links ? `<span class="mentor-links">${links}</span>` : ""}
    </div>
  </article>`;
}

/* Saturday session banner, shared by Home and Community pages.
   Shows a live countdown to the next session (day and time come from GH.weekly, in IST). */
function weeklyBanner(){
  const w = GH.weekly;
  setTimeout(updateCountdowns, 0);   // fill the clock as soon as the banner is on the page
  return `<div class="weekly">
    <div class="weekly-clock" data-countdown aria-live="off">
      <span class="wc-label">Next session in</span>
      <span class="wc-digits"><b data-u="d">0</b><i>days</i><b data-u="h">00</b><i>hrs</i><b data-u="m">00</b><i>min</i><b data-u="s">00</b><i>sec</i></span>
      <span class="wc-live" hidden>Live now · join the group for the link</span>
    </div>
    <div class="weekly-copy">
      <h2>${esc(w.title)}</h2>
      <p class="when">${esc(w.day)} · ${esc(w.time)}</p>
      <p>${esc(w.desc)} ${esc(w.where)}</p>
      ${GH.links.communityGroup ? `<a class="btn" href="${GH.links.communityGroup}" target="_blank" rel="noopener">Join to get the link</a>` : ""}
    </div>
  </div>`;
}

/* Next session start, as a timestamp. GH.weekly.day names the weekday; GH.weekly.time is like "11:00 AM IST". */
function nextSession(now = Date.now()){
  const w = GH.weekly, IST = 330 * 60000, LEN = 2 * 3600000;
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const wd = Math.max(0, days.findIndex(d => w.day.toLowerCase().includes(d)));
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(w.time) || [0, "11", "00", "AM"];
  let hh = Number(m[1]) % 12 + (/pm/i.test(m[3] || "") ? 12 : 0);
  const ist = new Date(now + IST);
  let t = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + (wd - ist.getUTCDay() + 7) % 7, hh, Number(m[2])) - IST;
  if (t + LEN < now) t += 7 * 86400000;
  return {start:t, live: now >= t && now < t + LEN};
}
function updateCountdowns(){
  const boxes = document.querySelectorAll("[data-countdown]");
  if (!boxes.length) return;
  const {start, live} = nextSession();
  let left = Math.max(0, Math.floor((start - Date.now()) / 1000));
  const parts = {d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60};
  boxes.forEach(b => {
    b.classList.toggle("is-live", live);
    b.querySelector(".wc-live").hidden = !live;
    b.querySelectorAll("[data-u]").forEach(el => {
      const v = String(parts[el.dataset.u]).padStart(el.dataset.u === "d" ? 1 : 2, "0");
      if (el.textContent !== v){ el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
    });
  });
}
setInterval(updateCountdowns, 1000);

/* Ways to reach Varsha with a prepared message. Returns HTML.
   Shows only the channels that are configured in config.js. */
function sendOptions(message, subject){
  const out = [];
  if (GH.contact.whatsappNumber){
    out.push(`<a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/${GH.contact.whatsappNumber.replace(/\D/g,"")}?text=${encodeURIComponent(message)}">Send on WhatsApp</a>`);
  }
  if (GH.contact.email){
    out.push(`<a class="btn ${out.length ? "btn-ghost" : "btn-primary"}" href="mailto:${GH.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}">Send by email</a>`);
  }
  out.push(`<button class="btn ${out.length ? "btn-ghost" : "btn-primary"}" type="button" data-copy>Copy message</button>`);
  if (GH.links.communityGroup){
    out.push(`<a class="btn btn-ghost" target="_blank" rel="noopener" href="${GH.links.communityGroup}">Post in community group</a>`);
  }
  return out.join("");
}

/* Copy buttons: copy the text of the nearest [data-copy-src]. */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  const box = b.closest("[data-copy-scope]") || document;
  const src = $("[data-copy-src]", box), st = $("[data-copy-status]", box);
  const say = t => { if (st) st.textContent = t; };
  const select = () => { const r = document.createRange(); r.selectNodeContents(src); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say("Text selected. Press Ctrl+C or long-press to copy."); };
  try { navigator.clipboard.writeText(src.textContent).then(() => say("Copied. Paste it in WhatsApp, email or the community group."), select); }
  catch(err){ select(); }
});

/* ---------- Header & footer ---------- */
(function renderLayout(){
  const here = location.pathname.split("/").pop() || "index.html";
  const header = document.createElement("header");
  header.className = "nav";
  header.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html" aria-label="Rooting Careers home">${LOGO}Rooting Careers</a>
    <nav class="nav-links" id="navLinks" aria-label="Main">
      ${NAV.filter(n => n.href !== "index.html").map(n => `<a href="${n.href}"${n.href === here ? ' aria-current="page"' : ""}>${n.label}</a>`).join("")}
    </nav>
    <div class="nav-actions">
      <a class="btn btn-ghost" href="contact.html?topic=consult">Talk to ${esc(GH.contact.founder)}</a>
      <a class="btn btn-primary nav-cta" href="roadmap.html">Get my roadmap</a>
      <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="navLinks">Menu</button>
    </div>
  </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  const year = new Date().getFullYear();
  footer.innerHTML = `<div class="wrap">
    <div class="foot-row">
      <div class="foot-brand">
        <a class="logo" href="index.html">${LOGO}Rooting Careers</a>
        <p class="foot-tag">Career guidance in your own language. We're rooting for you.</p>
      </div>
      <nav class="foot-links" aria-label="Footer">
        ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}
        ${GH.links.communityGroup ? `<a href="${GH.links.communityGroup}" target="_blank" rel="noopener">Community group ↗</a>` : ""}
        ${GH.links.jobsChannel ? `<a href="${GH.links.jobsChannel}" target="_blank" rel="noopener">Jobs channel ↗</a>` : ""}
      </nav>
    </div>
    <p class="foot-note">Rooting Careers never charges you to get a job, and no real employer will either. We don't guarantee placements, referrals or interview selection. © ${year} Rooting Careers</p>
  </div>`;
  document.body.append(footer);

  const btn = $("#menuBtn"), links = $("#navLinks");
  btn.addEventListener("click", () => { const o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
})();

/* ---------- Behaviour & motion: nav tone, section entrances ---------- */
(function motion(){
  document.documentElement.classList.add("js");

  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion-ok");

  /* Reveal the parts of each section as it scrolls in: heading, then text, then the pictures and lists.
     Runs after page scripts have rendered; anything rendered later (filters, the roadmap wizard) simply appears. */
  const REVEAL = ".sec-head > *,.sit,.steps li,.card,.mentor,.game,.weekly,.flip,.founder-note,.diff > div,.story > *,.founder-card,form.form,.lang-strip > *,.disclaimer,.empty,.two > *,.cta-panel,.progress > li,.panel,.filters .row";
  document.addEventListener("DOMContentLoaded", () => {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      el.classList.add("is-in");
      /* Drop the reveal classes afterwards so hover transitions work normally. */
      setTimeout(() => el.classList.remove("rv", "is-in"), 1100);
    }), {rootMargin:"0px 0px -8% 0px", threshold:.08});
    const pending = [];
    document.querySelectorAll(REVEAL).forEach(el => {
      if (el.closest(".hero")) return;
      const sibs = [...el.parentElement.children].filter(s => s.matches(REVEAL));
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 5) * 70 + "ms");
      el.classList.add("rv");
      io.observe(el);
      pending.push(el);
    });
    /* A fast jump (anchor link, Home/End key) can skip past an element without it ever
       intersecting, so also reveal anything that is already above the bottom of the screen. */
    let ticking = false;
    const catchUp = () => {
      ticking = false;
      for (let i = pending.length - 1; i >= 0; i--){
        const el = pending[i];
        if (!el.classList.contains("rv")){ pending.splice(i, 1); continue; }
        if (el.getBoundingClientRect().top < innerHeight){ pending.splice(i, 1); io.unobserve(el); el.classList.add("is-in"); setTimeout(() => el.classList.remove("rv", "is-in"), 1100); }
      }
      if (!pending.length) removeEventListener("scroll", onJump);
    };
    const onJump = () => { if (!ticking){ ticking = true; requestAnimationFrame(catchUp); } };
    addEventListener("scroll", onJump, {passive:true});
  });
})();

if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
