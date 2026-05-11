# Mausam App - Single File Deployment Guide

## 🚀 Quick Build & Deploy

### Build for Production
```bash
npm run build:prod
```

This will:
1. Build the React frontend with Vite → `frontend/dist/`
2. Bundle the backend with esbuild → `backend/dist/app.js`
3. Show you the final bundle size

### Deploy
Simply copy `backend/dist/app.js` to your server and run:
```bash
node app.js
```

The backend automatically serves the frontend static files!

---

## 📦 What Gets Built

### Frontend Build (`frontend/dist/`)
- Optimized React bundle
- CSS + JavaScript minified
- All assets included

### Backend Bundle (`backend/dist/app.js`)
- Single JavaScript file
- All dependencies bundled (except Node built-ins)
- Includes all TypeScript → JavaScript compiled code
- ~5-15 MB depending on dependencies

---

## 🎯 Deployment Options

### Option 1: Node.js Server (Recommended)
```bash
node app.js
# Listens on http://localhost:5000
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
COPY backend/dist/app.js /app/
WORKDIR /app
CMD ["node", "app.js"]
```

### Option 3: PM2 (Production Process Manager)
```bash
npm install -g pm2
pm2 start app.js --name "mausam-app"
pm2 save
pm2 startup
```

---

## 🔧 Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both backend & frontend in dev mode |
| `npm run build` | Build frontend + bundle backend |
| `npm run build:prod` | Full production build with size report |
| `npm run package` | Show final build files & sizes |
| `npm start` | Run the bundled backend |

---

## ⚙️ How It Works

### Before (Development)
```
Frontend (Vite) → http://localhost:5173
Backend (Express) → http://localhost:5000
```

### After (Production)
```
Node App → Serves everything on http://localhost:5000
  ├── API endpoints (/api/*)
  └── React frontend (/* → index.html)
```

---

## 📊 Bundle Details

The bundler (esbuild) uses these settings:
- **Target**: Node 18+
- **Format**: CommonJS (compatible with Node)
- **Minified**: Yes (smaller file size)
- **External packages**: Kept external for smaller bundle
  - `express`
  - `cors`
  - `axios`
  - `redis`

These stay as separate packages, so install them on the server:
```bash
npm install express cors axios redis
```

---

## 🐛 Troubleshooting

### "Frontend not built"
```bash
npm run build:prod  # Build everything
```

### "Cannot find module"
```bash
npm install  # Install dependencies in backend folder
```

### Port already in use
```bash
lsof -ti:5000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :5000   # Windows
```

---

## 📈 Performance Tips

1. **Enable Gzip compression** in nginx/load balancer
2. **Use CDN** for static assets
3. **Enable Redis caching** for weather data
4. **Set `NODE_ENV=production`** before deployment
5. **Monitor with** PM2 or similar

---

## 🔒 Security Before Deployment

- [ ] Remove `console.log()` statements
- [ ] Set environment variables (API keys, ports)
- [ ] Enable CORS only for trusted domains
- [ ] Use HTTPS/SSL certificates
- [ ] Rate-limit API endpoints
- [ ] Add authentication if needed

---

## 📝 Example Deployment Steps

```bash
# 1. Build everything
npm run build:prod

# 2. Install server dependencies
cd backend
npm install --production

# 3. Copy to server
scp dist/app.js user@server:/app/
scp package.json user@server:/app/
cd /app && npm install --production

# 4. Run
node app.js
```
