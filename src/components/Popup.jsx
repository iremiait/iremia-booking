import React, { useState, useEffect } from 'react';
import { popupService } from '../lib/supabase';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const checkPopup = async () => {
      const lastShown = localStorage.getItem('iremia_popup_last_shown');
      if (lastShown) {
        const daysSinceShown = Math.floor((Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24));
        const popup = await popupService.getActivePopup();
        
        if (!popup || daysSinceShown < (popup.show_frequency_days || 7)) {
          return;
        }
      }

      const popup = await popupService.getActivePopup();
      
      if (!popup) return;

      const now = new Date();
      if (popup.start_date && new Date(popup.start_date) > now) return;
      if (popup.end_date && new Date(popup.end_date) < now) return;

      setTimeout(() => {
        setPopupData(popup);
        setIsVisible(true);
        popupService.incrementViews(popup.id);
        localStorage.setItem('iremia_popup_last_shown', Date.now().toString());
      }, (popup.delay_seconds || 3) * 1000);
    };

    checkPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    if (popupData?.id) {
      popupService.incrementClicks(popupData.id);
    }
    if (popupData?.button_link) {
      window.open(popupData.button_link, '_blank');
    }
    handleClose();
  };

  if (!isVisible || !popupData) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slideUp"
          style={{ backgroundColor: popupData.bg_color || '#1B7B7E' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light transition-colors z-10"
            style={{ color: popupData.text_color || '#FFFFFF' }}
          >
            ×
          </button>

          <div className="text-center" style={{ color: popupData.text_color || '#FFFFFF' }}>
            {popupData.image_url && (
              <div className="mb-6">
                <img 
                  src={popupData.image_url} 
                  alt={popupData.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <h3 className="text-3xl font-light mb-4">
              {popupData.title}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {popupData.message}
            </p>
            
            {popupData.button_text && (
              <button
                onClick={handleClick}
                className="bg-white text-teal-700 px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                {popupData.button_text}
              </button>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default Popup;
