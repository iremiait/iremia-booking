import React from 'react';

const Apartment = () => {
  return (
    <>
      {/* L'Appartamento - Dettaglio */}
      <div id="appartamento" className="mt-20 bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
        <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
          L'Appartamento
        </h3>
        <div className="text-gray-600 leading-relaxed space-y-4">
          <p>
            L'appartamento di 55 m² si trova al primo piano di una palazzina di due piani e offre tutto il comfort per un soggiorno rigenerante.
          </p>
          <p>
            Gli spazi includono un ampio soggiorno con cucinotto, una camera matrimoniale, un bagno completo e un balcone con vista sul tranquillo giardino condominiale interno.
          </p>
          <p>
            Vi forniamo tutto il necessario per il vostro soggiorno, così non dovrete "traslocare" quando verrete a trovarci. Possiamo ospitare al massimo 3 persone: due nella camera matrimoniale e uno nel divano letto in soggiorno.
          </p>
          <p className="text-sm italic text-teal-700">
            I bimbi sotto i due anni non pagano e possono dormire nel lettone con i genitori. Su richiesta possiamo fornire un lettino (dovrete portare lenzuoline e cuscini).
          </p>
        </div>
      </div>

      {/* Servizi */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-light text-gray-800 mb-8 text-center">
          Cosa troverai
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internet Detox */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🌲</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Internet Detox</h4>
                <p className="text-gray-600 text-sm">
                  Niente WiFi per una vera pausa digitale. Riscopri il piacere della disconnessione
                </p>
              </div>
            </div>
          </div>
          {/* Cucina */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🍳</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cucina Attrezzata</h4>
                <p className="text-gray-600 text-sm">
                  Tutto il necessario per preparare i tuoi pasti in autonomia
                </p>
              </div>
            </div>
          </div>
          {/* Balcone */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🌅</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Balcone Privato</h4>
                <p className="text-gray-600 text-sm">
                  Vista sul tranquillo giardino condominiale interno
                </p>
              </div>
            </div>
          </div>
          {/* Zona Silenziosa */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤫</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Zona Silenziosa</h4>
                <p className="text-gray-600 text-sm">
                  Tranquillità garantita per un riposo rigenerante
                </p>
              </div>
            </div>
          </div>
          {/* Parcheggio */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚗</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Parcheggio Comodo</h4>
                <p className="text-gray-600 text-sm">
                  Parcheggio gratuito + garage privato disponibile su richiesta
                </p>
              </div>
            </div>
          </div>
          {/* Biancheria fornita */}
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🛏️</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tutto Incluso</h4>
                <p className="text-gray-600 text-sm">
                  Lenzuola, asciugamani e tutto il necessario per il tuo comfort
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apartment;
