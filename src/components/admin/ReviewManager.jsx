import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, X, Save, Star } from 'lucide-react';
import { reviewService } from '../../lib/reviewService';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [formData, setFormData] = useState({
    author_name: '',
    author_initials: '',
    rating: 5,
    review_text: '',
    time_ago: '',
    is_active: true
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Errore caricamento recensioni:', error);
      alert('Errore nel caricamento delle recensioni');
    }
    setLoading(false);
  };

  const openModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        author_name: review.author_name,
        author_initials: review.author_initials,
        rating: review.rating,
        review_text: review.review_text,
        time_ago: review.time_ago,
        is_active: review.is_active
      });
    } else {
      setEditingReview(null);
      setFormData({
        author_name: '',
        author_initials: '',
        rating: 5,
        review_text: '',
        time_ago: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, formData);
      } else {
        await reviewService.createReview({
          ...formData,
          order_position: reviews.length
        });
      }
      await loadReviews();
      closeModal();
      alert('✅ Recensione salvata con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa recensione?')) return;

    try {
      await reviewService.deleteReview(id);
      await loadReviews();
      alert('✅ Recensione eliminata!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (review) => {
    try {
      await reviewService.toggleActive(review.id, review.is_active);
      await loadReviews();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Drag & Drop
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newReviews = [...reviews];
    const draggedItem = newReviews[draggedIndex];
    newReviews.splice(draggedIndex, 1);
    newReviews.splice(index, 0, draggedItem);

    setReviews(newReviews);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await reviewService.reorderReviews(reviews);
      alert('✅ Ordine salvato!');
    } catch (error) {
      console.error('Errore riordinamento:', error);
      alert('❌ Errore nel salvataggio ordine');
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-light text-gray-900">
            Gestione Recensioni ({reviews.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Trascina per riordinare · Solo le recensioni attive sono visibili sul sito
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Nuova Recensione
        </button>
      </div>

      {/* Lista Recensioni */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Star size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">Nessuna recensione</h3>
          <p className="text-gray-600 mb-6">Inizia aggiungendo la tua prima recensione</p>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi Recensione
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-move"
            >
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="text-gray-400 mt-1 cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  {review.author_initials}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{review.author_name}</h4>
                    <div className="flex text-yellow-400">
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.time_ago}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {review.is_active ? 'Attiva' : 'Nascosta'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{review.review_text}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(review)}
                    className={`p-2 rounded-lg transition ${
                      review.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={review.is_active ? 'Nascondi' : 'Mostra'}
                  >
                    {review.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => openModal(review)}
                    className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                    title="Modifica"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    title="Elimina"
                  >
                    <Trash2 size={18} />
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
                {editingReview ? 'Modifica Recensione' : 'Nuova Recensione'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Autore *
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => updateField('author_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: C.G."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Iniziali *
                  </label>
                  <input
                    type="text"
                    value={formData.author_initials}
                    onChange={(e) => updateField('author_initials', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: CG"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valutazione
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => updateField('rating', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{'⭐'.repeat(num)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo fa *
                  </label>
                  <input
                    type="text"
                    value={formData.time_ago}
                    onChange={(e) => updateField('time_ago', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Es: 5 mesi fa"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testo Recensione *
                </label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => updateField('review_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
                  placeholder="Scrivi la recensione..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.review_text.length} caratteri
                </p>
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

              {/* Preview */}
              <div className="border-t pt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Anteprima:</p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {formData.author_initials || '?'}
                    </div>
                    <span className="font-medium text-gray-900">{formData.author_name || 'Nome'}</span>
                    <div className="flex text-yellow-400 text-sm">
                      {'⭐'.repeat(formData.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{formData.time_ago || 'X tempo fa'}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{formData.review_text || 'Il testo della recensione apparirà qui...'}"
                  </p>
                </div>
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
                      Salva Recensione
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

export default ReviewManager;
