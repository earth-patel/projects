import type { Response } from "express";

import { type AuthRequest } from "../middleware/auth.middleware";
import * as taskService from "../services/task.service.js";

// create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, projectId, assigneeId, status, priority, dueDate } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ message: "Title and projectId are required." });
  }

  const task = await taskService.createTask({
    title,
    description,
    projectId,
    assigneeId,
    status,
    priority,
    dueDate,
  });

  res.status(201).json(task);
};

// get all tasks for a user
export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await taskService.getTasks(req.user!.userId);
  res.json(tasks);
};

// get single task by id
export const getTaskById = async (req: AuthRequest, res: Response) => {
  const task = await taskService.getTaskById(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }
  res.json(task);
};

// update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  const task = await taskService.updateTask(Number(req.params.id), req.body);
  res.json(task);
};

// delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  await taskService.deleteTask(Number(req.params.id));
  res.status(204).send();
};