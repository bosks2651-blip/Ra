# ZXKAI Galaxy Console 🌌

A Firebase connection dashboard with Cloudflare Turnstile verification, featuring space-themed ZXKAI branding with glitch effects.

## Features

- 🔐 Cloudflare Turnstile verification (shown once for new users)
- 🌠 Space theme with glitchy ZXKAI branding
- 🔥 Firebase connection interface
- 🛡️ Server-side token verification
- ⚡ Serverless API functions (Vercel-ready)
- 🔑 All API keys stored in environment variables

## Project Structure

```
zxkai-vercel/
├── public/
│   └── index.html          # Main frontend (Turnstile + Firebase UI)
├── api/
│   ├── verify-turnstile.js # Server-side Turnstile verification
│   └── get-config.js       # Serves site key from env vars
├── vercel.json             # Vercel routing & build config
├── package.json            # Project metadata
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Deployment to Vercel

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Vercel CLI](https://vercel.com/docs/cli) or a Vercel account
- A GitHub/GitLab/Bitbucket account (for Git-based deployment)

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   cd zxkai-vercel
   git init
   git add .
   git commit -m "Initial commit - ZXKAI Galaxy Console"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/zxkai-galaxy-console.git
   git push -u origin main
   ```

2. **Import in Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Framework Preset: **Other**
   - Root Directory: Leave as `/` (default)
   - Click **Deploy**

3. **Set Environment Variables:**
   - Go to your project in Vercel Dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add the following variables:
     | Name | Value |
     |------|-------|
     | `TURNSTILE_SITE_KEY` | `0x4AAAAAAEKiOX-U7bxSSzIY` |
     | `TURNSTILE_SECRET_KEY` | `0x4AAAAAAEKiOfyHZKDnYxQkqsw9n8Xb-ks` |
   - Select all environments (Production, Preview, Development)
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd zxkai-vercel
   vercel
   ```
   - Follow the prompts (link to existing project or create new)

4. **Set Environment Variables via CLI:**
   ```bash
   vercel env add TURNSTILE_SITE_KEY
   vercel env add TURNSTILE_SECRET_KEY
   ```
   - Enter values when prompted
   - Select all environments

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Post-Deployment

- Your app will be live at: `https://your-project-name.vercel.app`
- Turnstile verification appears on first visit
- After verification, users see the Firebase connection interface
- Verified status is stored in localStorage (shown once per browser)

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Create .env.local with your keys
cp .env.example .env.local
# Edit .env.local with actual key values

# Run locally
vercel dev
```

## Security Notes

- Secret key is NEVER exposed to the client
- Site key is served via `/api/get-config` endpoint
- Server-side verification ensures token validity
- Environment variables are managed through Vercel Dashboard

## License

MIT
