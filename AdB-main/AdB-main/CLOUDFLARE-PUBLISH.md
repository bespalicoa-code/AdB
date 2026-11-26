# Publicare automată AdB pe GitHub Pages

## 1. Creează tokenul GitHub

1. Deschide GitHub → Settings → Developer settings → Personal access tokens.
2. Creează un fine-grained token pentru repository-ul `bespalicoa-code/AdB`.
3. Permite:
   - Contents: Read and write.

## 2. Creează Cloudflare Worker

1. Deschide Cloudflare Dashboard → Workers & Pages → Create application → Worker.
2. Înlocuiește codul Workerului cu conținutul din `cloudflare-worker.js`.
3. Adaugă variabilele în Settings → Variables and Secrets:

| Variabilă | Valoare |
|---|---|
| `GITHUB_TOKEN` | tokenul fine-grained |
| `GITHUB_OWNER` | `bespalicoa-code` |
| `GITHUB_REPO` | `AdB` |
| `GITHUB_BRANCH` | `main` |
| `ADB_OWNER_EMAIL` | `bespalicoa@gmail.com` |
| `FIREBASE_API_KEY` | cheia `apiKey` din Firebase |
| `ALLOWED_ORIGIN` | adresa exactă unde rulează site-ul |

## 3. Activează URL-ul în AdB

În `index.html`, înlocuiește:

```javascript
window.ADB_PUBLISH_WORKER = "";
```

cu URL-ul Workerului:

```javascript
window.ADB_PUBLISH_WORKER = "https://numele-workerului.workers.dev";
```

## 4. Rezultat

Administratorul apasă **Publică modificările**. Sistemul:

1. salvează conținutul în Firestore;
2. verifică autentificarea Firebase;
3. generează `index.html`;
4. îl scrie în repository-ul `bespalicoa-code/AdB`;
5. GitHub Pages publică pagina actualizată.
