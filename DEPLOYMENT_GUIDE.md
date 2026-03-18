# 🚀 Servigo.me Full Deployment Guide - Live Website with High Stability (Low Crashes)

## 🎯 Overview
This guide deploys your MERN-stack ServiGo project **live on servigo.me** using **free/cheap options** prioritizing stability (PM2 for auto-restart, clustering). Since you have **free domain (servigo.me) for 1 year from Namecheap** but **no hosting yet**, we'll use:

| Component | Free/Cheap Recommendation | Why? |
|-----------|---------------------------|------|
| **Frontend (React static)** | **Vercel/Netlify** (free tier) | Unlimited bandwidth, auto-deploys from GitHub, CDN. |
| **Backend (Node API)** | **Render.com** (free tier) | Free Node hosting, auto-deploys, Postgres free (but we use Mongo). Low crash with hibernation. |
| **Database** | **MongoDB Atlas** (free M0 cluster) | 512MB free forever, global CDN. |
| **Domain** | servigo.me (Namecheap free) | Point DNS to hosts. |
| **Emails** | Gmail App Password (free) | Nodemailer. |

**Total Cost: $0/mo** (free tiers handle ~100 users/day; upgrade later ~$5-10/mo).

**Stability Features**:
- PM2-like auto-restart on Render.
- Mongo retry logic already in code.
- HTTPS auto.
- GitHub Pro → Private repo + Actions CI/CD.

**Time: 30-60 mins** first time.

## 📋 Prerequisites
- GitHub Pro account (done).
- Node.js/npm local (done).
- Free accounts: [Vercel](https://vercel.com), [Render](https://render.com), [MongoDB Atlas](https://mongodb.com/atlas), Gmail for emails.

## Step 1: GitHub Repo Setup (5 mins)
```bash
cd "e:/Project_01"
git init
git add .
```

**Create `.gitignore`** (prevents secrets/uploads):
```
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Builds
frontend/build/
backend/uploads/

# Env/Secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
frontend/.env*

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime
.pnp
.pnp.js

# CRA
frontend/.cache/
```

```bash
# Add gitignore
git add .gitignore
git commit -m "Initial commit: ServiGo full-stack app"
gh repo create servigo-app --private --source=. --remote=origin --push  # Uses GitHub CLI (install if needed: winget install GitHub.cli)
```
*Alternative: GitHub web → New Repo → Import local.*

## Step 2: MongoDB Atlas Free DB (5 mins)
1. [MongoDB Atlas signup](https://account.mongodb.com/account/register).
2. Create **M0 Free Cluster** → AWS/GCP any region.
3. **Security** → Network Access → Add IP `0.0.0.0/0` (or your IP first).
4. **Collections** → Create DB `servigo`, collections from models (auto).
5. **Connect** → Drivers → Copy **MONGO_URI** (looks like `mongodb+srv://user:pass@cluster...`).

**backend/.env** (create, gitignore'd):
```
MONGO_URI=your_atlas_connection_string_here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-prod
PORT=10000  # Render uses this
NODE_ENV=production
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password  # Generate: Google Account > Security > App Passwords
```

Test local: `cd backend && npm start` → See "✅ MongoDB Connected".

## Step 3: Backend Deploy - Render.com (10 mins)
1. [Render signup](https://render.com) → GitHub connect (Pro repo access).
2. **New → Web Service** → Connect `servigo-app` repo.
3. **Settings**:
   - Name: `servigo-api`
   - Root: `./backend`
   - Runtime: `Node`
   - Build: `npm install`
   - Start: `node index.js`
   - Env Vars: Paste all from `.env` (MONGO_URI etc.)
   - Plan: **Free** (512MB RAM, sleeps after 15min idle → wakes on request).
4. **Create** → Live URL: `https://servigo-api.onrender.com`.
5. Test: `https://servigo-api.onrender.com/` → "🚀 Server is running...".

**API Base**: `https://servigo-api.onrender.com/api` (use in frontend).

**Stability**: Render auto-restarts, health checks. Free sleeps → low traffic OK.

## Step 4: Frontend Deploy - Vercel (10 mins)
**Fix API URL** (hardcoded localhost → prod):
Edit `frontend/src/services/api.js`:
```diff
-const BASE_URL = "http://localhost:5000/api";
+const BASE_URL = window.ENV?.API_URL || "http://localhost:5000/api";
```
Commit/push: `git add . && git commit -m "Fix API URL for prod" && git push`.

**Vercel**:
1. [Vercel signup](https://vercel.com) → GitHub connect.
2. **New Project** → Import `servigo-app`.
3. **Root: `./frontend`**, Framework: **Create React App**.
4. **Env Vars**: `VITE_API_URL=https://servigo-api.onrender.com/api` (but use script hack below).
5. **Override** build: Add `frontend/public/env.js`:
```
window.ENV = { API_URL: "%VITE_API_URL%" };
```
*Better: Since CRA, use runtime public folder.*

Build command: `npm install && npm run build && echo "window.ENV={API_URL:'https://servigo-api.onrender.com/api'}" > build/env.js`

But simple: Deploy first with localhost (dev), then edit post-deploy or rebuild.

6. **Deploy** → Live: `https://servigo-app.vercel.app`.

## Step 5: Domain Setup - Namecheap DNS (5 mins)
**Namecheap Dashboard** → Domain List → servigo.me → Manage → Advanced DNS:

1. **Frontend (@ A Record)**: `servigo.me` → Vercel IP (from Vercel: Domains → Add servigo.me).
   - Vercel auto-detects, adds TXT/ALIAS.

2. **Backend (subdomain)**: Add CNAME `api.servigo.me` → `servigo-api.onrender.com`.

**Vercel**: Project → Settings → Domains → Add `servigo.me` → Verify.

**Full URLs**:
- Frontend: https://servigo.me
- API: https://api.servigo.me

Wait 5-30 mins propagation.

## Step 6: Production Hardening & Stability (Low Crashes)
1. **Seed Data** (optional): POST to `/api/services/seed` via Postman.
2. **Emails**: Test nodemailer with Gmail App Password.
3. **Monitoring**:
   - Render dashboard logs/metrics.
   - Vercel analytics.
   - Free: UptimeRobot.com ping servigo.me every 5min.
4. **Backups**: Mongo Atlas snapshot weekly (free).
5. **Updates**:
   ```bash
   git pull origin main
   # Render/Vercel auto-redeploy
   ```
6. **Scale/Crash Prevention**:
   - Render: Upgrade $7/mo for no-sleep.
   - PM2 alternative: Railway.app ($5/mo always-on).
   - Traffic: Free tiers ~10k visits/mo.

## 🧪 Testing Checklist
- [ ] Backend: https://api.servigo.me/ → "🚀 Server..."
- [ ] Frontend: https://servigo.me → Loads, services list.
- [ ] Login/Register → Mongo saves.
- [ ] Book service → API call succeeds.
- [ ] Mobile responsive.
- [ ] HTTPS secure.

## 🚨 Troubleshooting
| Issue | Fix |
|-------|-----|
| API CORS | Render auto-CORS; code has cors(). |
| Mongo connect fail | Whitelist IPs in Atlas. |
| Domain not resolving | 48h max; use dnschecker.org. |
| Render sleeps | Normal free; upgrade or ping. |
| Build fail | Check logs; `npm ci --prod`. |

## 🔄 CI/CD (Bonus, GitHub Actions)
`.github/workflows/deploy.yml`:
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - deploy to Vercel/Render via API.
```

## 📈 Next: Paid Upgrade (~$10/mo)
- Render Starter ($7): Always-on backend.
- Vercel Pro ($20): More bandwidth.
- DigitalOcean Droplet ($6): Full VPS control.

**Site Live! 🎉** Share https://servigo.me. Questions? Update guide or ping.

**Generated by BLACKBOXAI - Stable Production Deployment.**

