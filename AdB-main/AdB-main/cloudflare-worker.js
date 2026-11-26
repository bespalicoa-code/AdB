export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(request, env)
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Metoda nu este permisă.' }, 405, request, env);
    }

    let body;
    try {
      body = await request.json();
    } catch (_) {
      return json({ error: 'Conținut invalid.' }, 400, request, env);
    }

    if (!body.idToken || !body.html) {
      return json({ error: 'Lipsește autentificarea sau conținutul.' }, 400, request, env);
    }

    const auth = await verifyFirebaseUser(body.idToken, env.FIREBASE_API_KEY);
    if (!auth || auth.email !== env.ADB_OWNER_EMAIL) {
      return json({ error: 'Acces interzis.' }, 403, request, env);
    }

    const base = 'https://api.github.com/repos/' +
      encodeURIComponent(env.GITHUB_OWNER) + '/' +
      encodeURIComponent(env.GITHUB_REPO) + '/contents/index.html';

    const headers = {
      'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'AdB-Publisher'
    };

    const current = await fetch(base + '?ref=' + encodeURIComponent(env.GITHUB_BRANCH), { headers });
    if (!current.ok && current.status !== 404) {
      return json({ error: 'Nu se poate verifica index.html în GitHub.' }, 502, request, env);
    }

    const existing = current.ok ? await current.json() : null;
    const payload = {
      message: 'Actualizare AdB din panoul de administrare',
      content: base64Utf8(body.html),
      branch: env.GITHUB_BRANCH
    };
    if (existing && existing.sha) payload.sha = existing.sha;

    const published = await fetch(base, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });

    if (!published.ok) {
      const detail = await published.text();
      return json({ error: 'Publicarea GitHub a eșuat.', detail }, 502, request, env);
    }

    return json({ ok: true }, 200, request, env);
  }
};

async function verifyFirebaseUser(idToken, apiKey) {
  const response = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
      encodeURIComponent(apiKey),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  if (!response.ok) return null;
  const result = await response.json();
  return result.users && result.users[0] ? result.users[0] : null;
}

function base64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '').replace(/\/$/, '');
  return {
    'Access-Control-Allow-Origin': origin && origin === allowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(value, status, request, env) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env)
    }
  });
}
