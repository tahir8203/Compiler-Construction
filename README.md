# Compiler Construction — Complete Animated Course

An animated, projector-ready course website for **Compiler Construction**, BS Computer Science, 3 credit hours, 17 weeks (Mid Term in Week 9, Final Term in Week 17).

Instructor: **Muhammad Tahir Mehmood** — MPhil Computer Science · Lecturer, University of Central Punjab, Okara · Headmaster, GES 53/2-L Okara · Assistant Director (P&D), DEA Okara.

Static site, no build step. Open `index.html` directly or serve the folder. Every push to `main` deploys to Vercel.

## What's inside

- **30 teaching sessions + Midterm unit (Week 9) + Final unit (Week 17)**, following the official calendar of activities.
- Every session has an introduction, learning objectives, **Bloom's Taxonomy outcomes (Head · Heart · Hand)**, 9–12 concept slides with code, step-by-step animations, a lab task, discussion questions, common mistakes, a summary, a 5-question knowledge check, homework and key terms.
- **Assessments:** Assignments 1–4, Quizzes 1–4, Midterm and Final mock exams (MCQ, true/false, short and application questions with model answers). Official marks and weightage are announced by the instructor.
- **72 algorithm animations** (Play / Step / Back / Reset): compiler phases, input buffering, Thompson's construction, subset construction, DFA simulation, transition diagrams, symbol tables and scopes, derivations, ambiguity, left recursion, recursive descent, FIRST/FOLLOW, LL(1) table and trace, panic-mode recovery, annotated parse trees, dependency graphs, SDTs, type checking, three-address code, quadruples/triples, short-circuit code, backpatching, switch.
- **Lab tools:** live tokenizer, FIRST/FOLLOW/LL(1) table builder with parse trace, expression → AST / postfix / three-address code / quadruples.
- **Watch mode** plays any lecture like a video. Revision dashboard, flashcards, glossary, search, bookmarks, progress tracking (localStorage), light/dark theme and print handouts.
- The original **Lectures 1–3** page is kept at `lectures-1-3.html`.

## Android app

`android/` is a native Android app that bundles the whole course and works offline, including progress tracking, Watch mode, the lab tools and the classic Lectures 1–3 page. The phone's back button closes a presentation and steps back through pages. Fullscreen hides the system bars, and Print opens Android's Save as PDF.

**Build on this PC:** `bash android/build-local.sh 1.0.1 2` (version name, version code). It uses the existing tools in `C:\dev\jdk21` and `C:\dev\android-sdk` and writes `D:\Fall 2026\Compiler\CompilerConstruction.apk`. Then upload it to a GitHub Release. Alternatively, GitHub Actions (`.github/workflows/android.yml`) builds and releases when a tag `app-vX.Y.Z` is pushed. The latest APK is always at
https://github.com/tahir8203/Compiler-Construction/releases/latest/download/CompilerConstruction.apk

Signing uses the repo secrets `KEYSTORE_B64` (base64 of the PKCS12 key) and `KEYSTORE_PASSWORD`. The key is not in the repo. Keep the backup safe, because every future update must be signed with the same key.

## Presentation mode

Open any session with **Present** or **Watch**, or use `#/p/<session>/<slide>` and `#/w/<session>`.

| Key | Action |
|---|---|
| → / Space / PageDown | Next slide |
| ← / PageUp | Previous slide |
| Home / End | First / last slide |
| number + Enter | Jump to slide |
| W | Watch mode |
| F | Fullscreen |
| Esc | Exit |
| N | Presenter notes |
| O | Slide overview |
| S / P / R | Step, play/pause, reset the animation |
| L | Light / dark |

## Structure

```
index.html                 Shell + course metadata (outline, outcomes, books, policies)
lectures-1-3.html          Original Lectures 1–3 page (Bloom's Taxonomy edition)
assets/styles.css          Design system, presentation and animation styles
assets/app.js              Router, study view, presentation engine, Watch mode, assessments, flashcards, glossary
assets/demos.js            Animation library (flow, trace, token, tree, automaton, code-walk and buffer builders)
assets/tools.js            Live lab tools (tokenizer, LL(1) builder, expression translator)
assets/sessions/part1-4.js Course content as data
assets/instructor.jpg      Instructor photo
docs/MASTER-PROMPT.md      Course-building prompt
docs/PROGRESS.md           Progress checklist
```

To edit a session, change the data in `assets/sessions/*.js`. After editing assets, bump the `?v=` number in `index.html` so browsers fetch the new files.
