import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = ({ galleryImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setLightboxIndex((lightboxIndex + 1) % galleryImages.length);

  // Keyboard navigation
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

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  // Cloudinary ottimizzazione URL
  const optimizeUrl = (url, width = 800) => {
    if (!url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  };

  const thumbUrl = (url) => optimizeUrl(url, 600);
  const fullUrl = (url) => optimizeUrl(url, 1400);

  // Masonry columns
  const getColumns = () => {
    const cols = [[], [], []];
    galleryImages.forEach((img, i) => cols[i % 3].push({ img, index: i }));
    return cols;
  };

  if (!galleryImages || galleryImages.length === 0) return null;

  const columns = getColumns();

  return (
    <>
      <section id="galleria" className="mt-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-light text-gray-800 mb-2">
            Scopri gli spazi
          </h3>
          <p className="text-gray-500 text-sm">Clicca su una foto per ingrandirla</p>
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
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {img.alt && (
                      <span className="text-white text-sm font-medium">
                        {img.alt}
                      </span>
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Chiudi */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition z-10 bg-white/10 rounded-full p-2"
          >
            <X size={24} />
          </button>

          {/* Contatore */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-4 py-1 rounded-full">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>

          {/* Freccia sinistra */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/70 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Immagine */}
          <div
            className="max-w-5xl max-h-[85vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullUrl(galleryImages[lightboxIndex]?.src || galleryImages[lightboxIndex])}
              alt={galleryImages[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {galleryImages[lightboxIndex]?.alt && (
              <p className="text-white/60 text-center text-sm mt-3">
                {galleryImages[lightboxIndex].alt}
              </p>
            )}
          </div>

          {/* Freccia destra */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/70 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"
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
                  i === lightboxIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={thumbUrl(img.src || img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
