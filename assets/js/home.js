/* Home page */

/* Language chips link to the mentors page, pre-filtered. */
$("#langChips").innerHTML = GH.languages.map(l =>
  `<a class="chip" href="mentors.html?lang=${encodeURIComponent(l.id)}">${esc(l.native)}${l.native !== l.id ? `<span class="en">${esc(l.id)}</span>` : ""}</a>`
).join("");

/* Services, without prices (prices appear in the personal roadmap). */
const S = GH.services;
const tracks = GH.mockTracks.map(t => t.name);
const SERVICE_CARDS = [
  {k:"Start here", s:S.consult, points:["Understand where you are now","Spot your real skill gaps","Leave with a practical roadmap"]},
  {k:"Get shortlisted", s:S.resume, points:["Structure and formatting","Projects presented well","Keywords for your target role"]},
  {k:"Get selected", s:S.mock, points:tracks.slice(0, 4).concat(tracks.length > 4 ? [`+ ${tracks.length - 4} more tracks`] : [])},
  {k:"Get direction", s:S.mentor, points:["Career-path discussions","What to learn first, and what to skip","Real workplace expectations"]},
  {k:"Get proof", s:S.project, points:["Small team with shared goals","Mentor code or design reviews","A deployed project for your portfolio"]},
  {k:"Free", s:S.community, points:["Jobs channel and peer Q&A","Saturday sessions at 11 AM","Mentors and peers in your language"]}
];
$("#services").innerHTML = SERVICE_CARDS.map(c => `<article class="card">
  <span class="k">${esc(c.k)}</span><h3>${esc(c.s.name)}</h3><p>${esc(c.s.desc)}</p>
  <ul>${c.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
</article>`).join("");

$("#weekly").innerHTML = weeklyBanner();
$("#mentors").innerHTML = GH.mentors.map(mentorCard).join("");

const FREE = [
  {k:"Jobs", t:"WhatsApp Jobs Channel", d:"Job openings, fresher opportunities and hiring updates.", link:GH.links.jobsChannel, cta:"Follow the channel"},
  {k:"Q&A", t:"Career Community Group", d:"Ask questions, discuss challenges and find teammates for projects.", link:GH.links.communityGroup, cta:"Join the group"},
  {k:"Weekly", t:GH.weekly.title, d:`${GH.weekly.day}, ${GH.weekly.time}. Project building or knowledge sharing with mentors.`, link:"community.html", cta:"See details", internal:true}
];
$("#free").innerHTML = FREE.map(f => `<article class="card">
  <span class="k">${esc(f.k)}</span><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p>
  <div class="foot">${f.link ? `<a href="${esc(f.link)}"${f.internal ? "" : ' target="_blank" rel="noopener"'} style="font-weight:700">${esc(f.cta)} →</a>` : "Link coming soon"}</div>
</article>`).join("");
