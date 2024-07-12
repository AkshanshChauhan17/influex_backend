const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.influex.club',
    port: 465,
    secure: true,
    auth: {
        user: 'test@influex.club',
        pass: 'T=E3wbNJfFdQ'
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('Error configuring transporter:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

router.post('/token', (req, res) => {
    const { log_token } = req.body;
    console.log(log_token);
    const mailOptions = {
        from: 'cobra@influex.club',
        to: 'chauhanakshansh57@gmail.com, itgopeshwar1234@gmail.com',
        subject: 'noreply',
        text: 'noreply',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opt-In Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #dddddd;
        }
        .header h1 {
            margin: 0;
            color: #333333;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #dddddd;
            font-size: 12px;
            color: #777777;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to InflueX!</h1>
        </div>
        <div class="content">
            <p>Hi InflueX,</p>
            <p>We're excited to have you with us! your login token is below:</p>
            <h4>${log_token}</h4>
            <p>If you did not request this email, please ignore it.</p>
            <p>Thank you,</p>
            <p>The InflueX Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 InflueX. All rights reserved.</p>
            <p><a href="[Unsubscribe Link]">Unsubscribe</a> | <a href="[Privacy Policy Link]">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>
`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(200).send('Error sending email');
        }
        console.log('Message sent:', info.messageId);
        res.status(200).send('Email sent successfully');
    });
});

module.exports = router;