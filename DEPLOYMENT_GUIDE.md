# 🚀 ServiGo Deployment Guide (Render Backend + Vercel Frontend + MongoDB Atlas)

## 🎯 Quick Status
✅ MongoDB fixes (no local fallback), API URLs relative (`/api`), deploy configs ready. backend/.env has your Atlas URI.

## 📋 Deployment Steps

### 1. Push to GitHub (5 mins)
```
git init  # if not done
git add .
git commit -m "Prepare for deployment: Fix DB/API, add configs"
gh repo create servigo-project --public --push  # or your repo
# Connect Render/Vercel to repo
```

### 2. Backend: Render.com (FREE)
1. [render.com](https://render.com) → Sign up → New **Web Service** → Connect GitHub repo.
2. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
3. **Environment Variables** (Dashboard → Environment):
   ```
   MONGO_URI=mongodb+srv://servigoUser:Munazir123@cluster0.ckuprcy.mongodb.net/servigo
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-min32chars-change-this  # Generate new
   # Add EMAIL_USER/EMAIL_PASS if using emails
   ```
4. Deploy → URL: `https://your-app.onrender.com`
5. Test: `curl https://your-app.onrender.com/` → "🚀 Server is running..."

**Note**: Free tier sleeps after 15min idle (wakes on request <10s).

### 3. Frontend: Vercel (FREE)
1. [vercel.com](https://vercel.com) → Sign up → New Project → Import GitHub repo.
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
3. **Environment Variables**:
   ```
   API_URL=https://your-render-backend.onrender.com/api  # Your Render URL
   ```
   *(Uses window.ENV.API_URL in public/env.js)*
4. Deploy → URL: `https://your-frontend.vercel.app`

### 4. MongoDB Atlas Setup (if not done)
- Cluster ready, IP whitelist `0.0.0.0/0`
- Test local: `cd backend && npm start` → "✅ MongoDB Connected"

### 5. Custom Domain (Optional)
- **Vercel**: Project Settings → Domains → Add your domain.
- **Render**: Dashboard → Custom Domains → Add subdomain.

### 6. Test End-to-End
```
# Backend health
curl https://your-backend/api/services

# Frontend load + API call (browser console)
# Login/Register → Check MongoDB Atlas collections
```

### 7. Production Tips
| Service | Upgrade Path |
|---------|--------------|
| Render | Starter $7/mo (always-on) |
| Vercel | Pro $20/mo (high traffic) |
| Atlas  | M10 $10/mo (backups/performance) |

## 🧪 Local Test Command
```bash
# Backend (w/ your Atlas)
cd backend && npm start

# Frontend build
cd frontend && npm run build  # Check build/ for static files
```

## 📄 Full Env Vars Reference
**backend/.env** (local + Render):
```
MONGO_URI=mongodb+srv://servigoUser:Munazir123@cluster0.ckuprcy.mongodb.net/servigo
JWT_SECRET=supersecretkeymin32chars
NODE_ENV=production
PORT=10000  # Render auto
```

**Vercel Env**:
```
API_URL=https://your-render-app.onrender.com/api
```

Project ready! Push to GitHub → Auto-deploy. Ping for issues.
