import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const Hero = ({ heroImage }) => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await contentService.getHeroSection();
        setHeroData(data);
      } catch (error) {
        console.error('Errore caricamento hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Fallback hardcoded se non c'è dato dal DB
  const defaultHeroData = {
    main_title: 'Il tuo rifugio di pace',
    subtitle: 'a Lama Mocogno',
    etymology_word: 'Iremía',
    etymology_greek: 'ηρεμία',
    etymology_translation: 'calma · serenità · tranquillità',
    welcome_paragraph_1:
      'Immersa tra i boschi dell\'Appennino modenese, a 850 metri di altitudine, Iremia è la tua casetta di montagna dove ritrovare tranquillità e connessione con la natura.',
    welcome_paragraph_2:
      'Perfetta per coppie o piccole famiglie, offre tutto ciò che serve per un soggiorno autentico: spazi accoglienti, una vista meravigliosa e la pace che solo la montagna sa regalare.',
    info_cards: [
      { icon: '🏠', value: '55 m²', label: 'Appartamento' },
      { icon: '🌲', value: '850 m', label: 'Altitudine' },
      { icon: '👥', value: '2-4', label: 'Ospiti' },
      { icon: '🛏️', value: 'Confortevole', label: 'Riposo' }
    ]
  };

  const data = heroData || defaultHeroData;

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImage}')`,
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center text-white">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-2 leading-tight">
          {data.main_title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-amber-100 mb-6">{data.subtitle}</p>

        {/* Etymology Section */}
        <div className="mb-12 bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
          <p className="text-sm text-amber-100 mb-1">Dal greco antico</p>
          <p className="text-3xl font-serif italic text-amber-50 mb-1">
            {data.etymology_word} — {data.etymology_greek}
          </p>
          <p className="text-amber-100">{data.etymology_translation}</p>
        </div>

        {/* Welcome Paragraphs */}
        <div className="mb-12 space-y-4">
          <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            {data.welcome_paragraph_1}
          </p>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            {data.welcome_paragraph_2}
          </p>
        </div>

        {/* Info Cards */}
        {data.info_cards && data.info_cards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {data.info_cards.map((card, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-white hover:bg-white/25 transition-all"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-sm text-amber-100 mb-1">{card.label}</div>
                <div className="text-xl font-bold">{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <a
          href="#contatti"
          className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Scopri di più
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce text-white text-2xl">↓</div>
      </div>
    </section>
  );
};

export default Hero;
