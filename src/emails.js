const nodemailer = require('nodemailer');
require('dotenv').config();


const sendPasswordResetEmail = async (recipientEmail, resetLink) => {
  try {
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    const mailOptions = {
      from: `"Charger Locator" <${process.env.SMTP_USER}>`,
      to: recipientEmail, 
      subject: 'Password Reset Request', 
      html: `
        <p>You requested a password reset for your Charger Locator account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully: ${info.response}`);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
  }
};





module.exports = {
    sendPasswordResetEmail
}