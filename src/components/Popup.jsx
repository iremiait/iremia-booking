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
  const hasText = !!(popupData.title || popupData.message || popupData.button_text);

  return (
    <>
      <div
        className="fixed inset-0 flex items-start justify-center p-4"
        style={{
          zIndex: 60,
          paddingTop: 'calc(var(--header-height, 80px) + 1.5rem)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={handleClose}
      >
        <div
          className="relative overflow-hidden w-full"
          style={{
            maxWidth: '420px',
            backgroundColor: popupData.bg_color || 'var(--color-primary)',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
            animation: 'slideUp 0.4s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pulsante chiudi */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-xl font-light transition-opacity hover:opacity-75"
            style={{
              color: popupData.text_color || '#FFFFFF',
              backgroundColor: 'rgba(0,0,0,0.25)',
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Immagine */}
          {hasImage && (
            <img
              src={popupData.image_url}
              alt={popupData.title || 'Popup'}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: hasText ? '1rem 1rem 0 0' : '1rem',
              }}
            />
          )}

          {/* Testo e CTA */}
          {hasText && (
            <div
              className="text-center"
              style={{
                padding: '1.25rem 1.5rem 1.75rem',
                color: popupData.text_color || '#FFFFFF',
              }}
            >
              {popupData.title && (
                <h3 style={{ fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.6rem' }}>
                  {popupData.title}
                </h3>
              )}

              {popupData.message && (
                <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1rem' }}>
                  {popupData.message}
                </p>
              )}

              {popupData.button_text && (
                <button
                  onClick={handleClick}
                  className="transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: 'white',
                    color: popupData.bg_color || 'var(--color-primary)',
                    padding: '0.6rem 1.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
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
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Popup;
