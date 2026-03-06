const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devanshipatel2824@gmail.com',
    pass: 'qnoqnnfodcsymovf'
  }
});

// Check connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Gmail Error:", error);
  } else {
    console.log("✅ Gmail Server Ready");
  }
});

// ===============================
// APPROVAL EMAIL
// ===============================

app.post('/send-teacher-approval', async (req, res) => {

  const { to, name, password } = req.body;

  const mailOptions = {
    from: '"Online Tuition Classes" <devanshipatel2824@gmail.com>',
    to: to,
    subject: 'Your Account Has Been Approved',
    html: `
      <div style="font-family: Arial; padding:20px">
        <h2 style="color:green">Hello ${name}</h2>
        <p>Your registration has been approved.</p>

        <h3>Login Details</h3>

        <p><b>Email:</b> ${to}</p>
        <p><b>Password:</b> ${password}</p>

        <br>
        <p>You can login to the Online Tuition portal.</p>
      </div>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    console.log("Email Sent");
    res.send({ success: true });

  } catch (error) {

    console.log("Email Error:", error);
    res.status(500).send(error);

  }

});


// ===============================
// REJECTION EMAIL
// ===============================

app.post('/send-teacher-rejection', async (req, res) => {

  const { to, name } = req.body;

  const mailOptions = {
    from: '"Online Tuition Classes" <devanshipatel2824@gmail.com>',
    to: to,
    subject: 'Application Status',
    html: `
      <div style="font-family: Arial">
        <h2>Hello ${name}</h2>
        <p>Your application has been rejected.</p>
        <p>Thank you for applying.</p>
      </div>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    console.log("Rejection Email Sent");
    res.send({ success: true });

  } catch (error) {

    console.log(error);
    res.status(500).send(error);

  }

});

app.listen(3000, () => {
  console.log("🚀 Email Server Running On Port 3000");
});