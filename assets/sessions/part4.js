/* Sessions 25–30 (Weeks 14–16) + Final unit (Week 17). Content only. */
COURSE.sessions.push(
/* ================= WEEK 14 ================= */
{ id:25, week:14, unit:'Type checking & scope', ic:'🧩', lo:[4], book:'Dragon Ch. 5.5, 6.5',
  title:'Type Checking in Practice and Implementing L-Attributed SDDs',
  sub:'Type conversions in translation, function and operator checks, scope handling across phases; implementing L-attributed SDDs in recursive descent, on-the-fly code generation, and attributes on the LL stack.',
  intro:'We now know <i>what</i> to check and <i>which</i> SDDs are easy to evaluate. Today we write the code: a recursive-descent translator that checks types and emits code as it parses.',
  obj:['Generate code for type conversions during translation.','Check function calls (argument count and types) and return statements.','Implement L-attributed SDDs in recursive descent with parameters and return values.','Generate code on the fly instead of building long code strings.','Describe how attributes are kept on an LL parser stack.'],
  bloom:{head:['<b>Apply</b> type rules with conversion code.','<b>Implement</b> L-attributed SDDs.','<b>Compare</b> building code strings vs emitting on the fly.'],
    heart:['<b>Value</b> efficient translation design.','<b>Care</b> about correct, helpful type errors.'],
    hand:['<b>Code</b> a translator that emits three-address code with conversions.','<b>Test</b> function-call checks.']},
  slides:[
    {k:'Concept', h:'Type conversion during translation', code:`Addr widen(Addr a, Type t, Type w) {
    if (t == w) return a;
    if (t == integer &amp;&amp; w == float) {
        Temp tmp = new Temp();
        gen(tmp + " = (float) " + a);
        return tmp;
    }
    error("type error");
}
E → E1 + E2 :  E.type = max(E1.type, E2.type);
               a1 = widen(E1.addr, E1.type, E.type);
               a2 = widen(E2.addr, E2.type, E.type);
               E.addr = new Temp(); gen(E.addr = a1 + a2)`, tk:'Conversions become real instructions.'},
    {k:'Animation', h:'Checking x = i * 2.5', demo:'typecheck', tk:'The coercion produces t1 = (float) i.'},
    {k:'Concept', h:'Checking functions', ic:'📞', pts:[['🔢','Call f(a1,…,an): look up f; type must be T₁ × … × Tₙ → R; check n and each argument type (with coercion).'],['↩️','return E: E.type must match the declared return type of the enclosing function (an inherited attribute!).'],['🚫','void function used in an expression → error.']], code:`E → id ( Args )   if lookup(id).type = (s → t) and Args.type = s then E.type = t else error()`, tk:'Function types are type expressions too.'},
    {k:'Concept', h:'Scope across phases', pts:[['🔤','Lexer: only the lexeme (no scope).'],['🌳','Parser + semantic actions: enterScope at {, insert at declarations, lookup at uses, exitScope at }.'],['🧾','IR generator: uses the entry found (unique per declaration) — two different x’s get different addresses.']], tk:'After resolution, every use points to the right entry.'},
    {k:'Concept', h:'Implementing L-attributed SDDs: the recipe', ic:'📜', pts:[['🧩','One function per non-terminal A.'],['⬇️','Inherited attributes of A = <b>parameters</b> of A().'],['⬆️','Synthesized attributes of A = <b>return values</b> (or out-parameters).'],['📝','In the body: compute inherited attributes of a child just before calling it; compute synthesized attributes of A at the end.']], tk:'Exactly the SDT conversion rule from Week 13.'},
    {k:'Example', h:'Recursive-descent translator for while', code:`string S(label next) {                 // next = inherited, returns code (synthesized)
    if (look == WHILE) {
        match(WHILE); match('(');
        label L1 = newLabel(), L2 = newLabel();
        string Ccode = C(next, L2);       // C.false = S.next, C.true = L2
        match(')');
        string S1code = S(L1);            // S1.next = L1
        return "label " + L1 + Ccode + "label " + L2 + S1code + "goto " + L1;
    } ...
}`, tk:'Labels are inherited; code is synthesized.'},
    {k:'Concept', h:'On-the-fly code generation', ic:'⚡', p:'Building long code strings and concatenating them is wasteful. If the code of the head is just the children’s code in order plus new instructions, we can <b>emit</b> instructions directly as we parse.', code:`void S(label next) {                     // nothing returned: code is emitted
    if (look == WHILE) {
        match(WHILE); match('(');
        label L1 = newLabel(), L2 = newLabel();
        emit("label " + L1);
        C(next, L2); match(')');
        emit("label " + L2);
        S(L1);
        emit("goto " + L1);
    } ...
}`, tk:'Emit in order; no string copying.'},
    {k:'Concept', h:'L-attributed SDDs on an LL stack', ic:'🗄️', pts:[['📚','Push an <b>action record</b> just below a non-terminal to compute its inherited attributes.'],['📦','Push a <b>synthesize record</b> just below a non-terminal to receive its synthesized attributes.'],['🔁','When records are popped, copy values to the records that need them.']], tk:'The table-driven parser can also translate — it just keeps more on the stack.'},
    {k:'Concept', h:'Putting it together', pts:[['🔤','Scanner → tokens.'],['🌳','Recursive-descent parser with inherited/synthesized parameters.'],['🔠','Type checking + coercions as actions.'],['🧾','Emits three-address code on the fly.'],['🩹','Panic-mode recovery keeps it going after errors.']], tk:'This is a complete front end.'}
  ],
  lab:{t:'Lab: typed translator', steps:['Extend your expression translator so each expression returns (addr, type).','Emit conversion instructions when int and float mix.','Add function declarations and calls; check argument count and types.','Translate <code>float f(int a, float b) { return a * b; } x = f(2, 3);</code> and print the three-address code.'], out:'Code and the emitted three-address code with conversions.'},
  disc:['Why are labels inherited and code synthesized?','When can on-the-fly emission not be used?','How does C++ choose between overloaded functions?'],
  mistakes:['Forgetting to convert both operands to the result type.','Checking the return type against the wrong function (missing inherited context).','Emitting code for S1 before the label that S1 needs.','Treating every type mismatch as an error even when widening is allowed.'],
  rev:['Coercions become explicit conversion instructions.','Function calls: check count and types; return type is inherited context.','L-attributed SDD in recursive descent: inherited = parameters, synthesized = returns.','On-the-fly emission avoids building long code strings.','LL stacks can hold action and synthesize records.'],
  hw:'Read Dragon §6.1–6.2. Prepare for Quiz 4.',
  quiz:[
    {q:'Mixing int i and float 2.5 in i * 2.5 generates…', o:['A syntax error','A conversion instruction t1 = (float) i','Nothing','A new token'], a:1, e:'Widening coercion.'},
    {q:'In recursive descent, inherited attributes are…', o:['Return values','Parameters','Global variables only','Tokens'], a:1, e:'Passed in.'},
    {q:'On-the-fly generation means…', o:['Emitting instructions as soon as they are known','Building the whole AST first','Interpreting','Linking'], a:0, e:'No long code strings.'},
    {q:'A return statement’s expected type is best passed as…', o:['A synthesized attribute','An inherited attribute','A token','A comment'], a:1, e:'It comes from the enclosing function.'},
    {q:'For f(int, float) called as f(2, 3), the compiler…', o:['Rejects it','Widens 3 to float','Narrows 2','Ignores types'], a:1, e:'int → float allowed.'}],
  terms:[['Type conversion','Changing a value from one type to another, implicitly (coercion) or explicitly (cast).'],['Function type','A type expression s → t from argument types to result type.'],['On-the-fly code generation','Emitting instructions during parsing instead of building code attributes.'],['Action record','An LL stack entry that computes inherited attributes.'],['Synthesize record','An LL stack entry that collects synthesized attributes.']]
},
{ id:26, week:14, unit:'Intermediate code generation', ic:'🧾', lo:[4], book:'Dragon Ch. 6.1–6.2 · Cooper & Torczon Ch. 5',
  title:'Intermediate Code Generation and Three-Address Code',
  sub:'Why an IR; syntax trees and DAGs; three-address code instruction forms; quadruples, triples and indirect triples; a glimpse of SSA.',
  assess:'Quiz-4',
  intro:'The front end’s final product is an <b>intermediate representation</b>. The most common one is <b>three-address code</b>: simple instructions like <code>t1 = b * c</code> that any back end can turn into machine code.',
  obj:['Explain why compilers use intermediate representations.','Build syntax trees and DAGs for expressions.','Write three-address code using the standard instruction forms.','Represent three-address code as quadruples, triples and indirect triples.','Describe static single-assignment (SSA) form at a high level.'],
  bloom:{head:['<b>Explain</b> the role of IR.','<b>Generate</b> three-address code for expressions.','<b>Compare</b> quadruples, triples and indirect triples.'],
    heart:['<b>Appreciate</b> the power of a common middle language.','<b>Value</b> simplicity in design.'],
    hand:['<b>Write</b> TAC for given statements.','<b>Fill</b> quadruple and triple tables.']},
  slides:[
    {k:'Concept', h:'Why an intermediate representation?', ic:'🧾', pts:[['🔁','Retargeting: m front ends + n back ends instead of m × n compilers.'],['🚀','Machine-independent optimisation happens once, on the IR.'],['🪜','Breaks a big translation into two smaller ones.']], tk:'IR = the contract between front and back end.'},
    {k:'Animation', h:'High-level to low-level IR', demo:'irforms', tk:'Trees for analysis; three-address code for optimisation and code generation.'},
    {k:'Animation', h:'DAG: sharing common subexpressions', demo:'dag', tk:'A DAG finds repeated work automatically.'},
    {k:'Concept', h:'Value-number method for DAGs', code:`Before creating node (op, left, right):
    look up the signature ⟨op, left, right⟩ in a hash table
    if found  → return the existing node
    else      → create it, store it, return it`, tk:'Hashing signatures makes DAG construction fast.'},
    {k:'Concept', h:'Three-address code', ic:'3️⃣', p:'At most one operator on the right-hand side; addresses can be names, constants or compiler-generated temporaries.', code:`x + y * z      ⟹    t1 = y * z
                     t2 = x + t1`, tk:'Flattened, linear, easy to analyse.'},
    {k:'Animation', h:'Kinds of instructions', demo:'tactypes', tk:'Assignments, jumps, calls, indexed copies, pointers.'},
    {k:'Animation', h:'TAC for a = b * −c + b * −c', demo:'tac', tk:'Six instructions; a DAG would reduce them.'},
    {k:'Example', h:'Control flow in TAC', code:`do i = i + 1; while (a[i] &lt; v);

L:  t1 = i + 1
    i = t1
    t2 = i * 8          // 8 = width of an element
    t3 = a [ t2 ]
    if t3 &lt; v goto L`, tk:'Loops become labels and conditional jumps.'},
    {k:'Animation', h:'Quadruples and triples', demo:'quads', tk:'Quads name results; triples refer to positions.'},
    {k:'Comparison', h:'Choosing a representation', cmp:[['Quadruples',['op, arg1, arg2, result','Temporaries are explicit','Instructions can be moved easily (optimisers like this)']],['Triples / indirect triples',['op, arg1, arg2; results referenced by position','Less space','Moving an instruction changes references — indirect triples fix that with a pointer list']]], tk:'Quads are the most common in practice.'},
    {k:'Concept', h:'Static single-assignment form (SSA)', ic:'🧬', code:`p = a + b          p1 = a + b
q = p - c    ⟹    q1 = p1 - c
p = q * d          p2 = q1 * d
                   if (flag) x1 = -1; else x2 = 1;
                   x3 = φ(x1, x2)`, p:'Every name is assigned <b>exactly once</b>. φ-functions merge values at join points. LLVM IR and GCC’s GIMPLE use SSA.', tk:'SSA makes many optimisations simpler.'}
  ],
  lab:{t:'Lab: generate and represent TAC', steps:['Write TAC for: <code>x = (a + b) * (a + b) - c / d;</code> first naively, then using a DAG.','Fill the quadruple and triple tables for the naive version.','Write TAC for <code>while (i &lt; n) { s = s + a[i]; i = i + 1; }</code> (int width 4).','Check expression answers with Lab tools → Expression translator.'], out:'TAC listings, tables and tool screenshots.'},
  disc:['Why do triples make code motion difficult?','Is Java bytecode an IR? What kind?','Why might a compiler use several IRs at different levels?'],
  mistakes:['Putting two operators on one right-hand side.','Reusing a temporary while its value is still needed.','Forgetting to multiply array indices by the element width.','Confusing triple references (0) with constants 0.'],
  rev:['IRs separate front and back ends and enable optimisation.','DAGs share common subexpressions (value numbering).','TAC: at most one operator on the right; temporaries for intermediate results.','Quadruples (with result field), triples (positions), indirect triples (pointer list).','SSA: each name assigned once; φ at joins.'],
  hw:'Read Dragon §6.4. Quiz 4 this week.',
  quiz:[
    {q:'Three-address code allows at most how many operators on the right side?', o:['0','1','2','3'], a:1, e:'One operator.'},
    {q:'In a DAG, a common subexpression is…', o:['Duplicated','Represented by one shared node','Deleted','Turned into a token'], a:1, e:'Shared node.'},
    {q:'Which representation has an explicit result field?', o:['Triples','Quadruples','Indirect triples','DFA'], a:1, e:'op, arg1, arg2, result.'},
    {q:'In SSA, each variable is assigned…', o:['Any number of times','Exactly once','Never','Twice'], a:1, e:'Single assignment.'},
    {q:'t1 = minus c is a…', o:['Binary operation','Unary operation','Copy','Jump'], a:1, e:'x = op y.'}],
  assessment:{ kind:'quiz', title:'Quiz 4 — Weeks 11–14', covers:'SDDs, attributes, dependency graphs, SDTs, type checking and scope, implementing L-attributed SDDs, three-address code',
    instructions:['Closed book unless announced.','Show annotated trees and TAC clearly.','Time and marks are announced by the instructor.'],
    mcq:[
      {q:'An L-attributed SDD can be evaluated…', o:['Only after building a cyclic graph','In one depth-first, left-to-right pass','Only bottom-up','Never'], a:1, e:'dfvisit order.'},
      {q:'In D → T L { L.inh = T.type }, information flows…', o:['Up','Sideways from T to L, then down','Only in the lexer','Nowhere'], a:1, e:'Inherited.'},
      {q:'The postfix form of a * (b + c) is…', o:['a b c + *','a b * c +','* a + b c','a b + c *'], a:0, e:'Operands first.'},
      {q:'float x; int i; x = i + 1; requires…', o:['No conversion','Widening the int result to float','A syntax error','Narrowing x'], a:1, e:'Assign int to float → widen.'},
      {q:'Triples refer to results by…', o:['Temporary names','Position of the instruction','Labels','Registers'], a:1, e:'(0), (1), …'}],
    tf:[
      {q:'Every S-attributed SDD is L-attributed.', a:true, e:'No inherited attributes at all.'},
      {q:'Dynamic scope and static scope always give the same result.', a:false, e:'See the f/g example.'},
      {q:'Indirect triples allow instructions to be reordered without renumbering references.', a:true, e:'Only the pointer list changes.'}],
    short:[
      {q:'Write three-address code for x = a + b * c - d.', a:'t1 = b * c; t2 = a + t1; t3 = t2 - d; x = t3.'},
      {q:'Give the quadruples for the same statement.', a:'(*, b, c, t1) (+, a, t1, t2) (−, t2, d, t3) (=, t3, —, x).'}],
    app:[
      {q:'Draw the dependency graph for int a, b and give a topological order.', a:'Nodes: a.entry(1), b.entry(2), T.type(3), L.inh(4), L1.inh(5), addType for b(6), addType for a(7). Edges: 3→4, 4→5, 4→6, 2→6, 5→7, 1→7. Order: 1, 2, 3, 4, 5, 6, 7.'},
      {q:'Type-check and translate: float y; int k; y = k * 2 + 1.5;', a:'k*2: int × int → int: t1 = k * 2. t1 + 1.5: int + float → float: t2 = (float) t1; t3 = t2 + 1.5. Assignment float = float: y = t3.'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Intermediate representation (IR)','A program form between source and target used for analysis and optimisation.'],['DAG','Directed acyclic graph; like a syntax tree but sharing common subexpressions.'],['Value numbering','Hashing node signatures to reuse identical DAG nodes.'],['Three-address code','IR in which each instruction has at most one operator and three addresses.'],['Temporary','A compiler-generated name holding an intermediate value.'],['Quadruple','A TAC record with op, arg1, arg2 and result fields.'],['Triple','A TAC record with op, arg1, arg2; results referenced by position.'],['Indirect triples','A list of pointers to triples, allowing reordering.'],['SSA form','IR in which every variable is assigned exactly once; φ-functions merge values.']]
},
/* ================= WEEK 15 ================= */
{ id:27, week:15, unit:'Intermediate code generation', ic:'➗', lo:[4], book:'Dragon Ch. 6.4',
  title:'Translation of Expressions',
  sub:'SDD for expressions with addr and code attributes; incremental translation with gen(); assignments; array references and address computation; type conversion in expressions.',
  intro:'Now we produce three-address code automatically from the parse — first for arithmetic expressions and assignments, then for array references.',
  obj:['Write an SDD that generates three-address code for expressions using E.addr and E.code.','Use incremental translation (gen) instead of building code strings.','Translate assignments and unary minus.','Compute addresses for one- and two-dimensional array references.','Combine translation with type conversions.'],
  bloom:{head:['<b>Apply</b> the expression SDD.','<b>Compute</b> array addresses.','<b>Trace</b> translations by hand.'],
    heart:['<b>Appreciate</b> how a few rules handle all expressions.','<b>Be accurate</b> with widths and offsets.'],
    hand:['<b>Implement</b> the translation in your parser.','<b>Verify</b> with the Lab tools translator.']},
  slides:[
    {k:'Concept', h:'Attributes for expression translation', ic:'🏷️', pts:[['📍','<b>E.addr</b>: the address (name, constant or temporary) holding E’s value.'],['🧾','<b>E.code</b>: the three-address code that computes E.'],['🆕','<b>new Temp()</b>: creates t1, t2, …'],['✍️','<b>gen(…)</b>: creates one instruction.']], tk:'addr says where; code says how.'},
    {k:'Concept', h:'SDD for expressions and assignments', code:`S → id = E ;     S.code = E.code || gen(top.get(id.lexeme) '=' E.addr)
E → E1 + E2      E.addr = new Temp()
                 E.code = E1.code || E2.code || gen(E.addr '=' E1.addr '+' E2.addr)
E → - E1         E.addr = new Temp()
                 E.code = E1.code || gen(E.addr '=' 'minus' E1.addr)
E → ( E1 )       E.addr = E1.addr ;  E.code = E1.code
E → id           E.addr = top.get(id.lexeme) ;  E.code = ''`, tk:'|| = concatenation of code.'},
    {k:'Animation', h:'Translating x = ( a + b ) * c', demo:'exprtrans', tk:'Three instructions.'},
    {k:'Concept', h:'Incremental translation', ic:'⚡', code:`S → id = E ;   { gen(top.get(id.lexeme) '=' E.addr); }
E → E1 + E2    { E.addr = new Temp(); gen(E.addr '=' E1.addr '+' E2.addr); }
E → - E1       { E.addr = new Temp(); gen(E.addr '=' 'minus' E1.addr); }
E → ( E1 )     { E.addr = E1.addr; }
E → id         { E.addr = top.get(id.lexeme); }`, p:'gen appends to one output stream, so E.code is no longer needed — only E.addr.', tk:'Postfix SDT that emits as it goes.'},
    {k:'Concept', h:'Array layout', ic:'🧱', p:'Elements are stored consecutively. For a 1-D array A with element width w, the address of A[i] is <b>base + i × w</b> (with 0-based index). For 2-D row-major A[i][j] with n₂ columns: <b>base + (i × n₂ + j) × w</b> = base + i × w₁ + j × w₂.', code:`int A[2][3]  (w = 4)  → row width w1 = 12, element width w2 = 4
A[1][2] → base + 1*12 + 2*4 = base + 20`, tk:'Row-major is used by C, C++, Java, Python (NumPy default).'},
    {k:'Animation', h:'Translating x = a[i]', demo:'arrayref', tk:'Offset computation + indexed copy.'},
    {k:'Example', h:'Two-dimensional example', code:`int a[2][3]; c + a[i][j]
t1 = i * 12
t2 = j * 4
t3 = t1 + t2
t4 = a [ t3 ]
t5 = c + t4`, tk:'Each dimension contributes index × width.'},
    {k:'Concept', h:'Expressions with mixed types', code:`E → E1 + E2   { E.type = max(E1.type, E2.type);
                a1 = widen(E1.addr, E1.type, E.type);
                a2 = widen(E2.addr, E2.type, E.type);
                E.addr = new Temp(); gen(E.addr '=' a1 '+' a2); }`, tk:'Widen first, then operate.'},
    {k:'Concept', h:'Try it live', p:'Open <b>Lab tools → Expression → three-address code</b>. Type <code>x = (a + b) * c</code>, then <code>a = b * -c + b * -c</code>. Compare the TAC and quadruples with the slides.', tk:'Check your hand translations in seconds.'}
  ],
  lab:{t:'Lab: translate expressions and arrays', steps:['Add incremental TAC generation to your recursive-descent expression parser (E returns addr).','Translate: <code>x = a * (b - c) + d</code> and <code>y = -(p + q) * r</code>.','Add 1-D array references with width 4 and translate <code>s = s + a[i * 2]</code>.','For <code>int m[3][5]</code>, translate <code>v = m[i][j] + 1</code> by hand.'], out:'Code, TAC outputs, and the hand translation.'},
  disc:['Why does E → ( E1 ) need no new temporary?','Why does C use row-major order and Fortran column-major?','What happens to temporaries in the back end?'],
  mistakes:['Creating a new temporary for parentheses.','Forgetting the element width in array offsets.','Using column-major formulas for C arrays.','Emitting code for E2 before E1 (wrong evaluation order).'],
  rev:['E.addr holds the result; E.code the instructions (or emit incrementally with gen).','Each operator gets a new temporary; parentheses and ids do not.','1-D: base + i × w; 2-D row-major: base + i × w₁ + j × w₂.','Widen operands before operating on mixed types.','Incremental translation = postfix SDT with gen().'],
  hw:'Read Dragon §6.6 (control flow).',
  quiz:[
    {q:'For E → ( E1 ), E.addr =', o:['new Temp()','E1.addr','0','id'], a:1, e:'Parentheses only group.'},
    {q:'TAC for x = a + b * c needs how many temporaries (naive)?', o:['1','2','3','0'], a:1, e:'t1 = b * c; t2 = a + t1; x = t2.'},
    {q:'Address of A[5] in an int array (w = 4, base B) is…', o:['B + 5','B + 20','B + 4','B × 5'], a:1, e:'5 × 4 = 20.'},
    {q:'In row-major int A[2][3], the offset of A[1][1] is…', o:['4','16','12','20'], a:1, e:'1×12 + 1×4 = 16.'},
    {q:'gen() in incremental translation…', o:['Returns a code string','Appends an instruction to the output','Parses tokens','Allocates registers'], a:1, e:'Emits directly.'}],
  terms:[['E.addr','The address (name, constant or temporary) holding the value of E.'],['E.code','The sequence of three-address instructions computing E.'],['gen()','Function that creates/emits one three-address instruction.'],['Incremental translation','Emitting instructions during parsing instead of building code attributes.'],['Row-major order','Array layout where each row is stored contiguously.'],['Element width','Number of bytes occupied by one array element.']]
},
{ id:28, week:15, unit:'Control flow', ic:'🔀', lo:[4], book:'Dragon Ch. 6.6',
  title:'Control Flow, Boolean Expressions and Short-Circuit Code',
  sub:'Boolean expressions as values vs as jumps; short-circuit (jumping) code; translating if, if-else and while with labels; the SDD for flow-of-control statements.',
  intro:'<code>if (p != NULL &amp;&amp; p-&gt;x &gt; 0)</code> is safe in C only because the second test is <b>skipped</b> when the first is false. That is short-circuit evaluation — and it is implemented with jumps.',
  obj:['Explain the two uses of boolean expressions: computing values and altering control flow.','Generate short-circuit (jumping) code for ||, && and !.','Translate if, if-else and while using labels B.true, B.false and S.next.','Write the SDD for flow-of-control statements.','Explain why short-circuit evaluation is a language rule, not just an optimisation.'],
  bloom:{head:['<b>Explain</b> jumping code.','<b>Apply</b> the control-flow SDD.','<b>Translate</b> nested statements.'],
    heart:['<b>Appreciate</b> how jumps express logic.','<b>Value</b> short-circuit semantics for safe code.'],
    hand:['<b>Write</b> TAC with labels for nested if/while.','<b>Trace</b> execution paths through the code.']},
  slides:[
    {k:'Concept', h:'Two uses of boolean expressions', cmp:[['Computing a value',['flag = a &lt; b &amp;&amp; c','Result stored as 0/1','Like arithmetic']],['Altering control flow',['if (a &lt; b &amp;&amp; c) …','The value is never stored','Represented by the <b>position reached</b> in the code']]], tk:'In statements, booleans become jumps.'},
    {k:'Concept', h:'Short-circuit (jumping) code', ic:'⚡', p:'For <b>B1 || B2</b>: if B1 is true, B is true — skip B2. For <b>B1 &amp;&amp; B2</b>: if B1 is false, B is false — skip B2.', code:`if (p != NULL &amp;&amp; p-&gt;x &gt; 0) …
     if p == NULL goto Lfalse      // second test never runs on NULL
     if p-&gt;x &lt;= 0 goto Lfalse
     ... then-part ...`, tk:'In C, Java and Python, short-circuiting is part of the language definition.'},
    {k:'Animation', h:'Short-circuit code in action', demo:'shortcircuit', tk:'No boolean value is ever stored.'},
    {k:'Animation', h:'Jumping-code rules', demo:'boolcode', tk:'B.true and B.false are inherited labels.'},
    {k:'Animation', h:'Translating if-else', demo:'ifelse', tk:'B.true → S1, B.false → S2, both to S.next.'},
    {k:'Animation', h:'Translating while', demo:'whiletr', tk:'A label at the top and a goto back.'},
    {k:'Concept', h:'SDD for flow-of-control statements', code:`P → S                 S.next = newlabel(); P.code = S.code || label(S.next)
S → if ( B ) S1       B.true = newlabel(); B.false = S1.next = S.next
                      S.code = B.code || label(B.true) || S1.code
S → if ( B ) S1 else S2
                      B.true = newlabel(); B.false = newlabel(); S1.next = S2.next = S.next
                      S.code = B.code || label(B.true) || S1.code || gen('goto' S.next)
                               || label(B.false) || S2.code
S → while ( B ) S1    begin = newlabel(); B.true = newlabel(); B.false = S.next; S1.next = begin
                      S.code = label(begin) || B.code || label(B.true) || S1.code || gen('goto' begin)
S → S1 S2             S1.next = newlabel(); S2.next = S.next
                      S.code = S1.code || label(S1.next) || S2.code`, tk:'Labels are inherited; code is synthesized.'},
    {k:'Example', h:'Nested example', code:`while (i &lt; n) { if (a[i] &gt; m) m = a[i]; i = i + 1; }

L1: if i &lt; n goto L2
    goto Lnext
L2: t1 = i * 4
    t2 = a [ t1 ]
    if t2 &gt; m goto L3
    goto L4
L3: t3 = i * 4
    m = a [ t3 ]
L4: i = i + 1
    goto L1
Lnext:`, tk:'Each construct contributes its own labels.'},
    {k:'Concept', h:'Value-producing booleans', code:`flag = a &lt; b || c &lt; d
    if a &lt; b goto L1
    if c &lt; d goto L1
    flag = false ; goto L2
L1: flag = true
L2:`, tk:'When a value is needed, jump to code that stores true or false.'},
    {k:'Concept', h:'Short-circuit is semantics, not optimisation', pts:[['🛡️','<code>p != NULL &amp;&amp; p-&gt;x</code> would crash without it.'],['🔁','<code>i &lt; n &amp;&amp; a[i] != key</code> avoids out-of-bounds access.'],['📞','<code>f() || g()</code> — g() is not even called if f() is true; side effects differ.']], tk:'The compiler must preserve the skipping exactly.'}
  ],
  lab:{t:'Lab: write jumping code', steps:['Translate <code>if (a &lt; b &amp;&amp; c &gt; d || e == f) x = 1; else x = 2;</code> using the rules.','Translate <code>while (i &lt; n &amp;&amp; a[i] != key) i = i + 1;</code> (int width 4).','For each, mark which tests are skipped when the first test decides the result.','Add if/while TAC generation to your recursive-descent translator.'], out:'Hand translations with path annotations and code output.'},
  disc:['What would go wrong if a compiler evaluated both sides of && always?','How does Python’s "and" differ from "&amp;" on integers?','Why are B.true and B.false inherited, not synthesized?'],
  mistakes:['Evaluating both operands of || before jumping.','Swapping B.true and B.false for !.','Forgetting goto S.next after S1 in if-else.','Placing the while test after the body (that is do-while).'],
  rev:['Booleans in conditions become jumps (short-circuit code).','||: B1 true → B true; &&: B1 false → B false; !: swap labels.','if-else: B.code, B.true: S1, goto next, B.false: S2.','while: begin label, test, body, goto begin.','Short-circuiting is required language semantics.'],
  hw:'Read Dragon §6.6.5–6.6.6 (avoiding redundant gotos).',
  quiz:[
    {q:'In B1 || B2, if B1 is true…', o:['B2 is evaluated anyway','B2 is skipped','An error occurs','B is false'], a:1, e:'Short-circuit.'},
    {q:'For B → ! B1, the rule is…', o:['B1.true = B.true','B1.true = B.false; B1.false = B.true','gen(not)','B1.true = newlabel()'], a:1, e:'Swap the targets.'},
    {q:'In while (B) S1, after S1 the code jumps to…', o:['S.next','begin (the test)','B.false','Nowhere'], a:1, e:'Loop back.'},
    {q:'B.true and B.false are…', o:['Synthesized','Inherited','Tokens','Temporaries'], a:1, e:'Passed down from the statement.'},
    {q:'In if (B) S1 else S2, the instruction after S1.code is…', o:['label B.false','goto S.next','goto B.true','nothing'], a:1, e:'Skip over S2.'}],
  terms:[['Short-circuit code','Code for boolean expressions where operators are implemented with jumps, skipping unnecessary tests.'],['Jumping code','Synonym for short-circuit code.'],['B.true / B.false','Inherited labels to jump to when B is true / false.'],['S.next','Inherited label of the instruction after statement S.'],['newlabel()','Function that creates a fresh label.']]
},
/* ================= WEEK 16 ================= */
{ id:29, week:16, unit:'Control flow', ic:'🧭', lo:[4], book:'Dragon Ch. 6.6.5–6.6.6',
  title:'Control-Flow Translation of Boolean Expressions and Avoiding Redundant Code',
  sub:'Full translation of relational and boolean expressions; the special label fall; avoiding redundant gotos; boolean values and jumping code together.',
  intro:'The basic rules work, but they generate many <code>goto</code>s that jump to the very next line. Today we produce tighter code with the <b>fall</b> label.',
  obj:['Translate relational expressions and boolean operators with the full rule set.','Identify redundant gotos in generated code.','Apply the fall-through rules with ifFalse.','Translate boolean expressions that are used as values.','Compare instruction counts before and after.'],
  bloom:{head:['<b>Apply</b> the fall rules.','<b>Analyze</b> code for redundancy.','<b>Evaluate</b> instruction counts.'],
    heart:['<b>Value</b> elegant, minimal code.','<b>Take pride</b> in optimising carefully without changing meaning.'],
    hand:['<b>Rewrite</b> naive jumping code into fall-through code.','<b>Implement</b> the fall rules in a translator.']},
  slides:[
    {k:'Concept', h:'Relational expressions', code:`B → E1 rel E2    B.code = E1.code || E2.code
                          || gen('if' E1.addr rel.op E2.addr 'goto' B.true)
                          || gen('goto' B.false)
B → true          B.code = gen('goto' B.true)
B → false         B.code = gen('goto' B.false)`, tk:'Two instructions per comparison in the basic scheme.'},
    {k:'Concept', h:'The boolean operators', code:`B → B1 || B2   B1.true = B.true; B1.false = newlabel(); B2.true = B.true; B2.false = B.false
               B.code = B1.code || label(B1.false) || B2.code
B → B1 &amp;&amp; B2   B1.true = newlabel(); B1.false = B.false; B2.true = B.true; B2.false = B.false
               B.code = B1.code || label(B1.true) || B2.code
B → ! B1       B1.true = B.false; B1.false = B.true; B.code = B1.code`, tk:'Only labels are created — no instructions for the operators themselves.'},
    {k:'Animation', h:'Where the waste is', demo:'redundant', tk:'goto to the next instruction = wasted work.'},
    {k:'Concept', h:'The special label fall', ic:'⬇️', p:'<b>fall</b> means "do not jump; continue with the next instruction". Use it for whichever exit is laid out immediately after the code.', code:`S → if ( B ) S1     B.true = fall;  B.false = S1.next = S.next
                     S.code = B.code || S1.code`, tk:'The then-part directly follows the test.'},
    {k:'Concept', h:'Relational expression with fall', code:`test = E1.addr rel.op E2.addr
if B.true ≠ fall and B.false ≠ fall:  gen('if' test 'goto' B.true) || gen('goto' B.false)
else if B.true ≠ fall:                gen('if' test 'goto' B.true)
else if B.false ≠ fall:               gen('ifFalse' test 'goto' B.false)
else:                                 (no code)`, tk:'One instruction instead of two in the common case.'},
    {k:'Concept', h:'|| and && with fall', code:`B → B1 || B2   B1.true = (B.true ≠ fall) ? B.true : newlabel()
               B1.false = fall;  B2.true = B.true;  B2.false = B.false
               B.code = (B.true ≠ fall) ? B1.code || B2.code
                                        : B1.code || B2.code || label(B1.true)
B → B1 &amp;&amp; B2   B1.true = fall;  B1.false = (B.false ≠ fall) ? B.false : newlabel()
               B2.true = B.true;  B2.false = B.false
               B.code = (B.false ≠ fall) ? B1.code || B2.code
                                         : B1.code || B2.code || label(B1.false)`, tk:'Fall through to the second operand.'},
    {k:'Animation', h:'Result: the compact code', demo:'shortcircuit', tk:'3 jumps instead of 6.'},
    {k:'Concept', h:'Boolean values and jumping code together', code:`x = a &lt; b &amp;&amp; c &lt; d      (value needed)
    ifFalse a &lt; b goto L1
    ifFalse c &lt; d goto L1
    t = true
    goto L2
L1: t = false
L2: x = t`, tk:'Use jumping code, then materialise the value at the end.'},
    {k:'Concept', h:'Peephole view', ic:'🔍', pts:[['🗑️','goto L immediately followed by L: → delete the goto.'],['↪️','if c goto L1; goto L2; L1: → ifFalse c goto L2; L1:.'],['🔗','goto to a goto → jump directly to the final target.']], tk:'A peephole optimiser would find these too — fall avoids generating them.'}
  ],
  lab:{t:'Lab: compare naive and fall-through code', steps:['Translate <code>if (x &lt; 100 || x &gt; 200 &amp;&amp; x != y) x = 0;</code> with the basic rules; count instructions.','Translate it again with the fall rules; count instructions.','Translate <code>while (a &lt; b &amp;&amp; !(c == d)) a = a + 1;</code> with fall.','Implement the fall rules in your translator and compare outputs.'], out:'Two translations with counts, one loop translation, code output.'},
  disc:['Is removing redundant gotos an optimisation or just good translation?','Why does ! need no instructions?','Could the back end remove these gotos instead?'],
  mistakes:['Using fall for both B.true and B.false (no code is generated, logic is lost).','Forgetting the label for B1.true when B.true is fall in ||.','Writing "if not" instead of ifFalse with the same condition.','Changing the order of tests (breaks short-circuit semantics).'],
  rev:['Basic rules: each comparison → if … goto B.true; goto B.false.','fall = continue with the next instruction.','With fall, most comparisons need one instruction (if or ifFalse).','||/&& with fall: fall through to the second operand.','Boolean values: jumping code + assignments of true/false.'],
  hw:'Read Dragon §6.7 (backpatching) and §6.8 (switch).',
  quiz:[
    {q:'The label fall means…', o:['Jump to the end of the program','Continue with the next instruction (no jump)','An error','A loop'], a:1, e:'Fall through.'},
    {q:'If B.true = fall and B.false = L1, a comparison a < b generates…', o:['if a < b goto L1','ifFalse a < b goto L1','goto L1','nothing'], a:1, e:'Jump only when false.'},
    {q:'For if (B) S1 with fall, B.true is…', o:['newlabel()','fall','S.next','B.false'], a:1, e:'S1 follows the test.'},
    {q:'The basic and fall translations of the example differ by…', o:['0 instructions','3 unconditional gotos','10 labels','Nothing important'], a:1, e:'3 gotos removed.'},
    {q:'Which needs no instructions of its own?', o:['!','||','&&','rel'], a:0, e:'! swaps labels.'}],
  terms:[['fall','Special label meaning "fall through to the next instruction".'],['ifFalse','Conditional jump taken when the condition is false.'],['Redundant goto','A jump to the instruction that would execute next anyway.'],['Peephole optimisation','Improving short sequences of instructions by local patterns.']]
},
{ id:30, week:16, unit:'Control flow', ic:'🩹', lo:[4], book:'Dragon Ch. 6.7–6.8',
  title:'Backpatching and Switch-Statement Translation',
  sub:'One-pass code generation with lists of jumps: makelist, merge, backpatch; translation scheme for boolean expressions and statements; translating switch with tests at the end or jump tables.',
  assess:'Assignment-4',
  intro:'Jump targets are often unknown when a jump is generated: we have not seen the else-part yet. <b>Backpatching</b> leaves the target empty, remembers the jump in a list, and fills it in later — all in one pass.',
  obj:['Explain why backpatching is needed for one-pass translation.','Use makelist, merge and backpatch.','Translate boolean expressions with truelist and falselist.','Translate if, if-else, while and statement lists with nextlist.','Translate switch statements with tests at the end or a jump table.'],
  bloom:{head:['<b>Explain</b> backpatching.','<b>Apply</b> the translation scheme to an expression.','<b>Choose</b> a switch translation strategy.'],
    heart:['<b>Appreciate</b> the cleverness of deferred decisions.','<b>Value</b> one-pass efficiency.'],
    hand:['<b>Fill</b> quad tables with backpatching by hand.','<b>Implement</b> makelist/merge/backpatch.']},
  slides:[
    {k:'Concept', h:'The problem', ic:'❓', p:'When generating <code>if x &lt; 100 goto ___</code> we do not yet know where the true-branch code will start. Two-pass solutions use labels and resolve them later; <b>backpatching</b> does it in one pass.', tk:'Generate now, fill targets later.'},
    {k:'Animation', h:'The three functions', demo:'bpfuncs', tk:'makelist, merge, backpatch.'},
    {k:'Concept', h:'Attributes for backpatching', pts:[['✅','<b>B.truelist</b>: jumps to be patched with the "true" target.'],['❌','<b>B.falselist</b>: jumps to be patched with the "false" target.'],['➡️','<b>S.nextlist</b>: jumps to the code after S.'],['📍','<b>M.instr</b>: marker non-terminal M → ε that records nextinstr (the index of the next quad).']], tk:'All are synthesized — fits bottom-up parsing perfectly.'},
    {k:'Concept', h:'Translation scheme for boolean expressions', code:`B → B1 || M B2   { backpatch(B1.falselist, M.instr);
                   B.truelist = merge(B1.truelist, B2.truelist);
                   B.falselist = B2.falselist; }
B → B1 &amp;&amp; M B2   { backpatch(B1.truelist, M.instr);
                   B.truelist = B2.truelist;
                   B.falselist = merge(B1.falselist, B2.falselist); }
B → ! B1         { B.truelist = B1.falselist; B.falselist = B1.truelist; }
B → ( B1 )       { B.truelist = B1.truelist; B.falselist = B1.falselist; }
B → E1 rel E2    { B.truelist = makelist(nextinstr); B.falselist = makelist(nextinstr + 1);
                   gen('if' E1.addr rel.op E2.addr 'goto _'); gen('goto _'); }
B → true         { B.truelist = makelist(nextinstr); gen('goto _'); }
B → false        { B.falselist = makelist(nextinstr); gen('goto _'); }
M → ε            { M.instr = nextinstr; }`, tk:'A postfix SDT — easy for LR parsers.'},
    {k:'Animation', h:'Backpatching x < 100 || x > 200 && x != y', demo:'backpatch', tk:'Final truelist {100, 104}, falselist {103, 105}.'},
    {k:'Concept', h:'Statements with backpatching', code:`S → if ( B ) M S1          { backpatch(B.truelist, M.instr);
                             S.nextlist = merge(B.falselist, S1.nextlist); }
S → if ( B ) M1 S1 N else M2 S2
                           { backpatch(B.truelist, M1.instr); backpatch(B.falselist, M2.instr);
                             S.nextlist = merge(merge(S1.nextlist, N.nextlist), S2.nextlist); }
S → while M1 ( B ) M2 S1   { backpatch(S1.nextlist, M1.instr); backpatch(B.truelist, M2.instr);
                             S.nextlist = B.falselist; gen('goto' M1.instr); }
S → { L }                  { S.nextlist = L.nextlist; }
L → L1 M S                 { backpatch(L1.nextlist, M.instr); L.nextlist = S.nextlist; }
N → ε                      { N.nextlist = makelist(nextinstr); gen('goto _'); }`, tk:'N generates the jump over the else-part.'},
    {k:'Example', h:'Completing the example inside an if', code:`if (x &lt; 100 || x &gt; 200 &amp;&amp; x != y) x = 0;
100: if x &lt; 100 goto 106
101: goto 102
102: if x &gt; 200 goto 104
103: goto 107
104: if x != y goto 106
105: goto 107
106: x = 0
107: …            (S.nextlist = {103, 105} patched to 107 by the enclosing statement)`, tk:'Every _ is now a real quad number.'},
    {k:'Animation', h:'Translating switch', demo:'switchtr', tk:'Evaluate once, jump to tests at the end.'},
    {k:'Concept', h:'Switch strategies', cmp:[['Sequence of tests',['Few cases','if t = V goto L … in order','O(n) tests at run time']],['Jump table / hash',['Many dense cases → jump table indexed by t − min','Sparse cases → hash table or binary search','O(1) or O(log n) dispatch']]], psy:'GCC and Clang choose automatically between compare chains, binary decision trees and jump tables depending on the case values.', tk:'The compiler picks a strategy from the case values.'},
    {k:'Concept', h:'Course wrap-up: the whole front end', demo:'finalreview', tk:'From characters to three-address code — you have built every piece.'}
  ],
  lab:{t:'Lab: backpatching by hand and in code', steps:['Starting at quad 100, translate <code>a &lt; b &amp;&amp; (c &lt; d || e &lt; f)</code> with backpatching; show truelist and falselist after each reduction.','Translate <code>while (a &lt; b) if (c &lt; d) x = y + z; else x = y - z;</code> with backpatching.','Implement makelist, merge and backpatch with arrays of quads.','Translate a switch with cases 1, 2, 5 and default using tests at the end.'], out:'Two quad tables with lists, working functions, switch translation.'},
  disc:['Why is backpatching natural for bottom-up parsers?','When is a jump table better than a sequence of tests?','How does C’s fall-through between cases (no break) affect translation?'],
  mistakes:['Patching a list with the wrong M.instr (off by one).','Forgetting to merge S1.nextlist into S.nextlist.','Leaving some jumps unpatched at the end of translation.','Evaluating the switch expression once per case.'],
  rev:['Backpatching: emit jumps with empty targets; keep lists; fill later.','makelist(i), merge(p1, p2), backpatch(p, i).','B.truelist/falselist; S.nextlist; M.instr marks positions.','|| backpatches B1.falselist; && backpatches B1.truelist.','switch: evaluate once; tests at the end or jump/hash table.'],
  hw:'Complete Assignment 4. Start final-exam revision with the Final unit.',
  quiz:[
    {q:'backpatch(p, i)…', o:['Creates a list','Inserts i as the target of every jump on list p','Merges lists','Deletes jumps'], a:1, e:'Fills targets.'},
    {q:'In B → B1 && M B2, which list is backpatched?', o:['B1.falselist','B1.truelist','B2.truelist','None'], a:1, e:'If B1 is true, go evaluate B2.'},
    {q:'M → ε records…', o:['A token','The index of the next instruction','A type','A scope'], a:1, e:'M.instr = nextinstr.'},
    {q:'In the example, the final truelist is…', o:['{100}','{100, 104}','{103, 105}','{102}'], a:1, e:'x < 100 or the whole && true.'},
    {q:'A switch with 100 dense cases is best translated with…', o:['100 sequential tests','A jump table','Backtracking','A DFA'], a:1, e:'O(1) dispatch.'}],
  assessment:{ kind:'assignment', title:'Assignment 4 — Intermediate Code Generation for MiniC', covers:'Weeks 13–16: SDTs, type checking and scope, three-address code, expressions, control flow, short-circuit code, backpatching, switch',
    instructions:['Individual work. Extend your Assignment 2/3 parser.','Show hand translations as well as program output.','Submission date and marks are announced by the instructor.'],
    tasks:['Add type checking with int/float coercions and scope handling (undeclared and redeclared variables).','Generate three-address code for expressions, assignments and 1-D array references (int width 4).','Generate short-circuit code for if, if-else and while using the fall rules.','By hand, translate the program below with backpatching (quads from 100) and show truelist/falselist/nextlist at each step.','Translate a switch statement with at least four cases and a default; explain whether you would use tests or a jump table.','Print the TAC as quadruples and as triples for one function.'],
    scenario:'Program for task 4:<br><code>while (i &lt; n &amp;&amp; a[i] != key) { if (a[i] &gt; max) max = a[i]; i = i + 1; }</code>',
    submission:['PDF with hand translations (tasks 4–5).','Source code + README.','TAC output for at least three test programs.'],
    reflection:['What was the hardest bug in your code generator?','Compare the size of your code with and without the fall rules.'],
    example:`<b>Sample output:</b><pre class="code">100: ifFalse i &lt; n goto 109
101: t1 = i * 4
102: t2 = a [ t1 ]
103: ifFalse t2 != key goto 109
…</pre>`,
    note:'Copied work receives zero.' },
  terms:[['Backpatching','Generating jumps with unknown targets and filling them in later in the same pass.'],['makelist','Creates a list containing one instruction index.'],['merge','Concatenates two lists of jumps.'],['backpatch','Fills a target into every jump on a list.'],['truelist / falselist','Lists of jumps to patch with the true / false target.'],['nextlist','List of jumps to the code following a statement.'],['Marker non-terminal','M → ε used only to record the current instruction index.'],['Jump table','An array of addresses indexed by the switch value.']]
},
/* ================= WEEK 17: FINAL ================= */
{ id:99, week:17, exam:true, label:'Final Exam', short:'Final', unit:'Final examination', ic:'🎓', lo:[1,2,3,4],
  title:'Final Exam Preparation',
  sub:'Complete syllabus revision with emphasis on Weeks 10–16: LL(1) implementation, error recovery, SDDs, dependency graphs, SDTs, type checking, three-address code, control flow, backpatching and switch — with a full mock exam.',
  assess:'Final Exam',
  intro:'The final examination covers the complete course. This unit gives you a structured revision path, algorithm checks and a full mock exam with model answers. The official format, duration and marks are announced by your instructor and the examination office.',
  obj:['Revise all phases and algorithms of the front end.','Practise SDD/SDT problems and dependency graphs.','Generate three-address code for expressions and control flow.','Apply backpatching to boolean expressions and statements.','Manage time across theory and algorithm questions.'],
  bloom:{head:['<b>Synthesise</b> the whole front end into one picture.','<b>Apply</b> every algorithm to new inputs.','<b>Evaluate</b> your own answers with model solutions.'],
    heart:['<b>Approach</b> the exam with confidence and a plan.','<b>Reflect</b> on how far you have come since Week 1.'],
    hand:['<b>Solve</b> a timed full mock exam.','<b>Build</b> a one-page summary sheet.']},
  slides:[
    {k:'Revision', h:'The whole course in one view', demo:'finalreview', tk:'Scanner → parser → recovery → SDD/SDT → types → IR.'},
    {k:'Revision', h:'Before the midterm (summary)', pts:[['🧭','Phases, compiler vs interpreter, language-processing system.'],['🔤','Tokens, REs, NFA → DFA, transition diagrams, scanners, Lex.'],['📐','CFGs, ambiguity, left recursion, left factoring.'],['⬇️','Recursive descent, FIRST/FOLLOW, LL(1) table and trace.']], tk:'Re-read the Midterm unit too.'},
    {k:'Revision', h:'After the midterm', pts:[['🩹','Error recovery: panic mode, synch, phrase level, error productions.'],['🏷️','SDDs: synthesized/inherited, S-/L-attributed, dependency graphs, evaluation orders.'],['🔀','SDTs: postfix, actions inside productions, L-attributed → SDT.'],['🔠','Type checking: type expressions, equivalence, coercion; scope rules.'],['🧾','TAC, quadruples, triples, DAG; translation of expressions and arrays.'],['🧭','Short-circuit code, fall, backpatching, switch.']], tk:'Practise at least one problem from each line.'},
    {k:'Animation', h:'Algorithm check: panic-mode recovery', demo:'panic', tk:'Blank → skip; synch → pop.'},
    {k:'Animation', h:'Algorithm check: annotated parse tree', demo:'sddtree', tk:'Synthesized values flow up.'},
    {k:'Animation', h:'Algorithm check: backpatching', demo:'backpatch', tk:'Lists, then patches.'},
    {k:'Concept', h:'Final-exam strategy', ic:'🧭', pts:[['🗺️','Spend the first 5 minutes planning: mark algorithm questions and their time.'],['✍️','For every algorithm, write the rule you are applying, then the steps.'],['🔍','Check: FOLLOW without ε; inherited before, synthesized after; widths in arrays; lists merged.'],['🛌','Rest the night before; tired brains make trace errors.']], tk:'Clear steps earn marks even if the last line is wrong.'}
  ],
  lab:{t:'Activity: full mock exam', steps:['Set a timer for the duration announced by your instructor.','Attempt Parts A–D without notes.','Mark your answers with the explanations and model answers.','Write your one-page summary sheet focusing on the questions you missed.'], out:'Self-marked mock exam + one-page summary.'},
  disc:['Which phase of the compiler do you now understand best? Which least?','Explain backpatching to a classmate in two minutes.'],
  mistakes:['Revising only definitions and not practising algorithms.','Skipping the dependency graph edges direction check.','Forgetting $ in LL(1) traces.','Leaving jump targets as "_" in final answers.'],
  rev:['Lexical: REs, automata, scanners.','Syntax: CFGs, transformations, recursive descent, LL(1), error recovery.','Semantic: SDDs, SDTs, evaluation orders, type checking, scope.','IR: TAC, quads/triples, expressions, arrays.','Control flow: short-circuit code, fall, backpatching, switch.'],
  hw:'Repeat the mock exam after two days and compare.',
  quiz:[
    {q:'Which is an L-attributed but not S-attributed rule?', o:['E.val = E1.val + T.val','L.inh = T.type in D → T L','F.val = digit.lexval','T.val = F.val'], a:1, e:'Inherited from a left sibling.'},
    {q:'In short-circuit code for B1 && B2, if B1 is false we jump to…', o:['B2','B.false','B.true','S.next always'], a:1, e:'The whole && is false.'},
    {q:'makelist(i) returns…', o:['An empty list','A list containing only i','All quads','A label'], a:1, e:'One-element list.'},
    {q:'The type expression of float f(int) is…', o:['integer → float','float → integer','array(int, float)','pointer(float)'], a:0, e:'Argument → result.'},
    {q:'For x = a[i] with int width 4, the first instruction is…', o:['x = a','t1 = i * 4','t1 = a + i','goto L'], a:1, e:'Compute the offset.'}],
  assessment:{ kind:'exam', title:'Final Mock Examination (Complete Course)', covers:'All topics, Weeks 1–16',
    instructions:['Attempt all questions.','Show working for every algorithm.','Official duration and marks are announced by the instructor.'],
    mcq:[
      {q:'Which phase inserts inttofloat conversions?', o:['Lexical','Syntax','Semantic','Linking'], a:2, e:'Type checking.'},
      {q:'The subset construction converts…', o:['RE → NFA','NFA → DFA','CFG → LL(1)','SDD → SDT'], a:1, e:'NFA to DFA.'},
      {q:'A grammar with left recursion is…', o:['Always LL(1)','Never LL(1)','Always ambiguous','Regular'], a:1, e:'Conflict in the table.'},
      {q:'synch entries are added for terminals in…', o:['FIRST(A)','FOLLOW(A)','The symbol table','Every cell'], a:1, e:'FOLLOW sets (empty cells).'},
      {q:'A dependency graph with a cycle means…', o:['Any order works','No evaluation order exists','The SDD is S-attributed','A syntax error'], a:1, e:'Circular.'},
      {q:'Which form has no result field?', o:['Quadruples','Triples','SSA','Assembly'], a:1, e:'Results by position.'},
      {q:'With the fall rules, if (a < b) x = 1; generates the test…', o:['if a < b goto L','ifFalse a < b goto S.next','goto S.next','nothing'], a:1, e:'Jump only when false.'},
      {q:'In B → B1 || M B2, backpatch is called on…', o:['B1.truelist','B1.falselist','B2.falselist','M.instr'], a:1, e:'If B1 is false, evaluate B2.'}],
    tf:[
      {q:'Static scope resolves names by the program text.', a:true, e:'Lexical scoping.'},
      {q:'Every L-attributed SDD is S-attributed.', a:false, e:'The reverse is true.'},
      {q:'Short-circuit evaluation is only an optimisation and can be dropped.', a:false, e:'It is part of the language semantics.'},
      {q:'A DAG can reduce the number of three-address instructions.', a:true, e:'Common subexpressions are computed once.'},
      {q:'Backpatching requires two passes over the program.', a:false, e:'Its purpose is one-pass translation.'}],
    short:[
      {q:'Define S-attributed and L-attributed SDDs.', a:'S-attributed: all attributes synthesized. L-attributed: each inherited attribute of Xᵢ in A → X₁…Xₙ depends only on inherited attributes of A, attributes of X₁…Xᵢ₋₁, and attributes of Xᵢ itself without cycles; synthesized attributes are allowed.'},
      {q:'Write three-address code for a = b * -c + b * -c and its triples.', a:'t1 = minus c; t2 = b * t1; t3 = minus c; t4 = b * t3; t5 = t2 + t4; a = t5. Triples: (0) minus c; (1) * b (0); (2) minus c; (3) * b (2); (4) + (1) (3); (5) = a (4).'},
      {q:'State the three panic-mode recovery rules of an LL(1) parser.', a:'Blank M[A,a]: skip a. synch M[A,a]: pop A. Terminal on top not matching: pop it.'}],
    app:[
      {q:'Translate with backpatching (quads from 100): if (a < b || c < d && e < f) x = 1;', a:'100: if a < b goto 106; 101: goto 102; 102: if c < d goto 104; 103: goto next; 104: if e < f goto 106; 105: goto next; 106: x = 1. B1: T{100} F{101}; B3: T{102} F{103}; B4: T{104} F{105}; B3&&B4: backpatch({102},104), T{104} F{103,105}; B1||…: backpatch({101},102), T{100,104} F{103,105}; if: backpatch(T,106), nextlist {103,105}.'},
      {q:'Give an SDD with inherited attributes for int a, b, c and draw its dependency graph order.', a:'D → T L {L.inh = T.type}; T → int {T.type = integer}; L → L1 , id {L1.inh = L.inh; addType(id.entry, L.inh)}; L → id {addType(id.entry, L.inh)}. Order: id entries, T.type, L.inh, addType(c), L1.inh, addType(b), L2.inh, addType(a).'},
      {q:'Generate short-circuit code with fall for: while (i < n && a[i] != 0) i = i + 1; (int width 4).', a:'L1: ifFalse i < n goto Lnext; t1 = i * 4; t2 = a [ t1 ]; ifFalse t2 != 0 goto Lnext; i = i + 1; goto L1; Lnext:'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Final examination','The Week 17 examination covering the complete course.']]
}
);
