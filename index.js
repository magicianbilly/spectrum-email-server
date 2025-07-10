const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
