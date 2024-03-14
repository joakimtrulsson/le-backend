import type { Request, Response } from 'express';

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { captchaValue } = req.body;
    const SITE_SECRET = process.env.RECAPTCHA_SITE_SECRET as string;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SITE_SECRET}&response=${captchaValue}`,
      { method: 'POST' }
    );
    const data = await response.json();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
