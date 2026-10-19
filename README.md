# Varsha's Growth Hub

A static website: plain HTML, CSS and JavaScript with no build step. Open any `.html` file, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Where things live

```
index.html          Home
roadmap.html        Career roadmap tool (the only page that shows prices)
mentors.html        Mentors, filtered by language first, then field
community.html      Jobs channel, community group, Saturday sessions
about.html          Founder story, what makes us different, disclaimer
contact.html        Contact form that prepares a WhatsApp/email message

assets/js/config.js   ← EDIT THIS for almost every content change
assets/js/layout.js   Shared header, footer, menu and helpers
assets/js/*.js        One script per page
assets/css/site.css   All styles; colours are variables at the top
sw.js                 Offline cache (bump CACHE when adding files)
```

## Common changes (all in `assets/js/config.js`)

| I want to… | Change |
|---|---|
| Add my WhatsApp number or email | `GH.contact.whatsappNumber` (digits with country code, e.g. `919876543210`) / `GH.contact.email` |
| Change a link | `GH.links` |
| Change a price | `price` in `GH.services` |
| Update "elsewhere" prices | `market` in `GH.services`, `institute` in `GH.fields` and `GH.marketNote` |
| Add a mentor | Copy a block in `GH.mentors`, give it a new `id` |
| Add a career field / roadmap | Copy a block in `GH.fields` |
| Add a struggle option | Add to `GH.struggles` and list the services it `adds` |
| Change the Saturday session | `GH.weekly` |
| Remove the "Launch prices" label | `GH.launchPricing = false` |

Empty links and contact details are hidden automatically.

## Adding a new page

1. Copy `about.html` and rename it.
2. Replace what's inside `<main>`.
3. Add it to `NAV` at the top of `assets/js/layout.js`, and it appears in the header and footer of every page.
4. Add the file to `FILES` in `sw.js` and bump `CACHE`.

## Principles

- **Prices are only shown inside a personal roadmap**, after the visitor has answered the questions, next to what the same help costs elsewhere.
- **Native language first**: mentor matching and filters always use language before field.
- **No referral selling and no job guarantees.** We only charge for guidance.
