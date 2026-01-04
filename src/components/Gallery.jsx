import React from 'react';

const Gallery = ({ galleryImages }) => {
  return (
    <>
      {/* Galleria Foto con Lightbox e Lazy Loading - DINAMICA */}
      <div id="galleria" className="mt-20 max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-light text-gray-800 mb-8 text-center">
          Scopri gli spazi
        </h3>
        <div className={`grid gap-3 justify-center ${
          galleryImages.length === 9 ? 'grid-cols-3 md:grid-cols-3 max-w-4xl mx-auto' :
          galleryImages.length === 10 ? 'grid-cols-2 md:grid-cols-5 max-w-6xl mx-auto' :
          galleryImages.length === 6 ? 'grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                let currentIndex = index;
                
                const showImage = (idx) => {
                  const lightboxImg = document.getElementById('lightbox-img');
                  const counter = document.getElementById('lightbox-counter');
                  lightboxImg.src = galleryImages[idx].src;
                  lightboxImg.alt = galleryImages[idx].alt;
                  counter.textContent = `${idx + 1} / ${galleryImages.length}`;
                };
                
                showImage(currentIndex);
                
                document.getElementById('lightbox-prev').onclick = () => {
                  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                  showImage(currentIndex);
                };
                
                document.getElementById('lightbox-next').onclick = () => {
                  currentIndex = (currentIndex + 1) % galleryImages.length;
                  showImage(currentIndex);
                };
                
                document.getElementById('lightbox').classList.remove('hidden');
              }}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox con navigazione */}
      <div 
        id="lightbox" 
        className="hidden fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target.id === 'lightbox') {
            document.getElementById('lightbox').classList.add('hidden');
          }
        }}
      >
        {/* Bottone Chiudi */}
        <button 
          id="lightbox-close"
          onClick={() => document.getElementById('lightbox').classList.add('hidden')}
          className="absolute top-4 right-4 text-white text-4xl hover:text-teal-400 transition-colors z-10"
        >
          ×
        </button>
        
        {/* Freccia Sinistra */}
        <button 
          id="lightbox-prev"
          className="absolute left-4 text-white text-5xl hover:text-teal-400 transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ‹
        </button>
        
        {/* Immagine */}
        <img 
          id="lightbox-img" 
          src="" 
          alt="" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        
        {/* Freccia Destra */}
        <button 
          id="lightbox-next"
          className="absolute right-4 text-white text-5xl hover:text-teal-400 transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ›
        </button>
        
        {/* Contatore */}
        <div className="absolute bottom-4 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
          <span id="lightbox-counter">1 / {galleryImages.length}</span>
        </div>
      </div>
    </>
  );
};

export default Gallery;
