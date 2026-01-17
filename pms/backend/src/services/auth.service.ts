import bcrypt from 'bcrypt';

import prisma from '../prisma';

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SALT_ROUNDS = 10;

export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true
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
