import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, RefreshCw, Copy, ExternalLink, Camera, Lock, Unlock, CheckCircle, DollarSign, User, Mail, Calendar, Download, LogOut } from 'lucide-react';
import { projectService } from '../services/project.service';
import { driveService } from '../services/drive.service';
import { selectionService } from '../services/selection.service';
import { useAuthStore } from '../store/authStore';
import PhotoGallery from '../components/PhotoGallery';
import type { Project } from '../types/project';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selections, setSelections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingSelections, setLoadingSelections] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [expandedSelections, setExpandedSelections] = useState<Set<number>>(new Set());
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadProject();
    loadPhotos();
    loadSelections();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await projectService.getProjectById(Number(id));
      setProject(data);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    if (!id) return;
    
    try {
      setLoadingPhotos(true);
      const data = await projectService.getProjectPhotos(Number(id));
      setPhotos(data);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const loadSelections = async () => {
    if (!id) return;
    
    try {
      setLoadingSelections(true);
      const data = await selectionService.getByProject(Number(id));
      setSelections(data);
    } catch (error) {
      console.error('Erro ao carregar seleções:', error);
    } finally {
      setLoadingSelections(false);
    }
  };

  const handleSync = async () => {
    if (!id || !project) return;

    try {
      setSyncing(true);
      setSyncResult(null);
      
      const result = await driveService.syncPhotos(Number(id));
      
      setSyncResult({
        success: true,
        message: `Sincronizado: ${result.syncedPhotos} de ${result.totalImages} fotos`,
      });

      // Recarrega o projeto e fotos para atualizar contadores
      await loadProject();
      await loadPhotos();
    } catch (error: any) {
      setSyncResult({
        success: false,
        message: error.response?.data?.error || 'Erro ao sincronizar fotos',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      await projectService.deleteProject(Number(id));
      navigate('/projects');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto');
    }
  };

  const handleReopenGallery = async () => {
    if (!id || !project) return;

    try {
      setReopening(true);
      await projectService.reopenGallery(Number(id));
      
      // Recarregar projeto para atualizar status
      await loadProject();
      
      alert('Galeria reaberta com sucesso! O cliente poderá fazer uma nova seleção.');
    } catch (error: any) {
      console.error('Erro ao reabrir galeria:', error);
      alert(error.response?.data?.message || 'Erro ao reabrir galeria');
    } finally {
      setReopening(false);
    }
  };

  const handleFinalizeProject = async () => {
    if (!id || !project) return;
    
    if (!window.confirm('Tem certeza que deseja finalizar este projeto? Esta ação marca o projeto como concluído.')) {
      return;
    }

    try {
      setFinalizing(true);
      await projectService.finalizeProject(Number(id));
      
      // Recarregar projeto para atualizar status
      await loadProject();
      
      alert('Projeto finalizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao finalizar projeto:', error);
      alert(error.response?.data?.message || 'Erro ao finalizar projeto');
    } finally {
      setFinalizing(false);
    }
  };

  const toggleExpandSelection = (selectionId: number) => {
    setExpandedSelections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(selectionId)) {
        newSet.delete(selectionId);
      } else {
        newSet.add(selectionId);
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Projeto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header - Navbar melhorada e fixa no topo */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div whileHover={{ rotate: 12, scale: 1.1 }}>
                  <Camera className="w-7 h-7 text-primary" strokeWidth={2} />
                </motion.div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Polaris
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold transition-colors"
                >
                  Projetos
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Perfil
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline font-medium">
                {user?.name}
              </span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                <span className="font-medium">Sair</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Voltar para Projetos
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-gray-900 dark:text-white"
            >
              {project.name}
            </motion.h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">{project.description}</p>
            )}
          </div>

          {user?.id === project.userId && (
            <div className="flex gap-3">
              {project.status === 'active' && (
                <button
                  onClick={handleFinalizeProject}
                  disabled={finalizing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  {finalizing ? 'Finalizando...' : 'Finalizar Projeto'}
                </button>
              )}
              <button
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border-2 border-border"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors border-2 border-border"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm"
          >
            <div className="text-muted-foreground text-sm font-semibold mb-2">
              FOTOS
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.photosCount || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm"
          >
            <div className="text-muted-foreground text-sm font-semibold mb-2">
              SELEÇÕES
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.selectionsCount || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm"
          >
            <div className="text-muted-foreground text-sm font-semibold mb-2">
              STATUS
            </div>
            <div className="flex items-center gap-2">
              {project.status === 'active' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">Ativo</span>
                </>
              ) : project.status === 'completed' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Finalizado</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">Arquivado</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Google Drive Sync */}
        {project.driveFolderId && user?.id === project.userId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sincronização com Google Drive
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sincronize as fotos da pasta do Google Drive para este projeto
                </p>
              </div>
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors border-2 border-border ${
                  syncing
                    ? 'bg-muted cursor-not-allowed text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Sincronizando...' : 'Sincronizar Fotos'}
              </button>
            </div>

            {syncResult && (
              <div
                className={`mt-4 p-4 rounded-lg border-2 ${
                  syncResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm ${
                    syncResult.success 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {syncResult.message}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Gallery Link */}
        {project.galleryUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Link da Galeria
              </h3>
              <div className="flex items-center gap-2">
                {project.galleryStatus === 'closed' ? (
                  <>
                    <Lock className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-semibold text-red-500">Galeria Fechada</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-500">Galeria Aberta</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={project.galleryUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(project.galleryUrl);
                  alert('Link copiado!');
                }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border-2 border-border"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
              <a
                href={project.galleryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors border-2 border-border"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir
              </a>
            </div>

            {project.galleryStatus === 'closed' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                  <strong>⚠️ Esta galeria foi finalizada.</strong> O cliente já enviou a seleção de fotos. 
                  Se desejar permitir que o cliente faça uma nova seleção, você pode reabrir a galeria.
                </p>
                <button
                  onClick={handleReopenGallery}
                  disabled={reopening}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border-2 border-border ${
                    reopening
                      ? 'bg-muted cursor-not-allowed text-muted-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Unlock className="h-4 w-4" />
                  {reopening ? 'Reabrindo...' : 'Reabrir Galeria'}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Client Selections */}
        {project?.galleryStatus === 'closed' && selections.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card text-card-foreground rounded-lg p-6 border-2 border-border shadow-sm mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Seleções dos Clientes
            </h3>
            
            <div className="space-y-4">
              {selections.map((selection: any) => (
                <div
                  key={selection.id}
                  className="bg-background border-2 border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selection.clientName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="w-4 h-4" />
                        <span>{selection.clientEmail}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(selection.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        selection.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                        selection.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        selection.status === 'delivered' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                        'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
                      }`}>
                        {selection.status === 'pending' ? 'Pendente' :
                         selection.status === 'confirmed' ? 'Confirmado' :
                         selection.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selection.selectedPhotosCount}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fotos Selecionadas
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {Math.min(selection.selectedPhotosCount, project?.packagePhotosCount || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Incluídas no Pacote
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {selection.additionalPhotosCount}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fotos Adicionais
                      </div>
                    </div>
                  </div>
                  
                  {parseFloat(selection.totalPrice) > 0 && (
                    <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                          💰 Custo Adicional:
                        </span>
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                          R$ {parseFloat(selection.totalPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        {selection.additionalPhotosCount} foto(s) × R$ {parseFloat(project?.additionalPhotoPrice || 0).toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  {selection.notes && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Observações:</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selection.notes}</div>
                    </div>
                  )}
                  
                  {/* Preview das fotos selecionadas */}
                  {selection.photos && selection.photos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold text-muted-foreground">
                          FOTOS SELECIONADAS PELO CLIENTE ({selection.photos.length}):
                        </div>
                        {selection.photos.length > 12 && (
                          <button
                            onClick={() => toggleExpandSelection(selection.id)}
                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            {expandedSelections.has(selection.id) ? '▼ Mostrar Menos' : '▶ Ver Todas'}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {(expandedSelections.has(selection.id) 
                          ? selection.photos 
                          : selection.photos.slice(0, 12)
                        ).map((photo: any, idx: number) => (
                          <div
                            key={photo.id}
                            className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors group relative"
                          >
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.driveFileName}
                              className="w-full h-full object-cover"
                            />
                            {/* Botão de download individual */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const link = document.createElement('a');
                                  link.href = photo.downloadUrl || photo.originalUrl;
                                  link.download = photo.driveFileName;
                                  link.style.display = 'none';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title={`Baixar ${photo.driveFileName}`}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!expandedSelections.has(selection.id) && selection.photos.length > 12 && (
                        <div className="mt-3 text-center">
                          <button
                            onClick={() => toggleExpandSelection(selection.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-semibold"
                          >
                            <Camera className="w-4 h-4" />
                            Ver todas as {selection.photos.length} fotos
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Botões de Download das Fotos Selecionadas */}
                  {selection.photos && selection.photos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Download className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                              Download das Fotos Selecionadas
                            </h4>
                            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                              Baixe as {selection.photos.length} fotos selecionadas pelo cliente:
                            </p>
                            <div className="flex gap-3">
                              {/* Botão Baixar Todas */}
                              <button
                                onClick={() => {
                                  selection.photos.forEach((photo: any, index: number) => {
                                    setTimeout(() => {
                                      const link = document.createElement('a');
                                      link.href = photo.downloadUrl || photo.originalUrl;
                                      link.download = photo.driveFileName;
                                      link.style.display = 'none';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }, index * 500); // Delay de 500ms entre downloads
                                  });
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                              >
                                <Download className="w-5 h-5" />
                                Baixar Todas ({selection.photos.length})
                              </button>
                              
                              {/* Botão Baixar Selecionadas (futuro) */}
                              <button
                                onClick={() => {
                                  alert('Funcionalidade em desenvolvimento: selecione as fotos desejadas primeiro');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <Download className="w-5 h-5" />
                                Baixar Selecionadas
                              </button>
                            </div>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-3">
                              💡 Clique no botão de download em cada foto ou use "Baixar Todas" para baixar automaticamente.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : project?.galleryStatus === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <Unlock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Aguardando Seleção do Cliente
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  A galeria está <strong>aberta</strong> e disponível para o cliente. 
                  Assim que o cliente fizer a seleção das fotos, você receberá uma notificação 
                  e poderá visualizar as escolhas aqui.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <Camera className="w-4 h-4" />
                  <span>
                    {photos.length} foto(s) disponível(is) | 
                    Pacote: {project.packagePhotosCount} fotos | 
                    Adicional: R$ {parseFloat(project.additionalPhotoPrice.toString()).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photos Grid - Placeholder */}
        {(project.photosCount ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">
              Fotos do Projeto
            </h3>
            
            {loadingPhotos ? (
              <div className="bg-card text-card-foreground rounded-lg p-8 border-2 border-border shadow-sm text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Carregando fotos...</p>
              </div>
            ) : photos.length > 0 ? (
              <PhotoGallery photos={photos} />
            ) : (
              <div className="bg-card text-card-foreground rounded-lg p-8 border-2 border-border shadow-sm text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Nenhuma foto sincronizada ainda.
                </p>
                {project.driveFolderId && (
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border-2 border-border"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    Sincronizar com Drive
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
