import React, { useState, useEffect } from 'react';
import { popupService } from '../lib/supabase';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const checkPopup = async () => {
      const popup = await popupService.getActivePopup();
      if (!popup) return;

      const now = new Date();
      if (popup.start_date && new Date(popup.start_date) > now) return;
      if (popup.end_date && new Date(popup.end_date) < now) return;

      const lastShown = localStorage.getItem('iremia_popup_last_shown');
      if (lastShown) {
        const daysSinceShown = Math.floor((Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24));
        if (daysSinceShown < (popup.show_frequency_days || 7)) return;
      }

      setTimeout(() => {
        setPopupData(popup);
        setIsVisible(true);
        popupService.incrementViews(popup.id);
        localStorage.setItem('iremia_popup_last_shown', Date.now().toString());
      }, (popup.delay_seconds || 3) * 1000);
    };

    checkPopup();
  }, []);

  const handleClose = () => setIsVisible(false);

  const handleClick = () => {
    if (popupData?.id) popupService.incrementClicks(popupData.id);
    if (popupData?.button_link) window.open(popupData.button_link, '_blank');
    handleClose();
  };

  if (!isVisible || !popupData) return null;

  const hasImage = !!popupData.image_url;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', animation: 'fadeIn 0.3s ease-out' }}
        onClick={handleClose}
      >
        <div
          className="rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
          style={{
            backgroundColor: popupData.bg_color || 'var(--color-primary)',
            animation: 'slideUp 0.4s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pulsante chiudi — sempre sopra tutto */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-xl font-light transition-opacity hover:opacity-75"
            style={{
              color: popupData.text_color || '#FFFFFF',
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            ×
          </button>

          {/* Immagine full-width in cima, senza testo sopra */}
          {hasImage && (
            <div className="w-full">
              <img
                src={popupData.image_url}
                alt={popupData.title || 'Popup'}
                className="w-full object-contain"
                style={{ maxHeight: '280px', display: 'block' }}
              />
            </div>
          )}

          {/* Testo e pulsante — sempre sotto l'immagine */}
          {(popupData.title || popupData.message || popupData.button_text) && (
            <div
              className="p-6 text-center"
              style={{ color: popupData.text_color || '#FFFFFF' }}
            >
              {popupData.title && (
                <h3 className="text-2xl font-light mb-3">{popupData.title}</h3>
              )}

              {popupData.message && (
                <p className="text-base mb-5 opacity-90 leading-relaxed">{popupData.message}</p>
              )}

              {popupData.button_text && (
                <button
                  onClick={handleClick}
                  className="px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: 'white',
                    color: popupData.bg_color || 'var(--color-primary)'
                  }}
                >
                  {popupData.button_text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Popup;
