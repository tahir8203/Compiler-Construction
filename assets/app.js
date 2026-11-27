/* Compiler Construction course app: routing, study view, presentation engine, assessments, quizzes, flashcards, glossary, revision, progress. */
(function(){
const C = window.COURSE;
const S = C.sessions.sort((a,b)=>a.week-b.week || a.id-b.id);
const $ = (q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const app = $('#app');
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip = s => String(s||'').replace(/<[^>]+>/g,'');

/* ---------- storage (safe) ---------- */
const KEY='cc-course-v1';
const blank = () => ({done:{},bm:{},quiz:{},last:null});
let st = blank();
try{ st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){}
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} };

/* ---------- theme ---------- */
function setTheme(t){ document.documentElement.dataset.theme=t; try{localStorage.setItem('cc-theme',t);}catch(e){} $('#themeBtn').textContent = t==='light'?'🌙':'☀️'; const mt=document.querySelector('meta[name=theme-color]'); if(mt) mt.content = t==='light'?'#f4f7fd':'#070b16'; try{ window.AndroidApp&&AndroidApp.setTheme&&AndroidApp.setTheme(t==='light'); }catch(e){} }
let theme='dark'; try{ theme = localStorage.getItem('cc-theme') || (matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'); }catch(e){}
setTheme(theme);
const flipTheme = () => setTheme(document.documentElement.dataset.theme==='light'?'dark':'light');
$('#themeBtn').onclick = flipTheme;
if($('#menuBtn')) $('#menuBtn').onclick = () => $('#nav').classList.toggle('open');

/* ---------- helpers ---------- */
const sess = id => S.find(s=>s.id===+id);
const label = s => s.label || ('Session '+s.id);
const short = s => s.short || ('S'+s.id);
const nextOf = s => S[S.indexOf(s)+1], prevOf = s => S[S.indexOf(s)-1];
const kindChip = s => s.assess ? s.assess.split(' + ').map(a=>`<span class="chip ${/Quiz/.test(a)?'q':/Assign/.test(a)?'a':'x'}">${esc(a)}</span>`).join(' ') : '';
const teach = S.filter(s=>!s.exam);
const pct = () => Math.round(S.filter(s=>st.done[s.id]).length / S.length * 100);

/* Full presentation deck of a session: at most 25 slides.
   Order: title · (why this matters) · objectives · content · try it yourself · (lab animation) · recap · check your understanding · glossary · (assessment) · end. */
const MAXD=99;   /* the 25-slide cap was lifted (Nov 2026): explain every topic fully */
function deck(s){
  const d=[], opt=[];
  d.push({type:'title', k:`Week ${s.week} · ${label(s)}`, h:s.title, p:s.sub, ic:s.ic, n:s.titleN||{say:`Welcome. Today: ${s.title}. Connect it to the last lecture and say why a compiler needs it.`, ask:'What do you already know about this topic?', ans:'Accept any answer; use it to link today’s lesson to what students know.'}});
  if(s.intro){ const x={type:'concept', k:'Why this matters', h:s.introH||'Why this matters', p:s.intro, an:s.introAn, ic:s.ic, n:s.introN||{say:'Start with the story or question. Let 2–3 students answer before you move on.'}}; d.push(x); opt.push(x); }
  d.push({type:'obj', k:'Learning objectives', h:'By the end of this lecture you will be able to…', pts:s.obj.map(o=>['🎯',o]), n:{say:'Read the objectives aloud in simple words. They are what students should be able to do, not just know.', ask:'Which of these do you already know something about?', ans:'Use the answers to decide where to go slower.'}});
  s.slides.forEach((x,i)=>d.push(Object.assign({type:'concept',_i:i},x)));
  if(s.lab) d.push({type:'lab', k:'Try it yourself', h:s.lab.t.replace(/^Lab:\s*/,''), pts:s.lab.steps.map((x,i)=>[(i+1)+'.',x]), p:s.lab.out?`<b>You should end with:</b> ${s.lab.out}`:'', n:s.lab.n||{say:'Give 15–20 minutes. Walk around and help. Ask 2–3 students to show their result.', watch:'Students who finish early can help a neighbour.'}});
  if(s.lab&&s.lab.demo){ const x={type:'demo', k:'Lab animation', h:s.lab.demoH||'Watch the lab run', demo:s.lab.demo, full:true, n:s.lab.demoN||'Step through before students try it, so they know what to look for.'}; d.push(x); opt.push(x); }
  d.push({type:'rev', k:'Recap', h:'Remember these points', cmp:[['✔ Remember',s.rev],['⚠️ Watch out',s.mistakes||[]]].filter(c=>c[1].length), n:{say:'Ask students to explain each point in their own words before you read it.', ask:(s.disc&&s.disc[0])||'Which point was the hardest today?', ans:(s.disc&&s.disc.length>1)?'Other discussion questions: '+s.disc.slice(1).join(' · '):'Revisit that point with a new example.'}});
  const cq=(s.check||s.quiz.slice(0,3));
  if(cq.length) d.push({type:'check', k:'Check your understanding', h:`${cq.length} quick questions`, qs:cq, n:{say:'Students answer on their own first (or show fingers 1–4 for A–D), then reveal.', watch:'Answers: '+cq.map((q,i)=>`Q${i+1} ${String.fromCharCode(65+q.a)}`).join(', ')+'. More questions are in the study view and the Practice centre.'}});
  const g=lectureTerms(s);
  if(g.length) d.push({type:'gloss', k:'Glossary', h:'New words in this lecture', terms:g, n:{say:'Point to each word and ask a student for the meaning before you tap it.', watch:'Tap any word to see why it exists and a real-life analogy.'}});
  const a=s.assessment;
  if(a){ const x={type:'concept', k:a.kind==='assignment'?'Assignment':a.kind==='quiz'?'Quiz':'Assessment', h:a.title, p:a.covers?`Covers: ${a.covers}`:'', pts:(a.instructions||[]).slice(0,5).map(x=>['📌',x]).concat(a.tasks?[['📝',`${a.tasks.length} tasks: see the study view for the full questions and model answers.`]]:[]), ic:'📌', n:'Full details, questions and model answers are in the study view (Assessment section).'}; d.push(x); }
  const nx = nextOf(s);
  d.push({type:'end', k:'Lecture complete', h:'Thank you!', p:(nx?`Next: <b>${esc(label(nx))}: ${esc(nx.title)}</b>`:'Best of luck in your final examination!')+(s.hw?`<br><br><span class="tiny"><b>Before next class:</b> ${s.hw}</span>`:''), ic:'🎓', n:{say:'Announce deadlines and preview the next lecture.', ask:'What is one thing you learned today?', ans:'Ask 2–3 students; this is a quick exit ticket.'}});
  for(const x of opt){ if(d.length<=MAXD) break; d.splice(d.indexOf(x),1); }
  if(d.length>MAXD) console.warn(`${label(s)}: ${d.length} slides (max ${MAXD})`);
  return d;
}
/* Terms whose first appearance in the course (in teaching order) is this lecture, plus the lecture's own key terms. */
let _firstSeen=null;
function lectureTerms(s){
  if(!window.CCTerms) return [];
  if(!_firstSeen){ _firstSeen={}; S.forEach(z=>{ const txt=[z.title,z.sub,z.intro||''].concat(z.slides.map(x=>[x.h,x.p,x.ex,x.tk,x.an,x.psy,(x.pts||[]).map(p=>p[1]).join(' '),(x.cmp||[]).map(c=>c[1].join(' ')).join(' '),(x.parts||[]).map(r=>r[1]).join(' '),[].concat(x.what||[]).join(' '),x.res||''].join(' '))).join(' ');
    CCTerms.find(strip(txt)).forEach(i=>{ if(!(i in _firstSeen)) _firstSeen[i]=z.id; }); }); }
  const out=[], seen=new Set();
  (s.terms||[]).forEach(t=>{ const i=CCTerms.idx(t[0]); if(i>=0){ if(!seen.has(i)){ seen.add(i); out.push(CCTerms.row(i)); } } else out.push([t[0],'',t[1],'','']); });
  Object.keys(_firstSeen).filter(i=>_firstSeen[i]===s.id&&!seen.has(+i)).forEach(i=>{ seen.add(+i); out.push(CCTerms.row(+i)); });
  return out.slice(0,24);
}
function notesHTML(n){
  if(!n) return '—'; if(typeof n==='string') return `<p>${n}</p>`;
  return [n.say&&`<p><b>🗣 Say:</b> ${n.say}</p>`, n.ask&&`<p><b>❓ Likely question:</b> ${n.ask}${n.ans?` <b>Answer:</b> ${n.ans}`:''}</p>`, n.watch&&`<p><b>⚠️ Watch out:</b> ${n.watch}</p>`].filter(Boolean).join('');
}

/* ---------- slide body (both modes) ---------- */
function body(x){
  let html='';
  if(x.p) html+=`<div class="p">${x.p}</div>`;
  if(x.pts) html+=`<ul class="pts">${x.pts.map(p=>`<li><span class="ic">${p[0]}</span><span>${p[1]}</span></li>`).join('')}</ul>`;
  if(x.cmp) html+=`<div class="cmp">${x.cmp.map(c=>`<div><h4>${c[0]}</h4><ul>${c[1].map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>`;
  if(x.img) html+=`<figure class="fig"><img src="${x.img.src}" alt="${esc(x.img.alt||'')}" loading="lazy" decoding="async">${x.img.cap?`<figcaption>${x.img.cap}</figcaption>`:''}</figure>`;
  if(x.ex) html+=`<div class="ex"><b>Example:</b> ${x.ex}</div>`;
  if(x.code) html+=`<pre class="code">${x.code}</pre>`;
  html+=xpHTML(x);
  let ft='';
  if(x.an) ft+=`<div class="an"><b>🔁 Real-life analogy:</b> ${x.an}</div>`;
  if(x.psy) ft+=`<div class="ex psy"><b>⚙️ In real compilers:</b> ${x.psy}</div>`;
  if(x.tk) ft+=`<div class="tk">${x.tk}</div>`;
  if(ft) html+=`<div class="sfoot">${ft}</div>`;
  return html;
}
/* "Explain it simply" blocks: command → meaning of each part → what happens → example (+ output) → result.
   parts:[[part, meaning],…]  what:'text' | ['step',…]  eg:{code, note, out}  tbl:{h:[…], r:[[…],…], cap}  res:'text' */
function xpHTML(x){
  let h='';
  if(x.parts) h+=`<div class="xp parts"><h4>🔍 Meaning of each part</h4><div class="tblwrap"><table class="xt"><thead><tr><th>Part</th><th>Meaning</th></tr></thead><tbody>${x.parts.map(r=>`<tr><td><code>${r[0]}</code></td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div></div>`;
  if(x.what) h+=`<div class="xp what"><h4>⚙️ What happens here?</h4>${Array.isArray(x.what)?`<ol>${x.what.map(w=>`<li>${w}</li>`).join('')}</ol>`:`<p>${x.what}</p>`}</div>`;
  if(x.eg) h+=`<div class="xp eg"><h4>🧪 Example</h4>${x.eg.note?`<p>${x.eg.note}</p>`:''}${x.eg.code?`<pre class="code">${x.eg.code}</pre>`:''}${x.eg.out?`<div class="xout"><b>Output</b><pre>${x.eg.out}</pre></div>`:''}</div>`;
  if(x.tbl) h+=`<div class="xp tbl">${x.tbl.cap?`<h4>📋 ${x.tbl.cap}</h4>`:''}<div class="tblwrap"><table class="xt"><thead><tr>${x.tbl.h.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${x.tbl.r.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  if(h) h=`<div class="xpg">${h}</div>`;
  if(x.res) h+=`<div class="xp res"><b>✅ Result:</b> ${x.res}</div>`;
  return h;
}
function bloomHTML(b){ return `<div class="bloom">${[['head','🧠','Head','Cognitive — know & think'],['heart','❤️','Heart','Affective — value & feel'],['hand','✋','Hand','Psychomotor — do & build']].filter(r=>b[r[0]]).map(r=>`<div class="bl ${r[0]}"><h4>${r[1]} ${r[2]} <small>${r[3]}</small></h4><ul>${b[r[0]].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`; }
function revealOnScroll(){
  const els=$$('.slideCard, .card, .scard, .wk, .ins-card', app);
  if(!('IntersectionObserver' in window)){ return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>{ el.classList.add('rv'); io.observe(el); });
}
const demoDiv = x => `<div data-demo="${x.demo}"${x.input?` data-input="${esc(x.input)}"`:''}></div>`;
function mountDemos(root){ $$('[data-demo]',root).forEach(el=>{ if(!el._demo) window.ICTDemos.mount(el, el.dataset.demo); }); }

/* ---------- instructor card (same design family as the instructor's other course sites) ---------- */
function instructorCard(){
  return `<article class="ins-card reveal" aria-labelledby="ins-name">
    <div class="ins-ring"><div class="ins-av"><img src="assets/instructor.jpg" loading="lazy" decoding="async" alt="Portrait of Muhammad Tahir Mehmood"></div></div>
    <span class="ins-kicker">Instructor</span>
    <h2 id="ins-name">Muhammad Tahir Mehmood</h2>
    <p class="ins-q">MPhil Computer Science</p>
    <p class="ins-sum">More than 10 years of teaching Computer Science. Course instructor for Compiler Construction, BS Computer Science.</p>
    <div class="ins-grid" aria-label="Instructor affiliations">
      <div class="ins-role"><strong>Lecturer</strong><span>University of Central Punjab, Okara</span></div>
      <div class="ins-role"><strong>Headmaster</strong><span>GES 53/2-L, Okara</span></div>
      <div class="ins-role"><strong>Asst. Director (P&amp;D)</strong><span>DEA Okara</span></div>
      <div class="ins-role"><strong>10+ years</strong><span>Teaching Computer Science</span></div>
    </div></article>`;
}
const insBadge = `<span class="ins-badge"><img src="assets/instructor.jpg" alt="" width="34" height="34">Muhammad Tahir Mehmood</span>`;

/* ---------- views ---------- */
function home(){
  const last = st.last && sess(st.last.s);
  const weeks = []; for(let w=1; w<=17; w++) weeks.push({w, list:S.filter(s=>s.week===w)});
  app.innerHTML = `
  <section class="hero"><div class="wrap heroGrid"><div>
    <span class="chip">Compiler Construction · BS Computer Science · 3 Credit Hours</span>
    <h1>Compiler <span>Construction</span></h1>
    <p class="lead">An animated, projector-ready course: 30 teaching sessions plus midterm and final exam preparation — from characters to tokens, tokens to parse trees, and parse trees to three-address code. Every session has Bloom's Taxonomy outcomes (Head · Heart · Hand), worked algorithms and live lab tools.</p>
    <div class="meta"><span class="chip">📅 16 weeks + final exam</span><span class="chip">🧑‍🏫 90-minute sessions</span><span class="chip">🎬 ${Object.keys(window.ICTDemos.list).length} animations</span><span class="chip">📝 4 quizzes · 4 assignments · mid & final</span></div>
    <div class="cta"><a class="btn pri" href="#/sessions">Open sessions →</a><a class="btn watch" href="#/w/1">▶ Watch Session 1</a><a class="btn" href="#/p/1/1">🖥 Present</a><a class="btn" href="#/tools">🧪 Lab tools</a><a class="btn" href="lectures-1-3.html">📘 Lectures 1–3 (classic)</a>${window.AndroidApp?'':'<a class="btn" href="https://github.com/tahir8203/Compiler-Construction/releases/latest/download/CompilerConstruction.apk">📱 Android app (APK)</a>'}</div>
  </div>
  <div class="orbit" aria-hidden="true"><div class="ring">${['🔤','🌳','🤖','📒','⬇️','🏷️','🧾','🖥️'].map((e,k)=>{const a=k/8*2*Math.PI; return `<i style="left:${50+50*Math.cos(a)}%;top:${50+50*Math.sin(a)}%">${e}</i>`}).join('')}</div><div class="core">CC</div></div>
  </div></section>
  <div class="wrap">
    ${last?`<div class="card resume"><div style="font-size:34px">⏯</div><div class="grow"><div class="tiny">Continue where you left off</div><b>${esc(label(last))}: ${esc(last.title)}</b> <span class="tiny">· slide ${st.last.k}</span></div><a class="btn pri" href="#/p/${last.id}/${st.last.k}">Resume slides</a><a class="btn" href="#/s/${last.id}">Study notes</a></div>`:''}
    <div class="stats"><div><b>${pct()}%</b><span>course completed</span><div class="bar" style="margin-top:8px"><i style="width:${pct()}%"></i></div></div><div><b>${S.filter(s=>st.done[s.id]).length}/${S.length}</b><span>units done</span></div><div><b>${Object.keys(st.quiz).length}</b><span>quizzes attempted</span></div><div><b>${Object.keys(st.bm).length}</b><span>bookmarks</span></div></div>
    <section class="sec"><h2>Course roadmap</h2><p class="muted">Follows the official calendar of activities. Two 90-minute sessions per teaching week.</p>
      <div class="road">${weeks.map(({w,list})=>`<div class="wk"><div class="n">WEEK ${w}</div><h4>${esc(list[0]?list[0].unit:'')}</h4>${list.map(s=>`<a href="#/s/${s.id}"><span class="d ${st.done[s.id]?'done':''}"></span>${esc(short(s))} · ${esc(s.title)}</a>`).join('')}<div style="margin-top:6px">${list.map(kindChip).join(' ')}</div></div>`).join('')}</div>
    </section>
    <section class="sec"><h2>Course learning outcomes</h2><div class="grid g2">${C.outcomes.map((o,i)=>`<div class="card"><span class="chip ok">LO${i+1}</span><p style="margin:.6em 0 0">${esc(o)}</p></div>`).join('')}</div></section>
    <section class="sec">${instructorCard()}</section>
  </div>`;
}

function sessionsView(){
  app.innerHTML = `<div class="wrap"><div class="shead"><h1>Course library</h1><p class="muted">30 teaching sessions, a midterm unit and a final exam unit. Each has study notes, a projector slide deck, animations and checks.</p></div>
    <input class="search" id="q" type="search" placeholder="Search, e.g. NFA, FIRST, LL(1), backpatching, symbol table…" aria-label="Search sessions">
    <div class="filters" id="flt"><button class="on" data-f="all">All</button><button data-f="q">Quizzes</button><button data-f="a">Assignments</button><button data-f="x">Mid & final</button><button data-f="todo">Not completed</button><button data-f="bm">Bookmarked</button></div>
    <div class="grid g3" id="list"></div></div>`;
  let f='all';
  const idx = S.map(s=>({s, t:(s.title+' '+s.sub+' '+s.unit+' '+(s.assess||'')+' '+s.slides.map(x=>strip(x.h+' '+(x.p||'')+' '+(x.pts||[]).map(p=>p[1]).join(' '))).join(' ')+' '+(s.terms||[]).map(t=>t.join(' ')).join(' ')).toLowerCase()}));
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    const items = idx.filter(o=> (!q || q.split(/\s+/).every(w=>o.t.includes(w))) &&
      (f==='all' || (f==='q'&&/Quiz/.test(o.s.assess||'')) || (f==='a'&&/Assign/.test(o.s.assess||'')) || (f==='x'&&/(Mid|Final|Project)/.test(o.s.assess||'')) || (f==='todo'&&!st.done[o.s.id]) || (f==='bm'&&st.bm[o.s.id])));
    $('#list').innerHTML = items.length ? items.map(({s})=>`<article class="scard"><div class="top2"><div class="num">${s.exam?(s.id===90?'M':'F'):s.id}</div><div><div class="tiny">Week ${s.week} · ${esc(s.unit)}</div><h3>${esc(s.title)}</h3></div></div>
      <p>${esc(s.sub)}</p><div class="top2">${kindChip(s)}${st.done[s.id]?'<span class="chip ok">✔ Completed</span>':''}${st.bm[s.id]?'<span class="chip">🔖</span>':''}<span class="chip">${deck(s).length} slides</span></div>
      <div class="acts"><a class="btn sm pri" href="#/s/${s.id}">📖 Study</a><a class="btn sm" href="#/p/${s.id}/1">🖥 Present</a><a class="btn sm watch" href="#/w/${s.id}">▶ Watch</a></div></article>`).join('') : '<p class="muted">No sessions match your search.</p>';
  };
  $('#q').oninput = draw;
  $('#flt').onclick = e => { const b=e.target.closest('button'); if(!b) return; f=b.dataset.f; $$('#flt button').forEach(x=>x.classList.toggle('on',x===b)); draw(); };
  draw();
}

/* ---------- quizzes & assessments ---------- */
function mcqBlock(list, prefix){ return list.map((q,i)=>`<div class="qq" data-kind="mcq" data-i="${i}"><p>${prefix||''}${i+1}. ${q.q}</p>${q.o.map((o,j)=>`<button class="op" data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}<div class="why">💡 ${q.e}</div></div>`).join(''); }
function tfBlock(list){ return list.map((q,i)=>`<div class="qq" data-kind="tf" data-i="${i}"><p>${i+1}. ${q.q}</p><div class="row2"><button class="op" data-j="0">True</button><button class="op" data-j="1">False</button></div><div class="why">💡 ${q.a?'True':'False'} — ${q.e}</div></div>`).join(''); }
function answerBlock(list){ return list.map((q,i)=>`<div class="qq"><p>${i+1}. ${q.q}</p><details><summary>Show model answer</summary><div class="ans">${q.a}</div></details></div>`).join(''); }
function wireChoices(root, keys, onDone){
  // keys: {mcq:[...], tf:[...]}; scoring across all interactive questions inside root
  const all=$$('.qq[data-kind]',root); let right=0, ans=0;
  all.forEach(qq=>{ qq.addEventListener('click', e=>{ const b=e.target.closest('.op'); if(!b||qq.classList.contains('done')) return;
    const kind=qq.dataset.kind, q=keys[kind][+qq.dataset.i], correct = kind==='tf' ? (q.a?0:1) : q.a, j=+b.dataset.j;
    qq.classList.add('done'); ans++; $$('.op',qq)[correct].classList.add('right'); if(j!==correct) b.classList.add('wrong'); else right++;
    if(ans===all.length && onDone) onDone(right, all.length);
  }); });
}
function assessHTML(a){
  if(!a) return '';
  const sec=(t,h)=>h?`<h3>${t}</h3>${h}`:'';
  return `<div class="card assess" id="assess"><span class="chip ${a.kind==='quiz'?'q':a.kind==='assignment'?'a':'x'}">${esc(a.kind.toUpperCase())}</span><h2 style="margin-top:8px">${esc(a.title)}</h2>${a.covers?`<p class="muted">Covers: ${a.covers}</p>`:''}
   ${sec('Instructions', a.instructions?`<ul>${a.instructions.map(x=>`<li>${x}</li>`).join('')}</ul>`:'')}
   ${a.scenario?`<h3>Scenario</h3><div class="ex">${a.scenario}</div>`:''}
   ${sec('Tasks', a.tasks?`<ol>${a.tasks.map(x=>`<li>${x}</li>`).join('')}</ol>`:'')}
   ${sec('Submission', a.submission?`<ul>${a.submission.map(x=>`<li>${x}</li>`).join('')}</ul>`:'')}
   ${sec('Reflection questions', a.reflection?`<ul>${a.reflection.map(x=>`<li>${x}</li>`).join('')}</ul>`:'')}
   ${a.example?`<details class="exdet"><summary><b>📄 Worked example</b></summary><div class="ans">${a.example}</div></details>`:''}
   ${a.mcq||a.tf?`<div class="quiz">${a.mcq?`<h3>Part A — Multiple choice</h3>${mcqBlock(a.mcq)}`:''}${a.tf?`<h3>Part B — True / False</h3>${tfBlock(a.tf)}`:''}<div class="score" id="ascore"></div></div>`:''}
   ${a.short?`<div class="quiz"><h3>Part C — Short questions</h3>${answerBlock(a.short)}</div>`:''}
   ${a.app?`<div class="quiz"><h3>Part D — Application & scenario questions</h3>${answerBlock(a.app)}</div>`:''}
   ${a.note?`<p class="tiny">${a.note}</p>`:''}
  </div>`;
}

function study(id){
  const s = sess(id); if(!s) return notFound();
  const prev=prevOf(s), next=nextOf(s);
  app.innerHTML = `<div class="wrap"><div class="shead"><div class="tiny"><a href="#/sessions">Library</a> › Week ${s.week} · ${esc(s.unit)}</div>
    <h1>${esc(label(s))}: ${esc(s.title)}</h1><p class="muted" style="font-size:18px">${esc(s.sub)}</p>
    <div class="top2" style="display:flex;gap:8px;flex-wrap:wrap">${kindChip(s)}<span class="chip">⏱ 90 minutes</span><span class="chip">LO ${s.lo.join(', ')}</span>${s.book?`<span class="chip">📚 ${esc(s.book)}</span>`:''}</div>
    <div style="margin-top:12px">${insBadge}</div>
    <div class="toolbar"><a class="btn pri" href="#/p/${s.id}/1">🖥 Present slides (${deck(s).length})</a><a class="btn watch" href="#/w/${s.id}">▶ Watch animated lecture</a><button class="btn" id="bm">${st.bm[s.id]?'🔖 Bookmarked':'🔖 Bookmark'}</button><button class="btn" id="done">${st.done[s.id]?'✔ Completed':'Mark as completed'}</button><button class="btn" onclick="print()">🖨 Print handout</button></div></div>
    <div class="layout"><nav class="toc" aria-label="On this page"><b class="tiny">ON THIS PAGE</b>${s.intro?'<a href="#intro" data-jump>👋 Introduction</a>':''}<a href="#obj" data-jump>🎯 Objectives</a>${s.bloom?'<a href="#bloom" data-jump>🌸 Head · Heart · Hand</a>':''}${s.slides.map((x,i)=>`<a href="#c${i}" data-jump>${i+1}. ${esc(strip(x.h))}</a>`).join('')}${s.lab?'<a href="#lab" data-jump>🛠 Activity</a>':''}${s.disc?'<a href="#disc" data-jump>💬 Discussion</a>':''}<a href="#mist" data-jump>⚠️ Common mistakes</a><a href="#rev" data-jump>✔ Summary</a><a href="#quiz" data-jump>📝 Knowledge check</a>${s.assessment?'<a href="#assess" data-jump>📌 '+esc(s.assessment.title)+'</a>':''}${s.hw?'<a href="#hw" data-jump>🏠 Homework</a>':''}<a href="#terms" data-jump>📘 Key terms</a></nav>
    <div>
      ${s.intro?`<div class="card" id="intro"><h2>👋 Introduction</h2><p class="muted" style="font-size:17px">${s.intro}</p></div><br>`:''}
      <div class="card obj" id="obj"><h2>🎯 Learning objectives</h2><ul>${s.obj.map(o=>`<li>${o}</li>`).join('')}</ul></div><br>
      ${s.bloom?`<div class="card" id="bloom"><h2>🌸 Bloom's Taxonomy outcomes</h2>${bloomHTML(s.bloom)}</div><br>`:''}
      ${s.slides.map((x,i)=>`<section class="slideCard" id="c${i}" data-si="${i}"><div class="k">${esc(x.k||'Concept')} · ${i+1}/${s.slides.length}</div><h3>${x.ic?x.ic+' ':''}${x.h}</h3>${body(x)}${x.demo?demoDiv(x):''}${x.n?`<details class="tnotes noprint"><summary>🧑‍🏫 Teacher notes</summary>${notesHTML(x.n)}</details>`:''}</section>`).join('')}
      ${s.lab?`<div class="card lab" id="lab"><h2>🛠 ${esc(s.lab.t)}</h2><ol>${s.lab.steps.map(m=>`<li>${m}</li>`).join('')}</ol>${s.lab.out?`<p class="tiny"><b>Output:</b> ${s.lab.out}</p>`:''}${s.lab.demo?`<div data-demo="${s.lab.demo}"></div>`:''}</div><br>`:''}
      ${s.disc?`<div class="card" id="disc"><h2>💬 Discussion questions</h2><ol>${s.disc.map(m=>`<li>${m}</li>`).join('')}</ol></div><br>`:''}
      ${s.mistakes&&s.mistakes.length?`<div class="card mist" id="mist"><h2>⚠️ Common mistakes</h2><ul>${s.mistakes.map(m=>`<li>${m}</li>`).join('')}</ul></div><br>`:''}
      <div class="card" id="rev"><h2>✔ Session summary & revision</h2><ul>${s.rev.map(m=>`<li>${m}</li>`).join('')}</ul></div><br>
      <div class="card quiz" id="quiz"><h2>📝 Knowledge check</h2><p class="tiny">Choose an answer to see the explanation.</p>${mcqBlock(s.quiz)}<div class="score" id="score"></div></div><br>
      ${s.assessment?assessHTML(s.assessment)+'<br>':''}
      ${s.hw?`<div class="card" id="hw"><h2>🏠 Homework / preparation</h2><p>${s.hw}</p></div><br>`:''}
      <div class="card gl" id="terms"><h2>📘 Glossary: new words in this lecture</h2><dl>${lectureTerms(s).map(t=>`<dt>${esc(t[0])}</dt><dd>${t[2]}${t[3]?`<br><span class="tiny"><b>Why:</b> ${t[3]}</span>`:''}${t[4]?`<br><span class="tiny"><b>🔁 Like:</b> ${t[4]}</span>`:''}</dd>`).join('')}</dl></div>
      <div class="toolbar noprint" style="justify-content:space-between;margin-top:20px">${prev?`<a class="btn" href="#/s/${prev.id}">← ${esc(short(prev))}: ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a class="btn pri" href="#/s/${next.id}">${esc(short(next))}: ${esc(next.title)} →</a>`:''}</div>
    </div></div></div>`;
  mountDemos(app); CCTerms.annotate(app);
  wireChoices($('#quiz',app), {mcq:s.quiz}, (r,n)=>{ $('#score',app).textContent=`Score: ${r} / ${n} ${r===n?'🌟':''}`; st.quiz[s.id]=r+'/'+n; save(); hook('onQuiz',s,r,n); });
  const a=s.assessment; if(a && (a.mcq||a.tf)) wireChoices($('#assess',app), {mcq:a.mcq||[], tf:a.tf||[]}, (r,n)=>{ $('#ascore',app).textContent=`${a.title}: ${r} / ${n}`; st.quiz['a'+s.id]=r+'/'+n; save(); hook('onAssess',s,r,n); });
  $$('[data-jump]',app).forEach(x=>x.onclick=e=>{ e.preventDefault(); const t=$(x.getAttribute('href'),app); t&&t.scrollIntoView({behavior:'smooth'}); });
  $('#bm').onclick = () => { st.bm[s.id]?delete st.bm[s.id]:st.bm[s.id]=1; save(); $('#bm').textContent = st.bm[s.id]?'🔖 Bookmarked':'🔖 Bookmark'; };
  window.CCEdit&&CCEdit.decorate();
  $('#done').onclick = () => { st.done[s.id]?delete st.done[s.id]:st.done[s.id]=1; save(); $('#done').textContent = st.done[s.id]?'✔ Completed':'Mark as completed'; hook('onDone',s,!!st.done[s.id]); };
}

/* ---------- presentation engine ---------- */
let P = null;
function present(id, k){
  const s=sess(id); if(!s) return notFound();
  if(!P || P.s.id!==s.id){ closePres(true); P={s,d:deck(s),i:0,notes:false}; buildPres(); }
  const i=Math.min(Math.max(1,+k||1), P.d.length)-1;
  const dir = i<P.i ? 'back':'';
  P.i=i; st.last={s:s.id,k:i+1}; save(); renderSlide(dir);
}
function buildPres(){
  const el=document.createElement('div'); el.className='pres'; el.id='pres'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','Presentation');
  el.innerHTML=`<div class="pbar"><i id="pb"></i></div><div class="phead"><span class="t">${esc(label(P.s))} · ${esc(P.s.title)}</span><button class="iconbtn" id="pTheme" title="Light/dark (L)" aria-label="Toggle theme">◐</button><button class="iconbtn" id="pFull" title="Fullscreen (F)" aria-label="Fullscreen">⛶</button><button class="iconbtn" id="pX" title="Exit (Esc)" aria-label="Exit presentation">✕</button></div>
  <div class="pbody" id="pbody"></div><div class="notes" id="pnotes"></div>
  <div class="pfoot"><button class="btn sm" id="pPrev" aria-label="Previous slide">← Prev</button><span class="num" id="pnum"></span><button class="btn sm pri" id="pNext" aria-label="Next slide">Next →</button><button class="btn sm watch" id="pW" title="Play the whole deck like a video (W)">▶ Watch (W)</button><span class="spacer"></span><button class="btn sm hide-s" id="pOv">▦ Overview (O)</button><button class="btn sm" id="pN">📝 Notes (N)</button><a class="btn sm hide-s" href="#/s/${P.s.id}">📖 Study view</a></div>
  <div class="ov" id="pov"></div>`;
  document.body.append(el); document.body.style.overflow='hidden'; hook('onPres',true);
  $('#pPrev').onclick=()=>{ stopWatch(); go(-1); }; $('#pNext').onclick=()=>{ stopWatch(); go(1); }; $('#pW').onclick=toggleWatch;
  $('#pX').onclick=exitPres; $('#pFull').onclick=full; $('#pN').onclick=toggleNotes; $('#pOv').onclick=overview; $('#pTheme').onclick=flipTheme;
  let x0=null; el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  el.addEventListener('touchend',e=>{ if(x0===null) return; const dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>60 && !e.target.closest('.demo,input,textarea,.gchips')) go(dx<0?1:-1); x0=null; });
}
function renderSlide(dir){
  const x=P.d[P.i], n=P.d.length;
  $('#pb').style.width=((P.i+1)/n*100)+'%'; $('#pnum').textContent=`${P.i+1} / ${n}`;
  $('#pPrev').disabled=P.i===0; $('#pNext').disabled=P.i===n-1;
  let inner='';
  if(x.type==='title'||x.type==='end'){
    inner=`<div class="two title"><div><div class="k">${x.k}</div><h2>${x.h}</h2><div class="p">${x.p}</div>${x.type==='title'?`<div style="margin-top:22px">${insBadge}</div>`:''}</div><div class="bigicon">${x.ic||'💡'}</div></div>`;
  } else if(x.type==='bloom'){
    inner=`<div class="k">${x.k}</div><h2>${x.h}</h2>${bloomHTML(x.bloom)}`;
  } else if(x.type==='check'){
    inner=`<div class="k">${x.k}</div><h2>${x.h}</h2><div class="checks">${x.qs.map((q,qi)=>`<div class="chk qq" data-qi="${qi}"><p class="cq"><b>Q${qi+1}.</b> ${q.q}</p><div class="cops">${q.o.map((o,j)=>`<button class="op" data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div class="why">💡 ${q.e}</div></div>`).join('')}</div>`;
  } else if(x.type==='gloss'){
    inner=`<div class="k">${x.k}</div><h2>${x.h}</h2><p class="tiny">Tap or hover a word for its meaning, why it exists and a real-life analogy.</p><div class="gchips">${x.terms.map(t=>`<button type="button" class="gchip" data-gt="${esc(t[0])}"><b>${esc(t[0])}</b><span>${t[2]}</span></button>`).join('')}</div>`;
  } else if(x.type==='quiz'){
    const q=x.q; inner=`<div class="k">${x.k}</div><h2 style="font-size:clamp(24px,3.2vw,48px)">${q.q}</h2><div class="quiz qs"><div class="qq">${q.o.map((o,j)=>`<button class="op" data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}<div class="why">💡 ${q.e}</div></div></div>`;
  } else {
    const vis = x.demo ? demoDiv(x) : (x.ic && !x.pts && !x.cmp && !x.code && !x.img && !x.parts && !x.tbl && !x.eg && !x.what && strip(x.p||'').length<200 ? `<div class="bigicon">${x.ic}</div>` : '');
    const txt = `<div class="k">${esc(x.k||'Concept')}</div><h2>${x.ic&&!vis&&x.type==='concept'?x.ic+' ':''}${x.h}</h2>${body(x)}`;
    inner = x.full ? `<div class="full">${txt}${vis}</div>` : vis ? `<div class="two ${x.demo&&(x.pts||x.cmp||x.code||x.parts||x.tbl||x.eg)?'one':x.demo?(x.p||x.an?'wide bal':'wide'):''}"><div>${txt}</div>${vis}</div>` : txt;
  }
  const xps = !x.type||x.type==='concept' ? (x.parts||x.what||x.eg||x.tbl||x.res?' xps':'') : '';
  const b=$('#pbody'); b.innerHTML=`<div class="slide ${dir}${xps}">${inner}</div>`; b.scrollTop=0;
  xcolsInit($('.slide',b)); mountDemos(b); fitSlide(); setTimeout(fitSlide,80);
  $$('.qq',b).forEach(qq=>{ const q=x.q||x.qs[+qq.dataset.qi]; qq.onclick=e=>{ const o=e.target.closest('.op'); if(!o||qq.classList.contains('done')) return; qq.classList.add('done'); $$('.op',qq)[q.a].classList.add('right'); if(+o.dataset.j!==q.a) o.classList.add('wrong'); fitSlide(); }; });
  $$('.gchip',b).forEach(c=>c.onclick=e=>{ e.stopPropagation(); CCTerms.open(c, c.dataset.gt); });
  CCTerms.annotate($('.slide',b));
  $('#pnotes').innerHTML=`<b>Presenter notes</b>${notesHTML(x.n)}`; $('#pnotes').classList.toggle('show',P.notes);
  if(!$('#pov').classList.contains('show')) $('#pNext').focus({preventScroll:true});
  if(P.watch) scheduleWatch();
  window.CCEdit&&CCEdit.decorate();
}
/* Fit-to-screen (v20). The slide always uses the full width of the stage and is never shrunk into the middle.
   Explain slides: the blocks (code, parts, what happens, example) are flowed into two balanced columns, reading order
   kept (left column top to bottom, then right column). Tall slides: 1) compact layout (class d1), 2) tighter (d2),
   3) scale the text a little (never below 82%; the slide keeps its full width). If it still does not fit, the stage
   scrolls and a glow at the bottom edge says there is more. Phones keep large text and scroll. */
function xcolsInit(sl){
  const g=$('.xpg',sl); if(!g) return;
  const blocks=['parts','what','eg'].map(c=>$('.xp.'+c,g)).filter(Boolean);
  const pre=g.previousElementSibling, code=pre&&pre.matches('pre.code')?pre:null;
  if(blocks.length+(code?1:0)<2 || !blocks.length) return;
  const xc=document.createElement('div'); xc.className='xcols'; xc.innerHTML='<div class="xc"></div><div class="xc"></div>'; g.before(xc);
  sl._x={xc,blocks,code}; xplace(sl,false,Math.ceil(blocks.length/2));
}
function xplace(sl,inc,k){
  const {xc,blocks,code}=sl._x, L=xc.children[0], R=xc.children[1];
  const seq=inc&&code?[code].concat(blocks):blocks; if(code&&!inc) xc.before(code);
  L.append(...seq.slice(0,k)); R.append(...seq.slice(k)); xc.classList.toggle('solo',k>=seq.length);
}
function xbalance(sl){
  if(!sl._x) return; const {xc,blocks,code}=sl._x; let best=null;
  [false,true].forEach(inc=>{ if(inc&&!code) return; const n=blocks.length+(inc?1:0);
    for(let k=1;k<=n;k++){ if(k===n&&n>1&&inc) continue; xplace(sl,inc,k);
      if(inc&&code.scrollWidth>code.clientWidth+2) continue;           // code would need sideways scrolling: keep it full width
      const h=xc.offsetHeight+(code&&!inc?code.offsetHeight:0); if(!best||h<best.h-4) best={h,inc,k}; } });
  if(best) xplace(sl,best.inc,best.k);
}
function fitSlide(){
  const b=$('#pbody'), sl=b&&$('.slide',b); if(!sl) return;
  sl.style.zoom=''; sl.style.maxWidth=''; sl.classList.remove('d1','d2'); b.classList.remove('more');
  if(innerWidth<900) return;
  const over=()=>b.scrollHeight>b.clientHeight+1;
  xbalance(sl); if(!over()) return;
  sl.classList.add('d1'); xbalance(sl); if(!over()) return;
  sl.classList.add('d2'); xbalance(sl); if(!over()) return;
  const maxW=parseFloat(getComputedStyle(sl).maxWidth)||1680;
  const fits=z=>{ sl.style.zoom=z; sl.style.maxWidth=(maxW/z)+'px'; return !over(); };
  let lo=0.82, hi=1;
  if(fits(lo)){ for(let i=0;i<5;i++){ const m=(lo+hi)/2; if(fits(m)) lo=m; else hi=m; } }
  if(!fits(+lo.toFixed(3))) b.classList.add('more');
}
addEventListener('resize',()=>{ if(P) fitSlide(); });
/* Watch mode: plays the deck like an animated video — animations auto-play, quizzes reveal, slides auto-advance. */
function scheduleWatch(){
  clearTimeout(P.wt); clearTimeout(P.wt2); [0,1,2,3].forEach(k=>clearTimeout(P['wq'+k]));
  const x=P.d[P.i], b=$('#pbody'), demo=$('[data-demo]',b);
  let ms;
  if(x.type==='check'){ ms=6000+x.qs.length*5000; x.qs.forEach((q,qi)=>{ P['wq'+qi]=setTimeout(()=>{ const qq=$$('.qq',b)[qi]; if(qq&&!qq.classList.contains('done')) $$('.op',qq)[q.a].click(); },4500+qi*5000); }); }
  else if(x.type==='gloss'){ ms=Math.min(16000,5000+x.terms.length*700); }
  else if(x.type==='quiz'){ ms=11000; P.wt2=setTimeout(()=>{ const qq=$('.qq',b); if(qq&&!qq.classList.contains('done')) $$('.op',qq)[x.q.a].click(); },6500); }
  else if(demo&&demo._demo){ setTimeout(()=>demo._demo.play(),900); ms=900+demo._demo.n*2100+2600; }
  else { const words=strip([x.h,x.p,x.code||'',x.bloom?Object.values(x.bloom).flat().join(' '):'',(x.pts||[]).map(p=>p[1]).join(' '),(x.cmp||[]).map(c=>c[1].join(' ')).join(' '),x.ex,x.tk].join(' ')).split(/\s+/).length; ms=Math.min(16000,Math.max(5000,words*230)); }
  P.wt=setTimeout(()=>{ if(!P||!P.watch) return; if(P.i>=P.d.length-1){ stopWatch(); return; } go(1); }, ms);
  const bar=$('#wbar'); if(bar){ bar.style.transition='none'; bar.style.width='0'; requestAnimationFrame(()=>requestAnimationFrame(()=>{ bar.style.transition=`width ${ms}ms linear`; bar.style.width='100%'; })); }
}
function toggleWatch(){ P.watch ? stopWatch() : startWatch(); }
function startWatch(){ if(!P) return; P.watch=true; $('#pW').textContent='⏸ Pause (W)'; $('#pW').classList.add('on'); if(!$('#wbar')){ const w=document.createElement('div'); w.className='wbar'; w.innerHTML='<i id="wbar"></i>'; $('#pres').insertBefore(w,$('#pbody')); } scheduleWatch(); }
function stopWatch(){ if(!P||!P.watch) return; P.watch=false; clearTimeout(P.wt); clearTimeout(P.wt2); [0,1,2,3].forEach(k=>clearTimeout(P['wq'+k])); $('#pW').textContent='▶ Watch (W)'; $('#pW').classList.remove('on'); const w=$('.wbar'); if(w) w.remove(); }
function go(dlt){ const j=P.i+dlt; if(j<0||j>=P.d.length) return; location.replace(`#/p/${P.s.id}/${j+1}`); }
function jump(j){ location.replace(`#/p/${P.s.id}/${j}`); }
function toggleNotes(){ P.notes=!P.notes; $('#pnotes').classList.toggle('show',P.notes); fitSlide(); }
function full(){ if(document.fullscreenElement) document.exitFullscreen(); else if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{}); }
function overview(){ const o=$('#pov'); if(o.classList.contains('show')){ o.classList.remove('show'); return; }
  o.innerHTML=`<div class="toolbar"><b style="font-family:var(--disp);font-size:20px">Slide overview</b><span style="flex:1"></span><button class="btn sm" id="ovx">Close (O)</button></div><div class="og">${P.d.map((x,k)=>`<button data-k="${k+1}" class="${k===P.i?'cur':''}"><small>${k+1} · ${esc(strip(x.k||''))}</small>${esc(strip(x.h||x.q&&x.q.q||''))}</button>`).join('')}</div>`;
  o.classList.add('show'); $('#ovx').onclick=overview; o.onclick=e=>{ const b=e.target.closest('[data-k]'); if(b){ o.classList.remove('show'); jump(+b.dataset.k); } };
  const cur=$('.cur',o); cur&&cur.focus(); }
function exitPres(){ const id=P&&P.s.id; closePres(); location.hash = id?`#/s/${id}`:'#/'; }
function closePres(keep){ if(P){ clearTimeout(P.wt); clearTimeout(P.wt2); } const el=$('#pres'); if(el) el.remove(); document.body.style.overflow=''; if(document.fullscreenElement && !keep) document.exitFullscreen().catch(()=>{}); if(P) hook('onPres',false); P=null; }
let numBuf='';
document.addEventListener('keydown', e=>{
  if(!P || e.ctrlKey || e.metaKey || e.altKey) return;
  if(e.target.matches && e.target.matches('input,textarea,select')) return;
  const demo=$('#pbody [data-demo]'); const k=e.key;
  if(k==='w'||k==='W'){ toggleWatch(); return; }
  if(['ArrowRight','PageDown',' ','ArrowLeft','PageUp','Home','End'].includes(k)) stopWatch();
  if(k==='ArrowRight'||k==='PageDown'||k===' '){ e.preventDefault(); go(1); }
  else if(k==='ArrowLeft'||k==='PageUp'){ e.preventDefault(); go(-1); }
  else if(k==='Home'){ e.preventDefault(); jump(1); } else if(k==='End'){ e.preventDefault(); jump(P.d.length); }
  else if(k==='f'||k==='F') full(); else if(k==='n'||k==='N') toggleNotes(); else if(k==='o'||k==='O') overview();
  else if(k==='l'||k==='L') flipTheme();
  else if((k==='s'||k==='S')&&demo&&demo._demo) demo._demo.step(); else if((k==='p'||k==='P')&&demo&&demo._demo) demo._demo.play(); else if((k==='r'||k==='R')&&demo&&demo._demo) demo._demo.reset();
  else if(/^\d$/.test(k)){ numBuf+=k; } else if(k==='Enter'&&numBuf){ jump(Math.min(+numBuf,P.d.length)); numBuf=''; }
  else if(k==='Escape'){ if($('#pov').classList.contains('show')) $('#pov').classList.remove('show'); else if(!document.fullscreenElement) exitPres(); }
});

/* ---------- other pages ---------- */
function allTerms(){ const m=new Map(); S.forEach(s=>(s.terms||[]).forEach(t=>{ if(!m.has(t[0].toLowerCase())) m.set(t[0].toLowerCase(),[t[0],t[1],s.id]); })); return [...m.values()].sort((a,b)=>a[0].localeCompare(b[0])); }
function glossary(){
  const T=allTerms();
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Glossary</h1><p class="muted">${T.length} key terms from all sessions.</p></div><input class="search" id="gq" type="search" placeholder="Search terms…" aria-label="Search glossary"><div class="card gl" style="margin-top:16px"><dl id="gl"></dl></div></div>`;
  const draw=()=>{ const q=$('#gq').value.toLowerCase(); $('#gl').innerHTML=T.filter(t=>(t[0]+t[1]).toLowerCase().includes(q)).map(t=>`<dt>${esc(t[0])} <a class="tiny" href="#/s/${t[2]}">${esc(short(sess(t[2])))}</a></dt><dd>${esc(t[1])}</dd>`).join('')||'<p class="muted">No terms found.</p>'; };
  $('#gq').oninput=draw; draw();
}
function flash(){
  const T=allTerms(); let i=0, order=T.map((_,k)=>k);
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Flashcards</h1><p class="muted">Click the card (or press Space) to flip. Use ← → to move.</p>
    <label class="tiny">Filter by session <select id="fs" class="btn sm"><option value="">All sessions</option>${S.filter(s=>s.terms.length).map(s=>`<option value="${s.id}">${esc(short(s))}: ${esc(s.title)}</option>`).join('')}</select></label></div>
    <div class="flash"><div class="fc" id="fc" tabindex="0" role="button" aria-label="Flip card"><div class="face"><div><div class="tiny" id="fn"></div><h2 id="ft"></h2></div></div><div class="face b"><p id="fd"></p></div></div></div>
    <div class="toolbar" style="justify-content:center"><button class="btn" id="fp">← Previous</button><button class="btn" id="fsh">🔀 Shuffle</button><button class="btn pri" id="fnx">Next →</button></div></div>`;
  const draw=()=>{ const t=T[order[i]]; if(!t){ $('#ft').textContent='No cards'; $('#fd').textContent=''; return; } $('#fc').classList.remove('flip'); $('#fn').textContent=`Card ${i+1} of ${order.length} · ${short(sess(t[2]))}`; $('#ft').textContent=t[0]; $('#fd').textContent=t[1]; };
  $('#fc').onclick=()=>$('#fc').classList.toggle('flip');
  $('#fp').onclick=()=>{ i=(i-1+order.length)%order.length; draw(); }; $('#fnx').onclick=()=>{ i=(i+1)%order.length; draw(); };
  $('#fsh').onclick=()=>{ for(let a=order.length-1;a>0;a--){const b=Math.floor(Math.random()*(a+1));[order[a],order[b]]=[order[b],order[a]];} i=0; draw(); };
  $('#fs').onchange=e=>{ const v=+e.target.value; order=T.map((t,k)=>k).filter(k=>!v||T[k][2]===v); i=0; draw(); };
  app._keys = e=>{ if(e.target.matches && e.target.matches('select,input')) return; if(e.key===' '){e.preventDefault();$('#fc').classList.toggle('flip');} if(e.key==='ArrowRight') $('#fnx').click(); if(e.key==='ArrowLeft') $('#fp').click(); };
  draw();
}
function assessView(){
  const A=S.filter(s=>s.assessment);
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Assessments</h1><p class="muted">All quizzes, assignments, the midterm, the project and the final exam preparation, in calendar order. Official marks and weightage are announced by the instructor and are not set here.</p></div>
  <div class="grid g3">${A.map(s=>{const a=s.assessment; const n=(a.mcq||[]).length+(a.tf||[]).length+(a.short||[]).length+(a.app||[]).length; return `<article class="scard"><div class="top2"><span class="chip ${a.kind==='quiz'?'q':a.kind==='assignment'?'a':'x'}">${esc(a.kind)}</span><span class="chip">Week ${s.week}</span></div><h3>${esc(a.title)}</h3><p>${a.covers?'Covers: '+a.covers:esc(s.title)}</p><p class="tiny">${n?n+' questions with answers':''}${a.tasks?(n?' · ':'')+a.tasks.length+' tasks':''}</p><div class="acts"><a class="btn sm pri" href="#/s/${s.id}" data-a="${s.id}">Open</a></div></article>`}).join('')}</div></div>`;
  $$('[data-a]',app).forEach(a=>a.onclick=e=>{ e.preventDefault(); location.hash='#/s/'+a.dataset.a; setTimeout(()=>{ const t=$('#assess'); t&&t.scrollIntoView(); },60); });
}
function revision(){
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Revision dashboard</h1><p class="muted">Every session's key points on one page. Use it before quizzes, the midterm and the final exam.</p>
  <div class="toolbar"><a class="btn" href="#/flash">🃏 Flashcards</a><a class="btn" href="#/s/90">📝 Midterm prep</a><a class="btn" href="#/s/99">🎓 Final exam prep</a><button class="btn" onclick="print()">🖨 Print</button></div></div>
  ${[...new Set(S.map(s=>s.unit))].map(u=>`<div class="card" style="margin-bottom:14px"><h3>${esc(u)}</h3>${S.filter(s=>s.unit===u).map(s=>`<p style="margin:.6em 0 .2em"><a href="#/s/${s.id}"><b>${esc(short(s))}: ${esc(s.title)}</b></a></p><ul style="margin:0">${s.rev.map(r=>`<li>${r}</li>`).join('')}</ul>`).join('')}</div>`).join('')}</div>`;
}
function outline(){
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Course outline</h1><p class="muted">Compiler Construction · BS Computer Science · 3 credit hours · 17 weeks (Mid Term in Week 9, Final Term in Week 17) · two 90-minute sessions per teaching week.</p></div>
  <div class="grid g2"><div class="card"><h3>Course introduction</h3><p class="muted">${C.intro}</p><h3>Objectives</h3><ul>${C.objectives.map(o=>`<li>${o}</li>`).join('')}</ul></div>
  <div class="card"><h3>Learning outcomes</h3><ol>${C.outcomes.map(o=>`<li>${o}</li>`).join('')}</ol><h3>Reference material</h3><ul>${C.books.map(b=>`<li>${b}</li>`).join('')}</ul><h3>Also useful</h3><ul>${C.refs.map(b=>`<li>${b}</li>`).join('')}</ul></div></div><br>
  <div class="card"><h3>Calendar of activities</h3><p class="tiny">Note: the scanned outline's Week 4 row also says "Ampere's Law and Its Applications". That is a physics topic copied by mistake and is not part of this course.</p><div class="tblwrap"><table class="cal"><tr><th>Week</th><th>Sessions</th><th>Activity</th></tr>${Array.from({length:17},(_,w)=>{const ws=S.filter(s=>s.week===w+1); return `<tr><td><b>${w+1}</b></td><td>${ws.map(s=>`<a href="#/s/${s.id}">${esc(short(s))} · ${esc(s.title)}</a>`).join('<br>')}</td><td>${ws.map(kindChip).join(' ')}</td></tr>`}).join('')}</table></div></div><br>
  <div class="grid g2"><div class="card"><h3>Class policies</h3><ul>${C.policies.map(p=>`<li>${p}</li>`).join('')}</ul></div><div class="card"><h3>Academic honesty</h3><p class="muted">Copied assignments or code receive zero. Write your own code and cite any source you used.</p><h3>Participation</h3><p class="muted">Attend all classes and read assigned material in advance. Insightful, useful contributions in discussions are tracked; unproductive contributions are not rewarded.</p></div></div></div>`;
}
function bookmarks(){
  const b=S.filter(s=>st.bm[s.id]);
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>Bookmarks & progress</h1><p class="muted">Saved only in this browser on this device.</p></div>
  <div class="card"><h3>Bookmarked</h3>${b.length?b.map(s=>`<p><a href="#/s/${s.id}">${esc(short(s))}: ${esc(s.title)}</a></p>`).join(''):'<p class="muted">No bookmarks yet. Use 🔖 on any session page.</p>'}</div><br>
  <div class="card"><h3>Completed units</h3><div class="bar"><i style="width:${pct()}%"></i></div><p class="tiny">${S.filter(s=>st.done[s.id]).length} of ${S.length} units marked complete.</p></div><br>
  <div class="card"><h3>Quiz results</h3><div class="tblwrap"><table class="cal"><tr><th>Unit</th><th>Knowledge check</th><th>Assessment</th></tr>${S.filter(s=>st.quiz[s.id]||st.quiz['a'+s.id]).map(s=>`<tr><td><a href="#/s/${s.id}">${esc(short(s))}: ${esc(s.title)}</a></td><td>${st.quiz[s.id]||'—'}</td><td>${st.quiz['a'+s.id]||'—'}</td></tr>`).join('')||'<tr><td colspan="3" class="muted">No quizzes attempted yet.</td></tr>'}</table></div></div><br>
  <button class="btn" id="rst">Reset my progress</button></div>`;
  $('#rst').onclick=()=>{ if(confirm('Reset all progress, bookmarks and quiz scores on this device?')){ st=blank(); save(); hook('reset'); bookmarks(); } };
}
function notFound(){ app.innerHTML=`<div class="wrap shead"><h1>Page not found</h1><a class="btn" href="#/">Go home</a></div>`; }

/* ---------- router ---------- */
function route(){
  const h=location.hash.replace(/^#\/?/,'').split('/');
  $('#nav').classList.remove('open');
  if(h[0]==='p'){ present(h[1],h[2]); return; }
  if(h[0]==='w'){ present(h[1],1); history.replaceState(null,'',`#/p/${h[1]}/1`); startWatch(); return; }
  if(P) closePres();
  app._keys=null;
  const PR=(window.CCPortal&&window.CCPortal.routes)||{};
  (Object.assign({'':home, sessions:sessionsView, s:()=>study(h[1]), glossary, flash, outline, bookmarks, assess:assessView, revision, tools:()=>window.CCTools.render(app)},PR)[h[0]]||notFound)(h);
  hook('afterRoute',h);
  revealOnScroll();
  $$('#nav a').forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#/'+h[0]));
  window.scrollTo(0,0);
}
document.addEventListener('keydown',e=>{ if(!P && app._keys) app._keys(e); });
function hook(n,...a){ try{ const p=window.CCPortal; if(p&&p[n]) return p[n](...a); }catch(e){ console.error(e); } }
window.CCApp = { deck, sessions:S, get st(){return st}, save, sess, label, short, esc, strip, pct, kindChip, instructorCard, flipTheme, setTheme, allTerms, mcqBlock, wireChoices, mountDemos, revealOnScroll, route, resetAll(){ st=blank(); save(); }, get pres(){return P},
  /* re-draw after lecture content changed (teacher edit or cloud update) */
  refresh(){ _firstSeen=null; if(P){ P.d=deck(P.s); P.i=Math.min(P.i,P.d.length-1); renderSlide(''); } else route(); } };
addEventListener('hashchange', route); route();
})();
