import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = ({ galleryImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setLightboxIndex((lightboxIndex + 1) % galleryImages.length);

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

  // useMemo evita di ricalcolare le colonne ad ogni render
  const columns = useMemo(() => {
    const cols = [[], [], []];
    galleryImages.forEach((img, i) => cols[i % 3].push({ img, index: i }));
    return cols;
  }, [galleryImages]);

  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <>
      <section id="galleria" className="mt-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-light mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Scopri gli spazi
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Clicca su una foto per ingrandirla
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3 md:gap-4">
              {col.map(({ img, index }) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative overflow-hidden rounded-xl cursor-pointer group shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={thumbUrl(img.src || img)}
                    alt={img.alt || `Foto ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                  >
                    {img.alt && (
                      <span className="text-white text-sm font-medium">{img.alt}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Chiudi */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all hover:opacity-75"
            style={{ color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <X size={24} />
          </button>

          {/* Contatore */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-sm px-4 py-1 rounded-full"
            style={{ color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            {lightboxIndex + 1} / {galleryImages.length}
          </div>

          {/* Freccia sinistra */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10 p-3 rounded-full transition-all hover:opacity-75"
            style={{ color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Immagine */}
          <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={fullUrl(galleryImages[lightboxIndex]?.src || galleryImages[lightboxIndex])}
              alt={galleryImages[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {galleryImages[lightboxIndex]?.alt && (
              <p className="text-center text-sm mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {galleryImages[lightboxIndex].alt}
              </p>
            )}
          </div>

          {/* Freccia destra */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10 p-3 rounded-full transition-all hover:opacity-75"
            style={{ color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto px-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition border-2 ${
                  i === lightboxIndex ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
                style={{ borderColor: i === lightboxIndex ? 'var(--color-primary)' : 'transparent' }}
              >
                <img src={thumbUrl(img.src || img)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
