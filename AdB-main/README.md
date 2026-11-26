# AdB – Asociația de Băștinași „Călărășenii”

Structură identică cu `ctc-web` (site static, fără build; Firebase din CDN):

```
index.html        # schelet subțire: head, #app, scripturi
assets/logo.jpg   # sigla (înainte: base64 în HTML)
css/style.css     # toate stilurile
js/config.js      # configurare Firebase + e-mail owner
js/data.js        # conținut implicit (window.ADB_DEFAULTS)
js/db.js          # strat de date: Auth, Firestore (adb/site, membershipApplications), cache local
js/app.js         # site-ul public + rutare (#acasa, #admin ...)
js/admin.js       # panou de administrare (login, editor, cereri de aderare)
```

Ordinea scripturilor: config → data → db → app → admin.
Conținutul editat în admin se salvează în Firestore `adb/site` și se aplică live pe site.
