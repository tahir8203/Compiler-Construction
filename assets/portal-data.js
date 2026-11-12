/* Portal content: cheat sheets, viva questions, modern-compiler notes, toolbox, practice banks. */
window.CCData = {
sheets: [
 {ic:'🏭', t:'Phases of a compiler', tag:'Sessions 1–2', b:`
  <div class="tblwrap"><table class="cal"><tr><th>Phase</th><th>Input → Output</th><th>Typical error caught</th></tr>
  <tr><td><b>Lexical analysis</b> (scanner)</td><td>characters → tokens</td><td>illegal character, malformed number, unterminated string</td></tr>
  <tr><td><b>Syntax analysis</b> (parser)</td><td>tokens → parse tree / AST</td><td>missing <code>;</code>, unbalanced parentheses</td></tr>
  <tr><td><b>Semantic analysis</b></td><td>AST → annotated AST</td><td>type mismatch, undeclared identifier</td></tr>
  <tr><td><b>Intermediate code generation</b></td><td>annotated AST → three-address code</td><td>—</td></tr>
  <tr><td><b>Code optimization</b></td><td>IR → faster / smaller IR</td><td>—</td></tr>
  <tr><td><b>Code generation</b></td><td>IR → target (assembly / machine) code</td><td>—</td></tr></table></div>
  <p>The <b>symbol table</b> and the <b>error handler</b> work with every phase. Phases 1–4 are the <b>front end</b> (depends on the source language); 5–6 are the <b>back end</b> (depends on the target machine).</p>
  <p><b>Language-processing system:</b> source → <i>preprocessor</i> → <i>compiler</i> → assembly → <i>assembler</i> → relocatable object code → <i>linker / loader</i> → executable in memory.</p>`},
 {ic:'🔤', t:'Token, lexeme, pattern', tag:'Session 3', b:`
  <ul><li><b>Token</b>: a category name (plus an optional attribute), e.g. <code>id</code>, <code>num</code>, <code>relop</code>.</li>
  <li><b>Lexeme</b>: the actual characters in the source that match, e.g. <code>count1</code>, <code>42</code>, <code>&lt;=</code>.</li>
  <li><b>Pattern</b>: the rule that describes the lexemes of a token, e.g. <i>letter (letter | digit)*</i>.</li></ul>
  <p><b>Longest match (maximal munch):</b> the scanner always takes the longest lexeme that matches, so <code>&lt;=</code> is one token, not <code>&lt;</code> then <code>=</code>. Ties are broken by the rule listed first (keywords before identifiers).</p>
  <p><b>Input buffering:</b> two buffer halves with <code>lexemeBegin</code> and <code>forward</code> pointers; a <b>sentinel</b> (eof) at the end of each half saves one test per character.</p>`},
 {ic:'✳️', t:'Regular expressions', tag:'Session 4', b:`
  <div class="tblwrap"><table class="cal"><tr><th>Form</th><th>Meaning</th></tr>
  <tr><td><code>r | s</code></td><td>union: r or s</td></tr><tr><td><code>r s</code></td><td>concatenation: r then s</td></tr>
  <tr><td><code>r*</code></td><td>Kleene closure: zero or more r</td></tr><tr><td><code>r+</code></td><td>one or more (= r r*)</td></tr>
  <tr><td><code>r?</code></td><td>zero or one (= r | ε)</td></tr><tr><td><code>[a-z]</code></td><td>character class</td></tr></table></div>
  <p><b>Precedence</b> (highest first): <code>*</code>, then concatenation, then <code>|</code>. All are left-associative.</p>
  <pre class="code">letter → [A-Za-z_]        digit → [0-9]
id     → letter (letter | digit)*
num    → digit+ (. digit+)? (E [+-]? digit+)?</pre>`},
 {ic:'🤖', t:'Thompson’s construction (RE → NFA)', tag:'Session 5', b:`
  <ul><li><b>ε</b> or a symbol <b>a</b>: start —ε/a→ final.</li>
  <li><b>r | s</b>: new start with ε-edges to both NFAs; both finals ε-edge to a new final.</li>
  <li><b>r s</b>: merge the final state of N(r) with the start state of N(s).</li>
  <li><b>r*</b>: new start and final; ε from new start to N(r) start and to new final; ε from N(r) final back to N(r) start and on to new final.</li></ul>
  <p><b>Properties:</b> exactly one start and one final state; no edge enters the start or leaves the final; at most 2 states per symbol/operator; each state has one symbol edge or at most two ε-edges.</p>`},
 {ic:'🔁', t:'Subset construction (NFA → DFA)', tag:'Sessions 5–8', b:`
  <pre class="code">ε-closure(T) = states reachable from T using ε-edges only
move(T, a)   = states reachable from T on one a-edge

Dstates = { ε-closure(s0) }            (unmarked)
while there is an unmarked T in Dstates:
    mark T
    for each input symbol a:
        U = ε-closure( move(T, a) )
        if U not in Dstates: add U (unmarked)
        Dtran[T, a] = U</pre>
  <p>A DFA state is <b>accepting</b> if it contains at least one accepting NFA state. Worst case: 2<sup>n</sup> DFA states, rare in practice. A DFA does one table lookup per character, which is why scanners use DFAs.</p>`},
 {ic:'📒', t:'Symbol table', tag:'Sessions 9, 24', b:`
  <ul><li>Stores each name with its <b>type, scope, storage location</b> and other attributes.</li>
  <li>Operations: <code>insert(name)</code>, <code>lookup(name)</code>, enter scope, exit scope.</li>
  <li>Usual implementation: a <b>hash table</b> per scope, chained to the enclosing scope (a stack of tables).</li>
  <li><b>Most-closely-nested rule:</b> a use of <code>x</code> refers to the declaration in the innermost enclosing scope that declares <code>x</code>.</li></ul>`},
 {ic:'🌳', t:'Grammars, derivations, ambiguity', tag:'Session 10', b:`
  <ul><li>CFG = (terminals, non-terminals, productions, start symbol).</li>
  <li><b>Leftmost derivation</b> replaces the leftmost non-terminal at each step; <b>rightmost</b> the rightmost.</li>
  <li>A grammar is <b>ambiguous</b> if some string has two parse trees (equivalently two leftmost derivations).</li>
  <li>Fix expression ambiguity with one non-terminal per precedence level:</li></ul>
  <pre class="code">E → E + T | T      (lowest precedence, left associative)
T → T * F | F
F → ( E ) | id     (highest precedence)</pre>
  <p><b>Dangling else:</b> match each <code>else</code> with the closest unmatched <code>then</code>.</p>`},
 {ic:'✂️', t:'Left recursion & left factoring', tag:'Session 11', b:`
  <p><b>Immediate left recursion</b> (top-down parsers loop forever on it):</p>
  <pre class="code">A → A α | β        becomes        A  → β A′
                                  A′ → α A′ | ε</pre>
  <p><b>Left factoring</b> (two alternatives start the same way, so one lookahead cannot choose):</p>
  <pre class="code">A → α β1 | α β2    becomes        A  → α A′
                                  A′ → β1 | β2</pre>
  <p>Example: <code>E → E + T | T</code> becomes <code>E → T E′</code>, <code>E′ → + T E′ | ε</code>.</p>`},
 {ic:'🥇', t:'FIRST and FOLLOW rules', tag:'Session 15', b:`
  <p><b>FIRST(X)</b></p><ol><li>X is a terminal: FIRST(X) = {X}.</li><li>X → ε is a production: add ε.</li>
  <li>X → Y1 Y2 … Yk: add FIRST(Y1) − {ε}; if Y1 can derive ε also add FIRST(Y2) − {ε}, and so on; if all Yi derive ε, add ε.</li></ol>
  <p><b>FOLLOW(A)</b></p><ol><li>Put <code>$</code> in FOLLOW(start symbol).</li>
  <li>For A → α B β: everything in FIRST(β) except ε goes into FOLLOW(B).</li>
  <li>For A → α B, or A → α B β where β can derive ε: everything in FOLLOW(A) goes into FOLLOW(B).</li></ol>
  <p>FOLLOW never contains ε. Repeat the rules until nothing changes.</p>`},
 {ic:'⬇️', t:'LL(1) table and predictive parsing', tag:'Sessions 16–17', b:`
  <p><b>Build the table.</b> For every production A → α:</p>
  <ol><li>For each terminal a in FIRST(α): put A → α in M[A, a].</li>
  <li>If ε is in FIRST(α): for each b in FOLLOW(A) (including $): put A → α in M[A, b].</li></ol>
  <p>A grammar is <b>LL(1)</b> exactly when no cell has two entries. For A → α | β this means: FIRST(α) ∩ FIRST(β) = ∅; at most one of them derives ε; and if β ⇒* ε then FIRST(α) ∩ FOLLOW(A) = ∅.</p>
  <pre class="code">push $ and the start symbol; a = first input token
repeat:  X = top of stack
  X is a terminal or $:  if X == a  pop, advance   else error
  X is a non-terminal:   if M[X, a] = X → Y1…Yk
                             pop X, push Yk … Y1 (Y1 on top)
                         else error
until X == $</pre>
  <p>LL(1) = scan <b>L</b>eft to right, <b>L</b>eftmost derivation, <b>1</b> token of lookahead.</p>`},
 {ic:'🚑', t:'Error recovery in parsers', tag:'Sessions 18–19', b:`
  <ul><li><b>Panic mode:</b> skip input until a <i>synchronizing token</i> (usually something in FOLLOW(A), such as <code>;</code> or <code>}</code>), pop A, continue. Simple and never loops.</li>
  <li><b>Phrase-level:</b> local fix — insert, delete or replace a token (e.g. insert the missing <code>;</code>).</li>
  <li><b>Error productions:</b> add grammar rules for common mistakes so the parser can give a precise message.</li>
  <li><b>Global correction:</b> find the smallest set of changes; too expensive in practice.</li></ul>`},
 {ic:'🏷️', t:'SDD, attributes and SDT', tag:'Sessions 20–23', b:`
  <ul><li><b>Synthesized attribute:</b> computed from the node’s <i>children</i> (flows up). Example: <code>E.val = E1.val + T.val</code>.</li>
  <li><b>Inherited attribute:</b> computed from the <i>parent and siblings</i> (flows down / sideways). Example: the type passed to a list of identifiers in a declaration.</li>
  <li><b>S-attributed SDD:</b> only synthesized attributes — evaluate in one bottom-up (post-order) pass.</li>
  <li><b>L-attributed SDD:</b> inherited attributes may use the parent’s inherited attributes and siblings to the <i>left</i> only — evaluate in one depth-first, left-to-right pass.</li>
  <li>A <b>dependency graph</b> shows which attribute needs which; any topological order is a valid evaluation order.</li>
  <li><b>SDT (translation scheme):</b> a grammar with semantic actions <code>{ … }</code> placed inside production bodies; the action runs when the parser reaches that position.</li></ul>`},
 {ic:'🧮', t:'Type checking', tag:'Sessions 24–25', b:`
  <ul><li><b>Static checking</b> is done by the compiler; <b>dynamic checking</b> happens at run time.</li>
  <li>Function rule: if <code>f</code> has type <code>s → t</code> and <code>x</code> has type <code>s</code>, then <code>f(x)</code> has type <code>t</code>.</li>
  <li><b>Coercion</b> = implicit conversion inserted by the compiler (usually widening, e.g. <code>int → float</code>). <b>Cast</b> = conversion written by the programmer.</li>
  <li><b>Structural equivalence:</b> two types are the same if they are built the same way. <b>Name equivalence:</b> they are the same only if they have the same name.</li></ul>
  <pre class="code">E → E1 + E2   { E.type = max(E1.type, E2.type);
                a1 = widen(E1.addr, E1.type, E.type);
                a2 = widen(E2.addr, E2.type, E.type);
                E.addr = new Temp();  gen(E.addr '=' a1 '+' a2); }</pre>`},
 {ic:'🧾', t:'Three-address code forms', tag:'Sessions 26–27', b:`
  <pre class="code">x = y op z        binary operation        x = op y        unary operation
x = y             copy                    goto L          unconditional jump
if x goto L       conditional jump        ifFalse x goto L
if x relop y goto L                       param x ; call p, n ; return y
x = y[i]   x[i] = y   indexed copies      x = &amp;y   x = *y   *x = y   pointers</pre>
  <div class="tblwrap"><table class="cal"><tr><th>Representation</th><th>Fields</th><th>Note</th></tr>
  <tr><td><b>Quadruples</b></td><td>op, arg1, arg2, result</td><td>temporaries have names; easy to move code around</td></tr>
  <tr><td><b>Triples</b></td><td>op, arg1, arg2</td><td>a result is referred to by its position number; moving code changes the numbers</td></tr>
  <tr><td><b>Indirect triples</b></td><td>list of pointers to triples</td><td>reorder the list, not the triples</td></tr></table></div>
  <p>A <b>DAG</b> for an expression shares common sub-expressions, so they are computed once.</p>`},
 {ic:'🔀', t:'Control flow, short-circuit and backpatching', tag:'Sessions 28–30', b:`
  <p><b>Short-circuit:</b> in <code>B1 || B2</code>, B2 is evaluated only if B1 is false; in <code>B1 &amp;&amp; B2</code>, only if B1 is true. Boolean expressions are translated into <b>jumps</b>, not values.</p>
  <p><b>Backpatching</b> generates jumps with empty targets in one pass and fills them in later.</p>
  <pre class="code">makelist(i)        new list containing only instruction i
merge(p1, p2)      concatenation of two lists
backpatch(p, i)    insert i as the target of every jump on list p

B → B1 || M B2   { backpatch(B1.falselist, M.instr);
                   B.truelist  = merge(B1.truelist, B2.truelist);
                   B.falselist = B2.falselist; }
B → B1 &amp;&amp; M B2   { backpatch(B1.truelist, M.instr);
                   B.truelist  = B2.truelist;
                   B.falselist = merge(B1.falselist, B2.falselist); }
B → ! B1         { B.truelist = B1.falselist;  B.falselist = B1.truelist; }
M → ε            { M.instr = nextinstr; }</pre>
  <p><code>S.nextlist</code> holds the jumps that must go to the instruction after statement S.</p>`}
],
viva: [
 ['What is the difference between a compiler and an interpreter?','A compiler translates the whole program into another language (usually machine code) before it runs; errors are reported together and the result runs fast. An interpreter executes the program statement by statement without producing a separate target program; it starts at once but usually runs slower.'],
 ['Define token, lexeme and pattern.','A token is a category such as id or num. A lexeme is the actual text that matched, such as count1. A pattern is the rule (usually a regular expression) that describes all lexemes of a token.'],
 ['Why is lexical analysis separate from syntax analysis?','It makes the design simpler (the parser never sees white space or comments), it makes the compiler faster (specialised buffering and DFA scanning), and it improves portability because input-device details stay in the scanner.'],
 ['What is the difference between an NFA and a DFA?','An NFA can have several moves for one symbol and ε-moves; a DFA has exactly one move per state and symbol and no ε-moves. Both accept exactly the regular languages. A DFA is faster to simulate; an NFA is easier to build from a regular expression.'],
 ['What is the longest-match (maximal munch) rule?','When several prefixes of the input match token patterns, the scanner chooses the longest one. If two patterns match the same longest lexeme, the pattern listed first wins.'],
 ['What is a sentinel in input buffering?','A special eof character placed at the end of each buffer half. The scanner then needs only one test per character (is it eof?) instead of two (end of buffer? and which character?).'],
 ['What does the symbol table store, and who uses it?','It stores every identifier with attributes such as type, scope and memory location. All phases use it: the scanner or parser inserts names, semantic analysis checks types and scopes, and code generation uses addresses.'],
 ['What is an ambiguous grammar? Give an example.','A grammar in which some string has more than one parse tree. E → E + E | E * E | id is ambiguous: id + id * id has two parse trees. The dangling-else grammar is another example.'],
 ['Why must left recursion be removed for top-down parsing?','A recursive-descent or LL(1) parser expanding A → A α would call A again without consuming any input, so it would loop forever.'],
 ['What does LL(1) stand for?','Scan the input Left to right, produce a Leftmost derivation, and use 1 token of lookahead to choose the production.'],
 ['What are FIRST and FOLLOW used for?','They fill the LL(1) parsing table. FIRST(α) tells which tokens can start α; FOLLOW(A) tells which tokens can come right after A, which is needed when A can derive ε.'],
 ['How do you know a grammar is not LL(1)?','If any cell of the parsing table gets two productions. Left-recursive and ambiguous grammars are never LL(1); a grammar that needs left factoring is not LL(1) either.'],
 ['What is panic-mode error recovery?','On an error the parser skips input tokens until it finds a synchronizing token (for example ; or } or a token in FOLLOW of the current non-terminal) and then continues. It is simple and guaranteed not to loop.'],
 ['What is the difference between a parse tree and an abstract syntax tree?','A parse tree shows every grammar symbol used in the derivation. An AST keeps only the essential structure: operators are interior nodes, operands are leaves, and helper symbols such as parentheses and E′ disappear.'],
 ['Differentiate synthesized and inherited attributes.','A synthesized attribute of a node is computed from its children’s attributes. An inherited attribute is computed from the parent’s and siblings’ attributes.'],
 ['What are S-attributed and L-attributed definitions?','S-attributed: only synthesized attributes; evaluated bottom-up. L-attributed: inherited attributes may depend only on the parent’s inherited attributes and on siblings to the left; evaluated in one left-to-right depth-first pass. Every S-attributed SDD is also L-attributed.'],
 ['Why do compilers use an intermediate representation?','It separates the front end from the back end: m languages and n machines need m front ends + n back ends instead of m × n compilers. Machine-independent optimization is also done on the IR.'],
 ['What is three-address code?','An intermediate code in which each instruction has at most one operator on the right side and at most three addresses, for example t1 = b * c. Compiler-generated temporaries hold intermediate results.'],
 ['Compare quadruples and triples.','A quadruple has op, arg1, arg2 and result, so results have explicit names. A triple has only op, arg1 and arg2 and refers to a result by the position of the triple; it saves space but moving an instruction changes the references. Indirect triples solve that with a separate list of pointers.'],
 ['What is short-circuit evaluation?','Evaluating a boolean expression only as far as needed: in a || b, b is skipped when a is true; in a && b, b is skipped when a is false. It is implemented with jumps.'],
 ['What is backpatching and why is it needed?','When a jump is generated, its target may not be known yet. Backpatching keeps lists of such incomplete jumps (truelist, falselist, nextlist) and fills in the target later, which allows code generation in a single pass.'],
 ['What is type checking? What is coercion?','Type checking verifies that each operator is applied to operands of compatible types. Coercion is an implicit type conversion inserted by the compiler, such as int to float in 2 + 3.5.'],
 ['What are the front end and back end of a compiler?','The front end (lexical, syntax, semantic analysis and intermediate code generation) depends on the source language. The back end (optimization and code generation) depends on the target machine.'],
 ['What is a cross compiler? What is bootstrapping?','A cross compiler runs on one machine but produces code for another. Bootstrapping is writing a compiler in the language it compiles and using an earlier version to compile the next one.'],
 ['What do the linker and the loader do?','The linker combines object files and libraries and resolves external references into one executable. The loader places the executable in memory and starts it.'],
 ['What are Lex and Yacc?','Lex (Flex) generates a scanner from regular-expression rules. Yacc (Bison) generates an LALR(1) parser from a grammar with semantic actions. They are usually used together.']
],
modern: [
 ['🐉','LLVM','A reusable compiler back end built around one intermediate representation, LLVM IR, which is three-address code in SSA form. Clang (C/C++), Rust, Swift and Julia all translate to LLVM IR and share its optimizer and code generators. This is the “m front ends + n back ends” idea from Session 2, working at industrial scale.','Sessions 2, 26'],
 ['🐧','GCC','The GNU Compiler Collection supports C, C++, Fortran, Ada, Go and more. It lowers programs to an IR called GIMPLE (a three-address form) and then to RTL before generating machine code. Its C and C++ parsers are hand-written recursive-descent parsers.','Sessions 13, 26'],
 ['✍️','Hand-written recursive descent is back','GCC, Clang, Go, Rust and the TypeScript compiler all use hand-written recursive-descent parsers instead of generated ones. The reason is error messages and error recovery: a hand-written parser knows exactly what it was trying to parse. The technique you learn in Sessions 13–14 is the one used in production.','Sessions 13–14, 18'],
 ['⚡','JIT compilers','Java’s HotSpot, JavaScript’s V8 and .NET compile at run time: code starts in an interpreter, and the “hot” parts are compiled to machine code using information collected while the program runs. So a modern “interpreter” has a full compiler inside it.','Session 1'],
 ['🕸️','WebAssembly','A compact, portable binary target that browsers run at near-native speed. C, C++, Rust and Go compilers can generate it, so the same front end can target a web page instead of a processor.','Sessions 2, 26'],
 ['🦀','Rust’s borrow checker','Rust proves memory safety at compile time. After type checking, the compiler lowers the program to an IR called MIR and analyses ownership and lifetimes there. It is semantic analysis taken much further than type checking.','Sessions 24–25'],
 ['🌲','Tree-sitter and incremental parsing','Editors need a syntax tree while you type, even when the code is incomplete. Tree-sitter re-parses only the part of the file that changed and recovers from errors, which gives fast highlighting and code folding.','Sessions 18–19'],
 ['💡','Language servers (LSP)','Auto-complete, go-to-definition and red squiggles come from a compiler front end running as a “language server” (for example clangd or rust-analyzer). The symbol table and scope rules from Sessions 9 and 24 are what answers “where is this name defined?”.','Sessions 9, 24'],
 ['🧠','Compilers for machine learning','Frameworks such as PyTorch and TensorFlow compile models. MLIR, part of the LLVM project, lets a compiler define several levels of IR and lower step by step, from tensor operations down to machine code for CPUs and GPUs.','Session 26'],
 ['🔍','Compiler Explorer','At godbolt.org you can type C or C++ on the left and see the assembly produced by many compilers on the right, colour-matched line by line. Try a small function with -O0 and then -O2 to see what an optimizer does.','All sessions']
],
tools: [
 ['Flex','Scanner generator. You write regular expressions with actions; it produces a C scanner (a DFA).','Sessions 6–8'],
 ['Bison','Parser generator (LALR(1)). Works with Flex. Grammar rules carry semantic actions, i.e. an SDT.','Sessions 10–23'],
 ['ANTLR','Parser generator that produces LL(*) recursive-descent parsers in Java, Python, C# and more. Good for seeing parse trees.','Sessions 12–17'],
 ['GCC / Clang','Real compilers you can inspect with the commands below.','All'],
 ['JFLAP','Draw NFAs/DFAs, convert RE → NFA → DFA and test strings step by step.','Session 5'],
 ['regex101.com','Test regular expressions with explanations of each part.','Session 4'],
 ['Compiler Explorer (godbolt.org)','See the assembly a compiler generates for your code.','Sessions 26–30']
],
commands: [
 ['gcc -E prog.c','Stop after the preprocessor: see the code after #include and #define are expanded.'],
 ['gcc -S prog.c','Stop after compilation: produces assembly in prog.s.'],
 ['gcc -c prog.c','Compile and assemble: produces the object file prog.o (not yet linked).'],
 ['clang -fsyntax-only -Xclang -dump-tokens prog.c','Print every token the scanner produces.'],
 ['clang -fsyntax-only -Xclang -ast-dump prog.c','Print the abstract syntax tree with types.'],
 ['clang -S -emit-llvm prog.c','Write LLVM IR (three-address code) to prog.ll.'],
 ['gcc -fdump-tree-gimple prog.c','Write GCC’s three-address form (GIMPLE) to a dump file.']
],
tips: [
 'Draw before you write: for NFA, DFA, parse-tree and annotated-tree questions the diagram carries most of the marks.',
 'For FIRST and FOLLOW, work in a table and repeat the rules until no set changes. Remember: FOLLOW never contains ε, and $ goes in FOLLOW(start).',
 'In LL(1) parse traces, write the stack with the top clearly marked and show the action on every line.',
 'When a question says “eliminate left recursion”, write the general formula first, then substitute α and β.',
 'In three-address code, number every instruction and use a new temporary for every operator.',
 'For backpatching, keep three columns: instruction number, code, and the lists (truelist / falselist / nextlist) after each reduction.',
 'Check each answer with the Lab tools: the tokenizer, the LL(1) builder and the expression translator give the same output as the lectures.'
],
grammars: [
 "E  -> T E'\nE' -> + T E' | ε\nT  -> F T'\nT' -> * F T' | ε\nF  -> ( E ) | id",
 "S -> A B\nA -> a A | ε\nB -> b B | c",
 "S -> a B D h\nB -> c C\nC -> b C | ε\nD -> E F\nE -> g | ε\nF -> f | ε",
 "S -> ( L ) | a\nL -> S L'\nL' -> , S L' | ε",
 "S -> i E t S S' | a\nS' -> e S | ε\nE -> b",
 "A -> B C\nB -> x | ε\nC -> y | ε",
 "D -> T L ;\nT -> int | float\nL -> id R\nR -> , id R | ε",
 "S -> A a | b\nA -> c A | d"
],
tokLines: [
 'int count = 0;',
 'x = y + 42;',
 'if (a <= b) max = b;',
 'total = price * qty;   // bill',
 'while (i != n) i++;',
 'float rate = 6.02e23;',
 'msg = "hello world";',
 'a[i] = b[j] + 1;',
 'return x >= 10 && y < 5;',
 'for (i = 0; i < 10; i++) sum += i;'
],
tacExprs: [
 'x = a + b * c', 'y = (a + b) * (c - d)', 'z = -a * b + c', 'a = b * -c + b * -c', 'r = (a + b) / (a - b)', 'p = a * b + c * d - e', 'q = a - (b - c) * d', 't = (x + y) * (x + y)'
],
pipeExamples: ['x = a + b * 2', 'a = b * -c + b * -c', 'area = (w + 2) * (h + 2)', 'y = 3 * 4 + x', 'avg = (a + b + c) / 3']
};
