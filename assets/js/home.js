/* Home page */

/* ---------- Hero: trust row and an example roadmap on the laptop (built from config.js) ---------- */
const mentorLangsHero = [...new Set(GH.mentors.flatMap(m => m.languages))].join(" & ");
const weekday = GH.weekly.day.replace(/^Every\s+/i, "");
$("#trust").innerHTML = [
  [ICON.lang, `${mentorLangsHero} mentors`],
  [ICON.cal, `Free ${weekday} sessions`],
  [ICON.shield, "No placement promises"]
].map(([ic, t]) => `<li>${ic}<span>${esc(t)}</span></li>`).join("");

(function heroRoadmap(){
  const f = fieldById("data") || GH.fields[0];
  const fill = [70, 6, 0];
  $("#appScreen").innerHTML = `
    <div class="app-top"><b>Your roadmap · ${esc(f.label)}</b><span class="tagx">Example</span></div>
    ${f.phases.map((ph, i) => `<div class="ph">
      <div class="ph-h">${esc(ph.t)} <span>${esc(ph.w)}${fill[i] ? ` · ${fill[i]}%` : ""}</span></div>
      <div class="ph-bar"><i data-w="${fill[i] || 0}"></i></div>
      ${ph.items.slice(0, i === 0 ? 3 : 1).map((t, k) => `<div class="task"><span class="chk" data-on="${i === 0 && k < 2 ? 1 : 0}"></span>${esc(t)}</div>`).join("")}
    </div>`).join("")}`;
  const m = GH.mentors.find(x => x.fields.includes(f.id)) || GH.mentors[0];
  $("#fMentor").innerHTML = `<div class="row"><span class="av">${esc(m.initials)}</span><div><b>Mentor match</b><br><small>${esc(m.name)} · ${esc(m.languages[0])}</small></div></div>`;
  $("#fMock").innerHTML = `<div class="row">${ICON.cal}<div><b>Saturday session</b><br><small>${esc(weekday)} · ${esc(GH.weekly.time)}</small></div></div>`;
  // fill the progress bars and tick the done tasks shortly after load
  const go = () => {
    document.querySelectorAll("#appScreen .ph-bar i").forEach(i => i.style.width = i.dataset.w + "%");
    document.querySelectorAll('#appScreen .chk[data-on="1"]').forEach((c, k) => setTimeout(() => c.classList.add("on"), reduceMotion ? 0 : 500 + k * 450));
  };
  reduceMotion ? go() : setTimeout(go, 500);
})();

/* Hook: one tap on a situation starts the roadmap with it pre-filled. */
$("#sits").innerHTML = GH.situations.map(x =>
  `<a class="sit" href="roadmap.html?s=${x.id}"><span>${esc(x.label)}</span><span class="arrow" aria-hidden="true">→</span></a>`
).join("");

const mentorLangs = [...new Set(GH.mentors.flatMap(m => m.languages))];
$("#proof").innerHTML = [
  `${GH.mentors.length} industry mentors`,
  `Mentors speak ${mentorLangs.join(" & ")}`,
  `Free ${GH.weekly.title.split(" ")[0]} sessions`
].map(t => `<li>${esc(t)}</li>`).join("");

/* Language chips link to the mentors page, pre-filtered. */
$("#langChips").innerHTML = GH.languages.map(l =>
  `<a class="chip" href="mentors.html?lang=${encodeURIComponent(l.id)}">${esc(l.id)}${l.native !== l.id ? `<span class="en">${esc(l.native)}</span>` : ""}</a>`
).join("");

/* Services, without prices (prices appear in the personal roadmap). */
const S = GH.services;
const tracks = GH.mockTracks.map(t => t.name);
const SERVICE_CARDS = [
  {k:"Start here", ic:ICON.compass, s:S.consult, points:["Understand where you are now","Spot your real skill gaps","Leave with a practical roadmap"]},
  {k:"Get shortlisted", ic:ICON.doc, s:S.resume, points:["Structure and formatting","Projects presented well","Keywords for your target role"]},
  {k:"Get selected", ic:ICON.mic, s:S.mock, points:tracks.slice(0, 4).concat(tracks.length > 4 ? [`+ ${tracks.length - 4} more tracks`] : [])},
  {k:"Get direction", ic:ICON.users, s:S.mentor, points:["Career-path discussions","What to learn first, and what to skip","Real workplace expectations"]},
  {k:"Get proof", ic:ICON.code, s:S.project, points:["Small team with shared goals","Mentor code or design reviews","A deployed project for your portfolio"]},
  {k:"Free", ic:ICON.chat, s:S.community, points:["Jobs channel and peer Q&A","Saturday sessions at 11 AM","Mentors and peers in your language"]}
];
$("#svcCount").textContent = `${SERVICE_CARDS.length} ways we help`;
$("#services").innerHTML = SERVICE_CARDS.map(c => `<article class="card">
  <span class="icon-box" aria-hidden="true">${c.ic}</span><span class="k">${esc(c.k)}</span><h3>${esc(c.s.name)}</h3><p>${esc(c.s.desc)}</p>
  <ul>${c.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
</article>`).join("");

$("#weekly").innerHTML = weeklyBanner();
$("#mentors").innerHTML = GH.mentors.map(mentorCard).join("");

const FREE = [
  {k:"Jobs", ic:ICON.briefcase, t:"WhatsApp Jobs Channel", d:"Job openings, fresher opportunities and hiring updates.", link:GH.links.jobsChannel, cta:"Follow the channel"},
  {k:"Q&A", ic:ICON.chat, t:"Career Community Group", d:"Ask questions, discuss challenges and find teammates for projects.", link:GH.links.communityGroup, cta:"Join the group"},
  {k:"Weekly", ic:ICON.cal, t:GH.weekly.title, d:`${GH.weekly.day}, ${GH.weekly.time}. Project building or knowledge sharing with mentors.`, link:"community.html", cta:"See details", internal:true}
];
$("#free").innerHTML = FREE.map(f => `<article class="card">
  <span class="icon-box" aria-hidden="true">${f.ic}</span><span class="k">${esc(f.k)}</span><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p>
  <div class="foot">${f.link ? `<a href="${esc(f.link)}"${f.internal ? "" : ' target="_blank" rel="noopener"'} class="more">${esc(f.cta)} →</a>` : "Link coming soon"}</div>
</article>`).join("");

/* ---------- Founder note ---------- */
const N = GH.founderNote;
$("#founderNote").innerHTML = `
  <p class="hand hello">${esc(N.hello)}</p>
  ${N.body.map(t => `<p>${esc(t)}</p>`).join("")}
  <p class="hand sign">${esc(N.sign)}</p>
  <a class="btn btn-ghost" href="about.html">Read my story</a>`;

/* ---------- Game 1: Myth or Fact? ---------- */
const myth = {i:0, score:0, answered:null};
function renderMyth(){
  const box = $("#mythGame"), total = GH.myths.length;
  if (myth.i >= total){
    const msg = myth.score === total ? "Myth-buster level: expert!" : myth.score >= total - 2 ? "Nice! You see through most of it." : "Most people get caught by these. Now you know.";
    box.innerHTML = `      <div class="score">${myth.score}<small>/${total}</small></div>
      <h3>${msg}</h3>
      <p class="small">Myths like these are why people spend lakhs on courses, send resumes nobody reads and stop applying too early.</p>
      <div class="actions"><a class="btn btn-primary" href="roadmap.html">Take the full career check</a><button type="button" class="btn btn-ghost" data-myth="again">Play again</button></div>`;
    return;
  }
  const m = GH.myths[myth.i], a = myth.answered, done = a !== null, right = done && a === m.fact;
  const dots = GH.myths.map((_, k) => `<i class="${k < myth.i ? "past" : k === myth.i ? "cur" : ""}"></i>`).join("");
  box.innerHTML = `<div class="pz-top"><span class="eyebrow">Myth or Fact? · ${myth.i + 1} of ${total}</span><span class="pz-dots" aria-hidden="true">${dots}</span></div>
    <p class="myth-s">“${esc(m.s)}”</p>
    <div class="mf">
      <button type="button" class="btn mf-btn${done ? (m.fact === false ? " good" : a === false ? " bad" : " dim") : ""}" data-myth="myth" ${done ? "disabled" : ""}>Myth</button>
      <button type="button" class="btn mf-btn${done ? (m.fact === true ? " good" : a === true ? " bad" : " dim") : ""}" data-myth="fact" ${done ? "disabled" : ""}>Fact</button>
    </div>
    ${done ? `<div class="reveal ${right ? "win" : "miss"}" role="status">
      <strong>${right ? "You got it!" : `It's actually a ${m.fact ? "fact" : "myth"}.`}</strong>
      <p>${esc(m.why)}</p>
      <button type="button" class="btn btn-ghost" data-myth="next">${myth.i < total - 1 ? "Next one →" : "See my score →"}</button>
    </div>` : ""}`;
}
$("#mythGame").addEventListener("click", e => {
  const b = e.target.closest("[data-myth]"); if (!b) return;
  const act = b.dataset.myth;
  if (act === "myth" || act === "fact"){
    myth.answered = act === "fact";
    if (myth.answered === GH.myths[myth.i].fact) myth.score++;
  } else if (act === "next"){ myth.i++; myth.answered = null; }
  else if (act === "again"){ Object.assign(myth, {i:0, score:0, answered:null}); }
  renderMyth();
});
renderMyth();

/* ---------- Game 2: Guess the cost ---------- */
const fs = fieldById("fullstack").institute;
const cost = {guess:50000, revealed:false};
function renderCost(){
  const box = $("#costGame"), MAX = 500000;
  const pos = n => Math.min(100, n / MAX * 100).toFixed(1) + "%";
  const verdict = cost.guess < fs.low ? "You guessed low. Many people do, until the fee slip arrives."
    : cost.guess > fs.high ? "You guessed high, but some programmes really do get close."
    : "Good instinct! You're right in the range.";
  box.innerHTML = `<h3>How much does a full-stack bootcamp cost in India?</h3>
    <div class="guess">${inr(cost.guess)}</div>
    <input type="range" id="costRange" min="0" max="${MAX}" step="5000" value="${cost.guess}" aria-label="Your guess in rupees" ${cost.revealed ? "disabled" : ""}>
    ${cost.revealed ? `
      <div class="range-track" aria-hidden="true"><span class="real" style="left:${pos(fs.low)};right:calc(100% - ${pos(fs.high)})"></span><span class="you" style="left:${pos(cost.guess)}"></span></div>
      <div class="reveal ${cost.guess >= fs.low && cost.guess <= fs.high ? "win" : "miss"}" role="status">
        <strong>Real range: ${inr(fs.low)} to ${inr(fs.high)}</strong>
        <p>${verdict} Your career check shows what a focused plan would cost you instead. Spoiler: a tiny fraction.</p>
        <a class="btn btn-primary" href="roadmap.html">See my plan's cost</a>
      </div>` : `<button type="button" class="btn btn-primary" id="costReveal">Reveal the real price</button>`}`;
}
$("#costGame").addEventListener("input", e => { if (e.target.id === "costRange"){ cost.guess = Number(e.target.value); $(".guess", $("#costGame")).textContent = inr(cost.guess); } });
$("#costGame").addEventListener("click", e => { if (e.target.id === "costReveal"){ cost.revealed = true; renderCost(); } });
renderCost();

/* ---------- Final call to action: the seed blooms when it scrolls into view ---------- */
(function seedToBloom(){
  const box = $("#seedToBloom"); if (!box) return;
  box.innerHTML = `${seedSVG(96)}<span aria-hidden="true">→</span>${bloomSVG(120, "stb-bloom")}`;
  const bloom = $(".stb-bloom", box);
  if (reduceMotion || !("IntersectionObserver" in window)){ bloom.classList.add("open"); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ bloom.classList.add("open"); io.disconnect(); } }), {threshold:.5});
  io.observe(box);
})();
