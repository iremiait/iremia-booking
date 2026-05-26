import React, { useState, useEffect } from 'react';
import { contentService } from '../../lib/contentService';

const HeroSectionManager = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const data = await contentService.getHeroSection();
      if (data) {
        setHeroData(data);
        setEditedData(data);
      }
    } catch (error) {
      console.error('Errore caricamento hero section:', error);
      setMessage('Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfoCardChange = (index, field, value) => {
    const updatedCards = [...(editedData.info_cards || [])];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value
    };
    setEditedData(prev => ({
      ...prev,
      info_cards: updatedCards
    }));
  };

  const addInfoCard = () => {
    setEditedData(prev => ({
      ...prev,
      info_cards: [
        ...(prev.info_cards || []),
        { icon: '📌', value: '', label: '' }
      ]
    }));
  };

  const removeInfoCard = (index) => {
    setEditedData(prev => ({
      ...prev,
      info_cards: (prev.info_cards || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!heroData?.id) {
      setMessage('ID non trovato');
      return;
    }

    try {
      setSaving(true);
      await contentService.updateHeroSection(heroData.id, editedData);
      setHeroData(editedData);
      setMessage('Hero section salvata con successo! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Errore salvataggio:', error);
      setMessage('Errore nel salvataggio dei dati');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>Errore: Hero section non trovata nel database</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messaggio */}
      {message && (
        <div className={`p-4 rounded-lg text-white ${
          message.includes('Errore') ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {message}
        </div>
      )}

      {/* SEZIONE 1: Titoli Principali */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">📝 Titoli Principali</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titolo Principale
            </label>
            <input
              type="text"
              name="main_title"
              value={editedData.main_title || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Es: Il tuo rifugio di pace"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sottotitolo
            </label>
            <input
              type="text"
              name="subtitle"
              value={editedData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Es: a Lama Mocogno"
            />
          </div>
        </div>
      </div>

      {/* SEZIONE 2: Etimologia */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">🔤 Etimologia</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parola (italiano)
            </label>
            <input
              type="text"
              name="etymology_word"
              value={editedData.etymology_word || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Es: Iremía"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parola (greco antico)
            </label>
            <input
              type="text"
              name="etymology_greek"
              value={editedData.etymology_greek || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Es: ηρεμία"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Traduzione / Significato
            </label>
            <input
              type="text"
              name="etymology_translation"
              value={editedData.etymology_translation || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Es: calma · serenità · tranquillità"
            />
          </div>
        </div>
      </div>

      {/* SEZIONE 3: Paragrafi Benvenuto */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">💬 Paragrafi Benvenuto</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primo Paragrafo
            </label>
            <textarea
              name="welcome_paragraph_1"
              value={editedData.welcome_paragraph_1 || ''}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Inserisci il primo paragrafo di benvenuto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondo Paragrafo
            </label>
            <textarea
              name="welcome_paragraph_2"
              value={editedData.welcome_paragraph_2 || ''}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Inserisci il secondo paragrafo di benvenuto..."
            />
          </div>
        </div>
      </div>

      {/* SEZIONE 4: Info Cards */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">🎯 Info Cards</h3>
          <button
            onClick={addInfoCard}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            + Aggiungi Card
          </button>
        </div>

        <div className="space-y-4">
          {(editedData.info_cards || []).map((card, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emoji/Icona
                  </label>
                  <input
                    type="text"
                    value={card.icon || ''}
                    onChange={(e) => handleInfoCardChange(index, 'icon', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-2xl"
                    placeholder="🏠"
                    maxLength="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valore
                  </label>
                  <input
                    type="text"
                    value={card.value || ''}
                    onChange={(e) => handleInfoCardChange(index, 'value', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Es: 55 m²"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={card.label || ''}
                    onChange={(e) => handleInfoCardChange(index, 'label', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Es: Appartamento"
                  />
                </div>
              </div>

              <button
                onClick={() => removeInfoCard(index)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
              >
                Rimuovi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ANTEPRIMA LIVE */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-lg p-8 text-white">
        <h3 className="text-xl font-bold mb-6">👁️ Anteprima Live</h3>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{editedData.main_title}</h1>
            <p className="text-lg text-amber-100">{editedData.subtitle}</p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-amber-100 mb-1">Dal greco antico</p>
            <p className="text-2xl font-serif italic text-amber-50 mb-1">
              {editedData.etymology_word} — {editedData.etymology_greek}
            </p>
            <p className="text-amber-100">{editedData.etymology_translation}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-100">{editedData.welcome_paragraph_1}</p>
            <p className="text-sm text-gray-100">{editedData.welcome_paragraph_2}</p>
          </div>

          {(editedData.info_cards || []).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {editedData.info_cards.map((card, index) => (
                <div key={index} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">{card.icon}</div>
                  <div className="text-xs text-amber-100 mb-1">{card.label}</div>
                  <div className="text-sm font-bold">{card.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PULSANTE SALVA */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {saving ? 'Salvataggio...' : '💾 Salva Modifiche'}
        </button>
        <button
          onClick={() => setEditedData(heroData)}
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          ↶ Annulla
        </button>
      </div>
    </div>
  );
};

export default HeroSectionManager;
