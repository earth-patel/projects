import { createSlice } from '@reduxjs/toolkit';

import { createProject, deleteProject, listProjects } from './project.thunk';
import { type ProjectState } from './project.types';
import { handleApiError } from '../../utils/common';
import { toast } from '../../utils/toast';

/* ---------- INITIAL STATE ---------- */
const initialState: ProjectState = {
  projects: [],
  projectLoading: false,
  projectError: null,
  createProjectLoading: false,
  deleteProjectLoading: false
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjects(state) {
      state.projects = [];
    },
    setProjectError(state, action) {
      state.projectError = action.payload;
    },
    clearProjectError(state) {
      state.projectError = null;
    }
  },
  extraReducers: builder => {
    builder
      // listProjects
      .addCase(listProjects.pending, state => {
        state.projectLoading = true;
      })
      .addCase(listProjects.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.projects = action.payload;
      })
      .addCase(listProjects.rejected, state => {
        state.projectLoading = false;
        toast.error('Failed to load projects.');
      })

      // createProject
      .addCase(createProject.pending, state => {
        state.createProjectLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createProjectLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createProjectLoading = false;
        state.projectError = handleApiError(action.payload, {
          general: 'Something went wrong'
        });
      })

      // deleteProject
      .addCase(deleteProject.pending, state => {
        state.deleteProjectLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleteProjectLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleteProjectLoading = false;
        toast.error(action.payload?.message || 'Failed to delete project.');
      });
  }
});

export const { clearProjects, clearProjectError, setProjectError } =
  projectSlice.actions;

export default projectSlice.reducer;
