# Plinko Challenge - Setup Guide

This guide will help you set up the Plinko Challenge application for local development and portfolio use.

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## Project Structure

```
plinkochallenge/
├── backend/          # Node.js/Express/TypeScript backend
├── frontend/         # React/Vite/TypeScript frontend
└── SETUP.md         # This file
```

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up MongoDB

You have two options:

### Option A: Local MongoDB
1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/plinkochallenge`

### Option B: MongoDB Atlas (Free Tier)
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## Step 3: Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/plinkochallenge
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server Configuration
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# JWT Secret (generate a strong random string)
# You can generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
# Get this from Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Gmail SMTP Configuration (for password reset, verification, etc.)
# IMPORTANT: You need to create a Gmail App Password (not your regular password)
# Steps: Google Account → Security → 2-Step Verification → App Passwords
# The app password will be 16 characters long
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password-16-characters

# Admin Configuration
# Generate a hash for admin approval password using:
# node -e "const bcrypt=require('bcrypt');bcrypt.hash('your-password',10).then(h=>console.log(h))"
ADMIN_APPROVAL_PASSWORD_HASH=your-bcrypt-hashed-password-here
```

### Quick Setup for Development (Minimal Config)

For a quick start with minimal features, you can use this minimal `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/plinkochallenge
PORT=3001
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
ADMIN_APPROVAL_PASSWORD_HASH=your-hash
```

**Note:** Some features (email verification, password reset) won't work without proper email configuration, but the core game functionality will work.

## Step 4: Configure Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001

# Google OAuth Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Note:** The frontend will fall back to localhost if these aren't set, but it's better to set them explicitly.

## Step 5: Build Backend (if needed)

If you need to compile TypeScript:

```bash
cd backend
npm run build
```

## Step 6: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# or
npm start  # if using compiled version
```

The backend should start on `http://localhost:3001`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

## Step 7: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running (if using local)
- Check your connection string is correct
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Change port in `vite.config.ts` or use `npm run dev -- --port 3000`

### CORS Errors
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check `allowedOrigins` in `backend/src/index.ts` if needed

### Email Not Working
- For Gmail, you need to create an "App Password" (not your regular password)
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Use that app password in `GMAIL_APP_PASSWORD`

### Google OAuth Not Working
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production URL (if deploying)

## Optional: Generate Admin Password Hash

To create an admin account, you need to hash a password:

```bash
cd backend
node -e "const bcrypt=require('bcrypt');bcrypt.hash('your-password-here',10).then(h=>console.log('Hash:',h))"
```

Copy the hash and use it in `ADMIN_APPROVAL_PASSWORD_HASH` in your `.env` file.

## Deployment Notes

### For Portfolio/Production:

1. **Backend:**
   - Use a service like Railway, Render, or Heroku
   - Set all environment variables in the hosting platform
   - Make sure MongoDB Atlas allows connections from your hosting IP

2. **Frontend:**
   - Update `VITE_API_URL` and `VITE_SOCKET_URL` to your backend URL
   - Deploy to Vercel, Netlify, or similar
   - Build command: `npm run build`
   - Output directory: `dist`

3. **CORS:**
   - Update `allowedOrigins` in `backend/src/index.ts` with your production frontend URL

## Features

- Plinko game with customizable settings
- User authentication (email/password and Google OAuth)
- Wallet system with Zixos currency
- Admin panel for managing ads, casinos, and game settings
- Real-time updates via Socket.IO
- Email verification and password reset

## Support

If you encounter any issues during setup, check:
1. All environment variables are set correctly
2. MongoDB is accessible
3. Ports are not in use by other applications
4. Node.js version is compatible (v16+)

Good luck with your portfolio! 🎉

