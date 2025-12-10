# 📧 Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending emails from your application.

## ⚠️ Important Notes

- You **cannot** use your regular Gmail password
- You **must** create a Gmail App Password
- 2-Step Verification **must** be enabled on your Google Account

## 📝 Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. Click **Get Started** and follow the prompts
5. Complete the setup (you'll need your phone)

### Step 2: Create App Password

1. Still in **Security** settings
2. Scroll down to **2-Step Verification** section
3. Click **App passwords** (you may need to sign in again)
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Enter a name like "Plinko Challenge App"
7. Click **Generate**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - Remove spaces when using it: `abcdefghijklmnop`

### Step 3: Add to Environment Variables

Add these to your `backend/.env` file:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:**
- Use your full Gmail address for `GMAIL_USER`
- Use the 16-character app password (no spaces) for `GMAIL_APP_PASSWORD`
- Do NOT use your regular Gmail password

### Step 4: Test Email Configuration

1. Start your backend server
2. Check the console logs - you should see:
   ```
   ✅ Gmail SMTP server connection successful
   ```
3. If you see an error, double-check:
   - 2-Step Verification is enabled
   - App Password was created correctly
   - Environment variables are set correctly
   - No extra spaces in the app password

## 🚀 For Production Deployment

When deploying to Render, Fly.io, or Railway:

1. Go to your hosting platform's environment variables section
2. Add:
   - `GMAIL_USER` = your Gmail address
   - `GMAIL_APP_PASSWORD` = your 16-character app password

## 🐛 Troubleshooting

### "Invalid login" or "Authentication failed"
- ✅ Make sure 2-Step Verification is enabled
- ✅ Make sure you're using an App Password, not your regular password
- ✅ Check for extra spaces in the app password
- ✅ Verify the Gmail address is correct

### "Less secure app access" error
- This is normal - Gmail requires App Passwords for third-party apps
- Just make sure you're using an App Password, not your regular password

### Emails not sending
- Check backend console for error messages
- Verify environment variables are set correctly
- Make sure the app password hasn't been revoked
- Check Gmail's "Security" page to see if there are any blocked sign-in attempts

### "Connection timeout"
- Check your firewall/network settings
- Verify port 465 is not blocked
- Try checking Gmail's security settings for any restrictions

## 📚 Alternative Email Services

If you prefer not to use Gmail, you can use:

- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Resend** (free tier: 3,000 emails/month)
- **AWS SES** (free tier: 62,000 emails/month)

To use these, you'll need to modify `backend/src/utils/emailConfig.ts` with the appropriate SMTP settings.

## ✅ Verification

Once set up, test by:
1. Signing up a new user (should receive verification email)
2. Requesting a password reset (should receive OTP email)
3. Submitting the contact form (should send email to your Gmail)

---

**That's it! Your Gmail SMTP is now configured! 📧**

