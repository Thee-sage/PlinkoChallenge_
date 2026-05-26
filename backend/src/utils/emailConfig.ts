import nodemailer from 'nodemailer';

// Gmail Configuration using App Password
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

// Create nodemailer transporter using Gmail
export const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

// Verify connection on startup
if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    emailTransporter.verify((error) => {
        if (error) {
            console.error('❌ Gmail transporter verification failed:', error.message);
        } else {
            console.log('✅ Gmail transporter ready');
        }
    });
} else {
    console.warn('⚠️  Gmail not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
}

// Helper function to get the sender email
export const getSenderEmail = (): string => {
    return GMAIL_USER || 'noreply@example.com';
};

// Export sendPasswordResetEmail for backward compatibility
export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.warn('Gmail not configured, skipping sendPasswordResetEmail');
        return;
    }

    await emailTransporter.sendMail({
        from: GMAIL_USER,
        to: toEmail,
        subject: 'Password reset',
        html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    });
}

export async function sendGenericEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.warn('Gmail not configured, skipping sendGenericEmail');
        return;
    }

    await emailTransporter.sendMail({
        from: GMAIL_USER,
        to,
        subject,
        html
    });
}
