# Lecture upgrade (November 2026): what changed and what to confirm

All 32 units (30 sessions, the Midterm unit 90 and the Final unit 99) were rewritten for beginners.
Rollback point: git tag `checkpoint-before-lecture-upgrade`.

## What every lecture now has
- **At most 25 slides**, always in this order: title · why this matters · objectives · content (one idea per slide) · try it yourself · recap (remember / watch out) · check your understanding (3 questions on one slide) · glossary · assessment summary (if any) · end with homework.
- **Every technical term explained.** `assets/terms.js` holds 350+ terms, each with a plain meaning, why it exists and a real-life analogy. The first use of a term on a slide is underlined (dotted); hover with a mouse or **tap** on a phone to open its card. The glossary slide lists the words that are new in that lecture.
- **A real-life analogy and a takeaway on every content slide.**
- **Speaker notes on every slide** (press N in the slides; in the study view open “Teacher notes” under each slide): what to say, a likely student question with the answer, and a common confusion to watch for.
- **Live compiler pipeline** (`assets/live.js`): type a statement such as `int x = 5 + 3;` and step through lexer → parser (tree) → semantic analysis (symbol table, types, int → float conversions) → three-address code → optimiser → code generator → output. Used in Sessions 1, 9, 13, 14, 20, 24, 26, 27 and the Midterm unit.
- **Phones:** slides keep large text and scroll vertically; no sideways scrolling. Swipe left/right to change slides.
- The full quiz (5+ questions per lecture), Bloom outcomes, assessments, discussion questions and the lab are still in the study view.

## Corrections made to the original content
**S1** Lab: Python reports a *syntax* error before running anything (it compiles the whole file to bytecode first); only *run-time* errors such as NameError appear when reached. · Android ART compiles partly ahead of time and partly with a JIT. · “One byte per opcode” clarified: the operation code fits in one byte; operands take extra bytes.
**S2** Optimisation also happens after code generation in real compilers. · Relocation is mostly done by the linker; the loader does the rest. · Lab: `printf("hi\n")` may become `puts`, so the lab uses `printf("%d\n", …)`. · The undefined-reference demo uses a declared but undefined function (a misspelt call is a compile error in recent gcc).
**S3** `E = M * C ** 2` is labelled as Fortran (`**` is not a C operator). · Rule order stated: longest match first, rule priority only breaks ties.
**S4** The token table was missing `>` (GT) and `>=` (GE). · A literal dot must be written `\.` in programming regex.
**S5** Thompson NFA: “at most two arrows *leaving* any state”; the single accepting state has none.
**S6** The Fortran lookahead rule needs `{letter}` at the end: `IF / \( .* \) {letter}`. · The Flex lab now prints tokens (`%option noyywrap` and a student `main`). · In the book’s relop diagram `=` and `<>` are Pascal-style; C uses `==` and `!=`.
**S7** GCC and Clang load keywords into their identifier hash table (not a gperf perfect hash); PostgreSQL is the perfect-hash example. · `retract()` must not step back over a newline.
**S8** Flex is always table-driven (`-f` only keeps full tables); re2c emits goto code. · The “Ampère’s Law” slip is now a teacher note only.
**S9** A misspelt identifier is a valid identifier, reported later as *undeclared* (semantic), not a lexical error. · Inserting names in the lexer is one design; many compilers do it in the parser or semantic phase.
**S10** None needed (Quiz-2 checked).
**S11** The indirect left-recursion algorithm is guaranteed only with no cycles (A ⇒⁺ A) and no ε-productions.
**S12** GCC moved to hand-written recursive descent for C++ in GCC 3.4 (2004) and for C in GCC 4.1 (2006). · ANTLR 4 uses ALL(*); LL(*) was ANTLR 3.
**S13** `while (look.type != '}') stmt();` now also stops at end of file, so a missing `}` is reported instead of looping.
**S14** Calculator uses int (Java `double` would print 14.0); `error()` throws so an undeclared name cannot crash; the `^` lab grammar keeps unary minus.
**S15** Minor wording in example 3 (FOLLOW(S) sources).
**S16** “Recursive descent and table-driven recognise exactly the LL(1) languages” is true only for predictive recursive descent with one token of lookahead. · ANTLR 4 uses ALL(*).
**S17** The table builder overwrote a conflicting cell (the dangling else silently got the wrong rule); cells now hold lists and the choice is explicit. · FOLLOW code used an undefined `start`. · The driver now checks that the input ends at `$`.
**S18** The error production `if expr stmt` clashes with the real rule in an LL(1) table; explained. · “gcc limits to 20 errors” → clang stops after 20 by default; gcc has `-fmax-errors=N`.
**S19** Phrase-level routine: “insert id into the input”, not “push id”. · Recursive-descent recovery now re-parses F when skipping stops at a token that can start F. · Why recovery cannot loop: every step pops or skips. · Routine e3 for M[E, )] applies only when E is the start symbol.
**S20** No errors; `b` renamed `B` in the binary-number grammar.
**S21** The associativity example now uses subtraction (9 − 5 − 2 = 2, not 6); 3 * 5 * 2 proved nothing. · Lab: L → L , id cannot be coded directly in recursive descent; use a loop.
**S22** “Testing for cycles is expensive” made precise (exponential in general).
**S23** F → digit needs no action in the LR-stack SDT; F → ( E ) added. · The infix-to-prefix SDT (sdtinside animation) cannot run during parsing; it needs the parse tree first.
**S24** Narrowing: Java needs a cast, C narrows silently (at most a warning). · C compares typedefs, arrays and pointers structurally, but separately declared structs are different types. · Pascal is *mostly* name equivalence. · An `if` condition need not be boolean in C. · Strong/weak typing is a scale.
**S25** On the LL stack, action records sit just *above* the non-terminal (popped first). · widen() is applied to both operands.
**S26** “Quads are the most common” → quadruple-like instructions, often in SSA form.
**S27** Java has arrays of arrays, not one row-major block.
**S28** The nested while/if example now follows the Session 27 rules exactly (`t4 = a[t3]; m = t4`). · The `p->x` example loads the field only after the NULL test.
**S29** An ambiguous quiz question about `!` was replaced. · Only one of the three removed gotos jumps to the next line; the other two merge into one `ifFalse`. · “fall for both B.true and B.false” is wrong only when the exits differ.
**S30** {103, 105} is patched with 107 only if another statement follows.
**Units 90 and 99** No errors; all model answers re-checked.

## Please confirm
1. **Assignment 4 sample output (Session 30):** it shows `ifFalse i < n goto 109`. With ordinary three-address code the loop exit is about 111–113. Left unchanged; decide whether to change 109.
2. **Session 2 lab:** what `nm` prints on the lab PCs (MinGW may show `_printf` or `__mingw_printf`).
3. **Session 4:** should `.5` and `5.` count as numbers? The lecture rejects them (as before); the lab notes give a version that accepts them.
4. **Session 14:** integer arithmetic with integer division (7 / 2 = 3) in the calculator.
5. **Sessions 21–23** use E → T E′ with subtraction as the running example; Assignment 3 task 4 has the same structure with different numbers.
6. **Session 23:** the while-loop SDT keeps its final `goto L1`, which the Dragon book figure omits.
7. **Session 8:** the table sizes (300 states × 256 = 76,800 cells) are illustrative, not measured.
8. Real compiler messages quoted in notes (gcc, clang, javac) should be checked on the lab compilers.
9. **The live pipeline** assumes names that are not declared in the typed line are `int` (a real compiler would report “undeclared”). The notes say so.

## Files
- `assets/sessions/part1–4.js`: lecture content (same structure as before; new fields `introH`, `introAn`, `introN`, `check`, `an` on slides, notes as `{say, ask, ans, watch}`, `lab.n`).
- `assets/terms.js`: the term dictionary and the hover/tap engine.
- `assets/live.js`: the live compiler pipeline (registered as the animation `livepipe`; slide fields `demo:'livepipe', full:true, input:'y = a + b * 2;'`).
- `assets/app.js`: deck builder (max 25 slides), check/glossary slide types, notes, analogy boxes.
- `docs/LECTURE-STYLE.md`: the house style used for the rewrite; follow it when adding or changing a lecture.

## Second pass (late November 2026): "explain it simply"
At the teacher's request every lecture was re-worked in the format he wrote for the gcc commands in Session 2: **Meaning of each part → What happens here? → Example with real output → Result**, plus “Important points for your exam” tables. The 25-slide cap was removed; no content was deleted. Decks went from 20–25 slides to 23–43.

Corrections made in this pass
- **S10** quiz: “id * T” is not a sentential form of the E–T–F grammar (after * there is always F); the option is now “id * F”.
- **S12** “E → E + E | id: some token always leads to two trees” → “both start with id; id + id + id has two trees”.
- **S6** a lookahead pattern written with spaces (`IF / \( .* \) {letter}`) must be written without blanks in a real .l file: `IF/\(.*\){letter}`.
- **S25** takeaway said “six instructions and three labels” for the while loop; it has five instructions.

Please confirm (second pass)
1. gcc/javac/javap message wording and column numbers quoted in S1, S2, S4, S6, S9 and S25 were written from typical output (no compiler on the build PC); the notes say wording varies by version.
2. **S27** new slide: array address formulas with lower bounds (e.g. A[1..10][1..15]); delete if not wanted.
3. **S19** the practice trace `id + )` teaches one more case (“stack is $ but input remains: report and skip”), previously only in lab notes.
4. **S24** the strict MiniC/Java rules (`i = x` and `if (i)` are errors) are marked as differing from C.
5. **S14** the error table calls “undeclared variable” a meaning (semantic) error.
6. **S90** the target-code example uses the Dragon book’s LDF/MULF/ADDF/STF machine.
7. Sizes in S9 and S24 (char 1, int 4, double 8, pointers 8) are typical 64-bit values.
