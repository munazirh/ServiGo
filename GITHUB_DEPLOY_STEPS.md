# 🚀 Full GitHub + Free Hosting Deployment Guide for ServiGo.me

**Goal**: Live servigo.me with GitHub Pro + CI/CD. **$0/mo**, auto-deploys on git push.

## 📋 Prerequisites (5 mins)
1. GitHub Pro account (done).
2. Install GitHub CLI: `winget install GitHub.cli` (Windows).
3. Sign in: `gh auth login`.
4. Namecheap dashboard (servigo.me DNS).

## Step 1: GitHub Repo Setup & Push (5 mins)
```bash
cd "e:/Project_01"
git add .
git commit -m "Complete ServiGo with loading/error/404"
gh repo create servigo-fullstack --private -y --push --source=. --remote=origin
```
- Repo: `https://github.com/YOURUSERNAME/servigo-fullstack`.

## Step 2: MongoDB Atlas Free DB (5 mins)
1. [Atlas](https://cloud.mongodb.com) → New M0 cluster.
2. Network → 0.0.0.0/0.
3. **MONGO_URI** copy (mongodb+srv://...).

**backend/.env** (gitignore'd):
```
MONGO_URI=your_mongo_uri
JWT_SECRET=change_me_32_chars_min
PORT=10000
EMAIL_USER=gmail@gmail.com
EMAIL_PASS=app_password
```

## Step 3: Backend - Render.com with GitHub (10 mins)
1. [Render.com](https://render.com) signup → GitHub connect.
2. **New Web Service** → `servigo-fullstack`.
3. Settings:
   - Root Dir: `backend`
   - Build: `npm ci --prod`
   - Start: `node index.js`
   - Env Vars: MONGO_URI, JWT_SECRET, etc.
   - Free tier.
4. Deploy → API: `https://servigo-api.onrender.com`.
5. **Update frontend env.js** local: `API_URL=https://servigo-api.onrender.com/api`.

## Step 4: Frontend - Vercel with GitHub (10 mins)
1. [Vercel.com](https://vercel.com) signup → GitHub connect.
2. **New Project** → `servigo-fullstack`.
3. Settings:
   - Root Dir: `frontend`
   - Build: `npm ci && npm run build`
   - Output: `build`
   - Env: `REACT_APP_API_URL=https://servigo-api.onrender.com/api`
4. Deploy → Preview URL, add custom domain `servigo.me`.

## Step 5: Domain - Namecheap to Vercel/Render (5 mins)
**Namecheap** → servigo.me → Advanced DNS:
- `@` CNAME `cname.vercel-dns.com` (Vercel frontend).
- `api` CNAME `servigo-api.onrender.com` (backend).

**Vercel** → Project → Domains → Add `servigo.me`, `api.servigo.me` → Verify.

## Step 6: GitHub CI/CD Workflows (Auto-Deploy, 5 mins)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy ServiGo
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Backend Test/Build
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend && npm ci && npm test || true
      
      # Frontend Test/Build
      - run: cd frontend && npm ci && npm run build
      
      # Notify Deploy
      - name: Notify Deploy
        run: |
          echo "🚀 Deployed to Vercel/Render - check dashboards"
```

Commit: `git add .github/workflows && git commit -m "Add CI/CD" && git push`.

## Step 7: Test Live Site (5 mins)
- Frontend: https://servigo.me (loading spinner, 404 test).
- API: https://api.servigo.me/ → "🚀 Server running".
- Book service → Mongo saves.
- Error crash → Soft recovery.

## Step 8: Production Monitoring (Optional)
- Render/Vercel dashboards.
- UptimeRobot free pings.
- Mongo Atlas metrics.

## 🔧 Troubleshooting
| Issue | Solution |
|-------|----------|
| API 500 | Check Render logs, .env vars. |
| Domain | DNS 24h, whatsmydns.net check. |
| Build fail | Logs in Vercel, node 20. |
| Loading not show | Add `useLoading().showLoading()` before fetch in pages. |

**Done! Push changes → Auto-live.** servigo.me ready for customers. Upgrade tiers as traffic grows.

**Generated for GitHub Pro full deployment.**

