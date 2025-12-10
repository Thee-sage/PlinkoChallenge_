# ⚡ Quick Deploy Guide - 10 Minutes to Live

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🎯 Goal
Deploy to:
- **Backend:** Render or Fly.io (truly free forever)
- **Frontend:** Vercel (free tier)  
- **Database:** MongoDB Atlas (free tier)

> **Note:** Railway's free tier expires after initial credit. Use Render (spins down but wakes) or Fly.io (always on) for truly free hosting.

## 📝 Step-by-Step

### 1. MongoDB Atlas (5 min)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create FREE cluster
3. Create database user (save password!)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Get connection string → Replace `<password>` and `<dbname>`

### 2. Google OAuth (2 min - Optional)
1. https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth credentials → Web application
4. Add authorized origins: `http://localhost:5173` and your future Vercel URL
5. Copy Client ID

### 3. Deploy Backend (Choose One)

#### Option A: Render (Recommended - Free Forever)
**Note:** Spins down after 15 min inactivity, but wakes automatically on request (perfect for portfolio)

1. Sign up: https://render.com (with GitHub)
2. New → Web Service → Connect GitHub repo
3. Select your repo
4. Settings:
   - **Name:** `plinko-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Go to Environment tab → Add these variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/plinkochallenge
PORT=3001
NODE_ENV=production
BASE_URL=https://your-app.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
JWT_SECRET=generate-with-node-command-below
GOOGLE_CLIENT_ID=your-google-client-id
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password-16-characters
ADMIN_APPROVAL_PASSWORD_HASH=generate-with-node-command-below
```

6. Click "Create Web Service"
7. Copy your Render URL (e.g., `https://your-app.onrender.com`)

#### Option B: Fly.io (Always On - Free Forever)
**Note:** Always running, no spin-down. Better for real-time features.

1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Sign up: `fly auth signup`
3. In `backend` folder: `fly launch`
4. Set secrets:
```bash
fly secrets set MONGODB_URI="mongodb+srv://..."
fly secrets set JWT_SECRET="your-secret"
fly secrets set BASE_URL="https://your-app.fly.dev"
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"
# ... set all other variables
```
5. Deploy: `fly deploy`
6. Copy your Fly.io URL (e.g., `https://your-app.fly.dev`)

**Generate Secrets:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Admin Password Hash
cd backend
node -e "const bcrypt=require('bcrypt');bcrypt.hash('your-password',10).then(h=>console.log(h))"
```

### 4. Deploy Frontend to Vercel (2 min)
1. Sign up: https://vercel.com (with GitHub)
2. Add New → Project → Import GitHub repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Environment Variables → Add:

```env
VITE_API_URL=https://your-app.onrender.com
# OR if using Fly.io: https://your-app.fly.dev
VITE_SOCKET_URL=https://your-app.onrender.com
# OR if using Fly.io: https://your-app.fly.dev
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

6. Deploy → Copy your Vercel URL

### 5. Update Backend CORS (1 min)
1. Go back to Render/Fly.io → Environment Variables
2. Update `FRONTEND_URL` with your Vercel URL
3. Add `ALLOWED_ORIGINS` = your Vercel URL
4. Redeploy (Render auto-redeploys, Fly.io: `fly deploy`)

### 6. Update Google OAuth (1 min)
1. Go to Google Cloud Console
2. Edit OAuth credentials
3. Add your Vercel URL to authorized origins/redirects
4. Save

### 7. Test! 🎉
- Visit your Vercel URL
- Try signing up
- Play the game
- Check browser console for errors

## ✅ Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Google OAuth configured
- [ ] Backend deployed to Render or Fly.io
- [ ] All backend env vars set
- [ ] Frontend deployed to Vercel
- [ ] All frontend env vars set
- [ ] CORS updated with Vercel URL
- [ ] Google OAuth updated with Vercel URL
- [ ] App tested and working

## 🐛 Common Issues

**CORS Error:**
- Make sure `FRONTEND_URL` in Render/Fly.io = your Vercel URL
- Add Vercel URL to `ALLOWED_ORIGINS` in Render/Fly.io

**MongoDB Connection:**
- Check connection string has correct password
- Verify IP is whitelisted in Atlas

**Socket.IO Not Working:**
- Make sure `VITE_SOCKET_URL` = backend URL
- Check both use HTTPS

**Build Fails:**
- Check build logs in Render/Fly.io/Vercel
- Make sure all dependencies in package.json

**Render Spins Down:**
- First request after 15 min will be slow (~30 seconds)
- This is normal for free tier - app wakes automatically
- Consider Fly.io if you need always-on (no spin-down)

## 📚 Need More Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.

---

**That's it! Your app should be live! 🚀**

