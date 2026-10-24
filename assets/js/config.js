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
    bio:"Founder of Rooting Careers. Helps developers with React, full-stack projects, interviews and growing in the IT industry.",
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
   price = Rooting Careers price (shown ONLY inside a personal roadmap).
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

/* ---------- Find your track (track.html) ----------
   Career insights for each field the quiz can recommend.
   pay = typical fresher range in India. Re-check public salary listings now and then and update GH.payNote. */
GH.payNote = "Approximate fresher ranges from public salary guides checked in October 2026. Pay varies a lot by city, company and skills; product companies often pay more.";
GH.trackInsights = {
  frontend:{
    day:"Turn designs into working screens with HTML, CSS, JavaScript and React, then make them fast and easy to use.",
    suits:"People who like seeing their work straight away and care about how things look and feel.",
    ready:"About 3–4 months of focused learning",
    pay:"₹4–7 LPA",
    demand:"Steady demand at startups and service companies; a strong portfolio matters more than certificates.",
    first:"Build one small page this week with HTML and CSS, and put it on GitHub."
  },
  fullstack:{
    day:"Build whole apps: the screens people use, the server behind them and the database that stores everything.",
    suits:"People who enjoy coding a lot and like understanding how every part of a system fits together.",
    ready:"About 4–5 months of focused learning",
    pay:"₹3.5–7 LPA",
    demand:"Wanted by startups that need people who can ship features end to end.",
    first:"Learn JavaScript basics, then build a to-do app that saves its data."
  },
  data:{
    day:"Clean data, find patterns with Excel, SQL and dashboards, and explain what the numbers mean to the business.",
    suits:"People who like numbers, asking why, and turning messy information into clear answers.",
    ready:"About 3–4 months of focused learning",
    pay:"₹3.5–6 LPA",
    demand:"Needed in almost every industry, not only IT: banks, retail, healthcare and startups.",
    first:"Take a public dataset into Excel and answer three questions about it."
  },
  sapfico:{
    day:"Set up and support SAP's finance and accounting modules so a company's money, invoices and reports flow correctly.",
    suits:"Commerce, finance or accounting backgrounds who want an IT career without heavy coding.",
    ready:"About 4–6 months, including SAP practice",
    pay:"₹3.5–6 LPA",
    demand:"Large companies run on SAP; S/4HANA skills are in higher demand than older SAP versions.",
    first:"Revise accounting basics (ledgers, payables, receivables) and read how SAP FICO is organised."
  },
  uiux:{
    day:"Research what users need, sketch screens, build prototypes in Figma and test them with real people.",
    suits:"People with a good eye who enjoy solving problems for users more than writing code.",
    ready:"About 3–5 months, plus a portfolio",
    pay:"₹3.5–6 LPA",
    demand:"Product companies and startups hire designers who can show a real case study.",
    first:"Redesign one screen of an app you use, in Figma, and write down why you changed it."
  },
  testing:{
    day:"Find bugs before users do: write test cases, test apps by hand, then automate checks with tools like Selenium or Playwright.",
    suits:"Careful, detail-minded people who like breaking things to make them better. Light coding at first.",
    ready:"About 2–3 months to start; automation takes longer",
    pay:"₹2.5–5 LPA (automation roles ₹4–7 LPA)",
    demand:"A common first step into IT; automation skills raise pay quickly.",
    first:"Pick any website, write five test cases for its sign-up form and report what breaks."
  }
};

/* Quiz questions. Each option adds points to the fields it suits (ids from GH.fields). */
GH.trackQuiz = [
  {q:"Which of these would you enjoy most on a free afternoon?", options:[
    {label:"Making a web page look exactly right", pts:{frontend:3, uiux:1}},
    {label:"Building an app that saves and loads data", pts:{fullstack:3, frontend:1}},
    {label:"Finding patterns in a big spreadsheet", pts:{data:3, sapfico:1}},
    {label:"Sketching how an app should look and feel", pts:{uiux:3, frontend:1}},
    {label:"Trying to break an app to find what's wrong", pts:{testing:3}},
    {label:"Understanding how a company's money flows", pts:{sapfico:3, data:1}}
  ]},
  {q:"What did you study, or are you studying?", options:[
    {label:"Computer science or IT", pts:{fullstack:2, frontend:1, testing:1}},
    {label:"Another engineering branch", pts:{testing:2, data:1, fullstack:1, frontend:1}},
    {label:"Commerce, BBA or finance", pts:{sapfico:3, data:2}},
    {label:"Arts, design or another degree", pts:{uiux:2, data:1, testing:1}}
  ]},
  {q:"How do you feel about coding?", options:[
    {label:"I love it and could code all day", pts:{fullstack:3, frontend:2}},
    {label:"I'm fine with some coding", pts:{data:2, frontend:1, testing:1}},
    {label:"I'd rather code a little, or not at all", pts:{uiux:2, sapfico:2, testing:2}}
  ]},
  {q:"Which way of working sounds most like you?", options:[
    {label:"Visual: I like seeing what I make", pts:{frontend:2, uiux:2}},
    {label:"Logical: puzzles and systems", pts:{fullstack:2, data:1, testing:1}},
    {label:"Numbers and business", pts:{data:2, sapfico:2}},
    {label:"Careful: I notice small details", pts:{testing:3, sapfico:1}}
  ]},
  {q:"Which of these do you already have?", options:[
    {label:"Some HTML, CSS or JavaScript", pts:{frontend:2, fullstack:1}},
    {label:"Comfort with Excel or SQL", pts:{data:2, sapfico:1}},
    {label:"Accounting or finance knowledge", pts:{sapfico:3}},
    {label:"A good eye for design (Figma, Canva)", pts:{uiux:3}},
    {label:"None of these yet", pts:{testing:1, frontend:1}}
  ]},
  {q:"How soon do you need a job?", options:[
    {label:"Within 3–4 months", pts:{testing:2, frontend:1, data:1}},
    {label:"In about 4–6 months", pts:{frontend:1, fullstack:1, data:1, uiux:1}},
    {label:"I can invest 6 months or more", pts:{fullstack:2, sapfico:1, uiux:1}}
  ]}
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

/* ---------- Home page hook: "Which sounds like you?" ----------
   Each situation pre-fills the roadmap tool (stage + struggles). */
GH.situations = [
  {id:"student",  label:"I'm a student and don't know where to start",       stage:"Student",                   struggles:["direction"]},
  {id:"nocalls",  label:"I'm a fresher and not getting interview calls",     stage:"Fresher / recent graduate", struggles:["resume","projects"]},
  {id:"nooffers", label:"I get interviews but no offers",                    stage:"Job seeker",                struggles:["interviews"]},
  {id:"switch",   label:"I want to switch to a new role or field",           stage:"Switching careers",         struggles:["switching"]},
  {id:"stuck",    label:"I'm working but feel stuck",                        stage:"Working professional",      struggles:["direction"]},
  {id:"gap",      label:"I'm coming back after a career gap",                stage:"Job seeker",                struggles:["gap"]}
];

/* ---------- "Where you stand" career check ----------
   Each area is rated from the visitor's answers:
   focus  = they told us this is a blocker (any struggle in `focus`)
   needs  = likely weak for someone at their stage/field (`needs`)
   ok     = nothing suggests a problem */
GH.insightAreas = [
  {
    id:"skills", label:"Skills",
    focus:["direction","projects","switching"],
    needs:{stages:["Student"], struggles:["gap"], fields:["unsure"]},
    text:{focus:"This is your main gap. A clear roadmap and one real project will move you fastest.",
          needs:"Your foundation needs shaping for your target role.",
          ok:"You know what actually gets people hired. Keep building in your target role."}
  },
  {
    id:"resume", label:"Resume",
    focus:["resume"],
    needs:{stages:["Student","Fresher / recent graduate","Switching careers"], struggles:["gap"]},
    text:{focus:"Your resume is likely why you aren't getting calls. This is the quickest fix.",
          needs:"At your stage, most resumes undersell real work. Worth a review.",
          ok:"You know how resumes really get read. Keep yours sharp as you build."}
  },
  {
    id:"interviews", label:"Interviews",
    focus:["interviews","confidence"],
    needs:{stages:["Student","Fresher / recent graduate","Switching careers"]},
    text:{focus:"You're close. Focused practice in your track turns interviews into offers.",
          needs:"You'll need practice before the real ones. Start early.",
          ok:"You know how to open strong. A practice round still helps before the big ones."}
  },
  {
    id:"network", label:"Network",
    focus:["network"],
    needs:{stages:["Student","Fresher / recent graduate","Switching careers"], struggles:["gap"]},
    text:{focus:"Knowing people in the industry opens doors. The community is free to join.",
          needs:"A small network of peers and mentors will help a lot at your stage.",
          ok:"You know how to learn from people. The community makes that even easier."}
  }
];

/* ---------- Founder note (home page, handwritten style) ---------- */
GH.founderNote = {
  hello: "Hi, I'm Varsha!",
  body: [
    "I started as a web developer with big dreams and very little guidance. Five years later, I'm still chasing big goals in my own career, and I've learned that the right person, at the right moment, changes everything.",
    "I built Rooting Careers so you don't have to figure it all out alone, or pay a fortune to get started. Ask me anything, in the language you think in."
  ],
  sign: "Let's grow together, Varsha"
};

/* ---------- Home game: Myth or Fact? ----------
   fact: true if the statement is true. why: the eye-opener shown after answering. */
GH.myths = [
  {s:"You need an expensive course to get your first IT job.", fact:false,
   why:"Institute courses can cost ₹40,000 to ₹4,00,000, but companies hire for skills you can show. A focused plan, one real project and good interview practice often matter more."},
  {s:"Recruiters read your whole resume carefully.", fact:false,
   why:"Eye-tracking research by Ladders found recruiters spend about 6 to 7 seconds on a first look. The top third of your resume has to do the work."},
  {s:"If you don't match 100% of a job post, don't apply.", fact:false,
   why:"Job posts are wish lists. If you match most of it and can show what you've built, apply."},
  {s:"Paying someone to get you a job or a referral is normal.", fact:false,
   why:"Real employers and recruiters never charge candidates. If someone asks you to pay for a job, it's a red flag."},
  {s:"Practising answers out loud makes a real difference in interviews.", fact:true,
   why:"Knowing an answer and saying it clearly under pressure are different skills. Mock interviews close that gap."},
  {s:"You have to think in English to grow in tech.", fact:false,
   why:"Understand it deeply in your own language first, then practise explaining it in English. That's why our mentors speak your language."}
];

/* ---------- Roadmap puzzles ----------
   One scenario per "Where you stand" area. A right answer counts towards
   that area; a wrong one marks it "Needs work". */
GH.puzzles = [
  {area:"interviews",
   q:"The interviewer smiles and says: \"Tell me about yourself.\" What's your best move?",
   options:[
     {t:"Walk through my resume from school onwards", good:false},
     {t:"A 60-second story: who I am, what I've built, why this role", good:true},
     {t:"Talk about my hobbies so they see the real me", good:false}
   ],
   reveal:"The first minute sets the tone. A short story that connects your work to their role beats a resume recital.",
   helps:"Mock interviews help you build and practise your story."},
  {area:"resume",
   q:"How long does a recruiter spend on the first look at your resume?",
   options:[
     {t:"About 2 minutes", good:false},
     {t:"About 30 seconds", good:false},
     {t:"About 7 seconds", good:true}
   ],
   reveal:"Eye-tracking research by Ladders found about 6 to 7 seconds. If your best work isn't in the top third, it may never be seen.",
   helps:"Resume preparation puts your strongest proof where eyes land first."},
  {area:"skills",
   q:"Which helps most to get hired for a first tech role?",
   options:[
     {t:"Five certificates from online courses", good:false},
     {t:"One project I built, deployed and can explain", good:true},
     {t:"Learning four programming languages at once", good:false}
   ],
   reveal:"A real project shows you can build, debug and explain, which is exactly what interviews test.",
   helps:"Saturday Build & Learn and project building give you one to show."},
  {area:"network",
   q:"You want to know what a data analyst really does all day. Best move?",
   options:[
     {t:"Watch more YouTube videos about it", good:false},
     {t:"Message someone doing the job and ask two specific questions", good:true},
     {t:"Join a long course to find out", good:false}
   ],
   reveal:"People share far more than you'd expect when you ask a short, specific question. One conversation can save months.",
   helps:"The community and mentors are here for exactly these questions."}
];

/* Sunflower growth stage shown at the top of the result (by points).
   The drawing for each stage is in stageArt() in roadmap.js. */
GH.growthLevels = [
  {min:0, name:"Seedling", text:"Everything starts here. A clear plan will make you grow fast."},
  {min:3, name:"Growing",  text:"You've got the basics. Now it's about focus."},
  {min:5, name:"Budding",  text:"You're closer than you think. A few sharp moves will get you there."},
  {min:7, name:"Blooming", text:"You're ready. Let's polish and put you in front of the right roles."}
];
