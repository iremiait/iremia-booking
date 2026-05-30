import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const Apartment = () => {
  const [apartmentData, setApartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApartment();
  }, []);

  const loadApartment = async () => {
    try {
      const data = await contentService.getApartment();
      setApartmentData(data);
    } catch (error) {
      console.error('Errore caricamento appartamento:', error);
    }
    setLoading(false);
  };

  const defaultFeatures = [
    { icon: '🌲', title: 'Internet Detox', description: 'Niente WiFi per una vera pausa digitale. Riscopri il piacere della disconnessione' },
    { icon: '🍳', title: 'Cucina Attrezzata', description: 'Tutto il necessario per preparare i tuoi pasti in autonomia' },
    { icon: '🌅', title: 'Balcone Privato', description: 'Vista sul tranquillo giardino condominiale interno' },
    { icon: '🤫', title: 'Zona Silenziosa', description: 'Tranquillità garantita per un riposo rigenerante' },
    { icon: '🚗', title: 'Parcheggio Comodo', description: 'Parcheggio gratuito + garage privato disponibile su richiesta' },
    { icon: '🛏️', title: 'Tutto Incluso', description: 'Lenzuola, asciugamani e tutto il necessario per il tuo comfort' },
  ];

  const title = apartmentData?.title || "L'Appartamento";
  const description_1 = apartmentData?.description_1 || "L'appartamento di 55 m² si trova al primo piano di una palazzina di due piani e offre tutto il comfort per un soggiorno rigenerante.";
  const description_2 = apartmentData?.description_2 || 'Gli spazi includono un ampio soggiorno con cucinotto, una camera matrimoniale, un bagno completo e un balcone con vista sul tranquillo giardino condominiale interno.';
  const description_3 = apartmentData?.description_3 || 'Vi forniamo tutto il necessario per il vostro soggiorno, così non dovrete "traslocare" quando verrete a trovarci. Possiamo ospitare al massimo 3 persone: due nella camera matrimoniale e uno nel divano letto in soggiorno.';
  const note = apartmentData?.note || 'I bimbi sotto i due anni non pagano e possono dormire nel lettone con i genitori. Su richiesta possiamo fornire un lettino (dovrete portare lenzuoline e cuscini).';
  const featuresTitle = apartmentData?.features_title || 'Cosa troverai';
  const features = apartmentData?.features || defaultFeatures;

  if (loading) return (
    <div className="mt-20 max-w-4xl mx-auto px-4 text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
    </div>
  );

  return (
    <>
      {/* L'Appartamento */}
      <div
        id="appartamento"
        className="mt-20 rounded-lg shadow-sm p-8 max-w-4xl mx-auto"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-primary-100)',
        }}
      >
        <h3 className="text-3xl font-light mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="leading-relaxed space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
          <p>{description_1}</p>
          <p>{description_2}</p>
          <p>{description_3}</p>
          {note && (
            <p className="text-sm italic" style={{ color: 'var(--color-primary)' }}>
              {note}
            </p>
          )}
        </div>
      </div>

      {/* Servizi */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-light mb-8 text-center" style={{ color: 'var(--color-text-primary)' }}>
          {featuresTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg shadow-sm p-6"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {feature.title}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Apartment;
