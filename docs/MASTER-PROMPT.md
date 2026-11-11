# MASTER PROMPT — Compiler Construction Animated Course

## Role
Act as a senior front-end engineer, compiler-construction instructor, instructional designer and animation specialist. Build — do not just plan — a complete, animated, projector-ready HTML course website for my university course **Compiler Construction**, BS Computer Science, 3 credit hours, 17 weeks (16 teaching weeks with the Mid Term in Week 9 and the Final Term in Week 17), two 90-minute sessions per teaching week. Instructor: Muhammad Tahir Mehmood.

## Source of truth
The official course outline (`CC Course Outline.pdf`). Every topic in its Calendar of Activities must be covered, in its week, with its listed activity:

| Week | Contents | Activity |
|---|---|---|
| 1 | Introduction, interpreters vs compilers, organization, role of language translation, basic concepts, context of a compiler (pre-processor, assembler, loader, link editor), phases, translation phases, front end & back end | |
| 2 | Lexical analysis: role of the lexer, specification of tokens, patterns & lexemes, recognition of tokens, input buffering, recognizing complex words, lexical errors, regular expressions (strings, numbers, others) | Assignment-1 |
| 3 | Finite automata, regular expression → automata, design of a lexical-analyzer generator, transition diagrams, reserved words & identifiers | Quiz-1 |
| 4 | Implementing scanners: hand-coded vs automatically generated vs table-driven | |
| 5 | Scanners & symbol table; syntax analysis, role of the parser, CFGs, writing a grammar, ambiguity, eliminating ambiguity, left recursion, left factoring, non-context-free constructs | Quiz-2 |
| 6 | Top-down parsing, predictive parsing | |
| 7 | Recursive-descent parsing & implementation | Assignment-2 |
| 8 | Predictive parsing, LL(1) parsing & implementation | |
| 9 | **MID TERM** | |
| 10 | LL(1) parsing & implementation, error finding & recovery | |
| 11 | Error recovery, semantic analysis, syntax-directed definitions, attributes & attribute grammars, attribute computation | Quiz-3 |
| 12 | Inherited & synthesized attributes, evaluation orders, S-attributed & L-attributed definitions, dependency graph | Assignment-3 |
| 13 | SDT schemes, postfix translation schemes, actions inside productions, type checking & scope | |
| 14 | Type checking & scope, implementing L-attributed SDDs, intermediate code generation, three-address code | Quiz-4 |
| 15 | Translation of expressions, control flow, Boolean expressions, short-circuit code | |
| 16 | Control-flow translation of Boolean expressions, avoiding redundant code, backpatching, switch-statement translation | Assignment-4 |
| 17 | **FINAL TERM** | |

Reference books: *Compiler Construction — Principles and Practice* (Kenneth C. Louden) and *Engineering a Compiler* (Keith D. Cooper & Linda Torczon). The Dragon Book (Aho, Lam, Sethi, Ullman) may be cited for standard notation.

Note: the Week 4 row of the scanned outline also says "Ampere's Law and Its Applications". That is a copy-paste slip from a physics outline and is **not** compiler content; flag it on the outline page, do not teach it.

## Step 1 — Inspect before building
1. Reuse the proven architecture of my previous course sites (Mobile Application Development, Applications of ICT): static site, no build step, content stored as data in `assets/sessions/*.js`, UI in `assets/app.js`, animations in `assets/demos.js`, deployed on Vercel from GitHub.
2. Keep my earlier Lectures 1–3 page (with Bloom's Taxonomy) and link to it.
3. Write the full 32-unit content map (title, objectives, Bloom outcomes, slide list, demo, quiz, activity) **before** UI code.

## Step 2 — Content rules (accuracy first)
- Audience: BS Computer Science students. Clear English, every term defined the first time, running examples in C-like code (e.g. `position = initial + rate * 60`).
- Each session: introduction, learning objectives, **Bloom's Taxonomy outcomes in three domains — Head (cognitive), Heart (affective), Hand (psychomotor)**, 10–14 slides, code examples, worked examples, one or more step-by-step animations, common mistakes, a hands-on lab task, discussion questions, summary, a 5-question knowledge check with explanations, homework and key terms.
- Algorithms (Thompson's construction, subset construction, FIRST/FOLLOW, LL(1) table, LL(1) parsing, panic-mode recovery, SDD evaluation, three-address code, short-circuit code, backpatching) must be correct and worked by hand on small examples that students can verify.
- No invented marks or grading weightage.

## Step 3 — Presentation mode
ONE SCREEN = ONE CONCEPT. Full-screen, large type, progress bar, slide number, overview grid, presenter notes (**N**), **→/Space** next, **←** back, **Home/End**, **F** fullscreen, **Esc** exit, **O** overview, **W** Watch mode (auto-play like a video), swipe on phones, resume last slide.

## Step 4 — Educational animations & live tools
Animations explain an algorithm step by step (Play / Step / Reset, `prefers-reduced-motion`, phone-friendly): compiler pipeline on one statement, compiler vs interpreter, language-processing system, front/back end, tokenizing a statement, two-buffer input scheme, RE → NFA, NFA → DFA, DFA simulation, relop transition diagram, keyword vs identifier, hand-coded vs table-driven scanner, Lex workflow, symbol table hashing and scopes, derivations and parse trees, ambiguity, left recursion, left factoring, backtracking, recursive descent, FIRST/FOLLOW, LL(1) table, LL(1) trace, panic-mode recovery, annotated parse tree, dependency graph, inherited attributes, postfix SDT, type checking, three-address code, quadruples/triples, short-circuit code, backpatching, switch translation.

Live lab tools page: a tokenizer, a FIRST/FOLLOW/LL(1) table builder with a parse trace, and an expression → AST / postfix / three-address-code translator.

## Step 5 — Course features
Home dashboard with 17-week roadmap, session library with search and filters, study view, presentation view, Watch mode, assessments (Quizzes 1–4, Assignments 1–4, Midterm and Final mock exams with model answers), revision dashboard, flashcards, glossary, bookmarks, progress (localStorage), light/dark theme, print handouts, instructor card.

## Step 6 — Quality bar
Responsive at 1920×1080, 1366×768, 768×1024, 390×844 and 360×800 with no horizontal overflow. Keyboard accessible, no console errors, no placeholder slides.

## Step 7 — Ship it
Keep `docs/PROGRESS.md` honest. Push to GitHub (`tahir8203/Compiler-Construction`), let Vercel deploy from `main`, verify the production URL and every unit, then update the Compiler Construction card on my portfolio (`tahir8203/Portfolio`, Teaching section) to point to the full course.
