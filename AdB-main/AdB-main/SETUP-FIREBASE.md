# Activare Firebase pentru AdB

1. În Firebase Console, deschide proiectul `adb-web-17fc0`.
2. Activează **Authentication → Sign-in method → Email/Password**.
3. Creează utilizatorul principal la **Authentication → Users**:
   - E-mail: `bespalicoa@gmail.com`
   - Parola: alege o parolă puternică.
4. În Firebase Console, activează **Firestore Database**.
5. Nu este necesar Firebase Storage; imaginile se folosesc prin link-uri externe.
6. Instalează Firebase CLI și autentifică-te:
   - `npm install -g firebase-tools`
   - `firebase login`
7. Din folderul proiectului rulează:
   - `firebase use adb-web-17fc0`
   - `firebase deploy --only firestore:rules,hosting`
8. Adaugă celelalte administratori la **Authentication → Users**, apoi distribuie-le adresa e-mail și parola creată.

Vizitatorii pot citi conținutul. Doar utilizatorii autentificați pot modifica conținutul și adăuga linkuri către imagini externe.
