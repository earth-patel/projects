import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api/axios';
import { type ProjectItem } from './project.types';
import { type ProjectApiErrorResponse } from '../../types/api.types';

/* ---------- LIST PROJECTS ---------- */
export const listProjects = createAsyncThunk<
  ProjectItem[], // returned on success
  number, // argument type (orgId)
  { rejectValue: ProjectApiErrorResponse }
>('project/listProjects', (orgId, { rejectWithValue }) => {
  return api
    .get(`/organization/${orgId}/projects`)
    .then((response) => response.data)
    .catch(err => rejectWithValue(err.response.data));
})

/* ---------- CREATE PROJECT ---------- */
export const createProject = createAsyncThunk<
  { message: string }, // returned on success
  { orgId: number; name: string; description?: string }, // argument type
  { rejectValue: ProjectApiErrorResponse }
>('project/createProject', ({ orgId, name, description }, { rejectWithValue }) => {
  return api
    .post(`/organization/${orgId}/projects`, { name, description })
    .then((response) => response.data)
    .catch(err => rejectWithValue(err.response.data));
})

/* ---------- DELETE PROJECT ---------- */
export const deleteProject = createAsyncThunk<
  { message: string }, // returned on success
  { orgId: number; projectId: number }, // argument type
  { rejectValue: ProjectApiErrorResponse }
>('project/deleteProject', ({ orgId, projectId }, { rejectWithValue }) => {
  return api
    .delete(`/organization/${orgId}/projects/${projectId}`)
    .then((response) => response.data)
    .catch(err => rejectWithValue(err.response.data));
})
