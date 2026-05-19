// =========================================================
// PPUQHM Admin Panel — GitHub OAuth Proxy Worker
// =========================================================
// Worker ini menangani login admin panel Sveltia CMS via GitHub OAuth.
// Diperlukan karena GitHub OAuth Apps butuh client_secret yang
// tidak boleh ada di browser (harus di server-side).
//
// Routes:
//   GET /auth?provider=github   → redirect ke GitHub OAuth
//   GET /callback?code=...      → exchange code, postMessage token ke CMS
//
// Environment variables (set di Cloudflare dashboard):
//   GITHUB_CLIENT_ID       = Ov23liRrhjk0enTCSrvj
//   GITHUB_CLIENT_SECRET   = (rahasia, dari GitHub OAuth App)
// =========================================================

const ALLOWED_ORIGINS = [
  'https://santripapua.com',
  'https://www.santripapua.com',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // === /auth → redirect ke GitHub authorize ===
    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider') || 'github';
      const scope = url.searchParams.get('scope') || 'repo,user';

      if (provider !== 'github') {
        return new Response('Only github provider supported', { status: 400 });
      }

      const state = btoa(JSON.stringify({ ts: Date.now() }));
      const gh = new URL('https://github.com/login/oauth/authorize');
      gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      gh.searchParams.set('redirect_uri', `${url.origin}/callback`);
      gh.searchParams.set('scope', scope);
      gh.searchParams.set('state', state);

      return Response.redirect(gh.toString(), 302);
    }

    // === /callback → exchange code, return HTML postMessage ===
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'ppuqhm-admin-auth',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      let status, payload;
      if (data.error) {
        status = 'error';
        payload = JSON.stringify(data);
      } else {
        status = 'success';
        payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      }
      const msg = `authorization:github:${status}:${payload}`;

      const allowed = JSON.stringify(ALLOWED_ORIGINS);
      const escMsg = JSON.stringify(msg);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authorizing...</title>
  <style>body{font-family:system-ui,sans-serif;padding:2rem;text-align:center}</style>
</head>
<body>
<p>Authorization ${status}. Jendela ini akan tertutup otomatis...</p>
<script>
(function(){
  var allowed = ${allowed};
  function receive(e){
    if (allowed.indexOf(e.origin) === -1) { return; }
    window.opener.postMessage(${escMsg}, e.origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function(){ window.close(); }, 400);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // === Default ===
    return new Response('PPUQHM Admin Auth Proxy\nPaths: /auth, /callback', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
