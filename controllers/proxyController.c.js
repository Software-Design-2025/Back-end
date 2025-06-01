const fetch = require('node-fetch');

async function proxyAudio(req, res) {
    const url = req.query.url;
    const range = req.headers['range'];

    if (!url) {
        return res.status(400).send('Missing url');
    }

    const headers = {};
    if (range) {
        headers['Range'] = range;
    }

    try {
        const response = await fetch(url, { headers });
        if (!response.ok && response.status !== 206) {
            return res.status(500).send('Failed to fetch audio');
        }

        // Forward all relevant headers
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.status(response.status);
        response.body.pipe(res);
    } catch (err) {
        res.status(500).send('Proxy error');
    }
}

module.exports = { proxyAudio };
