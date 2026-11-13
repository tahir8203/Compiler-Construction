# Summary of the old chat: "Compiler Construction course setup"

Dates: 2026-11-11 to 2026-11-13. Instructor: Muhammad Tahir Mehmood.

## What you asked for, in order, and what was delivered

1. **"Read the chats of the Mobile App Development and ICT courses, make this course's prompt, the complete course, the HTML site, then Git, Vercel and my portfolio."**
   - Course prompt written: `site/docs/MASTER-PROMPT.md`.
   - Complete course built from the scanned outline: 30 sessions plus Midterm (week 9) and Final (week 17) units, Bloom's Taxonomy outcomes, 870 slides, 72 animations, lab tools, quizzes and assignments.
   - Pushed to GitHub `tahir8203/Compiler-Construction`; live on Vercel at https://compiler-construction-phi.vercel.app/.
   - Course card added to the portfolio (`tahir8203/Portfolio`, PR #9).
2. **"Use the same picture and information as the Week 1 lecture."**
   - Instructor photo and details from the Lectures 1–3 page are used on the site (card and footer).
3. **"Yes, merge it"**: portfolio PR #9 merged.
4. **"Some slides are cutting at the top and bottom."**
   - Fixed: tall slides shrink to fit or scroll, and animations stay inside their frames. All 870 slides were checked.
5. **"Make a complete working mobile app and provide the APK."**
   - Android app written (offline, bundles the whole course).
   - The GitHub cloud build was blocked because the GitHub account had a billing lock.
6. **"Fixed, build it"**: the signing key was stored as GitHub secrets, but GitHub was still locked.
7. **"Run locally as the Mobile Application Development chat did."**
   - Built on this laptop with the tools from the DEA app (`C:\dev`). A signed APK, version 1.0.0, was produced.
8. **"Yes, publish it"**: published as GitHub release `app-v1.0.0`. The website got an "Android app" download button.
9. **"Save all information into the D drive Compiler folder for a new chat."**: `HANDOFF.md` was written.
10. **(Fable 5.2) "Make this course more updated, more animated, more useful; make the website and mobile app a proper portal with a proper mobile-app feel."**
    - **Portal 2.0:** student dashboard, phone tab bar, search, XP levels, badges and notes.
    - **New sections:** practice centre with mock exams and trainers, compiler pipeline visualizer, cheat sheets, viva Q&A and "Compilers today".
    - **Website:** installable and works offline.
    - **Android 2.0.0:** splash screen, vibration, theme-matched bars, keep-awake, rotate and share. Back-button bug fixed.
11. **"Yes, publish 2.0.0"**: published as GitHub release `app-v2.0.0`. The website button now gives 2.0.0.
12. **"Save everything to my laptop for a new Claude account"**: this handover folder and a backup zip were made.

## Still open

- Install app 2.0.0 on a real phone and test it: tabs, a quiz, slides with the back button, rotate.
- In Chrome on the live site, check that "Install app" works.
- Optional: mention the Android app and the portal on the portfolio card.
- Optional: fix the GitHub billing lock if cloud builds are wanted.
- Optional: delete `D:\Android-build-tools`.
