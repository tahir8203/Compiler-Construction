/* Compiler Construction — educational animation library.
   Each demo explains one idea in steps. Controls: Play / Step / Reset.
   Keyboard in presentation: S = step, P = play, R = reset. */
(function(){
const D = {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const h = (tag, attrs={}, html='') => { const e=document.createElement(tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(html) e.innerHTML=html; return e; };
const esc = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---------- generic step engine ---------- */
function mount(el, id){
  const def = D[id]; if(!def){ el.textContent='Demo not found: '+id; return; }
  el.classList.add('demo'); el.innerHTML='';
  if(def.title) el.append(h('div',{class:'tiny'},'▶ Animation: <b>'+def.title+'</b>'));
  const stage = h('div',{class:'stage'}); const cap = h('div',{class:'cap','aria-live':'polite'});
  const ctl = h('div',{class:'ctl'});
  el.append(stage, cap, ctl);
  const ctx = def.build(stage) || {};
  // grow the SVG viewBox so nothing drawn near the edges is clipped
  const svg = stage.querySelector('svg');
  if(svg && svg.viewBox && svg.viewBox.baseVal){ try{ const b=svg.getBBox(), v=svg.viewBox.baseVal; if(b.width>0){
    const x0=Math.min(v.x,b.x-8), y0=Math.min(v.y,b.y-8), x1=Math.max(v.x+v.width,b.x+b.width+8), y1=Math.max(v.y+v.height,b.y+b.height+8);
    svg.setAttribute('viewBox',`${x0} ${y0} ${x1-x0} ${y1-y0}`); } }catch(e){} }
  const n = def.caps.length; let i = 0, timer = null;
  const play = h('button',{class:'btn sm pri',type:'button'},'▶ Play');
  const step = h('button',{class:'btn sm',type:'button'},'⏭ Step');
  const back = h('button',{class:'btn sm',type:'button','aria-label':'Previous step'},'⏮');
  const reset = h('button',{class:'btn sm',type:'button'},'↺ Reset');
  const dots = h('span',{class:'dots'}); for(let k=0;k<n;k++) dots.append(h('i'));
  if(n>1) ctl.append(play, back, step, reset, dots); else ctl.append(reset);
  function show(){
    cap.innerHTML = def.caps[i];
    [...dots.children].forEach((d,k)=>d.classList.toggle('on',k<=i));
    def.show(ctx, i, stage);
    step.disabled = i>=n-1; back.disabled = i<=0;
  }
  function stop(){ clearInterval(timer); timer=null; play.textContent='▶ Play'; }
  function next(){ if(i<n-1){ i++; show(); } else stop(); }
  play.onclick = () => { if(timer){ stop(); return; } if(i>=n-1){ i=0; show(); } play.textContent='⏸ Pause'; timer=setInterval(next, RM?2800:2200); };
  step.onclick = () => { stop(); next(); };
  back.onclick = () => { stop(); if(i>0){ i--; show(); } };
  reset.onclick = () => { stop(); i=0; show(); };
  el._demo = { n, step:()=>step.click(), play:()=>{ if(!timer) play.click(); }, reset:()=>reset.click() };
  show();
}

/* ---------- builder 1: flow of tiles ---------- */
function flow(title, tiles, caps, opts={}){
  return { title, caps,
    build(stage){
      const row = h('div',{class:'row'}); const els=[], arr=[];
      tiles.forEach((t,k)=>{
        if(k){ const a=h('span',{class:'arrow'},'➜'); arr.push(a); row.append(a); }
        const d=h('div',{class:'tile'},`<span class="e">${t[0]}</span><b>${t[1]}</b>${t[2]?'<small>'+t[2]+'</small>':''}`);
        els.push(d); row.append(d);
      });
      stage.append(row);
      const out = opts.out ? h('div',{class:'fx outbox'}) : null; if(out) stage.append(out);
      return {els,arr,out};
    },
    show(c,i){
      const lit = opts.map ? opts.map[i] : (i===0?-1:i-1);
      c.els.forEach((e,k)=>{ e.classList.toggle('on',k===lit); e.classList.toggle('good', !opts.map && k<lit); e.classList.toggle('bad', !!(opts.bad && opts.bad[i]===k)); });
      c.arr.forEach((a,k)=>a.classList.toggle('on',k<lit));
      if(c.out){ c.out.innerHTML = opts.out[i]||''; c.out.style.visibility = opts.out[i]?'visible':'hidden'; }
    }};
}

/* ---------- builder 2: trace table (rows revealed one per step) ---------- */
function trace(title, cols, rows, caps, opts={}){
  return { title, caps,
    build(stage){
      const wrap=h('div',{class:'trwrap'});
      if(opts.pre) wrap.append(h('div',{class:'fx'},opts.pre));
      const tb=h('table',{class:'sheet trace'});
      tb.innerHTML=`<thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>`;
      const sc=h('div',{class:'tblscroll'}); sc.append(tb); wrap.append(sc);
      if(opts.post) wrap.append(h('div',{class:'fx post'},opts.post));
      stage.append(wrap); return {trs:[...tb.querySelectorAll('tbody tr')], post:wrap.querySelector('.post'), sc};
    },
    show(c,i){
      const shown = opts.map ? opts.map[i] : i;     // rows visible
      c.trs.forEach((r,k)=>{ r.classList.toggle('hid', k>=shown); r.classList.toggle('on', k===shown-1); });
      if(c.post) c.post.style.visibility = i===caps.length-1 ? 'visible':'hidden';
      const cur=c.trs[shown-1]; if(cur && c.sc.scrollHeight>c.sc.clientHeight) c.sc.scrollTop = Math.max(0, cur.offsetTop - c.sc.clientHeight/2);
    }};
}

/* ---------- builder 3: token stream over source text ---------- */
function tokens(title, src, toks, caps, opts={}){
  // toks: [start, end, tokenHTML]; step k (k>=1) highlights toks up to opts.map? or k-1
  return { title, caps,
    build(stage){
      const wrap=h('div',{class:'tokwrap'});
      const line=h('div',{class:'srcline'});
      let html='', p=0; toks.forEach((t,k)=>{ if(t[0]>p) html+=esc(src.slice(p,t[0])); html+=`<span class="lx" data-k="${k}">${esc(src.slice(t[0],t[1]))}</span>`; p=t[1]; }); html+=esc(src.slice(p));
      line.innerHTML=html; const chips=h('div',{class:'chips'});
      toks.forEach((t,k)=>chips.append(h('span',{class:'chipt hid','data-k':k},t[2])));
      wrap.append(line, chips); stage.append(wrap);
      return {lx:[...line.querySelectorAll('.lx')], ch:[...chips.children]};
    },
    show(c,i){
      const upto = opts.map ? opts.map[i] : i;   // number of tokens emitted
      c.lx.forEach((e,k)=>{ e.classList.toggle('done',k<upto-1); e.classList.toggle('on',k===upto-1); });
      c.ch.forEach((e,k)=>{ e.classList.toggle('hid',k>=upto); e.classList.toggle('on',k===upto-1); });
    }};
}

/* ---------- builder 4: tree (SVG) ---------- */
// nodes: {id,l,x,y,p (parent id), s (show step), e (hide step), a (annotation), as (annotation step), c (class)}
function tree(title, nodes, caps, opts={}){
  const W=opts.w||760, H=opts.h||330;
  return { title, caps,
    build(stage){
      const byId={}; nodes.forEach(n=>byId[n.id]=n);
      stage.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
        ${nodes.filter(n=>n.p!=null).map(n=>{const p=byId[n.p]; return `<line class="ln tre" data-id="${n.id}" x1="${p.x}" y1="${p.y+14}" x2="${n.x}" y2="${n.y-16}"/>`}).join('')}
        ${nodes.map(n=>`<g class="tn ${n.c||''}" data-id="${n.id}"><rect class="box" x="${n.x-(n.wd||Math.max(26,String(n.l).length*8+14))/2}" y="${n.y-16}" width="${n.wd||Math.max(26,String(n.l).length*8+14)}" height="30" rx="9"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" font-size="15" font-weight="600">${n.l}</text>${n.a?`<text class="ann" x="${n.x}" y="${n.y+(n.ay||-22)}" text-anchor="middle" font-size="13">${n.a}</text>`:''}</g>`).join('')}
        ${opts.extra||''}
      </svg>`;
      return {g:[...stage.querySelectorAll('g.tn')], l:[...stage.querySelectorAll('line.tre')], ex:[...stage.querySelectorAll('[data-s]')]};
    },
    show(c,i){
      const vis=n=> (n.s||0)<=i && (n.e==null || i<n.e);
      const map={}; nodes.forEach(n=>map[n.id]=n);
      c.g.forEach(g=>{ const n=map[g.dataset.id]; if(!n) return; g.classList.toggle('hid',!vis(n)); g.classList.toggle('on',(n.s||0)===i && i>0 || (opts.hl&&opts.hl[i]&&opts.hl[i].includes(n.id))); const an=g.querySelector('.ann'); if(an) an.classList.toggle('hid', i < (n.as==null?0:n.as)); });
      c.l.forEach(l=>{ const n=map[l.dataset.id]; if(!n) return; l.classList.toggle('hid',!vis(n)); });
      c.ex.forEach(e=>e.classList.toggle('hid', i < +e.dataset.s || (e.dataset.e && i>=+e.dataset.e)));
    }};
}

/* ---------- builder 5: state graph (automata) with optional input tape ---------- */
// st: [id,x,y,final?]; ed: [from,to,label,curve(-1..1)|'loop']; act[i]: {s:[active states], e:[edge idx], pos:tape index, vis: number of states/edges visible (optional), msg}
function graph(title, st, ed, caps, act, opts={}){
  const W=opts.w||760, H=opts.h||250;
  return { title, caps,
    build(stage){
      const P={}; st.forEach(s=>P[s[0]]=s);
      const edge=(e,k)=>{ const a=P[e[0]], b=P[e[1]]; const r=22;
        if(e[3]==='loop'){ return `<g class="ed" data-k="${k}"><path class="ln" d="M${a[1]-10} ${a[2]-r} C${a[1]-30} ${a[2]-70} ${a[1]+30} ${a[2]-70} ${a[1]+10} ${a[2]-r}" marker-end="url(#ah)"/><text x="${a[1]}" y="${a[2]-62}" text-anchor="middle" font-size="14">${e[2]}</text></g>`; }
        const dx=b[1]-a[1], dy=b[2]-a[2], L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
        const x1=a[1]+ux*r, y1=a[2]+uy*r, x2=b[1]-ux*(r+4), y2=b[2]-uy*(r+4);
        const cv=e[3]||0, mx=(x1+x2)/2 - uy*cv*L*0.35, my=(y1+y2)/2 + ux*cv*L*0.35;
        const lx=(x1+x2)/2 - uy*cv*L*0.18 - uy*12, ly=(y1+y2)/2 + ux*cv*L*0.18 + ux*12 + (cv?0:-2);
        return `<g class="ed" data-k="${k}"><path class="ln" d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" marker-end="url(#ah)"/><text x="${lx}" y="${ly}" text-anchor="middle" font-size="14">${e[2]}</text></g>`; };
      stage.innerHTML=`${opts.input!=null?`<div class="tape">${[...opts.input].map((ch,k)=>`<span data-k="${k}">${esc(ch)}</span>`).join('')}</div>`:''}
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ahd"/></marker></defs>
      <path class="ln start" d="M${st[0][1]-62} ${st[0][2]} H${st[0][1]-26}" marker-end="url(#ah)"/>
      ${ed.map(edge).join('')}
      ${st.map(s=>`<g class="st" data-id="${s[0]}"><circle class="box" cx="${s[1]}" cy="${s[2]}" r="22"/>${s[3]?`<circle class="box dbl" cx="${s[1]}" cy="${s[2]}" r="17"/>`:''}<text x="${s[1]}" y="${s[2]+5}" text-anchor="middle" font-size="${String(s[0]).length>2?12:15}" font-weight="700">${s[0]}</text>${s[4]?`<text x="${s[1]}" y="${s[2]+40}" text-anchor="middle" font-size="12" class="sub">${s[4]}</text>`:''}</g>`).join('')}
      </svg>${opts.out?'<div class="fx outbox"></div>':''}`;
      return {st:[...stage.querySelectorAll('g.st')], ed:[...stage.querySelectorAll('g.ed')], tp:[...stage.querySelectorAll('.tape span')], out:stage.querySelector('.outbox')};
    },
    show(c,i){
      const a=act[i]||{};
      c.st.forEach((g,k)=>{ g.classList.toggle('on',(a.s||[]).map(String).includes(g.dataset.id)); g.classList.toggle('hid', a.vs!=null && k>=a.vs); });
      c.ed.forEach((g,k)=>{ g.classList.toggle('on',(a.e||[]).includes(k)); g.querySelector('.ln').classList.toggle('on',(a.e||[]).includes(k)); g.classList.toggle('hid', a.ve!=null && k>=a.ve); });
      c.tp.forEach((t,k)=>{ t.classList.toggle('on',k===a.pos); t.classList.toggle('done',a.pos!=null&&k<a.pos); });
      if(c.out){ c.out.innerHTML=a.msg||''; c.out.style.visibility=a.msg?'visible':'hidden'; }
    }};
}

/* ---------- builder 6: code walk (highlight lines, side panel) ---------- */
function codewalk(title, lines, caps, hl, side){
  return { title, caps,
    build(stage){
      const w=h('div',{class:'cw'}); const pre=h('pre',{class:'code cwc'});
      pre.innerHTML=lines.map((l,k)=>`<span class="cl" data-k="${k}">${esc(l)||' '}</span>`).join('\n');
      w.append(pre); let sd=null; if(side){ sd=h('div',{class:'cwside fx'}); w.append(sd); }
      stage.append(w); return {ls:[...pre.querySelectorAll('.cl')], sd};
    },
    show(c,i){
      const on=hl[i]||[]; c.ls.forEach((l,k)=>{ l.classList.toggle('on',on.includes(k)); l.classList.toggle('dim', side==='reveal' ? false : false); });
      if(c.sd){ c.sd.innerHTML=(typeof side==='function'?side(i):side[i])||''; }
    }};
}

/* ---------- builder 7: tape with pointers (input buffering) ---------- */
function tape(title, cells, caps, ptrs){
  return { title, caps,
    build(stage){
      const w=h('div',{class:'bufwrap'});
      const row=h('div',{class:'buf'}); cells.forEach((ch,k)=>row.append(h('span',{class:ch==='eof'?'eof':''},esc(ch))));
      const pr=h('div',{class:'ptrs'}); pr.innerHTML='<i class="pb">lexemeBegin ▲</i><i class="pf">▲ forward</i>';
      const out=h('div',{class:'fx outbox'});
      w.append(row,pr,out); stage.append(w); return {cs:[...row.children], pb:pr.children[0], pf:pr.children[1], out};
    },
    show(c,i){
      const [b,f,msg]=ptrs[i]; const cw=c.cs[0].offsetWidth||34, gap=4;
      c.cs.forEach((e,k)=>{ e.classList.toggle('lex',k>=b && k<f); e.classList.toggle('on',k===f); });
      c.pb.style.left=(b*(cw+gap))+'px'; c.pf.style.left=(f*(cw+gap))+'px';
      c.out.innerHTML=msg||''; c.out.style.visibility=msg?'visible':'hidden';
    }};
}

/* =====================================================================
   WEEK 1 — Introduction, organization, phases
   ===================================================================== */
D.translate = flow('What a translator does',
  [['👩‍💻','Source program','sum = a + b;'],['⚙️','Translator','compiler / interpreter'],['🖥️','Machine action','CPU instructions']],
  ['Programs are written for <b>people</b>; CPUs only understand <b>machine code</b>. Something must translate.',
   'You write a <b>source program</b> in a high-level language such as C, Java or Python.',
   'A <b>translator</b> reads it, checks it for errors and converts it.',
   'The result runs on real hardware: loads, adds, stores — <b>machine actions</b>.'],
  {out:['','<code>sum = a + b;</code>','<code>LOAD a → R1 · ADD b → R1 · STORE R1 → sum</code>','<code>10110000 01100001 …</code> (bits the CPU executes)']});

D.compint = { title:'Compiler vs interpreter — same program, two strategies', caps:[
  'Both start from the same source program: <code>for i in 1..3: print(i*i)</code>.',
  '<b>Compiler:</b> translates the <i>whole</i> program first, producing a target program (e.g., an .exe).',
  'The target program then runs <b>many times</b> on its own, fast, without the compiler.',
  '<b>Interpreter:</b> reads one statement, executes it, then moves to the next — no separate target file.',
  'Errors: a compiler reports them <b>before</b> running; an interpreter stops when it <b>reaches</b> the bad line.',
  'Hybrid: Java compiles to <b>bytecode</b>, then the JVM interprets it and JIT-compiles the hot parts.'],
  build(s){
    s.innerHTML=`<div class="cmpdemo"><div class="lane" id="lc"><b>Compiler</b><div class="row"><div class="tile">📄<small>source</small></div><span class="arrow">➜</span><div class="tile">⚙️<small>compile all</small></div><span class="arrow">➜</span><div class="tile">📦<small>target .exe</small></div><span class="arrow">➜</span><div class="tile">▶️<small>run × many</small></div></div></div>
    <div class="lane" id="li"><b>Interpreter</b><div class="row"><div class="tile">📄<small>source</small></div><span class="arrow">➜</span><div class="tile">🔁<small>read 1 stmt</small></div><span class="arrow">➜</span><div class="tile">▶️<small>execute it</small></div><span class="arrow">➜</span><div class="tile">↩️<small>next stmt</small></div></div></div></div>`;
    return {c:[...s.querySelectorAll('#lc .tile')], it:[...s.querySelectorAll('#li .tile')]};
  },
  show(x,i){
    const cOn = {0:[0],1:[0,1,2],2:[3],3:[],4:[1],5:[2]}[i]||[], iOn={0:[0],3:[1,2,3],4:[2],5:[1,2]}[i]||[];
    x.c.forEach((t,k)=>t.classList.toggle('on',cOn.includes(k))); x.it.forEach((t,k)=>t.classList.toggle('on',iOn.includes(k)));
    x.c.forEach(t=>t.classList.toggle('bad', i===4 && t===x.c[1])); x.it.forEach(t=>t.classList.toggle('bad', i===4 && t===x.it[2]));
  }};

D.lps = flow('The language-processing system',
  [['📝','Source','prog.c'],['🧹','Pre-processor','#include, #define'],['⚙️','Compiler','→ assembly'],['🔤','Assembler','→ object .o'],['🔗','Linker','+ libraries'],['🚚','Loader','→ memory'],['🖥️','Run','CPU executes']],
  ['A compiler never works alone. Follow <code>prog.c</code> from file to running program.',
   '<b>Source program</b> written by the programmer, with macros and #include lines.',
   '<b>Pre-processor:</b> expands macros (<code>#define PI 3.14</code>) and pastes header files. Output: pure C.',
   '<b>Compiler:</b> translates the C code into <b>assembly language</b> for the target CPU.',
   '<b>Assembler:</b> converts assembly mnemonics into <b>relocatable machine code</b> (object file).',
   '<b>Linker (link editor):</b> joins object files and library code (e.g. <code>printf</code>) and resolves external addresses.',
   '<b>Loader:</b> places the executable in memory, fixes relocatable addresses and starts it.',
   'The CPU now runs the <b>absolute machine code</b>.']);

D.pipeline = flow('One statement through all compiler phases',
  [['🔤','Lexical','tokens'],['🌳','Syntax','parse tree'],['🧐','Semantic','types checked'],['🧾','Intermediate','3-address code'],['🚀','Optimizer','better IR'],['🖥️','Code gen','assembly']],
  ['Input: <code>position = initial + rate * 60</code>. Every phase transforms the program a little.',
   '<b>Lexical analysis</b> groups characters into tokens and enters names in the symbol table.',
   '<b>Syntax analysis</b> builds a tree that shows the grammatical structure (* binds tighter than +).',
   '<b>Semantic analysis</b> checks types: rate is float, 60 is int → insert <code>inttofloat</code>.',
   '<b>Intermediate code generation</b> produces simple, machine-independent three-address code.',
   '<b>Code optimization</b> removes waste: the conversion is done at compile time, temporaries are reduced.',
   '<b>Code generation</b> maps the IR to registers and machine instructions.'],
  {out:['<code>position = initial + rate * 60</code>',
   '<code>⟨id,1⟩ ⟨=⟩ ⟨id,2⟩ ⟨+⟩ ⟨id,3⟩ ⟨*⟩ ⟨60⟩</code>',
   '<code>= ( id1 , + ( id2 , * ( id3 , 60 ) ) )</code>',
   '<code>= ( id1 , + ( id2 , * ( id3 , inttofloat(60) ) ) )</code>',
   '<code>t1 = inttofloat(60) · t2 = id3 * t1 · t3 = id2 + t2 · id1 = t3</code>',
   '<code>t1 = id3 * 60.0 · id1 = id2 + t1</code>',
   '<code>LDF R2, id3 · MULF R2, R2, #60.0 · LDF R1, id2 · ADDF R1, R1, R2 · STF id1, R1</code>']});

D.frontback = { title:'Front end + back end: why compilers are split', caps:[
  'Suppose we support <b>3 languages</b> (C, Java, Rust) on <b>3 machines</b> (x86, ARM, RISC-V).',
  'Without a shared intermediate form we need a full compiler for every pair: <b>3 × 3 = 9</b> compilers.',
  'With an <b>intermediate representation (IR)</b>, each language needs one <b>front end</b> (analysis)…',
  '…and each machine needs one <b>back end</b> (synthesis). Total: <b>3 + 3 = 6</b> components.',
  'Front end = lexical, syntax, semantic analysis, IR generation (depends on the <b>source language</b>). Back end = optimization and code generation (depends on the <b>target machine</b>). Real example: LLVM, GCC.'],
  build(s){
    const L=['C','Java','Rust'], M=['x86','ARM','RISC-V'];
    s.innerHTML=`<svg viewBox="0 0 760 270" role="img" aria-label="Front end and back end diagram">
      ${L.map((l,a)=>M.map((m,b)=>`<path class="ln mx" d="M150 ${50+a*85} L610 ${50+b*85}"/>`).join('')).join('')}
      ${L.map((l,a)=>`<path class="ln ir1" d="M150 ${50+a*85} L360 135"/>`).join('')}
      ${M.map((m,b)=>`<path class="ln ir2" d="M400 135 L610 ${50+b*85}"/>`).join('')}
      ${L.map((l,a)=>`<g class="nd fe"><rect class="box" x="40" y="${28+a*85}" width="110" height="44" rx="12"/><text x="95" y="${55+a*85}" text-anchor="middle" font-size="16">${l}</text></g>`).join('')}
      ${M.map((m,b)=>`<g class="nd be"><rect class="box" x="610" y="${28+b*85}" width="110" height="44" rx="12"/><text x="665" y="${55+b*85}" text-anchor="middle" font-size="16">${m}</text></g>`).join('')}
      <g class="nd irn"><rect class="box" x="340" y="110" width="80" height="50" rx="12"/><text x="380" y="141" text-anchor="middle" font-size="18" font-weight="700">IR</text></g>
      <text class="cnt" x="380" y="262" text-anchor="middle" font-size="18" font-weight="700"></text></svg>`;
    return {mx:[...s.querySelectorAll('.mx')], i1:[...s.querySelectorAll('.ir1')], i2:[...s.querySelectorAll('.ir2')], fe:[...s.querySelectorAll('.fe')], be:[...s.querySelectorAll('.be')], ir:s.querySelector('.irn'), cnt:s.querySelector('.cnt')};
  },
  show(c,i){
    c.mx.forEach(l=>{ l.classList.toggle('hid', i!==1); l.classList.toggle('on', i===1); });
    c.i1.forEach(l=>{ l.classList.toggle('hid', i<2); l.classList.toggle('on', i===2||i===4); });
    c.i2.forEach(l=>{ l.classList.toggle('hid', i<3); l.classList.toggle('on', i===3||i===4); });
    c.ir.classList.toggle('hid', i<2); c.ir.classList.toggle('on', i>=2);
    c.fe.forEach(g=>g.classList.toggle('on', i===2||i===4)); c.be.forEach(g=>g.classList.toggle('on', i===3||i===4));
    c.cnt.textContent = i===1?'9 compilers': i>=3?'6 components (3 front ends + 3 back ends)':'';
  }};

D.analysisSynthesis = flow('Analysis and synthesis',
  [['🔍','Analysis','break up & check'],['🧾','IR + symbol table','meaning captured'],['🏗️','Synthesis','build target']],
  ['Every compiler has two big parts.',
   '<b>Analysis (front end):</b> breaks the source into pieces, imposes grammatical structure and reports errors.',
   'The analysis stores what it learned in the <b>intermediate representation</b> and the <b>symbol table</b>.',
   '<b>Synthesis (back end):</b> constructs the target program from the IR and the symbol table.']);

D.symflow = flow('All phases share the symbol table',
  [['🔤','Lexer','inserts names'],['🌳','Parser','reads'],['🧐','Semantic','adds types'],['🧾','IR gen','looks up'],['🖥️','Code gen','uses addresses'],['📒','Symbol table','name · type · scope · address']],
  ['The <b>symbol table</b> is a data structure that every phase uses.',
   'The <b>lexer</b> sees <code>rate</code> for the first time and creates an entry (or finds the existing one).',
   'The <b>parser</b> uses entries to build declarations and expressions.',
   'The <b>semantic analyzer</b> records and checks types: <code>rate : float</code>.',
   'The <b>IR generator</b> refers to variables by their symbol-table entries.',
   'The <b>code generator</b> needs storage size and memory address for each name.',
   'One record per name: <b>lexeme, type, scope, size, address, line declared</b>.']);

D.errorsPhases = trace('Which phase catches which error?',
  ['Code','Error','Caught by'],
  [['<code>int 9x;</code>','9x is not a valid identifier (num then id)','Lexical / Syntax'],
   ['<code>x = 5 @ 3;</code>','@ is not a symbol of C','Lexical'],
   ['<code>if (x > 5 { y = 1; }</code>','missing )','Syntax'],
   ['<code>int x = "hello";</code>','type mismatch','Semantic'],
   ['<code>y = z + 1;</code> (z never declared)','undeclared identifier','Semantic'],
   ['<code>a[10]</code> when a has 10 elements','index out of range','Run time (not compiler)']],
  ['Each phase detects its own kind of error. Step through the examples.',
   'Strange characters or malformed numbers are found while forming tokens.',
   '<b>Lexical:</b> the scanner cannot form a token from <code>@</code>.',
   '<b>Syntax:</b> the tokens are valid but do not fit the grammar.',
   '<b>Semantic:</b> the structure is fine but the meaning is wrong.',
   '<b>Semantic:</b> declaration-before-use is checked with the symbol table.',
   'Some errors can only be caught when the program <b>runs</b>.']);

/* =====================================================================
   WEEK 2 — Lexical analysis
   ===================================================================== */
D.lexrole = flow('Lexer and parser work together',
  [['📄','Source text','characters'],['🔤','Lexical analyzer','getNextToken()'],['🌳','Parser','asks for tokens'],['📒','Symbol table','ids stored']],
  ['The lexer is the <b>first phase</b>. It is usually a subroutine the parser calls.',
   'It reads the source <b>character by character</b>.',
   'It groups characters into <b>lexemes</b> and returns a <b>token</b> each time the parser calls <code>getNextToken()</code>. It also strips spaces and comments and counts lines.',
   'The parser receives tokens like <code>⟨id, 3⟩</code> and checks the grammar.',
   'For identifiers, the lexer enters the lexeme in the <b>symbol table</b>; the token carries a pointer to it.']);

D.tokenize = tokens('Scanning one statement into tokens', 'position = initial + rate * 60 ;',
  [[0,8,'⟨id, 1⟩'],[9,10,'⟨=⟩'],[11,18,'⟨id, 2⟩'],[19,20,'⟨+⟩'],[21,25,'⟨id, 3⟩'],[26,27,'⟨*⟩'],[28,30,'⟨num, 60⟩'],[31,32,'⟨;⟩']],
  ['The lexer reads <code>position = initial + rate * 60 ;</code> from left to right. Blanks are skipped.',
   'Lexeme <b>position</b> matches the identifier pattern → token <code>⟨id, 1⟩</code> (1 = symbol-table entry).',
   'Lexeme <b>=</b> → assignment token. No attribute needed.',
   'Lexeme <b>initial</b> → <code>⟨id, 2⟩</code>, a new symbol-table entry.',
   'Lexeme <b>+</b> → token <code>⟨+⟩</code>.',
   'Lexeme <b>rate</b> → <code>⟨id, 3⟩</code>.',
   'Lexeme <b>*</b> → token <code>⟨*⟩</code>.',
   'Lexeme <b>60</b> matches the number pattern → <code>⟨num, 60⟩</code>; attribute = its value.',
   'Lexeme <b>;</b> → end of statement. 8 tokens are sent to the parser.']);

D.tpl = trace('Token · Pattern · Lexeme',
  ['Token','Informal pattern','Sample lexemes'],
  [['<code>if</code>','the characters i, f','if'],['<code>else</code>','e, l, s, e','else'],['<code>comparison</code>','&lt; or &gt; or &lt;= or &gt;= or == or !=','&lt;=, !='],['<code>id</code>','letter followed by letters and digits','pi, score, D2'],['<code>number</code>','any numeric constant','3.14159, 0, 6.02e23'],['<code>literal</code>','anything between " and "','"core dumped"']],
  ['A <b>token</b> is a name (category); a <b>pattern</b> describes its lexemes; a <b>lexeme</b> is the actual text.',
   'Keywords each get their own token.','…one token per keyword.','Several operators can share one token, with an attribute telling which one.',
   'All identifiers share the token <b>id</b>; the attribute says which identifier.','All numbers share the token <b>number</b>.','String literals are one token.']);

D.buffer = tape('Two-buffer input scheme with sentinels',
  ['E',' ','=',' ','M',' ','*','eof','C',' ','*','*','2','eof'],
  ['Reading one character at a time from disk is slow, so the lexer reads <b>blocks</b> into two buffer halves (N chars each). Each half ends with a sentinel <b>eof</b>.',
   '<b>lexemeBegin</b> marks the start of the current lexeme; <b>forward</b> scans ahead.',
   '<b>forward</b> moves over <code>E</code>; the next char is a blank, so the lexeme <b>E</b> is complete → token id.',
   'Both pointers jump past the blank. <code>=</code> is a single-character token.',
   'Lexeme <b>M</b> recognised.',
   '<code>*</code> read — but it might be the start of <code>**</code>, so forward must look one more char ahead.',
   '<b>forward</b> hits the sentinel <b>eof</b> at the end of the first half → reload the second half and continue. Only <b>one test</b> per character is needed.',
   'Lexeme <b>C</b> is in the second half. The scanner continues; a real eof (not at the end of a half) ends the input.'],
  [[0,0],[0,0,'lexemeBegin = forward = 0'],[0,1,'lexeme = "E" → ⟨id⟩'],[2,3,'lexeme = "=" → ⟨assign⟩'],[4,5,'lexeme = "M" → ⟨id⟩'],[6,7,'lexeme = "*" … lookahead needed'],[6,7,'sentinel eof → load second buffer half'],[8,9,'lexeme = "C" → ⟨id⟩']]);

D.regex = trace('Regular definitions for numbers',
  ['Name','Regular expression','Matches'],
  [['digit','0 | 1 | … | 9','7'],['digits','digit digit*','2026'],['optFraction','. digits | ε','.75 or nothing'],['optExponent','( E ( + | - | ε ) digits ) | ε','E+3, E-2, nothing'],['number','digits optFraction optExponent','12 · 3.14 · 6.02E23 · 1E-9']],
  ['A <b>regular definition</b> gives names to regular expressions and reuses them.',
   '<b>digit</b> is any one of 0–9.','<b>digits</b> = one or more digits (Kleene <code>*</code> = zero or more, so we write digit digit*).',
   'An optional fraction: a dot followed by digits, or nothing (ε).','An optional exponent with an optional sign.',
   'Putting it together: <b>number</b> matches integers, decimals and scientific notation. It does <b>not</b> match <code>.5</code> or <code>5.</code> — check why!']);

D.reops = trace('Regular-expression operators on Σ = {a, b}',
  ['Regular expression','Language it denotes'],
  [['a | b','{a, b}'],['(a | b)(a | b)','{aa, ab, ba, bb}'],['a*','{ε, a, aa, aaa, …}'],['(a | b)*','all strings of a’s and b’s, including ε'],['a | a*b','{a, b, ab, aab, aaab, …}'],['(a|b)*abb','strings ending in abb']],
  ['Three operations build every regular expression: <b>union</b> |, <b>concatenation</b>, <b>Kleene closure</b> *.',
   'Union: either a or b.','Concatenation: one symbol, then another.','Closure: zero or more repetitions.','Any string over {a, b}.','Precedence: * highest, then concatenation, then |.','The pattern used in the next lectures to build automata.']);

D.lexerr = trace('Lexical errors and panic-mode recovery',
  ['Input','Problem','Recovery action'],
  [['<code>total = price # 2;</code>','# cannot start any token','delete # and continue'],['<code>s = "hello;</code>','string never closed','report "unterminated string" at end of line'],['<code>x = 12.5.3;</code>','malformed number','report; skip to next delimiter'],['<code>fi (a == b)</code>','fi is a valid id!','not a lexical error — the parser will catch it'],['<code>whi1e (x)</code>','typo of while','lexer sees id; parser or semantic phase reports']],
  ['The lexer has a <b>local view</b>: it sees characters, not meaning.',
   'Panic mode: delete characters until a well-formed token can be found.',
   'Other repairs: insert a missing char, replace one char, transpose two adjacent chars.',
   'Some malformed lexemes can be reported precisely.',
   'The lexer cannot tell that <code>fi</code> should be <code>if</code>.',
   'Most "spelling" mistakes become syntax or semantic errors later.']);

/* =====================================================================
   WEEK 3 — Finite automata
   ===================================================================== */
D.dfarun = graph('DFA for (a|b)*abb running on "aabb"',
  [[0,120,130],[1,300,130],[2,480,130],[3,660,130,true]],
  [[0,0,'b','loop'],[0,1,'a',0],[1,1,'a','loop'],[1,2,'b',0],[2,1,'a',0.5],[2,3,'b',0],[3,1,'a',0.6],[3,0,'b',-0.45]],
  ['A <b>DFA</b> has exactly one transition per state per symbol. Start = 0, accepting = 3 (double circle).',
   'Read <b>a</b>: 0 → 1.','Read <b>a</b>: 1 → 1 (stay).','Read <b>b</b>: 1 → 2.','Read <b>b</b>: 2 → 3.','Input finished in state 3 (accepting) → <b>"aabb" is accepted</b>. The DFA is O(n): one move per character.'],
  [{s:[0]},{s:[1],e:[1],pos:0},{s:[1],e:[2],pos:1},{s:[2],e:[3],pos:2},{s:[3],e:[5],pos:3},{s:[3],msg:'✔ ACCEPT'}],
  {input:'aabb', out:true, h:230});

D.nfa = graph('NFA vs DFA',
  [[0,140,130],[1,320,130],[2,500,130],[3,680,130,true]],
  [[0,0,'a, b','loop'],[0,1,'a',0],[1,2,'b',0],[2,3,'b',0]],
  ['An <b>NFA</b> for <code>(a|b)*abb</code> with only 4 states.',
   'From state 0 on <b>a</b> there are <b>two</b> choices: stay in 0 or go to 1. That is non-determinism.',
   'The NFA accepts if <b>any</b> path reaches an accepting state.',
   'An NFA may also have <b>ε-moves</b> (moves without reading input). A DFA has neither ε-moves nor choices — easy to run, but may need more states.'],
  [{s:[0]},{s:[0,1],e:[0,1]},{s:[3],e:[2,3]},{s:[0,1,2,3]}], {h:220});

D.thompson = graph('Thompson’s construction for (a|b)*abb',
  [[0,40,140],[1,115,140],[2,190,70],[3,265,70],[4,190,210],[5,265,210],[6,340,140],[7,430,140],[8,520,140],[9,610,140],[10,710,140,true]],
  [[2,3,'a',0],[4,5,'b',0],[1,2,'ε',0],[1,4,'ε',0],[3,6,'ε',0],[5,6,'ε',0],[6,1,'ε',0.9],[0,1,'ε',0],[0,7,'ε',-0.55],[6,7,'ε',0],[7,8,'a',0],[8,9,'b',0],[9,10,'b',0]],
  ['Thompson’s construction builds an NFA from a regular expression <b>piece by piece</b>.',
   'Basis: one NFA for symbol <b>a</b> (2→3) and one for <b>b</b> (4→5).',
   'Union <b>a|b</b>: new start 1 with ε-moves into both, new end 6 with ε-moves out of both.',
   'Closure <b>(a|b)*</b>: new start 0 and ε-edges for "repeat" (6→1) and "skip" (0→7).',
   'Concatenate <b>a</b>, <b>b</b>, <b>b</b>: 7→8→9→10. Accepting state = 10.',
   'Result: 11 states, ≤ 2 edges per state, one start, one accepting state — ready for subset construction.'],
  [{vs:0,ve:0},{vs:6,ve:2,s:[2,3,4,5]},{vs:7,ve:6,s:[1,6]},{vs:8,ve:10,s:[0,7]},{vs:11,ve:13,s:[7,8,9,10]},{s:[0,10]}],
  {w:760,h:270});

D.subset = trace('Subset construction: NFA → DFA for (a|b)*abb',
  ['DFA state','NFA states (ε-closure)','on a','on b'],
  [['A','{0,1,2,4,7}','B','C'],['B','{1,2,3,4,6,7,8}','B','D'],['C','{1,2,4,5,6,7}','B','C'],['D','{1,2,4,5,6,7,9}','B','E'],['E ✔','{1,2,4,5,6,7,10}','B','C']],
  ['Each DFA state = a <b>set</b> of NFA states. Start with A = ε-closure({0}).',
   'A = {0,1,2,4,7}. move(A,a) = {3,8} → ε-closure = {1,2,3,4,6,7,8} = <b>B</b>. move(A,b) = {5} → closure = <b>C</b>.',
   'B on a → B again; B on b: move = {5,9} → closure = <b>D</b>.',
   'C on a → B; C on b → C.',
   'D on b: move = {5,10} → closure = <b>E</b>.',
   'E contains NFA state 10 (accepting) → <b>E is accepting</b>. No new states: done. 5 DFA states (C can be merged with A when minimised → 4).']);

D.relop = graph('Transition diagram for relop',
  [[0,90,130],[1,250,50,false,''],[2,420,20,true,'LE'],[3,420,80,true,'NE'],[4,420,140,true,'LT *'],[5,250,150,true,'EQ'],[6,250,230],[7,420,200,true,'GE'],[8,420,260,true,'GT *']],
  [[0,1,'<',0],[1,2,'=',0],[1,3,'>',0],[1,4,'other',0],[0,5,'=',0],[0,6,'>',0],[6,7,'=',0],[6,8,'other',0]],
  ['A <b>transition diagram</b> is a flowchart of the scanner. This one recognises relational operators.',
   'Input <b>&lt;=</b>: read <code>&lt;</code> → state 1.','Read <code>=</code> → state 2: return ⟨relop, LE⟩.',
   'Input <b>&lt;x</b>: in state 1 the next char is <i>other</i> → state 4. The * means <b>retract</b> forward by one: x belongs to the next token. Return ⟨relop, LT⟩.',
   'Input <b>&gt;=</b>: 0 → 6 → 7: ⟨relop, GE⟩.'],
  [{s:[0]},{s:[1],e:[0]},{s:[2],e:[1],msg:'return(relop, LE)'},{s:[4],e:[0,3],msg:'retract(); return(relop, LT)'},{s:[7],e:[5,6],msg:'return(relop, GE)'}],
  {h:300,out:true});

D.idtd = graph('Transition diagram for identifiers and keywords',
  [[9,160,120],[10,380,120],[11,600,120,true,'*']],
  [[9,10,'letter',0],[10,10,'letter | digit','loop'],[10,11,'other',0]],
  ['Identifiers: a <b>letter</b>, then any number of letters or digits.',
   'Read <code>c</code> (letter) → state 10.','Read <code>o u n t 1</code> → stay in 10.',
   'Read a blank (<i>other</i>) → state 11; retract; lexeme = <b>count1</b>.',
   'Return <code>getToken(installID())</code>: look up the lexeme — a reserved word or an id?'],
  [{s:[9]},{s:[10],e:[0]},{s:[10],e:[1]},{s:[11],e:[2],msg:'lexeme = "count1"'},{s:[11],msg:'installID() → ⟨id, ptr⟩'}],
  {h:200,out:true});

D.kwid = trace('Reserved word or identifier?',
  ['Lexeme','Found in reserved-word table?','Token returned'],
  [['if','yes','⟨IF⟩'],['iffy','no','⟨id, →iffy⟩'],['while','yes','⟨WHILE⟩'],['While','no (case-sensitive)','⟨id, →While⟩'],['count1','no','⟨id, →count1⟩'],['_tmp','no','⟨id, →_tmp⟩']],
  ['Method 1 (simplest): put keywords in the symbol table <b>first</b>, marked as reserved. The identifier diagram handles both.',
   '<b>if</b> is pre-installed as a keyword.','<b>iffy</b> is longer — longest match wins; it is an id.','<b>while</b> → keyword.','C is case-sensitive: <b>While</b> is an identifier.','Normal identifier.','Method 2: a separate transition diagram for each keyword, with priority over id.']);

D.lexgen = flow('Lexical-analyzer generator (Lex / Flex)',
  [['📜','lex.l','patterns + actions'],['🏭','Lex compiler','RE → NFA → DFA'],['📄','lex.yy.c','table + driver'],['⚙️','C compiler','gcc'],['🤖','a.out','the scanner'],['🔤','Tokens','to the parser']],
  ['Instead of hand-coding, we can <b>generate</b> a scanner from regular expressions.',
   'Write <code>lex.l</code>: declarations, <b>pattern { action }</b> rules, user functions.',
   'Lex converts every pattern into an NFA, combines them, and converts to a minimised <b>DFA</b>.',
   'Output: <code>lex.yy.c</code> — the transition table plus a fixed driver routine <code>yylex()</code>.',
   'Compile it like any C program.',
   'Run the scanner on an input stream…',
   '…and it returns tokens. Conflicts: <b>longest match</b> wins; on a tie, the <b>first rule</b> listed wins.']);

/* =====================================================================
   WEEK 4–5 — Implementing scanners, symbol table
   ===================================================================== */
D.handscan = codewalk('A hand-coded scanner (direct-coded)',
  ['Token getToken() {',
   '  skipWhitespaceAndComments();',
   '  lexemeBegin = forward;',
   '  char c = nextChar();',
   '  if (isLetter(c)) {',
   '    while (isLetterOrDigit(peek())) nextChar();',
   '    return lookupKeywordOrId(lexeme());',
   '  }',
   '  if (isDigit(c)) {',
   '    while (isDigit(peek())) nextChar();',
   '    return makeNum(lexeme());',
   '  }',
   '  if (c == \'<\') {',
   '    if (peek() == \'=\') { nextChar(); return LE; }',
   '    return LT;',
   '  }',
   '  ... // other operators',
   '  lexicalError(c);',
   '}'],
  ['A <b>hand-coded</b> scanner turns each transition diagram into ordinary <code>if</code> / <code>while</code> code.',
   'Input <code>  count1 &lt;= 42</code>. First skip blanks and comments.',
   'Mark the start of the lexeme and read the first char: <b>c</b>.',
   'It is a letter → loop while letters/digits follow. Lexeme = <b>count1</b>.',
   'Check the reserved-word table → return ⟨id⟩.',
   'Next call: <code>&lt;</code> → peek at the next char. It is <code>=</code> → return <b>LE</b>.',
   'Next call: <b>42</b> → digit loop → ⟨num, 42⟩.',
   'Anything unmatched → <b>lexical error</b>. Hand-coded scanners are fast and give good error messages, but are more work to change.'],
  [[],[1],[2,3],[4,5],[6],[12,13],[8,9,10],[17]],
  ['','input: <code>␣␣count1 &lt;= 42</code>','c = \'c\'','lexeme = "count1"','→ ⟨id, count1⟩','→ ⟨relop, LE⟩','→ ⟨num, 42⟩','→ error']);

D.tablescan = trace('Table-driven scanner: identifiers and integers',
  ['Step','State','Char','Class','δ(state, class)'],
  [['1','s0','x','letter','s1'],['2','s1','2','digit','s1'],['3','s1','=','other','accept id (retract)'],['4','s0','=','other','single-char token ='],['5','s0','4','digit','s2'],['6','s2','5','digit','s2'],['7','s2',';','other','accept num (retract)']],
  ['A <b>table-driven</b> scanner keeps the DFA in a 2-D array <code>δ[state][charClass]</code> and runs a small, fixed driver loop.',
   'Input <code>x2=45;</code>. Start in s0. <code>x</code> is class <i>letter</i> → s1.',
   '<code>2</code> is a digit; δ[s1][digit] = s1.',
   'δ[s1][other] → accepting: report <b>id "x2"</b>, push back <code>=</code>.',
   '<code>=</code> handled as a one-character token.',
   '<code>4</code> → s2 (number state).','<code>5</code> → s2.','<code>;</code> → accept <b>num 45</b>. Changing the language = changing the <b>table</b>, not the code.']);

D.scancompare = trace('Three ways to implement a scanner',
  ['','Hand-coded','Table-driven','Generated (Lex/Flex)'],
  [['How built','write if/while code yourself','DFA table + generic loop','tool builds table from REs'],['Speed','fastest (no table lookups)','good','good'],['Effort to write','high','medium','lowest'],['Easy to change?','hard','change the table','edit the RE'],['Error messages','best control','generic','generic'],['Used by','GCC, Clang, Go','teaching, small langs','many DSLs, tools']],
  ['Compare the three implementation strategies.','How each one is built.','Speed: direct code avoids table indexing.','Effort to write.','Maintenance.','Quality of error reporting.','Real production compilers (GCC, Clang) use <b>hand-written</b> scanners for speed and error quality.']);

D.symtab = trace('Symbol table as a hash table (h = sum of ASCII codes mod 7)',
  ['Operation','Hash','Bucket','Result'],
  [['insert x','120 mod 7 = 1','1','x : int'],['insert sum','341 mod 7 = 5','5','sum : float'],['insert i','105 mod 7 = 0','0','i : int'],['insert avg','318 mod 7 = 3','3','avg : float'],['insert z','122 mod 7 = 3','3','collision → chained after avg'],['lookup sum','5','5','found: float'],['lookup total','548 mod 7 = 2','2','not found → "undeclared"']],
  ['The symbol table must support fast <b>insert</b> and <b>lookup</b>. A hash table gives O(1) average time.',
   'Hash the lexeme to choose a bucket.','Each entry stores name, type, scope, size, address…','','','Two names in one bucket → <b>separate chaining</b> (a linked list).','Lookup hashes again and searches only one bucket.','A failed lookup lets the semantic phase report <b>use of an undeclared variable</b>.']);

D.scopes = trace('Nested scopes: a stack of symbol tables',
  ['Code','Scope stack (top on the right)','Action'],
  [['<code>int x;</code>','{x:int}','insert x in global'],['<code>{ int y;</code>','{x:int} {y:int}','enter block → push'],['<code>x = y;</code>','{x:int} {y:int}','x found in outer, y in inner'],['<code>{ float x;</code>','{x:int} {y:int} {x:float}','push; inner x hides outer x'],['<code>x = 1.5; }</code>','{x:int} {y:int}','x → float (nearest); pop'],['<code>x = 2; }</code>','{x:int}','x → int again; pop']],
  ['Block-structured languages allow the same name in different scopes. Use one table per scope.',
   'Global declaration.','Entering a block pushes a new table.','Lookup searches from the <b>innermost</b> table outward.','A new <code>x</code> in an inner block <b>shadows</b> the outer one.','Leaving the block pops its table.','The outer <code>x</code> is visible again. This is the <b>most-closely-nested rule</b>.']);

/* =====================================================================
   WEEK 5–6 — Grammars
   ===================================================================== */
D.parserrole = flow('Position of the parser',
  [['🔤','Lexer','token stream'],['🌳','Parser','checks grammar'],['🧾','Parse tree','structure'],['🧐','Rest of front end','semantics, IR']],
  ['The parser is the heart of the front end.',
   'It receives a stream of tokens from the lexer (<code>getNextToken</code>).',
   'It checks that the tokens can be generated by the <b>grammar</b>, and reports syntax errors clearly and recovers from them.',
   'It builds a <b>parse tree</b> (often implicitly, or an AST).',
   'The tree goes to semantic analysis and intermediate-code generation.']);

D.derive = trace('Leftmost derivation of id + id * id',
  ['Step','Sentential form','Production used'],
  [['1','<b>E</b>','start'],['2','<b>E</b> + T','E → E + T'],['3','<b>T</b> + T','E → T'],['4','<b>F</b> + T','T → F'],['5','id + <b>T</b>','F → id'],['6','id + <b>T</b> * F','T → T * F'],['7','id + <b>F</b> * F','T → F'],['8','id + id * <b>F</b>','F → id'],['9','id + id * id','F → id ✔']],
  ['Grammar: E → E + T | T, T → T * F | F, F → ( E ) | id. In a <b>leftmost derivation</b> we always replace the leftmost non-terminal (bold).',
   'Start with the start symbol E.','','','','','','','','The sentence is derived: id + id * id ∈ L(G).']);

D.parsetree = tree('Parse tree for id + id * id',
  [{id:'E',l:'E',x:380,y:30},{id:'E1',l:'E',x:200,y:100,p:'E',s:1},{id:'p',l:'+',x:380,y:100,p:'E',s:1},{id:'T',l:'T',x:560,y:100,p:'E',s:1},
   {id:'T1',l:'T',x:200,y:170,p:'E1',s:2},{id:'F1',l:'F',x:200,y:240,p:'T1',s:2},{id:'i1',l:'id',x:200,y:305,p:'F1',s:3,c:'leaf'},
   {id:'T2',l:'T',x:470,y:170,p:'T',s:4},{id:'m',l:'*',x:560,y:170,p:'T',s:4},{id:'F3',l:'F',x:650,y:170,p:'T',s:4},
   {id:'F2',l:'F',x:470,y:240,p:'T2',s:5},{id:'i2',l:'id',x:470,y:305,p:'F2',s:5,c:'leaf'},{id:'i3',l:'id',x:650,y:240,p:'F3',s:6,c:'leaf'}],
  ['A <b>parse tree</b> shows how the start symbol derives the string. Root = E.',
   'E → E + T: + is at the top, so it is applied <b>last</b>.','Left E → T → F.','F → id: first leaf.','Right T → T * F: * is lower in the tree, so it binds <b>tighter</b>.','T → F → id.','F → id. Reading the leaves left to right gives the <b>yield</b>: id + id * id.'],
  {h:330});

D.ambig = tree('Ambiguous grammar: two parse trees for id + id * id',
  [{id:'a',l:'E',x:190,y:30,s:1},{id:'a1',l:'E',x:90,y:95,p:'a',s:1},{id:'ap',l:'+',x:190,y:95,p:'a',s:1},{id:'a2',l:'E',x:290,y:95,p:'a',s:1},{id:'a11',l:'id',x:90,y:160,p:'a1',s:1,c:'leaf'},{id:'a21',l:'E',x:220,y:160,p:'a2',s:1},{id:'a22',l:'*',x:290,y:160,p:'a2',s:1},{id:'a23',l:'E',x:360,y:160,p:'a2',s:1},{id:'a211',l:'id',x:220,y:225,p:'a21',s:1,c:'leaf'},{id:'a231',l:'id',x:360,y:225,p:'a23',s:1,c:'leaf'},
   {id:'b',l:'E',x:570,y:30,s:2},{id:'b1',l:'E',x:470,y:95,p:'b',s:2},{id:'bm',l:'*',x:570,y:95,p:'b',s:2},{id:'b2',l:'E',x:670,y:95,p:'b',s:2},{id:'b11',l:'E',x:400,y:160,p:'b1',s:2},{id:'b12',l:'+',x:470,y:160,p:'b1',s:2},{id:'b13',l:'E',x:540,y:160,p:'b1',s:2},{id:'b111',l:'id',x:400,y:225,p:'b11',s:2,c:'leaf'},{id:'b131',l:'id',x:540,y:225,p:'b13',s:2,c:'leaf'},{id:'b21',l:'id',x:670,y:160,p:'b2',s:2,c:'leaf'}],
  ['Grammar <b>E → E + E | E * E | ( E ) | id</b>. Sentence: id + id * id.',
   'Tree 1: + at the root → means <b>id + (id * id)</b>. Correct precedence.',
   'Tree 2: * at the root → means <b>(id + id) * id</b>. Same sentence, different meaning!',
   'A grammar is <b>ambiguous</b> if some sentence has more than one parse tree (or leftmost derivation). Fix: rewrite with one non-terminal per precedence level (E, T, F).'],
  {h:250, extra:'<text x="190" y="248" text-anchor="middle" font-size="14" data-s="1" class="sub">= 2 + (3 × 4) = 14</text><text x="570" y="248" text-anchor="middle" font-size="14" data-s="2" class="sub">= (2 + 3) × 4 = 20</text>'});

D.danglingelse = trace('The dangling-else ambiguity',
  ['Reading','Meaning'],
  [['<code>if E1 then <u>if E2 then S1 else S2</u></code>','else belongs to the inner if ✔ (C, Java)'],['<code><u>if E1 then if E2 then S1</u> else S2</code>','else belongs to the outer if ✘'],['Rule','"match each else with the closest unmatched then"'],['Unambiguous grammar','stmt → matched | open; matched → if E then matched else matched | other; open → if E then stmt | if E then matched else open']],
  ['<code>if E1 then if E2 then S1 else S2</code> has two parse trees.','Interpretation 1.','Interpretation 2.','Languages pick the closest-if rule.','The grammar can be rewritten so that only the closest-if tree is possible.']);

D.leftrec = trace('Eliminating immediate left recursion',
  ['Before (left-recursive)','After'],
  [['A → A α | β','A → β A′ <br> A′ → α A′ | ε'],['E → E + T | T','E → T E′ <br> E′ → + T E′ | ε'],['T → T * F | F','T → F T′ <br> T′ → * F T′ | ε'],['F → ( E ) | id','F → ( E ) | id (unchanged)']],
  ['A top-down parser loops forever on <b>A → A α</b>: to expand A it must first expand A… (infinite recursion).',
   'General rule: A → Aα | β generates β α α α… Rewrite it as β followed by a list of α’s.',
   'Apply to E: α = + T, β = T.','Apply to T: α = * F, β = F.','F is not left-recursive. The new grammar generates the <b>same language</b> and is ready for LL(1).']);

D.leftfact = trace('Left factoring',
  ['Before','After'],
  [['A → α β1 | α β2','A → α A′ <br> A′ → β1 | β2'],['S → if E then S <br> &nbsp;&nbsp;| if E then S else S','S → if E then S S′ <br> S′ → else S | ε'],['T → id | id ( args )','T → id T′ <br> T′ → ( args ) | ε']],
  ['When two alternatives start with the same prefix, a predictive parser cannot choose with one token of lookahead.',
   'Factor out the common prefix α; decide later, after α is read.',
   'Classic example: if–then vs if–then–else.','Variable vs function call. Left factoring <b>delays the decision</b> until enough input is seen.']);

D.noncf = trace('Constructs a CFG cannot express',
  ['Language','Example','Why it matters'],
  [['L1 = { w c w | w ∈ (a|b)* }','abc ab','declare-before-use: the same identifier must appear twice'],['L2 = { aⁿ bᵐ cⁿ dᵐ }','aabbbccddd','number of formal parameters = number of actual arguments'],['Solution','—','check these in the <b>semantic</b> phase with the symbol table']],
  ['Some programming-language rules are <b>not context-free</b>.','Checking that an identifier is declared before use is like matching w c w.','Matching parameter counts is like aⁿbᵐcⁿdᵐ.','Grammars describe syntax; these checks belong to semantic analysis.']);

/* =====================================================================
   WEEK 6–8, 10 — Top-down parsing
   ===================================================================== */
D.backtrack = tree('Top-down parsing with backtracking: S → c A d, A → a b | a, input "cad"',
  [{id:'S',l:'S',x:380,y:35},{id:'c',l:'c',x:230,y:120,p:'S',s:1,c:'leaf'},{id:'A',l:'A',x:380,y:120,p:'S',s:1},{id:'d',l:'d',x:530,y:120,p:'S',s:1,c:'leaf'},
   {id:'a1',l:'a',x:320,y:210,p:'A',s:3,e:5,c:'leaf'},{id:'b1',l:'b',x:440,y:210,p:'A',s:3,e:5,c:'leaf bad'},
   {id:'a2',l:'a',x:380,y:210,p:'A',s:5,c:'leaf'}],
  ['Input pointer at <b>c</b>. Start with the root S.',
   'Only one production: S → c A d. Expand.',
   'Leaf <b>c</b> matches the input <b>c</b>. Advance to <b>a</b>.',
   'Expand A with its <b>first</b> alternative A → a b. Leaf a matches.',
   'Leaf <b>b</b> does not match input <b>d</b> → failure!',
   '<b>Backtrack:</b> reset the input pointer and try A → a. Leaf a matches.',
   'Leaf <b>d</b> matches d. Input consumed → success. Backtracking is slow; predictive parsers avoid it.'],
  {h:250, hl:{2:['c'],3:['a1'],4:['b1'],5:['a2'],6:['d']}});

D.recdesc = trace('Recursive-descent parsing of id + id',
  ['Call stack','Lookahead','Action'],
  [['E()','id','E → T E′: call T()'],['E() T()','id','T → F T′: call F()'],['E() T() F()','id','F → id: match(id)'],['E() T() T′()','+','not *, so T′ → ε, return'],['E() E′()','+','E′ → + T E′: match(+)'],['E() E′() T() F()','id','match(id)'],['E() E′() T() T′()','$','T′ → ε'],['E() E′() E′()','$','E′ → ε'],['—','$','all procedures returned, lookahead = $ → accept']],
  ['A recursive-descent parser has <b>one procedure per non-terminal</b>. Grammar: E → T E′, E′ → + T E′ | ε, T → F T′, T′ → * F T′ | ε, F → ( E ) | id.',
   'Call E() with lookahead id.','T() calls F().','F() matches id and advances.','T′() sees + which is not in FIRST(* F T′): use the ε-production.','E′() sees +: match it, then call T().','Second id matched.','End marker $: ε.','ε again.','The call stack <b>is</b> the parse tree, traced depth-first.']);

D.rdcode = codewalk('Recursive-descent code (C-like)',
  ['void E()  { T(); Eprime(); }',
   'void Eprime() {',
   '  if (look == \'+\') { match(\'+\'); T(); Eprime(); }',
   '  /* else: ε — do nothing */',
   '}',
   'void T()  { F(); Tprime(); }',
   'void Tprime() {',
   '  if (look == \'*\') { match(\'*\'); F(); Tprime(); }',
   '}',
   'void F() {',
   '  if (look == \'(\') { match(\'(\'); E(); match(\')\'); }',
   '  else if (look == ID) match(ID);',
   '  else error("expected id or (");',
   '}',
   'void match(int t) { if (look == t) look = nextToken(); else error(); }'],
  ['Every production becomes code: non-terminal → <b>call</b>, terminal → <b>match</b>.',
   'E() simply calls T() then Eprime().','Eprime chooses using the lookahead: + means "use E′ → + T E′".','No + means ε: return without consuming input.','F() handles parentheses by calling E() <b>recursively</b>.','An unexpected token → syntax error.','match() checks a terminal and reads the next token.'],
  [[],[0],[1,2],[3],[9,10],[12],[14]]);

D.first = trace('Computing FIRST sets',
  ['Non-terminal','Productions','FIRST'],
  [['F','( E ) | id','{ (, id }'],['T′','* F T′ | ε','{ *, ε }'],['T','F T′','FIRST(F) = { (, id }'],['E′','+ T E′ | ε','{ +, ε }'],['E','T E′','FIRST(T) = { (, id }']],
  ['FIRST(α) = set of terminals that can <b>begin</b> a string derived from α (plus ε if α ⇒* ε).',
   'F starts with ( or id.','T′: either * or ε.','T → F T′: FIRST(F) has no ε, so FIRST(T) = FIRST(F).','E′: + or ε.','E → T E′: FIRST(E) = FIRST(T) = { (, id }.']);

D.follow = trace('Computing FOLLOW sets',
  ['Non-terminal','Rule applied','FOLLOW'],
  [['E','start symbol gets $; F → ( E ) gives )','{ ), $ }'],['E′','E → T E′: E′ at the end, gets FOLLOW(E)','{ ), $ }'],['T','E′ → + T E′: FIRST(E′)−ε = +; E′ ⇒ ε so add FOLLOW(E′)','{ +, ), $ }'],['T′','T → F T′: gets FOLLOW(T)','{ +, ), $ }'],['F','T′ → * F T′: FIRST(T′)−ε = *; T′ ⇒ ε so add FOLLOW(T′)','{ *, +, ), $ }']],
  ['FOLLOW(A) = terminals that can appear <b>immediately to the right</b> of A in some sentential form. $ marks end of input.',
   'Rule 1: $ ∈ FOLLOW(start). The ) after E in F → ( E ).',
   'Rule 3: in A → α B, everything in FOLLOW(A) is in FOLLOW(B).',
   'Rule 2: in A → α B β, FIRST(β) − {ε} ⊆ FOLLOW(B); if β ⇒* ε apply rule 3 too.',
   'T′ is at the end of T’s production.',
   'F is followed by T′, which can start with * or vanish.']);

D.ll1table = trace('Building the LL(1) parsing table M[A, a]',
  ['','id','+','*','(',')','$'],
  [['E','E → T E′','','','E → T E′','',''],['E′','','E′ → + T E′','','','E′ → ε','E′ → ε'],['T','T → F T′','','','T → F T′','',''],['T′','','T′ → ε','T′ → * F T′','','T′ → ε','T′ → ε'],['F','F → id','','','F → ( E )','','']],
  ['For each production A → α: for each terminal a in FIRST(α) put A → α in M[A, a]. If ε ∈ FIRST(α), put A → α in M[A, b] for each b in FOLLOW(A).',
   'E → T E′: FIRST = { id, ( }.','E′ → + T E′ under +; E′ → ε under FOLLOW(E′) = { ), $ }.','T → F T′ under id and (.','T′ → * F T′ under *; T′ → ε under FOLLOW(T′) = { +, ), $ }.','F → id and F → ( E ). Every cell has <b>at most one</b> entry → the grammar is <b>LL(1)</b>. Blank cells = syntax error.']);

D.ll1trace = trace('Table-driven LL(1) parse of id + id * id',
  ['#','Stack (top at left)','Input','Action'],
  [['1','E $','id + id * id $','E → T E′'],['2','T E′ $','id + id * id $','T → F T′'],['3','F T′ E′ $','id + id * id $','F → id'],['4','id T′ E′ $','id + id * id $','match id'],['5','T′ E′ $','+ id * id $','T′ → ε'],['6','E′ $','+ id * id $','E′ → + T E′'],['7','+ T E′ $','+ id * id $','match +'],['8','T E′ $','id * id $','T → F T′'],['9','F T′ E′ $','id * id $','F → id'],['10','id T′ E′ $','id * id $','match id'],['11','T′ E′ $','* id $','T′ → * F T′'],['12','* F T′ E′ $','* id $','match *'],['13','F T′ E′ $','id $','F → id'],['14','id T′ E′ $','id $','match id'],['15','T′ E′ $','$','T′ → ε'],['16','E′ $','$','E′ → ε'],['17','$','$','accept ✔']],
  ['The LL(1) driver: if top X is a terminal, <b>match</b> it; if X is a non-terminal, replace it by the production in <b>M[X, a]</b> (pushed right-to-left).',
   '','','','Match pops id and advances the input.','T′ with lookahead + → ε (pop).','','','','','','T′ with * → T′ → * F T′.','','','','','','Stack and input both at $ → <b>accept</b>. The productions used, in order, form a leftmost derivation.']);

D.ll1conflict = trace('When is a grammar not LL(1)?',
  ['Grammar','Problem','Cell with 2 entries'],
  [['E → E + T | T','left recursive','M[E, id] has E → E+T and E → T'],['S → i E t S | i E t S e S | a','common prefix (needs left factoring)','M[S, i]'],['S → i E t S S′ | a, S′ → e S | ε','still ambiguous (dangling else)','M[S′, e] = { S′ → e S, S′ → ε }'],['Fix','resolve: choose S′ → e S','else matches closest if']],
  ['A grammar is LL(1) iff its table has no multiply-defined entries.','Left recursion always breaks LL(1).','So does a common prefix.','An ambiguous grammar is never LL(1).','In practice we resolve the dangling-else cell by hand.']);

D.panic = trace('Panic-mode recovery with synch entries: input id * + id',
  ['Stack','Input','Action'],
  [['E $','id * + id $','E → T E′'],['T E′ $','id * + id $','T → F T′'],['F T′ E′ $','id * + id $','F → id'],['id T′ E′ $','id * + id $','match id'],['T′ E′ $','* + id $','T′ → * F T′'],['* F T′ E′ $','* + id $','match *'],['F T′ E′ $','+ id $','<b>error</b>: M[F, +] = synch → pop F'],['T′ E′ $','+ id $','T′ → ε'],['E′ $','+ id $','E′ → + T E′'],['+ T E′ $','+ id $','match +'],['T E′ $','id $','T → F T′'],['F T′ E′ $','id $','F → id'],['id T′ E′ $','id $','match id'],['T′ E′ $','$','T′ → ε'],['E′ $','$','E′ → ε'],['$','$','accept (1 error reported)']],
  ['Add <b>synch</b> to M[A, a] for every a in FOLLOW(A) that is empty. Rules: blank cell → skip input token; synch → pop A; terminal mismatch → pop it.',
   '','','','','','',
   'F expected an operand but sees +. + ∈ FOLLOW(F), so the cell is <b>synch</b>: pop F as if the operand were there. Report "missing operand".',
   '','','','','','','','Parsing <b>continues</b> after the error and finds further errors in one run.']);

D.errstrat = flow('Error-recovery strategies',
  [['🏃','Panic mode','skip to synch token'],['🔧','Phrase level','local fix'],['📏','Error productions','expected mistakes'],['🌐','Global correction','minimum changes']],
  ['A parser should <b>report</b> errors clearly, <b>recover</b> quickly and not slow down correct programs.',
   '<b>Panic mode:</b> discard tokens until a synchronising token such as <code>;</code> or <code>}</code>. Simple, never loops.',
   '<b>Phrase level:</b> local correction — insert a missing <code>;</code>, replace <code>,</code> with <code>;</code>. Must not loop forever.',
   '<b>Error productions:</b> add grammar rules for common mistakes, e.g. <code>stmt → if E S</code> without parentheses, then report it.',
   '<b>Global correction:</b> find the fewest insertions/deletions to make the program valid. Too costly in practice; a theoretical yardstick.']);

/* =====================================================================
   WEEK 11–14 — Semantic analysis, SDD, SDT, types
   ===================================================================== */
D.sddtree = tree('Annotated parse tree for 3 * 5 + 4 n',
  [{id:'L',l:'L',x:380,y:30,a:'print 19',as:7,ay:-20},{id:'E',l:'E',x:300,y:90,p:'L',a:'val=19',as:7},{id:'n',l:'n',x:470,y:90,p:'L',c:'leaf'},
   {id:'E1',l:'E',x:180,y:155,p:'E',a:'val=15',as:5},{id:'pl',l:'+',x:300,y:155,p:'E',c:'leaf'},{id:'T3',l:'T',x:420,y:155,p:'E',a:'val=4',as:6},
   {id:'T1',l:'T',x:180,y:215,p:'E1',a:'val=15',as:5},{id:'F3',l:'F',x:420,y:215,p:'T3',a:'val=4',as:6},
   {id:'T2',l:'T',x:90,y:275,p:'T1',a:'val=3',as:2},{id:'st',l:'*',x:180,y:275,p:'T1',c:'leaf'},{id:'F2',l:'F',x:270,y:275,p:'T1',a:'val=5',as:4},{id:'d4',l:'digit',x:420,y:275,p:'F3',a:'lexval=4',as:1,c:'leaf'},
   {id:'F1',l:'F',x:90,y:330,p:'T2',a:'val=3',as:2,ay:-22},{id:'d5',l:'digit',x:270,y:330,p:'F2',a:'lexval=5',as:1,c:'leaf'},
   {id:'d3',l:'digit',x:90,y:385,p:'F1',a:'lexval=3',as:1,c:'leaf'}],
  ['SDD: L → E n {print(E.val)}, E → E1 + T {E.val = E1.val + T.val}, T → T1 * F {T.val = T1.val × F.val}, F → digit {F.val = digit.lexval}.',
   'Leaves get <b>lexval</b> from the lexer.','F.val = 3 and T.val = 3 — values flow <b>upward</b> (synthesized).','','F.val = 5.','T.val = 3 × 5 = 15, E.val = 15.','Right side: T.val = 4.','E.val = 15 + 4 = <b>19</b>; L prints 19. All attributes are synthesized → an <b>S-attributed</b> SDD, evaluated bottom-up (post-order).'],
  {h:405, hl:{2:['F1','T2'],4:['F2'],5:['T1','E1'],6:['F3','T3'],7:['E','L']}});

D.attrkinds = trace('Synthesized vs inherited attributes',
  ['','Synthesized','Inherited'],
  [['Defined at node N by a rule of…','the production at N (N is the head)','the production at N’s <b>parent</b> (N is in the body)'],['Uses values of','N’s children and N itself','N’s parent, N itself and N’s siblings'],['Direction of flow','upward ⬆','downward ⬇ / sideways ⬌'],['Example','E.val = E1.val + T.val','L.inh = T.type (type of a declaration list)'],['Evaluation','post-order (bottom-up)','needs a dependency order (e.g. left to right)']],
  ['Attributes are values attached to grammar symbols.','Where the rule lives.','Which values it may use.','How information moves through the tree.','A typical example of each.','How to evaluate.']);

D.inherit = tree('Inherited attribute: float id1, id2, id3',
  [{id:'D',l:'D',x:380,y:30},{id:'T',l:'T',x:160,y:95,p:'D',a:'type=float',as:1,ay:28},{id:'L',l:'L',x:500,y:95,p:'D',a:'inh=float',as:2},
   {id:'f',l:'float',x:160,y:160,p:'T',c:'leaf'},{id:'L1',l:'L',x:420,y:160,p:'L',a:'inh=float',as:3},{id:'c1',l:',',x:560,y:160,p:'L',c:'leaf'},{id:'i3',l:'id3',x:650,y:160,p:'L',c:'leaf',a:'float ✓',as:3,ay:28},
   {id:'L2',l:'L',x:340,y:225,p:'L1',a:'inh=float',as:4},{id:'c2',l:',',x:450,y:225,p:'L1',c:'leaf'},{id:'i2',l:'id2',x:540,y:225,p:'L1',c:'leaf',a:'float ✓',as:4,ay:28},
   {id:'i1',l:'id1',x:340,y:290,p:'L2',c:'leaf',a:'float ✓',as:5,ay:28}],
  ['SDD: D → T L {L.inh = T.type}, T → float {T.type = float}, L → L1 , id {L1.inh = L.inh; addType(id.entry, L.inh)}, L → id {addType(id.entry, L.inh)}.',
   'T.type = float is <b>synthesized</b> from the keyword.','L.inh = T.type is passed <b>sideways</b> from sibling T to L.','L1.inh = L.inh is passed <b>down</b>; id3 receives type float.','Down again; id2 receives float.','Finally id1 receives float. Every identifier is entered in the symbol table with its type.'],
  {h:320, hl:{1:['T'],2:['L'],3:['L1','i3'],4:['L2','i2'],5:['i1']}});

D.depgraph = graph('Dependency graph and a topological order',
  [['1',80,60,false,'id1.entry'],['2',80,140,false,'id2.entry'],['3',80,220,false,'id3.entry'],['4',260,140,false,'T.type'],['5',430,60,false,'L.inh'],['6',600,60,false,'addType'],['7',430,140,false,'L1.inh'],['8',600,140,false,'addType'],['9',430,220,false,'L2.inh'],['10',600,220,false,'addType']],
  [['4','5',''],['5','7',''],['7','9',''],['5','6',''],['7','8',''],['9','10',''],['3','6',-0.15],['2','8',-0.1],['1','10',0.2]],
  ['A <b>dependency graph</b> has a node per attribute instance and an edge X → Y when Y needs X. For float id1, id2, id3:',
   'Nodes 1–3: the symbol-table entries of the ids (from the lexer). Node 4: T.type.',
   'L.inh (5) depends on T.type (4); L1.inh (7) on 5; L2.inh (9) on 7.',
   'Each addType call depends on an inh attribute and an entry.',
   'Any <b>topological sort</b> is a valid evaluation order, e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. A <b>cycle</b> would mean no order exists.'],
  [{e:[]},{s:['1','2','3','4']},{s:['4','5','7','9'],e:[0,1,2]},{s:['6','8','10'],e:[3,4,5,6,7,8]},{s:['1','2','3','4','5','6','7','8','9','10']}],
  {h:270});

D.slattr = trace('S-attributed vs L-attributed definitions',
  ['Rule','S-attributed?','L-attributed?'],
  [['E → E1 + T { E.val = E1.val + T.val }','✔ only synthesized','✔'],['D → T L { L.inh = T.type }','✘ (inherited)','✔ uses left sibling T'],['T → F T′ { T′.inh = F.val }','✘','✔ uses left sibling F'],['A → B C { B.i = C.s }','✘','✘ uses a <b>right</b> sibling'],['A → B C { A.s = B.i }','✘','✔ synthesized at A']],
  ['<b>S-attributed:</b> every attribute is synthesized → evaluate in any bottom-up order (perfect for LR parsers).',
   'Classic calculator rule.','An inherited attribute from the <b>left</b> sibling is allowed in L-attributed definitions.','Same pattern used for left-recursion-free expression grammars.','Depending on a sibling to the <b>right</b> breaks the left-to-right rule.','Every S-attributed SDD is also L-attributed. L-attributed SDDs can be evaluated in one depth-first, left-to-right pass — perfect for LL / recursive descent.']);

D.postfixsdt = trace('Postfix SDT: translating 9 − 5 + 2 to postfix',
  ['Reduction / action','Output so far'],
  [['term → 9 { print(\'9\') }','9'],['expr → term','9'],['term → 5 { print(\'5\') }','9 5'],['expr → expr − term { print(\'−\') }','9 5 −'],['term → 2 { print(\'2\') }','9 5 − 2'],['expr → expr + term { print(\'+\') }','9 5 − 2 +']],
  ['A <b>postfix SDT</b> puts every action at the <b>end</b> of its production, so the action runs when the production is reduced.',
   'Read 9; reduce to term → print 9.','term becomes expr.','Read 5 → print 5.','Reduce expr − term → print −.','Read 2 → print 2.','Reduce expr + term → print +. Result: <b>95−2+</b>.']);

D.sdtinside = trace('Actions inside productions: infix to prefix',
  ['Production with embedded action','Fires…'],
  [['E → { print(\'+\') } E1 + T','before E1 is expanded'],['E → T','—'],['T → { print(\'*\') } T1 * F','before T1'],['F → digit { print(digit.lexval) }','after digit is read'],['Input 3 * 5 + 4','output: + * 3 5 4']],
  ['An action can appear <b>anywhere</b> in a body: B → X { a } Y runs a after X is recognised and before Y.',
   'Printing the operator first gives prefix notation.','','','','For top-down parsing, an action is treated like a marker non-terminal and executed when reached during the depth-first walk.']);

D.typecheck = trace('Type checking with coercion: float x; int i; x = i * 2.5;',
  ['Node','Types','Rule','Code'],
  [['i','int','lookup symbol table',''],['2.5','float','literal',''],['i * 2.5','int × float','widen int → float','t1 = (float) i'],['','float × float → float','arithmetic result','t2 = t1 * 2.5'],['x = …','float := float','assignment compatible ✔','x = t2'],['x = "hi"','float := string','✘ type error','—']],
  ['The type checker walks the tree and computes a <b>type expression</b> for every node.',
   'Identifier types come from the symbol table.','Literal types come from the lexer.','Different operand types → insert a <b>coercion</b> (implicit conversion) to the wider type.','The result type of * is float.','Assignment check.','Incompatible types cannot be converted → report an error.']);

D.typeexp = tree('Type expression for int[2][3]',
  [{id:'a',l:'array',x:380,y:40},{id:'n2',l:'2',x:260,y:120,p:'a',c:'leaf'},{id:'b',l:'array',x:500,y:120,p:'a',s:1},{id:'n3',l:'3',x:420,y:200,p:'b',s:1,c:'leaf'},{id:'int',l:'integer',x:580,y:200,p:'b',s:2,c:'leaf'}],
  ['A <b>type expression</b> describes the structure of a type: array(2, array(3, integer)).','The outer array has 2 elements, each an array.','Each inner array has 3 integers. Two types are equivalent (structural equivalence) if their trees are the same.'],
  {h:240});

/* =====================================================================
   WEEK 14–16 — Intermediate code
   ===================================================================== */
D.irforms = flow('Forms of intermediate representation',
  [['🌳','Syntax tree','high level'],['🔗','DAG','shared subexpressions'],['🧾','Three-address code','low level, linear'],['🖥️','Machine code','target']],
  ['Compilers may use several IRs, from high level to low level.',
   '<b>Syntax tree (AST):</b> nodes are operators; close to the source.',
   '<b>DAG:</b> like an AST but common subexpressions share one node: a + a*(b−c) + (b−c)*d builds b−c only once.',
   '<b>Three-address code:</b> at most one operator on the right side, e.g. <code>t1 = b − c</code>. Easy to optimise and to turn into machine code.',
   'The back end maps the low-level IR to real instructions.']);

D.dag = tree('DAG for a + a * (b − c) + (b − c) * d',
  [{id:'p2',l:'+',x:380,y:30},{id:'p1',l:'+',x:240,y:95,p:'p2'},{id:'m2',l:'*',x:540,y:95,p:'p2'},{id:'a',l:'a',x:120,y:165,p:'p1',c:'leaf'},{id:'m1',l:'*',x:330,y:165,p:'p1'},
   {id:'s',l:'−',x:430,y:235,p:'m1'},{id:'d',l:'d',x:640,y:165,p:'m2',c:'leaf'},{id:'b',l:'b',x:370,y:305,p:'s',c:'leaf'},{id:'c',l:'c',x:490,y:305,p:'s',c:'leaf'}],
  ['In a DAG an identical subexpression gets <b>one</b> node with several parents.','Node a is used twice; node (b − c) is used by both * nodes.','Fewer nodes → the code generator computes b − c once.'],
  {h:330, hl:{1:['a','s'],2:['s']}, extra:'<line class="ln" x1="540" y1="109" x2="430" y2="219"/><line class="ln" x1="330" y1="179" x2="135" y2="175"/>'});

D.tac = trace('Three-address code for a = b * −c + b * −c',
  ['#','Three-address instruction','Meaning'],
  [['1','t1 = minus c','unary minus'],['2','t2 = b * t1',''],['3','t3 = minus c','(same as t1 — a DAG would reuse it)'],['4','t4 = b * t3',''],['5','t5 = t2 + t4',''],['6','a = t5','copy into a']],
  ['<b>Three-address code</b>: each instruction has at most one operator on the right and at most three addresses (names, constants or temporaries).',
   'Evaluate the innermost operator first; give the result a new temporary.','','','','','The tree is flattened into a linear sequence of simple steps.']);

D.quads = trace('Quadruples and triples for a = b * −c + b * −c',
  ['#','op','arg1','arg2','result (quads)','triples'],
  [['0','minus','c','','t1','(minus, c, —)'],['1','*','b','t1','t2','(*, b, (0))'],['2','minus','c','','t3','(minus, c, —)'],['3','*','b','t3','t4','(*, b, (2))'],['4','+','t2','t4','t5','(+, (1), (3))'],['5','=','t5','','a','(=, a, (4))']],
  ['Two ways to store three-address code in a data structure.','<b>Quadruples</b>: op, arg1, arg2, result — temporaries are named explicitly.','<b>Triples</b>: no result field; a result is referred to by its <b>position</b> (0), (1)…','','','','<b>Indirect triples</b> keep a separate list of pointers to triples, so the optimizer can reorder instructions without renumbering.']);

D.tactypes = trace('Kinds of three-address instructions',
  ['Form','Example'],
  [['x = y op z','t1 = a + b'],['x = op y','t2 = minus c'],['x = y','a = t2'],['goto L','goto L3'],['if x goto L / ifFalse x goto L','ifFalse t1 goto L2'],['if x relop y goto L','if a < b goto L1'],['param x; call p, n; return y','param a · call f, 1'],['x = y[i]; x[i] = y','t3 = arr[t2]'],['x = &y; x = *y; *x = y','p = &v']],
  ['Common three-address instruction forms (Dragon book §6.2).','Binary operation.','Unary operation.','Copy.','Unconditional jump.','Conditional jumps on a boolean value.','Conditional jump on a comparison.','Procedure calls.','Indexed copies (arrays).','Address and pointer assignments.']);

D.exprtrans = trace('SDD translation of x = ( a + b ) * c',
  ['Production applied','addr','code generated'],
  [['E → id (a)','a',''],['E → id (b)','b',''],['E → E1 + E2','t1','t1 = a + b'],['E → ( E1 )','t1','(nothing new)'],['E → id (c)','c',''],['E → E1 * E2','t2','t2 = t1 * c'],['S → id = E','','x = t2']],
  ['Attributes: <b>E.addr</b> holds the name or temporary with E’s value; <b>E.code</b> is its code. new Temp() makes t1, t2…',
   'A leaf id: addr = the name, no code.','','E.addr = new Temp(); gen(E.addr \'=\' E1.addr \'+\' E2.addr).','Parentheses only group: same addr, same code.','','Multiply into a new temporary.','Finally gen(top.get(id.lexeme) \'=\' E.addr).']);

D.arrayref = trace('Translating an array reference: x = a[i]  (int is 4 bytes)',
  ['Step','Instruction','Why'],
  [['1','t1 = i * 4','offset = index × element width'],['2','t2 = a [ t1 ]','fetch from base address a + offset'],['3','x = t2','assign']],
  ['For a one-dimensional array of int with width 4:','Compute the byte offset.','Indexed copy instruction.','Assign the result. For a[i][j] in a 2×3 int array: offset = i × 12 + j × 4.']);

D.ifelse = codewalk('Translating if (B) S1 else S2',
  ['      B.code         (jumps to B.true or B.false)',
   'B.true:',
   '      S1.code',
   '      goto S.next',
   'B.false:',
   '      S2.code',
   'S.next:'],
  ['Control-flow statements are translated with <b>labels</b> and <b>jumps</b>.',
   'First the boolean expression B. It does not compute a value; it <b>jumps</b>.','If B is true, control reaches B.true and runs S1.','After S1, jump over S2.','If B is false, control goes to B.false and runs S2.','Both paths meet at S.next.'],
  [[],[0],[1,2],[3],[4,5],[6]]);

D.whiletr = codewalk('Translating while (B) S1',
  ['begin:',
   '      B.code      (true → B.true, false → S.next)',
   'B.true:',
   '      S1.code',
   '      goto begin',
   'S.next:'],
  ['A loop needs a backward jump.','Label the start of the test.','Evaluate the condition with jumps.','Body runs when B is true.','Jump back and test again.','Exit when B is false.'],
  [[],[0],[1],[2,3],[4],[5]]);

D.shortcircuit = codewalk('Short-circuit (jumping) code for if (x < 100 || x > 200 && x != y) x = 0;',
  ['      if x < 100 goto L2',
   '      ifFalse x > 200 goto L1',
   '      ifFalse x != y goto L1',
   'L2:   x = 0',
   'L1:   ...'],
  ['In <b>short-circuit code</b> the operators ||, && and ! become jumps; the value of the boolean expression is never stored.',
   'If x &lt; 100 is true, the whole || is true: jump straight to the body (L2). The rest is <b>skipped</b>.',
   'Otherwise test x &gt; 200. If false, the && is false → whole condition false → L1.',
   'Then test x != y. If false → L1.',
   'Both tests passed (or the first one did): execute x = 0.',
   'L1 is the code after the if.'],
  [[],[0],[1],[2],[3],[4]]);

D.boolcode = trace('Jumping-code rules for boolean expressions',
  ['Production','Semantic rules'],
  [['B → B1 || B2','B1.true = B.true; B1.false = newlabel(); B2.true = B.true; B2.false = B.false'],['B → B1 && B2','B1.true = newlabel(); B1.false = B.false; B2.true = B.true; B2.false = B.false'],['B → ! B1','B1.true = B.false; B1.false = B.true'],['B → E1 rel E2','gen(if E1.addr rel.op E2.addr goto B.true) gen(goto B.false)'],['B → true / false','gen(goto B.true) / gen(goto B.false)']],
  ['Inherited attributes B.true and B.false are the labels to jump to.','For ||, if B1 is true the whole thing is true.','For &&, if B1 is false the whole thing is false.','! just swaps the targets — no code.','A comparison produces a conditional jump and a goto.','Constants become unconditional jumps.']);

D.redundant = trace('Avoiding redundant gotos with "fall"',
  ['Without fall-through','With fall-through'],
  [['if x &lt; 100 goto L2','if x &lt; 100 goto L2'],['goto L3','—'],['L3: if x &gt; 200 goto L4','ifFalse x &gt; 200 goto L1'],['goto L1','—'],['L4: if x != y goto L2','ifFalse x != y goto L1'],['goto L1','—'],['L2: x = 0','L2: x = 0'],['L1:','L1:']],
  ['The basic rules generate a goto to the very next instruction — wasteful.',
   '','A jump to the next line is useless.','','Use the special label <b>fall</b>: "do not jump, just fall through". With ifFalse we jump only when needed.','','','Result: 3 conditional jumps instead of 3 conditional + 3 unconditional.']);

D.backpatch = trace('Backpatching x < 100 || x > 200 && x != y',
  ['Quad','Instruction','After backpatching'],
  [['100','if x &lt; 100 goto _','if x &lt; 100 goto <b>?</b> (truelist)'],['101','goto _','goto <b>102</b>'],['102','if x &gt; 200 goto _','if x &gt; 200 goto <b>104</b>'],['103','goto _','goto <b>?</b> (falselist)'],['104','if x != y goto _','if x != y goto <b>?</b> (truelist)'],['105','goto _','goto <b>?</b> (falselist)']],
  ['<b>Backpatching</b> lets us generate jumps in <b>one pass</b>: emit jumps with empty targets and keep lists of them; fill the targets when the label becomes known.',
   'B1 (x < 100): truelist = {100}, falselist = {101}.','M.instr = 102 marks where B2 starts.','B3 (x > 200): truelist = {102}, falselist = {103}.','B4 (x != y): truelist = {104}, falselist = {105}.',
   'B3 && B4: backpatch(B3.truelist = {102}, 104). truelist = {104}, falselist = {103, 105}.',
   'B1 || (…): backpatch(B1.falselist = {101}, 102). Final truelist = {100, 104}, falselist = {103, 105} — patched later by the enclosing if statement.']);

D.bpfuncs = trace('The three backpatching functions',
  ['Function','What it does'],
  [['makelist(i)','creates a new list containing only quad i; returns a pointer to it'],['merge(p1, p2)','concatenates the lists p1 and p2; returns the new list'],['backpatch(p, i)','inserts i as the target label in every instruction on list p']],
  ['Backpatching uses lists of quad numbers.','makelist starts a list.','merge joins two lists of jumps with the same (unknown) target.','backpatch fills them all at once.']);

D.switchtr = codewalk('Translating a switch statement',
  ['      t = E.code result',
   '      goto test',
   'L1:   code for S1',
   '      goto next',
   'L2:   code for S2',
   '      goto next',
   'Ln:   code for Sn (default)',
   '      goto next',
   'test: if t = V1 goto L1',
   '      if t = V2 goto L2',
   '      goto Ln',
   'next:'],
  ['<code>switch (E) { case V1: S1 case V2: S2 … default: Sn }</code>',
   'Evaluate E once into a temporary t, then jump to the tests at the end.',
   'Each case body gets a label and ends with goto next (break).',
   '','The default case.',
   'The tests are placed <b>after</b> the bodies so they can be generated in one pass once all case values are known.',
   '','No value matched → default.','Many cases → use a <b>jump table</b> (index by t) or a hash table instead of a chain of tests.'],
  [[],[0,1],[2,3],[4,5],[6,7],[8],[9],[10],[8,9,10]]);

/* =====================================================================
   Review demos (Midterm / Final)
   ===================================================================== */
D.midreview = flow('Midterm map: Weeks 1–8',
  [['🧭','Overview','phases, context'],['🔤','Lexical','tokens, RE'],['🤖','Automata','NFA, DFA'],['🛠️','Scanners','hand/table/Lex'],['📐','Grammars','CFG, ambiguity'],['⬇️','Top-down','RD, LL(1)']],
  ['Everything the midterm covers, in order.','Week 1: compilers vs interpreters, language-processing system, phases, front/back end.','Week 2: role of the lexer, tokens/patterns/lexemes, input buffering, regular expressions, lexical errors.','Week 3: NFA, DFA, Thompson, subset construction, transition diagrams, keywords vs ids.','Weeks 4–5: hand-coded, table-driven and generated scanners; symbol table.','Week 5: role of the parser, CFG, derivations, parse trees, ambiguity, left recursion, left factoring.','Weeks 6–8: backtracking, recursive descent, FIRST, FOLLOW, LL(1) table and parsing.']);

D.finalreview = flow('Final map: the whole front end',
  [['🔤','Scanner','W2–5'],['🌳','Parser','W5–10'],['🩹','Recovery','W10–11'],['🏷️','SDD / SDT','W11–13'],['🧐','Types & scope','W13–14'],['🧾','IR & control flow','W14–16']],
  ['Follow one program through everything you have learned.','Scanner: characters → tokens.','Parser: tokens → tree (LL(1)).','Error detection and recovery (panic mode, synch sets).','Attributes, evaluation orders and translation schemes.','Type checking, coercion and scopes.','Three-address code, short-circuit code, backpatching and switch.']);

window.ICTDemos = { mount, list: D };
})();
