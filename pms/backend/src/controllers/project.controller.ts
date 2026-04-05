import { type Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import {
  createProject,
  deleteProject,
  listProjects
} from '../services/project.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

/* ---------- CONTROLLERS ---------- */
export const listOrgProjects = async (req: AuthRequest, res: Response) => {
  const organizationId = Number(req.params.organizationId);

  try {
    const projects = await listProjects(organizationId);
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    return sendErrorResponse(res);
  }
};

export const createOrgProject = async (req: AuthRequest, res: Response) => {
  const organizationId = Number(req.params.organizationId);
  const userId = req.user.userId;
  const { name, description } = req.body as {
    name: string;
    description?: string;
  };

  if (!name) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Project name is required', {
        name: 'Project name is required'
      })
    );
  }

  try {
    const result = await createProject({
      name,
      description,
      organizationId,
      createdById: userId
    });

    if (result === 'PROJECT_NAME_TAKEN') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Project name already exists', {
          name: 'A project with this name already exists in the organization'
        })
      );
    }
    return res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    return sendErrorResponse(res);
  }
};

export const deleteOrgProject = async (req: AuthRequest, res: Response) => {
  const organizationId = Number(req.params.organizationId);
  const projectId = Number(req.params.projectId);

  try {
    const result = await deleteProject({ projectId, organizationId });

    if (result === 'PROJECT_NOT_FOUND') {
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Project not found')
      );
    }

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return sendErrorResponse(res);
  }
};
