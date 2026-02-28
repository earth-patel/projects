import { sendEmail } from '../services/email.service';

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log('Verification URL:', verifyUrl); // Log the verification URL for debugging
  return sendEmail({
    to,
    subject: 'Verify your email',
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `
  });
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return sendEmail({
    to,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href='${resetUrl}'>${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  });
};
