/* Compiler Construction portal layer: app shell (tab bar, top bar, search, toasts), student dashboard,
   practice centre, compiler pipeline visualizer, resources, profile. Loaded before app.js; uses window.CCApp lazily. */
(function(){
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const A=()=>window.CCApp, T=()=>window.CCTools, D=()=>window.CCData;
const app=()=>$('#app');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s||'').replace(/<[^>]+>/g,'');
const IN_APP=()=>!!window.AndroidApp;
const APK='https://github.com/tahir8203/Compiler-Construction/releases/latest/download/CompilerConstruction.apk';
const SITE='https://compiler-construction-phi.vercel.app/';

/* ---------- portal storage ---------- */
const PK='cc-portal-v1';
const blank=()=>({name:'',roll:'',start:'',skip:0,xp:0,days:{},notes:{},best:{},got:{},cnt:{},bestStreak:0});
let ps=blank(); try{ ps=Object.assign(ps, JSON.parse(localStorage.getItem(PK)||'{}')); }catch(e){}
const save=()=>{ try{ localStorage.setItem(PK, JSON.stringify(ps)); }catch(e){} };
const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dkey(new Date());
function streak(){ let n=0; const d=new Date(); while(ps.days[dkey(d)]){ n++; d.setDate(d.getDate()-1); } return n; }
function markDay(){ if(!ps.days[today()]){ ps.days[today()]=1; const s=streak(); if(s>ps.bestStreak) ps.bestStreak=s; save(); } }
function curWeek(){ if(!ps.start) return 0; const s=new Date(ps.start+'T00:00:00'); if(isNaN(s)) return 0; const w=Math.floor((Date.now()-s.getTime())/6048e5)+1; return w<1?0:Math.min(w,17); }

/* ---------- levels / XP ---------- */
const LV=['Lexer Novice','Token Hunter','Automata Builder','Grammar Smith','Parser Pro','Semantic Sage','Code Generator','Compiler Master'];
const LVXP=250;
const lvl=()=>Math.min(Math.floor(ps.xp/LVXP), LV.length-1);
function addXP(n, why){ const before=lvl(); ps.xp=Math.max(0,ps.xp+n); save(); if(n>0) toast(`<b>+${n} XP</b> · ${esc(why)}`); if(lvl()>before){ setTimeout(()=>{ toast(`🎉 Level up: <b>${LV[lvl()]}</b>`); confetti(); },500); } }
function once(key, fn){ if(ps.got[key]) return false; ps.got[key]=1; save(); fn(); return true; }

/* ---------- feedback: haptics, toast, confetti ---------- */
function haptic(ms){ try{ if(IN_APP()&&AndroidApp.haptic) AndroidApp.haptic(ms||12); else if(navigator.vibrate) navigator.vibrate(ms||10); }catch(e){} }
function toast(html){ let box=$('#toasts'); if(!box) return; const t=document.createElement('div'); t.className='toast'; t.innerHTML=html; box.append(t); setTimeout(()=>t.classList.add('out'),2600); setTimeout(()=>t.remove(),3100); }
function confetti(){ if(matchMedia('(prefers-reduced-motion:reduce)').matches) return; const c=document.createElement('div'); c.className='confetti'; const col=['#3b82f6','#22d3ee','#34d399','#fbbf24','#a78bfa','#f87171'];
  for(let i=0;i<46;i++){ const p=document.createElement('i'); p.style.cssText=`left:${Math.random()*100}%;background:${col[i%col.length]};animation-delay:${Math.random()*.5}s;animation-duration:${1.6+Math.random()*1.2}s;transform:rotate(${Math.random()*360}deg)`; c.append(p); }
  document.body.append(c); setTimeout(()=>c.remove(),3200); }

/* ---------- small UI helpers ---------- */
function ring(p, big, sub){ return `<div class="ringw"><svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><circle class="rb" cx="50" cy="50" r="42"/><circle class="rf" cx="50" cy="50" r="42" stroke-dasharray="264" stroke-dashoffset="264" data-p="${p}"/></svg><div class="rc"><b>${big}</b><span>${sub||''}</span></div></div>`; }
function animate(root){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ $$('.rf[data-p]',root).forEach(c=>{ c.style.strokeDashoffset=264*(1-Math.min(100,+c.dataset.p)/100); }); $$('.xbar i[data-w]',root).forEach(b=>b.style.width=b.dataset.w+'%'); }));
  $$('[data-count]',root).forEach(el=>{ const n=+el.dataset.count, suf=el.dataset.suf||''; if(!n){ el.textContent='0'+suf; return; } const t0=performance.now(); const tick=t=>{ const k=Math.min(1,(t-t0)/900); el.textContent=Math.round(n*(1-Math.pow(1-k,3)))+suf; if(k<1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
}
function sheet(html, cls){ const w=document.createElement('div'); w.className='sheetw '+(cls||''); w.innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`; w.addEventListener('click',e=>{ if(e.target===w||e.target.closest('[data-close]')) closeSheet(w); }); document.body.append(w); requestAnimationFrame(()=>w.classList.add('open')); return w; }
function closeSheet(w){ if(!w) return; w.classList.remove('open'); setTimeout(()=>w.remove(),260); }
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pick=a=>a[Math.floor(Math.random()*a.length)];
let cleanups=[]; const onLeave=f=>cleanups.push(f);
function bank(filter){ const out=[]; A().sessions.forEach(s=>{ if(filter&&!filter(s)) return; (s.quiz||[]).forEach(q=>out.push({q,s})); ((s.assessment&&s.assessment.mcq)||[]).forEach(q=>out.push({q,s})); }); return out; }

/* ---------- shell: tab bar, toasts, header ---------- */
const ICON={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',learn:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>',practice:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',tools:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 14h9"/>',me:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'};
const TABS=[['home','#/','Home'],['learn','#/sessions','Learn'],['practice','#/practice','Practice'],['tools','#/tools','Tools'],['me','#/me','Me']];
const TABOF={'':'home',sessions:'learn',s:'learn',practice:'practice',flash:'practice',tools:'tools',pipeline:'tools',me:'me',bookmarks:'me'};
const TITLES={'':'Compiler Construction',sessions:'Sessions',practice:'Practice',tools:'Lab tools',pipeline:'Pipeline visualizer',sheets:'Resources',me:'My profile',glossary:'Glossary',flash:'Flashcards',outline:'Course outline',bookmarks:'Progress',assess:'Assessments',revision:'Revision'};
function buildShell(){
  const nav=document.createElement('nav'); nav.className='tabbar'; nav.id='tabbar'; nav.setAttribute('aria-label','App navigation');
  nav.innerHTML=TABS.map(t=>`<a class="tab" href="${t[1]}" data-t="${t[0]}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[t[0]]}</svg><span>${t[2]}</span></a>`).join('');
  document.body.append(nav);
  nav.addEventListener('click',e=>{ const a=e.target.closest('.tab'); if(!a) return; haptic(8); if(a.getAttribute('href')===(location.hash||'#/')) window.scrollTo({top:0,behavior:'smooth'}); });
  const tb=document.createElement('div'); tb.id='toasts'; tb.setAttribute('aria-live','polite'); document.body.append(tb);
  const rp=document.createElement('div'); rp.id='rprog'; rp.innerHTML='<i></i>'; document.body.append(rp);
  const bb=$('#backBtn'); if(bb) bb.onclick=()=>{ haptic(8); if(history.length>1) history.back(); else location.hash='#/'; };
  const sb=$('#searchBtn'); if(sb) sb.onclick=openSearch;
  document.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); openSearch(); } });
  document.addEventListener('pointerdown',e=>{ const b=e.target.closest('.btn,.tile,.op,.tab,.qopt'); if(b){ b.classList.add('tap'); setTimeout(()=>b.classList.remove('tap'),180); } },{passive:true});
  if(IN_APP()) document.documentElement.classList.add('inapp');
  if('serviceWorker' in navigator && !IN_APP() && location.protocol==='https:') addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
let installEvt=null; addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); installEvt=e; });

function afterRoute(h){
  cleanups.forEach(f=>{ try{f()}catch(e){} }); cleanups=[];
  markDay();
  const k=h[0]||'', tab=TABOF[k];
  $$('#tabbar .tab').forEach(a=>a.classList.toggle('on', a.dataset.t===tab));
  const root=['','sessions','practice','tools','me'].includes(k) && !h[1];
  document.body.classList.toggle('sub', !root); document.body.classList.toggle('homepg', k==='');
  const bb=$('#backBtn'); if(bb) bb.hidden=root;
  let title=TITLES[k]||'Compiler Construction'; if(k==='s'){ const s=A().sess(h[1]); if(s) title=A().label(s); }
  if(k==='practice'&&h[1]) title=({quick:'Quick quiz',mid:'Midterm mock',final:'Final mock',ff:'FIRST & FOLLOW trainer',tok:'Token challenge',tac:'Three-address code'}[h[1]])||title;
  const pt=$('#ptitle'); if(pt) pt.textContent=title;
  document.title=(k===''?'':title+' · ')+'Compiler Construction';
  const me=$('#meBtn'); if(me) me.textContent=ps.name?ps.name.trim()[0].toUpperCase():'👤';
  $$('#nav a').forEach(a=>{ const hr=a.getAttribute('href'); a.classList.toggle('on', hr==='#/'+k || (k==='s'&&hr==='#/sessions') || (k==='pipeline'&&hr==='#/tools') || ((k==='flash'||k==='glossary')&&hr==='#/revision')); });
  const el=app(); el.classList.remove('pg'); void el.offsetWidth; el.classList.add('pg');
  $('#rprog').classList.remove('show');
  if(k==='s') enhanceStudy(h[1]);
  if(k==='tools') enhanceTools();
  if(k==='revision') enhanceRevision();
  animate(el);
  if(jump){ const j=jump; jump=null; setTimeout(()=>{ const t=document.getElementById(j); if(t){ t.scrollIntoView({block:'start'}); t.classList.add('flashhi'); setTimeout(()=>t.classList.remove('flashhi'),1600); } },120); }
  if(k==='' && !ps.name && !ps.skip) setTimeout(onboard,500);
}
let jump=null;

/* ---------- study page extras: notes, reading progress ---------- */
function enhanceStudy(id){
  const s=A().sess(id), el=app(); if(!s) return; const terms=$('#terms',el); if(!terms) return;
  const box=document.createElement('div'); box.innerHTML=`<div class="card notes" id="notes"><h2>📝 My notes</h2><p class="tiny">Private to this device. Saved automatically.</p><textarea id="noteTa" placeholder="Write your own summary, questions for the teacher, or exam reminders…">${esc(ps.notes[s.id]||'')}</textarea><div class="tiny" id="noteSt"></div></div><br>`;
  terms.before(...box.childNodes);
  let tm; $('#noteTa',el).oninput=e=>{ clearTimeout(tm); tm=setTimeout(()=>{ const v=e.target.value.trim(); if(v) ps.notes[s.id]=e.target.value; else delete ps.notes[s.id]; save(); $('#noteSt',el).textContent='Saved ✓'; },500); };
  const toc=$('.toc',el); if(toc){ const a=document.createElement('a'); a.href='#notes'; a.textContent='📝 My notes'; a.onclick=e=>{ e.preventDefault(); $('#notes',el).scrollIntoView({behavior:'smooth'}); }; toc.append(a); }
  const bar=$('#rprog'), fill=$('i',bar); bar.classList.add('show');
  const onS=()=>{ const max=document.documentElement.scrollHeight-innerHeight; fill.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'; };
  addEventListener('scroll',onS,{passive:true}); onS(); onLeave(()=>removeEventListener('scroll',onS));
}
function enhanceTools(){ const tb=$('.shead .toolbar',app()); if(tb && !$('#pvLink',tb)){ const a=document.createElement('a'); a.className='btn sm pri'; a.id='pvLink'; a.href='#/pipeline'; a.textContent='🎬 Pipeline visualizer'; tb.prepend(a); } }
function enhanceRevision(){ const tb=$('.shead .toolbar',app()); if(tb && !$('#rvX',tb)){ const f=document.createElement('span'); f.id='rvX'; f.style.display='contents'; f.innerHTML='<a class="btn" href="#/glossary">📘 Glossary</a><a class="btn" href="#/sheets">📑 Cheat sheets</a><a class="btn" href="#/practice">🎯 Practice</a>'; tb.append(f); } }

/* ---------- hooks from app.js ---------- */
function onDone(s,on){ haptic(18); if(on){ if(!once('d'+s.id,()=>addXP(50,'Session completed'))) toast('✔ Marked as completed'); confetti(); const all=A().sessions.every(x=>A().st.done[x.id]); if(all) setTimeout(()=>toast('🏆 Whole course completed. Well done!'),900); } else toast('Marked as not completed'); }
function onQuiz(s,r,n){ haptic(14); once('k'+s.id,()=>{ if(r) addXP(r*10,`Knowledge check ${r}/${n}`); }); if(r===n) confetti(); }
function onAssess(s,r,n){ once('a'+s.id,()=>{ if(r) addXP(r*5,`${s.assessment.title} ${r}/${n}`); }); }
function onPres(on){ document.body.classList.toggle('presenting',on); try{ if(IN_APP()&&AndroidApp.keepAwake) AndroidApp.keepAwake(!!on); if(!on&&IN_APP()&&AndroidApp.orient) AndroidApp.orient('auto'); }catch(e){}
  if(on && IN_APP() && AndroidApp.orient){ const hd=$('#pres .phead'); if(hd && !$('#pRot',hd)){ const b=document.createElement('button'); b.className='iconbtn'; b.id='pRot'; b.title='Rotate screen'; b.setAttribute('aria-label','Rotate screen'); b.textContent='⟳'; let land=false; b.onclick=()=>{ land=!land; AndroidApp.orient(land?'landscape':'auto'); }; const x=$('#pX',hd); x?x.before(b):hd.append(b); } } }
function reset(){ ps=Object.assign(blank(),{name:ps.name,roll:ps.roll,start:ps.start,skip:ps.skip}); save(); }

/* ---------- onboarding ---------- */
function onboard(){ if($('.sheetw')) return;
  const w=sheet(`<div class="ob"><div class="oblogo">CC</div><h2>Welcome to Compiler Construction</h2><p class="muted">Set up your student portal. Everything is saved only on this device.</p>
  <label>Your name<input id="obN" type="text" autocomplete="name" placeholder="e.g. Ali Ahmad" maxlength="40"></label>
  <label>Roll number <span class="tiny">(optional)</span><input id="obR" type="text" placeholder="e.g. BSCS-22-014" maxlength="30"></label>
  <label>Semester start date <span class="tiny">(optional, shows the current week)</span><input id="obS" type="date"></label>
  <div class="toolbar"><button class="btn pri" id="obGo">Start learning →</button><button class="btn" id="obSkip">Skip</button></div></div>`);
  $('#obGo',w).onclick=()=>{ ps.name=$('#obN',w).value.trim(); ps.roll=$('#obR',w).value.trim(); ps.start=$('#obS',w).value; ps.skip=1; save(); closeSheet(w); haptic(); home(); afterRoute(['']); if(ps.name) toast(`Welcome, <b>${esc(ps.name)}</b> 👋`); };
  $('#obSkip',w).onclick=()=>{ ps.skip=1; save(); closeSheet(w); };
}

/* ---------- mini pipeline (home hero) ---------- */
function postfix(n){ if(n.leaf) return n.leaf; if(n.op==='minus') return postfix(n.l)+' neg'; return postfix(n.l)+' '+postfix(n.r)+' '+n.op; }
function layout(ast){ let leaf=0, maxd=0; const nodes=[];
  (function walk(n,d){ const kids=n.leaf?[]:(n.r?[n.l,n.r]:[n.l]); const ks=kids.map(k=>walk(k,d+1)); const me={lab:n.leaf||(n.op==='minus'?'neg':n.op), leaf:!!n.leaf, d, kids:ks}; me.x=ks.length?ks.reduce((a,k)=>a+k.x,0)/ks.length:(leaf++)*62+36; me.y=28+d*56; if(d>maxd) maxd=d; nodes.push(me); return me; })(ast,0);
  return {nodes, w:Math.max(leaf*62+10,140), h:(maxd+1)*56+8}; }
function treeSVG(ast, step){ const L=layout(ast);
  const g=L.nodes.map(n=>{ const w=Math.max(34,n.lab.length*9+18); return `<g class="tn ${n.leaf?'lf':'opn'} ${step?'pv-h':''}" ${step?step(n):''}>${n.kids.map(k=>`<line x1="${n.x}" y1="${n.y+13}" x2="${k.x}" y2="${k.y-13}"/>`).join('')}<rect x="${n.x-w/2}" y="${n.y-14}" width="${w}" height="28" rx="14"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle">${esc(n.lab)}</text></g>`; }).join('');
  return `<svg class="ptree" viewBox="0 0 ${L.w} ${L.h}" style="max-width:${L.w*1.25}px" role="img" aria-label="Syntax tree">${g}</svg>`; }
function miniPipe(el){
  const src='x = a + b * 2'; let ast,tr,tk; try{ tk=T().tokenize(src).out; ast=T().exprParse(src); tr=T().translate(ast); }catch(e){ return; }
  const st=[['Source','<div class="mp-src">'+src.split('').map((c,i)=>`<span style="animation-delay:${i*45}ms">${c===' '?'&nbsp;':esc(c)}</span>`).join('')+'</div><p class="tiny">A program is just a stream of characters.</p>'],
   ['Tokens','<div class="mp-tok">'+tk.map((t,i)=>`<span class="tkc" style="animation-delay:${i*90}ms"><b>${esc(t[0])}</b><i>${esc(t[1].replace('relop ',''))}</i></span>`).join('')+'</div><p class="tiny">The scanner groups characters into tokens.</p>'],
   ['Syntax tree',treeSVG(ast)+'<p class="tiny">The parser builds a tree: * binds tighter than +.</p>'],
   ['Three-address code','<pre class="code mp-code">'+tr.code.map((c,i)=>`<span style="animation-delay:${i*260}ms">${esc(c)}</span>`).join('\n')+'</pre><p class="tiny">One operator per instruction, with temporaries.</p>']];
  el.innerHTML=`<div class="mp-head">${st.map((s,i)=>`<button data-i="${i}">${s[0]}</button>`).join('<i>›</i>')}</div><div class="mp-body" id="mpBody"></div><a class="btn sm" href="#/pipeline">🎬 Try your own statement →</a>`;
  let i=0, tm; const show=k=>{ i=k; $('#mpBody',el).innerHTML=`<div class="mp-stage">${st[k][1]}</div>`; $$('.mp-head button',el).forEach((b,j)=>b.classList.toggle('on',j===k)); };
  const run=()=>{ tm=setInterval(()=>show((i+1)%st.length),3200); };
  el.onclick=e=>{ const b=e.target.closest('.mp-head button'); if(b){ clearInterval(tm); show(+b.dataset.i); run(); } };
  show(0); run(); onLeave(()=>clearInterval(tm));
}

/* ---------- HOME: student dashboard ---------- */
function home(){
  const a=A(), S=a.sessions, st=a.st, p=a.pct(), doneN=S.filter(s=>st.done[s.id]).length;
  const hr=new Date().getHours(), greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const last=st.last&&a.sess(st.last.s), wk=curWeek(), sk=streak(), L=lvl();
  let next=S.filter(s=>!st.done[s.id]); if(wk){ const cur=next.filter(s=>s.week===wk); next=cur.concat(next.filter(s=>s.week!==wk)); } next=next.slice(0,4);
  const ups=S.filter(s=>s.assessment&&!st.done[s.id]).slice(0,3);
  const B=bank(), qd=B.length?B[[...today()].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)%B.length]:null;
  const tiles=[['#/sessions','📚','Sessions','30 + mid & final'],['#/w/'+((next[0]||S[0]).id),'▶️','Watch','animated lecture'],['#/practice','🎯','Practice','quizzes & trainers'],['#/pipeline','🎬','Pipeline','see a compiler work'],['#/tools','🧪','Lab tools','tokenizer · LL(1) · TAC'],['#/sheets','📑','Cheat sheets','formulas & rules'],['#/flash','🃏','Flashcards','key terms'],['#/assess','📝','Assessments','quizzes · assignments'],['#/revision','🔁','Revision','all key points'],['#/glossary','📘','Glossary','every term'],['#/sheets/viva','🎤','Viva Q&A','oral exam prep'],['#/outline','🗓️','Outline','calendar & policies']];
  const weeks=[]; for(let w=1;w<=17;w++) weeks.push({w,list:S.filter(s=>s.week===w)});
  app().innerHTML=`
  <section class="dhero"><div class="wrap dheroGrid"><div>
    <span class="chip">${wk?`📅 Week ${wk} of 17 · `:''}BS Computer Science · 3 Credit Hours</span>
    <h1>${greet}${ps.name?`, <span>${esc(ps.name.split(' ')[0])}</span>`:''} 👋</h1>
    <p class="lead">${doneN===0?'Your Compiler Construction portal: animated lectures, practice, lab tools and exam preparation in one place.':p===100?'You have completed the whole course. Keep revising with practice quizzes and cheat sheets.':`You have completed <b>${doneN}</b> of ${S.length} units. Keep going!`}</p>
    <div class="cta">${last?`<a class="btn pri" href="#/p/${last.id}/${st.last.k}">⏯ Resume ${esc(a.short(last))} · slide ${st.last.k}</a>`:`<a class="btn pri" href="#/s/1">Start Session 1 →</a>`}<a class="btn watch" href="#/w/${(next[0]||S[0]).id}">▶ Watch next lecture</a><a class="btn" href="#/practice/quick">🎯 Quick quiz</a>${IN_APP()?'':`<a class="btn dl" href="${APK}">📱 Android app</a>`}</div>
  </div>
  <div class="card mini" id="mini" aria-label="Animated compiler pipeline"></div></div></section>
  <div class="wrap dash">
    <div class="dgrid">
      <a class="card pcard" href="#/me">${ring(p,`<span data-count="${p}" data-suf="%">0%</span>`,'complete')}<div class="grow"><div class="tiny">LEVEL ${L+1}</div><h3>${LV[L]}</h3><div class="xbar"><i data-w="${L>=LV.length-1?100:Math.round(ps.xp%LVXP/LVXP*100)}"></i></div><div class="tiny"><b data-count="${ps.xp}">0</b> XP${L<LV.length-1?` · ${LVXP-ps.xp%LVXP} to ${LV[L+1]}`:''}</div></div></a>
      <div class="card statc"><div><b>🔥 <span data-count="${sk}">0</span></b><span>day streak</span></div><div><b data-count="${doneN}">0</b><span>of ${S.length} units</span></div><div><b data-count="${Object.keys(st.quiz).length}">0</b><span>quizzes done</span></div><div><b data-count="${Object.keys(ps.notes).length}">0</b><span>notes</span></div></div>
    </div>
    <section class="sec"><h2>Quick access</h2><div class="tiles">${tiles.map((t,i)=>`<a class="tile" href="${t[0]}" style="--i:${i}"><span class="ti">${t[1]}</span><b>${t[2]}</b><small>${t[3]}</small></a>`).join('')}</div></section>
    <section class="sec"><div class="sech"><h2>${wk?`This week and next`:'Up next'}</h2><a href="#/sessions">All sessions →</a></div>
      <div class="hscroll">${next.map(s=>`<a class="ncard" href="#/s/${s.id}"><div class="nn">${s.exam?(s.id===90?'M':'F'):s.id}</div><div class="tiny">Week ${s.week} · ${esc(s.unit)}</div><h4>${esc(s.title)}</h4><div class="nfoot">${a.kindChip(s)}<span class="chip">${a.deck(s).length} slides</span></div></a>`).join('')||'<p class="muted">All units completed 🎉</p>'}</div></section>
    <div class="grid g2">
      ${qd?`<section class="card qday" id="qday"><div class="sech"><h3>💡 Question of the day</h3><span class="chip">${esc(a.short(qd.s))}</span></div><div class="quiz">${a.mcqBlock([qd.q],'')}</div><a class="tiny" href="#/s/${qd.s.id}">From: ${esc(qd.s.title)} →</a></section>`:''}
      <section class="card"><div class="sech"><h3>📌 Coming up</h3><a href="#/assess">All →</a></div>${ups.map(s=>`<a class="uprow" href="#/s/${s.id}"><span class="chip ${s.assessment.kind==='quiz'?'q':s.assessment.kind==='assignment'?'a':'x'}">${esc(s.assessment.kind)}</span><span class="grow"><b>${esc(s.assessment.title)}</b><small>Week ${s.week} · ${esc(s.title)}</small></span><span>›</span></a>`).join('')||'<p class="muted">Nothing pending.</p>'}
        <div class="toolbar"><a class="btn sm" href="#/practice/mid">📝 Midterm mock</a><a class="btn sm" href="#/practice/final">🎓 Final mock</a></div></section>
    </div>
    <section class="sec"><h2>Course roadmap</h2><p class="muted">17 weeks · Mid Term in Week 9 · Final Term in Week 17.</p>
      <div class="road">${weeks.map(({w,list})=>`<div class="wk ${w===wk?'now':''}"><div class="n">WEEK ${w}${w===wk?' · NOW':''}</div><h4>${esc(list[0]?list[0].unit:'')}</h4>${list.map(s=>`<a href="#/s/${s.id}"><span class="d ${st.done[s.id]?'done':''}"></span>${esc(a.short(s))} · ${esc(s.title)}</a>`).join('')}<div style="margin-top:6px">${list.map(a.kindChip).join(' ')}</div></div>`).join('')}</div></section>
    <section class="sec"><h2>Course learning outcomes</h2><div class="grid g2">${window.COURSE.outcomes.map((o,i)=>`<div class="card"><span class="chip ok">LO${i+1}</span><p style="margin:.6em 0 0">${esc(o)}</p></div>`).join('')}</div></section>
    <section class="sec">${a.instructorCard()}</section>
    <p class="tiny" style="text-align:center"><a href="lectures-1-3.html">📘 Classic Lectures 1–3 page</a></p>
  </div>`;
  miniPipe($('#mini'));
  if(qd){ const box=$('#qday'); if(ps.got['q'+today()]) box.classList.add('answered'); a.wireChoices(box,{mcq:[qd.q]},(r)=>{ haptic(14); once('q'+today(),()=>{ if(r){ addXP(10,'Question of the day'); } }); if(r) confetti(); }); }
}

/* ---------- PRACTICE ---------- */
function practice(h){ const m=h[1]; if(m==='quick') return quickSetup(); if(m==='mid') return startExam('mid'); if(m==='final') return startExam('final'); if(m==='ff') return ffTrainer(); if(m==='tok') return tokChallenge(); if(m==='tac') return tacPractice();
  const b=ps.best, c=ps.cnt;
  const cards=[['#/practice/quick','⚡','Quick quiz','10 random questions from any unit. Instant explanations.',b.quick!=null?`Best ${b.quick}/10`:'New'],
   ['#/practice/mid','📝','Midterm mock','20 questions from Weeks 1–8, 20 minutes.',b.mid!=null?`Best ${b.mid}/20`:'New'],
   ['#/practice/final','🎓','Final mock','25 questions from the whole course, 25 minutes.',b.final!=null?`Best ${b.final}/25`:'New'],
   ['#/practice/ff','🥇','FIRST & FOLLOW trainer','Get a grammar, fill in the sets, check them instantly.',c.ff?`${c.ff} solved`:'New'],
   ['#/practice/tok','🔤','Token challenge','How many tokens does the scanner produce?',c.tok?`${c.tok} solved`:'New'],
   ['#/practice/tac','🧾','Three-address code','Translate an expression, then compare with the solution.',c.tac?`${c.tac} done`:'New'],
   ['#/flash','🃏','Flashcards','Flip through every key term.',''],['#/pipeline','🎬','Pipeline visualizer','Watch your own statement go through every phase.','']];
  app().innerHTML=`<div class="wrap"><div class="shead"><h1>🎯 Practice centre</h1><p class="muted">${bank().length} questions with explanations, three trainers checked by the lab tools, and timed mock exams. Practice earns XP.</p></div>
  <div class="grid g3">${cards.map((x,i)=>`<a class="scard pc" href="${x[0]}" style="--i:${i}"><div class="top2"><div class="num">${x[1]}</div><div><h3>${x[2]}</h3></div></div><p>${x[3]}</p>${x[4]?`<div><span class="chip ${/Best|solved|done/.test(x[4])?'ok':''}">${x[4]}</span></div>`:''}</a>`).join('')}</div></div>`;
}
function quickSetup(){ const units=[...new Set(A().sessions.map(s=>s.unit))];
  app().innerHTML=`<div class="wrap narrow"><div class="shead"><h1>⚡ Quick quiz</h1><p class="muted">10 questions. Choose a topic or mix everything.</p></div><div class="card"><label class="fld">Topic<select id="qu"><option value="">All topics (mixed)</option>${units.map(u=>`<option>${esc(u)}</option>`).join('')}</select></label><div class="toolbar"><button class="btn pri" id="qgo">Start →</button><a class="btn" href="#/practice">Back</a></div></div></div>`;
  $('#qgo').onclick=()=>{ const u=$('#qu').value; const qs=shuffle(bank(u?s=>s.unit===u:null)).slice(0,10); runQuiz({title:'Quick quiz'+(u?' · '+u:''),qs,key:'quick',xp:5,again:'#/practice/quick'}); }; }
function startExam(kind){ const mid=kind==='mid', n=mid?20:25;
  app().innerHTML=`<div class="wrap narrow"><div class="shead"><h1>${mid?'📝 Midterm mock':'🎓 Final mock'}</h1><p class="muted">${n} multiple-choice questions from ${mid?'Weeks 1–8 (Sessions 1–16)':'the whole course'}. ${n} minutes. Answers and explanations are shown at the end.</p></div><div class="card"><ul><li>One question at a time; you cannot go back.</li><li>The timer finishes the exam automatically.</li><li>This is practice only. Official marks are set by your instructor.</li></ul><div class="toolbar"><button class="btn pri" id="ego">Start exam →</button><a class="btn" href="#/practice">Back</a></div></div></div>`;
  $('#ego').onclick=()=>runQuiz({title:mid?'Midterm mock':'Final mock',qs:shuffle(bank(mid?s=>s.week<=9:null)).slice(0,n),key:kind,xp:6,secs:n*60,exam:true,again:'#/practice/'+kind}); }
function runQuiz(o){
  const qs=o.qs, n=qs.length; if(!n){ app().innerHTML='<div class="wrap shead"><p class="muted">No questions for this topic.</p><a class="btn" href="#/practice">Back</a></div>'; return; }
  let i=0, right=0, t0=Date.now(), tm, ended=false; const log=[];
  const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  app().innerHTML=`<div class="wrap narrow qz"><div class="qzhead"><a class="iconbtn" href="#/practice" aria-label="Close">✕</a><div class="qzbar"><i id="qzb"></i></div><span class="chip" id="qzt">⏱ 00:00</span></div><div id="qzq"></div></div>`;
  const tick=()=>{ const el=Math.floor((Date.now()-t0)/1000); const tt=$('#qzt'); if(!tt) return; if(o.secs){ const left=Math.max(0,o.secs-el); tt.textContent='⏱ '+fmt(left); tt.classList.toggle('x',left<60); if(left<=0) finish(); } else tt.textContent='⏱ '+fmt(el); };
  tm=setInterval(tick,1000); tick(); onLeave(()=>clearInterval(tm));
  const show=()=>{ const {q,s}=qs[i]; $('#qzb').style.width=(i/n*100)+'%';
    $('#qzq').innerHTML=`<div class="card qcard"><div class="tiny">Question ${i+1} of ${n} · ${esc(A().short(s))}</div><h2>${q.q}</h2><div class="qopts">${q.o.map((x,j)=>`<button class="qopt" data-j="${j}"><span>${String.fromCharCode(65+j)}</span>${x}</button>`).join('')}</div><div class="qwhy" id="qwhy" hidden></div><div class="toolbar" id="qnx" hidden><button class="btn pri" id="qnext">${i===n-1?'See result':'Next question →'}</button></div></div>`;
    $$('.qopt').forEach(b=>b.onclick=()=>{ if($('.qopt.sel')) return; const j=+b.dataset.j, ok=j===q.a; b.classList.add('sel'); log.push({q,s,j,ok}); if(ok) right++; haptic(ok?10:30);
      if(o.exam){ setTimeout(next,220); return; }
      $$('.qopt')[q.a].classList.add('right'); if(!ok) b.classList.add('wrong'); const w=$('#qwhy'); w.hidden=false; w.innerHTML=(ok?'✅ <b>Correct.</b> ':'❌ <b>Not quite.</b> ')+q.e; $('#qnx').hidden=false; $('#qnext').onclick=next; $('#qnext').focus(); }); };
  const next=()=>{ i++; if(i>=n) finish(); else show(); };
  function finish(){ if(ended) return; ended=true; clearInterval(tm); const secs=Math.floor((Date.now()-t0)/1000), pc=Math.round(right/n*100);
    if(ps.best[o.key]==null||right>ps.best[o.key]) ps.best[o.key]=right; ps.cnt.quiz=(ps.cnt.quiz||0)+1; save(); if(right) addXP(right*o.xp,`${o.title} ${right}/${n}`); if(pc>=80) confetti();
    const wrong=log.filter(l=>!l.ok), skipped=n-log.length;
    app().innerHTML=`<div class="wrap narrow"><div class="card result">${ring(pc,`<span data-count="${pc}" data-suf="%">0%</span>`,`${right} / ${n}`)}<h2>${pc>=80?'Excellent work! 🌟':pc>=50?'Good effort 👍':'Keep practising 💪'}</h2><p class="muted">${esc(o.title)} · time ${fmt(secs)}${skipped?` · ${skipped} not answered`:''} · best ${ps.best[o.key]}/${n}</p><div class="toolbar" style="justify-content:center"><a class="btn pri" href="${o.again}" id="qagain">Try again</a><a class="btn" href="#/practice">Practice centre</a></div></div>
      ${(o.exam?log:wrong).length?`<h3 style="margin:22px 0 10px">${o.exam?'Review all answers':'Review your mistakes'}</h3>${(o.exam?log:wrong).map(l=>`<div class="card rev ${l.ok?'ok':'bad'}"><p><b>${l.q.q}</b></p>${l.ok?'':`<p class="bad">Your answer: ${l.q.o[l.j]}</p>`}<p class="okk">Correct: ${l.q.o[l.q.a]}</p><p class="tiny">💡 ${l.q.e}</p><a class="tiny" href="#/s/${l.s.id}">Study ${esc(A().short(l.s))}: ${esc(l.s.title)} →</a></div>`).join('')}`:''}</div>`;
    $('#qagain').onclick=e=>{ if(location.hash===o.again){ e.preventDefault(); A().route(); } };
    animate(app()); window.scrollTo(0,0); }
  show();
}
const normSet=v=>new Set(v.replace(/[{}]/g,' ').split(/\s+/).map(x=>x.length>1?x.replace(/,+$/,''):x).filter(Boolean).map(x=>/^(ε|ϵ|eps|epsilon)$/i.test(x)?'ε':x));
function ffTrainer(){
  const txt=pick(D().grammars), G=T().parseGrammar(txt), ff=T().firstFollow(G); let revealed=false;
  app().innerHTML=`<div class="wrap narrow"><div class="shead"><h1>🥇 FIRST & FOLLOW trainer</h1><p class="muted">Compute the sets for this grammar. Separate symbols with spaces. Type <code>eps</code> for ε and <code>$</code> for end of input.</p></div>
   <div class="card"><pre class="code">${esc(txt)}</pre><div class="tblwrap"><table class="cal ff"><tr><th>Non-terminal</th><th>FIRST</th><th>FOLLOW</th></tr>${G.nts.map((n,k)=>`<tr><td><b>${esc(n)}</b></td><td><input data-n="${k}" data-k="F" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="FIRST of ${esc(n)}"></td><td><input data-n="${k}" data-k="FO" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="FOLLOW of ${esc(n)}"></td></tr>`).join('')}</table></div>
   <div class="toolbar"><button class="btn pri" id="ffc">Check</button><button class="btn" id="ffs">Show answers</button><button class="btn" id="ffn">New grammar</button><a class="btn" href="#/sheets">📑 Rules</a></div><div id="ffo"></div></div></div>`;
  const want=(n,k)=>ff[k][G.nts[n]];
  $('#ffc').onclick=()=>{ let ok=0; const ins=$$('.ff input'); ins.forEach(i=>{ const w=want(+i.dataset.n,i.dataset.k), g=normSet(i.value); const good=g.size===w.size&&[...w].every(x=>g.has(x)); i.classList.toggle('good',good); i.classList.toggle('badv',!good); if(good) ok++; });
    const all=ok===ins.length; haptic(all?12:30); $('#ffo').innerHTML=all?'<p class="okk"><b>All correct! 🎉</b></p>':`<p class="bad">${ok} of ${ins.length} sets correct. Fix the red ones and check again.</p>`;
    if(all&&!revealed){ revealed=true; ps.cnt.ff=(ps.cnt.ff||0)+1; save(); addXP(15,'FIRST & FOLLOW solved'); confetti(); } };
  $('#ffs').onclick=()=>{ revealed=true; $$('.ff input').forEach(i=>{ i.value=[...want(+i.dataset.n,i.dataset.k)].map(x=>x==='ε'?'eps':x).join(' '); i.classList.remove('badv'); i.classList.add('good'); }); $('#ffo').innerHTML='<p class="muted">Answers shown. Try a new grammar without looking.</p>'; };
  $('#ffn').onclick=ffTrainer;
}
function tokChallenge(){
  const line=pick(D().tokLines), r=T().tokenize(line); let done=false;
  app().innerHTML=`<div class="wrap narrow"><div class="shead"><h1>🔤 Token challenge</h1><p class="muted">How many tokens does the scanner send to the parser for this line? Remember longest match, and that white space and comments are not tokens.</p></div>
   <div class="card"><pre class="code big">${esc(line)}</pre><label class="fld">Number of tokens<input id="tkn" type="number" inputmode="numeric" min="0" max="99"></label><div class="toolbar"><button class="btn pri" id="tkc">Check</button><button class="btn" id="tkx">New line</button></div><div id="tko"></div></div></div>`;
  $('#tkc').onclick=()=>{ const v=+$('#tkn').value, ok=v===r.out.length; haptic(ok?12:30);
    $('#tko').innerHTML=`<p class="${ok?'okk':'bad'}"><b>${ok?'Correct! 🎉':'Not quite.'}</b> The scanner produces <b>${r.out.length}</b> tokens:</p><div class="mp-tok">${r.out.map((t,i)=>`<span class="tkc" style="animation-delay:${i*60}ms"><b>${esc(t[0])}</b><i>${esc(t[1])}</i></span>`).join('')}</div>`;
    if(ok&&!done){ ps.cnt.tok=(ps.cnt.tok||0)+1; save(); addXP(5,'Token challenge'); } done=true; };
  $('#tkn').onkeydown=e=>{ if(e.key==='Enter') $('#tkc').click(); };
  $('#tkx').onclick=tokChallenge;
}
function tacPractice(){
  const ex=pick(D().tacExprs), ast=T().exprParse(ex), tr=T().translate(ast);
  app().innerHTML=`<div class="wrap narrow"><div class="shead"><h1>🧾 Three-address code</h1><p class="muted">Translate the statement into three-address code: one operator per instruction, a new temporary (t1, t2, …) for each operator.</p></div>
   <div class="card"><pre class="code big">${esc(ex)}</pre><textarea id="tca" rows="6" spellcheck="false" autocapitalize="off" placeholder="t1 = …"></textarea><div class="toolbar"><button class="btn pri" id="tcs">Show solution</button><button class="btn" id="tcn">New statement</button></div><div id="tco"></div></div></div>`;
  $('#tcs').onclick=()=>{ $('#tco').innerHTML=`<div class="grid g2"><div><h3>Three-address code</h3><pre class="code">${esc(tr.code.join('\n'))}</pre><h3>Postfix</h3><pre class="code">${esc(postfix(ast))}</pre></div><div><h3>Syntax tree</h3>${treeSVG(ast)}</div></div><p class="tiny">Your temporaries may be numbered differently; the order of operations must match.</p><div class="toolbar"><button class="btn sm" id="tcy">✔ I got it</button><button class="btn sm" id="tcno">✗ Not yet</button><a class="btn sm" href="#/pipeline">🎬 Animate it</a></div>`;
    $('#tcy').onclick=()=>{ ps.cnt.tac=(ps.cnt.tac||0)+1; save(); addXP(8,'Three-address code'); tacPractice(); }; $('#tcno').onclick=()=>{ toast('Review Session 27, then try again'); tacPractice(); }; };
  $('#tcn').onclick=tacPractice;
}

/* ---------- PIPELINE VISUALIZER ---------- */
const isNum=x=>/^-?\d+(\.\d+)?$/.test(x);
function optimize(quads){ const out=[], notes=[], alias={}, seen={}; const R=x=>alias[x]!=null?alias[x]:x;
  quads.forEach(([op,a,b,r])=>{ a=R(a); b=R(b);
    if(op==='='){ out.push(['=',a,'',r]); return; }
    if(op==='minus'){ if(isNum(a)){ alias[r]=String(-a); notes.push(`Constant folding: minus ${a} is ${-a}, so ${r} is not needed.`); return; } const k='minus|'+a; if(seen[k]){ alias[r]=seen[k]; notes.push(`Common sub-expression: minus ${a} is already in ${seen[k]}, so ${r} reuses it.`); return; } seen[k]=r; out.push([op,a,'',r]); return; }
    if(isNum(a)&&isNum(b)&&!(op==='/'&&+b===0)){ const v={'+':+a + +b,'-':a-b,'*':a*b,'/':a/b}[op]; const vs=String(Math.round(v*1e6)/1e6); alias[r]=vs; notes.push(`Constant folding: ${a} ${op} ${b} = ${vs}, computed at compile time.`); return; }
    const key=(op==='+'||op==='*')?op+'|'+[a,b].sort().join('|'):op+'|'+a+'|'+b;
    if(seen[key]){ alias[r]=seen[key]; notes.push(`Common sub-expression: ${a} ${op} ${b} is already in ${seen[key]}, so ${r} reuses it.`); return; }
    seen[key]=r; out.push([op,a,b,r]); });
  return {out,notes}; }
const qline=q=>q[0]==='='?`${q[3]} = ${q[1]}`:q[0]==='minus'?`${q[3]} = minus ${q[1]}`:`${q[3]} = ${q[1]} ${q[0]} ${q[2]}`;
function target(quads){ const im=x=>isNum(x)?'#'+x:x, OP={'+':'ADD','-':'SUB','*':'MUL','/':'DIV'}; return quads.map(q=>q[0]==='='?[`LD  R0, ${im(q[1])}`,`ST  ${q[3]}, R0`]:q[0]==='minus'?[`LD  R0, ${im(q[1])}`,`NEG R0`,`ST  ${q[3]}, R0`]:[`LD  R0, ${im(q[1])}`,`${OP[q[0]]} R0, R0, ${im(q[2])}`,`ST  ${q[3]}, R0`]); }
function pipeline(){
  const exs=D().pipeExamples;
  app().innerHTML=`<div class="wrap"><div class="shead"><h1>🎬 Compiler pipeline visualizer</h1><p class="muted">Type an assignment statement and watch it travel through every phase of a compiler, one step at a time.</p>
   <div class="pvin"><input id="pvsrc" type="text" value="${esc(exs[0])}" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Statement"><button class="btn pri" id="pvrun">Compile ▶</button></div>
   <div class="toolbar">${exs.map(e=>`<button class="btn sm pvex">${esc(e)}</button>`).join('')}</div><p class="tiny">Supported: identifiers, numbers, = + − * / unary − and parentheses.</p></div>
   <div class="pvctl" id="pvctl" hidden><button class="btn sm pri" id="pvplay">▶ Play</button><button class="btn sm" id="pvback">← Back</button><button class="btn sm" id="pvstep">Step →</button><button class="btn sm" id="pvall">Show all</button><button class="btn sm" id="pvreset">↺ Reset</button><span class="pvcap" id="pvcap"></span></div>
   <div id="pvout"></div></div>`;
  let cur=-1, caps=[], tm=null;
  const stop=()=>{ clearInterval(tm); tm=null; const b=$('#pvplay'); if(b) b.textContent='▶ Play'; };
  onLeave(stop);
  const reveal=(k,on)=>{ $$(`[data-s="${k}"]`,app()).forEach(el=>{ el.classList.toggle('on',on); const stg=el.closest('.pv-stage'); if(stg&&on) stg.classList.add('on'); if(on&&el.dataset.a){ $$('.pvch',app()).forEach(c=>c.classList.remove('hi')); for(let c=+el.dataset.a;c<+el.dataset.b;c++){ const ch=$(`.pvch[data-c="${c}"]`,app()); if(ch) ch.classList.add('hi','seen'); } } }); };
  const go=k=>{ k=Math.max(-1,Math.min(caps.length-1,k)); while(cur<k){ cur++; reveal(cur,true); } while(cur>k){ reveal(cur,false); cur--; }
    $$('.pv-stage',app()).forEach(s=>{ if(!$('.pv-h.on, .pv-first.on',s)) s.classList.remove('on'); });
    $('#pvcap').innerHTML=cur<0?'Press <b>Play</b> or <b>Step</b>.':`<b>${cur+1}/${caps.length}</b> ${caps[cur]}`;
    const el=$(`[data-s="${cur}"]`,app()); if(el&&tm!==undefined){ const r=el.getBoundingClientRect(); if(r.bottom>innerHeight-90||r.top<120) (el.closest('.pv-stage')||el).scrollIntoView({behavior:'smooth',block:'center'}); }
    if(cur===caps.length-1){ stop(); once('pv'+today(),()=>addXP(5,'Pipeline explored')); } };
  function compile(){ stop(); const src=$('#pvsrc').value.trim(), out=$('#pvout'); cur=-1; caps=[];
    let ast,tr; const lex=T().tokenize(src);
    try{ if(lex.errs.length) throw new Error(lex.errs[0]); ast=T().exprParse(src); tr=T().translate(ast); }catch(e){ $('#pvctl').hidden=true; out.innerHTML=`<div class="card"><p class="bad"><b>Error:</b> ${esc(e.message)}</p><p class="tiny">Try something like <code>x = a + b * 2</code>.</p></div>`; return; }
    let n=0; const S=cap=>{ caps.push(cap); return `data-s="${n++}"`; };
    let pos=0; const tokHTML=lex.out.map(t=>{ const a=src.indexOf(t[0],pos), b=a+t[0].length; pos=b; return `<span class="tkc pv-h" ${S(`The scanner reads <code>${esc(t[0])}</code> and emits token <b>${esc(t[1])}</b>${t[2]?` (${esc(t[2])})`:''}.`)} data-a="${a}" data-b="${b}"><b>${esc(t[0])}</b><i>${esc(t[1])}</i></span>`; }).join('');
    const s0=S('The source program is only a stream of characters.');
    const symS=lex.sym.length?S(`Identifiers go into the symbol table: ${lex.sym.map(esc).join(', ')}.`):'';
    const tree=treeSVG(ast, nd=>S(nd.leaf?`Leaf node for operand <code>${esc(nd.lab)}</code>.`:`Build node <b>${esc(nd.lab)}</b> over its ${nd.kids.length===1?'operand':'two sub-trees'}. Deeper nodes are evaluated first.`));
    const pfS=S('Post-order walk of the tree gives the postfix form: operands first, then the operator.');
    const tac=tr.code.map(c=>`<span class="pv-h" ${S(`Emit <code>${esc(c)}</code>${/^t\d+ =/.test(c)?': a new temporary holds this result.':'.'}`)}>${esc(c)}</span>`).join('');
    const quads=tr.quads.map((q,k)=>`<tr class="pv-h" ${S(`Quadruple ${k}: op <b>${esc(q[0])}</b>, arg1 ${esc(q[1])||'—'}, arg2 ${esc(q[2])||'—'}, result ${esc(q[3])}.`)}><td>${k}</td>${q.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
    const op=optimize(tr.quads);
    const notes=op.notes.length?op.notes.map(x=>`<li class="pv-h" ${S(esc(x))}>${esc(x)}</li>`).join(''):`<li class="pv-h" ${S('Nothing to improve here: no constant operations and no repeated sub-expressions.')}>No constant operations and no repeated sub-expressions in this statement.</li>`;
    const optS=S(`Optimized code: ${op.out.length} instruction(s) instead of ${tr.quads.length}.`);
    const tg=target(op.out).map((g,k)=>`<span class="pv-h" ${S(`Machine code for <code>${esc(qline(op.out[k]))}</code>: load, operate, store.`)}>${g.map(esc).join('\n')}</span>`).join('');
    const stage=(num,ic,t,sub,body)=>`<section class="card pv-stage"><div class="pvh"><span class="pvn">${num}</span><div><h3>${ic} ${t}</h3><p class="tiny">${sub}</p></div></div>${body}</section>`;
    out.innerHTML=
     stage(1,'📄','Source program','What the programmer typed.',`<div class="pvsrc pv-first" ${s0}>${src.split('').map((c,i)=>`<span class="pvch" data-c="${i}">${c===' '?'&nbsp;':esc(c)}</span>`).join('')}</div>`)+
     stage(2,'🔤','Lexical analysis','Characters → tokens. White space is dropped.',`<div class="mp-tok">${tokHTML}</div>${symS?`<p class="pv-h tiny" ${symS}>📒 Symbol table: ${lex.sym.map((x,i)=>`<span class="chip">${i+1} · ${esc(x)}</span>`).join(' ')}</p>`:''}`)+
     stage(3,'🌳','Syntax analysis','Tokens → syntax tree. Precedence and parentheses decide the shape.',`<div class="tblwrap">${tree}</div>`)+
     stage(4,'🧾','Intermediate code generation','Tree → postfix and three-address code.',`<p class="pv-h" ${pfS}><b>Postfix:</b> <code>${esc(postfix(ast))}</code></p><pre class="code pvcode">${tac}</pre>`)+
     stage(5,'🗂️','Quadruples','The same code stored as records: (op, arg1, arg2, result).',`<div class="tblwrap"><table class="cal"><tr><th>#</th><th>op</th><th>arg1</th><th>arg2</th><th>result</th></tr>${quads}</table></div>`)+
     stage(6,'✨','Code optimization','<span class="chip">Preview · beyond this course</span> Constant folding and common sub-expression elimination.',`<ul>${notes}</ul><pre class="code pv-h" ${optS}>${esc(op.out.map(qline).join('\n'))||'(no instructions needed)'}</pre>`)+
     stage(7,'🖥️','Code generation','<span class="chip">Preview · beyond this course</span> A simple one-register code generator.',`<pre class="code pvcode">${tg||'<span class="pv-h on">(nothing to generate)</span>'}</pre>`);
    $('#pvctl').hidden=false; go(-1); go(0);
  }
  $('#pvrun').onclick=()=>{ haptic(); compile(); };
  $('#pvsrc').onkeydown=e=>{ if(e.key==='Enter') compile(); };
  $$('.pvex').forEach(b=>b.onclick=()=>{ $('#pvsrc').value=b.textContent; compile(); });
  $('#pvstep').onclick=()=>{ stop(); go(cur+1); }; $('#pvback').onclick=()=>{ stop(); go(cur-1); };
  $('#pvall').onclick=()=>{ stop(); go(caps.length-1); window.scrollTo({top:0,behavior:'smooth'}); }; $('#pvreset').onclick=()=>{ stop(); go(-1); go(0); window.scrollTo({top:0,behavior:'smooth'}); };
  $('#pvplay').onclick=()=>{ if(tm){ stop(); return; } if(cur>=caps.length-1){ go(-1); } $('#pvplay').textContent='⏸ Pause'; tm=setInterval(()=>go(cur+1),1300); go(cur+1); };
  compile();
}

/* ---------- RESOURCES ---------- */
function sheets(h){
  const d=D(), tab=h[1]||'sheets', tabs=[['sheets','📑 Cheat sheets'],['viva','🎤 Viva Q&A'],['today','🚀 Compilers today'],['toolbox','🧰 Toolbox']];
  let body='';
  if(tab==='viva') body=`<p class="muted">${d.viva.length} questions teachers ask in viva and short-answer papers. Say your answer aloud first, then open the model answer.</p><div class="toolbar"><button class="btn sm" id="vsh">🔀 Shuffle</button><button class="btn sm" id="vall">Open all</button></div><div id="vlist"></div>`;
  else if(tab==='today') body=`<p class="muted">How the ideas in this course are used in the tools programmers use every day.</p><div class="grid g2">${d.modern.map((m,i)=>`<article class="card mod" style="--i:${i}"><div class="top2"><span class="ti">${m[0]}</span><div><h3>${m[1]}</h3><span class="chip">${m[3]}</span></div></div><p>${m[2]}</p></article>`).join('')}</div>`;
  else if(tab==='toolbox') body=`<div class="grid g2"><div class="card"><h3>🧰 Tools worth trying</h3>${d.tools.map(t=>`<div class="uprow"><span class="grow"><b>${t[0]}</b><small>${t[1]}</small></span><span class="chip">${t[2]}</span></div>`).join('')}</div>
    <div class="card"><h3>⌨️ See a real compiler’s phases</h3><p class="tiny">Run these on any small C file (GCC or Clang installed).</p>${d.commands.map(c=>`<div class="cmd"><pre class="code">${esc(c[0])}</pre><p class="tiny">${c[1]}</p></div>`).join('')}</div></div><br>
    <div class="card"><h3>📝 Exam tips</h3><ul>${d.tips.map(t=>`<li>${t}</li>`).join('')}</ul></div><br><div class="card"><h3>📚 Reference books</h3><ul>${window.COURSE.books.concat(window.COURSE.refs).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div>`;
  else body=`<input class="search" id="shq" type="search" placeholder="Search the cheat sheets, e.g. FOLLOW, backpatch, closure…" aria-label="Search cheat sheets"><div class="toolbar"><button class="btn sm" id="shall">Open all</button><button class="btn sm" onclick="print()">🖨 Print</button></div><div id="shl">${d.sheets.map((s,i)=>`<details class="card sheetc" id="sh${i}" ${i===0?'open':''}><summary><span class="ti">${s.ic}</span><span class="grow"><b>${s.t}</b><small>${s.tag}</small></span><span class="chev">›</span></summary><div class="shb">${s.b}</div></details>`).join('')}</div>`;
  app().innerHTML=`<div class="wrap"><div class="shead"><h1>Resources</h1><div class="seg">${tabs.map(t=>`<a href="#/sheets${t[0]==='sheets'?'':'/'+t[0]}" class="${t[0]===tab?'on':''}">${t[1]}</a>`).join('')}</div></div>${body}</div>`;
  if(tab==='viva'){ let order=d.viva.map((_,i)=>i), open=false; const draw=()=>{ $('#vlist').innerHTML=order.map((k,i)=>`<details class="card sheetc" ${open?'open':''}><summary><span class="ti">${i+1}</span><span class="grow"><b>${esc(d.viva[k][0])}</b></span><span class="chev">›</span></summary><div class="shb"><p>${esc(d.viva[k][1])}</p></div></details>`).join(''); };
    $('#vsh').onclick=()=>{ order=shuffle(order); draw(); }; $('#vall').onclick=()=>{ open=!open; $('#vall').textContent=open?'Close all':'Open all'; draw(); }; draw(); }
  if(tab==='sheets'){ $('#shq').oninput=e=>{ const q=e.target.value.toLowerCase().trim(); $$('.sheetc').forEach((el,i)=>{ const s=d.sheets[i], hit=!q||(s.t+' '+strip(s.b)).toLowerCase().includes(q); el.hidden=!hit; if(q&&hit) el.open=true; }); };
    let all=false; $('#shall').onclick=()=>{ all=!all; $$('.sheetc').forEach(el=>el.open=all); $('#shall').textContent=all?'Close all':'Open all'; }; }
}

/* ---------- ME: profile, badges, settings ---------- */
function badges(){ const a=A(), st=a.st, S=a.sessions, done=ids=>ids.every(i=>st.done[i]), range=(x,y)=>{ const r=[]; for(let i=x;i<=y;i++) r.push(i); return r; };
  const perfect=Object.values(st.quiz).some(v=>{ const m=String(v).split('/'); return m[0]===m[1]&&+m[1]>0; });
  return [['🚀','First step','Complete your first unit',S.some(s=>st.done[s.id])],['🔤','Lexical analyst','Complete Sessions 3–8',done(range(3,8))],['🌳','Parser builder','Complete Sessions 9–17',done(range(9,17))],['🏷️','Semantic sage','Complete Sessions 20–25',done(range(20,25))],['🧾','Code generator','Complete Sessions 26–30',done(range(26,30))],['📝','Midterm ready','Complete Sessions 1–16 and the midterm unit',done(range(1,16).concat(90))],['🏆','Compiler master','Complete all units',S.every(s=>st.done[s.id])],
   ['🎯','Perfect check','Score full marks in a knowledge check',perfect],['🔥','On fire','Study 3 days in a row',ps.bestStreak>=3],['⚡','Unstoppable','Study 7 days in a row',ps.bestStreak>=7],['🧪','Quiz explorer','Finish 5 practice quizzes',(ps.cnt.quiz||0)>=5],['🥇','Set solver','Solve 3 FIRST & FOLLOW grammars',(ps.cnt.ff||0)>=3]]; }
function me(){
  const a=A(), st=a.st, S=a.sessions, p=a.pct(), L=lvl(), B=badges(), got=B.filter(b=>b[3]).length, wk=curWeek();
  const units=[...new Set(S.map(s=>s.unit))].map(u=>{ const l=S.filter(s=>s.unit===u); return [u,l.filter(s=>st.done[s.id]).length,l.length]; });
  app().innerHTML=`<div class="wrap narrow2"><div class="card prof"><div class="pav">${ps.name?esc(ps.name.trim()[0].toUpperCase()):'👤'}</div><div class="grow"><h1>${ps.name?esc(ps.name):'Student'}</h1><p class="muted">${ps.roll?esc(ps.roll)+' · ':''}Compiler Construction · BS Computer Science${wk?` · Week ${wk}`:''}</p><div class="tiny">LEVEL ${L+1} · <b>${LV[L]}</b> · <span data-count="${ps.xp}">0</span> XP</div><div class="xbar"><i data-w="${L>=LV.length-1?100:Math.round(ps.xp%LVXP/LVXP*100)}"></i></div></div><button class="btn sm" id="pedit">✏️ Edit</button></div>
   <div class="dgrid" style="margin-top:14px"><div class="card pcard">${ring(p,`<span data-count="${p}" data-suf="%">0%</span>`,'complete')}<div class="grow"><h3>Course progress</h3><p class="tiny">${S.filter(s=>st.done[s.id]).length} of ${S.length} units completed</p><a class="btn sm" href="#/bookmarks">Bookmarks & quiz results →</a></div></div>
   <div class="card statc"><div><b>🔥 <span data-count="${streak()}">0</span></b><span>day streak</span></div><div><b data-count="${ps.bestStreak}">0</b><span>best streak</span></div><div><b data-count="${Object.keys(ps.days).length}">0</b><span>days studied</span></div><div><b data-count="${got}">0</b><span>of ${B.length} badges</span></div></div></div>
   <section class="sec"><h2>Badges</h2><div class="badges">${B.map(b=>`<div class="badge ${b[3]?'got':''}" title="${esc(b[2])}"><span>${b[0]}</span><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div></section>
   <section class="sec"><h2>Progress by unit</h2><div class="card">${units.map(u=>`<div class="urow"><span>${esc(u[0])}</span><div class="xbar"><i data-w="${Math.round(u[1]/u[2]*100)}"></i></div><b>${u[1]}/${u[2]}</b></div>`).join('')}</div></section>
   <section class="sec"><h2>Settings</h2><div class="card setl">
     <button class="srow" id="sTheme"><span>🌗</span><span class="grow"><b>Appearance</b><small>Switch between dark and light</small></span><span>›</span></button>
     ${IN_APP()?'':`<button class="srow" id="sInst"><span>📲</span><span class="grow"><b>Install on this device</b><small>Add the portal to your home screen; works offline</small></span><span>›</span></button><a class="srow" href="${APK}"><span>🤖</span><span class="grow"><b>Download the Android app</b><small>APK file, works fully offline</small></span><span>›</span></a>`}
     <button class="srow" id="sShare"><span>📤</span><span class="grow"><b>Share with classmates</b><small>Send the portal link</small></span><span>›</span></button>
     <button class="srow" id="sBak"><span>💾</span><span class="grow"><b>Backup or move my progress</b><small>Copy a backup code, or restore one on a new phone</small></span><span>›</span></button>
     <a class="srow" href="#/outline"><span>🗓️</span><span class="grow"><b>Course outline & policies</b><small>Calendar, books, class rules</small></span><span>›</span></a>
     <a class="srow" href="lectures-1-3.html"><span>📘</span><span class="grow"><b>Classic Lectures 1–3 page</b><small>The original first three lectures</small></span><span>›</span></a>
     <button class="srow danger" id="sReset"><span>🗑️</span><span class="grow"><b>Reset my progress</b><small>Clears completion, scores, XP and notes on this device</small></span><span>›</span></button>
   </div><p class="tiny" style="text-align:center;margin-top:14px">Compiler Construction portal · version 2.0 · Instructor: Muhammad Tahir Mehmood</p></section></div>`;
  $('#pedit').onclick=()=>{ const w=sheet(`<div class="ob"><h2>Edit profile</h2><label>Name<input id="obN" type="text" maxlength="40" value="${esc(ps.name)}"></label><label>Roll number<input id="obR" type="text" maxlength="30" value="${esc(ps.roll)}"></label><label>Semester start date<input id="obS" type="date" value="${esc(ps.start)}"></label><div class="toolbar"><button class="btn pri" id="obGo">Save</button><button class="btn" data-close>Cancel</button></div></div>`);
    $('#obGo',w).onclick=()=>{ ps.name=$('#obN',w).value.trim(); ps.roll=$('#obR',w).value.trim(); ps.start=$('#obS',w).value; ps.skip=1; save(); closeSheet(w); me(); afterRoute(['me']); toast('Profile saved'); }; };
  $('#sTheme').onclick=()=>{ a.flipTheme(); haptic(); };
  const si=$('#sInst'); if(si) si.onclick=()=>{ if(installEvt){ installEvt.prompt(); installEvt=null; } else sheet(`<div class="ob"><h2>Install the portal</h2><p><b>Android (Chrome):</b> open the ⋮ menu and choose “Add to Home screen” or “Install app”.</p><p><b>iPhone (Safari):</b> tap the Share button, then “Add to Home Screen”.</p><p><b>Computer (Chrome / Edge):</b> click the install icon at the right of the address bar.</p><div class="toolbar"><button class="btn pri" data-close>OK</button></div></div>`); };
  $('#sShare').onclick=()=>{ const text='Compiler Construction course portal: animated lectures, practice quizzes, lab tools and cheat sheets. '+SITE; try{ if(IN_APP()&&AndroidApp.share){ AndroidApp.share(text); return; } if(navigator.share){ navigator.share({title:'Compiler Construction',text,url:SITE}).catch(()=>{}); return; } }catch(e){} copy(SITE,'Link copied'); };
  $('#sBak').onclick=()=>{ let code=''; try{ code=btoa(unescape(encodeURIComponent(JSON.stringify({c:a.st,p:ps})))); }catch(e){}
    const w=sheet(`<div class="ob"><h2>Backup or move my progress</h2><p class="tiny">Copy this code and keep it (for example, send it to yourself). To restore, paste a code below and press Restore.</p><textarea id="bkOut" rows="3" readonly>${code}</textarea><div class="toolbar"><button class="btn sm pri" id="bkCopy">Copy code</button></div><label>Restore from a code<textarea id="bkIn" rows="3" placeholder="Paste a backup code here"></textarea></label><div class="toolbar"><button class="btn sm" id="bkGo">Restore</button><button class="btn sm" data-close>Close</button></div></div>`);
    $('#bkCopy',w).onclick=()=>copy(code,'Backup code copied');
    $('#bkGo',w).onclick=()=>{ try{ const o=JSON.parse(decodeURIComponent(escape(atob($('#bkIn',w).value.trim())))); if(!o||!o.c||!o.p) throw 0; localStorage.setItem('cc-course-v1',JSON.stringify(o.c)); localStorage.setItem(PK,JSON.stringify(o.p)); location.reload(); }catch(e){ toast('That code is not valid'); } }; };
  $('#sReset').onclick=()=>{ if(confirm('Reset all progress, quiz scores, XP, badges and notes on this device?')){ a.resetAll(); ps=Object.assign(blank(),{name:ps.name,roll:ps.roll,start:ps.start,skip:1}); save(); me(); afterRoute(['me']); toast('Progress reset'); } };
}
function copy(text,msg){ const done=()=>toast(msg||'Copied'); try{ if(navigator.clipboard&&isSecureContext){ navigator.clipboard.writeText(text).then(done,()=>fallback()); return; } }catch(e){} fallback();
  function fallback(){ const t=document.createElement('textarea'); t.value=text; t.style.cssText='position:fixed;opacity:0'; document.body.append(t); t.select(); try{ document.execCommand('copy'); done(); }catch(e){ toast('Select the text and copy it'); } t.remove(); } }

/* ---------- global search ---------- */
let sIndex=null;
function buildIndex(){ const a=A(), d=D(), I=[];
  [['#/','🏠','Home dashboard'],['#/sessions','📚','All sessions'],['#/practice','🎯','Practice centre'],['#/practice/quick','⚡','Quick quiz'],['#/practice/mid','📝','Midterm mock exam'],['#/practice/final','🎓','Final mock exam'],['#/practice/ff','🥇','FIRST & FOLLOW trainer'],['#/practice/tok','🔤','Token challenge'],['#/practice/tac','🧾','Three-address code practice'],['#/pipeline','🎬','Compiler pipeline visualizer'],['#/tools','🧪','Lab tools: tokenizer, LL(1) builder, TAC'],['#/sheets','📑','Cheat sheets'],['#/sheets/viva','🎤','Viva questions and answers'],['#/sheets/today','🚀','Compilers today: LLVM, GCC, JIT, WebAssembly'],['#/sheets/toolbox','🧰','Toolbox, commands and exam tips'],['#/flash','🃏','Flashcards'],['#/glossary','📘','Glossary'],['#/revision','🔁','Revision dashboard'],['#/assess','📝','Assessments'],['#/outline','🗓️','Course outline'],['#/me','👤','My profile, badges and settings']].forEach(p=>I.push({t:p[2],s:'Page',ic:p[1],h:p[0],w:3}));
  a.sessions.forEach(s=>{ I.push({t:a.label(s)+': '+s.title,s:'Week '+s.week+' · '+s.unit,ic:s.ic||'📖',h:'#/s/'+s.id,x:s.sub,w:3});
    s.slides.forEach((x,i)=>I.push({t:strip(x.h),s:a.short(s)+' · slide',ic:x.ic||'▫️',h:'#/s/'+s.id,j:'c'+i,x:strip((x.p||'')+' '+(x.pts||[]).map(p=>p[1]).join(' ')).slice(0,400),w:2}));
    if(s.assessment) I.push({t:s.assessment.title,s:'Assessment · Week '+s.week,ic:'📌',h:'#/s/'+s.id,j:'assess',w:2}); });
  a.allTerms().forEach(t=>I.push({t:t[0],s:'Term · '+t[1].slice(0,90),ic:'📘',h:'#/s/'+t[2],j:'terms',x:t[1],w:2}));
  d.sheets.forEach((s,i)=>I.push({t:s.t,s:'Cheat sheet · '+s.tag,ic:s.ic,h:'#/sheets',j:'sh'+i,x:strip(s.b),w:2}));
  d.viva.forEach(v=>I.push({t:v[0],s:'Viva question',ic:'🎤',h:'#/sheets/viva',x:v[1],w:1}));
  I.forEach(o=>{ o.lt=o.t.toLowerCase(); o.lx=(o.x||'').toLowerCase(); }); return I; }
function openSearch(){ if($('.sheetw.srch')) return; sIndex=sIndex||buildIndex();
  const w=sheet(`<div class="srchbox"><input id="sq" type="search" placeholder="Search sessions, slides, terms, cheat sheets…" autocomplete="off" aria-label="Search the course"><button class="iconbtn" data-close aria-label="Close">✕</button></div><div id="sres" class="sres"></div>`,'srch');
  const inp=$('#sq',w), res=$('#sres',w); let sel=0, items=[];
  const draw=()=>{ const q=inp.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    items=!q.length?sIndex.filter(o=>o.s==='Page').slice(0,12):sIndex.map(o=>{ let sc=0; for(const k of q){ if(o.lt.includes(k)) sc+=o.lt.startsWith(k)?6:4; else if(o.lx.includes(k)) sc+=1; else return null; } return {o,sc:sc+o.w}; }).filter(Boolean).sort((x,y)=>y.sc-x.sc).slice(0,40).map(x=>x.o);
    sel=0; res.innerHTML=items.length?items.map((o,i)=>`<a class="sr ${i===0?'on':''}" data-i="${i}" href="${o.h}"><span class="ti">${o.ic}</span><span class="grow"><b>${esc(o.t)}</b><small>${esc(o.s)}</small></span></a>`).join(''):'<p class="muted" style="padding:16px">No results. Try another word.</p>'; };
  const go=i=>{ const o=items[i]; if(!o) return; jump=o.j||null; closeSheet(w); if(location.hash===o.h) A().route(); else location.hash=o.h; };
  inp.oninput=draw; res.onclick=e=>{ const a=e.target.closest('.sr'); if(a){ e.preventDefault(); go(+a.dataset.i); } };
  inp.onkeydown=e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(0,Math.min(items.length-1,sel+(e.key==='ArrowDown'?1:-1))); $$('.sr',res).forEach((x,i)=>{ x.classList.toggle('on',i===sel); if(i===sel) x.scrollIntoView({block:'nearest'}); }); } if(e.key==='Enter'){ e.preventDefault(); go(sel); } if(e.key==='Escape') closeSheet(w); };
  draw(); setTimeout(()=>inp.focus(),80);
}

buildShell();
window.CCPortal={ routes:{'':home, practice, pipeline, sheets, me}, afterRoute, onDone, onQuiz, onAssess, onPres, reset, toast, confetti, openSearch };
})();
