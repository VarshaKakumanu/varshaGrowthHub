/* Contact page. Prefills from links like
   contact.html?mentor=rani  |  ?topic=mentor-request&lang=Tamil  |  ?topic=become-mentor */

const TOPICS = [
  {id:"consult", label:"Free career consultation"},
  {id:"resume", label:GH.services.resume.name},
  {id:"mock", label:GH.services.mock.name},
  {id:"mentor", label:GH.services.mentor.name},
  {id:"project", label:GH.services.project.name},
  {id:"weekly", label:`${GH.weekly.title} (${GH.weekly.day})`},
  {id:"mentor-request", label:"Request a mentor in a specific field or language"},
  {id:"become-mentor", label:"Join Growth Hub as a mentor"}
];

const options = (list, sel) => list.map(o => `<option value="${esc(o.v)}"${o.v === sel ? " selected" : ""}>${esc(o.l)}</option>`).join("");
const p = new URLSearchParams(location.search);
const saved = store.get("gh-roadmap") || {};
const mentorParam = p.get("mentor");

$("#f-lang").innerHTML = options(GH.languages.map(l => ({v:l.id, l:l.native === l.id ? l.id : `${l.native} (${l.id})`})).concat([{v:"Other", l:"Other"}]), p.get("lang") || saved.lang || "Telugu");
$("#f-stage").innerHTML = options(GH.stages.map(s => ({v:s, l:s})), saved.stage || "Fresher / recent graduate");
$("#f-field").innerHTML = options(GH.fields.map(f => ({v:f.id, l:f.label})), saved.field || "unsure");
$("#f-topic").innerHTML = options(TOPICS.map(t => ({v:t.id, l:t.label})), p.get("topic") || (mentorParam ? "mentor" : "consult"));
$("#f-mentor").innerHTML = options([{v:"", l:"No preference"}].concat(GH.mentors.map(m => ({v:m.id, l:m.name}))), mentorParam || "");
if (saved.name) $("#f-name").value = saved.name;

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const err = $("#formErr");
  if (!f.name.trim()){ err.hidden = false; $("#f-name").focus(); return; }
  err.hidden = true;

  const topic = TOPICS.find(t => t.id === f.topic);
  const asMentor = f.topic === "become-mentor";
  const mentor = mentorById(f.mentor);
  const closing = asMentor ? "I'd like to join Growth Hub as a mentor."
    : f.topic === "consult" ? "I'd like to book a free career consultation."
    : "Could we set up a time to talk?";
  const lines = [
    `Hi ${GH.contact.founder}, I'm ${f.name.trim()}.`, "",
    `Language: ${f.lang}`,
    `Stage: ${f.stage}`,
    `${asMentor ? "My field" : "Goal"}: ${fieldById(f.field).label}`,
    `Interested in: ${topic.label}`
  ];
  if (mentor && !asMentor) lines.push(`Preferred mentor: ${mentor.name}`);
  if (f.msg.trim()) lines.push("", `${asMentor ? "About me" : "My biggest challenge"}: ${f.msg.trim()}`);
  lines.push("", closing);
  const message = lines.join("\n");

  $("#msgOut").textContent = message;
  $("#sendBtns").innerHTML = sendOptions(message, `Growth Hub: ${topic.label} (${f.name.trim()})`);
  $("[data-copy-status]").textContent = "";
  $("#out").hidden = false;
  $("#out").scrollIntoView({behavior:"smooth", block:"nearest"});
});
