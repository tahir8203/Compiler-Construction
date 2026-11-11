/* Sessions 9–16 (Weeks 5–8) + Midterm unit (Week 9). Content only. */
COURSE.sessions.push(
/* ================= WEEK 5 ================= */
{ id:9, week:5, unit:'Symbol table & syntax analysis', ic:'📒', lo:[2,3], book:'Louden Ch. 6.3 · Dragon Ch. 2.7, 4.1',
  title:'Symbol Table and the Role of the Parser',
  sub:'What the symbol table stores, operations (insert, lookup), hashing, scopes and nested blocks; the parser’s position in the compiler and syntax-error handling goals.',
  intro:'Your scanner now returns ⟨id, pointer⟩ — but a pointer to what? Today we build the <b>symbol table</b>, then hand the token stream to the next phase: the <b>parser</b>.',
  obj:['List the information stored in a symbol-table entry.','Implement insert and lookup with a hash table and chaining.','Handle nested scopes with a stack of tables.','Explain the role and position of the parser.','State the goals of syntax-error handling.'],
  bloom:{head:['<b>Describe</b> symbol-table entries and operations.','<b>Apply</b> hashing and scope rules to examples.','<b>Explain</b> what a parser receives and produces.'],
    heart:['<b>Value</b> efficient data structures in system software.','<b>Care</b> about helpful messages such as "undeclared variable".'],
    hand:['<b>Implement</b> a scoped symbol table.','<b>Trace</b> insert/lookup for a nested-block program.']},
  slides:[
    {k:'Concept', h:'What is a symbol table?', ic:'📒', p:'A data structure that stores one record for each name (identifier) in the program: variables, functions, types, labels, constants.', pts:[['🏷️','Lexeme (name)'],['🔠','Type (int, float, array…, function signature)'],['📦','Size and memory offset/address'],['🌐','Scope / nesting level'],['📍','Line of declaration (for messages)'],['🧩','For functions: number and types of parameters, return type']], tk:'All phases read and write this table.'},
    {k:'Concept', h:'Operations', ic:'⚙️', pts:[['➕','<b>insert(name, info)</b> — on a declaration'],['🔍','<b>lookup(name)</b> — on every use; returns the entry or "not found"'],['🚪','<b>enterScope()</b> / <b>exitScope()</b> — at { and }'],['✏️','<b>set attribute</b> — e.g. add type later (semantic phase)']], tk:'Lookups are far more frequent than inserts → make lookup fast.'},
    {k:'Comparison', h:'Choosing a data structure', cmp:[['Option',['Unsorted list','Sorted array','Binary search tree','Hash table']],['Lookup cost',['O(n)','O(log n), but slow inserts','O(log n) average','O(1) average ← used in practice']]], tk:'Hash tables win for compilers.'},
    {k:'Animation', h:'A hash-table symbol table', demo:'symtab', tk:'Hash → bucket → chain.'},
    {k:'Animation', h:'Scopes: a stack of tables', demo:'scopes', tk:'Look up from the innermost scope outward.'},
    {k:'Concept', h:'Who uses the symbol table?', demo:'symflow', tk:'Lexer inserts, semantic phase adds types, code generator uses addresses.'},
    {k:'Concept', h:'Enter the parser', demo:'parserrole', tk:'Tokens in, tree out (and good error messages).'},
    {k:'Concept', h:'Kinds of parsers', ic:'🌲', pts:[['🌐','<b>Universal</b> (CYK, Earley): any grammar, too slow for compilers.'],['⬇️','<b>Top-down</b>: build the tree from the root to the leaves (recursive descent, LL).'],['⬆️','<b>Bottom-up</b>: build from the leaves to the root (shift-reduce, LR).'],['➡️','All practical ones read input left to right, one token at a time.']], tk:'This course focuses on top-down parsing.'},
    {k:'Concept', h:'Syntax-error handling goals', ic:'🩺', pts:[['📣','Report errors <b>clearly and accurately</b> (where and what).'],['🏃','<b>Recover</b> quickly enough to detect later errors.'],['⚡','Add <b>minimal overhead</b> to correct programs.']], ex:'<code>prog.c:7:15: error: expected \';\' before \'}\' token</code>', tk:'Report, recover, stay fast.'},
    {k:'Concept', h:'Where errors come from', pts:[['🔤','Lexical: misspelled identifier, illegal char'],['🌳','Syntactic: missing ; or ), unbalanced braces — <b>most</b> compile errors'],['🧐','Semantic: type mismatch, undeclared variable'],['🧠','Logical: wrong algorithm (compiler cannot detect)']], tk:'Parsers detect errors as soon as a prefix cannot be extended (viable-prefix property).'}
  ],
  lab:{t:'Lab: a scoped symbol table', steps:['Implement a hash table (or use a dictionary) with insert and lookup.','Implement a stack of tables with enterScope/exitScope.','Feed it the program: <code>int x; { int y; x = y; { float x; x = 1.5; } x = 2; } z = 3;</code>','Print the entry found for every use; report "undeclared" for z.','Print the table contents at each { and }.'], out:'Code + trace output showing which declaration each use refers to.'},
  disc:['Why should keywords be pre-installed in the symbol table?','In Python a variable is created by assignment. How does that change the symbol table’s job?','Why should a parser not stop at the first error?'],
  mistakes:['Searching the outermost scope first (wrong shadowing).','Deleting entries at exitScope that later phases still need (keep them, just make them invisible).','Thinking the parser reads characters — it reads tokens.','Reporting only "syntax error" without a line number.'],
  rev:['Symbol table: name, type, size, address, scope, declaration line.','Hash table with chaining: O(1) average lookup.','Nested scopes: stack of tables, innermost first.','The parser takes tokens and builds a tree, reporting and recovering from errors.','Top-down vs bottom-up parsers.'],
  hw:'Read Dragon §4.1–4.2. Implement the scoped symbol table if not finished in class.',
  quiz:[
    {q:'The most common data structure for symbol tables is…', o:['Linked list','Hash table','Queue','Heap'], a:1, e:'O(1) average lookup.'},
    {q:'In nested scopes, lookup searches…', o:['Global scope first','Innermost scope first','Randomly','Only the current scope'], a:1, e:'Most-closely-nested rule.'},
    {q:'The parser receives…', o:['Characters','Tokens','Machine code','Object files'], a:1, e:'From the lexical analyzer.'},
    {q:'Two names in one hash bucket are handled by…', o:['Deleting one','Chaining','Stopping the compiler','Sorting'], a:1, e:'Separate chaining.'},
    {q:'Building the parse tree from root to leaves is…', o:['Bottom-up parsing','Top-down parsing','Lexing','Linking'], a:1, e:'Top-down.'}],
  terms:[['Symbol table','A data structure recording information about each identifier.'],['Scope','The region of a program where a declaration is visible.'],['Shadowing','An inner declaration hiding an outer one with the same name.'],['Chaining','Storing colliding hash entries in a linked list.'],['Parser','The syntax analyzer: checks token sequences against a grammar and builds a tree.'],['Top-down parsing','Building the parse tree from the root toward the leaves.'],['Bottom-up parsing','Building the parse tree from the leaves toward the root.']]
},
{ id:10, week:5, unit:'Symbol table & syntax analysis', ic:'📐', lo:[3], book:'Louden Ch. 3 · Dragon Ch. 4.2–4.3',
  title:'Context-Free Grammars, Writing a Grammar and Ambiguity',
  sub:'Terminals, non-terminals, productions, start symbol; derivations and parse trees; writing grammars for expressions and statements; ambiguity and eliminating it with precedence and associativity.',
  assess:'Quiz-2',
  intro:'Regular expressions cannot match nested parentheses. <b>Context-free grammars</b> can — and they describe almost all the syntax of programming languages.',
  obj:['Define a CFG and identify terminals, non-terminals, productions and the start symbol.','Produce leftmost and rightmost derivations and draw parse trees.','Write grammars for expressions and statements.','Recognise ambiguous grammars.','Eliminate ambiguity using precedence levels and associativity.'],
  bloom:{head:['<b>Define</b> CFG components.','<b>Derive</b> strings and draw parse trees.','<b>Analyze</b> a grammar for ambiguity.'],
    heart:['<b>Appreciate</b> how a few rules describe infinite languages.','<b>Value</b> unambiguous specifications in teamwork.'],
    hand:['<b>Write</b> an unambiguous expression grammar.','<b>Draw</b> two parse trees to prove ambiguity.']},
  slides:[
    {k:'Concept', h:'A context-free grammar', ic:'📐', pts:[['a','<b>Terminals</b>: the tokens (id, +, (, if…).'],['A','<b>Non-terminals</b>: syntactic variables (expr, stmt).'],['S','<b>Start symbol</b>: one non-terminal (usually the first).'],['→','<b>Productions</b>: head → body, e.g. stmt → if ( expr ) stmt else stmt.']], code:`E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id`, tk:'G = (T, N, S, P).'},
    {k:'Concept', h:'Notation conventions', pts:[['🔤','Terminals: lowercase, operators, digits, bold names like <b>id</b>.'],['🔠','Non-terminals: uppercase letters (A, B, S) or italic names (expr).'],['α','Greek letters α, β, γ: strings of grammar symbols.'],['|','A → α₁ | α₂ means A → α₁ and A → α₂.']], tk:'Unless stated, the head of the first production is the start symbol.'},
    {k:'Animation', h:'Derivations', demo:'derive', tk:'⇒ one step, ⇒* zero or more steps, ⇒⁺ one or more.'},
    {k:'Concept', h:'Leftmost and rightmost derivations', pts:[['⬅️','<b>Leftmost</b> (⇒lm): always replace the leftmost non-terminal — used by top-down parsers.'],['➡️','<b>Rightmost</b> (⇒rm, canonical): always replace the rightmost — its reverse is used by bottom-up parsers.'],['🔤','A <b>sentential form</b> is any string derivable from S; a <b>sentence</b> has only terminals.'],['📚','L(G) = all sentences of G.']], tk:'Same tree can come from different derivation orders.'},
    {k:'Animation', h:'Parse trees', demo:'parsetree', tk:'Interior nodes = non-terminals; leaves = terminals; yield = the sentence.'},
    {k:'Concept', h:'Writing a grammar: statements', code:`stmt  → id = expr ;
      | if ( expr ) stmt
      | if ( expr ) stmt else stmt
      | while ( expr ) stmt
      | { stmts }
stmts → stmts stmt | ε`, tk:'Each language construct becomes a production.'},
    {k:'Concept', h:'CFG vs regular expressions', cmp:[['Regular expressions',['Describe tokens (lexical structure)','Recognised by finite automata','Cannot count / nest','Simpler, faster']],['Context-free grammars',['Describe syntax (nested structure)','Recognised by push-down automata (stack)','Handle (ⁿ )ⁿ, nested blocks','Every regular language is also context-free']]], tk:'Lexical rules → REs; nested structure → CFGs.'},
    {k:'Animation', h:'Ambiguity', demo:'ambig', tk:'Ambiguous = one sentence, two parse trees.'},
    {k:'Concept', h:'Eliminating ambiguity: precedence', ic:'🪜', p:'Introduce one non-terminal per <b>precedence level</b>. Lower levels (higher precedence) appear deeper in the tree.', code:`E → E + T | T          (level 1: +, lowest precedence)
T → T * F | F          (level 2: *)
F → ( E ) | id         (level 3: atoms, highest)`, tk:'* binds tighter because T is below E.'},
    {k:'Concept', h:'Eliminating ambiguity: associativity', ic:'↔️', pts:[['⬅️','<b>Left-associative</b> (a − b − c = (a − b) − c): use left recursion, E → E − T.'],['➡️','<b>Right-associative</b> (a = b = c, 2^3^2): use right recursion, A → id = A | E.'],['⚠️','E → E − E is ambiguous: a − b − c gets two trees.']], tk:'Recursion direction fixes associativity.'},
    {k:'Animation', h:'The dangling else', demo:'danglingelse', tk:'Match each else with the closest unmatched if.'}
  ],
  lab:{t:'Lab: grammars and ambiguity', steps:['Write a grammar for boolean expressions with or, and, not, parentheses, true, false and id (precedence: not > and > or).','Give a leftmost derivation and a parse tree for <code>not a and b or c</code>.','Show that E → E + E | E * E | id is ambiguous using id * id + id.','Rewrite it to be unambiguous with * above +, both left-associative.'], out:'Grammar, derivation, two trees, and the corrected grammar.'},
  disc:['Is ambiguity a property of the grammar or of the language?','Why do many languages require braces in if statements (e.g. Go, Rust)?','Can a parser generator handle ambiguous grammars? How?'],
  mistakes:['Mixing up terminals and non-terminals in the derivation.','Thinking one parse tree means one derivation (there can be several derivations per tree).','Proving ambiguity with two derivations that give the <b>same</b> tree.','Using left recursion for a right-associative operator.'],
  rev:['CFG = terminals, non-terminals, start symbol, productions.','Derivations (leftmost/rightmost) and parse trees show structure.','Ambiguous: a sentence with two parse trees.','Fix precedence with one non-terminal per level; fix associativity with recursion direction.','Dangling else: closest-if rule or grammar rewrite.'],
  hw:'Revise Weeks 2–5 for Quiz 2. Read Dragon §4.3.',
  quiz:[
    {q:'In E → E + T, the symbol + is…', o:['A non-terminal','A terminal','The start symbol','A production'], a:1, e:'Tokens are terminals.'},
    {q:'A grammar is ambiguous if a sentence has…', o:['No parse tree','More than one parse tree','A long derivation','Only terminals'], a:1, e:'Two trees = ambiguous.'},
    {q:'To make * bind tighter than +, * must appear…', o:['Higher in the grammar (closer to the start)','Lower (deeper) in the grammar','In the lexer','Nowhere'], a:1, e:'Deeper levels = higher precedence.'},
    {q:'Left-associative subtraction is written with…', o:['E → T − E','E → E − T','E → E − E','E → − E'], a:1, e:'Left recursion gives left associativity.'},
    {q:'Which can a CFG describe but a regular expression cannot?', o:['Identifiers','Numbers','Balanced parentheses','Keywords'], a:2, e:'Nesting needs a stack.'}],
  assessment:{ kind:'quiz', title:'Quiz 2 — Weeks 2–5', covers:'Lexical analysis, automata, scanner implementation, symbol table, CFGs and ambiguity',
    instructions:['Closed book unless announced otherwise.','Show working for derivations and trees.','Time and marks are announced by the instructor.'],
    mcq:[
      {q:'A table-driven scanner changes language by changing…', o:['The driver loop','The transition table','The parser','The linker'], a:1, e:'Data, not code.'},
      {q:'Which symbol-table operation is most frequent?', o:['insert','lookup','delete','sort'], a:1, e:'Every use of a name is a lookup.'},
      {q:'Grammar S → ( S ) S | ε generates…', o:['Only ()','Balanced parentheses','Any parentheses','Nothing'], a:1, e:'Classic balanced-parentheses grammar.'},
      {q:'In a leftmost derivation you replace…', o:['The rightmost non-terminal','The leftmost non-terminal','Any terminal','The start symbol only'], a:1, e:'By definition.'},
      {q:'Which grammar is ambiguous?', o:['E → E + T | T','E → E + E | id','E → T E′','F → ( E ) | id'], a:1, e:'id + id + id has two trees.'}],
    tf:[
      {q:'Every regular language is context-free.', a:true, e:'REs can be converted to CFGs.'},
      {q:'A parse tree’s leaves, read left to right, give the sentence.', a:true, e:'That is the yield.'},
      {q:'Right recursion makes an operator left-associative.', a:false, e:'Right recursion → right associativity.'},
      {q:'Keywords are often pre-installed in the symbol table.', a:true, e:'So the identifier rule can recognise them.'}],
    short:[
      {q:'Give the leftmost derivation of id * ( id + id ) using E → E+T | T, T → T*F | F, F → (E) | id.', a:'E ⇒ T ⇒ T*F ⇒ F*F ⇒ id*F ⇒ id*(E) ⇒ id*(E+T) ⇒ id*(T+T) ⇒ id*(F+T) ⇒ id*(id+T) ⇒ id*(id+F) ⇒ id*(id+id).'},
      {q:'What is stored in a symbol-table entry for a function?', a:'Name, return type, number and types of parameters, scope/level, address or label, line declared.'}],
    app:[
      {q:'Show that S → a S b S | b S a S | ε is ambiguous.', a:'The string abab has two leftmost derivations: S ⇒ aSbS ⇒ abS ⇒ abaSbS ⇒ ababS ⇒ abab, and S ⇒ aSbS ⇒ abSaSbS ⇒ abaSbS ⇒ ababS ⇒ abab (inner S → bSaS). Two parse trees → ambiguous.'},
      {q:'Write an unambiguous grammar for expressions with +, * and ^ where ^ is right-associative and has the highest precedence.', a:'E → E + T | T; T → T * P | P; P → F ^ P | F; F → ( E ) | id.'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Context-free grammar','A set of productions with single non-terminal heads, a start symbol, terminals and non-terminals.'],['Terminal','A basic symbol (token) of the language.'],['Non-terminal','A syntactic variable that stands for a set of strings.'],['Production','A rule head → body.'],['Derivation','A sequence of rewriting steps from the start symbol.'],['Sentential form','Any string derivable from the start symbol.'],['Parse tree','A tree showing how the start symbol derives a sentence.'],['Ambiguous grammar','A grammar where some sentence has more than one parse tree.'],['Precedence','Which operator binds more tightly.'],['Associativity','How operators of equal precedence group (left or right).'],['Dangling else','Ambiguity about which if an else belongs to.']]
},
/* ================= WEEK 6 ================= */
{ id:11, week:6, unit:'Grammar transformations', ic:'🔧', lo:[3], book:'Dragon Ch. 4.3.3–4.3.5 · Louden Ch. 4.2',
  title:'Left Recursion, Left Factoring and Non-Context-Free Constructs',
  sub:'Why top-down parsers loop on left recursion; eliminating immediate and indirect left recursion; left factoring; language rules that grammars cannot express.',
  intro:'Our nice unambiguous grammar E → E + T has a problem: a top-down parser would call E() inside E() forever. Today we transform grammars so that predictive parsers can use them.',
  obj:['Identify immediate and indirect left recursion.','Eliminate left recursion with A → βA′, A′ → αA′ | ε.','Apply the general algorithm for indirect left recursion.','Left-factor grammars with common prefixes.','Explain constructs that are not context-free and where they are checked.'],
  bloom:{head:['<b>Recognise</b> left recursion and common prefixes.','<b>Apply</b> the transformations correctly.','<b>Justify</b> why some checks belong to the semantic phase.'],
    heart:['<b>Value</b> transformations that keep the language the same.','<b>Be patient</b> with multi-step algebra on grammars.'],
    hand:['<b>Transform</b> grammars by hand.','<b>Verify</b> by deriving the same strings from both grammars.']},
  slides:[
    {k:'Concept', h:'Left recursion', ic:'🔁', p:'A grammar is <b>left-recursive</b> if A ⇒⁺ Aα for some non-terminal A. <b>Immediate</b> left recursion: a production A → Aα.', code:`void E() {
    E();          // E → E + T : calls itself before reading any input
    match('+');   // → infinite recursion, stack overflow
    T();
}`, tk:'Top-down parsers cannot handle left recursion.'},
    {k:'Animation', h:'Eliminating immediate left recursion', demo:'leftrec', tk:'A → Aα | β  ⟹  A → βA′, A′ → αA′ | ε.'},
    {k:'Concept', h:'Several alternatives', code:`A → A α1 | A α2 | … | A αm | β1 | β2 | … | βn
⟹
A  → β1 A′ | β2 A′ | … | βn A′
A′ → α1 A′ | α2 A′ | … | αm A′ | ε`, ex:'E → E + T | E − T | T becomes E → T E′, E′ → + T E′ | − T E′ | ε.', tk:'Group all left-recursive alternatives into A′.'},
    {k:'Concept', h:'Indirect left recursion', ic:'🔄', code:`S → A a | b
A → A c | S d | ε
S ⇒ A a ⇒ S d a      ← S is left-recursive through A`, p:'Algorithm: order the non-terminals A₁…Aₙ. For each Aᵢ, replace every production Aᵢ → Aⱼγ (j &lt; i) by the bodies of Aⱼ; then remove immediate left recursion from Aᵢ.', tk:'Substitute, then eliminate immediate recursion.'},
    {k:'Example', h:'Worked example (indirect)', code:`Order: S, A.
S: no immediate left recursion.
A → S d : substitute S → A a | b  ⟹  A → A c | A a d | b d | ε
Remove immediate left recursion:
A  → b d A′ | A′
A′ → c A′ | a d A′ | ε`, tk:'The final grammar has no left recursion (the algorithm requires no ε-cycles; here it still works).'},
    {k:'Animation', h:'Left factoring', demo:'leftfact', tk:'Factor out the common prefix; decide later.'},
    {k:'Concept', h:'Left-factoring algorithm', code:`For each non-terminal A:
   find the longest prefix α common to two or more alternatives
   if α ≠ ε: replace A → α β1 | … | α βn | γ  by
        A  → α A′ | γ
        A′ → β1 | … | βn
repeat until no two alternatives share a prefix`, tk:'Repeat until no common prefixes remain.'},
    {k:'Concept', h:'Associativity after transformation', ic:'⚠️', p:'After removing left recursion, E → T E′ produces a tree that leans right, but the <b>language</b> is unchanged. We restore left associativity in the <b>semantic actions</b> (inherited attributes, Week 12).', tk:'The tree shape changes; the meaning is fixed by translation rules.'},
    {k:'Animation', h:'Non-context-free language constructs', demo:'noncf', tk:'Declare-before-use and parameter counts are semantic checks.'},
    {k:'Concept', h:'Why not use a more powerful grammar?', pts:[['🐢','Context-sensitive grammars are hard to write and parsing them is very expensive.'],['📒','A symbol table plus a few semantic rules does the job cheaply.'],['🧩','Design principle: grammar for structure, semantic analysis for meaning.']], tk:'Keep the grammar context-free; check the rest semantically.'}
  ],
  lab:{t:'Lab: transform these grammars', steps:['Remove left recursion: <code>S → S + S | S S | ( S ) | a</code> (first make sure you handle all alternatives).','Remove left recursion: <code>A → A b | A c | d | e</code>.','Left-factor: <code>S → a b c | a b d | a e | f</code>.','Left-factor: <code>stmt → id = expr ; | id ( args ) ;</code>.','Check one string from each original grammar can still be derived after the transformation.'], out:'Transformed grammars with one verification derivation each.'},
  disc:['Does eliminating left recursion change the language? The parse trees?','Why do bottom-up (LR) parsers not mind left recursion?','Find a rule in C or Java that cannot be expressed by a CFG.'],
  mistakes:['Forgetting the ε-alternative in A′.','Writing A′ → A′ α (that is still left-recursive!).','Factoring only part of a common prefix.','Thinking left factoring removes ambiguity — it does not.'],
  rev:['Left recursion (A ⇒⁺ Aα) makes top-down parsers loop.','A → Aα | β becomes A → βA′, A′ → αA′ | ε.','Indirect recursion: substitute in order, then remove immediate recursion.','Left factoring: A → αβ₁ | αβ₂ becomes A → αA′, A′ → β₁ | β₂.','Non-CF rules (declare-before-use, argument counts) are checked semantically.'],
  hw:'Transform the grammar of Assignment 1’s MiniC expressions so it has no left recursion and no common prefixes.',
  quiz:[
    {q:'Which production is immediately left-recursive?', o:['A → a A','A → A a','A → a','A → ε'], a:1, e:'The head appears first in the body.'},
    {q:'A → A x | y becomes…', o:['A → y A′, A′ → x A′ | ε','A → x A | y','A → A′ y','A → y | x'], a:0, e:'β = y, α = x.'},
    {q:'Left factoring is needed when…', o:['A grammar is left-recursive','Two alternatives share a common prefix','A grammar has ε','There are no terminals'], a:1, e:'Predictive parsers cannot choose.'},
    {q:'"Identifiers must be declared before use" is checked by…', o:['The CFG','Semantic analysis with the symbol table','The linker','The pre-processor'], a:1, e:'It is not context-free.'},
    {q:'Eliminating left recursion…', o:['Changes the language','Keeps the language but changes the tree shape','Removes all ε-productions','Makes the grammar ambiguous'], a:1, e:'Same strings, different trees.'}],
  terms:[['Left recursion','A grammar property A ⇒⁺ Aα; causes infinite recursion in top-down parsers.'],['Immediate left recursion','A production of the form A → Aα.'],['Indirect left recursion','Left recursion through other non-terminals, e.g. S → Aa, A → Sd.'],['Left factoring','Rewriting alternatives with a common prefix so the choice is delayed.'],['Non-context-free construct','A language rule a CFG cannot express, e.g. declare-before-use.']]
},
{ id:12, week:6, unit:'Top-down parsing', ic:'⬇️', lo:[3], book:'Louden Ch. 4.1 · Dragon Ch. 4.4',
  title:'Top-Down Parsing and Predictive Parsing',
  sub:'Top-down parsing as finding a leftmost derivation; backtracking; predictive parsing with one token of lookahead; the idea behind FIRST and LL(1).',
  intro:'Top-down parsing is like solving a maze from the entrance: start at the start symbol and choose productions until the leaves spell the input. The question is <b>which production to choose</b>.',
  obj:['Describe top-down parsing as constructing a leftmost derivation.','Trace a backtracking parser and explain its cost.','Explain predictive parsing and the role of lookahead.','Give the conditions under which one token of lookahead is enough.','Compare recursive-descent and table-driven predictive parsers.'],
  bloom:{head:['<b>Explain</b> top-down parsing.','<b>Trace</b> backtracking on a small grammar.','<b>Analyze</b> when prediction is possible.'],
    heart:['<b>Appreciate</b> why efficiency matters for compilers that parse millions of lines.','<b>Value</b> clear decision rules over trial and error.'],
    hand:['<b>Build</b> a parse tree top-down by hand.','<b>Decide</b> productions using the lookahead token.']},
  slides:[
    {k:'Concept', h:'Top-down parsing', ic:'⬇️', p:'Start at the root (start symbol). At each step, pick the leftmost non-terminal and choose a production for it. Match terminals against the input. This builds a <b>leftmost derivation</b> in preorder.', tk:'The key decision: which production for the current non-terminal?'},
    {k:'Animation', h:'Parsing with backtracking', demo:'backtrack', tk:'Try, fail, undo, try again.'},
    {k:'Concept', h:'Problems with backtracking', ic:'🐢', pts:[['⏳','Exponential time in the worst case.'],['↩️','Undoing semantic actions (symbol-table changes) is difficult.'],['📍','Error position is unclear: which failure was the real error?'],['🔁','Left recursion still causes infinite loops.']], tk:'Real compilers avoid backtracking.'},
    {k:'Concept', h:'Predictive parsing', ic:'🔮', p:'A <b>predictive parser</b> chooses the production by looking at the next input token (the <b>lookahead</b>) — no backtracking. It works when, for each non-terminal, the alternatives start with <b>different</b> tokens.', code:`stmt → if ( expr ) stmt else stmt
     | while ( expr ) stmt
     | { stmt_list }
     | id = expr ;
lookahead "while" ⟹ choose the while-production. One token decides.`, tk:'One token of lookahead, zero guessing.'},
    {k:'Concept', h:'The idea of FIRST', ic:'🎯', p:'<b>FIRST(α)</b> = the set of terminals that can begin strings derived from α. If A → α | β and FIRST(α) ∩ FIRST(β) = ∅, the lookahead tells us which to use.', ex:'FIRST(if ( expr ) stmt …) = {if}; FIRST({ stmt_list }) = { { }.', tk:'Disjoint FIRST sets make prediction possible.'},
    {k:'Concept', h:'What about ε-productions?', ic:'∅', p:'If A → ε, choose it when the lookahead is something that can <b>follow</b> A. That set is <b>FOLLOW(A)</b>.', code:`E′ → + T E′ | ε
lookahead +      ⟹ E′ → + T E′
lookahead ) or $ ⟹ E′ → ε   (because ) and $ can follow E′)`, tk:'FIRST decides normal alternatives; FOLLOW decides ε.'},
    {k:'Concept', h:'LL(1) in one sentence', ic:'📛', p:'<b>LL(1)</b>: scan input <b>L</b>eft to right, produce a <b>L</b>eftmost derivation, use <b>1</b> token of lookahead. A grammar is LL(1) when every decision can be made with one token.', tk:'LL(1) grammars: no ambiguity, no left recursion, no conflicts in FIRST/FOLLOW.'},
    {k:'Comparison', h:'Two ways to build a predictive parser', cmp:[['Recursive descent',['One procedure per non-terminal','Uses the call stack','Easy to write by hand','Easy to add semantic actions','Week 7']],['Table-driven LL(1)',['One table M[A, a] + explicit stack','Generic driver loop','Table built from FIRST/FOLLOW','Easy to generate automatically','Week 8']]], tk:'Same idea, different machinery.'},
    {k:'Example', h:'Predict by hand', code:`Grammar:  S → a B | b A        A → a | b S      B → b | a S
Input:    a b
S, lookahead a  → S → a B ; match a
B, lookahead b  → B → b   ; match b   ✔`, tk:'Each step looks at one token only.'},
    {k:'Concept', h:'Where top-down parsers are used', pts:[['⚙️','GCC (C/C++ since 2004) and Clang use hand-written recursive-descent parsers.'],['🐹','Go, Rust, Swift and TypeScript compilers use recursive descent.'],['🧰','ANTLR generates LL(*) parsers for many languages and DSLs.']], psy:'Recursive descent gives the best control over error messages, which is why most production compilers use it today.', tk:'Top-down is the industry favourite for hand-written parsers.'}
  ],
  lab:{t:'Lab: backtracking vs prediction', steps:['Trace the backtracking parser for S → c A d, A → a b | a on input cad and cabd.','Count the number of steps for each.','Now left-factor A → a A′, A′ → b | ε and parse both inputs predictively.','Compare the number of steps.'], out:'Two traces before and after left factoring with step counts.'},
  disc:['When could backtracking be acceptable?','Why does left factoring help predictive parsing?','How many tokens of lookahead does a human use when reading code?'],
  mistakes:['Choosing ε whenever no other production matches — only if the lookahead is in FOLLOW.','Confusing LL (left-to-right, leftmost) with LR (left-to-right, rightmost reversed).','Thinking predictive parsers can handle left recursion.','Assuming backtracking finds better error positions.'],
  rev:['Top-down parsing builds a leftmost derivation from the root.','Backtracking works but is slow and complicates errors and actions.','Predictive parsing uses the lookahead token to choose a production.','FIRST sets decide normal alternatives; FOLLOW sets decide ε-productions.','LL(1): left-to-right, leftmost derivation, 1 lookahead token.'],
  hw:'Read Louden §4.1 and Dragon §4.4.1. Write the procedures (pseudo-code) for the grammar of the last example.',
  quiz:[
    {q:'A top-down parser constructs a…', o:['Rightmost derivation in reverse','Leftmost derivation','Random derivation','DFA'], a:1, e:'Preorder construction = leftmost.'},
    {q:'Predictive parsers avoid…', o:['Lookahead','Backtracking','Grammars','Tokens'], a:1, e:'They decide with the lookahead.'},
    {q:'In LL(1), the "1" means…', o:['One pass','One token of lookahead','One production','One error'], a:1, e:'One lookahead symbol.'},
    {q:'An ε-production A → ε is chosen when the lookahead is in…', o:['FIRST(A)','FOLLOW(A)','The symbol table','No set'], a:1, e:'Something that can follow A.'},
    {q:'Which compiler uses a hand-written recursive-descent parser?', o:['Clang','None','Only Yacc','Only Lex'], a:0, e:'Also GCC, Go, Rust.'}],
  terms:[['Top-down parsing','Constructing the parse tree from the root, in preorder.'],['Backtracking','Undoing choices and trying another alternative after a mismatch.'],['Predictive parsing','Top-down parsing that chooses productions using lookahead, without backtracking.'],['Lookahead','The next input token(s) used to make parsing decisions.'],['LL(1)','Left-to-right scan, leftmost derivation, one token of lookahead.'],['FIRST(α)','The set of terminals that begin strings derived from α.'],['FOLLOW(A)','The set of terminals that can appear immediately after A.']]
},
/* ================= WEEK 7 ================= */
{ id:13, week:7, unit:'Recursive-descent parsing', ic:'🌀', lo:[3], book:'Louden Ch. 4.1 · Dragon Ch. 4.4.1',
  title:'Recursive-Descent Parsing',
  sub:'One procedure per non-terminal; match(); choosing alternatives with lookahead; EBNF loops; building syntax trees; the call stack as the parse tree.',
  intro:'Recursive descent is the most natural way to write a parser by hand: each grammar rule becomes a function, and the program\'s call stack <i>is</i> the parse tree.',
  obj:['Translate a grammar into recursive-descent procedures.','Write match() and use the lookahead to choose alternatives.','Trace a recursive-descent parse with the call stack.','Use EBNF repetition to replace tail recursion with loops.','Build an abstract syntax tree while parsing.'],
  bloom:{head:['<b>Apply</b> the grammar-to-procedure rules.','<b>Trace</b> calls and returns on an input.','<b>Relate</b> the call tree to the parse tree.'],
    heart:['<b>Enjoy</b> the elegance of recursion.','<b>Value</b> readable code that mirrors the grammar.'],
    hand:['<b>Write</b> procedures for an expression grammar.','<b>Draw</b> the call tree for an input.']},
  slides:[
    {k:'Concept', h:'The recipe', ic:'📜', pts:[['🧩','One procedure for each non-terminal A.'],['🔀','Inside A, use the lookahead to choose one alternative.'],['🔤','For a terminal in the body: <code>match(t)</code>.'],['📞','For a non-terminal B in the body: call <code>B()</code>.'],['❌','If no alternative fits: report a syntax error.']], tk:'The code mirrors the grammar line by line.'},
    {k:'Animation', h:'Recursive-descent code', demo:'rdcode', tk:'E, E′, T, T′, F — five procedures.'},
    {k:'Animation', h:'Tracing a parse', demo:'recdesc', tk:'Calls go down, returns come back up.'},
    {k:'Concept', h:'match()', code:`Token look;                  // current lookahead
void match(int t) {
    if (look.type == t) look = nextToken();
    else syntaxError("expected " + name(t) + " but found " + look.lexeme);
}`, tk:'match = check + advance.'},
    {k:'Concept', h:'EBNF: loops instead of tail recursion', ic:'🔁', code:`EBNF:  E → T { + T }        T → F { * F }
void E() { T(); while (look == '+') { match('+'); T(); } }
void T() { F(); while (look == '*') { match('*'); F(); } }`, p:'Braces { } mean "zero or more times", [ ] means optional. The while loop also lets us keep <b>left associativity</b> naturally.', tk:'EBNF + loops = shorter, faster, left-associative.'},
    {k:'Concept', h:'Statements', code:`void stmt() {
  switch (look.type) {
    case IF:    match(IF); match('('); expr(); match(')'); stmt();
                if (look.type == ELSE) { match(ELSE); stmt(); }   // closest-if rule
                break;
    case WHILE: match(WHILE); match('('); expr(); match(')'); stmt(); break;
    case '{':   match('{'); while (look.type != '}') stmt(); match('}'); break;
    case ID:    match(ID); match('='); expr(); match(';'); break;
    default:    syntaxError("statement expected");
  }
}`, tk:'The switch on the lookahead is the "prediction".'},
    {k:'Concept', h:'The call tree is the parse tree', ic:'🌳', p:'Each procedure call corresponds to an interior node; each match() to a leaf. The parse tree is never built explicitly unless we want it.', tk:'Recursion makes the tree implicit.'},
    {k:'Concept', h:'Building an AST while parsing', code:`Node E() {
    Node left = T();
    while (look == '+' || look == '-') {
        char op = look; match(op);
        Node right = T();
        left = new BinNode(op, left, right);    // left-associative!
    }
    return left;
}`, tk:'Return nodes from procedures to build an abstract syntax tree.'},
    {k:'Concept', h:'Parse tree vs abstract syntax tree', cmp:[['Parse (concrete) tree',['Every grammar symbol is a node','Includes E′, T′, parentheses','Follows the grammar exactly']],['Abstract syntax tree (AST)',['Operators are interior nodes, operands leaves','No helper non-terminals or parentheses','What later phases actually use']]], tk:'Compilers build ASTs.'},
    {k:'Concept', h:'Limits of recursive descent', pts:[['🔁','Cannot handle left recursion (rewrite first).'],['🔀','Needs disjoint FIRST sets (or more lookahead / backtracking).'],['🧮','Deep nesting can overflow the call stack (rare in practice).']], tk:'Prepare the grammar: no left recursion, left-factored.'}
  ],
  lab:{t:'Lab: hand-trace and code', steps:['Write recursive-descent procedures for: S → ( L ) | a, L → S L′, L′ → , S L′ | ε.','Trace the call tree for input <code>( a , ( a , a ) )</code>.','Implement the procedures in a language of your choice with a tiny token list.','Make the parser print "accepted" or a syntax error with the position.'], out:'Call tree drawing + working code + two test runs (valid and invalid).'},
  disc:['Why is the closest-if rule automatic in recursive descent?','How would you add a "power" operator ^ that is right-associative?','What are the advantages of building an AST instead of a parse tree?'],
  mistakes:['Calling nextToken() in a procedure and also in match() (skipping tokens).','Forgetting to check that input ends with $ after parsing the start symbol.','Writing E() { E(); … } for a left-recursive rule.','Building a right-associative tree for subtraction.'],
  rev:['One procedure per non-terminal; terminals → match().','Lookahead chooses the alternative; no match → syntax error.','EBNF loops replace tail recursion and preserve left associativity.','The call tree is the parse tree; procedures can return AST nodes.','Grammar must be free of left recursion and left-factored.'],
  hw:'Read Louden §4.1.2–4.1.4. Prepare for Assignment 2 (next session).',
  quiz:[
    {q:'In recursive descent, each non-terminal becomes…', o:['A table row','A procedure','A token','A label'], a:1, e:'One procedure per non-terminal.'},
    {q:'match(t) does what when look == t?', o:['Reports an error','Advances to the next token','Calls E()','Pushes t'], a:1, e:'Consume and advance.'},
    {q:'EBNF { + T } is implemented with…', o:['A while loop','A goto','A table','A hash'], a:0, e:'Zero or more repetitions.'},
    {q:'Which is <b>not</b> in an AST?', o:['Operators','Operands','Parentheses tokens','Identifiers'], a:2, e:'Structure makes them unnecessary.'},
    {q:'Recursive descent cannot directly handle…', o:['ε-productions','Left recursion','Terminals','Keywords'], a:1, e:'It would recurse forever.'}],
  terms:[['Recursive-descent parser','A top-down parser made of mutually recursive procedures, one per non-terminal.'],['match()','Procedure that checks the lookahead against an expected terminal and advances.'],['EBNF','Extended BNF with { } for repetition and [ ] for optional parts.'],['Call tree','The tree of procedure calls made while parsing; mirrors the parse tree.'],['Abstract syntax tree','A simplified tree with operators as interior nodes and operands as leaves.']]
},
{ id:14, week:7, unit:'Recursive-descent parsing', ic:'💻', lo:[3], book:'Louden Ch. 4.1, Appendix (TINY parser) · Cooper & Torczon Ch. 3.3',
  title:'Implementing a Recursive-Descent Parser',
  sub:'A complete parser and evaluator for an expression-and-statement language: scanner interface, parser procedures, AST, error messages and testing.',
  assess:'Assignment-2',
  intro:'Today we put everything together: scanner + recursive-descent parser + AST + a tiny evaluator. By the end you will have a working calculator language.',
  obj:['Connect a scanner to a recursive-descent parser through getNextToken.','Implement a complete parser for expressions and simple statements.','Produce clear syntax-error messages with line numbers.','Evaluate expressions directly during parsing (a calculator).','Test a parser systematically with valid and invalid inputs.'],
  bloom:{head:['<b>Integrate</b> scanner and parser.','<b>Apply</b> EBNF loops for precedence and associativity.','<b>Evaluate</b> parser output against expected trees.'],
    heart:['<b>Take ownership</b> of a complete working program.','<b>Value</b> testing and clear error messages.'],
    hand:['<b>Implement</b> and run a full parser.','<b>Write</b> a test suite of valid and invalid programs.']},
  slides:[
    {k:'Concept', h:'The language we will parse', code:`program → { stmt }
stmt    → id = expr ;  |  print expr ;
expr    → term { ( + | - ) term }
term    → factor { ( * | / ) factor }
factor  → number | id | ( expr ) | - factor`, tk:'Small but complete: assignments, printing, precedence, unary minus.'},
    {k:'Concept', h:'Scanner interface', code:`class Token { int type; String lexeme; double value; int line; }
Token look;                    // the lookahead
void advance() { look = scanner.nextToken(); }
void match(int t) { if (look.type == t) advance();
                    else error("expected " + name(t)); }`, tk:'The parser only sees Token objects.'},
    {k:'Concept', h:'Expression procedures (with evaluation)', code:`double expr() {
    double v = term();
    while (look.type == PLUS || look.type == MINUS) {
        int op = look.type; advance();
        double r = term();
        v = (op == PLUS) ? v + r : v - r;     // left-associative
    }
    return v;
}
double term() {
    double v = factor();
    while (look.type == STAR || look.type == SLASH) {
        int op = look.type; advance();
        double r = factor();
        if (op == SLASH &amp;&amp; r == 0) error("division by zero");
        v = (op == STAR) ? v * r : v / r;
    }
    return v;
}`, tk:'Each procedure returns the value of what it parsed.'},
    {k:'Concept', h:'factor and statements', code:`double factor() {
    switch (look.type) {
      case NUM:   { double v = look.value; advance(); return v; }
      case ID:    { Symbol s = table.lookup(look.lexeme);
                    if (s == null) error("undeclared " + look.lexeme);
                    advance(); return s.value; }
      case LPAREN: advance(); { double v = expr(); match(RPAREN); return v; }
      case MINUS:  advance(); return -factor();
      default:    error("number, id, ( or - expected"); return 0;
    }
}
void stmt() {
    if (look.type == PRINT) { advance(); System.out.println(expr()); match(SEMI); }
    else if (look.type == ID) { String n = look.lexeme; advance(); match(ASSIGN);
                                table.put(n, expr()); match(SEMI); }
    else error("statement expected");
}
void program() { while (look.type != EOF) stmt(); }`, tk:'A working interpreter in about 60 lines.'},
    {k:'Animation', h:'Remember the call sequence', demo:'recdesc', tk:'Same shape, now with values returned.'},
    {k:'Concept', h:'Error messages that help', ic:'🩺', pts:[['📍','Include line (and column): <code>line 4: expected \';\' but found \'print\'</code>.'],['🔎','Say what was expected and what was found.'],['🧭','Mention the construct: "in assignment to x".'],['🏃','Recover (next session) instead of stopping at the first error.']], tk:'Messages are for humans.'},
    {k:'Concept', h:'Testing a parser', ic:'🧪', pts:[['✅','Valid: <code>x = 2 + 3 * 4; print x;</code> → 14'],['✅','Associativity: <code>print 10 - 4 - 3;</code> → 3 (not 9)'],['✅','Unary and parentheses: <code>print -(2 + 3) * 2;</code> → −10'],['❌','Missing operand: <code>print 2 + ;</code>'],['❌','Unbalanced: <code>print (2 + 3;</code>'],['❌','Undeclared: <code>print y;</code>']], tk:'Test precedence, associativity and errors.'},
    {k:'Concept', h:'Try it live', p:'Open <b>Lab tools → Expression → three-address code</b>. It uses the same recursive-descent idea to build an AST, a postfix string and three-address code for any expression you type.', tk:'Compare its tree with your hand-drawn one.'},
    {k:'Concept', h:'From calculator to compiler', ic:'🚀', pts:[['🧮','Today: evaluate during parsing (an interpreter).'],['🌳','Next: return AST nodes instead of values.'],['🧾','Later (Week 14): generate three-address code from the AST.']], tk:'The same parser skeleton grows into a compiler front end.'}
  ],
  lab:{t:'Lab: build the calculator language', steps:['Implement the scanner (reuse Week 4) and the parser from the slides.','Run the six test cases and record results.','Add the % operator at the same level as * and /.','Add exponentiation ^ with right associativity and higher precedence than * (hint: factor → base [ ^ factor ]).','Make every error message include the line number.'], out:'Working program, test log, and the extended grammar.'},
  disc:['Evaluating while parsing vs building an AST first: pros and cons?','How does your parser behave on an empty file?','Where would you add type checking in this design?'],
  mistakes:['Evaluating 10 − 4 − 3 as 9 because of right recursion.','Forgetting match(SEMI) after a statement.','Advancing twice (in the caller and in match).','Crashing on division by zero instead of reporting it.'],
  rev:['Scanner and parser communicate through the lookahead token.','EBNF loops give left associativity and correct precedence.','Procedures can return values (interpreter) or nodes (AST).','Good errors: location, expected vs found.','Test valid inputs, associativity, precedence and errors.'],
  hw:'Complete Assignment 2.',
  quiz:[
    {q:'In the calculator, 10 − 4 − 3 evaluates to…', o:['9','3','17','−3'], a:1, e:'Left-associative: (10 − 4) − 3.'},
    {q:'Where is unary minus handled?', o:['expr','term','factor','stmt'], a:2, e:'It binds tightest.'},
    {q:'Which test checks associativity?', o:['print 2+3*4;','print 10-4-3;','print y;','x = 1;'], a:1, e:'Same operator repeated.'},
    {q:'Returning AST nodes instead of values turns the parser into…', o:['A scanner','A front end that builds a tree for later phases','A linker','An assembler'], a:1, e:'Later phases use the AST.'},
    {q:'A good syntax-error message includes…', o:['Only "error"','Location, expected and found','The whole file','Nothing'], a:1, e:'Helpful messages save time.'}],
  assessment:{ kind:'assignment', title:'Assignment 2 — Recursive-Descent Parser for MiniC Expressions and Statements', covers:'Weeks 5–7: CFGs, ambiguity, left recursion, left factoring, top-down and recursive-descent parsing',
    instructions:['Individual work. Language: C, C++, Java or Python.','You may reuse your Assignment 1 scanner.','Submission date and marks are announced by the instructor.'],
    tasks:['Write an unambiguous grammar for MiniC expressions with || , &amp;&amp; , relational operators, + −, * / %, unary − and !, and parentheses (lowest to highest precedence in that order).','Eliminate left recursion and left-factor the grammar where needed. Show each step.','Add statements: assignment, if/else, while, block { }, and return.','Write the recursive-descent procedures (pseudo-code) for your final grammar.','Implement the parser. It must print the AST (indented) for valid input and a clear error message with line number for invalid input.','Provide 5 valid and 5 invalid test programs with your parser’s output.'],
    submission:['Grammar document (PDF) with transformations.','Source code and a README explaining how to run it.','Test files and output screenshots.'],
    reflection:['Which grammar transformation was most difficult?','How did you preserve left associativity after removing left recursion?'],
    example:`<b>Sample input:</b> <code>while (i &lt; 10) { s = s + i * 2; i = i + 1; }</code><br><b>Sample AST:</b><pre class="code">while
├─ &lt;
│  ├─ i
│  └─ 10
└─ block
   ├─ = s (+ s (* i 2))
   └─ = i (+ i 1)</pre>`,
    note:'Code that is identical to another student’s receives zero for both.' },
  terms:[['Calculator language','A small language of expressions and statements used to practise parsing.'],['Interpreter (in parser)','Evaluating values directly during parsing instead of generating code.'],['Test suite','A set of valid and invalid inputs with expected results.'],['Unary minus','The negation operator −x, applied to one operand.']]
},
/* ================= WEEK 8 ================= */
{ id:15, week:8, unit:'LL(1) parsing', ic:'🎯', lo:[3], book:'Dragon Ch. 4.4.2 · Louden Ch. 4.3',
  title:'Predictive Parsing: FIRST and FOLLOW Sets',
  sub:'Formal definitions and algorithms for FIRST and FOLLOW; worked examples; using them to decide productions.',
  intro:'Predictive parsing needs two sets for every grammar symbol. Get these right and the LL(1) table almost writes itself.',
  obj:['Define FIRST(α) and FOLLOW(A) formally.','Compute FIRST sets for terminals, non-terminals and strings, including ε.','Compute FOLLOW sets with the three rules.','Use FIRST/FOLLOW to choose productions.','Verify answers with the Lab-tools LL(1) builder.'],
  bloom:{head:['<b>State</b> the rules for FIRST and FOLLOW.','<b>Compute</b> both sets for a grammar.','<b>Check</b> results systematically.'],
    heart:['<b>Value</b> careful, rule-by-rule computation.','<b>Gain confidence</b> by verifying with a tool.'],
    hand:['<b>Compute</b> FIRST/FOLLOW on paper for three grammars.','<b>Use</b> the online builder to verify.']},
  slides:[
    {k:'Concept', h:'FIRST — definition', ic:'🎯', p:'<b>FIRST(α)</b> is the set of terminals that begin strings derived from α. If α ⇒* ε, then ε ∈ FIRST(α).', pts:[['1','If X is a terminal, FIRST(X) = {X}.'],['2','If X → ε is a production, add ε to FIRST(X).'],['3','If X → Y₁Y₂…Yₖ: add FIRST(Y₁) − {ε}; if Y₁ ⇒* ε also add FIRST(Y₂) − {ε}; … if all Yᵢ ⇒* ε add ε.']], tk:'Look at the first symbol; if it can vanish, look at the next.'},
    {k:'Animation', h:'Computing FIRST', demo:'first', tk:'Work bottom-up: F, then T′, T, E′, E.'},
    {k:'Concept', h:'FIRST of a string', code:`FIRST(T E′)   = FIRST(T) = { (, id }                 (T cannot vanish)
FIRST(E′ T′)  = (FIRST(E′) − ε) ∪ (FIRST(T′) − ε) ∪ {ε}
              = { +, * , ε }                         (both can vanish)
FIRST(ε)      = { ε }`, tk:'Same rule as for a production body.'},
    {k:'Concept', h:'FOLLOW — definition', ic:'➡️', p:'<b>FOLLOW(A)</b> is the set of terminals a that can appear immediately to the right of A in some sentential form. $ (end marker) is in FOLLOW(S).', pts:[['1','Put $ in FOLLOW(S), S = start symbol.'],['2','If A → αBβ: everything in FIRST(β) except ε is in FOLLOW(B).'],['3','If A → αB, or A → αBβ with ε ∈ FIRST(β): everything in FOLLOW(A) is in FOLLOW(B).']], tk:'Repeat until nothing changes.'},
    {k:'Animation', h:'Computing FOLLOW', demo:'follow', tk:'FOLLOW never contains ε.'},
    {k:'Example', h:'Second example', code:`S → A B
A → a A | ε
B → b B | c

FIRST(A) = { a, ε }       FIRST(B) = { b, c }
FIRST(S) = { a, b, c }    (A can vanish, so FIRST(B) is added)
FOLLOW(S) = { $ }
FOLLOW(A) = FIRST(B) = { b, c }
FOLLOW(B) = FOLLOW(S) = { $ }`, tk:'Notice how ε in FIRST(A) lets FIRST(B) into FIRST(S).'},
    {k:'Example', h:'Third example (statements)', code:`S  → i E t S S′ | a
S′ → e S | ε
E  → b

FIRST(S) = { i, a }   FIRST(S′) = { e, ε }   FIRST(E) = { b }
FOLLOW(S)  = { $, e }      (S′ can start with e; S′ ⇒ ε passes FOLLOW(S))
FOLLOW(S′) = { $, e }
FOLLOW(E)  = { t }`, tk:'This is the dangling-else grammar — watch for e in both sets.'},
    {k:'Concept', h:'Using the sets to predict', code:`To expand A on lookahead a, choose A → α if
   a ∈ FIRST(α),  or
   ε ∈ FIRST(α) and a ∈ FOLLOW(A).`, tk:'Exactly the rule for filling the LL(1) table (next session).'},
    {k:'Concept', h:'Common pitfalls', ic:'⚠️', pts:[['∅','Putting ε into a FOLLOW set (never!).'],['$','Forgetting $ in FOLLOW of the start symbol.'],['🔁','Stopping after one pass — iterate until no set changes.'],['🔗','Forgetting rule 3 when β can derive ε.']], tk:'Iterate to a fixed point.'},
    {k:'Concept', h:'Verify with the tool', p:'Open <b>Lab tools → LL(1) table builder</b>. Paste any grammar (one production per line, ε for empty). It shows FIRST, FOLLOW, the table and conflicts.', tk:'Do it by hand first, then check.'}
  ],
  lab:{t:'Lab: FIRST and FOLLOW drill', steps:['Compute FIRST and FOLLOW for: S → ( L ) | a ; L → S L′ ; L′ → , S L′ | ε.','Compute for: S → A C B | C b B | B a ; A → d a | B C ; B → g | ε ; C → h | ε.','Compute for the expression grammar with − and / added.','Verify all three with the Lab-tools builder and correct any mistakes.'], out:'Hand-computed sets, tool screenshots, and a list of mistakes you fixed.'},
  disc:['Why can FOLLOW never contain ε?','Why must we iterate FOLLOW computations?','How do FIRST sets relate to the transition diagrams of the scanner?'],
  mistakes:['Including ε in FOLLOW.','Taking FIRST of only the first symbol even when it can derive ε.','Forgetting the end marker $.','Confusing FOLLOW(A) with FIRST(A).'],
  rev:['FIRST(α): terminals that can start strings from α (plus ε if α ⇒* ε).','FOLLOW(A): terminals that can follow A; $ ∈ FOLLOW(start).','Rule 2: FIRST(β) − ε ⊆ FOLLOW(B) for A → αBβ.','Rule 3: FOLLOW(A) ⊆ FOLLOW(B) if B is last or β ⇒* ε.','Iterate until no change.'],
  hw:'Compute FIRST/FOLLOW for your Assignment 2 grammar.',
  quiz:[
    {q:'FIRST(id) =', o:['{ε}','{id}','{$}','{}'], a:1, e:'A terminal’s FIRST is itself.'},
    {q:'For E′ → + T E′ | ε, FIRST(E′) =', o:['{+}','{+, ε}','{ε}','{T}'], a:1, e:'Both alternatives.'},
    {q:'$ is always in…', o:['FIRST(S)','FOLLOW(S)','FOLLOW of every terminal','No set'], a:1, e:'End of input follows the start symbol.'},
    {q:'In A → α B β with ε ∈ FIRST(β), FOLLOW(B) includes…', o:['Only FIRST(β)','FIRST(β) − ε and FOLLOW(A)','Only ε','FOLLOW(β)'], a:1, e:'Rules 2 and 3.'},
    {q:'In the expression grammar, FOLLOW(F) =', o:['{ ), $ }','{ +, ), $ }','{ *, +, ), $ }','{ id, ( }'], a:2, e:'F is followed by T′ (which can start with * or vanish).'}],
  terms:[['FIRST set','Terminals that can begin strings derived from a symbol or string; may include ε.'],['FOLLOW set','Terminals that can immediately follow a non-terminal in a sentential form.'],['End marker ($)','A special symbol marking the end of the input.'],['Nullable','A non-terminal or string that can derive ε.'],['Fixed point','The state reached when repeating the rules changes no set.']]
},
{ id:16, week:8, unit:'LL(1) parsing', ic:'📋', lo:[3], book:'Dragon Ch. 4.4.3–4.4.4 · Louden Ch. 4.2–4.3',
  title:'LL(1) Parsing Table, LL(1) Grammars and the Table-Driven Parser',
  sub:'Constructing M[A, a]; the LL(1) condition; conflicts; the non-recursive predictive parser with an explicit stack; tracing id + id * id.',
  intro:'Recursive descent hides the stack inside procedure calls. A <b>table-driven LL(1) parser</b> makes it explicit: a stack, a table and a ten-line driver.',
  obj:['Construct the LL(1) parsing table from FIRST and FOLLOW.','State and check the LL(1) condition.','Identify conflicts and their causes.','Trace the table-driven predictive parser on an input.','Implement the driver loop.'],
  bloom:{head:['<b>Construct</b> M[A, a].','<b>Decide</b> whether a grammar is LL(1).','<b>Trace</b> stack, input and actions.'],
    heart:['<b>Appreciate</b> how theory gives a mechanical, reliable parser.','<b>Value</b> precision in tracing.'],
    hand:['<b>Fill</b> a table and trace a parse by hand.','<b>Implement</b> the driver in code.']},
  slides:[
    {k:'Concept', h:'Table-construction algorithm', code:`for each production A → α:
    for each terminal a in FIRST(α):       add A → α to M[A, a]
    if ε ∈ FIRST(α):
        for each terminal b in FOLLOW(A):  add A → α to M[A, b]
        (this includes $ when $ ∈ FOLLOW(A))
every empty entry = error`, tk:'FIRST fills most cells; FOLLOW fills the ε-productions.'},
    {k:'Animation', h:'Building the table', demo:'ll1table', tk:'One entry per cell → LL(1).'},
    {k:'Concept', h:'The LL(1) condition', ic:'✅', p:'G is LL(1) iff for every pair of productions A → α | β:', pts:[['1','FIRST(α) and FIRST(β) are disjoint.'],['2','At most one of α and β can derive ε.'],['3','If β ⇒* ε, then FIRST(α) and FOLLOW(A) are disjoint (and vice versa).']], tk:'Equivalently: no cell of M has two entries.'},
    {k:'Animation', h:'When a grammar is not LL(1)', demo:'ll1conflict', tk:'Left recursion, common prefixes and ambiguity all cause conflicts.'},
    {k:'Concept', h:'The table-driven predictive parser', ic:'🗄️', pts:[['📥','<b>Input buffer:</b> tokens followed by $.'],['📚','<b>Stack:</b> grammar symbols; initially S on top of $.'],['📋','<b>Table</b> M[A, a].'],['🔁','<b>Driver:</b> looks at the top X and the lookahead a.']], tk:'Stack + table + driver = non-recursive predictive parser.'},
    {k:'Concept', h:'The driver loop', code:`push $; push S;  a = first token;  X = top
while (X != $) {
    if (X == a)            { pop; a = nextToken(); }          // match
    else if (X is terminal) error();
    else if (M[X, a] empty) error();
    else if (M[X, a] = X → Y1 Y2 … Yk) {
        output the production;
        pop; push Yk, …, Y2, Y1;                               // Y1 on top
    }
    X = top;
}
if (a == $) accept;`, tk:'Push the body right-to-left so the leftmost symbol is on top.'},
    {k:'Animation', h:'Tracing id + id * id', demo:'ll1trace', tk:'17 moves; the productions output form a leftmost derivation.'},
    {k:'Concept', h:'Recursive descent vs table-driven', cmp:[['Recursive descent',['Implicit stack (calls)','Grammar in code','Easy semantic actions','Easy custom errors']],['Table-driven LL(1)',['Explicit stack','Grammar in a table','Generated automatically','Uniform error detection (empty cell)']]], tk:'Both recognise exactly the LL(1) languages.'},
    {k:'Concept', h:'Try it', p:'Open <b>Lab tools → LL(1) table builder</b>. The default grammar is today’s grammar. Type <code>id * ( id + id )</code> as input and compare its trace with yours. Then click "Try a left-recursive grammar" to see conflicts in red.', tk:'Tool for checking, not for replacing your understanding.'},
    {k:'Concept', h:'LL(k) and beyond', pts:[['🔭','LL(k) uses k lookahead tokens; tables grow quickly.'],['🧠','ANTLR uses LL(*) — arbitrary lookahead when needed.'],['⬆️','LR parsers (bottom-up) accept more grammars, including left-recursive ones.']], tk:'LL(1) is the sweet spot for hand-written and simple generated parsers.'}
  ],
  lab:{t:'Lab: table and trace', steps:['Build the LL(1) table for S → ( L ) | a ; L → S L′ ; L′ → , S L′ | ε.','Trace the parse of <code>( a , ( a ) )</code> showing stack, input and action.','Build the table for S → i E t S S′ | a ; S′ → e S | ε ; E → b and find the conflict.','Implement the driver loop for the first grammar and run both inputs.'], out:'Two tables, one full trace, conflict explanation, working code.'},
  disc:['Why must the body be pushed in reverse order?','Is every unambiguous grammar LL(1)? Give a counter-example.','Which approach would you choose for a new language and why?'],
  mistakes:['Putting A → ε under FIRST instead of FOLLOW.','Pushing the body left-to-right.','Forgetting to advance the input after a match.','Declaring a grammar LL(1) without checking FOLLOW for ε-productions.'],
  rev:['M[A, a] = A → α for a ∈ FIRST(α); for ε ∈ FIRST(α), for b ∈ FOLLOW(A).','LL(1) iff no cell has two entries.','Driver: match terminals; expand non-terminals using M; push body reversed.','Accept when stack and input both reach $.','Productions output = leftmost derivation.'],
  hw:'Revise Weeks 1–8 for the Midterm. Use the Midterm unit for practice.',
  quiz:[
    {q:'E′ → ε goes into M[E′, a] for each a in…', o:['FIRST(E′)','FOLLOW(E′)','FIRST(T)','All terminals'], a:1, e:'ε-productions use FOLLOW.'},
    {q:'A grammar is LL(1) if…', o:['It has ε','No table cell has more than one production','It is left-recursive','It has two start symbols'], a:1, e:'No conflicts.'},
    {q:'When the top of the stack is a terminal equal to the lookahead, the parser…', o:['Expands','Matches (pops and advances)','Reports error','Accepts'], a:1, e:'Match.'},
    {q:'For T → F T′, the parser pushes…', o:['F then T′ (F on bottom)','T′ then F (F on top)','Only F','Only T′'], a:1, e:'Reverse order so F is processed first.'},
    {q:'Parsing succeeds when…', o:['The stack is empty and input remains','Stack top is $ and lookahead is $','Any error is found','The table is full'], a:1, e:'Both at the end marker.'}],
  terms:[['LL(1) parsing table','Table M[A, a] giving the production to use for non-terminal A on lookahead a.'],['LL(1) grammar','A grammar whose LL(1) table has no multiply-defined entries.'],['Conflict','A table cell with more than one production.'],['Predictive parser (table-driven)','A non-recursive parser using an explicit stack and an LL(1) table.'],['Driver','The generic loop that consults the table and manipulates the stack.']]
},
/* ================= WEEK 9: MIDTERM ================= */
{ id:90, week:9, exam:true, label:'Midterm', short:'Mid', unit:'Midterm examination', ic:'📝', lo:[1,2,3],
  title:'Midterm Revision & Mock Examination',
  sub:'Weeks 1–8 revision: phases, lexical analysis, regular expressions, automata, scanners, symbol table, grammars, top-down, recursive-descent and LL(1) parsing — with a mock exam and model answers.',
  assess:'Mid-Term',
  intro:'The midterm covers Weeks 1–8. Use this unit to revise each topic, practise the algorithms by hand and attempt a full mock exam. The official format, time and marks are announced by your instructor.',
  obj:['Recall definitions from Weeks 1–8.','Apply Thompson’s construction and the subset construction.','Transform grammars (left recursion, left factoring).','Compute FIRST/FOLLOW, build an LL(1) table and trace a parse.','Answer conceptual and numerical questions under time pressure.'],
  bloom:{head:['<b>Recall</b> definitions and rules.','<b>Apply</b> the algorithms to new examples.','<b>Analyze</b> grammars for LL(1) conflicts.'],
    heart:['<b>Manage</b> exam stress with a plan.','<b>Reflect</b> honestly on weak topics.'],
    hand:['<b>Solve</b> a timed mock exam.','<b>Mark</b> your own answers with the model solutions.']},
  slides:[
    {k:'Revision', h:'Midterm map', demo:'midreview', tk:'Eight weeks, one pipeline: characters → tokens → tree.'},
    {k:'Revision', h:'Week 1 in one slide', pts:[['⚙️','Compiler vs interpreter vs hybrid (bytecode + JIT).'],['🔗','Pre-processor → compiler → assembler → linker → loader.'],['🧱','Phases: lexical, syntax, semantic, IR, optimisation, code gen + symbol table + error handler.'],['↔️','Front end (source-dependent) / back end (target-dependent), m + n instead of m × n.']], tk:'Be able to trace position = initial + rate * 60.'},
    {k:'Revision', h:'Weeks 2–4: lexical analysis', pts:[['🔤','Token / pattern / lexeme / attribute.'],['📦','Two-buffer scheme with sentinels.'],['📐','REs: | concatenation *, precedence; regular definitions.'],['🤖','NFA vs DFA; Thompson; ε-closure, move, subset construction.'],['🗺️','Transition diagrams, retract (*), keywords vs ids.'],['🛠️','Hand-coded vs table-driven vs generated (Lex) scanners.']], tk:'Practise RE → NFA → DFA at least twice.'},
    {k:'Revision', h:'Weeks 5–8: syntax analysis', pts:[['📒','Symbol table: hashing, scopes.'],['📐','CFG, derivations, parse trees, ambiguity, precedence & associativity.'],['🔧','Left recursion: A → βA′, A′ → αA′ | ε; left factoring.'],['🌀','Recursive descent: procedure per non-terminal, match().'],['🎯','FIRST, FOLLOW, LL(1) table, driver trace.']], tk:'Practise one full LL(1) problem from grammar to trace.'},
    {k:'Animation', h:'Algorithm check: subset construction', demo:'subset', tk:'Can you produce this table without looking?'},
    {k:'Animation', h:'Algorithm check: LL(1) table', demo:'ll1table', tk:'FIRST for normal entries, FOLLOW for ε.'},
    {k:'Concept', h:'Exam strategy', ic:'🧭', pts:[['⏱️','Read the whole paper first; start with what you know best.'],['✍️','Show every step of an algorithm — partial credit comes from steps.'],['🔍','Check: ε in FOLLOW? Body pushed in reverse? Accepting DFA states marked?'],['🧘','Sleep well; revise from your own notes and the flashcards.']], tk:'Steps earn marks.'}
  ],
  lab:{t:'Activity: timed mock exam', steps:['Set a timer for the time your instructor announces.','Attempt Parts A–D below without notes.','Mark your answers using the explanations and model answers.','List the three topics where you lost most marks and revise them from the session notes.'], out:'Self-marked mock exam + a short revision plan.'},
  disc:['Which algorithm do you find hardest and why?','Explain to a partner how LL(1) parsing works using only the stack trace.'],
  mistakes:['Leaving algorithm questions blank — write what you can.','Mixing NFA and DFA definitions.','Forgetting $ and ε rules in FIRST/FOLLOW.','Drawing parse trees with terminals as interior nodes.'],
  rev:['Know the phases and the language-processing system.','Tokens, REs, NFA/DFA conversions, scanners.','Symbol table and scopes.','CFGs, ambiguity, grammar transformations.','Recursive descent, FIRST/FOLLOW, LL(1) table and trace.'],
  hw:'Attempt the mock exam again after one day and compare scores.',
  quiz:[
    {q:'Which tool converts assembly to relocatable machine code?', o:['Linker','Assembler','Loader','Pre-processor'], a:1, e:'Assembler.'},
    {q:'ε-closure is used in…', o:['LL(1) tables','Subset construction','Backpatching','Linking'], a:1, e:'NFA → DFA.'},
    {q:'Which removes common prefixes?', o:['Left recursion elimination','Left factoring','Hashing','Retracting'], a:1, e:'Left factoring.'},
    {q:'FOLLOW sets are needed for…', o:['Non-ε productions only','ε-productions in the LL(1) table','Lexing','Hashing'], a:1, e:'They place A → ε.'},
    {q:'A grammar with a conflict in its LL(1) table is…', o:['LL(1)','Not LL(1)','Regular','Always ambiguous'], a:1, e:'Not LL(1) (it may still be unambiguous).'}],
  assessment:{ kind:'exam', title:'Midterm Mock Examination (Weeks 1–8)', covers:'All topics from Weeks 1–8',
    instructions:['Attempt all questions.','Show working for every algorithm.','Official time and marks are announced by the instructor.'],
    mcq:[
      {q:'A compiler that translates TypeScript into JavaScript is a…', o:['Source-to-source compiler','Assembler','Loader','Interpreter'], a:0, e:'Also called a transpiler.'},
      {q:'Which phase builds the parse tree?', o:['Lexical','Syntax','Semantic','Code generation'], a:1, e:'The parser.'},
      {q:'The lexeme of token ⟨num, 60⟩ is…', o:['num','60','an attribute','$'], a:1, e:'The actual text.'},
      {q:'(a|b)*abb — which string is accepted?', o:['aabb','abba','abbb','bab'], a:0, e:'Ends with abb.'},
      {q:'How many states does the minimised DFA for (a|b)*abb have?', o:['3','4','5','11'], a:1, e:'Subset construction gives 5; A and C merge.'},
      {q:'Which is the most suitable data structure for a symbol table?', o:['Stack only','Hash table','Queue','Binary heap'], a:1, e:'O(1) average lookup.'},
      {q:'E → E + T | T is…', o:['Right-recursive','Left-recursive','Ambiguous','Not context-free'], a:1, e:'E appears first in its own body.'},
      {q:'In the expression grammar, M[T′, +] =', o:['T′ → * F T′','T′ → ε','error','T → F T′'], a:1, e:'+ ∈ FOLLOW(T′).'}],
    tf:[
      {q:'An interpreter produces an object file.', a:false, e:'It executes directly.'},
      {q:'Every DFA state built by subset construction is a set of NFA states.', a:true, e:'By construction.'},
      {q:'Left factoring removes ambiguity.', a:false, e:'It only delays decisions.'},
      {q:'A recursive-descent parser has one procedure per non-terminal.', a:true, e:'The defining property.'},
      {q:'FOLLOW sets may contain ε.', a:false, e:'Never.'}],
    short:[
      {q:'Explain input buffering with sentinels.', a:'The input is read in blocks into two buffer halves; each half ends with a sentinel eof. lexemeBegin marks the start of the lexeme, forward scans ahead. Only when eof is read do we check whether it marks the end of a half (reload the other half) or the real end of input, so normally one test per character is enough.'},
      {q:'Eliminate left recursion: A → A c | A a d | b d | ε.', a:'A → b d A′ | A′; A′ → c A′ | a d A′ | ε.'},
      {q:'Give FIRST and FOLLOW for S → a B D h; B → c C; C → b C | ε; D → E F; E → g | ε; F → f | ε.', a:'FIRST: S{a}, B{c}, C{b,ε}, D{g,f,ε}, E{g,ε}, F{f,ε}. FOLLOW: S{$}, B{g,f,h}, C{g,f,h}, D{h}, E{f,h}, F{h}.'}],
    app:[
      {q:'Convert the regular expression ab*|c to an NFA (Thompson) and then to a DFA.', a:'NFA: a: 1 −a→ 2. b*: 3 −ε→ 4, 4 −b→ 5, 5 −ε→ 4, 5 −ε→ 6, 3 −ε→ 6. Concatenation: 2 −ε→ 3. c: 7 −c→ 8. Union: 0 −ε→ 1, 0 −ε→ 7, 6 −ε→ 9, 8 −ε→ 9; start 0, final 9. DFA: A = ε-closure({0}) = {0,1,7}; A −a→ B = {2,3,4,6,9} (accepting); A −c→ C = {8,9} (accepting); B −b→ D = {4,5,6,9} (accepting); D −b→ D. (State numbers may differ; the structure must match.)'},
      {q:'For S → ( L ) | a, L → L , S | S: remove left recursion, compute FIRST/FOLLOW, build the LL(1) table and parse ( a , a ).', a:'L → S L′, L′ → , S L′ | ε. FIRST(S)=FIRST(L)={(, a}, FIRST(L′)={, , ε}. FOLLOW(S)={$, , , )}, FOLLOW(L)=FOLLOW(L′)={ )}. Table: M[S,(]=S→(L), M[S,a]=S→a, M[L,(]=M[L,a]=L→S L′, M[L′, ,]=L′→, S L′, M[L′, )]=L′→ε. Trace: S$ → (L)$ → match ( → S L′)$ → a L′)$ → match a → , S L′)$ → match , → a L′)$ → match a → L′→ε → match ) → accept.'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Midterm','The Week 9 examination covering Weeks 1–8.']]
}
);
