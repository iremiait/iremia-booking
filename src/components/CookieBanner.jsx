import React, { useState, useEffect } from 'react';

const COOKIE_KEY = 'iremia_cookie_consent';

export const loadGoogleAnalytics = () => {
  if (window._gaLoaded) return;
  window._gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FWPSY658GR';
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-FWPSY658GR', { anonymize_ip: true });
  };
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Piccolo delay per non sparare il banner appena aperta la pagina
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    if (consent === 'accepted') {
      loadGoogleAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    loadGoogleAnalytics();
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay leggero su mobile */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }}
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        style={{ animation: 'slideUpBanner 0.4s ease-out' }}
      >
        <div
          className="max-w-4xl mx-auto rounded-2xl shadow-2xl p-5 sm:p-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-primary-100)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Testo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🍪</span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Questo sito utilizza i cookie
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Utilizziamo Google Analytics per analizzare il traffico e migliorare l'esperienza sul sito.
                I dati sono anonimi e non vengono condivisi con terze parti.{' '}
                <a
                  href="/cookie"
                  className="underline hover:opacity-75 transition"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Cookie policy
                </a>
                {' · '}
                <a
                  href="/privacy"
                  className="underline hover:opacity-75 transition"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Privacy policy
                </a>
              </p>
            </div>

            {/* Bottoni */}
            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all border"
                style={{
                  borderColor: 'var(--color-primary-100)',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Solo necessari
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
              >
                Accetta tutti
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBanner {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CookieBanner;
