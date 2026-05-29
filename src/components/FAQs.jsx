import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { contentService } from '../lib/contentService';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { value: 'checkin', label: 'Check-in/Check-out', icon: '🔑' },
    { value: 'appartamento', label: 'Appartamento', icon: '🏠' },
    { value: 'parcheggio', label: 'Parcheggio', icon: '🚗' },
    { value: 'animali', label: 'Animali', icon: '🐾' },
    { value: 'zona', label: 'La Zona', icon: '🗺️' },
    { value: 'pagamenti', label: 'Pagamenti', icon: '💳' },
    { value: 'bambini', label: 'Bambini', icon: '👶' },
    { value: 'altro', label: 'Altro', icon: '❓' }
  ];

  useEffect(() => { loadFAQs(); }, []);

  const loadFAQs = async () => {
    try {
      const data = await contentService.getActiveFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Errore caricamento FAQ:', error);
    }
    setLoading(false);
  };

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const faqsByCategory = categories
    .map(cat => ({ ...cat, faqs: faqs.filter(f => f.category === cat.value) }))
    .filter(cat => cat.faqs.length > 0);

  if (loading) return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </section>
  );

  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Domande Frequenti
          </h2>
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
            Tutto quello che devi sapere per il tuo soggiorno
          </p>
        </div>

        <div className="space-y-8">
          {faqsByCategory.map((category, catIndex) => (
            <div key={category.value}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {category.label}
                </h3>
              </div>

              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${catIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div key={faq.id} className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition" style={{ border: '1px solid var(--color-primary-100)', backgroundColor: 'var(--color-bg-card)' }}>
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left transition"
                        style={{ backgroundColor: isOpen ? 'var(--color-primary-50)' : 'transparent' }}
                      >
                        <span className="font-medium pr-4" style={{ color: 'var(--color-text-primary)' }}>
                          {faq.question}
                        </span>
                        {isOpen
                          ? <ChevronUp size={20} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0" />
                          : <ChevronDown size={20} style={{ color: 'var(--color-text-muted)' }} className="flex-shrink-0" />
                        }
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4" style={{ backgroundColor: 'var(--color-primary-50)', borderTop: '1px solid var(--color-primary-100)' }}>
                          <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Non hai trovato la risposta che cercavi?
          </p>
          <a
            href="#contatti"
            className="inline-block text-white px-8 py-3 rounded-lg transition-all shadow-md font-medium hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          >
            Contattaci
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
