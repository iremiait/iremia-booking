import React from 'react';

const Apartment = () => {
  const features = [
    {
      icon: '🌲',
      title: 'Internet Detox',
      description: 'Niente WiFi per una vera pausa digitale. Riscopri il piacere della disconnessione'
    },
    {
      icon: '🍳',
      title: 'Cucina Attrezzata',
      description: 'Tutto il necessario per preparare i tuoi pasti in autonomia'
    },
    {
      icon: '🌅',
      title: 'Balcone Privato',
      description: 'Vista sul tranquillo giardino condominiale interno'
    },
    {
      icon: '🤫',
      title: 'Zona Silenziosa',
      description: 'Tranquillità garantita per un riposo rigenerante'
    },
    {
      icon: '🚗',
      title: 'Parcheggio Comodo',
      description: 'Parcheggio gratuito + garage privato disponibile su richiesta'
    },
    {
      icon: '🛏️',
      title: 'Tutto Incluso',
      description: 'Lenzuola, asciugamani e tutto il necessario per il tuo comfort'
    }
  ];

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
          L'Appartamento
        </h3>
        <div className="leading-relaxed space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
          <p>
            L'appartamento di 55 m² si trova al primo piano di una palazzina di due piani e offre tutto il comfort per un soggiorno rigenerante.
          </p>
          <p>
            Gli spazi includono un ampio soggiorno con cucinotto, una camera matrimoniale, un bagno completo e un balcone con vista sul tranquillo giardino condominiale interno.
          </p>
          <p>
            Vi forniamo tutto il necessario per il vostro soggiorno, così non dovrete "traslocare" quando verrete a trovarci. Possiamo ospitare al massimo 3 persone: due nella camera matrimoniale e uno nel divano letto in soggiorno.
          </p>
          <p className="text-sm italic" style={{ color: 'var(--color-primary)' }}>
            I bimbi sotto i due anni non pagano e possono dormire nel lettone con i genitori. Su richiesta possiamo fornire un lettino (dovrete portare lenzuoline e cuscini).
          </p>
        </div>
      </div>

      {/* Servizi */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-light mb-8 text-center" style={{ color: 'var(--color-text-primary)' }}>
          Cosa troverai
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
