import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const AboutManager = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    highlights: [],
    cta_text: '',
    cta_link: ''
  });

  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    setLoading(true);
    try {
      const data = await contentService.getAbout();
      if (data) {
        setAboutData(data);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          image_url: data.image_url || '',
          highlights: data.highlights || [],
          cta_text: data.cta_text || '',
          cta_link: data.cta_link || ''
        });
      }
    } catch (error) {
      console.error('Errore caricamento About:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (aboutData) {
        await contentService.updateAbout(aboutData.id, formData);
      } else {
        await contentService.createAbout(formData);
      }
      await loadAbout();
      alert('✅ Sezione "Chi Siamo" salvata con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
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
          Gestione Sezione "Chi Siamo"
        </h3>
        <p className="text-sm text-gray-600">
          Personalizza la sezione About con la vostra storia
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Es: Chi Siamo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sottotitolo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Es: La nostra storia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-40"
                placeholder="Raccontate la vostra storia..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length} caratteri
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon size={16} className="inline mr-1" />
                URL Immagine
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://..."
              />
              {formData.image_url && (
                <div className="mt-4">
                  <img
                    src={formData.image_url}
                    alt="Anteprima"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Punti Chiave (opzionale)
              </label>
              
              {formData.highlights.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-gray-700">{highlight}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Aggiungi un punto chiave..."
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testo Pulsante CTA
                </label>
                <input
                  type="text"
                  value={formData.cta_text}
                  onChange={(e) => updateField('cta_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Es: Contattaci"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Pulsante CTA
                </label>
                <input
                  type="url"
                  value={formData.cta_link}
                  onChange={(e) => updateField('cta_link', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {showPreview ? 'Nascondi' : 'Mostra'} Anteprima
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvataggio...
              </>
            ) : (
              <>
                <Save size={18} />
                Salva Modifiche
              </>
            )}
          </button>
        </div>

        {showPreview && (
          <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-xl p-8 border border-gray-200">
            <p className="text-sm text-gray-600 mb-6 text-center">Anteprima Live</p>
            
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                {formData.title || 'Titolo'}
              </h2>
              {formData.subtitle && (
                <p className="text-xl text-gray-600">{formData.subtitle}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {formData.image_url && (
                <div>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  />
                </div>
              )}

              <div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                  {formData.description || 'Descrizione...'}
                </p>

                {formData.highlights.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 pt-1">{highlight}</p>
                      </div>
                    ))}
                  </div>
                )}

                {formData.cta_text && formData.cta_link && (
                  <a
                    href={formData.cta_link}
                    className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition shadow-md"
                  >
                    {formData.cta_text}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AboutManager;
