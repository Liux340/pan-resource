export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response('OAuth not configured', { status: 500 });
    }

    if (url.pathname === '/api/auth') {
      const redirectUri = new URL('/api/callback', url.origin).toString();
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', clientId);
      githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
      githubAuthUrl.searchParams.set('scope', 'repo,user');
      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    if (url.pathname === '/api/callback') {
      const code = url.searchParams.get('code');
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });
      const tokenData = await tokenRes.json();
      const html = `
        <html><body><script>
          window.opener.postMessage('${JSON.stringify(tokenData)}', '*');
          window.close();
        </script></body></html>
      `;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};