import prisma from "../prisma";

interface CreateProjectInput {
  name: string;
  description?: string;
  ownerId: number;
}

// create a project
export const createProject = async (data: CreateProjectInput) => {
  return prisma.project.create({
    data,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

// get all projects for a user
export const getProjects = async (userId: number) => {
  return prisma.project.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

// get project by ID
export const getProjectById = async (id: number) => {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};