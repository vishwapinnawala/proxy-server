const { createServer } = require('http');
const { parse } = require('url');
const https = require('https');

const proxyServer = createServer((req, res) => {
    const { method, url, headers } = req;
    if (method !== 'GET') {
        res.statusCode = 405; // Method Not Allowed
        res.end();
        return;
    }

    const { pathname } = parse(url);
    const parts = pathname.split('/');
    const trackingNumber = parts[parts.length - 1];

    const options = {
        hostname: '185.196.21.84',
        port: 8088,
        path: `/parcel/track-parcel/${trackingNumber}`,
        method: 'GET',
        headers: {
            ...headers,
            'accept': '*/*',
            'USER': '1'
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy request error:', err);
        res.statusCode = 500; // Internal Server Error
        res.end();
    });

    req.pipe(proxyReq, { end: true });
});

proxyServer.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});
