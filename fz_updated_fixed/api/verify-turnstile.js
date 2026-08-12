const https = require('https');

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Token is required' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const result = await new Promise((resolve, reject) => {
      const postData = params.toString();
      const options = {
        hostname: 'challenges.cloudflare.com',
        path: '/turnstile/v0/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid response from Cloudflare'));
          }
        });
      });

      request.on('error', reject);
      request.write(postData);
      request.end();
    });

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).json({
        success: false,
        error: 'Verification failed',
        'error-codes': result['error-codes'] || [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Verification request failed' });
  }
};
