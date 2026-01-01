export interface Project {
  id: number;
  userId: number;
  name: string;
  description?: string;
  driveFolderUrl: string;
  driveFolderId: string;
  packagePhotosCount: number;
  additionalPhotoPrice: number;
  status: 'active' | 'completed' | 'archived';
  galleryStatus: 'open' | 'closed';
  galleryToken: string;
  galleryUrl: string;
  createdAt: string;
  updatedAt: string;
  photosCount?: number;
  selectionsCount?: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  driveFolderUrl: string;
  packagePhotosCount?: number;
  additionalPhotoPrice?: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  packagePhotosCount?: number;
  additionalPhotoPrice?: number;
  status?: 'active' | 'completed' | 'archived';
}

export interface Photo {
  id: number;
  projectId: number;
  driveFileId: string;
  driveFileName: string;
  originalUrl: string;
  thumbnailUrl?: string;
  watermarkedUrl?: string;
  fullImageUrl?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  position: number;
  createdAt: string;
}

export interface Selection {
  id: number;
  projectId: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  selectedPhotosCount: number;
  additionalPhotosCount: number;
  totalPrice: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
}

export interface CreateSelectionData {
  projectToken: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  photoIds: number[];
  notes?: string;
}

export interface Gallery {
  project: Project & {
    user?: {
      id: number;
      name: string;
      businessName?: string;
      avatarUrl?: string;
    };
  };
  photos: Photo[];
}
