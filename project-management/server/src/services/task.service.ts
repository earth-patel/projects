import prisma from "../prisma";
import { TaskStatus, TaskPriority } from "../../generated/prisma/client";

interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: number;
  assigneeId?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

// create a task
export const createTask = async (data: CreateTaskInput) => {
  return prisma.task.create({
    data,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      projectId: true,
      assigneeId: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    }
  });
};

// get all tasks for a user
export const getTasks = async (userId: number) => {
  return prisma.task.findMany({
    where: {
      OR: [
        { assigneeId: userId },
        { project: { ownerId: userId} }
      ]
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      projectId: true,
      assigneeId: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    }
  });
};

// get task by id
export const getTaskById = async (id: number) => {
  return prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      projectId: true,
      assigneeId: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    }
  });
};

// update a task
export const updateTask = async (id: number, data: Partial<CreateTaskInput>) => {
  return prisma.task.update({
    where: { id },
    data,
  });
};

// delete a task
export const deleteTask = async (id: number) => {
  return prisma.task.delete({
    where: { id },
  });
};