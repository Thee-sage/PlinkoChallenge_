# Plinko Challenge 🎰

A full-stack Plinko game application built with React, Node.js, TypeScript, and MongoDB.

## 🚀 Quick Start

**For the fastest setup, see [QUICKSTART.md](./QUICKSTART.md)**

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## ⚡ Quick Setup

1. **Set up environment variables:**
   ```powershell
   # Windows PowerShell
   .\setup-env.ps1
   
   # Or manually copy:
   # backend/env.example.txt → backend/.env
   # frontend/env.example.txt → frontend/.env
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure MongoDB:**
   - Local: Make sure MongoDB is running
   - Atlas: Create free account and get connection string
   - Update `MONGODB_URI` in `backend/.env`

4. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open browser:** http://localhost:5173

## 📁 Project Structure

```
plinkochallenge/
├── backend/              # Node.js/Express/TypeScript API
│   ├── src/             # Source code
│   ├── dist/            # Compiled JavaScript
│   ├── uploads/         # Uploaded files (ads, logos)
│   ├── .env             # Environment variables (create from env.example.txt)
│   └── package.json
├── frontend/            # React/Vite/TypeScript frontend
│   ├── src/             # Source code
│   ├── dist/            # Built files
│   ├── .env             # Environment variables (create from env.example.txt)
│   └── package.json
├── SETUP.md             # Detailed setup guide
├── QUICKSTART.md        # Quick start guide
└── README.md            # This file
```

## 🔧 Environment Variables

### Backend (`backend/.env`)
- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `BASE_URL` - Backend URL
- `FRONTEND_URL` - Frontend URL
- Email configuration (for password reset, verification)
- Admin password hash

### Frontend (`frontend/.env`)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_SOCKET_URL` - WebSocket URL (default: http://localhost:3001)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

See `backend/env.example.txt` and `frontend/env.example.txt` for all variables.

## 🎮 Features

- **Plinko Game** - Customizable ball drop game with multipliers
- **User Authentication** - Email/password and Google OAuth
- **Wallet System** - Virtual currency (Zixos) for playing
- **Admin Panel** - Manage ads, casinos, and game settings
- **Real-time Updates** - Socket.IO for live game updates
- **Email Verification** - Account verification and password reset
- **Demo Mode** - Try the game without signing up

## 🛠️ Development

### Backend Commands
```bash
npm run dev      # Start development server with ts-node
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled version
```

### Frontend Commands
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📦 Deployment

**🚀 For complete deployment instructions to free hosting platforms (Railway, Render, Vercel), see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deployment Overview

**Backend (Render or Fly.io - Free Forever):**
- Deploy from GitHub
- Set environment variables (see `backend/production.env.example.txt`)
- Build command: `npm install && npm run build`
- Start command: `npm start`

**Frontend (Vercel):**
- Deploy from GitHub
- Set environment variables (see `frontend/production.env.example.txt`)
- Build command: `npm run build`
- Output directory: `dist`

**Database:**
- Use MongoDB Atlas (free tier available)
- Whitelist your hosting provider IPs

### CORS Configuration
CORS is now configurable via `ALLOWED_ORIGINS` environment variable (comma-separated) or `FRONTEND_URL`. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

> **💡 Free Hosting Note:** Railway's free tier expires. Use **Render** (spins down but wakes) or **Fly.io** (always on) for truly free hosting that lasts forever.

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (if local)
- For Atlas, verify IP whitelist

**Port Already in Use**
- Change `PORT` in backend `.env`
- Or change port in `vite.config.ts` for frontend

**CORS Errors**
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check `allowedOrigins` in `backend/src/index.ts`

**Email Not Working**
- For Gmail, create an "App Password" (not regular password)
- Google Account → Security → 2-Step Verification → App Passwords

## 📝 Notes

- Some features require proper email configuration (password reset, verification)
- Core game functionality works without email setup
- Admin features require proper password hash setup
- Google OAuth requires Google Cloud Console setup

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Comprehensive setup guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## 📄 License

See LICENSE file for details.

---

**Built for portfolio purposes** 🎨

