import React from 'react';

const Hero = ({ heroImage }) => {
  return (
    <div className="relative -mt-16 pt-16">
      {/* Background Image */}
      <div className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h2 className="text-6xl md:text-7xl font-light text-white mb-6 drop-shadow-2xl">
              Il tuo rifugio di pace
            </h2>
            <p className="text-2xl md:text-3xl text-white/90 mb-8">
              a Lama Mocogno
            </p>
            <div className="inline-block bg-white/95 backdrop-blur border-l-4 border-teal-600 p-6 rounded-lg shadow-2xl">
              <p className="text-xl text-gray-700 italic">
                <span className="font-semibold text-teal-700">Iremía</span> (ηρεμία)
              </p>
              <p className="text-gray-600 mt-2">
                calma · serenità · tranquillità
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box - Sotto l'immagine */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 max-w-3xl mx-auto border border-teal-100">
          <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
            Benvenuti a Iremia
          </h3>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Iremia è una locazione turistica a Lama Mocogno gestita a livello familiare da Andrea e Iza.
            </p>
            <p>
              Il nostro è un piccolo paese dell'appennino modenese a 850 m s.l.m., ideale per sfuggire al caldo della pianura nei periodi estivi e per passare qualche giornata sulla neve d'inverno.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-teal-200">
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">🏠</div>
                <div className="font-semibold text-gray-800">55 m²</div>
                <div className="text-sm text-gray-500">Appartamento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">👥</div>
                <div className="font-semibold text-gray-800">Max 3 persone</div>
                <div className="text-sm text-gray-500">Ospiti</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">⛰️</div>
                <div className="font-semibold text-gray-800">850 m</div>
                <div className="text-sm text-gray-500">Sul livello del mare</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
