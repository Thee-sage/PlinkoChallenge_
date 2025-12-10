# 🚀 Deployment Guide - Free Hosting Setup

This guide will help you deploy your Plinko Challenge app to **free hosting platforms** with all features working.

## 📋 Overview

- **Backend:** Render or Fly.io (truly free forever - recommended)
- **Frontend:** Vercel (free tier - unlimited)
- **Database:** MongoDB Atlas (free tier - 512MB)
- **File Storage:** Local storage on backend server (or upgrade to cloud storage later)

> **⚠️ Important:** Railway's free tier expires after initial credit. For truly free hosting that lasts forever, use **Render** (spins down but wakes) or **Fly.io** (always on).

## 🗄️ Step 1: Set Up MongoDB Atlas (Free)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE (M0) tier
   - Select a cloud provider and region (closest to your backend)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `plinko-admin` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access" → "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IPs of your hosting providers
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `plinkochallenge` (or your choice)
   - Example: `mongodb+srv://plinko-admin:yourpassword@cluster0.xxxxx.mongodb.net/plinkochallenge?retryWrites=true&w=majority`

## 🔧 Step 2: Set Up Google OAuth (Optional but Recommended)

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create Project:**
   - Click "Select a project" → "New Project"
   - Name: "Plinko Challenge"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API" or "People API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Plinko Challenge Web"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local dev)
     - `https://your-vercel-app.vercel.app` (your Vercel URL)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for local dev)
     - `https://your-vercel-app.vercel.app` (your Vercel URL)
   - Click "Create"
   - **Copy the Client ID** (you'll need this)

## 🚂 Step 3: Deploy Backend (Choose One)

### Option A: Render (Recommended - Free Forever)
**Best for:** Portfolio projects, low traffic
**Note:** Spins down after 15 min inactivity, but wakes automatically on request (first request may take ~30 seconds)

1. **Sign Up:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Select your repository
   - **Settings:**
     - **Name:** `plinko-backend`
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free (spins down after inactivity)

3. **Add Environment Variables:**
   - Go to "Environment" tab
   - Add these variables:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plinkochallenge
   PORT=3001
   NODE_ENV=production
   BASE_URL=https://your-app.onrender.com
   FRONTEND_URL=https://your-frontend.vercel.app
   JWT_SECRET=your-super-secret-jwt-key-generate-random-string
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-gmail-app-password-16-characters
   ADMIN_APPROVAL_PASSWORD_HASH=your-bcrypt-hash
   ```

4. **Create Web Service:**
   - Click "Create Web Service"
   - Render will build and deploy your app

5. **Get Your Backend URL:**
   - Render provides: `https://your-app.onrender.com`
   - Copy this URL (you'll need it for frontend)

### Option B: Fly.io (Always On - Free Forever)
**Best for:** Real-time features, always-on requirements
**Note:** Always running, no spin-down. Better for Socket.IO and real-time features.

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign Up:**
   ```bash
   fly auth signup
   ```

3. **Initialize:**
   ```bash
   cd backend
   fly launch
   ```
   - Follow prompts (choose region, app name, etc.)

4. **Set Secrets:**
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/plinkochallenge"
   fly secrets set JWT_SECRET="your-secret-key"
   fly secrets set BASE_URL="https://your-app.fly.dev"
   fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"
   fly secrets set NODE_ENV="production"
   fly secrets set GOOGLE_CLIENT_ID="your-google-client-id"
   fly secrets set GMAIL_USER="your-email@gmail.com"
   fly secrets set GMAIL_APP_PASSWORD="your-gmail-app-password-16-characters"
   fly secrets set ADMIN_APPROVAL_PASSWORD_HASH="your-bcrypt-hash"
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

6. **Get Your Backend URL:**
   - Fly.io provides: `https://your-app.fly.dev`
   - Copy this URL

### Option C: Railway (Not Recommended - Expires)
**⚠️ Warning:** Railway's free tier expires after initial $5 credit. Only $1/month free credit after that, which may not be enough.

If you still want to use Railway:

1. **Sign Up:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Select your repository
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables:**
   - Same as Railway (see above)
   - Update `BASE_URL` to your Render URL

4. **Get Your Backend URL:**
   - Render provides: `https://your-app.onrender.com`

1. Sign up at https://railway.app
2. Deploy from GitHub repo
3. Set environment variables (same as Render)
4. Note: Will require payment after free credit expires

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Sign Up:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:

   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-app.vercel.app`

5. **Update CORS in Backend:**
   - Go back to your backend hosting (Railway/Render)
   - Add your Vercel URL to environment variables
   - Update `FRONTEND_URL` to your Vercel URL
   - Update `allowedOrigins` in `backend/src/index.ts` (or use env variable - see below)

## 🔐 Step 5: Generate Required Secrets

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Admin Password Hash:
```bash
cd backend
node -e "const bcrypt=require('bcrypt');bcrypt.hash('your-admin-password',10).then(h=>console.log('Hash:',h))"
```

### Gmail App Password (for email features):
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to "App Passwords"
4. Generate password for "Mail"
5. Use this password in `GMAIL_APP_PASSWORD` (not your regular Gmail password)

## 🔄 Step 6: Update CORS Configuration

Update `backend/src/index.ts` to include your production URLs in `allowedOrigins` array, or better yet, use environment variables:

```typescript
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    // Add your production URLs
    "https://your-app.vercel.app",
    // ... other URLs
];
```

## 📧 Step 7: Configure Email (Optional but Recommended)

For email features (password reset, verification) to work:

1. **Gmail Setup:**
   - Use Gmail SMTP (free)
   - Create App Password (see Step 5)
   - Use in `GMAIL_USER` and `GMAIL_APP_PASSWORD`

2. **Alternative Email Services:**
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 5,000 emails/month)
   - Resend (free tier: 3,000 emails/month)

## ✅ Step 8: Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.railway.app/settings`
   - Should return game settings JSON

2. **Test Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Should load the app
   - Try signing up/logging in
   - Test the game

3. **Check Console:**
   - Open browser DevTools
   - Check for CORS errors
   - Check Network tab for API calls

## 🐛 Troubleshooting

### CORS Errors:
- Make sure `FRONTEND_URL` in backend matches your Vercel URL
- Add Vercel URL to `allowedOrigins` in `backend/src/index.ts`
- Check that URLs don't have trailing slashes

### MongoDB Connection:
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Make sure password is URL-encoded if it has special characters

### Socket.IO Not Working:
- Check that `VITE_SOCKET_URL` matches backend URL
- Verify WebSocket is supported by your hosting (Railway/Render support it)
- Check browser console for connection errors

### File Uploads Not Working:
- Railway/Render have ephemeral file systems
- Files will be lost on restart
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Build Errors:
- Make sure all dependencies are in `package.json`
- Check build logs in hosting dashboard
- Verify Node.js version compatibility

## 📊 Free Tier Limits

### Render (Recommended):
- ✅ **Free forever**
- Spins down after 15 min inactivity
- Wakes automatically on request (first request ~30 seconds)
- Perfect for portfolio projects
- 512 MB RAM, 0.1 CPU

### Fly.io (Recommended):
- ✅ **Free forever**
- Always on (no spin-down)
- Better for real-time features
- 3 shared CPU instances
- 256 MB RAM per app
- 3 GB storage

### Railway (Not Recommended):
- ⚠️ **Expires after initial credit**
- $5 free credit initially
- Only $1/month free credit after (may not be enough)
- Not suitable for long-term free hosting

### Vercel:
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for frontend hosting

### MongoDB Atlas:
- 512MB storage (free)
- Shared cluster
- Perfect for development/portfolio

## 🎯 Next Steps

1. Set up custom domain (optional)
2. Add monitoring (Sentry, LogRocket)
3. Set up CI/CD (automatic deployments)
4. Add cloud storage for file uploads (Cloudinary, AWS S3)
5. Set up backups for MongoDB

## 📝 Environment Variables Checklist

**Backend:**
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `BASE_URL` (your backend URL)
- ✅ `FRONTEND_URL` (your Vercel URL)
- ✅ `GMAIL_USER` and `GMAIL_APP_PASSWORD` (for email features)
- ✅ `ADMIN_APPROVAL_PASSWORD_HASH`

**Frontend:**
- ✅ `VITE_API_URL` (your backend URL)
- ✅ `VITE_SOCKET_URL` (your backend URL)
- ✅ `VITE_GOOGLE_CLIENT_ID`

---

**You're all set! Your app should now be live with all features working! 🎉**

