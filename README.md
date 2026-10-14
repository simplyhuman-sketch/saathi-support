# Saathi — a first step toward support

Saathi is a student hackathon prototype for mental health access in India. It offers a gentle, non-diagnostic check-in, simple support navigation, and direct links to Tele-MANAS and India's emergency number. If the user explicitly opts in, a server-side Gemini call writes a short reflection from fixed topic labels. Without consent or when AI is unavailable, a local reflection is shown instead.

## Scope and safety

- Saathi does not diagnose, assess suicide risk, provide treatment, or replace a clinician.
- If there is immediate danger, it points to 112. Tele-MANAS is listed at 14416 for mental health support.
- Check-in answers stay in the browser unless the user explicitly opts into Gemini. Only fixed topic labels are sent; no free text, name, account, or database is used.
- Google receives opted-in topic labels and processes the request under its applicable Gemini API terms.
- The API key belongs in the hosting provider's server-side environment settings. Never put it in browser code or commit it.
- This is a prototype. Confirm service details and obtain qualified clinical and privacy review before public use.

## Run locally

Requires Node.js 20 or newer. From this folder:

```sh
npm run dev
```

Open http://localhost:3000. The local reflection works without an API key. To enable the optional Gemini reflection, copy `.env.example` to `.env`, add a Google AI Studio API key, and start the app with that environment variable set. The `.env` file is ignored by Git.

## Deploy

This project is structured for Vercel: static files are served from the project root and `api/reflection.js` becomes a serverless function. Import the public GitHub repository into Vercel, add `GEMINI_API_KEY` in the project's Environment Variables, then deploy. The site still works with local reflections if that secret is not configured.

## Submission checklist

- Public GitHub repository URL
- Live deployment URL
- Public LinkedIn project post URL

Suggested project name: **Saathi — a first step toward support**. Add your team and event details to the eventual project post. Tag Google for Developers, Hack2Skill, and VVITU as requested by the event brief.
