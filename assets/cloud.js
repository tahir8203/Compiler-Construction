/* Cloud lectures: the teacher's edits live in Firestore (collection "units", one document per lecture, field "json" = the
   whole lecture). Every device loads the built-in lectures first, then applies the saved edits (cached for offline use),
   then checks the cloud once for newer edits. Only plain fetch is used (Firestore + Identity Toolkit REST), no SDK.
   Loaded after the sessions files and before app.js. */
(function(){
  const CFG = window.CC_CLOUD || {}, ON = !!(CFG.projectId && CFG.apiKey);
  const S = window.COURSE.sessions, CK = 'cc-cloud-v1', AK = 'cc-teacher-v1';
  const DOCS = `https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents`;
  const orig = {};                                   // id -> JSON of the built-in lecture
  S.forEach(s => { orig[s.id] = JSON.stringify(s); });
  const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const wr = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let cache = rd(CK, { units: {} }); if (!cache.units) cache = { units: {} };
  let auth = rd(AK, null), tok = null, tokExp = 0;

  function put(id, json) {                           // replace a lecture's content in place (app.js keeps the same object)
    const s = S.find(x => x.id === +id); if (!s) return false;
    let o; try { o = JSON.parse(json); } catch (e) { return false; }
    if (!o || !Array.isArray(o.slides) || !o.title) return false;
    Object.keys(s).forEach(k => delete s[k]); Object.assign(s, o); s.id = +id; return true;
  }
  Object.keys(cache.units).forEach(id => { if (!put(id, cache.units[id].json)) delete cache.units[id]; });

  async function api(url, opt) {
    const r = await fetch(url, opt); let j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok) { const m = j && j.error && (j.error.message || j.error.status) || ('HTTP ' + r.status); const e = new Error(m); e.status = r.status; throw e; }
    return j;
  }
  /* Download the edited lectures; returns true when something changed on this device. */
  async function sync() {
    if (!ON) return false;
    const j = await api(`${DOCS}/units?pageSize=100&key=${CFG.apiKey}`);
    const seen = {}; let changed = false;
    (j.documents || []).forEach(d => {
      const id = d.name.split('/').pop(), json = d.fields && d.fields.json && d.fields.json.stringValue; if (!json) return;
      seen[id] = 1;
      if (!cache.units[id] || cache.units[id].t !== d.updateTime) { if (put(id, json)) { cache.units[id] = { json, t: d.updateTime }; changed = true; } }
    });
    Object.keys(cache.units).forEach(id => { if (!seen[id]) { delete cache.units[id]; if (orig[id]) put(id, orig[id]); changed = true; } });
    if (changed) wr(CK, cache);
    return changed;
  }

  /* ----- teacher sign-in (email + password) ----- */
  async function login(email, password) {
    if (!ON) throw new Error('The cloud database is not set up yet.');
    const j = await api(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CFG.apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
    auth = { email: j.email, uid: j.localId, rt: j.refreshToken }; wr(AK, auth); tok = j.idToken; tokExp = Date.now() + (+j.expiresIn - 60) * 1000; return auth;
  }
  function logout() { auth = null; tok = null; wr(AK, null); }
  async function token() {
    if (!auth) throw new Error('Please sign in first.');
    if (tok && Date.now() < tokExp) return tok;
    try {
      const j = await api(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(auth.rt) });
      tok = j.id_token; tokExp = Date.now() + (+j.expires_in - 60) * 1000; return tok;
    } catch (e) { if (e.status === 400) { logout(); throw new Error('Your sign-in has expired. Please sign in again.'); } throw e; }
  }
  const nice = e => /PERMISSION_DENIED|Missing or insufficient/i.test(e.message) ? new Error('This account is not allowed to edit lectures.') : /Failed to fetch|NetworkError/i.test(e.message) ? new Error('No internet connection. Your change was not saved.') : e;

  /* Save a whole lecture; everyone gets it the next time they open the portal or app. */
  async function saveUnit(id, obj) {
    const json = JSON.stringify(obj);
    if (json.length > 900000) throw new Error('This lecture is too large to save (limit about 900 KB).');
    try {
      const d = await api(`${DOCS}/units/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + await token() }, body: JSON.stringify({ fields: { json: { stringValue: json }, by: { stringValue: auth.email }, at: { timestampValue: new Date().toISOString() } } }) });
      put(id, json); cache.units[id] = { json, t: d.updateTime }; wr(CK, cache);
    } catch (e) { throw nice(e); }
  }
  /* Throw away every edit of one lecture and go back to the built-in version. */
  async function resetUnit(id) {
    try { await api(`${DOCS}/units/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + await token() } }); } catch (e) { throw nice(e); }
    delete cache.units[id]; wr(CK, cache); if (orig[id]) put(id, orig[id]);
  }

  window.CCCloud = { on: ON, sync, login, logout, saveUnit, resetUnit, get user() { return auth; }, edited: id => !!cache.units[id], original: id => orig[id] ? JSON.parse(orig[id]) : null };
})();
