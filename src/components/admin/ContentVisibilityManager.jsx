import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ContentVisibilityManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await contentService.getSectionVisibility();
      // Ordina per order_position
      const sorted = data.sort((a, b) => (a.order_position || 0) - (b.order_position || 0));
      setSections(sorted);
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

  // Drag & Drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedItem = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedItem);

    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    
    // Salva il nuovo ordine nel database
    try {
      // Aggiorna order_position per ogni sezione
      const updates = sections.map((section, index) => 
        contentService.updateSectionVisibility(section.section_name, section.is_visible, index)
      );
      
      await Promise.all(updates);
      alert('✅ Ordine salvato con successo!');
      await loadSections();
    } catch (error) {
      console.error('Errore salvataggio ordine:', error);
      alert('❌ Errore nel salvataggio dell\'ordine');
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
          Visibilità & Ordine Sezioni
        </h3>
        <p className="text-sm text-gray-600">
          Attiva/disattiva le sezioni del sito e trascinale per riordinarle. Le sezioni disattivate non verranno mostrate ai visitatori.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Come riordinare le sezioni
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Trascina le sezioni usando l'icona <GripVertical size={14} className="inline" /></li>
              <li>• L'ordine viene salvato automaticamente quando rilasci</li>
              <li>• Le sezioni appaiono nell'homepage nell'ordine qui mostrato</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-6 transition cursor-move ${
              draggedIndex === index 
                ? 'bg-teal-50 border-2 border-teal-500' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Drag Handle + Content */}
              <div className="flex items-center gap-4 flex-1">
                {/* Drag Handle */}
                <div className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                  <GripVertical size={24} />
                </div>

                {/* Order Number */}
                <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-4xl">
                  {getSectionIcon(section.section_name)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {section.section_title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getSectionDescription(section.section_name)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 ml-4">
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
                      <span className="text-sm font-medium hidden sm:inline">Nascondi</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={20} />
                      <span className="text-sm font-medium hidden sm:inline">Mostra</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-amber-600 text-xl">⚠️</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-900 mb-1">
              Importante
            </h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Le sezioni nascoste non appariranno sul sito pubblico</li>
              <li>• I contenuti rimangono salvati nel database</li>
              <li>• Puoi riattivarle in qualsiasi momento</li>
              <li>• L'ordine influenza la posizione nell'homepage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentVisibilityManager;
