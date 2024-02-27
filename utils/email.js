import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

// Skicka ett nytt email => new Email(user, url).sendContactUs();
module.exports = class Email {
  constructor(fromEmail, mailData) {
    (this.to = mailData.targetEmail),
      (this.name = mailData.name),
      (this.phoneNr = mailData.phoneNr),
      (this.contactEmail = mailData.contactEmail),
      (this.message = mailData.message),
      (this.from = fromEmail);
    this.ip = mailData.ip;
    // this.from = `${process.env.EMAIL_FROM}}`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      // logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Skickar mailet.
  async send(template, subject) {
    // Rendera html baserad på pug template. __dirname = nuvarande script som körs, utils.
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      contactEmail: this.contactEmail,
      message: this.message,
      phoneNr: this.phoneNr,
      ip: this.ip,
      subject,
    });

    // Definera emailOptions.
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendContactUs() {
    // this  eftersom dom defineras på det akutella objektet.
    await this.send('contact', 'Meddelande från hemsidan!');
  }
};
