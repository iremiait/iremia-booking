import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon, Star } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'ristorante',
    address: '',
    phone: '',
    website: '',
    cuisine: '',
    price_range: '',
    rating: '',
    image_url: '',
    is_active: true
  });

  const categories = [
    { value: 'ristorante', label: 'Ristorante', icon: '🍝' },
    { value: 'pizzeria', label: 'Pizzeria', icon: '🍕' },
    { value: 'bar', label: 'Bar & Caffè', icon: '☕' },
    { value: 'trattoria', label: 'Trattoria', icon: '🏠' },
    { value: 'altro', label: 'Altro', icon: '🍴' }
  ];

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await contentService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Errore caricamento ristoranti:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const openModal = (restaurant = null) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setFormData({
        name: restaurant.name,
        description: restaurant.description || '',
        category: restaurant.category,
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        website: restaurant.website || '',
        cuisine: restaurant.cuisine || '',
        price_range: restaurant.price_range || '',
        rating: restaurant.rating || '',
        image_url: restaurant.image_url || '',
        is_active: restaurant.is_active
      });
    } else {
      setEditingRestaurant(null);
      setFormData({
        name: '',
        description: '',
        category: 'ristorante',
        address: '',
        phone: '',
        website: '',
        cuisine: '',
        price_range: '',
        rating: '',
        image_url: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingRestaurant) {
        await contentService.updateRestaurant(editingRestaurant.id, formData);
      } else {
        await contentService.createRestaurant(formData);
      }
      await loadRestaurants();
      closeModal();
      alert('✅ Ristorante salvato con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo ristorante?')) return;

    try {
      await contentService.deleteRestaurant(id);
      await loadRestaurants();
      alert('✅ Ristorante eliminato!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (restaurant) => {
    try {
      await contentService.updateRestaurant(restaurant.id, { is_active: !restaurant.is_active });
      await loadRestaurants();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '🍽️';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const filteredRestaurants = selectedCategory === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.category === selectedCategory);

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
            Gestione Ristoranti ({restaurants.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Ristoranti e locali consigliati
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Nuovo Ristorante
        </button>
      </div>

      {/* Filtri Categoria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutti ({restaurants.length})
          </button>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                selectedCategory === category.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.label} ({restaurants.filter(r => r.category === category.value).length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista Ristoranti */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-6">
            {selectedCategory === 'all' ? 'Nessun ristorante' : 'Nessun ristorante in questa categoria'}
          </p>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi Ristorante
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Immagine */}
              {restaurant.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs">
                      {getCategoryIcon(restaurant.category)}
                    </span>
                    {restaurant.rating && (
                      <span className="px-2 py-1 bg-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} className="fill-yellow-600 text-yellow-600" />
                        {restaurant.rating}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Contenuto */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    {restaurant.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    restaurant.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {restaurant.is_active ? 'Attivo' : 'Nascosto'}
                  </span>
                </div>

                {restaurant.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  {restaurant.address && <p>📍 {restaurant.address}</p>}
                  {restaurant.cuisine && <p>🍽️ {restaurant.cuisine}</p>}
                  {restaurant.price_range && <p>💰 {restaurant.price_range}</p>}
                  {restaurant.phone && <p>📞 {restaurant.phone}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(restaurant)}
                    className={`flex-1 p-2 rounded-lg transition text-sm ${
                      restaurant.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {restaurant.is_active ? <Eye size={16} className="mx-auto" /> : <EyeOff size={16} className="mx-auto" />}
                  </button>
                  <button
                    onClick={() => openModal(restaurant)}
                    className="flex-1 p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                  >
                    <Edit2 size={16} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
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
                {editingRestaurant ? 'Modifica Ristorante' : 'Nuovo Ristorante'}
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
                  placeholder="Es: Ristorante Da Mario"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
                  placeholder="Breve descrizione del locale..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Cucina
                  </label>
                  <input
                    type="text"
                    value={formData.cuisine}
                    onChange={(e) => updateField('cuisine', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: Toscana, Italiana"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indirizzo
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Via, Città"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+39 ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sito Web
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fascia Prezzo
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => updateField('price_range', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: €€ - Medio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Star size={16} className="inline mr-1" />
                    Rating
                  </label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => updateField('rating', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: 4.5"
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
                      Salva Ristorante
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

export default RestaurantManager;
