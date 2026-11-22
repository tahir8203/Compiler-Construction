/* Live, interactive compiler pipeline for slides: type a statement and step through every phase.
   Registers ICTDemos.list.livepipe, so it gets the same Play / Step / Reset controls and Watch-mode support as the animations.
   Optional: <div data-demo="livepipe" data-input="y = a + b * 2;"> sets the starting statement. */
(function(){
const D = window.ICTDemos && window.ICTDemos.list, T = window.CCTools;
if(!D || !T) return;
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TYPES = /^(int|float|double|char)\s+/;

/* ---------- the compiler, phase by phase ---------- */
function compile(src){
  const r = {src}; const line = src.trim();
  r.tok = T.tokenize(line);                                   // 1. lexer
  let body = line.replace(/;\s*$/,''), decl = null;
  const m = TYPES.exec(body); if(m){ decl = m[1]; body = body.slice(m[0].length); }
  try{ r.ast = T.exprParse(body); }catch(e){ r.err = e.message; return r; }   // 2. parser
  // 3. semantic analysis: symbol table and types
  const ids = [], walk = n => { if(n.leaf){ if(/^[A-Za-z_]/.test(n.leaf) && !ids.includes(n.leaf)) ids.push(n.leaf); } else { walk(n.l); if(n.r) walk(n.r); } };
  walk(r.ast);
  const target = r.ast.op==='=' ? r.ast.l.leaf : null;
  r.sym = ids.map(id => ({id, type: id===target && decl ? decl : 'int', note: id===target && decl ? 'declared here' : 'assume declared earlier as int'}));
  const tyOf = n => n.leaf ? (/^\d+\.\d+/.test(n.leaf) ? 'float' : /^\d/.test(n.leaf) ? 'int' : (r.sym.find(s=>s.id===n.leaf)||{}).type) : n.op==='minus' ? tyOf(n.l) : (tyOf(n.l)==='float'||tyOf(n.r)==='float') ? 'float' : 'int';
  const rhs = r.ast.op==='=' ? r.ast.r : r.ast;
  r.checks = [];
  if(target) r.checks.push(`<b>${esc(target)}</b> is in the symbol table as <b>${(r.sym.find(s=>s.id===target)||{}).type}</b> ✓`);
  r.checks.push(`Right-hand side has type <b>${tyOf(rhs)}</b> ✓`);
  if(target){ const lt=(r.sym.find(s=>s.id===target)||{}).type, rt=tyOf(rhs);
    r.checks.push(lt===rt ? `Assignment ${lt} = ${rt} is allowed ✓` : lt==='float' ? `int value is widened to float (type conversion) ✓` : `⚠ float value is narrowed to int (some compilers warn here)`); }
  // 4. intermediate code (three-address code)
  r.tac = T.translate(r.ast).code;
  // 5. optimiser: constant folding + removing a useless copy
  r.opt = optimise(r.tac);
  // 6. code generator: a simple register machine
  r.asm = codegen(r.opt);
  // 7. output
  const last = r.opt[r.opt.length-1] || '';
  const k = /^(\w+) = (-?[\d.]+)$/.exec(last);
  r.out = k ? `When the program runs, <b>${esc(k[1])}</b> holds <b>${k[2]}</b>. The compiler did this arithmetic, so no time is spent on it at run time.`
            : `When the program runs, the CPU executes ${r.asm.length} machine instructions to compute <b>${esc(target||'the value')}</b> from the current values of ${ids.filter(i=>i!==target).map(esc).join(', ')||'its operands'}.`;
  return r;
}
const OPS = {'+':(a,b)=>a+b,'-':(a,b)=>a-b,'*':(a,b)=>a*b,'/':(a,b)=>b===0?NaN:a/b};
function optimise(code){
  const val = {}, out = [];
  const v = x => (x in val) ? String(val[x]) : x, num = x => /^-?\d+(\.\d+)?$/.test(x);
  for(const ln of code){
    let m;
    if((m=/^(\w+) = (\S+) ([+\-*/]) (\S+)$/.exec(ln))){ const a=v(m[2]), b=v(m[4]);
      if(num(a)&&num(b)&&!isNaN(OPS[m[3]](+a,+b))){ let r=OPS[m[3]](+a,+b); if(!String(a).includes('.')&&!String(b).includes('.')) r=Math.trunc(r); val[m[1]]=+r.toFixed(6); if(!/^t\d+$/.test(m[1])) out.push(`${m[1]} = ${val[m[1]]}`); }
      else out.push(`${m[1]} = ${a} ${m[3]} ${b}`); }
    else if((m=/^(\w+) = minus (\S+)$/.exec(ln))){ const a=v(m[2]); if(num(a)){ val[m[1]]=-a; if(!/^t\d+$/.test(m[1])) out.push(`${m[1]} = ${-a}`); } else out.push(`${m[1]} = minus ${a}`); }
    else if((m=/^(\w+) = (\S+)$/.exec(ln))){ const a=v(m[2]); if(num(a)){ val[m[1]]=+a; out.push(`${m[1]} = ${a}`); }
      else { const prev=out[out.length-1], p=prev&&new RegExp('^'+a+' = (.*)$').exec(prev);
        if(p && /^t\d+$/.test(a)) out[out.length-1]=`${m[1]} = ${p[1]}`; else out.push(`${m[1]} = ${a}`); } }
    else out.push(ln);
  }
  return out;
}
function codegen(code){
  const asm=[], OP={'+':'ADD','-':'SUB','*':'MUL','/':'DIV'};
  const ld = x => /^-?[\d.]+$/.test(x) ? `#${x}` : x;
  for(const ln of code){ let m;
    if((m=/^(\w+) = (\S+) ([+\-*/]) (\S+)$/.exec(ln))) asm.push(`LOAD  R1, ${ld(m[2])}`, `${OP[m[3]].padEnd(5)} R1, ${ld(m[4])}`, `STORE ${m[1]}, R1`);
    else if((m=/^(\w+) = minus (\S+)$/.exec(ln))) asm.push(`LOAD  R1, ${ld(m[2])}`, `NEG   R1`, `STORE ${m[1]}, R1`);
    else if((m=/^(\w+) = (\S+)$/.exec(ln))) asm.push(`LOAD  R1, ${ld(m[2])}`, `STORE ${m[1]}, R1`);
  }
  return asm;
}

/* ---------- drawing ---------- */
function treeSVG(ast){
  const W=64, H=58; let x=0; const nodes=[], edges=[];
  (function lay(n,d){ const kids=n.leaf?[]:n.r?[n.l,n.r]:[n.l]; const me={lab:n.leaf||(n.op==='minus'?'−':n.op),d,leaf:!!n.leaf};
    if(!kids.length){ me.x=x++; } else { const k=kids.map(c=>lay(c,d+1)); me.x=(k[0].x+k[k.length-1].x)/2; k.forEach(c=>edges.push([me,c])); }
    nodes.push(me); return me; })(ast,0);
  const wd=Math.max(1,x)*W, ht=(Math.max(...nodes.map(n=>n.d))+1)*H;
  const P=n=>[n.x*W+W/2, n.d*H+24];
  return `<svg viewBox="0 0 ${wd} ${ht}" class="lp-tree" role="img" aria-label="Syntax tree">${edges.map(([a,b])=>{const[p,q]=P(a),[r,s]=P(b);return `<line x1="${p}" y1="${q}" x2="${r}" y2="${s}"/>`;}).join('')}${nodes.map(n=>{const[p,q]=P(n);return `<g class="${n.leaf?'lf':'op'}"><circle cx="${p}" cy="${q}" r="19"/><text x="${p}" y="${q+5}">${esc(n.lab)}</text></g>`;}).join('')}</svg>`;
}
const PH = [
  ['📄','Source code','The line exactly as the programmer typed it.'],
  ['🔤','Lexer (scanner)','Splits the characters into tokens, like splitting a sentence into words.'],
  ['🌳','Parser','Checks the grammar and builds a syntax tree: what is inside what.'],
  ['🧐','Semantic analysis','Checks the meaning: are names declared? do the types fit? Uses the symbol table (the compiler’s phone book).'],
  ['🧾','Intermediate code','Rewrites the tree as three-address code: one small step per line.'],
  ['⚡','Optimiser','Makes the code shorter or faster without changing its meaning.'],
  ['🖥️','Code generator','Turns the steps into machine-style instructions for the CPU.'],
  ['✅','Output','What actually happens when the program runs.']];

D.livepipe = {
  title:'Live compiler pipeline: type a statement and step through every phase',
  caps: PH.map((p,i)=>`<b>${i}. ${p[1]}:</b> ${p[2]}`),
  build(stage){
    const host = stage.closest('[data-demo]'); const start = (host && host.dataset.input) || 'int x = 5 + 3;';
    stage.classList.add('lp');
    stage.innerHTML = `<form class="lp-in" onsubmit="return false"><label class="tiny" for="lp${stage.dataset.k=Math.random().toString(36).slice(2,7)}">Type one statement (try <code>y = a + b * 2;</code> or <code>int z = (4 + 6) * 3;</code>):</label>
      <div class="lp-row"><input id="lp${stage.dataset.k}" type="text" value="${esc(start)}" autocomplete="off" spellcheck="false" aria-label="Statement to compile"><button class="btn sm pri" type="submit">Compile ▶</button></div></form>
      <div class="lp-phases">${PH.map((p,i)=>`<section class="lp-ph" data-i="${i}"><h5><span>${p[0]}</span> ${i}. ${p[1]}</h5><div class="lp-o"></div></section>`).join('<div class="lp-arrow" aria-hidden="true">▼</div>')}</div>`;
    const ctx = {stage, i:0};
    const run = () => { ctx.r = compile(stage.querySelector('input').value); fill(ctx); D.livepipe.show(ctx, ctx.i, stage); };
    stage.querySelector('form').addEventListener('submit', ()=>{ run(); const d=host&&host._demo; if(d){ d.reset(); d.play(); } else { ctx.i=7; D.livepipe.show(ctx,7,stage); } });
    stage.querySelector('input').addEventListener('keydown', e=>e.stopPropagation());   // typing must not drive the slides
    ctx.run = run; run(); return ctx;
  },
  show(ctx, i, stage){ ctx.i=i; stage.querySelectorAll('.lp-ph').forEach(s=>{ const k=+s.dataset.i; s.classList.toggle('on',k<=i); s.classList.toggle('cur',k===i); });
    const cur=stage.querySelector('.lp-ph.cur'); if(cur && stage.closest('.pres') && i>0) cur.scrollIntoView({block:'nearest',behavior:'smooth'}); }
};
function fill(ctx){
  const r=ctx.r, o=[...ctx.stage.querySelectorAll('.lp-o')];
  o[0].innerHTML = `<code class="lp-src">${esc(r.src)}</code>`;
  o[1].innerHTML = `<div class="lp-toks">${r.tok.out.map(t=>`<span class="lp-tk ${t[1]}"><b>${esc(t[0])}</b><small>${esc(t[1]==='id'?'identifier':t[1]==='num'?'number':t[1])}</small></span>`).join('')}</div>${r.tok.errs.length?`<p class="lp-err">Lexical error: ${esc(r.tok.errs[0])}</p>`:''}`;
  if(r.err){ o[2].innerHTML=`<p class="lp-err">Syntax error: ${esc(r.err)}. The compiler stops here and reports the error.</p>`; o.slice(3).forEach(e=>e.innerHTML='<p class="tiny">Not reached: the program has an error.</p>'); return; }
  o[2].innerHTML = treeSVG(r.ast);
  o[3].innerHTML = `<table class="lp-sym"><tr><th>Name</th><th>Type</th><th>Note</th></tr>${r.sym.map(s=>`<tr><td>${esc(s.id)}</td><td>${s.type}</td><td>${s.note}</td></tr>`).join('')}</table><ul class="lp-chk">${r.checks.map(c=>`<li>${c}</li>`).join('')}</ul>`;
  o[4].innerHTML = `<pre class="code">${r.tac.map(esc).join('\n')}</pre>`;
  o[5].innerHTML = `<pre class="code">${r.opt.map(esc).join('\n')}</pre><p class="tiny">${r.opt.length<r.tac.length?`${r.tac.length} lines became ${r.opt.length}.`:'Nothing to fold here: the values are only known at run time.'}</p>`;
  o[6].innerHTML = `<pre class="code">${r.asm.map(esc).join('\n')}</pre>`;
  o[7].innerHTML = `<p>${r.out}</p>`;
}
window.CCLive = { compile };
})();
