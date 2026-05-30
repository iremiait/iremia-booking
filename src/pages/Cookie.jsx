import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const COOKIE_KEY = 'iremia_cookie_consent';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
      {title}
    </h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
      {children}
    </div>
  </div>
);

const Cookie = () => {
  const lastUpdate = '30 maggio 2026';
  const [currentConsent, setCurrentConsent] = useState(
    localStorage.getItem(COOKIE_KEY) || 'non impostato'
  );
  const [saved, setSaved] = useState(false);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setCurrentConsent('accepted');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (!window._gaLoaded) {
      import('../components/CookieBanner').then(m => m.loadGoogleAnalytics?.());
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setCurrentConsent('rejected');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    localStorage.removeItem(COOKIE_KEY);
    setCurrentConsent('non impostato');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const consentLabel = {
    accepted: { text: 'Accettati', color: '#16a34a' },
    rejected: { text: 'Rifiutati (solo necessari)', color: '#dc2626' },
    'non impostato': { text: 'Non ancora impostato', color: '#9ca3af' },
  }[currentConsent] || { text: currentConsent, color: '#9ca3af' };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, var(--color-primary-100), var(--color-primary-50))' }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-75"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={18} />
            Torna al sito
          </a>
          <span style={{ color: 'var(--color-primary-100)' }}>|</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Cookie Policy
          </span>
        </div>
      </header>

      {/* Contenuto */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="rounded-2xl shadow-sm p-8 sm:p-12"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}
        >
          {/* Titolo */}
          <div className="mb-10 pb-6" style={{ borderBottom: '1px solid var(--color-primary-100)' }}>
            <h1 className="text-3xl font-light mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Cookie Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Ultimo aggiornamento: {lastUpdate}
            </p>
          </div>

          <Section title="1. Cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo che i siti web salvano nel browser dell'utente durante
              la navigazione. Vengono utilizzati per far funzionare i siti in modo efficiente e per
              fornire informazioni ai proprietari del sito.
            </p>
          </Section>

          <Section title="2. Cookie utilizzati da questo sito">
            <p>Il sito <strong>iremia.it</strong> utilizza le seguenti tipologie di cookie:</p>

            {/* Tabella cookie tecnici */}
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-primary-100)' }}>
              <div
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
              >
                Cookie tecnici — necessari (sempre attivi)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Nome</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Finalità</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: '1px solid var(--color-primary-100)' }}>
                      <td className="px-4 py-3 font-mono" style={{ color: 'var(--color-text-primary)' }}>iremia_cookie_consent</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                        Memorizza la scelta dell'utente riguardo ai cookie (accettati/rifiutati)
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>Persistente (localStorage)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabella cookie analitici */}
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-primary-100)' }}>
              <div
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
              >
                Cookie analitici — solo con consenso
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Nome</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Finalità</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Durata</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Gestore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '_ga', desc: 'Identifica gli utenti univoci per Analytics', duration: '2 anni' },
                      { name: '_ga_*', desc: 'Mantiene lo stato della sessione Analytics', duration: '2 anni' },
                      { name: '_gid', desc: 'Identifica gli utenti nelle 24 ore', duration: '24 ore' },
                      { name: '_gat', desc: 'Limita la frequenza delle richieste', duration: '1 minuto' },
                    ].map((c, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-primary-100)' }}>
                        <td className="px-4 py-3 font-mono" style={{ color: 'var(--color-text-primary)' }}>{c.name}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{c.desc}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>{c.duration}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>Google LLC</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-3">
              I cookie analitici di Google vengono attivati <strong>solo dopo il consenso esplicito</strong> dell'utente.
              L'indirizzo IP viene anonimizzato prima di qualsiasi elaborazione.
              Per maggiori informazioni:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)' }}
              >
                Google Privacy Policy
              </a>.
            </p>
          </Section>

          <Section title="3. Cookie di terze parti">
            <p>
              Il sito include link a servizi esterni (WhatsApp, Airbnb, Google Maps) che potrebbero
              impostare propri cookie quando l'utente clicca su tali link ed accede ai rispettivi siti.
              Questi cookie sono gestiti direttamente dalle terze parti e sono soggetti alle loro
              rispettive privacy policy. Il sito iremia.it non ha controllo su tali cookie.
            </p>
          </Section>

          <Section title="4. Come gestire i cookie">
            <p>
              Puoi gestire le tue preferenze sui cookie in qualsiasi momento tramite il pannello
              qui sotto, oppure modificando le impostazioni del tuo browser.
            </p>
            <p>
              Tieni presente che disabilitare i cookie tecnici potrebbe compromettere il corretto
              funzionamento del sito.
            </p>
            <div className="mt-2 space-y-1">
              {[
                { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                { name: 'Firefox', url: 'https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox' },
                { name: 'Safari', url: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac' },
                { name: 'Edge', url: 'https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
              ].map(b => (
                <span key={b.name} className="inline-block mr-4">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                    Impostazioni {b.name}
                  </a>
                </span>
              ))}
            </div>
          </Section>

          {/* Pannello gestione consenso */}
          <div
            className="rounded-xl p-6 mt-2"
            style={{ backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              🎛️ Gestisci il tuo consenso
            </h2>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Stato attuale:
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: consentLabel.color + '20', color: consentLabel.color }}
              >
                {consentLabel.text}
              </span>
            </div>

            {saved && (
              <div
                className="mb-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#16a34a20', color: '#16a34a' }}
              >
                ✅ Preferenza salvata con successo
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
              >
                Accetta tutti i cookie
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all border"
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'white',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                Solo cookie necessari
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <RotateCcw size={14} />
                Reimposta
              </button>
            </div>
          </div>

          <Section title="5. Modifiche alla Cookie Policy">
            <p>
              Il titolare si riserva il diritto di modificare la presente Cookie Policy in qualsiasi
              momento. Le modifiche saranno pubblicate su questa pagina con aggiornamento della data
              in cima al documento. Si consiglia di consultare periodicamente questa pagina.
            </p>
          </Section>

          {/* Footer documento */}
          <div
            className="mt-10 pt-6 text-xs"
            style={{ borderTop: '1px solid var(--color-primary-100)', color: 'var(--color-text-muted)' }}
          >
            <p>Titolare: Andrea Longo · iremiait@gmail.com · Lama Mocogno (MO)</p>
            <p className="mt-1">
              Per informazioni sul trattamento dei dati personali consulta la{' '}
              <a href="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cookie;
