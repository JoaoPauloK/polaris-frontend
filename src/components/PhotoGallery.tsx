import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';

interface Photo {
  id: number;
  driveFileId?: string;
  driveFileName: string;
  thumbnailUrl: string;
  fullImageUrl?: string;
  originalUrl?: string;
  position: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  selectable?: boolean;
  selectedPhotoIds?: number[];
  onPhotoSelect?: (photoId: number) => void;
}

export default function PhotoGallery({ photos, selectable = false, selectedPhotoIds = [], onPhotoSelect }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma foto encontrada. Sincronize com o Google Drive.</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => {
          const isSelected = selectedPhotoIds.includes(photo.id);

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-primary shadow-lg shadow-primary/50 scale-95' 
                  : 'border-border hover:border-primary'
              }`}
              onClick={() => {
                if (selectable && onPhotoSelect) {
                  onPhotoSelect(photo.id);
                } else {
                  openLightbox(index);
                }
              }}
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.driveFileName}
                className={`w-full h-full object-cover transition-all select-none ${
                  isSelected ? 'brightness-90' : ''
                }`}
                loading="lazy"
                onContextMenu={(e) => selectable && e.preventDefault()}
                onDragStart={(e) => selectable && e.preventDefault()}
                draggable={!selectable}
              />
              
              {/* Marca d'água visual para modo selecionável */}
              {selectable && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="text-white/20 text-6xl font-bold transform -rotate-45 select-none">
                    PREVIEW
                  </div>
                </div>
              )}
              
              {/* Overlay no hover ou selecionado */}
              <div className={`absolute inset-0 transition-all flex items-center justify-center pointer-events-none ${
                isSelected 
                  ? 'bg-primary/20' 
                  : 'bg-black bg-opacity-0 group-hover:bg-opacity-30'
              }`}>
                {!isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                    className="pointer-events-auto bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    title="Visualizar foto"
                  >
                    <ZoomIn className="text-white w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Checkbox para seleção */}
              {selectable && (
                <div className="absolute top-2 right-2 z-10">
                  <motion.div
                    initial={false}
                    animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary border-primary shadow-lg'
                        : 'bg-white/90 border-white hover:bg-white backdrop-blur-sm'
                    }`}
                  >
                    {isSelected && (
                      <motion.svg 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-4 h-4 text-primary-foreground" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <motion.path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M5 13l4 4L19 7" 
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Número da posição */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Botões de controle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            {/* Imagem principal */}
            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl max-h-[90vh] mx-auto px-16 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={photos[currentPhotoIndex].fullImageUrl || photos[currentPhotoIndex].originalUrl || photos[currentPhotoIndex].thumbnailUrl}
                  alt={photos[currentPhotoIndex].driveFileName}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', {
                      fullImageUrl: photos[currentPhotoIndex].fullImageUrl,
                      originalUrl: photos[currentPhotoIndex].originalUrl,
                      thumbnailUrl: photos[currentPhotoIndex].thumbnailUrl
                    });
                    // Tentar thumbnail como fallback
                    const img = e.target as HTMLImageElement;
                    if (img.src !== photos[currentPhotoIndex].thumbnailUrl) {
                      img.src = photos[currentPhotoIndex].thumbnailUrl;
                    }
                  }}
                  onContextMenu={(e) => selectable && e.preventDefault()}
                  onDragStart={(e) => selectable && e.preventDefault()}
                  draggable={!selectable}
                />
                
                {/* Marca d'água no lightbox para modo selecionável */}
                {selectable && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-white/30 text-8xl font-bold transform -rotate-45 select-none">
                        PREVIEW
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-yellow-500/90 text-yellow-900 px-3 py-1 rounded-lg text-sm font-semibold">
                      ⚠️ Marca d'água • Versão Preview
                    </div>
                    {/* Overlay invisível para bloquear clique direito na imagem */}
                    <div 
                      className="absolute inset-0 cursor-default"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </>
                )}

                {/* Botão de download removido da área da imagem */}
              </div>
              
              {/* Info da foto */}
              <div className="text-center mt-6 text-white">
                <p className="text-lg font-semibold truncate max-w-[80vw] mx-auto">{photos[currentPhotoIndex].driveFileName}</p>
                <p className="text-sm text-gray-400">
                  {currentPhotoIndex + 1} de {photos.length}
                </p>
                {selectable && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Versão com resolução reduzida para preview • Após confirmação você receberá as fotos em alta qualidade
                  </p>
                )}
              </div>

              {/* Botão de download centralizado abaixo da imagem */}
              {!selectable && (photos[currentPhotoIndex].fullImageUrl || photos[currentPhotoIndex].originalUrl) && (
                <div className="flex justify-center mt-6">
                  <a
                    href={photos[currentPhotoIndex].fullImageUrl || photos[currentPhotoIndex].originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/90 text-gray-900 px-5 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors backdrop-blur-md font-medium text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                </div>
              )}
            </motion.div>

            {/* Contador no topo direito */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 text-white text-sm px-3 py-1 rounded-lg shadow-md select-none">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
