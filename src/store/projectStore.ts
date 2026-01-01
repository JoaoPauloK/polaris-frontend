import { create } from 'zustand';
import type { Project } from '@/types/project';
import projectService from '@/services/project.service';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: (status?: string) => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  updateProject: (id: number, data: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getProjects(status);
      set({ projects });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.getProjectById(id);
      set({ currentProject: project });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch project' });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.createProject(data);
      set((state) => ({
        projects: [project, ...state.projects],
      }));
      return project;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create project';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (id: number, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? project : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? project
            : state.currentProject,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update project' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete project' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },
}));

export default useProjectStore;
