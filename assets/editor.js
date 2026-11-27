/* Lecture editor for the teacher. Sign in once (Me → Settings → Teacher: edit lectures); after that every lecture shows
   Edit buttons, in the study view and in Present mode. Saving writes the whole lecture to the cloud (assets/cloud.js) and
   every student gets it the next time the portal or app opens. Loaded after app.js. */
(function(){
  const A = window.CCApp, CL = window.CCCloud; if (!A || !CL) return;
  const $ = (q, r = document) => r.querySelector(q), $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const esc = A.esc, clone = o => JSON.parse(JSON.stringify(o));
  const hasTags = s => /<\/?[a-zA-Z][^>]*>/.test(s || '');
  const unesc = s => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const escCode = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /* code-like text: shown as plain characters in the editor unless it already contains real HTML tags */
  const codeIn = s => (s == null ? { v: '', raw: false } : hasTags(s) ? { v: s, raw: true } : { v: unesc(s), raw: false });
  const codeOut = (v, raw) => raw ? v : escCode(v);
  const teacher = () => !!CL.user;
  function toast(m) { const t = document.createElement('div'); t.className = 'cced-toast'; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 3200); }

  /* ---------- overlay shell ---------- */
  function shell(title, bodyHTML, onSave, saveLabel) {
    close();
    const w = document.createElement('div'); w.id = 'cced'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', title);
    w.innerHTML = `<div class="cced-box"><div class="cced-head"><b>${esc(title)}</b><span class="cced-msg" id="ccedMsg"></span>${onSave ? `<button class="btn sm pri" id="ccedSave">${saveLabel || '💾 Save'}</button>` : ''}<button class="btn sm" id="ccedX">Close</button></div><div class="cced-body">${bodyHTML}</div></div>`;
    document.body.append(w);
    $('#ccedX', w).onclick = close;
    if (onSave) $('#ccedSave', w).onclick = async () => {
      const b = $('#ccedSave', w), m = $('#ccedMsg', w); b.disabled = true; m.className = 'cced-msg'; m.textContent = 'Saving…';
      try { await onSave(w); } catch (e) { m.className = 'cced-msg bad'; m.textContent = e.message || String(e); b.disabled = false; }
    };
    w.addEventListener('keydown', e => e.stopPropagation());
    return w;
  }
  function close() { const w = $('#cced'); if (w) w.remove(); }
  const fld = (label, id, val, o = {}) => `<label class="cced-f${o.wide ? ' wide' : ''}"><span>${label}${o.hint ? ` <small>${o.hint}</small>` : ''}</span>${o.area ? `<textarea id="${id}" rows="${o.rows || 3}" class="${o.mono ? 'mono' : ''}" spellcheck="${o.mono ? 'false' : 'true'}">${esc(val || '')}</textarea>` : `<input id="${id}" type="text" value="${esc(val || '')}">`}</label>`;
  const val = (w, id) => { const e = $('#' + id, w); return e ? e.value : ''; };
  const lines = t => t.split('\n').map(x => x.trim()).filter(Boolean);

  /* rows of inputs (bullet points, parts table, exam table) */
  function gridHTML(id, heads, rows, o = {}) {
    const n = heads.length;
    return `<div class="cced-grid" id="${id}" data-n="${n}" data-fixed="${o.fixed ? 1 : 0}"><div class="cced-gr head">${heads.map((h, i) => o.fixed ? `<b>${esc(h)}</b>` : `<input data-h="${i}" value="${esc(h)}" placeholder="Column ${i + 1}">`).join('')}<span></span></div>${rows.map(r => rowHTML(r, n)).join('')}<div class="cced-gb"><button type="button" class="btn sm" data-add>＋ Row</button>${o.fixed ? '' : '<button type="button" class="btn sm" data-addc>＋ Column</button><button type="button" class="btn sm" data-delc>− Column</button>'}</div></div>`;
  }
  const rowHTML = (r, n) => `<div class="cced-gr">${Array.from({ length: n }, (_, i) => `<input value="${esc(r[i] == null ? '' : r[i])}">`).join('')}<button type="button" class="btn sm" data-del title="Remove row">✕</button></div>`;
  function gridWire(w) {
    $$('.cced-grid', w).forEach(g => g.addEventListener('click', e => {
      const t = e.target, n = +g.dataset.n;
      if (t.matches('[data-add]')) $('.cced-gb', g).insertAdjacentHTML('beforebegin', rowHTML([], n));
      else if (t.matches('[data-del]')) t.closest('.cced-gr').remove();
      else if (t.matches('[data-addc]') && n < 6) { g.dataset.n = n + 1; $$('.cced-gr', g).forEach(r => r.lastElementChild.insertAdjacentHTML('beforebegin', r.classList.contains('head') ? `<input data-h="${n}" placeholder="Column ${n + 1}">` : '<input>')); g.style.setProperty('--n', n + 1); }
      else if (t.matches('[data-delc]') && n > 2) { g.dataset.n = n - 1; $$('.cced-gr', g).forEach(r => r.children[n - 1].remove()); g.style.setProperty('--n', n - 1); }
    }));
    $$('.cced-grid', w).forEach(g => g.style.setProperty('--n', g.dataset.n));
  }
  const gridRows = (w, id) => $$(`#${id} .cced-gr:not(.head)`, w).map(r => $$('input', r).map(i => i.value.trim())).filter(r => r.some(Boolean));
  const gridHeads = (w, id) => $$(`#${id} .cced-gr.head input`, w).map(i => i.value.trim());

  /* ---------- slide form ---------- */
  const KNOWN = ['k', 'ic', 'h', 'p', 'pts', 'ex', 'code', 'parts', 'what', 'eg', 'res', 'tbl', 'an', 'tk', 'n'];
  function slideForm(s, i, isNew) {
    const x = isNew ? { k: 'Concept', h: '', ic: '💡', p: '', an: '', tk: '', n: { say: '', ask: '', ans: '', watch: '' } } : clone(s.slides[i]);
    const n = typeof x.n === 'string' ? { say: x.n } : (x.n || {}), eg = x.eg || {}, tbl = x.tbl || { h: ['Item', 'Meaning'], r: [] };
    const c = codeIn(x.code), ec = codeIn(eg.code), eo = codeIn(eg.out);
    const parts = (x.parts || []).map(r => [codeIn(r[0]), r[1]]), praw = parts.some(r => r[0].raw);
    const other = {}; Object.keys(x).forEach(k => { if (!KNOWN.includes(k)) other[k] = x[k]; });
    const w = shell(isNew ? `New slide · ${A.label(s)}` : `Edit slide ${i + 1} of ${s.slides.length} · ${A.label(s)}`, `
      <p class="cced-tip">Leave a box empty to hide that part of the slide. You can use <code>&lt;b&gt;bold&lt;/b&gt;</code> and <code>&lt;code&gt;code&lt;/code&gt;</code> in text boxes; to show a real &lt; sign in text, type <code>&amp;lt;</code>. Code boxes take plain code as it is.</p>
      <div class="cced-row">${fld('Label above the heading', 'eK', x.k, { hint: 'e.g. Concept, Example, Step 1' })}${fld('Icon', 'eIc', x.ic, { hint: 'one emoji' })}</div>
      ${fld('Heading', 'eH', x.h, { wide: 1 })}
      ${fld('Main text', 'eP', x.p, { area: 1, rows: 3, wide: 1 })}
      <h4>Bullet points</h4>${gridHTML('gPts', ['Icon', 'Text'], x.pts || [], { fixed: 1 })}
      ${fld('Example line', 'eEx', x.ex, { area: 1, rows: 2, wide: 1 })}
      ${fld('Code / command shown on the slide', 'eCode', c.v, { area: 1, rows: 5, mono: 1, wide: 1, hint: c.raw ? '(contains HTML tags: edit carefully)' : '' })}
      <h4>🔍 Meaning of each part</h4>${gridHTML('gParts', ['Part', 'Meaning'], parts.map(r => [praw ? (r[0].raw ? r[0].v : escCode(r[0].v)) : r[0].v, r[1]]), { fixed: 1 })}
      ${fld('⚙️ What happens here?', 'eWhat', [].concat(x.what || []).join('\n'), { area: 1, rows: 3, wide: 1, hint: 'one line = a paragraph; several lines = numbered steps' })}
      <h4>🧪 Example</h4>
      ${fld('What we try', 'eEgN', eg.note, { wide: 1 })}
      <div class="cced-row">${fld('Example input / code', 'eEgC', ec.v, { area: 1, rows: 4, mono: 1 })}${fld('Output', 'eEgO', eo.v, { area: 1, rows: 4, mono: 1 })}</div>
      ${fld('✅ Result', 'eRes', x.res, { area: 1, rows: 2, wide: 1 })}
      <h4>📋 Table</h4>${fld('Table title', 'eTc', tbl.cap, { wide: 1, hint: 'e.g. Important points for your exam' })}${gridHTML('gTbl', tbl.h, tbl.r)}
      ${fld('🔁 Real-life analogy', 'eAn', x.an, { area: 1, rows: 2, wide: 1 })}
      ${fld('✓ Takeaway', 'eTk', x.tk, { area: 1, rows: 2, wide: 1 })}
      <h4>📝 Teacher notes (only you see these)</h4>
      ${fld('What to say', 'nSay', n.say, { area: 1, rows: 3, wide: 1 })}
      <div class="cced-row">${fld('Likely student question', 'nAsk', n.ask, { area: 1, rows: 2 })}${fld('Answer', 'nAns', n.ans, { area: 1, rows: 2 })}</div>
      ${fld('Watch out for', 'nWatch', n.watch, { area: 1, rows: 2, wide: 1 })}
      <details class="cced-adv"><summary>Advanced: other fields of this slide (JSON)</summary><p class="cced-tip">Comparison boxes (<code>cmp</code>), animations (<code>demo</code>), images (<code>img</code>) and anything else. Leave as it is unless you know the format.</p><textarea id="eOther" rows="6" class="mono" spellcheck="false">${esc(JSON.stringify(other, null, 2))}</textarea></details>`,
      async w => {
        let o; try { o = JSON.parse(val(w, 'eOther') || '{}'); } catch (e) { throw new Error('The Advanced box is not valid JSON: ' + e.message); }
        const set = (k, v) => { if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete o[k]; else o[k] = v; };
        if (!val(w, 'eH').trim()) throw new Error('The slide needs a heading.');
        set('k', val(w, 'eK').trim()); set('ic', val(w, 'eIc').trim()); set('h', val(w, 'eH').trim()); set('p', val(w, 'eP').trim());
        set('pts', gridRows(w, 'gPts').map(r => [r[0] || '•', r[1]])); set('ex', val(w, 'eEx').trim());
        set('code', val(w, 'eCode').trim() ? codeOut(val(w, 'eCode').replace(/\s+$/, ''), c.raw) : '');
        set('parts', gridRows(w, 'gParts').map(r => [praw ? r[0] : escCode(r[0]), r[1]]));
        const wh = lines(val(w, 'eWhat')); set('what', wh.length > 1 ? wh : (wh[0] || ''));
        const e2 = {}; if (val(w, 'eEgN').trim()) e2.note = val(w, 'eEgN').trim(); if (val(w, 'eEgC').trim()) e2.code = codeOut(val(w, 'eEgC').replace(/\s+$/, ''), ec.raw); if (val(w, 'eEgO').trim()) e2.out = codeOut(val(w, 'eEgO').replace(/\s+$/, ''), eo.raw);
        set('eg', Object.keys(e2).length ? e2 : null); set('res', val(w, 'eRes').trim());
        const tr = gridRows(w, 'gTbl'), th = gridHeads(w, 'gTbl');
        set('tbl', tr.length ? Object.assign({ h: th, r: tr }, val(w, 'eTc').trim() ? { cap: val(w, 'eTc').trim() } : {}) : null);
        set('an', val(w, 'eAn').trim()); set('tk', val(w, 'eTk').trim());
        const nn = {}; [['say', 'nSay'], ['ask', 'nAsk'], ['ans', 'nAns'], ['watch', 'nWatch']].forEach(p => { const v = val(w, p[1]).trim(); if (v) nn[p[0]] = v; });
        set('n', Object.keys(nn).length ? nn : null);
        const u = clone(s); if (isNew) u.slides.splice(i, 0, o); else u.slides[i] = o;
        await CL.saveUnit(s.id, u); done(isNew ? 'Slide added' : 'Slide saved');
      });
    gridWire(w); return w;
  }

  /* ---------- lecture details ---------- */
  const LEC = ['title', 'sub', 'introH', 'intro', 'introAn', 'obj', 'rev', 'mistakes', 'disc', 'hw', 'slides', 'id'];
  function lectureForm(s) {
    const other = {}; Object.keys(s).forEach(k => { if (!LEC.includes(k)) other[k] = s[k]; });
    shell(`Edit lecture details · ${A.label(s)}`, `
      ${fld('Lecture title', 'lT', s.title, { wide: 1 })}${fld('Subtitle (on the title slide)', 'lS', s.sub, { area: 1, rows: 2, wide: 1 })}
      ${fld('“Why this matters” heading', 'lIH', s.introH, { wide: 1 })}${fld('“Why this matters” text', 'lI', s.intro, { area: 1, rows: 4, wide: 1 })}${fld('“Why this matters” analogy', 'lIA', s.introAn, { area: 1, rows: 2, wide: 1 })}
      ${fld('Learning objectives', 'lO', (s.obj || []).join('\n'), { area: 1, rows: 5, wide: 1, hint: 'one per line' })}
      ${fld('Recap: remember these points', 'lR', (s.rev || []).join('\n'), { area: 1, rows: 5, wide: 1, hint: 'one per line' })}
      ${fld('Common mistakes (watch out)', 'lM', (s.mistakes || []).join('\n'), { area: 1, rows: 4, wide: 1, hint: 'one per line' })}
      ${fld('Discussion questions', 'lD', (s.disc || []).join('\n'), { area: 1, rows: 3, wide: 1, hint: 'one per line' })}
      ${fld('Homework / before next class', 'lH', s.hw, { area: 1, rows: 2, wide: 1 })}
      <details class="cced-adv"><summary>Advanced: quiz, check questions, lab, key terms, assessment, week… (JSON)</summary><p class="cced-tip">Everything else in this lecture. Quiz questions look like <code>{"q":"…","o":["A","B","C","D"],"a":0,"e":"why"}</code> where <code>a</code> is the number of the right option, counting from 0.</p><textarea id="lOther" rows="16" class="mono" spellcheck="false">${esc(JSON.stringify(other, null, 2))}</textarea></details>`,
      async w => {
        let o; try { o = JSON.parse(val(w, 'lOther') || '{}'); } catch (e) { throw new Error('The Advanced box is not valid JSON: ' + e.message); }
        if (!val(w, 'lT').trim()) throw new Error('The lecture needs a title.');
        if (!Array.isArray(o.quiz)) throw new Error('Advanced box: "quiz" must stay a list (it can be empty: []).');
        const u = Object.assign(o, { id: s.id, title: val(w, 'lT').trim(), sub: val(w, 'lS').trim(), obj: lines(val(w, 'lO')), rev: lines(val(w, 'lR')), mistakes: lines(val(w, 'lM')), slides: clone(s.slides) });
        [['introH', 'lIH'], ['intro', 'lI'], ['introAn', 'lIA'], ['hw', 'lH']].forEach(p => { const v = val(w, p[1]).trim(); if (v) u[p[0]] = v; });
        const d = lines(val(w, 'lD')); if (d.length) u.disc = d;
        if (typeof u.week !== 'number' || !Array.isArray(u.lo) || !u.unit) throw new Error('Advanced box: keep "week" (a number), "unit" and "lo" (a list).');
        await CL.saveUnit(s.id, u); done('Lecture saved');
      });
  }

  /* ---------- slide manager: order, add, copy, delete ---------- */
  function manage(s) {
    const w = shell(`Slides of ${A.label(s)} (${s.slides.length})`, `<p class="cced-tip">These are the content slides. The title, objectives, recap, check and glossary slides are made automatically from the lecture details.</p>
      <div class="cced-list">${s.slides.map((x, i) => `<div class="cced-it"><span class="num">${i + 1}</span><span class="grow"><small>${esc(x.k || 'Concept')}</small><b>${esc(A.strip(x.h))}</b></span><button class="btn sm" data-a="up" data-i="${i}" ${i ? '' : 'disabled'} title="Move up">↑</button><button class="btn sm" data-a="down" data-i="${i}" ${i < s.slides.length - 1 ? '' : 'disabled'} title="Move down">↓</button><button class="btn sm" data-a="edit" data-i="${i}">✏️ Edit</button><button class="btn sm" data-a="add" data-i="${i}" title="Add a new slide after this one">＋</button><button class="btn sm" data-a="copy" data-i="${i}" title="Duplicate">⧉</button><button class="btn sm" data-a="del" data-i="${i}" title="Delete">🗑</button></div>`).join('')}</div>
      <div class="cced-gb"><button class="btn sm pri" data-a="add" data-i="-1">＋ Add a slide at the start</button><button class="btn sm" data-a="lec">📄 Edit lecture details</button>${CL.edited(s.id) ? '<button class="btn sm" data-a="reset">↩ Restore the original lecture</button>' : ''}</div>`);
    w.addEventListener('click', async e => {
      const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, i = +b.dataset.i, m = $('#ccedMsg', w);
      if (a === 'edit') return slideForm(s, i); if (a === 'add') return slideForm(s, i + 1, true); if (a === 'lec') return lectureForm(s);
      const u = clone(s);
      if (a === 'up') u.slides.splice(i - 1, 0, u.slides.splice(i, 1)[0]);
      else if (a === 'down') u.slides.splice(i + 1, 0, u.slides.splice(i, 1)[0]);
      else if (a === 'copy') u.slides.splice(i + 1, 0, clone(u.slides[i]));
      else if (a === 'del') { if (u.slides.length < 2) return void (m.textContent = 'A lecture needs at least one slide.'); if (!confirm(`Delete slide ${i + 1}: “${A.strip(s.slides[i].h)}”? Students will no longer see it.`)) return; u.slides.splice(i, 1); }
      else if (a === 'reset') { if (!confirm(`Remove ALL your edits to ${A.label(s)} and go back to the original lecture? This cannot be undone.`)) return; }
      $$('button', w).forEach(x => x.disabled = true); m.className = 'cced-msg'; m.textContent = 'Saving…';
      try { if (a === 'reset') await CL.resetUnit(s.id); else await CL.saveUnit(s.id, u); A.refresh(); toast(a === 'reset' ? 'Original lecture restored' : 'Saved'); manage(A.sess(s.id)); }
      catch (err) { manage(s); const m2 = $('#ccedMsg'); m2.className = 'cced-msg bad'; m2.textContent = err.message; }
    });
  }
  function done(msg) { close(); A.refresh(); toast(msg + ' · live for everyone'); }

  /* ---------- teacher sign-in panel ---------- */
  function panel() {
    if (!CL.on) return shell('Teacher: edit lectures', '<p>The cloud database is not connected yet, so editing is switched off.</p>');
    if (!teacher()) {
      const w = shell('Teacher sign-in', `<p class="cced-tip">Only the course teacher can edit lectures. Students never need to sign in.</p>${fld('Email', 'tE', '', { wide: 1 })}<label class="cced-f wide"><span>Password</span><input id="tP" type="password" autocomplete="current-password"></label>`,
        async w => { await CL.login(val(w, 'tE').trim(), val(w, 'tP')).catch(e => { throw new Error(/INVALID|EMAIL_NOT_FOUND|MISSING/.test(e.message) ? 'Wrong email or password.' : e.message); }); panel(); A.refresh(); toast('Signed in: Edit buttons are now on every lecture'); }, 'Sign in');
      $('#tE', w).type = 'email'; $('#tE', w).autocomplete = 'username'; return;
    }
    const ed = A.sessions.filter(s => CL.edited(s.id));
    const w = shell('Teacher: edit lectures', `<p>Signed in as <b>${esc(CL.user.email)}</b>.</p>
      <p class="cced-tip">Open any lecture and use <b>✏️ Edit</b> on a slide, <b>🗂 Manage slides</b> to add, delete or re-order, or <b>✏️ Edit</b> in Present mode. Each save is live for all students at once (they see it the next time they open the portal or the app with internet).</p>
      <h4>Lectures you have edited (${ed.length})</h4><div class="cced-list">${ed.map(s => `<div class="cced-it"><span class="grow"><b>${esc(A.label(s))}: ${esc(s.title)}</b></span><a class="btn sm" href="#/s/${s.id}" data-go>Open</a></div>`).join('') || '<p class="cced-tip">None yet. All lectures are the original versions.</p>'}</div>
      <div class="cced-gb"><button class="btn sm" id="tOut">Sign out</button></div>`);
    $('#tOut', w).onclick = () => { CL.logout(); close(); A.refresh(); toast('Signed out'); };
    $$('[data-go]', w).forEach(a => a.addEventListener('click', close));
  }

  /* ---------- buttons on the pages (called by app.js after each render) ---------- */
  function decorate() {
    if (!teacher()) return;
    const P = A.pres;
    if (P && $('#pres') && !$('#pEd')) {
      const b = document.createElement('button'); b.className = 'btn sm'; b.id = 'pEd'; b.textContent = '✏️ Edit'; b.title = 'Edit this slide';
      b.onclick = () => { const x = A.pres.d[A.pres.i], s = A.pres.s; if (x && x._i != null) slideForm(s, x._i); else if (x && (x.type === 'lab' || x.type === 'check' || x.type === 'gloss')) { lectureForm(s); toast('This slide is built from the lecture details (Advanced box)'); } else lectureForm(s); };
      const m = document.createElement('button'); m.className = 'btn sm hide-s'; m.id = 'pMg'; m.textContent = '🗂 Slides'; m.onclick = () => manage(A.pres.s);
      const sp = $('#pres .pfoot .spacer'); sp.after(b, m);
    }
    const tb = $('#app .shead .toolbar'), m = /^#\/s\/(\d+)/.exec(location.hash);
    if (tb && m && !$('#sEd')) {
      const s = A.sess(m[1]); if (!s) return;
      tb.insertAdjacentHTML('beforeend', `<button class="btn" id="sEd">✏️ Edit lecture</button><button class="btn" id="sMg">🗂 Manage slides</button>${CL.edited(s.id) ? '<span class="chip">edited</span>' : ''}`);
      $('#sEd').onclick = () => lectureForm(A.sess(s.id)); $('#sMg').onclick = () => manage(A.sess(s.id));
      $$('#app .slideCard[data-si]').forEach(c => { const i = +c.dataset.si; c.insertAdjacentHTML('afterbegin', `<span class="cced-btns noprint"><button class="btn sm" data-e>✏️ Edit</button><button class="btn sm" data-n title="Add a new slide after this one">＋ Slide</button></span>`); $('[data-e]', c).onclick = () => slideForm(A.sess(s.id), i); $('[data-n]', c).onclick = () => slideForm(A.sess(s.id), i + 1, true); });
    }
  }
  window.CCEdit = { decorate, panel, open: panel };

  /* get the newest edits once per visit; re-draw the page if anything changed */
  if (CL.on) setTimeout(() => CL.sync().then(ch => { if (ch && !$('#cced')) A.refresh(); }).catch(() => {}), 400);
  decorate();
})();
