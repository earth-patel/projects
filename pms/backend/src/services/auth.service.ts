import bcrypt from 'bcrypt';

import { RegisterDto } from '../dtos/auth.dto';
import prisma from '../prisma';
import { sendVerificationEmail } from '../templates/email.template';
import { generateVerificationToken } from '../utils/token.util';

const SALT_ROUNDS = 10;

export const createUser = async (data: RegisterDto) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const verificationCode = generateVerificationToken();

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

export const loginUser = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      emailVerifiedAt: true,
      password: true // intentionally included for comparison
    }
  });
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
