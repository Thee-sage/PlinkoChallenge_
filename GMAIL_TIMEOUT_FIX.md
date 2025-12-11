# 🔧 Gmail SMTP Timeout Fix

## 🐛 The Problem

Gmail SMTP is timing out when trying to send emails. This happens because:
- Gmail has strict connection timeouts
- Network latency on Render
- Gmail might be blocking connections from certain IPs
- App password might be incorrect

## ✅ Solutions

### Solution 1: Verify Gmail App Password (Most Common)

1. **Check your Gmail App Password:**
   - Go to Google Account → Security → App Passwords
   - Make sure you're using the **16-character app password** (no spaces)
   - It should look like: `abcdefghijklmnop` (no dashes or spaces)

2. **In your `.env` file:**
   ```env
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   - Remove any spaces
   - Make sure it's exactly 16 characters

3. **Verify 2-Step Verification is enabled:**
   - App passwords only work if 2-Step Verification is ON

### Solution 2: Use Alternative Port (587)

If port 465 times out, try port 587:

Update `backend/src/utils/emailConfig.ts`:

```typescript
port: 587,
secure: false, // false for 587
```

### Solution 3: Use Alternative Email Service (Recommended for Production)

Gmail SMTP can be unreliable. Consider using:

#### Option A: SendGrid (Free Tier: 100 emails/day)
1. Sign up: https://sendgrid.com
2. Get API key
3. Update email config:

```typescript
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

#### Option B: Resend (Free Tier: 3,000 emails/month)
1. Sign up: https://resend.com
2. Get API key
3. Use Resend SDK instead of SMTP

#### Option C: Mailgun (Free Tier: 5,000 emails/month)
1. Sign up: https://www.mailgun.com
2. Get SMTP credentials
3. Update config with Mailgun SMTP settings

### Solution 4: Add Retry Logic

I've already updated the email config with:
- Connection timeout: 10 seconds
- Retry configuration
- Better error handling

## 🧪 Testing

1. **Test locally first:**
   ```bash
   cd backend
   npm run dev
   ```
   Try password reset - should work locally

2. **Check Render logs:**
   - Look for "Gmail SMTP connection successful" message
   - If you see timeout errors, try solutions above

3. **Verify environment variables in Render:**
   - `GMAIL_USER` = your full Gmail address
   - `GMAIL_APP_PASSWORD` = 16-char app password (no spaces)

## 🐛 Common Issues

### "Connection timeout"
- ✅ Check app password is correct (16 chars, no spaces)
- ✅ Verify 2-Step Verification is enabled
- ✅ Try port 587 instead of 465
- ✅ Consider using SendGrid/Resend instead

### "Invalid login"
- ✅ Make sure you're using App Password, not regular password
- ✅ Check for extra spaces in environment variables
- ✅ Verify Gmail address is correct

### "Less secure app access"
- ✅ This is normal - just use App Password
- ✅ Don't enable "Less secure app access" (deprecated)

## 📝 Quick Fix Checklist

- [ ] App password is 16 characters (no spaces)
- [ ] 2-Step Verification is enabled
- [ ] Environment variables set correctly in Render
- [ ] Tried port 587 if 465 doesn't work
- [ ] Considered alternative email service (SendGrid/Resend)

## 💡 Recommendation

For production/portfolio, I recommend **SendGrid** or **Resend**:
- More reliable than Gmail SMTP
- Better for production apps
- Free tiers are generous
- Better deliverability

---

**The timeout issue should be fixed with the updated configuration. If it persists, switch to SendGrid or Resend! 📧**

