import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ApartmentManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description_1: '',
    description_2: '',
    description_3: '',
    note: '',
    features_title: '',
    features: [],
  });
  const [newFeature, setNewFeature] = useState({ icon: '', title: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await contentService.getApartment();
      if (result) {
        setData(result);
        setFormData({
          title: result.title || '',
          description_1: result.description_1 || '',
          description_2: result.description_2 || '',
          description_3: result.description_3 || '',
          note: result.note || '',
          features_title: result.features_title || '',
          features: result.features || [],
        });
      }
    } catch (error) {
      console.error('Errore caricamento appartamento:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contentService.updateApartment(data.id, formData);
      await loadData();
      alert('✅ Appartamento salvato con successo!');
    } catch (error) {
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (!newFeature.icon || !newFeature.title || !newFeature.description) {
      alert('Compila tutti i campi del servizio');
      return;
    }
    setFormData(prev => ({ ...prev, features: [...prev.features, { ...newFeature }] }));
    setNewFeature({ icon: '', title: '', description: '' });
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? { ...f, [field]: value } : f),
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-light text-gray-900 mb-2">Gestione Appartamento</h3>
        <p className="text-sm text-gray-600">Modifica testi e servizi della sezione appartamento</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Testi principali */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Testi Principali</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titolo Sezione</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="L'Appartamento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragrafo 1</label>
            <textarea
              value={formData.description_1}
              onChange={e => updateField('description_1', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragrafo 2</label>
            <textarea
              value={formData.description_2}
              onChange={e => updateField('description_2', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragrafo 3</label>
            <textarea
              value={formData.description_3}
              onChange={e => updateField('description_3', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nota in corsivo</label>
            <textarea
              value={formData.note}
              onChange={e => updateField('note', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-20"
              placeholder="Es: I bimbi sotto i due anni..."
            />
          </div>
        </div>

        {/* Servizi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Servizi</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titolo Sezione Servizi</label>
            <input
              type="text"
              value={formData.features_title}
              onChange={e => updateField('features_title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Cosa troverai"
            />
          </div>

          {/* Lista servizi esistenti */}
          {formData.features.length > 0 && (
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={feature.title}
                      onChange={e => updateFeature(index, 'title', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Titolo"
                    />
                    <input
                      type="text"
                      value={feature.description}
                      onChange={e => updateFeature(index, 'description', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Descrizione"
                    />
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={e => updateFeature(index, 'icon', e.target.value)}
                      className="w-24 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                      placeholder="Emoji"
                      maxLength="2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Aggiungi nuovo servizio */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi nuovo servizio</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                value={newFeature.icon}
                onChange={e => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                placeholder="Emoji"
                maxLength="2"
              />
              <input
                type="text"
                value={newFeature.title}
                onChange={e => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Titolo"
              />
              <input
                type="text"
                value={newFeature.description}
                onChange={e => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Descrizione"
              />
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Aggiungi Servizio
            </button>
          </div>
        </div>

        <div className="flex justify-end">
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
      </form>
    </div>
  );
};

export default ApartmentManager;
