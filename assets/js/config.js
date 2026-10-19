/* ================================================================
   GROWTH HUB — SITE CONFIG
   Almost everything you'll want to change lives in this one file:
   contact details, links, mentors, prices, market comparisons and
   the career roadmaps. Pages read from here, so you rarely need to
   touch the HTML. See README.md for examples.
   ================================================================ */

window.GH = {};

/* ---------- Contact & links ----------
   Empty values are hidden on the site automatically. */
GH.contact = {
  whatsappNumber: "",   // digits with country code, e.g. "919876543210"
  email: "",            // e.g. "hello@yourdomain.com"
  founder: "Varsha"
};

GH.links = {
  communityGroup: "https://chat.whatsapp.com/DXG5p6VDo1NKdMCblKhX72",
  jobsChannel: "https://whatsapp.com/channel/0029VbDF70S5Ui2f8ziZYE05",
  feedbackForm: ""      // Google Form URL
};

/* ---------- Weekly session ---------- */
GH.weekly = {
  title: "Saturday Build & Learn",
  day: "Every Saturday",
  time: "11:00 AM IST",
  desc: "Each week is either a project-building session, where teams work on real projects with a mentor, or a knowledge-sharing session on a career or tech topic.",
  where: "This week's topic and joining details are posted in the community group."
};

/* ---------- Languages ----------
   Native language is the first filter everywhere on the site. */
GH.languages = [
  {id:"Telugu",    native:"తెలుగు"},
  {id:"English",   native:"English"},
  {id:"Hindi",     native:"हिन्दी"},
  {id:"Tamil",     native:"தமிழ்"},
  {id:"Kannada",   native:"ಕನ್ನಡ"},
  {id:"Malayalam", native:"മലയാളം"},
  {id:"Marathi",   native:"मराठी"},
  {id:"Bengali",   native:"বাংলা"}
];

/* ---------- Mentors ----------
   fields: ids from GH.fields below. linkedin/github: leave "" to hide. */
GH.mentors = [
  {
    id:"varsha", name:"Varsha Kakumanu", initials:"VK",
    role:"Full-stack MERN Developer · Founder",
    years:5, languages:["Telugu","English"],
    fields:["frontend","fullstack"],
    skills:["React.js","Node.js","Express","MongoDB"],
    bio:"Founder of Growth Hub. Helps developers with React, full-stack projects, interviews and growing in the IT industry.",
    linkedin:"https://www.linkedin.com/in/varsha-kakumanu-6250691a7/", github:""
  },
  {
    id:"rani", name:"Rani", initials:"R",
    role:"Data Analyst, now in SAP FICO",
    years:5, languages:["Telugu","English"],
    fields:["data","sapfico"],
    skills:["Data analysis","SAP FICO","Career switching"],
    bio:"Switched from data analysis to SAP FICO, so she knows what a career switch takes. Already mentoring a student on the data analyst path.",
    linkedin:"", github:""
  },
  {
    id:"prudhvi", name:"Prudhvi", initials:"P",
    role:"UI/UX Designer & MERN Developer",
    years:4, languages:["Telugu","English"],
    fields:["uiux","frontend","fullstack"],
    skills:["UI/UX design","Figma","Design to code","MERN"],
    bio:"Designs interfaces and builds them too. A good fit if you want to move into design or bridge design and development.",
    linkedin:"https://www.linkedin.com/in/prudhvi-babu-siringi-9a6b1b194/", github:""
  }
];

/* ---------- Services ----------
   price = Growth Hub price (shown ONLY inside a personal roadmap).
   market = what the same help typically costs on paid mentor platforms,
            per unit (null = no fair comparison, left out of totals). */
GH.launchPricing = true;   // shows a "launch price" label next to prices

GH.services = {
  consult:  {name:"Free career consultation", short:"Consultation", price:0, unit:"", market:null,
             desc:"A first conversation about your goals, gaps and a realistic roadmap."},
  resume:   {name:"Resume preparation", short:"Resume", price:99, unit:"", market:749,
             desc:"An ATS-friendly resume aligned to the roles you're targeting."},
  mock:     {name:"Mock interviews (5 rounds)", short:"Mock interviews", price:249, unit:"for 5", market:1299*5,
             desc:"Five practice rounds in your track, with feedback after each one."},
  mentor:   {name:"1:1 mentorship session", short:"Mentorship", price:299, unit:"per session", market:1299,
             desc:"Time with someone already working in your target role."},
  project:  {name:"Collaborative project", short:"Project building", price:599, unit:"from", market:null,
             desc:"Build a portfolio project in a small team, with mentor reviews."},
  community:{name:"Community & weekly sessions", short:"Community", price:0, unit:"", market:null,
             desc:"Job updates, peer help and the Saturday sessions."}
};

/* Mock interview tracks we can actually run today. */
GH.mockTracks = [
  {name:"React / frontend technical", mentor:"varsha"},
  {name:"MERN full-stack technical", mentor:"varsha"},
  {name:"Data analyst: SQL + Excel", mentor:"rani"},
  {name:"SAP FICO functional", mentor:"rani"},
  {name:"UI/UX portfolio review", mentor:"prudhvi"},
  {name:"HR & communication round", mentor:null}
];

/* Where the market numbers come from. Update when you re-check prices. */
GH.marketNote = "Market prices are the lower end of public listings checked in October 2026 (paid mentor platforms such as Topmate, and institute fee guides). Real prices vary; many are higher.";

/* ---------- Career fields & roadmaps ----------
   institute: typical course fee range for this field (low is used for savings). */
GH.fields = [
  {
    id:"frontend", label:"Frontend / React developer",
    institute:{label:"Full-stack / frontend bootcamp", low:75000, high:400000},
    phases:[
      {t:"Foundations", w:"Weeks 1–4", items:["HTML, CSS and responsive layouts","Modern JavaScript (ES6+, async, DOM)","Git and GitHub basics"]},
      {t:"React core", w:"Weeks 5–10", items:["Components, props, state and hooks","Routing, forms and API calls","One small app deployed online"]},
      {t:"Job-ready", w:"Weeks 11–14", items:["Two portfolio projects with clean READMEs","JavaScript + React interview questions","Resume and LinkedIn aligned to frontend roles"]}
    ]
  },
  {
    id:"fullstack", label:"Full-stack (MERN) developer",
    institute:{label:"Full-stack bootcamp", low:75000, high:400000},
    phases:[
      {t:"Frontend base", w:"Weeks 1–6", items:["JavaScript, HTML and CSS","React with hooks and routing","Git and GitHub workflow"]},
      {t:"Backend", w:"Weeks 7–12", items:["Node.js and Express REST APIs","MongoDB data modelling","Authentication and deployment"]},
      {t:"Job-ready", w:"Weeks 13–16", items:["One end-to-end team project","System basics and API interview questions","Resume focused on what you built"]}
    ]
  },
  {
    id:"data", label:"Data analyst",
    institute:{label:"Data analytics course", low:40000, high:120000},
    phases:[
      {t:"Core tools", w:"Weeks 1–5", items:["Excel: formulas, pivots, lookups","SQL: joins, grouping, window functions","Basic statistics for analysis"]},
      {t:"Visualise and explain", w:"Weeks 6–10", items:["Power BI or Tableau dashboards","Python basics with pandas","Telling a story with data"]},
      {t:"Job-ready", w:"Weeks 11–13", items:["Two dashboard projects on real datasets","SQL and case-study interview practice","Resume showing business impact"]}
    ]
  },
  {
    id:"sapfico", label:"SAP FICO consultant",
    institute:{label:"SAP FICO training", low:25000, high:80000},
    phases:[
      {t:"Finance basics", w:"Weeks 1–3", items:["Accounting fundamentals and terms","How finance teams work in a company","SAP navigation and structure"]},
      {t:"FI and CO modules", w:"Weeks 4–10", items:["GL, AP, AR and asset accounting","Cost centres and profit centres","Key configuration steps"]},
      {t:"Job-ready", w:"Weeks 11–13", items:["End-to-end scenario walkthroughs","Functional interview scenarios","Resume aligned to SAP roles"]}
    ]
  },
  {
    id:"uiux", label:"UI/UX designer",
    institute:{label:"UI/UX design course", low:40000, high:300000},
    phases:[
      {t:"Design basics", w:"Weeks 1–4", items:["Layout, typography and colour","Figma fundamentals","Studying good product design"]},
      {t:"UX process", w:"Weeks 5–10", items:["User research and problem framing","Wireframes, flows and prototypes","Usability testing"]},
      {t:"Job-ready", w:"Weeks 11–14", items:["Portfolio with 2–3 case studies","Portfolio review and walkthrough practice","Design-to-code basics (bonus)"]}
    ]
  },
  {
    id:"testing", label:"Software tester / QA",
    institute:{label:"Software testing course", low:15000, high:60000},
    phases:[
      {t:"Manual testing", w:"Weeks 1–4", items:["SDLC, STLC and test design","Writing test cases and bug reports","Jira and basic SQL"]},
      {t:"Automation", w:"Weeks 5–10", items:["Selenium or Playwright basics","API testing with Postman","One automation framework project"]},
      {t:"Job-ready", w:"Weeks 11–12", items:["Testing interview questions","Explaining your project clearly","Resume aligned to QA roles"]}
    ]
  },
  {
    id:"unsure", label:"I'm not sure yet",
    institute:{label:"Generic IT training course", low:40000, high:150000},
    phases:[
      {t:"Explore", w:"Weeks 1–2", items:["Free consultation to map your interests and strengths","Try short intro tasks in 2 fields","Talk to people already in those roles"]},
      {t:"Decide", w:"Weeks 3–4", items:["Pick one field with a mentor","Get a field-specific roadmap","Join the Saturday sessions to start building"]}
    ]
  }
];

/* ---------- Struggles ----------
   Each struggle adds services to the plan. mentorSessions adds 1:1 sessions. */
GH.struggles = [
  {id:"resume",     label:"My resume isn't getting shortlisted", adds:["resume"], tip:"Fix your resume first, since it's what gets you the interviews."},
  {id:"interviews", label:"I get interviews but don't clear them", adds:["mock"], tip:"Practice in your exact track until answering feels natural."},
  {id:"direction",  label:"I don't know what to learn, or in what order", adds:["mentor"], mentorSessions:1, tip:"Follow one roadmap with a mentor instead of collecting random courses."},
  {id:"projects",   label:"I have no real projects to show", adds:["project"], tip:"Build one solid team project, which says more than five tutorial clones."},
  {id:"confidence", label:"I find it hard to explain myself in English", adds:["mock","mentor"], mentorSessions:1, tip:"Prepare in your own language first, then practise saying it in English."},
  {id:"switching",  label:"I'm switching from another field or non-IT", adds:["mentor","project"], mentorSessions:1, tip:"Learn from someone who has made a similar switch."},
  {id:"network",    label:"I don't know anyone in the industry", adds:["community"], tip:"Join the community and Saturday sessions to meet peers and mentors."},
  {id:"gap",        label:"I have a career gap", adds:["mentor","resume"], mentorSessions:1, tip:"Plan how to explain your gap honestly and show recent work."}
];

GH.stages = ["Student", "Fresher / recent graduate", "Job seeker", "Working professional", "Switching careers"];
GH.times  = ["Weekday evenings", "Weekends", "Flexible"];
