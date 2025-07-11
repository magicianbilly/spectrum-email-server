const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Homepage route
app.get('/', (req, res) => {
  res.send('✅ Spectrum Email Server is Live!');
});

// Middleware
app.use(cors());
app.use(express.json());

// Email sending route
app.post('/send-email', async (req, res) => {
  const { subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '✅ Email sent successfully', info });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ message: '❌ Failed to send email', error });
  }
});

// Listen on port from environment or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
