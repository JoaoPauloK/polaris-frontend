import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, LogOut, ArrowLeft, Cloud, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { projectService } from '../services/project.service';
import { driveService } from '../services/drive.service';

export default function NewProjectPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingDrive, setCheckingDrive] = useState(false);
  const [driveValid, setDriveValid] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    driveFolderUrl: '',
    packageSize: 30,
    extraPhotoPrice: 50.00,
    status: 'active' as 'active' | 'completed' | 'archived',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const validateDriveUrl = async (url: string) => {
    if (!url) {
      setDriveValid(null);
      return;
    }

    if (!driveService.isValidDriveUrl(url)) {
      setDriveValid(false);
      setErrors((prev) => ({ ...prev, driveFolderUrl: 'URL inválida do Google Drive' }));
      return;
    }

    try {
      setCheckingDrive(true);
      const folderId = driveService.extractFolderId(url);
      if (!folderId) {
        setDriveValid(false);
        setErrors((prev) => ({ ...prev, driveFolderUrl: 'Não foi possível extrair o ID da pasta' }));
        return;
      }

      const result = await driveService.checkFolderAccess(folderId);
      setDriveValid(result.accessible);
      if (!result.accessible) {
        setErrors((prev) => ({ ...prev, driveFolderUrl: result.message }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.driveFolderUrl;
          return newErrors;
        });
      }
    } catch (error) {
      setDriveValid(false);
      setErrors((prev) => ({ ...prev, driveFolderUrl: 'Erro ao verificar acesso à pasta' }));
    } finally {
      setCheckingDrive(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
    if (!formData.driveFolderUrl.trim()) newErrors.driveFolderUrl = 'Link do Google Drive é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      // Mapear os campos do formulário para o formato esperado pela API
      const projectData = {
        name: formData.title,
        description: formData.description || `Projeto para ${formData.clientName}${formData.clientEmail ? ` (${formData.clientEmail})` : ''}`,
        driveFolderUrl: formData.driveFolderUrl,
        packagePhotosCount: formData.packageSize,
        additionalPhotoPrice: formData.extraPhotoPrice,
      };
      
      const project = await projectService.createProject(projectData);
      navigate(`/projects/${project.id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao criar projeto';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        const mappedErrors: Record<string, string> = {};
        validationErrors.forEach((err: any) => {
          mappedErrors[err.path[0]] = err.message;
        });
        setErrors(mappedErrors);
      } else {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2">
                <Camera className="w-6 h-6 text-primary" />
                <span className="text-xl font-display font-bold">Polaris</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projetos
                </Link>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Perfil
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hidden sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Projetos
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Perfil
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-4">
                  <span className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {user?.name}
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Sair
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Projetos
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Criar Novo Projeto
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Preencha os dados e conecte ao Google Drive
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Título do Projeto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                  errors.title ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Ex: Casamento João e Maria"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="Detalhes sobre o projeto..."
              />
            </div>

            {/* Cliente */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nome do Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                    errors.clientName ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Nome completo"
                />
                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email do Cliente (opcional)
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            {/* Google Drive */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Link da Pasta do Google Drive <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.driveFolderUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, driveFolderUrl: e.target.value });
                    setDriveValid(null);
                  }}
                  onBlur={(e) => validateDriveUrl(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                    errors.driveFolderUrl
                      ? 'border-red-500'
                      : driveValid === true
                      ? 'border-green-500'
                      : 'border-border'
                  }`}
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </div>
              {checkingDrive && (
                <p className="text-muted-foreground text-sm mt-1">Verificando acesso...</p>
              )}
              {driveValid === true && (
                <p className="text-green-600 text-sm mt-1">✓ Pasta acessível</p>
              )}
              {errors.driveFolderUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.driveFolderUrl}</p>
              )}
              <p className="text-muted-foreground text-xs mt-2">
                Certifique-se de que a pasta está compartilhada como "Qualquer pessoa com o link pode visualizar"
              </p>
            </div>

            {/* Pacote */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tamanho do Pacote (fotos inclusas)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.packageSize}
                  onChange={(e) => setFormData({ ...formData, packageSize: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Valor por Foto Adicional (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.extraPhotoPrice}
                  onChange={(e) => setFormData({ ...formData, extraPhotoPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="50.00"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'archived' })}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              >
                <option value="active">Ativo</option>
                <option value="completed">Completo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || checkingDrive}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Projeto'}
              </button>
              <Link
                to="/projects"
                className="px-6 py-3 border-2 border-border rounded-lg hover:border-primary transition-colors font-semibold text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
