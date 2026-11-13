# START HERE

This repository holds the **complete Compiler Construction course**: the student web portal and its Android app. Everything needed to continue the work is in this repo, so a new person or a new Claude account can start from here.

- **Live portal:** https://compiler-construction-phi.vercel.app/
- **Android app (latest APK):** https://github.com/tahir8203/Compiler-Construction/releases/latest/download/CompilerConstruction.apk
- **Instructor:** Muhammad Tahir Mehmood

## Read these, in this order

| # | File | What it gives you |
|---|---|---|
| 1 | `START-HERE.md` (this file) | How to start and what to paste into Claude |
| 2 | [`docs/HANDOFF.md`](docs/HANDOFF.md) | The full technical handoff: locations, how the site and app work, how to build and publish, problems already solved, open items |
| 3 | [`docs/handover/CHAT-SUMMARY.md`](docs/handover/CHAT-SUMMARY.md) | Every request made so far and what was delivered |
| 4 | [`docs/handover/COURSE-WORKFLOW.md`](docs/handover/COURSE-WORKFLOW.md) | How all the instructor's course sites are built and shipped. Save it to Claude's memory. |
| 5 | [`docs/MASTER-PROMPT.md`](docs/MASTER-PROMPT.md) | The prompt the course was built from |
| 6 | [`docs/PROGRESS.md`](docs/PROGRESS.md) | What is built and tested |
| 7 | [`README.md`](README.md) | Site structure, presentation keys, portal features, Android build |
| — | [`docs/CC-Course-Outline.pdf`](docs/CC-Course-Outline.pdf) | The official course outline (scanned) |

## Starting with a new Claude account

1. Get the code:
   - **On the instructor's laptop:** it is already at `D:\Fall 2026\Compiler\site`.
   - **On another computer:** clone it:
     ```bash
     git clone https://github.com/tahir8203/Compiler-Construction.git
     ```
2. Open Claude Code with that folder and paste:

> I am continuing the Compiler Construction course portal and Android app. Read `START-HERE.md`, then `docs/HANDOFF.md`, `docs/handover/CHAT-SUMMARY.md` and `docs/handover/COURSE-WORKFLOW.md` (save the last one to your memory). Keep the same engine, instructor details, Bloom's Taxonomy format and portal design. Ask me before publishing releases, merging portfolio PRs or setting GitHub secrets. After reading, tell me in a few lines what you understood, then wait for my request.

3. **Deploying the website:** Vercel deploys automatically on every push to `main`. To inspect deployments from Claude, connect the Vercel connector in the new account.
4. **Building the Android app:** needs Java 21 and the Android SDK. On the instructor's laptop these are already in `C:\dev`. Run:
   ```bash
   bash android/build-local.sh <version> <code>
   ```

## What is deliberately NOT in this repo

- **The app signing key** (`cc-course-release.p12`) **and its password.** They are kept privately by the instructor, in `D:\Fall 2026\Compiler\android-signing` and in the backup zip. Every app update must be signed with this same key, or phones refuse to install it over the current version. Never commit them.
- **The full chat transcript** of the original Claude conversation. It contains personal account details, so it stays private on the instructor's laptop (`D:\Fall 2026\Compiler\_HANDOVER\chat-transcript-compiler-course.zip`). `docs/handover/CHAT-SUMMARY.md` covers its content.
