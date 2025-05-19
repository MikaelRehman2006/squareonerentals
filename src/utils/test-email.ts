import nodemailer from 'nodemailer';

// Create the transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Function to send a test email
async function sendTestEmail() {
  try {
    console.log('Email Configuration:', {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        // Not logging password for security
      }
    });

    console.log('Attempting to send test email...');
    console.log('Using email:', process.env.EMAIL_USER);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // sending to same email for testing
      subject: 'Test Email from Square One Rentals',
      html: `
        <h1>Test Email</h1>
        <p>If you receive this email, the SMTP configuration is working correctly.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Detailed error information:', {
      error,
      emailUser: process.env.EMAIL_USER,
      // Not logging password
    });
    throw error; // Re-throw to see the error in the API response
  }
}

// Export the function to use it in an API route
export { sendTestEmail };
