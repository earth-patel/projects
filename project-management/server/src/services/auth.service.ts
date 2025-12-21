import prisma from "../prisma";

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export const createUser = async (data: CreateUserInput) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  })
};