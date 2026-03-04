const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Gmail Transporter (App Password without spaces)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devanshipatel2824@gmail.com',
    pass: 'qnoq nnfo dcsy movf' // remove spaces
  }
});

// ✅ Check Gmail Connection on Server Start
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Gmail Connection Error:", error);
  } else {
    console.log("✅ Gmail Server Ready");
  }
});

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Email Server is Running!');
});


// ==========================================
// ✅ ADMIN APPROVES TEACHER → PASSWORD EMAIL
// ==========================================
app.post('/send-teacher-approval', (req, res) => {

  const { to, name, password } = req.body;

  const mailOptions = {
    from: '"Online Tution Classes" <devanshipatel2824@gmail.com>',
    to: to,
    subject: 'Your Account Has Been Approved',
    html: `
      <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #28a745;">Congratulations ${name} 🎉</h2>
        <p>Your teacher registration has been approved by Admin.</p>
        <hr>
        <h3>Your Login Credentials:</h3>
        <p><b>Email:</b> ${to}</p>
        <p><b>Password:</b> ${password}</p>
        <br>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Email Error:", error);
      return res.status(500).send(error.toString());
    }
    console.log("✅ Approval Email Sent:", info.response);
    res.status(200).send({ success: true, message: 'Approval email sent!' });
  });
});


// ==========================================
// ❌ ADMIN REJECTS TEACHER
// ==========================================
app.post('/send-teacher-rejection', (req, res) => {

  const { to, name } = req.body;

  const mailOptions = {
    from: '"Online Tution Classes" <devanshipatel2824@gmail.com>',
    to: to,
    subject: 'Application Status Update',
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #dc3545;">Hello ${name},</h2>
        <p>We regret to inform you that your teacher registration was not approved.</p>
        <p>Thank you for your interest.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Rejection Email Error:", error);
      return res.status(500).send(error.toString());
    }
    console.log("✅ Rejection Email Sent:", info.response);
    res.status(200).send({ success: true, message: 'Rejection email sent!' });
  });
});


// START SERVER
app.listen(3000, () => {
  console.log('🚀 Email server running on port 3000');
});