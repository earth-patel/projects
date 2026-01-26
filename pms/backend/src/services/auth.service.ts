import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { RegisterDto } from '../dtos/auth.dto';
import prisma from '../prisma';
import {
  sendResetPasswordEmail,
  sendVerificationEmail
} from '../templates/email.template';
import { generateToken } from '../utils/token.util';

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_MIN = 15;

export const createUser = async (data: RegisterDto) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const verificationCode = generateToken();

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      verificationCode
    }
  });

  sendVerificationEmail(user.email, verificationCode);

  return user;
};

export const validateLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  });
};

export const verifyEmailByToken = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verificationCode: token }
  });

  if (!user) return null;

  return prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      verificationCode: null
    }
  });
};

export const resendVerificationEmailByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) return null;
  if (user.emailVerifiedAt) return 'EMAIL_ALREADY_VERIFIED';

  const verificationCode = generateToken();

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationCode }
  });

  sendVerificationEmail(user.email, verificationCode);

  return true;
};

export const forgotPasswordByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const rawToken = generateToken();
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: new Date(
        Date.now() + RESET_TOKEN_EXPIRY_MIN * 60 * 1000
      )
    }
  });

  sendResetPasswordEmail(email, rawToken);

  return true;
};

export const resetPasswordByToken = async (
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: {
        gt: new Date()
      }
    }
  });

  if (!user) return null;

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null
    }
  });

  return true;
};
