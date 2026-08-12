const crypto = require('crypto');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { url, key, label, exp } = req.body;
    if (!url || !key) return res.status(400).json({ success: false, error: 'Missing url or key' });

    const SECRET = process.env.SHARE_ENCRYPT_KEY;
    if (!SECRET) return res.status(500).json({ success: false, error: 'Server encryption key not configured' });

    // Build payload
    const obj = { u: url, k: key, l: label || '' };
    if (exp) obj.e = exp;
    const payload = JSON.stringify(obj);

    // Derive 256-bit key from secret using SHA-256
    const keyHash = crypto.createHash('sha256').update(SECRET).digest();

    // Generate random 12-byte IV
    const iv = crypto.randomBytes(12);

    // Encrypt with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', keyHash, iv);
    const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag(); // 16 bytes

    // Combine: iv(12) + authTag(16) + ciphertext
    const combined = Buffer.concat([iv, authTag, encrypted]);

    // Base64url encode
    const encoded = combined.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return res.status(200).json({ success: true, encoded });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Encryption failed' });
  }
};
