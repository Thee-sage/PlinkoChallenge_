import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
// Uses environment variables for Gmail credentials
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587, // Try 587 if 465 times out
        secure: false, // false for 587, true for 465
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000, // 10 seconds
        socketTimeout: 10000, // 10 seconds
        // Retry configuration
        pool: true,
        maxConnections: 1,
        maxMessages: 3
    });
};

// Create and export the transporter
export const emailTransporter = createTransporter();

// Verify email configuration on startup
emailTransporter.verify(function (error, success) {
    if (error) {
        console.log('Gmail SMTP connection error:', error);
        console.log('⚠️  Email functionality may not work. Please check GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
    } else {
        console.log('✅ Gmail SMTP server connection successful');
    }
});

// Helper function to get the sender email
export const getSenderEmail = (): string => {
    return process.env.GMAIL_USER || 'noreply@example.com';
};

