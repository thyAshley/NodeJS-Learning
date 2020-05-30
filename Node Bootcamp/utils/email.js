const nodemailer = require('nodemailer');

const sendEmail = (options) => {
    // 1) Transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    // 2 Define the email options

    // 3) Send email with nodemailer
}