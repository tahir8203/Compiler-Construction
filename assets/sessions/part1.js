/* Sessions 1–8 (Weeks 1–4). Content only.
   Slide fields: k kind, h heading, p text, ic icon, pts [[icon,text]], cmp [[title,[items]]], code (pre block, HTML-escaped), demo, ex example, psy real-compiler link, tk takeaway, n presenter notes.
   Session fields: bloom {head, heart, hand} = Bloom's Taxonomy outcomes (cognitive, affective, psychomotor). */
COURSE.sessions.push(
/* ================= WEEK 1 ================= */
{ id:1, week:1, unit:'Introduction to compilers', ic:'🧭', lo:[1], book:'Louden Ch. 1 · Cooper & Torczon Ch. 1',
  title:'Introduction to Compiler Construction',
  sub:'What a compiler is, why we study it, compilers vs interpreters, and how Java mixes both.',
  introH:'Why learn how compilers work?',
  intro:'Every time you press <b>Run</b>, a hidden program turns your C, Java or Python into instructions the computer can obey. In this course you open that black box and build the main parts yourself.',
  introAn:'Learning to drive is useful, but a mechanic who knows what is under the bonnet can fix the car, tune it and build a new one. This course makes you the mechanic of programming languages.',
  introN:{say:'Ask the class: “What happens between pressing Run and seeing the output?” Collect answers on the board. Then say: by Week 16 you will be able to answer this in detail.', ask:'Will I ever write a compiler in my job?', ans:'Maybe not a full one, but the same ideas power code editors, JSON readers, SQL engines, search tools and AI model compilers. You will also read error messages and write faster code.', watch:'Do not promise this is an easy course; promise it will be step by step.'},
  obj:['Explain why a computer needs a translator to run our programs.','Define a translator, a compiler and an interpreter in your own words.','Compare compilers and interpreters by speed, error reporting and portability.','Describe how Java mixes both: bytecode, the JVM and the JIT compiler.','Name the qualities of a good compiler.'],
  bloom:{head:['<b>Remember</b> the definitions of translator, compiler and interpreter.','<b>Understand</b> how compilation and interpretation differ.','<b>Analyse</b> which strategy suits a given language or use case.'],
    heart:['<b>Appreciate</b> how much work the compiler does behind every program you write.','<b>Value</b> clear error messages as a service to programmers.'],
    hand:['<b>Run</b> one program with a compiler (gcc) and one with an interpreter (python) and compare.','<b>Measure</b> and record the time each takes.']},
  slides:[
    {k:'Concept', h:'People write words, the CPU needs bits', ic:'💬', p:'We write programs in <b>high-level languages</b> such as C, Java and Python because they are close to English and maths. The <b>CPU</b> (the chip that does the work) only understands <b>machine code</b>: patterns of 0s and 1s.', demo:'translate', an:'You speak Urdu; a visitor speaks only Chinese. Someone must translate, or nothing gets done.', tk:'Between our language and the machine’s language, there must be a translator.',
      n:{say:'Write <code>x = 5 + 3;</code> on the board and next to it a line of binary like <code>10110000 00000101</code>. Ask which one students can read. Then press Play on the animation.', ask:'Why not just write programs in binary?', ans:'It is very slow to write, almost impossible to read, and it only works on one kind of CPU.', watch:'Students often think the CPU “understands C”. It does not; it only runs machine code.'}},
    {k:'Concept', h:'A translator converts one language into another', ic:'🔄', p:'A <b>translator</b> is any program that reads text in one language and produces the same meaning in another language.', pts:[['➡️','Input: the <b>source language</b> (what we wrote).'],['⬅️','Output: the <b>target language</b> (what we get).'],['✅','The meaning must stay exactly the same.']], an:'A human translator turns an Urdu speech into English. The words change; the message must not.', tk:'Translator = same meaning, different language.',
      n:{say:'Translators come in two big families: compilers and interpreters. The next two slides show each one.', ask:'Is Google Translate a translator in this sense?', ans:'Yes, for human languages. A compiler is a translator for programming languages, and it must be 100% exact.', watch:'Make sure students hear the words “source” and “target”; they appear in every lecture.'}},
    {k:'Concept', h:'What is a compiler?', ic:'⚙️', p:'A <b>compiler</b> reads the <b>whole</b> source program and translates it into an equivalent <b>target program</b>. It also reports any errors it finds. You can then run the target program as many times as you like.', code:`source program  ──►  [ COMPILER ]  ──►  target program
                          │
                          ▼
                    error messages`, an:'A translator who translates a whole book once. Readers then read the translated book again and again, without the translator.', tk:'Compiler = translate everything first + report errors.',
      n:{say:'Point to the three arrows: input, output, error messages. Example: <code>gcc hello.c -o hello</code> produces the file <code>hello</code>; we can run <code>./hello</code> a thousand times without gcc.', ask:'Does a compiler run my program?', ans:'No. It only translates. Running happens later, when you start the target program.', watch:'Students confuse “compile” and “run” because an IDE does both with one button.'}},
    {k:'Concept', h:'What is an interpreter?', ic:'🔁', p:'An <b>interpreter</b> does <b>not</b> produce a target program. It reads the source and <b>carries out</b> each statement straight away, one after another, using the inputs you give it.', code:`source program ─┐
                 ├──►  [ INTERPRETER ]  ──►  output
input ──────────┘`, an:'A live interpreter at a meeting translates each sentence as it is spoken. Nothing is written down, so the next meeting needs the interpreter again.', tk:'Interpreter = translate and run, one statement at a time, every time.',
      n:{say:'Compare with the previous slide: no target program comes out, only the program’s output. Examples: Python, early JavaScript, shell scripts and MATLAB are usually interpreted.', ask:'So is Python never compiled?', ans:'Good catch: real Python first compiles to bytecode, then interprets it. We will see this “hybrid” idea in a few slides.', watch:'A language is not compiled or interpreted by nature; the tool that implements it decides.'}},
    {k:'Animation', h:'Compiler vs interpreter in action', demo:'compint', an:'Translating a book once (compiler) versus hiring a live interpreter for every reading (interpreter).', tk:'Compile once and run many times, or interpret every time.',
      n:{say:'Press Step slowly. Stop after the compiler part and ask how many times the compiler worked (once). Then watch the interpreter part and ask again (every run).', ask:'Which one starts running sooner?', ans:'The interpreter: there is no translation step before the first line runs.', watch:'Skip the last (hybrid) frame for now if time is short; slides 8–12 cover it.'}},
    {k:'Comparison', h:'Comparing the two strategies', cmp:[['⚙️ Compiler',['Translates the whole program before it runs','The result runs <b>fast</b>, often 10× faster or more','Finds many errors before the program runs','Needs a separate compile step','The result works only on one kind of machine']],['🔁 Interpreter',['Translates and runs one statement at a time','Runs more slowly','Error messages can show real run-time values','Starts at once: great for scripts and learning','The same source runs wherever the interpreter runs']]], an:'Cooking a meal in advance and reheating it (fast to serve) versus cooking it fresh every time (slower, but you can change the recipe on the spot).', tk:'Speed favours compilers; flexibility favours interpreters.',
      n:{say:'Read across the rows: speed, errors, start-up, portability. Ask students to pick a winner for a mobile game (compiler) and for a quick script (interpreter).', ask:'Can compiled programs still crash while running?', ans:'Yes. A compiler cannot catch everything, e.g. dividing by a number the user types as zero.', watch:'“Interpreters have no errors before running” is wrong; many interpreters check syntax first.'}},
    {k:'Animation', h:'A first look inside: one line through a compiler', demo:'livepipe', full:true, input:'int x = 5 + 3;', p:'A compiler works like a factory line of <b>phases</b>. Press <b>Step</b> to follow <code>int x = 5 + 3;</code> through each phase, or type your own line and press Compile.', an:'A car factory: one station fits the wheels, the next paints, the next tests. Each station does one job.', tk:'Lexer → parser → semantic analysis → intermediate code → optimiser → code generator → output.',
      n:{say:'This is a preview of the whole course. Do not explain every phase in depth. Say one sentence per phase, using the caption under the pipeline. Point out that the optimiser turns 5 + 3 into 8 before the program ever runs.', ask:'Why so many phases? Why not translate in one go?', ans:'Small steps are easier to build, test and reuse. The same front end can feed different back ends, for example Intel and ARM.', watch:'Let one or two students type their own line, e.g. <code>y = a + b * 2;</code>. Try a broken one like <code>x = 5 +;</code> to show a syntax error.'}},
    {k:'Concept', h:'A virtual machine: a pretend computer', ic:'🖥️', p:'A <b>virtual machine</b> is a program that behaves like a computer. It has its own simple instruction language and runs those instructions on whatever real computer it is installed on. Java’s one is the <b>JVM</b> (Java Virtual Machine).', an:'A universal remote control understands one set of buttons and can drive a Sony, a Samsung or an LG TV.', tk:'Write for the virtual machine once; it runs on every real machine that has the VM.',
      n:{say:'We need this idea before bytecode makes sense. The JVM is just a program, like Chrome or Word, that knows how to run Java’s instructions.', ask:'Is the JVM hardware?', ans:'No, it is software. That is why it is called virtual.', watch:'Do not mix this up with VirtualBox or VMware, which pretend to be a whole PC. Same idea, bigger scale.'}},
    {k:'Concept', h:'javac produces bytecode, not machine code', ic:'☕', p:'<b>javac</b> is the Java compiler. It translates your <code>.java</code> file into a <b>.class file</b>. The .class file holds <b>bytecode</b>: instructions for the JVM, not for a real CPU. Each operation code fits in one byte, hence the name.', pts:[['📄','<code>Calc.java</code> → <b>javac</b> → <code>Calc.class</code> (bytecode)'],['🌍','<b>Portable:</b> the same .class runs on Windows, Linux or Android.'],['🔍','See the bytecode with <code>javap -c Calc</code>.']], an:'Musical notes. A composer writes them once; any trained musician on any instrument can play them.', tk:'Bytecode is machine code for a virtual machine.',
      n:{say:'Demo on the lab PC: <code>javac Calc.java</code>, then <code>dir</code> or <code>ls</code> to show Calc.class appeared, then <code>javap -c Calc</code>.', ask:'Why not compile Java straight to machine code?', ans:'Then you would need a different file for every kind of computer. Bytecode is one file for all of them.', watch:'Students say “the .class file is machine code”. It is not; a CPU cannot run it without the JVM.'}},
    {k:'Example', h:'Inside bytecode: a stack machine', ic:'📦', p:'The JVM is a <b>stack machine</b>: values are pushed onto a stack; each operation pops its inputs and pushes the answer.', code:`// Calc.java                      // javap -c Calc   (bytecode)
int f(int a, int b) {             0: iload_1    // push a
  return a + b * 2;               1: iload_2    // push b
}                                 2: iconst_2   // push 2
                                  3: imul       // pop b, 2 → push b*2
                                  4: iadd       // pop a, b*2 → push a+b*2
                                  5: ireturn    // return the top value`, an:'A stack of plates: you only put plates on the top and take them from the top.', tk:'Push the operands, then operate: no CPU registers needed.',
      n:{say:'Trace it on the board with a = 4, b = 3. Stack after each line: [4], [4,3], [4,3,2], [4,6], [10]. Return 10.', ask:'Why does iload_1 load <i>a</i> and not iload_0?', ans:'In a normal (non-static) method, slot 0 holds <code>this</code>, the current object. a is in slot 1 and b in slot 2.', watch:'Later (Session 26) we write the same thing as three-address code: t1 = b * 2; t2 = a + t1. Mention it as a preview only.'}},
    {k:'Concept', h:'The JIT compiler: speeding up the busy parts', ic:'🔥', p:'The JVM first <b>interprets</b> bytecode, so the program starts at once. While it runs, it <b>counts</b> how often each method is called and each loop repeats. This counting is called <b>profiling</b>.', pts:[['1️⃣','<b>Interpret first:</b> no waiting at start-up.'],['2️⃣','<b>Profile:</b> count runs of every method and loop.'],['3️⃣','<b>Hot code</b> (runs very often) is JIT-compiled to machine code.'],['❄️','<b>Cold code</b> (runs rarely) stays interpreted.']], an:'A tourist uses a phrase book for rare sentences, but memorises “Where is the bus?” because she says it every day.', tk:'Interpret cold code, compile hot code: fast start and fast running.',
      n:{say:'JIT means Just-In-Time: compiling happens just before the code is needed, while the program runs. Real example: Oracle’s JVM is called HotSpot after this idea; Chrome’s V8 and C# (.NET) work the same way.', ask:'Why not JIT-compile everything as soon as the program starts?', ans:'Compiling takes time and memory. Most code runs only a few times, so compiling it would cost more than it saves.', watch:'Students think the JIT replaces javac. No: javac still makes the bytecode; the JIT works later inside the JVM.'}},
    {k:'Diagram', h:'Putting it together: how a Java program runs', img:{src:'assets/img/java-jvm-pipeline.png', alt:'Java pipeline: Source code .java goes to the javac compiler, which produces bytecode .class; the JVM (JIT, Interpreter, Runtime) runs it and produces program output.', cap:'.java → javac → .class (bytecode) → JVM (interpreter + JIT + runtime) → output'}, an:'A recipe written in a universal cooking code (bytecode), cooked by any kitchen robot (JVM) that learns the dishes ordered most often (JIT).', tk:'Java is compiled AND interpreted: a hybrid.',
      n:{say:'Walk the arrows left to right. javac runs once, on the developer’s PC, and reports compile-time errors. The .class file is what we ship. On the user’s PC the JVM interprets it, the JIT compiles hot parts, and the runtime manages memory (the garbage collector frees memory nobody uses).', ask:'Which boxes are compilers?', ans:'Two of them: javac (Java → bytecode) and the JIT (bytecode → machine code).', watch:'This answers the classic exam question “Is Java compiled or interpreted?”: both.'}},
    {k:'Concept', h:'Other hybrids you already use', ic:'🧩', p:'Most modern languages mix compiling and interpreting.', pts:[['🐍','<b>Python (CPython):</b> compiles each .py file to .pyc bytecode, then interprets it.'],['🌐','<b>JavaScript (V8 in Chrome):</b> interprets first, then JIT-compiles hot functions.'],['🤖','<b>Android:</b> Kotlin/Java become DEX bytecode; the phone’s ART runtime compiles it to machine code, partly ahead of time and partly with a JIT.']], an:'Hybrid cars: an electric motor for starting and slow traffic, a petrol engine for speed. Each is used where it is best.', tk:'Real systems use compiling and interpreting together.',
      n:{say:'Show a __pycache__ folder from any Python project: the .pyc files are Python’s bytecode.', ask:'So which languages are “really” interpreted?', ans:'Almost none are purely interpreted today. Shell scripts are close.', watch:'Avoid saying “Python is interpreted, full stop”; say “usually interpreted, after compiling to bytecode”.'}},
    {k:'Example', h:'Translators are all around you', ic:'🌍', pts:[['🧾','<b>gcc / clang:</b> C → machine code'],['🌐','<b>TypeScript compiler:</b> TypeScript → JavaScript'],['🗄️','<b>Database engines:</b> an SQL query → an execution plan'],['📄','<b>LaTeX:</b> text with markup → PDF'],['📝','<b>Code editors:</b> use a scanner to colour your code'],['🔗','<b>Pre-processors, linkers and loaders</b> help turn your code into a running program (next lecture)']], an:'Translation is like electricity in a house: you rarely see it, but almost everything uses it.', tk:'If it reads a language and produces something else, it is a translator.',
      n:{say:'Ask each row: what is the source language and what is the target? Tap the underlined words for quick meanings; Session 2 explains pre-processors, linkers and loaders properly.', ask:'Is Microsoft Word a compiler?', ans:'Not really, but its “save as PDF” feature is a translator: document format → PDF.', watch:'Keep this slide short; it is for motivation.'}},
    {k:'Concept', h:'What makes a good compiler?', ic:'✅', pts:[['✔️','<b>Correct:</b> the target program means exactly what the source means. This matters most.'],['⚡','<b>Fast code:</b> the program it produces runs quickly.'],['⏱️','<b>Fast compiling:</b> you do not wait long.'],['🩺','<b>Helpful error messages</b> that point to the real problem.'],['🔧','<b>Easy to maintain</b> and to move to new machines.']], an:'A good translator is first of all accurate. A fast translator who changes the meaning of a contract is dangerous.', tk:'Correctness first, then speed of the code, then speed of the compiler.',
      n:{say:'Ask students to rank these five before you reveal that correctness is number one.', ask:'Would you accept a compiler that makes code 2× faster but is wrong 1% of the time?', ans:'No. One wrong result in a bank or a plane is a disaster.', watch:'This slide connects to every later topic: each phase must keep the meaning.'}}
  ],
  lab:{t:'Lab: compile vs interpret the same program', demo:'labrace', demoH:'The lab, animated: speed and errors', demoN:'Step 3: the Python time is typical for a lab PC (about 1 second); gcc -O2 may work out the whole loop at compile time, so C shows close to 0 s. Step 5: Python compiles the whole file to bytecode first, which is why a syntax error appears before anything is printed. Step 6 shows the classic interpreter behaviour: a run-time error appears only when execution reaches it. Ask: which behaviour would you want in a banking system?', steps:['Write a program that adds 1 to 10,000,000 in C (<code>sum.c</code>) and in Python (<code>sum.py</code>).','Compile the C version: <code>gcc -O2 sum.c -o sum</code>. Run <code>./sum</code> and time it.','Run <code>python sum.py</code> and time it.','Add a <b>syntax error</b> (a missing bracket) on the last line of both files. Both refuse to start: Python compiles the whole file to bytecode first.','Instead, use an <b>undefined variable</b> on the last line. C will not compile; Python prints the sum, then stops with a NameError.','Record the times and the error behaviour in a table.'], out:'A table: execution time, when each kind of error is reported, and which files were produced.',
    n:{say:'Students work in pairs: one runs C, one runs Python, then they swap.', ask:'Why is C so much faster here?', ans:'gcc turned the loop into machine code (and may even pre-compute the answer). Python interprets bytecode one operation at a time.', watch:'If gcc is not installed, use an online compiler such as onlinegdb.com for the C part.'}},
  disc:['Is Java compiled or interpreted? Defend your answer.','Why might a beginner prefer an interpreter?','Name a non-programming tool you use that contains a “compiler”.'],
  mistakes:['Saying an interpreter “converts the program to machine code first”. That is what a compiler does.','Thinking compiled programs cannot have run-time errors.','Believing a language is compiled or interpreted by nature. The <b>implementation</b> (the tool) decides.','Thinking the .class file is machine code. It is bytecode for the JVM.','Confusing the compiler with the IDE or the editor.'],
  rev:['A translator keeps the meaning and changes the language.','A compiler translates the whole program first and reports errors; the result runs fast, many times.','An interpreter translates and runs one statement at a time, every time.','Java is a hybrid: javac makes bytecode; the JVM interprets it and its JIT compiles the hot parts.','Correctness is the most important quality of a compiler.'],
  hw:'Read Louden Chapter 1.1–1.2. Find two languages that are usually compiled and two usually interpreted; for each, name the tool that implements it.',
  check:[
    {q:'You run a C program 100 times. How many times does the compiler translate it?', o:['100 times','Once','Never','Twice'], a:1, e:'A compiler translates once; the target program can then run many times without it.'},
    {q:'What does javac produce?', o:['Machine code for Intel CPUs','Bytecode in a .class file','Python code','An .exe file'], a:1, e:'javac turns .java into .class bytecode for the JVM.'},
    {q:'Why does the JIT compile only <b>hot</b> code?', o:['Hot code has more errors','Compiling takes time, so it only pays off for code that runs very often','The JVM cannot compile cold code','Hot code is shorter'], a:1, e:'Profiling finds code that runs often; compiling it repays the time spent compiling.'}],
  quiz:[
    {q:'Which program produces a separate target program?', o:['Interpreter','Compiler','Debugger','Text editor'], a:1, e:'A compiler outputs an equivalent target program.'},
    {q:'Which usually gives faster <b>execution</b>?', o:['Interpreted code','Compiled machine code','Both are always equal','Neither'], a:1, e:'Compiled code runs directly on the CPU.'},
    {q:'Java source is first translated into…', o:['Machine code for x86','Bytecode','Assembly for ARM','HTML'], a:1, e:'javac produces bytecode for the JVM.'},
    {q:'The <b>most important</b> property of a compiler is that it is…', o:['Fast','Small','Correct (preserves meaning)','Written in C'], a:2, e:'A fast compiler that changes the meaning is useless.'},
    {q:'A JIT compiler translates code…', o:['Before the program is shipped','While the program is running','Only on paper','Only for comments'], a:1, e:'Just-In-Time: at run time, for hot code.'},
    {q:'The JVM keeps values for <code>iadd</code> and <code>imul</code> on…', o:['CPU registers only','A stack','The hard disk','The source file'], a:1, e:'The JVM is a stack machine: operations pop their inputs and push the result.'},
    {q:'“Profiling” in the JVM means…', o:['Drawing a picture of the program','Counting how often methods and loops run','Checking the programmer’s profile','Deleting unused code'], a:1, e:'The counts tell the JIT which code is hot.'}],
  terms:[['Translator','General term for any program that converts one language into another.'],['Compiler','A program that translates a source program into an equivalent target program and reports errors.'],['Interpreter','A program that directly executes the operations in a source program on given inputs.'],['Source language','The language a program is written in before translation.'],['Target language','The language produced by a compiler, e.g. machine code or bytecode.'],['Virtual machine','A program that behaves like a computer and runs its own instruction language.'],['Bytecode','A compact, machine-independent intermediate code executed by a virtual machine.'],['JIT compiler','Just-In-Time compiler; translates hot bytecode to machine code during execution.']]
},
{ id:2, week:1, unit:'Introduction to compilers', ic:'🏗️', lo:[1], book:'Louden Ch. 1.3–1.5 · Dragon book Ch. 1.2',
  title:'Organization, Context and Phases of a Compiler',
  sub:'Pre-processor, assembler, linker (link editor) and loader; the phases of a compiler; analysis vs synthesis; front end and back end.',
  intro:'A compiler is one stage in a pipeline. Today we follow <code>prog.c</code> from the editor to a running process, then open the compiler itself and look at its phases.',
  obj:['Describe the language-processing system: pre-processor, compiler, assembler, linker and loader.','List the phases of a compiler and the output of each.','Trace a statement through all phases.','Explain analysis vs synthesis and front end vs back end.','Explain the role of the symbol table and the error handler.'],
  bloom:{head:['<b>Remember</b> the order of the phases.','<b>Understand</b> what each tool in the pipeline produces.','<b>Apply</b> the phases to translate <code>position = initial + rate * 60</code> by hand.'],
    heart:['<b>Value</b> modular design: each phase does one job well.','<b>Respect</b> the teamwork between compiler, assembler and linker.'],
    hand:['<b>Use</b> <code>gcc -E</code>, <code>-S</code>, <code>-c</code> to stop after each stage and inspect the files.','<b>Draw</b> the phase diagram from memory.']},
  slides:[
    {k:'Animation', h:'The language-processing system', demo:'lps', tk:'Source → pre-processor → compiler → assembler → linker → loader → running program.', n:'Run the demo, then show gcc -E, -S, -c on a real file if a lab PC is available.'},
    {k:'Concept', h:'Pre-processor', ic:'🧹', p:'Runs <b>before</b> the compiler. It handles file inclusion, macro expansion and conditional compilation.', code:`#include &lt;stdio.h&gt;      // paste the header file here
#define PI 3.14159       // macro
#ifdef DEBUG             // conditional compilation
  printf("debug\\n");
#endif
area = PI * r * r;       // becomes 3.14159 * r * r`, tk:'The pre-processor produces pure source code for the compiler.'},
    {k:'Concept', h:'Assembler', ic:'🔤', p:'The compiler often outputs <b>assembly language</b> — readable mnemonics. The <b>assembler</b> converts it into <b>relocatable machine code</b> (an object file, <code>.o</code> / <code>.obj</code>).', code:`MOV  R1, a      ; assembly (human-readable)
ADD  R1, b
MOV  sum, R1
; assembler → 1000 0001 ... (object code with relocatable addresses)`, tk:'Assembly → object code.'},
    {k:'Concept', h:'Linker (link editor) and loader', ic:'🔗', pts:[['🔗','<b>Linker / link editor:</b> combines several object files and library files into one executable; resolves <b>external references</b> (e.g. the address of <code>printf</code>).'],['🚚','<b>Loader:</b> reads the executable into memory, adjusts relocatable addresses to real addresses and starts execution.'],['📚','Static linking copies library code in; dynamic linking (.dll / .so) connects at load or run time.']], tk:'Linker joins the pieces; loader puts them in memory and runs them.'},
    {k:'Concept', h:'Two parts: analysis and synthesis', demo:'analysisSynthesis', tk:'Analysis understands the program; synthesis builds the target.'},
    {k:'Concept', h:'The phases of a compiler', ic:'🧱', pts:[['1','<b>Lexical analysis</b> (scanning): characters → tokens'],['2','<b>Syntax analysis</b> (parsing): tokens → parse/syntax tree'],['3','<b>Semantic analysis</b>: type checking, declarations'],['4','<b>Intermediate code generation</b>: tree → IR (three-address code)'],['5','<b>Code optimization</b> (machine-independent): improve the IR'],['6','<b>Code generation</b>: IR → target code'],['📒','<b>Symbol table</b> and <b>error handler</b> are used by all phases']], tk:'Six phases + symbol table + error handler.'},
    {k:'Animation', h:'One statement through every phase', demo:'pipeline', tk:'Each phase transforms the representation a little.', n:'Write each intermediate output on the board as the animation steps.'},
    {k:'Concept', h:'The symbol table', demo:'symflow', tk:'One record per name, shared by all phases.'},
    {k:'Concept', h:'Front end and back end', demo:'frontback', psy:'GCC and LLVM both have many front ends (C, C++, Fortran, Rust, Swift…) and many back ends (x86-64, ARM, RISC-V, WebAssembly) around one IR.', tk:'Front end depends on the source language; back end on the target machine.'},
    {k:'Concept', h:'Passes and grouping of phases', ic:'🔁', p:'A <b>pass</b> reads an input file (or representation) once and writes an output. Several phases can be grouped into one pass.', pts:[['1️⃣','Front-end pass: lexing, parsing, semantic analysis and IR generation together.'],['2️⃣','Optional optimisation pass(es) over the IR.'],['3️⃣','Back-end pass: code generation for the target.']], tk:'Phases are logical; passes are how they are physically organised.'},
    {k:'Concept', h:'Compiler-construction tools', ic:'🧰', pts:[['🔤','<b>Scanner generators</b>: Lex, Flex (from regular expressions)'],['🌳','<b>Parser generators</b>: Yacc, Bison, ANTLR (from grammars)'],['🏷️','<b>Syntax-directed translation engines</b>'],['🖥️','<b>Code-generator generators</b> (from instruction descriptions)'],['📈','<b>Data-flow analysis engines</b> for optimisation'],['🧱','<b>Compiler-construction toolkits</b>: LLVM, GCC infrastructure']], tk:'Much of a compiler can be generated from specifications.'},
    {k:'Example', h:'Seeing the stages with gcc', code:`gcc -E prog.c -o prog.i   # stop after pre-processing
gcc -S prog.i -o prog.s   # compile to assembly
gcc -c prog.s -o prog.o   # assemble to object code
gcc prog.o -o prog        # link (loader runs it when you type ./prog)`, tk:'Each flag stops the pipeline at a different tool.'}
  ],
  lab:{t:'Lab: stop gcc at every stage', steps:['Write <code>prog.c</code> with one #define, one #include and a call to printf.','Run the four commands on the last slide.','Open <code>prog.i</code>: find your macro expanded and the pasted header.','Open <code>prog.s</code>: find the assembly for your arithmetic.','Run <code>nm prog.o</code> (or objdump) and notice <code>printf</code> is an undefined (external) symbol until linking.'], out:'Screenshots of prog.i, prog.s and the symbol list with a one-line note on each.'},
  disc:['Why is the symbol table shared by all phases instead of each phase keeping its own?','What would break if the linker did not exist?','Why do front end and back end meet at an intermediate representation and not at assembly?'],
  mistakes:['Thinking the linker translates source code.','Mixing up the order: assembler comes <b>after</b> the compiler.','Believing optimization changes the program\'s meaning — it must not.','Saying the parser produces tokens — the lexer does.'],
  rev:['Pre-processor → compiler → assembler → linker → loader.','Phases: lexical, syntax, semantic, intermediate code, optimization, code generation.','Symbol table and error handler are used by every phase.','Analysis = front end (source-dependent); synthesis = back end (target-dependent).','A pass reads its input once; several phases can share a pass.'],
  hw:'Hand-translate <code>a = b + c * 2</code> through all six phases, writing the output of each, like the animation.',
  quiz:[
    {q:'Which tool expands <code>#define</code> macros?', o:['Assembler','Pre-processor','Linker','Loader'], a:1, e:'Macro expansion happens before compilation.'},
    {q:'Which phase groups characters into tokens?', o:['Syntax analysis','Lexical analysis','Code generation','Semantic analysis'], a:1, e:'The scanner forms tokens.'},
    {q:'Inserting <code>inttofloat(60)</code> happens in…', o:['Lexical analysis','Semantic analysis','Linking','Loading'], a:1, e:'Type checking and coercion are semantic.'},
    {q:'Which part depends mainly on the target machine?', o:['Front end','Back end','Lexer','Parser'], a:1, e:'Back end = optimisation + code generation for the machine.'},
    {q:'External references such as <code>printf</code> are resolved by the…', o:['Linker','Scanner','Parser','Pre-processor'], a:0, e:'The link editor connects object files and libraries.'}],
  terms:[['Pre-processor','Tool that expands macros, includes files and handles conditional compilation before compiling.'],['Assembler','Translates assembly language into relocatable machine code.'],['Linker','Combines object files and libraries into an executable; resolves external references.'],['Loader','Places an executable in memory, fixes addresses and starts it.'],['Phase','A logical step of a compiler that transforms one representation into another.'],['Pass','One reading of the program (or its representation) by the compiler.'],['Front end','Analysis part: lexical, syntax, semantic analysis and IR generation.'],['Back end','Synthesis part: optimisation and code generation for a target.'],['Symbol table','Data structure storing information about identifiers.'],['Intermediate representation','A machine-independent form of the program between front and back end.']]
},
/* ================= WEEK 2 ================= */
{ id:3, week:2, unit:'Lexical analysis', ic:'🔤', lo:[2], book:'Louden Ch. 2.1 · Dragon Ch. 3.1–3.2',
  title:'The Role of the Lexical Analyzer',
  sub:'Tokens, patterns and lexemes; attributes of tokens; recognition of tokens; input buffering with sentinels.',
  intro:'Before a parser can understand <code>if (x &gt;= 10)</code>, someone must notice that <code>&gt;=</code> is one operator and <code>10</code> is one number. That someone is the <b>lexical analyzer</b> (scanner).',
  obj:['Explain the role of the lexical analyzer and its interaction with the parser.','Distinguish token, pattern and lexeme with examples.','Write the token stream (with attributes) for a statement.','Explain why lexing is separated from parsing.','Explain the two-buffer input scheme and sentinels.'],
  bloom:{head:['<b>Define</b> token, pattern, lexeme and attribute.','<b>Apply</b> them to produce a token stream for given code.','<b>Explain</b> how sentinels reduce work per character.'],
    heart:['<b>Value</b> separation of concerns between lexer and parser.','<b>Be careful</b> and precise when writing token streams.'],
    hand:['<b>Tokenize</b> code by hand and with the Lab-tools tokenizer.','<b>Trace</b> lexemeBegin and forward over a buffer.']},
  slides:[
    {k:'Concept', h:'What does the lexer do?', demo:'lexrole', tk:'The lexer turns characters into tokens on demand.'},
    {k:'Concept', h:'Other jobs of the lexer', ic:'🧽', pts:[['␣','Strips whitespace (blanks, tabs, newlines) and comments.'],['🔢','Keeps track of line numbers to report errors at the right place.'],['📒','Enters identifiers into the symbol table.'],['🔁','May expand macros (in some languages).']], tk:'The parser never sees blanks or comments.'},
    {k:'Concept', h:'Why separate lexing from parsing?', ic:'✂️', pts:[['🧩','<b>Simpler design:</b> the grammar does not have to describe blanks and comments.'],['⚡','<b>Efficiency:</b> specialised buffering and fast DFA techniques can be used.'],['🌍','<b>Portability:</b> input-device and character-set details stay in the lexer.']], tk:'Separation = simpler + faster + more portable.'},
    {k:'Animation', h:'Token, pattern, lexeme', demo:'tpl', tk:'Token = category, pattern = rule, lexeme = actual text.'},
    {k:'Concept', h:'Attributes of tokens', ic:'🏷️', p:'When several lexemes match the same token, the lexer passes an <b>attribute</b> telling which one. For <code>id</code> the attribute is a pointer to its symbol-table entry; for <code>number</code> it is the value.', code:`E = M * C ** 2
⟨id, →E⟩ ⟨assign_op⟩ ⟨id, →M⟩ ⟨mult_op⟩ ⟨id, →C⟩ ⟨exp_op⟩ ⟨number, 2⟩`, tk:'Tokens are pairs: ⟨token-name, attribute-value⟩.'},
    {k:'Animation', h:'Scanning a statement', demo:'tokenize', tk:'Eight tokens; three symbol-table entries.'},
    {k:'Example', h:'Count the tokens', code:`printf("Total = %d\\n", total);`, p:'Tokens: <code>printf</code>, <code>(</code>, <code>"Total = %d\\n"</code>, <code>,</code>, <code>total</code>, <code>)</code>, <code>;</code> — <b>7 tokens</b>. The whole string literal is <b>one</b> token.', tk:'Strings and comments are single units (comments are discarded).', n:'Ask students to count before revealing. Many say 10+ because they split the string.'},
    {k:'Concept', h:'Recognition of tokens', ic:'🔎', p:'Patterns are written as regular expressions; the lexer turns them into <b>transition diagrams</b> (finite automata) and runs them over the input. When several patterns match, two rules decide:', pts:[['📏','<b>Longest match:</b> prefer the longest lexeme (<code>&lt;=</code> not <code>&lt;</code>; <code>iffy</code> not <code>if</code>).'],['🥇','<b>Priority:</b> if two patterns match the same length, the one listed first wins (keywords before identifiers).']], tk:'Longest match first, then rule priority.'},
    {k:'Concept', h:'Why input buffering?', ic:'📦', p:'The lexer often needs to <b>look ahead</b>: after <code>&lt;</code> it must see the next char to decide between <code>&lt;</code>, <code>&lt;=</code> and <code>&lt;&gt;</code>. Reading from disk one char at a time is slow. Solution: read large blocks into a buffer with two pointers.', tk:'Buffering = speed + lookahead.'},
    {k:'Animation', h:'Two buffers with sentinels', demo:'buffer', tk:'The sentinel eof turns two tests per character into one.'},
    {k:'Concept', h:'Sentinel code', code:`switch (*forward++) {
  case eof:
    if (forward is at end of first buffer) { reload second buffer; forward = beginning of second buffer; }
    else if (forward is at end of second buffer) { reload first buffer; forward = beginning of first buffer; }
    else /* eof inside a buffer = real end of input */ terminate lexical analysis;
    break;
  cases for the other characters ...
}`, tk:'Only when we see eof do we check which case it is.'}
  ],
  lab:{t:'Lab: hand-tokenize and verify', steps:['Tokenize by hand: <code>while (count &lt;= 100) { sum += count; count++; }</code>. Write ⟨token, attribute⟩ pairs.','Count how many entries go into the symbol table.','Open <b>Lab tools → Tokenizer</b>, paste the code and compare with your answer.','Add a comment and a string — check that they are handled as single units.'], out:'Hand-written token list + screenshot of the tool output, differences explained.'},
  disc:['Should the lexer or the parser decide that <code>fi</code> is a misspelled <code>if</code>?','In Python, indentation matters. Who should handle it — lexer or parser?','Why do we need the longest-match rule? Give a counter-example without it.'],
  mistakes:['Counting a string literal as several tokens.','Confusing token (category) with lexeme (actual text).','Forgetting that comments and blanks produce <b>no</b> tokens.','Thinking every token needs an attribute — keywords and punctuation usually do not.'],
  rev:['The lexer reads characters, groups them into lexemes and returns tokens to the parser.','Token = name + optional attribute (e.g. symbol-table pointer, value).','Pattern describes the lexemes of a token.','Longest match and rule priority resolve ambiguity.','Two-buffer scheme with sentinels gives fast lookahead.'],
  hw:'Read Dragon book §3.1–3.2. Tokenize three lines of your own C code and list the symbol-table entries.',
  quiz:[
    {q:'In <code>count = count + 1;</code>, the lexeme <code>count</code> has token…', o:['number','id','keyword','literal'], a:1, e:'Identifiers share the token id.'},
    {q:'How many tokens in <code>x = y * 25;</code>?', o:['4','5','6','8'], a:2, e:'x, =, y, *, 25, ; → 6.'},
    {q:'A <b>pattern</b> is…', o:['The actual characters read','A description of the set of lexemes for a token','A parse tree','A symbol-table entry'], a:1, e:'Usually a regular expression.'},
    {q:'The sentinel <b>eof</b> at the end of each buffer half lets the lexer…', o:['Skip comments','Test for buffer end and character in one check','Detect syntax errors','Hash identifiers'], a:1, e:'One test per character in the common case.'},
    {q:'Input <code>&lt;=</code>: by the longest-match rule the lexer returns…', o:['&lt; then =','&lt;=','an error','=&lt;'], a:1, e:'Prefer the longest valid lexeme.'}],
  terms:[['Lexical analyzer','The phase that reads characters and produces tokens; also called scanner.'],['Token','A pair of a token name (category) and optional attribute value.'],['Lexeme','The sequence of characters in the source that matches a token’s pattern.'],['Pattern','A description (usually a regular expression) of the lexemes of a token.'],['Attribute','Extra information carried by a token, e.g. a symbol-table pointer.'],['Longest match','Rule that the scanner prefers the longest lexeme that matches a pattern.'],['Input buffering','Reading the source in blocks into buffers to allow fast lookahead.'],['Sentinel','A special character (eof) marking the end of a buffer to reduce tests.'],['lexemeBegin','Pointer to the start of the current lexeme.'],['forward','Pointer that scans ahead to find the end of the lexeme.']]
},
{ id:4, week:2, unit:'Lexical analysis', ic:'📐', lo:[2], book:'Louden Ch. 2.2 · Dragon Ch. 3.3',
  title:'Specification of Tokens: Regular Expressions',
  sub:'Strings and languages, regular expressions, regular definitions for identifiers, numbers and others; recognising complex words; lexical errors.',
  assess:'Assignment-1',
  intro:'How do you describe "all valid C identifiers" or "every floating-point number" precisely? With <b>regular expressions</b> — the formal language of patterns.',
  obj:['Define alphabet, string, language and operations on languages.','Write regular expressions using union, concatenation and closure.','Write regular definitions for identifiers, numbers, strings and whitespace.','Use extensions such as +, ?, and character classes.','Describe lexical errors and recovery actions.'],
  bloom:{head:['<b>Define</b> alphabet, string and language.','<b>Construct</b> regular expressions for token classes.','<b>Evaluate</b> whether a given string matches a regular expression.'],
    heart:['<b>Appreciate</b> the precision of formal notation over informal English.','<b>Persist</b> when a pattern does not match on the first try.'],
    hand:['<b>Write</b> regular definitions for a mini-language.','<b>Test</b> regexes on sample input with an online tester or grep.']},
  slides:[
    {k:'Concept', h:'Strings and languages', ic:'🔡', pts:[['Σ','<b>Alphabet:</b> a finite set of symbols, e.g. {0, 1}, ASCII, Unicode.'],['🔗','<b>String:</b> a finite sequence of symbols. |s| = length. ε = empty string.'],['📚','<b>Language:</b> any set of strings over an alphabet, e.g. all valid C identifiers.'],['✂️','Prefix, suffix, substring; <b>concatenation</b> xy; exponent s⁰ = ε, s¹ = s, s² = ss.']], tk:'A language is just a set of strings.'},
    {k:'Concept', h:'Operations on languages', cmp:[['Operation',['Union L ∪ M','Concatenation LM','Kleene closure L*','Positive closure L⁺']],['Meaning',['strings in L or M','a string from L followed by one from M','zero or more concatenations of L','one or more concatenations of L']]], ex:'L = {A…Z, a…z}, D = {0…9}: L(L ∪ D)* = all strings that start with a letter followed by letters/digits = identifiers!', tk:'Identifiers = letter (letter | digit)*.'},
    {k:'Animation', h:'Regular expressions', demo:'reops', tk:'Union, concatenation, closure — plus parentheses.'},
    {k:'Concept', h:'Rules and precedence', ic:'📏', pts:[['1','ε is a RE denoting {ε}.'],['2','Each symbol a in Σ is a RE denoting {a}.'],['3','If r and s are REs: (r)|(s), (r)(s), (r)* and (r) are REs.'],['⬆','Precedence: <b>*</b> highest, then <b>concatenation</b>, then <b>|</b> lowest. All left-associative.']], ex:'(a)|((b)*(c)) can be written a|b*c.', tk:'Two REs are equivalent if they denote the same language: (a|b) = (b|a).'},
    {k:'Concept', h:'Regular definitions', ic:'🏷️', p:'Give names to regular expressions and use them in later definitions.', code:`letter_  →  A | B | … | Z | a | b | … | z | _
digit    →  0 | 1 | … | 9
id       →  letter_ ( letter_ | digit )*`, tk:'Names make big patterns readable.'},
    {k:'Animation', h:'Regular definitions for numbers', demo:'regex', tk:'number → digits (. digits)? (E [+-]? digits)?'},
    {k:'Concept', h:'Notational shorthands', pts:[['➕','<b>r⁺</b> one or more: r⁺ = r r*'],['❓','<b>r?</b> zero or one: r? = r | ε'],['[ ]','<b>Character classes:</b> [abc] = a|b|c; [a-z] = a|b|…|z'],['🎯','Compact: <code>digit → [0-9]</code>, <code>number → digit⁺ (. digit⁺)? (E [+-]? digit⁺)?</code>']], tk:'Shorthands do not add power, only convenience.'},
    {k:'Example', h:'Recognizing more complex words', code:`ws      → ( blank | tab | newline )⁺
string  → " ( [^"\\\\\\n] | \\\\. )* "          // no raw newline inside
comment → /\\* ( [^*] | \\*+[^*/] )* \\*+/      // C block comment
relop   → &lt; | &gt; | &lt;= | &gt;= | == | !=`, ex:'Strings must allow escaped quotes \\" ; comments must stop at the first */.', tk:'Complex words still reduce to regular expressions.'},
    {k:'Concept', h:'Tokens of a small language', code:`Lexemes        Token      Attribute
any ws         —          —            (no token returned)
if             if         —
then / else    then/else  —
any id         id         pointer to table entry
any number     number     pointer/value
&lt;              relop      LT
&lt;=             relop      LE
=  (equals)    relop      EQ
&lt;&gt;             relop      NE`, tk:'This table is the specification the scanner must implement.'},
    {k:'Animation', h:'Lexical errors', demo:'lexerr', tk:'The lexer reports what it can and leaves the rest to later phases.'},
    {k:'Concept', h:'What regular expressions cannot do', ic:'🚫', p:'Regular expressions cannot count without limit. They cannot describe <b>balanced parentheses</b> (ⁿ)ⁿ or nested comments of any depth. Such structures need <b>context-free grammars</b> (Week 5).', tk:'Regular = finite memory. Nesting needs a stack.'}
  ],
  lab:{t:'Lab: write and test regular definitions', steps:['Write regular definitions for: C identifiers, integer constants, floating constants with optional exponent, string literals, and // comments.','Test each with grep -E, an online regex tester, or a few lines of Python <code>re.fullmatch</code>.','List 3 strings that should match and 3 that should not for each definition.','Check the number definition with: 12, 3.14, 6.02E23, 1E-9, .5, 5., 1e.'], out:'A table of definitions with test cases and pass/fail results.'},
  disc:['Is <code>.5</code> a valid number in your definition? Should it be?','Why are nested comments hard for a regular-expression scanner?','Which is clearer: a long regular expression, or regular definitions? Why?'],
  mistakes:['Writing digit* for "one or more digits" — that also matches the empty string.','Forgetting that * binds tighter than concatenation: ab* is a(b*), not (ab)*.','Using | inside a character class: [a|b] also matches |.','Allowing a raw newline inside a string literal.'],
  rev:['A language is a set of strings over an alphabet.','REs use union |, concatenation and closure *.','Precedence: * > concatenation > |.','Regular definitions name sub-patterns: id → letter (letter|digit)*.','Shorthands: r⁺, r?, [a-z]. REs cannot express unbounded nesting.'],
  hw:'Start Assignment 1. Read Dragon book §3.3.',
  quiz:[
    {q:'Which RE denotes "one or more digits"?', o:['digit*','digit digit*','digit?','(digit)|ε'], a:1, e:'digit digit* = digit⁺.'},
    {q:'ab* matches…', o:['abab','abbb','ba','ε'], a:1, e:'a followed by zero or more b.'},
    {q:'(a|b)*abb matches…', o:['abba','babb','abab','bbb'], a:1, e:'It must end in abb.'},
    {q:'Which can regular expressions <b>not</b> describe?', o:['Identifiers','Floating-point numbers','Balanced parentheses of any depth','Keywords'], a:2, e:'Needs unlimited counting (a stack).'},
    {q:'Precedence from highest to lowest is…', o:['| , concatenation, *','*, concatenation, |','concatenation, *, |','all equal'], a:1, e:'Closure binds tightest.'}],
  assessment:{ kind:'assignment', title:'Assignment 1 — Lexical Specification of a Mini Language', covers:'Weeks 1–2: phases, tokens, patterns, lexemes, regular expressions, lexical errors',
    instructions:['Work individually. Hand-written or typed; code may be in C, C++, Java or Python.','Show all working; a final answer without steps gets little credit.','Submission date and marks are announced by the instructor.'],
    scenario:'You are designing the scanner for <b>MiniC</b>, a small C-like language with keywords <code>int float if else while return</code>, identifiers, integer and float constants, the operators <code>+ - * / = == != &lt; &lt;= &gt; &gt;= &amp;&amp; ||</code>, punctuation <code>( ) { } ; ,</code>, string literals and // comments.',
    tasks:['Explain in your own words the six phases of a compiler using the statement <code>avg = (a + b) / 2</code>; show the output of each phase.','Write a table of every MiniC token: token name, informal pattern, sample lexemes, attribute.','Write regular definitions for identifiers, int constants, float constants (with optional exponent), strings and comments.','Tokenize the program below and list the symbol table:<br><code>int main() { float avg = 0; while (n &gt;= 1) { avg = avg + n / 2.5; n = n - 1; } return 0; }</code>','Give three examples of lexical errors in MiniC and the recovery action for each.','<b>Programming:</b> write a small program that reads a MiniC file and prints each token with its line number (you may use regular-expression libraries).'],
    submission:['A PDF with tasks 1–5 and the source code for task 6.','Screenshot of your program running on the sample program.','Name and roll number on the first page.'],
    reflection:['Which token class was hardest to specify? Why?','How did you handle keywords vs identifiers?'],
    example:'<b>Sample row for Task 2:</b> token <code>relop</code> · pattern: &lt; | &lt;= | &gt; | &gt;= | == | != · lexemes: &lt;=, != · attribute: LT/LE/GT/GE/EQ/NE.<br><b>Sample regular definition:</b> <code>float → digit⁺ . digit⁺ ( (E|e) (+|-)? digit⁺ )?</code>',
    note:'Copied work receives zero. Discuss ideas, not code.' },
  terms:[['Alphabet','A finite set of symbols, written Σ.'],['String','A finite sequence of symbols from an alphabet.'],['Empty string (ε)','The string of length zero.'],['Language','A set of strings over an alphabet.'],['Regular expression','Notation using union, concatenation and closure to describe a regular language.'],['Kleene closure','r*: zero or more concatenations of r.'],['Positive closure','r⁺: one or more concatenations of r.'],['Regular definition','A sequence of named regular expressions, each using earlier names.'],['Character class','Shorthand [a-z] for a union of characters.'],['Lexical error','An input sequence that cannot form any token.']]
},
/* ================= WEEK 3 ================= */
{ id:5, week:3, unit:'Finite automata', ic:'🤖', lo:[2], book:'Louden Ch. 2.3–2.4 · Dragon Ch. 3.6–3.7',
  title:'Finite Automata and From Regular Expressions to Automata',
  sub:'NFA and DFA, simulating a DFA, Thompson’s construction (RE → NFA), subset construction (NFA → DFA), minimisation idea.',
  intro:'A regular expression <i>describes</i> tokens; a <b>finite automaton</b> <i>recognises</i> them. Today we turn one into the other — exactly what Lex does internally.',
  obj:['Define NFA and DFA and draw their transition graphs and tables.','Simulate a DFA on an input string.','Convert a regular expression to an NFA with Thompson’s construction.','Convert an NFA to a DFA with the subset construction (ε-closure and move).','Explain why DFAs are used in real scanners.'],
  bloom:{head:['<b>Distinguish</b> NFA from DFA.','<b>Apply</b> Thompson’s construction and the subset construction.','<b>Evaluate</b> the cost of NFA vs DFA simulation.'],
    heart:['<b>Enjoy</b> seeing theory turn into a working algorithm.','<b>Value</b> systematic, step-by-step work to avoid errors.'],
    hand:['<b>Draw</b> transition graphs neatly.','<b>Fill</b> a subset-construction table by hand and check it.']},
  slides:[
    {k:'Concept', h:'What is a finite automaton?', ic:'🤖', p:'A recogniser that says "yes" or "no" for each input string. It has a finite set of <b>states</b>, a <b>start</b> state, <b>accepting</b> states and <b>transitions</b> on input symbols.', pts:[['S','finite set of states'],['Σ','input alphabet'],['δ','transition function'],['s₀','start state'],['F','set of accepting (final) states']], tk:'FA = (S, Σ, δ, s₀, F).'},
    {k:'Animation', h:'NFA vs DFA', demo:'nfa', tk:'NFA: choices and ε-moves allowed. DFA: exactly one move per symbol.'},
    {k:'Comparison', h:'NFA or DFA?', cmp:[['NFA',['Several transitions on one symbol','ε-transitions allowed','Fewer states, easy to build from an RE','Simulation: O(|r| × |x|)']],['DFA',['Exactly one transition per symbol','No ε-transitions','May have more states (worst case 2ⁿ)','Simulation: O(|x|) — very fast']]], tk:'Build an NFA, convert it to a DFA, run the DFA.'},
    {k:'Animation', h:'Simulating a DFA', demo:'dfarun', tk:'s = s₀; for each char c: s = move(s, c); accept if s ∈ F.'},
    {k:'Concept', h:'Transition table', code:`DFA for (a|b)*abb
state   a   b
  0     1   0
  1     1   2
  2     1   3
 *3     1   0        (* = accepting)`, tk:'A table is exactly what a table-driven scanner stores.'},
    {k:'Concept', h:'Thompson’s construction: the rules', ic:'🧱', pts:[['ε','For ε: start —ε→ final.'],['a','For a symbol a: start —a→ final.'],['|','For s|t: new start with ε to N(s) and N(t); ε from both finals to a new final.'],['··','For st: the final of N(s) becomes the start of N(t).'],['*','For s*: new start and final; ε-edges to enter, repeat and skip.']], tk:'Every NFA built this way has one start, one accepting state and at most 2 edges per state.'},
    {k:'Animation', h:'RE → NFA for (a|b)*abb', demo:'thompson', tk:'11 states, numbered 0–10.'},
    {k:'Concept', h:'ε-closure and move', ic:'🧮', pts:[['ε','<b>ε-closure(s)</b>: all NFA states reachable from s using only ε-edges (including s).'],['ε','<b>ε-closure(T)</b>: union over states in T.'],['➜','<b>move(T, a)</b>: states reachable from some state in T on one a-transition.'],['🔁','New DFA state = ε-closure(move(T, a)).']], ex:'ε-closure({0}) = {0, 1, 2, 4, 7}.', tk:'These two functions drive the subset construction.'},
    {k:'Animation', h:'Subset construction: NFA → DFA', demo:'subset', tk:'Each DFA state is a set of NFA states.'},
    {k:'Concept', h:'Subset-construction algorithm', code:`Dstates = { ε-closure(s0) } (unmarked)
while there is an unmarked state T in Dstates:
    mark T
    for each input symbol a:
        U = ε-closure( move(T, a) )
        if U not in Dstates: add U as unmarked
        Dtran[T, a] = U
A DFA state is accepting if it contains an NFA accepting state.`, tk:'Worklist algorithm; terminates because there are finitely many subsets.'},
    {k:'Concept', h:'Minimising a DFA (idea)', ic:'🗜️', p:'Two states are <b>equivalent</b> if no input string distinguishes them. Start with two groups {accepting} and {non-accepting} and split groups until stable. For (a|b)*abb, A and C merge → 4 states.', psy:'Lex/Flex always minimise the DFA to keep the transition table small.', tk:'The minimum DFA for a language is unique (up to state names).'}
  ],
  lab:{t:'Lab: RE → NFA → DFA by hand', steps:['Use Thompson’s construction for <code>(a|b)*abb</code> and number the states 0–10.','Compute ε-closure({0}) and fill the subset-construction table.','Draw the resulting DFA and mark accepting states.','Simulate the DFA on <code>abb</code>, <code>aabb</code>, <code>abab</code>. Which are accepted?','Repeat for <code>a(b|c)*</code>.'], out:'Two NFAs, two DFA tables, simulation results.'},
  disc:['Why do real scanners use DFAs and not NFAs at run time?','The subset construction can create 2ⁿ states. Why is that rare in practice?','Can every NFA be converted to a DFA? Can every DFA be seen as an NFA?'],
  mistakes:['Forgetting to include the state itself in its ε-closure.','Computing move() without taking the ε-closure afterwards.','Marking a DFA state accepting only if <b>all</b> its NFA states are accepting — <b>one</b> is enough.','Leaving out a transition in a DFA (a missing move means a dead/error state).'],
  rev:['A DFA has one transition per symbol per state; an NFA may have choices and ε-moves.','Thompson’s construction: RE → NFA, rule by rule.','Subset construction: NFA → DFA using ε-closure and move.','A DFA state is accepting if it contains an NFA accepting state.','DFAs run in linear time and are minimised for compact tables.'],
  hw:'Convert <code>(a|b)*a(a|b)</code> to an NFA and then to a DFA. Prepare for Quiz 1.',
  quiz:[
    {q:'An NFA differs from a DFA because it may have…', o:['Accepting states','ε-transitions and multiple moves on one symbol','A start state','An alphabet'], a:1, e:'Non-determinism = choices.'},
    {q:'ε-closure(s) always contains…', o:['Only accepting states','s itself','The start state','No states'], a:1, e:'Zero ε-moves reach s itself.'},
    {q:'A DFA state built by subset construction is accepting if it contains…', o:['All NFA states','At least one NFA accepting state','The NFA start state','No ε-edges'], a:1, e:'Any accepting NFA state suffices.'},
    {q:'Simulating a DFA on input x takes time proportional to…', o:['|x|','2^|x|','|x|²','constant'], a:0, e:'One move per character.'},
    {q:'Thompson’s construction converts…', o:['DFA → RE','RE → NFA','NFA → grammar','DFA → NFA'], a:1, e:'Regular expression to NFA.'}],
  terms:[['Finite automaton','A recogniser with finitely many states and transitions on input symbols.'],['DFA','Deterministic finite automaton: exactly one transition per state and symbol, no ε-moves.'],['NFA','Non-deterministic finite automaton: may have several transitions on a symbol and ε-moves.'],['Transition table','A table giving the next state for each state and input symbol.'],['ε-closure','The set of states reachable using only ε-transitions.'],['move(T,a)','The set of states reachable from T on one a-transition.'],['Thompson’s construction','Algorithm that builds an NFA from a regular expression.'],['Subset construction','Algorithm that converts an NFA into an equivalent DFA.'],['DFA minimisation','Merging equivalent states to get the smallest DFA.']]
},
{ id:6, week:3, unit:'Finite automata', ic:'🗺️', lo:[2], book:'Dragon Ch. 3.4–3.5, 3.8 · Louden Ch. 2.5–2.6',
  title:'Transition Diagrams, Lexer Generators, Reserved Words and Identifiers',
  sub:'Transition diagrams for relational operators, identifiers, numbers and whitespace; retracting; reserved words vs identifiers; design of a lexical-analyzer generator (Lex).',
  assess:'Quiz-1',
  intro:'A transition diagram is a flowchart for one token. Join the diagrams, add "retract" and "return", and you have a scanner. Join them automatically, and you have <b>Lex</b>.',
  obj:['Draw transition diagrams for relop, identifiers, numbers and whitespace.','Explain retracting (the * on a state) and returning tokens.','Explain two methods for handling reserved words.','Describe the structure of a Lex program and how Lex builds a scanner.','Resolve conflicts with longest match and rule order.'],
  bloom:{head:['<b>Construct</b> transition diagrams for token classes.','<b>Explain</b> how Lex resolves conflicting patterns.','<b>Compare</b> two ways to recognise keywords.'],
    heart:['<b>Value</b> tools that automate repetitive work.','<b>Be curious</b> about how tools like Lex work inside.'],
    hand:['<b>Write</b> a small Flex specification and run it.','<b>Trace</b> input through a transition diagram.']},
  slides:[
    {k:'Concept', h:'Transition diagrams', ic:'🗺️', p:'A <b>transition diagram</b> is a directed graph of states. Edges are labelled with characters. One state is the start; accepting states (double circles) return a token. A <b>*</b> on an accepting state means <b>retract</b>: we read one character too many.', tk:'Transition diagram = a DFA drawn for one token class, with actions.'},
    {k:'Animation', h:'Diagram for relational operators', demo:'relop', tk:'States 4 and 8 retract because the extra char belongs to the next token.'},
    {k:'Animation', h:'Diagram for identifiers', demo:'idtd', tk:'letter (letter | digit)* followed by any other char.'},
    {k:'Animation', h:'Reserved words or identifiers?', demo:'kwid', tk:'Pre-install keywords in the symbol table — or give them their own diagrams with higher priority.'},
    {k:'Concept', h:'Diagram for unsigned numbers', code:`state 12 --digit--> 13
13 --digit--> 13 | --.--> 14 | --E--> 16 | --other--> 20*  (integer)
14 --digit--> 15
15 --digit--> 15 | --E--> 16 | --other--> 21*  (float without exponent)
16 --+ or - --> 17 | --digit--> 18
17 --digit--> 18
18 --digit--> 18 | --other--> 19*  (float with exponent)`, tk:'Three accepting states: integer, fraction, exponent.'},
    {k:'Concept', h:'Whitespace', code:`delim → blank | tab | newline
ws    → delim⁺          // recognised but NO token is returned;
                        // the scanner restarts from the beginning`, tk:'Whitespace has a diagram but no token.'},
    {k:'Concept', h:'Combining diagrams into one scanner', ic:'🔗', pts:[['1','Try the diagrams one after another; on failure reset forward and try the next (slow).'],['2','Run them “in parallel” and take the longest prefix matched.'],['3','<b>Best:</b> merge all into one diagram (one DFA) — what Lex does.']], tk:'One combined DFA is fastest.'},
    {k:'Animation', h:'Lex: a lexical-analyzer generator', demo:'lexgen', tk:'Write patterns; Lex writes the scanner.'},
    {k:'Concept', h:'Structure of a Lex program', code:`%{
  #include "tokens.h"        /* declarations copied to lex.yy.c */
%}
delim   [ \\t\\n]
ws      {delim}+
letter  [A-Za-z]
digit   [0-9]
id      {letter}({letter}|{digit})*
number  {digit}+(\\.{digit}+)?(E[+-]?{digit}+)?
%%
{ws}      { /* no action, no return */ }
if        { return IF; }
{id}      { yylval = installID(); return ID; }
{number}  { yylval = installNum(); return NUMBER; }
"&lt;="      { yylval = LE; return RELOP; }
%%
int installID() { /* yytext, yyleng hold the lexeme */ }`, tk:'Declarations %% rules %% user code.'},
    {k:'Concept', h:'Conflict resolution in Lex', ic:'⚖️', pts:[['📏','<b>Longest match:</b> <code>&lt;=</code> is one token, not &lt; then =.'],['🥇','<b>First rule wins</b> on equal length: <code>if</code> matches both the if rule and {id}; because the if rule is listed first, IF is returned.'],['👀','<b>Lookahead operator /</b>: <code>IF / \\(.*\\)</code> matches IF only if followed by a parenthesised condition (Fortran).']], tk:'Order your Lex rules: keywords before identifiers.'},
    {k:'Concept', h:'How Lex builds the DFA', ic:'🏭', p:'For each pattern pᵢ Lex builds an NFA Nᵢ (Thompson), joins them with a new start state using ε-edges, converts the combined NFA to a DFA (subset construction) and minimises it. Each accepting DFA state remembers the <b>first-listed</b> pattern among its NFA accepting states.', psy:'Flex can produce tables of tens of thousands of entries and compresses them for speed and size.', tk:'Lex = Thompson + subset construction + minimisation + a driver.'}
  ],
  lab:{t:'Lab: your first Flex scanner', steps:['Install flex (or use an online Flex playground).','Write a spec for keywords if/else/while, identifiers, integers, relops, and whitespace.','Generate: <code>flex scan.l &amp;&amp; gcc lex.yy.c -lfl -o scan</code>.','Run it on a small file and print each token with yytext.','Swap the order of the <code>if</code> rule and the <code>{id}</code> rule. What changes? Explain.'], out:'The .l file, sample output, and a two-line explanation of the rule-order experiment.'},
  disc:['Why is retracting needed for <code>&lt;x</code> but not for <code>&lt;=</code>?','Keywords in the symbol table vs separate diagrams: which is easier to maintain?','When would you <b>not</b> use a scanner generator?'],
  mistakes:['Forgetting the * (retract) on states reached by "other".','Listing the identifier rule before keyword rules in Lex.','Writing the number diagram so that "12." is accepted without digits after the dot (if the language forbids it).','Returning a token for whitespace.'],
  rev:['Transition diagrams are DFAs with actions (return, retract).','Reserved words: pre-installed in the symbol table or own diagrams with priority.','Lex: patterns + actions → NFA → DFA → lex.yy.c.','Conflicts: longest match, then first rule.','Whitespace and comments are recognised but not returned.'],
  hw:'Revise Weeks 1–3 for Quiz 1. Draw the transition diagram for C comments /* … */.',
  quiz:[
    {q:'In a transition diagram, a * on an accepting state means…', o:['Error','Retract the forward pointer by one','Repeat zero or more times','Accept twice'], a:1, e:'The last character read belongs to the next token.'},
    {q:'Input <code>ifx</code>: a Lex scanner with rules [if] then [{id}] returns…', o:['IF then ID(x)','ID(ifx)','an error','IF only'], a:1, e:'Longest match beats rule order.'},
    {q:'Input <code>if</code>: rules [if] then [{id}] — which wins?', o:['ID','IF','both','neither'], a:1, e:'Equal length → first listed rule.'},
    {q:'Which part of a Lex program contains the patterns and actions?', o:['Declarations','Translation rules (between %%)','User subroutines','The header file'], a:1, e:'Pattern { action } lines.'},
    {q:'Lex converts the combined NFA into a DFA using…', o:['Thompson’s construction','Subset construction','LL(1) tables','Backpatching'], a:1, e:'Then it minimises the DFA.'}],
  assessment:{ kind:'quiz', title:'Quiz 1 — Weeks 1–3', covers:'Introduction, phases, lexical analysis, regular expressions, finite automata, transition diagrams, Lex',
    instructions:['Closed book unless the instructor says otherwise.','Answer all parts.','Time and marks are announced by the instructor.'],
    mcq:[
      {q:'Which translator executes statements directly without producing a target program?', o:['Compiler','Interpreter','Assembler','Linker'], a:1, e:'Interpreters execute directly.'},
      {q:'Type checking belongs to which phase?', o:['Lexical','Syntax','Semantic','Code generation'], a:2, e:'Semantic analysis.'},
      {q:'How many tokens in <code>if (a &lt;= 10) b = 2;</code>?', o:['9','10','11','12'], a:1, e:'if ( a &lt;= 10 ) b = 2 ; → 10.'},
      {q:'The RE (0|1)*1 describes binary strings that…', o:['start with 1','end with 1','contain 11','have even length'], a:1, e:'Anything, then a final 1.'},
      {q:'ε-closure({7}) for the (a|b)*abb Thompson NFA is…', o:['{7}','{7,8}','{6,7}','{}'], a:0, e:'State 7 has only an a-transition.'},
      {q:'Which is true?', o:['Every DFA is an NFA','Every NFA has fewer states than the equivalent DFA','DFAs can have ε-moves','NFAs cannot be converted to DFAs'], a:0, e:'A DFA is a special NFA.'}],
    tf:[
      {q:'The linker resolves references to library functions such as printf.', a:true, e:'External references are resolved at link time.'},
      {q:'A token always has an attribute value.', a:false, e:'Keywords and punctuation usually do not.'},
      {q:'Regular expressions can describe balanced parentheses of any depth.', a:false, e:'That needs a context-free grammar.'},
      {q:'In Lex, when two rules match the same longest lexeme, the first rule listed wins.', a:true, e:'Rule priority.'}],
    short:[
      {q:'List the six phases of a compiler in order.', a:'Lexical analysis, syntax analysis, semantic analysis, intermediate code generation, code optimization, code generation (plus symbol table and error handler).'},
      {q:'Distinguish token, pattern and lexeme with one example.', a:'Token id; pattern letter(letter|digit)*; lexeme count1.'},
      {q:'Why does the lexer use two buffers with sentinels?', a:'To read large blocks (fast), allow lookahead across block boundaries, and test for end-of-buffer and character in one comparison.'}],
    app:[
      {q:'Draw a DFA over {a, b} for strings that contain the substring ab.', a:'States 0 (start), 1 (seen a), 2 (accepting, seen ab). 0 −a→1, 0 −b→0, 1 −a→1, 1 −b→2, 2 −a,b→2.'},
      {q:'Convert a(b|c)* to an NFA with Thompson’s construction (describe the states).', a:'a: 0 −a→1. b|c: 3 −ε→4 −b→5 −ε→8, 3 −ε→6 −c→7 −ε→8. Closure: 2 −ε→3, 8 −ε→3, 2 −ε→9, 8 −ε→9. Concatenate: 1 −ε→2 (or merge 1 and 2). Accepting: 9.'}],
    note:'Model answers are guides; equivalent correct answers are accepted.' },
  terms:[['Transition diagram','Flowchart-like graph of states used to recognise a token.'],['Retract','Moving the forward pointer back one character after reading too far.'],['Reserved word','A keyword that cannot be used as an identifier.'],['installID()','Routine that looks up or inserts a lexeme in the symbol table.'],['Lex / Flex','Scanner generators that build a scanner from regular expressions and actions.'],['yytext','Lex variable holding the current lexeme.'],['yylval','Lex/Yacc variable holding the token’s attribute value.'],['Lookahead operator','In Lex, r1/r2 matches r1 only when followed by r2.']]
},
/* ================= WEEK 4 ================= */
{ id:7, week:4, unit:'Implementing scanners', ic:'🛠️', lo:[2], book:'Cooper & Torczon Ch. 2.5 · Louden Ch. 2.5',
  title:'Implementing Scanners I: Hand-Coded (Direct-Coded) Scanners',
  sub:'Turning transition diagrams into code: the getToken loop, lookahead and retract, keyword lookup, line tracking and error reporting.',
  intro:'Production compilers such as GCC, Clang and the Go compiler use <b>hand-written</b> scanners. Today we write one ourselves, directly from the transition diagrams.',
  obj:['Translate transition diagrams into switch/if/while code.','Implement nextChar, peek and retract.','Recognise identifiers, keywords, numbers and operators by hand.','Track line and column numbers and report lexical errors.','Explain the pros and cons of hand-coded scanners.'],
  bloom:{head:['<b>Apply</b> transition diagrams to write scanner code.','<b>Analyze</b> where lookahead is needed.','<b>Explain</b> why production compilers hand-code scanners.'],
    heart:['<b>Take pride</b> in clean, readable code.','<b>Respect</b> edge cases and error messages for the user.'],
    hand:['<b>Implement</b> a working scanner in C, Java or Python.','<b>Debug</b> it on tricky input (<code>a&lt;=b</code>, <code>x1y2</code>, <code>12.5e3</code>).']},
  slides:[
    {k:'Concept', h:'Three ways to implement a scanner', ic:'🧭', pts:[['✍️','<b>Hand-coded</b> (direct-coded): the DFA is encoded in program control flow.'],['📊','<b>Table-driven:</b> the DFA is a table read by a generic driver loop.'],['🏭','<b>Generated:</b> a tool (Lex/Flex/re2c) builds the table or the code from REs.']], tk:'Same DFA, three implementations.'},
    {k:'Animation', h:'A hand-coded scanner', demo:'handscan', tk:'Each state becomes a place in the code; each edge becomes an if or a loop.'},
    {k:'Concept', h:'Helper routines', code:`char nextChar()  { char c = buf[forward++]; if (c == '\\n') line++; return c; }
char peek()      { return buf[forward]; }           // look without consuming
void retract()   { forward--; }                     // give one char back
string lexeme()  { return buf.substring(lexemeBegin, forward); }`, tk:'nextChar, peek and retract are all you need for lookahead.'},
    {k:'Concept', h:'Numbers by hand', code:`if (isDigit(c)) {
    while (isDigit(peek())) nextChar();
    if (peek() == '.' &amp;&amp; isDigit(buf[forward+1])) {   // fraction
        nextChar(); while (isDigit(peek())) nextChar();
    }
    if (peek() == 'E' || peek() == 'e') { /* optional exponent */ ... }
    return Token(NUM, lexeme());
}`, tk:'Two-character lookahead avoids treating "12." in "12.x" as a number.'},
    {k:'Concept', h:'Keywords: perfect hashing or table lookup', ic:'🔑', p:'After reading an identifier lexeme, look it up in a small keyword table (a hash set or a sorted array with binary search). If found, return the keyword token; otherwise return ⟨id, entry⟩.', psy:'GCC and Clang use a pre-computed perfect hash (gperf-style) so keyword lookup is a single probe.', tk:'One lookup separates keywords from identifiers.'},
    {k:'Concept', h:'Skipping whitespace and comments', code:`void skipWhitespaceAndComments() {
  for (;;) {
    if (isspace(peek())) nextChar();
    else if (peek()=='/' &amp;&amp; buf[forward+1]=='/') { while (peek()!='\\n' &amp;&amp; peek()!=EOF) nextChar(); }
    else if (peek()=='/' &amp;&amp; buf[forward+1]=='*') {
        forward += 2;
        while (!(peek()=='*' &amp;&amp; buf[forward+1]=='/')) { if (peek()==EOF) { error("unterminated comment"); return; } nextChar(); }
        forward += 2;
    } else return;
  }
}`, tk:'Report an unterminated comment at end of file.'},
    {k:'Concept', h:'Errors and positions', ic:'📍', pts:[['🔢','Keep <code>line</code> and <code>column</code>; store them in every token.'],['🩺','Message format: <code>prog.c:12:5: error: illegal character \'@\'</code>.'],['🏃','Recover with panic mode: delete the bad character and continue.'],['🧮','Count errors; stop after a limit (e.g. 20).']], tk:'Good scanners point to the exact column.'},
    {k:'Comparison', h:'Pros and cons of hand-coding', cmp:[['Advantages',['Fastest: no table lookups','Full control over errors and special cases','Easy to handle odd rules (nested comments, Python indentation)','No external tool needed']],['Disadvantages',['More code to write and test','Harder to change the token set','Easy to introduce subtle bugs','Specification is spread across code']]], tk:'Hand-code when speed and error quality matter most.'},
    {k:'Example', h:'Python version (compact)', code:`def scan(src):
    i, out = 0, []
    while i &lt; len(src):
        c = src[i]
        if c.isspace(): i += 1; continue
        if c.isalpha() or c == '_':
            j = i
            while j &lt; len(src) and (src[j].isalnum() or src[j] == '_'): j += 1
            w = src[i:j]; out.append(('KW' if w in KEYWORDS else 'ID', w)); i = j; continue
        if c.isdigit():
            j = i
            while j &lt; len(src) and src[j].isdigit(): j += 1
            out.append(('NUM', int(src[i:j]))); i = j; continue
        if src.startswith('&lt;=', i): out.append(('RELOP','LE')); i += 2; continue
        ...
        raise LexError(f"illegal char {c!r} at {i}")
    return out`, tk:'Under 30 lines for a working scanner.'}
  ],
  lab:{t:'Lab: hand-code a MiniC scanner', steps:['Implement nextChar, peek, retract and getToken for MiniC (Assignment 1 token set).','Handle identifiers/keywords, int and float constants, all operators (longest match) and comments.','Print each token with line:column.','Test with: <code>a&lt;=b</code>, <code>x1y2=3.25e2;</code>, <code>/* unterminated</code>, <code>s = "hi" @ 2;</code>.','Compare your output with Lab tools → Tokenizer.'], out:'Source code + test output for all four inputs.'},
  disc:['Why might a hand-coded scanner be faster than a table-driven one?','Python’s scanner emits INDENT and DEDENT tokens. How would you implement that by hand?','What is the danger of reading two characters ahead?'],
  mistakes:['Forgetting to retract after reading a lookahead character.','Comparing lexemes with == on strings in C instead of strcmp.','Not handling EOF inside a string or comment (infinite loop).','Updating the line counter in peek() as well as nextChar() (double counting).'],
  rev:['Hand-coded scanners encode the DFA in control flow.','Use nextChar, peek and retract for lookahead.','Look up identifiers in a keyword table.','Track line and column for good error messages.','Fastest and most flexible, but more work to maintain.'],
  hw:'Finish the hand-coded scanner. Read Cooper & Torczon §2.5 on table-driven and direct-coded scanners.',
  quiz:[
    {q:'In a hand-coded scanner, a DFA state usually becomes…', o:['A table row','A position in the code (e.g. a case or loop)','A grammar rule','A symbol-table entry'], a:1, e:'Direct-coded: control flow encodes states.'},
    {q:'<code>peek()</code> returns the next character…', o:['and consumes it','without consuming it','only at EOF','after retracting twice'], a:1, e:'Lookahead without moving forward.'},
    {q:'Which production compilers use hand-written scanners?', o:['GCC and Clang','Only toy compilers','None','Only interpreters'], a:0, e:'For speed and error quality.'},
    {q:'Keyword recognition after reading an identifier is done by…', o:['A second parser','Looking the lexeme up in a keyword table','Counting characters','Retracting'], a:1, e:'One lookup decides keyword or id.'},
    {q:'A main disadvantage of hand-coding is…', o:['Slow execution','Harder to change the token set','No error messages','Needs a DFA table'], a:1, e:'Changes require rewriting code.'}],
  terms:[['Hand-coded scanner','A scanner whose DFA is implemented directly in program code.'],['Direct-coded scanner','Synonym for hand-coded scanner (Cooper & Torczon).'],['peek','Returns the next input character without consuming it.'],['nextChar','Returns the next character and advances the input pointer.'],['Keyword table','A set of reserved words checked after reading an identifier.'],['Perfect hash','A hash function with no collisions for a fixed key set (e.g. keywords).']]
},
{ id:8, week:4, unit:'Implementing scanners', ic:'📊', lo:[2], book:'Cooper & Torczon Ch. 2.5 · Dragon Ch. 3.5, 3.8',
  title:'Implementing Scanners II: Table-Driven and Automatically Generated Scanners',
  sub:'Character classes, transition tables and the driver loop; longest-match with a rollback stack; generated scanners (Lex/Flex/re2c); comparing the three approaches.',
  intro:'Imagine changing the token set of your language every week. Rewriting a hand-coded scanner each time is painful. Put the DFA in a <b>table</b>, and the code never changes.',
  obj:['Represent a DFA with character classes and a transition table.','Write the table-driven driver loop with longest-match rollback.','Explain how generators like Flex produce table-driven or direct-coded scanners.','Compare hand-coded, table-driven and generated scanners.','Estimate table size and describe table compression.'],
  bloom:{head:['<b>Construct</b> a transition table with character classes.','<b>Trace</b> the driver loop on an input.','<b>Evaluate</b> which implementation fits a given project.'],
    heart:['<b>Value</b> separation of data (table) from code (driver).','<b>Appreciate</b> trade-offs instead of "one right answer".'],
    hand:['<b>Implement</b> a table-driven scanner for ids and integers.','<b>Generate</b> a scanner with Flex and compare outputs.']},
  slides:[
    {k:'Concept', h:'Character classes', ic:'🔠', p:'A table with one column per ASCII character would have 128+ columns, mostly identical. Group characters that behave the same into <b>classes</b>.', code:`charClass[c]:
  'a'..'z','A'..'Z','_'  → letter
  '0'..'9'               → digit
  everything else        → other`, tk:'Classes shrink the table drastically.'},
    {k:'Concept', h:'Transition table', code:`δ        letter   digit   other
s0       s1       s2      se
s1       s1       s1      se      (s1 accepting: ID)
s2       se       s2      se      (s2 accepting: NUM)
se       se       se      se      (error state)`, tk:'Changing the language = changing this table.'},
    {k:'Animation', h:'Running the driver', demo:'tablescan', tk:'The driver code is the same for every language.'},
    {k:'Concept', h:'The driver loop with rollback', code:`state = s0; lexeme = ""; stack.clear(); stack.push(BAD);
while (state != se) {
    c = nextChar(); lexeme += c;
    if (state in Accepting) stack.clear();
    stack.push(state);
    state = δ[state][charClass[c]];
}
while (state not in Accepting and state != BAD) {   // roll back
    state = stack.pop(); truncate lexeme; rollBack();
}
if (state in Accepting) return Type[state]; else return invalid;`, tk:'Run until the error state, then roll back to the last accepting state = longest match.'},
    {k:'Concept', h:'Why roll back?', ic:'↩️', p:'The DFA may go past the end of a valid token while trying for a longer one. Example with tokens <code>ab</code> and <code>abcd</code>: on input <code>abcx</code> it reads a, b, c, then fails at x. It must roll back to <code>ab</code> and return it; <code>c</code> becomes the start of the next token.', tk:'Longest match sometimes needs to undo a few reads.'},
    {k:'Animation', h:'Generated scanners', demo:'lexgen', tk:'The generator writes the table (or the code) for you.'},
    {k:'Concept', h:'What generators emit', pts:[['📊','<b>Table-driven</b> output: Lex/Flex emit compressed tables + a fixed driver (yylex).'],['✍️','<b>Direct-coded</b> output: re2c and Flex -f emit goto-based code — as fast as hand-written.'],['🗜️','<b>Table compression:</b> merge identical rows/columns, row displacement ("comb") packing, default transitions.']], tk:'Generated does not mean slow.'},
    {k:'Animation', h:'Comparison of the three approaches', demo:'scancompare', tk:'Pick by speed, effort, flexibility and error quality.'},
    {k:'Example', h:'Flex vs hand-coded — same tokens', code:`/* Flex */
[a-zA-Z_][a-zA-Z0-9_]*   { return lookup(yytext); }
[0-9]+                    { yylval = atoi(yytext); return NUM; }
"&lt;="                      { return LE; }

/* Hand-coded equivalent: ~40 lines of if/while (Session 7) */`, tk:'Three lines of Flex replace forty lines of C.'},
    {k:'Concept', h:'Note on the course outline', ic:'📝', p:'The scanned outline’s Week 4 row also mentions "Ampere’s Law and Its Applications". That is a physics topic pasted by mistake; it is not part of Compiler Construction. Week 4 covers scanner implementation only.', tk:'Ask the instructor if in doubt.'}
  ],
  lab:{t:'Lab: table-driven scanner + Flex comparison', steps:['Write charClass[] and δ[][] for identifiers, integers and the operators + - * / = ; .','Write the driver loop (with rollback) and print tokens.','Write the same token set in Flex and generate lex.yy.c.','Run both on the same 20-line file. Compare outputs and time them on a 1 MB file.','Add a new token (e.g. <code>**</code>). Count how many lines changed in each version.'], out:'Two scanners, matching outputs, timing table, and change-count comparison.'},
  disc:['When would a table-driven scanner beat a hand-coded one in development time?','Why does Flex compress its tables?','Your company invents a new configuration language. Which scanner approach do you choose and why?'],
  mistakes:['Using one column per ASCII character without classes (huge sparse table).','Forgetting the error state se.','Not rolling back: returning an error for "abcx" when "ab" is a valid token.','Assuming generated scanners are always slower.'],
  rev:['Table-driven: charClass[] + δ[][] + generic driver.','Rollback stack implements longest match.','Generators produce table-driven or direct-coded scanners from REs.','Hand-coded = fastest and most flexible; generated = least effort; table-driven = easy to change.','Tables are compressed in practice.'],
  hw:'Read Louden §2.6 (Lex). Revise Weeks 2–4; next week we finish scanners with the symbol table and start parsing.',
  quiz:[
    {q:'Character classes are used to…', o:['Speed up parsing','Reduce the number of columns in the transition table','Store identifiers','Handle errors only'], a:1, e:'Characters that behave the same share a column.'},
    {q:'The driver loop in a table-driven scanner…', o:['Changes for every language','Is the same for every language; only the table changes','Is generated by the parser','Contains the keywords'], a:1, e:'Data (table) vs code (driver).'},
    {q:'Rollback is needed to implement…', o:['Rule priority','Longest match','Comments','Hashing'], a:1, e:'Return to the last accepting state.'},
    {q:'re2c produces scanners that are…', o:['Table-driven only','Direct-coded (goto-based)','Interpreted','Recursive descent'], a:1, e:'Fast, direct-coded output.'},
    {q:'Adding a new token is easiest in a…', o:['Hand-coded scanner','Generated scanner (edit the RE)','Assembler','Linker'], a:1, e:'Just add a pattern.'}],
  terms:[['Table-driven scanner','A scanner that runs a DFA stored in a transition table with a generic driver.'],['Character class','A group of characters with identical transitions; one table column.'],['Driver loop','The generic code that reads characters and follows the table.'],['Rollback','Undoing reads to return to the last accepting state for longest match.'],['re2c','A generator that produces direct-coded C scanners.'],['Table compression','Techniques that shrink sparse transition tables.'],['Error state','A dead state from which no accepting state is reachable.']]
}
);
