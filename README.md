# ZXKAI Galaxy Console

A Firebase Connection Dashboard with space-themed UI, Cloudflare Turnstile verification, multi-connection monitoring, and Telegram forwarding.

## Features

- 🔐 **Cloudflare Turnstile** — Server-side verification on first visit
- 🌌 **Space Theme** — Animated stars, glitch effects, ZXKAI branding
- 📱 **Firebase SMS Monitor** — Connect to Firebase RTDB, view devices & SMS
- 🔗 **Share Links** — Generate permanent share links for connections
- 👁️ **Watch All** — Monitor all saved Firebase connections simultaneously
- 📨 **Telegram Forwarder** — Forward incoming SMS to Telegram bot in real-time
- 🛡️ **Anti-DevTools** — Integrity shield with decoy page

## Project Structure

```
zxkai-vercel/
├── index.html          # Main SPA (static)
├── api/
│   ├── get-config.js   # Serverless: returns Turnstile site key
│   └── verify-turnstile.js  # Serverless: verifies Turnstile token
├── vercel.json         # Vercel routing config
├── package.json        # Project metadata
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Deployment to Vercel

### Prerequisites
- A [Vercel](https://vercel.com) account
- [Git](https://git-scm.com/) installed locally
- A [GitHub](https://github.com) account (recommended)

### Step-by-Step Deployment

#### Option A: Deploy via GitHub (Recommended)

1. **Create a GitHub repository:**
   ```bash
   cd zxkai-vercel
   git init
   git add .
   git commit -m "Initial commit - ZXKAI Galaxy Console"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/zxkai-galaxy-console.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `zxkai-galaxy-console` repository
   - Framework Preset: **Other** (leave as-is)
   - Build Command: **Leave empty**
   - Output Directory: **Leave empty**
   - Click **Deploy**

3. **Set Environment Variables:**
   - After deploy, go to **Project Settings → Environment Variables**
   - Add these two variables:
     ```
     TURNSTILE_SITE_KEY = 0x4AAAAAAEKiOX-U7bxSSzIY
     TURNSTILE_SECRET_KEY = 0x4AAAAAAEKiOfyHZKDnYxQkqsw9n8Xb-ks
     ```
   - Apply to: **Production**, **Preview**, and **Development**
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the 3-dot menu on the latest deployment
   - Click **Redeploy** to pick up the new environment variables

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd zxkai-vercel
   vercel --prod
   ```
   - When prompted:
     - Set up and deploy? **Y**
     - Which scope? Select your account
     - Link to existing project? **N**
     - Project name? **zxkai-galaxy-console**
     - Directory? **./**
     - Override settings? **N**

4. **Set Environment Variables:**
   ```bash
   vercel env add TURNSTILE_SITE_KEY production
   # Enter: 0x4AAAAAAEKiOX-U7bxSSzIY
   
   vercel env add TURNSTILE_SECRET_KEY production
   # Enter: 0x4AAAAAAEKiOfyHZKDnYxQkqsw9n8Xb-ks
   ```

5. **Redeploy with env vars:**
   ```bash
   vercel --prod
   ```

### Post-Deployment Verification

1. Visit your Vercel URL (e.g., `https://zxkai-galaxy-console.vercel.app`)
2. You should see the Cloudflare Turnstile verification gate
3. Complete verification — it will only appear once (stored in localStorage)
4. Connect a Firebase RTDB to verify full functionality

### Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `TURNSTILE_SITE_KEY` | `0x4AAAAAAEKiOX-U7bxSSzIY` | Client-side widget rendering |
| `TURNSTILE_SECRET_KEY` | `0x4AAAAAAEKiOfyHZKDnYxQkqsw9n8Xb-ks` | Server-side token verification |

### Troubleshooting

- **"Configuration error" on Turnstile gate:** Environment variables not set. Add them in Vercel Settings → Environment Variables, then redeploy.
- **404 on API routes:** Ensure the `api/` folder with `.js` files is in the root of your deployment.
- **Watch All not loading:** Verify your Firebase RTDB uses `/clients` as the device node and `/messages/{deviceId}` for SMS.

## Tech Stack

- Pure HTML/CSS/JS (no frameworks)
- Vercel Serverless Functions (Node.js 18+)
- Cloudflare Turnstile
- Firebase Realtime Database (client-side)
- Telegram Bot API (client-side)
