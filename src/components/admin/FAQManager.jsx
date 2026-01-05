import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, X, Save, HelpCircle } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'altro',
    is_active: true
  });

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
    setLoading(true);
    try {
      const data = await contentService.getAllFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Errore caricamento FAQ:', error);
      alert('Errore nel caricamento delle FAQ');
    }
    setLoading(false);
  };

  const openModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        is_active: faq.is_active
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        category: 'altro',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingFaq) {
        await contentService.updateFAQ(editingFaq.id, formData);
      } else {
        await contentService.createFAQ({
          ...formData,
          order_position: faqs.length
        });
      }
      await loadFAQs();
      closeModal();
      alert('✅ FAQ salvata con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa FAQ?')) return;

    try {
      await contentService.deleteFAQ(id);
      await loadFAQs();
      alert('✅ FAQ eliminata!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (faq) => {
    try {
      await contentService.updateFAQ(faq.id, { is_active: !faq.is_active });
      await loadFAQs();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryIcon = (categoryValue) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.icon : '❓';
  };

  const getCategoryLabel = (categoryValue) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.label : 'Altro';
  };

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const faqsByCategory = categories.map(cat => ({
    ...cat,
    faqs: faqs.filter(f => f.category === cat.value),
    count: faqs.filter(f => f.category === cat.value).length
  }));

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
            Gestione FAQ ({faqs.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Domande frequenti per i tuoi ospiti
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Nuova FAQ
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
            Tutte ({faqs.length})
          </button>
          {faqsByCategory.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Lista FAQ */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">
            {selectedCategory === 'all' ? 'Nessuna FAQ' : 'Nessuna FAQ in questa categoria'}
          </h3>
          <p className="text-gray-600 mb-6">Inizia aggiungendo la tua prima FAQ</p>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                {/* Categoria Icon */}
                <div className="text-3xl flex-shrink-0">
                  {getCategoryIcon(faq.category)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {getCategoryLabel(faq.category)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faq.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {faq.is_active ? 'Attiva' : 'Nascosta'}
                        </span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => toggleActive(faq)}
                        className={`p-2 rounded-lg transition ${
                          faq.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={faq.is_active ? 'Nascondi' : 'Mostra'}
                      >
                        {faq.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => openModal(faq)}
                        className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        title="Elimina"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
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
                {editingFaq ? 'Modifica FAQ' : 'Nuova FAQ'}
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
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domanda *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => updateField('question', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Es: C'è il WiFi?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risposta *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => updateField('answer', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
                  placeholder="Scrivi la risposta dettagliata..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.answer.length} caratteri
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
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(formData.category)}</span>
                    <div className="flex-1">
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {getCategoryLabel(formData.category)}
                      </span>
                      <h4 className="text-lg font-medium text-gray-900 mt-2">
                        {formData.question || 'La tua domanda...'}
                      </h4>
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                        {formData.answer || 'La tua risposta...'}
                      </p>
                    </div>
                  </div>
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
                      Salva FAQ
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

export default FAQManager;
