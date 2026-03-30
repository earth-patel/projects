import { type ProjectApiErrorResponse } from '../../types/api.types';

export interface ProjectItem {
  id: number;
  name: string;
  description?: string;
  createdBy: { id: number; firstName: string; lastName: string };
  createdAt: string;
  _count: { tasks: number };
}

export interface ProjectState {
  projects: ProjectItem[];
  projectsLoading: boolean;
  projectsError: ProjectApiErrorResponse | null;
  createProjectLoading: boolean;
  deleteProjectLoading: boolean;
}
