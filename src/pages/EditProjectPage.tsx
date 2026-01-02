import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { projectService } from '../services/project.service';
import type { Project } from '../types/project';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    packagePhotosCount: 10,
    additionalPhotoPrice: 50,
    status: 'active' as 'active' | 'completed' | 'archived',
  });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await projectService.getProjectById(Number(id));
      setProject(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        packagePhotosCount: data.packagePhotosCount,
        additionalPhotoPrice: parseFloat(data.additionalPhotoPrice.toString()),
        status: data.status,
      });
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      alert('Erro ao carregar projeto');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      setSubmitting(true);
      await projectService.updateProject(Number(id), formData);
      alert('Projeto atualizado com sucesso!');
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      alert('Erro ao atualizar projeto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'packagePhotosCount' || name === 'additionalPhotoPrice'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Projeto
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-gray-900 dark:text-white"
          >
            Editar Projeto
          </motion.h1>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card text-card-foreground rounded-lg p-6 md:p-8 border-2 border-border shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Nome do Projeto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="Ex: Casamento Maria & João"
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                placeholder="Descrição detalhada do projeto..."
              />
            </div>

            {/* Grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantidade de fotos no pacote */}
              <div>
                <label htmlFor="packagePhotosCount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Fotos no Pacote *
                </label>
                <input
                  type="number"
                  id="packagePhotosCount"
                  name="packagePhotosCount"
                  value={formData.packagePhotosCount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>

              {/* Preço por foto adicional */}
              <div>
                <label htmlFor="additionalPhotoPrice" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Preço Foto Adicional (R$) *
                </label>
                <input
                  type="number"
                  id="additionalPhotoPrice"
                  name="additionalPhotoPrice"
                  value={formData.additionalPhotoPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                <option value="active">Ativo</option>
                <option value="completed">Completo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>

            {/* Info sobre URL do Drive */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nota:</strong> A pasta do Google Drive não pode ser alterada após a criação do projeto. 
                  Se precisar mudar a pasta, crie um novo projeto.
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-semibold border-2 border-border"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors border-2 border-border ${
                  submitting
                    ? 'bg-muted cursor-not-allowed text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
