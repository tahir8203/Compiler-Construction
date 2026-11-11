/* Live lab tools: tokenizer, FIRST/FOLLOW/LL(1) builder with parse trace, expression → AST / postfix / three-address code. */
(function(){
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $ = (q,r=document)=>r.querySelector(q);

/* ---------------- 1. Tokenizer (C-like) ---------------- */
const KW = new Set(['int','float','double','char','void','if','else','while','for','do','return','break','continue','switch','case','default','struct','const','bool','true','false']);
const OPS = ['<<=','>>=','==','!=','<=','>=','&&','||','++','--','+=','-=','*=','/=','->','<<','>>','+','-','*','/','%','=','<','>','!','&','|','^','~','?',':'];
const PUNCT = '(){}[];,.';
function opName(o){ return ({'==':'relop EQ','!=':'relop NE','<=':'relop LE','>=':'relop GE','<':'relop LT','>':'relop GT','=':'assign','&&':'and','||':'or','!':'not','++':'incr','--':'decr'})[o] || 'op'; }
function tokenize(src){
  const out=[], errs=[], sym=[]; let i=0, line=1, col=1;
  const adv=n=>{ for(let k=0;k<n;k++){ if(src[i]==='\n'){line++;col=1;} else col++; i++; } };
  while(i<src.length){
    const c=src[i], rest=src.slice(i), L=line, C=col;
    if(/\s/.test(c)){ adv(1); continue; }
    if(rest.startsWith('//')){ const e=src.indexOf('\n',i); adv((e<0?src.length:e)-i); continue; }
    if(rest.startsWith('/*')){ const e=src.indexOf('*/',i+2); if(e<0){ errs.push(`${L}:${C} unterminated comment`); adv(src.length-i); } else adv(e+2-i); continue; }
    let m;
    if((m=/^[A-Za-z_][A-Za-z0-9_]*/.exec(rest))){ const w=m[0]; if(KW.has(w)) out.push([w,'keyword',w.toUpperCase(),L,C]); else { let k=sym.indexOf(w); if(k<0){ sym.push(w); k=sym.length-1; } out.push([w,'id','entry '+(k+1),L,C]); } adv(w.length); continue; }
    if((m=/^\d+(\.\d+)?([eE][+-]?\d+)?/.exec(rest))){ const w=m[0]; if(/^[A-Za-z_]/.test(src.slice(i+w.length))){ const bad=/^[A-Za-z0-9_.]+/.exec(rest)[0]; errs.push(`${L}:${C} malformed number or identifier "${bad}"`); out.push([bad,'ERROR','malformed',L,C]); adv(bad.length); continue; } out.push([w,'num',w.includes('.')||/e/i.test(w)?'float '+w:'int '+w,L,C]); adv(w.length); continue; }
    if(c==='"'){ const e=src.indexOf('"',i+1), nl=src.indexOf('\n',i+1); if(e<0||(nl>=0&&nl<e)){ errs.push(`${L}:${C} unterminated string`); const end=nl<0?src.length:nl; out.push([src.slice(i,end),'ERROR','unterminated string',L,C]); adv(end-i); } else { out.push([src.slice(i,e+1),'literal','string',L,C]); adv(e+1-i); } continue; }
    if(c==="'"){ const e=src.indexOf("'",i+1); if(e<0){ errs.push(`${L}:${C} unterminated char`); adv(1); } else { out.push([src.slice(i,e+1),'literal','char',L,C]); adv(e+1-i); } continue; }
    const op=OPS.find(o=>rest.startsWith(o)); if(op){ out.push([op,opName(op),'',L,C]); adv(op.length); continue; }
    if(PUNCT.includes(c)){ out.push([c,'punct','',L,C]); adv(1); continue; }
    errs.push(`${L}:${C} illegal character '${c}' — deleted (panic mode)`); out.push([c,'ERROR','illegal char',L,C]); adv(1);
  }
  return {out,errs,sym};
}

/* ---------------- 2. Grammar / FIRST / FOLLOW / LL(1) ---------------- */
const EPS='ε';
function parseGrammar(txt){
  const prods=[], nts=[]; const errs=[];
  txt.split('\n').map(l=>l.trim()).filter(l=>l && !l.startsWith('#')).forEach((l,k)=>{
    const m=l.split(/->|→|::=/); if(m.length!==2){ errs.push(`line ${k+1}: use  A -> x y | z`); return; }
    const A=m[0].trim(); if(!A){ errs.push(`line ${k+1}: missing left side`); return; }
    if(!nts.includes(A)) nts.push(A);
    m[1].split('|').forEach(alt=>{ let b=alt.trim().split(/\s+/).filter(Boolean); if(!b.length||b.length===1&&/^(ε|eps|epsilon)$/i.test(b[0])) b=[]; prods.push([A,b]); });
  });
  const isNT=x=>nts.includes(x); const terms=[]; prods.forEach(p=>p[1].forEach(x=>{ if(!isNT(x)&&!terms.includes(x)) terms.push(x); }));
  return {prods,nts,terms,isNT,start:nts[0],errs};
}
function firstFollow(G){
  const F={}, FO={}; G.nts.forEach(n=>{F[n]=new Set(); FO[n]=new Set();}); FO[G.start].add('$');
  const firstSeq=seq=>{ const r=new Set(); for(const x of seq){ if(!G.isNT(x)){ r.add(x); return r; } F[x].forEach(t=>{ if(t!==EPS) r.add(t); }); if(!F[x].has(EPS)) return r; } r.add(EPS); return r; };
  let ch=true; while(ch){ ch=false; for(const [A,b] of G.prods){ const before=F[A].size; firstSeq(b).forEach(t=>F[A].add(t)); if(F[A].size!==before) ch=true; } }
  ch=true; while(ch){ ch=false; for(const [A,b] of G.prods){ b.forEach((B,k)=>{ if(!G.isNT(B)) return; const fs=firstSeq(b.slice(k+1)); const n=FO[B].size; fs.forEach(t=>{ if(t!==EPS) FO[B].add(t); }); if(fs.has(EPS)) FO[A].forEach(t=>FO[B].add(t)); if(FO[B].size!==n) ch=true; }); } }
  return {F,FO,firstSeq};
}
function ll1(G,ff){
  const M={}, conflicts=[]; G.nts.forEach(n=>M[n]={});
  G.prods.forEach((p,k)=>{ const [A,b]=p; const fs=ff.firstSeq(b); const put=a=>{ if(M[A][a]!=null && M[A][a]!==k){ conflicts.push([A,a]); M[A][a]=[].concat(M[A][a],k); } else M[A][a]=k; };
    fs.forEach(a=>{ if(a!==EPS) put(a); }); if(fs.has(EPS)) ff.FO[A].forEach(put); });
  return {M,conflicts};
}
function leftRecursive(G){ return G.prods.filter(([A,b])=>b[0]===A).map(p=>p[0]); }
function ll1Parse(G,T,input){
  const toks=input.trim().split(/\s+/).filter(Boolean).concat('$'); const st=['$',G.start]; let i=0; const rows=[]; let guard=0, ok=false;
  const show=p=>`${p[0]} → ${p[1].length?p[1].join(' '):EPS}`;
  while(guard++<500){
    const X=st[st.length-1], a=toks[i]; const row=[st.slice().reverse().join(' '), toks.slice(i).join(' ')];
    if(X==='$'&&a==='$'){ rows.push(row.concat('<span class="okk">accept ✔</span>')); ok=true; break; }
    if(!G.isNT(X)){ if(X===a){ st.pop(); i++; rows.push(row.concat('match '+esc(a))); } else { rows.push(row.concat(`<span class="err">error: expected ${esc(X)}, found ${esc(a)}</span>`)); break; } continue; }
    const e=T.M[X][a]; if(e==null){ rows.push(row.concat(`<span class="err">error: M[${esc(X)}, ${esc(a)}] is empty</span>`)); break; }
    const k=Array.isArray(e)?e[0]:e; const p=G.prods[k]; st.pop(); for(let j=p[1].length-1;j>=0;j--) st.push(p[1][j]); rows.push(row.concat(esc(show(p))));
  }
  return {rows,ok};
}

/* ---------------- 3. Expression translator ---------------- */
function exprParse(src){
  const t=[]; const re=/\s*([A-Za-z_]\w*|\d+(?:\.\d+)?|[-+*\/()=])\s*/y; let m, pos=0;
  while(pos<src.length){ re.lastIndex=pos; m=re.exec(src); if(!m){ if(/^\s*$/.test(src.slice(pos))) break; throw new Error(`unexpected character '${src[pos].trim()||src.slice(pos).trim()[0]}' at position ${pos+1}`); } t.push(m[1]); pos=re.lastIndex; }
  let i=0; const peek=()=>t[i], eat=x=>{ if(t[i]!==x) throw new Error(`expected '${x}' but found '${t[i]??'end'}'`); i++; };
  function S(){ if(/^[A-Za-z_]\w*$/.test(t[0]||'') && t[1]==='='){ const id=t[0]; i=2; const e=E(); return {op:'=',l:{leaf:id},r:e}; } return E(); }
  function E(){ let n=T(); while(peek()==='+'||peek()==='-'){ const o=t[i++]; n={op:o,l:n,r:T()}; } return n; }
  function T(){ let n=U(); while(peek()==='*'||peek()==='/'){ const o=t[i++]; n={op:o,l:n,r:U()}; } return n; }
  function U(){ if(peek()==='-'){ i++; return {op:'minus',l:U()}; } return F(); }
  function F(){ const x=peek(); if(x==='('){ i++; const e=E(); eat(')'); return e; } if(x && /^([A-Za-z_]\w*|\d+(\.\d+)?)$/.test(x)){ i++; return {leaf:x}; } throw new Error(`expected id, number or '(' but found '${x??'end'}'`); }
  const r=S(); if(i<t.length) throw new Error(`unexpected '${t[i]}' after a complete expression`); return r;
}
function translate(ast){
  const code=[], quads=[]; let n=0;
  function g(nd){ if(nd.leaf) return nd.leaf;
    if(nd.op==='='){ const r=g(nd.r); code.push(`${nd.l.leaf} = ${r}`); quads.push(['=',r,'',nd.l.leaf]); return nd.l.leaf; }
    if(nd.op==='minus'){ const a=g(nd.l); const t='t'+(++n); code.push(`${t} = minus ${a}`); quads.push(['minus',a,'',t]); return t; }
    const a=g(nd.l), b=g(nd.r), t='t'+(++n); code.push(`${t} = ${a} ${nd.op} ${b}`); quads.push([nd.op,a,b,t]); return t; }
  g(ast); return {code,quads};
}
function postfix(nd){ if(nd.leaf) return nd.leaf; if(nd.op==='minus') return postfix(nd.l)+' neg'; return postfix(nd.l)+' '+postfix(nd.r)+' '+nd.op; }
function treeTxt(nd,pre='',last=true,root=true){ const lab=nd.leaf||nd.op; let s=(root?'':pre+(last?'└─ ':'├─ '))+lab+'\n'; const kids=nd.leaf?[]:nd.r?[nd.l,nd.r]:[nd.l]; kids.forEach((k,j)=>{ s+=treeTxt(k, root?'':pre+(last?'   ':'│  '), j===kids.length-1, false); }); return s; }

/* ---------------- page ---------------- */
const DEF_SRC = `int count1 = 0;   // a comment
float rate = 6.02e23;
if (count1 <= 42 && rate != 0) {
    total = price # 2;     /* # is illegal */
    msg = "hello world";
}`;
const DEF_G = `E  -> T E'
E' -> + T E' | ε
T  -> F T'
T' -> * F T' | ε
F  -> ( E ) | id`;
function render(app){
  app.innerHTML=`<div class="wrap"><div class="shead"><h1>🧪 Lab tools</h1><p class="muted">Try the algorithms from the lectures on your own input. Everything runs in your browser.</p>
  <div class="toolbar"><a class="btn sm" href="#t1" data-j>🔤 Tokenizer</a><a class="btn sm" href="#t2" data-j>⬇️ LL(1) table builder</a><a class="btn sm" href="#t3" data-j>🧾 Expression → three-address code</a></div></div>
  <section class="card tool" id="t1"><h2>🔤 Tokenizer (lexical analyzer)</h2><p class="tiny">C-like rules: keywords, identifiers, numbers (with fraction/exponent), strings, operators (longest match), punctuation, comments. Illegal characters are reported and deleted (panic mode). Used in Sessions 3–9.</p>
    <textarea id="src" aria-label="Source code">${esc(DEF_SRC)}</textarea><div class="toolbar"><button class="btn pri" id="tok">Tokenize</button></div><div class="out" id="tokOut"></div></section><br>
  <section class="card tool" id="t2"><h2>⬇️ FIRST, FOLLOW and LL(1) table builder</h2><p class="tiny">One production per line: <code>A -> x y | z</code>. Use <code>ε</code> or <code>eps</code> for empty. The first left side is the start symbol. Separate symbols with spaces. Used in Sessions 15–19.</p>
    <textarea id="gram" aria-label="Grammar">${esc(DEF_G)}</textarea>
    <label class="tiny">Input tokens (space separated): <input type="text" id="gin" value="id + id * id"></label>
    <div class="toolbar"><button class="btn pri" id="ll">Build table & parse</button><button class="btn" id="llbad">Try a left-recursive grammar</button></div><div class="out" id="llOut"></div></section><br>
  <section class="card tool" id="t3"><h2>🧾 Expression → AST, postfix and three-address code</h2><p class="tiny">Operators: = + − * / unary − and parentheses. Used in Sessions 23–28.</p>
    <input type="text" id="ex" value="a = b * -c + b * -c" aria-label="Expression"><div class="toolbar"><button class="btn pri" id="tr">Translate</button></div><div class="out" id="trOut"></div></section></div>`;
  app.querySelectorAll('[data-j]').forEach(a=>a.onclick=e=>{ e.preventDefault(); $(a.getAttribute('href'),app).scrollIntoView({behavior:'smooth'}); });
  const runTok=()=>{ const r=tokenize($('#src').value);
    $('#tokOut').innerHTML=`<p><b>${r.out.length}</b> tokens · <b>${r.sym.length}</b> identifiers in the symbol table · ${r.errs.length?`<span class="err">${r.errs.length} lexical error(s)</span>`:'<span class="okk">no lexical errors</span>'}</p>
    <table><tr><th>#</th><th>Lexeme</th><th>Token</th><th>Attribute</th><th>Line:Col</th></tr>${r.out.map((t,k)=>`<tr><td>${k+1}</td><td>${esc(t[0])}</td><td class="${t[1]==='ERROR'?'err':''}">${esc(t[1])}</td><td>${esc(t[2])}</td><td>${t[3]}:${t[4]}</td></tr>`).join('')}</table>
    ${r.errs.length?`<h3>Errors</h3><ul>${r.errs.map(e=>`<li class="err">${esc(e)}</li>`).join('')}</ul>`:''}
    <h3>Symbol table</h3><table><tr><th>Entry</th><th>Lexeme</th></tr>${r.sym.map((s,k)=>`<tr><td>${k+1}</td><td>${esc(s)}</td></tr>`).join('')||'<tr><td colspan="2">empty</td></tr>'}</table>`; };
  const runLL=()=>{ const G=parseGrammar($('#gram').value); const o=$('#llOut');
    if(G.errs.length||!G.nts.length){ o.innerHTML=`<p class="err">${esc(G.errs.join('; ')||'Enter a grammar.')}</p>`; return; }
    const ff=firstFollow(G), T=ll1(G,ff), lr=leftRecursive(G); const set=s=>'{ '+[...s].join(', ')+' }'; const cols=G.terms.concat('$');
    const pr=k=>{ const p=G.prods[k]; return esc(`${p[0]} → ${p[1].length?p[1].join(' '):EPS}`); };
    let h=`<h3>FIRST and FOLLOW</h3><table><tr><th>Non-terminal</th><th>FIRST</th><th>FOLLOW</th></tr>${G.nts.map(n=>`<tr><td>${esc(n)}</td><td>${esc(set(ff.F[n]))}</td><td>${esc(set(ff.FO[n]))}</td></tr>`).join('')}</table>
    <h3>LL(1) table</h3><table><tr><th></th>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${G.nts.map(n=>`<tr><th>${esc(n)}</th>${cols.map(c=>{ const e=T.M[n][c]; return e==null?'<td></td>':Array.isArray(e)?`<td class="cf">${e.map(pr).join('<br>')}</td>`:`<td>${pr(e)}</td>`; }).join('')}</tr>`).join('')}</table>`;
    if(lr.length) h+=`<p class="err">Left recursion in: ${esc([...new Set(lr)].join(', '))}. Eliminate it: A → Aα | β becomes A → βA′, A′ → αA′ | ε.</p>`;
    if(T.conflicts.length){ h+=`<p class="err">Not LL(1): ${T.conflicts.length} conflicting cell(s) (shown in red).</p>`; }
    else { const P=ll1Parse(G,T,$('#gin').value); h+=`<p class="okk">The grammar is LL(1).</p><h3>Parse trace for: ${esc($('#gin').value)}</h3><table><tr><th>#</th><th>Stack (top at left)</th><th>Input</th><th>Action</th></tr>${P.rows.map((r,k)=>`<tr><td>${k+1}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td></tr>`).join('')}</table>`; }
    o.innerHTML=h; };
  const runTr=()=>{ const o=$('#trOut'); try{ const a=exprParse($('#ex').value); const t=translate(a);
      o.innerHTML=`<div class="grid g2"><div><h3>Syntax tree</h3><pre class="code">${esc(treeTxt(a))}</pre><h3>Postfix</h3><pre class="code">${esc(postfix(a))}</pre></div>
      <div><h3>Three-address code</h3><pre class="code">${esc(t.code.join('\n'))}</pre><h3>Quadruples</h3><table><tr><th>#</th><th>op</th><th>arg1</th><th>arg2</th><th>result</th></tr>${t.quads.map((q,k)=>`<tr><td>${k}</td>${q.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div></div>`;
    }catch(e){ o.innerHTML=`<p class="err">Syntax error: ${esc(e.message)}</p>`; } };
  $('#tok').onclick=runTok; $('#ll').onclick=runLL; $('#tr').onclick=runTr;
  $('#llbad').onclick=()=>{ $('#gram').value="E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id"; runLL(); };
  runTok(); runLL(); runTr();
}
window.CCTools = { render, tokenize, parseGrammar, firstFollow, ll1, ll1Parse, exprParse, translate };
})();
