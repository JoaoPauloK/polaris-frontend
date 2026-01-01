import api from './api';

export interface DrivePreviewResponse {
  images: Array<{
    id: string;
    name: string;
    thumbnailUrl: string;
  }>;
  folderName: string;
  totalImages: number;
}

export interface DriveSyncResponse {
  message: string;
  syncedPhotos: number;
  totalImages: number;
  errors: string[];
}

export interface DriveCheckResponse {
  accessible: boolean;
  message: string;
}

class DriveService {
  /**
   * Sincroniza fotos de uma pasta do Google Drive para um projeto
   */
  async syncPhotos(projectId: number): Promise<DriveSyncResponse> {
    const response = await api.post<DriveSyncResponse>(
      `/drive/sync/${projectId}`
    );
    return response.data;
  }

  /**
   * Verifica se uma pasta do Google Drive está acessível
   */
  async checkFolderAccess(folderId: string): Promise<DriveCheckResponse> {
    const response = await api.get<DriveCheckResponse>(
      `/drive/check/${folderId}`
    );
    return response.data;
  }

  /**
   * Preview das imagens de uma pasta do Google Drive
   */
  async previewFolder(folderId: string): Promise<DrivePreviewResponse> {
    const response = await api.get<DrivePreviewResponse>(
      `/drive/preview/${folderId}`
    );
    return response.data;
  }

  /**
   * Extrai o ID da pasta de uma URL do Google Drive
   */
  extractFolderId(url: string): string | null {
    // Formatos suportados:
    // https://drive.google.com/drive/folders/FOLDER_ID
    // https://drive.google.com/drive/u/0/folders/FOLDER_ID
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  /**
   * Valida se uma URL é uma pasta válida do Google Drive
   */
  isValidDriveUrl(url: string): boolean {
    return /drive\.google\.com\/drive\/(u\/\d+\/)?folders\/[a-zA-Z0-9_-]+/.test(url);
  }
}

export const driveService = new DriveService();
