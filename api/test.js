module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const hasKey = !!process.env.SHARE_ENCRYPT_KEY;
  const keyLength = process.env.SHARE_ENCRYPT_KEY ? process.env.SHARE_ENCRYPT_KEY.length : 0;
  const hasTurnstileSite = !!process.env.TURNSTILE_SITE_KEY;
  const hasTurnstileSecret = !!process.env.TURNSTILE_SECRET_KEY;
  
  return res.status(200).json({
    success: true,
    env: {
      SHARE_ENCRYPT_KEY: hasKey ? `SET (${keyLength} chars)` : 'NOT SET',
      TURNSTILE_SITE_KEY: hasTurnstileSite ? 'SET' : 'NOT SET',
      TURNSTILE_SECRET_KEY: hasTurnstileSecret ? 'SET' : 'NOT SET'
    },
    node: process.version,
    timestamp: new Date().toISOString()
  });
};
