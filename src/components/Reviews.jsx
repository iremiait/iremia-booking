import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const Reviews = ({ reviews, loading }) => {
  const [zoneData, setZoneData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [zoneLoading, setZoneLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [zone, contact] = await Promise.all([
        contentService.getZone(),
        contentService.getContactInfo(),
      ]);
      setZoneData(zone);
      setContactData(contact);
    } catch (error) {
      console.error('Errore caricamento dati zona:', error);
    }
    setZoneLoading(false);
  };

  const zoneTitle = zoneData?.title || 'La Zona';
  const zoneDescription = zoneData?.description || "Lama Mocogno è un piccolo paese dell'Appennino Modenese a 850 m s.l.m., ideale per sfuggire al caldo della pianura nei periodi estivi e per passare qualche giornata sulla neve d'inverno.";
  const zoneCards = zoneData?.cards || [
    { icon: '⛷️', title: 'Piste da Sci', desc: "Vicinissimi alle Piane di Mocogno e a 30' dal comprensorio del Cimone" },
    { icon: '🥾', title: 'Via Vandelli', desc: 'Sulla storica Via Vandelli del 1738, da Modena a Massa' },
    { icon: '🏔️', title: 'Frignano', desc: 'Nel cuore del territorio del Frignano, tra natura e tradizione' },
  ];
  const ctaText = zoneData?.cta_text || 'Prenota il tuo soggiorno';
  const ctaWhatsappMessage = zoneData?.cta_whatsapp_message || 'Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia';
  const whatsappNumber = contactData?.whatsapp_number || '393474160611';
  const googleReviewsLink = zoneData?.google_reviews_link || 'https://maps.app.goo.gl/oZV9f4zYBXhmq1fr9';
  const googleReviewsText = zoneData?.google_reviews_text || 'Vedi tutte le recensioni su Google';

  return (
    <>
      {/* Recensioni */}
      <div className="mt-20 max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-light mb-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
          Cosa dicono i nostri ospiti
        </h3>
        <p className="text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Le recensioni dei nostri ospiti su Google
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
            ></div>
            <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>Caricamento recensioni...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-muted)' }}>Nessuna recensione disponibile al momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg shadow-sm p-6"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-primary-100)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{review.time_ago}</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  "{review.review_text}"
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {review.author_initials}
                  </div>
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{review.author_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Link Google Business */}
        <div className="mt-8 text-center">
          
            href={googleReviewsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-75"
            style={{ color: 'var(--color-primary)' }}
          >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {googleReviewsText}
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        
          href={`https://wa.me/${whatsappNumber}?text=${ctaWhatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: 'var(--color-primary)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
        >
          {ctaText}
        </a>
        <p className="text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
          Sempre a vostra disposizione
        </p>
      </div>

      {/* La Zona */}
      {zoneLoading ? (
        <div className="mt-20 max-w-4xl mx-auto px-4 text-center py-12">
          <div
            className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          ></div>
        </div>
      ) : (
        <div
          id="zona"
          className="mt-20 rounded-lg shadow-sm p-8 max-w-4xl mx-auto"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-50))',
            border: '1px solid var(--color-primary-100)',
          }}
        >
          <h3 className="text-3xl font-light mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
            {zoneTitle}
          </h3>
          <div className="leading-relaxed space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
            <p>{zoneDescription}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {zoneCards.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.desc || item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
