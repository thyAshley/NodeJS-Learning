const nodemailer = require('nodemailer');
const pug = require('pug')
const htmlToText = require('html-to-text');

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
        return nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });
    }
  }

  async send(template, subject) {

    // 1) Render HTML
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject
    });

    const mailOption = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html)
    };

    await this.createTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!')
  }
}
