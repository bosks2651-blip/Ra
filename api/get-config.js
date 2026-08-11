module.exports = function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const siteKey = process.env.TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  return res.status(200).json({
    success: true,
    siteKey: siteKey,
  });
};
