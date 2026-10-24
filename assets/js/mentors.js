/* Mentors page: filter by language first, then field.
   Filters are kept in the URL (?lang=Telugu&field=data) so links can be shared. */

const params = new URLSearchParams(location.search);
const filter = {lang:params.get("lang") || "", field:params.get("field") || ""};

const usedFields = GH.fields.filter(f => GH.mentors.some(m => m.fields.includes(f.id)));
const chip = (group, val, label, sub) =>
  `<button type="button" class="chip" data-group="${group}" data-val="${esc(val)}" aria-pressed="${filter[group] === val}">${esc(label)}${sub ? `<span class="en">${esc(sub)}</span>` : ""}</button>`;

function render(){
  $("#langFilter").innerHTML = chip("lang", "", "All") + GH.languages.map(l => chip("lang", l.id, l.id, l.native !== l.id ? l.native : "")).join("");
  $("#fieldFilter").innerHTML = chip("field", "", "All fields") + usedFields.map(f => chip("field", f.id, f.label)).join("");

  const list = GH.mentors.filter(m =>
    (!filter.lang || m.languages.includes(filter.lang)) && (!filter.field || m.fields.includes(filter.field)));
  $("#list").innerHTML = list.length ? list.map(mentorCard).join("") :
    `<div class="empty" style="grid-column:1/-1"><h3>No mentor listed for this yet</h3><p>We're growing the mentor network. Tell us what you need and we'll look for someone${filter.lang ? ` who speaks ${esc(filter.lang)}` : ""}.</p><a class="btn btn-primary" href="contact.html?topic=mentor-request${filter.lang ? `&lang=${encodeURIComponent(filter.lang)}` : ""}">Request a mentor</a></div>`;

  const q = new URLSearchParams();
  if (filter.lang) q.set("lang", filter.lang);
  if (filter.field) q.set("field", filter.field);
  history.replaceState(null, "", q.toString() ? "?" + q : location.pathname);
}

document.addEventListener("click", e => {
  const c = e.target.closest(".chip[data-group]"); if (!c) return;
  filter[c.dataset.group] = c.dataset.val;
  render();
});
render();
