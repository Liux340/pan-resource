export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const redirectUri = new URL('/callback', url.origin).toString();
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo,user');
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await res.json();

      const payload = JSON.stringify({ token: data.access_token, ...data })
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");

      const html = `<!DOCTYPE html>
<html>
<body>
<script>
  console.log('OAuth callback received');
  console.log('opener:', !!window.opener);
  var payload = '${payload}';
  console.log('payload:', payload);
  if (window.opener) {
    window.opener.postMessage(payload, '*');
    console.log('message sent, closing...');
    setTimeout(function() { window.close(); }, 200);
  } else {
    document.body.innerHTML = '<p>OAuth complete. Token received. You can close this window.</p>';
  }
<\/script>
</body>
</html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};