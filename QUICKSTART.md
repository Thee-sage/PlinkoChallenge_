# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Set Up Environment Variables

**Backend:**
1. Copy `backend/env.example.txt` to `backend/.env`
2. Fill in at minimum:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID (optional for basic functionality)

**Frontend:**
1. Copy `frontend/env.example.txt` to `frontend/.env`
2. Update `VITE_API_URL` to match your backend URL (default: `http://localhost:3001`)

### Step 2: Start MongoDB

**Local MongoDB:**
- Make sure MongoDB is running on your system

**MongoDB Atlas (Recommended for Portfolio):**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Use that in `MONGODB_URI`

### Step 3: Install Dependencies (if not already done)

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:5173**

## ⚠️ Minimal Setup (For Testing)

If you just want to test the app quickly, you can use these minimal `.env` files:

**backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/plinkochallenge
PORT=3001
JWT_SECRET=dev-secret-key-12345
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
CPANELEMAIL_HOST=smtp.gmail.com
CPANELEMAIL_PORTOUT=465
CPANELEMAIL_USER=your-email@gmail.com
CPANELEMAIL_PASS=your-password
ADMIN_APPROVAL_PASSWORD_HASH=your-hash
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note:** Some features (email verification, password reset) may not work without proper email setup, but the core game will function.

## 🐛 Common Issues

**"MongoDB connection error"**
- Check your `MONGODB_URI` is correct
- Make sure MongoDB is running (if local)
- For Atlas, check IP whitelist

**"Port already in use"**
- Change `PORT` in backend `.env`
- Or kill the process using the port

**CORS errors**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for exact error

## 📚 For More Details

See `SETUP.md` for comprehensive setup instructions.

