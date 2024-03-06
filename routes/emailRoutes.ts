import type { Request, Response } from 'express';

import { Email } from '../utils/email';

interface MailData {
  targetEmail: string;
  name: string;
  phoneNr: string;
  contactEmail: string;
  message: string;
  ip: string;
}

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const fromEmail = `${process.env.EMAIL_FROM}}`;

    if (
      !req.body.name ||
      !req.body.contactEmail ||
      !req.body.phoneNr ||
      !req.body.message
    ) {
      return res.status(400).send({
        succuess: false,
        message: 'Missing or invalid required fields',
      });
    }

    const mailData: MailData = {
      targetEmail: fromEmail,
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      phoneNr: req.body.phoneNr,
      message: req.body.message,
      ip: req.connection.remoteAddress || '', // Ensure that ip is always a string
    };
    await new Email(fromEmail, mailData).sendContactUs();

    res.status(200).send({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
