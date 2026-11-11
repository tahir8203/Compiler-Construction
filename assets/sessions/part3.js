/* Sessions 17–24 (Weeks 10–13). Content only. */
COURSE.sessions.push(
/* ================= WEEK 10 ================= */
{ id:17, week:10, unit:'LL(1) parsing', ic:'🧑‍💻', lo:[3], book:'Louden Ch. 4.2–4.3 · Dragon Ch. 4.4.4',
  title:'LL(1) Parsing: Implementation',
  sub:'Representing grammars in code, computing FIRST/FOLLOW programmatically, generating the table, the driver with parse-tree building, and resolving the dangling-else conflict.',
  intro:'After the midterm we turn the paper algorithm into a program: read a grammar, compute the sets, build the table, and parse — the same pipeline the Lab-tools builder uses.',
  obj:['Represent productions, terminals and non-terminals as data.','Implement fixed-point algorithms for FIRST and FOLLOW.','Generate the LL(1) table and detect conflicts.','Extend the driver to build a parse tree.','Resolve a known conflict (dangling else) deliberately.'],
  bloom:{head:['<b>Design</b> data structures for grammars.','<b>Implement</b> fixed-point computations.','<b>Analyze</b> conflicts reported by the generator.'],
    heart:['<b>Value</b> automation that removes human error.','<b>Show curiosity</b> by testing the generator on new grammars.'],
    hand:['<b>Code</b> a small LL(1) parser generator.','<b>Run</b> it on two grammars and compare with hand results.']},
  slides:[
    {k:'Concept', h:'Grammar as data', code:`productions = [
  ("E",  ["T", "E'"]),
  ("E'", ["+", "T", "E'"]), ("E'", []),        # [] = ε
  ("T",  ["F", "T'"]),
  ("T'", ["*", "F", "T'"]), ("T'", []),
  ("F",  ["(", "E", ")"]),  ("F",  ["id"]) ]
nonterminals = {head for head, _ in productions}
terminals    = {s for _, b in productions for s in b} - nonterminals`, tk:'A list of (head, body) pairs is enough.'},
    {k:'Concept', h:'FIRST as a fixed point', code:`FIRST = {A: set() for A in nonterminals}
def first_seq(seq):
    out = set()
    for X in seq:
        if X not in nonterminals: out.add(X); return out
        out |= FIRST[X] - {"ε"}
        if "ε" not in FIRST[X]: return out
    out.add("ε"); return out
changed = True
while changed:
    changed = False
    for A, body in productions:
        new = first_seq(body)
        if not new &lt;= FIRST[A]: FIRST[A] |= new; changed = True`, tk:'Repeat until no set grows.'},
    {k:'Concept', h:'FOLLOW as a fixed point', code:`FOLLOW = {A: set() for A in nonterminals}; FOLLOW[start].add("$")
changed = True
while changed:
    changed = False
    for A, body in productions:
        for i, B in enumerate(body):
            if B not in nonterminals: continue
            f = first_seq(body[i+1:])
            add = (f - {"ε"}) | (FOLLOW[A] if "ε" in f else set())
            if not add &lt;= FOLLOW[B]: FOLLOW[B] |= add; changed = True`, tk:'Rules 2 and 3 in eight lines.'},
    {k:'Concept', h:'Generating the table and conflicts', code:`M = {}
for k, (A, body) in enumerate(productions):
    f = first_seq(body)
    targets = (f - {"ε"}) | (FOLLOW[A] if "ε" in f else set())
    for a in targets:
        if (A, a) in M and M[(A, a)] != k:
            report_conflict(A, a, M[(A, a)], k)
        M[(A, a)] = k`, tk:'Any second write to a cell is a conflict.'},
    {k:'Animation', h:'The driver at work', demo:'ll1trace', tk:'Same driver as Week 8.'},
    {k:'Concept', h:'Building a parse tree in the driver', code:`stack = [("$", None), (start, root)]
while stack[-1][0] != "$":
    X, node = stack.pop()
    if X == look: node.token = look; advance()
    elif X in nonterminals and (X, look) in M:
        A, body = productions[M[(X, look)]]
        kids = [Node(Y) for Y in body] or [Node("ε")]
        node.children = kids
        for Y, child in reversed(list(zip(body, kids))): stack.append((Y, child))
    else: syntax_error(X, look)`, tk:'Push (symbol, node) pairs; fill children when expanding.'},
    {k:'Animation', h:'Resolving the dangling-else conflict', demo:'ll1conflict', tk:'Keep S′ → e S in M[S′, e]: else binds to the closest if.'},
    {k:'Concept', h:'Testing the generator', pts:[['✅','Expression grammar → no conflicts; parse id * ( id + id ).'],['❌','Left-recursive grammar → conflicts reported.'],['⚠️','Dangling-else grammar → exactly one conflict at M[S′, e].'],['🧪','Compare every result with <b>Lab tools → LL(1) builder</b>.']], tk:'A generator must report conflicts, not hide them.'},
    {k:'Concept', h:'Parser generators in industry', pts:[['🧰','<b>ANTLR</b>: LL(*) parser generator (Java, Python, C#, JS targets).'],['🐂','<b>Yacc / Bison</b>: LALR(1) bottom-up generators.'],['🌳','<b>Tree-sitter</b>: incremental GLR parsing for editors (syntax highlighting in GitHub, Neovim).']], tk:'You now understand what these tools do inside.'}
  ],
  lab:{t:'Lab: mini LL(1) generator', steps:['Implement the grammar representation, FIRST, FOLLOW and table generation from the slides.','Print the table and any conflicts.','Implement the driver and parse <code>id + id * id</code> and <code>( id + id ) * id</code>.','Feed it the dangling-else grammar and resolve the conflict by preferring S′ → e S.','Verify everything with the Lab-tools builder.'], out:'Working generator, printed tables, two traces and conflict report.'},
  disc:['Why must FIRST and FOLLOW be computed with loops until nothing changes?','Should a generator ever resolve conflicts silently?','How would you print a helpful error when M[X, a] is empty?'],
  mistakes:['Stopping the fixed-point loop after one pass.','Representing ε as an ordinary terminal in the table.','Pushing children in the wrong order when building the tree.','Ignoring conflicts reported by the generator.'],
  rev:['Grammars are data: lists of (head, body).','FIRST and FOLLOW are fixed-point computations.','The table generator detects conflicts automatically.','The driver can build a parse tree by pushing (symbol, node) pairs.','Some conflicts (dangling else) are resolved deliberately.'],
  hw:'Read Dragon §4.1.3–4.1.4 and §4.4.5 on error recovery.',
  quiz:[
    {q:'Fixed-point iteration stops when…', o:['After one pass','No set changes during a pass','The table is empty','An error occurs'], a:1, e:'Then all sets are complete.'},
    {q:'A conflict is detected when…', o:['A cell receives a second, different production','The grammar has ε','FOLLOW contains $','FIRST is empty'], a:0, e:'Two entries in one cell.'},
    {q:'To resolve the dangling else in LL(1), keep in M[S′, e]…', o:['S′ → ε','S′ → e S','both','neither'], a:1, e:'else matches the closest if.'},
    {q:'ANTLR generates…', o:['LL(*) parsers','Linkers','DFAs only','Assemblers'], a:0, e:'Adaptive LL(*).'},
    {q:'When expanding A → B C in the tree-building driver, which is pushed last (on top)?', o:['C','B','A','$'], a:1, e:'B must be processed first.'}],
  terms:[['Parser generator','A tool that builds a parser from a grammar specification.'],['ANTLR','A widely used LL(*) parser generator.'],['Yacc/Bison','LALR(1) bottom-up parser generators.'],['Conflict resolution','Choosing one production when a table cell has several, e.g. for dangling else.']]
},
{ id:18, week:10, unit:'Error handling', ic:'🩹', lo:[3], book:'Dragon Ch. 4.1.3–4.1.4 · Louden Ch. 4.5',
  title:'Error Finding and Recovery',
  sub:'Types of errors, the viable-prefix property, error-recovery strategies (panic mode, phrase level, error productions, global correction), and error recovery in recursive-descent parsers.',
  intro:'Most programs a compiler sees contain errors — they are being written! A good parser finds errors early, explains them clearly and keeps going to find the next ones.',
  obj:['Classify programming errors by phase.','Explain the viable-prefix property of LL parsers.','Describe four error-recovery strategies with examples.','Implement panic-mode recovery in a recursive-descent parser using synchronising tokens.','Avoid cascades of spurious error messages.'],
  bloom:{head:['<b>Classify</b> errors.','<b>Compare</b> recovery strategies.','<b>Design</b> synchronising sets for statements.'],
    heart:['<b>Empathise</b> with programmers reading error messages.','<b>Value</b> robustness over perfection.'],
    hand:['<b>Add</b> recovery to the Week 7 parser.','<b>Test</b> it with programs containing several errors.']},
  slides:[
    {k:'Animation', h:'Which phase finds which error?', demo:'errorsPhases', tk:'Most compile-time errors are syntactic.'},
    {k:'Concept', h:'The viable-prefix property', ic:'⏱️', p:'LL and LR parsers detect an error <b>as soon as</b> the input read so far cannot be the prefix of any valid program. The error is reported at the first wrong token, not later.', ex:'<code>x = (a + b * ;</code> — the error is detected at <code>;</code> because <code>(a + b *</code> is still a valid prefix.', tk:'Early detection = accurate error positions.'},
    {k:'Concept', h:'Goals of the error handler', pts:[['📣','Report the presence of errors clearly and accurately.'],['🏃','Recover quickly to detect later errors.'],['🚫','Avoid cascades of spurious errors.'],['⚡','Add little overhead to correct programs.']], tk:'Report, recover, avoid noise, stay fast.'},
    {k:'Animation', h:'Four recovery strategies', demo:'errstrat', tk:'Panic mode is the workhorse; phrase level adds polish.'},
    {k:'Concept', h:'Panic mode in recursive descent', code:`void stmt() {
    try { ...normal parsing... }
    catch (SyntaxError e) {
        report(e);
        // skip tokens until a synchronising token
        while (look != ';' &amp;&amp; look != '}' &amp;&amp; look != EOF) advance();
        if (look == ';') advance();      // consume it and continue with next stmt
    }
}`, tk:'Synchronise on statement terminators.'},
    {k:'Concept', h:'Choosing synchronising tokens', ic:'🎯', pts:[['🔚','FOLLOW(A): tokens that can follow the construct being parsed.'],['🏁','FIRST(A): restart A if its first token appears.'],['🔑','Keywords that begin statements: if, while, return, {.'],['⛔','Delimiters: ; and } are the classic choices.']], tk:'Good synch sets = few lost tokens, few cascades.'},
    {k:'Concept', h:'Phrase-level recovery examples', code:`x = a + b          ← missing ';'   : insert ';' and continue
for (i = 0, i &lt; n; i++)  ← ',' for ';' : replace with ';'
if x &gt; 0 { … }      ← missing '(' : error production / insert`, tk:'Make a local fix, then continue normally.'},
    {k:'Concept', h:'Error productions', ic:'📏', p:'Add grammar rules for common mistakes so that the parser recognises them and gives a specific message.', code:`stmt → if expr stmt          { error("missing parentheses around if condition"); }
     | if ( expr ) stmt …`, tk:'Anticipate the errors your users actually make.'},
    {k:'Concept', h:'Avoiding cascades', ic:'🌊', pts:[['🔇','After an error, suppress further messages until several tokens are matched successfully.'],['🧮','Limit the total number of messages (e.g. 20).'],['🏷️','Insert a dummy "error" node in the AST so later phases do not report the same problem.']], tk:'One mistake → one message.'},
    {k:'Example', h:'Good vs bad messages', cmp:[['Bad',['syntax error','unexpected token','error at line 0']],['Good',['line 7: expected \';\' after expression','line 9: unmatched \'(\' opened at line 8','line 12: \'whlie\' is not a keyword — did you mean \'while\'?']]], tk:'Say where, what was expected, and suggest a fix.'}
  ],
  lab:{t:'Lab: add panic-mode recovery', steps:['Take your Week 7/Assignment 2 parser.','Wrap stmt() parsing in error handling that skips to ; or }.','Test with a program containing three errors on different lines.','Make sure all three are reported and no extra (cascade) messages appear.','Add one phrase-level fix: insert a missing ; and continue.'], out:'Modified parser, test program and output listing exactly three errors.'},
  disc:['Is it better to stop at the first error or report many? Why?','Global correction gives the "best" fix. Why is it not used?','How do modern IDEs show errors while you are still typing?'],
  mistakes:['Skipping tokens forever because EOF is not a synch token.','Choosing synch tokens that rarely appear.','Printing one error per skipped token.','Inserting tokens in a way that can loop infinitely.'],
  rev:['Errors: lexical, syntactic, semantic, logical.','Viable-prefix property: errors detected at the first wrong token.','Strategies: panic mode, phrase level, error productions, global correction.','Synch tokens from FOLLOW, FIRST, keywords and delimiters.','Avoid cascades: suppress, limit, error nodes.'],
  hw:'Read Dragon §4.4.5. Design synch sets for every non-terminal of the expression grammar.',
  quiz:[
    {q:'Panic-mode recovery…', o:['Skips input until a synchronising token','Rewrites the grammar','Stops compiling','Finds the minimum correction'], a:0, e:'Simple and safe.'},
    {q:'Which tokens are typical synchronising tokens for statements?', o:['; and }','+ and *','id and num','( only'], a:0, e:'Statement delimiters.'},
    {q:'Inserting a missing ; is an example of…', o:['Panic mode','Phrase-level recovery','Global correction','Lexical analysis'], a:1, e:'A local fix.'},
    {q:'Global correction is rarely used because…', o:['It is too expensive','It is too simple','It is illegal','It needs no grammar'], a:0, e:'Costly in time and space.'},
    {q:'The viable-prefix property means errors are detected…', o:['At the end of the file','At the first token that cannot continue a valid prefix','Only at run time','Never'], a:1, e:'As early as possible.'}],
  terms:[['Panic mode','Recovery by discarding tokens until a synchronising token is found.'],['Phrase-level recovery','Local correction of the input (insert, delete, replace a token).'],['Error production','A grammar rule for a common mistake, used to give a specific message.'],['Global correction','Finding a minimal set of changes that makes the program valid.'],['Synchronising token','A token used to resume parsing after an error.'],['Viable prefix','A prefix of the input that can be extended to a valid program.'],['Error cascade','A series of spurious errors caused by one real error.']]
},
/* ================= WEEK 11 ================= */
{ id:19, week:11, unit:'Error handling', ic:'🧯', lo:[3], book:'Dragon Ch. 4.4.5 · Louden Ch. 4.5',
  title:'Error Recovery in LL(1) Parsers',
  sub:'Panic mode with synch entries in the LL(1) table; the three recovery actions; tracing recovery; phrase-level recovery with error routines in blank cells.',
  intro:'In a table-driven LL(1) parser, every blank cell means "error". Today we fill some of those blanks with <b>synch</b> and error routines so the parser can recover.',
  obj:['Add synch entries to an LL(1) table using FOLLOW sets.','Apply the three panic-mode rules (skip, pop non-terminal, pop terminal).','Trace recovery on erroneous input.','Describe phrase-level recovery with error routines in blank cells.','Begin the transition to semantic analysis.'],
  bloom:{head:['<b>Apply</b> synch rules to a table.','<b>Trace</b> recovery step by step.','<b>Evaluate</b> how many errors are reported.'],
    heart:['<b>Persevere</b> through long traces.','<b>Value</b> predictable, well-defined recovery.'],
    hand:['<b>Extend</b> the LL(1) driver with recovery.','<b>Run</b> it on erroneous input.']},
  slides:[
    {k:'Concept', h:'Adding synch entries', ic:'🧷', p:'For each non-terminal A, put <b>synch</b> in M[A, a] for every a ∈ FOLLOW(A) whose cell is empty. Optionally also for tokens in FIRST(A) or keywords that start statements.', code:`        id      +       *       (       )       $
E    E→TE′                    E→TE′   synch   synch
E′           E′→+TE′                  E′→ε    E′→ε
T    T→FT′   synch            T→FT′   synch   synch
T′           T′→ε    T′→*FT′          T′→ε    T′→ε
F    F→id    synch   synch    F→(E)   synch   synch`, tk:'synch cells come from FOLLOW sets.'},
    {k:'Concept', h:'The three recovery rules', ic:'📏', pts:[['⏭️','<b>Blank</b> M[A, a]: skip the input token a (report "unexpected a").'],['⬆️','<b>synch</b> M[A, a]: pop A (pretend A was found) and continue. If A is the start symbol and a is not $, skip instead.'],['🔤','<b>Terminal on top</b> does not match: pop it (pretend it was inserted) and report "missing …".']], tk:'Skip, pop non-terminal, or pop terminal.'},
    {k:'Animation', h:'Tracing recovery on id * + id', demo:'panic', tk:'One error reported, parsing continues to the end.'},
    {k:'Example', h:'A second trace: ) id * + id', code:`Stack        Input            Action
E $          ) id * + id $    error: M[E, )] = synch, but E is start → skip )
E $          id * + id $      E → T E′
…            …                (continues exactly as the previous trace)
             + id $           error: M[F, +] = synch → pop F
…                             accept, 2 errors reported`, tk:'Recovery always makes progress: it pops or skips.'},
    {k:'Concept', h:'Why panic mode cannot loop', ic:'♾️', p:'Each recovery action either consumes an input token or pops a stack symbol. The stack can only grow by expansions that are triggered by matching table entries, so the parser always terminates.', tk:'Progress guarantee.'},
    {k:'Concept', h:'Phrase-level recovery in LL(1)', ic:'🔧', p:'Fill blank cells with pointers to <b>error routines</b> that may insert, delete or change symbols and print a specific message.', code:`M[F, +] → e1: "operand missing" — push id (pretend an id was read)
M[E, )]  → e2: "unbalanced right parenthesis" — skip )`, tk:'Routines must not cause infinite loops (e.g. never insert forever).'},
    {k:'Concept', h:'Recovery in recursive descent with synch sets', code:`void F(Set synch) {
    if (look == ID) match(ID);
    else if (look == '(') { match('('); E(synch ∪ {')'}); match(')'); }
    else { error("operand expected"); skipUntil(FIRST(F) ∪ synch); }
}`, tk:'Pass synch sets down as parameters.'},
    {k:'Concept', h:'From syntax to meaning', ic:'🧠', p:'A program can be syntactically perfect and still wrong: <code>int x = "hello";</code>. From the next session we attach <b>attributes</b> and <b>semantic rules</b> to the grammar to check and translate meaning.', tk:'Next: semantic analysis.'}
  ],
  lab:{t:'Lab: recovery in your LL(1) driver', steps:['Add synch entries to the table of your Week 10 generator using FOLLOW sets.','Implement the three rules in the driver.','Trace and run: <code>id * + id</code>, <code>) id * + id</code>, <code>( id + * id</code>.','Count the errors reported and compare with your hand trace.'], out:'Updated driver and three annotated traces.'},
  disc:['Why use FOLLOW(A) as the synch set of A?','When could panic mode skip a large part of the program?','How do synch sets in LL(1) relate to try/catch recovery in recursive descent?'],
  mistakes:['Popping the start symbol on synch when input remains (skip instead).','Putting synch in a cell that already has a production.','Forgetting to report the error before recovering.','Inserting tokens in error routines without guaranteeing progress.'],
  rev:['synch entries go in empty cells for FOLLOW(A).','Blank → skip token; synch → pop A; terminal mismatch → pop terminal.','Recovery always pops or skips, so it terminates.','Phrase-level recovery puts error routines in blank cells.','Next: semantic analysis with attributes.'],
  hw:'Prepare for Quiz 3 (Weeks 8–11). Read Dragon §5.1.',
  quiz:[
    {q:'synch entries are placed using…', o:['FIRST sets','FOLLOW sets','The symbol table','Regular expressions'], a:1, e:'FOLLOW(A) for non-terminal A.'},
    {q:'On a synch entry the parser…', o:['Skips the input token','Pops the non-terminal','Accepts','Pushes $'], a:1, e:'Pretend A was found.'},
    {q:'On a blank entry the parser…', o:['Pops the non-terminal','Skips the input token','Accepts','Stops'], a:1, e:'Discard the unexpected token.'},
    {q:'Panic-mode recovery always terminates because…', o:['It is random','Each action pops or skips','It has no stack','It never runs'], a:1, e:'Progress each step.'},
    {q:'In the trace for id * + id, the error is detected with F on top and lookahead…', o:['id','+','*','$'], a:1, e:'M[F, +] = synch.'}],
  terms:[['synch entry','An LL(1) table entry telling the parser to pop the non-terminal during recovery.'],['Error routine','Code in a blank table cell that performs phrase-level recovery.'],['Synchronising set','Tokens used to resume parsing, often FOLLOW(A).']]
},
{ id:20, week:11, unit:'Semantic analysis', ic:'🏷️', lo:[4], book:'Dragon Ch. 5.1 · Louden Ch. 6.1',
  title:'Semantic Analysis and Syntax-Directed Definitions',
  sub:'What semantic analysis checks; attributes and semantic rules; syntax-directed definitions (SDDs) and attribute grammars; annotated parse trees; attribute computation.',
  assess:'Quiz-3',
  intro:'The parser tells us <i>how</i> the program is structured. Semantic analysis asks: does it make <i>sense</i>? We answer by attaching <b>attributes</b> to grammar symbols and <b>rules</b> to productions.',
  obj:['List the checks done by semantic analysis.','Define attributes, semantic rules and syntax-directed definitions.','Distinguish an SDD from an attribute grammar.','Draw an annotated parse tree and compute attribute values.','Write an SDD for a desk calculator.'],
  bloom:{head:['<b>Define</b> SDD, attribute and semantic rule.','<b>Compute</b> attribute values on a parse tree.','<b>Write</b> semantic rules for simple constructs.'],
    heart:['<b>Appreciate</b> how meaning is attached to structure.','<b>Value</b> formal rules as documentation.'],
    hand:['<b>Annotate</b> parse trees by hand.','<b>Implement</b> the desk-calculator SDD.']},
  slides:[
    {k:'Concept', h:'What semantic analysis checks', ic:'🧐', pts:[['🔠','<b>Type checking:</b> operands compatible, coercions inserted.'],['📒','<b>Declarations:</b> declared before use, not declared twice in one scope.'],['🔁','<b>Flow-of-control:</b> break only inside a loop; return type matches.'],['🔢','<b>Arity:</b> number and types of arguments match parameters.'],['🏷️','<b>Uniqueness:</b> case labels distinct, enum names unique.']], tk:'Static checks done at compile time.'},
    {k:'Concept', h:'Attributes and semantic rules', ic:'🏷️', p:'An <b>attribute</b> is a value attached to a grammar symbol: a number, a type, a string of code, a symbol-table pointer. A <b>semantic rule</b> attached to a production says how to compute attributes.', code:`Production        Semantic rule
E → E1 + T        E.val = E1.val + T.val
F → digit         F.val = digit.lexval`, tk:'Attributes = data; rules = how to compute it.'},
    {k:'Concept', h:'Syntax-directed definition (SDD)', ic:'📜', p:'An <b>SDD</b> is a context-free grammar together with attributes and semantic rules. An SDD whose rules have <b>no side effects</b> is an <b>attribute grammar</b>.', pts:[['📄','Side effect example: print(E.val), addType(id.entry, T.type).'],['🧮','Pure example: E.val = E1.val + T.val.']], tk:'SDD = grammar + attributes + rules.'},
    {k:'Concept', h:'SDD for a desk calculator', code:`Production          Semantic rules
L → E n             print(E.val)                 (n = end of line)
E → E1 + T          E.val = E1.val + T.val
E → T               E.val = T.val
T → T1 * F          T.val = T1.val × F.val
T → F               T.val = F.val
F → ( E )           F.val = E.val
F → digit           F.val = digit.lexval`, tk:'Subscripts (E1, T1) distinguish repeated symbols.'},
    {k:'Animation', h:'Annotated parse tree for 3 * 5 + 4 n', demo:'sddtree', tk:'Values flow up the tree.'},
    {k:'Concept', h:'Annotated parse tree', ic:'🌳', p:'A parse tree showing the value of each attribute at each node. To <b>annotate</b> (decorate) a tree is to compute those values.', tk:'Order matters: a value can only be computed after the values it depends on.'},
    {k:'Concept', h:'Synthesized vs inherited (preview)', demo:'attrkinds', tk:'Synthesized: up. Inherited: down/sideways.'},
    {k:'Concept', h:'Attribute computation', ic:'⚙️', pts:[['⬆️','For synthesized-only SDDs: evaluate in any bottom-up (post-order) traversal.'],['🔀','With inherited attributes: build a dependency graph and find an order (next week).'],['🔄','Some SDDs have circular dependencies → no evaluation order; avoid them.']], tk:'Order is determined by dependencies.'},
    {k:'Example', h:'SDD for counting', code:`Grammar of binary numbers with value and length:
N → N1 b      N.val = 2 × N1.val + b.val ;   N.len = N1.len + 1
N → b         N.val = b.val ;                N.len = 1
b → 0 | 1     b.val = 0 | 1

Input 101 → val = 5, len = 3`, tk:'Several attributes can live on the same symbol.'},
    {k:'Concept', h:'Try it live', p:'<b>Lab tools → Expression translator</b> uses synthesized attributes (addr, code) to build three-address code for an expression — the same idea you will use in Week 14.', tk:'Attributes power translation as well as checking.'}
  ],
  lab:{t:'Lab: annotate and implement', steps:['Draw annotated parse trees for <code>(3 + 4) * (5 + 6) n</code> and <code>1 * 2 * 3 * (4 + 5) n</code>.','Implement the desk-calculator SDD inside your recursive-descent parser (each procedure returns val).','Write an SDD that computes the number of + operators in an expression.','Write an SDD that converts binary numbers to decimal (slide example).'], out:'Two annotated trees, code, two SDDs with one tested input each.'},
  disc:['Why are side effects (like print) allowed in SDDs but not in attribute grammars?','Which semantic checks would you add to MiniC?','Is type checking possible in a dynamically typed language at compile time?'],
  mistakes:['Writing semantic rules that refer to symbols not in the production.','Forgetting subscripts when a symbol appears twice.','Computing a parent before its children in an S-attributed SDD.','Thinking semantic analysis re-reads the source text.'],
  rev:['Semantic analysis checks types, declarations, control flow and arity.','Attributes attach values to symbols; semantic rules compute them.','SDD = grammar + attributes + rules; attribute grammar = SDD without side effects.','Annotated parse tree shows attribute values.','Synthesized attributes are evaluated bottom-up.'],
  hw:'Read Dragon §5.1–5.2. Quiz 3 this week.',
  quiz:[
    {q:'An attribute grammar is an SDD…', o:['With side effects','Without side effects','Without attributes','Without a grammar'], a:1, e:'Pure semantic rules.'},
    {q:'In E → E1 + T, the rule E.val = E1.val + T.val computes a…', o:['Synthesized attribute','Inherited attribute','Token','Terminal'], a:0, e:'Defined at the head from children.'},
    {q:'An annotated parse tree shows…', o:['Only tokens','Attribute values at each node','Machine code','The DFA'], a:1, e:'Decorated tree.'},
    {q:'"break outside a loop" is a…', o:['Lexical error','Flow-of-control (semantic) check','Linker error','Parse table conflict'], a:1, e:'Semantic check.'},
    {q:'For 3 * 5 + 4 n, the calculator prints…', o:['27','19','35','12'], a:1, e:'3 × 5 + 4 = 19.'}],
  assessment:{ kind:'quiz', title:'Quiz 3 — Weeks 8–11', covers:'FIRST/FOLLOW, LL(1) table and parsing, implementation, error recovery, introduction to SDDs',
    instructions:['Closed book unless announced.','Show the stack, input and action columns in traces.','Time and marks are announced by the instructor.'],
    mcq:[
      {q:'For S → A B, A → a | ε, B → b, FIRST(S) =', o:['{a}','{a, b}','{b}','{a, ε}'], a:1, e:'A can vanish, so FIRST(B) is added.'},
      {q:'For the same grammar, FOLLOW(A) =', o:['{$}','{b}','{a}','{ε}'], a:1, e:'B follows A.'},
      {q:'M[A, b] for that grammar is…', o:['A → a','A → ε','error','synch only'], a:1, e:'b ∈ FOLLOW(A).'},
      {q:'In panic mode, a terminal on the stack top that does not match is…', o:['Skipped in the input','Popped','Pushed again','Accepted'], a:1, e:'Pretend it was inserted.'},
      {q:'Which strategy anticipates common mistakes in the grammar?', o:['Panic mode','Error productions','Global correction','Synch sets'], a:1, e:'Special rules for frequent errors.'}],
    tf:[
      {q:'Every LL(1) grammar is unambiguous.', a:true, e:'An ambiguous grammar always has a conflict.'},
      {q:'synch entries may overwrite existing productions in the table.', a:false, e:'Only empty cells.'},
      {q:'An SDD with print actions is an attribute grammar.', a:false, e:'print is a side effect.'}],
    short:[
      {q:'State the three panic-mode rules for LL(1) parsers.', a:'Blank cell: skip the input token. synch cell: pop the non-terminal (skip if it is the start symbol with input left). Unmatched terminal on top: pop it.'},
      {q:'Define synthesized attribute.', a:'An attribute of a node N defined by a semantic rule of the production at N, using only attributes of N’s children and N itself.'}],
    app:[
      {q:'Trace the LL(1) parse with recovery of ( id * ) $ using the expression grammar with synch entries.', a:'E$ → TE′$ → FT′E′$ → (E)T′E′$ match ( → TE′)T′E′$ → FT′E′)T′E′$ → id… match id → T′ with * → *FT′ → match * → F with ) : M[F,)] = synch → pop F, report "operand missing" → T′ with ) → ε → E′ with ) → ε → match ) → T′ → ε → E′ → ε → accept with 1 error.'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Semantic analysis','Phase that checks the meaning of a program: types, declarations, control flow.'],['Attribute','A value attached to a grammar symbol.'],['Semantic rule','A rule attached to a production that computes attribute values.'],['Syntax-directed definition (SDD)','A CFG with attributes and semantic rules.'],['Attribute grammar','An SDD whose rules have no side effects.'],['Annotated parse tree','A parse tree showing attribute values at each node.'],['Side effect','An action such as printing or updating a table, beyond computing an attribute.']]
},
/* ================= WEEK 12 ================= */
{ id:21, week:12, unit:'Syntax-directed definitions', ic:'⬆️', lo:[4], book:'Dragon Ch. 5.1.1, 5.2.3–5.2.4',
  title:'Inherited and Synthesized Attributes; S- and L-Attributed Definitions',
  sub:'Precise definitions, examples of each, SDDs for type declarations and for left-recursion-free expression grammars, S-attributed and L-attributed classes.',
  intro:'Some information flows <b>up</b> the tree (the value of an expression). Other information flows <b>down</b> (the declared type of a list of variables). Today we formalise both and the two most useful classes of SDDs.',
  obj:['Define synthesized and inherited attributes precisely.','Write an SDD with inherited attributes for type declarations.','Use inherited attributes to keep left associativity in E → T E′ grammars.','Define S-attributed and L-attributed SDDs.','Classify a given SDD.'],
  bloom:{head:['<b>Distinguish</b> synthesized from inherited.','<b>Classify</b> SDDs as S- or L-attributed.','<b>Construct</b> SDDs using inherited attributes.'],
    heart:['<b>Value</b> information flow as a design concept.','<b>Appreciate</b> how inherited attributes fix the associativity problem from Week 6.'],
    hand:['<b>Annotate</b> trees with inherited attributes.','<b>Implement</b> an L-attributed SDD in recursive descent.']},
  slides:[
    {k:'Concept', h:'Synthesized attribute', ic:'⬆️', p:'A synthesized attribute of non-terminal A at node N is defined by a rule of the production <b>at N</b> (A is the head). It uses only attributes of N’s <b>children</b> and N itself.', ex:'E.val = E1.val + T.val', tk:'Children → parent.'},
    {k:'Concept', h:'Inherited attribute', ic:'⬇️', p:'An inherited attribute of B at node N is defined by a rule of the production at N’s <b>parent</b> (B is in the body). It uses attributes of N’s parent, N itself and N’s <b>siblings</b>.', ex:'D → T L { L.inh = T.type }', tk:'Parent / siblings → child.'},
    {k:'Animation', h:'Comparing the two', demo:'attrkinds', tk:'Terminals have only synthesized attributes (from the lexer).'},
    {k:'Animation', h:'Inherited attributes: type declarations', demo:'inherit', tk:'The type flows from T across to L and down to each id.'},
    {k:'Concept', h:'The declaration SDD', code:`Production         Semantic rules
D → T L            L.inh = T.type
T → int            T.type = integer
T → float          T.type = float
L → L1 , id        L1.inh = L.inh ;  addType(id.entry, L.inh)
L → id             addType(id.entry, L.inh)`, tk:'addType is a side effect that writes to the symbol table.'},
    {k:'Concept', h:'Fixing associativity after left-recursion removal', code:`T  → F T′          T′.inh = F.val ;          T.val = T′.syn
T′ → * F T′1        T′1.inh = T′.inh × F.val ;  T′.syn = T′1.syn
T′ → ε              T′.syn = T′.inh
F  → digit          F.val = digit.lexval

3 * 5 * 2 :  T′.inh = 3 → 15 → 30 ;  syn passes 30 back up.`, tk:'inh carries the running result left-to-right; syn returns the final value.'},
    {k:'Concept', h:'S-attributed definitions', ic:'🟦', p:'An SDD is <b>S-attributed</b> if every attribute is synthesized. Evaluate by any bottom-up traversal — naturally during LR parsing.', tk:'All synthesized = S-attributed.'},
    {k:'Concept', h:'L-attributed definitions', ic:'🟩', p:'An SDD is <b>L-attributed</b> if every attribute is either synthesized, or inherited from: the parent’s inherited attributes, or attributes of siblings to the <b>left</b> (X₁…Xᵢ₋₁ for Xᵢ), or Xᵢ’s own attributes without cycles.', tk:'Information flows left-to-right — one depth-first pass suffices.'},
    {k:'Animation', h:'Classifying SDDs', demo:'slattr', tk:'S-attributed ⊂ L-attributed.'},
    {k:'Concept', h:'Why these two classes matter', cmp:[['S-attributed',['Bottom-up evaluation','Fits LR (Yacc/Bison) parsers','No inherited attributes']],['L-attributed',['Left-to-right depth-first evaluation','Fits LL / recursive-descent parsers','Allows inherited attributes from the left']]], tk:'Both can be evaluated during parsing, without building the full tree first.'}
  ],
  lab:{t:'Lab: inherited attributes in code', steps:['Annotate the tree for <code>int a, b, c</code> with T.type and L.inh.','Implement the declaration SDD in a recursive-descent parser: pass inh as a parameter, call addType for each id.','Implement the T′.inh / T′.syn SDD for multiplication and test 3 * 5 * 2 and 8 / 4 / 2 (add /).','Classify the five SDDs in the slides as S-, L-, or neither.'], out:'Annotated tree, working code, classification table.'},
  disc:['Why can a terminal not have an inherited attribute?','How does a recursive-descent procedure receive inherited and return synthesized attributes?','Give a real language feature that naturally uses inherited attributes.'],
  mistakes:['Calling an attribute inherited because it is "passed along" up the tree — that is synthesized.','Using a right sibling’s attribute and calling the SDD L-attributed.','Forgetting T′ → ε must copy inh to syn.','Thinking S-attributed SDDs cannot be evaluated in LL parsers (they can, post-order).'],
  rev:['Synthesized: from children; inherited: from parent and siblings.','Declarations use inherited types: L.inh = T.type.','Inherited inh / synthesized syn restore left associativity in E′/T′ grammars.','S-attributed: only synthesized. L-attributed: inherited only from the parent or left siblings.','In recursive descent: inherited = parameters, synthesized = return values.'],
  hw:'Read Dragon §5.2. Prepare for Assignment 3.',
  quiz:[
    {q:'L.inh = T.type in D → T L makes L.inh…', o:['Synthesized','Inherited','A token','Lexical'], a:1, e:'Defined at the parent from a sibling.'},
    {q:'An SDD with only synthesized attributes is…', o:['S-attributed','L-attributed only','Circular','Invalid'], a:0, e:'And also L-attributed.'},
    {q:'In A → B C, a rule B.i = C.s is…', o:['Allowed in L-attributed SDDs','Not L-attributed (right sibling)','S-attributed','Lexical'], a:1, e:'Depends on a right sibling.'},
    {q:'In recursive descent, inherited attributes are usually…', o:['Return values','Procedure parameters','Global constants','Tokens'], a:1, e:'Passed down as arguments.'},
    {q:'For T′ → ε in the multiplication SDD, the rule is…', o:['T′.syn = 0','T′.syn = T′.inh','T′.inh = 1','none'], a:1, e:'Return the accumulated value.'}],
  terms:[['Synthesized attribute','Defined at a node from its children and itself.'],['Inherited attribute','Defined at a node from its parent, itself and its siblings.'],['S-attributed SDD','An SDD in which every attribute is synthesized.'],['L-attributed SDD','An SDD where inherited attributes depend only on the parent’s inherited attributes and left siblings.'],['inh / syn','Conventional names for the inherited and synthesized attributes of a helper non-terminal.']]
},
{ id:22, week:12, unit:'Syntax-directed definitions', ic:'🕸️', lo:[4], book:'Dragon Ch. 5.2.1–5.2.2, 5.2.5',
  title:'Evaluation Orders, Dependency Graphs and Attribute Computation Order',
  sub:'Dependency graphs, topological sorting, circular SDDs, evaluation orders for S- and L-attributed SDDs, semantic rules with controlled side effects.',
  assess:'Assignment-3',
  intro:'With inherited and synthesized attributes mixed together, in what order do we compute them? A <b>dependency graph</b> answers that question for any parse tree.',
  obj:['Construct the dependency graph for an annotated parse tree.','Find a valid evaluation order with topological sorting.','Detect circular dependencies.','Describe evaluation orders for S- and L-attributed SDDs.','Handle side effects safely.'],
  bloom:{head:['<b>Construct</b> dependency graphs.','<b>Apply</b> topological sort.','<b>Evaluate</b> whether an SDD can be evaluated at all.'],
    heart:['<b>Value</b> order and dependency thinking — useful far beyond compilers (build systems, spreadsheets).','<b>Be precise</b> when drawing edges.'],
    hand:['<b>Draw</b> a dependency graph and number its nodes.','<b>Write</b> a topological-sort program.']},
  slides:[
    {k:'Concept', h:'Dependency graph', ic:'🕸️', p:'For each attribute instance in the parse tree make a node. If a rule computes b from c, draw an edge <b>c → b</b> (c must be computed first).', tk:'Edges point from what is needed to what needs it.'},
    {k:'Animation', h:'Dependency graph for float id1, id2, id3', demo:'depgraph', tk:'Any topological order is a valid evaluation order.'},
    {k:'Concept', h:'Topological sort', code:`order = []
while graph has nodes:
    pick a node n with no incoming edges     (all its inputs are ready)
    append n to order; remove n and its outgoing edges
if nodes remain with incoming edges → there is a CYCLE → no order`, tk:'Kahn’s algorithm; O(nodes + edges).'},
    {k:'Concept', h:'Circular SDDs', ic:'♻️', code:`A → B      A.s = B.i ;   B.i = A.s + 1     ← A.s needs B.i, B.i needs A.s`, p:'If the dependency graph has a cycle, no evaluation order exists. Testing whether <i>any</i> parse tree of an SDD can have a cycle is expensive in general, so we use classes (S-, L-attributed) that are guaranteed acyclic.', tk:'Use S- or L-attributed SDDs to be safe.'},
    {k:'Concept', h:'Evaluation order for S-attributed SDDs', code:`postorder(N):
    for each child C of N, left to right: postorder(C)
    evaluate the synthesized attributes of N`, tk:'Children first, then the node.'},
    {k:'Concept', h:'Evaluation order for L-attributed SDDs', code:`dfvisit(N):
    for each child C of N, from left to right:
        evaluate the inherited attributes of C
        dfvisit(C)
    evaluate the synthesized attributes of N`, tk:'Inherited before visiting a child; synthesized after all children.'},
    {k:'Animation', h:'Inherited attributes along the walk', demo:'inherit', tk:'The depth-first, left-to-right walk respects all dependencies.'},
    {k:'Concept', h:'Attribute computation order in a real tree', code:`Expression 3 * 5 with T → F T′ ; T′ → * F T′1 | ε
1. F.val = 3                 (synthesized, first child)
2. T′.inh = F.val = 3        (inherited, before visiting T′)
3. F.val = 5                 (inside T′)
4. T′1.inh = 3 × 5 = 15
5. T′1.syn = 15              (ε)
6. T′.syn = 15
7. T.val = 15`, tk:'Exactly the dfvisit order.'},
    {k:'Concept', h:'Side effects', ic:'⚠️', pts:[['🖨️','print and addType do not compute attributes but must still happen in a sensible order.'],['🔗','Treat them as rules that define a dummy attribute; add dependency edges to their inputs.'],['✅','Rule of thumb: allow side effects only when any topological order gives an acceptable result.']], tk:'Control side effects through the dependency graph.'},
    {k:'Concept', h:'Dependency thinking elsewhere', pts:[['📊','Spreadsheets recompute cells in dependency order (and report circular references).'],['🛠️','Build systems (make, Gradle) compile files in topological order.'],['📦','Package managers resolve dependencies the same way.']], tk:'The same algorithm everywhere.'}
  ],
  lab:{t:'Lab: dependency graphs', steps:['Draw the annotated tree and dependency graph for <code>int a, b</code>.','Number the nodes in a topological order.','Write a program that reads edges (pairs) and prints a topological order or reports a cycle.','Feed it your graph and the circular example from the slides.'], out:'Graph drawing, program, two runs (one success, one cycle).'},
  disc:['Why is a parse-tree-independent cycle test hard?','How does Excel detect circular references?','Which is easier to implement in recursive descent: S- or L-attributed SDDs?'],
  mistakes:['Drawing edges in the wrong direction (from result to input).','Forgetting the dummy nodes for side-effect rules.','Evaluating a child’s inherited attributes after visiting the child.','Assuming every SDD has an evaluation order.'],
  rev:['Dependency graph: node per attribute instance, edge c → b if b uses c.','Topological order = valid evaluation order; cycle = none.','S-attributed: post-order. L-attributed: depth-first, inherited before, synthesized after.','Side effects get dummy attributes and edges.','Same idea as spreadsheets and build systems.'],
  hw:'Complete Assignment 3.',
  quiz:[
    {q:'An edge c → b in a dependency graph means…', o:['b must be computed before c','c must be computed before b','They are equal','Nothing'], a:1, e:'b depends on c.'},
    {q:'A valid evaluation order is any…', o:['Random order','Topological sort of the dependency graph','Alphabetical order','Reverse post-order of tokens'], a:1, e:'Respects all edges.'},
    {q:'If the dependency graph has a cycle…', o:['Evaluate twice','No evaluation order exists','It is S-attributed','It is L-attributed'], a:1, e:'Circular SDD.'},
    {q:'S-attributed SDDs are evaluated in…', o:['Pre-order','Post-order','Random order','Breadth-first order'], a:1, e:'Children first.'},
    {q:'In dfvisit, inherited attributes of child C are evaluated…', o:['After visiting C','Before visiting C','Never','At the root only'], a:1, e:'They are inputs to C’s subtree.'}],
  assessment:{ kind:'assignment', title:'Assignment 3 — Syntax-Directed Definitions and Attribute Evaluation', covers:'Weeks 10–12: LL(1) implementation, error recovery, SDDs, inherited/synthesized attributes, dependency graphs',
    instructions:['Individual work.','Draw trees and graphs neatly (by hand or with a tool).','Submission date and marks are announced by the instructor.'],
    tasks:['Write an SDD that computes the value of binary numbers with a fraction, e.g. 101.101 = 5.625 (hint: use the position of each bit as an inherited attribute).','For the declaration SDD (D → T L …), draw the annotated parse tree and dependency graph for <code>int x, y, z</code> and give a topological order.','Classify each of five given SDDs (provided in class) as S-attributed, L-attributed or neither, with reasons.','Implement the L-attributed SDD for expressions without left recursion (E → T E′ …) in your recursive-descent parser so that 10 − 4 − 3 evaluates to 3.','Add panic-mode recovery to your parser and show it reporting two errors in one run.'],
    submission:['PDF with tasks 1–3.','Source code for tasks 4–5 with test output.'],
    reflection:['Where did inherited attributes make your design simpler?','Which ordering mistake did you make first, and how did you notice it?'],
    example:'<b>Sample for task 4:</b> E′.inh carries the running total: E → T E′ { E′.inh = T.val; E.val = E′.syn }, E′ → − T E′1 { E′1.inh = E′.inh − T.val; E′.syn = E′1.syn }, E′ → ε { E′.syn = E′.inh }.',
    note:'Copied work receives zero.' },
  terms:[['Dependency graph','A directed graph with a node for each attribute instance and edges for dependencies.'],['Topological sort','An ordering of graph nodes where every edge goes from earlier to later.'],['Circular SDD','An SDD for which some parse tree has a cyclic dependency graph.'],['Post-order traversal','Visiting children before the parent.'],['Depth-first left-to-right evaluation','The evaluation strategy for L-attributed SDDs.']]
},
/* ================= WEEK 13 ================= */
{ id:23, week:13, unit:'Syntax-directed translation', ic:'🔀', lo:[4], book:'Dragon Ch. 5.4',
  title:'Syntax-Directed Translation Schemes',
  sub:'SDTs: program fragments embedded in production bodies; postfix translation schemes; actions inside productions; converting L-attributed SDDs to SDTs.',
  intro:'An SDD says <i>what</i> to compute. A <b>syntax-directed translation scheme (SDT)</b> says <i>when</i>: it puts actions at exact positions inside production bodies.',
  obj:['Define an SDT and explain how it differs from an SDD.','Write postfix SDTs and run them during parsing.','Place actions inside productions and determine when they fire.','Convert an L-attributed SDD to an SDT.','Implement SDTs in a recursive-descent parser.'],
  bloom:{head:['<b>Distinguish</b> SDD from SDT.','<b>Determine</b> the firing order of actions.','<b>Convert</b> L-attributed SDDs into SDTs.'],
    heart:['<b>Appreciate</b> the precision of "when" in translation.','<b>Value</b> simple, postfix designs when possible.'],
    hand:['<b>Write</b> SDTs for infix-to-postfix and infix-to-prefix.','<b>Implement</b> them in code.']},
  slides:[
    {k:'Concept', h:'What is an SDT?', ic:'🔀', p:'A <b>syntax-directed translation scheme</b> is a CFG with <b>program fragments (semantic actions)</b> embedded in production bodies, written in braces.', code:`rest → + term { print('+') } rest1`, tk:'The position of an action tells when it executes.'},
    {k:'Comparison', h:'SDD vs SDT', cmp:[['SDD',['Rules attached to productions','Order of evaluation not specified','Declarative: "what"']],['SDT',['Actions placed inside bodies','Order fixed by position','Operational: "when"']]], tk:'An SDT is an SDD with an explicit evaluation order.'},
    {k:'Concept', h:'Postfix SDTs', ic:'📮', p:'If every action is at the <b>right end</b> of its production, the SDT is <b>postfix</b>. Each action runs when its production is reduced (bottom-up) or after its body is completed (top-down). Every S-attributed SDD can be written as a postfix SDT.', tk:'Postfix SDT = actions at the end.'},
    {k:'Animation', h:'Infix to postfix with a postfix SDT', demo:'postfixsdt', tk:'9 − 5 + 2 → 95−2+.'},
    {k:'Concept', h:'Postfix SDT on an LR stack', code:`L → E n          { print(stack[top-1].val); top = top - 1; }
E → E1 + T       { stack[top-2].val = stack[top-2].val + stack[top].val; top = top - 2; }
T → T1 * F       { stack[top-2].val = stack[top-2].val × stack[top].val; top = top - 2; }
F → digit        { stack[top].val = stack[top].digit.lexval; }`, tk:'Values live on the parser stack next to grammar symbols.'},
    {k:'Animation', h:'Actions inside productions', demo:'sdtinside', tk:'B → X { a } Y : a runs after X, before Y.'},
    {k:'Concept', h:'Converting an L-attributed SDD to an SDT', ic:'🔄', pts:[['1','Put the action that computes an <b>inherited</b> attribute of A <b>immediately before</b> A in the body.'],['2','Put the action that computes a <b>synthesized</b> attribute of the head at the <b>end</b> of the body.']], code:`T  → F { T′.inh = F.val } T′ { T.val = T′.syn }
T′ → * F { T′1.inh = T′.inh × F.val } T′1 { T′.syn = T′1.syn }
T′ → ε { T′.syn = T′.inh }`, tk:'Inherited just before; synthesized at the end.'},
    {k:'Concept', h:'SDT in recursive descent', code:`int T() {                         // returns T.val (synthesized)
    int f = F();
    return Tprime(f);              // T′.inh passed as a parameter
}
int Tprime(int inh) {
    if (look == '*') { match('*'); int f = F(); return Tprime(inh * f); }
    return inh;                    // T′ → ε : syn = inh
}`, tk:'Parameters = inherited; return value = synthesized.'},
    {k:'Example', h:'SDT for a while statement (preview of Week 15)', code:`S → while (      { L1 = new(); L2 = new(); C.false = S.next; C.true = L2; print("label", L1); }
     C )       { S1.next = L1; print("label", L2); }
     S1        { print("goto", L1); }`, tk:'Actions inside the body generate labels at the right moment.'},
    {k:'Concept', h:'Which SDTs can be implemented during parsing?', pts:[['⬆️','Postfix SDTs: during LR (bottom-up) parsing.'],['⬇️','SDTs from L-attributed SDDs: during LL / recursive-descent parsing.'],['🌳','Any SDT: build the parse tree first, then run actions in a preorder walk.']], tk:'The class of the SDD decides when actions can run.'}
  ],
  lab:{t:'Lab: translators', steps:['Implement the infix-to-postfix SDT for + − * / with parentheses in recursive descent.','Write an SDT that translates infix to prefix (operators first) and implement it.','Write an SDT that counts the depth of parentheses and prints the maximum.','Test with: 9−5+2, (1+2)*3, 2*(3+(4−1)).'], out:'Three working translators with test output.'},
  disc:['Why is postfix notation useful for stack machines like the JVM?','What happens if an action reads an attribute not yet computed?','Why do bottom-up parsers favour postfix SDTs?'],
  mistakes:['Placing an inherited-attribute action after the symbol it is for.','Thinking actions in an SDT may be reordered freely.','Using right recursion in the postfix SDT and getting 952+−.','Confusing SDT action braces with EBNF repetition braces.'],
  rev:['SDT = grammar + actions embedded at positions in bodies.','Postfix SDT: all actions at the ends; implements S-attributed SDDs.','Actions inside bodies run after the symbols to their left.','L-attributed SDD → SDT: inherited actions before the symbol, synthesized at the end.','Recursive descent: inherited = parameters, synthesized = return values.'],
  hw:'Read Dragon §6.5 (type checking) and §2.7 / §6.1 (scopes).',
  quiz:[
    {q:'In a postfix SDT, actions are placed…', o:['At the start of bodies','At the end of bodies','Only in the lexer','Nowhere'], a:1, e:'Right end.'},
    {q:'9 − 5 + 2 in postfix is…', o:['9 5 2 − +','9 5 − 2 +','+ − 9 5 2','9 − 5 2 +'], a:1, e:'Left-associative.'},
    {q:'In B → X { a } Y, action a runs…', o:['Before X','After X, before Y','After Y','Never'], a:1, e:'Position decides.'},
    {q:'When converting an L-attributed SDD to an SDT, an inherited attribute of A is computed…', o:['After A','Immediately before A','At the end of the body','In the lexer'], a:1, e:'It must be ready when A starts.'},
    {q:'Every S-attributed SDD can be written as a…', o:['Postfix SDT','Regular expression','DFA','Linker script'], a:0, e:'Actions at the ends.'}],
  terms:[['Syntax-directed translation scheme (SDT)','A grammar with semantic actions embedded in production bodies.'],['Semantic action','A program fragment in braces inside a production.'],['Postfix SDT','An SDT in which all actions are at the right ends of bodies.'],['Postfix notation','Operator-after-operands notation, e.g. 95−2+.'],['Prefix notation','Operator-before-operands notation, e.g. +−952.']]
},
{ id:24, week:13, unit:'Type checking & scope', ic:'🔠', lo:[4], book:'Dragon Ch. 6.3, 6.5 · Louden Ch. 6.4',
  title:'Type Checking and Scope',
  sub:'Type expressions, type systems, static vs dynamic and strong vs weak typing, type equivalence, rules for type checking, scope rules and symbol tables per scope.',
  intro:'<code>"5" + 2</code> is <code>"52"</code> in JavaScript, <code>7</code> in Perl and an error in Python. The <b>type system</b> of a language decides — and the compiler’s type checker enforces it.',
  obj:['Write type expressions for basic and constructed types.','Distinguish static/dynamic and strong/weak typing.','Compare structural and name equivalence.','Write type-checking rules for expressions and statements.','Apply static (lexical) scope rules with a stack of symbol tables.'],
  bloom:{head:['<b>Construct</b> type expressions.','<b>Apply</b> type rules to expressions.','<b>Compare</b> type equivalence schemes and scope rules.'],
    heart:['<b>Appreciate</b> how types prevent real bugs.','<b>Respect</b> design choices of different languages.'],
    hand:['<b>Write</b> a type checker for MiniC expressions.','<b>Trace</b> scope resolution for nested blocks.']},
  slides:[
    {k:'Concept', h:'Types and type systems', ic:'🔠', p:'A <b>type system</b> is a set of rules that assigns a type to every expression and says which combinations are legal. A <b>type checker</b> implements it.', pts:[['🧱','Basic types: boolean, char, integer, float, void.'],['🧩','Constructed types: array(n, T), record{…}, pointer(T), function T₁ → T₂.'],['🏷️','Type names: typedefs, class names.']], tk:'Every expression has a type.'},
    {k:'Animation', h:'Type expressions as trees', demo:'typeexp', tk:'int[2][3] = array(2, array(3, integer)).'},
    {k:'Comparison', h:'Kinds of typing', cmp:[['Static vs dynamic',['<b>Static:</b> types checked at compile time (C, Java, Rust)','<b>Dynamic:</b> types checked at run time (Python, JavaScript)']],['Strong vs weak',['<b>Strong:</b> no operation on a wrong type goes undetected (Java, Python)','<b>Weak:</b> implicit, unsafe conversions allowed (C pointers, JavaScript "5"*2)']]], tk:'These are two separate axes.'},
    {k:'Concept', h:'Type equivalence', cmp:[['Structural equivalence',['Same constructor, same components','array(10, int) ≡ array(10, int)','Used by C for most types']],['Name equivalence',['Same type name only','type A = int[10]; type B = int[10]; A ≢ B','Used by Java classes, Pascal, Ada']]], tk:'Which types are "the same"?'},
    {k:'Concept', h:'Type-checking rules', code:`E → literal        E.type = integer (or float, char …)
E → id             E.type = lookup(id.entry).type
E → E1 + E2        if E1.type = integer and E2.type = integer then E.type = integer
                   else if both numeric then E.type = float (with coercion)
                   else type_error()
E → E1 [ E2 ]      if E2.type = integer and E1.type = array(s, t) then E.type = t else type_error()
S → id = E         if lookup(id).type ≠ E.type and no coercion possible then type_error()
S → if ( E ) S1    if E.type ≠ boolean then type_error()`, tk:'Synthesize E.type bottom-up; check at each operator.'},
    {k:'Animation', h:'Type checking with coercion', demo:'typecheck', tk:'Widen int to float; reject impossible conversions.'},
    {k:'Concept', h:'Coercions and the widening hierarchy', ic:'📈', code:`double
  ↑
float
  ↑
long
  ↑
int  ← char, short`, p:'<b>Widening</b> (int → float) is safe and done implicitly. <b>Narrowing</b> (float → int) may lose information and usually needs an explicit cast.', tk:'max(t1, t2) in the hierarchy gives the result type.'},
    {k:'Concept', h:'Overloading and polymorphism', pts:[['➕','<b>Overloading:</b> + means integer addition, float addition or string concatenation depending on operand types.'],['🧬','<b>Polymorphism:</b> one function works on many types (templates/generics: List&lt;T&gt;).'],['🔍','The type checker resolves which version to use.']], tk:'Types decide meaning.'},
    {k:'Concept', h:'Scope rules', ic:'🌐', p:'The <b>scope</b> of a declaration is the part of the program where it is visible. Most languages use <b>static (lexical) scope</b>: a use refers to the declaration in the closest enclosing block.', pts:[['🧱','Blocks { } create new scopes.'],['👻','Inner declarations shadow outer ones.'],['🔁','Dynamic scope (old Lisp, Bash local) uses the most recent active declaration at run time.']], tk:'Static scope = look at the program text.'},
    {k:'Animation', h:'Scopes with a stack of symbol tables', demo:'scopes', tk:'Push at {, pop at }, look up innermost first.'},
    {k:'Example', h:'Static vs dynamic scope', code:`int x = 1;
void f() { print(x); }
void g() { int x = 2; f(); }
g();
Static scope  → prints 1   (f sees the global x in its text)
Dynamic scope → prints 2   (f sees g's x, the most recent at run time)`, tk:'C, Java and Python use static scope.'}
  ],
  lab:{t:'Lab: a small type checker', steps:['Extend your MiniC parser so that every expression node gets a type (int, float, bool).','Insert coercion nodes when int and float are mixed.','Report errors for: bool + int, if (int-expression) if your MiniC requires bool, assigning float to int without a cast.','Add scopes: push/pop symbol tables at { } and report undeclared and redeclared variables.'], out:'Code and output for 6 test programs (3 correct, 3 with type/scope errors).'},
  disc:['Is Python strongly typed? Is it statically typed?','Why do many modern languages prefer name equivalence for classes?','Is implicit narrowing ever a good idea?'],
  mistakes:['Confusing static typing with strong typing.','Widening in the wrong direction (float → int implicitly).','Looking up the outermost scope first.','Reporting a type error for an intended overload.'],
  rev:['Type expressions: basic types and constructors (array, pointer, record, function).','Static vs dynamic, strong vs weak typing.','Structural vs name equivalence.','Type rules compute E.type and insert coercions using the widening hierarchy.','Static scope: closest enclosing declaration; stack of symbol tables.'],
  hw:'Read Dragon §6.5 and §5.5 (implementing SDDs). Prepare for Quiz 4.',
  quiz:[
    {q:'Python checks types…', o:['At compile time only','At run time (dynamic typing)','Never','Only for integers'], a:1, e:'Dynamically typed, but strongly typed.'},
    {q:'int → float conversion inserted by the compiler is…', o:['Narrowing','Widening (coercion)','A syntax error','Scope resolution'], a:1, e:'Safe, implicit.'},
    {q:'Under name equivalence, two types are equivalent if…', o:['Same structure','Same name','Same size','Always'], a:1, e:'Only identical names.'},
    {q:'The type expression for int a[5] is…', o:['array(5, integer)','pointer(integer)','integer → 5','record(5)'], a:0, e:'Array constructor.'},
    {q:'With static scope, a use of x refers to…', o:['The most recently executed declaration','The closest enclosing declaration in the program text','A random x','The global x always'], a:1, e:'Lexical scoping.'}],
  terms:[['Type system','A set of rules assigning types to expressions and defining legal operations.'],['Type expression','A representation of a type: basic type or a constructor applied to type expressions.'],['Static typing','Type checking at compile time.'],['Dynamic typing','Type checking at run time.'],['Strong typing','Every type error is detected (statically or dynamically).'],['Structural equivalence','Types are equal if they have the same structure.'],['Name equivalence','Types are equal only if they have the same name.'],['Coercion','An implicit type conversion inserted by the compiler.'],['Widening','Conversion to a type that can represent all values of the original.'],['Static scope','Scope determined by program text (closest enclosing block).'],['Dynamic scope','Scope determined by the run-time call sequence.']]
}
);
