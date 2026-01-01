import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from '../services/project.service';
import { api } from '../services/api';

vi.mock('../services/api');

const mockProject = {
  id: 1,
  name: 'Projeto Teste',
  packagePhotosCount: 10,
  status: 'active',
};

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar projeto', async () => {
    (api.post as any).mockResolvedValue({
      data: { success: true, data: { project: mockProject } },
    });
    const res = await projectService.createProject({
      name: 'Projeto Teste',
      packagePhotosCount: 10,
      driveFolderUrl: '',
    });
    expect(res.name).toBe('Projeto Teste');
    expect(res.packagePhotosCount).toBe(10);
  });

  it('deve listar projetos', async () => {
    (api.get as any).mockResolvedValue({
      data: { success: true, data: { projects: [mockProject] } },
    });
    const res = await projectService.getProjects();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].name).toBe('Projeto Teste');
  });

  it('deve buscar detalhes do projeto', async () => {
    (api.get as any).mockResolvedValue({ data: { success: true, data: { project: mockProject } } });
    const res = await projectService.getProjectById(1);
    expect(res.id).toBe(1);
    expect(res.name).toBe('Projeto Teste');
  });

  it('deve atualizar projeto', async () => {
    const updatedProject = { ...mockProject, name: 'Projeto Atualizado' };
    (api.patch as any).mockResolvedValue({
      data: { success: true, data: { project: updatedProject } },
    });
    const res = await projectService.updateProject(1, { name: 'Projeto Atualizado' });
    expect(res.name).toBe('Projeto Atualizado');
  });

  it('deve deletar projeto', async () => {
    (api.delete as any).mockResolvedValue({ data: { success: true } });
    await expect(projectService.deleteProject(1)).resolves.toBeUndefined();
    expect(api.delete).toHaveBeenCalledWith('/projects/1');
  });

  it('deve buscar dados do dashboard', async () => {
    const mockDashboard = { totalProjects: 5, activeProjects: 3 };
    (api.get as any).mockResolvedValue({ data: { success: true, data: mockDashboard } });
    const res = await projectService.getDashboard();
    expect(res.totalProjects).toBe(5);
    expect(res.activeProjects).toBe(3);
  });

  it('deve buscar fotos do projeto', async () => {
    const mockPhotos = [
      { id: 1, driveFileName: 'foto1.jpg' },
      { id: 2, driveFileName: 'foto2.jpg' },
    ];
    (api.get as any).mockResolvedValue({ data: { success: true, data: { photos: mockPhotos } } });
    const res = await projectService.getProjectPhotos(1);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(2);
    expect(res[0].driveFileName).toBe('foto1.jpg');
  });

  it('deve reabrir galeria do projeto', async () => {
    const reopenedProject = { ...mockProject, galleryStatus: 'open' };
    (api.post as any).mockResolvedValue({
      data: { success: true, data: { project: reopenedProject } },
    });
    const res = await projectService.reopenGallery(1);
    expect(res.galleryStatus).toBe('open');
  });

  it('deve finalizar projeto', async () => {
    const finalizedProject = { ...mockProject, status: 'completed' };
    (api.post as any).mockResolvedValue({
      data: { success: true, data: { project: finalizedProject } },
    });
    const res = await projectService.finalizeProject(1);
    expect(res.status).toBe('completed');
  });
});
