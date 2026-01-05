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

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await contentService.getActiveFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Errore caricamento FAQ:', error);
    }
    setLoading(false);
  };

  const getCategoryIcon = (categoryValue) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.icon : '❓';
  };

  const getCategoryLabel = (categoryValue) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.label : 'Altro';
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Raggruppa FAQ per categoria
  const faqsByCategory = categories.map(cat => ({
    ...cat,
    faqs: faqs.filter(f => f.category === cat.value)
  })).filter(cat => cat.faqs.length > 0);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faqs" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Domande Frequenti
          </h2>
          <p className="text-xl text-gray-600">
            Tutto quello che devi sapere per il tuo soggiorno
          </p>
        </div>

        {/* FAQ per Categoria */}
        <div className="space-y-8">
          {faqsByCategory.map((category, catIndex) => (
            <div key={category.value}>
              {/* Titolo Categoria */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl font-medium text-gray-900">
                  {category.label}
                </h3>
              </div>

              {/* FAQ della categoria */}
              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${catIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                    >
                      {/* Domanda - Clickable */}
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={20} className="text-teal-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {/* Risposta - Espandibile */}
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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

        {/* CTA Finale */}
        <div className="mt-12 text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-700 mb-4">
            Non hai trovato la risposta che cercavi?
          </p>
          <a
            href="#contatti"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition shadow-md font-medium"
          >
            Contattaci
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
