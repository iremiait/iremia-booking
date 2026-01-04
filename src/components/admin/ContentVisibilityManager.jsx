import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ContentVisibilityManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await contentService.getSectionVisibility();
      setSections(data);
    } catch (error) {
      console.error('Errore caricamento sezioni:', error);
      alert('Errore nel caricamento delle sezioni');
    }
    setLoading(false);
  };

  const toggleVisibility = async (sectionName, currentStatus) => {
    try {
      await contentService.updateSectionVisibility(sectionName, !currentStatus);
      await loadSections();
      alert(`✅ Sezione ${!currentStatus ? 'attivata' : 'disattivata'} con successo!`);
    } catch (error) {
      console.error('Errore toggle visibilità:', error);
      alert('❌ Errore nel cambio visibilità');
    }
  };

  const getSectionIcon = (sectionName) => {
    const icons = {
      'about': '👥',
      'activities': '🎯',
      'restaurants': '🍽️',
      'poi': '📍',
      'faqs': '❓'
    };
    return icons[sectionName] || '📄';
  };

  const getSectionDescription = (sectionName) => {
    const descriptions = {
      'about': 'Mostra la sezione "Chi Siamo" con la storia di Andrea e Iza',
      'activities': 'Mostra attività stagionali e cosa fare nella zona',
      'restaurants': 'Mostra ristoranti e locali consigliati',
      'poi': 'Mostra punti di interesse e luoghi da visitare',
      'faqs': 'Mostra le domande frequenti'
    };
    return descriptions[sectionName] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-light text-gray-900 mb-2">
          Visibilità Sezioni
        </h3>
        <p className="text-sm text-gray-600">
          Attiva/disattiva le sezioni del sito. Le sezioni disattivate non verranno mostrate ai visitatori.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        {sections.map((section) => (
          <div
            key={section.id}
            className="p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">
                  {getSectionIcon(section.section_name)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {section.section_title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getSectionDescription(section.section_name)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  section.is_visible 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.is_visible ? 'Visibile' : 'Nascosta'}
                </span>

                <button
                  onClick={() => toggleVisibility(section.section_name, section.is_visible)}
                  className={`p-3 rounded-lg transition flex items-center gap-2 ${
                    section.is_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={section.is_visible ? 'Nascondi sezione' : 'Mostra sezione'}
                >
                  {section.is_visible ? (
                    <>
                      <Eye size={20} />
                      <span className="text-sm font-medium">Nascondi</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={20} />
                      <span className="text-sm font-medium">Mostra</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Come funziona?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Le sezioni nascoste non appariranno sul sito</li>
              <li>• I contenuti rimangono salvati nel database</li>
              <li>• Puoi riattivarle in qualsiasi momento</li>
              <li>• Utile per sezioni in fase di completamento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentVisibilityManager;
