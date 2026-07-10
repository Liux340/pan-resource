export async function onRequest(context) {
  const { env, request } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const url = new URL(request.url);
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