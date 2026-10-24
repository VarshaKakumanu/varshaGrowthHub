/* Find your track: a short quiz that ranks the career fields and shows insights for each.
   Questions, points and insights all come from config.js (GH.trackQuiz, GH.trackInsights). */

const TKEY = "gh-track";
const Q = GH.trackQuiz;
const SHORT = ["Interests", "Studies", "Coding", "Style", "Skills", "Timing"];
const tq = Object.assign({answers:[], view:""}, store.get(TKEY) || {});
let tqStep = Math.min(tq.answers.filter(a => a != null).length, Q.length - 1);

const trackIds = Object.keys(GH.trackInsights);
/* Highest score each field could reach, so fits are comparable across fields. */
const maxFor = id => Q.reduce((sum, q) => sum + Math.max(0, ...q.options.map(o => o.pts[id] || 0)), 0);

function scores(){
  return trackIds.map(id => {
    const got = Q.reduce((sum, q, i) => sum + ((q.options[tq.answers[i]] || {pts:{}}).pts[id] || 0), 0);
    const reasons = Q.map((q, i) => q.options[tq.answers[i]]).filter(o => o && (o.pts[id] || 0) >= 2).map(o => o.label);
    return {id, fit:Math.round(got / maxFor(id) * 100), reasons};
  }).sort((a, b) => b.fit - a.fit);
}
const fitLabel = f => f >= 70 ? "Strong fit" : f >= 45 ? "Good fit" : "Worth a look";

function renderProgress(){
  $("#tqProgress").innerHTML = Q.map((_, i) =>
    `<li class="${i < tqStep ? "done" : i === tqStep ? "now" : ""}"><span>${i + 1}</span><b>${SHORT[i] || "Question " + (i + 1)}</b></li>`).join("");
}

function renderQuestion(focus){
  const q = Q[tqStep];
  renderProgress();
  $("#tqPanel").innerHTML = `
    <div style="display:grid;gap:8px">
      <h2 tabindex="-1">${esc(q.q)}</h2>
      <span class="eyebrow">Question ${tqStep + 1} of ${Q.length}</span>
    </div>
    <div class="opts wide">${q.options.map((o, k) =>
      `<button type="button" class="opt" data-pick="${k}" aria-pressed="${tq.answers[tqStep] === k}"><span>${esc(o.label)}</span></button>`).join("")}</div>
    <div class="panel-nav">
      <button type="button" class="btn btn-ghost" data-tq="back" ${tqStep === 0 ? "disabled" : ""}>Back</button>
      <span class="small">Pick one to continue</span>
    </div>`;
  if (focus) $("#tqPanel h2").focus({preventScroll:true});
}

function insightBlock(id){
  const f = fieldById(id), I = GH.trackInsights[id], s = scores().find(x => x.id === id);
  const mentors = GH.mentors.filter(m => m.fields.includes(id));
  return `
    <div class="track-insight" id="tqInsight">
      <div class="track-insight-head">
        <span class="level ${s.fit >= 70 ? "focus" : ""}">${fitLabel(s.fit)}</span>
        <h3>${esc(f.label)}</h3>
        ${s.reasons.length ? `<p class="small">Because you said: ${s.reasons.map(r => `“${esc(r)}”`).join(", ")}</p>` : ""}
      </div>
      <dl class="insights">
        <div><dt>What you'd do</dt><dd>${esc(I.day)}</dd></div>
        <div><dt>Suits people who</dt><dd>${esc(I.suits.replace(/^People who /, ""))}</dd></div>
        <div><dt>Time to job-ready</dt><dd>${esc(I.ready)}</dd></div>
        <div><dt>Typical fresher pay</dt><dd>${esc(I.pay)}</dd></div>
        <div><dt>Demand</dt><dd>${esc(I.demand)}</dd></div>
        <div><dt>Start this week</dt><dd>${esc(I.first)}</dd></div>
      </dl>
      <p class="small">${mentors.length
        ? `Mentor${mentors.length > 1 ? "s" : ""} for this track: ${mentors.map(m => `<a href="contact.html?mentor=${m.id}&field=${id}">${esc(m.name)}</a> (${esc(m.role)})`).join(", ")}.`
        : `No mentor for this track yet. <a href="contact.html?topic=mentor-request">Ask us to find one</a>.`}</p>
      <div class="actions">
        <a class="btn btn-primary" href="roadmap.html?field=${id}">Build my ${esc(f.label.split(" (")[0].split(" / ")[0])} roadmap</a>
        <a class="btn btn-ghost" href="contact.html?topic=consult&field=${id}">Talk it through for free</a>
      </div>
    </div>`;
}

function renderResult(scroll){
  const all = scores();
  if (!tq.view || !GH.trackInsights[tq.view]) tq.view = all[0].id;
  store.set(TKEY, tq);
  $("#trackQuiz").hidden = true;
  const r = $("#tqResult");
  r.hidden = false;
  r.innerHTML = `
    <div class="result-head">
      <h2 tabindex="-1">Your best fit: ${esc(fieldById(all[0].id).label)}</h2>
      <p class="lede">A starting point, not a verdict. Tap any track to compare, then talk it through with a mentor before you commit.</p>
    </div>
    <div class="track-grid">
      <div class="block track-list" role="list" aria-label="Tracks ranked by fit">
        ${all.map(s => `<button type="button" class="track-row" role="listitem" data-view="${s.id}" aria-pressed="${s.id === tq.view}">
          <span class="bar-label"><span>${esc(fieldById(s.id).label)}</span><span>${fitLabel(s.fit)}</span></span>
          <span class="bar ${s.id === all[0].id ? "hub" : ""}"><i style="width:${Math.max(6, s.fit)}%"></i></span>
        </button>`).join("")}
        <p class="small">${esc(GH.payNote)}</p>
        <button type="button" class="btn btn-ghost" data-tq="restart" style="justify-self:start">Start again</button>
      </div>
      <div class="block">${insightBlock(tq.view)}</div>
    </div>`;
  if (scroll){ $("#tqResult h2").focus({preventScroll:true}); r.scrollIntoView({behavior:"smooth", block:"start"}); }
}

$("#tqPanel").addEventListener("click", e => {
  const pick = e.target.closest("[data-pick]");
  if (pick){
    tq.answers[tqStep] = Number(pick.dataset.pick);
    store.set(TKEY, tq);
    pick.setAttribute("aria-pressed", "true");
    /* short pause so the choice is seen before moving on */
    setTimeout(() => { if (tqStep < Q.length - 1){ tqStep++; renderQuestion(true); } else { tq.view = ""; renderResult(true); } }, 220);
    return;
  }
  if (e.target.closest('[data-tq="back"]') && tqStep > 0){ tqStep--; renderQuestion(true); }
});

$("#tqResult").addEventListener("click", e => {
  const row = e.target.closest("[data-view]");
  if (row){
    tq.view = row.dataset.view;
    store.set(TKEY, tq);
    document.querySelectorAll(".track-row").forEach(b => b.setAttribute("aria-pressed", b === row));
    row.closest(".track-grid").querySelector(".block:last-child").innerHTML = insightBlock(tq.view);
    if (matchMedia("(max-width:860px)").matches) $("#tqInsight").scrollIntoView({behavior:"smooth", block:"start"});
    return;
  }
  if (e.target.closest('[data-tq="restart"]')){
    Object.assign(tq, {answers:[], view:""});
    store.set(TKEY, tq);
    tqStep = 0;
    $("#tqResult").hidden = true;
    $("#trackQuiz").hidden = false;
    renderQuestion(true);
  }
});

/* Returning visitors who finished the quiz see their result straight away. */
if (tq.answers.length === Q.length && tq.answers.every(a => a != null)) renderResult(false);
else renderQuestion(false);
