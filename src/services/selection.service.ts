import api from './api';
import type { Selection, CreateSelectionData } from '../types/project';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class SelectionService {
  async create(data: CreateSelectionData): Promise<Selection> {
    const response = await api.post<ApiResponse<{ selection: Selection }>>('/selections', data);
    return response.data.data.selection;
  }

  async getByProject(projectId: number): Promise<Selection[]> {
    const response = await api.get<ApiResponse<{ selections: Selection[] }>>(`/selections/project/${projectId}`);
    return response.data.data.selections;
  }

  async getOne(id: number): Promise<Selection> {
    const response = await api.get<ApiResponse<{ selection: Selection }>>(`/selections/${id}`);
    return response.data.data.selection;
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  ): Promise<Selection> {
    const response = await api.patch<ApiResponse<{ selection: Selection }>>(`/selections/${id}/status`, { status });
    return response.data.data.selection;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/selections/${id}`);
  }

  async downloadZip(id: number): Promise<void> {
    const response = await api.get(`/selections/${id}/download`, {
      responseType: 'blob',
    });
    
    // Criar URL para o blob e fazer download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Extrair nome do arquivo do header Content-Disposition se disponível
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'selecao.zip';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const selectionService = new SelectionService();
export default selectionService;
