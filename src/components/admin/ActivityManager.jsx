import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: 'estate',
    location: '',
    duration: '',
    price: '',
    image_url: '',
    link: '',
    is_active: true
  });

  const seasons = [
    { value: 'estate', label: 'Estate', icon: '☀️' },
    { value: 'inverno', label: 'Inverno', icon: '❄️' },
    { value: 'primavera', label: 'Primavera', icon: '🌸' },
    { value: 'autunno', label: 'Autunno', icon: '🍂' }
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await contentService.getActivities();
      setActivities(data);
    } catch (error) {
      console.error('Errore caricamento attività:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const openModal = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        description: activity.description,
        season: activity.season,
        location: activity.location || '',
        duration: activity.duration || '',
        price: activity.price || '',
        image_url: activity.image_url || '',
        link: activity.link || '',
        is_active: activity.is_active
      });
    } else {
      setEditingActivity(null);
      setFormData({
        title: '',
        description: '',
        season: 'estate',
        location: '',
        duration: '',
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
    setEditingActivity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingActivity) {
        await contentService.updateActivity(editingActivity.id, formData);
      } else {
        await contentService.createActivity(formData);
      }
      await loadActivities();
      closeModal();
      alert('✅ Attività salvata con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa attività?')) return;

    try {
      await contentService.deleteActivity(id);
      await loadActivities();
      alert('✅ Attività eliminata!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (activity) => {
    try {
      await contentService.updateActivity(activity.id, { is_active: !activity.is_active });
      await loadActivities();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSeasonIcon = (season) => {
    const seasonData = seasons.find(s => s.value === season);
    return seasonData ? seasonData.icon : '🌍';
  };

  const getSeasonLabel = (season) => {
    const seasonData = seasons.find(s => s.value === season);
    return seasonData ? seasonData.label : season;
  };

  const filteredActivities = selectedSeason === 'all' 
    ? activities 
    : activities.filter(activity => activity.season === selectedSeason);

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
            Gestione Attività ({activities.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Attività ed esperienze stagionali
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Nuova Attività
        </button>
      </div>

      {/* Filtri Stagione */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSeason('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedSeason === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutte ({activities.length})
          </button>
          {seasons.map(season => (
            <button
              key={season.value}
              onClick={() => setSelectedSeason(season.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                selectedSeason === season.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{season.icon}</span>
              {season.label} ({activities.filter(a => a.season === season.value).length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista Attività */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-6">
            {selectedSeason === 'all' ? 'Nessuna attività' : 'Nessuna attività in questa stagione'}
          </p>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi Attività
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Immagine */}
              {activity.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs">
                      {getSeasonIcon(activity.season)}
                    </span>
                  </div>
                </div>
              )}

              {/* Contenuto */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    {activity.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    activity.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.is_active ? 'Attiva' : 'Nascosta'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {activity.description}
                </p>

                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  {activity.location && <p>📍 {activity.location}</p>}
                  {activity.duration && <p>⏱️ {activity.duration}</p>}
                  {activity.price && <p>💰 {activity.price}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(activity)}
                    className={`flex-1 p-2 rounded-lg transition text-sm ${
                      activity.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {activity.is_active ? <Eye size={16} className="mx-auto" /> : <EyeOff size={16} className="mx-auto" />}
                  </button>
                  <button
                    onClick={() => openModal(activity)}
                    className="flex-1 p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                  >
                    <Edit2 size={16} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
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
                {editingActivity ? 'Modifica Attività' : 'Nuova Attività'}
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
                  Titolo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Es: Sci in Abetone"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrizione *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
                  placeholder="Descrivi l'attività..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stagione *
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => updateField('season', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  {seasons.map(season => (
                    <option key={season.value} value={season.value}>
                      {season.icon} {season.label}
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
                    placeholder="Es: Abetone, 15 km"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: Mezza giornata"
                  />
                </div>
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
                  placeholder="Es: Da 30€/persona"
                />
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
                      Salva Attività
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

export default ActivityManager;
