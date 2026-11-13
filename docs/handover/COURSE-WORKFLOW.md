# How the instructor's course sites are built and shipped

(Saved from the previous Claude account's memory. A new Claude account should save this to its own memory.)


The user (instructor Muhammad Tahir Mehmood) builds one animated, projector-ready static course site per course: engine copied from the ICT site (assets/app.js, styles.css, demos.js; content as data in assets/sessions/part1-4.js; exam units id 90/99), a docs/MASTER-PROMPT.md and docs/PROGRESS.md, pushed to a GitHub repo under tahir8203 whose main branch auto-deploys on Vercel, then a card in the Teaching section of tahir8203/Portfolio (lib/data.ts `teaching`, screenshot in public/shots/*.jpg at 1440x900, repo blurb in app/page.tsx DESCRIPTIONS) via a PR.

Courses so far: Applications of ICT (D:\Fall 2026\ICT\ict), Mobile Application Development, Compiler Construction (D:\Fall 2026\Compiler\site, compiler-construction-phi.vercel.app, 2026-11-11).

Full handoff for the Compiler course (web + Android app, build/publish steps, open items): `D:\Fall 2026\Compiler\HANDOFF.md` — read it first in any Compiler chat. Android APKs for course sites are WebView apps built locally with the DEA toolchain (C:\dev\jdk21, C:\dev\android-sdk, cached Gradle 9.3.1, AGP 9.1.0) because GitHub Actions is billing-locked (2026-11-12); signing key lives outside the repo in the course folder's android-signing\. The user wants such handoff files written into the course's D: folder.

**Why:** the user asks for "same as previous courses" and expects this pipeline end to end.
**How to apply:** for instructor info use the Compiler Lectures 1–3 card (user asked for it explicitly): MPhil Computer Science · Lecturer, University of Central Punjab, Okara · Headmaster, GES 53/2-L Okara · Assistant Director (P&D), DEA Okara · 10+ years teaching CS; photo = assets/instructor.jpg in the Compiler repo. Every session gets Bloom's Taxonomy Head/Heart/Hand outcomes. Merging portfolio PRs needs the user's go-ahead. Git identity for commits: the noreply address used in the repos' history.
