import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, Info, Send, X, AlertCircle } from 'lucide-react';
import { galleryService } from '../services/gallery.service';
import { selectionService } from '../services/selection.service';
import PhotoGallery from '../components/PhotoGallery';

export default function GalleryPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadGallery();
  }, [token]);

  const loadGallery = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await galleryService.getByToken(token);
      setProject(data.project);
      setPhotos(data.photos || []);
      
      // Verificar se a galeria está fechada
      if (data.project?.galleryStatus === 'closed') {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePhoto = (photoId: number) => {
    setSelectedPhotoIds((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const calculateTotal = () => {
    const selected = selectedPhotoIds.length;
    const packageSize = project?.packagePhotosCount || 0;
    const extraPhotos = Math.max(0, selected - packageSize);
    const extraCost = extraPhotos * parseFloat(project?.additionalPhotoPrice || '0');
    return {
      selected,
      packageSize,
      extraPhotos,
      extraCost,
    };
  };

  const handleSubmit = async () => {
    if (selectedPhotoIds.length === 0) {
      alert('Selecione pelo menos uma foto');
      return;
    }

    // Abrir modal de confirmação
    setShowConfirmModal(true);
  };

  const confirmSelection = async () => {
    try {
      setSubmitting(true);
      
      // Enviar seleção via API
      await selectionService.create({
        projectToken: token!,
        clientName: 'Cliente', // TODO: Adicionar formulário para nome do cliente
        clientEmail: 'cliente@email.com', // TODO: Adicionar formulário para email
        photoIds: selectedPhotoIds,
      });
      
      setShowConfirmModal(false);
      setSubmitted(true);
      
      // Recarregar para atualizar status
      await loadGallery();
    } catch (error: any) {
      console.error('Erro ao enviar seleção:', error);
      alert(error?.response?.data?.message || 'Erro ao enviar seleção. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-900 dark:text-white">Carregando galeria...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Galeria não encontrada</h1>
          <p className="text-muted-foreground">O link pode estar inválido ou expirado</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotal();

  // Se a galeria foi finalizada, mostrar mensagem de conclusão
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-8 h-8 text-primary" />
                <span className="text-2xl font-display font-bold">Polaris</span>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-card border-2 border-border rounded-2xl p-12 shadow-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>

              <h1 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                Seleção Enviada!
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Sua seleção de fotos foi enviada com sucesso. O fotógrafo receberá uma notificação e entrará em contato em breve.
              </p>

              <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Próximos Passos:</h3>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Você receberá um email de confirmação</li>
                      <li>• O fotógrafo irá processar suas fotos selecionadas</li>
                      <li>• Em breve você receberá o link para download das imagens em alta resolução</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Projeto: <strong>{project.name}</strong></p>
                <p>Esta galeria foi finalizada. Se você precisar fazer alterações, entre em contato com o fotógrafo.</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-8 h-8 text-primary" />
              <span className="text-2xl font-display font-bold">Polaris</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            Selecione suas fotos favoritas
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Como funciona:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Seu pacote inclui <strong>{project.packagePhotosCount} fotos</strong></li>
                <li>• Fotos adicionais custam <strong>R$ {parseFloat(project.additionalPhotoPrice).toFixed(2)}</strong> cada</li>
                <li>• Clique nas fotos para selecioná-las</li>
                <li>• Revise sua seleção e confirme no final</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Selection Summary - Sticky Bar */}
        <AnimatePresence>
          {selectedPhotoIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="sticky top-4 z-10 mb-8"
            >
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/40 rounded-xl p-6 shadow-2xl backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Selecionadas</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{totals.selected}</div>
                      </div>
                    </div>
                    
                    <div className="h-12 w-px bg-border" />
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Incluídas no pacote</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.min(totals.selected, totals.packageSize)}/{totals.packageSize}</div>
                    </div>
                    
                    {totals.extraPhotos > 0 && (
                      <>
                        <div className="h-12 w-px bg-border" />
                        <div>
                          <div className="text-sm text-muted-foreground">Fotos adicionais</div>
                          <div className="text-2xl font-bold text-primary">
                            +{totals.extraPhotos}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {totals.extraCost > 0 && (
                      <div className="text-right bg-primary/10 px-4 py-2 rounded-lg border-2 border-primary/20">
                        <div className="text-xs text-muted-foreground">Custo adicional</div>
                        <div className="text-2xl font-bold text-primary">
                          R$ {totals.extraCost.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {totals.extraPhotos} × R$ {parseFloat(project.additionalPhotoPrice).toFixed(2)}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold border-2 border-border shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      <Send className="w-5 h-5" />
                      Confirmar Seleção
                    </button>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso da seleção</span>
                    <span>{Math.round((totals.selected / totals.packageSize) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totals.selected / totals.packageSize) * 100, 100)}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="p-12 rounded-xl border-2 border-border text-center bg-card">
            <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Nenhuma foto disponível ainda
            </h3>
            <p className="text-muted-foreground">
              O fotógrafo ainda não adicionou fotos a esta galeria
            </p>
          </div>
        ) : (
          <PhotoGallery
            photos={photos}
            selectable={true}
            selectedPhotoIds={selectedPhotoIds}
            onPhotoSelect={togglePhoto}
          />
        )}
      </main>

      {/* Modal de Confirmação */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !submitting && setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Confirmar Seleção</h2>
                  </div>
                  <button
                    onClick={() => !submitting && setShowConfirmModal(false)}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                    disabled={submitting}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Resumo da seleção */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resumo da Seleção</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border-2 border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Total de fotos</div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{totals.selected}</div>
                    </div>
                    
                    <div className="bg-card border-2 border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Incluídas no pacote</div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{Math.min(totals.selected, totals.packageSize)}</div>
                    </div>
                    
                    {totals.extraPhotos > 0 && (
                      <>
                        <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Fotos adicionais</div>
                          <div className="text-3xl font-bold text-primary">{totals.extraPhotos}</div>
                        </div>
                        
                        <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Custo adicional</div>
                          <div className="text-3xl font-bold text-primary">R$ {totals.extraCost.toFixed(2)}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview das fotos selecionadas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Fotos Selecionadas ({selectedPhotoIds.length})
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {photos
                      .filter(photo => selectedPhotoIds.includes(photo.id))
                      .map(photo => (
                        <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
                          <img
                            src={photo.thumbnailUrl}
                            alt={photo.driveFileName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Aviso de custo adicional */}
                {totals.extraCost > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Atenção: Custo Adicional
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Você selecionou {totals.extraPhotos} foto(s) além do seu pacote de {totals.packageSize} fotos.
                        O custo adicional de <strong>R$ {totals.extraCost.toFixed(2)}</strong> será cobrado pelo fotógrafo.
                      </p>
                    </div>
                  </div>
                )}

                {/* Informação */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Ao confirmar, sua seleção será enviada ao fotógrafo. Você receberá as fotos em alta resolução sem marca d'água após o processamento.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-end gap-4 border-t-2 border-border">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Revisar
                </button>
                <button
                  onClick={confirmSelection}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Confirmar e Enviar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>Powered by Polaris • Gestão de Galerias Profissionais</p>
      </footer>
    </div>
  );
}
