# 🚀 Deployment Guide for Budget Tracker

## Option 1: One-Click Deployment (Recommended)

### Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "Deploy from GitHub repo"**
4. **Select this repository**
5. **Configure the service:**
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Deploy** - Railway will automatically build and deploy your backend

### Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import this repository**
5. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-railway-backend-url.railway.app`
7. **Deploy**

## Option 2: Alternative Deployment

### Backend Alternatives:
- **Render**: Free tier available
- **Heroku**: Easy deployment
- **DigitalOcean App Platform**: Simple setup

### Frontend Alternatives:
- **Netlify**: Great for React apps
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google's platform

## 🔧 Manual Deployment Steps

### 1. Backend (Railway)

```bash
# Your backend is ready for Railway deployment
# Railway will automatically detect:
# - requirements.txt for Python dependencies
# - Procfile for start command
# - railway.json for configuration
```

### 2. Frontend (Vercel)

```bash
# Build the frontend locally (optional)
cd frontend
npm install
npm run build

# Vercel will handle this automatically
```

## 🌐 Expected URLs

After deployment, you'll get:
- **Backend API**: `https://your-app-name.railway.app`
- **Frontend App**: `https://your-app-name.vercel.app`

## 🔑 Environment Variables

### Backend (Railway)
- PORT: (automatically set by Railway)

### Frontend (Vercel/Netlify)
- REACT_APP_API_URL: Your Railway backend URL

## 📱 Post-Deployment

1. **Test the API** at `https://your-backend-url.railway.app`
2. **Visit your app** at `https://your-frontend-url.vercel.app`
3. **Update CORS** if needed in backend/main.py

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update allow_origins in backend
2. **API Connection**: Check REACT_APP_API_URL
3. **Build Failures**: Check Node.js/Python versions

### Logs:
- **Railway**: Check deployment logs in dashboard
- **Vercel**: Check function logs in dashboard

## 🎉 You're Live!

Once deployed, your budget tracker will be accessible worldwide! Share the link with friends and family.

---

*Need help? Check the deployment platform documentation or create an issue in this repository.*