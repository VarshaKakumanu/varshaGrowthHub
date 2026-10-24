/* Career roadmap tool.
   Steps, roadmaps, struggles and prices all come from config.js.
   Prices are only revealed in the result, after the visitor has answered. */

const KEY = "gh-roadmap";
const EMPTY = () => ({lang:"", stage:"", field:"", struggles:[], answers:{}, time:"", name:""});
const state = Object.assign(EMPTY(), store.get(KEY) || {});
let step = 0;
let pz = 0;   // which puzzle is showing in the puzzle step

/* Arriving from the home page (roadmap.html?s=nocalls): pre-fill the
   situation and skip the "Where you are" question it already answers.
   Arriving from Find your track (roadmap.html?field=data): pre-fill the goal and skip that question. */
const params = new URLSearchParams(location.search);
const hook = GH.situations.find(x => x.id === params.get("s"));
const fieldHook = GH.fields.find(f => f.id === params.get("field"));
const skip = new Set();
if (hook){
  state.stage = hook.stage;
  state.struggles = [...hook.struggles];
  skip.add(1);
}
if (fieldHook){
  state.field = fieldHook.id;
  skip.add(2);
}
if (hook || fieldHook){
  store.set(KEY, state);
  history.replaceState(null, "", location.pathname);
}

const opt = (val, label, sub, pressed, multi) =>
  `<button type="button" class="opt" data-val="${esc(val)}" aria-pressed="${pressed}">${multi ? '<span class="tick" aria-hidden="true"></span>' : ""}<span>${label}${sub ? `<span class="sub">${sub}</span>` : ""}</span></button>`;

const STEPS = [
  {
    short:"Language",
    title:"Which language do you think and learn best in?",
    hint:"We'll match you with a mentor who speaks it.",
    valid:() => !!state.lang,
    body:() => `<div class="opts">${GH.languages.map(l => opt(l.id, esc(l.id), l.native !== l.id ? esc(l.native) : "", state.lang === l.id)).join("")}</div>`,
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
    hint:`Not sure? <a href="track.html">Find your track</a> in about a minute, or pick "I'm not sure yet".`,
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
    short:"Puzzles",
    title:"Quick puzzle time!",
    hint:"No pressure. Four real-life scenarios that show where you really stand.",
    valid:() => GH.puzzles.every(q => state.answers[q.area] != null),
    body:() => puzzleHtml(),
    pick:v => {
      const q = GH.puzzles[pz];
      if (state.answers[q.area] == null) state.answers[q.area] = Number(v);
      return false;
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

function puzzleHtml(){
  const q = GH.puzzles[pz], ans = state.answers[q.area], done = ans != null;
  const right = GH.puzzles.filter(x => state.answers[x.area] != null && x.options[state.answers[x.area]].good).length;
  const dots = GH.puzzles.map((x, i) => {
    const a = state.answers[x.area];
    return `<i class="${a == null ? "" : x.options[a].good ? "win" : "miss"}${i === pz ? " cur" : ""}"></i>`;
  }).join("");
  return `<div class="puzzle">
    <div class="pz-top"><span class="pz-dots" aria-hidden="true">${dots}</span><span class="small">Puzzle ${pz + 1} of ${GH.puzzles.length} · ${right} right so far</span></div>
    <p class="pz-q">${esc(q.q)}</p>
    <div class="opts wide">${q.options.map((o, i) => {
      const cls = !done ? "" : o.good ? " good" : i === ans ? " bad" : " dim";
      return `<button type="button" class="opt${cls}" data-val="${i}" aria-pressed="${i === ans}"${done ? " aria-disabled=\"true\"" : ""}><span>${esc(o.t)}</span></button>`;
    }).join("")}</div>
    ${done ? `<div class="reveal ${q.options[ans].good ? "win" : "miss"}" role="status">
      <strong>${q.options[ans].good ? "Spot on!" : "Not quite, and that's useful to know."}</strong>
      <p>${esc(q.reveal)}</p>
      <p class="helps">${esc(q.helps)}</p>
      ${pz < GH.puzzles.length - 1 ? `<button type="button" class="btn btn-ghost" data-pz-next>Next puzzle →</button>` : ""}
    </div>` : ""}
  </div>`;
}

function renderProgress(){
  $("#progress").innerHTML = STEPS.map((s, i) =>
    `<li class="${i < step ? "done" : i === step ? "now" : ""}"${i === step ? ' aria-current="step"' : ""}><span>${i + 1}</span><b>${s.short}</b></li>`
  ).join("");
}

function renderStep(focus){
  const s = STEPS[step], last = step === STEPS.length - 1;
  $("#panel").innerHTML = `
    <div style="display:grid;gap:8px">
      <h2 tabindex="-1">${s.title}</h2>
      <span class="eyebrow">Question ${step + 1} of ${STEPS.length}</span>
      ${s.hint ? `<p class="small">${s.hint}</p>` : ""}
    </div>
    ${hook && step === 0 ? `<p class="from-hook">You picked “${esc(hook.label)}”. Noted. Just a few more questions.</p>` : ""}
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
  let next = step + delta;
  while (skip.has(next)) next += delta;
  step = Math.max(0, Math.min(STEPS.length - 1, next));
  if (STEPS[step].short === "Puzzles"){
    const open = GH.puzzles.findIndex(q => state.answers[q.area] == null);
    pz = open < 0 ? GH.puzzles.length - 1 : open;
  }
  renderStep(true);
  $("#wizard").scrollIntoView({behavior:"smooth", block:"start"});
}

$("#panel").addEventListener("click", e => {
  const nav = e.target.closest("[data-nav]");
  if (nav) return go(Number(nav.dataset.nav));
  if (e.target.closest("[data-pz-next]")){ pz++; renderStep(false); $(".pz-q").focus?.(); return; }
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

/* ---------- Growth stage art: a sunflower that grows with each stage ---------- */
function stageArt(i){
  const C = {stem:"#7FB04A", leaf:"#5E9A36", gold:"#F5B201", deep:"#E8930C", seed:"#5A3412", soil:"#6B4423"};
  const top = [72, 46, 36, 34][i];
  const leaf = (y, dir) => `<path d="M40 ${y} q${dir * 16} -10 ${dir * 22} 2 q${dir * -12} 8 ${dir * -22} -2z" fill="${C.leaf}"/>`;
  let head = "";
  if (i === 0) head = leaf(74, 1) + leaf(74, -1);
  if (i >= 1) head += leaf(80, 1) + leaf(66, -1);
  if (i === 2) head += `<circle cx="40" cy="${top}" r="7" fill="${C.stem}"/>` +
    [-30, 0, 30].map(a => `<ellipse cx="40" cy="${top - 8}" rx="2.6" ry="5" fill="${C.gold}" transform="rotate(${a} 40 ${top})"/>`).join("");
  if (i === 3) head += Array.from({length:14}, (_, k) =>
      `<ellipse cx="40" cy="${top - 14}" rx="3.6" ry="7.5" fill="${k % 2 ? C.deep : C.gold}" transform="rotate(${k * 360 / 14} 40 ${top})"/>`).join("") +
    `<circle cx="40" cy="${top}" r="8" fill="${C.seed}"/>`;
  return `<svg viewBox="0 0 80 100" width="88" height="110" aria-hidden="true">
    <ellipse cx="40" cy="94" rx="24" ry="5" fill="${C.soil}" opacity=".7"/>
    <path d="M40 92 V${top}" stroke="${C.stem}" stroke-width="4" stroke-linecap="round"/>${head}</svg>`;
}

/* ---------- "Where you stand" ---------- */
const LEVEL = {focus:"Focus here", needs:"Needs work", ok:"On track"};
function rateAreas(){
  const has = ids => (ids || []).some(id => state.struggles.includes(id));
  return GH.insightAreas.map(a => {
    const n = a.needs || {};
    const q = GH.puzzles.find(x => x.area === a.id), ans = q ? state.answers[a.id] : null;
    const right = ans == null ? null : q.options[ans].good;
    const level = has(a.focus) ? "focus"
      : right === false ? "needs"
      : right === true ? "ok"
      : ((n.stages || []).includes(state.stage) || has(n.struggles) || (n.fields || []).includes(state.field)) ? "needs" : "ok";
    return {a, level, right};
  });
}

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
  const areas = rateAreas();
  const focusAreas = areas.filter(x => x.level === "focus").map(x => x.a.label);
  const solved = areas.filter(x => x.right).length;
  const points = solved + areas.filter(x => x.level === "ok").length;
  const growth = [...GH.growthLevels].reverse().find(g => points >= g.min);
  const priceCell = i => i.s.price ? `${i.s.unit === "from" ? "from " : ""}${inr(i.cost)}` : "Free";
  const instSave = f.institute.low - p.hub;
  const platSave = p.platform - p.hubComparable;
  const max = Math.max(f.institute.low, p.hub, 1);
  const pct = n => (n / max * 100).toFixed(1) + "%";

  const tips = p.chosen.map(s => s.tip);
  if (state.time === "Weekends") tips.push(`${GH.weekly.title} runs ${GH.weekly.day} at ${GH.weekly.time}, which fits your weekends.`);
  if (state.time === "Weekday evenings") tips.push("Mention your preferred evening time when you send this, and we'll try to plan sessions around it.");

  const mentorHtml = best ? `<div class="match"><span class="mono" aria-hidden="true">${esc(best.initials)}</span><div>
      <h3>${esc(best.name)}</h3><div class="small">${esc(best.role)} · speaks ${best.languages.map(esc).join(", ")}</div>
      ${best.linkedin ? `<a href="${esc(best.linkedin)}" target="_blank" rel="noopener" style="font-weight:700;font-size:.92rem">LinkedIn ↗</a>` : ""}
    </div></div>
    ${!native.length ? `<p class="small">We don't have a ${esc(state.lang)}-speaking mentor listed yet. Send your roadmap anyway: we'll look for one in your field, and ${esc(best.name.split(" ")[0])} can help in the meantime.</p>` : ""}`
    : `<p>We'll find a ${esc(state.lang)}-speaking mentor in your field for you. Send your roadmap and mention it.</p>`;

  const message = [
    `Hi ${GH.contact.founder}, I'm ${name}. I built my career roadmap on Rooting Careers.`,
    "",
    `Language: ${state.lang}`,
    `Where I am: ${state.stage}`,
    `Goal: ${f.label}`,
    `Struggles:`,
    ...p.chosen.map(s => `- ${s.label}`),
    `Best time for me: ${state.time}`,
    `Growth stage: ${growth.name} (${solved}/${GH.puzzles.length} puzzles right)`,
    ...(focusAreas.length ? [`Focus areas: ${focusAreas.join(", ")}`] : []),
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
      <h2 tabindex="-1">${esc(name)}, your career check: ${esc(f.label)}</h2>
      <p class="lede">Based on where you are (${esc(state.stage.toLowerCase())}), what's holding you back and how you handled the puzzles.</p>
    </div>

    <div class="growth">
      <span class="g-icon">${stageArt(GH.growthLevels.indexOf(growth))}</span>
      <div style="display:grid;gap:4px">
        <h3>${esc(name)}, you're ${esc(growth.name)}!</h3>
        <p>${esc(growth.text)}</p>
        <p class="small" style="color:inherit;opacity:.85">You got ${solved} of ${GH.puzzles.length} puzzles right.</p>
      </div>
      <ol class="g-track" aria-label="Growth stages">${GH.growthLevels.map(g => `<li class="${g === growth ? "here" : g.min < growth.min ? "past" : ""}">${esc(g.name)}</li>`).join("")}</ol>
    </div>

    <div class="block">
      <div style="display:grid;gap:4px">
        <h3>Where you stand</h3>
        <p class="small">Based on your answers. It's a starting point, not a test score; your mentor will look deeper in the free consultation.</p>
      </div>
      <div class="stand">${areas.map(({a, level}) => `<div class="area ${level}">
        <h3>${esc(a.label)}</h3>
        <div class="meter" aria-hidden="true"><i></i><i></i><i></i></div>
        <span class="level">${LEVEL[level]}</span>
        <p>${esc(a.text[level])}</p>
      </div>`).join("")}</div>
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
      <h3>Your mentor match <span class="small">(${esc(state.lang)} speakers first)</span></h3>
      ${mentorHtml}
    </div>

    <div class="block">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
        <h3>Your plan and what it costs</h3>
        ${GH.launchPricing ? '<span class="launch">Launch prices</span>' : ""}
      </div>
      <table class="plan-table">
        <thead><tr><th>Step</th><th class="num">Elsewhere</th><th class="num">Rooting Careers</th></tr></thead>
        <tbody>${p.items.map(i => `<tr>
          <td><strong>${esc(i.s.name)}${i.qty > 1 ? ` × ${i.qty}` : ""}</strong><div class="d">${esc(i.s.desc)}</div></td>
          <td class="num">${i.market != null ? `<span class="strike">${inr(i.market)}</span>` : "—"}</td>
          <td class="num">${priceCell(i)}</td></tr>`).join("")}</tbody>
        <tfoot>
          ${p.platform ? `<tr><td>Same items, elsewhere vs here</td><td class="num">${inr(p.platform)}</td><td class="num">${inr(p.hubComparable)}</td></tr>` : ""}
          <tr><td>Your full plan</td><td class="num"></td><td class="num">${p.items.some(i => i.s.unit === "from") ? "from " : ""}${inr(p.hub)}</td></tr>
        </tfoot>
      </table>

      <div class="bars" aria-label="Cost comparison">
        <div class="bar-row"><div class="bar-label"><span>${esc(f.institute.label)} (institute)</span><span>${inr(f.institute.low)}–${inr(f.institute.high)}</span></div><div class="bar"><i style="width:${pct(f.institute.low)}"></i></div></div>
        <div class="bar-row"><div class="bar-label"><span>Your Rooting Careers plan</span><span>${inr(p.hub)}</span></div><div class="bar hub"><i style="width:${pct(p.hub)}"></i></div></div>
      </div>

      <div class="savings">
        ${instSave > 0 ? `<div class="saving-box"><span class="small">You keep, compared with an institute course</span><b>${inr(instSave)}+</b></div>` : ""}
        ${platSave > 0 ? `<div class="saving-box"><span class="small">You keep on the same items, compared with paid mentor platforms</span><b>${inr(platSave)}</b></div>` : ""}
      </div>
      <p class="small">${esc(GH.marketNote)} ${p.items.some(i => i.k === "project") ? "Project price starts here and depends on scope and team size. " : ""}Session details and terms are confirmed before you pay. Rooting Careers doesn't replace every course; it gives you focused help where you need it.</p>
    </div>

    <div class="send" data-copy-scope>
      <h2>Last step: send this roadmap to ${esc(GH.contact.founder)}</h2>
      <p>Your first consultation is free. Send your roadmap and we'll set up a time to talk it through.</p>
      <div class="actions">${sendOptions(message, `Career roadmap: ${name} (${f.label})`)}</div>
      <span class="small" data-copy-status role="status" style="color:inherit"></span>
      <details><summary>Preview the message</summary><pre class="msg" data-copy-src>${esc(message)}</pre></details>
    </div>

    <div class="actions">
      <button type="button" class="btn btn-ghost" id="editBtn">Change my answers</button>
      <button type="button" class="btn btn-ghost" id="resetBtn">Start over</button>
    </div>`;
  $("#editBtn").addEventListener("click", () => { skip.clear(); r.hidden = true; $("#wizard").hidden = false; step = 0; renderStep(true); });
  $("#resetBtn").addEventListener("click", () => {
    Object.assign(state, EMPTY());
    skip.clear(); store.set(KEY, state); r.hidden = true; $("#wizard").hidden = false; step = 0; renderStep(true);
  });
  r.scrollIntoView({behavior:"smooth", block:"start"});
  $("h2", r).focus({preventScroll:true});
}

renderStep(false);
