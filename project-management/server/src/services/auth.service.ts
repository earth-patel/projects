import bycrypt from "bcrypt";

import prisma from "../prisma";

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

// bcrypt will run the hashing algorithm 2¹⁰ ≈ 1024 times internally
const SALT_ROUNDS = 10;

export const createUser = async (data: CreateUserInput) => {
  // Hash the password before storing it
  const hasedPassword = await bycrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hasedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  })
};

export const loginUser = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
    }
  });
}