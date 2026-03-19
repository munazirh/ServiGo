# Deployment Preparation TODO
Status: [In Progress]

## 1. [x] Create TODO.md (done)

## 2. [x] Fix Backend MongoDB Connection
- [x] Edit backend/index.js: Remove local DB fallback, use only process.env.MONGO_URI with retry logic

## 3. [x] Fix Frontend API URLs
- [x] Edit frontend/public/env.js: Set API_URL to '' for relative paths
- [x] Edit frontend/src/services/api.js: Ensure uses relative paths
- [x] Edit frontend/src/services/adminApi.js: Replace hardcoded localhost with relative /api
- [x] Edit frontend/src/services/technicianApi.js: Replace hardcoded localhost
- [x] Confirmed no other hardcoded localhost via search_files

## 4. [x] Create Deployment Configs
- [x] Create backend/render.yaml
- [x] Create frontend/vercel.json
- [x] Update backend/.env with Atlas URI (local test)

## 5. [x] Update Docs
- [x] Update README.md / DEPLOYMENT_GUIDE.md with steps & env vars

## 6. [x] Test & Deploy
- [x] Local test ready: Run commands in DEPLOYMENT_GUIDE.md
- [x] Ready for Git push → Connect Render/Vercel repos
