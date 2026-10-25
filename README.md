# Zephra — marketing site

Static landing page for **Zephra**, the private AI copilot for Mac. No build step: `index.html`,
`styles.css`, `script.js`, `assets/`. Hosted on GitHub Pages from `main`.

Local preview: `python3 -m http.server 8000` → http://localhost:8000

## Before launch
- **Waitlist:** set `WAITLIST_ENDPOINT` in `script.js` (Formspree, ConvertKit, Supabase…). Until then
  the form opens a pre-filled email to `WAITLIST_EMAIL` — confirm that inbox exists.
- **Pricing:** launch prices (Free beta / Pro $9/mo / Lifetime $79) are placeholders — edit in `index.html`.
- Custom domain: add a `CNAME` file and DNS record if you want e.g. `zephra.nexoraaero.com`.

© 2026 Nexora Aero. All rights reserved.
