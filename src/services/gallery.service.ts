import api from './api';
import type { Gallery } from '../types/project';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class GalleryService {
  async getByToken(token: string): Promise<Gallery> {
    const response = await api.get<ApiResponse<Gallery>>(`/gallery/${token}`);
    return response.data.data;
  }
}

export const galleryService = new GalleryService();
export default galleryService;
