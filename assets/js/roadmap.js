/* Career roadmap tool.
   Steps, roadmaps, struggles and prices all come from config.js.
   Prices are only revealed in the result, after the visitor has answered. */

const KEY = "gh-roadmap";
const state = Object.assign({lang:"", stage:"", field:"", struggles:[], time:"", name:""}, store.get(KEY) || {});
let step = 0;

const opt = (val, label, sub, pressed, multi) =>
  `<button type="button" class="opt" data-val="${esc(val)}" aria-pressed="${pressed}">${multi ? '<span class="tick" aria-hidden="true"></span>' : ""}<span>${label}${sub ? `<span class="sub">${sub}</span>` : ""}</span></button>`;

const STEPS = [
  {
    short:"Language",
    title:"Which language do you think and learn best in?",
    hint:"We'll match you with a mentor who speaks it.",
    valid:() => !!state.lang,
    body:() => `<div class="opts">${GH.languages.map(l => opt(l.id, esc(l.native), l.native !== l.id ? esc(l.id) : "", state.lang === l.id)).join("")}</div>`,
    pick:v => { state.lang = v; return true; }
  },
  {
    short:"Where you are",
    title:"Where are you right now?",
    valid:() => !!state.stage,
    body:() => `<div class="opts">${GH.stages.map(s => opt(s, esc(s), "", state.stage === s)).join("")}</div>`,
    pick:v => { state.stage = v; return true; }
  },
  {
    short:"Goal",
    title:"Which role are you aiming for?",
    hint:"Not sure is a perfectly good answer.",
    valid:() => !!state.field,
    body:() => `<div class="opts">${GH.fields.map(f => opt(f.id, esc(f.label), "", state.field === f.id)).join("")}</div>`,
    pick:v => { state.field = v; return true; }
  },
  {
    short:"Struggles",
    title:"What's holding you back?",
    hint:"Pick everything that applies.",
    valid:() => state.struggles.length > 0,
    body:() => `<div class="opts wide">${GH.struggles.map(s => opt(s.id, esc(s.label), "", state.struggles.includes(s.id), true)).join("")}</div>`,
    pick:v => {
      const i = state.struggles.indexOf(v);
      i < 0 ? state.struggles.push(v) : state.struggles.splice(i, 1);
      return false;  // multi-select: stay on this step
    }
  },
  {
    short:"Time",
    title:"When can you usually learn?",
    valid:() => !!state.time && state.name.trim().length > 0,
    body:() => `<div class="opts">${GH.times.map(t => opt(t, esc(t), "", state.time === t)).join("")}</div>
      <div class="field"><label for="rm-name">Your first name</label><input id="rm-name" autocomplete="given-name" placeholder="So your roadmap is addressed to you" value="${esc(state.name)}"></div>`,
    pick:v => { state.time = v; return false; }
  }
];

function renderProgress(){
  $("#progress").innerHTML = STEPS.map((s, i) =>
    `<li class="${i < step ? "done" : i === step ? "now" : ""}"${i === step ? ' aria-current="step"' : ""}><span>${i + 1}</span><b>${s.short}</b></li>`
  ).join("");
}

function renderStep(focus){
  const s = STEPS[step], last = step === STEPS.length - 1;
  $("#panel").innerHTML = `
    <div style="display:grid;gap:8px">
      <span class="eyebrow">Question ${step + 1} of ${STEPS.length}</span>
      <h2 tabindex="-1">${s.title}</h2>
      ${s.hint ? `<p class="small">${s.hint}</p>` : ""}
    </div>
    ${s.body()}
    <div class="panel-nav">
      <button type="button" class="btn btn-ghost" data-nav="-1" ${step === 0 ? "hidden" : ""}>Back</button>
      <button type="button" class="btn btn-primary" data-nav="1" ${s.valid() ? "" : "disabled"}>${last ? "Show my roadmap" : "Next"}</button>
    </div>`;
  renderProgress();
  if (focus) $("#panel h2").focus({preventScroll:true});
}

function go(delta){
  if (delta > 0 && !STEPS[step].valid()) return;
  store.set(KEY, state);
  if (delta > 0 && step === STEPS.length - 1) return showResult();
  step = Math.max(0, Math.min(STEPS.length - 1, step + delta));
  renderStep(true);
  $("#wizard").scrollIntoView({behavior:"smooth", block:"start"});
}

$("#panel").addEventListener("click", e => {
  const nav = e.target.closest("[data-nav]");
  if (nav) return go(Number(nav.dataset.nav));
  const o = e.target.closest(".opt");
  if (!o) return;
  const advance = STEPS[step].pick(o.dataset.val);
  store.set(KEY, state);
  if (advance) go(1); else renderStep(false);
});
$("#panel").addEventListener("input", e => {
  if (e.target.id !== "rm-name") return;
  state.name = e.target.value;
  $("[data-nav='1']").disabled = !STEPS[step].valid();
});
$("#panel").addEventListener("keydown", e => {
  if (e.target.id === "rm-name" && e.key === "Enter") go(1);
});

/* ---------- Build the plan ---------- */
const ORDER = ["consult", "resume", "mock", "mentor", "project", "community"];

function buildPlan(){
  const chosen = GH.struggles.filter(s => state.struggles.includes(s.id));
  const keys = new Set(["consult", "community"]);
  let mentorQty = 0;
  chosen.forEach(s => { s.adds.forEach(k => keys.add(k)); mentorQty += s.mentorSessions || 0; });
  if (keys.has("mentor")) mentorQty = Math.min(3, Math.max(1, mentorQty));

  const items = ORDER.filter(k => keys.has(k)).map(k => {
    const s = GH.services[k], qty = k === "mentor" ? mentorQty : 1;
    return {k, s, qty, cost:s.price * qty, market:s.market == null ? null : s.market * qty};
  });
  const hub = items.reduce((a, i) => a + i.cost, 0);
  const comparable = items.filter(i => i.market != null);
  const platform = comparable.reduce((a, i) => a + i.market, 0);
  const hubComparable = comparable.reduce((a, i) => a + i.cost, 0);
  return {chosen, items, hub, platform, hubComparable, field:fieldById(state.field)};
}

function showResult(){
  const p = buildPlan(), f = p.field;
  const mentors = matchMentors(state.lang, state.field);
  const native = mentors.filter(m => m.languages.includes(state.lang));
  const best = native[0] || mentors[0];
  const name = state.name.trim();
  const priceCell = i => i.s.price ? `${i.s.unit === "from" ? "from " : ""}${inr(i.cost)}` : "Free";
  const instSave = f.institute.low - p.hub;
  const platSave = p.platform - p.hubComparable;
  const max = Math.max(f.institute.low, p.platform, p.hub, 1);
  const pct = n => (n / max * 100).toFixed(1) + "%";

  const tips = p.chosen.map(s => s.tip);
  if (state.time === "Weekends") tips.push(`${GH.weekly.title} runs ${GH.weekly.day} at ${GH.weekly.time}, which fits your weekends.`);
  if (state.time === "Weekday evenings") tips.push("Mention your preferred evening time when you send this, and we'll try to plan sessions around it.");

  const mentorHtml = best ? `<div class="match"><span class="mono" aria-hidden="true">${esc(best.initials)}</span><div>
      <h3>${esc(best.name)}</h3><div class="small">${esc(best.role)} · speaks ${best.languages.map(nativeName).map(esc).join(", ")}</div>
      ${best.linkedin ? `<a href="${esc(best.linkedin)}" target="_blank" rel="noopener" style="font-weight:700;font-size:.92rem">LinkedIn ↗</a>` : ""}
    </div></div>
    ${!native.length ? `<p class="small">We don't have a ${esc(state.lang)}-speaking mentor listed yet. Send your roadmap anyway: we'll look for one in your field, and ${esc(best.name.split(" ")[0])} can help in the meantime.</p>` : ""}`
    : `<p>We'll find a ${esc(state.lang)}-speaking mentor in your field for you. Send your roadmap and mention it.</p>`;

  const message = [
    `Hi ${GH.contact.founder}, I'm ${name}. I built my career roadmap on Growth Hub.`,
    "",
    `Language: ${state.lang}`,
    `Where I am: ${state.stage}`,
    `Goal: ${f.label}`,
    `Struggles:`,
    ...p.chosen.map(s => `- ${s.label}`),
    `Best time for me: ${state.time}`,
    best ? `Suggested mentor: ${best.name}` : `Mentor: looking for a ${state.lang}-speaking mentor`,
    "",
    `Suggested plan: ${p.items.map(i => i.s.short + (i.qty > 1 ? ` x${i.qty}` : "")).join(", ")}`,
    `Estimated cost: ${inr(p.hub)}`,
    "",
    "I'd like to book my free consultation."
  ].join("\n");

  $("#wizard").hidden = true;
  const r = $("#result");
  r.hidden = false;
  r.innerHTML = `
    <div class="result-head">
      <span class="eyebrow">Roadmap for ${esc(name)}</span>
      <h2 tabindex="-1">${esc(f.label)}: your next steps</h2>
      <p class="lede">Based on where you are (${esc(state.stage.toLowerCase())}) and what's holding you back.</p>
    </div>

    <div class="block">
      <h3>Your skill roadmap</h3>
      <div class="phases">${f.phases.map(ph => `<div class="phase"><span class="w">${esc(ph.w)}</span><h3>${esc(ph.t)}</h3><ul>${ph.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
      <p class="small">Timelines assume roughly 8–10 hours a week. Your mentor will adjust this to you.</p>
    </div>

    <div class="block">
      <h3>Best suggestions for you</h3>
      <ul class="tips">${tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>

    <div class="block">
      <h3>Your mentor match <span class="small">(${esc(nativeName(state.lang))} first)</span></h3>
      ${mentorHtml}
    </div>

    <div class="block">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
        <h3>Your plan and what it costs</h3>
        ${GH.launchPricing ? '<span class="launch">Launch prices</span>' : ""}
      </div>
      <table class="plan-table">
        <thead><tr><th>Step</th><th class="num">Elsewhere</th><th class="num">Growth Hub</th></tr></thead>
        <tbody>${p.items.map(i => `<tr>
          <td><strong>${esc(i.s.name)}${i.qty > 1 ? ` × ${i.qty}` : ""}</strong><div class="d">${esc(i.s.desc)}</div></td>
          <td class="num">${i.market != null ? `<span class="strike">${inr(i.market)}</span>` : "—"}</td>
          <td class="num">${priceCell(i)}</td></tr>`).join("")}</tbody>
        <tfoot><tr><td>Total</td><td class="num">${inr(p.platform)}</td><td class="num">${p.items.some(i => i.s.unit === "from") ? "from " : ""}${inr(p.hub)}</td></tr></tfoot>
      </table>

      <div class="bars" aria-label="Cost comparison">
        <div class="bar-row"><div class="bar-label"><span>${esc(f.institute.label)} (institute)</span><span>${inr(f.institute.low)}–${inr(f.institute.high)}</span></div><div class="bar"><i style="width:${pct(f.institute.low)}"></i></div></div>
        <div class="bar-row"><div class="bar-label"><span>Same help on paid mentor platforms</span><span>${inr(p.platform)}</span></div><div class="bar"><i style="width:${pct(p.platform)}"></i></div></div>
        <div class="bar-row"><div class="bar-label"><span>Your Growth Hub plan</span><span>${inr(p.hub)}</span></div><div class="bar hub"><i style="width:${pct(p.hub)}"></i></div></div>
      </div>

      <div class="savings">
        ${instSave > 0 ? `<div class="saving-box"><span class="small">You keep, compared with an institute course</span><b>${inr(instSave)}+</b></div>` : ""}
        ${platSave > 0 ? `<div class="saving-box"><span class="small">You keep, compared with paid platforms</span><b>${inr(platSave)}</b></div>` : ""}
      </div>
      <p class="small">${esc(GH.marketNote)} ${p.items.some(i => i.k === "project") ? "Project price starts here and depends on scope and team size. " : ""}Session details and terms are confirmed before you pay. Growth Hub doesn't replace every course; it gives you focused help where you need it.</p>
    </div>

    <div class="send" data-copy-scope>
      <span class="eyebrow" style="color:inherit;opacity:.8">Last step</span>
      <h2>Send this roadmap to ${esc(GH.contact.founder)}</h2>
      <p>Your first consultation is free. Send your roadmap and we'll set up a time to talk it through.</p>
      <div class="actions">${sendOptions(message, `Career roadmap: ${name} (${f.label})`)}</div>
      <span class="small" data-copy-status role="status" style="color:inherit"></span>
      <details><summary>Preview the message</summary><pre class="msg" data-copy-src>${esc(message)}</pre></details>
    </div>

    <div class="actions">
      <button type="button" class="btn btn-ghost" id="editBtn">Change my answers</button>
      <button type="button" class="btn btn-ghost" id="resetBtn">Start over</button>
    </div>`;
  $("#editBtn").addEventListener("click", () => { r.hidden = true; $("#wizard").hidden = false; step = 0; renderStep(true); });
  $("#resetBtn").addEventListener("click", () => {
    Object.assign(state, {lang:"", stage:"", field:"", struggles:[], time:"", name:""});
    store.set(KEY, state); r.hidden = true; $("#wizard").hidden = false; step = 0; renderStep(true);
  });
  r.scrollIntoView({behavior:"smooth", block:"start"});
  $("h2", r).focus({preventScroll:true});
}

renderStep(false);
