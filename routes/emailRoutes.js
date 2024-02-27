import Email from '../utils/email';

const sendEmail = async (req, res) => {
  try {
    const fromEmail = `${process.env.EMAIL_FROM}}`;

    // reCaptcha - verify token https://developers.google.com/recaptcha/docs/verify

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

    const mailData = {
      targetEmail: fromEmail,
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      phoneNr: req.body.phoneNr,
      message: req.body.message,
      ip: req.connection.remoteAddress,
    };
    await new Email(fromEmail, mailData).sendContactUs();

    res.status(200).send({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = sendEmail;
