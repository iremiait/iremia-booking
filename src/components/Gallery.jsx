import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const Gallery = ({ galleryImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [fade, setFade] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const touchStartX = useRef(null);

  // Identifica il biglietto da visita: per alt (case-insensitive) o ultima immagine
  const isBusinessCard = useCallback((img, index) => {
    const alt = (img?.alt || '').toLowerCase();
    if (alt.includes('biglietto da visita')) return true;
    if (index === galleryImages.length - 1) return true;
    return false;
  }, [galleryImages]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setFade(true);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goTo = (index) => {
    setFade(false);
    setTimeout(() => {
      setLightboxIndex(index);
      setFade(true);
    }, 150);
  };

  const prev = () => goTo((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  const next = () => goTo((lightboxIndex + 1) % galleryImages.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const optimizeUrl = (url, width = 800) => {
    if (!url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  };
  const thumbUrl = (url) => optimizeUrl(url, 600);
  const fullUrl = (url) => optimizeUrl(url, 1400);

  // Download con fetch + blob per forzare il salvataggio
  const handleDownload = async (e, img) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const url = img?.src || img;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'iremia-biglietto-da-visita.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Errore download:', err);
      // Fallback: apri in nuova tab
      window.open(img?.src || img, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  // Masonry columns con useMemo
  const columns = useMemo(() => {
    const cols = [[], [], []];
    galleryImages.forEach((img, i) => cols[i % 3].push({ img, index: i }));
    return cols;
  }, [galleryImages]);

  if (!galleryImages || galleryImages.length === 0) return null;

  const progress = lightboxIndex !== null ? ((lightboxIndex + 1) / galleryImages.length) * 100 : 0;

  const currentImg = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;
  const currentIsBusinessCard = lightboxIndex !== null && isBusinessCard(currentImg, lightboxIndex);

  return (
    <>
      <section id="galleria" className="mt-20 max-w-7xl mx-auto px-4">
        {/* Titolo sezione con decorazione */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
            Esplora
          </p>
          <h3 className="text-4xl font-light mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Scopri gli spazi
          </h3>
          {/* Linea decorativa */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ backgroundColor: 'var(--color-primary-100)' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <div className="h-px w-16" style={{ backgroundColor: 'var(--color-primary-100)' }}></div>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {galleryImages.length} foto · clicca per ingrandire
          </p>
        </div>

        {/* Masonry Grid con foto featured */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3 md:gap-4">
              {col.map(({ img, index }) => {
                const isFeatured = index === 0;
                const isBizCard = isBusinessCard(img, index);
                return (
                  <div
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="relative overflow-hidden rounded-xl cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500"
                    style={{ aspectRatio: isFeatured ? '4/3' : 'auto' }}
                  >
                    <img
                      src={thumbUrl(img.src || img)}
                      alt={img.alt || `Foto ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ minHeight: isFeatured ? '280px' : '180px' }}
                    />

                    {/* Overlay gradiente */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
                    />

                    {/* Titolo che sale dal basso */}
                    {img.alt && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white text-sm font-medium">{img.alt}</p>
                      </div>
                    )}

                    {/* Icona zoom */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>

                    {/* Badge featured */}
                    {isFeatured && (
                      <div
                        className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        In evidenza
                      </div>
                    )}

                    {/* Bottone download biglietto da visita (nella griglia) */}
                    {isBizCard && (
                      <button
                        onClick={(e) => handleDownload(e, img)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        title="Scarica biglietto da visita"
                      >
                        <Download size={13} />
                        Scarica
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Barra progresso */}
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: 'var(--color-primary)' }}
            />
          </div>

          {/* Chiudi */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            <X size={20} />
          </button>

          {/* Contatore */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 text-sm px-5 py-1.5 rounded-full font-medium"
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            {lightboxIndex + 1} <span style={{ color: 'rgba(255,255,255,0.5)' }}>/ {galleryImages.length}</span>
          </div>

          {/* Bottone download nel lightbox - solo per il biglietto da visita */}
          {currentIsBusinessCard && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(e, currentImg); }}
              disabled={downloading}
              className="absolute top-5 left-5 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary)', backdropFilter: 'blur(4px)' }}
              title="Scarica biglietto da visita"
            >
              <Download size={16} className={downloading ? 'animate-bounce' : ''} />
              {downloading ? 'Download...' : 'Scarica biglietto'}
            </button>
          )}

          {/* Freccia sinistra */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Immagine con fade */}
          <div
            className="max-w-5xl max-h-[80vh] px-20 transition-opacity duration-150"
            style={{ opacity: fade ? 1 : 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullUrl(galleryImages[lightboxIndex]?.src || galleryImages[lightboxIndex])}
              alt={galleryImages[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            {galleryImages[lightboxIndex]?.alt && (
              <p
                className="text-center text-sm mt-4 font-medium"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {galleryImages[lightboxIndex].alt}
              </p>
            )}
          </div>

          {/* Freccia destra */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto px-4 pb-1">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  width: i === lightboxIndex ? '52px' : '40px',
                  height: i === lightboxIndex ? '52px' : '40px',
                  opacity: i === lightboxIndex ? 1 : 0.45,
                  border: i === lightboxIndex ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transform: i === lightboxIndex ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <img src={thumbUrl(img.src || img)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Gallery;
