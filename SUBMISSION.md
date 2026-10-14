# Hackathon submission runbook

## Project in one sentence

Saathi is a privacy-conscious mental health access prototype that turns an optional, low-pressure check-in into a small next step and connects people in India to human support.

## Build and review in Google Antigravity

1. Install Google Antigravity from its [official download page](https://antigravity.google/download) and open this `saathi-support` folder as the project.
2. Use the project panel to review `README.md`, the front end, and the server-side AI function. Keep the API key out of source files and chat prompts.
3. Open Antigravity's terminal in this folder and run `npm run dev`; visit `http://localhost:3000`.
4. Review the prototype's behavior and wording with a mental-health professional or qualified reviewer before describing it as ready for real users.

## GitHub and repository requirements

The project is designed to stay well below 10 MB. Keep just one public branch named `main` for the event submission. From this folder, create the initial commit:

```sh
git init -b main
git add .
git commit -m "Build Saathi mental health support prototype"
```

On GitHub, create a **public** repository named `saathi-support` with no README, license, or `.gitignore` pre-generated. Then connect and push:

```sh
git remote add origin https://github.com/simplyhuman-sketch/saathi-support.git
git push -u origin main
```

Confirm the repository is public, `main` is the only branch, and the repository size is under 10 MB. The `.env` file is ignored; never push your API key.

## Deployment

1. Import the GitHub repository into Vercel and deploy it.
2. In the Vercel project settings, add `GEMINI_API_KEY` as an environment variable. Generate a key in Google AI Studio; keep it private and never paste it into this repository.
3. Redeploy after adding the key. Without the key, the app still offers the built-in reflection and support links.
4. Open the public URL on a phone and desktop. Check all check-in choices, the no-consent path, the optional AI path, the direct `14416` and `112` links, and the privacy note. Do not use real sensitive details in a demo.

## LinkedIn post draft

Replace the bracketed details. On LinkedIn, use the mention picker to tag the official Google for Developers, Hack2Skill, and VVITU pages, and add the event hashtag if one was supplied.

> Introducing **Saathi — a first step toward support**, our project for [hackathon / initiative name].
>
> Getting help can feel like a big first step. Saathi offers a gentle, non-diagnostic check-in, simple next-step suggestions, and direct access to Tele-MANAS (14416) and India's emergency response number (112). With explicit opt-in, Gemini creates a brief supportive reflection from selected topic labels; the API key stays server-side, and the app does not create accounts or store check-in answers.
>
> We built this as a prototype, not a replacement for professional care. Our next step is to review the experience with qualified mental-health and privacy experts.
>
>
> The prototype includes an optional server-side Gemini API reflection. We used Google Antigravity during development. *(Keep that last sentence only if your team actually opened and worked on this project in Antigravity.)*
>
> Team: [team name / members] · [institution]
>
> GitHub: [public repository URL]
>
> Live demo: [deployment URL]
>
> [Tag Google for Developers] [Tag Hack2Skill] [Tag VVITU]
>
> #MentalHealth #ResponsibleAI #India #AIForGood

## Required submission links

- Public GitHub repository: [paste URL]
- Live deployment: [paste URL]
- LinkedIn post: [paste URL]
