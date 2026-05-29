import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAbout(); }, []);

  const loadAbout = async () => {
    try {
      const data = await contentService.getAbout();
      setAboutData(data);
    } catch (error) {
      console.error('Errore caricamento sezione About:', error);
    }
    setLoading(false);
  };

  if (loading) return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </section>
  );

  if (!aboutData) return null;

  return (
    <section id="about" className="py-20" style={{ background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-bg-secondary), var(--color-primary-50))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'var(--color-text-primary)' }}>
            {aboutData.title}
          </h2>
          {aboutData.subtitle && (
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {aboutData.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {aboutData.image_url && (
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={aboutData.image_url} alt={aboutData.title} className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          <div className="order-1 md:order-2">
            <p className="leading-relaxed whitespace-pre-wrap text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {aboutData.description}
            </p>

            {aboutData.highlights && aboutData.highlights.length > 0 && (
              <div className="mt-8 space-y-4">
                {aboutData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-100)' }}>
                      <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{index + 1}</span>
                    </div>
                    <p className="pt-1" style={{ color: 'var(--color-text-secondary)' }}>{highlight}</p>
                  </div>
                ))}
              </div>
            )}

            {aboutData.cta_text && aboutData.cta_link && (
              <div className="mt-8">
                <a
                  href={aboutData.cta_link}
                  className="inline-block text-white px-8 py-3 rounded-lg transition-all shadow-md hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
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
