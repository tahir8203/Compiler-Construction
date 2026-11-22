/* Course term dictionary. Every technical term used on a slide is explained here once.
   The engine underlines the first use of each term on a slide; hover (mouse) or tap (touch) opens a card.
   Row: [Term, 'other spellings|separated|by bars', meaning (one line), why it exists, real-life analogy] */
window.CC_TERMS = [
/* ---------- programs and translation ---------- */
['Program','programs','A list of instructions that tells a computer what to do.','Computers cannot guess; every step must be written down.','A recipe: exact steps the cook follows in order.'],
['Source code','source program|source file|source text','The program text a person writes, e.g. a .c or .java file.','People need a readable form to write and fix programs.','The handwritten draft of a letter.'],
['High-level language','high-level languages|high-level','A language close to English and maths, such as C, Java or Python.','Writing in binary is slow and error-prone; high-level code is easier to read and works on many machines.','Speaking Urdu or English instead of Morse code.'],
['Machine code','machine-code|binary instructions|native code|native machine code','The binary instructions (0s and 1s) a CPU runs directly.','The CPU is hardware: it only understands its own small set of binary commands.','The CPU’s mother tongue.'],
['CPU','processor|processors|CPUs','The chip that executes machine-code instructions one after another.','Something has to actually do the work; the CPU is that worker.','The cook who follows the recipe.'],
['Instruction set','instruction sets|ISA','The full list of machine instructions one CPU family understands (e.g. x86, ARM).','Each CPU family is built differently, so each has its own commands.','The list of dishes one cook knows how to make.'],
['Assembly language','assembly|assembly code','Machine instructions written as short words (MOV, ADD) instead of binary.','Binary is unreadable; assembly is the same thing in human-friendly spelling.','Writing “turn left” instead of a secret code number.'],
['Translator','translators','Any program that converts text in one language into another language.','Humans and machines speak different languages; something must convert between them.','A human interpreter translating a speech from Chinese to Urdu.'],
['Compiler','compilers|compiles|compiled','A program that translates a whole source program into an equivalent target program and reports errors.','Machines cannot run high-level code; translating once lets the result run fast many times.','A translator who translates a whole book once; readers then read the translation as often as they like.'],
['Interpreter','interpreters|interpreted|interprets|interpreting','A program that reads the source and executes it directly, statement by statement, without producing a target program.','Lets you run code immediately, with no separate build step.','A live interpreter at a meeting, translating each sentence as it is spoken.'],
['Source language','source languages','The language a program is written in before translation (e.g. C).','A translator must know what it is translating from.','The original language of a book.'],
['Target language','target languages|target program|target code','The language the compiler produces (e.g. machine code or bytecode).','A translator must know what it is translating to.','The language of the translated book.'],
['Execution','execute|executes|executed|executing|run time|runtime|run-time','Running a program: the CPU actually carries out the instructions.','Translation alone does nothing; the program’s work happens when it runs.','Actually cooking the dish, not just reading the recipe.'],
['Compile time','compile-time','The moment the compiler is translating the program, before it runs.','Some mistakes can be caught before the program ever runs.','Checking the recipe for missing ingredients before you start cooking.'],
['Hybrid','hybrid system|hybrid systems|hybrid compilers','A system that uses both a compiler and an interpreter.','It combines the fast start of interpreting with the speed of compiled code.','A car with both an electric motor and a petrol engine.'],
['javac','','The Java compiler. It translates .java source files into .class bytecode files.','Java code must be turned into bytecode before the JVM can run it.','A translator who turns your Java essay into a universal shorthand.'],
['.class file','.class|class file|class files','The file javac produces; it holds bytecode, not machine code.','It is the portable file you ship to users; any JVM can run it.','A sealed envelope of shorthand notes any trained reader can follow.'],
['Bytecode','bytecodes','Compact instructions for a virtual machine, not for a real CPU (one byte per operation code).','One bytecode file can run on Windows, Linux or Android, as long as a virtual machine is there.','Musical notes: any trained musician on any instrument can play them.'],
['Opcode','opcodes|operation code','The number that tells the machine which operation to do (add, load, jump…).','Every instruction must say what action it performs.','The verb in a sentence: “add”, “jump”, “store”.'],
['Virtual machine','virtual machines','A program that pretends to be a computer and runs instructions written for that imaginary computer.','It lets the same code run on many real machines without recompiling.','A universal remote that understands one set of buttons and drives any TV brand.'],
['Stack machine','stack-based|virtual stack machine|stack-based machine','A machine that keeps values on a stack: push the operands, then the operation takes them from the top.','No registers are needed, so instructions stay short and simple.','A stack of plates: you can only add or take from the top.'],
['Stack','stacks','A pile of items where you add (push) and remove (pop) only at the top.','Many problems need “last in, first out” order: function calls, parsing, evaluation.','A stack of plates in a cafeteria.'],
['Register','registers','A tiny, very fast storage slot inside the CPU.','Memory is slow; the CPU works on values held in registers.','The few items you hold in your hands while working, instead of fetching them from a cupboard.'],
['JVM','Java Virtual Machine','The Java Virtual Machine: the program that loads and runs Java bytecode.','It makes Java “write once, run anywhere”.','A universal music player that can play the same notes on any device.'],
['JIT compiler','JIT|just-in-time|JIT-compile|JIT-compiled|JIT-compiles','A compiler inside the virtual machine that turns busy (hot) bytecode into machine code while the program runs.','Interpreting is slow; compiling only the busy parts gives speed without a long wait at start-up.','A tourist who memorises the sentences used every day but uses a phrase book for rare ones.'],
['Profiling','profiles|profiler|profiles as it goes','Counting, while the program runs, how often each method is called and each loop repeats.','The JIT needs facts to decide which code is worth compiling.','A shopkeeper noting which items sell most so they keep them at the front.'],
['Hot code','hot spot|hot method|hot methods|hot spots','Code that runs very often, such as a loop that repeats a million times.','Only hot code repays the cost of compiling it to machine code.','The road you drive every day: worth learning a shortcut for.'],
['Cold code','','Code that runs rarely, such as start-up or error handling.','Compiling it would cost more time than it saves, so it stays interpreted.','A road you drive once a year: not worth learning a shortcut.'],
['HotSpot','','Oracle’s Java virtual machine, named after its trick of compiling only hot spots.','A real example of interpret-then-JIT.','A brand name for the “memorise frequent sentences” tourist.'],
['Inlining','inlined','Replacing a function call with the body of the function.','It saves the cost of the call and opens more chances to optimise.','Copying a short recipe into your notes instead of saying “see page 50”.'],
['V8','','Google’s JavaScript engine (Chrome, Node.js); it interprets, then JIT-compiles hot functions.','Fast JavaScript is needed for modern web apps.','Like the JVM, but for JavaScript.'],
['CPython','','The standard Python implementation; it compiles .py files to .pyc bytecode and then interprets it.','Shows that even “interpreted” Python compiles first.','A reader who first rewrites your notes into shorthand, then reads the shorthand aloud.'],
['DEX','DEX bytecode','The bytecode format of Android apps.','Android phones run apps from this compact format.','Android’s version of Java’s .class shorthand.'],
['ART','Android Runtime','Android Runtime: compiles an app’s DEX bytecode to machine code on the phone (ahead of time).','Precompiling saves battery and makes apps start faster.','Translating a book fully before reading it, once it arrives at your house.'],
['Ahead-of-time compilation','ahead of time|AOT','Compiling to machine code before the program runs (the opposite of JIT).','No compile delay while the user is waiting.','Translating the whole book before the reader opens it.'],
['Portable','portability','Able to run on different kinds of machines without changes.','Users have many different computers and phones.','A plug adapter that works in any country.'],
['Intermediate representation','IR|intermediate representations|intermediate code|intermediate form','A simple in-between form of the program, between source code and machine code.','It splits the compiler in two: front ends for each language and back ends for each machine can share it.','A common language like English used between a Chinese and a Brazilian translator.'],
['Error message','error messages|diagnostics|diagnostic','The text a compiler or interpreter prints to say what is wrong and where.','Programmers need to find and fix mistakes quickly.','A teacher’s red-pen note: “line 3: missing full stop”.'],
['Syntax error','syntax errors','A mistake in the form of the code, e.g. a missing semicolon or bracket.','The compiler cannot understand badly formed code.','A sentence with no full stop or a missing word.'],
['Optimisation','optimization|optimise|optimize|optimised|optimized|optimiser|optimizer|optimising|optimizing','Improving the generated code so it runs faster or uses less memory, without changing its meaning.','Straightforward translation is often slow or wasteful.','Finding a shorter route to the same destination.'],
['Constant folding','','Working out constant expressions at compile time, e.g. 5 + 3 becomes 8.','Why make the program compute 5 + 3 every time it runs?','Doing the sum on paper once instead of with a calculator every day.'],
['Garbage collector','garbage collection','Part of a runtime that frees memory the program no longer uses.','It prevents memory leaks without the programmer freeing memory by hand.','A cleaner who removes plates nobody is using anymore.'],
['Execution plan','query plan','The step-by-step plan a database builds to answer an SQL query.','SQL says what you want; the plan says how to get it.','A delivery driver’s route plan for an order.'],
['Source-to-source compiler','transpiler','A compiler whose target is another high-level language (e.g. TypeScript → JavaScript).','Lets you write in a nicer language and still run on existing platforms.','Translating British English into American English.'],
['IDE','IDEs|integrated development environment','A program for writing code with an editor, compiler, debugger and hints in one window (e.g. VS Code).','Bundles all the tools a programmer needs.','A workshop where all your tools hang on one wall.'],

/* ---------- language-processing system ---------- */
['Pre-processor','pre-processors|preprocessor|preprocessors|pre-processing|preprocessing','A program that edits the source text before compiling: pastes #include files, replaces #define macros.','Lets you reuse headers and constants without retyping them.','An assistant who pastes in standard paragraphs before the letter goes to the translator.'],
['Macro','macros','A name that stands for a piece of text; the pre-processor replaces the name with the text.','Saves typing and keeps one definition in one place.','A keyboard shortcut that expands “brb” into “be right back”.'],
['Assembler','assemblers','A program that turns assembly language into machine code (an object file).','Compilers often output assembly; something must turn it into binary.','A typist converting shorthand notes into the final printed letter.'],
['Object file','object files|.o|.obj|object code','Machine code for one source file, not yet joined with others into a runnable program.','Large programs are built from many files compiled separately.','One chapter of a book, printed but not yet bound.'],
['Linker','linkers|link editor','A program that joins object files and libraries into one executable and fills in addresses between them.','Your code calls printf, which lives in a library; the linker connects the two.','A binder who binds separate chapters into one book and fixes the page references.'],
['Loader','loaders','Part of the operating system that copies an executable into memory and starts it.','A program on disk does nothing until it is placed in memory.','The person who takes the book off the shelf and opens it at page 1.'],
['Library','libraries','Ready-made, already compiled code you can call, e.g. the C library with printf.','Nobody should rewrite printing or maths functions for every program.','A shared toolbox everyone borrows from.'],
['Executable','executables|.exe','A complete program file the operating system can run.','It is the final product the user double-clicks.','The finished, bound book.'],
['Operating system','','The software that manages the computer and runs programs (Windows, Linux, Android).','Someone has to share the CPU, memory and files between programs.','The manager of a building who gives rooms to visitors.'],
['Debugger','debuggers','A tool to run a program step by step, stop at breakpoints and inspect variables.','Finding bugs by reading code alone is hard.','Watching a slow-motion replay to see exactly where the goal went wrong.'],
['Static analyser','static analysers|static analyzer|static analyzers|static analysis','A tool that examines code without running it to find bugs.','Some bugs can be found before the program runs, saving time.','A proof-reader who spots mistakes without acting out the play.'],
['Linter','linters|lint','A tool that warns about suspicious or badly styled code (unused variables, missing semicolons).','Keeps code clean and catches small mistakes early.','A spell-checker for code style.'],
['Phase','phases','One stage of the compiler that does one job and passes its result to the next stage.','Splitting a big job into small steps makes it easier to build and check.','Stations on an assembly line: each worker does one task.'],
['Pass','passes','One complete read through the program (or its intermediate form) by the compiler.','Some jobs need information from later in the program, so a second read helps.','Reading a book once for the story and again to take notes.'],
['Front end','front ends|front-end|compiler front end|compiler front ends','The phases that understand the source program: scanner, parser, semantic analysis, IR generation.','It depends on the source language but not on the machine.','The listener who fully understands the speech before anyone translates it.'],
['Back end','back ends|back-end','The phases that produce target code: optimisation and code generation.','It depends on the target machine but not on the source language.','The writer who produces the translation in the new language.'],
['Analysis','analysis part','The part of a compiler that breaks the source into pieces and checks it (the front end).','You must understand a program before translating it.','Reading and understanding a letter.'],
['Synthesis','synthesis part','The part of a compiler that builds the target program from the intermediate form (the back end).','After understanding comes producing the output.','Writing the reply letter.'],

/* ---------- lexical analysis ---------- */
['Lexical analysis','lexical analyser|lexical analyzer|lexical analysers|lexical analyzers|lexing|lexer|lexers','The first phase: reading characters and grouping them into tokens.','Later phases want words, not single letters and spaces.','Splitting a sentence into words before checking grammar.'],
['Scanner','scanners|scanning','Another name for the lexical analyser.','Same job: turn characters into tokens.','Your eyes scanning a line and seeing words, not letters.'],
['Token','tokens','A category of word in a program: keyword, identifier, number, operator…, usually with an attribute value.','The parser only needs to know the kind of each word, not every letter.','A word’s part of speech: noun, verb, adjective.'],
['Lexeme','lexemes','The actual characters in the source that form one token, e.g. the text count.','We still need the exact spelling (for names and values).','The actual word on the page, e.g. “apple”, whose part of speech is noun.'],
['Pattern','patterns','The rule that describes which lexemes belong to a token, e.g. “a letter followed by letters or digits”.','The scanner needs a precise rule to recognise each token.','The rule “a word that names a thing is a noun”.'],
['Attribute','attributes|attribute value','Extra information attached to a token or grammar symbol, e.g. which identifier or what value.','The kind alone (id, num) is not enough; later phases need the details.','A label on a box saying what exactly is inside.'],
['Keyword','keywords|reserved word|reserved words','A word with fixed meaning in the language, such as if, while, int.','The language needs words for its own commands.','Words with official meaning in a game: “checkmate”.'],
['Identifier','identifiers','A name the programmer chooses for a variable, function or type.','Programs need names to refer to values.','A person’s name.'],
['Literal','literals|constant|constants','A fixed value written directly in code: 42, 3.14, "hello".','Programs need fixed numbers and text.','A price tag that always shows the same number.'],
['Operator','operators','A symbol for an action: + - * / = < && …','Expressions combine values using operations.','The buttons on a calculator.'],
['Whitespace','white space|blanks','Spaces, tabs and new lines between tokens.','Makes code readable; the scanner usually skips it.','The gaps between words in a sentence.'],
['Comment','comments','Text in the code for people; the scanner throws it away.','Explains code without changing what it does.','A sticky note on a recipe.'],
['Lexical error','lexical errors','A character sequence that matches no token pattern, e.g. # in C code or an unclosed string.','The scanner must report illegal characters.','A letter that does not exist in the alphabet.'],
['Lookahead','look ahead|look-ahead','Reading the next character or token without using it yet.','Sometimes you must see what comes next to decide (is it < or <=?).','Peeking at the next word before finishing a sentence.'],
['Retract','retracting|retracts','Pushing one character back after reading too far.','The scanner often reads one extra character to know a token has ended.','Taking one step back after walking past your door.'],
['Input buffering','input buffer|buffer pair','Reading the source file in large blocks into memory instead of one character at a time.','Reading the disk one character at a time is very slow.','Carrying a whole basket of apples instead of one apple per trip.'],
['Sentinel','sentinels','A special marker character at the end of a buffer (usually eof).','Checking one marker is faster than checking two conditions for every character.','A “last page” sign at the end of a chapter.'],
['Alphabet','alphabets','The set of symbols strings are built from, e.g. {a, b} or all ASCII characters.','We must say which symbols are allowed before describing patterns.','The letters available in a language.'],
['String','strings','A finite sequence of symbols from an alphabet, e.g. abba.','Programs and tokens are strings of characters.','A word written with the letters of the alphabet.'],
['Empty string','ε|epsilon','The string with no symbols, written ε (epsilon).','Patterns and grammars often need “nothing here”.','An empty box: still a box.'],
['Language','languages','A set of strings, e.g. all valid identifiers.','A token or a programming language is exactly the set of strings it allows.','A dictionary: the list of all allowed words.'],
['Regular expression','regular expressions|regex','A short formula that describes a set of strings using union |, concatenation and repetition *.','Gives precise, compact rules for tokens that tools can turn into scanners.','A search pattern like “any word starting with re-”.'],
['Regular definition','regular definitions','Naming regular expressions and reusing the names, e.g. letter → [A-Za-z].','Long expressions become readable.','Defining “vowel = a e i o u” and reusing the word vowel.'],
['Union','','Either one pattern or the other: a|b.','Tokens often have alternatives.','Tea OR coffee.'],
['Concatenation','','One pattern followed by another: ab.','Tokens are made of parts in order.','First name followed by last name.'],
['Kleene closure','Kleene star','Zero or more repetitions of a pattern: a*.','Names and numbers can be any length.','“Repeat as many times as you like, even zero.”'],
['Positive closure','','One or more repetitions: a+.','A number needs at least one digit.','“At least once, then as many as you like.”'],
['Character class','character classes','A set of characters written in brackets, e.g. [0-9] means any digit.','Short way to write long unions like 0|1|2|…|9.','“Any vowel” instead of listing a, e, i, o, u.'],
['Finite automaton','finite automata|automaton|automata|state machine','A machine with states and arrows (transitions) that reads a string and accepts or rejects it.','It is how a scanner actually recognises patterns, very fast.','A turnstile: locked/unlocked states that change when you insert a coin or push.'],
['State','states','One situation a finite automaton can be in, drawn as a circle.','The machine must remember how much of the pattern it has seen.','A position on a board game.'],
['Transition','transitions','An arrow from one state to another, labelled with the symbol that causes it.','Says what to do on each input symbol.','“If you roll a 6, move to square 10.”'],
['Start state','initial state','The state where the automaton begins reading.','Every run needs a starting point.','The “Start” square on a board game.'],
['Accepting state','accepting states|final state|final states','A state (double circle) meaning “the input read so far matches the pattern”.','The machine needs a way to say yes.','The “Finish” square on a board game.'],
['DFA','DFAs|deterministic finite automaton','Deterministic finite automaton: for each state and symbol there is exactly one next state.','It can be run very fast with a simple table lookup.','A road with exactly one sign at every junction.'],
['NFA','NFAs|nondeterministic finite automaton','Nondeterministic finite automaton: a state may have several (or ε) moves on the same symbol.','NFAs are easy to build from regular expressions.','A junction with several possible roads: you try them all at once.'],
['ε-transition','ε-transitions|epsilon move|ε-move|ε-moves','A move between states that reads no input symbol.','Lets us glue small NFAs together easily.','A free teleport square on a board game.'],
['ε-closure','epsilon-closure|ε-closures','All states reachable from a set of states using only ε-moves.','Needed to simulate an NFA and to build a DFA from it.','Everyone you can reach by free teleports from where you stand.'],
['Transition table','transition tables','A table that gives the next state for every (state, symbol) pair.','A program can follow a table faster and more simply than a drawing.','A train timetable: from this station on this line, go to that station.'],
['Transition diagram','transition diagrams','A drawing of states and arrows used to design a scanner by hand.','Easy for people to read and turn into code.','A flow chart of a recipe.'],
['Thompson’s construction',"Thompson's construction",'An algorithm that builds an NFA from a regular expression, piece by piece.','Turns a written pattern into a machine automatically.','Building a big LEGO model from small standard bricks.'],
['Subset construction','powerset construction','An algorithm that converts an NFA into an equivalent DFA; each DFA state is a set of NFA states.','DFAs are faster to run than NFAs.','Planning every possible group of roads at once so you never need to backtrack.'],
['Minimisation','minimization|minimise|minimize','Merging DFA states that behave the same, giving the smallest DFA.','Smaller tables use less memory.','Merging two bus stops that serve exactly the same routes.'],
['Lex','Flex|lexer generator|lexer generators|scanner generator|scanner generators','Tools that build a scanner automatically from regular expressions.','Writing scanners by hand is long and error-prone.','A machine that makes cookie cutters from a drawing you give it.'],
['Longest match','maximal munch|longest-match','Rule: the scanner takes the longest possible lexeme, e.g. <= rather than <.','Avoids splitting one token into two.','Reading “ice-cream” as one word, not “ice” and “cream”.'],

/* ---------- symbol tables ---------- */
['Symbol table','symbol tables','A data structure that stores every name in the program with its information (type, scope, address).','Every phase needs facts about names, and searching the source again would be slow.','A phone book: look up a name, get its details.'],
['Scope','scopes|nested scope|nested scopes','The part of the program where a name can be used.','The same name can mean different things in different blocks.','A nickname used only inside your family.'],
['Hash table','hash tables|hashing|hash function','A table where a hash function turns a name into a slot number for very fast lookup.','Symbol tables are searched constantly; hashing makes each search quick.','A post office with a pigeon-hole per first letter of the name.'],
['Declaration','declarations|declared','Code that introduces a name and its type, e.g. int x;','The compiler must know what a name is before it is used.','Introducing a new person: “This is Ali, he is a student.”'],

/* ---------- syntax and parsing ---------- */
['Syntax','syntactic','The rules for how symbols may be arranged to form a valid program.','A program must be correctly shaped before its meaning can be checked.','Grammar rules of a language.'],
['Semantics','semantic','What a correctly formed program means or does.','A program can be well formed but still meaningless (adding a string to an array).','The meaning of a sentence, not just its grammar.'],
['Parser','parsers|parsing|parse|parses|syntax analysis|syntax analyser|syntax analyzer','The phase that checks the token sequence against the grammar and builds a tree.','We must know the structure (what is inside what) to translate correctly.','A grammar teacher checking whether a sentence is correctly built.'],
['Grammar','grammars','A set of rules (productions) that describes all valid programs of a language.','Gives an exact definition of correct syntax that a parser can follow.','The grammar book of a language.'],
['Context-free grammar','context-free grammars|CFG|CFGs','A grammar whose every rule has one non-terminal on the left: A → …','Powerful enough for nested structures like brackets, yet still easy to parse.','Rules like “a sentence is a subject followed by a verb”, true wherever the sentence appears.'],
['Production','productions','One grammar rule, e.g. E → E + T, saying how a non-terminal can be replaced.','Grammars are built from such rules.','A recipe step: “a sandwich is bread, filling, bread”.'],
['Terminal','terminals','A grammar symbol that appears in the program itself: a token such as id, +, if.','These are the actual words the parser sees.','Actual words in a sentence.'],
['Non-terminal','non-terminals|nonterminal|nonterminals','A grammar symbol that stands for a group of strings, e.g. Expr, Stmt.','Names the parts of the structure.','Grammar labels like “noun phrase”.'],
['Start symbol','','The non-terminal that stands for a whole program; every derivation starts from it.','Parsing needs one top goal.','The title “Sentence” at the top of a sentence diagram.'],
['Derivation','derivations','A sequence of rule replacements that turns the start symbol into a string of tokens.','Shows exactly how a program follows the grammar.','Expanding “sentence → subject verb → Ali runs” step by step.'],
['Leftmost derivation','leftmost','A derivation that always replaces the leftmost non-terminal first.','Top-down parsers build exactly this derivation.','Always filling the first blank in a form before the next.'],
['Rightmost derivation','rightmost','A derivation that always replaces the rightmost non-terminal first.','Bottom-up parsers build this derivation in reverse.','Filling the last blank first.'],
['Parse tree','parse trees|derivation tree','A tree showing how the start symbol derives the input, with every grammar step.','Makes the structure visible: what is inside what.','A family tree for a sentence.'],
['Syntax tree','syntax trees|abstract syntax tree|AST|ASTs','A compact tree of the program’s structure: operators as inner nodes, values as leaves (no grammar clutter).','Later phases need the structure without grammar details.','A summary diagram of a family tree, with only the important people.'],
['Ambiguity','ambiguous|ambiguous grammar','A grammar is ambiguous if one string has two different parse trees.','Two trees can mean two different results (2+3*4 = 20 or 14).','“I saw the man with the telescope”: who had the telescope?'],
['Precedence','','Which operator binds tighter, e.g. * before +.','Fixes the meaning of expressions like 2 + 3 * 4.','BODMAS rules in maths.'],
['Associativity','left associative|right associative|left-associative|right-associative','How operators of equal precedence group: a - b - c = (a - b) - c.','Without it, a - b - c would have two meanings.','Reading left to right in a queue.'],
['Dangling else','dangling-else','The ambiguity in “if a if b s1 else s2”: which if does the else belong to?','A famous ambiguity every language must resolve (usually: nearest if).','A pronoun that could refer to two different people.'],
['Left recursion','left-recursive|left recursive|immediate left recursion|indirect left recursion','A rule where a non-terminal starts with itself, e.g. E → E + T.','Top-down parsers loop forever on it, so we rewrite such rules.','Defining a word using the same word first: “a dog is a dog that…”.'],
['Left factoring','left-factor|left factor|left-factored','Rewriting rules that start with the same symbols so the choice can be delayed.','A predictive parser must choose a rule from one token; common prefixes make that impossible.','Taking the common first step out: “go straight, then turn left or right”.'],
['Top-down parsing','top-down|top-down parser|top-down parsers','Parsing that builds the tree from the root (start symbol) down to the leaves.','Natural to code by hand, one function per non-terminal.','Planning an essay from the title down to sentences.'],
['Bottom-up parsing','bottom-up|bottom-up parser|shift-reduce','Parsing that builds the tree from the leaves (tokens) up to the root.','Handles more grammars than top-down parsing.','Building a wall brick by brick up to the roof.'],
['Backtracking','backtrack|backtracks','Trying a choice, and if it fails, undoing it and trying another.','Simple, but can be very slow.','Trying keys one by one until a door opens.'],
['Predictive parser','predictive parsing|predictive parsers','A top-down parser that picks the right rule by looking at the next token only, with no backtracking.','Fast: every decision is final.','A guide who knows the right road just by reading the next signpost.'],
['Recursive descent','recursive-descent','A top-down parser with one function per non-terminal; the functions call each other.','The easiest kind of parser to write by hand.','A set of helpers, each expert in one grammar part, calling each other.'],
['match()','','The parser helper that checks the current token is the expected one and moves to the next.','Every expected token must be checked and consumed.','Ticking off an item on a checklist and moving down.'],
['EBNF','extended BNF','Grammar notation with { } for repetition and [ ] for optional parts.','Shorter grammars that map directly to loops in code.','Writing “one or more stars” instead of a long rule list.'],
['FIRST set','FIRST|FIRST sets','FIRST(α): the set of tokens that can begin a string derived from α.','Tells a predictive parser which rule to choose for the next token.','The possible first words of a sentence type.'],
['FOLLOW set','FOLLOW|FOLLOW sets','FOLLOW(A): the set of tokens that can come right after non-terminal A.','Needed when A can be empty (ε), and for error recovery.','The words that may come after a noun phrase.'],
['LL(1)','LL(1) grammar|LL(1) grammars|LL(1) parser|LL(1) parsing','Read input Left to right, build a Leftmost derivation, use 1 token of lookahead.','Grammars of this kind can be parsed by a simple table, with no backtracking.','Driving with one sign of warning ahead, never needing to reverse.'],
['LL(1) table','parsing table|parse table','The table M[A, a] that says which rule to use for non-terminal A when the next token is a.','Turns parsing into simple table lookups.','A train timetable for the parser.'],
['LR parsing','LR(1)|LALR|SLR','A bottom-up parsing method (Left-to-right, Rightmost derivation in reverse) used by tools like yacc.','Handles almost all programming-language grammars.','Building from the bricks up, reading left to right.'],
['Conflict','conflicts|LL(1) conflict','Two rules in the same table cell: the parser cannot decide which to use.','Shows the grammar is not LL(1) and must be changed.','Two road signs at the same junction pointing different ways.'],
['Error recovery','error-recovery','What a parser does after finding an error so it can continue and report more errors.','Stopping at the first error wastes the programmer’s time.','A speaker who loses their place, skips to the next paragraph and continues.'],
['Panic mode','panic-mode','Error recovery that skips tokens until a synchronising token (like ;) is found.','Simple and never loops forever.','Skipping to the next full stop when a sentence makes no sense.'],
['Synchronising token','synchronizing token|synchronising tokens|synchronizing tokens','A token (often from FOLLOW, like ; or }) where the parser can safely restart after an error.','Gives the parser a safe place to continue.','A chapter heading where a lost reader can start again.'],
['Phrase-level recovery','phrase level','Error recovery that makes a small local fix, such as inserting a missing ;.','Can repair common slips and keep going.','Autocorrect fixing one typo.'],
['Error production','error productions','An extra grammar rule that matches a common mistake so the parser can give a precise message.','Common mistakes deserve helpful messages.','A teacher who knows the usual wrong answer and explains it.'],
['Viable prefix','viable-prefix','A beginning of the input that can still be completed into a valid program.','LL parsers detect an error as soon as the input stops being a viable prefix.','A sentence start that could still become correct: “The cat sat …”.'],

/* ---------- semantic analysis and SDD ---------- */
['Semantic analysis','semantic analyser|semantic analyzer|semantic checks|semantic check','The phase that checks meaning: names declared, types compatible, functions called correctly.','A program can be well formed yet meaningless, e.g. adding a number to a function.','Checking a sentence makes sense: “The table ate the idea” is grammatical but nonsense.'],
['Type','types|data type|data types','The kind of value: int, float, char, array, function…','Decides which operations are allowed and how much memory is used.','The unit of a quantity: kilograms, metres, rupees.'],
['Type checking','type checker|type-checking|type check|type checks','Making sure operations are applied to the right types of values.','Stops nonsense like multiplying a string by a function.','Checking you do not add kilograms to metres.'],
['Type conversion','coercion|coercions|type conversions','Changing a value from one type to another, e.g. int 5 to float 5.0.','Mixed expressions like 2 + 3.5 need both sides in the same type.','Converting dollars to rupees before adding amounts.'],
['Type expression','type expressions','A way of writing a type, including built ones like array(10, int) or int → float.','Compilers need a precise description of complex types to compare them.','A full product description: “box of 10 bottles of water”.'],
['Static typing','statically typed','Types are checked at compile time (C, Java).','Catches type errors before the program runs.','Checking passports at the border before entry.'],
['Dynamic typing','dynamically typed','Types are checked while the program runs (Python, JavaScript).','More flexible, but errors appear only when that code runs.','Checking tickets inside the train during the journey.'],
['Strong typing','strongly typed','The language never lets a value be used as the wrong type.','Prevents hidden bugs and security holes.','A strict shop that never accepts the wrong currency.'],
['Weak typing','weakly typed','The language silently converts or reinterprets values between types.','Convenient, but can hide bugs.','A shop that accepts any coin and guesses the value.'],
['Type equivalence','structural equivalence|name equivalence','The rule for deciding when two types are the same.','Assignments and calls are only allowed between equivalent types.','Two boxes are “the same” if they have the same contents, or only if they have the same label.'],
['Syntax-directed definition','syntax-directed definitions|SDD|SDDs','A grammar where every rule has semantic rules that compute attribute values.','Ties meaning (values, types, code) directly to grammar rules.','A form where each box has a formula for what to fill in.'],
['Attribute grammar','attribute grammars','An SDD whose semantic rules have no side effects (they only compute attributes).','Pure rules are easier to reason about and evaluate in any valid order.','A spreadsheet where every cell is a pure formula.'],
['Semantic rule','semantic rules|semantic action|semantic actions','A small formula or code fragment attached to a grammar rule.','Says what to compute when that rule is used.','The formula inside a spreadsheet cell.'],
['Synthesized attribute','synthesized attributes|synthesised attribute|synthesised attributes|synthesized','An attribute computed from the node’s children (information flows up the tree).','Results like the value of an expression come from its parts.','A manager’s total sales, adding up the team’s figures.'],
['Inherited attribute','inherited attributes|inherited','An attribute computed from the parent or siblings (information flows down or sideways).','Some facts come from context, e.g. the declared type for a list of names.','Children inheriting the family surname.'],
['Annotated parse tree','annotated parse trees|annotated','A parse tree with attribute values written at each node.','Shows how the semantic rules compute the result.','A family tree with everyone’s age written beside their name.'],
['Dependency graph','dependency graphs','A graph showing which attribute values must be computed before which others.','Tells us a valid order to evaluate attributes.','A to-do list where some tasks must wait for others.'],
['Topological sort','topological sorting|topological order','An ordering of graph nodes so every arrow goes from earlier to later.','Gives an evaluation order that respects all dependencies.','Getting dressed: socks before shoes, shirt before tie.'],
['S-attributed','S-attributed definition|S-attributed definitions|S-attributed SDD|S-attributed SDDs','An SDD that uses only synthesized attributes.','Can be evaluated in one bottom-up pass, e.g. while an LR parser runs.','A report built only from the figures sent up by each team.'],
['L-attributed','L-attributed definition|L-attributed definitions|L-attributed SDD|L-attributed SDDs','An SDD whose inherited attributes depend only on the parent and on siblings to the left.','Can be evaluated in one left-to-right pass, e.g. during recursive descent.','Reading a story left to right: you only use what you have already read.'],
['Side effect','side effects','An action besides computing a value, e.g. printing or adding to the symbol table.','Real compilers must do such actions, but carefully.','Turning on the lights while doing your homework.'],
['Syntax-directed translation','syntax-directed translation scheme|syntax-directed translation schemes|translation scheme|translation schemes|SDT|SDTs','A grammar with program fragments (actions) placed inside rule bodies, run at that point during parsing.','Gives an exact order for actions, so translation can happen while parsing.','A recipe with “stir now” written exactly between two steps.'],
['Postfix SDT','postfix SDTs|postfix translation scheme','An SDT where every action is at the end of its rule.','Fits bottom-up parsers: run the action when the rule is reduced.','Clapping only at the end of each song.'],
['Postfix notation','postfix|reverse Polish','Writing the operator after its operands: a b + instead of a + b.','No brackets needed; easy to evaluate with a stack.','Saying “2 and 3, add them” instead of “2 plus 3”.'],

/* ---------- intermediate code ---------- */
['Three-address code','TAC|three address code','Simple instructions with at most one operator and three addresses, e.g. t1 = b * c.','Easy to generate, easy to optimise, close to machine code.','Breaking a long sum into one small step per line.'],
['Temporary','temporaries','A compiler-made name (t1, t2…) that holds an in-between result.','Complex expressions need places to keep partial results.','Scratch working written in the margin of a maths exam.'],
['Quadruple','quadruples|quads','A TAC instruction stored as four fields: op, arg1, arg2, result.','A simple record format the compiler can store and rearrange.','A form with four boxes: operation, first number, second number, answer.'],
['Triple','triples','A TAC instruction stored as op, arg1, arg2; results are referred to by instruction number.','Saves space: no temporary names needed.','Saying “the answer of step 3” instead of naming it.'],
['Indirect triples','indirect triple','Triples plus a separate list of pointers giving their order.','The optimiser can reorder the pointer list without renumbering triples.','A playlist that points to songs, so you can reorder the playlist without moving the songs.'],
['DAG','DAGs|directed acyclic graph','A syntax tree where identical subexpressions are shared as one node.','Shows common subexpressions so they are computed only once.','Writing “see above” instead of copying the same paragraph twice.'],
['Common subexpression','common subexpressions','The same calculation appearing twice, e.g. b * -c in a = b * -c + b * -c.','Computing it once saves time.','Working out a price once and reusing it in two bills.'],
['SSA','static single assignment','An IR form where each variable is assigned exactly once (x1, x2…).','Makes many optimisations simpler.','Giving every new version of a document a new file name.'],
['Label','','A name for a position in the code that jumps can go to, e.g. L1.','Control flow (if, while) needs targets to jump to.','A bookmark in a book.'],
['Jump','jumps|goto|gotos|conditional jump|conditional jumps','An instruction that continues execution at a label (always, or only if a condition holds).','If and loops are built from jumps in low-level code.','“Turn to page 50” in a choose-your-own-adventure book.'],
['Control flow','flow of control|flow-of-control','The order in which statements run, changed by if, while, switch…','Programs make decisions and repeat things.','Road junctions and roundabouts on a journey.'],
['Boolean expression','boolean expressions','An expression that is true or false, e.g. x < 10 && y != 0.','Decisions in if and while depend on it.','A yes/no question.'],
['Relational operator','relational operators|relop|relops','An operator that compares values: < <= > >= == !=.','Conditions need comparisons.','Comparing two prices: more, less or equal.'],
['Short-circuit code','short-circuit|jumping code','Code for && and || that stops evaluating as soon as the answer is known.','Saves time and avoids errors like dividing by zero in the second part.','If the first lock is closed, you do not try the second lock.'],
['Fall-through','','Continuing to the next instruction instead of jumping.','Avoids useless “goto next line” jumps.','Walking straight on when the road continues.'],
['Backpatching','backpatch|backpatched|backpatches','Leaving jump targets blank and filling them in later, once the target label is known.','Lets the compiler generate code for jumps in one pass.','Writing “see page __” and filling in the number after the page is printed.'],
['makelist','','Creates a new list holding one unfinished jump instruction i.','Starts tracking a jump that still needs a target.','Starting a list of letters still waiting for an address.'],
['merge','','Joins two lists of unfinished jumps into one.','Jumps from different parts may go to the same target.','Combining two waiting lists into one.'],
['truelist','true list','The list of jumps to take when a boolean expression is true.','Their target is only known later, so they are backpatched.','Everyone who should go to the “yes” room once it is chosen.'],
['falselist','false list','The list of jumps to take when a boolean expression is false.','Same idea, for the “no” case.','Everyone who should go to the “no” room.'],
['nextlist','next list','The list of jumps that should go to the statement after the current one.','The next statement’s address is unknown until it is generated.','People waiting to be told where the next meeting is.'],
['Jump table','jump tables','An array of addresses indexed by the switch value, giving a direct jump.','Faster than testing each case one by one when cases are dense.','A lift button panel: press 5, go straight to floor 5.'],
['Array','arrays','A row of same-type values stored next to each other in memory, accessed by index.','Programs store many values of one kind.','A row of numbered lockers.'],
['Address computation','','Working out where an array element is in memory: base + i × width.','The machine only knows memory addresses, not a[i].','Finding locker number i: start of the row plus i lockers.'],
['Width','widths','The number of bytes one value of a type takes (e.g. int = 4).','Needed to compute array addresses and memory layout.','How much shelf space one box needs.'],
['Code generation','code generator|code generators|generate code|generates code|generated code','The phase that turns intermediate code into target code (assembly or machine code).','The CPU needs real instructions in the end.','The writer producing the final translation.'],
['gen()','','A helper that emits (writes out) one new instruction.','Translation builds code one instruction at a time.','A stamp that prints one line of the final document.'],
['newtemp()','newtemp','A helper that makes a fresh temporary name (t1, t2…).','Every partial result needs its own name.','Taking a new numbered ticket at the bank.'],
['Recursion','recursive|recursively','A function calling itself (or functions calling each other) on smaller parts.','Grammars and trees are nested, so recursive code fits them naturally.','Russian dolls: each contains a smaller one.'],
['Algorithm','algorithms','A precise step-by-step method that always finishes with an answer.','Compilers must work the same way every time.','A recipe that always produces the same cake.'],
['Data structure','data structures','A way of organising data in memory (list, table, tree, stack).','Choosing the right structure makes operations fast.','A filing system: drawers, folders, labels.'],
['Tree','trees','A structure of nodes connected from one root down to leaves.','Programs are nested (expressions inside statements inside functions); trees show nesting.','A family tree.'],
['Graph','graphs|edge|edges','Nodes joined by arrows (edges).','Shows relationships such as transitions or dependencies.','A map of cities joined by roads.'],
];

/* ---------- term engine: find, underline, explain on hover AND tap ---------- */
(function(){
const R = window.CC_TERMS;
const NOAUTO = new Set(['Program','Pass','Union','Concatenation','String','Language','Pattern','Execution','Tree','Graph','Algorithm','Data structure','Recursion','Type','Phase','State','Stack','Array','Comment','Error message','Attribute','Translator','Operator']);
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const alias = [];                       // [text, rowIndex]
R.forEach((r,i)=>{ [r[0]].concat(r[1]?r[1].split('|'):[]).forEach(a=>{ a=a.trim(); if(a) alias.push([a,i]); }); });
alias.sort((a,b)=>b[0].length-a[0].length);
const lookup = new Map(alias.map(([a,i])=>[a.toLowerCase(),i]));
const mk = list => new RegExp('(?<![\\w\\-.])(' + list.map(([a])=>escRe(a)).join('|') + ')(?![\\w\\-])','gi');
const reAll = mk(alias), reAuto = mk(alias.filter(([,i])=>!NOAUTO.has(R[i][0])));
const idxOf = t => { const k=String(t).toLowerCase(); return lookup.has(k)?lookup.get(k):-1; };
const orig = new Map(alias.map(([a])=>[a.toLowerCase(),a]));
const caseOK = t => { const o=orig.get(String(t).toLowerCase()); return !o || /[a-z]/.test(o) || !/[A-Z].*[A-Z]/.test(o) || o===t; };   // acronyms (FIRST, IR, AST) only in capitals
function find(text, all){ const re=all?reAll:reAuto, out=new Set(); let m; re.lastIndex=0; while((m=re.exec(text))){ if(caseOK(m[1])) out.add(idxOf(m[1])); } return [...out]; }

const SKIP = 'pre,code,script,style,textarea,input,select,button,a,.term,.def,h1,.k,.lp,.demo,svg,.gchips,.op,.tnotes,.chip,.toc,.why';
function annotateOne(root, used){
  const tw=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:n=> !n.nodeValue.trim() || (n.parentElement&&n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  const nodes=[]; while(tw.nextNode()) nodes.push(tw.currentNode);
  for(let node of nodes){
    let text=node.nodeValue, m; reAuto.lastIndex=0;
    while((m=reAuto.exec(text))){
      const i=idxOf(m[1]); if(i<0||used.has(i)||!caseOK(m[1])) continue;
      used.add(i);
      const before=node.splitText(m.index); const after=before.splitText(m[1].length);
      const sp=document.createElement('span'); sp.className='term'; sp.tabIndex=0; sp.setAttribute('role','button'); sp.dataset.ti=i; sp.textContent=before.nodeValue;
      before.replaceWith(sp); node=after; text=after.nodeValue; reAuto.lastIndex=0;
    }
  }
}
function annotate(root){
  if(!root) return;
  const parts=[...root.querySelectorAll('.slideCard,.card')];
  if(parts.length) parts.forEach(p=>annotateOne(p,new Set())); else annotateOne(root,new Set());
}

/* one floating card for the whole page */
let pop=null, cur=null, pinned=false, hideT=null;
function card(){ if(!pop){ pop=document.createElement('div'); pop.id='termpop'; pop.setAttribute('role','dialog'); pop.setAttribute('aria-live','polite'); document.body.append(pop);
  pop.addEventListener('pointerenter',()=>clearTimeout(hideT)); pop.addEventListener('pointerleave',()=>{ if(!pinned) hide(); }); } return pop; }
function html(el){
  if(el.dataset.tip) return `<p>${el.dataset.tip}</p>`;
  const i = el.dataset.ti!=null ? +el.dataset.ti : idxOf(el.dataset.gt||el.textContent); const r=R[i];
  if(!r) return `<p>No definition yet.</p>`;
  return `<b class="tp-h">${r[0]}</b><p>${r[2]}</p>${r[3]?`<p><b>Why it exists:</b> ${r[3]}</p>`:''}${r[4]?`<p class="tp-an"><b>🔁 Like:</b> ${r[4]}</p>`:''}`;
}
function show(el, pin){
  clearTimeout(hideT); const c=card(); cur=el; pinned=!!pin;
  c.innerHTML=html(el)+(pin?'<button class="tp-x" type="button" aria-label="Close">✕</button>':'');
  c.classList.add('show'); const x=c.querySelector('.tp-x'); if(x) x.onclick=hide;
  const b=el.getBoundingClientRect(), w=Math.min(360, innerWidth-24); c.style.width=w+'px';
  let left=Math.max(12, Math.min(b.left+b.width/2-w/2, innerWidth-w-12)); c.style.left=left+'px';
  const h=c.offsetHeight; let top=b.bottom+10; if(top+h>innerHeight-8 && b.top-h-10>8) top=b.top-h-10; c.style.top=Math.max(8,Math.min(top,innerHeight-h-8))+'px';
}
function hide(){ if(pop) pop.classList.remove('show'); cur=null; pinned=false; }
const target = e => e.target.closest && e.target.closest('.term,.def[data-tip]');
document.addEventListener('pointerover', e=>{ if(e.pointerType!=='mouse') return; const t=target(e); if(t && !pinned){ clearTimeout(hideT); show(t,false); } });
document.addEventListener('pointerout', e=>{ if(e.pointerType!=='mouse'||pinned) return; const t=target(e); if(t) hideT=setTimeout(hide,250); });
document.addEventListener('click', e=>{ const t=target(e);
  if(t){ e.preventDefault(); e.stopPropagation(); if(cur===t&&pinned) hide(); else show(t,true); return; }
  if(pop && !pop.contains(e.target) && !(e.target.closest&&e.target.closest('.gchip'))) hide(); }, true);
document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&pop&&pop.classList.contains('show')){ hide(); e.stopPropagation(); return; }
  const t=document.activeElement; if((e.key==='Enter'||e.key===' ')&&t&&t.matches&&t.matches('.term,.def[data-tip]')){ e.preventDefault(); e.stopPropagation(); show(t,true); } }, true);
addEventListener('scroll', ()=>{ if(pop&&pop.classList.contains('show')) hide(); }, true);
addEventListener('resize', hide);
document.documentElement.classList.add('js-tips');

window.CCTerms = { find, idx:idxOf, row:i=>R[i], annotate, open:(el,name)=>show(Object.assign(el,{dataset:Object.assign(el.dataset,{gt:name})}),true), hide };
})();
