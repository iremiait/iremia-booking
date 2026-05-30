import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ZoneManager = () => {
  const [zoneData, setZoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: 'La Zona',
    description: '',
    cards: [],
    cta_text: 'Prenota il tuo soggiorno',
    cta_whatsapp_message: 'Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia',
    google_reviews_link: 'https://maps.app.goo.gl/oZV9f4zYBXhmq1fr9',
    google_reviews_text: 'Vedi tutte le recensioni su Google',
  });

  const [newCard, setNewCard] = useState({ icon: '', title: '', desc: '' });

  useEffect(() => {
    loadZone();
  }, []);

  const loadZone = async () => {
    setLoading(true);
    try {
      const data = await contentService.getZone();
      if (data) {
        setZoneData(data);
        setFormData({
          title: data.title || 'La Zona',
          description: data.description || '',
          cards: data.cards || [],
          cta_text: data.cta_text || 'Prenota il tuo soggiorno',
          cta_whatsapp_message: data.cta_whatsapp_message || 'Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia',
          google_reviews_link: data.google_reviews_link || 'https://maps.app.goo.gl/oZV9f4zYBXhmq1fr9',
          google_reviews_text: data.google_reviews_text || 'Vedi tutte le recensioni su Google',
        });
      }
    } catch (error) {
      console.error('Errore caricamento zona:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneData?.id) {
      alert('❌ ID sezione non trovato.');
      return;
    }
    setSaving(true);
    try {
      await contentService.updateZone(zoneData.id, formData);
      await loadZone();
      alert('✅ Sezione "La Zona" salvata con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Card management ---

  const addCard = () => {
    if (!newCard.icon || !newCard.title || !newCard.desc) {
      alert('Compila tutti i campi della card (emoji, titolo, descrizione).');
      return;
    }
    setFormData(prev => ({ ...prev, cards: [...prev.cards, { ...newCard }] }));
    setNewCard({ icon: '', title: '', desc: '' });
  };

  const removeCard = (index) => {
    setFormData(prev => ({ ...prev, cards: prev.cards.filter((_, i) => i !== index) }));
    if (editingCardIndex === index) setEditingCardIndex(null);
  };

  const updateCard = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.map((card, i) => i === index ? { ...card, [field]: value } : card),
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
        <h3 className="text-2xl font-light text-gray-900 mb-2">Gestione "La Zona"</h3>
        <p className="text-sm text-gray-600">
          Modifica la descrizione del territorio, le card informative e i link di prenotazione/recensioni.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Testo principale */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Testo Principale</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titolo Sezione</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="La Zona"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
            <textarea
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Descrivi il territorio, la posizione, i punti di forza della zona..."
            />
            <p className="text-xs text-gray-400 mt-1">{formData.description.length} caratteri</p>
          </div>
        </div>

        {/* Card informative */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Card Informative</h4>
          <p className="text-sm text-gray-500">
            Appaiono come tre colonne sotto la descrizione. Usa emoji come icona.
          </p>

          {/* Card esistenti */}
          {formData.cards.length > 0 && (
            <div className="space-y-3">
              {formData.cards.map((card, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl flex-shrink-0 pt-1">{card.icon}</div>

                  {editingCardIndex === index ? (
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={card.icon}
                          onChange={e => updateCard(index, 'icon', e.target.value)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 text-center"
                          placeholder="Emoji"
                          maxLength="2"
                        />
                        <input
                          type="text"
                          value={card.title}
                          onChange={e => updateCard(index, 'title', e.target.value)}
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
                          placeholder="Titolo"
                        />
                      </div>
                      <input
                        type="text"
                        value={card.desc || card.description || ''}
                        onChange={e => updateCard(index, 'desc', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
                        placeholder="Descrizione breve"
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCardIndex(null)}
                          className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition"
                        >
                          <Check size={14} /> Fatto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{card.title}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{card.desc || card.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-shrink-0">
                    {editingCardIndex !== index && (
                      <button
                        type="button"
                        onClick={() => setEditingCardIndex(index)}
                        className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aggiungi nuova card */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi nuova card</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                value={newCard.icon}
                onChange={e => setNewCard(prev => ({ ...prev, icon: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                placeholder="Emoji"
                maxLength="2"
              />
              <input
                type="text"
                value={newCard.title}
                onChange={e => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Titolo"
              />
              <input
                type="text"
                value={newCard.desc}
                onChange={e => setNewCard(prev => ({ ...prev, desc: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Descrizione breve"
              />
            </div>
            <button
              type="button"
              onClick={addCard}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Aggiungi Card
            </button>
          </div>
        </div>

        {/* CTA Prenotazione */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Pulsante Prenotazione</h4>
          <p className="text-sm text-gray-500">
            Appare sotto le recensioni come call-to-action principale verso WhatsApp.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Testo Pulsante</label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={e => updateField('cta_text', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Prenota il tuo soggiorno"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Messaggio WhatsApp pre-compilato (URL encoded)
            </label>
            <input
              type="text"
              value={formData.cta_whatsapp_message}
              onChange={e => updateField('cta_whatsapp_message', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono text-sm focus:border-transparent"
              placeholder="Ciao!%20Vorrei%20prenotare..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Usa %20 per gli spazi. Es: <code>Ciao!%20Vorrei%20prenotare</code>
            </p>
          </div>
        </div>

        {/* Link Recensioni Google */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Link Recensioni Google</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Testo Link</label>
            <input
              type="text"
              value={formData.google_reviews_text}
              onChange={e => updateField('google_reviews_text', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Vedi tutte le recensioni su Google"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Google Business / Maps</label>
            <input
              type="url"
              value={formData.google_reviews_link}
              onChange={e => updateField('google_reviews_link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
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

        {/* Anteprima */}
        {showPreview && (
          <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-xl p-8 border border-gray-200">
            <p className="text-sm text-gray-500 mb-6 text-center">Anteprima Live</p>

            <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
              <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
                {formData.title || 'La Zona'}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
                {formData.description || 'Descrizione della zona...'}
              </p>

              {formData.cards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.cards.map((card, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl mb-3">{card.icon}</div>
                      <h4 className="font-semibold text-gray-800 mb-2">{card.title}</h4>
                      <p className="text-gray-600 text-sm">{card.desc || card.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 text-center space-y-3">
              <div>
                <span className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg text-sm font-medium shadow-md">
                  {formData.cta_text || 'Prenota'}
                </span>
              </div>
              <div>
                <span className="text-teal-600 text-sm font-medium underline cursor-pointer">
                  {formData.google_reviews_text || 'Vedi le recensioni su Google'}
                </span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ZoneManager;
