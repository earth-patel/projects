import type { Response } from 'express';

import { type AuthRequest } from '../middleware/auth.middleware';
import * as projectService from '../services/project.service';

// create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  // userId comes from authMiddleware
  const project = await projectService.createProject({
    name,
    description,
    ownerId: req.user!.userId,
  });

  res.status(201).json(project);
};

// get all projects for the authenticated user
export const getProjects = async (req: AuthRequest, res: Response) => {
  const projects = await projectService.getProjects(req.user!.userId);
  res.json(projects);
};

// get a single project by ID
export const getProjectById = async (req: AuthRequest, res: Response) => {
  const project = await projectService.getProjectById(Number(req.params.id));
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
};