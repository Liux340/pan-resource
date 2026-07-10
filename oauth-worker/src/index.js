export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const redirectUri = new URL('/callback', url.origin).toString();
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo,user');
      return new Response(
        '<!DOCTYPE html><html><body><script>window.location.href=' +
        JSON.stringify(authUrl.toString()) +
        '<\/script></body></html>',
        { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
      );
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const err = url.searchParams.get('error');
      if (err) {
        return new Response(`<h1>GitHub Error</h1><p>${err}</p>`, {
          headers: { 'Content-Type': 'text/html;charset=utf-8' },
        });
      }

      const redirectUri = new URL('/callback', url.origin).toString();
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });
      const data = await res.json();

      if (data.error) {
        return new Response(`<h1>Token Error</h1><pre>${JSON.stringify(data, null, 2)}</pre>`, {
          headers: { 'Content-Type': 'text/html;charset=utf-8' },
        });
      }

      const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      return new Response(
        '<!DOCTYPE html><html><body><script>' +
        'window.opener.postMessage(' + payload + ',"*");' +
        'window.close()' +
        '<\/script></body></html>',
        { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
      );
    }

    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  },
};