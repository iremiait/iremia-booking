import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await contentService.getAbout();
      setAboutData(data);
    } catch (error) {
      console.error('Errore caricamento sezione About:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titolo Sezione */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {aboutData.title}
          </h2>
          {aboutData.subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutData.subtitle}
            </p>
          )}
        </div>

        {/* Contenuto */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Immagine */}
          {aboutData.image_url && (
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutData.image_url}
                  alt={aboutData.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Testo */}
          <div className="order-1 md:order-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {aboutData.description}
              </p>
            </div>

            {/* Highlights opzionali */}
            {aboutData.highlights && aboutData.highlights.length > 0 && (
              <div className="mt-8 space-y-4">
                {aboutData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 pt-1">{highlight}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA opzionale */}
            {aboutData.cta_text && aboutData.cta_link && (
              <div className="mt-8">
                
                  href={aboutData.cta_link}
                  className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition shadow-md"
                >
                  {aboutData.cta_text}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
