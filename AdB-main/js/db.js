/* ==========================================================
   Strat de date – Firebase (Auth + Firestore) cu rezervă locală
   Colecții: adb/site (conținutul), membershipApplications (cereri)
   ========================================================== */
(function () {
  'use strict';
  var CACHE_KEY = 'adb_admin_data_v1';
  var DB = { live: false, auth: null, fs: null, user: null, data: null };
  var authCbs = [], stopRealtime = null;

  try {
    if (window.firebase && window.FIREBASE_CONFIG) {
      firebase.initializeApp(window.FIREBASE_CONFIG);
      DB.auth = firebase.auth();
      DB.fs = firebase.firestore();
      DB.live = true;
    }
  } catch (e) { console.error('Firebase init:', e); }

  /* ---------- conținut: valori implicite + memorie locală ---------- */
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  function normalize(d) {
    d = Object.assign(clone(window.ADB_DEFAULTS || {}), d || {});
    delete d.logo;                     // sigla vine din assets/logo.jpg
    return d;
  }
  DB.normalize = normalize;
  DB.defaults = function () { return clone(window.ADB_DEFAULTS || {}); };
  try { var cached = localStorage.getItem(CACHE_KEY); DB.data = normalize(cached ? JSON.parse(cached) : null); }
  catch (e) { DB.data = normalize(null); }

  /* ---------- autentificare ---------- */
  DB.onAuth = function (cb) { authCbs.push(cb); };
  if (DB.auth) DB.auth.onAuthStateChanged(function (u) { DB.user = u; authCbs.forEach(function (cb) { cb(u); }); });
  DB.signIn = function (email, pass) {
    if (!DB.auth) return Promise.reject({ code: 'no-firebase' });
    return DB.auth.signInWithEmailAndPassword(email, pass);
  };
  DB.signOut = function () { return DB.auth ? DB.auth.signOut() : Promise.resolve(); };

  /* ---------- conținutul site-ului ---------- */
  DB.saveSite = function (data) {
    if (!DB.fs || !DB.user) return Promise.reject({ code: 'no-auth' });
    var out = clone(data); delete out.logo;
    return DB.fs.collection('adb').doc('site').set({
      data: out,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: DB.user.email || DB.user.uid
    });
  };
  DB.watchSite = function (cb) {            // ascultă modificările în timp real
    if (!DB.fs || stopRealtime) return;
    stopRealtime = DB.fs.collection('adb').doc('site').onSnapshot(function (snap) {
      if (!snap.exists) return;
      var remote = snap.data().data;
      if (remote && typeof remote === 'object') {
        DB.data = normalize(remote);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(DB.data)); } catch (e) {}
        cb(DB.data);
      }
    }, function (e) { console.error('Firebase realtime error:', e); });
  };

  /* ---------- cereri de aderare ---------- */
  DB.addApplication = function (d) {
    if (!DB.fs) return Promise.reject({ code: 'no-firebase' });
    d = Object.assign({}, d, { consent: true, status: 'new', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    return DB.fs.collection('membershipApplications').add(d);
  };
  DB.listApplications = function () {
    return DB.fs.collection('membershipApplications').orderBy('createdAt', 'desc').get().then(function (snap) {
      var out = []; snap.forEach(function (doc) { out.push(Object.assign({ id: doc.id }, doc.data())); }); return out;
    });
  };
  DB.setApplicationStatus = function (id, status) {
    return DB.fs.collection('membershipApplications').doc(id).update({ status: status });
  };

  window.DB = DB;
})();
