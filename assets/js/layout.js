/* Shared header, footer and helpers for every page.
   To add a page to the menu, add it to NAV below. */

const NAV = [
  {href:"index.html",     label:"Home"},
  {href:"roadmap.html",   label:"Career roadmap"},
  {href:"mentors.html",   label:"Mentors"},
  {href:"community.html", label:"Community"},
  {href:"about.html",     label:"About"},
  {href:"contact.html",   label:"Contact"}
];

const LOGO = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--brand)"/><path d="M16 25V13" stroke="var(--brand-ink)" stroke-width="2.6" stroke-linecap="round"/><path d="M16 17c0-4 3-7 8-7 0 4-3 7-8 7z" fill="var(--accent)"/><path d="M16 15c0-3.5-2.6-6-7-6 0 3.5 2.6 6 7 6z" fill="var(--brand-ink)"/></svg>`;

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
    <div class="langs">${m.languages.map(l => `<span>${esc(nativeName(l))}</span>`).join("")}</div>
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

/* Saturday session banner, shared by Home and Community pages. */
function weeklyBanner(){
  const w = GH.weekly;
  const day = w.day.split(" ").pop().slice(0, 3).toUpperCase();
  const time = w.time.replace(":00", "").replace(" IST", "");
  return `<div class="weekly">
    <div class="when"><span>${esc(day)}<big>${esc(time)}</big></span></div>
    <div style="display:grid;gap:6px"><span class="eyebrow" style="color:inherit;opacity:.8">${esc(w.day)} · ${esc(w.time)}</span><h2 style="font-size:clamp(1.4rem,3vw,1.9rem)">${esc(w.title)}</h2><p>${esc(w.desc)} ${esc(w.where)}</p></div>
    ${GH.links.communityGroup ? `<a class="btn" href="${GH.links.communityGroup}" target="_blank" rel="noopener">Join to get the link</a>` : ""}
  </div>`;
}

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
    <a class="logo" href="index.html" aria-label="Growth Hub home">${LOGO}Growth Hub</a>
    <nav class="nav-links" id="navLinks" aria-label="Main">
      ${NAV.map(n => `<a href="${n.href}"${n.href === here ? ' aria-current="page"' : ""}>${n.label}</a>`).join("")}
    </nav>
    <a class="btn btn-primary nav-cta" href="roadmap.html">Get my roadmap</a>
    <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="navLinks">Menu</button>
  </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  const year = new Date().getFullYear();
  footer.innerHTML = `<div class="wrap">
    <div class="foot-brand"><a class="logo" href="index.html">${LOGO}Growth Hub</a><span>Learn together. Build real skills. Grow together.</span></div>
    <nav class="foot-links" aria-label="Footer">
      ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}
      ${GH.links.communityGroup ? `<a href="${GH.links.communityGroup}" target="_blank" rel="noopener">Community group ↗</a>` : ""}
      ${GH.links.jobsChannel ? `<a href="${GH.links.jobsChannel}" target="_blank" rel="noopener">Jobs channel ↗</a>` : ""}
    </nav>
    <p class="foot-note">Growth Hub never charges you to get a job, and no real employer will either. We don't guarantee placements, referrals or interview selection. © ${year} Varsha's Growth Hub</p>
  </div>`;
  document.body.append(footer);

  const btn = $("#menuBtn"), links = $("#navLinks");
  btn.addEventListener("click", () => { const o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
})();

if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
