const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Dev-Team <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.MODE === 'production') {
      // Sendgrid
      return 1
    } else {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });
    }
  }

  send(template, subject) {
    const mailOption = {
      from: 'Dev-Team <dev@natours.io>',
      to: options.email,
      subject: subject,
      text: options.message
    }
      await transporter.sendMail(mailOption);
  }

  sendWelcome() {
    this.send('Welcome', 'Welcome to the Natours Family!')
  }
}
