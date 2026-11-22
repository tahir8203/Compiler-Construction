# Lecture rewrite: house style (Compiler Construction, BS CS)

Audience: beginner students who get bored or lost easily, and a teacher who is new to this course. Teach both.
Model lecture: Session 1 in `assets/sessions/part1.js`. Copy its shape, tone and level of detail exactly.

## What you produce
For each lecture id N you were given:
- `lectures/sNN.js` (two-digit N, e.g. `s07.js`, `s90.js`): ONE JavaScript object literal for the whole session, same shape as `s01.js`. No `COURSE.sessions.push`, no trailing comma needed.
- Optional `lectures/terms-sNN.js`: a JavaScript ARRAY of new dictionary rows for technical terms that `assets/terms.js` does not already have:
  `[['Term','other spellings|separated|by bars','meaning in one line','why it exists (the problem it solves)','real-life analogy'], …]`
  Check `assets/terms.js` first (search for the word and its plural). Never duplicate a term or an alias that exists there.
- Run `node check.js N …` in the scratchpad folder until it prints "All checks passed." Warnings are advice; errors must be fixed.
- Do NOT edit anything in `D:\Fall 2026\Compiler\site`. Read it only.

## Where the original lecture is
`D:\Fall 2026\Compiler\site\assets\sessions\part1.js … part4.js`, each session starts with `{ id:N,`. Read the whole original first.
Keep: `id, week, unit, ic, lo, book, assess, label, short, exam` exactly. Keep `assessment` exactly unless it contains a factual error (then fix it and report it). Keep `bloom` (you may simplify wording). Keep the lab (you may rewrite it), `disc`, `mistakes`, `rev`, `hw`.

## The deck (built automatically from your data, max 25 slides)
title · why-this-matters (`introH`, `intro`, `introAn`, `introN`) · objectives · YOUR CONTENT SLIDES · try it yourself (`lab`) · lab animation (if `lab.demo`) · recap (`rev` + `mistakes`) · check slide (`check`, exactly 3 questions) · glossary (automatic) · assessment summary (if `assessment`) · end (+ `hw`).
Content budget = 25 − fixed slides; `check.js` prints it. Usually 14–16 content slides. Merge or cut to fit; never exceed.

## Hard rules for every content slide
1. ONE idea per slide. Short sentences. Simple English (B1 level). No walls of text: `p` ≤ 330 characters, at most 5 `pts`, at most 3 content blocks (p / pts / cmp / code / ex / img / demo).
2. Explain every technical term the FIRST time it appears, BEFORE it is used on later slides: plain meaning in the sentence itself (e.g. “a <b>lexeme</b> (the actual characters, like <code>count</code>)”). Every term must also exist in the dictionary (`assets/terms.js` or your `terms-sNN.js`) with meaning, why, analogy, because the engine underlines it and shows that card on hover AND tap. Do not use `<span class="def">`.
3. Each slide builds on the previous one. Order: motivation → definition → example → algorithm/steps → worked example → pitfalls.
4. `an`: a real-life analogy on every slide (except pure Animation/Diagram slides, where it is still welcome). Everyday Pakistani-student-friendly examples are good (phone book, cricket scorer, recipe, queue at a bank, Urdu↔English translation).
5. `tk`: a one-line takeaway on every slide.
6. `n`: speaker notes on EVERY slide as an object `{say, ask, ans, watch}`:
   - `say`: what the teacher says or does, in simple words (include board work or a demo command where useful). Assume the teacher is learning this too: explain the idea fully here.
   - `ask` + `ans`: a likely student question and its correct answer.
   - `watch`: a common confusion or mistake to watch for.
   Also give `introN`, and `lab.n` in the same format.
7. Real program demos with real input and the real output of each phase where the topic allows (tokens of `int x = 5 + 3;`, its parse tree, its three-address code…). All outputs must be CORRECT; work them out carefully.
8. Use the existing animations (`demo:'id'`, list below). The interactive live pipeline is `demo:'livepipe', full:true, input:'y = a + b * 2;'` (input: one assignment `id = expression;`, optional leading `int`/`float`; operators + - * / unary minus and brackets). Use it where it helps (e.g. phases, tokens, trees, three-address code), not everywhere.
9. `check`: exactly 3 new check-your-understanding questions `{q, o:[4 options], a:index, e:explanation}`, testing understanding, not recall of trivia. Keep `quiz` (≥5 questions; fix wrong ones, you may add).
10. Fix any factual errors in the original. Keep a list of every correction (what was wrong → what is right) for your final report.
11. HTML inside strings: `<b>`, `<i>`, `<code>`, `&lt;` `&gt;` in code. Code blocks (`code:`) are pre-formatted text inside backtick template strings and must be HTML-escaped (`&lt;` for <, `&amp;` for &). Escape `'` inside single-quoted strings or use ’.
12. British spelling is fine; keep the existing tone: friendly, direct, no hype, no emoji overload (one icon per bullet as in s01).

## Existing animations (demo ids)
translate compint lps pipeline frontback analysisSynthesis symflow errorsPhases lexrole tokenize tpl buffer regex reops lexerr dfarun nfa thompson subset relop idtd kwid lexgen handscan tablescan scancompare symtab scopes parserrole derive parsetree ambig danglingelse leftrec leftfact noncf backtrack recdesc rdcode first follow ll1table ll1trace ll1conflict panic errstrat sddtree attrkinds inherit depgraph slattr postfixsdt sdtinside typecheck typeexp irforms dag tac quads tactypes exprtrans arrayref ifelse whiletr shortcircuit boolcode redundant backpatch bpfuncs switchtr labrace midreview finalreview livepipe
Keep the demos the original lecture used unless a slide is cut; you may add more where they fit.

## Your final report (short)
Per lecture: deck size, what changed (2–4 lines), the list of factual corrections, new dictionary terms added, anything the teacher should confirm.
