/* Step Up (stepup.html): a guided, chat-style career session with Varsha.
   Flow: hello → check-in + breath → what's heavy → career in mind? (3 branches)
         → discover (interests, games, work style) → what fits → real role → goal + weekly tasks → life plan → send to Varsha.
   All wording and options come from GH.stepUp in config.js.
   Progress is saved in this browser only (localStorage "rc-stepup"); nothing is sent anywhere unless the visitor sends it. */
(function stepUp(){
  const D = GH.stepUp, app = document.getElementById("su");
  if (!app || !D) return;
  const KEY = "rc-stepup";
  let S = store.get(KEY) || {};
  const save = () => store.set(KEY, S);
  const wait = ms => new Promise(r => setTimeout(r, reduceMotion ? Math.min(ms, 60) : ms));
  const roleById = id => D.roles.find(r => r.id === id);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--){ const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
  const YEAR = new Date().getFullYear();
  const later = months => new Date(new Date().getFullYear(), new Date().getMonth() + months, 1).toLocaleString("en-IN", {month:"long", year:"numeric"});
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const NAME = () => esc(S.name || "You");

  app.innerHTML = `<div class="su-top">
      <div class="su-prog"><span id="suLabel">Getting to know you</span><div class="su-bar" aria-hidden="true"><b id="suBar"></b></div></div>
      <button class="su-reset" id="suReset" type="button">Start over</button>
    </div>
    <div class="su-body">
      <div class="su-chat" id="suChat" aria-live="polite"></div>
      <div class="su-stage" id="suStage" aria-hidden="true"></div>
    </div>`;
  const chat = $("#suChat"), stage = $("#suStage");
  function progress(pct, label){ $("#suBar").style.width = pct + "%"; $("#suLabel").textContent = label; }
  $("#suReset").addEventListener("click", () => {
    if (!confirm("Start over? Your saved answers and plan in this browser will be cleared.")) return;
    try { localStorage.removeItem(KEY); } catch(e){}
    location.reload();
  });

  /* ---------- Chat ---------- */
  function scrollDown(el){
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
      if (el && matchMedia("(max-width:860px)").matches) el.scrollIntoView({block:"end", behavior: reduceMotion ? "auto" : "smooth"});
    });
  }
  function add(html){
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    const el = t.content.firstElementChild;
    chat.append(el); scrollDown(el);
    return el;
  }
  async function say(html){
    const m = add(`<div class="su-msg"><span class="su-av" aria-hidden="true">V</span><div class="su-b su-typing"><i></i><i></i><i></i></div></div>`);
    await wait(450 + Math.min(String(html).replace(/<[^>]+>/g, "").length * 9, 1100));
    const b = $(".su-b", m);
    b.classList.remove("su-typing"); b.innerHTML = html;
    scrollDown(m);
    return m;
  }
  const me = text => add(`<div class="su-msg su-me"><div class="su-b">${esc(text)}</div></div>`);
  const widget = (html, cls = "") => add(`<div class="su-w ${cls}">${html}</div>`);
  const focusIn = el => { if (fine && el) setTimeout(() => el.focus({preventScroll:true}), 60); };

  /* If someone types something that sounds like they may be in danger, stop and point to real help first. */
  const DANGER = /(suicid|kill myself|end my life|end it all|want to die|wanna die|self[- ]?harm|hurt myself|no reason to live|better off dead|hopeless)/i;
  async function distress(text){
    if (!DANGER.test(text)) return false;
    const p = D.support;
    await say(esc(p.text));
    const w = widget(`<div class="su-support"><b>${esc(p.name)}</b>
      <div class="su-row">${p.phones.map(n => `<a href="tel:${n.replace(/\D/g, "")}">📞 ${esc(n)}</a>`).join("")}</div>
      <p class="su-note-s">You can also <a href="contact.html?topic=consult">message ${esc(GH.contact.founder)}</a>. This chat will wait for you.</p>
      <div><button class="btn btn-ghost" type="button">I'm okay to continue</button></div></div>`);
    const b = $("button", w);
    await new Promise(r => b.addEventListener("click", r, {once:true}));
    b.remove();
    return true;
  }

  function askText({placeholder = "Type here…", label = "Your answer"} = {}){
    return new Promise(res => {
      const w = widget(`<form class="su-form"><input type="text" maxlength="120" autocomplete="off" aria-label="${esc(label)}" placeholder="${esc(placeholder)}"><button class="btn btn-primary" type="submit">Send <span class="arr" aria-hidden="true">→</span></button></form>`);
      const inp = $("input", w);
      focusIn(inp);
      $("form", w).addEventListener("submit", async e => {
        e.preventDefault();
        const v = inp.value.trim();
        if (!v){ inp.focus(); return; }
        w.remove(); me(v);
        await distress(v);
        res(v);
      });
    });
  }

  /* Buttons to pick from. Single choice resolves on click; multi shows a Continue button.
     opts: [{id, label, icon, desc}]. other: placeholder for an optional free-text box. */
  function choose(opts, {multi = false, layout = "", other = null, cta = "Continue"} = {}){
    return new Promise(res => {
      const w = widget(`<div class="su-opts ${layout}" role="group">${opts.map(o => `<button type="button" class="su-opt" data-id="${esc(o.id)}" aria-pressed="false">${o.icon ? `<span class="e" aria-hidden="true">${o.icon}</span>` : ""}<span><b>${esc(o.label)}</b>${o.desc ? `<small>${esc(o.desc)}</small>` : ""}</span></button>`).join("")}</div>
        ${other ? `<div class="su-form su-hide-done"><input type="text" maxlength="200" placeholder="${esc(other)}" aria-label="${esc(other)}"></div>` : ""}
        ${multi ? `<div class="su-row su-hide-done"><button type="button" class="btn btn-primary su-go" disabled>${cta} <span class="arr" aria-hidden="true">→</span></button><span class="su-note-s">Pick as many as you like</span></div>` : ""}`);
      const btns = [...w.querySelectorAll(".su-opt")], go = $(".su-go", w), inp = other ? $("input", w) : null;
      const picked = () => btns.filter(b => b.getAttribute("aria-pressed") === "true").map(b => b.dataset.id);
      const refresh = () => { if (go) go.disabled = !picked().length && !(inp && inp.value.trim()); };
      const finish = async () => {
        const ids = picked(), text = inp ? inp.value.trim() : "";
        w.classList.add("done");
        const labels = ids.map(id => opts.find(o => o.id === id).label);
        if (text) labels.push(text);
        me(labels.join(" · "));
        if (text) await distress(text);
        res(multi ? {ids, text} : ids[0]);
      };
      btns.forEach(b => b.addEventListener("click", () => {
        if (!multi){ b.setAttribute("aria-pressed", "true"); finish(); return; }
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        refresh();
      }));
      if (inp){
        inp.addEventListener("input", refresh);
        inp.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); if (go && !go.disabled) finish(); } });
      }
      if (go) go.addEventListener("click", finish);
    });
  }
  function next(label = "Continue"){
    return new Promise(r => {
      const w = widget(`<div><button class="btn btn-primary" type="button">${esc(label)} <span class="arr" aria-hidden="true">→</span></button></div>`);
      const b = $("button", w); focusIn(b);
      b.addEventListener("click", () => { w.remove(); r(); }, {once:true});
    });
  }
  function breathe(){
    return new Promise(r => {
      const w = widget(`<div class="su-breath" aria-hidden="true"><div><span class="bt">Breathe in</span><small>slowly</small></div></div><div><button class="btn btn-ghost" type="button">I'm ready <span class="arr" aria-hidden="true">→</span></button></div>`);
      let t = 0; const lab = $(".bt", w);
      const iv = setInterval(() => { t = (t + 1) % 10; lab.textContent = t < 4 ? "Breathe in" : "Breathe out"; }, 1000);
      const b = $("button", w); focusIn(b);
      b.addEventListener("click", () => { clearInterval(iv); w.remove(); me("Ready"); r(); }, {once:true});
    });
  }

  /* ---------- Scene: the stairs ---------- */
  const ST = {n:10, x0:40, y0:650, w:66, h:56, labels:["Hello","Check-in","Breathe","What's heavy","Your path","Discover","Goal fixed","Task 1","Task 2","Task 3"]};
  const stepXY = i => [ST.x0 + i * ST.w + ST.w / 2, ST.y0 - i * ST.h];
  let level = 0, crowdState = "moving";
  function person({body = "#7A6A58", skin = "#C68B5E", hair = "#2A1B10", walk = false, bun = false, front = false} = {}){
    const legs = walk
      ? `<path d="M-6 -46 L-16 -2" stroke="${body}" stroke-width="11" stroke-linecap="round"/><path d="M6 -46 L18 -20 L14 -2" stroke="${body}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
      : `<path d="M-7 -46 L-8 -2 M7 -46 L8 -2" stroke="${body}" stroke-width="11" stroke-linecap="round"/>`;
    const arms = front
      ? `<path d="M-17 -88 Q-24 -66 -20 -52 M17 -88 Q24 -66 20 -52" stroke="${skin}" stroke-width="7" stroke-linecap="round" fill="none"/>`
      : `<path d="M-14 -86 L-24 -62 M14 -86 L28 -72" stroke="${skin}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    const face = front ? `<circle cx="-5" cy="-114" r="1.8" fill="#2A1B10"/><circle cx="5" cy="-114" r="1.8" fill="#2A1B10"/><path d="M-5 -106 Q0 -102 5 -106" stroke="#2A1B10" stroke-width="1.6" fill="none" stroke-linecap="round"/>` : "";
    const hairS = bun
      ? `<circle cx="${front ? 0 : -12}" cy="-134" r="9" fill="${hair}"/><path d="M-15 -116 Q-16 -134 0 -134 Q16 -134 15 -116 Q8 -126 -2 -124 Q-10 -122 -15 -116Z" fill="${hair}"/>`
      : `<path d="M-15 -114 Q-16 -134 0 -134 Q16 -134 15 -116 Q4 -126 -15 -114Z" fill="${hair}"/>`;
    return `${legs}<rect x="-17" y="-96" width="34" height="54" rx="15" fill="${body}"/>${arms}<circle cx="0" cy="-114" r="15" fill="${skin}"/>${face}${hairS}`;
  }
  function stairsSVG(){
    let s = "";
    for (let i = 0; i < ST.n; i++){
      const x = ST.x0 + i * ST.w, y = ST.y0 - i * ST.h;
      s += `<rect class="st-step" data-i="${i}" x="${x}" y="${y}" width="${ST.w + 1}" height="${740 - y}"/><rect class="st-edge" data-i="${i}" x="${x}" y="${y}" width="${ST.w + 1}" height="8" rx="2"/><text class="st-lab" data-i="${i}" x="${x + ST.w / 2}" y="${y + 30}" text-anchor="middle">${ST.labels[i]}</text>`;
    }
    const looks = [["#6E7F8F","#B57E55",false],["#8E7A9B","#D4A27A",true],["#5F8370","#A97349",false]];
    const walkers = [[1,4],[3,6],[5,8]].map(([a, b], k) => {
      const [x0, y0] = stepXY(a), [x1, y1] = stepXY(b);
      return `<g class="su-walker" style="--x0:${x0}px;--y0:${y0}px;--x1:${x1}px;--y1:${y1}px;transform:translate(${x0}px,${y0}px)">${person({body:looks[k][0], skin:looks[k][1], hair:"#1E140C", walk:true, bun:looks[k][2]})}</g>`;
    }).join("");
    const g = goalInfo();
    return `<svg viewBox="0 0 760 700" preserveAspectRatio="xMidYMax meet">${s}<g class="su-crowd" id="suCrowd">${walkers}</g>
      <g id="suMe"><ellipse cx="0" cy="2" rx="40" ry="8" fill="#F5B201" opacity=".35"/>
        <g id="suFlag" style="display:none"><path d="M22 -60 L22 -150" stroke="#3A2A1C" stroke-width="3"/><path d="M22 -150 L104 -137 L22 -124Z" fill="#F5B201" stroke="#8A5A00" stroke-width="1.5"/><text x="28" y="-133" font-size="11" font-weight="700" fill="#3A2A1C" font-family="Albert Sans,sans-serif">${esc(g ? g.short : "")}</text></g>
        ${person({body:"#E58C7A", front:true, bun:true})}
        <text class="st-name" x="0" y="-150" text-anchor="middle">${NAME()}</text></g></svg>`;
  }
  function paint(l){
    stage.querySelectorAll("[data-i]").forEach(el => el.classList.toggle("on", +el.dataset.i <= l));
    const [x, y] = stepXY(l);
    $("#suMe", stage).style.transform = `translate(${x}px,${y}px)`;
  }
  function stairs(){
    if ($("#suMe", stage)) return;
    setStage(stairsSVG());
    paint(level); crowd(crowdState);
    if (S.goal) showFlag();
  }
  async function climb(to){
    stairs();
    to = Math.min(to, ST.n - 1);
    if (to < level){ level = to; paint(level); return; }
    while (level < to){ level++; paint(level); await wait(380); }
  }
  function crowd(state){
    crowdState = state;
    const c = $("#suCrowd", stage); if (!c) return;
    c.classList.toggle("paused", state === "paused");
    c.classList.toggle("gone", state === "gone");
  }
  function showFlag(){
    const f = $("#suFlag", stage); if (!f) return;
    const g = goalInfo();
    f.style.display = ""; $("text", f).textContent = g ? g.short : "";
    const n = $(".st-name", stage); n.setAttribute("x", "-24"); n.setAttribute("y", "-104"); n.setAttribute("text-anchor", "end");
  }
  function setStage(html, {tall = false, live = false} = {}){
    stage.innerHTML = html + `<div class="su-cap"></div>`;
    stage.classList.toggle("tall", tall);
    stage.setAttribute("aria-hidden", live ? "false" : "true");
    /* On phones the scene sits above the chat; bring games and cards into view. */
    if (tall && matchMedia("(max-width:860px)").matches) requestAnimationFrame(() => stage.scrollIntoView({block:"start", behavior: reduceMotion ? "auto" : "smooth"}));
  }
  const cap = (title, text = "") => { const c = $(".su-cap", stage); if (c) c.innerHTML = title ? `<b>${title}</b>${text}` : ""; };
  function pill(t){
    let p = $(".su-pill", stage);
    if (!t){ if (p) p.remove(); return; }
    if (!p){ p = document.createElement("div"); p.className = "su-pill"; stage.append(p); }
    p.textContent = t;
  }
  function toast(t){
    const el = document.createElement("div");
    el.className = "su-toast"; el.textContent = t;
    stage.append(el); setTimeout(() => el.remove(), 2600);
  }

  /* ---------- Scene: the tree of branches ---------- */
  function treeSVG(active, leaves){
    const B = {
      A:{pts:[[380,470],[300,410],[225,330],[165,240]], lab:["Tell us the role","See the real job","Does it fit you?"], title:"I know my target"},
      B:{pts:[[380,470],[380,385],[380,300],[380,215]], lab:["List your options","2 quick games","Side by side"], title:"A few in mind"},
      C:{pts:[[380,470],[460,410],[535,335],[595,255],[630,175]], lab:["What you enjoy","How you think","Work style","What fits you"], title:"No idea yet"}};
    let s = `<path d="M380 690 C372 620 388 540 380 470" stroke="#8A5A00" stroke-width="26" stroke-linecap="round" fill="none"/>
      <path d="M380 680 C340 690 300 700 250 700 M380 680 C420 692 470 700 520 700" stroke="#8A5A00" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>`;
    for (const k of ["A","C","B"]){
      const b = B[k], on = k === active ? " on" : "";
      s += `<path class="tr-br${on}" d="${b.pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ")}"/>`;
      b.pts.slice(1).forEach((p, i) => {
        s += `<circle class="tr-node${on}" cx="${p[0]}" cy="${p[1]}" r="${on ? 11 : 8}"/>`;
        s += `<text class="tr-lab${on}" x="${k === "A" ? p[0] - 20 : p[0] + 20}" y="${p[1] + 5}" text-anchor="${k === "A" ? "end" : "start"}">${b.lab[i]}</text>`;
      });
      const e = b.pts[b.pts.length - 1];
      const tx = k === "B" ? e[0] - 22 : k === "A" ? e[0] - 6 : e[0], ty = k === "B" ? e[1] + 7 : k === "A" ? e[1] - 36 : e[1] - 26;
      s += `<text class="tr-title${on}" x="${tx}" y="${ty}" text-anchor="${k === "C" ? "middle" : "end"}">${b.title}</text>`;
    }
    if (leaves && leaves.length){
      const n = Math.min(leaves.length, 3), [x, y] = [380, 215];
      leaves.slice(0, 3).forEach((l, i) => {
        const lx = n === 1 ? x : x - 150 + i * (300 / (n - 1)), ly = y - 95;
        s += `<path d="M${x} ${y} Q${(x + lx) / 2} ${y - 20} ${lx} ${ly + 18}" stroke="#D99A00" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse class="tr-leaf" cx="${lx}" cy="${ly}" rx="66" ry="22"/><text class="tr-leaf-t" x="${lx}" y="${ly + 5}" text-anchor="middle">${esc(l.length > 16 ? l.slice(0, 15) + "…" : l)}</text>`;
      });
    }
    const top = leaves && leaves.length ? 18 : 40;
    s += `<rect x="215" y="${top}" width="330" height="40" rx="20" fill="#3A2A1C"/><text x="380" y="${top + 25}" text-anchor="middle" font-family="Albert Sans,sans-serif" font-size="14" font-weight="700" fill="#FFE7A3">Every branch → your goal + weekly plan</text>`;
    s += `<text class="st-name" x="410" y="610">${NAME()}</text>`;
    return `<svg viewBox="0 0 760 700" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
  }
  function showTree(active, leaves, title, text){
    setStage(treeSVG(active, leaves));
    cap(title, text);
  }

  /* ---------- Scene: the clue board ---------- */
  const SLOTS = [[5,20,-3,"y"],[52,17,2,""],[14,56,-1.5,"p"],[55,58,3,"b"],[32,38,1,"g"]];
  function showBoard(nextClue){
    const items = (S.clues || []).slice(0, 5).map((c, i) => ({...c, slot:SLOTS[i]}));
    if (!items.length) items.push({hint:true, slot:SLOTS[0]});
    if (nextClue && items.length < 5) items.push({next:true, slot:SLOTS[items.length]});
    const pts = items.map(x => `${x.slot[0] + 16} ${x.slot[1] + 2}`);
    const note = x => {
      const [l, t, r, c] = x.slot;
      const body = x.hint ? `<b>📌 Your clues go here</b><small>Tell me what you enjoy</small>`
        : x.next ? `<b>❓ Next clue…</b><small>Let's see how you think</small>`
        : `<b>${D.tags[x.tag].icon} ${esc(D.tags[x.tag].label)}</b><small>From: ${esc(x.from)}</small>`;
      return `<div class="su-clue ${x.next ? "b" : c}" style="left:${l}%;top:${t}%;--r:${r}deg;transform:rotate(${r}deg)">${body}</div>`;
    };
    setStage(`<div class="su-board"><h3>${NAME()}'s clue board</h3>
      ${pts.length > 1 ? `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M${pts.join(" L")}" stroke="#C0392B" stroke-width="2.5" vector-effect="non-scaling-stroke" fill="none" opacity=".7"/></svg>` : ""}
      ${items.map(note).join("")}</div>`);
  }

  /* ---------- Tags, matching and scoring ---------- */
  function addTag(t, w){ S.tags[t] = (S.tags[t] || 0) + w; }
  function addClue(tag, from){ S.clues = S.clues || []; if (!S.clues.some(c => c.tag === tag)) S.clues.push({tag, from}); }
  function textTags(text){
    const t = " " + text.toLowerCase() + " ", out = [];
    for (const [tag, words] of Object.entries(D.keywords)){
      const w = words.find(k => t.includes(k));
      if (w) out.push({tag, word:w});
    }
    return out;
  }
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function findRoles(text){
    const t = text.toLowerCase();
    return D.roles.filter(r => r.aliases.some(a => new RegExp(`(^|[^a-z])${reEsc(a.trim())}(s|es)?([^a-z]|$)`).test(t)));
  }
  const topTags = n => Object.entries(S.tags).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
  const TRAITS = {
    planning:{label:"Planning ahead", name:"Careful planner 🧭", why:"you thought a few moves ahead"},
    logic:{label:"Logic", name:"Logical thinker 🧩", why:"you followed the rules step by step"},
    detail:{label:"Eye for detail", name:"Sharp-eyed noticer 🔎", why:"you remembered where things were"},
    persistence:{label:"Keeps going", name:"Determined problem-solver 💪", why:"you didn't give up when it got tricky"}
  };
  function topTrait(){
    const e = Object.entries(S.traits || {});
    return e.length ? e.sort((a, b) => b[1] - a[1])[0][0] : null;
  }
  const needEarn = () => S.worries.includes("earn") || S.earn > 0;
  function score(r){
    let s = 0;
    r.tags.forEach(t => s += S.tags[t] || 0);
    const tt = topTrait(); if (tt && r.traits.includes(tt)) s += 1.5;
    if (needEarn()) s += r.earnSoon ? 2 : -1.5;
    if (S.earn < 0 && !r.earnSoon) s += 1;
    if (S.worries.includes("family") && r.govt) s += 1;
    return s;
  }
  function reasons(r){
    const m = r.tags.filter(t => S.tags[t] > 0).sort((a, b) => S.tags[b] - S.tags[a]).slice(0, 3).map(t => D.tags[t].label.toLowerCase());
    const earn = r.earnSoon ? "earn from year 1" : r.govt ? "years of preparation, usually no income meanwhile" : "earning comes later";
    return (m.length ? "Matches: " + m.join(", ") + " · " : "") + earn;
  }
  function goalInfo(){
    if (!S.goal) return null;
    if (S.goal === "custom") return {id:"custom", title:S.custom, short:S.custom.slice(0, 12), icon:"🌟", tasks:D.customRole.tasks, career:D.customRole.career, study:[], earnSoon:true};
    return roleById(S.goal);
  }

  /* ---------- Games ---------- */
  const nb = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(j => j >= 0 && j < 9);
  const solvedB = b => b.join("") === "123456780";
  function solve(start){
    const goal = "123456780", s0 = start.join("");
    if (s0 === goal) return [];
    const prev = new Map([[s0, null]]);
    let q = [s0];
    while (q.length){
      const nq = [];
      for (const s of q){
        const z = s.indexOf("0");
        for (const p of nb(z)){
          const a = s.split(""); [a[z], a[p]] = [a[p], a[z]];
          const n = a.join("");
          if (prev.has(n)) continue;
          prev.set(n, [s, p]);
          if (n === goal){ const path = []; let c = n; while (prev.get(c)){ const [ps, pp] = prev.get(c); path.unshift(pp); c = ps; } return path; }
          nq.push(n);
        }
      }
      q = nq;
    }
    return [];
  }
  function slideGame(host, comment){
    return new Promise(res => {
      let b = [1,2,3,4,5,6,7,8,0], prev = -1;
      do { for (let k = 0; k < 30; k++){ const z = b.indexOf(0), o = nb(z).filter(j => j !== prev), p = o[Math.random() * o.length | 0]; [b[z], b[p]] = [b[p], b[z]]; prev = z; } } while (solvedB(b));
      const min = solve(b).length;
      let moves = 0, hints = 0, said = false;
      host.innerHTML = `<p class="su-note-s">Tap a tile next to the gap to slide it. Put 1 to 8 in order.</p>
        <div class="su-tiles" role="group" aria-label="Sliding puzzle"></div>
        <div class="su-stats"><span>Moves <b class="mv">0</b></span><button type="button" class="hint">💡 Hint</button><button type="button" class="skip">Skip game →</button></div>`;
      const grid = $(".su-tiles", host);
      function draw(h = -1, focus = -1){
        grid.innerHTML = b.map((t, i) => t ? `<button type="button" class="su-tile${t === i + 1 ? " ok" : ""}${i === h ? " hint" : ""}" data-i="${i}" aria-label="Tile ${t}">${t}</button>` : `<span class="su-tile gap" aria-hidden="true"></span>`).join("");
        $(".mv", host).textContent = moves;
        if (focus >= 0){ const f = grid.querySelector(`[data-i="${focus}"]`); if (f) f.focus(); }
      }
      draw();
      grid.addEventListener("click", e => {
        const t = e.target.closest("[data-i]"); if (!t) return;
        const i = +t.dataset.i, z = b.indexOf(0);
        if (!nb(z).includes(i)) return;
        [b[z], b[i]] = [b[i], b[z]]; moves++;
        draw(-1, document.activeElement === t ? z : -1);
        if (!said && b[0] === 1 && b[1] === 2 && b[2] === 3 && !solvedB(b)){ said = true; comment("Nice, you sorted the top row first. That's how careful planners work 👀"); }
        if (solvedB(b)) setTimeout(() => res({done:true, moves, min, hints}), 450);
      });
      $(".hint", host).addEventListener("click", () => { const p = solve(b); if (p.length){ hints++; draw(p[0]); } });
      $(".skip", host).addEventListener("click", () => res({done:false}));
    });
  }
  function sudokuGame(host, comment){
    return new Promise(res => {
      const perm = shuffle([1,2,3,4]);
      let g = [1,2,3,4, 3,4,1,2, 2,1,4,3, 4,3,2,1].map(v => perm[v - 1]);
      const swapRows = (a, r1, r2) => { const c = a.slice(); for (let k = 0; k < 4; k++){ c[r1 * 4 + k] = a[r2 * 4 + k]; c[r2 * 4 + k] = a[r1 * 4 + k]; } return c; };
      if (Math.random() < .5) g = swapRows(g, 0, 1);
      if (Math.random() < .5) g = swapRows(g, 2, 3);
      if (Math.random() < .5) g = g.map((_, i) => g[(i % 4) * 4 + (i / 4 | 0)]);
      const given = new Set(shuffle([...Array(16).keys()]).slice(0, 7));
      const cur = g.map((v, i) => given.has(i) ? v : 0);
      let sel = -1, errors = 0, warned = false;
      const conflict = i => {
        const v = cur[i]; if (!v) return false;
        const r = i / 4 | 0, c = i % 4, br = (r >> 1) * 2, bc = (c >> 1) * 2;
        for (let j = 0; j < 16; j++){
          if (j === i || cur[j] !== v) continue;
          const rj = j / 4 | 0, cj = j % 4;
          if (rj === r || cj === c || ((rj >> 1) * 2 === br && (cj >> 1) * 2 === bc)) return true;
        }
        return false;
      };
      host.innerHTML = `<p class="su-note-s">Fill the grid so every row, column and 2×2 box has 1, 2, 3 and 4 once.</p>
        <div class="su-sud" role="grid" aria-label="Mini Sudoku"></div>
        <div class="su-pad">${[1,2,3,4].map(n => `<button type="button" data-n="${n}" aria-label="Enter ${n}">${n}</button>`).join("")}<button type="button" data-n="0" aria-label="Clear cell">✕</button></div>
        <div class="su-stats"><span>Mistakes fixed <b class="er">0</b></span><button type="button" class="skip">Skip game →</button></div>`;
      const grid = $(".su-sud", host);
      function draw(){
        grid.innerHTML = cur.map((v, i) => `<button type="button" role="gridcell" class="su-cell${given.has(i) ? " given" : ""}${i === sel ? " sel" : ""}${conflict(i) && !given.has(i) ? " bad" : ""}" data-c="${i}" aria-label="Row ${(i / 4 | 0) + 1}, column ${i % 4 + 1}, ${v || "empty"}"${given.has(i) ? ' aria-disabled="true"' : ""}>${v || ""}</button>`).join("");
        $(".er", host).textContent = errors;
      }
      function place(n){
        if (sel < 0 || given.has(sel)) return;
        cur[sel] = n;
        if (n && conflict(sel)){ errors++; if (!warned){ warned = true; comment("Oops, that number clashes with another one. Spotting it is half the job 🙂"); } }
        draw();
        const f = grid.querySelector(`[data-c="${sel}"]`); if (f && document.activeElement && document.activeElement.closest(".su-sud")) f.focus();
        if (cur.every(v => v) && cur.every((_, i) => !conflict(i))) setTimeout(() => res({done:true, errors}), 450);
      }
      draw();
      grid.addEventListener("click", e => { const c = e.target.closest("[data-c]"); if (!c || given.has(+c.dataset.c)) return; sel = +c.dataset.c; draw(); grid.querySelector(`[data-c="${sel}"]`).focus(); });
      grid.addEventListener("keydown", e => { if (/^[1-4]$/.test(e.key)) place(+e.key); else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") place(0); });
      $(".su-pad", host).addEventListener("click", e => { const b = e.target.closest("[data-n]"); if (b) place(+b.dataset.n); });
      $(".skip", host).addEventListener("click", () => res({done:false}));
    });
  }
  function pairsGame(host){
    return new Promise(res => {
      const deck = shuffle(["🛡️","💻","📊","🎨","🚓","🎓"].flatMap(e => [e, e]));
      let open = [], got = 0, misses = 0, lock = false;
      host.innerHTML = `<p class="su-note-s">Flip two cards at a time. Find all 6 pairs.</p>
        <div class="su-pairs" role="group" aria-label="Card pairs">${deck.map((e, i) => `<button type="button" class="su-pc" data-p="${i}" aria-label="Card ${i + 1}, face down">${e}</button>`).join("")}</div>
        <div class="su-stats"><span>Misses <b class="ms">0</b></span><button type="button" class="skip">Skip game →</button></div>`;
      const cards = [...host.querySelectorAll(".su-pc")];
      const face = (i, up) => { cards[i].classList.toggle("open", up); cards[i].setAttribute("aria-label", `Card ${i + 1}, ${up ? deck[i] : "face down"}`); };
      $(".su-pairs", host).addEventListener("click", e => {
        const c = e.target.closest("[data-p]"); if (!c || lock) return;
        const i = +c.dataset.p;
        if (open.includes(i) || c.classList.contains("got")) return;
        face(i, true); open.push(i);
        if (open.length < 2) return;
        const [a, b] = open;
        if (deck[a] === deck[b]){
          cards[a].classList.add("got"); cards[b].classList.add("got"); open = []; got++;
          if (got === 6) setTimeout(() => res({done:true, misses}), 500);
        } else {
          misses++; $(".ms", host).textContent = misses; lock = true;
          setTimeout(() => { face(a, false); face(b, false); open = []; lock = false; }, 800);
        }
      });
      $(".skip", host).addEventListener("click", () => res({done:false}));
    });
  }
  const GAMES = {
    slide:{label:"🔢 Sliding puzzle", run:slideGame,
      after:r => r.done ? `Solved in ${r.moves} moves${r.hints ? ` with ${r.hints} hint${r.hints > 1 ? "s" : ""}` : ""}. ${r.moves <= r.min + 12 ? "Very efficient. You think a few steps ahead." : "You kept going till it clicked. That's persistence."}` : "No problem at all. Skipping is fine."},
    sudoku:{label:"🧩 Mini Sudoku", run:sudokuGame,
      after:r => r.done ? (r.errors ? "You spotted and fixed your mistakes. That's exactly how logic works at work too." : "Zero mistakes. Clean, logical thinking ✨") : "No problem at all. Skipping is fine."},
    pairs:{label:"🃏 Card pairs", run:pairsGame,
      after:r => r.done ? (r.misses <= 6 ? "Sharp memory for detail! 🔎" : "You found every pair. Nice focus.") : "No problem at all. Skipping is fine."}
  };
  function games(need){
    return new Promise(res => {
      setStage(`<div class="su-play"><div class="su-tabs" role="group" aria-label="Choose a game">${Object.entries(GAMES).map(([k, g]) => `<button type="button" class="su-tab" data-g="${k}" aria-pressed="false">${g.label}</button>`).join("")}</div><div class="su-gamehost" style="display:grid;justify-items:center;gap:14px;width:100%"></div></div>`, {tall:true, live:true});
      const host = $(".su-gamehost", stage), results = {};
      let token = 0, finished = false;
      const skipAll = widget(`<button type="button" class="btn btn-ghost">Skip the games <span class="arr" aria-hidden="true">→</span></button>`);
      const end = () => { if (finished) return; finished = true; skipAll.remove(); res(results); };
      $("button", skipAll).addEventListener("click", () => { me("Skip the games"); end(); });
      async function open(k){
        const my = ++token;
        stage.querySelectorAll(".su-tab").forEach(t => t.setAttribute("aria-pressed", t.dataset.g === k));
        const r = await GAMES[k].run(host, t => { if (my === token) say(t); });
        if (my !== token || finished) return;
        results[k] = r;
        const tab = stage.querySelector(`[data-g="${k}"]`); tab.classList.add("done"); tab.setAttribute("aria-pressed", "false");
        host.innerHTML = "";
        await say(GAMES[k].after(r));
        const played = Object.values(results).length;
        if (played >= need || played === 3) end();
        else { host.innerHTML = `<p class="su-note-s">Pick another game above.</p>`; await say("Pick another one when you're ready 🙂"); }
      }
      stage.querySelector(".su-tabs").addEventListener("click", e => {
        const t = e.target.closest("[data-g]"); if (!t || results[t.dataset.g]) return;
        open(t.dataset.g);
      });
      host.innerHTML = `<p class="su-note-s">Tap a game to start.</p>`;
    });
  }
  function scoreGames(results){
    const t = {};
    const r = Object.values(results), doneN = r.filter(x => x.done).length;
    if (results.slide && results.slide.done) t.planning = clamp(95 - Math.max(0, results.slide.moves - results.slide.min) * 1.5 - results.slide.hints * 8, 35, 95);
    if (results.sudoku && results.sudoku.done) t.logic = clamp(95 - results.sudoku.errors * 12, 35, 95);
    if (results.pairs && results.pairs.done) t.detail = clamp(100 - Math.max(0, results.pairs.misses - 4) * 7, 35, 95);
    if (doneN) t.persistence = clamp(55 + doneN * 18 - (r.length - doneN) * 10 + (results.slide && results.slide.done && !results.slide.hints ? 5 : 0), 30, 95);
    return t;
  }

  /* Work style: one "would you rather" card at a time, in the stage. */
  function wyrCard(k){
    return new Promise(res => {
      const q = D.wyr[k];
      const opt = (s, o) => `<button type="button" class="su-wopt" data-s="${s}"><span class="ill" aria-hidden="true">${o.icon}</span><b>${esc(o.t)}</b><span>${esc(o.d)}</span></button>`;
      setStage(`<div class="su-play"><div class="su-wyr">${opt("a", q.a)}<span class="su-or" aria-hidden="true">or</span>${opt("b", q.b)}</div>
        <button type="button" class="su-opt" data-s="both">Both, honestly</button>
        <div class="su-dots" aria-hidden="true">${D.wyr.map((_, i) => `<i class="${i <= k ? "on" : ""}"></i>`).join("")}</div>
        <p class="su-note-s">${k + 1} of ${D.wyr.length} · no right answers</p></div>`, {tall:true, live:true});
      const first = $(".su-wopt", stage); focusIn(first);
      stage.querySelector(".su-play").addEventListener("click", e => {
        const b = e.target.closest("[data-s]"); if (!b) return;
        res(b.dataset.s);
      }, {once:false});
    });
  }

  /* ---------- Role cards ---------- */
  function roleCard(id, withPick){
    if (id === "custom") return `<div class="su-role"><div class="tag">Your pick</div><h3>🌟 ${esc(S.custom)}</h3>
      <p>I don't have the details for this one yet. Pick it, and we'll research it together on a call: the day-to-day work, the pay and the fastest way in.</p>
      ${withPick ? `<div class="su-row"><button type="button" class="btn btn-primary su-yes">This feels right ✓</button></div>` : ""}</div>`;
    const r = roleById(id);
    return `<div class="su-role"><div class="tag">From ${esc(r.from)}</div><h3>${r.icon} ${esc(r.title)}</h3>
      <h4>What you'd do</h4><ul>${r.does.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
      <h4>Skills you'd build</h4><div class="su-skills">${r.skills.map(s => `<span>${esc(s)}</span>`).join("")}</div>
      <div class="su-kv">${r.facts.map(([k, v]) => `<div><small>${esc(k)}</small>${esc(v)}</div>`).join("")}</div>
      <p class="su-note-s">${esc(D.payNote)}</p>
      ${withPick ? `<div class="su-row"><button type="button" class="btn btn-primary su-yes">This feels right ✓</button><span class="su-note-s">or tap another option above</span></div>` : ""}</div>`;
  }
  function styleCard(){
    const t = S.traits, keys = Object.keys(t).sort((a, b) => t[b] - t[a]);
    if (!keys.length) return "";
    const focus = S.focus > .5 ? "You lean toward quiet, focused work." : S.focus < -.5 ? "You lean toward being out with people." : "You like a mix of focus time and people time.";
    return `<div class="su-style"><small>Your thinking style</small><h3>${TRAITS[keys[0]].name}</h3>
      <p>In the games, ${keys.slice(0, 2).map(k => TRAITS[k].why).join(" and ")}. ${focus}</p>
      ${keys.map(k => `<div class="su-trait"><span>${TRAITS[k].label}</span><i><b data-w="${t[k]}"></b></i></div>`).join("")}
      <p style="font-size:.8rem">Not a test score. It's a starting point we'll refine together.</p></div>`;
  }
  function candidates(){
    const ranked = D.roles.map(r => ({id:r.id, s:score(r)})).sort((a, b) => b.s - a.s);
    const max = Math.max(1, ranked[0].s);
    const mine = ranked.filter(x => S.options.includes(x.id)), others = ranked.filter(x => !S.options.includes(x.id));
    let list;
    if (S.branch === "C") list = ranked.slice(0, 3);
    else if (S.branch === "A") list = [...mine, ...others.slice(0, 2).map(x => ({...x, also:true}))];
    else list = [...mine, ...others.slice(0, Math.max(1, 3 - mine.length)).map(x => ({...x, also:true}))];
    if (S.custom){ const c = {id:"custom", custom:true}; S.branch === "A" ? list.unshift(c) : list.push(c); }
    return list.map(x => ({...x, label: x.custom ? "Your pick" : x.s >= max * .75 ? "Strong fit" : x.s >= max * .45 ? "Good fit" : "Worth a look"}));
  }
  function pickRole(list){
    return new Promise(res => {
      const w = widget(list.map(x => {
        const r = x.custom ? null : roleById(x.id);
        const title = x.custom ? S.custom : r.title, icon = x.custom ? "🌟" : r.icon;
        const desc = x.custom ? "We'll research this one together" : (x.also ? "Also fits you · " : "") + reasons(r);
        return `<button type="button" class="su-fit" data-id="${x.id}" aria-pressed="false"><span class="e" aria-hidden="true">${icon}</span><span><b>${esc(title)}</b><small>${esc(desc)}</small></span><span class="m${x.label === "Strong fit" ? "" : " mid"}">${x.label}<small>See it →</small></span></button>`;
      }).join(""), "full");
      let detail = null;
      w.addEventListener("click", e => {
        const b = e.target.closest(".su-fit"); if (!b) return;
        w.querySelectorAll(".su-fit").forEach(x => x.setAttribute("aria-pressed", x === b));
        if (detail) detail.remove();
        const id = b.dataset.id;
        detail = widget(roleCard(id, true), "full");
        $(".su-yes", detail).addEventListener("click", () => {
          w.classList.add("done"); $(".su-yes", detail).parentElement.remove();
          me(`This one: ${id === "custom" ? S.custom : roleById(id).title}`);
          res(id);
        });
      });
    });
  }

  /* ---------- Goal, weekly tasks, life plan ---------- */
  function goalLine(){
    const g = goalInfo(), first = (g.career[1] || g.career[0])[1];
    const others = (S.optionLabels || []).filter(l => { const f = findRoles(l); return !f.some(r => r.id === g.id) && l !== S.custom; });
    let s = `First stop: ${first.replace(" 🎯", "")}`;
    s += g.earnSoon ? " · earn while you grow" : " · plan your preparation budget with family";
    if (others.length) s += ` · ${others.slice(0, 2).join(" and ")} stay a "maybe" we revisit in ${later(3)}`;
    return s;
  }
  const doneCount = () => Object.values(S.done || {}).filter(Boolean).length;
  function tasksWidget(){
    const g = goalInfo();
    const task = (t, i) => `<label class="su-task"><input type="checkbox" data-t="${i}"${S.done[i] ? " checked" : ""}><span>${esc(t)}</span></label>`;
    const w = widget(`<div class="su-goal"><small>${NAME()}'s goal</small><h3>${g.icon} ${esc(g.title)}</h3><p>${esc(goalLine())}</p></div>
      <div class="su-tasks"><h4>This week · 3 small things</h4>${g.tasks.slice(0, 3).map(task).join("")}
      <h4>Next weeks</h4>${g.tasks.slice(3).map((t, i) => task(t, i + 3)).join("")}</div>
      <p class="su-hand">Every tick = one step up. Small is fine. Steady wins. – ${esc(GH.contact.founder)}</p>`, "full");
    w.addEventListener("change", async e => {
      const i = e.target.dataset.t; if (i == null) return;
      S.done[i] = e.target.checked; save();
      stairs();
      await climb(6 + Math.min(doneCount(), 3));
      if (e.target.checked){
        toast("✓ Task done. You climbed a step!");
        if (doneCount() === 3) say(`Three tasks done, ${NAME()}! 🌻 That's real progress. Keep going at your own pace.`);
      }
    });
  }
  function planner(){
    const g = goalInfo(), wait_ = !g.earnSoon, others = (S.optionLabels || []).filter(l => !findRoles(l).some(r => r.id === g.id) && l !== S.custom);
    const lanes = [
      {icon:"💼", name:"Career", c:"c1", ev:g.career},
      {icon:"🎓", name:"Study", c:"c2", ev:g.study || []},
      {icon:"👪", name:"Family support", c:"c3", ev: wait_ ? [[0,"Agree a prep budget together"],[3,"Parents' health cover"]] : needEarn() ? [[1,"Send money home monthly"],[3,"Parents' health cover"]] : [[2,"Parents' health cover"]]},
      {icon:"💰", name:"Money", c:"c4", ev: wait_ ? [[0,"Savings plan for prep years"],[3,"Emergency fund: 3 months"],[5,"Start a SIP"]] : [[1,"Emergency fund: 3 months"],[2,"Start a SIP"],[4,"Save for a home"]]},
      {icon:"💍", name:"Life choices", c:"dot", ev: S.worries.includes("marriage") ? [[2,"Marriage: your timing"],[4,"Kids: if and when you choose"]] : [[3,"Big life choices: your timing"]]},
      {icon:"🌱", name:"Side path", c:"c6", ev:[...others.slice(0, 1).map(o => [0, `${o}: decide by ${later(3)}`, "dot"]), [5,"Mentor others or start your own venture?"]]}
    ];
    const cell = (lane, y) => {
      const ev = lane.ev.filter(e => e[0] === y);
      if (!ev.length) return `<div class="sp"></div>`;
      return `<div class="su-ev ${ev[0][2] || lane.c}">${ev.map(e => esc(e[1])).join(" · ")}</div>`;
    };
    widget(`<div class="su-plan" tabindex="0" role="region" aria-label="Your life plan, year by year"><div class="su-grid">
        <div></div>${[0,1,2,3,4,5].map(i => `<div class="y">${YEAR + i}${i === 5 ? "+" : ""}</div>`).join("")}
        ${lanes.map(l => `<div class="ln"><span aria-hidden="true">${l.icon}</span>${l.name}</div>${[0,1,2,3,4,5].map(y => cell(l, y)).join("")}`).join("")}
      </div></div>
      <p class="su-note-s">Dotted ones are your call, whenever you're ready. Taking a break for marriage, a baby or family? Your career steps simply move with it. You don't start over.</p>`, "full");
  }
  function summary(){
    const g = goalInfo(), t = topTrait();
    const lines = [
      `Hi ${GH.contact.founder}, I just did the Step Up session.`,
      `Name: ${S.name}`,
      `My goal: ${g.title}`,
      S.optionLabels && S.optionLabels.length ? `Careers I was considering: ${S.optionLabels.join(", ")}` : "",
      topTags(3).length ? `What I enjoy: ${topTags(3).map(x => D.tags[x].label.toLowerCase()).join(", ")}` : "",
      t ? `Thinking style: ${TRAITS[t].name.replace(/\s\S+$/u, "")}` : "",
      S.worries.length || S.worryText ? `What feels heavy: ${[...S.worries.map(id => D.worries.find(w => w.id === id).label), S.worryText].filter(Boolean).join("; ")}` : "",
      `Tasks done so far: ${doneCount()} of ${g.tasks.length}`,
      "I'd like to talk this through."
    ];
    return lines.filter(Boolean).join("\n");
  }
  async function share(){
    progress(100, "Your plan is ready");
    await say(`That's your plan, ${NAME()}. I'd love to talk it through with you. Send it to me and we'll pick it up from here.`);
    const msg = summary();
    widget(`<div data-copy-scope style="display:grid;gap:10px"><pre data-copy-src hidden>${esc(msg)}</pre>
      <div class="su-row">${sendOptions(msg, "My Step Up plan")}<a class="btn btn-ghost" href="contact.html?topic=consult">Book a free consultation</a></div>
      <p class="su-note-s" data-copy-status aria-live="polite"></p>
      <p class="su-note-s">Your plan is saved in this browser only. Come back any time to tick off tasks.</p></div>`, "full");
  }

  /* ---------- The session ---------- */
  async function session(){
    S = {tags:{}, worries:[], traits:{}, options:[], optionLabels:[], done:{}, focus:0, earn:0, clues:[]};
    level = 0; crowdState = "moving";
    progress(4, "Getting to know you");
    stairs();
    cap("Everyone else seems to be rushing ahead…", "That feeling is normal. Let's slow down and find <i>your</i> next step.");
    await say("Hi there 👋 I'm Varsha.");
    await say("This isn't a test. Just a chat, like we're sitting over chai. What's your good name?");
    let name = (await askText({placeholder:"Your name", label:"Your name"})).replace(/[^\p{L}\p{M} .'-]/gu, "").trim().slice(0, 30);
    S.name = name ? name.charAt(0).toUpperCase() + name.slice(1) : "friend";
    save();
    stairs(); $(".st-name", stage).textContent = S.name;
    await climb(1);

    progress(10, "Checking in");
    await say(`Hey ${NAME()} 😊 How are you doing today, honestly?`);
    const mood = await choose(D.moods.map(m => ({id:m.id, label:m.label})));
    S.mood = mood; save();
    crowd("paused"); pill("⏸ Everyone else is paused. This is your moment.");
    cap("You climbed a step.", "Everyone else can wait. No rush.");
    await say(D.moods.find(m => m.id === mood).reply);
    await say("Before we plan anything, let's take one slow breath together. In for 4… out for 6.");
    await breathe();
    await climb(2);

    progress(18, "What's on your mind");
    cap("Naming it is a step up.", "Every answer shapes your plan.");
    await say("What feels heaviest right now? Pick everything that's true. No judgement.");
    const w = await choose([...D.worries.map(x => ({id:x.id, icon:x.icon, label:x.label})), {id:"none", icon:"🙂", label:"Nothing heavy, just exploring"}], {multi:true, layout:"cards", other:"Something else? Type it here (optional)"});
    S.worries = w.ids.filter(i => i !== "none"); S.worryText = w.text; save();
    const replies = S.worries.map(id => D.worries.find(x => x.id === id).reply);
    if (replies.length){
      await say(`Thank you for being honest, ${NAME()}.`);
      for (const r of replies.slice(0, 3)) await say(esc(r));
      if (replies.length > 3) await say("We'll keep all of these in mind as we go.");
    } else if (w.text) await say(`Thank you for sharing that, ${NAME()}. We'll keep it in mind as we plan.`);
    else await say("Exploring with a calm mind is the best way to do it 🙂");
    await climb(3);
    await wait(500);

    /* Career in mind? Picks one of three branches. */
    progress(26, "Where do we start?");
    showTree(null, null, "Your answer picks the branch.", "Each one asks different things, but all of them end in a clear goal and a plan.");
    await say(`Before we explore, ${NAME()}: do you already have a career in mind?`);
    S.branch = await choose([
      {id:"A", icon:"🎯", label:"Yes, I know my target", desc:"We'll check it fits you and plan it."},
      {id:"B", icon:"🔀", label:"A few in mind, can't choose", desc:"We'll compare them and find your best fit."},
      {id:"C", icon:"🌱", label:"No idea yet", desc:"Let's discover what you enjoy first. Totally normal."}], {layout:"rows"});
    save();
    showTree(S.branch, null, "Your branch.", "Let's follow it.");
    if (S.branch === "A"){
      progress(30, "Your target");
      await say("Love that you have a target! Which career is it?");
      const t = await askText({placeholder:"e.g. IPS officer, data analyst", label:"Your target career"});
      let found = findRoles(t);
      if (found.length > 1){
        await say("A couple of roles fit that. Which one do you mean?");
        const id = await choose(found.map(r => ({id:r.id, icon:r.icon, label:r.title})), {layout:"rows"});
        found = [roleById(id)];
      }
      S.optionLabels = [t];
      if (found.length){
        S.options = [found[0].id];
        showTree("A", [found[0].short], "Your target, on your branch.", "Next: does it really fit you?");
        await say(`${found[0].icon} <b>${esc(found[0].title)}</b>. Here's the real job, up close:`);
        widget(roleCard(found[0].id, false), "full");
      } else {
        S.custom = t.slice(0, 60);
        showTree("A", [S.custom], "Your target, on your branch.", "Next: does it really fit you?");
        await say(`I don't have details on <b>${esc(S.custom)}</b> yet, and that's fine. We can research it together on a call.`);
      }
      await say("Now let's check it really fits <b>you</b>: what you enjoy, one quick game and a few gut-feeling picks.");
      await next("Let's go");
    } else if (S.branch === "B"){
      progress(30, "A few in mind");
      await say("Which careers are you thinking about? Pick them below or type your own.");
      const r = await choose(D.popular.map(p => ({id:p, label:p})), {multi:true, other:"Something else? Type it, separated by commas"});
      const labels = [...r.ids, ...r.text.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)].slice(0, 6);
      const ids = [], customs = [];
      labels.forEach(l => { const f = findRoles(l); if (f.length) f.forEach(x => { if (!ids.includes(x.id)) ids.push(x.id); }); else customs.push(l); });
      S.options = ids; S.optionLabels = labels; S.custom = customs[0] ? customs[0].slice(0, 60) : null; save();
      showTree("B", labels, labels.length > 1 ? "Your options, as leaves on your branch." : "Your option, on your branch.", "Next: interests, games and work style, then they're compared side by side.");
      await say(labels.length > 1
        ? "That's really common, and it usually means each one meets a different need. Let's find which fits <b>you</b>: a quick chat about what you enjoy, 2 short games, then all of them side by side."
        : "Let's check how it fits you: a quick chat about what you enjoy, 2 short games, then we'll compare it with a couple of others.");
      await next("Let's go");
    } else {
      await say("No idea yet is a perfectly good place to start. Let's find what you're naturally drawn to.");
      await wait(600);
    }

    /* Discover: interests */
    progress(40, "Discover you · interests");
    showBoard(false);
    await say(`What do you enjoy doing when no one's asking you to, ${NAME()}? Hobbies, things you lose track of time doing.`);
    const it = await choose(D.interests.map(i => ({id:i.id, icon:i.icon, label:i.label})), {multi:true, other:"…or describe it in your own words, in any language"});
    it.ids.forEach(id => { const x = D.interests.find(i => i.id === id); x.tags.forEach(t => { addTag(t, 1); addClue(t, x.label); }); });
    if (it.text) textTags(it.text).forEach(({tag, word}) => { addTag(tag, 1.5); addClue(tag, `"${word}"`); });
    S.interestText = it.text; save();
    showBoard(true);
    const tt = topTags(2);
    if (tt.length){
      await say(`${it.text ? "Love that! " : ""}So ${tt.map(t => D.tags[t].phrase).join(" and ")}.${tt.length > 1 ? " That's a useful mix." : ""}`);
      const sug = D.roles.map(r => ({r, s:score(r)})).sort((a, b) => b.s - a.s).slice(0, 3);
      await say("Careers where that comes in handy:");
      widget(sug.map(({r}) => `<div class="su-fit" style="cursor:default"><span class="e" aria-hidden="true">${r.icon}</span><span><b>${esc(r.title)}</b><small>${esc(r.does[0])}</small></span></div>`).join(""));
      await say("We'll check properly in a minute. First, a little fun 🎮");
    } else {
      await say("No worries. The games and a few quick picks will tell us more 🎮");
    }
    await next("Show me the games");

    /* Discover: how you think */
    progress(48, "Discover you · how you think");
    const need = S.branch === "A" ? 1 : 2;
    await say(`${need === 1 ? "One quick game" : "Pick 2 quick games"}. No timer pressure. I'm not checking how fast you are, only <b>how you like to solve things</b>. You can skip any time.`);
    const res = await games(need);
    S.traits = scoreGames(res); save();

    /* Discover: work style */
    progress(56, "Discover you · work style");
    await say("Last bit, just gut feeling. Tap the one that sounds more like a good day for you. No right answers 🙂");
    for (let k = 0; k < D.wyr.length; k++){
      const pick = await wyrCard(k), q = D.wyr[k];
      const apply = (o, wt) => { o.tags.forEach(t => addTag(t, wt)); S.focus += (o.focus || 0) * wt; S.earn += (o.earn || 0) * wt; };
      if (pick === "both"){ apply(q.a, .5); apply(q.b, .5); } else apply(q[pick], 1);
    }
    me("Done!");
    save();

    /* What fits */
    progress(64, "Discover you · what we found");
    app.classList.add("wide");
    stairs(); await climb(5);
    cap("Look how far you've come.", "Now let's turn what we found into a goal.");
    await say("Putting it all together…");
    const sc = styleCard();
    if (sc){
      const el = widget(sc, "full");
      setTimeout(() => el.querySelectorAll("[data-w]").forEach(b => b.style.width = b.dataset.w + "%"), 80);
    } else await say("You skipped the games, which is completely fine. We'll learn your style as we go.");
    const enjoy = topTags(3).map(t => D.tags[t].label).join(", ") || "Still exploring";
    const style = S.focus > .5 ? "Quiet, focused work" : S.focus < -.5 ? "Out with people" : "A mix of both";
    const life = S.worries.length ? S.worries.slice(0, 2).map(id => D.worries.find(w => w.id === id).label).join(" · ") : "Exploring calmly";
    widget(`<div class="su-sum"><div><small>You enjoy</small>${esc(enjoy)}</div><div><small>Your work style</small>${esc(style)}</div><div><small>Your life right now</small>${esc(life)}</div></div>`, "full");
    await say(`Here's what fits <b>you</b>, based on what you enjoy, how you think${needEarn() ? " and that you'd like to earn soon" : ""}. Tap one to see the real job up close.`);
    const id = await pickRole(candidates());

    /* Goal */
    S.goal = id; S.done = {}; save();
    await climb(6); crowd("gone"); pill(""); showFlag();
    cap("Goal fixed, flag planted.", "The crowd is gone. You're climbing your own stairs now, at your own pace.");
    progress(80, "Your goal and this week");
    await say(`Your goal is set, ${NAME()} 🎯`);
    await say("Here are 3 small things for this week. Every tick climbs you a step.");
    tasksWidget();
    await say("One more thing. Your career is one part of your life, not all of it.");
    await next("Show my life plan");
    progress(92, "Your life, not just your job");
    await say("Here's your career next to everything else that matters: study, family, money and your own life choices.");
    planner();
    await share();
  }

  /* Coming back with a plan already saved. */
  async function dashboard(){
    S.tags = S.tags || {}; S.worries = S.worries || []; S.traits = S.traits || {}; S.done = S.done || {};
    app.classList.add("wide");
    level = 0; crowdState = "gone";
    stairs(); showFlag();
    progress(100, "Your plan");
    cap("Welcome back.", "Tick a task to climb a step.");
    await climb(6 + Math.min(doneCount(), 3));
    await say(`Welcome back, ${NAME()} 🌻 Here's where you left off.`);
    tasksWidget();
    await next("Show my life plan");
    planner();
    await share();
  }

  (S.goal ? dashboard() : session()).catch(err => { console.error(err); });
})();
