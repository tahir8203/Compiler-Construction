# Compiler Construction: web portal and mobile app handoff

This file records everything needed to continue the Compiler Construction course website and Android app in a new chat.
Last updated: 2026-11-13.

**This file lives in the GitHub repo** (`docs/HANDOFF.md`) and is the main copy. Start with `START-HERE.md` in the repo root. Paths below like `D:\Fall 2026\Compiler` refer to the instructor's laptop; the repo itself is `site\` there.

**How to use it in a new chat:** attach or @-mention this file (`docs/HANDOFF.md` in the repo) and write, for example:
"Read HANDOFF.md first, then <your request>".

---

## 1. Where everything is

| What | Location |
|---|---|
| Main folder | `D:\Fall 2026\Compiler` |
| Website source (git repo) | `D:\Fall 2026\Compiler\site` |
| GitHub repo | https://github.com/tahir8203/Compiler-Construction (public, branch `main`) |
| Live website (Vercel) | https://compiler-construction-phi.vercel.app/ |
| Vercel project / team | `prj_O3AcHfiP9f4CxiMk4lfF7bzcJf2b` / `team_ecFlVoTYGOiRvqFH4V7yLhif`. Every push to `main` deploys automatically. |
| Android APK (latest build) | `D:\Fall 2026\Compiler\CompilerConstruction.apk` |
| APK download (public) | https://github.com/tahir8203/Compiler-Construction/releases/latest/download/CompilerConstruction.apk |
| Release page | https://github.com/tahir8203/Compiler-Construction/releases/tag/app-v2.0.0 |
| App signing key (keep safe; never put it in git) | `D:\Fall 2026\Compiler\android-signing\cc-course-release.p12`, with its password in `KEYSTORE-PASSWORD.txt` in the same folder |
| Course outline (scanned PDF) | `D:\Fall 2026\Compiler\CC Course Outline.pdf` |
| Original Lectures 1–3 pages | `Compiler_Construction_Lectures_1_2_3*.html` in the main folder. The live copy is `site/lectures-1-3.html`. |
| Course-building prompt | `site/docs/MASTER-PROMPT.md` |
| Handover docs | `site/START-HERE.md`, `site/docs/HANDOFF.md` (this file), `site/docs/handover/` |
| Old chat transcript (private, not in git) | `D:\Fall 2026\Compiler\_HANDOVER\chat-transcript-compiler-course.zip` |
| Progress checklist | `site/docs/PROGRESS.md` |
| Portfolio (Next.js) | https://github.com/tahir8203/Portfolio. Course card in `lib/data.ts` (`teaching` array), screenshot `public/shots/cc.jpg` (1440×900), blurb in `app/page.tsx` `DESCRIPTIONS`. PR #9 merged. |

Sister courses built the same way:
- Applications of ICT: `D:\Fall 2026\ICT\ict`, repo `tahir8203/Applications-of-ICT`. The engine was copied from this course.
- Mobile Application Development: repo `tahir8203/Mobile-Application-Development`.

## 2. Instructor details (use exactly these)

**Muhammad Tahir Mehmood**, with these titles:
- MPhil Computer Science
- Lecturer, University of Central Punjab, Okara
- Headmaster, GES 53/2-L Okara
- Assistant Director (P&D), DEA Okara
- 10+ years teaching Computer Science

The photo is `site/assets/instructor.jpg` (taken from the Lectures 1–3 page). The details appear on the instructor card (Home page) and in the footer.

Git commit identity: `Muhammad Tahir Mehmood <33110016+tahir8203@users.noreply.github.com>`. It is set locally in the repo.

## 3. Course facts (from the official outline)

- **Programme:** BS Computer Science
- **Load:** 3 credit hours, 17 weeks. Mid Term in Week 9, Final Term in Week 17.
- **Books:**
  - Louden, *Compiler Construction – Principles and Practice*
  - Cooper & Torczon, *Engineering a Compiler*
  - Reference: the Dragon Book (Aho, Lam, Sethi, Ullman)
- **Sessions:** 30 teaching sessions (2 per week), plus a Midterm unit (id 90, week 9) and a Final unit (id 99, week 17).
- **Topics:**
  - Compiler phases and tools
  - Lexical analysis: regular expressions, NFA/DFA, Thompson's construction, subset construction, transition diagrams, lexer generators, input buffering
  - Symbol tables and scopes
  - Context-free grammars: derivations, ambiguity, left recursion and left factoring
  - Parsing: recursive descent, FIRST/FOLLOW, LL(1) table and parse, error recovery
  - Syntax-directed definitions (SDD) and translation schemes (SDT): annotated parse trees, dependency graphs
  - Type checking
  - Intermediate code: three-address code (TAC), quadruples and triples, control flow, short-circuit code, backpatching, switch
- **Assessments by session:**

  | Session | Assessment |
  |---|---|
  | 4 | Assignment-1 |
  | 6 | Quiz-1 |
  | 10 | Quiz-2 |
  | 14 | Assignment-2 |
  | 20 | Quiz-3 |
  | 22 | Assignment-3 |
  | 26 | Quiz-4 |
  | 30 | Assignment-4 |
  | 90 | Mid-Term mock |
  | 99 | Final mock |

- No official marks or weightage are invented anywhere.
- The outline's Week 4 line "Ampere's Law" is a copy-paste slip. It is flagged on the Outline page and not taught.

## 4. Website: how it is built

The site is static, with no build step. Open `index.html` directly or serve the folder.

```
site/
  index.html                 shell + window.COURSE (intro, objectives, outcomes, books, refs, policies); scripts use ?v=N
  lectures-1-3.html          original Lectures 1–3 page (Bootstrap/Chart.js/highlight.js from CDNs)
  assets/app.js              hash router, study view, presentation engine, Watch mode, assessments, flashcards, glossary, revision, progress
  assets/styles.css          design system, presentation + animation styles, responsive rules
  assets/demos.js            window.ICTDemos {mount, list}: 72 animations (builders: flow, trace, tokens, tree, graph/automaton+tape, codewalk, tape/buffer)
  assets/tools.js            window.CCTools: tokenizer, FIRST/FOLLOW + LL(1) builder + parse trace, expression → AST/postfix/TAC/quadruples
  assets/sessions/part1-4.js course content as data (pushes into window.COURSE.sessions)
  assets/instructor.jpg      instructor photo
  android/                   Android app (see section 5)
  .github/workflows/android.yml  cloud APK build (runs only on tags app-v*; currently blocked by GitHub billing)
  .vercelignore              keeps android/ and .github/ off the website
  docs/MASTER-PROMPT.md, docs/PROGRESS.md, README.md
```

**Session data fields:**
- id, week, unit, ic, lo, book, title, sub, intro
- obj, `bloom{head, heart, hand}`
- `slides[{k, h, p, ic, pts, cmp, code, demo, ex, psy, tk, n}]`
- `lab{t, steps, out}`, disc, mistakes, rev, hw, quiz, terms
- assess, plus `assessment{kind, title, covers, instructions, scenario, tasks, submission, reflection, example, mcq, tf, short, app, note}`

**Routes:**

| Page | Route |
|---|---|
| Home | `#/` |
| Sessions list | `#/sessions` |
| One session | `#/s/<id>` |
| Present (slide `<n>`) | `#/p/<id>/<n>` |
| Watch | `#/w/<id>` |
| Other pages | `#/tools`, `#/assess`, `#/revision`, `#/flash`, `#/glossary`, `#/outline`, `#/bookmarks` |

localStorage keys are `cc-course-v1` (progress) and `cc-theme`.

**Presentation keys:**

| Key | Action |
|---|---|
| → / Space | Next slide |
| ← | Previous slide |
| W | Watch mode |
| F | Fullscreen |
| N | Notes |
| O | Overview |
| S / P / R | Step, play, reset the animation |
| L | Light/dark theme |
| Esc | Exit |

Swiping changes slides on touch screens.

**Rules when editing:**
1. Edit content in `assets/sessions/*.js`.
2. After any asset change, bump `?v=N` on every script and stylesheet in `index.html`. It is now **v=11**. Bump `VERSION` in `sw.js` to the same number.
3. Commit and push to `main`. Vercel deploys within about a minute.
4. Keep Bloom's Taxonomy Head/Heart/Hand outcomes on every session.

**Slide fit fix (done 2026-11-12):** tall slides used to be cut off at the top and bottom. They now shrink to fit (`fitSlide()` in app.js, minimum zoom 0.6), or scroll. Animation SVGs auto-expand their viewBox. All 870 slides were checked at 1280×720.

## 4b. Portal 2.0 (added 2026-11-12, built with Fable 5.2)

The site is now a student portal with an app feel. New files: `assets/portal.js`, `assets/portal.css`, `assets/portal-data.js`, `manifest.webmanifest`, `sw.js`, `assets/icons/`.

- `portal.js` loads before `app.js` and registers `window.CCPortal` (routes `''` home, `practice`, `pipeline`, `sheets`, `me`, plus hooks `afterRoute`, `onDone`, `onQuiz`, `onAssess`, `onPres`, `reset`). `app.js` exposes its internals as `window.CCApp`.
- **Home** is a dashboard: greeting, progress ring, XP level, streak, quick tiles, up-next sessions, question of the day, coming assessments, roadmap.
- **Shell:** bottom tab bar under 900px (Home, Learn, Practice, Tools, Me), back button and page title in the top bar, search overlay (Ctrl+K), toasts, confetti.
- **Practice** `#/practice[/quick|mid|final|ff|tok|tac]`, **Pipeline visualizer** `#/pipeline`, **Resources** `#/sheets[/viva|today|toolbox]`, **Profile** `#/me`.
- Portal state (name, roll no, semester start, XP, streak days, notes, best scores) is in localStorage `cc-portal-v1`. Course progress stays in `cc-course-v1`.
- The service worker only registers on the https website, not inside the Android app.
- **Android 2.0.0 bridge** (`window.AndroidApp`): `print`, `haptic(ms)`, `setTheme(light)`, `keepAwake(on)`, `orient('landscape'|'auto')`, `share(text)`. Splash screen is `res/drawable/splash.xml`. The back button closes an open sheet or search first.
- Bug fixed: the back button did not close a presentation in 1.0.0 (key handler crashed on a synthetic Escape). Fixed in `app.js`.

## 5. Android app

- **What it is:** a native Android app (Java, package `com.tahir.compilerconstruction`) that bundles the whole website inside the APK and works offline.
- **How it serves the site:** a WebView with `WebViewAssetLoader` serves the bundled site from `https://appassets.androidplatform.net/assets/site/index.html`, so progress is kept in localStorage.
- **Phone behaviour:**
  - The back button closes the overview, then the presentation, then goes back through pages, then exits.
  - Fullscreen hides the system bars.
  - `window.print()` opens Android printing (Save as PDF).
  - External links open in the phone's browser.
  - The website's "📱 Android app (APK)" button is hidden inside the app, which checks for `window.AndroidApp`.
- **Version:** 2.0.0 (versionCode 2) built 2026-11-12; published as GitHub release `app-v2.0.0` (the website button serves it). minSdk 23 (Android 6), targetSdk 34, compileSdk 36. AGP 9.1.0, Gradle 9.3.1, `androidx.webkit:webkit:1.12.1`.
- **Signing:** PKCS12 key with alias `cc-course`. Certificate SHA-256 `4958be8c…a959` (CN=Muhammad Tahir Mehmood). **Every update must use this same key**, or phones refuse the update.
- **Icon:** a blue-cyan gradient tile with "CC". The PNGs are in `res/mipmap-*`; the adaptive icon is in `mipmap-anydpi-v26`.
- **Build on this PC:** it reuses the toolchain from the DEA app: `C:\dev\jdk21`, `C:\dev\android-sdk` (build-tools 36.0.0, platforms 34–36), and Gradle 9.3.1 from `%USERPROFILE%\.gradle\wrapper\dists`.

  Run this in Git Bash from `D:\Fall 2026\Compiler\site`. The arguments are the version name and the version code; the code must increase each release.
  ```bash
  bash android/build-local.sh 2.0.1 3
  ```
  The script does the following:
  1. Mirrors the project to `C:\dev\cc_build`, because Gradle fails on paths with spaces.
  2. Copies the site into the app's assets.
  3. Downloads local copies of Bootstrap, Chart.js, highlight.js and bootstrap-icons for the Lectures 1–3 page.
  4. Signs the APK with the key and writes `D:\Fall 2026\Compiler\CompilerConstruction.apk`.
- **Check an APK** (PowerShell):
  ```powershell
  $env:JAVA_HOME='C:\dev\jdk21'; & C:\dev\android-sdk\build-tools\36.0.0\apksigner.bat verify --print-certs "D:\Fall 2026\Compiler\CompilerConstruction.apk"
  ```
- **Publish a new version:**
  ```bash
  gh release create app-v1.0.1 "D:/Fall 2026/Compiler/CompilerConstruction.apk" -R tahir8203/Compiler-Construction --title "Compiler Construction app 1.0.1" --notes "..."
  ```
  The website button always points to the latest release.
- **GitHub Actions:** the cloud build in `.github/workflows/android.yml` is set up. The repo secrets `KEYSTORE_B64` and `KEYSTORE_PASSWORD` are set. It is **blocked because the GitHub account is locked for billing** (as of 2026-11-12), so use the local build.

## 6. Problems already solved (don't repeat them)

- **Scanned outline PDF:** text extraction fails, so read it as page images.
- **Slides cut off at the top and bottom:** fixed with safe centring, `fitSlide()`, the title layout change, and SVG viewBox auto-fit.
- **Phone horizontal overflow:** fixed with `min-width:0` guards, `overflow-x:clip`, and `#fs{max-width:100%}`.
- **Browsers showing old files:** solved by the `?v=N` cache-busting tags.
- **DAG demo crash:** caused by extra `line.tre` elements without a data-id. Fixed with guards.
- **Android build errors:**
  - `sdk.dir` must use forward slashes (`C:/dev/android-sdk`).
  - The method name `setImmersive` clashes with Android's own method, so it is renamed `setFullScreenBars`.
  - AGP 8.x cannot run on the cached Gradle 9, so the project uses AGP 9.1.0.
- **Approvals:** merging portfolio PRs, publishing releases and setting GitHub secrets each need the instructor's explicit OK.

## 7. Still open

- [ ] Install the APK on a real phone and test: a session, a presentation with swipe and back, Watch mode, lab tools, a quiz, and Lectures 1–3.
- [ ] Fix GitHub billing if cloud builds are wanted (optional; the local build works).
- [ ] Optional: add an "Android app" mention to the portfolio card for this course.
- [ ] Optional: delete the leftover folder `D:\Android-build-tools` (about 70 MB of incomplete downloads from an earlier attempt).

## 8. Ready-made prompt for a new chat

> Read `D:\Fall 2026\Compiler\HANDOFF.md`. It describes my Compiler Construction course website (repo `D:\Fall 2026\Compiler\site`, live on Vercel) and its Android app. Keep the same engine, instructor details and Bloom's Taxonomy format. After changes: bump `?v=N` in index.html, commit, push to main (Vercel auto-deploys), rebuild the APK with `bash android/build-local.sh <version> <code>` if the app needs updating, and ask me before publishing a release or merging portfolio PRs. My request: …
