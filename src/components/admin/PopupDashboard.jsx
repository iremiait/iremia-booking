import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, BarChart3, Calendar, Clock, Palette, X, Save, Image as ImageIcon, LogOut, Star, Settings } from 'lucide-react';
import { popupService } from '../../lib/supabase';
import ImageManager from './ImageManager';
import ReviewManager from './ReviewManager';
import ContentVisibilityManager from './ContentVisibilityManager';

const PopupDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('popups');
  const [popups, setPopups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [showStats, setShowStats] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    button_text: '',
    button_link: '',
    bg_color: '#1B7B7E',
    text_color: '#FFFFFF',
    is_active: false,
    start_date: '',
    end_date: '',
    delay_seconds: 3,
    show_frequency_days: 7
  });

  useEffect(() => {
    loadPopups();
  }, []);

  useEffect(() => {
    if (showStats) {
      loadStats(showStats);
    }
  }, [showStats]);

  const loadPopups = async () => {
    setLoading(true);
    try {
      const data = await popupService.getAllPopups();
      setPopups(data || []);
    } catch (error) {
      console.error('Errore caricamento popup:', error);
      alert('Errore nel caricamento dei popup');
    }
    setLoading(false);
  };

  const loadStats = async (popupId) => {
    try {
      const data = await popupService.getPopupStats(popupId, 30);
      setStats(data || []);
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPopup) {
        await popupService.updatePopup(editingPopup.id, formData);
      } else {
        await popupService.createPopup(formData);
      }
      await loadPopups();
      closeModal();
      alert('Popup salvato con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Sei sicuro di voler eliminare questo popup?')) {
      try {
        await popupService.deletePopup(id);
        await loadPopups();
        alert('Popup eliminato!');
      } catch (error) {
        console.error('Errore eliminazione:', error);
        alert('Errore nell\'eliminazione');
      }
    }
  };

  const toggleActive = async (popup) => {
    try {
      if (!popup.is_active) {
        for (const p of popups) {
          if (p.is_active && p.id !== popup.id) {
            await popupService.updatePopup(p.id, { is_active: false });
          }
        }
      }
      await popupService.updatePopup(popup.id, { is_active: !popup.is_active });
      await loadPopups();
    } catch (error) {
      console.error('Errore toggle active:', error);
      alert('Errore nell\'attivazione/disattivazione');
    }
  };

  const openModal = (popup = null) => {
    if (popup) {
      setEditingPopup(popup);
      setFormData({
        title: popup.title || '',
        message: popup.message || '',
        button_text: popup.button_text || '',
        button_link: popup.button_link || '',
        bg_color: popup.bg_color || '#1B7B7E',
        text_color: popup.text_color || '#FFFFFF',
        is_active: popup.is_active || false,
        start_date: popup.start_date || '',
        end_date: popup.end_date || '',
        delay_seconds: popup.delay_seconds || 3,
        show_frequency_days: popup.show_frequency_days || 7
      });
    } else {
      setEditingPopup(null);
      setFormData({
        title: '',
        message: '',
        button_text: '',
        button_link: '',
        bg_color: '#1B7B7E',
        text_color: '#FFFFFF',
        is_active: false,
        start_date: '',
        end_date: '',
        delay_seconds: 3,
        show_frequency_days: 7
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPopup(null);
    setShowPreview(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non impostata';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getTotalViews = () => {
    return stats.reduce((sum, stat) => sum + (stat.views || 0), 0);
  };

  const getTotalClicks = () => {
    return stats.reduce((sum, stat) => sum + (stat.clicks || 0), 0);
  };

  const getConversionRate = () => {
    const views = getTotalViews();
    const clicks = getTotalClicks();
    return views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Gestione Dashboard</h1>
              <p className="text-gray-600 mt-1">Iremia Booking</p>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'popups' && (
                <button
                  onClick={() => openModal()}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
                >
                  <Plus size={20} />
                  Nuovo Popup
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Esci
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('popups')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === 'popups'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestione Popup
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'images'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon size={18} />
              Gestione Immagini
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star size={18} />
              Gestione Recensioni
            </button>
            <button
              onClick={() => setActiveTab('visibility')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'visibility'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={18} />
              Visibilità Sezioni
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'images' ? (
          <ImageManager />
        ) : activeTab === 'reviews' ? (
          <ReviewManager />
        ) : loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : popups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Eye size={64} className="mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2">Nessun popup configurato</h3>
            <p className="text-gray-600 mb-6">Inizia creando il tuo primo popup</p>
            <button
              onClick={() => openModal()}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Crea Popup
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {popups.map(popup => (
              <div key={popup.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-gray-900">{popup.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          popup.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {popup.is_active ? 'Attivo' : 'Disattivato'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{popup.message}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Inizio:</span>
                          <p className="font-medium">{formatDate(popup.start_date)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Fine:</span>
                          <p className="font-medium">{formatDate(popup.end_date)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Delay:</span>
                          <p className="font-medium">{popup.delay_seconds}s</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Frequenza:</span>
                          <p className="font-medium">Ogni {popup.show_frequency_days} giorni</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(popup)}
                        className={`p-2 rounded-lg transition ${
                          popup.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={popup.is_active ? 'Disattiva' : 'Attiva'}
                      >
                        {popup.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                      <button
                        onClick={() => setShowStats(popup.id)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        title="Statistiche"
                      >
                        <BarChart3 size={20} />
                      </button>
                      <button
                        onClick={() => openModal(popup)}
                        className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                        title="Modifica"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(popup.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        title="Elimina"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Colori:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: popup.bg_color }}
                        title="Sfondo"
                      />
                      <div 
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: popup.text_color }}
                        title="Testo"
                      />
                    </div>
                    {popup.button_text && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600">
                          CTA: <span className="font-medium">{popup.button_text}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crea/Modifica */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-light text-gray-900">
                {editingPopup ? 'Modifica Popup' : 'Nuovo Popup'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Colonna Sinistra */}
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
                      required
                      placeholder="Es: Prenota ora il tuo trattamento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
                      required
                      placeholder="Descrivi l'offerta o il messaggio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testo Pulsante
                    </label>
                    <input
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => updateField('button_text', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Es: Prenota ora"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Pulsante
                    </label>
                    <input
                      type="url"
                      value={formData.button_link}
                      onChange={(e) => updateField('button_link', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Palette size={16} className="inline mr-1" />
                        Colore Sfondo
                      </label>
                      <input
                        type="color"
                        value={formData.bg_color}
                        onChange={(e) => updateField('bg_color', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Palette size={16} className="inline mr-1" />
                        Colore Testo
                      </label>
                      <input
                        type="color"
                        value={formData.text_color}
                        onChange={(e) => updateField('text_color', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Colonna Destra */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => updateField('is_active', e.target.checked)}
                        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Attiva popup immediatamente
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Data Inizio
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => updateField('start_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Data Fine
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => updateField('end_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-1" />
                      Delay Visualizzazione (secondi)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={formData.delay_seconds}
                      onChange={(e) => updateField('delay_seconds', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequenza Visualizzazione (giorni)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={formData.show_frequency_days}
                      onChange={(e) => updateField('show_frequency_days', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Il popup verrà mostrato ogni N giorni allo stesso utente
                    </p>
                  </div>

                  {/* Anteprima */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      {showPreview ? 'Nascondi' : 'Mostra'} Anteprima
                    </button>
                  </div>
                </div>
              </div>

              {/* Anteprima Popup */}
              {showPreview && (
                <div className="mt-6 p-6 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-4 text-center">Anteprima Live</p>
                  <div className="flex justify-center">
                    <div 
                      className="rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                      style={{ backgroundColor: formData.bg_color, color: formData.text_color }}
                    >
                      <button className="absolute top-4 right-4 text-3xl font-light opacity-80">×</button>
                      <div className="text-center">
                        <h3 className="text-3xl font-light mb-4">{formData.title || 'Titolo popup'}</h3>
                        <p className="text-lg mb-6 opacity-90">{formData.message || 'Messaggio popup'}</p>
                        {formData.button_text && (
                          <button className="bg-white text-teal-700 px-8 py-3 rounded-lg font-medium">
                            {formData.button_text}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Azioni */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
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
                      Salva Popup
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Statistiche */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-light text-gray-900">Statistiche Popup</h2>
              <button
                onClick={() => setShowStats(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Riassunto */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-600 mb-1">Visualizzazioni Totali</p>
                  <p className="text-3xl font-bold text-blue-700">{getTotalViews()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">Click Totali</p>
                  <p className="text-3xl font-bold text-green-700">{getTotalClicks()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-600 mb-1">Tasso Conversione</p>
                  <p className="text-3xl font-bold text-purple-700">{getConversionRate()}%</p>
                </div>
              </div>

              {/* Tabella Dettagli */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Visualizzazioni</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Click</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Conversione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          Nessun dato disponibile
                        </td>
                      </tr>
                    ) : (
                      stats.map((stat, index) => {
                        const rate = stat.views > 0 ? ((stat.clicks / stat.views) * 100).toFixed(1) : 0;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(stat.date).toLocaleDateString('it-IT')}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{stat.views}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{stat.clicks}</td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rate > 5 ? 'bg-green-100 text-green-700' :
                                rate > 2 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {rate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupDashboard;
