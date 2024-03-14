import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

interface MailData {
  targetEmail: string;
  name: string;
  phoneNr: string;
  contactEmail: string;
  message: string;
  ip: string;
  orderDetails?: any;
  amount?: number;
  orderId?: string;
  createdAt?: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class Email {
  to: string;
  name: string;
  phoneNr: string;
  contactEmail: string;
  message: string;
  from: string;
  ip: string;
  products: any;
  amount: number;
  id: string;
  createdAt: string;

  constructor(fromEmail: string, mailData: MailData) {
    this.to = mailData.targetEmail;
    this.name = mailData.name;
    this.phoneNr = mailData.phoneNr;
    this.contactEmail = mailData.contactEmail;
    this.message = mailData.message;
    this.from = fromEmail;
    this.ip = mailData.ip;
    this.products = mailData.orderDetails;
    this.amount = mailData.amount || 0;
    this.id = mailData.orderId ?? '';
    this.createdAt = mailData.createdAt ?? '';
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);
  }

  async send(template: String, subject: String) {
    // Rendera html baserad på pug template. __dirname = nuvarande script som körs, utils.
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      contactEmail: this.contactEmail,
      message: this.message,
      phoneNr: this.phoneNr,
      ip: this.ip,
      products: this.products,
      amount: this.amount,
      id: this.id,
      createdAt: this.createdAt,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions as MailOptions);
  }

  async sendContactUs() {
    // this eftersom dom defineras på det akutella objektet.
    await this.send('contact', 'Meddelande från hemsidan!');
  }
  async sendOrderConfirmation() {
    await this.send('order', 'Orderbekräftelse');
  }
}
