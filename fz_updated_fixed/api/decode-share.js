const crypto = require('crypto');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { s } = req.body;
    if (!s) return res.status(400).json({ success: false, error: 'Missing encrypted payload' });

    const SECRET = process.env.SHARE_ENCRYPT_KEY;
    if (!SECRET) return res.status(500).json({ success: false, error: 'Server encryption key not configured' });

    // Base64url decode
    let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (b64.length % 4)) % 4;
    b64 += '='.repeat(pad);
    const combined = Buffer.from(b64, 'base64');

    // Need at least iv(12) + authTag(16) + 1 byte ciphertext
    if (combined.length < 29) {
      return res.status(400).json({ success: false, error: 'Invalid payload (too short)' });
    }

    // Extract parts: iv(12) + authTag(16) + ciphertext
    const iv = combined.subarray(0, 12);
    const authTag = combined.subarray(12, 28);
    const ciphertext = combined.subarray(28);

    // Derive key
    const keyHash = crypto.createHash('sha256').update(SECRET).digest();

    // Decrypt with AES-256-GCM
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyHash, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const obj = JSON.parse(decrypted.toString('utf8'));

    return res.status(200).json({
      success: true,
      url: obj.u,
      key: obj.k,
      label: obj.l || '',
      exp: obj.e || 0
    });
  } catch (err) {
    // Could be old format or tampered — return failure
    return res.status(400).json({ success: false, error: 'Decryption failed — invalid or legacy link' });
  }
};
