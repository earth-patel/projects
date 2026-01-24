import nodemailer from 'nodemailer';

export type SendEmailParams = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async ({
  from = 'PMS App <no-reply@gmail.com>',
  to,
  subject,
  html
}: SendEmailParams) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    html
  });
};
