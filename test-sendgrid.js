require('dotenv').config({ path: './test.env' });
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from .env
if (!process.env.SENDGRID_API_KEY) {
  console.error('ERROR: SENDGRID_API_KEY is not defined in test.env file');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create test email
const msg = {
  to: 'squareone.rental@gmail.com', // Send to yourself for testing
  from: 'squareone.rental@gmail.com', // Must be your verified sender
  subject: 'SendGrid Test Email',
  text: 'This is a test email from SendGrid to verify integration',
  html: '<strong>This is a test email from SendGrid to verify integration</strong>',
};

// Send the email
console.log('Sending test email...');
sgMail
  .send(msg)
  .then(() => {
    console.log('SUCCESS: Email sent successfully!');
  })
  .catch((error) => {
    console.error('ERROR: Failed to send email');
    console.error(error.response ? error.response.body : error);
  }); 