const http = require('http');
const https = require('https');

const TARGET = new URL('https://new.phhc.gov.in');
const PORT = 3001;

const server = http.createServer((req, res) => {
  const headers = { ...req.headers, host: TARGET.hostname };

  const proxyReq = https.request(
    {
      hostname: TARGET.hostname,
      port: 443,
      path: req.url,
      method: req.method,
      headers,
      rejectUnauthorized: false,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      res.writeHead(500);
    }
    res.end('Proxy error');
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
