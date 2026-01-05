import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const POIManager = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPOI, setEditingPOI] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'natura',
    location: '',
    distance: '',
    opening_hours: '',
    price: '',
    image_url: '',
    link: '',
    is_active: true
  });

  const types = [
    { value: 'natura', label: 'Natura', icon: '🌲' },
    { value: 'cultura', label: 'Cultura', icon: '🏛️' },
    { value: 'sport', label: 'Sport', icon: '⛷️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'benessere', label: 'Benessere', icon: '💆' },
    { value: 'altro', label: 'Altro', icon: '📍' }
  ];

  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    setLoading(true);
    try {
      const data = await contentService.getPOIs();
      setPois(data);
    } catch (error) {
      console.error('Errore caricamento POI:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const openModal = (poi = null) => {
    if (poi) {
      setEditingPOI(poi);
      setFormData({
        name: poi.name,
        description: poi.description || '',
        type: poi.type,
        location: poi.location || '',
        distance: poi.distance || '',
        opening_hours: poi.opening_hours || '',
        price: poi.price || '',
        image_url: poi.image_url || '',
        link: poi.link || '',
        is_active: poi.is_active
      });
    } else {
      setEditingPOI(null);
      setFormData({
        name: '',
        description: '',
        type: 'natura',
        location: '',
        distance: '',
        opening_hours: '',
        price: '',
        image_url: '',
        link: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPOI(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPOI) {
        await contentService.updatePOI(editingPOI.id, formData);
      } else {
        await contentService.createPOI(formData);
      }
      await loadPOIs();
      closeModal();
      alert('✅ Punto di interesse salvato con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo punto di interesse?')) return;

    try {
      await contentService.deletePOI(id);
      await loadPOIs();
      alert('✅ Punto di interesse eliminato!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (poi) => {
    try {
      await contentService.updatePOI(poi.id, { is_active: !poi.is_active });
      await loadPOIs();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTypeIcon = (type) => {
    const typeData = types.find(t => t.value === type);
    return typeData ? typeData.icon : '📍';
  };

  const getTypeLabel = (type) => {
    const typeData = types.find(t => t.value === type);
    return typeData ? typeData.label : type;
  };

  const filteredPOIs = selectedType === 'all' 
    ? pois 
    : pois.filter(poi => poi.type === selectedType);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-light text-gray-900">
            Gestione Punti di Interesse ({pois.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Luoghi da visitare nei dintorni
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Nuovo POI
        </button>
      </div>

      {/* Filtri Tipo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedType === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutti ({pois.length})
          </button>
          {types.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                selectedType === type.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              {type.label} ({pois.filter(p => p.type === type.value).length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista POI */}
      {filteredPOIs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-6">
            {selectedType === 'all' ? 'Nessun punto di interesse' : 'Nessun punto di interesse in questa categoria'}
          </p>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi POI
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPOIs.map((poi) => (
            <div
              key={poi.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Immagine */}
              {poi.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={poi.image_url}
                    alt={poi.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs">
                      {getTypeIcon(poi.type)}
                    </span>
                  </div>
                </div>
              )}

              {/* Contenuto */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    {poi.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    poi.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {poi.is_active ? 'Attivo' : 'Nascosto'}
                  </span>
                </div>

                {poi.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {poi.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  {poi.location && <p>📍 {poi.location}</p>}
                  {poi.distance && <p>🚗 {poi.distance}</p>}
                  {poi.opening_hours && <p>⏰ {poi.opening_hours}</p>}
                  {poi.price && <p>💰 {poi.price}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(poi)}
                    className={`flex-1 p-2 rounded-lg transition text-sm ${
                      poi.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {poi.is_active ? <Eye size={16} className="mx-auto" /> : <EyeOff size={16} className="mx-auto" />}
                  </button>
                  <button
                    onClick={() => openModal(poi)}
                    className="flex-1 p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                  >
                    <Edit2 size={16} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(poi.id)}
                    className="flex-1 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crea/Modifica */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-light text-gray-900">
                {editingPOI ? 'Modifica POI' : 'Nuovo POI'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Es: Lago Santo Modenese"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
                  placeholder="Descrivi il luogo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Località
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: Sestola"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distanza
                  </label>
                  <input
                    type="text"
                    value={formData.distance}
                    onChange={(e) => updateField('distance', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: 10 km"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orari Apertura
                  </label>
                  <input
                    type="text"
                    value={formData.opening_hours}
                    onChange={(e) => updateField('opening_hours', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: 9:00 - 18:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: Gratuito / 5€"
                  />
                </div>
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
                  <div className="mt-3">
                    <img
                      src={formData.image_url}
                      alt="Anteprima"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Esterno
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => updateField('link', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => updateField('is_active', e.target.checked)}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mostra sul sito
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Annulla
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
                      Salva POI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default POIManager;
