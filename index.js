const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Spectrum Email Server is Live!');
});

// Email POST route
app.post('/send-email', async (req, res) => {
  const { agent, customer, orderId, message } = req.body;

  if (!agent || !customer || !orderId || !message) {
    return res.status(400).json({ message: "❌ Missing required fields" });
  }

  const emailSubject = `Spectrum Agent Submission - ${agent}`;
  const emailBody = `
🧾 Agent: ${agent}
👤 Customer: ${customer}
📦 Order ID: ${orderId}
📝 Message: ${message}
`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: emailSubject,
    text: emailBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
