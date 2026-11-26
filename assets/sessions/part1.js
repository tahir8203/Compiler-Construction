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
                    error messages`,
      parts:[['source program','The program we wrote, e.g. the file <code>hello.c</code>.'],['──►','An arrow: “goes into” or “comes out of”.'],['[ COMPILER ]','The translator program itself, e.g. gcc.'],['target program','The translated program, e.g. the file <code>hello</code> (<code>hello.exe</code> on Windows), in machine code.'],['error messages','Reports of mistakes found while translating, with line numbers.']],
      what:['The compiler reads the <b>whole</b> source program first.','If it finds mistakes, it prints error messages and makes no target program.','If there are no mistakes, it writes the target program to a file.','Later, we run the target program as many times as we like. The compiler is not needed any more.'],
      res:'One translation gives one target program that can run again and again.',
      an:'A translator who translates a whole book once. Readers then read the translated book again and again, without the translator.', tk:'Compiler = translate everything first + report errors.',
      n:{say:'Point to the three arrows: input, output, error messages. Example: <code>gcc hello.c -o hello</code> produces the file <code>hello</code>; we can run <code>./hello</code> a thousand times without gcc.', ask:'Does a compiler run my program?', ans:'No. It only translates. Running happens later, when you start the target program.', watch:'Students confuse “compile” and “run” because an IDE does both with one button.'}},
    {k:'Example', h:'A compiler for real: <code>gcc hello.c -o hello</code>', ic:'🧪', code:`gcc hello.c -o hello
./hello`,
      parts:[['gcc','The C compiler (GNU C Compiler).'],['hello.c','The source program (input).'],['-o','“Output”: the next word is the name of the file to make.'],['hello','The target program (output): machine code in a file.'],['./hello','Run the target program from the current folder. gcc is not used here.']],
      what:['<code>gcc</code> reads all of <code>hello.c</code> and checks it.','No mistakes, so it writes the file <code>hello</code> (machine code).','<code>./hello</code> asks the computer to run that file.','Running it again does <b>not</b> translate again; the same file runs.'],
      eg:{note:'Our <code>hello.c</code>:', code:`#include &lt;stdio.h&gt;

int main() {
    printf("Hello\\n");
    return 0;
}`, out:`$ gcc hello.c -o hello
$ ./hello
Hello
$ ./hello
Hello`},
      res:'gcc worked once; the program <code>hello</code> ran twice without gcc.',
      an:'A baker bakes a loaf once. You can eat slices all week without calling the baker again.', tk:'Compile once (gcc), run many times (./hello).',
      n:{say:'Type it live if a lab PC is ready. Point out that gcc printed nothing: for a compiler, silence means “no errors”. Then run ./hello twice and ask: “How many times did gcc work?” (Once.) On Windows (MinGW) the file is <code>hello.exe</code> and you run it with <code>hello</code>.', ask:'What if I change hello.c after compiling?', ans:'The file hello does not change by itself. You must compile again to get a new target program.', watch:'Students expect gcc to print “success”. It prints nothing when all is well.'}},
    {k:'Example', h:'When the compiler finds an error', ic:'🩺', p:'The compiler checks the whole program <b>before</b> anything runs. If it finds a mistake, it reports it and makes no target program.',
      parts:[['hello.c:3:22','File name, line 3, column 22: where the problem was noticed.'],['error:','A real mistake; no target program is made. (A <i>warning:</i> would still make one.)'],['expected ‘;’ before ‘return’','The message: a semicolon was missing before the word <code>return</code>.']],
      what:['gcc reads line 3 and finds no <code>;</code> after <code>printf("Hello\\n")</code>.','It reports the error with the line and column.','It stops and does not write the file <code>hello</code>.','So nothing runs: not even line 1 of the program.'],
      eg:{note:'Line 3 has no semicolon:', code:`#include &lt;stdio.h&gt;
int main() {
    printf("Hello\\n")
    return 0;
}`, out:`$ gcc hello.c -o hello
hello.c: In function ‘main’:
hello.c:3:22: error: expected ‘;’ before ‘return’`},
      res:'Compiler errors appear before the program runs, and no target program is made.',
      an:'An editor reads your whole essay before it is printed. If a page has a mistake, nothing is printed until you fix it.', tk:'A compiler reports errors first; the program runs only when there are none.',
      n:{say:'The exact wording, quotes and column number can differ a little between gcc versions, but the shape file:line:column: error: message is always the same. Ask a student to fix it and compile again.', ask:'Why does gcc say line 3 when return is on line 4?', ans:'It noticed the problem at column 22 of line 3, right after the <code>)</code>, where the <code>;</code> should be. The tool points to where it noticed, which is usually at or just after the real mistake.', watch:'Students read only the last line. Teach them to read the first error first; later errors are often caused by the first one.'}},
    {k:'Concept', h:'What is an interpreter?', ic:'🔁', p:'An <b>interpreter</b> does <b>not</b> produce a target program. It reads the source and <b>carries out</b> each statement straight away, one after another, using the inputs you give it.', code:`source program ─┐
                 ├──►  [ INTERPRETER ]  ──►  output
input ──────────┘`,
      parts:[['source program','The program we wrote, e.g. <code>hello.py</code>.'],['input','Data the program needs while it runs, e.g. what the user types.'],['[ INTERPRETER ]','The program that reads and runs our code, e.g. <code>python</code>.'],['output','What the program prints. No target file is made.']],
      what:['The interpreter takes the first statement and runs it at once.','Then it takes the next statement and runs it, and so on.','If a statement has a mistake, it stops at that statement. The lines before it have already run.','Next time, it translates and runs everything again.'],
      res:'An interpreter gives the program’s output directly, but no target program.',
      an:'A live interpreter at a meeting translates each sentence as it is spoken. Nothing is written down, so the next meeting needs the interpreter again.', tk:'Interpreter = translate and run, one statement at a time, every time.',
      n:{say:'Compare with the previous slide: no target program comes out, only the program’s output. Examples: Python, early JavaScript, shell scripts and MATLAB are usually interpreted.', ask:'So is Python never compiled?', ans:'Good catch: real Python first compiles to bytecode, then interprets it. We will see this “hybrid” idea in a few slides.', watch:'A language is not compiled or interpreted by nature; the tool that implements it decides.'}},
    {k:'Example', h:'An interpreter for real: <code>python hello.py</code>', ic:'🐍', code:`python hello.py`,
      parts:[['python','The Python interpreter program.'],['hello.py','The source program it reads and runs.'],['(no -o)','No output file name: an interpreter makes no target program.']],
      what:['Python reads <code>hello.py</code>.','Line 1 runs at once and prints <code>A</code>.','Line 2 uses <code>x</code>, but <code>x</code> was never given a value.','Python stops at line 2 with a <code>NameError</code>. Line 1 has already run.'],
      eg:{note:'Our <code>hello.py</code> (line 2 has a mistake):', code:`print("A")
print(x)`, out:`$ python hello.py
A
Traceback (most recent call last):
  File "hello.py", line 2, in &lt;module&gt;
    print(x)
          ^
NameError: name 'x' is not defined`},
      res:'The interpreter ran line 1, then reported the error only when it reached line 2.',
      an:'A live interpreter at a meeting translates each sentence. If the speaker says a word nobody knows, the interpreter stops at that sentence; the earlier sentences were already heard.', tk:'Interpreter: output comes at once; an error appears when that line is reached.',
      n:{say:'Output checked with Python 3.12. The File line shows the full path on a real PC, and the small ^ marker under x appears in Python 3.11 and newer. Compare with the previous gcc slide: there, nothing ran; here, A was printed before the error.', ask:'If line 2 had a missing bracket instead, would A still be printed?', ans:'No. A missing bracket is a syntax error. Python first compiles the whole file to bytecode, finds the syntax error, and prints nothing. Only run-time errors such as NameError appear after earlier lines ran. The lab shows both.', watch:'Students think every Python error appears “in the middle”. Syntax errors appear before anything runs.'}},
    {k:'Animation', h:'Compiler vs interpreter in action', demo:'compint', an:'Translating a book once (compiler) versus hiring a live interpreter for every reading (interpreter).', tk:'Compile once and run many times, or interpret every time.',
      n:{say:'Press Step slowly. Stop after the compiler part and ask how many times the compiler worked (once). Then watch the interpreter part and ask again (every run).', ask:'Which one starts running sooner?', ans:'The interpreter: there is no translation step before the first line runs.', watch:'Skip the last (hybrid) frame for now if time is short; slides 8–12 cover it.'}},
    {k:'Comparison', h:'Comparing the two strategies', cmp:[['⚙️ Compiler',['Translates the whole program before it runs','The result runs <b>fast</b>, often 10× faster or more','Finds many errors before the program runs','Needs a separate compile step','The result works only on one kind of machine']],['🔁 Interpreter',['Translates and runs one statement at a time','Runs more slowly','Error messages can show real run-time values','Starts at once: great for scripts and learning','The same source runs wherever the interpreter runs']]], an:'Cooking a meal in advance and reheating it (fast to serve) versus cooking it fresh every time (slower, but you can change the recipe on the spot).', tk:'Speed favours compilers; flexibility favours interpreters.',
      n:{say:'Read across the rows: speed, errors, start-up, portability. Ask students to pick a winner for a mobile game (compiler) and for a quick script (interpreter).', ask:'Can compiled programs still crash while running?', ans:'Yes. A compiler cannot catch everything, e.g. dividing by a number the user types as zero.', watch:'“Interpreters have no errors before running” is wrong; many interpreters check syntax first.'}},
    {k:'Summary', h:'Compiler vs interpreter (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Point','Compiler','Interpreter'], r:[['How it translates','The whole program, before running','One statement at a time, while running'],['What comes out','A target program (a file)','Only the program’s output'],['Speed of running','Fast','Slower'],['When errors appear','Before the program runs','When that statement is reached (syntax errors may come first)'],['Running again','No new translation needed','Translates again every time'],['Example tool','<code>gcc hello.c -o hello</code>','<code>python hello.py</code>']]},
      res:'Compiler = translate once, run many times. Interpreter = translate and run every time.',
      an:'A printed, translated book (compiler) versus a live interpreter at every meeting (interpreter).', tk:'Learn the six rows; they answer most “compare” questions.',
      n:{say:'Cover the two right columns and ask students to fill them from memory. This is a classic 5-mark question: “Differentiate between a compiler and an interpreter.”', ask:'Which row explains why compiled programs run faster?', ans:'“How it translates”: the translation work is done once, before running, so running is only executing machine code.', watch:'Students write “interpreter has no errors”. It does report errors, just later.'}},
    {k:'Animation', h:'A first look inside: one line through a compiler', demo:'livepipe', full:true, input:'int x = 5 + 3;', p:'A compiler works like a factory line of <b>phases</b>. Press <b>Step</b> to follow <code>int x = 5 + 3;</code> through each phase, or type your own line and press Compile.', an:'A car factory: one station fits the wheels, the next paints, the next tests. Each station does one job.', tk:'Lexer → parser → semantic analysis → intermediate code → optimiser → code generator → output.',
      n:{say:'This is a preview of the whole course. Do not explain every phase in depth. Say one sentence per phase, using the caption under the pipeline. Point out that the optimiser turns 5 + 3 into 8 before the program ever runs.', ask:'Why so many phases? Why not translate in one go?', ans:'Small steps are easier to build, test and reuse. The same front end can feed different back ends, for example Intel and ARM.', watch:'Let one or two students type their own line, e.g. <code>y = a + b * 2;</code>. Try a broken one like <code>x = 5 +;</code> to show a syntax error.'}},
    {k:'Concept', h:'A virtual machine: a pretend computer', ic:'🖥️', p:'A <b>virtual machine</b> is a program that behaves like a computer. It has its own simple instruction language and runs those instructions on whatever real computer it is installed on. Java’s one is the <b>JVM</b> (Java Virtual Machine).', an:'A universal remote control understands one set of buttons and can drive a Sony, a Samsung or an LG TV.', tk:'Write for the virtual machine once; it runs on every real machine that has the VM.',
      n:{say:'We need this idea before bytecode makes sense. The JVM is just a program, like Chrome or Word, that knows how to run Java’s instructions.', ask:'Is the JVM hardware?', ans:'No, it is software. That is why it is called virtual.', watch:'Do not mix this up with VirtualBox or VMware, which pretend to be a whole PC. Same idea, bigger scale.'}},
    {k:'Concept', h:'javac produces bytecode, not machine code', ic:'☕', p:'<b>javac</b> is the Java compiler. It translates your <code>.java</code> file into a <b>.class file</b>. The .class file holds <b>bytecode</b>: instructions for the JVM, not for a real CPU. Each operation code fits in one byte, hence the name.', pts:[['📄','<code>Calc.java</code> → <b>javac</b> → <code>Calc.class</code> (bytecode)'],['🌍','<b>Portable:</b> the same .class runs on Windows, Linux or Android.'],['🔍','See the bytecode with <code>javap -c Calc</code>.']], an:'Musical notes. A composer writes them once; any trained musician on any instrument can play them.', tk:'Bytecode is machine code for a virtual machine.',
      n:{say:'Demo on the lab PC: <code>javac Calc.java</code>, then <code>dir</code> or <code>ls</code> to show Calc.class appeared, then <code>javap -c Calc</code>.', ask:'Why not compile Java straight to machine code?', ans:'Then you would need a different file for every kind of computer. Bytecode is one file for all of them.', watch:'Students say “the .class file is machine code”. It is not; a CPU cannot run it without the JVM.'}},
    {k:'Step 1', h:'Compile: <code>javac Calc.java</code>', ic:'☕', code:`javac Calc.java`,
      parts:[['javac','The Java compiler.'],['Calc.java','The Java source file (input). The class inside must be called Calc.'],['(output)','No -o needed: javac always writes <code>Calc.class</code> next to the source.']],
      what:['javac reads the whole of <code>Calc.java</code> and checks it.','If there are errors, it prints them and makes no .class file.','If all is well, it writes <code>Calc.class</code>, which holds bytecode.'],
      eg:{note:'Our <code>Calc.java</code>:', code:`public class Calc {
    int f(int a, int b) {
        return a + b * 2;
    }
    public static void main(String[] args) {
        System.out.println(new Calc().f(4, 3));
    }
}`, out:`$ javac Calc.java
$ ls
Calc.class  Calc.java`},
      res:'<code>Calc.class</code> = bytecode for the JVM (not machine code for the CPU).',
      an:'A composer writes the music in standard notes once. Any musician can play it later.', tk:'javac: .java → .class (bytecode).',
      n:{say:'On Windows use <code>dir</code> instead of <code>ls</code>. Like gcc, javac prints nothing when there are no errors. We use this same Calc.java on the next three slides.', ask:'Is javac a compiler or an interpreter?', ans:'A compiler: it translates the whole file first and writes a target file. Its target language is bytecode.', watch:'If the file is called calc.java (small c) but the class is Calc, javac gives an error for a public class. File name and class name must match.'}},
    {k:'Step 2', h:'Run: <code>java Calc</code>', ic:'▶️', code:`java Calc`,
      parts:[['java','Starts the JVM (the Java Virtual Machine).'],['Calc','The class to run. Write it without “.class”. The JVM starts at its <code>main</code> method.']],
      what:['The JVM loads <code>Calc.class</code>.','It runs <code>main</code>, which creates a Calc object and calls <code>f(4, 3)</code>.','f works out 4 + 3 × 2 = 10.','<code>println</code> prints 10.'],
      eg:{note:'After Step 1:', code:`$ java Calc`, out:`10`},
      res:'The JVM ran the bytecode and printed 10.',
      an:'A musician (the JVM) reads the written notes (bytecode) and plays them.', tk:'java = start the JVM and run the bytecode.',
      n:{say:'Stress that the CPU never runs Calc.class directly: the JVM is a program that reads bytecode and carries it out (interpreting first, and later JIT-compiling the hot parts).', ask:'Why is it <code>java Calc</code> and not <code>java Calc.class</code>?', ans:'The java command takes a class name, not a file name. It finds the file Calc.class by itself.', watch:'Students type <code>java Calc.java</code>. Newer Java versions can run a single source file that way, but then javac and .class are hidden. Use the two steps in this course.'}},
    {k:'Step 3', h:'Look inside: <code>javap -c Calc</code>', ic:'🔍', code:`javap -c Calc`,
      parts:[['javap','The Java class file disassembler: it shows what is inside a .class file.'],['-c','Show the bytecode instructions (“c” for code) of every method.'],['Calc','The class to look at.']],
      what:['javap opens <code>Calc.class</code>.','For each method it prints the bytecode as readable words.','The number before each instruction is its position (byte offset) in the method.'],
      eg:{note:'Part of the output (only method <code>f</code> shown):', code:`$ javap -c Calc`, out:`  int f(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iconst_2
       3: imul
       4: iadd
       5: ireturn`},
      res:'We can read the bytecode javac made. Six one-byte instructions do <code>a + b * 2</code>.',
      an:'Opening a sealed packet to see the ingredients list: nothing is changed, you only look.', tk:'javap -c shows the bytecode inside a .class file.',
      n:{say:'The full output also shows a line “Compiled from "Calc.java"”, the constructor Calc() and the main method. Here each instruction is one byte long, so the offsets are 0, 1, 2, 3, 4, 5. The next slide explains each instruction.', ask:'Does javap change Calc.class?', ans:'No. It only reads the file and prints it in a readable form.', watch:'javap is not a compiler; it does not translate into anything new.'}},
    {k:'Example', h:'Inside bytecode: a stack machine', ic:'📦', p:'The JVM is a <b>stack machine</b>: values are pushed onto a stack; each operation pops its inputs and pushes the answer.', code:`// Calc.java                      // javap -c Calc   (bytecode)
int f(int a, int b) {             0: iload_1    // push a
  return a + b * 2;               1: iload_2    // push b
}                                 2: iconst_2   // push 2
                                  3: imul       // pop b, 2 → push b*2
                                  4: iadd       // pop a, b*2 → push a+b*2
                                  5: ireturn    // return the top value`,
      parts:[['0: 1: 2: …','Position of the instruction inside the method.'],['i…','The first letter <code>i</code> means “int”: these instructions work on integers.'],['iload_1','Push the value in local slot 1 (that is <code>a</code>).'],['iload_2','Push the value in local slot 2 (that is <code>b</code>).'],['iconst_2','Push the constant 2.'],['imul','Pop two values, multiply them, push the answer.'],['iadd','Pop two values, add them, push the answer.'],['ireturn','Return the value on top of the stack.']],
      what:['Push a, push b, push 2: the stack holds three values.','imul takes the top two (b and 2) and pushes b×2.','iadd takes the top two (a and b×2) and pushes a + b×2.','ireturn gives back the top value.'],
      eg:{note:'Call f(4, 3), so a = 4 and b = 3. The stack after each instruction (top on the right):', out:`0: iload_1    [4]
1: iload_2    [4, 3]
2: iconst_2   [4, 3, 2]
3: imul       [4, 6]
4: iadd       [10]
5: ireturn    returns 10`},
      res:'f(4, 3) returns 10, the same answer as java Calc printed.',
      an:'A stack of plates: you only put plates on the top and take them from the top.', tk:'Push the operands, then operate: no CPU registers needed.',
      n:{say:'Trace it on the board with a = 4, b = 3. Stack after each line: [4], [4,3], [4,3,2], [4,6], [10]. Return 10.', ask:'Why does iload_1 load <i>a</i> and not iload_0?', ans:'In a normal (non-static) method, slot 0 holds <code>this</code>, the current object. a is in slot 1 and b in slot 2.', watch:'Later (Session 26) we write the same thing as three-address code: t1 = b * 2; t2 = a + t1. Mention it as a preview only.'}},
    {k:'Concept', h:'The JIT compiler: speeding up the busy parts', ic:'🔥', p:'The JVM first <b>interprets</b> bytecode, so the program starts at once. While it runs, it <b>counts</b> how often each method is called and each loop repeats. This counting is called <b>profiling</b>.', pts:[['1️⃣','<b>Interpret first:</b> no waiting at start-up.'],['2️⃣','<b>Profile:</b> count runs of every method and loop.'],['3️⃣','<b>Hot code</b> (runs very often) is JIT-compiled to machine code.'],['❄️','<b>Cold code</b> (runs rarely) stays interpreted.']], an:'A tourist uses a phrase book for rare sentences, but memorises “Where is the bus?” because she says it every day.', tk:'Interpret cold code, compile hot code: fast start and fast running.',
      n:{say:'JIT means Just-In-Time: compiling happens just before the code is needed, while the program runs. Real example: Oracle’s JVM is called HotSpot after this idea; Chrome’s V8 and C# (.NET) work the same way.', ask:'Why not JIT-compile everything as soon as the program starts?', ans:'Compiling takes time and memory. Most code runs only a few times, so compiling it would cost more than it saves.', watch:'Students think the JIT replaces javac. No: javac still makes the bytecode; the JIT works later inside the JVM.'}},
    {k:'Example', h:'Hot or cold? The JIT decides', ic:'🌡️', code:`public static void main(String[] args) {
    Calc c = new Calc();                  // runs once
    long total = 0;
    for (int i = 0; i &lt; 1000000; i++)     // repeats 1,000,000 times
        total = total + c.f(i, 1);        // f is called 1,000,000 times
    System.out.println(total);            // runs once
}`,
      parts:[['new Calc()','Runs once: cold code.'],['for (…; i &lt; 1000000; …)','A loop that repeats one million times: hot code.'],['c.f(i, 1)','Called one million times, so method <code>f</code> becomes hot.'],['println(total)','Runs once: cold code.']],
      what:['The JVM starts by interpreting main, so the program starts at once.','While it runs, it counts the calls to f and the turns of the loop (profiling).','After some thousands of calls, f passes the JVM’s limit and is marked hot.','The JIT compiles f (and the loop) to machine code; later calls run that fast code.','The cold lines are never compiled; they stay interpreted.'],
      eg:{note:'What it prints (f(i, 1) = i + 1×2 = i + 2, added for i = 0 … 999,999):', out:`500001500000`},
      res:'Only the busy part (f and the loop) is turned into machine code; the result is the same, just faster.',
      an:'A shopkeeper keeps the items that sell every hour on the front shelf, and the rare items in the back store.', tk:'Hot = runs very often → JIT-compiled. Cold = runs rarely → interpreted.',
      n:{say:'Work the output out on the board: f(i, 1) = i + 2. The sum of i for i = 0 … 999,999 is 999,999 × 1,000,000 ÷ 2 = 499,999,500,000. Add 2 for each of the 1,000,000 calls: + 2,000,000 = 500,001,500,000. We use long because the answer is too big for int. To run it, replace the main method of Calc.java with this one.', ask:'Exactly how many calls make a method hot?', ans:'It depends on the JVM and its settings (thousands of calls in HotSpot). The idea matters for the exam, not the number.', watch:'The JIT never changes the result. It only changes how fast the same answer is produced.'}},
    {k:'Diagram', h:'Putting it together: how a Java program runs', img:{src:'assets/img/java-jvm-pipeline.png', alt:'Java pipeline: Source code .java goes to the javac compiler, which produces bytecode .class; the JVM (JIT, Interpreter, Runtime) runs it and produces program output.', cap:'.java → javac → .class (bytecode) → JVM (interpreter + JIT + runtime) → output'}, an:'A recipe written in a universal cooking code (bytecode), cooked by any kitchen robot (JVM) that learns the dishes ordered most often (JIT).', tk:'Java is compiled AND interpreted: a hybrid.',
      n:{say:'Walk the arrows left to right. javac runs once, on the developer’s PC, and reports compile-time errors. The .class file is what we ship. On the user’s PC the JVM interprets it, the JIT compiles hot parts, and the runtime manages memory (the garbage collector frees memory nobody uses).', ask:'Which boxes are compilers?', ans:'Two of them: javac (Java → bytecode) and the JIT (bytecode → machine code).', watch:'This answers the classic exam question “Is Java compiled or interpreted?”: both.'}},
    {k:'Summary', h:'Java’s tools (exam table)', ic:'📋', code:`Calc.java ──javac──▶ Calc.class ──java Calc──▶ JVM (interpreter + JIT) ──▶ 10`,
      tbl:{cap:'Important points for your exam', h:['Tool / command','What it does','Input → output','When it runs'], r:[['<code>javac Calc.java</code>','Compiles Java to bytecode','.java → .class','Once, on the developer’s PC'],['<code>java Calc</code>','Starts the JVM and runs the program','.class → program output','Every time the program runs'],['JVM interpreter','Runs bytecode one instruction at a time','bytecode → actions','From the first moment of the run'],['JIT compiler','Compiles hot code to machine code','hot bytecode → machine code','During the run, for hot code only'],['<code>javap -c Calc</code>','Shows the bytecode in readable form','.class → text listing','Only when we want to look inside']]},
      res:'Java uses two compilers (javac and the JIT) and one interpreter (inside the JVM).',
      an:'A music team: the composer (javac) writes the notes once; the musician (JVM) plays them; for the favourite songs she learns them by heart (JIT).', tk:'javac once; JVM every run; JIT for hot code.',
      n:{say:'Cover the last two columns and let students fill them in. Then ask the classic question again: “Is Java compiled or interpreted?” Expect: both, and they should name javac and the JIT as the two compilers.', ask:'Which of these tools must be installed on the user’s PC?', ans:'Only the JVM (the java command, which contains the interpreter and the JIT). javac and javap are developer tools.', watch:'Students list javap as a compiler. It only displays; it translates nothing.'}},
    {k:'Concept', h:'Other hybrids you already use', ic:'🧩', p:'Most modern languages mix compiling and interpreting.', pts:[['🐍','<b>Python (CPython):</b> compiles each .py file to .pyc bytecode, then interprets it.'],['🌐','<b>JavaScript (V8 in Chrome):</b> interprets first, then JIT-compiles hot functions.'],['🤖','<b>Android:</b> Kotlin/Java become DEX bytecode; the phone’s ART runtime compiles it to machine code, partly ahead of time and partly with a JIT.']],
      tbl:{cap:'Important points for your exam', h:['System','Step 1: compiled to','Step 2: run by'], r:[['Java','Bytecode (.class) by javac','JVM: interpreter + JIT'],['Python (CPython)','Bytecode (.pyc)','Python’s bytecode interpreter'],['JavaScript (V8)','Bytecode inside the browser','V8’s interpreter, then JIT for hot functions'],['Android (Kotlin/Java)','DEX bytecode','ART: ahead-of-time + JIT to machine code']]},
      an:'Hybrid cars: an electric motor for starting and slow traffic, a petrol engine for speed. Each is used where it is best.', tk:'Real systems use compiling and interpreting together.',
      n:{say:'Show a __pycache__ folder from any Python project: the .pyc files are Python’s bytecode.', ask:'So which languages are “really” interpreted?', ans:'Almost none are purely interpreted today. Shell scripts are close.', watch:'Avoid saying “Python is interpreted, full stop”; say “usually interpreted, after compiling to bytecode”.'}},
    {k:'Example', h:'Python’s bytecode: <code>dis.dis(f)</code>', ic:'🐍', p:'Python also compiles to bytecode first. The <code>dis</code> module (“disassembler”) shows it. Compare it with the Java bytecode of the same function.', code:`def f(a, b):
    return a + b * 2

import dis
dis.dis(f)`,
      parts:[['RESUME 0','A start-up marker for the function; it does no maths.'],['LOAD_FAST 0 (a)','Push local variable 0, which is a (like Java’s iload_1).'],['LOAD_FAST 1 (b)','Push local variable 1, which is b.'],['LOAD_CONST 1 (2)','Push the constant 2 (like iconst_2).'],['BINARY_OP 5 (*)','Pop two values, multiply, push the answer (like imul).'],['BINARY_OP 0 (+)','Pop two values, add, push the answer (like iadd).'],['RETURN_VALUE','Return the top of the stack (like ireturn).'],['2, 4, 6, …','Position (byte offset) of each instruction; the first column (1, 2) is the source line.']],
      what:['Python compiles the function to bytecode when the file is read.','<code>dis.dis(f)</code> prints that bytecode.','Python’s bytecode is also for a stack machine: push, push, push, multiply, add, return.'],
      eg:{note:'Output with Python 3.12:', out:`  1           0 RESUME                   0

  2           2 LOAD_FAST                0 (a)
              4 LOAD_FAST                1 (b)
              6 LOAD_CONST               1 (2)
              8 BINARY_OP                5 (*)
             12 BINARY_OP                0 (+)
             16 RETURN_VALUE`},
      res:'Python and Java both compile <code>a + b * 2</code> into the same stack steps; only the names differ.',
      an:'The same recipe written in two cookbooks: different words, same steps in the same order.', tk:'CPython = compile to bytecode, then interpret it.',
      n:{say:'Output checked with Python 3.12. Other versions print different names and numbers (e.g. Python 3.10 shows BINARY_MULTIPLY and BINARY_ADD; 3.13 may join the two loads into one LOAD_FAST_LOAD_FAST). The order of the work never changes: b * 2 first, then a + that.', ask:'Why does Python count locals from 0 but Java from 1?', ans:'f in Calc is a non-static Java method, so slot 0 holds <code>this</code>. The Python function has no hidden object, so a is local 0.', watch:'The jumps of 2 and 4 in the offsets are normal: some instructions take more bytes (space for caches). Do not ask students to memorise offsets.'}},
    {k:'Example', h:'Translators are all around you', ic:'🌍', pts:[['🧾','<b>gcc / clang:</b> C → machine code'],['🌐','<b>TypeScript compiler:</b> TypeScript → JavaScript'],['🗄️','<b>Database engines:</b> an SQL query → an execution plan'],['📝','<b>Code editors:</b> use a scanner to colour your code'],['🔗','<b>Pre-processors, linkers and loaders</b> help turn your code into a running program (next lecture)']],
      tbl:{cap:'Source and target of each translator', h:['Translator','Source (input)','Target (output)'], r:[['gcc / clang','C program','Machine code'],['TypeScript compiler','TypeScript','JavaScript'],['Database engine','SQL query','Execution plan'],['Code editor’s scanner','Your code','Coloured words (keywords, names, strings)'],['javac','Java','Bytecode']]},
      an:'Translation is like electricity in a house: you rarely see it, but almost everything uses it.', tk:'If it reads a language and produces something else, it is a translator.',
      n:{say:'Ask each row: what is the source language and what is the target? Tap the underlined words for quick meanings; Session 2 explains pre-processors, linkers and loaders properly.', ask:'Is Microsoft Word a compiler?', ans:'Not really, but its “save as PDF” feature is a translator: document format → PDF.', watch:'Keep this slide short; it is for motivation.'}},
    {k:'Concept', h:'What makes a good compiler?', ic:'✅', pts:[['✔️','<b>Correct:</b> the target program means exactly what the source means. This matters most.'],['⚡','<b>Fast code:</b> the program it produces runs quickly.'],['⏱️','<b>Fast compiling:</b> you do not wait long.'],['🩺','<b>Helpful error messages</b> that point to the real problem.'],['🔧','<b>Easy to maintain</b> and to move to new machines.']], an:'A good translator is first of all accurate. A fast translator who changes the meaning of a contract is dangerous.', tk:'Correctness first, then speed of the code, then speed of the compiler.',
      n:{say:'Ask students to rank these five before you reveal that correctness is number one.', ask:'Would you accept a compiler that makes code 2× faster but is wrong 1% of the time?', ans:'No. One wrong result in a bank or a plane is a disaster.', watch:'This slide connects to every later topic: each phase must keep the meaning.'}},
    {k:'Summary', h:'Lecture 1 in one table (exam)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Term','Meaning in simple words','Example'], r:[['Translator','Changes a program from one language to another; the meaning stays the same','gcc, javac, python'],['Compiler','Translates the whole program first, makes a target program, reports errors','<code>gcc hello.c -o hello</code>'],['Interpreter','Runs the program statement by statement; no target program','<code>python hello.py</code>'],['Virtual machine','A program that acts like a computer with its own instructions','The JVM'],['Bytecode','Instructions for a virtual machine, not for a real CPU','<code>Calc.class</code>: iload_1, imul, iadd'],['JIT compiler','Compiles hot code to machine code while the program runs','Inside the JVM, V8'],['Hybrid','Compiles to bytecode, then interprets it (and JIT-compiles hot parts)','Java, Python, JavaScript'],['Good compiler','Correct first; then fast code, fast compiling, clear errors, easy to maintain','—']]},
      res:'You can now define each term and give a real command or tool as an example.',
      an:'A map at the end of a journey: one look shows every place we visited today.', tk:'Translator → compiler or interpreter → Java mixes both.',
      n:{say:'Use this as the last five minutes: read the Term column, students say the meaning, then reveal. Ask for one more example in each row from the class.', ask:'Which single row would you choose to answer “Is Java compiled or interpreted?”', ans:'Hybrid: javac compiles to bytecode; the JVM interprets it and its JIT compiles hot parts.', watch:'Students mix up “bytecode” and “machine code”. Ask: “Can the CPU run it without help?” Bytecode: no.'}}
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
  introH:'What really happens when you build a program?',
  intro:'You press <b>Build</b> and a program appears. In fact a whole team of tools has worked one after another. Today we follow <code>prog.c</code> from the editor to a running program, then open the compiler itself and look at its six phases.',
  introAn:'A letter you post does not fly straight to your friend. Someone collects it, sorts it, puts it on a truck, and a postman delivers it. Each person does one job. Building a program works the same way.',
  introN:{say:'Ask: “When you press Build in Code::Blocks or Visual Studio, how many programs do you think run?” Most students say one. Write their guesses on the board. At the end of the lecture come back and count together: pre-processor, compiler, assembler, linker, loader = five tools, and the compiler alone has six phases inside.', ask:'Why do we need to know this if the IDE does it all with one button?', ans:'Because errors come from different tools. “undefined reference to printf” is a linker error, not a compiler error. Knowing the team tells you who complained and how to fix it.', watch:'Students mix up the compiler (one tool) with the whole build process. Keep saying “the compiler is one worker in the team”.'},
  obj:['Describe the language-processing system: pre-processor, compiler, assembler, linker and loader.','List the phases of a compiler and the output of each.','Trace a statement through all phases.','Explain analysis vs synthesis and front end vs back end.','Explain the role of the symbol table and the error handler.'],
  bloom:{head:['<b>Remember</b> the order of the phases.','<b>Understand</b> what each tool in the pipeline produces.','<b>Apply</b> the phases to translate <code>position = initial + rate * 60</code> by hand.'],
    heart:['<b>Value</b> modular design: each phase does one job well.','<b>Respect</b> the teamwork between compiler, assembler and linker.'],
    hand:['<b>Use</b> <code>gcc -E</code>, <code>-S</code>, <code>-c</code> to stop after each stage and inspect the files.','<b>Draw</b> the phase diagram from memory.']},
  slides:[
    {k:'Animation', h:'The compiler is one worker in a team', demo:'lps', p:'Your source file passes through five tools before it runs. This chain is called the <b>language-processing system</b>. Press <b>Step</b> to follow <code>prog.c</code> from file to running program.', an:'A bakery line: one person mixes the dough, one bakes, one packs, one delivers. The baker (compiler) is important, but bread reaches you only because of the whole line.', tk:'Source → pre-processor → compiler → assembler → linker → loader → running program.',
      n:{say:'Step through slowly and write the chain on the board as it appears; leave it there for the whole lecture. Say one sentence per tool, then tell students the next four slides look at each tool closely. If a lab PC is available, show that <code>gcc prog.c</code> quietly runs all of them.', ask:'Does gcc do all of these jobs itself?', ans:'gcc is a “driver”: it calls the pre-processor, the real compiler (cc1), the assembler (as) and the linker (ld) one after another. Run <code>gcc -v prog.c</code> to see each program it starts.', watch:'Students think the loader is part of the compiler. It is part of the operating system; it runs when you start the program.'}},
    {k:'Concept', h:'Pre-processor: tidy the text first', ic:'🧹', p:'The <b>pre-processor</b> runs <b>before</b> the compiler. It works on plain text: it pastes in <b>header files</b> (<code>#include</code>), replaces each <b>macro</b> (<code>#define</code>) with its value, and keeps or drops code with <b>conditional compilation</b> (<code>#ifdef</code>).', code:`#include &lt;stdio.h&gt;     // paste all of stdio.h here
#define RATE 60          // macro: RATE means 60
#ifdef DEBUG             // keep the next line only if DEBUG is defined
  printf("debug\\n");
#endif
pay = hours * RATE;      // becomes   pay = hours * 60;`,
      parts:[['#include &lt;stdio.h&gt;','Paste the whole text of the header file stdio.h here.'],['#define RATE 60','Make a macro: from now on, the word RATE is replaced by 60.'],['#ifdef DEBUG','“If DEBUG is defined”: keep the lines up to #endif, otherwise drop them.'],['#endif','End of the conditional part.'],['//','A comment; the pre-processor removes it too.'],['pay = hours * RATE;','A normal C line; only the macro name inside it is replaced.']],
      what:['The pre-processor reads the file from top to bottom as plain text.','Each line that starts with <code>#</code> is an order for it; it carries the order out and removes the line.','It replaces RATE with 60 everywhere below the #define.','The result is pure C text with no # lines and no comments, ready for the compiler.'],
      eg:{note:'Output for the code above (with <code>gcc -E</code>):', out:`... all of stdio.h ...
pay = hours * 60;

With  gcc -DDEBUG -E  (DEBUG is defined) the debug line stays:
... all of stdio.h ...
  printf("debug\\n");
pay = hours * 60;`},
      res:'Pure C text: headers pasted in, macros replaced, unwanted code dropped.',
      an:'A tailor’s assistant who lays out all the cloth pieces and pins the pattern before the tailor starts sewing. No sewing happens yet; everything is just made ready.', tk:'The pre-processor turns your file into pure C text for the compiler.',
      n:{say:'Stress that the pre-processor does not understand C. It only copies and replaces text. Show <code>gcc -E prog.c -o prog.i</code> and open prog.i: hundreds of lines from stdio.h appear at the top and RATE has become 60.', ask:'Is <code>#define RATE 60</code> the same as declaring <code>int RATE = 60;</code>?', ans:'No. A macro is replaced by text before compiling; it has no type and uses no memory. A variable is real: the compiler gives it a type and a place in memory.', watch:'Students think <code>#include</code> is a link to the library. It only pastes the header text (the function declarations). The actual printf code is added later by the linker.'}},
    {k:'Example', h:'Pre-processor: a tiny C++ example', ic:'🧹', p:'A <b>pre-processor</b> is a program that works <b>before</b> the compiler. It prepares the code: it adds header files, replaces macros with their values, and keeps or removes code when needed.', code:`#include &lt;iostream&gt;
#define AGE 18

int main()
{
    std::cout &lt;&lt; AGE;
    return 0;
}`,
      parts:[['#include &lt;iostream&gt;','Adds (pastes in) the input/output header file, so <code>std::cout</code> is known.'],['#define AGE 18','Makes a macro: every use of <code>AGE</code> is replaced with <code>18</code>.'],['std::cout &lt;&lt; AGE;','After pre-processing the compiler sees <code>std::cout &lt;&lt; 18;</code>']],
      what:'The pre-processor prepares the code first, then sends the prepared text to the compiler. The compiler never sees the word <code>AGE</code>.',
      eg:{out:`18`},
      res:'The pre-processor prepares the program; the compiler converts it into machine code.',
      an:'Before a cricket match the ground staff roll the pitch and paint the lines. They do not play; they make everything ready for the players.', tk:'Pre-processor = text preparation before compiling.',
      n:{say:'Read each line of the table aloud. Then ask: “What does the compiler actually see on line 6?” Answer: <code>std::cout &lt;&lt; 18;</code>. The same idea works in C (next slides use C with gcc).', ask:'If I write <code>int AGE = 20;</code> after the #define, what happens?', ans:'The pre-processor turns it into <code>int 18 = 20;</code>, which is a compile error. Macros replace text blindly.', watch:'Students think <code>#define</code> creates a variable. It creates no variable and uses no memory; it is only text replacement.'}},
    {k:'Concept', h:'Assembler: from words to machine code', ic:'🔤', p:'The compiler usually writes <b>assembly language</b>: machine instructions spelled as short words called <b>mnemonics</b> (MOV, ADD). The <b>assembler</b> turns these words into binary and saves an <b>object file</b> (<code>.o</code> or <code>.obj</code>).', code:`MOV  R1, a       ; assembly: load a into register R1
ADD  R1, b       ; add b
MOV  sum, R1     ; store the result in sum
; assembler →  binary object code; addresses of a, b, sum not final yet`,
      parts:[['MOV','Mnemonic for “move”: copy a value from one place to another.'],['ADD','Mnemonic for “add”.'],['R1','A register: a tiny, very fast storage place inside the CPU.'],['a, b, sum','Names of variables in memory; their final addresses are not known yet.'],[';','Starts a comment in assembly (like // in C).']],
      what:['The assembler reads one line at a time.','It swaps each mnemonic (MOV, ADD) for its binary operation code.','It writes the register number and leaves a “fill in later” space for each address of a, b and sum.','It saves a note (relocation information) about each space, and writes the object file.'],
      res:'An object file: real binary instructions, but with addresses still to be fixed by the linker.',
      an:'Shorthand notes taken in a lecture are turned into a clean typed page. Same content, new form. Page numbers are added later, when the book is put together.', tk:'Assembly words → object code that is not yet ready to run.',
      n:{say:'The object file holds <b>relocatable</b> machine code: the instructions are real binary, but memory addresses are written as if the file started at address 0. They are fixed later. Show <code>gcc -c prog.s -o prog.o</code>, then try to run prog.o: the OS refuses, because it is not an executable.', ask:'Why does the compiler not write binary directly?', ans:'Some compilers do. Writing assembly keeps the compiler simpler and lets one assembler serve many compilers. You can also read the assembly to debug.', watch:'Mistake: “the assembler comes before the compiler”. Order: pre-processor → compiler → assembler.'}},
    {k:'Concept', h:'Linker: join the pieces', ic:'🔗', p:'Big programs are split over many files, and they call <b>library</b> code such as <code>printf</code>. The <b>linker</b> (also called the <b>link editor</b>) joins all object files and the library code into one <b>executable</b> file.', pts:[['🔎','It resolves each <b>external reference</b>: a name used in one file but defined somewhere else, e.g. printf.'],['📌','It gives every piece its final place, so all addresses agree.'],['📦','<b>Static linking</b> copies the library code into the executable.'],['🔌','<b>Dynamic linking</b> leaves it in a shared file (<code>.dll</code> / <code>.so</code>) that is connected when the program starts.']],
      tbl:{cap:'Static vs dynamic linking', h:['Point','Static linking','Dynamic linking'], r:[['Where the library code goes','Copied into the executable','Stays in a shared file (.dll / .so)'],['Size of the executable','Bigger','Smaller'],['Connected when?','At link time','When the program starts (by the loader)'],['Library bug fixed by','Linking the program again','Updating the one shared file']]},
      an:'Building a car from parts made in different factories: engine, seats, wheels. The assembly plant (linker) bolts them together and checks every bolt has a matching hole.', tk:'The linker joins object files and libraries and fills in the missing addresses.',
      n:{say:'Show the famous error: declare a function but never write its body, e.g. <code>void hello(void);</code> and call <code>hello();</code> in main. The compiler is happy (it knows the name and its type), but the <b>linker</b> stops with “undefined reference to hello”: it searched every object file and library and found no code for it.', ask:'Why does dynamic linking exist if static linking is simpler?', ans:'With dynamic linking, many programs share one copy of the library in memory and on disk, and a library bug can be fixed by updating one file.', watch:'Students think the linker translates code. It does not translate anything; it only combines already-translated pieces.'}},
    {k:'Concept', h:'Loader: put it in memory and start it', ic:'🚚', p:'When you run the program, the <b>loader</b> (part of the <b>operating system</b>) copies the executable from disk into memory, fixes any addresses that depend on where it was placed, connects dynamic libraries, and jumps to the first instruction.', an:'A stage manager before a play: brings the props on stage, puts each in its marked place, then raises the curtain. The actors (CPU) take over from there.', tk:'Loader = disk → memory → start running.',
      n:{say:'Typing <code>./prog</code> (Linux) or <code>prog.exe</code> (Windows) asks the operating system to load it. Today most address fixing is done by the linker; the loader handles what is left, for example when the OS places the program at a random address for security.', ask:'Do I ever run the loader myself?', ans:'Not directly. The operating system runs it every time you start any program, even a double-click on an icon.', watch:'The loader is not part of gcc. If a program builds but fails with “cannot find xyz.dll”, that is a load-time problem.'}},
    {k:'Example', h:'See every stage with gcc: the five commands', ic:'🧪', p:'gcc can stop after any stage, so you can open each file and look inside. Here is the whole chain. The next slides explain each command in simple words, one at a time.', code:`gcc -E prog.c -o prog.i   # pre-process only  → pure C text
gcc -S prog.i -o prog.s   # compile           → assembly text
gcc -c prog.s -o prog.o   # assemble          → object file (binary)
gcc prog.o -o prog        # link              → executable
./prog                    # the loader starts it

$ nm prog.o               # list the names inside the object file
0000000000000000 T main   # T = defined here
                 U printf # U = undefined: the linker must find it`, an:'Stopping a cooking video after each step: dough, shaped bread, baked bread, packed bread. You can taste each stage.', tk:'Each gcc flag stops the chain at a different tool.',
      n:{say:'Show the whole map first; do not explain flags yet. Say: “We will take these lines one by one.” Our running program for the next slides is <code>prog.c</code>, which prints the macro NUM (10).', ask:'Do I have to type all four commands every time?', ans:'No. <code>gcc prog.c -o prog</code> does all four stages in one go. We split them only to look inside each file.', watch:'On Windows (MinGW) the executable is <code>prog.exe</code> and you run it by typing <code>prog</code>.'}},
    {k:'Step 1', h:'Pre-processing: <code>gcc -E prog.c -o prog.i</code>', ic:'🧹',
      parts:[['gcc','GNU C Compiler (the driver program that runs every stage)'],['-E','Do pre-processing only, then stop'],['prog.c','The original C source file'],['-o','“Output”: the next word is the output file name'],['prog.i','Output file holding the pre-processed C code']],
      what:['Expands header files: each <code>#include</code> is replaced by the text of that file.','Replaces macros: every <code>NUM</code> becomes <code>10</code>.','Processes conditional code: <code>#ifdef</code> / <code>#ifndef</code> keep or drop lines.'],
      eg:{note:'Our <code>prog.c</code>:', code:`#include &lt;stdio.h&gt;
#define NUM 10

int main() {
    printf("%d\\n", NUM);
    return 0;
}`, out:`... hundreds of lines copied from stdio.h ...
int main() {
    printf("%d\\n", 10);
    return 0;
}`},
      res:'<code>prog.i</code> = pre-processed C code (still C, no # lines left).',
      an:'A tailor’s assistant lays out all the cloth pieces and pins the pattern before the tailor sews. Nothing is sewn yet.', tk:'-E stops after the pre-processor.',
      n:{say:'Point to each row of the table. Then open prog.i on the projector and scroll to the bottom: main is there with 10 in place of NUM. The “Output” box above is what you see at the end of prog.i.', ask:'Why is prog.i so long when prog.c had 7 lines?', ans:'#include &lt;stdio.h&gt; pasted the whole header (all the function declarations such as printf) into the file.', watch:'The .i file is still C text. Students think it is already machine code.'}},
    {k:'Step 2', h:'Compilation: <code>gcc -S prog.i -o prog.s</code>', ic:'⚙️',
      parts:[['gcc','GNU C Compiler'],['-S','Compile into assembly language, then stop'],['prog.i','The pre-processed C file (input)'],['-o','Name of the output file follows'],['prog.s','Assembly language file (output)']],
      what:'The compiler proper (all six phases you will meet today) translates the C code into <b>assembly language</b>: machine instructions written as short words.',
      eg:{note:'C code inside a function:', code:`int a = 5;
int b = 10;
int c = a + b;`, out:`movl  $5, -4(%rbp)      # a = 5
movl  $10, -8(%rbp)     # b = 10
movl  -4(%rbp), %edx    # copy a into register edx
movl  -8(%rbp), %eax    # copy b into register eax
addl  %edx, %eax        # eax = a + b
movl  %eax, -12(%rbp)   # c = the sum`},
      res:'<code>prog.s</code> = assembly code (text you can still read).',
      an:'Turning a recipe written in Urdu into short kitchen commands: “chop”, “fry 2 min”, “add salt”. Same meaning, much simpler words.', tk:'-S stops after the compiler: you get assembly.',
      n:{say:'The output box is typical x86-64 gcc output without optimisation (gcc -O0); exact register names and offsets can differ on your PC. Point out that each simple C line became 1–3 small instructions. For our prog.c, look for the line <code>call printf</code> in prog.s.', ask:'What is <code>%rbp</code>?', ans:'A CPU register that points to the current function’s area of memory (its stack frame). -4(%rbp) means “4 bytes below that point”, where variable a is kept.', watch:'Students think assembly is binary. It is still text; the next step makes binary.'}},
    {k:'Step 3', h:'Assembling: <code>gcc -c prog.s -o prog.o</code>', ic:'🔤',
      parts:[['gcc','GNU C Compiler'],['-c','Assemble (or compile) into an object file, but do not link'],['prog.s','The assembly language file (input)'],['-o','Name of the output file follows'],['prog.o','The object file (output)']],
      what:['The <b>assembler</b> turns each assembly word into binary machine code.','It writes the <b>symbols</b> (names such as main and printf) into the file.','It writes <b>relocation information</b>: notes saying “this address must be fixed later”.'],
      eg:{note:'Try to look inside or run it:', code:`$ file prog.o
$ ./prog.o`, out:`prog.o: ELF 64-bit LSB relocatable, x86-64 ...
bash: ./prog.o: Permission denied   (it is not a program yet)`},
      res:'<code>prog.o</code> = object file (binary machine code, not yet runnable).',
      an:'Shorthand lecture notes typed into a clean page. The content is final, but page numbers are added later when the book is bound.', tk:'-c stops before linking: you get an object file.',
      n:{say:'Open prog.o in Notepad: it is unreadable binary. The <code>file</code> command (Linux) says “relocatable”: addresses are written as if the file starts at 0. On Windows MinGW the object file format is COFF instead of ELF.', ask:'Why can’t I run prog.o?', ans:'It has no final addresses and printf’s code is missing. The linker must finish it.', watch:'<code>-c</code> means “compile only, do not link”, not “compile C”.'}},
    {k:'Step 4', h:'Linking: <code>gcc prog.o -o prog</code>', ic:'🔗',
      parts:[['gcc','GNU C Compiler (here it calls the linker, ld)'],['prog.o','The object file (input)'],['-o','Name of the output file follows'],['prog','The final executable file (output)']],
      what:['Combines object files when the program has several files.','Resolves references to outside functions, e.g. finds the code for <code>printf</code>.','Connects the required libraries (the C library).','Produces the executable with final addresses.'],
      eg:{note:'If a function is declared and called but never written:', code:`void hello(void);
int main() { hello(); return 0; }`, out:`undefined reference to `+'`'+`hello'
collect2: error: ld returned 1 exit status`},
      res:'<code>prog</code> = executable file (<code>prog.exe</code> on Windows).',
      an:'A car plant bolts together an engine, seats and wheels made in different factories, and checks every bolt has a matching hole.', tk:'No flag = go all the way and link.',
      n:{say:'Show the error in the example box: the compiler accepted the code (hello was declared), but the linker could not find hello’s body anywhere. That message always means a linker problem.', ask:'Where does printf’s code come from?', ans:'From the C standard library (libc on Linux, msvcrt/ucrt on Windows). The linker connects it, usually dynamically.', watch:'The linker does not translate anything; it only joins already-translated pieces.'}},
    {k:'Step 5', h:'Loading and running: <code>./prog</code>', ic:'🚚',
      parts:[['./','“In the current folder” (Linux looks only in PATH folders otherwise)'],['prog','The executable file name']],
      what:'The <b>operating system</b> (its loader) copies the executable from disk into memory, connects the shared libraries, and jumps to <code>main</code>. Then the CPU runs the instructions.',
      eg:{note:'Running our prog.c:', out:`10`},
      res:'The program runs and prints its output.',
      an:'A stage manager puts every prop in place, then raises the curtain. The actors (the CPU) take over.', tk:'Loader = disk → memory → start.',
      n:{say:'On Windows type <code>prog</code> or <code>prog.exe</code>; the <code>./</code> is only needed on Linux/macOS.', ask:'Is the loader part of gcc?', ans:'No. It is part of the operating system and runs every time you start any program.', watch:'An error like “cannot find xyz.dll” appears at load time, after linking succeeded.'}},
    {k:'Step 6', h:'Look inside: <code>nm prog.o</code>', ic:'🔎', code:`$ nm prog.o
0000000000000000 T main
                 U printf`,
      parts:[['nm','A tool that lists the <b>symbols</b> (names of functions and variables) in an object file'],['prog.o','The object file being inspected'],['0000000000000000','Address (offset) of the symbol inside the file'],['T','Defined in the text (code) section of this file'],['main','The main function'],['U','Undefined: used here but defined somewhere else'],['printf','Called here; its code must come from a library']],
      what:'<code>T main</code> means main’s code is inside this object file. <code>U printf</code> means printf is used but not defined here; the linker must find it in another object file or library.',
      res:'nm shows the symbol table of the object file: what it defines and what it still needs.',
      an:'A shopping list: items marked ✔ are already in your bag (T); items marked ✗ you still have to collect from the shop (U). The linker is the trip to the shop.', tk:'T = defined here, U = needed from elsewhere.',
      n:{say:'Run <code>nm prog</code> after linking and compare: main is still T, and printf is now shown as coming from the C library (e.g. <code>U printf@GLIBC_2.2.5</code>, connected at load time).', ask:'Why does main have address 0?', ans:'In an object file addresses start at 0; the linker gives the final address.', watch:'On Windows MinGW the names may appear as <code>_main</code> or <code>__mingw_printf</code>. That is normal.'}},
    {k:'Summary', h:'The complete gcc flow (exam table)', ic:'📋', code:`prog.c  ──gcc -E──▶  prog.i  ──gcc -S──▶  prog.s  ──gcc -c──▶  prog.o  ──gcc prog.o -o prog──▶  prog  ──./prog──▶  runs`,
      tbl:{cap:'Important points for your exam', h:['Command','Purpose','Output'], r:[['<code>gcc -E</code>','Pre-processing','<code>.i</code> (pre-processed C)'],['<code>gcc -S</code>','Compilation','<code>.s</code> (assembly)'],['<code>gcc -c</code>','Assembling','<code>.o</code> (object file)'],['<code>gcc prog.o -o prog</code>','Linking','Executable'],['<code>./prog</code>','Loading and execution','Program output'],['<code>nm prog.o</code>','Display symbols','Symbol table information']]},
      an:'A relay race: each runner (tool) carries the baton (the file) one leg and hands it on.', tk:'.c → .i → .s → .o → executable → running program.',
      n:{say:'Cover the table and ask students to fill each row from memory. This table is a likely exam question.', ask:'Which file is the first one that is not human-readable?', ans:'prog.o, the object file. .i and .s are text.', watch:'Students mix up -S (assembly) and -c (object). Memory hook: big S = aSSembly text; c = compile-only, no link.'}},
    {k:'Concept', h:'Inside the compiler: two big halves', demo:'analysisSynthesis', p:'Every compiler has two parts. <b>Analysis</b> reads the source, breaks it into pieces, checks it and records what it means. <b>Synthesis</b> uses that record to build the target program.',
      tbl:{cap:'Analysis vs synthesis', h:['Point','Analysis','Synthesis'], r:[['Job','Read, split, check and understand the source','Build the target program'],['Phases','Lexical, syntax, semantic analysis (+ intermediate code)','Optimisation, code generation'],['Input → output','Source text → intermediate code + symbol table','Intermediate code → target code'],['Finds errors?','Yes, almost all compile-time errors','Almost never; it trusts the analysis']]},
      an:'Translating an Urdu letter into English: first you read and understand it fully (analysis), then you write the English version (synthesis).', tk:'Analysis understands the program; synthesis builds the target.',
      n:{say:'Step the animation. The middle box is the bridge: an <b>intermediate representation</b> (a simple, machine-independent form of the program) plus the <b>symbol table</b> (a list of every name with its facts). Both are explained in the next slides.', ask:'Where are errors in my code reported, analysis or synthesis?', ans:'Almost always in analysis. Synthesis assumes the program is already correct.', watch:'Do not rush; the words analysis and synthesis come back in front end / back end at the end of this lecture.'}},
    {k:'Animation', h:'The six phases of a compiler', demo:'pipeline', p:'Inside, the compiler works as six <b>phases</b>; each turns one form of the program into the next: <b>lexical analysis</b> → <b>syntax analysis</b> → <b>semantic analysis</b> → intermediate code generation → optimisation → <b>code generation</b>.', an:'A car factory: one station fits the wheels, the next paints, the next tests. The car changes a little at each station.', tk:'Six phases, each with one job, plus the symbol table and the error handler.',
      n:{say:'Write the six phases as a vertical list on the board. Step the animation once quickly for the big picture with <code>position = initial + rate * 60</code>. The next three slides zoom in, two phases at a time. Phases 1–3 are analysis; 5–6 are synthesis; phase 4 builds the bridge between them.', ask:'Do all compilers have exactly six phases?', ans:'No. Six is the textbook model. Real compilers may join phases, add extra optimisation steps or skip some, but every compiler does these jobs somewhere.', watch:'Students memorise names without outputs. Insist on pairs: lexer → tokens, parser → tree, semantic → checked tree, IR gen → three-address code, optimiser → better code, code gen → assembly.'}},
    {k:'Example', h:'Phases 1–2: tokens, then a tree', ic:'🌳', p:'<b>Lexical analysis</b> groups characters into <b>tokens</b> (words). <b>Syntax analysis</b> (parsing) arranges tokens into a <b>syntax tree</b> that shows the structure. Here <code>*</code> sits lower than <code>+</code>, so it is done first.', code:`Input:   position = initial + rate * 60

Tokens:  ⟨id,1⟩ ⟨=⟩ ⟨id,2⟩ ⟨+⟩ ⟨id,3⟩ ⟨*⟩ ⟨60⟩
         (1, 2, 3 = entries in the symbol table)

Tree:          =
             /   \\
        ⟨id,1⟩     +
                 /   \\
            ⟨id,2⟩     *
                     /   \\
                ⟨id,3⟩    60`,
      parts:[['⟨id,1⟩','Token “identifier”; its details are in row 1 of the symbol table (position).'],['⟨id,2⟩, ⟨id,3⟩','Identifiers initial (row 2) and rate (row 3).'],['⟨=⟩','The assignment operator token.'],['⟨+⟩, ⟨*⟩','The add and multiply operator tokens.'],['⟨60⟩','A number token with value 60. Numbers do not go into the symbol table here.'],['= at the top','The root of the tree: the last thing done (store the answer).'],['* at the bottom','Lower nodes are done first, so rate * 60 is worked out before the +.']],
      what:['The lexer reads characters and skips the spaces.','It groups them into 7 tokens and puts the 3 names into the symbol table.','The parser reads the tokens and checks the grammar.','It builds the tree: operators become inner nodes, names and numbers become leaves.'],
      eg:{note:'Try another statement: <code>y = x * 2 + z</code>', out:`Tokens:  ⟨id,1⟩ ⟨=⟩ ⟨id,2⟩ ⟨*⟩ ⟨2⟩ ⟨+⟩ ⟨id,3⟩
         (1 = y, 2 = x, 3 = z)

Tree:          =
             /   \\
        ⟨id,1⟩     +
                 /   \\
                *    ⟨id,3⟩
              /   \\
         ⟨id,2⟩    2`},
      res:'Phase 1 gives a list of tokens; phase 2 gives a syntax tree that shows the order of work.',
      an:'Reading a sentence: first you see the words (tokens), then you see grammar, who is the subject and who is the object (tree).', tk:'Lexer: characters → tokens. Parser: tokens → tree.',
      n:{say:'Build this on the board. Explain ⟨id,1⟩: “an identifier, and its details are in row 1 of the symbol table”. Then build the tree bottom-up: rate * 60 first, then initial + that, then the assignment. We assume position, initial and rate were declared as float.', ask:'Why does the parser need a tree? Why not keep a list?', ans:'A list cannot show that * happens before +. The tree shape records the order of operations.', watch:'Students put + at the bottom because it comes first from left to right. Remind them of BODMAS: * binds tighter, so it goes lower.'}},
    {k:'Example', h:'Phases 3–4: check meaning, then simple code', ic:'🧐', p:'<b>Semantic analysis</b> checks meaning, mostly <b>types</b>. rate is float but 60 is int, so it adds a <b>type conversion</b> <code>inttofloat(60)</code>. Then <b>intermediate code</b> generation writes <b>three-address code</b>: tiny steps with at most one operator each.', code:`After semantic analysis (tree):
   = ( id1 , + ( id2 , * ( id3 , inttofloat(60) ) ) )

Three-address code:
   t1 = inttofloat(60)
   t2 = id3 * t1
   t3 = id2 + t2
   id1 = t3`,
      parts:[['inttofloat(60)','A conversion added by the semantic analyser: turn the int 60 into a float.'],['id1, id2, id3','position, initial and rate (rows of the symbol table).'],['t1, t2, t3','Temporaries: extra names the compiler invents to hold partial answers.'],['t1 = inttofloat(60)','Step 1: make 60 a float.'],['t2 = id3 * t1','Step 2: rate × 60.0.'],['t3 = id2 + t2','Step 3: initial + that.'],['id1 = t3','Step 4: store the answer in position.']],
      what:['The semantic analyser looks up each name’s type in the symbol table: all three are float.','It sees float * int, so it wraps 60 in inttofloat.','The intermediate code generator walks the tree from the bottom up.','For each operator it writes one line with a new temporary.'],
      eg:{note:'For <code>y = x * 2 + z</code> (y, x, z declared float):', out:`After semantic analysis:
   = ( id1 , + ( * ( id2 , inttofloat(2) ) , id3 ) )

Three-address code:
   t1 = inttofloat(2)
   t2 = id2 * t1
   t3 = t2 + id3
   id1 = t3`},
      res:'Phase 3 gives a checked tree with type conversions; phase 4 gives three-address code.',
      an:'A teacher checks that an answer has the right units (kg vs g) before marking it. Then the working is rewritten as small, clear steps.', tk:'Semantic analysis checks types; intermediate code breaks the work into tiny steps.',
      n:{say:'t1, t2, t3 are <b>temporaries</b>: extra names the compiler invents to hold partial results. Read each line aloud: “t2 gets id3 times t1”. Each line has at most three addresses (names), hence the name.', ask:'Why not convert 60 to 60.0 straight away?', ans:'The semantic analyser only marks what must happen. The optimiser, next, notices the value is a constant and does the conversion at compile time.', watch:'Students think semantic analysis checks spelling or brackets. Brackets are syntax. Semantics is about meaning: types, declarations, “does this make sense?”.'}},
    {k:'Example', h:'Phases 5–6: improve, then write machine code', ic:'🚀', p:'The <b>optimiser</b> removes waste: 60 becomes 60.0 at compile time and the copy into t3 disappears. The <b>code generator</b> then chooses <b>registers</b> and machine instructions.', code:`Optimised code:
   t1 = id3 * 60.0
   id1 = id2 + t1

Target code (F = floating point):
   LDF  R2, id3          ; R2 = rate
   MULF R2, R2, #60.0    ; R2 = rate * 60.0
   LDF  R1, id2          ; R1 = initial
   ADDF R1, R1, R2       ; R1 = initial + rate*60.0
   STF  id1, R1          ; position = R1`,
      parts:[['60.0','The conversion was done at compile time, so no inttofloat runs later.'],['LDF','“Load float”: copy a float from memory into a register.'],['MULF / ADDF','Multiply / add two floats.'],['STF','“Store float”: copy a register into memory.'],['R1, R2','Registers chosen by the code generator.'],['#60.0','The # means a constant value written inside the instruction.']],
      what:['The optimiser sees inttofloat(60) has a constant input, so it writes 60.0 directly.','It sees t3 is only copied into id1, so it puts the answer straight into id1.','The code generator picks registers R1 and R2.','It writes one or two machine instructions for each line of the optimised code.'],
      eg:{note:'For <code>y = x * 2 + z</code>, continuing from the previous slide:', out:`Optimised code:
   t1 = id2 * 2.0
   id1 = t1 + id3

Target code:
   LDF  R2, id2          ; R2 = x
   MULF R2, R2, #2.0     ; R2 = x * 2.0
   LDF  R1, id3          ; R1 = z
   ADDF R1, R2, R1       ; R1 = x*2.0 + z
   STF  id1, R1          ; y = R1`},
      res:'Phase 5 gives shorter code with the same meaning; phase 6 gives target (assembly) code.',
      an:'Editing a draft essay: remove repeated sentences (optimise), then print it neatly on the final paper (code generation).', tk:'Four lines became two; then two lines became five real instructions.',
      n:{say:'Compare four lines of three-address code with two optimised lines. The result is the same value, with less work. Read the target code: LDF = load float, MULF = multiply float, STF = store float, # = a constant value.', ask:'Can the optimiser change what my program prints?', ans:'Never. An optimisation that changes the meaning is a bug. It may only make the program faster or smaller.', watch:'The textbook calls this machine-independent optimisation. Real compilers also optimise again after code generation (machine-dependent), e.g. choosing faster instructions for one CPU.'}},
    {k:'Summary', h:'The six phases (exam table)', ic:'📋', code:`characters ─▶ tokens ─▶ syntax tree ─▶ checked tree ─▶ three-address code ─▶ better code ─▶ target code`,
      tbl:{cap:'Important points for your exam', h:['Phase','Input → output','Output for y = x * 2 + z'], r:[['1. Lexical analysis','characters → tokens','⟨id,1⟩ ⟨=⟩ ⟨id,2⟩ ⟨*⟩ ⟨2⟩ ⟨+⟩ ⟨id,3⟩'],['2. Syntax analysis','tokens → syntax tree','= (id1, + (* (id2, 2), id3))'],['3. Semantic analysis','tree → checked tree','= (id1, + (* (id2, inttofloat(2)), id3))'],['4. Intermediate code','tree → three-address code','t1 = inttofloat(2); t2 = id2 * t1; t3 = t2 + id3; id1 = t3'],['5. Optimisation','code → shorter code','t1 = id2 * 2.0; id1 = t1 + id3'],['6. Code generation','code → target code','LDF, MULF, LDF, ADDF, STF']]},
      res:'Six phases, each with one input and one output; phases 1–3 are analysis, 5–6 are synthesis.',
      an:'A relay race of six runners: each one takes the baton in one form and hands it on in the next form.', tk:'Learn each phase with its output: tokens, tree, checked tree, TAC, better TAC, target code.',
      n:{say:'Cover the third column and let students fill it in for y = x * 2 + z. Then give the homework statement and ask them to do the same at home. All four answers on this slide assume y, x and z are float.', ask:'If y, x and z were int, which rows would change?', ans:'Row 3 adds no inttofloat; row 4 becomes t1 = id2 * 2; t2 = t1 + id3; id1 = t2; row 5 becomes t1 = id2 * 2; id1 = t1 + id3; row 6 uses integer instructions instead of the F ones.', watch:'Students write the output of phase 4 for phase 5. Ask: “What did the optimiser remove?” (the conversion and the extra copy).'}},
    {k:'Concept', h:'The symbol table: one notebook for all phases', demo:'symflow', p:'The <b>symbol table</b> is a <b>data structure</b> with one record per name (variable, function). It stores the name, its type, its scope, its size and its memory address. Every phase reads it or adds to it.', an:'The class register: the teacher writes each student once, and every subject teacher looks up the same register.', tk:'One record per name, shared by all phases.',
      n:{say:'Step the animation and show who writes what: the lexer adds the name, the semantic analyser adds the type, the code generator adds the address. Draw a three-column table on the board: name | type | address, with position, initial, rate.', ask:'Why one shared table and not one per phase?', ans:'Each phase learns something new about a name. If every phase kept its own copy, the copies would disagree and waste memory.', watch:'The table is built while compiling and usually thrown away after. It is not in the running program (except as debug information).'}},
    {k:'Example', h:'Reading a symbol table', ic:'📒', code:`int main() {
    float position, initial, rate;
    position = initial + rate * 60;
}`,
      parts:[['No.','Row number. Tokens point here, e.g. ⟨id,3⟩ means row 3.'],['Name','The lexeme of the identifier, e.g. rate. Added by the lexer.'],['Type','float, int, …; added when the declaration is analysed and used by the semantic analyser.'],['Scope','Where the name can be used: here local, inside main.'],['Size','Bytes needed in memory: a float usually takes 4.'],['Offset','Place in main’s memory area; added by the back end.']],
      what:['The lexer meets <code>position</code> for the first time and adds row 1 (name only).','It does the same for initial (row 2) and rate (row 3).','The declaration <code>float</code> fills in type, scope and size for all three.','When line 3 uses these names, the lexer finds the existing rows; no new rows are added.','The code generator fills in each offset.'],
      eg:{note:'The table after compiling (sizes and offsets are typical; they depend on the machine):', out:`No.  Name      Type   Scope   Size  Offset
1    position  float  local   4     0
2    initial   float  local   4     4
3    rate      float  local   4     8`},
      res:'One row per name, filled in step by step by different phases.',
      an:'An admission form passed from desk to desk: the first desk writes your name, the next adds your class, the last adds your roll number.', tk:'Lexer adds the name; semantic analysis adds the type; the back end adds the address.',
      n:{say:'Draw the empty table first, then fill it column by column while saying which phase writes it. Note that 60 has no row: it is a constant, carried inside its token. main also gets a row in a real compiler (a function name); we leave it out to keep the table small.', ask:'rate appears on two lines. Why only one row?', ans:'A name gets one row per declaration. Every later use looks up the same row.', watch:'Students add rows for keywords like float or int. Keywords are not stored as symbols.'}},
    {k:'Concept', h:'The error handler: every phase can complain', demo:'errorsPhases', p:'Each phase finds its own kind of mistake and passes it to the <b>error handler</b>, which reports it with a line number and, where possible, lets compiling continue so more errors can be found in one run.', an:'Quality checks in a factory: one inspector checks the paint, another the brakes, another the lights. Each reports to the same office.', tk:'Lexical, syntax and semantic errors are caught by different phases; some errors only appear when the program runs.',
      n:{say:'Step through the table. For each row ask “which phase?” before revealing. Emphasise the last row: array out of range is a run-time error; the compiler cannot know the index in general.', ask:'Why keep compiling after the first error?', ans:'So the programmer sees many errors at once instead of fixing one, compiling, and finding the next. This is called error recovery.', watch:'<code>int 9x;</code> can be reported by the lexer or the parser, depending on the compiler. Accept both answers.'}},
    {k:'Example', h:'Which phase finds which error?', ic:'🚨', code:`int main() {
    y = 5;
    return 0;
}`,
      parts:[['prog.c:2:5','File, line 2, column 5: where y is used.'],['error:','A real error; compiling fails.'],['‘y’ undeclared','y was never declared, so the symbol table has no type for it.'],['(first use in this function)','gcc reports each undeclared name only once per function.']],
      what:['The lexer is happy: y, =, 5 and ; are all valid tokens.','The parser is happy: <code>y = 5;</code> is a correct statement shape.','The semantic analyser looks y up in the symbol table, finds no declaration, and reports it.','So this is a semantic error.'],
      eg:{note:'gcc’s report for the program above (wording can differ slightly by version):', out:`prog.c: In function ‘main’:
prog.c:2:5: error: ‘y’ undeclared (first use in this function)`},
      tbl:{cap:'Important points for your exam', h:['Code','What is wrong','Found by'], r:[['<code>int 9x;</code>','A name cannot start with a digit','Lexical (or syntax) analysis'],['<code>x = (a + b;</code>','Missing <code>)</code>','Syntax analysis'],['<code>y = 5;</code> (y not declared)','Name used without a declaration','Semantic analysis'],['<code>int a[5]; a[i] = 1;</code> with i = 10 at run time','Index out of range','Not found by the compiler: a run-time error'],['<code>hello();</code> with no body for hello','No code for the function','Linker (not a compiler phase)']]},
      res:'Each kind of error belongs to one phase (or tool); knowing which tells you how to fix it.',
      an:'Different inspectors in a factory: the paint inspector cannot notice faulty brakes. Each checks only his own part.', tk:'Lexical = bad word; syntax = bad shape; semantic = bad meaning; run-time = only seen when running.',
      n:{say:'Go row by row and ask “which phase?” before revealing. The last row links back to the gcc slides: “undefined reference” is always the linker.', ask:'Can the compiler ever catch an out-of-range index?', ans:'Sometimes, when the index is a constant, e.g. a[10] with int a[5]: gcc may give a warning. When the index is only known while running, it cannot.', watch:'Students call every error a “syntax error”. Push them to name the right phase.'}},
    {k:'Concept', h:'Front end and back end', demo:'frontback', p:'The <b>front end</b> (analysis + intermediate code) depends on the <b>source language</b>. The <b>back end</b> (optimisation + code generation) depends on the target machine. They meet at the intermediate representation.',
      tbl:{cap:'Important points for your exam', h:['Point','Front end','Back end'], r:[['Also called','Analysis part','Synthesis part'],['Phases','Lexical, syntax, semantic analysis, intermediate code','Optimisation, code generation'],['Depends on','The source language','The target machine'],['To add a new…','Language: write a new front end','CPU: write a new back end']]},
      res:'With m languages and n machines we need m front ends + n back ends, not m × n compilers.',
      an:'A Pakistani news agency writes each story once in a standard format; separate teams turn it into Urdu, English and Punjabi broadcasts. Writing and broadcasting are separate jobs.', tk:'Front end = source-dependent; back end = machine-dependent.',
      n:{say:'Step to frame 2: 3 languages × 3 machines = 9 full compilers. Step on: 3 front ends + 3 back ends = 6 parts. Real example: GCC and LLVM have front ends for C, C++, Fortran, Rust and Swift and back ends for x86-64, ARM, RISC-V and WebAssembly, all around one IR.', ask:'To support a new phone chip, which part do we write?', ans:'Only a new back end. All existing front ends work with it straight away.', watch:'Students say the front end is the “user interface” of the compiler. Here front end means the analysis half, nothing to do with screens.'}},
    {k:'Concept', h:'Phases are ideas; passes are how they run', ic:'🔁', p:'A <b>pass</b> reads the whole program (or its intermediate form) once, from start to end, and writes an output. Several phases are often done together in one pass.', pts:[['1️⃣','Front-end pass: lexing, parsing, semantic checks and intermediate code, together.'],['2️⃣','Optional optimisation pass(es) over the intermediate code.'],['3️⃣','Back-end pass: code generation for the target.']],
      tbl:{cap:'Phase vs pass', h:['Word','Meaning','Example'], r:[['Phase','One logical job of the compiler','Lexical analysis'],['Pass','One full reading of the program or its IR','The front-end pass does phases 1–4 together']]},
      an:'Marking exam papers: you can read each paper once and check spelling, grammar and facts together (one pass), or read the pile three times, once per check (three passes).', tk:'Phase = a logical job; pass = one full read of the program.',
      n:{say:'In a one-pass front end the parser asks the lexer for the next token only when it needs one, and generates intermediate code as soon as a statement is recognised. Nothing is written to disk between these phases.', ask:'Are fewer passes always better?', ans:'Fewer passes compile faster and use less memory, but some jobs need to see the whole program first, e.g. calling a function that is defined later, or strong optimisation. Those need extra passes.', watch:'Students use phase and pass as the same word. A phase is a job; a pass is a reading. One pass can do many phases.'}},
    {k:'Concept', h:'Tools that build compilers for us', ic:'🧰', p:'Nobody writes every part of a compiler by hand. Many parts are generated from short descriptions.', pts:[['🔤','<b>Scanner generators</b> (Lex, Flex): build a lexer from regular expressions.'],['🌳','<b>Parser generators</b> (Yacc, Bison, ANTLR): build a parser from a grammar.'],['🏷️','Syntax-directed translation engines: attach code-building actions to grammar rules.'],['🖥️','Code-generator generators and data-flow engines: build the back end from machine descriptions.'],['🧱','Toolkits: <b>LLVM</b> and <b>GCC</b> give ready-made optimisers and back ends.']],
      tbl:{cap:'What each tool takes and builds', h:['Tool','You give it','It builds'], r:[['Lex / Flex','Regular expressions for tokens','A lexer (C code)'],['Yacc / Bison / ANTLR','A grammar','A parser'],['LLVM / GCC','Intermediate code','Optimised machine code for many CPUs']]},
      an:'A cake mixer and an oven do not bake the cake for you, but they save hours compared with mixing by hand and baking on a fire.', tk:'Much of a compiler can be generated from specifications.',
      n:{say:'Tell students they will meet Flex in Week 4 and parser ideas from Week 5. Mention that languages like Rust, Swift and Julia did not write their own back end: they used LLVM.', ask:'If tools exist, why learn the theory?', ans:'The tools take regular expressions and grammars as input. To write those correctly, and to understand their error messages, you need the theory.', watch:'Do not go deep into each tool now; this slide is a map of what is coming.'}}
  ],
  lab:{t:'Lab: stop gcc at every stage', steps:['Write <code>prog.c</code> with one <code>#include &lt;stdio.h&gt;</code>, one <code>#define RATE 60</code> and the line <code>printf("%d\\n", hours * RATE);</code>.','Run the four gcc commands from the slide: <code>-E</code>, <code>-S</code>, <code>-c</code>, then link.','Open <code>prog.i</code>: find your line with RATE replaced by 60, and the pasted header text above it.','Open <code>prog.s</code>: find the line <code>call printf</code> (it may read <code>call printf@PLT</code>).','Run <code>nm prog.o</code>: <code>printf</code> is marked <b>U</b> (undefined) until linking. Then run <code>nm prog</code> (or <code>nm prog.exe</code>) and compare.'], out:'Screenshots of prog.i, prog.s and the nm list, each with a one-line note saying which tool made the file.',
    n:{say:'Students work in pairs. Give them the program on the board: <code>#include &lt;stdio.h&gt;</code>, <code>#define RATE 60</code>, <code>int main(void){ int hours = 2; printf("%d\\n", hours * RATE); return 0; }</code>. Expected output when run: 120.', ask:'prog.i is thousands of lines long. Did I do something wrong?', ans:'No. That is the whole of stdio.h pasted in by the pre-processor. Scroll to the very bottom to find your own code.', watch:'On Windows with MinGW, names may show a leading underscore (<code>_main</code>, <code>_printf</code>) or <code>__mingw_printf</code>. That is normal. If gcc is missing, use an online tool such as godbolt.org to view the assembly.'}},
  disc:['Why is the symbol table shared by all phases instead of each phase keeping its own?','What would break if the linker did not exist?','Why do front end and back end meet at an intermediate representation and not at assembly?'],
  mistakes:['Thinking the linker translates source code. It only joins already-translated pieces.','Mixing up the order: the assembler comes <b>after</b> the compiler.','Believing optimisation may change the program’s meaning. It must not.','Saying the parser produces tokens. The lexer does; the parser builds the tree.','Using “phase” and “pass” as the same word.'],
  rev:['Pre-processor → compiler → assembler → linker → loader.','Phases: lexical, syntax, semantic, intermediate code, optimisation, code generation.','Symbol table and error handler are used by every phase.','Analysis = front end (source-dependent); synthesis = back end (target-dependent).','A pass reads its input once; several phases can share a pass.'],
  hw:'Hand-translate <code>a = b + c * 2</code> through all six phases, writing the output of each, like the animation.',
  check:[
    {q:'Your program compiles, but building stops with “undefined reference to <code>hello</code>”. Which tool reported this?', o:['Pre-processor','Lexical analyser','Linker','Loader'], a:2, e:'The compiler only needs the declaration. The linker searched all object files and libraries, found no code for hello, and gave up.'},
    {q:'In <code>position = initial + rate * 60</code>, which phase adds <code>inttofloat(60)</code>?', o:['Lexical analysis','Syntax analysis','Semantic analysis','Code generation'], a:2, e:'Type checking is semantic: rate is float, 60 is int, so a conversion is needed.'},
    {q:'A company wants its compiler to support a new CPU. Which part must it write?', o:['A new front end','A new back end','A new pre-processor','A new lexer'], a:1, e:'The back end depends on the target machine; the front ends for each language can be reused unchanged.'}],
  quiz:[
    {q:'Which tool expands <code>#define</code> macros?', o:['Assembler','Pre-processor','Linker','Loader'], a:1, e:'Macro expansion happens before compilation.'},
    {q:'Which phase groups characters into tokens?', o:['Syntax analysis','Lexical analysis','Code generation','Semantic analysis'], a:1, e:'The scanner forms tokens.'},
    {q:'Inserting <code>inttofloat(60)</code> happens in…', o:['Lexical analysis','Semantic analysis','Linking','Loading'], a:1, e:'Type checking and coercion are semantic.'},
    {q:'Which part depends mainly on the target machine?', o:['Front end','Back end','Lexer','Parser'], a:1, e:'Back end = optimisation + code generation for the machine.'},
    {q:'External references such as <code>printf</code> are resolved by the…', o:['Linker','Scanner','Parser','Pre-processor'], a:0, e:'The link editor connects object files and libraries.'},
    {q:'What does <code>gcc -S prog.c</code> produce?', o:['An object file','An assembly file (prog.s)','An executable','Pre-processed C'], a:1, e:'-S stops after compiling, before the assembler runs.'},
    {q:'A <b>pass</b> is…', o:['Another name for a phase','One complete reading of the program or its intermediate form','A type of error','A linker option'], a:1, e:'Several phases can be done during one pass.'}],
  terms:[['Pre-processor','Tool that expands macros, includes files and handles conditional compilation before compiling.'],['Assembler','Translates assembly language into relocatable machine code.'],['Linker','Combines object files and libraries into an executable; resolves external references.'],['Loader','Places an executable in memory, fixes addresses and starts it.'],['Phase','A logical step of a compiler that transforms one representation into another.'],['Pass','One reading of the program (or its representation) by the compiler.'],['Front end','Analysis part: lexical, syntax, semantic analysis and IR generation.'],['Back end','Synthesis part: optimisation and code generation for a target.'],['Symbol table','Data structure storing information about identifiers.'],['Intermediate representation','A machine-independent form of the program between front and back end.'],['Object file','Relocatable machine code produced by the assembler; not yet runnable.'],['External reference','A name used in one file but defined in another file or a library.']]
},
/* ================= WEEK 2 ================= */
{ id:3, week:2, unit:'Lexical analysis', ic:'🔤', lo:[2], book:'Louden Ch. 2.1 · Dragon Ch. 3.1–3.2',
  title:'The Role of the Lexical Analyzer',
  sub:'Tokens, patterns and lexemes; attributes of tokens; recognition of tokens; input buffering with sentinels.',
  introH:'Who reads your code first?',
  intro:'To the computer, your program is just a long row of characters: <code>i</code>, <code>f</code>, space, <code>(</code>… Before the compiler can understand <code>if (x &gt;= 10)</code>, someone must notice that <code>if</code> is one word, <code>&gt;=</code> is one operator and <code>10</code> is one number. That someone is the <b>lexical analyzer</b>.',
  introAn:'When you read “Pakistanwonthematch” you first split it into words: Pakistan · won · the · match. Only then can you understand the sentence. The lexer does this splitting for the compiler.',
  introN:{say:'Write <code>if(x&gt;=10)y=1;</code> on the board with no spaces. Ask students to circle the “words”. Most get it right quickly. Then say: today we teach a program to do exactly this, quickly and without mistakes, for millions of characters.', ask:'Why is this a whole lecture? It looks easy.', ans:'It is easy for one line. Doing it fast for huge files, deciding between <code>&lt;</code> and <code>&lt;=</code>, and handling comments, strings and errors correctly needs clear rules. Those rules are today’s topic.', watch:'Students think the lexer understands the program. It does not; it only finds the words. Meaning comes later.'},
  obj:['Explain the role of the lexical analyzer and its interaction with the parser.','Distinguish token, pattern and lexeme with examples.','Write the token stream (with attributes) for a statement.','Explain why lexing is separated from parsing.','Explain the two-buffer input scheme and sentinels.'],
  bloom:{head:['<b>Define</b> token, pattern, lexeme and attribute.','<b>Apply</b> them to produce a token stream for given code.','<b>Explain</b> how sentinels reduce work per character.'],
    heart:['<b>Value</b> separation of concerns between lexer and parser.','<b>Be careful</b> and precise when writing token streams.'],
    hand:['<b>Tokenize</b> code by hand and with the Lab-tools tokenizer.','<b>Trace</b> lexemeBegin and forward over a buffer.']},
  slides:[
    {k:'Animation', h:'The lexer: the compiler’s first reader', demo:'lexrole', p:'The <b>lexical analyzer</b> (also called the <b>scanner</b> or lexer) is the first phase. It reads characters, groups them into words called <b>tokens</b>, and hands one token to the <b>parser</b> each time the parser asks with <b>getNextToken()</b>.', an:'A cricket scorer listens to the commentary and writes only the important events: “4 runs”, “wicket”, “wide”. The captain (parser) reads the scorecard, not the full commentary.', tk:'The lexer turns characters into tokens, one at a time, when the parser asks.',
      n:{say:'Step the animation. Point out the direction of control: the parser is the boss; it calls the lexer whenever it needs the next token. The lexer does not produce the whole list in advance (it could, but usually does not).', ask:'Why does the parser call the lexer, and not the other way round?', ans:'The parser knows when it needs the next word. Asking on demand means no big list of tokens has to be stored in memory.', watch:'Students think the lexer runs fully first, then the parser. In most compilers they run together, token by token.'}},
    {k:'Example', h:'Parser and lexer talking: <code>getNextToken()</code>', ic:'📞', code:`token = getNextToken();`,
      parts:[['getNextToken()','A function of the lexer. Each call reads just enough characters to make one token.'],['token','What comes back: a token name and, if needed, an attribute.'],['Who calls it?','The parser, every time it needs the next word.']],
      what:['The parser calls getNextToken().','The lexer skips spaces, reads the characters of one lexeme and returns its token.','The parser uses that token, then calls again.','When the input is finished, the lexer returns a special end-of-input token.'],
      eg:{note:'Input: <code>if (x &gt;= 10)</code>', out:`call 1  →  ⟨if⟩
call 2  →  ⟨(⟩
call 3  →  ⟨id,1⟩        (x is put in row 1 of the symbol table)
call 4  →  ⟨relop,GE⟩
call 5  →  ⟨number,10⟩
call 6  →  ⟨)⟩`},
      res:'Six calls, six tokens: the lexer gives one token per call, only when asked.',
      an:'A student asks the librarian for one book at a time. The librarian does not bring the whole shelf.', tk:'One call to getNextToken() = one token.',
      n:{say:'Act it out: one student is the parser and says “next!”; another is the lexer and reads the board, saying one token each time. Spaces are skipped silently.', ask:'What does the lexer do with the space between if and (?', ans:'It skips it. Spaces never become tokens; they only separate lexemes.', watch:'Students think the lexer returns characters. It always returns whole tokens.'}},
    {k:'Example', h:'From characters to tokens', ic:'🔡', p:'Here is one line as the lexer first sees it, and what it gives the parser. Spaces vanish; each word becomes a token.', code:`Characters:  i f ␣ ( x ␣ &gt; = ␣ 1 0 ) ␣ y ␣ = ␣ 1 ;

Tokens:      ⟨if⟩ ⟨(⟩ ⟨id,1⟩ ⟨relop,GE⟩ ⟨number,10⟩ ⟨)⟩
             ⟨id,2⟩ ⟨=⟩ ⟨number,1⟩ ⟨;⟩          → 10 tokens

Symbol table:  1: x    2: y`,
      parts:[['␣','A space character. It gives no token.'],['⟨if⟩','The keyword if. No attribute is needed: there is only one if.'],['⟨id,1⟩','An identifier; the 1 points to row 1 of the symbol table (x).'],['⟨relop,GE⟩','A relational operator; the attribute GE says which one (greater or equal).'],['⟨number,10⟩','A number token; the attribute is its value, 10.'],['⟨(⟩ ⟨)⟩ ⟨=⟩ ⟨;⟩','Punctuation and the assignment operator: one token each, no attribute.']],
      what:['The lexer reads the characters from left to right.','Spaces only separate words; they are dropped.','Each group of characters that makes a word becomes one token.','New names (x, y) are added to the symbol table; tokens point to their rows.'],
      eg:{note:'Try another line: <code>while (i &lt; 5) i = i + 1;</code>', out:`⟨while⟩ ⟨(⟩ ⟨id,1⟩ ⟨relop,LT⟩ ⟨number,5⟩ ⟨)⟩
⟨id,1⟩ ⟨=⟩ ⟨id,1⟩ ⟨+⟩ ⟨number,1⟩ ⟨;⟩          → 12 tokens

Symbol table:  1: i        (i appears 3 times but has one row)`},
      res:'Characters in, tokens out; names go into the symbol table once.',
      an:'Sorting a bag of loose letters into words on a Scrabble board: the letters are the same, but now they mean something.', tk:'19 characters (with spaces) became 10 tokens.',
      n:{say:'Count with the class: if, (, x, &gt;=, 10, ), y, =, 1, ; → 10. Explain the notation: ⟨id,1⟩ means “an identifier; details in row 1 of the symbol table”. ⟨relop,GE⟩ means “a relational operator, the greater-or-equal one”.', ask:'Why is <code>&gt;=</code> one token and not two?', ans:'Because <code>&gt;=</code> is one operator in C. The lexer always takes the longest operator it can; we will see this rule in a few slides.', watch:'Students forget that brackets and the semicolon are tokens too. Every symbol that is not a space or comment becomes a token.'}},
    {k:'Concept', h:'Token, pattern, lexeme: three words to learn', ic:'🏷️', pts:[['🏷️','<b>Token:</b> the category of a word, e.g. <code>id</code>, <code>number</code>, <code>if</code>. This is what the parser sees.'],['📏','<b>Pattern:</b> the rule that says which texts belong to a token, e.g. “a letter followed by letters or digits”.'],['✍️','<b>Lexeme:</b> the actual characters in the program, e.g. <code>count</code>, <code>42</code>.']],
      eg:{note:'Line: <code>int total = 42;</code>', out:`Lexeme   Token     Pattern (rule)
int      int       the letters i, n, t (a keyword)
total    id        a letter, then letters or digits
=        assign    the character =
42       number    one or more digits
;        ;         the character ;`},
      res:'Every lexeme belongs to one token, and the pattern is the rule that decides it.',
      an:'In a school: “student” is the token (category), “anyone enrolled with a roll number” is the pattern (rule), and Ali, Sara and Bilal are lexemes (actual people).', tk:'Token = category, pattern = rule, lexeme = actual text.',
      n:{say:'Write three columns on the board: Token | Pattern | Lexeme. Fill one row together: id | letter followed by letters/digits | count, sum, x1. Then ask students to fill a row for number.', ask:'Can one token have many lexemes?', ans:'Yes. All identifiers share the token id; all numbers share the token number. A keyword token like if has exactly one lexeme.', watch:'The most common mix-up of the whole unit: calling <code>count</code> a token. <code>count</code> is a lexeme; its token is id.'}},
    {k:'Animation', h:'Token, pattern, lexeme in a table', demo:'tpl', an:'A shop catalogue: the category (token), the description of what fits in it (pattern), and the items on the shelf (lexemes).', tk:'Keywords get their own token; ids and numbers share one token each.',
      n:{say:'Step through each row and read it as a sentence: “The token id has the pattern letter-then-letters-or-digits, and pi, score and D2 are lexemes of it.”', ask:'Why do keywords each get their own token, but all identifiers share one?', ans:'The parser must know exactly which keyword it saw (if and while need different grammar rules). For identifiers, the grammar only cares that it is a name; which name is stored in the attribute.', watch:'Note the comparison row: six different lexemes share one token, and an attribute tells them apart. This leads straight to the next idea.'}},
    {k:'Concept', h:'The five usual kinds of tokens', ic:'🗂️', p:'Most languages use the same five groups of tokens.', pts:[['🔑','<b>Keywords:</b> <code>if</code>, <code>while</code>, <code>int</code> (one token each).'],['🪪','<b>Identifiers:</b> names the programmer chooses, like <code>total</code>.'],['🔢','<b>Literals:</b> fixed values: <code>42</code>, <code>3.14</code>, <code>"hello"</code>.'],['➕','<b>Operators:</b> <code>+</code> <code>=</code> <code>&lt;=</code> <code>&amp;&amp;</code>.'],['🔣','<b>Punctuation</b> symbols: <code>(</code> <code>)</code> <code>{</code> <code>}</code> <code>;</code> <code>,</code>.']],
      eg:{note:'Label each lexeme of <code>while (count &lt; 10) count = count + 1;</code> (K = keyword, I = identifier, L = literal, O = operator, P = punctuation):', out:`while  (  count  &lt;  10  )  count  =  count  +  1  ;
  K    P    I    O   L   P    I    O    I    O  L  P`},
      an:'Words in English fall into a few groups: nouns, verbs, adjectives. Knowing the group tells you how the word can be used in a sentence.', tk:'Keywords, identifiers, literals, operators, punctuation.',
      n:{say:'Write <code>while (count &lt; 10) count = count + 1;</code> and ask students to label each lexeme with its group: K, I, L, O or P.', ask:'Is <code>printf</code> a keyword?', ans:'No. It is an identifier: the name of a library function. You could even name your own variable printf (bad idea, but legal).', watch:'Students often call <code>main</code>, <code>printf</code> or <code>cout</code> keywords. They are identifiers.'}},
    {k:'Concept', h:'Attributes: which one exactly?', ic:'📎', p:'When many lexemes share a token, the lexer adds an <b>attribute</b>: extra information saying which one. For <code>id</code> it is a pointer to the <b>symbol table</b> entry; for <code>number</code> it is the value. A token is a pair ⟨name, attribute⟩.', code:`E = M * C ** 2          (Fortran, where ** means "to the power")

⟨id, →E⟩ ⟨assign_op⟩ ⟨id, →M⟩ ⟨mult_op⟩ ⟨id, →C⟩ ⟨exp_op⟩ ⟨number, 2⟩`,
      parts:[['⟨ , ⟩','A token is written as a pair: ⟨token name, attribute⟩.'],['⟨id, →E⟩','Identifier; the attribute →E is a pointer to E’s row in the symbol table.'],['⟨assign_op⟩','The = operator. Only one lexeme, so no attribute.'],['⟨mult_op⟩','The * operator. No attribute.'],['⟨exp_op⟩','The ** (power) operator. No attribute.'],['⟨number, 2⟩','A number; the attribute is its value, 2.']],
      what:['The lexer finds the lexeme E, sees it is an identifier, finds (or adds) E’s row, and returns ⟨id, →E⟩.','For = , * and ** it returns the token name alone.','For 2 it returns the token number with the value 2.'],
      eg:{note:'In C: <code>x = y + 25;</code>', out:`⟨id, →x⟩ ⟨assign_op⟩ ⟨id, →y⟩ ⟨add_op⟩ ⟨number, 25⟩ ⟨;⟩`},
      res:'Only tokens that share many lexemes (id, number, relop) need an attribute.',
      an:'At a hospital desk, “patient” is the category, but the token you get also has your file number, so the doctor finds your exact record.', tk:'Tokens are pairs: ⟨token-name, attribute-value⟩.',
      n:{say:'Point at each pair. ⟨assign_op⟩ and ⟨mult_op⟩ have no attribute: there is only one lexeme for each, so nothing more is needed. →E means “a pointer to E’s row in the symbol table”.', ask:'Why store a pointer and not the name itself?', ans:'The symbol table row holds much more than the name: later phases add its type, scope and address. A pointer gives every phase quick access to all of it.', watch:'Students add attributes to every token. Keywords and punctuation usually have none.'}},
    {k:'Animation', h:'Scanning a statement, step by step', demo:'tokenize', an:'Reading a sentence with your finger under each word, saying its type out loud: noun, verb, noun.', tk:'Eight tokens; three symbol-table entries.',
      n:{say:'Step slowly and let students call out each token before you press Step. At the end, draw the symbol table: 1 position, 2 initial, 3 rate.', ask:'Why does 60 not go into the symbol table?', ans:'It is a constant, not a name. Its value is carried in the token itself: ⟨num, 60⟩.', watch:'Students forget the semicolon or count the spaces. Spaces give no tokens; the semicolon does.'}},
    {k:'Example', h:'Count the tokens', ic:'🔢', code:`printf("Total = %d\\n", total);`, p:'Answer: <code>printf</code> · <code>(</code> · <code>"Total = %d\\n"</code> · <code>,</code> · <code>total</code> · <code>)</code> · <code>;</code> = <b>7 tokens</b>. The whole string, spaces and all, is <b>one</b> literal token.',
      parts:[['printf','Identifier (a library function name), 1 token.'],['(  and  )','Punctuation, 1 token each.'],['"Total = %d\\n"','String literal: everything from the first " to the closing ", 1 token.'],[',','Punctuation (separates the arguments), 1 token.'],['total','Identifier, 1 token.'],[';','Punctuation (ends the statement), 1 token.']],
      what:['Start at the left and find the end of each lexeme.','When the lexer meets a <code>"</code>, it keeps reading until the closing <code>"</code>; all of that is one lexeme.','Spaces outside the string are skipped; spaces inside it are part of the string.','Count the lexemes: 7.'],
      eg:{note:'Try: <code>sum = sum + a[i]; // add</code>', out:`sum  =  sum  +  a  [  i  ]  ;     → 9 tokens
(the comment // add gives no token)`},
      res:'7 tokens for the printf line; a string is one token, a comment is none.',
      an:'A sealed envelope counts as one item in the post, however many words are written inside.', tk:'A string literal is one token; a comment gives no token at all.',
      n:{say:'Cover the answer first. Give the class 30 seconds to count. Many say 10 or more because they split the string at its spaces or at %d.', ask:'What if there were a comment <code>/* print it */</code> at the end?', ans:'Still 7 tokens. The lexer skips comments completely; the parser never sees them.', watch:'Inside a string, <code>=</code> and <code>%d</code> are just characters, not an operator or a format token.'}},
    {k:'Concept', h:'Other jobs of the lexer', ic:'🧽', pts:[['␣','Skips <b>whitespace</b> (spaces, tabs, newlines) and <b>comments</b>.'],['🔢','Counts line numbers so error messages can say “line 12”.'],['📒','Puts each new identifier into the symbol table.'],['🔁','In some languages, also expands macros.']], an:'A secretary who opens the post, throws away the adverts, stamps each letter with the date, and files the names of new contacts before passing letters to the manager.', tk:'The parser never sees blanks or comments.',
      n:{say:'Ask: “Who gives the line number in ‘error on line 12’?” The parser reports it, but the lexer counted the newlines. Every token carries its line number with it.', ask:'Python uses indentation for blocks. Can the lexer throw away the spaces there?', ans:'Not all of them. Python’s lexer turns changes of indentation into special INDENT and DEDENT tokens, so the parser can see where a block starts and ends.', watch:'Students think comments reach the compiler’s later phases. They are removed here, at the very start.'}},
    {k:'Example', h:'The lexer’s jobs on a small program', ic:'🧾', code:`int main() {
    int x = 5;   // start
    return x;
}`,
      parts:[['spaces and indentation','Skipped: no tokens.'],['// start','A comment: skipped, no token.'],['newline','Not a token, but the lexer adds 1 to its line counter.'],['main, x','New identifiers: each gets one row in the symbol table.'],['int, return','Keywords: tokens, but no symbol-table row.']],
      what:['Line 1: int, main, (, ), { → 5 tokens; main goes into the symbol table.','Line 2: int, x, =, 5, ; → 5 tokens; x goes into the symbol table; the comment is dropped.','Line 3: return, x, ; → 3 tokens; x is already in the table.','Line 4: } → 1 token.'],
      eg:{note:'What the parser receives (line number with each token):', out:`line 1:  ⟨int⟩ ⟨id,1⟩ ⟨(⟩ ⟨)⟩ ⟨{⟩
line 2:  ⟨int⟩ ⟨id,2⟩ ⟨=⟩ ⟨number,5⟩ ⟨;⟩
line 3:  ⟨return⟩ ⟨id,2⟩ ⟨;⟩
line 4:  ⟨}⟩                         → 14 tokens

Symbol table:  1: main    2: x`},
      res:'14 tokens with line numbers, 2 symbol-table rows, no comment and no spaces.',
      an:'A secretary sorting the post: adverts go in the bin (comments, spaces), each letter gets a date stamp (line number), new names go in the contact book (symbol table).', tk:'Skip blanks and comments, count lines, fill the symbol table.',
      n:{say:'Do it on the board line by line, writing the line number in front of each row. Then ask: if line 3 had a mistake, how would the compiler know to say “line 3”? Because the token carries the line number the lexer counted.', ask:'Does <code>int</code> go into the symbol table?', ans:'No. It is a keyword. Only names chosen by the programmer (identifiers) get rows.', watch:'Students count the comment words as tokens, or forget the brackets of main().'}},
    {k:'Concept', h:'Why not let the parser read characters?', ic:'✂️', p:'We could build one big parser that reads characters. Keeping a separate lexer is better for three reasons.', pts:[['🧩','<b>Simpler design:</b> the grammar does not have to mention spaces and comments.'],['⚡','<b>Speed:</b> the lexer can use fast, special reading tricks (coming up next).'],['🌍','<b>Portability:</b> details of files and character sets stay in one small place.']], an:'In a restaurant, the waiter takes the order and the chef cooks. One person could do both, but the kitchen runs better when each has one job.', tk:'Separation = simpler + faster + more portable.',
      n:{say:'Write a grammar rule for an if-statement on the board twice: once with tokens (<code>if ( cond ) stmt</code>) and once trying to allow spaces and comments between every symbol. The second is messy; that is the point.', ask:'Is the lexer a separate program?', ans:'Usually it is a function or module inside the compiler, called by the parser. Separate in design, not a separate .exe.', watch:'Do not spend long here; the main exam point is the three reasons.'}},
    {k:'Concept', h:'When two patterns match: two rules', ic:'⚖️', p:'Patterns are written as <b>regular expressions</b> (next lecture) and run as <b>transition diagrams</b> (flowcharts of states). Sometimes more than one pattern fits. Two rules decide:', pts:[['📏','<b>Longest match:</b> take the longest lexeme possible: <code>&lt;=</code> not <code>&lt;</code>; <code>iffy</code> not <code>if</code>.'],['🥇','<b>Priority:</b> if two patterns match the same length, the one listed first wins. List keywords before identifiers.']],
      tbl:{cap:'Important points for your exam', h:['Input','Patterns that match','Rule used','Result'], r:[['<code>&lt;=</code>','relop matches <code>&lt;</code> (1 char) and <code>&lt;=</code> (2 chars)','Longest match','⟨relop,LE⟩'],['<code>iffy</code>','keyword matches <code>if</code> (2), id matches <code>iffy</code> (4)','Longest match','⟨id⟩ for iffy'],['<code>if</code>','keyword and id both match 2 chars','Priority (keyword listed first)','⟨if⟩'],['<code>count1</code>','id matches all 6 chars','Longest match','⟨id⟩ for count1']]},
      an:'At a bus stop, the driver lets the longest queue board first; if two queues are equal, the one with the earlier ticket number goes first.', tk:'Longest match first, then rule priority.',
      n:{say:'Take <code>iffy</code>: the keyword pattern matches <code>if</code> (2 chars) but the identifier pattern matches <code>iffy</code> (4 chars). Longest wins: identifier. Take <code>if</code> alone: both patterns match 2 chars. Priority decides: keyword.', ask:'How do real compilers handle keywords then?', ans:'Many read every word with the identifier pattern and then look it up in a small table of keywords. Same result, simpler diagrams.', watch:'Students think priority is used first. Always apply longest match first; priority only breaks ties.'}},
    {k:'Example', h:'Longest match in real C code', ic:'🔍', code:`Input          Tokens (longest match)
x&lt;=y           x   &lt;=   y
iffy = 1;      iffy   =   1   ;          (iffy is an identifier)
x = a+++b;     x   =   a   ++   +   b   ;
a+++++b        a   ++   ++   +   b        → C compiler error!`,
      parts:[['x&lt;=y','<code>&lt;=</code> is longer than <code>&lt;</code>, so it is taken as one operator.'],['iffy','The identifier iffy (4 chars) is longer than the keyword if (2 chars).'],['a+++b','Take <code>++</code> (2 chars) first, then only <code>+</code> is left: a ++ + b.'],['a+++++b','++, then ++, then +: a ++ ++ + b. The lexer never goes back to try a ++ + ++ b.']],
      what:['At each point, the lexer tries every pattern.','It takes the longest lexeme any pattern can match.','It moves on and never changes an earlier choice.','If the token list makes no sense, the parser or semantic analyser complains, not the lexer.'],
      eg:{note:'Compile the last row with gcc:', code:`int main() {
    int a = 1, b = 2, c;
    c = a+++++b;
    return 0;
}`, out:`error: lvalue required as increment operand`},
      res:'Greedy splitting: <code>a+++b</code> works as a++ + b, but <code>a+++++b</code> fails; write <code>a++ + ++b</code> with spaces.',
      an:'Reading a long word like “bookkeeper”: you do not stop at “book”, because the longer word makes sense.', tk:'The lexer is greedy: it never looks back to try a shorter split.',
      n:{say:'The last two rows are real C behaviour and make a good demo with gcc. <code>a+++b</code> becomes <code>a++ + b</code>. <code>a+++++b</code> becomes <code>a ++ ++ + b</code>, and the compiler then complains (you cannot apply ++ to a++). The split <code>a++ + ++b</code> would have worked, but the lexer does not try it.', ask:'Why does the lexer not try other splits when one fails?', ans:'Because it does not know about grammar; that is the parser’s job. Being greedy keeps the lexer simple and fast.', watch:'Students expect the lexer to be “clever”. It follows the rule blindly; programmers add spaces to make their meaning clear.'}},
    {k:'Concept', h:'Peeking ahead and stepping back', ic:'👀', p:'To finish a lexeme, the lexer often reads one character too many. This is <b>lookahead</b>. After <code>&lt;</code> it must peek: is the next char <code>=</code>? To end <code>count</code> it must see the <code>=</code> after it, then <b>retract</b>: step back one char so <code>=</code> is read again as the next token.',
      parts:[['lookahead','Reading one more character to decide whether the lexeme has ended.'],['retract','Moving back one character, so the extra character is read again for the next token.']],
      what:['Read characters while they still fit the current pattern.','The first character that does not fit tells us the lexeme has ended.','Retract one character: that character belongs to the next token.','Return the token for the characters before it.'],
      eg:{note:'Input: <code>count=5</code>', out:`read c o u n t    still letters: keep going
read =             not a letter or digit: the identifier has ended
retract 1          forward goes back to =
return ⟨id⟩ for "count"

read =, peek 5     5 is not =, so this is = (not ==)
retract 1          forward goes back to 5
return ⟨=⟩

read 5, then end   return ⟨number,5⟩`},
      res:'Three tokens: ⟨id⟩ ⟨=⟩ ⟨number,5⟩; two retracts were needed.',
      an:'Reading a phone number aloud: you only know the number has ended when you see the space after the last digit. You do not swallow the space; it belongs to what comes next.', tk:'The lexer peeks one character ahead, and sometimes steps back one.',
      n:{say:'Trace <code>count=5</code> on the board with a finger: c o u n t, then <code>=</code>: not a letter, so the identifier ends at t. The <code>=</code> was read but not used, so we retract. This is why reading must be done from a buffer where stepping back is cheap.', ask:'Can a lexer need more than one character of lookahead?', ans:'Some languages need more. In old Fortran, spaces were ignored, so <code>DO 5 I = 1.25</code> (an assignment to a variable DO5I) and <code>DO 5 I = 1,25</code> (a loop) differ only at the dot or comma. Modern languages are designed so one char is usually enough.', watch:'Students forget to retract and lose the first character of the next token.'}},
    {k:'Concept', h:'Input buffering: read in big blocks', ic:'📦', p:'Reading from disk one character at a time is very slow. So the lexer reads a big block (e.g. 4096 chars) into memory at once: <b>input buffering</b>. Two pointers move over it: <b>lexemeBegin</b> marks where the current lexeme starts; the <b>forward pointer</b> scans ahead to find its end.',
      parts:[['buffer','A block of memory holding many characters read from the file at once.'],['lexemeBegin (B)','Points to the first character of the lexeme being read now.'],['forward (F)','Moves right, one character at a time, to find where the lexeme ends.'],['lexeme','The characters from B up to (not including) F.']],
      what:['Start with B and F at the same place.','Move F right until the lexeme ends (with one retract if it read too far).','The lexeme is the text from B to just before F; return its token.','Set B = F and repeat for the next lexeme.'],
      eg:{note:'Buffer holds <code>x1=10;</code> at positions 0–5:', out:`Pos:   0  1  2  3  4  5
Char:  x  1  =  1  0  ;

Step  B   F (after retract)  Lexeme  Token
1     0   2                  x1      ⟨id⟩
2     2   3                  =       ⟨=⟩
3     3   5                  10      ⟨number,10⟩
4     5   6                  ;       ⟨;⟩`},
      res:'Four lexemes cut out of the buffer by moving two pointers.',
      an:'Buying a whole tray of eggs once a week instead of walking to the shop for every egg.', tk:'Buffering gives speed and makes lookahead and retracting cheap.',
      n:{say:'Draw a long box divided into cells with a few characters. Draw two arrows below: lexemeBegin (B) and forward (F). Move F right until the lexeme ends; the lexeme is the text from B to just before F; then move B to F and repeat.', ask:'Why two buffer halves instead of one?', ans:'When forward reaches the end of one half, the other half is reloaded. A lexeme that crosses the border is still complete in memory, as long as it is shorter than one half.', watch:'Retracting simply means moving forward back by one. That only works because the characters are still in the buffer.'}},
    {k:'Animation', h:'Two buffers with sentinels', demo:'buffer', an:'A train with two carriages: while passengers walk through the second, the first is cleaned and refilled.', tk:'The sentinel eof turns two tests per character into one.',
      n:{say:'Step through. Pause at the frame where forward hits the eof at the end of the first half: this is the only time we check “which end is this?”. Note that the input here, <code>E = M * C ** 2</code>, is the Fortran example from the attributes slide.', ask:'What is a sentinel?', ans:'A special character (here eof) placed at the end of each buffer half. It is a guard that says “stop and check”, so we do not need to test the position on every character.', watch:'eof at the end of a half means “reload”; eof anywhere else means “real end of the input”.'}},
    {k:'Concept', h:'Sentinel code: one test per character', ic:'🛡️', p:'Without a <b>sentinel</b>, each character costs two tests: “end of buffer?” and “which character?”. With an eof sentinel at the end of each half, we only ask “which character?”. The rare eof case does the extra work.', code:`switch (*forward++) {
  case eof:
    if (forward is at end of first buffer) {
        reload second buffer; forward = beginning of second buffer; }
    else if (forward is at end of second buffer) {
        reload first buffer;  forward = beginning of first buffer; }
    else  /* eof inside a buffer = real end of input */
        terminate lexical analysis;
    break;
  /* cases for the other characters ... */
}`,
      parts:[['switch (*forward++)','Look at the character under forward, then move forward one place.'],['case eof:','The only special case: we hit an eof sentinel.'],['end of first buffer','eof is the guard at the end of half 1: reload half 2 and jump there.'],['end of second buffer','eof is the guard at the end of half 2: reload half 1 and jump to its start.'],['else … terminate','eof in the middle of a half: the input has really ended.'],['other cases','Normal characters (letters, digits, …) are handled with no end-of-buffer test.']],
      what:['For a normal character, only one test is made: “which character is it?”.','Only when the character is eof do we ask “which end is this?”.','At the end of a half, the other half is reloaded and scanning goes on.','eof inside a half means the file is finished, so lexical analysis stops.'],
      eg:{note:'Input <code>x = 10;</code> (7 characters), each half holds 4 characters + 1 sentinel:', out:`Half 1:  [x][␣][=][␣][eof]     eof at the end of half 1 → reload half 2, go on
Half 2:  [1][0][;][eof]         eof inside half 2 → real end of input, stop

Tests without sentinels: 2 per character = 14
Tests with sentinels:    1 per character = 7, plus the 2 eof checks`},
      res:'One test per normal character; the extra checks happen only at an eof.',
      an:'A shop that puts a “last packet, tell the owner” card behind the final packet on each shelf. Staff do not count packets all day; they only act when they see the card.', tk:'Only when we see eof do we check which case it is.',
      n:{say:'Count the work: for a million characters, the old way does two million tests; the sentinel way does about one million, plus a few for each reload. Since the lexer touches every character of the program, this saving matters.', ask:'What if the program really contains the eof character?', ans:'eof is chosen as a value that cannot appear in normal source text. If it ever appears inside a half (not at its end), it means the input has truly ended.', watch:'This code is pseudocode from the Dragon book, not real C you can compile.'}},
    {k:'Summary', h:'The lexical analyzer (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Term','Meaning in simple words','Example'], r:[['Token','The category of a word, with an optional attribute','⟨id,1⟩, ⟨relop,GE⟩, ⟨;⟩'],['Lexeme','The actual characters in the program','count, 42, &gt;='],['Pattern','The rule that says which lexemes belong to a token','id: a letter, then letters or digits'],['Attribute','Extra information: which one exactly','symbol-table pointer, value 10, GE'],['Longest match','Take the longest lexeme that fits','<code>&lt;=</code> not <code>&lt;</code>; iffy is an id'],['Priority','Equal length: the rule listed first wins','<code>if</code> is a keyword'],['Lookahead / retract','Read one char too many, then step back','count=5: read =, step back'],['Input buffering','Read big blocks; two pointers B and F','x1=10; cut into 4 lexemes'],['Sentinel','eof at the end of each half: one test per char','reload at end of half; stop inside']]},
      res:'You can now tokenize a line, give attributes, and explain how the lexer reads fast.',
      an:'A checklist before a journey: one look shows that every item is packed.', tk:'Tokens, lexemes, patterns, attributes, two matching rules, buffers and sentinels.',
      n:{say:'Use this as the closing review. Read the Term column; students give the meaning and an example before you reveal it.', ask:'Which two rows answer “how does the lexer decide between two patterns?”', ans:'Longest match and priority, applied in that order.', watch:'Students mix up token and lexeme to the very end. Ask for one of each from the same line.'}}
  ],
  lab:{t:'Lab: hand-tokenize and verify', steps:['Tokenize by hand: <code>while (count &lt;= 100) { sum += count; count++; }</code>. Write ⟨token, attribute⟩ pairs.','Count how many entries go into the symbol table.','Open <b>Lab tools → Tokenizer</b>, paste the code and compare with your answer.','Add a comment and a string, and check that they are handled as single units (the comment gives no token).','Try <code>x = a+++b;</code> in the tool and explain the result using the longest-match rule.'], out:'Hand-written token list + screenshot of the tool output, differences explained.',
    n:{say:'Answer for step 1: 15 tokens: while · ( · count · &lt;= · 100 · ) · { · sum · += · count · ; · count · ++ · ; · }. Symbol table: 2 entries (count, sum); while is a keyword, not an entry. In the tool, count shows as “id entry 1” every time and sum as “id entry 2”.', ask:'count appears three times. Does it get three symbol-table entries?', ans:'No. The first time it is inserted; the next times the lexer finds the existing entry and returns a pointer to the same row.', watch:'Students split <code>+=</code> and <code>++</code> into two tokens each. Both are single operators in C.'}},
  disc:['Should the lexer or the parser decide that <code>fi</code> is a misspelled <code>if</code>?','In Python, indentation matters. Who should handle it: lexer or parser?','Why do we need the longest-match rule? Give a counter-example without it.'],
  mistakes:['Counting a string literal as several tokens.','Confusing token (category) with lexeme (actual text).','Forgetting that comments and blanks produce <b>no</b> tokens.','Thinking every token needs an attribute. Keywords and punctuation usually do not.','Applying keyword priority before longest match (so <code>iffy</code> wrongly becomes <code>if</code> + <code>fy</code>).'],
  rev:['The lexer reads characters, groups them into lexemes and returns tokens to the parser.','Token = name + optional attribute (e.g. symbol-table pointer, value).','Pattern describes the lexemes of a token.','Longest match and rule priority resolve ambiguity.','Two-buffer scheme with sentinels gives fast lookahead.'],
  hw:'Read Dragon book §3.1–3.2. Tokenize three lines of your own C code and list the symbol-table entries.',
  check:[
    {q:'How many tokens does the lexer produce for <code>count1=count+10;</code> (no spaces)?', o:['5','6','8','15'], a:1, e:'count1 · = · count · + · 10 · ; → 6. count1 is one identifier because digits may follow the first letter.'},
    {q:'Using longest match, how does a C lexer split <code>a+++b</code>?', o:['a + ++ b','a ++ + b','a + + + b','It reports an error'], a:1, e:'It takes the longest operator first: ++ , then + . So a++ + b.'},
    {q:'What does the eof sentinel at the end of each buffer half save?', o:['Memory','One test per character in the common case','The symbol table','Comment removal'], a:1, e:'Without it we test “end of buffer?” for every character. With it, only the rare eof case needs that test.'}],
  quiz:[
    {q:'In <code>count = count + 1;</code>, the lexeme <code>count</code> has token…', o:['number','id','keyword','literal'], a:1, e:'Identifiers share the token id.'},
    {q:'How many tokens in <code>x = y * 25;</code>?', o:['4','5','6','8'], a:2, e:'x, =, y, *, 25, ; → 6.'},
    {q:'A <b>pattern</b> is…', o:['The actual characters read','A description of the set of lexemes for a token','A parse tree','A symbol-table entry'], a:1, e:'Usually a regular expression.'},
    {q:'The sentinel <b>eof</b> at the end of each buffer half lets the lexer…', o:['Skip comments','Test for buffer end and character in one check','Detect syntax errors','Hash identifiers'], a:1, e:'One test per character in the common case.'},
    {q:'Input <code>&lt;=</code>: by the longest-match rule the lexer returns…', o:['&lt; then =','&lt;=','an error','=&lt;'], a:1, e:'Prefer the longest valid lexeme.'},
    {q:'The word <code>if</code> matches both the keyword and the identifier pattern with the same length. What decides?', o:['Longest match','Rule priority: keywords are listed first','The parser','The symbol table'], a:1, e:'Equal length is a tie; priority breaks it in favour of the keyword.'},
    {q:'Which of these is a lexeme, not a token?', o:['id','number','total','relop'], a:2, e:'total is the actual text; its token is id.'}],
  terms:[['Lexical analyzer','The phase that reads characters and produces tokens; also called scanner.'],['Token','A pair of a token name (category) and optional attribute value.'],['Lexeme','The sequence of characters in the source that matches a token’s pattern.'],['Pattern','A description (usually a regular expression) of the lexemes of a token.'],['Attribute','Extra information carried by a token, e.g. a symbol-table pointer.'],['Longest match','Rule that the scanner prefers the longest lexeme that matches a pattern.'],['Lookahead','Reading characters beyond the current lexeme to decide where it ends.'],['Retract','Moving the forward pointer back one character after reading too far.'],['Input buffering','Reading the source in blocks into buffers to allow fast lookahead.'],['Sentinel','A special character (eof) marking the end of a buffer to reduce tests.'],['lexemeBegin','Pointer to the start of the current lexeme.'],['forward','Pointer that scans ahead to find the end of the lexeme.']]
},
{ id:4, week:2, unit:'Lexical analysis', ic:'📐', lo:[2], book:'Louden Ch. 2.2 · Dragon Ch. 3.3',
  title:'Specification of Tokens: Regular Expressions',
  sub:'Strings and languages, regular expressions, regular definitions for identifiers, numbers and others; recognising complex words; lexical errors.',
  assess:'Assignment-1',
  introH:'How do you describe “every possible number” in one line?',
  intro:'A lexer must know exactly which texts are identifiers, which are numbers and which are neither. Plain English is too vague for a computer. Today we learn <b>regular expressions</b>: a short, exact language for describing patterns.',
  introAn:'A tailor does not write “make it fit nicely”; he writes exact measurements: chest 40, sleeve 24. Regular expressions are the exact measurements of tokens.',
  introN:{say:'Ask: “Describe a valid C identifier in one sentence.” Write down two or three answers. Then test them: is <code>_count</code> allowed? <code>x2</code>? <code>2x</code>? Usually the English answers leave something unclear. End with: by the end of today we will write it exactly as <code>letter_ ( letter_ | digit )*</code>.', ask:'Are these the same regular expressions (regex) I see in Python and JavaScript?', ans:'Yes, the same idea. Programming regex adds many extra features, but the core (|, *, brackets) is exactly what we study today.', watch:'Some students fear the maths notation. Promise that every symbol will be shown with a small example before it is used.'},
  obj:['Define alphabet, string, language and operations on languages.','Write regular expressions using union, concatenation and closure.','Write regular definitions for identifiers, numbers, strings and whitespace.','Use extensions such as +, ?, and character classes.','Describe lexical errors and recovery actions.'],
  bloom:{head:['<b>Define</b> alphabet, string and language.','<b>Construct</b> regular expressions for token classes.','<b>Evaluate</b> whether a given string matches a regular expression.'],
    heart:['<b>Appreciate</b> the precision of formal notation over informal English.','<b>Persist</b> when a pattern does not match on the first try.'],
    hand:['<b>Write</b> regular definitions for a mini-language.','<b>Test</b> regexes on sample input with an online tester or grep.']},
  slides:[
    {k:'Concept', h:'Why English is not exact enough', ic:'🎯', p:'Last lecture we said the pattern for <code>id</code> is “a letter followed by letters or digits”. Is <code>_total</code> allowed? Is the empty text allowed? A lexer cannot guess. We need a notation where every pattern has exactly one meaning.', ex:'Goal for today: write the identifier pattern as  <code>letter_ ( letter_ | digit )*</code>  and know exactly what it allows.',
      parts:[['letter_','Any one letter A–Z, a–z, or the underscore _.'],['digit','Any one digit 0–9.'],['( … )','Brackets: group the parts inside.'],['|','“or”: one of the two sides.'],['*','“zero or more times” the part just before it.']],
      what:['First comes exactly one letter_ .','Then the bracket part (a letter_ or a digit) may repeat zero or more times.','Nothing else is allowed: no spaces, no -, no other symbols.'],
      eg:{note:'Test some names against <code>letter_ ( letter_ | digit )*</code>:', out:`_total      ✓  (_ then letters)
x2          ✓  (letter, then a digit)
2x          ✗  (starts with a digit)
total-sum   ✗  (- is not allowed)
(empty)     ✗  (at least one letter_ is needed)`},
      res:'One short line decides exactly which names are identifiers.',
      an:'Telling a rickshaw driver “go near the big mosque” versus giving the exact address. The first works only if you are lucky.', tk:'Tokens need exact patterns, not English descriptions.',
      n:{say:'First we need four basic words: alphabet, string, language, operations. Then regular expressions are just a short way to write languages. Tell students the plan so the maths does not feel random.', ask:'Why not just list all identifiers?', ans:'There are infinitely many (a, aa, aaa, …). We need a finite description of an infinite set; that is what a pattern is.', watch:'Keep this slide short; it is motivation.'}},
    {k:'Concept', h:'Alphabets and strings', ic:'🔡', pts:[['Σ','<b>Alphabet</b> (Σ, “sigma”): a finite set of symbols, e.g. {0, 1}, or all ASCII characters.'],['🔗','<b>String:</b> a finite row of symbols from the alphabet, e.g. <code>1011</code>.'],['📏','Length |s| = number of symbols: |1011| = 4.'],['ε','The <b>empty string</b> ε has length 0: no symbols at all.'],['➕','<b>Concatenation</b> joins strings: x = dog, y = house, xy = doghouse. Also sε = s.']],
      eg:{note:'Σ = {a, b} and s = ab:', out:`|s|          = 2
s ε          = ab        (joining nothing changes nothing)
s⁰           = ε
s²  = s s    = abab
All strings of length 2 over Σ:  aa  ab  ba  bb`},
      an:'An alphabet is the set of letter tiles in a Scrabble box. A string is any word you lay down with them, even a nonsense one. Laying no tile at all is the empty string.', tk:'Alphabet = symbols; string = a row of them; ε = the empty row.',
      n:{say:'Use Σ = {a, b} on the board. List some strings: a, b, ab, ba, aab. Ask: is ε a string over Σ? Yes, every alphabet gives the empty string. Also show powers: s⁰ = ε, s¹ = s, s² = ss, so (ab)² = abab.', ask:'Is ε the same as a space character?', ans:'No. A space is a real symbol with length 1. ε has nothing in it; its length is 0.', watch:'Students write ε inside strings, like “aεb”. Since ε is nothing, aεb is just ab.'}},
    {k:'Concept', h:'A language is a set of strings', ic:'📚', p:'A <b>language</b> is any set of strings over an alphabet. It can be small, like {00, 01, 10, 11}, or infinite, like “all valid C identifiers”. A token’s pattern describes one language: the set of all its lexemes.', pts:[['🔹','<b>Prefix</b> of banana: ban (cut letters off the end).'],['🔸','<b>Suffix</b> of banana: ana (cut letters off the start).'],['🔻','<b>Substring</b> of banana: nan (cut from both ends).']],
      eg:{note:'All prefixes, suffixes and some substrings of <code>ban</code>:', out:`Prefixes:    ε  b  ba  ban
Suffixes:    ε  n  an  ban
Substrings:  ε  b  a  n  ba  an  ban     (bn is NOT one: letters must be next to each other)`},
      an:'A language is like a club membership list: some strings are members, others are not. The pattern is the club’s entry rule.', tk:'Language = set of strings. Pattern of a token = a description of its language.',
      n:{say:'Write examples on the board: ∅ (the empty set, no strings), {ε} (one string, the empty one), {if} (the language of the keyword if). Then: all identifiers is infinite, but our pattern will be short.', ask:'Is ∅ the same as {ε}?', ans:'No. ∅ has no members at all. {ε} has exactly one member: the empty string. A box with nothing in it versus a box with an empty envelope.', watch:'Word meaning differs from everyday English: here “language” just means a set of strings, not Urdu or English.'}},
    {k:'Comparison', h:'Four ways to build new languages', cmp:[['Operation',['<b>Union</b> L ∪ M','<b>Concatenation</b> LM','<b>Kleene closure</b> L*','<b>Positive closure</b> L⁺']],['Meaning (L = {a, b}, D = {0, 1})',['in L or in M: L ∪ D = {a, b, 0, 1}','one from L then one from D: {a0, a1, b0, b1}','zero or more from L joined: {ε, a, b, aa, ab, …}','one or more: L* without ε (when ε ∉ L)']]], ex:'Letters L = {A…Z, a…z}, digits D = {0…9}:  L(L ∪ D)* = a letter, then any mix of letters and digits = identifiers!',
      eg:{note:'With L = {a, b} and D = {0, 1}:', out:`L ∪ D  = {a, b, 0, 1}                 4 strings
L D    = {a0, a1, b0, b1}             4 strings
L L    = {aa, ab, ba, bb}             4 strings
L*     = {ε, a, b, aa, ab, ba, bb, aaa, …}   infinite
L⁺     = {a, b, aa, ab, ba, bb, aaa, …}      infinite (no ε)`},
      an:'A menu with starters and main dishes. Union: pick from either list. Concatenation: one starter then one main. Closure: as many dishes as you like, even none.', tk:'Union, concatenation and closure build big languages from small ones.',
      n:{say:'Work each row on the board with L = {a, b} and D = {0, 1}. For L*, list in order of length: ε; a, b; aa, ab, ba, bb; … Then build the identifier language step by step: (L ∪ D) = one letter or digit; (L ∪ D)* = any row of them; L(L ∪ D)* = put one letter in front.', ask:'Why does L* always contain ε?', ans:'“Zero or more” includes zero: choosing nothing gives the empty string.', watch:'Concatenation of languages is not union: LD has strings of length 2 here, not 1.'}},
    {k:'Concept', h:'Regular expressions: the rules', ic:'🧱', p:'A <b>regular expression</b> (RE) is a short formula for a language. Small REs are combined into bigger ones by three operators.', pts:[['ε','<b>ε</b> is an RE for {ε}; any symbol <b>a</b> is an RE for {a}.'],['|','<b>r | s</b> (union): a string from r <i>or</i> from s.'],['··','<b>rs</b> (concatenation): a string from r, <i>then</i> one from s.'],['*','<b>r*</b> (closure): zero or more strings from r, joined.'],['( )','Brackets group parts, as in maths.']],
      eg:{note:'Small REs and their languages:', out:`a|b          →  {a, b}
ab           →  {ab}
a*           →  {ε, a, aa, aaa, …}
(a|b)(a|b)   →  {aa, ab, ba, bb}
a(b|c)       →  {ab, ac}`},
      an:'LEGO: single bricks (symbols) and three ways to join them (or, then, repeat). Every model is built from these.', tk:'Every RE is built from symbols with |, concatenation and *.',
      n:{say:'Stress that an RE is just text that names a language. Write <code>a|b</code> → {a, b}; <code>ab</code> → {ab}; <code>a*</code> → {ε, a, aa, …}. A language that can be written this way is called a regular language.', ask:'Is there an operator for “not”?', ans:'Not in the basic definition. Tools add shorthands like <code>[^"]</code> (any character except "), which we see later; they are only convenient abbreviations.', watch:'Students write + for union because of maths. In REs, union is <code>|</code>; <code>+</code> later means “one or more”.'}},
    {k:'Animation', h:'Regular expressions and the languages they name', demo:'reops', an:'A recipe and all the dishes it can produce: one short recipe, many possible plates.', tk:'Union, concatenation, closure, plus brackets.',
      n:{say:'Before each Step, read the RE aloud and ask the class to guess the language. Spend extra time on <code>a | a*b</code>: it is a, or some a’s followed by one b.', ask:'Do <code>(a|b)*</code> and <code>(a*b*)*</code> describe the same language?', ans:'Yes: both give every string of a’s and b’s. Two REs that describe the same language are called equivalent.', watch:'The last row, <code>(a|b)*abb</code>, is used again in the next lecture to build automata. Make sure everyone understands it: any string of a’s and b’s that ends in abb.'}},
    {k:'Concept', h:'Who goes first? Precedence', ic:'⬆️', p:'Like × before + in maths, RE operators have an order: <b>*</b> first, then concatenation, then <b>|</b> last. Use brackets to change it.', code:`ab*        means  a(b*)      → a, ab, abb, abbb, …
(ab)*      means             → ε, ab, abab, …
a|bc       means  a|(bc)     → a, bc
(a|b)c     means             → ac, bc
(a)|((b)*(c))  can be written  a|b*c`,
      parts:[['( )','Highest: whatever is in brackets is one unit.'],['*','Next: the star sticks only to the one symbol or bracket just before it.'],['ab (side by side)','Next: concatenation, “then”.'],['|','Lowest: “or” splits the whole RE into two sides.']],
      what:['Put brackets around each starred part first.','Then join the neighbours that stand side by side.','Last, split at each <code>|</code>.'],
      eg:{note:'Work out <code>a|b*c</code>:', out:`Step 1 (star):            a | (b*) c
Step 2 (concatenation):   a | ((b*) c)
Step 3 (or):              either  a   or  (zero or more b, then c)

Matches:  a   c   bc   bbc   …
No match: ab  (a cannot be followed by anything)`},
      res:'<code>a|b*c</code> = a, or any number of b’s followed by c.',
      an:'BODMAS for patterns: Brackets first, then the star (like a power), then joining (like ×), then “or” (like +).', tk:'* binds tightest, then concatenation, then |.',
      n:{say:'Compare the first two rows: the star sticks only to the symbol right before it unless brackets say otherwise. All three operators are left-associative, but that never changes the language.', ask:'Why does <code>ab*</code> not match <code>abab</code>?', ans:'The star repeats only b. After the a you may have any number of b’s, but never another a.', watch:'The most common RE mistake: writing ab* when (ab)* was meant.'}},
    {k:'Example', h:'Does this string match?', ic:'✅', p:'To test a string, try to read it through the RE from left to right, like following a recipe. For <code>(a|b)*abb</code>: any mix of a and b, then exactly <code>abb</code> at the end.', code:`String   In (a|b)*abb?   Why
abb      yes             (a|b)* gives ε, then abb
aabb     yes             (a|b)* gives a, then abb
babb     yes             (a|b)* gives b, then abb
abab     no              ends in bab, not abb
abba     no              ends in bba, not abb`,
      parts:[['(a|b)*','Any mix of a and b, of any length, even none.'],['abb','Then exactly the three characters a, b, b.'],['yes / no','Whether the whole string can be read through the RE.']],
      what:['Look at the fixed part first: the string must end in <code>abb</code>.','Cut those three characters off the end.','Check that what is left is made only of a’s and b’s (or is empty).','Both checks pass → yes; either fails → no.'],
      eg:{note:'Now <code>a(b|c)*</code>: an a, then any mix of b and c.', out:`abcb   yes   a, then b c b
a      yes   a, then (b|c)* used zero times
bca    no    it must start with a`},
      res:'A string matches only if the whole string can be read through the RE.',
      an:'Checking a CNIC number against the format 12345-1234567-1: you check each part in order, and one wrong part means it does not fit.', tk:'A string matches if some way of reading it through the RE uses up all of it.',
      n:{say:'Do the rows one by one and ask for a show of hands before revealing. Then give one to try: does <code>a(b|c)*</code> match <code>abcb</code>? (Yes: a, then b, c, b.) Does it match <code>bca</code>? (No: it must start with a.)', ask:'How does a computer check this?', ans:'It turns the RE into a finite automaton, a small machine that reads one character at a time. That is next lecture.', watch:'Students think the string must use each part “once”. The star can be used zero times or many times.'}},
    {k:'Concept', h:'Regular definitions: give patterns names', ic:'🏷️', p:'Long REs are hard to read. A <b>regular definition</b> gives a name to an RE, and later lines can use that name, like variables in a program.', code:`letter_  →  A | B | … | Z | a | b | … | z | _
digit    →  0 | 1 | … | 9
id       →  letter_ ( letter_ | digit )*`,
      parts:[['letter_ , digit , id','Names given to REs, like variable names.'],['→','“is defined as”. Not part of the pattern.'],['A | B | … | Z','One of the letters A to Z (the … stands for the letters in between).'],['_','The underscore character.'],['id → letter_ ( letter_ | digit )*','Uses the two names defined above it.']],
      what:['Line 1 defines letter_: any one letter or _.','Line 2 defines digit: any one of 0–9.','Line 3 uses both names to define id.','To read id, replace each name with its definition.'],
      eg:{note:'Test with id:', out:`_count      ✓   letter_ _, then c o u n t
x2          ✓   letter_ x, then digit 2
2x          ✗   must start with a letter_
total-sum   ✗   - is neither a letter_ nor a digit`},
      res:'Three short named lines describe every C identifier.',
      an:'In a recipe book, “make the dough (see page 4)” instead of writing the dough steps inside every recipe.', tk:'Names make big patterns readable.',
      n:{say:'Read the id line aloud: “a letter or underscore, then zero or more letters, underscores or digits”. Test it: _count ✓, x2 ✓, 2x ✗ (starts with a digit), total-sum ✗ (- is not allowed).', ask:'Can a name use itself, like <code>id → id letter</code>?', ans:'No. Each name may only use names defined above it. That rule keeps the definitions regular (no recursion).', watch:'The arrow → means “is defined as”; it is not part of the pattern.'}},
    {k:'Animation', h:'Regular definitions for numbers', demo:'regex', an:'Filling in a form: the whole part is required, the decimal part is optional, the “× 10 to the power” part is optional.', tk:'number → digits (. digits)? (E [+-]? digits)?',
      n:{say:'Step through and write each line on the board. Then test together: 12 ✓, 3.14 ✓, 6.02E23 ✓, 1E-9 ✓, .5 ✗ (no digits before the dot), 5. ✗ (no digits after the dot), 1e ✗ (nothing after the e; and in this definition only capital E is allowed).', ask:'Why is optFraction written as <code>. digits | ε</code>?', ans:'The | ε part means “or nothing”, which makes the fraction optional.', watch:'Here the dot is a real dot character. In programming regex you must write <code>\\.</code>, because a plain . means “any character” there.'}},
    {k:'Example', h:'Reading the number definition line by line', ic:'🔢', code:`digit        →  0 | 1 | … | 9
digits       →  digit digit*
optFraction  →  . digits  |  ε
optExponent  →  ( E ( + | - | ε ) digits )  |  ε
number       →  digits optFraction optExponent`,
      parts:[['digit','One digit.'],['digits','One digit, then zero or more digits: at least one digit.'],['. digits | ε','A dot followed by digits, or nothing: the fraction is optional.'],['E ( + | - | ε ) digits','Capital E, then an optional sign, then digits: “× 10 to the power”.'],['| ε (at the end of optExponent)','The whole exponent part is optional.'],['number','Whole part (required), then optional fraction, then optional exponent.']],
      what:['Read the whole part: it needs at least one digit.','If a dot comes next, at least one digit must follow it.','If E comes next, an optional + or -, then at least one digit must follow.','The string must end exactly there.'],
      eg:{note:'Test seven strings:', out:`12        ✓   digits; no fraction; no exponent
3.14      ✓   digits . digits
6.02E23   ✓   digits . digits E digits
1E-9      ✓   digits E - digits
.5        ✗   no digits before the dot
5.        ✗   no digits after the dot
1e        ✗   small e is not allowed here, and no digits follow it`},
      res:'Four strings are numbers; .5, 5. and 1e are not, under this definition.',
      an:'A form with one required box (whole part) and two optional boxes (fraction, exponent). If you fill an optional box, you must fill it completely.', tk:'Required part + optional parts, each written as “something | ε”.',
      n:{say:'This is the same definition as the animation, written out fully so students can copy it. Test each string slowly, pointing at the line of the definition you use. The last slide of today runs the same tests in Python and gets the same answers.', ask:'Change the definition so that 1e5 (small e) is also allowed.', ans:'Write <code>( E | e )</code> instead of E in optExponent, as in the Assignment 1 sample.', watch:'Students think ε means “a space” or “zero”. It means “nothing at all here”.'}},
    {k:'Concept', h:'Handy shorthands', ic:'✂️', p:'These shorthands add no new power; they only make patterns shorter.', pts:[['➕','<b>r⁺</b> one or more: r⁺ = r r*'],['❓','<b>r?</b> zero or one (optional): r? = r | ε'],['[ ]','<b>Character classes:</b> [abc] = a|b|c; [a-z] = a|b|…|z'],['🚫','<b>[^…]</b> any one character except those listed: [^"] = any char but "'],['🎯','So: <code>digit → [0-9]</code>, <code>number → digit⁺ (. digit⁺)? (E [+-]? digit⁺)?</code>']],
      tbl:{cap:'Important points for your exam', h:['Shorthand','Means','Example','Matches'], r:[['r⁺','r r* (one or more)','a⁺','a, aa, aaa (not ε)'],['r?','r | ε (zero or one)','ab?','a, ab'],['[abc]','a | b | c','[abc]x','ax, bx, cx'],['[a-z]','any one small letter','[a-z][0-9]','a1, z9'],['[^…]','any one character not listed','[^"]','x, 5, space (not ")']]},
      an:'Text-message short forms: “pls” for please, “tmrw” for tomorrow. Same meaning, fewer letters.', tk:'Shorthands do not add power, only convenience.',
      n:{say:'Rewrite the id definition with shorthands: <code>id → [A-Za-z_][A-Za-z0-9_]*</code>. Point out that this is exactly what you would type in Python or grep.', ask:'Is <code>digit*</code> the same as <code>digit⁺</code>?', ans:'No. digit* also matches the empty string. For an integer we need at least one digit, so digit⁺.', watch:'<code>[a|b]</code> is a common bug: inside a class | is just a character, so it matches a, b or |.'}},
    {k:'Example', h:'Patterns for trickier tokens', ic:'🧩', code:`ws      → ( blank | tab | newline )⁺
string  → " ( [^"\\\\\\n] | \\\\. )* "         // no raw newline inside
comment → /\\* ( [^*] | \\*+[^*/] )* \\*+/     // C block comment
relop   → &lt; | &gt; | &lt;= | &gt;= | == | !=`, p:'Read the string line as: a quote, then any number of either normal characters (not a quote, backslash or newline) or a backslash followed by any character, then a closing quote.',
      parts:[['ws','Whitespace: one or more blanks, tabs or newlines (skipped, no token).'],['string','A string literal in double quotes (explained on the next slide).'],['comment','A C block comment /* … */ (explained after that).'],['relop','The six relational operators; the lexer returns relop with an attribute saying which.']],
      what:['Each line is one regular definition for one kind of word.','Even long, tricky words are built from the same few operators: | , * , ⁺ , classes and brackets.','The next two slides read the string and comment lines one piece at a time.'],
      res:'Whitespace, strings, comments and operators all have exact patterns.',
      an:'A security guard’s rule for a parcel: it opens with a seal, may contain anything except loose seals, and closes with a seal. A sealed seal inside is fine.', tk:'Even complex words reduce to regular expressions.',
      n:{say:'The string pattern allows escapes like <code>\\"</code> and <code>\\n</code> because of the <code>\\\\.</code> part (a backslash, then any one character). The comment pattern is famous for being tricky: it must stop at the first <code>*/</code>, even after several stars like <code>/* a ** b */</code>.', ask:'Why not write the comment as <code>/\\* .* \\*/</code>?', ans:'Because .* is greedy: with longest match it would run from the first /* to the very last */ in the file, swallowing all the code in between.', watch:'Do not ask students to memorise the comment RE. They should be able to read it slowly, not write it from memory.'}},
    {k:'Example', h:'The string pattern, piece by piece', ic:'🧵', code:`string  → " ( [^"\\\\\\n] | \\\\. )* "`,
      parts:[['"','The opening double quote.'],['[^"\\\\\\n]','Any one character except a quote, a backslash or a newline.'],['|','or'],['\\\\.','A backslash followed by any one character: an escape like <code>\\n</code> or <code>\\"</code>.'],['( … )*','Zero or more of these pieces.'],['" (at the end)','The closing double quote.']],
      what:['Read the opening quote.','Then read normal characters one by one.','If a backslash comes, read it together with the next character as one escape.','Stop at the first quote that is not escaped. A newline before it means the string is broken.'],
      eg:{note:'Tested with Python’s <code>re.fullmatch</code>:', out:`"hi"                ✓
""                  ✓   (zero pieces: the empty string literal)
"say \\"no\\""        ✓   (\\" is an escape, so it does not end the string)
"tab\\t"             ✓
"abc                ✗   (no closing quote)
"a(newline)b"       ✗   (a raw newline is not allowed)`},
      res:'A string literal is one token: from the opening quote to the first unescaped closing quote on the same line.',
      an:'A parcel with a seal at each end. A seal inside the parcel that is wrapped in tape (escaped) does not count as the end.', tk:'Normal characters or escapes, between two quotes, no raw newline.',
      n:{say:'Write <code>"say \\"no\\""</code> on the board and walk through it with a finger: quote, s, a, y, space, backslash+quote (one escape), n, o, backslash+quote, closing quote. The results were checked in Python with the pattern <code>"([^"\\\\\\n]|\\\\.)*"</code>.', ask:'Why must the backslash itself be excluded from the first class?', ans:'Otherwise <code>\\</code> could be read as a normal character and the quote after it would end the string too early. A backslash must always start an escape.', watch:'Students forget the empty string <code>""</code> is a valid literal: * allows zero pieces.'}},
    {k:'Example', h:'The comment pattern, piece by piece', ic:'💬', code:`comment → /\\* ( [^*] | \\*+[^*/] )* \\*+/`,
      parts:[['/\\*','The opening /* (the star is escaped because * is an operator).'],['[^*]','Any one character that is not a star.'],['\\*+[^*/]','One or more stars followed by a character that is neither a star nor a slash: stars that do not end the comment.'],['( … )*','Zero or more of these pieces.'],['\\*+/','One or more stars, then a slash: the end of the comment.']],
      what:['Read the opening /*.','Read any text; stars are fine as long as a slash does not come right after them.','The first time stars are followed by a slash, the comment ends.','It never runs past the first */, even with ** inside.'],
      eg:{note:'Tested with Python (<code>re.match</code> shows the part that is the comment):', out:`/* a ** b */                → the whole text is one comment
/**/                        → one comment (empty inside)
/* x */ y = 1; /* z */      → comment is only  /* x */
                              (the greedy /\\*.*\\*/ would wrongly take everything)`},
      res:'The comment ends at the first */; the code after it is kept.',
      an:'A sign saying “the meeting ends when the bell rings twice”. One ring (a lone star) is not the end; the first double ring (star + slash) is.', tk:'Stop at the first */ : that is what the tricky middle part ensures.',
      n:{say:'Test /* x */ y = 1; /* z */ on the board. With the simple pattern /\\*.*\\*/ and longest match, the lexer would swallow y = 1; as part of one huge comment. Our pattern stops at the first */, so y = 1; reaches the parser.', ask:'Does this pattern allow /* /* */ */ as one comment?', ans:'No. It stops at the first */. The last */ is left over and becomes the tokens * and /. C does not allow nested comments.', watch:'Reading is enough for the exam; do not ask students to write this RE from memory.'}},
    {k:'Concept', h:'The token table: the lexer’s specification', ic:'📋', code:`Lexemes        Token      Attribute
any ws         —          —   (no token returned)
if             if         —
then / else    then/else  —
any id         id         pointer to table entry
any number     number     pointer to table entry
&lt;              relop      LT
&lt;=             relop      LE
=              relop      EQ    (= means "equals" here)
&lt;&gt;             relop      NE
&gt;              relop      GT
&gt;=             relop      GE`,
      parts:[['Lexemes','What the lexer sees in the program (one lexeme or a whole pattern such as “any id”).'],['Token','The token name it returns to the parser.'],['Attribute','The extra value returned with it, or — for none.'],['ws row','Whitespace: no token at all; the lexer just skips it.'],['relop rows','Six lexemes share one token; the attribute LT, LE, EQ, NE, GT, GE tells them apart.']],
      what:['The lexer finds the next lexeme using the patterns.','It looks up the matching row of the table.','It returns that row’s token with that row’s attribute.','For ws it returns nothing and goes on to the next lexeme.'],
      eg:{note:'Input: <code>if count &lt;&gt; 0 then total</code>', out:`⟨if⟩ ⟨id, →count⟩ ⟨relop, NE⟩ ⟨number, →0⟩ ⟨then⟩ ⟨id, →total⟩

(the four blanks matched ws and gave no tokens)`},
      res:'The table says exactly what the lexer returns for every kind of lexeme.',
      an:'The rule book of a cricket scorer: for each kind of event, what to write on the scorecard and what extra detail to note.', tk:'This table is the specification the scanner must implement.',
      n:{say:'This is the small Pascal-like language of the Dragon book: = is comparison and &lt;&gt; means “not equal”. In C these would be == and !=. Each row pairs a pattern with the token and attribute the lexer returns. Assignment 1 asks for exactly this kind of table for MiniC.', ask:'Why does ws have no token?', ans:'Whitespace only separates words. The lexer skips it and goes on to find the next real token.', watch:'Students forget the attribute column. For relop the attribute tells the parser which comparison it was.'}},
    {k:'Animation', h:'Lexical errors', demo:'lexerr', p:'A <b>lexical error</b> happens when no pattern matches the next characters. The lexer reports it and recovers, often by deleting characters until a token can start (<b>panic mode</b>).', an:'A proof-reader who meets a smudge: she marks it, skips it, and carries on, instead of throwing away the whole page.', tk:'The lexer reports what it can and leaves the rest to later phases.',
      n:{say:'Step through. The key row is <code>fi (a == b)</code>: fi is a perfectly good identifier, so the lexer is happy. The parser or semantic analyser will complain later. The lexer only sees characters, not meaning.', ask:'What other repairs can a lexer try?', ans:'Insert a missing character, replace one character, or swap two neighbouring characters. Real lexers mostly delete and report.', watch:'Students call every typo a lexical error. A typo that still forms valid tokens is not a lexical error.'}},
    {k:'Example', h:'Lexical errors in real gcc messages', ic:'🧯', code:`int main() {
    int x = 5 @ 3;
    return 0;
}`,
      parts:[['@','A character that starts no C token: no pattern matches it.'],['stray ‘@’ in program','gcc’s lexical error message: a character that does not belong.'],['prog.c:2:15','File, line 2, column 15: where the @ is.']],
      what:['The lexer reads int, x, =, 5 as normal tokens.','At @ no pattern matches, so it reports an error.','It recovers by deleting the @ (panic mode) and goes on with 3 and ;.','More errors may follow, because <code>5 3</code> is not a correct expression for the parser.'],
      eg:{note:'gcc’s first message (wording can differ slightly by version):', out:`prog.c:2:15: error: stray ‘@’ in program`},
      tbl:{cap:'Important points for your exam', h:['Input','Lexical error?','What happens'], r:[['<code>x = 5 @ 3;</code>','Yes: @ matches no pattern','Report “stray @”, delete it, go on'],['<code>s = "abc;</code>','Yes: string never closed','Report “missing terminating \" character”'],['<code>fi (a == b)</code>','No: fi is a valid identifier','A later phase complains'],['<code>a+++++b</code>','No: all tokens are valid','Parser / semantic check complains']]},
      res:'A lexical error = characters that fit no pattern; the lexer reports, recovers, and continues.',
      an:'A cashier finds a coin from another country in the till: she sets it aside, notes it, and keeps counting the rest.', tk:'No pattern matches → lexical error → report and recover.',
      n:{say:'Column 15: count the 4 spaces, then <code>int x = 5 </code> (10 more characters), so @ is the 15th character. For the unclosed string gcc says “missing terminating " character”. Link back to the lexerr animation: fi is fine for the lexer.', ask:'Why does deleting a character usually work?', ans:'Most lexical errors are one stray or mistyped character. Deleting it lets the lexer find the next real token and keep going, so more errors are found in one run.', watch:'Students say a missing semicolon is a lexical error. It is a syntax error: all the tokens are valid; one is missing.'}},
    {k:'Concept', h:'What regular expressions cannot do', ic:'🚫', p:'Regular expressions cannot count without limit. They cannot describe <b>balanced brackets</b> like ((( ))) of any depth, or comments nested inside comments. Such structures need a <b>context-free grammar</b> (Week 5).',
      eg:{note:'Write ( as L and ) as R. Try two REs:', out:`RE        LLR (not balanced)    LLRR (balanced)
L*R*      accepts  ✗ wrong      accepts ✓
(LR)*     rejects  ✓            rejects ✗ wrong`},
      res:'Every RE fails for some depth of nesting; balanced brackets need a grammar (a stack).',
      an:'Counting people entering a hall with fingers only: you can count up to ten. For any bigger crowd you need a notebook. REs have only fingers; grammars have the notebook (a stack).', tk:'Regular = finite memory. Nesting needs a stack.',
      n:{say:'Ask a student to write an RE for “equal numbers of ( and )”. Write ( as the symbol L and ) as R. Try <code>L*R*</code>: it accepts LLR, which is not balanced. Try <code>(LR)*</code>: it rejects LLRR, which is balanced. Every attempt fails for deep enough nesting. This is why matching brackets is the parser’s job, not the lexer’s.', ask:'Then how do C lexers handle <code>/* /* */ */</code>?', ans:'C does not allow nested comments: the first */ ends the comment, and the final */ becomes two tokens (* and /), usually a syntax error.', watch:'Students think “REs are weak”. They are perfect for words; grammars are for sentence structure.'}},
    {k:'Example', h:'Regular expressions in a real tool', ic:'🐍', p:'Python’s <code>re</code> module uses the same ideas. <code>re.fullmatch</code> says whether the <b>whole</b> string fits the pattern.', code:`&gt;&gt;&gt; import re
&gt;&gt;&gt; ident = r'[A-Za-z_][A-Za-z0-9_]*'
&gt;&gt;&gt; bool(re.fullmatch(ident, 'total_2'))
True
&gt;&gt;&gt; bool(re.fullmatch(ident, '2total'))
False
&gt;&gt;&gt; number = r'[0-9]+(\\.[0-9]+)?(E[+-]?[0-9]+)?'
&gt;&gt;&gt; [s for s in ['12','3.14','6.02E23','1E-9','.5','5.'] if re.fullmatch(number, s)]
['12', '3.14', '6.02E23', '1E-9']`,
      parts:[['import re','Load Python’s regular-expression module.'],['r\'…\'','A raw string: backslashes are kept as they are.'],['[A-Za-z_]','One letter or underscore (letter_).'],['[A-Za-z0-9_]*','Zero or more letters, digits or underscores.'],['re.fullmatch(p, s)','Does the <b>whole</b> string s fit pattern p? Gives a match or None.'],['bool(…)','Turns the match into True, None into False.'],['\\.','A real dot (a plain . means any character).'],['[s for s in [...] if …]','Keep only the strings that match.']],
      what:['ident is our id definition written with shorthands.','total_2 fits; 2total does not (it starts with a digit).','number is our number definition with ⁺ written as + and ? for optional parts.','The list keeps the four strings that fit; .5 and 5. are dropped.'],
      res:'Python gives the same answers we found by hand.',
      an:'A theory lesson on traffic rules, followed by a real driving test. Here the test confirms the theory.', tk:'The same patterns run in Python, grep, editors and lexer generators.',
      n:{say:'Type this in a Python shell live; it takes two minutes. Point out <code>\\.</code>: in Python regex, a plain dot means “any character”, so a real dot must be escaped. The output matches what we found by hand on the numbers slide: .5 and 5. are rejected.', ask:'What is the r before the quotes?', ans:'A raw string: Python leaves backslashes as they are, so <code>\\.</code> reaches the regex engine unchanged.', watch:'<code>re.match</code> only checks the start of the string; <code>re.fullmatch</code> checks the whole string. For tokens, use fullmatch.'}},
    {k:'Summary', h:'Regular expressions (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Symbol / idea','Meaning','Example','Matches'], r:[['ε','The empty string (length 0)','a ε','a'],['r | s','r or s (union)','a | bc','a, bc'],['rs','r then s (concatenation)','ab','ab'],['r*','zero or more r (Kleene closure)','ab*','a, ab, abb, …'],['r⁺','one or more r (positive closure)','digit⁺','0, 42, 007'],['r?','zero or one r','ab?','a, ab'],['[a-z], [^"]','character class; “any except”','[0-9][0-9]','42, 07'],['Precedence','* first, then concatenation, then |','a|b*c','a, c, bc, bbc'],['Regular definition','Named REs, each using earlier names','id → letter_ (letter_|digit)*','x2, _count']]},
      res:'With these nine rows you can write and read the pattern of any token.',
      an:'The list of road signs at the back of a driving book: learn each sign once, and you can read any road.', tk:'Operators |, concatenation, *, plus shorthands ⁺, ?, [ ]; precedence * > concatenation > |.',
      n:{say:'Cover the Matches column and ask students to fill it in. Then ask for one string that does NOT match each example.', ask:'Which row explains why digit* is wrong for integers?', ans:'The r* row: zero or more, so it matches the empty string. Use digit⁺.', watch:'Students mix up ε (empty string) and ∅ (empty language). ε is a string; ∅ is a set with no strings.'}}
  ],
  lab:{t:'Lab: write and test regular definitions', steps:['Write regular definitions for: C identifiers, integer constants, floating constants with optional exponent, string literals, and // comments.','Test each with <code>grep -E</code>, an online regex tester, or a few lines of Python <code>re.fullmatch</code>.','List 3 strings that should match and 3 that should not for each definition.','Check the number definition with: 12, 3.14, 6.02E23, 1E-9, .5, 5., 1e.'], out:'A table of definitions with test cases and pass/fail results.',
    n:{say:'Expected results for step 4 with the lecture’s definition: 12, 3.14, 6.02E23 and 1E-9 match; .5, 5. and 1e do not. A sample // comment pattern: <code>//[^\\n]*</code> (two slashes, then anything up to the end of the line).', ask:'C accepts <code>.5</code> and <code>5.</code> as numbers. Is our definition wrong?', ans:'It is a design choice. Our definition is simpler; to accept them you could write <code>digit⁺ . digit* | . digit⁺</code> for the fraction part. Discuss which the class prefers.', watch:'Students test with re.search or re.match and get “matches” for strings like 12abc. Insist on fullmatch, or ^…$ anchors with grep.'}},
  disc:['Is <code>.5</code> a valid number in your definition? Should it be?','Why are nested comments hard for a regular-expression scanner?','Which is clearer: a long regular expression, or regular definitions? Why?'],
  mistakes:['Writing digit* for "one or more digits". That also matches the empty string.','Forgetting that * binds tighter than concatenation: ab* is a(b*), not (ab)*.','Using | inside a character class: [a|b] also matches |.','Allowing a raw newline inside a string literal.','Confusing ε (the empty string) with ∅ (the empty language) or with a space.'],
  rev:['A language is a set of strings over an alphabet.','REs use union |, concatenation and closure *.','Precedence: * > concatenation > |.','Regular definitions name sub-patterns: id → letter (letter|digit)*.','Shorthands: r⁺, r?, [a-z]. REs cannot express unbounded nesting.'],
  hw:'Start Assignment 1. Read Dragon book §3.3.',
  check:[
    {q:'Which RE describes binary strings (over {0, 1}) that <b>start</b> with 1?', o:['1(0|1)*','(0|1)*1','1*','(0|1)1*'], a:0, e:'First a 1, then any mix of 0s and 1s. (0|1)*1 describes strings that end with 1.'},
    {q:'Why is <code>digit*</code> a wrong pattern for integer constants?', o:['It does not allow 0','It also matches the empty string','It allows letters','It is not a regular expression'], a:1, e:'* means zero or more, so the empty string matches. Use digit⁺ (= digit digit*).'},
    {q:'What does <code>a|bc</code> mean?', o:['(a|b)c','a|(bc)','(a|b)|c','abc'], a:1, e:'Concatenation binds tighter than |, so it is a, or bc.'}],
  quiz:[
    {q:'Which RE denotes "one or more digits"?', o:['digit*','digit digit*','digit?','(digit)|ε'], a:1, e:'digit digit* = digit⁺.'},
    {q:'ab* matches…', o:['abab','abbb','ba','ε'], a:1, e:'a followed by zero or more b.'},
    {q:'(a|b)*abb matches…', o:['abba','babb','abab','bbb'], a:1, e:'It must end in abb.'},
    {q:'Which can regular expressions <b>not</b> describe?', o:['Identifiers','Floating-point numbers','Balanced parentheses of any depth','Keywords'], a:2, e:'Needs unlimited counting (a stack).'},
    {q:'Precedence from highest to lowest is…', o:['| , concatenation, *','*, concatenation, |','concatenation, *, |','all equal'], a:1, e:'Closure binds tightest.'},
    {q:'If L = {a, b} and D = {0, 1}, how many strings are in LD?', o:['2','4','6','Infinitely many'], a:1, e:'One from L then one from D: a0, a1, b0, b1.'},
    {q:'<code>[^"]</code> matches…', o:['Only the character "','Any one character except "','A caret followed by "','Nothing'], a:1, e:'[^…] means any single character not in the list.'}],
  assessment:{ kind:'assignment', title:'Assignment 1 — Lexical Specification of a Mini Language', covers:'Weeks 1–2: phases, tokens, patterns, lexemes, regular expressions, lexical errors',
    instructions:['Work individually. Hand-written or typed; code may be in C, C++, Java or Python.','Show all working; a final answer without steps gets little credit.','Submission date and marks are announced by the instructor.'],
    scenario:'You are designing the scanner for <b>MiniC</b>, a small C-like language with keywords <code>int float if else while return</code>, identifiers, integer and float constants, the operators <code>+ - * / = == != &lt; &lt;= &gt; &gt;= &amp;&amp; ||</code>, punctuation <code>( ) { } ; ,</code>, string literals and // comments.',
    tasks:['Explain in your own words the six phases of a compiler using the statement <code>avg = (a + b) / 2</code>; show the output of each phase.','Write a table of every MiniC token: token name, informal pattern, sample lexemes, attribute.','Write regular definitions for identifiers, int constants, float constants (with optional exponent), strings and comments.','Tokenize the program below and list the symbol table:<br><code>int main() { float avg = 0; while (n &gt;= 1) { avg = avg + n / 2.5; n = n - 1; } return 0; }</code>','Give three examples of lexical errors in MiniC and the recovery action for each.','<b>Programming:</b> write a small program that reads a MiniC file and prints each token with its line number (you may use regular-expression libraries).'],
    submission:['A PDF with tasks 1–5 and the source code for task 6.','Screenshot of your program running on the sample program.','Name and roll number on the first page.'],
    reflection:['Which token class was hardest to specify? Why?','How did you handle keywords vs identifiers?'],
    example:'<b>Sample row for Task 2:</b> token <code>relop</code> · pattern: &lt; | &lt;= | &gt; | &gt;= | == | != · lexemes: &lt;=, != · attribute: LT/LE/GT/GE/EQ/NE.<br><b>Sample regular definition:</b> <code>float → digit⁺ . digit⁺ ( (E|e) (+|-)? digit⁺ )?</code>',
    note:'Copied work receives zero. Discuss ideas, not code.' },
  terms:[['Alphabet','A finite set of symbols, written Σ.'],['String','A finite sequence of symbols from an alphabet.'],['Empty string (ε)','The string of length zero.'],['Language','A set of strings over an alphabet.'],['Regular expression','Notation using union, concatenation and closure to describe a regular language.'],['Kleene closure','r*: zero or more concatenations of r.'],['Positive closure','r⁺: one or more concatenations of r.'],['Regular definition','A sequence of named regular expressions, each using earlier names.'],['Character class','Shorthand [a-z] for a union of characters.'],['Lexical error','An input sequence that cannot form any token.'],['Precedence','The order in which RE operators apply: * first, then concatenation, then |.']]
},
/* ================= WEEK 3 ================= */
{ id:5, week:3, unit:'Finite automata', ic:'🤖', lo:[2], book:'Louden Ch. 2.3–2.4 · Dragon Ch. 3.6–3.7',
  title:'Finite Automata and From Regular Expressions to Automata',
  sub:'NFA and DFA, simulating a DFA, Thompson’s construction (RE → NFA), subset construction (NFA → DFA), minimisation idea.',
  introH:'From a pattern on paper to a machine that checks it',
  intro:'A regular expression <i>describes</i> tokens; it does not check anything by itself. A <b>finite automaton</b> is a tiny machine that reads text one character at a time and says yes or no. Today we turn patterns into these machines, exactly as Lex does inside.',
  introAn:'A recipe describes a cake; an oven actually bakes it. The regular expression is the recipe, the automaton is the oven.',
  introN:{say:'Draw a turnstile at a metro station: locked; insert token → unlocked; push → locked again. Ask: how many “situations” can it be in? Two. That is a finite automaton: a few states and rules for moving between them. Today’s machines read characters instead of tokens and pushes.', ask:'Why do we need a machine at all? Python already has regex.', ans:'Python’s regex engine is itself built on automata ideas. A compiler’s lexer must be extremely fast, so tools like Lex build a DFA that does one table lookup per character.', watch:'This lecture is algorithm-heavy. Go slowly, do every step on the board, and keep the same example, (a|b)*abb, from start to end.'},
  obj:['Define NFA and DFA and draw their transition graphs and tables.','Simulate a DFA on an input string.','Convert a regular expression to an NFA with Thompson’s construction.','Convert an NFA to a DFA with the subset construction (ε-closure and move).','Explain why DFAs are used in real scanners.'],
  bloom:{head:['<b>Distinguish</b> NFA from DFA.','<b>Apply</b> Thompson’s construction and the subset construction.','<b>Evaluate</b> the cost of NFA vs DFA simulation.'],
    heart:['<b>Enjoy</b> seeing theory turn into a working algorithm.','<b>Value</b> systematic, step-by-step work to avoid errors.'],
    hand:['<b>Draw</b> transition graphs neatly.','<b>Fill</b> a subset-construction table by hand and check it.']},
  slides:[
    {k:'Concept', h:'Today’s journey: pattern → machine', ic:'🗺️', p:'A lexer generator such as <b>Lex</b> turns each token pattern into a fast checking machine in three steps. We learn each step today, always with the same example: <code>(a|b)*abb</code>, “any string of a’s and b’s that ends in abb”.', ex:'regular expression  →(Thompson)→  NFA  →(subset construction)→  DFA  →(minimise)→  smallest DFA → table in the lexer',
      parts:[['( … )','Brackets group a part of the pattern'],['a|b','One character: a or b'],['(a|b)*','Zero or more such characters: any string of a’s and b’s, even the empty one'],['abb','Then exactly the three characters a, b, b at the end']],
      eg:{note:'Which strings match <code>(a|b)*abb</code>?', out:`abb ✔   aabb ✔   babb ✔   bababb ✔
abab ✘  abba ✘   ab ✘`},
      res:'Our running example: all strings over {a, b} that end in abb.',
      an:'Turning an idea into a product: a sketch (RE), a rough prototype (NFA), a factory model (DFA), then a cheaper, slimmer model (minimised DFA).', tk:'RE → NFA → DFA → minimal DFA: today’s whole lecture in one line.',
      n:{say:'Write the chain across the top of the board and leave it there. Tick each arrow as you finish it during the lecture. Remind the class what <code>(a|b)*abb</code> means from last lecture: abb, aabb, babb are in; abab and abba are out.', ask:'Why not go straight from RE to DFA?', ans:'There are direct methods, but RE → NFA is very simple and mechanical, and NFA → DFA is a separate simple algorithm. Two easy steps beat one hard step.', watch:'Students lose track of which step they are in. Keep pointing back at this chain.'}},
    {k:'Concept', h:'What is a finite automaton?', ic:'🤖', p:'A <b>finite automaton</b> (FA) is a machine with a fixed number of <b>states</b> (situations). It starts in the <b>start state</b>, reads the input one symbol at a time, and follows a <b>transition</b> (an arrow) for each symbol. If it ends in an <b>accepting state</b>, the answer is yes.', pts:[['⭕','A state is drawn as a circle; an accepting state as a double circle.'],['➡️','A transition is an arrow labelled with a symbol.'],['🧮','Formally FA = (S, Σ, δ, s₀, F): states, alphabet, <b>transition function</b>, start state, accepting states.']], an:'A board game like Ludo: you are always on one square (state); each dice roll (symbol) tells you which square to move to; reaching home (accepting state) means you win.', tk:'States + arrows + a start + accepting states = a finite automaton.',
      n:{say:'δ (“delta”) is just the arrow rule written as a function: δ(state, symbol) = next state. “Finite” means the number of states is fixed in advance; the machine has no other memory.', ask:'What if there is no arrow for the symbol I read?', ans:'The machine gets stuck and the string is rejected. We often draw an extra dead state to make this explicit.', watch:'Accepting means “ends in an accepting state after reading the whole input”, not “passes through one”.'}},
    {k:'Example', h:'A first automaton: identifiers', ic:'🪪', p:'This machine accepts <code>letter ( letter | digit )*</code>. From state 0 a letter leads to state 1 (accepting). In state 1, letters and digits loop back to 1. A digit in state 0 has no arrow, so it goes to a <b>dead state</b>: rejected forever.', code:`            letter          letter, digit
   start → (0) ───────→ ((1)) ⟲

   "x2" :  0 ─x→ 1 ─2→ 1    ends in 1 → accept ✔
   "2x" :  0 ─2→ dead       no way back  → reject ✘`,
      parts:[['start →','The small arrow that shows where reading begins (state 0)'],['(0)','State 0, a single circle: not accepting'],['((1))','State 1, a double circle: accepting'],['──letter──▶','Arrow from 0 to 1: taken when the character is a letter'],['⟲ letter, digit','Self-loop on state 1: stay in 1 on any letter or digit'],['dead','An extra hidden state for every missing arrow; once there, the string is rejected']],
      what:['Start in state 0.','Read the first character. A letter moves us to state 1; anything else goes to the dead state.','In state 1, every letter or digit keeps us in state 1.','When the input ends, look at the state: 1 means accept, anything else means reject.'],
      eg:{note:'Input <code>count</code>:', out:`0 ─c→ 1 ─o→ 1 ─u→ 1 ─n→ 1 ─t→ 1
ends in state 1 (double circle) → accepted ✔`},
      res:'This two-state machine accepts exactly the identifiers <code>letter (letter | digit)*</code>.',
      an:'A security gate: your first step must be with an ID card (letter). After that, the corridor lets both staff and visitors (letters and digits) through.', tk:'Read each character, follow its arrow, check where you end.',
      n:{say:'Draw this on the board with real circles: single circle 0 with an arrow from “start”, double circle 1 with a self-loop. Trace “x2”, “count”, “2x”. Compare with the RE from last lecture: the machine and the pattern describe the same language.', ask:'Is the empty string accepted?', ans:'No. With no input we stay in state 0, which is not accepting. That matches the pattern: an identifier needs at least one letter.', watch:'Students draw the self-loop on state 0. The loop belongs to state 1; state 0 must see a letter first.'}},
    {k:'Concept', h:'The five parts: <code>FA = (S, Σ, δ, s₀, F)</code>', ic:'🧩', code:`FA = (S, Σ, δ, s₀, F)

The identifier machine written in this form:
S  = {0, 1}
Σ  = {letter, digit}
δ(0, letter) = 1     δ(1, letter) = 1     δ(1, digit) = 1
s₀ = 0
F  = {1}`,
      parts:[['FA','Finite automaton: the whole machine'],['S','The set of all states (a fixed, finite number of circles)'],['Σ','The alphabet: the symbols the machine can read'],['δ','The transition function: δ(state, symbol) = next state (the arrows)'],['s₀','The start state: where reading begins'],['F','The set of accepting states (the double circles)']],
      what:['Start in s₀.','Read one symbol of the input.','Use δ to find the next state.','Repeat until the input is finished.','Accept if the last state is in F; otherwise reject.'],
      eg:{note:'Input <code>x2</code> on the identifier machine:', code:`δ(0, x) = δ(0, letter) = 1
δ(1, 2) = δ(1, digit)  = 1`, out:`last state = 1, and 1 ∈ F  →  accepted ✔`},
      res:'Five parts describe any finite automaton completely. The drawing and the table are just two ways to show the same five parts.',
      an:'A bus route card: the list of stops (S), the kinds of tickets (Σ), the rule “from this stop with this ticket go to that stop” (δ), the first stop (s₀) and the stops where you may get off (F).', tk:'S, Σ, δ, s₀, F: states, alphabet, arrows, start, accepting.',
      n:{say:'Write the five letters down the side of the board and match each one to the drawing on the previous slide: point at the circles (S), the arrow labels (Σ), the arrows (δ), the start arrow (s₀) and the double circle (F). Note that δ(0, digit) is not listed: that missing arrow is the dead state. Exam questions often say “give the 5-tuple of this automaton”.', ask:'What is the 5-tuple of the DFA for (a|b)*abb with states 0–3?', ans:'S = {0,1,2,3}, Σ = {a,b}, δ = the table on the next slide, s₀ = 0, F = {3}.', watch:'Students write F = 1 instead of F = {1}. F is a set: a machine may have several accepting states.'}},
    {k:'Concept', h:'DFA: exactly one way to go', ic:'🛤️', p:'In a <b>DFA</b> (deterministic finite automaton) every state has <b>exactly one</b> transition for each input symbol, and there are no ε-moves. So the next state is always certain. A DFA is easy to store as a <b>transition table</b>.', code:`DFA for (a|b)*abb
state   a   b
  0     1   0
  1     1   2
  2     1   3
 *3     1   0        (* = accepting)`,
      parts:[['state','The row: the state the machine is in now'],['a','Column: the next state when the character read is a'],['b','Column: the next state when the character read is b'],['0','Start state: nothing useful seen yet'],['1','We have just seen a'],['2','We have just seen ab'],['*3','Accepting state (the star): we have just seen abb']],
      what:'To use the table, find the row of the current state, then the column of the character you read. The cell gives the next state. Every cell is filled, so there is never a choice and never a missing move.',
      eg:{note:'Look up two cells:', code:`δ(2, b) = ?
δ(3, a) = ?`, out:`δ(2, b) = 3    (…ab + b = …abb → accepting)
δ(3, a) = 1    (…abb + a now ends in a)`},
      res:'A DFA is fully described by one table: rows = states, columns = symbols, cells = next states.',
      an:'A train on rails: at each station there is only one track for each signal. The driver never has to choose.', tk:'One state, one symbol → one next state. A table says it all.',
      n:{say:'Read the table as arrows: “from 0 on a go to 1”, etc. Explain the idea of each state: 0 = nothing useful seen yet, 1 = just saw a, 2 = just saw ab, 3 = just saw abb. Draw the graph from the table on the board.', ask:'In state 3, why does b go back to 0 and not stay?', ans:'After abb, reading b gives …abbb, which ends in bb. The last a is too far back, so we have nothing useful: state 0.', watch:'Every row must have an entry for every symbol. A missing entry means a dead state, which should be written in.'}},
    {k:'Concept', h:'Running a DFA: a tiny loop', ic:'🔁', p:'Simulating a DFA needs only a loop and the table: one lookup per character. Below, the algorithm and a hand trace of <code>abab</code>.', code:`s = start
for each character c of the input:
    s = table[s][c]
accept if s is an accepting state

Trace "abab":  0 ─a→ 1 ─b→ 2 ─a→ 1 ─b→ 2
Ends in 2, not accepting → reject ✘`,
      parts:[['s = start','Begin in the start state (state 0)'],['for each character c','Read the input from left to right, one character at a time'],['table[s][c]','Look up row s, column c of the transition table'],['s = table[s][c]','Move to that next state'],['accept if …','Only after the LAST character: is s an accepting state?']],
      what:['Set s to the start state.','Take the next character c and replace s by table[s][c].','Repeat for every character of the input.','At the end, accept if s is accepting, otherwise reject.'],
      eg:{note:'Input <code>babb</code> with the table of the previous slide:', out:`0 ─b→ 0 ─a→ 1 ─b→ 2 ─b→ 3
ends in 3 (accepting) → accepted ✔   (babb ends in abb)`},
      res:'One table lookup per character: a DFA checks a string of length n in n steps.',
      an:'Following directions written on a card: “at the mosque turn left, at the bakery turn right”. You never stop to think; you just follow the card.', tk:'Time = one step per character: O(n).',
      n:{say:'Do the trace on the board with a moving finger on the table. Then trace <code>babb</code>: 0 ─b→ 0 ─a→ 1 ─b→ 2 ─b→ 3, accepted. This loop is literally the heart of a table-driven scanner (Week 4).', ask:'Does the length of the regular expression affect the speed?', ans:'No. Running a DFA costs one table lookup per character, however complicated the pattern was.', watch:'Students stop early when they reach state 3 in the middle of the input. Accept only if you are in an accepting state after the last character.'}},
    {k:'Animation', h:'Watch a DFA run on “aabb”', demo:'dfarun', an:'A token moving along a Ludo board, one square per dice roll.', tk:'aabb: 0 → 1 → 1 → 2 → 3, accepted.',
      n:{say:'Let students predict each next state before you press Step. Ask why the second a keeps us in state 1: we have still “just seen an a”.', ask:'What happens with “aabba”?', ans:'From 3, reading a goes to 1. The input ends in state 1, so it is rejected (it ends in bba, not abb).', watch:'Check that the arrows in the animation match the table on the previous slide; they are the same machine.'}},
    {k:'Animation', h:'NFA: choices and free moves', demo:'nfa', p:'An <b>NFA</b> (nondeterministic finite automaton) may have <b>several</b> arrows for one symbol, and <b>ε-transitions</b> that move without reading anything. This freedom is called <b>non-determinism</b>. An NFA accepts if <b>at least one</b> path ends in an accepting state.', an:'Exploring a maze with friends: at each fork you split up. If any friend reaches the exit, the group succeeds.', tk:'NFA: choices and ε-moves allowed; accept if any path succeeds.',
      n:{say:'Step through. The NFA for (a|b)*abb has only 4 states and is very easy to read: loop in 0 on anything, then go 0 ─a→ 1 ─b→ 2 ─b→ 3. The machine “guesses” when the final abb starts.', ask:'A real computer cannot guess. How do we run an NFA?', ans:'We follow all choices at once by keeping a set of current states. That is the next slide.', watch:'Students think an NFA rejects if one path fails. Only if all paths fail is the string rejected.'}},
    {k:'Example', h:'Running an NFA: keep a set of states', ic:'🧺', p:'To run the 4-state NFA, keep the <b>set</b> of all states it could be in. After each character, move every state in the set. Accept if the final set contains an accepting state.', code:`NFA:  0 ─a,b→ 0    0 ─a→ 1    1 ─b→ 2    2 ─b→ 3 (accepting)

Input "aabb":
  start      {0}
  read a  →  {0, 1}
  read a  →  {0, 1}       (1 has no a-arrow; that path dies)
  read b  →  {0, 2}
  read b  →  {0, 3}       contains 3 → accept ✔`,
      parts:[['0 ─a,b→ 0','State 0 loops on a and on b: it is always still possible'],['0 ─a→ 1','On a, state 0 may also “guess” that the final abb starts here'],['{0}','The set of possible states before reading anything'],['read a → {0, 1}','Each state in the set follows all its a-arrows; the results are joined'],['path dies','A state with no arrow for the symbol simply drops out of the set'],['{0, 3}','The final set; it contains the accepting state 3']],
      what:['Start with the set {start state}.','For each character, move every state in the set along every arrow with that label.','Join all the results into the new set.','At the end, accept if the set contains at least one accepting state.'],
      eg:{note:'Input <code>abab</code>:', out:`{0} ─a→ {0, 1} ─b→ {0, 2} ─a→ {0, 1} ─b→ {0, 2}
final set {0, 2} has no 3 → rejected ✘   (abab does not end in abb)`},
      res:'Running an NFA = tracking a set of states. Each such set will become one DFA state later.',
      an:'A shopkeeper who does not know which bus his delivery boy took, so he tracks every possible bus at once until one arrives.', tk:'An NFA can be run by tracking a set of states; this idea becomes the subset construction.',
      n:{say:'Do this live on the board. Point out that each set, like {0, 2}, behaves like one state of a DFA. If we work out all possible sets in advance, we get a DFA. That is exactly the subset construction we do later.', ask:'Why is running an NFA this way slower than a DFA?', ans:'At every character we update a whole set of states, not one state. For a pattern of size r, that can cost about r steps per character.', watch:'Students forget to keep state 0 in the set: the loop on 0 means 0 is always still possible.'}},
    {k:'Comparison', h:'NFA or DFA?', cmp:[['🌿 NFA',['Several arrows on one symbol allowed','ε-transitions allowed','Few states; easy to build from an RE','Running it: about |r| × |x| steps (r = pattern, x = input)']],['🛤️ DFA',['Exactly one arrow per symbol','No ε-transitions','May need more states (in the worst case 2ⁿ for an n-state NFA)','Running it: |x| steps, one per character']]], an:'A hand-drawn sketch map (NFA) is quick to make but slow to use; a printed road atlas (DFA) takes effort to make but is fast to follow.', tk:'Build an NFA, convert it to a DFA, run the DFA.',
      n:{say:'Both machines accept exactly the same kind of languages: anything a regular expression can describe. The difference is cost: NFA is cheap to build, DFA is cheap to run. A lexer is built once and run on millions of characters, so we pay once to build a DFA.', ask:'Is every DFA also an NFA?', ans:'Yes. A DFA is simply an NFA that happens to have no choices and no ε-moves.', watch:'2ⁿ states is the worst case. For real token patterns the DFA is usually about the same size as the NFA.'}},
    {k:'Summary', h:'NFA vs DFA (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Point','NFA','DFA'], r:[['Arrows for one symbol','Zero, one or several','Exactly one'],['ε-moves','Allowed','Not allowed'],['When is a string accepted?','If at least one path ends in an accepting state','If the single path ends in an accepting state'],['Number of states','Few','More (worst case 2ⁿ for an n-state NFA)'],['Cost to run on input x','About |r| × |x| steps (track a set)','|x| steps (one lookup per character)'],['Easy to build from an RE?','Yes (Thompson’s construction)','Not directly; built from the NFA'],['Role in Lex','Middle step','What the final scanner runs']]},
      what:'Both machines recognise exactly the same languages (the regular languages). We build the NFA because it is easy, then convert it to a DFA because the DFA is fast.',
      res:'NFA = easy to build; DFA = fast to run; Lex builds the first and runs the second.',
      an:'A rough sketch of a house and the final building plan: same house, but only the plan is used on the building site.', tk:'Same power, different cost: build NFA, run DFA.',
      n:{say:'Cover the NFA and DFA columns and ask the class to fill them in row by row. This table is a typical 5-mark short question: “Differentiate NFA and DFA.” Ask for at least four points.', ask:'Can an NFA recognise a language that no DFA can?', ans:'No. Every NFA can be turned into a DFA with the subset construction, so both recognise exactly the regular languages.', watch:'Students write “NFA is more powerful”. It is more convenient, not more powerful.'}},
    {k:'Concept', h:'Thompson’s construction: the rules', ic:'🧱', p:'<b>Thompson’s construction</b> builds an NFA from an RE piece by piece, with one small rule for each part of the RE.', pts:[['ε','For ε: start ─ε→ final.  For a symbol a: start ─a→ final.'],['|','For s|t: a new start with ε-arrows into N(s) and N(t); ε-arrows from both finals to a new final.'],['··','For st: the final state of N(s) becomes the start state of N(t).'],['*','For s*: a new start and final, with ε-arrows to enter N(s), to repeat it, and to skip it.']], an:'LEGO again: a small standard brick for each symbol, and a standard connector piece for “or”, “then” and “repeat”.', tk:'One rule per operator; combine the small NFAs bottom-up.',
      n:{say:'Draw each rule on the board as a small picture before the animation. N(s) means “the NFA already built for s”. Every NFA built this way has one start state, one accepting state with no arrows leaving it, and at most two arrows leaving any state.', ask:'Why so many ε-arrows? They seem wasteful.', ans:'They make the rules simple and mechanical: any RE can be converted without thinking. The extra states disappear later in the subset construction.', watch:'In the star rule students forget the “skip” arrow (start ─ε→ final). Without it, s* would not accept ε.'}},
    {k:'Rule 1', h:'Thompson rule 1: <code>ε</code> and one symbol <code>a</code>', ic:'🧱', code:`N(ε):   start → (i) ──ε──▶ ((f))
N(a):   start → (i) ──a──▶ ((f))`,
      parts:[['N(…)','“The NFA for …”'],['i','A new start state'],['f','A new accepting (final) state'],['──ε──▶','A free move: no input character is read'],['──a──▶','A move that reads exactly one a']],
      what:'For ε we make two new states joined by an ε-arrow. For one symbol a we make two new states joined by an a-arrow. These are the smallest bricks: every symbol in the regular expression gets its own brick.',
      eg:{note:'Test N(a) on three inputs:', out:`"a"   i ─a→ f                          accepted ✔
""    we stay in i (not final)            rejected ✘
"aa"  i ─a→ f, no arrow for the 2nd a     rejected ✘`},
      res:'Each symbol becomes a tiny 2-state NFA that accepts just that one symbol.',
      an:'Single LEGO bricks: one brick for each letter of the pattern, before anything is joined.', tk:'ε → one ε-arrow; a → one a-arrow; always 2 new states.',
      n:{say:'Draw both pictures. Say: in (a|b)*abb the symbol a appears twice and b three times, so we make five separate bricks, even though they look the same. Each brick gets its own two state numbers.', ask:'Why does N(a) not accept the empty string?', ans:'With no input we stay in i, and i is not an accepting state. Only reading one a takes us to f.', watch:'Students reuse the same brick for every a. Each occurrence of a symbol needs its own new states.'}},
    {k:'Rule 2', h:'Thompson rule 2: union <code>s|t</code>', ic:'🔀', code:`N(a|b):
start → (i) ─ε→ (1) ─a→ (2) ─ε→ ((f))
        (i) ─ε→ (3) ─b→ (4) ─ε→ ((f))`,
      parts:[['i','New start state'],['i ─ε→ 1, i ─ε→ 3','Free moves into N(a) and into N(b): “choose one way”'],['1 ─a→ 2','The brick N(a)'],['3 ─b→ 4','The brick N(b)'],['2 ─ε→ f, 4 ─ε→ f','Both ways meet again at one new final state'],['f','New accepting state']],
      what:['Make a new start state i and a new final state f.','Add ε-arrows from i to the start of N(s) and to the start of N(t).','Add ε-arrows from the final of N(s) and the final of N(t) to f.','The old final states are no longer accepting.'],
      eg:{note:'Test N(a|b):', out:`"a"   i ─ε→ 1 ─a→ 2 ─ε→ f    accepted ✔
"b"   i ─ε→ 3 ─b→ 4 ─ε→ f    accepted ✔
"ab"  after a we are at f; f has no b-arrow   rejected ✘`},
      res:'N(s|t) accepts every string that N(s) accepts or N(t) accepts; it adds 2 new states.',
      an:'A road that splits around a lake and joins again on the other side: you may take either side, and both reach the same town.', tk:'Union: new start splits with ε, new final joins with ε.',
      n:{say:'Draw the diamond shape on the board. Ask: how many states does N(a|b) have? Answer 6: i, f and the four states of the two bricks. In our big example these are states 1 to 6.', ask:'Is “ab” accepted by N(a|b)?', ans:'No. a|b means one character, a or b. For “ab” you need ab or (a|b)(a|b).', watch:'Students draw the ε-arrows from the old final states back to i. They go forward to the new final state f.'}},
    {k:'Rule 3', h:'Thompson rule 3: concatenation <code>st</code>', ic:'➕', code:`N(a):   (0) ─a→ (1)
N(b):           (1) ─b→ (2)
N(ab):  start → (0) ─a→ (1) ─b→ ((2))`,
      parts:[['N(a)','The brick for a: 0 ─a→ 1'],['N(b)','The brick for b, placed right after it'],['(1)','The final state of N(a) is merged with the start state of N(b)'],['0','Start state of the result = start of N(s)'],['((2))','Accepting state of the result = final of N(t)']],
      what:'Put N(t) after N(s). The final state of N(s) and the start state of N(t) become one state. No new states and no ε-arrows are needed.',
      eg:{note:'Test N(ab):', out:`"ab"  0 ─a→ 1 ─b→ 2    accepted ✔
"a"   ends in 1         rejected ✘
"ba"  no b-arrow from 0  rejected ✘`},
      res:'N(st) accepts a string from s followed by a string from t.',
      an:'Two train carriages coupled together: the back door of the first is the front door of the second.', tk:'Concatenation: glue final of N(s) onto start of N(t).',
      n:{say:'Some books join the two NFAs with an ε-arrow instead of merging the states. Both are correct; the Dragon book merges, and our numbering for (a|b)*abb uses merging: 7 ─a→ 8 ─b→ 9 ─b→ 10.', ask:'If N(s) has 4 states and N(t) has 3, how many does N(st) have?', ans:'4 + 3 − 1 = 6, because one state is shared.', watch:'Do not make the middle state accepting. Only the very last state is final.'}},
    {k:'Rule 4', h:'Thompson rule 4: Kleene star <code>s*</code>', ic:'🔁', code:`N(a*):
start → (i) ─ε→ (1) ─a→ (2) ─ε→ ((f))
        (2) ─ε→ (1)          repeat
        (i) ─ε→ ((f))        skip`,
      parts:[['i','New start state'],['f','New accepting state'],['i ─ε→ 1','Enter N(a)'],['1 ─a→ 2','The brick N(a)'],['2 ─ε→ f','Leave after one more a'],['2 ─ε→ 1','Repeat: go round N(a) again'],['i ─ε→ f','Skip: use N(a) zero times (accepts ε)']],
      what:['Make a new start i and a new final f.','Add ε-arrows i → start of N(s), and final of N(s) → f.','Add the repeat arrow: final of N(s) → start of N(s).','Add the skip arrow: i → f.'],
      eg:{note:'Test N(a*):', out:`""     i ─ε→ f                                  accepted ✔
"aaa"  i→1 ─a→ 2→1 ─a→ 2→1 ─a→ 2→f (→ = ε)       accepted ✔
"b"    no b-arrow anywhere                       rejected ✘`},
      res:'N(s*) accepts zero or more strings from s, one after another; it adds 2 new states and 4 ε-arrows.',
      an:'A roundabout: you may drive past the exit (skip), go round once, or go round as many times as you like before leaving.', tk:'Star: enter, repeat, leave, skip.',
      n:{say:'Count the four ε-arrows with the class: enter, leave, repeat, skip. In (a|b)*abb the star adds states 0 and 7: 0 ─ε→ 1 (enter), 6 ─ε→ 7 (leave), 6 ─ε→ 1 (repeat), 0 ─ε→ 7 (skip).', ask:'What breaks if we forget the skip arrow?', ans:'The NFA would need at least one a, so it would describe a⁺ instead of a*. The empty string would be rejected.', watch:'The repeat arrow goes from the final of N(s) back to the start of N(s), not to i.'}},
    {k:'Animation', h:'Thompson’s construction for (a|b)*abb', demo:'thompson', an:'Assembling furniture by the instruction sheet: small parts first, then join them into bigger parts.', tk:'11 states, numbered 0–10; start 0, accepting 10.',
      n:{say:'Build it on the board alongside the animation in the same order: a and b, then a|b, then (a|b)*, then add a, b, b. Use the same numbers as the animation (0–10); the next slides depend on them.', ask:'Where is the “repeat” arrow and where is the “skip” arrow?', ans:'Repeat: 6 ─ε→ 1 (go round the a|b part again). Skip: 0 ─ε→ 7 (use the a|b part zero times).', watch:'Many textbooks number the states differently. Agree with the class to use this numbering, or the subset table will not match.'}},
    {k:'Example', h:'The finished NFA for <code>(a|b)*abb</code>, arrow by arrow', ic:'📝', code:`start 0, accepting 10, 11 states, 13 arrows

2 ─a→ 3      4 ─b→ 5          bricks for a and b       (rule 1)
1 ─ε→ 2      1 ─ε→ 4          split into a or b        (rule 2)
3 ─ε→ 6      5 ─ε→ 6          join again               (rule 2)
0 ─ε→ 1      6 ─ε→ 7          enter / leave the star   (rule 4)
6 ─ε→ 1      0 ─ε→ 7          repeat / skip            (rule 4)
7 ─a→ 8      8 ─b→ 9      9 ─b→ 10                     (rule 3)`,
      parts:[['2 ─a→ 3, 4 ─b→ 5','The two bricks inside the brackets'],['states 1 … 6','N(a|b): new start 1, new final 6'],['states 0 and 7','The star’s new start (0) and new final (7)'],['6 ─ε→ 1','Repeat arrow: read another a or b'],['0 ─ε→ 7','Skip arrow: (a|b) used zero times'],['7 ─a→ 8 ─b→ 9 ─b→ 10','The tail abb, joined by concatenation'],['10','The only accepting state']],
      what:['Build the bricks for a and b (states 2–3 and 4–5).','Join them with union (new states 1 and 6).','Apply the star (new states 0 and 7).','Concatenate a, b, b: the star’s final 7 is merged with the start of the first a brick, and so on, ending at 10.'],
      eg:{note:'Find an accepting path for <code>aabb</code> (→ without a letter = ε):', out:`0 → 1 → 2 ─a→ 3 → 6 → 7 ─a→ 8 ─b→ 9 ─b→ 10
ends in 10 (accepting) → accepted ✔`},
      res:'An NFA with 11 states (0–10) and 13 arrows that accepts exactly (a|b)*abb.',
      an:'The finished furniture with the assembly sheet still beside it: you can point at each part and say which step added it.', tk:'Copy this arrow list exactly; the subset construction uses these numbers.',
      n:{say:'Write this list on the board in a corner and keep it there until the end of the lecture. Ask the class to find a path for abb: 0 → 7 ─a→ 8 ─b→ 9 ─b→ 10 (using the skip arrow). Then for aabb, as in the example: the first a goes round the loop, the second a starts the tail.', ask:'Why exactly 11 states?', ans:'5 symbol bricks × 2 states = 10; union adds 2 (12); star adds 2 (14); each of the 3 concatenations merges two states into one (14 − 3 = 11). In general Thompson’s NFA has at most twice as many states as the RE has symbols and operators.', watch:'Every state has at most two arrows leaving it, and state 10 has none. Use this to check a student’s drawing quickly.'}},
    {k:'Concept', h:'Two helper functions: ε-closure and move', ic:'🧮', pts:[['ε','<b>ε-closure</b>(T): all states reachable from the states in T using only ε-arrows, including T itself.'],['➜','<b>move(T, a)</b>: all states reachable from a state in T by one arrow labelled a.'],['🔁','Next DFA state = ε-closure( move(T, a) ).']], code:`ε-closure({0})  = {0, 1, 2, 4, 7}          = A
move(A, a)      = {3, 8}                   (2 ─a→ 3, 7 ─a→ 8)
ε-closure({3, 8}) = {1, 2, 3, 4, 6, 7, 8}  = B`,
      parts:[['ε-closure({0})','Start at 0 and follow only ε-arrows: 0→1, 0→7, then 1→2, 1→4'],['{0, 1, 2, 4, 7}','All states reached, plus 0 itself; we name this set A'],['move(A, a)','Which states in A have an a-arrow? Only 2 (2 ─a→ 3) and 7 (7 ─a→ 8)'],['{3, 8}','Where one a takes us; no ε-arrows followed yet'],['ε-closure({3, 8})','Follow ε from 3 and 8: 3→6, 6→1, 6→7, 1→2, 1→4 (8 has no ε-arrow)'],['B','The new set {1, 2, 3, 4, 6, 7, 8}']],
      what:['<b>ε-closure(T):</b> put all states of T in the result and on a stack.','Pop a state s. For every arrow s ─ε→ u, if u is not yet in the result, add it and push it.','Repeat until the stack is empty.','<b>move(T, a):</b> collect the end of every a-arrow that starts in T. Do not follow ε here.'],
      eg:{note:'Now on b from A:', code:`move(A, b) = ?
ε-closure( move(A, b) ) = ?`, out:`move(A, b) = {5}                    (only 4 ─b→ 5)
ε-closure({5}) = {1, 2, 4, 5, 6, 7}  (5→6, 6→1, 6→7, 1→2, 1→4) = C`},
      res:'Next DFA state = ε-closure( move(T, a) ): first one real step, then all the free steps.',
      an:'ε-arrows are free escalators in a mall. ε-closure: every shop you can reach without paying. move: where you get by paying one ticket (reading one symbol).', tk:'move reads one symbol; ε-closure then follows all free ε-arrows.',
      n:{say:'Compute ε-closure({0}) slowly on the Thompson diagram: 0 itself; 0 ─ε→ 1 and 0 ─ε→ 7; from 1, ε to 2 and 4. 2, 4 and 7 have no ε-arrows out. Result {0,1,2,4,7}. Then move on a: only 2 and 7 have a-arrows. Then close {3,8}: 3 ─ε→ 6, 6 ─ε→ 1 and 7, 1 ─ε→ 2 and 4.', ask:'Why include the state itself in its ε-closure?', ans:'Following zero ε-arrows is allowed, so you can always stay where you are.', watch:'The two classic slips: forgetting the state itself, and forgetting to take the ε-closure after move.'}},
    {k:'Concept', h:'The subset construction algorithm', ic:'⚙️', p:'The <b>subset construction</b> turns an NFA into a DFA. Each DFA state is a <b>set</b> of NFA states. We keep a list of found sets and process them one by one until no new set appears.', code:`Dstates = { ε-closure(s0) }   (unmarked)
while there is an unmarked state T in Dstates:
    mark T
    for each input symbol a:
        U = ε-closure( move(T, a) )
        if U is not in Dstates: add U as unmarked
        Dtran[T, a] = U
A DFA state is accepting if it contains an NFA accepting state.`,
      parts:[['Dstates','The list of DFA states found so far (each one is a set of NFA states)'],['ε-closure(s0)','The first DFA state: everything reachable free from the NFA start'],['unmarked','Found, but its arrows are not worked out yet'],['mark T','Take one unmarked set and process it now'],['for each input symbol a','Work out the arrow of T for every symbol (here a and b)'],['U = ε-closure(move(T, a))','The set reached from T on a'],['if U is not in Dstates','A new set: add it to the list, still unmarked'],['Dtran[T, a] = U','Write the arrow into the new DFA table']],
      what:['Start: Dstates holds only A = ε-closure({0}), unmarked.','Pick an unmarked set T and mark it.','For each symbol, compute U; add U if it is new; fill Dtran[T, symbol].','Repeat until every set in Dstates is marked.','Mark as accepting every set that contains an NFA accepting state.'],
      eg:{note:'The first round, with T = A = {0, 1, 2, 4, 7}:', out:`Dtran[A, a] = ε-closure({3, 8}) = {1,2,3,4,6,7,8} = B   new → add
Dtran[A, b] = ε-closure({5})    = {1,2,4,5,6,7}   = C   new → add
Dstates = { A ✔, B, C }   (B and C still unmarked)`},
      res:'When no unmarked set is left, Dstates are the DFA’s states and Dtran is its transition table.',
      an:'Exploring a new city with a to-do list: write down each new area you find, visit areas from the list one by one, and stop when the list has nothing new.', tk:'A worklist of sets; it stops because there are only finitely many sets.',
      n:{say:'This is the same as running the NFA with sets (the earlier slide), but done for every possible input in advance. Point out: Dstates = the DFA’s states, Dtran = the DFA’s transition table.', ask:'Why is the algorithm sure to stop?', ans:'An NFA with n states has at most 2ⁿ different subsets. Each loop marks one new set, so the loop cannot go on forever.', watch:'A DFA state is accepting if it contains at least one accepting NFA state, not only if all its states are accepting.'}},
    {k:'Animation', h:'Subset construction: NFA → DFA', demo:'subset', an:'Grouping guests at a wedding by which tables they can reach: each group becomes one seat on the guest list.', tk:'Each DFA state is a set of NFA states; 5 states A–E, E accepting.',
      n:{say:'Fill the table on the board as the animation steps: DFA state | NFA set | on a | on b. Students should compute at least the row for B themselves before you reveal it: B on b, move = {5, 9}, closure = {1,2,4,5,6,7,9} = D.', ask:'Why is only E accepting?', ans:'Only E contains state 10, the NFA’s accepting state.', watch:'Every row on a goes to B. That is correct: after reading a, we have “just seen an a”, whatever came before.'}},
    {k:'Example', h:'One row by hand: <code>B</code> on <code>b</code>, then <code>D</code> on <code>b</code>', ic:'✍️', code:`B = {1, 2, 3, 4, 6, 7, 8}

move(B, b)        = {5, 9}                  4 ─b→ 5,  8 ─b→ 9
ε-closure({5, 9}) = {1, 2, 4, 5, 6, 7, 9}   = D   (new)`,
      parts:[['B','The DFA state we are processing (a set of NFA states)'],['move(B, b)','Look for b-arrows leaving any state of B: only 4 and 8 have one'],['{5, 9}','The states one b takes us to'],['ε-closure({5, 9})','Add the free moves: 5→6, 6→1, 6→7, 1→2, 1→4; 9 has no ε-arrow'],['D','The result is a set we have not seen before, so it gets a new name']],
      what:['Write down the set B.','Find every b-arrow that starts inside B (move).','Take the ε-closure of the result.','Compare with the sets already in Dstates: new set → new name; old set → reuse the old name.'],
      eg:{note:'Same steps for D = {1, 2, 4, 5, 6, 7, 9} on b:', out:`move(D, b) = {5, 10}                 (4 ─b→ 5, 9 ─b→ 10)
ε-closure({5, 10}) = {1, 2, 4, 5, 6, 7, 10} = E   (new, and it holds 10 → accepting)`},
      res:'Dtran[B, b] = D and Dtran[D, b] = E: two more cells of the DFA table.',
      an:'Checking which rooms you can reach from a group of rooms: first walk through one door marked b, then use every free corridor.', tk:'move first, ε-closure second, then compare with the list.',
      n:{say:'Let students do D on b on their own before you show the example box. Collect answers; the most common wrong answer leaves out 5 because students only look at 9. Remind them: state 4 is inside D, and 4 ─b→ 5.', ask:'What is Dtran[E, b]?', ans:'move(E, b) = {5} (only 4 has a b-arrow; 10 has none). ε-closure({5}) = {1,2,4,5,6,7} = C, an old set.', watch:'Students forget to check whether a set is already in the list and give it a new name twice. Compare sets as sets: order does not matter.'}},
    {k:'Summary', h:'The finished subset table (exam table)', ic:'📋',
      tbl:{cap:'DFA for (a|b)*abb built by the subset construction', h:['DFA state','NFA states','on a','on b','Accepting?'], r:[['A (start)','{0, 1, 2, 4, 7}','B','C','No'],['B','{1, 2, 3, 4, 6, 7, 8}','B','D','No'],['C','{1, 2, 4, 5, 6, 7}','B','C','No'],['D','{1, 2, 4, 5, 6, 7, 9}','B','E','No'],['E','{1, 2, 4, 5, 6, 7, 10}','B','C','Yes (contains 10)']]},
      what:'Read each row as arrows of the new DFA: A ─a→ B, A ─b→ C, and so on. A is the start because it is ε-closure({0}). Only E is accepting, because only E contains the NFA’s accepting state 10.',
      eg:{note:'Check the DFA on two inputs:', out:`abb  : A ─a→ B ─b→ D ─b→ E        ends in E → accepted ✔
abab : A ─a→ B ─b→ D ─a→ B ─b→ D  ends in D → rejected ✘`},
      res:'A 5-state DFA (A–E) with no ε-moves and exactly one arrow per symbol.',
      an:'A finished class timetable: every period of every day has exactly one entry, so nobody needs to guess.', tk:'5 DFA states, A start, E accepting; every a goes to B.',
      n:{say:'Ask students to copy this table into their notebooks; it is the most common exam question in this unit. Then point out the pattern: B “just saw a”, D “just saw ab”, E “just saw abb”, and A and C both mean “nothing useful”. That is a hint for the next slide: A and C can be merged.', ask:'How many DFA states could there have been in the worst case?', ans:'The NFA has 11 states, so up to 2¹¹ = 2048 subsets. Only 5 were actually reachable.', watch:'Students list the NFA sets with the states in random order and then think two equal sets are different. Always write sets in increasing order.'}},
    {k:'Example', h:'Minimising the DFA', ic:'🗜️', p:'Two states are <b>equivalent states</b> if no input string can tell them apart. Start with two groups, accepting and non-accepting, and keep splitting groups whose members move to different groups. Here A and C merge, giving 4 states.', code:`5-state DFA           split by "on b"          minimal DFA
     a  b                                       a  b
A    B  C             {A,B,C,D} {E}         0   1  0    (A,C)
B    B  D             → {A,B,C} {D} {E}     1   1  2    (B)
C    B  C             → {A,C} {B} {D} {E}   2   1  3    (D)
D    B  E             stable!              *3   1  0    (E)
*E   B  C`,
      parts:[['{A,B,C,D} {E}','Round 0: one group of non-accepting states, one group of accepting states'],['split by "on b"','On b, D goes into group {E} but A, B, C stay in the first group, so D leaves'],['{A,B,C} {D} {E}','Groups after round 1'],['{A,C} {B} {D} {E}','Round 2: on b, B goes to D (its own group) but A and C go to C, so B leaves'],['stable!','Round 3: A and C go to the same groups on a (B) and on b (C); nothing splits'],['0 = (A,C)','The merged group becomes one state of the minimal DFA']],
      what:['Make two groups: accepting states and non-accepting states.','For each group and each symbol, check which group every member moves to.','If members move to different groups, split the group.','Repeat until no group splits.','Each final group becomes one state; the group holding the old start state is the new start.'],
      eg:{note:'Check that A and C really cannot be told apart:', out:`A ─a→ B   C ─a→ B     (same state)
A ─b→ C   C ─b→ C     (same group {A,C})
So any input leads A and C to the same places → they are equivalent, merge them.`},
      res:'The minimal DFA has 4 states, and it is the same as the hand-made DFA at the start of the lecture.',
      an:'Two school buses that always stop at the same places in the same order can be replaced by one bus.', tk:'The minimal DFA is the same 4-state table we started with.',
      n:{say:'Do the splitting on the board. Round 1: on b, D goes to E (accepting group) but A, B, C do not, so D splits off. Round 2: on b, B goes to D but A and C go to C, so B splits off. Round 3: A and C agree on every symbol: done. Now compare with the DFA table at the start of the lecture: it is the same machine. The chain RE → NFA → DFA → minimal DFA is complete.', ask:'Is the minimal DFA always unique?', ans:'Yes, for a given language the minimal DFA is unique, apart from the names of the states. Lex and Flex minimise their DFAs to keep the tables small.', watch:'Do not merge states only because their rows look alike at first glance; one must also check where those next states fall in the groups.'}},
    {k:'Summary', h:'From pattern to machine: the whole lecture (exam table)', ic:'📋', ex:'(a|b)*abb  →(Thompson)→  11-state NFA  →(subset construction)→  5-state DFA  →(minimise)→  4-state DFA',
      tbl:{cap:'Important points for your exam', h:['Step','Algorithm','Input → output','Key rule to remember'], r:[['1','Thompson’s construction','RE → NFA','One rule each for ε, symbol, |, concatenation, *'],['2','ε-closure(T)','Set → bigger set','Follow only ε-arrows; T itself is included'],['3','move(T, a)','Set → set','Follow exactly one a-arrow; no ε'],['4','Subset construction','NFA → DFA','New state = ε-closure(move(T, a)); accepting if it holds any NFA accepting state'],['5','Minimisation','DFA → smallest DFA','Split groups until stable; merge equivalent states'],['6','DFA simulation','String → yes / no','One table lookup per character; decide only at the end']]},
      res:'RE → NFA → DFA → minimal DFA: the same chain Lex runs inside, for every token pattern.',
      an:'A relay race of four runners: each algorithm carries the pattern one leg and hands it on.', tk:'Thompson, subset, minimise, simulate.',
      n:{say:'Go back to the chain you wrote on the board at the start and tick the last arrow. Cover the last two columns and ask students to fill them in. Then give the exam tip: in a long question, always label each step with its algorithm name and show the ε-closure work, not just the final table.', ask:'Which step decides how fast the final scanner runs?', ans:'None of the building steps: the scanner always runs the DFA at one lookup per character. Minimisation only makes the table smaller.', watch:'Students mix up the input and output of each algorithm (for example “subset construction turns an RE into a DFA”). Insist on the arrows: RE → NFA → DFA.'}}
  ],
  lab:{t:'Lab: RE → NFA → DFA by hand', steps:['Use Thompson’s construction for <code>(a|b)*abb</code> and number the states 0–10.','Compute ε-closure({0}) and fill the subset-construction table.','Draw the resulting DFA and mark accepting states.','Simulate the DFA on <code>abb</code>, <code>aabb</code>, <code>abab</code>. Which are accepted?','Repeat for <code>a(b|c)*</code>.'], out:'Two NFAs, two DFA tables, simulation results.',
    n:{say:'Step 4: abb and aabb are accepted; abab is rejected. Step 5, one correct answer: NFA 0 ─a→ 1; 1 ─ε→ 2, 1 ─ε→ 8; 2 ─ε→ 3, 2 ─ε→ 5; 3 ─b→ 4; 5 ─c→ 6; 4 ─ε→ 7, 6 ─ε→ 7; 7 ─ε→ 2, 7 ─ε→ 8; accepting 8 (9 states). DFA: A = {0}; A on a → B = {1,2,3,5,8}; B on b → C = {2,3,4,5,7,8}; B on c → D = {2,3,5,6,7,8}; C and D go to C on b and to D on c. B, C, D are accepting; every other move goes to a dead state. Minimised: B, C and D merge into one state.', ask:'My state numbers are different from my friend’s. Who is right?', ans:'Both can be right. Numbering is only a naming choice; check that the structure (arrows and accepting states) is the same.', watch:'Students forget the dead state in step 5. On b or c from A, and on a from B, C, D, the DFA goes to a dead state.'}},
  disc:['Why do real scanners use DFAs and not NFAs at run time?','The subset construction can create 2ⁿ states. Why is that rare in practice?','Can every NFA be converted to a DFA? Can every DFA be seen as an NFA?'],
  mistakes:['Forgetting to include the state itself in its ε-closure.','Computing move() without taking the ε-closure afterwards.','Marking a DFA state accepting only if <b>all</b> its NFA states are accepting. <b>One</b> is enough.','Leaving out a transition in a DFA (a missing move means a dead/error state).','Accepting as soon as an accepting state is reached in the middle of the input; you must finish the whole input first.'],
  rev:['A DFA has one transition per symbol per state; an NFA may have choices and ε-moves.','Thompson’s construction: RE → NFA, rule by rule.','Subset construction: NFA → DFA using ε-closure and move.','A DFA state is accepting if it contains an NFA accepting state.','DFAs run in linear time and are minimised for compact tables.'],
  hw:'Convert <code>(a|b)*a(a|b)</code> to an NFA and then to a DFA. Prepare for Quiz 1.',
  check:[
    {q:'Using the DFA table for <code>(a|b)*abb</code> (0→a:1,b:0; 1→a:1,b:2; 2→a:1,b:3; 3→a:1,b:0), where does <code>babb</code> end?', o:['State 0','State 1','State 2','State 3 (accept)'], a:3, e:'0 ─b→ 0 ─a→ 1 ─b→ 2 ─b→ 3. State 3 is accepting, and babb does end in abb.'},
    {q:'In the subset construction you computed move(T, a) = {3, 8}. What is the next step?', o:['Add {3, 8} as a DFA state','Take the ε-closure of {3, 8}','Mark {3, 8} as accepting','Stop the algorithm'], a:1, e:'The new DFA state is ε-closure(move(T, a)); here that is {1, 2, 3, 4, 6, 7, 8}.'},
    {q:'Why does a real scanner run a DFA rather than the NFA?', o:['A DFA accepts more languages','A DFA makes one move per character, with no sets of states to track','An NFA cannot have accepting states','A DFA always has fewer states'], a:1, e:'Both accept the same languages, but a DFA needs just one table lookup per character, which is very fast.'}],
  quiz:[
    {q:'An NFA differs from a DFA because it may have…', o:['Accepting states','ε-transitions and multiple moves on one symbol','A start state','An alphabet'], a:1, e:'Non-determinism = choices.'},
    {q:'ε-closure(s) always contains…', o:['Only accepting states','s itself','The start state','No states'], a:1, e:'Zero ε-moves reach s itself.'},
    {q:'A DFA state built by subset construction is accepting if it contains…', o:['All NFA states','At least one NFA accepting state','The NFA start state','No ε-edges'], a:1, e:'Any accepting NFA state suffices.'},
    {q:'Simulating a DFA on input x takes time proportional to…', o:['|x|','2^|x|','|x|²','constant'], a:0, e:'One move per character.'},
    {q:'Thompson’s construction converts…', o:['DFA → RE','RE → NFA','NFA → grammar','DFA → NFA'], a:1, e:'Regular expression to NFA.'},
    {q:'In Thompson’s NFA for <code>(a|b)*abb</code>, ε-closure({0}) is…', o:['{0}','{0, 1, 2, 4, 7}','{0, 7}','{1, 2, 4}'], a:1, e:'0 reaches 1 and 7 by ε; 1 reaches 2 and 4 by ε; and 0 itself is included.'},
    {q:'Minimising a DFA means…', o:['Removing accepting states','Merging states that no input can tell apart','Removing the start state','Turning it back into an NFA'], a:1, e:'Equivalent states are merged; the language stays the same.'}],
  terms:[['Finite automaton','A recogniser with finitely many states and transitions on input symbols.'],['DFA','Deterministic finite automaton: exactly one transition per state and symbol, no ε-moves.'],['NFA','Non-deterministic finite automaton: may have several transitions on a symbol and ε-moves.'],['Transition table','A table giving the next state for each state and input symbol.'],['Dead state','A non-accepting state with no way out; missing transitions lead here.'],['ε-closure','The set of states reachable using only ε-transitions.'],['move(T,a)','The set of states reachable from T on one a-transition.'],['Thompson’s construction','Algorithm that builds an NFA from a regular expression.'],['Subset construction','Algorithm that converts an NFA into an equivalent DFA.'],['DFA minimisation','Merging equivalent states to get the smallest DFA.']]
},
{ id:6, week:3, unit:'Finite automata', ic:'🗺️', lo:[2], book:'Dragon Ch. 3.4–3.5, 3.8 · Louden Ch. 2.5–2.6',
  title:'Transition Diagrams, Lexer Generators, Reserved Words and Identifiers',
  sub:'Transition diagrams for relational operators, identifiers, numbers and whitespace; retracting; reserved words vs identifiers; design of a lexical-analyzer generator (Lex).',
  assess:'Quiz-1',
  introH:'From patterns on paper to a working scanner',
  intro:'You can already write regular expressions and draw automata. Today we turn them into <b>transition diagrams</b>: flowcharts that a scanner can follow, one character at a time. Then we meet <b>Lex</b>, a tool that builds the whole scanner for you.',
  introAn:'A recipe card tells a cook exactly what to do at each step: “if the oil is hot, add onions; otherwise wait”. A transition diagram is a recipe card for reading one token.',
  introN:{say:'Write <code>if (count1 &lt;= 42) x = 6.02E+23;</code> on the board. Ask: how does the scanner know that <code>&lt;=</code> is one token and not two? How does it know <code>if</code> is a keyword but <code>count1</code> is a name? Today answers both questions. Remind students that Quiz 1 is this week and covers Weeks 1–3, including today.', ask:'Did we not already do this with DFAs last lecture?', ans:'Yes, a transition diagram is a DFA. The new part is the actions: return a token, give back an extra character, and look the word up in a table.', watch:'Students who missed Session 5 may not remember what a state or an accepting state is. Recap it in one sentence before slide 1.'},
  obj:['Draw transition diagrams for relational operators, identifiers, numbers and whitespace.','Explain retracting (the * on a state) and returning a token.','Explain two ways to tell reserved words apart from identifiers.','Describe the three parts of a Lex program and how Lex builds a scanner.','Resolve pattern conflicts with longest match and rule order.'],
  bloom:{head:['<b>Construct</b> transition diagrams for token classes.','<b>Explain</b> how Lex resolves conflicting patterns.','<b>Compare</b> two ways to recognise keywords.'],
    heart:['<b>Value</b> tools that automate repetitive work.','<b>Be curious</b> about how tools like Lex work inside.'],
    hand:['<b>Write</b> a small Flex specification and run it.','<b>Trace</b> input through a transition diagram.']},
  slides:[
    {k:'Concept', h:'A transition diagram: a flowchart for one token', ic:'🗺️', p:'A <b>transition diagram</b> is a picture of a DFA for one kind of token. Circles are <b>states</b>. Arrows are labelled with the characters that move us on. We begin at the <b>start state</b>. A double circle is an <b>accepting state</b>: when we reach it, a token is complete.', pts:[['➡️','Read one character, follow the matching arrow.'],['⛔','No matching arrow? This diagram has failed.'],['🎯','Double circle? Stop and return the token.']],
      code:`start → (0) ──&lt;──▶ (1) ──=──▶ ((2))   return ⟨relop, LE⟩`,
      parts:[['start →','Where every token begins'],['(0), (1)','Ordinary states (single circles)'],['((2))','Accepting state (double circle): the token is complete'],['──&lt;──▶','Arrow taken when the next character is &lt;'],['return ⟨relop, LE⟩','The action written on the accepting state: the token to hand to the parser'],['other','(on later slides) an arrow for “any character not on another arrow”'],['*','(on later slides) retract one character before returning']],
      what:['Start in state 0 at the first character of the lexeme.','Read a character and follow the arrow with that label.','If there is no such arrow, this diagram fails.','On reaching a double circle, do its action: return the token.'],
      eg:{note:'Input <code>&lt;=</code>:', out:`0 ─&lt;→ 1 ─=→ 2 (accepting) → return ⟨relop, LE⟩`},
      res:'A transition diagram = a small DFA for one token class + an action on each accepting state.',
      an:'A metro map: you start at one station and follow the line that matches your ticket. When you reach your stop, you get off.', tk:'Transition diagram = a DFA drawn for one token class.',
      n:{say:'Draw three circles on the board: 0 → 1 → (2), with the last one double. Label the arrows <code>&lt;</code> and <code>=</code>. Walk your finger along while saying the input “&lt;=”. This tiny diagram recognises one token. The next slides add actions to it.', ask:'Is a transition diagram the same as a DFA?', ans:'Almost. It is a DFA for one token class, plus actions written on the accepting states (return this token, give back a character).', watch:'Students sometimes put the token name on the arrows. Arrows carry characters; token names go on accepting states.'}},
    {k:'Concept', h:'Two actions: return and retract', ic:'↩️', p:'To know that <code>&lt;</code> is finished, the scanner must read the <b>next</b> character. If that character is not <code>=</code> or <code>&gt;</code>, it belongs to the next token. So we <b>retract</b>: move the <b>forward pointer</b> (the scanner’s finger on the input) back by one. A <b>*</b> on an accepting state means “retract first”.', ex:'Input <code>&lt;x</code>: read <code>&lt;</code>, read <code>x</code>, see that <code>x</code> cannot continue the token, retract, return ⟨relop, LT⟩. The <code>x</code> is read again as the start of the next token.',
      what:['The forward pointer moves past <code>&lt;</code>.','It reads one more character to see whether the token goes on.','That character does not fit any arrow (it is “other”), so we reach a state with a *.','Retract: the forward pointer moves back by one.','Return the token; the next call starts at the character we gave back.'],
      eg:{note:'Input <code>a&lt;b</code>, after <code>a</code> has been returned as ⟨id⟩:', out:`read &lt;  → state 1
read b  → “other” → state 4*
retract → forward points at b again
return ⟨relop, LT⟩;  next call starts at b → ⟨id⟩`},
      res:'Retract = “I read one character too many; give it back for the next token.”',
      an:'Reading a cricket score aloud: you hear “1” and wait for the next digit. If the next sound is a word, you know the score was just 1 and the word is new.', tk:'* means: I read one character too many; give it back.',
      n:{say:'Write <code>a&lt;b</code> on the board with a finger (the forward pointer). Move it to <code>&lt;</code>, then to <code>b</code>. Ask: is the token finished? Yes, but we only know because we saw <code>b</code>. Move the finger back to <code>b</code>: that is retract. Then the token ⟨relop, LT⟩ is returned.', ask:'Why not just look at the next character without reading it?', ans:'That is the same idea, called peeking. In a diagram we draw it as “read, then retract”. In code (Session 7) we often use a peek() function instead.', watch:'Many students forget the * on states reached by an “other” arrow. Every “other” arrow that ends a token needs a retract.'}},
    {k:'Animation', h:'The diagram for relational operators', demo:'relop', p:'Press <b>Step</b>. Follow the inputs <code>&lt;=</code>, <code>&lt;x</code> and <code>&gt;=</code> through states 0 to 8.', an:'A railway junction: after the first character the train is sent down one of several tracks.', tk:'States 4 and 8 retract, because their extra character belongs to the next token.',
      n:{say:'This is the classic diagram from the Dragon book (Fig. 3.13). From state 0: <code>&lt;</code> goes to 1, <code>=</code> to 5, <code>&gt;</code> to 6. From 1: <code>=</code> gives LE, <code>&gt;</code> gives NE, anything else gives LT with retract. From 6: <code>=</code> gives GE, anything else gives GT with retract.', ask:'Why does state 5 (EQ) have no star?', ans:'Because we know the token is finished the moment we read <code>=</code>. Nothing else can follow it in this diagram, so we did not read too far.', watch:'In this book language <code>=</code> means “equal” and <code>&lt;&gt;</code> means “not equal”, like Pascal. In C, equality is <code>==</code>, not-equal is <code>!=</code> and <code>=</code> is assignment. Say this clearly.'}},
    {k:'Example', h:'The relop diagram, arrow by arrow', ic:'📝', code:`0 ─&lt;→ 1          0 ─=→ 5          0 ─&gt;→ 6
1 ─=→ 2          return ⟨relop, LE⟩
1 ─&gt;→ 3          return ⟨relop, NE⟩
1 ─other→ 4*     retract, return ⟨relop, LT⟩
5                return ⟨relop, EQ⟩
6 ─=→ 7          return ⟨relop, GE⟩
6 ─other→ 8*     retract, return ⟨relop, GT⟩`,
      parts:[['0','Start state'],['1','We have read &lt; and must look at the next character'],['6','We have read &gt; and must look at the next character'],['2, 3, 5, 7','Accepting states without *: the token ended exactly on the last character read'],['4*, 8*','Accepting states with *: retract one character first'],['other','Any character that has no other arrow from this state'],['⟨relop, LE⟩','Token name relop, attribute LE (which operator it was)']],
      what:['From 0, the first character chooses the branch: &lt; to 1, = to 5, &gt; to 6.','States 1 and 6 read one more character.','If it is = (or &gt; after &lt;), the operator has two characters: return at once.','If it is anything else, retract and return the one-character operator.'],
      eg:{note:'Input <code>&gt;=1</code>:', out:`0 ─&gt;→ 6 ─=→ 7 → return ⟨relop, GE⟩
the 1 is still unread: the next call starts there`},
      res:'Nine states (0–8) recognise all six relational operators; only 4 and 8 retract.',
      an:'A shop door with two bells: one ring means one customer, two quick rings mean a delivery. The shopkeeper waits a moment after the first ring to be sure.', tk:'First character picks the branch; second character decides the operator.',
      n:{say:'Write the list next to the animation picture and match line by line. Then ask the class to say the path for each of the six operators aloud. Remember to repeat that in this book language = is equality and &lt;&gt; is not-equal.', ask:'Why is there no arrow 5 ─=→ … for <code>==</code>?', ans:'This book language has no == operator. A C scanner would need it: after =, peek for another = and return EQ, otherwise return ASSIGN (Session 7).', watch:'Students forget the attribute and write only “relop”. The parser needs to know which operator it was.'}},
    {k:'Example', h:'Tracing the relop diagram by hand', ic:'✍️', p:'Here is every path through the diagram. The last column says whether the scanner gives one character back.', code:`input   path         token returned   retract?
&lt;=      0 → 1 → 2    ⟨relop, LE⟩      no
&lt;&gt;      0 → 1 → 3    ⟨relop, NE⟩      no
&lt;x      0 → 1 → 4*   ⟨relop, LT⟩      yes: x is the next token
=       0 → 5        ⟨relop, EQ⟩      no
&gt;=      0 → 6 → 7    ⟨relop, GE⟩      no
&gt;5      0 → 6 → 8*   ⟨relop, GT⟩      yes: 5 is the next token`,
      parts:[['input','The characters the diagram sees (the last one may belong to the next token)'],['path','The states visited, one per character read'],['token returned','Token name and attribute handed to the parser'],['retract?','Whether the forward pointer moves back by one']],
      eg:{note:'Input <code>&lt;&gt;=</code> needs two calls:', out:`call 1: 0 → 1 → 3   ⟨relop, NE⟩   (no retract)
call 2: 0 → 5       ⟨relop, EQ⟩`},
      res:'Every relational operator has exactly one path; the path tells you the token and whether to retract.',
      an:'A cashier counting change: some coins she can hand over at once; for others she must check the next coin first and then put it back on the tray.', tk:'Six paths, six tokens; only the “other” paths retract.',
      n:{say:'Cover the table and ask students to give the path and the token for each input before you uncover a row. Then give the full statement <code>a&lt;=b</code>: the relop diagram only sees <code>&lt;=</code>; <code>a</code> and <code>b</code> are handled by the identifier diagram.', ask:'What does the relop diagram do with input <code>=&lt;</code>?', ans:'It reads <code>=</code> and returns EQ at once. Then the next call starts at state 0 again and reads <code>&lt;</code>. So <code>=&lt;</code> becomes two tokens: EQ, then LT or LE depending on what follows.', watch:'The attribute (LE, LT …) is part of the token. All six are the same token name, relop, with different attributes.'}},
    {k:'Animation', h:'The diagram for identifiers', demo:'idtd', p:'An identifier is a letter followed by any number of letters or digits: <code>letter (letter | digit)*</code>. Press <b>Step</b> to read <code>count1</code>.', an:'Reading a name tag: you keep reading letters until you hit a space; only then do you know the whole name.', tk:'Loop on letters and digits; stop on “other”, retract, and look the word up.',
      n:{say:'States 9, 10 and 11. State 10 loops on letters and digits. State 11 has a star, because the character that ended the name (a blank, a bracket, an operator) belongs to the next token. The action calls <code>installID()</code> (puts the name in the symbol table and returns a pointer to it) and <code>getToken()</code> (decides which token to return).', ask:'Why must an identifier start with a letter?', ans:'So the scanner can tell names from numbers by the first character alone. <code>1count</code> would start in the number diagram.', watch:'Real C also allows the underscore <code>_</code> as a letter. The book diagram leaves it out to stay small.'}},
    {k:'Example', h:'The identifier diagram: states 9, 10 and 11', ic:'🪪', code:`9  ─letter→ 10
10 ─letter→ 10      10 ─digit→ 10
10 ─other→ 11*      retract;
                    return ( getToken(), installID() )`,
      parts:[['9','Start state: the first character must be a letter'],['10','Inside the word: letters and digits keep us here (self-loop)'],['other','Anything that is not a letter or a digit: a blank, ;, (, an operator …'],['11*','Accepting with retract: the “other” character belongs to the next token'],['installID()','Looks the word up in the symbol table, inserts it if new, returns a pointer to its entry'],['getToken()','Looks at that entry and returns the token name: a keyword token or id']],
      what:['Read a letter: go from 9 to 10.','Keep reading while the character is a letter or a digit.','The first other character takes us to 11*: retract it.','The lexeme is now complete; call installID() and getToken() to build the token.'],
      eg:{note:'Input <code>count1;</code>:', out:`9 ─c→ 10 ─o→ 10 ─u→ 10 ─n→ 10 ─t→ 10 ─1→ 10 ─;→ 11*
retract ;   lexeme = "count1"   return ⟨id, pointer to count1⟩`},
      res:'One loop collects the whole word; the symbol table then decides keyword or identifier.',
      an:'Writing down a name on a register: you keep writing letters until the person stops spelling, then you check the register to see whether the name is already there.', tk:'9 → 10 (loop) → 11*: read the word, give back the extra character, look it up.',
      n:{say:'Trace <code>count1;</code> together; the class says the state numbers aloud. Point out that there are 6 letters/digits, so state 10 appears 6 times, and the ; is read once and given back. Then trace <code>x</code> followed by a blank: 9 → 10 → 11*.', ask:'What is the lexeme when we reach 11*? Does it include the ; ?', ans:'No. After the retract the lexeme is exactly count1. The ; is read again by the next call.', watch:'Students mix up installID() and getToken(). installID() deals with the symbol table entry; getToken() decides the token name.'}},
    {k:'Animation', h:'Reserved word or identifier?', demo:'kwid', p:'The word <code>if</code> also fits the identifier pattern. So how does the scanner return IF and not ⟨id⟩? Two methods:', pts:[['📒','<b>Method 1:</b> put every keyword in the <b>symbol table</b> before scanning starts, marked “reserved”. After reading a word, look it up.'],['🥇','<b>Method 2:</b> give each keyword its own diagram and try those first.']], an:'At a wedding, the guest list already has the family names marked “VIP”. Every arriving guest is checked against the list.', tk:'Pre-install keywords in the symbol table, or give them their own diagrams with higher priority.',
      n:{say:'Step through the table: if → keyword, iffy → identifier, While → identifier because C is case-sensitive. Method 1 is simpler and is what most hand-written scanners do: one identifier diagram, one table lookup. Method 2 needs care: for input <code>iffy</code> the <code>if</code> diagram matches the first two letters, so the scanner must still prefer the longer identifier.', ask:'Which method does Lex use?', ans:'Neither exactly. You list the keyword patterns before the identifier pattern; Lex picks the longest match, and on a tie the first rule. That gives the same result as Method 2.', watch:'Students think <code>iffy</code> should be IF followed by <code>fy</code>. No: the longest match rule says take the whole word.'}},
    {k:'Example', h:'Method 1 step by step: keywords already in the table', ic:'📒', code:`Symbol table before scanning starts:
  entry 1   if     keyword IF
  entry 2   then   keyword THEN
  entry 3   else   keyword ELSE

After the identifier diagram has read a word w:
  look up w
  found, marked keyword  → return that keyword token
  not found              → insert w as an identifier
                           return ⟨id, its entry⟩`,
      parts:[['entry 1, 2, 3','Rows put into the symbol table before the first character is read'],['keyword IF','The mark that says: this word is reserved; return the token IF'],['look up w','Search the symbol table for the word just read'],['found, marked keyword','A reserved word: return its own token, with no attribute'],['not found','A new name: insert it as an identifier'],['⟨id, its entry⟩','The id token; the attribute points to the name’s row']],
      what:['Before scanning: insert every keyword, marked “reserved”.','Scan a word with the identifier diagram.','Look it up in the symbol table.','Keyword → keyword token. Otherwise → id token (insert it first if it is new).'],
      eg:{note:'Input <code>if thenx then thenx</code>:', out:`if     found (entry 1, keyword)  → IF
thenx  not found → insert entry 4 → ⟨id, 4⟩
then   found (entry 2, keyword)  → THEN
thenx  found (entry 4, identifier) → ⟨id, 4⟩`},
      res:'One identifier diagram + one table lookup separates every keyword from every identifier.',
      an:'A school gate list with the teachers’ names printed in advance. Everyone else who arrives is written in as a visitor; a visitor who comes twice gets the same visitor number.', tk:'Pre-install keywords; one lookup decides.',
      n:{say:'Write the three rows on the board before you start, then scan the input word by word, adding entry 4 when thenx first appears. Stress: thenx is not THEN followed by x; the diagram read the whole word first. Adding a new keyword to the language means adding one row here, not a new diagram.', ask:'Why does the second thenx not create entry 5?', ans:'The lookup finds entry 4, so the same pointer is returned. Each name appears in the symbol table only once.', watch:'Students forget that the keyword rows must be inserted before scanning. If they are inserted later, the first if would become an identifier.'}},
    {k:'Example', h:'The number pattern, piece by piece: <code>digit+ (. digit+)? (E (+|-)? digit+)?</code>', ic:'🔍',
      parts:[['digit+','One or more digits: the whole-number part (42)'],['( . digit+ )','A fraction: a dot followed by at least one digit (.14)'],['?','The part just before it is optional: it may appear once or not at all'],['E','The exponent letter: “times ten to the power”'],['(+|-)?','An optional sign for the exponent'],['digit+ (after E)','One or more digits of the exponent (23)']],
      what:['Read the digits of the whole-number part.','If a dot and digits follow, read the fraction.','If E follows, read an optional sign and then the exponent digits.','Both optional parts may be missing, so a plain integer is also a number.'],
      eg:{note:'Which lexemes are complete numbers?', code:`42   3.14   5E3   6.02E+23   12.   .5   1E`, out:`42 ✔   3.14 ✔   5E3 ✔ (= 5000)   6.02E+23 ✔
12. ✘ (no digit after the dot)   .5 ✘ (no digit before the dot)   1E ✘ (no exponent digits)`},
      res:'One pattern covers integers, fractions and numbers with exponents; the next slide draws it as a diagram.',
      an:'A form with optional boxes: “Rupees” must be filled, “Paisa” and “× 10 to the power” may be left empty, but if you start a box you must finish it.', tk:'digits, then optional .digits, then optional E sign digits.',
      n:{say:'Write the pattern on the board and put a bracket under each piece with its meaning. Then test the seven lexemes in the example with the class before showing the answers. In the next diagram, 12. stops in state 14 and 1E stops in state 16, which are not accepting; .5 has no arrow out of the start state at all.', ask:'Is 6.02e+23 (small e) a number here?', ans:'Not in this pattern, which uses capital E only. C allows both; you would write [Ee] in Lex.', watch:'Students read ? as “one character”. In regular expressions ? means “optional”; in file names it means one character.'}},
    {k:'Concept', h:'The diagram for unsigned numbers', ic:'🔢', p:'A number is digits, then an optional fraction, then an optional exponent: <code>digit+ (. digit+)? (E (+|-)? digit+)?</code>. The diagram has <b>three</b> accepting states, one for each way a number can end.', code:`12 --digit--&gt; 13
13 --digit--&gt; 13 | --.--&gt; 14 | --E--&gt; 16 | --other--&gt; 20*  integer
14 --digit--&gt; 15
15 --digit--&gt; 15 | --E--&gt; 16 | --other--&gt; 21*  fraction, no exponent
16 --+ or ---&gt; 17 | --digit--&gt; 18
17 --digit--&gt; 18
18 --digit--&gt; 18 | --other--&gt; 19*  with exponent`,
      parts:[['12','Start state: a digit is needed first'],['13','Reading the whole-number digits'],['14','Just read the dot (not accepting: a digit must follow)'],['15','Reading the fraction digits'],['16','Just read E (not accepting)'],['17','Just read the + or − sign (not accepting)'],['18','Reading the exponent digits'],['19*, 20*, 21*','Accepting with retract: number with exponent, integer, fraction']],
      what:['Read digits in 13.','A dot leads to 14 → 15 (fraction); E leads to 16 (exponent).','From 15, E also leads to 16.','After E: an optional sign (17), then digits in 18.','The first “other” character ends the number in 20, 21 or 19, with retract.'],
      eg:{note:'Input <code>5E3+</code>:', out:`12 ─5→ 13 ─E→ 16 ─3→ 18 ─+→ 19*
retract +   return ⟨number, 5E3⟩ (= 5000)`},
      res:'Ten states (12–21); the accepting state tells which kind of number was read.',
      an:'Writing a cheque amount: rupees first, then optionally a dot and paisa. You know the amount is finished only when you reach something that is not part of it.', tk:'Three accepting states: integer (20), fraction (21), exponent (19).',
      n:{say:'Draw it on the board as you read each line (states 12 to 21, Dragon Fig. 3.16). Point out that states 14 and 17 are not accepting: <code>12.</code> and <code>5E+</code> are not complete numbers in this language. All three accepting states have a star.', ask:'Why can we jump from 13 straight to 16 on E?', ans:'Because a number like <code>5E3</code> (5000) has an exponent but no fraction. The arrow skips the fraction part.', watch:'Students often draw an arrow from 14 back to 13. There is none: after the dot, at least one digit must come (state 15).'}},
    {k:'Example', h:'Tracing real numbers through the diagram', ic:'🧮', code:`input       states visited                        result
42;         12 13 13 20*                          integer 42, retract ;
3.14)       12 13 14 15 15 21*                    fraction 3.14, retract )
6.02E+23␣   12 13 14 15 15 16 17 18 18 19*        exponent 6.02E+23, retract ␣
12.x        12 13 13 14 then no arrow for x       diagram fails`, p:'Each row starts at state 12 and follows one arrow per character. The last character is the one that does not fit, so it is given back.',
      parts:[['input','The characters fed to the diagram; ␣ means a blank'],['states visited','The start state 12, then one state per character read'],['result','The number returned, and the character that is retracted'],['diagram fails','No arrow for the character, and the state is not accepting']],
      eg:{note:'Your turn: <code>7.5E-2;</code>', out:`12 13 14 15 16 17 18 19*
number with exponent 7.5E-2 (= 0.075), retract ;`},
      res:'The state where you stop names the kind of number; the character that did not fit goes back.',
      an:'A ticket checker at a stadium gate: each part of the ticket must match. If the seat number is missing, the gate stays shut.', tk:'Follow one arrow per character; the extra character at the end is retracted.',
      n:{say:'Trace <code>6.02E+23</code> slowly with the class saying the state numbers aloud: 6→13, .→14, 0→15, 2→15, E→16, +→17, 2→18, 3→18, blank→19, retract. For <code>12.x</code>: state 14 has no arrow for <code>x</code>, so this diagram fails. A real scanner then backs up to the last accepting point (state 13 after <code>12</code>): it returns the integer 12 and scans <code>.</code> again as its own token, or reports an error if the language has no <code>.</code> token.', ask:'Is <code>.5</code> a number in this diagram?', ans:'No. State 12 needs a digit first. Languages like C accept <code>.5</code>, so their diagram has an extra path.', watch:'Count states carefully: the state after the last digit is visited once per digit (15 15, 18 18).'}},
    {k:'Concept', h:'Whitespace: recognised but never returned', ic:'␣', code:`delim → blank | tab | newline
ws    → delim+

22 --delim--&gt; 23
23 --delim--&gt; 23 | --other--&gt; 24*

state 24: retract, but return NO token;
          go back to the start and scan the next token`, p:'Blanks, tabs and newlines separate tokens, but the parser does not need them. The scanner reads them with a small diagram and then simply starts again.',
      parts:[['delim','One delimiter: a blank, a tab or a newline'],['ws → delim+','Whitespace = one or more delimiters in a row'],['22','Start state of the whitespace diagram'],['23','Inside the whitespace: more delimiters keep us here'],['24*','Retract the first non-blank character'],['return NO token','The scanner does not stop; it starts again at state 0 for the next token']],
      what:['Read a blank, tab or newline: go to 23.','Keep reading while the character is a delimiter.','The first other character takes us to 24*: retract it.','Return nothing; restart and scan the real token.'],
      eg:{note:'Input: two blanks, a tab, then <code>x</code> (␣␣⇥x):', out:`22 ─␣→ 23 ─␣→ 23 ─⇥→ 23 ─x→ 24*
retract x, no token;  restart at x → identifier diagram → ⟨id, x⟩`},
      res:'Whitespace is read and thrown away; the parser only ever sees the real tokens.',
      an:'Spaces between words in a WhatsApp message help you read, but nobody counts them as words.', tk:'Whitespace has a diagram but no token.',
      n:{say:'States 22, 23 and 24 (Dragon Fig. 3.17). The same idea works for comments: read <code>/*</code>, skip everything until <code>*/</code>, return nothing. Keep a line counter: every newline skipped here adds one, so later error messages show the right line.', ask:'Does Python also ignore whitespace?', ans:'Not at the start of a line. Python’s scanner turns changes in indentation into INDENT and DEDENT tokens, because indentation shows block structure there.', watch:'A common bug in student scanners is returning a WS token to the parser. The parser’s grammar has no place for it.'}},
    {k:'Concept', h:'Joining the diagrams into one scanner', ic:'🔗', p:'We now have separate diagrams for relops, identifiers, numbers and whitespace. A scanner must use them together. There are three ways:', pts:[['1️⃣','<b>One after another:</b> try a diagram; if it fails, move the forward pointer back to the start of the lexeme and try the next. Simple but slow.'],['2️⃣','<b>In parallel:</b> run all diagrams together and take the <b>longest match</b> (the longest piece of input that some diagram accepts).'],['3️⃣','<b>Best:</b> merge all diagrams into <b>one</b> diagram (one DFA). This is what Lex does.']], an:'Finding a friend in a crowd: ask every person one by one (slow), ask everyone at once and wait for the loudest “yes” (parallel), or use one announcement that reaches everyone (one combined system).', tk:'One combined DFA is the fastest scanner.',
      n:{say:'Method 1: the order matters. Try keywords before identifiers, and the number diagrams from longest form to shortest. Method 2 is how we reason on paper. Method 3 needs an algorithm to merge diagrams; that is exactly the NFA-to-DFA work from Session 5, and Lex does it automatically.', ask:'In method 1, why must we reset the forward pointer when a diagram fails?', ans:'The failed diagram has already read some characters. The next diagram must start reading from the start of the lexeme again, not from where the failed one stopped.', watch:'Students mix up longest match with “first diagram that succeeds”. With method 1, if identifiers are tried first, <code>if</code> becomes an identifier unless keywords are in the symbol table.'}},
    {k:'Animation', h:'Lex: let a tool write the scanner', demo:'lexgen', p:'Drawing and coding every diagram by hand is slow and error-prone. <b>Lex</b> (and its free version <b>Flex</b>) reads a list of patterns and writes the scanner in C for you.', an:'Instead of hand-writing 500 wedding cards, you design one template and a printer makes all of them.', tk:'Write patterns; Lex writes the scanner.',
      n:{say:'Step through: <code>lex.l</code> (your patterns) → Lex → <code>lex.yy.c</code> (C code with a table and a driver function <code>yylex()</code>) → gcc → the scanner program. The parser calls <code>yylex()</code> each time it wants the next token.', ask:'Is the output of Lex a scanner I can run straight away?', ans:'Not yet. Lex outputs C source code (lex.yy.c). You compile that with gcc to get a runnable program.', watch:'Students confuse Lex the tool with the scanner it produces. Lex runs once at build time; the scanner runs on every input.'}},
    {k:'Example', h:'The three parts of a Lex program', ic:'📜', code:`%{
#include "tokens.h"   /* C declarations: IF, ID, NUMBER, RELOP, LT, LE */
%}
delim   [ \\t\\n]
ws      {delim}+
letter  [A-Za-z]
digit   [0-9]
id      {letter}({letter}|{digit})*
number  {digit}+(\\.{digit}+)?(E[+-]?{digit}+)?
%%
{ws}      { /* no action and no return */ }
if        { return IF; }
{id}      { yylval = installID(); return ID; }
{number}  { yylval = installNum(); return NUMBER; }
"&lt;"       { yylval = LT; return RELOP; }
"&lt;="      { yylval = LE; return RELOP; }
%%
int installID()  { /* put yytext in the symbol table */ }
int installNum() { /* put the number in a table */ }`, p:'Part 1: declarations and names for patterns. Part 2, between <code>%%</code>: <b>pattern { action }</b> rules. Part 3: helper C functions.',
      parts:[['%{ … %}','C code copied unchanged to the top of lex.yy.c (includes, token codes)'],['delim, ws, letter …','Regular definitions: names for patterns, used later as {name}'],['first %%','End of part 1; the translation rules start'],['pattern { action }','When the pattern matches, run this C code'],['second %%','End of the rules; the user code starts'],['installID(), installNum()','Helper functions called from the actions, copied to the end of lex.yy.c']],
      what:'Flex reads part 1 to learn the names, part 2 to build the DFA and the actions, and copies part 3 to the end of lex.yy.c. The next three slides open each part.',
      res:'A Lex program = declarations %% rules %% user code.',
      an:'A recipe book: first the list of ingredients, then the steps, then the notes at the back.', tk:'Declarations %% rules %% user code.',
      n:{say:'Point at each part. In the actions, <code>yytext</code> is the matched lexeme (for example "count1"), <code>yyleng</code> is its length, and <code>yylval</code> carries the attribute value to the parser. Returning a value ends this call of yylex(); an action with no return (like {ws}) makes Lex keep scanning.', ask:'Why do the patterns in part 1 have names like {digit}?', ans:'They are regular definitions: short names for longer patterns, so the rules stay readable. {id} is easier to read than [A-Za-z]([A-Za-z]|[0-9])*.', watch:'Inside the rules, a name must be in braces: <code>{id}</code>. Writing just <code>id</code> means the two letters i and d.'}},
    {k:'Part 1', h:'Lex part 1: declarations and regular definitions', ic:'📜', code:`delim   [ \\t\\n]
ws      {delim}+
letter  [A-Za-z]
digit   [0-9]
id      {letter}({letter}|{digit})*
number  {digit}+(\\.{digit}+)?(E[+-]?{digit}+)?`,
      parts:[['[ \\t\\n]','A character class: one blank, one tab (\\t) or one newline (\\n)'],['{delim}+','Use the name delim; + means one or more'],['[A-Za-z]','Any one capital or small letter'],['[0-9]','Any one digit'],['({letter}|{digit})*','Zero or more letters or digits'],['\\.','A real dot; a plain . would mean “any character”'],['( … )?','The bracketed part is optional'],['[+-]?','An optional + or − sign']],
      what:['Each line gives a name to a pattern: name, spaces, pattern.','A later pattern may use an earlier name in braces, like {digit}.','Flex replaces each {name} by its pattern before building the NFA.'],
      eg:{note:'What does <code>{number}</code> match at the start of each input?', out:`42;        → 42
3.14)      → 3.14
6.02E+23   → 6.02E+23
12.x       → 12   (the dot is left for the next token)`},
      res:'Readable short names for the patterns that the rules will use.',
      an:'Nicknames in a class: instead of saying “Muhammad Ahmed Khan from section B” every time, you say “Ahmed B”.', tk:'Name = pattern; use it as {name}.',
      n:{say:'Point at each symbol of the number pattern and match it with the number diagram: \\. is the arrow 13 → 14, E is 13 or 15 → 16, [+-]? is 16 → 17. The 12.x case shows longest match: {number} cannot use the dot, so it stops after 12.', ask:'Why is the dot written \\. and not just . ?', ans:'In Lex a plain . means “any character except newline”. To match a real dot you escape it with a backslash (or write it in quotes ".").', watch:'In part 1 the name must start at the very beginning of the line; the pattern comes after spaces. In part 2 a pattern must start at the beginning of the line too.'}},
    {k:'Part 2', h:'Lex part 2: the rules <code>pattern { action }</code>', ic:'⚡', code:`{ws}      { /* no action and no return */ }
if        { return IF; }
{id}      { yylval = installID(); return ID; }
{number}  { yylval = installNum(); return NUMBER; }
"&lt;"       { yylval = LT; return RELOP; }
"&lt;="      { yylval = LE; return RELOP; }`,
      parts:[['{ws} { }','Whitespace: matched, but no return, so yylex() keeps scanning'],['if','The two letters i, f exactly; listed before {id}'],['{id}','Any identifier; installID() puts yytext in the symbol table'],['yylval = …','The attribute value handed to the parser'],['return ID;','yylex() stops and returns this token code'],['"&lt;", "&lt;="','Text in quotes is matched exactly, character by character'],['{number}','Any number; installNum() stores its value']],
      what:['yylex() finds the longest prefix of the input that some pattern matches.','On a tie, it picks the rule listed first.','It sets yytext to the matched text and runs that rule’s action.','If the action returns, yylex() returns that token; if not, it scans on.'],
      eg:{note:'Input <code>if x1</code>:', out:`call 1: "if"   → rule if    → returns IF
call 2: " "    → {ws}, no return; "x1" → {id} → yylval = entry of x1, returns ID`},
      res:'Each rule says what text to match and what token to give back.',
      an:'A list of instructions on a factory sorting belt: “if the item is red, put it in box 1; if it is round, put it in box 2; if it is dust, throw it away”.', tk:'pattern { action }: match, then run the C code.',
      n:{say:'Read each rule as a sentence: “when you see whitespace, do nothing”; “when you see if, return IF”. Stress that an action is plain C code. The order of rules matters only for ties (slide “Lex’s two rules”).', ask:'What happens to the blank in “if x1” in terms of calls?', ans:'It is matched inside call 2 by {ws}. That action has no return, so the same call goes on and matches x1.', watch:'A missing return in a token rule is a classic bug: the token is matched and silently thrown away.'}},
    {k:'Part 3', h:'Lex part 3: user code', ic:'🧰', code:`%%
int installID()  { /* put yytext in the symbol table,
                      return a pointer to its entry */ }
int installNum() { /* put the number in a table */ }

int main() {                         /* added for the lab */
    int t;
    while ((t = yylex()) != 0)
        printf("%d %s\\n", t, yytext);
    return 0;
}`,
      parts:[['%%','The second separator: everything after it is copied to lex.yy.c unchanged'],['installID()','Looks up yytext; inserts it if new; returns its entry'],['installNum()','Stores the value of the number lexeme'],['main()','Starts the program (only for a stand-alone scanner)'],['t = yylex()','Ask for the next token code'],['!= 0','yylex() returns 0 at the end of the input']],
      what:['Flex copies this part to the end of lex.yy.c.','The actions in part 2 can call these functions.','For the lab, main() calls yylex() until it returns 0 and prints each token.'],
      eg:{note:'Input <code>count1 count1</code> (two equal names):', out:`installID("count1") → new entry, say entry 4
installID("count1") → found, same entry 4`},
      res:'Part 3 holds the helper functions (and, for testing, main) that the rules need.',
      an:'The notes at the back of a recipe book: how to make the sauce that several recipes use.', tk:'Part 3: plain C helpers copied as they are.',
      n:{say:'In a real compiler there is no main() here: the parser (Yacc/Bison) calls yylex() whenever it needs a token. The main() is only for testing the scanner by itself, as in the lab.', ask:'Can part 3 be empty?', ans:'Yes. You may even leave out the second %% if there is no user code. Then the helper functions must come from another C file.', watch:'Students write main() in part 1. Part 1 C code must be inside %{ %} and usually holds only declarations.'}},
    {k:'Step 1', h:'Generate the scanner: <code>flex scan.l</code>', ic:'🏭',
      parts:[['flex','The scanner generator (the free version of Lex)'],['scan.l','Your Lex specification: patterns and actions (input)'],['lex.yy.c','The C file flex writes (output); this name is the default']],
      what:['Flex reads the patterns in scan.l.','It builds an NFA for each pattern, joins them, and turns them into one DFA (Session 5).','It writes the DFA tables and the function <code>yylex()</code> into <code>lex.yy.c</code>.','If the .l file is correct, flex prints nothing.'],
      eg:{note:'Run it and list the folder:', code:`$ flex scan.l
$ ls`, out:`lex.yy.c  scan.l`},
      res:'<code>lex.yy.c</code> = the scanner as C source code (not yet runnable).',
      an:'A printing press makes the plate from your design. You still need to print (compile) before anyone can read it.', tk:'flex: .l file → lex.yy.c.',
      n:{say:'Open lex.yy.c in an editor: it is a few thousand lines of C. Search for <code>yylex</code> to find the driver function, and for your own action code, for example <code>return IF;</code>: flex has copied it inside. To choose another name use <code>flex -o scan.c scan.l</code>. On Windows with WinFlexBison the command is <code>win_flex scan.l</code>.', ask:'Does flex check my C code inside the actions?', ans:'No. Flex copies the actions as plain text. Mistakes in the C code are found later, by gcc.', watch:'Students try to run lex.yy.c. It is C source code; it must be compiled first.'}},
    {k:'Step 2', h:'Compile it: <code>gcc lex.yy.c -o scan</code>', ic:'⚙️',
      parts:[['gcc','The C compiler (it also calls the linker)'],['lex.yy.c','The C file written by flex (input)'],['-o','“Output”: the next word is the name of the program'],['scan','The runnable scanner program (output)']],
      what:['gcc compiles lex.yy.c, including the DFA tables, yylex() and your main() from part 3.','The linker joins it with the C library.','It needs a <code>yywrap()</code> function: <code>%option noyywrap</code> in scan.l removes this need (or link the Flex library with <code>-lfl</code>).'],
      eg:{note:'If scan.l has no <code>%option noyywrap</code> and no main() (messages shortened; real lines begin with file and function names):', out:'undefined reference to `yywrap\'\nundefined reference to `main\'\ncollect2: error: ld returned 1 exit status'},
      res:'<code>scan</code> = the scanner as an executable program (<code>scan.exe</code> on Windows).',
      an:'The printed plate goes through the press: now there are real pages people can read.', tk:'gcc: lex.yy.c → runnable scanner.',
      n:{say:'Show the error in the example box first, then add <code>%option noyywrap</code> at the top of part 1 and a main() in part 3, and build again: no message means success. These are linker errors (Session 2): the compiler was happy, but two functions had no body. The Flex library libfl supplies both a default yywrap() and a default main(), which is why <code>gcc lex.yy.c -lfl</code> also works.', ask:'Why does the scanner need a main() at all? Lex already wrote yylex().', ans:'yylex() is only a function. A program needs main() to start; in a full compiler the parser’s main() calls yylex(). In the lab we write a tiny main() that calls yylex() in a loop.', watch:'Students put -lfl before the file name (gcc -lfl lex.yy.c). On many systems libraries must come after the files that use them.'}},
    {k:'Step 3', h:'Run it on a file: <code>./scan &lt; test.txt</code>', ic:'▶️',
      parts:[['./scan','Run the scanner program in the current folder'],['&lt;','Shell redirection: feed the file to the program as its keyboard input (stdin)'],['test.txt','The source text to be scanned']],
      what:['The program starts in main().','main() calls yylex() again and again.','Each call returns one token code and leaves the lexeme in yytext.','At end of input yylex() returns 0 and the loop stops.'],
      eg:{note:'test.txt holds <code>if count1 &lt;= 42</code>; main() prints <code>printf("%d %s\\n", t, yytext)</code>; enum: IF = 1, ELSE, WHILE, ID, NUM, RELOP:', out:`1 if
4 count1
6 &lt;=
5 42`},
      res:'One line per token: token code and lexeme. The blanks produced nothing.',
      an:'The printed book is finally read aloud, one word at a time.', tk:'./scan &lt; file: run the scanner on a file.',
      n:{say:'The numbers come from the enum in part 1, so they will differ if your enum is different. Without the &lt; the program waits for you to type; end the input with Ctrl+D (Linux) or Ctrl+Z then Enter (Windows). On Windows run <code>scan &lt; test.txt</code>.', ask:'Why is there no line for the blanks?', ans:'The {ws} rule has an empty action with no return, so yylex() just keeps scanning and the blanks never reach main().', watch:'If the scanner prints the input back unchanged, a pattern is missing: Flex’s default rule copies any unmatched character to the output.'}},
    {k:'Summary', h:'Building a Flex scanner (exam table)', ic:'📋', code:`scan.l  ──flex──▶  lex.yy.c  ──gcc──▶  scan  ──./scan &lt; test.txt──▶  tokens`,
      tbl:{cap:'Important points for your exam', h:['Command','Purpose','Output'], r:[['<code>flex scan.l</code>','Generate the scanner from patterns','<code>lex.yy.c</code> (C source)'],['<code>gcc lex.yy.c -o scan</code>','Compile and link the scanner','Executable <code>scan</code>'],['<code>gcc lex.yy.c -lfl</code>','Same, using the Flex library’s yywrap() and main()','Executable <code>a.out</code>'],['<code>./scan &lt; test.txt</code>','Run the scanner on a file','One line per token']]},
      res:'.l → lex.yy.c → executable → tokens.',
      an:'Design, print, read: three steps from an idea to a page in someone’s hands.', tk:'flex, gcc, run.',
      n:{say:'Cover the table and ask students for each column. Compare with the gcc table from Session 2: flex adds one step at the front, and gcc does the rest exactly as before.', ask:'Which of these commands do you run again when you change a pattern in scan.l?', ans:'All of them: flex to regenerate lex.yy.c, gcc to rebuild, then run again.', watch:'Students edit lex.yy.c by hand. Any change there is lost the next time flex runs; always edit scan.l.'}},
    {k:'Example', h:'Running the Lex scanner on real input', ic:'▶️', code:`input:  if count1 &lt;= 42

call  matched     rule chosen   why                        returns
1     "if"        if            tie with {id}: first rule   IF
2     " " skipped {ws}          no return, keep going
      "count1"    {id}          only {id} matches          ID   yylval → count1
3     " " skipped {ws}
      "&lt;="        "&lt;="          longest match beats "&lt;"   RELOP yylval = LE
4     " " skipped {ws}
      "42"        {number}      only {number} matches      NUMBER yylval → 42
5     end of input                                         0 (no more tokens)`,
      parts:[['call','Which call of yylex() this is (the parser makes one call per token)'],['matched','The lexeme found; it is put in yytext'],['rule chosen','The rule whose action runs'],['why','Longest match, or rule order on a tie'],['returns','The token code; yylval holds the attribute']],
      what:['Skip whitespace inside the call (the {ws} action does not return).','Find the longest match; on a tie, the first rule.','Run the action; it returns one token.','At end of input, return 0.'],
      eg:{note:'Your turn: input <code>iffy&lt;5</code>', out:`call 1  "iffy"  {id}      4 letters beat the 2 of if   → ID
call 2  "&lt;"     "&lt;"      "&lt;=" cannot match (next is 5) → RELOP, yylval = LT
call 3  "5"     {number}                                → NUMBER
call 4  end of input                                    → 0`},
      res:'Four calls, four results: ID, RELOP, NUMBER, then 0.',
      an:'A shopkeeper serving a queue: each call to yylex() serves one customer (one token). Window-shoppers (whitespace) are passed by without a receipt.', tk:'Each call to yylex() returns one token; whitespace is skipped inside the call.',
      n:{say:'Walk down the rows. Row 1: both <code>if</code> and <code>{id}</code> match two characters; the <code>if</code> rule is listed first, so IF wins. Row 3: <code>"&lt;"</code> is listed before <code>"&lt;="</code>, but <code>"&lt;="</code> matches more characters, so it wins anyway. Order only matters on a tie.', ask:'What would the scanner return for <code>iffy</code>?', ans:'ID with yylval pointing to iffy. {id} matches four characters, the if rule only two; longest match wins.', watch:'Students think yylex() returns all tokens at once. It returns one token per call; the parser calls it again for the next one.'}},
    {k:'Concept', h:'When two patterns match: Lex’s two rules', ic:'⚖️', pts:[['📏','<b>Longest match:</b> prefer the pattern that matches the most characters. <code>&lt;=</code> is one token, not <code>&lt;</code> then <code>=</code>. <code>iffy</code> is one identifier.'],['🥇','<b>Rule priority:</b> if two patterns match the <b>same</b> length, the rule listed first wins. <code>if</code> matches both the if rule and {id}; the if rule is first, so IF is returned.'],['⚠️','So list keywords <b>before</b> {id}. If {id} comes first, the keyword rule can never win, and Flex warns “rule cannot be matched”.']],
      tbl:{cap:'Who wins? (rules listed in the order: if, {id}, "&lt;", "&lt;=", {number})', h:['Input','Patterns that match','Winner','Reason'], r:[['<code>if␣</code>','if (2 chars), {id} (2 chars)','IF','Tie → first rule'],['<code>iffy</code>','if (2), {id} (4)','ID','Longest match'],['<code>i</code>','{id} (1)','ID','Only one match'],['<code>&lt;=</code>','"&lt;" (1), "&lt;=" (2)','RELOP LE','Longest match'],['<code>&lt;5</code>','"&lt;" (1)','RELOP LT','Only one match'],['<code>if</code> with {id} listed first','{id} (2), if (2)','ID','Tie → first rule (the if rule is dead)']]},
      res:'Step 1: longest match. Step 2, only on a tie: the rule listed first.',
      an:'A school prize: the student with the most marks wins. If two students tie, the one who submitted first gets it.', tk:'Longest match first; on a tie, the first rule listed.',
      n:{say:'Ask the class to predict: rules in the order [if] then [{id}]. Inputs: <code>if</code> (IF), <code>ifx</code> (ID), <code>i</code> (ID). Then swap the rules and ask again: <code>if</code> now gives ID. This is exactly the lab experiment.', ask:'Can rule priority ever beat longest match?', ans:'No. Lex first finds the longest match. Rule order is used only to break a tie between patterns of the same length.', watch:'The most common Lex bug: putting {id} above the keyword rules. Everything compiles, but no keyword is ever recognised.'}},
    {k:'Concept', h:'Looking further ahead: the / operator', ic:'👀', p:'Sometimes a token can only be decided by what comes <b>after</b> it. Lex’s <b>lookahead operator</b> <code>r1/r2</code> matches <code>r1</code> only when <code>r2</code> follows, but the text matched by <code>r2</code> is not part of the token.', code:`IF / \\( .* \\) {letter}     { return IF; }

IF(I,J)=3        →  "=" after ")", not a letter: IF is an array name
IF(A.LT.B)X=1    →  the letter X follows ")": IF is the keyword`,
      parts:[['IF','r1: the text that becomes the token (yytext)'],['/','The lookahead operator: what follows must match, but is not taken'],['\\(','A real opening bracket (escaped, because ( groups in a pattern)'],['.*','Any characters (here: the condition inside the brackets)'],['\\)','A real closing bracket'],['{letter}','A letter right after the bracket: the start of a statement'],['\\( .* \\) {letter}','r2: checked, then left in the input']],
      what:['Lex tries to match IF followed by r2.','If r2 matches after IF, only IF is taken as the lexeme; the rest stays unread.','If r2 does not match, this rule does not apply; another rule (for example {id}) may match IF.','In a real .l file write the pattern without spaces, <code>IF/\\(.*\\){letter}</code>: a blank ends a Lex pattern. The book adds spaces only to make it easy to read.'],
      eg:{note:'Two Fortran statements:', out:`IF(A.LT.B)X=1   → ) is followed by X → yytext = "IF", return IF
                  next tokens start at "(A.LT.B)X=1"
IF(I,J)=3       → ) is followed by =  → rule fails; IF is scanned as an identifier`},
      res:'r1/r2 lets the scanner peek far ahead without eating the characters it peeked at.',
      an:'In Urdu, you often know what a sentence means only when you hear the verb at the end. You wait for it, but the verb is not part of the first word.', tk:'r1/r2: match r1 only if r2 comes next; r2 stays in the input.',
      n:{say:'Old Fortran had no reserved words, so <code>IF</code> could also be an array name. The rule says: it is the keyword IF only if a bracketed condition follows and then a letter (the start of a statement). This is the example in Dragon §3.5.3. Fortran removed all blanks before scanning, which is why the examples have no spaces; <code>.LT.</code> is Fortran’s “less than”. Modern languages reserve their keywords, so you rarely need /.', ask:'Is the text after / thrown away?', ans:'No. It stays in the input and is scanned again as the next tokens. Only <code>IF</code> becomes yytext.', watch:'Students sometimes drop <code>{letter}</code> at the end. Without it, the array assignment <code>IF(I,J)=3</code> would also match.'}},
    {k:'Concept', h:'How Lex builds its DFA', ic:'🏭', p:'Lex uses the algorithms from Session 5, in this order:', pts:[['1️⃣','Build an NFA for each pattern with <b>Thompson’s construction</b>.'],['2️⃣','Add one new start state with ε-transitions to every pattern’s NFA.'],['3️⃣','Turn the combined NFA into a DFA with the <b>subset construction</b>, then apply <b>minimisation</b>.'],['🏷️','A DFA state holding several accepting NFA states reports the <b>first-listed</b> pattern (rule priority).'],['📏','While scanning, the driver remembers the last accepting state it passed (longest match).']],
      eg:{note:'Rules: 1. <code>if</code>  2. <code>{id}</code>. Input <code>if␣</code> and <code>ifx␣</code>:', out:`"if␣" : DFA state after "if" holds the accepting states of rule 1 AND rule 2
        → labelled rule 1; the blank has no move → return IF
"ifx␣": after "ifx" only rule 2 can still match → last accepting = rule 2 → return ID`},
      res:'Rule priority is stored in the DFA labels; longest match is done by the driver.',
      an:'A factory line: raw parts (patterns) become rough shapes (NFAs), are joined, then polished into one finished machine (the DFA).', tk:'Lex = Thompson + subset construction + minimisation + a driver.',
      n:{say:'Connect to Session 5: these are the same algorithms students did by hand on (a|b)*abb. Lex just runs them on all patterns at once. For our example, the DFA state reached after reading <code>if</code> contains the accepting states of both the if rule and {id}; it is labelled IF because that rule is first. Flex tables can have tens of thousands of entries, so Flex compresses them (Session 8).', ask:'Why convert to a DFA at all? Why not run the NFA?', ans:'A DFA has exactly one next state for each character, so scanning is one table lookup per character. Running an NFA means tracking many states at once, which is slower.', watch:'Students think Lex resolves conflicts while writing the code. The resolution is built into the DFA labels and the longest-match driver.'}},
    {k:'Summary', h:'The four transition diagrams (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Diagram','States','Accepting states','Retract?','Returns'], r:[['Relational operators','0–8','2, 3, 4*, 5, 7, 8*','Only 4 and 8','⟨relop, LT / LE / EQ / NE / GT / GE⟩'],['Identifiers / keywords','9–11','11*','Yes','getToken(): a keyword token, or ⟨id, installID()⟩'],['Unsigned numbers','12–21','19*, 20*, 21*','Yes, all three','⟨number, value⟩'],['Whitespace','22–24','24*','Yes','Nothing; scanning starts again']]},
      what:'Every * marks a state reached by an “other” arrow: the character that ended the token is given back. States without a * end exactly on the last character of the token.',
      res:'Four diagrams, 25 states (0–24), one rule: “other” means retract.',
      an:'Four counters in a bank: each serves one kind of customer, and each has its own short procedure.', tk:'Know the state numbers, the stars and the returns.',
      n:{say:'Ask students to draw any one of the four diagrams from memory, then check with this table. A common exam question is “Draw the transition diagram for relop / unsigned numbers and trace the input …”.', ask:'Which diagram never returns a token?', ans:'Whitespace (states 22–24). It only skips characters.', watch:'Students put a * on state 5 (EQ). No: = is complete as soon as it is read.'}},
    {k:'Summary', h:'Lex in one table (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Item','Meaning','Example'], r:[['<code>%{ … %}</code>','C code copied to the top of lex.yy.c','<code>#include "tokens.h"</code>'],['<code>%%</code>','Separates the three parts','declarations %% rules %% user code'],['<code>{name}</code>','Use a regular definition inside a pattern','<code>{letter}({letter}|{digit})*</code>'],['<code>yytext</code>','The matched lexeme','"count1"'],['<code>yyleng</code>','Length of the lexeme','6 for count1'],['<code>yylval</code>','Attribute value passed to the parser','LE, or a symbol-table entry'],['<code>yylex()</code>','The scanner function; returns one token per call, 0 at the end','<code>t = yylex();</code>'],['Longest match','Prefer the pattern matching the most characters','<code>&lt;=</code> is one token'],['Rule priority','On a tie, the first rule listed wins','if before {id}'],['<code>r1/r2</code>','Match r1 only if r2 follows; r2 stays in the input','<code>IF/\\(.*\\){letter}</code>']]},
      res:'Everything you need to read or write a small Lex program.',
      an:'A pocket phrase book: the ten phrases you need most, each with an example.', tk:'Parts, variables, conflict rules.',
      n:{say:'Cover the Meaning column and ask students to explain each item. Then cover the Example column. This table plus the four diagrams covers most of the Lex part of Quiz 1.', ask:'Which variable would you use to print the lexeme in an action?', ans:'yytext, for example <code>printf("%s", yytext);</code>.', watch:'Students mix up yytext (the text) and yylval (the attribute value).'}}
  ],
  lab:{t:'Lab: your first Flex scanner', steps:['Install flex (Linux: <code>sudo apt install flex</code>; Windows: WinFlexBison) or use an online Flex playground.','Write <code>scan.l</code> with <code>%option noyywrap</code> and rules for <code>if</code>, <code>else</code>, <code>while</code>, identifiers, integers, the relops <code>&lt; &lt;= &gt; &gt;= == !=</code>, and whitespace. Number each token kind in an enum.','In part 3 add <code>int main(){ int t; while ((t = yylex())) printf("%d %s\\n", t, yytext); return 0; }</code>.','Build and run: <code>flex scan.l</code>, then <code>gcc lex.yy.c -o scan</code>, then <code>./scan &lt; test.txt</code>. Use the input <code>if count1 &lt;= 42 else while x1 != 7</code>.','Move the <code>{id}</code> rule above the keyword rules. Build again: what does Flex warn, and what does the scanner now print for <code>if</code>? Explain using rule priority.'], out:'The .l file, the output for the test input, and a two-line explanation of the rule-order experiment.',
    n:{say:'Pairs: one types, one checks the rules against today’s slides. Before step 5, ask every pair to write down their prediction. Expected output for step 4 (token numbers depend on the enum): IF if, ID count1, RELOP &lt;=, NUM 42, ELSE else, WHILE while, ID x1, RELOP !=, NUM 7. After the swap, Flex prints “rule cannot be matched” for each keyword rule and the scanner prints ID for if, else and while.', ask:'Why do we need %option noyywrap?', ans:'At end of input Flex calls yywrap() to ask if there is more input. The option says “no more input”, so we do not need to link the Flex library (-lfl) that would supply yywrap().', watch:'Windows students may get <code>win_flex</code> instead of <code>flex</code> and <code>a.exe</code> instead of <code>./scan</code>. Check paths before blaming the .l file.'}},
  disc:['Why is retracting needed for <code>&lt;x</code> but not for <code>&lt;=</code>?','Keywords in the symbol table vs separate diagrams: which is easier to maintain when a new keyword is added to the language?','When would you <b>not</b> use a scanner generator?'],
  mistakes:['Forgetting the * (retract) on states reached by “other”.','Listing the identifier rule before keyword rules in Lex.','Drawing the number diagram so that “12.” is accepted with no digit after the dot (if the language forbids it).','Returning a token for whitespace.','Thinking rule order can beat longest match: it only breaks ties.'],
  rev:['A transition diagram is a DFA for one token class, with actions (return, retract).','A * on an accepting state means: give back the extra character.','Reserved words: pre-install them in the symbol table, or give them their own diagrams with priority.','Lex: patterns + actions → NFAs → one DFA → lex.yy.c with yylex().','Conflicts: longest match first, then the first rule listed.','Whitespace and comments are recognised but never returned.'],
  hw:'Revise Weeks 1–3 for Quiz 1. Draw the transition diagram for C comments <code>/* … */</code> (careful with <code>**/</code>), and trace it on <code>/* a ** b */</code>.',
  check:[
    {q:'In the relop diagram the input is <code>&gt;x</code>. What does the scanner do?', o:['Returns ⟨relop, GT⟩ and keeps x as part of the token','Retracts so that x is read again, then returns ⟨relop, GT⟩','Reports a lexical error because x is not an operator','Returns ⟨relop, GE⟩'], a:1, e:'State 6 sees “other” and moves to state 8*, which retracts: x belongs to the next token.'},
    {q:'A Lex file lists <code>{id}</code> first and the <code>if</code> rule second. What is returned for the input <code>if</code>?', o:['IF, because keywords always win','ID, because both match two characters and {id} is listed first','An error','IF followed by ID'], a:1, e:'Equal-length matches are broken by rule order. {id} is first, so the keyword is never recognised.'},
    {q:'The input <code>3.14)</code> runs through the number diagram. Where does it end?', o:['State 20: integer 3, then .14 separately','State 21: the number 3.14, with ) retracted','State 19: a number with an exponent','State 14: error'], a:1, e:'12→13 on 3, 14 on ., 15 on 1 and 4, then ) is “other” → 21*, a fraction without exponent.'}],
  quiz:[
    {q:'In a transition diagram, a * on an accepting state means…', o:['Error','Retract the forward pointer by one','Repeat zero or more times','Accept twice'], a:1, e:'The last character read belongs to the next token.'},
    {q:'Input <code>ifx</code>: a Lex scanner with rules [if] then [{id}] returns…', o:['IF then ID(x)','ID(ifx)','an error','IF only'], a:1, e:'Longest match beats rule order.'},
    {q:'Input <code>if</code>: rules [if] then [{id}]. Which wins?', o:['ID','IF','both','neither'], a:1, e:'Equal length → first listed rule.'},
    {q:'Which part of a Lex program contains the patterns and actions?', o:['Declarations','Translation rules (between %%)','User subroutines','The header file'], a:1, e:'Pattern { action } lines.'},
    {q:'Lex converts the combined NFA into a DFA using…', o:['Thompson’s construction','Subset construction','LL(1) tables','Backpatching'], a:1, e:'Then it minimises the DFA.'},
    {q:'What does the whitespace diagram return to the parser?', o:['A WS token','Nothing; the scanner starts again on the next token','The number of blanks','A newline token'], a:1, e:'Whitespace is recognised but no token is returned.'},
    {q:'In Lex, the variable <code>yytext</code> holds…', o:['The token code','The matched lexeme','The whole input file','The line number'], a:1, e:'yytext is the matched text; yylval carries the attribute value.'}],
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
  terms:[['Transition diagram','Flowchart-like graph of states used to recognise a token.'],['Retract','Moving the forward pointer back one character after reading too far.'],['Reserved word','A keyword that cannot be used as an identifier.'],['installID()','Routine that looks up or inserts a lexeme in the symbol table.'],['Lex / Flex','Scanner generators that build a scanner from regular expressions and actions.'],['yytext','Lex variable holding the current lexeme.'],['yylval','Lex/Yacc variable holding the token’s attribute value.'],['Lookahead operator','In Lex, r1/r2 matches r1 only when followed by r2.'],['Rule priority','In Lex, on equal-length matches the rule listed first wins.']]
},
/* ================= WEEK 4 ================= */
{ id:7, week:4, unit:'Implementing scanners', ic:'🛠️', lo:[2], book:'Cooper & Torczon Ch. 2.5 · Louden Ch. 2.5',
  title:'Implementing Scanners I: Hand-Coded (Direct-Coded) Scanners',
  sub:'Turning transition diagrams into code: the getToken loop, lookahead and retract, keyword lookup, line tracking and error reporting.',
  introH:'Real compilers write their scanners by hand',
  intro:'Production compilers such as GCC, Clang and the Go compiler do not use Lex. Their scanners are <b>hand-written</b>, because speed and clear error messages matter. Today you write one yourself, straight from the transition diagrams of Session 6.',
  introAn:'A tailor can buy a ready-made shirt or stitch one by hand. The hand-stitched shirt takes longer, but it fits perfectly and the tailor controls every seam.',
  introN:{say:'Draw the identifier diagram (states 9 → 10 → 11*) on the board from memory and ask: how would you write this in C or Python? Take two or three ideas. Then say: by the end of today we will have a working scanner of about 50 lines, and every line comes from a diagram.', ask:'Why not always use Lex, since it does the work for us?', ans:'Lex is great for quick projects. Big compilers hand-code because hand-written code can be faster, gives better error messages, and handles strange rules (like Python’s indentation) more easily.', watch:'Some students have not finished the Session 6 diagrams. Keep the relop, identifier and number diagrams visible on a side board all lesson.'},
  obj:['Translate transition diagrams into switch, if and while code.','Implement nextChar, peek and retract.','Recognise identifiers, keywords, numbers and operators by hand.','Track line and column numbers and report lexical errors.','Explain the pros and cons of hand-coded scanners.'],
  bloom:{head:['<b>Apply</b> transition diagrams to write scanner code.','<b>Analyse</b> where lookahead is needed.','<b>Explain</b> why production compilers hand-code scanners.'],
    heart:['<b>Take pride</b> in clean, readable code.','<b>Respect</b> edge cases and error messages for the user.'],
    hand:['<b>Implement</b> a working scanner in C, Java or Python.','<b>Debug</b> it on tricky input (<code>a&lt;=b</code>, <code>x1y2</code>, <code>12.5e3</code>).']},
  slides:[
    {k:'Concept', h:'Three ways to build the same scanner', ic:'🧭', p:'Every scanner runs a DFA. The question is only where the DFA lives.', pts:[['✍️','<b>Hand-coded</b> (also called <b>direct-coded</b>): the DFA is written as ordinary <code>if</code>, <code>while</code> and <code>switch</code> code. <i>Today.</i>'],['📊','<b>Table-driven:</b> the DFA is a table, read by a small fixed loop. <i>Session 8.</i>'],['🏭','Generated: a tool such as Lex builds the table or the code from regular expressions. <i>Session 6 and 8.</i>']], an:'Directions to a friend’s house: you can memorise the turns (hand-coded), carry a printed table of turns (table-driven), or let Google Maps work them out (generated).', tk:'Same DFA, three implementations.',
      n:{say:'Stress that all three accept exactly the same tokens if they come from the same DFA. The difference is speed, effort and how easy it is to change the language later.', ask:'Which one is “correct”?', ans:'All three can be correct. They differ in speed, effort to write and effort to change, not in what they accept.', watch:'Students think hand-coded means “no DFA”. The DFA is still there; it is hidden in the control flow.'}},
    {k:'Concept', h:'The plan: one function, getToken()', ic:'🎯', p:'The parser calls <code>getToken()</code> whenever it wants the next token. Each call skips blanks and comments, reads one lexeme, and returns one token with its position.', code:`struct Token {
    int    kind;      // ID, NUM, RELOP, IF, WHILE, SEMI …
    string lexeme;    // "count1", "42", "&lt;="
    int    attr;      // e.g. LE for &lt;=, or a symbol-table entry
    int    line, col; // where it starts, for error messages
};
Token getToken();     // called again and again by the parser`,
      parts:[['struct Token','A small record that holds everything about one token'],['kind','The token name: ID, NUM, RELOP, IF …'],['lexeme','The actual characters matched, e.g. "count1"'],['attr','Extra information: which operator (LE) or which symbol-table entry'],['line, col','Where the lexeme starts in the source file'],['Token getToken();','The function that finds and returns the next token']],
      what:['The parser calls getToken().','getToken() skips blanks and comments.','It reads one lexeme and fills a Token record.','It returns the record; the next call continues from where this one stopped.'],
      eg:{note:'Line 1 is <code>if (count1 &lt;= 42)</code>. The 3rd and 4th calls return:', out:`Token{ kind=ID,    lexeme="count1", attr=entry of count1, line=1, col=5 }
Token{ kind=RELOP, lexeme="&lt;=",     attr=LE,              line=1, col=12 }`},
      res:'Each call of getToken() gives the parser one complete Token record.',
      an:'A waiter in a restaurant: every time the cook rings the bell (the parser calls), the waiter brings exactly one dish (one token).', tk:'One call, one token, with its position attached.',
      n:{say:'Write the struct on the board. Point out <code>line</code> and <code>col</code>: storing them in every token costs little and makes every later error message better. The parser never sees characters, only these structs.', ask:'Why not return all tokens in a list at once?', ans:'You can, and small tools do. Compilers usually scan on demand so they do not hold a huge list in memory, and so the parser can stop at the first fatal error.', watch:'Keep token kinds (ID, NUM) separate from attributes (which identifier, which number). Students often merge them.'}},
    {k:'Concept', h:'Two pointers into the input', ic:'👉', p:'The scanner keeps the source text in a buffer and uses two markers. <code>lexemeBegin</code> marks where the current lexeme starts. The forward pointer marks the next character to read. When a token is finished, the lexeme is the text between them.', code:`buffer:   c o u n t 1 ␣ &lt; = ␣ 4 2 ;
          ↑           ↑
     lexemeBegin    forward      lexeme = "count1"`,
      parts:[['buffer','The source text held in memory, one character per cell'],['␣','A blank'],['lexemeBegin','Index of the first character of the current lexeme'],['forward','Index of the next character to be read'],['lexeme','The characters from lexemeBegin up to, but not including, forward']],
      what:['At the start of a token: lexemeBegin = forward.','Move forward one character at a time while the token goes on.','When the token ends, the lexeme is buf[lexemeBegin … forward−1].','The next token starts from the current forward.'],
      eg:{note:'Buffer <code>count1␣&lt;=␣42;</code> (indexes from 0: c=0 … ␣=6, &lt;=7, ==8). Second call, after the blank is skipped:', out:`lexemeBegin = 7, read &lt; and =, forward = 9
lexeme = buf[7..8] = "&lt;="`},
      res:'Two indexes are enough to cut each lexeme out of the buffer.',
      an:'Highlighting a word with a marker: one end of the highlight is where you started, the other end is where your pen is now.', tk:'Lexeme = the text from lexemeBegin up to (not including) forward.',
      n:{say:'This is the buffer from Session 3. Move two pens along the line on the board. At the start of each token, set lexemeBegin = forward. Then move forward until the token ends.', ask:'What happens to lexemeBegin after the token count1 is returned?', ans:'At the next call, after skipping the blank, it is set to the position of <code>&lt;</code>, and the next lexeme starts there.', watch:'Off-by-one errors: forward points to the next unread character, so the lexeme does not include buf[forward].'}},
    {k:'Example', h:'Small helper routines for reading', ic:'🧰', code:`char nextChar() {                 // read one character and move on
    char c = buf[forward++];
    if (c == '\\n') { line++; col = 1; } else col++;
    return c;
}
char peek()       { return buf[forward]; }     // look, do not move
char peekAt(int k){ return buf[forward + k]; } // look k further ahead
void retract()    { forward--; col--; }        // give one character back
string lexeme()   { return buf.substring(lexemeBegin, forward); }`,
      parts:[['nextChar()','Returns the character at forward and moves forward by one (it consumes it)'],['buf[forward++]','Take the character, then add 1 to forward'],['line++, col = 1','After a newline we are at column 1 of the next line'],['peek()','Returns the character at forward but does not move'],['peekAt(k)','Looks k characters further ahead, without moving'],['retract()','Moves forward back by one: gives one character back'],['lexeme()','Cuts the text between lexemeBegin and forward out of the buffer']],
      eg:{note:'buf = <code>x&lt;=1</code>, lexemeBegin = forward = 1 (at &lt;):', code:`peek(); peekAt(1); nextChar(); nextChar(); retract(); lexeme();`, out:`peek()     → '&lt;'   forward stays 1
peekAt(1)  → '='   forward stays 1
nextChar() → '&lt;'   forward = 2
nextChar() → '='   forward = 3
retract()  →       forward = 2
lexeme()   → "&lt;"   (buf[1..1])`},
      res:'Five tiny routines; every scanner branch is built from them.',
      p:'With these, every arrow in a diagram becomes one or two lines of code.', an:'Reading a menu: nextChar is reading the next dish and moving your finger; peek is glancing at it without moving your finger.', tk:'nextChar, peek and retract are all you need for lookahead.',
      n:{say:'Explain each one with the board buffer. Only nextChar moves forward and counts lines. If you retract a newline, the line count would be wrong, so in practice we use <code>peek()</code> before deciding, and never need to retract a newline.', ask:'Why does only nextChar update the line counter?', ans:'Because it is the only routine that really consumes a character. If peek also counted, the same newline would be counted twice.', watch:'This retract does not fix line and col if it gives back a newline. Make students use peek() so they never retract across a line break.'}},
    {k:'Example', h:'<code>nextChar()</code> keeps the line and column', ic:'📏', code:`int line = 1, col = 1;        // position of the NEXT character

char nextChar() {
    char c = buf[forward++];
    if (c == '\\n') { line++; col = 1; }   // new line starts
    else col++;                           // same line, next column
    return c;
}`,
      parts:[['line = 1, col = 1','Start of the file: line 1, column 1'],['c == \'\\n\'','The character just read is a newline'],['line++','Move to the next line'],['col = 1','The next character is at the start of that line'],['col++','Any other character: the next one is one column further right']],
      what:['Before reading, (line, col) is the position of the next character.','Reading a normal character moves col one step right.','Reading a newline moves to the next line and sets col back to 1.','getToken() copies (line, col) into the token just before reading its first character.'],
      eg:{note:'Input <code>a⏎bc</code> (⏎ = newline):', out:`start          line 1, col 1
read a         line 1, col 2
read ⏎         line 2, col 1
read b         line 2, col 2
read c         line 2, col 3`},
      res:'Every token knows its exact line and column, ready for error messages.',
      an:'The odometer in a car: it moves forward with every metre, and a new trip resets the trip counter to zero.', tk:'Only nextChar() moves the position; a newline resets col to 1.',
      n:{say:'Do the example on the board with two counters. Ask: if the token b starts here, what position does it get? (2:1). Remind them: getToken() must save line and col before calling nextChar() for the first character of the lexeme, otherwise every token is one column off.', ask:'How should a tab be counted?', ans:'It depends on the tool. Some count a tab as one column; others (for example recent GCC versions, option -ftabstop) jump to the next tab stop, every 8 columns. Pick one rule and keep it.', watch:'Saving the position after reading the first character gives col one too big. Save it first.'}},
    {k:'Concept', h:'From diagram to code: the translation rules', ic:'🔁', pts:[['⭕','Each <b>state</b> becomes a place in the code.'],['➡️','Each arrow becomes an <code>if</code> test on the character.'],['🔄','An arrow that loops back to its own state becomes a <code>while</code> loop.'],['🎯','An <b>accepting state</b> becomes a <code>return</code>.'],['*️⃣','A <b>*</b> (retract) usually disappears: we <code>peek()</code> instead of reading too far.']],
      tbl:{cap:'Diagram part → code (identifier diagram 9 → 10 → 11*)', h:['In the diagram','In the code','Example'], r:[['State 9 (start)','The start of a branch','<code>if (isLetter(c)) {</code>'],['Arrow 9 ─letter→ 10','An if test on the character','<code>isLetter(c)</code>'],['Self-loop on 10','A while loop','<code>while (isLetterOrDigit(peek())) nextChar();</code>'],['Accepting state 11','A return','<code>return Token(ID, lexeme());</code>'],['* on 11 (retract)','Nothing: we only peeked','—']]},
      res:'Any transition diagram can be turned into code line by line with these five rules.',
      an:'Turning a flowchart into a recipe: each box becomes a step, each “if hot” diamond becomes an “if”, each “repeat until golden” becomes a loop.', tk:'States → places, arrows → ifs, self-loops → whiles, accepting states → returns.',
      n:{say:'Do the identifier diagram live: state 9 → <code>if (isLetter(c))</code>; loop on 10 → <code>while (isLetterOrDigit(peek())) nextChar();</code>; state 11* → <code>return …</code>. Because we only peeked at the blank, there is nothing to retract.', ask:'When do we still need a real retract?', ans:'When we have already consumed a character and then discover it does not belong, for example in a generic loop that always calls nextChar(). Peeking first avoids most of these cases.', watch:'Students write <code>while (isLetterOrDigit(nextChar()))</code>. That consumes the blank too, and then they forget to give it back.'}},
    {k:'Animation', h:'A hand-coded scanner at work', demo:'handscan', p:'Press <b>Step</b>. Watch <code>getToken()</code> read <code>␣␣count1 &lt;= 42</code> and return three tokens.', an:'A security guard checking each visitor: look at the first thing about them, then follow the right procedure for that kind of visitor.', tk:'The first character decides which branch of the code runs.',
      n:{say:'At each step, ask: which diagram is this branch? Letter → identifier diagram. Digit → number diagram. <code>&lt;</code> → relop diagram. Anything else → lexical error. The first character chooses the diagram, so no diagram is ever tried and abandoned.', ask:'Why can the first character choose the diagram?', ans:'In most languages the token classes start with different characters: letters for names, digits for numbers, symbols for operators. One switch on the first character picks the right path.', watch:'Point out that <code>lookupKeywordOrId</code> is called once, after the whole word is read, not after every letter.'}},
    {k:'Example', h:'Identifiers and keywords in code', ic:'🔤', code:`if (isLetter(c)) {                     // state 9 → 10
    while (isLetterOrDigit(peek()))    // loop on state 10
        nextChar();
    string w = lexeme();               // state 11: we only peeked,
                                       // so nothing to retract
    if (keywords.contains(w))          // reserved word?
        return Token(keywordKind(w), w);
    return Token(ID, w, installID(w)); // ⟨id, symbol-table entry⟩
}`,
      parts:[['isLetter(c)','The first character (already read) is a letter: identifier branch'],['while (isLetterOrDigit(peek()))','Look at the next character; continue only if it fits'],['nextChar()','Consume it'],['w = lexeme()','The whole word, from lexemeBegin to forward'],['keywords.contains(w)','Is the word in the keyword table?'],['Token(keywordKind(w), w)','Yes: return the keyword token (e.g. WHILE)'],['Token(ID, w, installID(w))','No: return ⟨id⟩ with its symbol-table entry']],
      what:['The first letter chooses this branch.','The loop reads letters and digits; the character after the word is only peeked at.','The finished word is checked once against the keyword table.','Keyword → keyword token; otherwise → ID token.'],
      eg:{note:'Two inputs:', out:`while(    reads w h i l e, peeks ( → w = "while"  → keyword → WHILE
while1␣   reads w h i l e 1, peeks ␣ → "while1" → not a keyword → ⟨ID, while1⟩`},
      res:'Read the whole word, then decide: keyword or identifier.',
      p:'Read the whole word first. Only then decide: keyword or identifier?', an:'At a gate, the guard reads your full name first and only then checks it against the VIP list. He does not stop at the first three letters.', tk:'One loop reads the word; one lookup separates keywords from identifiers.',
      n:{say:'Trace <code>while1 </code>: w, h, i, l, e, 1 are read; the blank is only peeked. w = "while1" is not in the keyword table, so it is an ID. Trace <code>while(</code>: w = "while" is a keyword. This is Method 1 from Session 6.', ask:'What does this code return for <code>_tmp</code>?', ans:'A lexical error, because isLetter(\'_\') is false here. In C we should treat \'_\' as a letter: change the test to isLetter(c) || c == \'_\'.', watch:'In C, comparing strings with <code>==</code> compares addresses, not text. Use <code>strcmp</code>, or a hash set of strings.'}},
    {k:'Concept', h:'Making keyword lookup fast', ic:'🔑', p:'Every identifier is checked against the keyword list, so the check must be quick. Three common choices:', pts:[['🗂️','A <b>hash table</b> of keywords: one hash, usually one comparison.'],['🔎','A sorted array with binary search: about 5 comparisons for 32 C keywords.'],['🎯','A <b>perfect hash</b>: a hash function made for this fixed list, with no collisions at all.']],
      tbl:{cap:'Keyword lookup methods (exam table)', h:['Method','Cost per lookup','Note'], r:[['Linear search in a list','Up to 32 comparisons for 32 C keywords','Simple but slow'],['Sorted array + binary search','About 5 comparisons (2⁵ = 32)','Easy, no hashing'],['Hash table','One hash, usually one comparison','What GCC and Clang do'],['Perfect hash','One hash, exactly one comparison','Only for a fixed list; made with gperf']]},
      res:'Use a hash (normal or perfect): one hash and one string comparison per word.',
      an:'Finding a contact on your phone: typing the name (hash) is faster than scrolling an alphabetical list (binary search).', tk:'One quick lookup separates keywords from identifiers.',
      n:{say:'GCC and Clang put all keywords into their identifier hash table when they start, marked as reserved (Method 1 from Session 6). So one lookup both finds the identifier and tells whether it is a keyword. The tool <code>gperf</code> generates perfect hash functions; PostgreSQL uses a generated perfect hash for its SQL keywords.', ask:'Why is a perfect hash possible for keywords but not for identifiers?', ans:'The keyword list is fixed and known before the compiler is built. Identifiers are invented by programmers, so nobody knows them in advance.', watch:'Students say “perfect hash = no collisions ever”. Only for that fixed set of keys; other strings can still land on a keyword’s slot and must be compared.'}},
    {k:'Example', h:'Numbers in code', ic:'🔢', code:`if (isDigit(c)) {                              // 12 → 13
    while (isDigit(peek())) nextChar();        // loop on 13
    if (peek() == '.' &amp;&amp; isDigit(peekAt(1))) {  // 13 → 14 → 15
        nextChar();
        while (isDigit(peek())) nextChar();    // loop on 15
    }
    if ((peek() == 'E' || peek() == 'e') &amp;&amp;
        (isDigit(peekAt(1)) || ((peekAt(1) == '+' || peekAt(1) == '-')
                                &amp;&amp; isDigit(peekAt(2))))) {
        nextChar();                            // E: 16
        if (peek() == '+' || peek() == '-') nextChar();   // 17
        while (isDigit(peek())) nextChar();    // loop on 18
    }
    return Token(NUM, lexeme());               // 19, 20 or 21
}`,
      parts:[['isDigit(c)','The first character is a digit: number branch (state 12 → 13)'],['while (isDigit(peek()))','Read the whole-number digits (loop on 13)'],['peek() == \'.\' &amp;&amp; isDigit(peekAt(1))','Take the dot only if a digit comes right after it'],['second while','Read the fraction digits (loop on 15)'],['peek() == \'E\' || \'e\'','An exponent may start here (state 16)'],['peekAt(1), peekAt(2)','Check that digits really follow the E (or the E and its sign)'],['if (+ or −) nextChar()','Optional sign (state 17)'],['return Token(NUM, lexeme())','The number is complete; we never read too far']],
      what:['Read the integer digits.','If “. digit” follows, read the fraction.','If “E digit” or “E sign digit” follows, read the exponent.','Return NUM with the lexeme; no retract is ever needed.'],
      eg:{note:'Five inputs (the first call on each):', out:`42;        → NUM "42"
3.14)      → NUM "3.14"
6.02E+23   → NUM "6.02E+23"
12.x       → NUM "12"   (the dot is not followed by a digit; next call starts at .)
5E+x       → NUM "5"    (E+ is not followed by a digit; next call starts at E)`},
      res:'The number branch takes the dot or the E only when it is sure the number goes on.',
      an:'Before stepping onto a bridge, you look two steps ahead to check the planks are there. You only step when you know you can cross.', tk:'Look ahead before you leap: take the dot or the E only if digits follow.',
      n:{say:'Compare with the number diagram, line by line. The extra checks with peekAt(1) and peekAt(2) mean we never consume a dot or an E that is not followed by a digit. Results: <code>42;</code> → NUM 42. <code>3.14)</code> → NUM 3.14. <code>6.02E+23</code> → NUM 6.02E+23. <code>12.x</code> → NUM 12, and the next call sees <code>.</code>.', ask:'Why look two or three characters ahead instead of reading and retracting?', ans:'Reading and then retracting several characters is easy to get wrong. Looking first means the scanner never has to undo anything.', watch:'Without the isDigit(peekAt(1)) test, <code>12.x</code> would take the dot and return the bad lexeme “12.”.'}},
    {k:'Example', h:'Operators: try the longest one first', ic:'⚖️', code:`switch (c) {
  case '&lt;': if (peek() == '=') { nextChar(); return Token(RELOP, LE); }
             return Token(RELOP, LT);
  case '&gt;': if (peek() == '=') { nextChar(); return Token(RELOP, GE); }
             return Token(RELOP, GT);
  case '=': if (peek() == '=') { nextChar(); return Token(RELOP, EQ); }
             return Token(ASSIGN);
  case '!': if (peek() == '=') { nextChar(); return Token(RELOP, NE); }
             return Token(NOT);
  case '+': return Token(PLUS);
  case ';': return Token(SEMI);
}`,
      parts:[['switch (c)','The first character (already read) chooses the case'],['case \'&lt;\':','The branch for operators that start with &lt;'],['peek() == \'=\'','Is the next character =? Look without moving'],['nextChar(); return … LE','Yes: consume the = and return the two-character operator'],['return Token(RELOP, LT)','No: return the one-character operator; the next character stays unread'],['ASSIGN, NOT','In C, = alone is assignment and ! alone is logical not'],['case \'+\', case \';\'','Operators of one character only: return at once']],
      what:['Read the first character.','For &lt; &gt; = !, peek at the next one.','If it is =, consume it and return the long operator.','Otherwise return the short operator.'],
      eg:{note:'Four inputs:', out:`a&lt;=b   → ID a, RELOP LE, ID b
a&lt;b    → ID a, RELOP LT, ID b
x==y   → ID x, RELOP EQ, ID y
!a     → NOT, ID a`},
      res:'Peek for the second character first: this is longest match written by hand.',
      an:'A shopkeeper hears “two” and waits a moment: is it “two” or “twenty”? Only when the customer stops does he write the number.', tk:'Peek for the second character first; that is longest match by hand.',
      n:{say:'This is the C version of the relop diagram. Note the C operators: <code>==</code> is equality, <code>=</code> is assignment, <code>!=</code> is not-equal. Trace <code>a&lt;=b</code>: <code>&lt;</code>, peek sees <code>=</code>, consume it, return LE. Trace <code>a&lt;b</code>: peek sees b, return LT; b is still unread.', ask:'How would you add the C operator <code>&lt;&lt;=</code>?', ans:'Nest one more level: after <code>&lt;</code>, if peek is <code>&lt;</code> consume it, then if peek is <code>=</code> consume it too. Always test the longest form first.', watch:'Testing the one-character case first (return LT at once) is the classic bug: <code>&lt;=</code> becomes two tokens.'}},
    {k:'Example', h:'Skipping whitespace and comments', ic:'🧹', code:`void skipWhitespaceAndComments() {
  for (;;) {
    if (isspace(peek())) nextChar();
    else if (peek() == '/' &amp;&amp; peekAt(1) == '/') {          // comment to end of line
      while (peek() != '\\n' &amp;&amp; peek() != EOF) nextChar();
    }
    else if (peek() == '/' &amp;&amp; peekAt(1) == '*') {          // block comment
      nextChar(); nextChar();
      while (!(peek() == '*' &amp;&amp; peekAt(1) == '/')) {
        if (peek() == EOF) { error("unterminated comment"); return; }
        nextChar();
      }
      nextChar(); nextChar();
    }
    else return;                                         // a real token starts here
  }
}`,
      parts:[['for (;;)','Loop forever; we leave with return'],['isspace(peek())','Blank, tab or newline: consume it'],['\'/\' then \'/\'','A line comment: skip up to, not including, the newline'],['\'/\' then \'*\'','A block comment: skip the /* …'],['\'*\' then \'/\'','… until the closing */'],['peek() == EOF','End of file inside a comment: report “unterminated comment”'],['else return','The next character starts a real token']],
      what:['Skip any blanks.','If a comment starts, skip the whole comment.','Go round again: more blanks or comments may follow.','Stop when the next character starts a real token, or at end of file.'],
      eg:{note:'Input: <code>␣␣/* hi */␣// note⏎␣␣x</code>', out:`skips: 2 blanks, /* hi */, 1 blank, // note, the newline, 2 blanks
returns with peek() = 'x' at line 2, column 3`},
      res:'getToken() always starts at a real token, with the line count still correct.',
      an:'Before reading a letter aloud, you skip the empty lines and the doodles in the margin.', tk:'Skip blanks and comments in a loop; report an unterminated comment at end of file.',
      n:{say:'It is a loop because blanks and comments can alternate: <code>␣/*a*/␣//b⏎␣x</code>. Every character goes through nextChar(), so newlines inside comments are still counted. The EOF test stops an endless loop on <code>/* never closed</code>.', ask:'Does this code handle nested comments like <code>/* a /* b */ c */</code>?', ans:'No, and neither does C: the comment ends at the first <code>*/</code>, so <code> c */</code> becomes tokens. A language with nested comments needs a depth counter, which is easy in hand-written code but impossible with a plain regular expression.', watch:'Forgetting the EOF check is the most common infinite loop in student scanners.'}},
    {k:'Concept', h:'Positions and error messages', ic:'📍', pts:[['🔢','Keep <code>line</code> and <code>col</code>, and copy them into every token.'],['🩺','Print messages in the standard form: <code>prog.c:12:5: error: illegal character \'@\'</code>.'],['🏃','Recover with <b>panic mode</b>: delete the bad character and carry on scanning.'],['🧮','Count errors and stop after a limit (for example 20), so one mistake does not cause 500 messages.']],
      parts:[['prog.c','The name of the source file'],['12','Line number (counted from 1)'],['5','Column number (counted from 1)'],['error:','The kind of message (error or warning)'],['illegal character \'@\'','What is wrong, showing the bad character']],
      eg:{note:'File prog.c, line 1: <code>x = 5 $ 3;</code>', out:`prog.c:1:7: error: illegal character '$'
(the $ is deleted; scanning goes on: NUM 3, SEMI)`},
      res:'file:line:column: message, and then the scanner keeps going.',
      an:'A good teacher marks the exact line and word in your answer sheet, not just “wrong somewhere on page 3”.', tk:'Good scanners point to the exact line and column.',
      n:{say:'Show a real GCC error on the projector if possible. The form file:line:column is understood by editors such as VS Code: clicking it jumps to the place. Panic mode in the scanner is simple: skip the illegal character and call getToken() again.', ask:'Why keep scanning after an error at all?', ans:'So the programmer sees several errors in one compile, instead of fixing one, recompiling, and finding the next.', watch:'Columns start at 1 in most compilers and editors. Starting at 0 makes messages look one place off.'}},
    {k:'Example', h:'Putting it together: the whole <code>getToken()</code>', ic:'🧩', code:`Token getToken() {
    skipWhitespaceAndComments();
    int tokLine = line, tokCol = col;          // save the position first
    lexemeBegin = forward;
    if (peek() == EOF) return Token(END);
    char c = nextChar();
    if (isLetter(c)) { … identifier / keyword branch … }
    if (isDigit(c))  { … number branch … }
    switch (c)       { … operator cases … }
    error(tokLine, tokCol, "illegal character", c);   // panic mode:
    return getToken();                                // skip it, try again
}`,
      parts:[['skipWhitespaceAndComments()','Move to the start of a real token'],['tokLine, tokCol','The token’s position, saved before reading its first character'],['lexemeBegin = forward','Mark where the lexeme starts'],['Token(END)','End of file: tell the parser there are no more tokens'],['c = nextChar()','Read the first character; it chooses the branch'],['isLetter / isDigit / switch','The identifier, number and operator branches from the earlier slides'],['error(…); return getToken();','No branch fits: report the character, skip it, scan the next token']],
      what:['Skip blanks and comments.','Save the position and mark lexemeBegin.','At EOF return END.','Read one character and jump to the matching branch.','If nothing matches, report the error and start again (panic mode).'],
      eg:{note:'Input <code>␣␣x1&lt;=42;</code> on line 1, five calls:', out:`1:3  ID     x1
1:5  RELOP  LE
1:7  NUM    42
1:9  SEMI   ;
     END`},
      res:'About 50 lines in total: one skip routine, three branches and an error case.',
      an:'A post-office sorting desk: first throw away the empty envelopes, note where each letter came from, then send it to the right counter by looking at its first mark.', tk:'Skip, save position, pick a branch by the first character, return one token.',
      n:{say:'This is the skeleton the animation showed. Fill each “…” by pointing back at the identifier, number and operator slides. Count the positions in the example with the class: two blanks, so x1 starts at column 3; &lt; at 5; 4 at 7; ; at 9.', ask:'Why is the error branch a recursive call and not a loop?', ans:'Either works. The recursive call is short to write: after deleting the bad character, getToken() simply starts over. A loop avoids very deep recursion if a file has thousands of bad characters.', watch:'If students forget the EOF test, nextChar() reads past the end of the buffer.'}},
    {k:'Example', h:'A full run with positions', ic:'▶️', code:`input  line 1:  int count1 = 0;   // counter
       line 2:  if (count1 &lt;= 42) x = 6.02E+23 @;

1:1   INT     int           2:12  RELOP   &lt;=  (LE)
1:5   ID      count1        2:15  NUM     42
1:12  ASSIGN  =             2:17  RPAREN  )
1:14  NUM     0             2:19  ID      x
1:15  SEMI    ;             2:21  ASSIGN  =
2:1   IF      if            2:23  NUM     6.02E+23
2:4   LPAREN  (             2:32  error: illegal character '@' (deleted)
2:5   ID      count1        2:33  SEMI    ;`,
      parts:[['1:5','Line 1, column 5: where the token starts'],['INT, IF','Keyword tokens (found in the keyword table)'],['ID count1','Identifier token with its lexeme'],['RELOP &lt;= (LE)','Token name, lexeme and attribute'],['NUM 6.02E+23','A number with fraction and exponent, read in one call'],['error … (deleted)','Panic mode: the bad character is reported and skipped'],['// counter','The comment on line 1 produced no token at all']],
      what:['Read the two columns top to bottom: left column first, then right.','Each row is one call of getToken().','The comment and the blanks were skipped inside the calls.','The @ is reported with its exact position, then scanning continues with ;.'],
      res:'15 tokens and 1 error message, every one with its line and column.',
      an:'A cricket scorer writes every ball with the over and ball number, so anyone can find exactly when something happened.', tk:'Every token carries line:column; the bad character is reported and skipped.',
      n:{say:'Check two positions with the class by counting characters: <code>count1</code> on line 2 starts at column 5 (i, f, space, bracket, then c). The <code>@</code> is at column 32. The comment on line 1 produced no token. After deleting <code>@</code>, scanning continues and finds the <code>;</code>.', ask:'Why does count1 get the same symbol-table entry on both lines?', ans:'installID() looks the name up first. The second time it finds the existing entry and returns the same pointer.', watch:'Students forget that the first column is 1, not 0, and that a tab may count as one column or several, depending on the compiler.'}},
    {k:'Example', h:'Trace a tricky line by hand: <code>x1y2=3.25e2;</code>', ic:'🔍', code:`x1y2=3.25e2;
123456789012      ← column numbers`,
      parts:[['x1y2','Letters and digits mixed: one identifier, read by the while loop'],['=','peek() is 3, not =, so this is ASSIGN, not EQ'],['3.25','Digits, then a dot followed by a digit: the fraction is taken'],['e2','Small e followed by a digit: the exponent is taken'],[';','A one-character token']],
      what:['Call 1: x is a letter → identifier branch reads x1y2, stops at = (peeked). Not a keyword → ID.','Call 2: = → peek is 3 → ASSIGN.','Call 3: 3 is a digit → number branch: 3, then .25 (peekAt(1) is 2), then e2 (peekAt(1) is 2).','Call 4: ; → SEMI. Call 5: END.'],
      eg:{note:'Output of the scanner, with positions:', out:`1:1   ID      x1y2
1:5   ASSIGN  =
1:6   NUM     3.25e2
1:12  SEMI    ;`},
      res:'Four tokens; no character was ever read and then given back.',
      an:'A careful reader of a phone number: “0300-1234567” is read as one number, not as 0300, minus and 1234567, because he knows the pattern.', tk:'Mixed letters and digits = one ID; take the dot and the e only when a digit follows.',
      n:{say:'This is one of the lab test inputs. Ask students to predict the tokens before showing the output. 3.25e2 means 3.25 × 10² = 325. Our number branch accepts small e as well as capital E.', ask:'What would the scanner return for <code>x1y2 = 3.25e;</code>?', ans:'ID x1y2, ASSIGN, NUM 3.25, then the next call reads e as an identifier, then SEMI. The e is not followed by a digit, so it is not part of the number.', watch:'Students split x1y2 into x1 and y2. An identifier may contain any mix of letters and digits after its first letter.'}},
    {k:'Example', h:'The same scanner in about 25 lines of Python', ic:'🐍', code:`KEYWORDS = {'if', 'else', 'while', 'int', 'float', 'return'}
TWO = {'&lt;=': 'LE', '&gt;=': 'GE', '==': 'EQ', '!=': 'NE'}
ONE = {'&lt;': 'LT', '&gt;': 'GT', '=': 'ASSIGN', '+': 'PLUS', '(': 'LPAREN', ')': 'RPAREN', ';': 'SEMI'}
def scan(src):
    i, out = 0, []
    while i &lt; len(src):
        c = src[i]
        if c.isspace(): i += 1; continue
        if c.isalpha() or c == '_':
            j = i
            while j &lt; len(src) and (src[j].isalnum() or src[j] == '_'): j += 1
            w = src[i:j]; out.append(('KEYWORD' if w in KEYWORDS else 'ID', w)); i = j; continue
        if c.isdigit():
            j = i
            while j &lt; len(src) and src[j].isdigit(): j += 1
            if j + 1 &lt; len(src) and src[j] == '.' and src[j+1].isdigit():
                j += 1
                while j &lt; len(src) and src[j].isdigit(): j += 1
            out.append(('NUM', src[i:j])); i = j; continue
        if src[i:i+2] in TWO: out.append(('RELOP', TWO[src[i:i+2]])); i += 2; continue
        if c in ONE: out.append((ONE[c], c)); i += 1; continue
        raise SyntaxError(f"illegal character {c!r} at position {i}")
    return out`,
      parts:[['KEYWORDS','A Python set: one quick lookup decides keyword or ID'],['TWO, ONE','Tables of two-character and one-character operators'],['i, j','i = lexemeBegin, j = forward pointer'],['c.isspace()','Skip blanks: move i on, make no token'],['c.isalpha() or c == \'_\'','Identifier or keyword branch'],['c.isdigit()','Number branch; the dot is taken only if a digit follows'],['src[i:i+2] in TWO','Try the two-character operator first (longest match)'],['raise SyntaxError','No branch fits: a lexical error']],
      what:['Look at the character at i.','Pick the branch by its kind: space, letter, digit, two-char operator, one-char operator.','Move j to the end of the lexeme and append (token, lexeme).','Set i = j and repeat until the end of the string.'],
      eg:{note:'Run it:', code:`scan("while (x1 &gt;= 10) x1 = x1 + 1;")`, out:`[('KEYWORD', 'while'), ('LPAREN', '('), ('ID', 'x1'), ('RELOP', 'GE'),
 ('NUM', '10'), ('RPAREN', ')'), ('ID', 'x1'), ('ASSIGN', '='),
 ('ID', 'x1'), ('PLUS', '+'), ('NUM', '1'), ('SEMI', ';')]`},
      res:'The same scanner as the C slides: 12 tokens from one line, in a list.',
      an:'The same song played on a different instrument: the notes (the diagrams) stay the same.', tk:'A working scanner fits on one screen.',
      n:{say:'Run it live: <code>scan("if (count1 &lt;= 42) x = 3.5;")</code> gives (KEYWORD if) (LPAREN () (ID count1) (RELOP LE) (NUM 42) (RPAREN )) (ID x) (ASSIGN =) (NUM 3.5) (SEMI ;). Here <code>i</code> plays lexemeBegin and <code>j</code> plays the forward pointer. TWO is tested before ONE: longest match.', ask:'What happens on <code>x = 5 @ 2</code>?', ans:'It raises SyntaxError: illegal character \'@\' at position 6. A real scanner would report it, skip the @ and continue (panic mode).', watch:'If students swap the TWO and ONE lines, <code>&lt;=</code> becomes LT then ASSIGN. A good test case for the lab.'}},
    {k:'Comparison', h:'Hand-coding: the good and the bad', cmp:[['👍 Advantages',['Fastest: no table lookups','Full control over error messages and special cases','Easy to handle odd rules: nested comments, Python indentation','No extra tool needed to build it']],['👎 Disadvantages',['More code to write and test','Harder to change the set of tokens','Easy to add subtle bugs (off-by-one, EOF)','The token rules are spread across the code, not in one list']]], an:'Cooking at home versus buying ready-made: home cooking is cheaper and tastier, but you must wash every pot yourself.', tk:'Hand-code when speed and error quality matter most.',
      n:{say:'Ask: you are writing a scanner for a new language whose syntax changes every week. Hand-code or not? (Probably not: use a generator or a table, Session 8.) You are writing the scanner for a compiler used by millions? (Hand-code: GCC, Clang and Go do.)', ask:'Is a hand-coded scanner always faster than a generated one?', ans:'Usually, but not always. Generators like re2c emit direct code that is as fast as hand-written code. The real advantage of hand-coding is control.', watch:'Avoid “generated scanners are slow”. Session 8 shows that is a myth.'}},
    {k:'Summary', h:'Hand-coded scanner in one table (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Part','Job','Example'], r:[['<code>getToken()</code>','Returns the next token (one per call)','<code>⟨RELOP, LE⟩ at 1:12</code>'],['<code>nextChar()</code>','Read one character, move forward, update line/col','<code>x</code> read, forward + 1'],['<code>peek()</code> / <code>peekAt(k)</code>','Look ahead without moving','<code>peek() == \'=\'</code>'],['<code>retract()</code>','Give one character back','forward − 1'],['lexemeBegin / forward','Start of the lexeme / next character to read','lexeme = buf[begin … forward−1]'],['Keyword table','Separates keywords from identifiers after the word is read','while → WHILE, while1 → ID'],['Longest operator first','Peek for = before returning the short operator','<code>&lt;=</code> is one token'],['skipWhitespaceAndComments()','Skips blanks and comments; checks EOF','“unterminated comment”'],['Panic mode','Report the bad character, delete it, continue','<code>prog.c:2:32: error …</code>']]},
      res:'States → code places, arrows → ifs, loops → whiles, accepting → return; plus peek, keyword table and positions.',
      an:'A tool box with a label on every tool: you know what each one does and when to pick it up.', tk:'Know each routine’s job and one example.',
      n:{say:'Cover the Job column and ask students to explain each part. Then ask them to write the identifier branch from memory, using only these routines. A typical exam question: “Write a hand-coded routine to recognise relational operators”.', ask:'Which two routines never change forward?', ans:'peek() and peekAt(k). They only look.', watch:'Students confuse retract() with panic mode. Retract gives back a good character for the next token; panic mode throws away a bad character.'}}
  ],
  lab:{t:'Lab: hand-code a MiniC scanner', demo:'lexerr', demoH:'The lab, animated: errors your scanner must survive', demoN:{say:'Step through before students start. For each row ask: should our scanner report this, or is it a job for the parser? <code>fi (a == b)</code> and <code>whi1e</code> are valid identifiers, so the scanner must not complain.', ask:'Why does the scanner not catch the typo whi1e?', ans:'whi1e matches the identifier pattern perfectly. Only the parser (or the semantic phase) can see that it makes no sense there.', watch:'Students try to make the scanner “smart” about typos. Keep it simple: report only characters or lexemes that match no pattern.'}, steps:['Implement nextChar, peek, peekAt, retract and getToken for MiniC (the Assignment 1 token set).','Handle identifiers and keywords, int and float constants, all operators (longest match first) and both kinds of comments.','Print each token with line:column, as on the “full run” slide.','Test with: <code>a&lt;=b</code>, <code>x1y2=3.25e2;</code>, <code>/* unterminated</code>, <code>s = "hi" @ 2;</code>.','Compare your output with Lab tools → Tokenizer.'], out:'Source code and the test output for all four inputs.',
    n:{say:'Expected results: <code>a&lt;=b</code> → ID a, RELOP LE, ID b. <code>x1y2=3.25e2;</code> → ID x1y2, ASSIGN, NUM 3.25e2, SEMI. <code>/* unterminated</code> → error “unterminated comment” at end of file, no tokens. <code>s = "hi" @ 2;</code> → ID s, ASSIGN, STRING "hi", error illegal character @, NUM 2, SEMI (if strings are in your token set).', ask:'My scanner loops forever on the unterminated comment. Why?', ans:'The comment loop never checks for EOF, so peek() keeps returning EOF and the loop never ends. Add the EOF test inside the loop.', watch:'Check that students store the position at the start of each token (when lexemeBegin is set), not at the end.'}},
  disc:['Why might a hand-coded scanner be faster than a table-driven one?','Python’s scanner emits INDENT and DEDENT tokens. How would you implement that by hand?','What is the danger of reading two characters ahead?'],
  mistakes:['Forgetting to retract (or to peek) after reading a lookahead character.','Comparing lexemes with == on strings in C instead of strcmp.','Not handling EOF inside a string or comment (infinite loop).','Updating the line counter in peek() as well as nextChar() (double counting).','Testing the one-character operator before the two-character one (<code>&lt;=</code> becomes two tokens).'],
  rev:['Hand-coded scanners encode the DFA in control flow: states → places, arrows → ifs, self-loops → whiles.','Use nextChar, peek and retract (or peekAt) for lookahead.','Read the whole word, then look it up in a keyword table.','Try the longest operator first.','Track line and column for good error messages.','Fastest and most flexible, but more work to maintain.'],
  hw:'Finish the hand-coded scanner. Read Cooper & Torczon §2.5 on table-driven and direct-coded scanners.',
  check:[
    {q:'In a hand-coded scanner, a self-loop arrow in a transition diagram (like letter|digit on state 10) usually becomes…', o:['A return statement','A while loop','A table row','A call to retract()'], a:1, e:'Staying in the same state while the character fits is exactly a while loop.'},
    {q:'Why does the number code check <code>isDigit(peekAt(1))</code> before taking a dot?', o:['To make the scanner faster','So that 12.x gives NUM 12 and leaves the dot unread, instead of the bad lexeme “12.”','Because dots are not allowed in C','To count columns correctly'], a:1, e:'The dot belongs to the number only if a digit follows; looking first avoids having to undo the read.'},
    {q:'The operator code tests <code>peek() == \'=\'</code> after reading <code>&lt;</code>. What principle is this?', o:['Rule priority','Longest match','Panic mode','Perfect hashing'], a:1, e:'Prefer the longest operator (&lt;=) before falling back to the shorter one (&lt;).'}],
  quiz:[
    {q:'In a hand-coded scanner, a DFA state usually becomes…', o:['A table row','A position in the code (e.g. a case or loop)','A grammar rule','A symbol-table entry'], a:1, e:'Direct-coded: control flow encodes states.'},
    {q:'<code>peek()</code> returns the next character…', o:['and consumes it','without consuming it','only at EOF','after retracting twice'], a:1, e:'Lookahead without moving forward.'},
    {q:'Which production compilers use hand-written scanners?', o:['GCC and Clang','Only toy compilers','None','Only interpreters'], a:0, e:'For speed and error quality.'},
    {q:'Keyword recognition after reading an identifier is done by…', o:['A second parser','Looking the lexeme up in a keyword table','Counting characters','Retracting'], a:1, e:'One lookup decides keyword or id.'},
    {q:'A main disadvantage of hand-coding is…', o:['Slow execution','Harder to change the token set','No error messages','Needs a DFA table'], a:1, e:'Changes require rewriting code.'},
    {q:'Which routine should update the line counter?', o:['peek()','nextChar()','Both peek() and nextChar()','retract()'], a:1, e:'Only nextChar() really consumes a character; counting in peek() too would count newlines twice.'}],
  terms:[['Hand-coded scanner','A scanner whose DFA is implemented directly in program code.'],['Direct-coded scanner','Synonym for hand-coded scanner (Cooper & Torczon).'],['peek','Returns the next input character without consuming it.'],['nextChar','Returns the next character and advances the input pointer.'],['Keyword table','A set of reserved words checked after reading an identifier.'],['Perfect hash','A hash function with no collisions for a fixed key set (e.g. keywords).'],['getToken()','The scanner function the parser calls to get the next token.']]
},
{ id:8, week:4, unit:'Implementing scanners', ic:'📊', lo:[2], book:'Cooper & Torczon Ch. 2.5 · Dragon Ch. 3.5, 3.8',
  title:'Implementing Scanners II: Table-Driven and Automatically Generated Scanners',
  sub:'Character classes, transition tables and the driver loop; longest-match with a rollback stack; generated scanners (Lex/Flex/re2c); comparing the three approaches.',
  introH:'Change the language without touching the code',
  intro:'Imagine your language gets new tokens every week. Rewriting a hand-coded scanner each time is painful. Put the DFA in a <b>table</b> instead, and the code that runs it never changes. This is also how Lex and Flex scanners work inside.',
  introAn:'A school timetable: when classes change, the office prints a new timetable. Nobody rebuilds the school.',
  introN:{say:'Remind the class of last lecture’s hand-coded scanner: every token rule was buried in if/while code. Ask: what would you have to change to add the operator <code>**</code>? (Several places in the code.) Today the answer becomes: add one row and one column to a table.', ask:'Is a table-driven scanner a different kind of automaton?', ans:'No. It is the same DFA as before. Only the way we store it changes: in an array instead of in the code.', watch:'Teacher note: the scanned course outline’s Week 4 row also mentions “Ampere’s Law and Its Applications”. That is a physics topic pasted by mistake; Week 4 covers scanner implementation only. Tell students if they ask.'},
  obj:['Represent a DFA with character classes and a transition table.','Write the table-driven driver loop with longest-match rollback.','Explain how generators like Flex produce table-driven or direct-coded scanners.','Compare hand-coded, table-driven and generated scanners.','Estimate table size and describe table compression.'],
  bloom:{head:['<b>Construct</b> a transition table with character classes.','<b>Trace</b> the driver loop on an input.','<b>Evaluate</b> which implementation fits a given project.'],
    heart:['<b>Value</b> the separation of data (table) from code (driver).','<b>Appreciate</b> trade-offs instead of “one right answer”.'],
    hand:['<b>Implement</b> a table-driven scanner for identifiers and integers.','<b>Generate</b> a scanner with Flex and compare outputs.']},
  slides:[
    {k:'Concept', h:'Store the DFA as data, not as code', ic:'📊', p:'A DFA is just states and arrows. We can write it as a <b>transition table</b>: one row per state, one column per input, and in each cell the next state. A short, fixed <b>driver loop</b> (the code that reads a character and looks up the next state) then runs any table you give it.', an:'A train timetable on the station wall. The station master does not change his job when the trains change; only the timetable is replaced.', tk:'Table = the language; driver = the same code for every language.',
      n:{say:'Draw a tiny table on the board for the identifier DFA: rows s0 and s1, columns letter and digit. Ask: if I want identifiers to allow <code>$</code>, what do I change? One cell, not the code.', ask:'Is this slower than hand-coded?', ans:'A little, because every character costs an array lookup. Usually the difference is small, and the table is much easier to change.', watch:'Students mix up the table (the DFA) with the symbol table (the names in the program). Different tables, different jobs.'}},
    {k:'Concept', h:'Problem: 256 columns, almost all the same', ic:'😵', p:'If every possible character gets its own column, an 8-bit character set needs 256 columns. But for identifiers, all 52 letters behave the same, and all 10 digits behave the same. Most columns would be copies of each other.', ex:'A 100-state DFA × 256 columns = 25,600 cells, mostly repeated.', an:'A class register with a separate column for every student’s shoe size, when all you need to know is “present” or “absent”.', tk:'Many characters behave identically, so their columns are copies.',
      n:{say:'Ask a student to pick any two letters, say <code>a</code> and <code>q</code>. In the identifier DFA, does it ever matter which one we read? No. So they can share one column.', ask:'Do letters always behave the same?', ans:'Not always. In the number DFA, <code>E</code> and <code>e</code> start an exponent, so they need their own class there. Classes depend on the token set.', watch:'Make sure students see the problem before the solution on the next slide.'}},
    {k:'Concept', h:'Character classes shrink the table', ic:'🔠', p:'Group the characters that always lead to the same next state into a <b>character class</b>. A small array <code>charClass[c]</code> maps each character to its class. The table then has one column per class.', code:`charClass[c]:
  'a'..'z', 'A'..'Z', '_'  → letter
  '0'..'9'                 → digit
  everything else          → other

next state = delta[state][ charClass[c] ]`,
      parts:[['charClass[c]','An array with one cell per character (256 cells); each cell holds a class number'],['\'a\'..\'z\', \'A\'..\'Z\', \'_\'','All these characters get the class letter'],['\'0\'..\'9\'','All digits get the class digit'],['everything else','Blanks, operators, brackets …: the class other'],['delta[state][class]','The transition table, now with one column per class'],['next state','Found in two steps: class first, then the table cell']],
      what:['Read the character c.','Look up its class: charClass[c].','Look up delta[state][class] to get the next state.'],
      eg:{note:'Three characters, starting in s0:', out:`charClass['x'] = letter   → delta[s0][letter] = s1
charClass['7'] = digit    → delta[s0][digit]  = s2
charClass['='] = other    → delta[s0][other]  = se`},
      res:'256 columns become 3: letter, digit and other.',
      an:'In a school, the canteen does not care about your roll number, only whether you are a student or a teacher. Two groups, not a thousand people.', tk:'Character classes turn 256 columns into a handful.',
      n:{say:'Now each lookup is two steps: first find the class of the character, then index the table. Two array accesses, still very fast. With the three classes above, our table has 3 columns instead of 256.', ask:'Is “character class” here the same as <code>[a-z]</code> in a regular expression?', ans:'Closely related. A regex class is a set of characters in a pattern. Here a class is a set of characters that the DFA treats the same way. A generator builds these classes from the regex classes.', watch:'Every character must belong to exactly one class. Forgetting a class for “other” leaves holes in the table.'}},
    {k:'Example', h:'A transition table for identifiers and integers', ic:'🗂️', code:`delta    letter   digit   other     accepting?
s0       s1       s2      se        no
s1       s1       s1      se        yes → ID
s2       se       s2      se        yes → NUM
se       se       se      se        no  (error state)`,
      parts:[['delta','The name of the table: delta[state][class] = next state'],['letter, digit, other','The columns: one per character class'],['s0','Start state of every token'],['s1','Inside an identifier (accepting → ID)'],['s2','Inside an integer (accepting → NUM)'],['se','Error state: no way back to an accepting state'],['accepting?','A second small array: is this state accepting, and which token does it give?']],
      what:['Find the row of the current state.','Find the column of the character’s class.','The cell is the next state.','Stop before entering se; if the current state is accepting, return its token.'],
      eg:{note:'Two inputs:', out:`x9␣    s0 ─letter→ s1 ─digit→ s1 ─other→ se: stop in s1 → ID "x9"
12abc  s0 ─digit→ s2 ─digit→ s2 ─letter→ se: stop in s2 → NUM "12"
       (the next call starts at a → ID "abc")`},
      res:'Four rows × three columns describe identifiers and integers completely.',
      p:'<code>se</code> is the <b>error state</b>: once you enter it, no accepting state can ever be reached. The driver stops when the next state would be <code>se</code>.', an:'A road map with a “dead end” sign: once you turn in, there is no way to your destination, so you turn back.', tk:'Changing the language = changing this table.',
      n:{say:'Read row s0: a letter starts an identifier (s1), a digit starts a number (s2), anything else is an error. Row s2 on a letter goes to se: so <code>12abc</code> is not one token. The extra column “accepting?” is a second small array that says which token each accepting state returns.', ask:'Why does s2 on a letter go to the error state instead of starting an identifier?', ans:'The table only describes one token at a time. The driver stops at <code>12</code> (the last accepting point) and the next call starts a fresh token at <code>a</code>.', watch:'Students forget the se row. It must exist so that every lookup returns some state.'}},
    {k:'Animation', h:'Running the table on real input', demo:'tablescan', p:'Press <b>Step</b> to scan <code>x2=45;</code> one character at a time.', an:'Following a timetable: find your row, find the column for the hour, read where to go next.', tk:'The driver code is the same for every language.',
      n:{say:'At each step ask the class: current state? character? class? table cell? Let them answer before you click. The single-character tokens <code>=</code> and <code>;</code> are handled by extra rows that are not in our small table; the idea is the same.', ask:'Where is the knowledge about identifiers in this scanner?', ans:'Only in the table (and in charClass). The loop itself knows nothing about identifiers or numbers.', watch:'Students think the driver retracts like the hand-coded scanner. Here it simply stops before following an arrow into se (next slide).'}},
    {k:'Example', h:'The same run, cell by cell: <code>x2=45;</code>', ic:'🗂️',
      tbl:{cap:'Each row = one table lookup (= and ; use extra rows not shown in our small table)', h:['Call','State','Next char','Class','delta cell','Action'], r:[['1','s0','x','letter','s1','consume x'],['1','s1','2','digit','s1','consume 2'],['1','s1','=','other','se','stop: s1 accepting → return ID "x2"'],['2','s0','=','(extra rows)','—','return ASSIGN'],['3','s0','4','digit','s2','consume 4'],['3','s2','5','digit','s2','consume 5'],['3','s2',';','other','se','stop: s2 accepting → return NUM "45"'],['4','s0',';','(extra rows)','—','return SEMI']]},
      what:['Every call starts in s0 at the first unread character.','Each step: class of the next character → table cell → move or stop.','The character that leads to se is not consumed; it starts the next call.'],
      res:'Four calls, four tokens: ID x2, ASSIGN, NUM 45, SEMI.',
      an:'Reading a bus timetable with your finger: row for where you are, column for the time, and the cell tells you the next stop.', tk:'Class → cell → move or stop.',
      n:{say:'Let students fill the State, Class and delta cell columns themselves before revealing. The rows marked “extra rows” would come from a bigger table with columns for = and ; and an accepting state for each of them.', ask:'In call 1, why is = not consumed?', ans:'delta[s1][other] is se, so the driver stops before reading it. The next call starts with = as its first character.', watch:'Students restart from s1 instead of s0 at the next call. Every token starts in s0.'}},
    {k:'Example', h:'The simplest driver loop', ic:'🔁', code:`Token nextToken() {
    state = s0; lexemeBegin = forward;
    for (;;) {
        next = delta[state][ charClass[peek()] ];
        if (next == se) break;           // cannot go on: stop here
        nextChar(); state = next;        // follow the arrow
    }
    if (accepting[state]) return Token(type[state], lexeme());
    return lexicalError();
}`,
      parts:[['state = s0','Every token starts in the start state'],['lexemeBegin = forward','Mark where this lexeme starts'],['for (;;)','Repeat until we break out'],['delta[state][charClass[peek()]]','Next state for the character we are looking at (not yet read)'],['if (next == se) break;','No way on: stop here, without reading the character'],['nextChar(); state = next;','Read the character and follow the arrow'],['accepting[state]','Did we stop in an accepting state?'],['Token(type[state], lexeme())','Yes: return the token that this state stands for'],['lexicalError()','No: report an error']],
      what:['Start in s0 and mark the lexeme start.','Peek at the next character and look up the next state.','If it is se, stop; otherwise consume the character and move.','After stopping: accepting state → token; otherwise → error.'],
      eg:{note:'Input <code>x2=</code>:', out:`s0 peek x (letter) → s1, consume
s1 peek 2 (digit)  → s1, consume
s1 peek = (other)  → se, stop
s1 is accepting → return ID "x2";  = is still unread`},
      res:'A loop of about ten lines runs any DFA table, as long as it never has to go back.',
      an:'Walking along a path while looking at the next stone. If it is missing, you stop where you stand.', tk:'Peek, look up, move; stop when the next state would be the error state.',
      n:{say:'Trace <code>x2=</code>: s0 sees x (letter) → s1, consume. s1 sees 2 (digit) → s1, consume. s1 sees = (other) → se: stop. s1 is accepting → return ID "x2". The = is still unread, ready for the next call.', ask:'Does this loop always find the longest match?', ans:'Only if every state on the way is accepting, or the DFA can never pass through a non-accepting state and then fail. The next slide shows a case where it breaks.', watch:'The loop peeks before moving, so there is nothing to retract when it stops.'}},
    {k:'Concept', h:'Why we sometimes need to roll back', ic:'↩️', p:'Take a number DFA where <code>12</code> is accepted, <code>12.</code> is not yet a number, and <code>12.5</code> is. On input <code>12.x</code> the simple loop reads <code>1</code>, <code>2</code>, <code>.</code> and then gets stuck in a non-accepting state. But <code>12</code> was a perfectly good token!', pts:[['📏','<b>Longest match</b> means: the longest prefix that was accepted at some point, not where we got stuck.'],['↩️','So the scanner must <b>roll back</b>: undo reads until it is back at the last accepting state.']],
      what:['The simple loop reads 1, 2 and the dot, and is now in a non-accepting state.','x leads to the error state, so the loop stops.','The state is not accepting, so the simple loop reports an error.','A rollback goes back to the state after 12, which was accepting.'],
      eg:{note:'Input <code>12.x</code>, two drivers:', out:`simple loop : stops after "12." in a non-accepting state → lexical error ✘
with rollback: gives back "." → NUM "12" ✔, then the next calls scan . and x`},
      res:'Longest match = the last accepting point, so the driver must be able to go back to it.',
      an:'You walk down an unfamiliar lane hoping it leads to the market. It is a dead end, so you walk back to the last junction you recognised.', tk:'Longest match sometimes needs to undo a few reads.',
      n:{say:'This is the same <code>12.x</code> case from Session 6 (the number diagram failed in state 14) and Session 7 (where we avoided it with peekAt). A table-driven scanner cannot look two characters ahead by itself, so it remembers the states it passed and walks back. Another real case: C has the tokens <code>.</code> and <code>...</code>; on input <code>..x</code> the scanner must roll back to a single <code>.</code>.', ask:'How far back might we need to go?', ans:'Back to the last accepting state we passed. For normal programming languages that is only one or two characters.', watch:'Rolling back is not an error. The token is fine; the extra characters simply belong to the next token.'}},
    {k:'Example', h:'The driver loop with a rollback stack', ic:'🧱', code:`state = s0; lexeme = ""; stack.clear(); stack.push(BAD);
while (state != se) {                       // run as far as possible
    c = nextChar(); lexeme += c;
    if (accepting[state]) stack.clear();    // older states not needed
    stack.push(state);
    state = delta[state][ charClass[c] ];
}
while (!accepting[state] &amp;&amp; state != BAD) { // roll back
    state = stack.pop();
    lexeme.removeLast(); retract();         // give a character back
}
if (accepting[state]) return Token(type[state], lexeme);
return invalid;`,
      parts:[['stack.push(BAD)','A marker at the bottom: “nothing accepted yet”'],['while (state != se)','Part 1: read as far as the DFA allows'],['c = nextChar(); lexeme += c;','Read a character and add it to the lexeme'],['if (accepting[state]) stack.clear();','Leaving an accepting state: older states can never be needed again'],['stack.push(state)','Remember the state we are leaving'],['state = delta[…]','Follow the arrow (it may lead to se)'],['while (!accepting[state] &amp;&amp; state != BAD)','Part 2: roll back until an accepting state (or BAD)'],['state = stack.pop(); removeLast(); retract();','Go back one state and give one character back'],['return invalid','We reached BAD: no prefix at all was a token']],
      what:['Part 1: read characters and push states until the next state is se.','Part 2: pop states and give characters back until the state is accepting.','If an accepting state is found, return its token with the shortened lexeme.','If BAD is reached, report an invalid token.'],
      eg:{note:'Input <code>12.5;</code> (table on the next slide):', out:`read 1 → s1, read 2 → s1, read . → s2, read 5 → s3, read ; → se
roll back: pop s3, lexeme "12.5", s3 is accepting → stop
return NUM "12.5"   (only ; was given back)`},
      res:'The driver always returns the longest prefix that reached an accepting state.',
      an:'Leaving breadcrumbs as you walk. When you hit a dead end, you pick them up one by one until you reach the last signpost.', tk:'Run until the error state, then pop back to the last accepting state: that is the longest match.',
      n:{say:'This is the table-driven scanner from Cooper and Torczon §2.5. Part 1 reads until it falls into se, pushing each state it leaves. When it is in an accepting state, the stack is cleared, because we will never need to go back past it. Part 2 pops states and gives characters back until the state is accepting. BAD marks the bottom: if we reach it, nothing at all matched.', ask:'Why push BAD at the start?', ans:'It marks the bottom of the stack. If the rollback reaches BAD, no prefix was accepted, so the scanner reports an invalid token instead of popping an empty stack.', watch:'In Part 1 we check whether the state we are leaving is accepting, before pushing it. Students often check the new state instead.'}},
    {k:'Example', h:'Tracing the rollback on 12.x', ic:'🔍', code:`delta   digit  dot   other    accepting?
s0      s1     se    se       no
s1      s1     s2    se       yes → NUM (integer)
s2      s3     se    se       no
s3      s3     se    se       yes → NUM (real)

read   state left  stack after     new state   lexeme
'1'    s0          BAD s0          s1          1
'2'    s1 (acc)    s1              s1          12
'.'    s1 (acc)    s1              s2          12.
'x'    s2          s1 s2           se          12.x
roll back: pop s2 → lexeme "12."  (not accepting)
           pop s1 → lexeme "12"   (accepting: stop)
return NUM "12"; the next token starts at '.'`,
      parts:[['digit, dot, other','The three character classes of this number DFA'],['s1','After digits: accepting (integer)'],['s2','After the dot: not accepting'],['s3','After digits following the dot: accepting (real)'],['state left','The state we are leaving when the character is read'],['stack after','The stack after the clear (if any) and the push'],['new state','delta[state left][class of the character]']],
      what:['Read 1: leave s0 (not accepting), push s0.','Read 2 and the dot: each time we leave s1, which is accepting, so the stack is cleared first, then s1 is pushed.','Read x: leave s2, push it; the new state is se, so Part 1 ends.','Roll back: pop s2 (not accepting), pop s1 (accepting): stop.'],
      res:'NUM “12” is returned; the dot and the x are given back for the next token.',
      an:'Counting money and finding a torn note: you go back to the last good total and set the torn note aside for later.', tk:'Pop until an accepting state appears; that state’s lexeme is the token.',
      n:{say:'Do this on the board with a real stack (a column of boxes). Each time we leave an accepting state (s1), the stack is cleared first, then s1 is pushed. When x leads to se, we pop s2 (lexeme loses x) and then s1 (lexeme loses the dot). s1 is accepting, so the token is NUM 12, and both <code>.</code> and <code>x</code> will be read again.', ask:'What does the scanner return for input <code>12.5;</code>?', ans:'It reads 1, 2, ., 5 (reaching s3), then ; leads to se. Pop s3: lexeme 12.5 and s3 is accepting. Return NUM 12.5 after giving back only the ;.', watch:'The stack after reading <code>2</code> is just [s1], not [BAD s0 s1]: leaving the accepting state s1 cleared it.'}},
    {k:'Animation', h:'Generated scanners: the table is built for you', demo:'lexgen', p:'Building tables by hand is slow and error-prone. A scanner generator such as <b>Flex</b> builds the character classes, the DFA table and the driver from your regular expressions.', an:'A printing press: you set the text once, and the machine produces perfect copies without hand-copying mistakes.', tk:'The generator writes the table (or the code) for you.',
      n:{say:'Connect to Session 6: Flex runs Thompson’s construction, the subset construction and minimisation. Today’s new point is what comes out: <code>lex.yy.c</code> contains exactly the parts we wrote by hand today: a charClass array (Flex calls it yy_ec, the “equivalence classes”), compressed transition tables, and a driver with longest-match backing up.', ask:'Does Flex also roll back?', ans:'Yes. Its driver remembers the last accepting state and position, and backs up to them when it gets stuck. Same idea as our stack.', watch:'Students believe generated code is magic. Open a real lex.yy.c and search for yy_ec and yy_last_accepting_state to show it is today’s ideas.'}},
    {k:'Concept', h:'What generators produce', ic:'🏭', pts:[['📊','<b>Table-driven</b> output: Lex and Flex emit compressed tables plus a fixed driver, <code>yylex()</code>. Flex’s <code>-f</code> option keeps full, uncompressed tables: bigger but faster.'],['✍️','<b>Direct-coded</b> output: <b>re2c</b> turns the DFA into C code with <code>goto</code> jumps, as fast as a hand-written scanner.'],['⚖️','Both come from the same regular expressions; only the form of the output differs.']], an:'One recipe can be printed as a table of steps (table-driven) or recorded as a cooking video that just plays (direct-coded). Same dish either way.', tk:'Generated does not mean slow.',
      n:{say:'re2c is used in real projects, for example PHP’s scanner and the Ninja build tool. It reads regular expressions embedded in a C file and replaces them with goto code. Flex stays table-driven in all its modes; the options only change how the tables are stored.', ask:'Why would anyone choose table-driven output if direct code is faster?', ans:'Tables are smaller for very large DFAs, and the same driver code can be shared. Direct code grows with the number of states and arrows.', watch:'Correct an old myth: Flex does not emit goto code; its -f option produces full tables, not direct code. re2c is the direct-coded generator.'}},
    {k:'Example', h:'The same DFA as direct code', ic:'↪️', code:`s0: c = nextChar();
    if (isLetter(c)) goto s1;
    if (isDigit(c))  goto s2;
    goto error;
s1: c = nextChar();
    if (isLetter(c) || isDigit(c)) goto s1;
    retract(); return ID;
s2: c = nextChar();
    if (isDigit(c)) goto s2;
    retract(); return NUM;`,
      parts:[['s0:, s1:, s2:','Labels: each table row (state) becomes a place in the code'],['c = nextChar();','Read the next character'],['if (…) goto s1;','A table cell: on this class, jump to that state'],['goto error;','The cell that leads to se'],['retract(); return ID;','Accepting state s1 on “other”: give the character back and return'],['return NUM','Accepting state s2 on “other”']],
      what:['Start at label s0 and read a character.','Each if test is one cell of the table; the goto is the arrow.','A self-loop is a goto back to the same label.','When no test fits in an accepting state, retract and return.'],
      eg:{note:'Input <code>ab1+</code>:', out:`s0: a → goto s1;  s1: b → goto s1;  s1: 1 → goto s1;
s1: + → retract; return ID   (lexeme "ab1", + is unread)`},
      res:'No table at run time: the DFA has become ordinary jumps.',
      p:'Each row of our table becomes a label; each cell becomes a test and a jump. No table is needed at run time.', an:'Instead of checking a timetable at every station, the driver has memorised the route: at this signal turn left, at that one go straight.', tk:'Direct-coded = the table turned into labels and gotos.',
      n:{say:'Put the table from slide 4 next to this code and match them: row s1, letter or digit → s1 becomes <code>goto s1</code>; other → se becomes “retract and return”. This is what re2c generates, and it is basically the hand-coded scanner from Session 7 written with gotos.', ask:'Why is this faster than the table version?', ans:'There is no array lookup per character. The CPU just runs comparisons and jumps, and the code stays in the instruction cache.', watch:'Students are taught “never use goto”. In generated code it is fine: nobody edits it by hand.'}},
    {k:'Concept', h:'How big are the tables?', ic:'🗜️', p:'Table size = states × classes. For example, 300 states × 256 characters = 76,800 cells; with 40 classes it is 12,000. Most cells still go to the error state, so real generators also apply <b>table compression</b>:', pts:[['🧬','Merge rows (or columns) that are identical.'],['↘️','<b>Default transitions:</b> store only the cells that differ from a typical row.'],['🪮','<b>Row displacement</b> (“comb”): slide sparse rows over each other into one long array so their filled cells do not clash.']],
      eg:{note:'Work out the sizes:', code:`states × columns = cells`, out:`300 × 256 = 76,800 cells   (one column per character)
300 × 40  = 12,000 cells   (40 character classes)
→ classes alone save 64,800 cells (84 %)`},
      res:'Cells = states × classes; classes and compression keep the table small enough for the cache.',
      an:'Packing a suitcase: you roll clothes into the gaps between shoes, so the same things fit in a much smaller bag.', tk:'Character classes plus compression keep tables small.',
      n:{say:'The numbers are an illustration; work them out on the board. Flex uses equivalence classes and a comb-vector layout (its tables are called base, def, nxt and chk). A lookup in a compressed table costs a few more steps, which is why Flex offers -f for full, faster tables.', ask:'Does compression change which tokens are recognised?', ans:'No. It only changes how the same table is stored. Every lookup still gives the same next state.', watch:'Students think compression removes states. It removes repeated or empty cells, not states; minimisation is what removes states.'}},
    {k:'Example', h:'Row displacement (comb) on a tiny table', ic:'🪮', code:`Full table:            Packed into three arrays:
      c0   c1   c2       base[s0] = 0     base[s1] = 0
s0    s1   –    s3       index:   0    1    2
s1    –    s2   –        next:    s1   s2   s3
(– = error state)        check:   s0   s1   s0

lookup delta[s][c]:   i = base[s] + c
                      if check[i] == s  →  next[i]
                      else               →  error state`,
      parts:[['–','An empty cell: it leads to the error state'],['base[s]','Where row s starts inside the long arrays'],['next[i]','The real next states, packed together'],['check[i]','Which row owns position i'],['i = base[s] + c','Position of cell (s, c) in the packed arrays'],['check[i] == s','The cell really belongs to row s: use next[i]'],['else → error','Another row owns this position, so (s, c) was empty']],
      what:['Slide row s1 over row s0: its only filled cell (c1) falls into a gap of s0.','Write the filled cells into next[], and their owners into check[].','To look up a cell, compute i, then test check[i].'],
      eg:{note:'Three lookups:', out:`delta[s1][c1]: i = 0+1 = 1, check[1] = s1 ✔ → next[1] = s2
delta[s1][c0]: i = 0+0 = 0, check[0] = s0 ✘ → error state
delta[s0][c2]: i = 0+2 = 2, check[2] = s0 ✔ → next[2] = s3`},
      res:'The same answers as the full table, but only filled cells are stored; real scanner tables are very sparse, so the saving is large.',
      an:'Two combs with missing teeth pushed together so the teeth of one fill the gaps of the other: one comb, no empty spaces.', tk:'base + check + next: store only the filled cells.',
      n:{say:'Draw the two rows on strips of paper and physically slide one over the other. On this tiny table the saving is small (6 cells become 3 next + 3 check); with 300 states and 40 classes where 90 % of cells are errors, it is huge. Flex’s tables yy_base, yy_chk and yy_nxt are exactly these arrays (plus yy_def for default rows).', ask:'Why do we need the check array at all?', ans:'Without it, delta[s1][c0] would read next[0] = s1, a cell that belongs to row s0. check[] tells us whose cell it is.', watch:'Students think compression changes the DFA. Every lookup gives the same state as the full table.'}},
    {k:'Animation', h:'Comparing the three approaches', demo:'scancompare', p:'Step through the rows: how each one is built, speed, effort, ease of change, error messages, and who uses it.', an:'Getting to university by walking, bus or car: each is best for a different distance and budget.', tk:'Pick by speed, effort, flexibility and error quality.',
      n:{say:'After the animation, ask three quick scenarios. A student project with a week’s deadline: generated. A configurable tool where users add token rules at run time: table-driven. A compiler used by millions: hand-coded.', ask:'Can one project mix approaches?', ans:'Yes. A common pattern is to prototype with Flex, and later replace it with a hand-coded scanner once the language is stable and speed matters.', watch:'There is no single best answer. Ask students to justify their choice with two reasons.'}},
    {k:'Example', h:'Flex vs hand-coded: the same tokens', ic:'⚔️', code:`/* Flex: three rules */
[a-zA-Z_][a-zA-Z0-9_]*   { return lookup(yytext); }   /* keyword or ID */
[0-9]+                   { yylval = atoi(yytext); return NUM; }
"&lt;="                     { return LE; }

/* Hand-coded equivalent: about 40 lines of if / while (Session 7) */`,
      parts:[['[a-zA-Z_]','First character: a letter or an underscore'],['[a-zA-Z0-9_]*','Then any number of letters, digits or underscores'],['lookup(yytext)','Checks the lexeme in a keyword table; returns the keyword code or ID'],['[0-9]+','One or more digits'],['atoi(yytext)','C function: turns the text "42" into the integer 42'],['yylval = …','Passes the value to the parser'],['"&lt;="','The two characters &lt;= exactly']],
      what:['Flex turns the three patterns into one DFA (with character classes and tables).','yylex() finds the longest match and runs that rule’s action.','The actions hand back a token code, and a value in yylval.'],
      eg:{note:'Input <code>x1&lt;=42</code> (no blanks: this tiny file has no whitespace rule):', out:`call 1: "x1"  → lookup("x1") → ID
call 2: "&lt;="  → LE
call 3: "42"  → yylval = 42, NUM
call 4: end of input → 0`},
      res:'Three Flex rules give the same tokens as the hand-coded scanner.',
      an:'Ordering a ready-made suit versus stitching one by hand: one form to fill versus a week of work.', tk:'Three lines of Flex replace about forty lines of C.',
      n:{say:'Ask: to add the operator <code>**</code>, what changes? Flex: one new line, <code>"**" { return POW; }</code>. Table-driven: a new class for <code>*</code> (if it was “other”), one new state, and a few cells. Hand-coded: a new case with a peek. This is exactly the lab’s last step.', ask:'Where did the keyword rules go in this Flex file?', ans:'Into the <code>lookup()</code> function: it checks yytext against a keyword table (Method 1 from Session 6), so one rule covers all identifiers and keywords.', watch:'Students think fewer lines means faster scanner. It means less work for the programmer; speed is a separate question.'}},
    {k:'Summary', h:'Three ways to build a scanner (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Approach','Where the DFA lives','Speed','To add a token','Who uses it'], r:[['Hand-coded (direct-coded by hand)','In if / while / switch code','Fastest','Write a new code branch','GCC, Clang, Go'],['Table-driven','In charClass[] and delta[][]; a fixed driver loop','Fast: two array lookups per character','Change some table cells','Configurable tools'],['Generated, table-driven','Tables written by Flex / Lex, driver yylex()','Fast (compressed tables; -f gives full tables)','Add one pattern line','Student projects, many tools'],['Generated, direct-coded','goto code written by re2c','As fast as hand-coded','Add one pattern line','PHP, Ninja']]},
      what:'All four run the same kind of DFA and accept the same tokens. They differ only in where the DFA is stored, how fast it runs, and how much work a change costs.',
      res:'Choose by speed, effort, ease of change and quality of error messages.',
      an:'Tea made by hand, from a recipe card, by a machine with a menu, or by a machine wired for one drink: the same cup of tea, different effort and speed.', tk:'Same DFA, four homes.',
      n:{say:'Cover the columns one by one and ask students to fill them in. Then give a scenario for each row and ask which approach fits, with two reasons.', ask:'Which approach makes it easiest to give very good error messages?', ans:'Hand-coded: the programmer controls every branch, so each special case can get its own message.', watch:'Students write that table-driven scanners are “slow”. They are a little slower than direct code, but still one or two lookups per character.'}},
    {k:'Summary', h:'Table-driven scanner in one table (exam table)', ic:'📋',
      tbl:{cap:'Important points for your exam', h:['Part','Job','Example'], r:[['<code>charClass[c]</code>','Maps each character to its class','charClass[\'x\'] = letter'],['<code>delta[s][class]</code>','Transition table: next state','delta[s0][digit] = s2'],['<code>se</code>','Error state: stop before entering it','delta[s2][letter] = se'],['<code>accepting[s]</code>, <code>type[s]</code>','Is s accepting, and which token does it give?','s1 → ID'],['Driver loop','Same code for every language','peek, look up, move'],['Rollback stack','Undo reads back to the last accepting state','12.x → NUM 12'],['BAD marker','Bottom of the stack: nothing matched','→ invalid token'],['Table compression','Store fewer cells (classes, default rows, comb)','base / next / check']]},
      res:'Table = the language; driver = the same for every language; rollback = longest match.',
      an:'A train system: the timetable (table) changes, the drivers (loop) stay the same, and a driver who misses a station backs up to the last one (rollback).', tk:'charClass, delta, driver, rollback, compression.',
      n:{say:'Cover the Example column and ask students for one example each. A typical exam question: “Give the transition table with character classes for identifiers and integers and trace the driver on 12.x”.', ask:'Which part would you change to let identifiers contain $?', ans:'Only charClass: map \'$\' to the class letter. The driver and even delta stay the same.', watch:'Students mix up the error state se (inside the DFA) with the BAD marker (on the rollback stack).'}}
  ],
  lab:{t:'Lab: table-driven scanner + Flex comparison', steps:['Write <code>charClass[]</code> and <code>delta[][]</code> for identifiers, integers and the operators <code>+ - * / = ;</code>.','Write the driver loop with the rollback stack and print each token.','Write the same token set in Flex and generate <code>lex.yy.c</code>.','Run both on the same 20-line file. Compare the outputs, then time both on a 1 MB file.','Add a new token, <code>**</code>. Count how many lines change in each version.'], out:'Two scanners with matching outputs, a timing table, and the change-count comparison.',
    n:{say:'Suggest the classes letter, digit, star, one class each for + - / = ;, blank and other. A star class is needed because <code>*</code> and <code>**</code> will differ in step 5. Give each single-character operator its own accepting state. For timing, generate the 1 MB file with a small loop that repeats the 20-line file.', ask:'My table-driven scanner returns an error for <code>x+1</code>. Why?', ans:'Probably s1 (identifier) has no column for +, or + is not mapped to any class, so the driver cannot return to s0 for the next token. Every character must map to a class, and each token must start again from s0.', watch:'Make sure the whitespace is skipped before each call (or handled by its own non-returning state), otherwise blanks become “invalid token”.'}},
  disc:['When would a table-driven scanner beat a hand-coded one in development time?','Why does Flex compress its tables?','Your company invents a new configuration language. Which scanner approach do you choose and why?'],
  mistakes:['Using one column per character without classes (a huge, repetitive table).','Forgetting the error state se.','Not rolling back: returning an error for <code>12.x</code> when <code>12</code> is a valid token.','Assuming generated scanners are always slower.','Thinking Flex produces goto-based code: that is re2c; Flex is table-driven.'],
  rev:['Table-driven: charClass[] + delta[][] + a generic driver loop.','Character classes shrink 256 columns to a handful.','A rollback stack implements longest match when the DFA passes non-accepting states.','Generators produce table-driven (Flex) or direct-coded (re2c) scanners from regular expressions.','Hand-coded = fastest and most flexible; generated = least effort; table-driven = easy to change.','Real tables are compressed.'],
  hw:'Read Louden §2.6 (Lex). Revise Weeks 2–4; next week we finish scanners with the symbol table and start parsing.',
  check:[
    {q:'Why do table-driven scanners use character classes?', o:['To recognise keywords','Because many characters lead to the same next state, so they can share one column','To make the DFA nondeterministic','To store identifiers'], a:1, e:'Characters that behave identically share a column, which shrinks the table from 256 columns to a few.'},
    {q:'In the rollback trace for <code>12.x</code>, which token is returned?', o:['NUM “12.x”','NUM “12.”','NUM “12”, then the next token starts at the dot','An error, because x is illegal'], a:2, e:'The scanner pops back past the non-accepting state s2 to s1, the last accepting state, with lexeme 12.'},
    {q:'Which tool produces direct-coded (goto-based) scanners?', o:['Flex with default options','re2c','Yacc','A table-driven driver'], a:1, e:'re2c emits goto code; Flex always emits tables plus a driver.'}],
  quiz:[
    {q:'Character classes are used to…', o:['Speed up parsing','Reduce the number of columns in the transition table','Store identifiers','Handle errors only'], a:1, e:'Characters that behave the same share a column.'},
    {q:'The driver loop in a table-driven scanner…', o:['Changes for every language','Is the same for every language; only the table changes','Is generated by the parser','Contains the keywords'], a:1, e:'Data (table) vs code (driver).'},
    {q:'Rollback is needed to implement…', o:['Rule priority','Longest match','Comments','Hashing'], a:1, e:'Return to the last accepting state.'},
    {q:'re2c produces scanners that are…', o:['Table-driven only','Direct-coded (goto-based)','Interpreted','Recursive descent'], a:1, e:'Fast, direct-coded output.'},
    {q:'Adding a new token is easiest in a…', o:['Hand-coded scanner','Generated scanner (edit the RE)','Assembler','Linker'], a:1, e:'Just add a pattern.'},
    {q:'In the rollback driver, why is the stack cleared when the scanner leaves an accepting state?', o:['To save the lexeme','We never need to roll back further than the last accepting state','To restart the scanner','Because the table changes'], a:1, e:'Only states after the most recent accepting state can ever be popped.'}],
  terms:[['Table-driven scanner','A scanner that runs a DFA stored in a transition table with a generic driver.'],['Character class','A group of characters with identical transitions; one table column.'],['Driver loop','The generic code that reads characters and follows the table.'],['Rollback','Undoing reads to return to the last accepting state for longest match.'],['re2c','A generator that produces direct-coded C scanners.'],['Table compression','Techniques that shrink sparse transition tables.'],['Error state','A dead state from which no accepting state is reachable.']]
}
);
