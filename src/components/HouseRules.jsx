import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const formatTime = (time) => {
  if (!time) return '';
  return time.slice(0, 5); // "16:00:00" → "16:00"
};

const HouseRules = () => {
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouseRules();
  }, []);

  const loadHouseRules = async () => {
    setLoading(true);
    try {
      const data = await contentService.getHouseRules();
      setRulesData(data);
    } catch (error) {
      console.error('Errore caricamento regole:', error);
    }
    setLoading(false);
  };

  const title = rulesData?.title || 'Regole della Casa';
  const checkinStart = formatTime(rulesData?.checkin_start) || '16:00';
  const checkinEnd = formatTime(rulesData?.checkin_end) || '21:00';
  const checkoutTime = formatTime(rulesData?.checkout_time) || '11:00';
  const rules = rulesData?.rules || [
    { icon: '🚭', title: 'Vietato fumare', description: 'È vietato fumare all\'interno dell\'appartamento' },
    { icon: '🐾', title: 'Animali non ammessi', description: 'Spiacenti, non possiamo accettare animali domestici' },
    { icon: '🎉', title: 'Feste ed eventi', description: 'Non sono permesse feste o eventi' },
    { icon: '🤫', title: 'Silenzio notturno', description: 'Rispetto della quiete dopo le 23:00' },
    { icon: '♻️', title: 'Gestione rifiuti', description: 'Da gestire personalmente secondo le indicazioni fornite' }
  ];
  const showAirbnb = rulesData?.show_airbnb_section !== false;
  const airbnbText = rulesData?.airbnb_text || 'Preferisci prenotare tramite Airbnb?';
  const airbnbLink = rulesData?.airbnb_link || 'https://airbnb.it/h/iremia';
  const airbnbButtonText = rulesData?.airbnb_button_text || 'Prenota su Airbnb';

  if (loading) {
    return (
      <div className="mt-16 rounded-lg shadow-sm p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-16 rounded-lg shadow-sm p-8 max-w-4xl mx-auto"
      style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}
    >
      <h3 className="text-2xl font-light mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-in / Check-out */}
        <div className="flex items-start gap-3">
          <div className="text-2xl">🕐</div>
          <div>
            <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Check-in / Check-out</h4>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Check-in: {checkinStart} - {checkinEnd}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Check-out: entro le {checkoutTime}</p>
          </div>
        </div>

        {/* Regole dinamiche */}
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-2xl">{rule.icon}</div>
            <div>
              <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{rule.title}</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pulsante Airbnb */}
      {showAirbnb && (
        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid var(--color-primary-100)' }}>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{airbnbText}</p>
          <a
            href={airbnbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: '#FF5A5F' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
              <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
            </svg>
            {airbnbButtonText}
          </a>
        </div>
      )}
    </div>
  );
};

export default HouseRules;
