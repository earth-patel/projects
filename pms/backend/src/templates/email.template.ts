import { sendEmail } from '../services/email.service';

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  console.log('Verification URL:', verifyUrl); // Log the verification URL for testing purposes

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

export const sendInvitationEmail = async (
  to: string,
  token: string,
  organizationName: string,
  roleName: string
) => {
  const acceptUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  return sendEmail({
    to,
    subject: `You've been invited to join ${organizationName}`,
    html: `
      <h2>Organization Invitation</h2>
      <p>You have been invited to join <strong>${organizationName}</strong> as a <strong>${roleName}</strong>.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${acceptUrl}">${acceptUrl}</a>
      <p>This link will expire in 48 hours.</p>
      <p>If you don't have an account yet, you'll need to register first before accepting.</p>
    `
  });
};
