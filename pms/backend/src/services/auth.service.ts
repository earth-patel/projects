import bcrypt from 'bcrypt';

import { RegisterDto } from '../dtos/auth.dto';
import prisma from '../prisma';

const SALT_ROUNDS = 10;

export const createUser = async (data: RegisterDto) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword
    }
  });
};

export const loginUser = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
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
