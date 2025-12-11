# 🖼️ Image Upload Fix - Cloudinary Setup

## 🐛 The Problem

Your images aren't showing because **Render has an ephemeral filesystem**:
- Images are uploaded to `/uploads/` directory on the server
- When Render restarts/redeploys, **all files are deleted**
- Your images disappear and URLs like `/uploads/filename.jpg` return 404

## ✅ The Solution

I've updated your code to use **Cloudinary** (free cloud storage):
- ✅ Images are stored in the cloud (never deleted)
- ✅ Images persist through server restarts
- ✅ Free tier: 25GB storage, 25GB bandwidth/month
- ✅ Automatic image optimization

## 📝 Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (no credit card needed)
3. Verify your email

### Step 2: Get Credentials
1. After signup, you'll see your **Dashboard**
2. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., ``)

### Step 3: Install Package
```bash
cd backend
npm install cloudinary
```

### Step 4: Add to Render Environment Variables
1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these 3 variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 5: Redeploy
- Render will auto-redeploy when you add environment variables
- Or manually trigger a deploy

## ✅ What's Been Updated

1. ✅ Created `backend/src/utils/cloudinaryConfig.ts` - Cloudinary helper functions
2. ✅ Updated `backend/src/ads/adsads.ts` - Ad image uploads now use Cloudinary
3. ✅ Updated `backend/src/ads/Casino.ts` - Casino logo uploads now use Cloudinary
4. ✅ Updated `backend/package.json` - Added cloudinary dependency
5. ✅ Changed multer to use memory storage (uploads directly to cloud)

## 🧪 Testing

1. **Upload a new image** through your admin panel
2. Check the console logs - you should see:
   ```
   Image uploaded to Cloudinary: https://res.cloudinary.com/...
   ```
3. The image URL in your database should now be a Cloudinary URL (starts with `https://res.cloudinary.com/`)
4. Images should now persist even after server restart!

## 🔄 Existing Images

**Important:** Images that were already uploaded to `/uploads/` won't work because:
- They're stored on Render's ephemeral filesystem
- They've been deleted when the server restarted

**Solution:**
- Re-upload images through your admin panel
- They'll now be stored in Cloudinary and persist forever

## 💰 Free Tier Limits

- **Storage:** 25GB (plenty for portfolio)
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Perfect for:** Portfolio projects

## 🐛 Troubleshooting

### "Invalid API credentials"
- Double-check your Cloudinary credentials in Render
- Make sure no extra spaces in environment variables
- Verify you copied all 3 values correctly

### "Upload failed"
- Check file size (Cloudinary free tier: 10MB max per file)
- Verify image format (jpg, png, gif, webp supported)

### Images still not showing
- Clear browser cache
- Check image URLs in database (should be Cloudinary URLs)
- Verify environment variables are set in Render
- Check Render logs for errors

### "Module not found: cloudinary"
- Make sure you ran `npm install cloudinary` in the backend folder
- Check that package.json includes cloudinary
- Redeploy on Render

## 📚 More Info

See `CLOUDINARY_SETUP.md` for detailed instructions.

---

**After setup, your images will persist forever! 🎉**

