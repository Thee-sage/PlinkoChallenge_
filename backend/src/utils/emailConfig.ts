import Mailgun from 'mailgun.js';
import formData from 'form-data';

// Mailgun Configuration
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';

// Initialize Mailgun client
let mailgunClient: any = null;
if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
    const mg = new Mailgun(formData);
    mailgunClient = mg.client({
        username: 'api',
        key: MAILGUN_API_KEY
    });
    console.log('✅ Mailgun client initialized');
} else {
    console.warn('⚠️  Mailgun not configured. MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables are required.');
}

// Helper function to get the sender email
export const getSenderEmail = (): string => {
    return process.env.MAILGUN_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@example.com';
};

// Create a nodemailer-like transporter interface for backward compatibility
export const emailTransporter = {
    sendMail: async (options: {
        from?: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        replyTo?: string;
    }) => {
        if (!mailgunClient || !MAILGUN_DOMAIN) {
            console.warn('Mailgun not configured, skipping email send');
            return;
        }

        try {
            const messageData: any = {
                from: options.from || getSenderEmail(),
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html || options.text || '',
            };

            if (options.replyTo) {
                messageData['h:Reply-To'] = options.replyTo;
            }

            await mailgunClient.messages.create(MAILGUN_DOMAIN, messageData);
            console.log(`Email sent successfully to ${options.to}`);
        } catch (error) {
            console.error('Error sending email via Mailgun:', error);
            throw error;
        }
    },
    verify: (callback?: (error: any, success?: any) => void) => {
        if (!mailgunClient || !MAILGUN_DOMAIN) {
            if (callback) {
                callback(new Error('Mailgun not configured'), null);
            }
            return;
        }
        // Mailgun doesn't have a verify method like nodemailer, so we'll just check if client exists
        if (callback) {
            callback(null, true);
        }
    }
};

// Export Mailgun-specific functions for direct use if needed
export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
    if (!mailgunClient || !MAILGUN_DOMAIN) {
        console.warn('Mailgun not configured, skipping sendPasswordResetEmail');
        return;
    }

    const message = {
        from: getSenderEmail(),
        to: toEmail,
        subject: 'Password reset',
        html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    };

    await mailgunClient.messages.create(MAILGUN_DOMAIN, message);
}

export async function sendGenericEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!mailgunClient || !MAILGUN_DOMAIN) {
        console.warn('Mailgun not configured, skipping sendGenericEmail');
        return;
    }

    await mailgunClient.messages.create(MAILGUN_DOMAIN, {
        from: getSenderEmail(),
        to,
        subject,
        html
    });
}
