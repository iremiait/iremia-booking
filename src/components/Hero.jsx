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

  const defaultHeroData = {
    main_title: 'Il tuo rifugio di pace',
    subtitle: 'a Lama Mocogno',
    etymology_word: 'Iremía',
    etymology_greek: 'ηρεμία',
    etymology_translation: 'calma · serenità · tranquillità',
    welcome_paragraph_1: 'Immersa tra i boschi dell\'Appennino modenese, a 850 metri di altitudine, Iremia è la tua casetta di montagna dove ritrovare tranquillità e connessione con la natura.',
    welcome_paragraph_2: 'Perfetta per coppie o piccole famiglie, offre tutto ciò che serve per un soggiorno autentico: spazi accoglienti, una vista meravigliosa e la pace che solo la montagna sa regalare.',
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
      <section className="relative h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent)' }}></div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: 'center' }}
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
        <p className="text-xl md:text-2xl mb-6" style={{ color: 'var(--color-accent-light)' }}>
          {data.subtitle}
        </p>

        {/* Etymology Section */}
        <div className="mb-12 backdrop-blur-sm rounded-lg p-6 inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--color-accent-light)' }}>Dal greco antico</p>
          <p className="text-3xl font-serif italic mb-1" style={{ color: 'var(--color-accent-light)' }}>
            {data.etymology_word} — {data.etymology_greek}
          </p>
          <p style={{ color: 'var(--color-accent-light)' }}>{data.etymology_translation}</p>
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
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-12">
            {data.info_cards.map((card, index) => (
              <div
                key={index}
                className="rounded-lg p-4 text-white hover:scale-105 transition-all w-32"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-sm mb-1" style={{ color: 'var(--color-accent-light)' }}>{card.label}</div>
                <div className="text-xl font-bold">{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <a
          href="#contatti"
          className="inline-block font-bold py-3 px-8 rounded-lg transition-all hover:scale-105 hover:shadow-lg text-white"
          style={{ backgroundColor: 'var(--color-accent)' }}
          onMouseEnter={e => e.target.style.backgroundColor = 'var(--color-accent-dark)'}
          onMouseLeave={e => e.target.style.backgroundColor = 'var(--color-accent)'}
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
