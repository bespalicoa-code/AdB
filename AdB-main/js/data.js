/* ==========================================================
   Conținut implicit al site-ului (folosit până se încarcă
   datele din Firestore sau dacă Firebase nu este disponibil).
   Modificările făcute din panoul de administrare se salvează
   în Firestore (adb/site) și le înlocuiesc pe acestea.
   ========================================================== */
window.ADB_DEFAULTS = {
  "site": {
    "name": "Asociația de Băștinași „Călărășenii”",
    "nameEn": "Hometown Association",
    "motto": "Uniți prin rădăcini. Implicați pentru viitor.",
    "domain": "www.adbcalarasenii.md"
  },
  "hero": {
    "lead": "Suntem o comunitate de oameni originari din orașul Călărași, uniți de dorința de a păstra legătura cu locurile natale și de a contribui la dezvoltarea durabilă a comunității noastre."
  },
  "welcome": {
    "title": "Bine ați venit pe platforma oficială a Asociației de Băștinași „Călărășenii”!",
    "text": "Indiferent unde ne aflăm astăzi, în Republica Moldova sau peste hotare, credem că fiecare dintre noi poate contribui prin cunoștințe, experiență, resurse, idei și implicare la construirea unui viitor mai bun pentru Călărași.\nÎmpreună transformăm apartenența într-o forță de dezvoltare."
  },
  "stats": [
    {
      "label": "Membri înregistrați",
      "value": "—",
      "note": "de acasă și de peste hotare"
    },
    {
      "label": "Diaspora",
      "value": "—",
      "note": "călărășeni din țări diferite"
    },
    {
      "label": "Fonduri mobilizate",
      "value": "—",
      "note": "pentru comunitate"
    },
    {
      "label": "Proiecte susținute",
      "value": "—",
      "note": "proiecte locale"
    }
  ],
  "mission": "Mobilizarea și consolidarea comunității călărășene din țară și din diaspora pentru a contribui la dezvoltarea socială, culturală, educațională și economică a orașului Călărași.",
  "vision": "O comunitate conectată, solidară și implicată, în care cetățenii, diaspora, instituțiile publice și mediul de afaceri colaborează pentru dezvoltarea durabilă a orașului Călărași.",
  "join": {
    "title": "Transformă legătura cu Călărașiul în implicare, iar implicarea în rezultate.",
    "text": "Fiecare călărășean poate contribui. Alătură-te unei comunități care construiește punți între oameni, generații și continente."
  },
  "adn": [
    {
      "letter": "C",
      "word": "Comunitate",
      "text": "Comunitatea este punctul nostru de pornire. Oamenii, de acasă și de pretutindeni, sunt cea mai importantă resursă a Călărașiului."
    },
    {
      "letter": "Ă",
      "word": "Astăzi",
      "text": "Astăzi este momentul în care alegem să ne implicăm. Schimbarea începe prin ceea ce putem face acum."
    },
    {
      "letter": "L",
      "word": "Legătură",
      "text": "Legătura cu Călărași ne aduce împreună. Conectăm oameni, generații, idei, experiențe și resurse."
    },
    {
      "letter": "Ă",
      "word": "Aproape",
      "text": "Aproape rămânem indiferent unde ne aflăm. Distanța geografică nu trebuie să devină distanță față de comunitate."
    },
    {
      "letter": "R",
      "word": "Responsabilitate",
      "text": "Responsabilitatea transformă apartenența în angajament. A ține la Călărași înseamnă și a contribui."
    },
    {
      "letter": "A",
      "word": "Acțiune",
      "text": "Acțiunea transformă ideile în proiecte. Credem în inițiative concrete și rezultate măsurabile."
    },
    {
      "letter": "Ș",
      "word": "Șanse",
      "text": "Șansele create deschid oportunități pentru tineri, antreprenori, familii, reveniți și investitori."
    },
    {
      "letter": "I",
      "word": "Impact",
      "text": "Impactul este ceea ce rămâne. Succesul se măsoară prin schimbarea reală generată în comunitate."
    }
  ],
  "news": [],
  "gallery": [],
  "about": {
    "intro": "Asociația de Băștinași „Călărășenii” este o organizație apolitică, independentă și non-profit, creată din inițiativa cetățenilor originari din orașul Călărași.\nOrganizația a fost fondată pentru a consolida relațiile dintre comunitatea locală și diaspora și pentru a sprijini dezvoltarea locală prin dialog, voluntariat, parteneriate și proiecte comunitare.",
    "purposes": [
      "consolidarea legăturii dintre diasporă și comunitate",
      "mobilizarea resurselor umane și profesionale",
      "susținerea inițiativelor locale",
      "promovarea culturii și patrimoniului local",
      "dezvoltarea parteneriatelor naționale și internaționale",
      "implicarea cetățenilor în dezvoltarea comunității"
    ],
    "values": [
      {
        "title": "Apartenență",
        "text": "Ne unește dragostea pentru locurile natale."
      },
      {
        "title": "Integritate",
        "text": "Acționăm transparent și responsabil."
      },
      {
        "title": "Solidaritate",
        "text": "Credem în puterea comunității."
      },
      {
        "title": "Voluntariat",
        "text": "Încurajăm participarea activă."
      },
      {
        "title": "Respect",
        "text": "Promovăm dialogul și colaborarea."
      },
      {
        "title": "Dezvoltare",
        "text": "Investim în oameni și în viitor."
      }
    ]
  },
  "team": [
    {
      "name": "Vasile Zaharia",
      "role": "Președinte al Asociației",
      "text": "Asigură reprezentarea instituțională a organizației, coordonarea relațiilor cu autoritățile publice, partenerii locali și membrii comunității, precum și promovarea obiectivelor strategice ale Asociației.",
      "members": []
    },
    {
      "name": "Viorica Olaru",
      "role": "Administrator al Asociației",
      "text": "Coordonează activitatea curentă a organizației, asigură dezvoltarea strategică, comunicarea cu partenerii naționali și internaționali, elaborarea proiectelor, atragerea de resurse și consolidarea relației cu diaspora călărășeană.",
      "members": []
    },
    {
      "name": "Alexei Cotelea",
      "role": "Cenzor",
      "text": "Exercită funcțiile de control intern și monitorizare a activităților financiare și administrative ale Asociației, în conformitate cu prevederile legislației și ale Statutului organizației.",
      "members": []
    },
    {
      "name": "Consiliul Asociației",
      "role": "Conducere strategică",
      "text": "Exercită funcțiile de conducere strategică, monitorizează implementarea obiectivelor organizației și contribuie la dezvoltarea relațiilor de colaborare cu comunitatea și partenerii instituționali. În conformitate cu Statutul, Consiliul este format din:",
      "members": [
        "Nadea Revenco",
        "Vitalii Lozovan",
        "Gheorghe Rîpeanu"
      ]
    },
    {
      "name": "Voluntari și colaboratori",
      "role": "Echipa extinsă",
      "text": "Oameni care își dedică timpul și expertiza proiectelor Asociației.",
      "members": []
    }
  ],
  "membership": {
    "benefits": [
      "contribui la dezvoltarea comunității",
      "participi la proiecte și evenimente",
      "faci parte dintr-o rețea internațională de călărășeni",
      "ai acces la oportunități de voluntariat și mentorat",
      "poți iniția și susține proiecte comunitare"
    ],
    "duties": [
      "să respecte Statutul Asociației",
      "să promoveze buna imagine a organizației",
      "să participe activ la realizarea obiectivelor",
      "să contribuie la dezvoltarea comunității"
    ],
    "involve": [
      "mentorat pentru tineri",
      "voluntariat",
      "expertiză profesională",
      "sponsorizări și donații",
      "promovarea proiectelor",
      "facilitarea parteneriatelor internaționale"
    ],
    "formUrl": ""
  },
  "diaspora": {
    "intro": "Călărășeni din țară și de peste hotare, uniți într-o singură rețea.",
    "countries": [],
    "ambassadors": []
  },
  "projects": {
    "list": [],
    "fund": {
      "title": "Fond de cofinanțare",
      "text": ""
    }
  },
  "partners": [
    {
      "name": "Primăria or. Călărași",
      "text": "",
      "url": ""
    },
    {
      "name": "Consiliul Raional Călărași",
      "text": "",
      "url": ""
    },
    {
      "name": "Instituții educaționale",
      "text": "",
      "url": ""
    },
    {
      "name": "Instituții culturale",
      "text": "",
      "url": ""
    },
    {
      "name": "Mediul de afaceri",
      "text": "",
      "url": ""
    }
  ],
  "donate": {
    "intro": "Fiecare contribuție ajunge direct în proiecte pentru comunitatea din Călărași.",
    "methods": [
      {
        "title": "Donații individuale",
        "detail": "",
        "url": ""
      },
      {
        "title": "Sponsorizări",
        "detail": "",
        "url": ""
      },
      {
        "title": "Transfer bancar",
        "detail": "",
        "url": ""
      },
      {
        "title": "PayPal / Revolut",
        "detail": "",
        "url": ""
      }
    ],
    "purposes": [
      "Cazuri sociale",
      "Burse",
      "Proiecte comunitare",
      "Cofinanțare proiecte"
    ]
  },
  "contacts": {
    "email": "bastinacalarasi@gmail.com",
    "phone": "",
    "address": "",
    "facebookName": "Asociația de Băștinași „Călărășenii”",
    "facebookUrl": "",
    "instagramName": "Asociația de Băștinași „Călărășenii”",
    "instagramUrl": ""
  }
};
