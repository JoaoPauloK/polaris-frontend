import api from './api';
import type { Project, CreateProjectData, UpdateProjectData } from '../types/project';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class ProjectService {
  /**
   * Criar novo projeto
   */
  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await api.post<ApiResponse<{ project: Project }>>('/projects', data);
    return response.data.data.project;
  }

  /**
   * Buscar todos os projetos do usuário
   */
  async getProjects(status?: string): Promise<Project[]> {
    const params = status ? { status } : {};
    const response = await api.get<ApiResponse<{ projects: Project[] }>>('/projects', { params });
    return response.data.data.projects;
  }

  /**
   * Buscar um projeto por ID
   */
  async getProjectById(id: number): Promise<Project> {
    const response = await api.get<ApiResponse<{ project: Project }>>(`/projects/${id}`);
    return response.data.data.project;
  }

  /**
   * Atualizar projeto
   */
  async updateProject(id: number, data: UpdateProjectData): Promise<Project> {
    const response = await api.patch<ApiResponse<{ project: Project }>>(`/projects/${id}`, data);
    return response.data.data.project;
  }

  /**
   * Deletar projeto
   */
  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  /**
   * Buscar dados do dashboard
   */
  async getDashboard(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/projects/dashboard');
    return response.data.data;
  }

  /**
   * Buscar fotos de um projeto
   */
  async getProjectPhotos(projectId: number): Promise<any[]> {
    const response = await api.get<ApiResponse<{ photos: any[] }>>(`/projects/${projectId}/photos`);
    return response.data.data.photos;
  }

  /**
   * Reabrir galeria de um projeto
   */
  async reopenGallery(projectId: number): Promise<Project> {
    const response = await api.post<ApiResponse<{ project: Project }>>(`/projects/${projectId}/reopen-gallery`);
    return response.data.data.project;
  }

  /**
   * Finalizar projeto
   */
  async finalizeProject(projectId: number): Promise<Project> {
    const response = await api.post<ApiResponse<{ project: Project }>>(`/projects/${projectId}/finalize`);
    return response.data.data.project;
  }
}

export const projectService = new ProjectService();
export default projectService;
