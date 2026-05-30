import React, { useState, useEffect } from 'react';
import { popupService } from '../lib/supabase';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const checkPopup = async () => {
      // Una sola chiamata per ottenere il popup
      const popup = await popupService.getActivePopup();
      if (!popup) return;

      // Controlla date validità
      const now = new Date();
      if (popup.start_date && new Date(popup.start_date) > now) return;
      if (popup.end_date && new Date(popup.end_date) < now) return;

      // Controlla frequenza
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

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', animation: 'fadeIn 0.3s ease-out' }}
        onClick={handleClose}
      >
        <div
          className="rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          style={{
            backgroundColor: popupData.bg_color || 'var(--color-primary)',
            animation: 'slideUp 0.4s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-3xl font-light transition-opacity hover:opacity-75"
            style={{ color: popupData.text_color || '#FFFFFF' }}
          >
            ×
          </button>

          <div className="text-center" style={{ color: popupData.text_color || '#FFFFFF' }}>
            {popupData.image_url && (
              <div className="mb-6">
                <img
                  src={popupData.image_url}
                  alt={popupData.title || 'Popup'}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {popupData.title && (
              <h3 className="text-3xl font-light mb-4">{popupData.title}</h3>
            )}

            {popupData.message && (
              <p className="text-lg mb-6 opacity-90">{popupData.message}</p>
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
