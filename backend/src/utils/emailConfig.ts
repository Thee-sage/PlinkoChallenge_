import sgMail from '@sendgrid/mail';

// SendGrid Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid client initialized');
} else {
    console.warn('⚠️  SendGrid not configured. SENDGRID_API_KEY environment variable is required.');
}

// Helper function to get the sender email
export const getSenderEmail = (): string => {
    return process.env.SENDGRID_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@example.com';
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
        if (!SENDGRID_API_KEY) {
            console.warn('SendGrid not configured, skipping email send');
            return;
        }

        try {
            const msg: any = {
                from: options.from || getSenderEmail(),
                to: Array.isArray(options.to) ? options.to : options.to,
                subject: options.subject,
            };

            if (options.html) {
                msg.html = options.html;
            }
            if (options.text) {
                msg.text = options.text;
            }
            if (!msg.html && !msg.text) {
                msg.text = '';
            }

            if (options.replyTo) {
                msg.replyTo = options.replyTo;
            }

            await sgMail.send(msg);
            console.log(`Email sent successfully to ${options.to}`);
        } catch (error) {
            console.error('Error sending email via SendGrid:', error);
            throw error;
        }
    },
    verify: (callback?: (error: any, success?: any) => void) => {
        if (!SENDGRID_API_KEY) {
            if (callback) {
                callback(new Error('SendGrid not configured'), null);
            }
            return;
        }
        // SendGrid doesn't have a verify method like nodemailer, so we'll just check if API key exists
        if (callback) {
            callback(null, true);
        }
    }
};

// Export SendGrid-specific functions for direct use if needed
export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
    if (!SENDGRID_API_KEY) {
        console.warn('SendGrid not configured, skipping sendPasswordResetEmail');
        return;
    }

    const msg = {
        from: getSenderEmail(),
        to: toEmail,
        subject: 'Password reset',
        html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    };

    await sgMail.send(msg);
}

export async function sendGenericEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!SENDGRID_API_KEY) {
        console.warn('SendGrid not configured, skipping sendGenericEmail');
        return;
    }

    await sgMail.send({
        from: getSenderEmail(),
        to,
        subject,
        html
    });
}
