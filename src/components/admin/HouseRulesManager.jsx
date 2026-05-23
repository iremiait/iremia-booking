import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Clock, Home } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const HouseRulesManager = () => {
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Regole della Casa',
    checkin_start: '16:00',
    checkin_end: '21:00',
    checkout_time: '11:00',
    rules: [],
    show_airbnb_section: true,
    airbnb_text: 'Preferisci prenotare tramite Airbnb?',
    airbnb_link: 'https://airbnb.it/h/iremia',
    airbnb_button_text: 'Prenota su Airbnb'
  });

  const [newRule, setNewRule] = useState({
    icon: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    loadHouseRules();
  }, []);

  const loadHouseRules = async () => {
    setLoading(true);
    try {
      const data = await contentService.getHouseRules();
      if (data) {
        setRulesData(data);
        setFormData({
          title: data.title || 'Regole della Casa',
          checkin_start: data.checkin_start || '16:00',
          checkin_end: data.checkin_end || '21:00',
          checkout_time: data.checkout_time || '11:00',
          rules: data.rules || [],
          show_airbnb_section: data.show_airbnb_section !== false,
          airbnb_text: data.airbnb_text || 'Preferisci prenotare tramite Airbnb?',
          airbnb_link: data.airbnb_link || 'https://airbnb.it/h/iremia',
          airbnb_button_text: data.airbnb_button_text || 'Prenota su Airbnb'
        });
      }
    } catch (error) {
      console.error('Errore caricamento house rules:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (rulesData) {
        await contentService.updateHouseRules(rulesData.id, formData);
      }
      await loadHouseRules();
      alert('✅ Regole salvate con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRule = () => {
    if (newRule.icon && newRule.title && newRule.description) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, { ...newRule }]
      }));
      setNewRule({ icon: '', title: '', description: '' });
    } else {
      alert('Compila tutti i campi della regola!');
    }
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRule = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
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
          Gestione Regole della Casa
        </h3>
        <p className="text-sm text-gray-600">
          Personalizza check-in, check-out e regole dell'appartamento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titolo Sezione */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Home size={20} className="text-teal-600" />
            Titolo Sezione
          </h4>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Regole della Casa"
          />
        </div>

        {/* Orari Check-in/Check-out */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-teal-600" />
            Orari Check-in / Check-out
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Inizio
              </label>
              <input
                type="time"
                value={formData.checkin_start}
                onChange={(e) => updateField('checkin_start', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Fine
              </label>
              <input
                type="time"
                value={formData.checkin_end}
                onChange={(e) => updateField('checkin_end', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out
              </label>
              <input
                type="time"
                value={formData.checkout_time}
                onChange={(e) => updateField('checkout_time', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Regole */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Regole dell'Appartamento
          </h4>

          {/* Lista Regole Esistenti */}
          {formData.rules.length > 0 && (
            <div className="space-y-3 mb-6">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl flex-shrink-0">{rule.icon}</div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={rule.title}
                      onChange={(e) => updateRule(index, 'title', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Titolo regola"
                    />
                    <input
                      type="text"
                      value={rule.description}
                      onChange={(e) => updateRule(index, 'description', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Descrizione"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Aggiungi Nuova Regola */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi nuova regola</p>
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                value={newRule.icon}
                onChange={(e) => setNewRule(prev => ({ ...prev, icon: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Emoji (es: 🚭)"
                maxLength="2"
              />
              <input
                type="text"
                value={newRule.title}
                onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Titolo regola"
              />
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Descrizione"
              />
            </div>
            <button
              type="button"
              onClick={addRule}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Aggiungi Regola
            </button>
          </div>
        </div>

        {/* Sezione Airbnb */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Sezione Airbnb</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_airbnb_section}
                onChange={(e) => updateField('show_airbnb_section', e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">Mostra sezione</span>
            </label>
          </div>

          {formData.show_airbnb_section && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testo introduttivo
                </label>
                <input
                  type="text"
                  value={formData.airbnb_text}
                  onChange={(e) => updateField('airbnb_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Preferisci prenotare tramite Airbnb?"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Airbnb
                  </label>
                  <input
                    type="url"
                    value={formData.airbnb_link}
                    onChange={(e) => updateField('airbnb_link', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://airbnb.it/h/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testo Bottone
                  </label>
                  <input
                    type="text"
                    value={formData.airbnb_button_text}
                    onChange={(e) => updateField('airbnb_button_text', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Prenota su Airbnb"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
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

        {/* Preview */}
        {showPreview && (
          <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-xl p-8 border border-gray-200">
            <p className="text-sm text-gray-600 mb-6 text-center">Anteprima Live</p>
            
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
              <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
                {formData.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-in / Check-out */}
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Check-in / Check-out</h4>
                    <p className="text-gray-600 text-sm">Check-in: {formData.checkin_start} - {formData.checkin_end}</p>
                    <p className="text-gray-600 text-sm">Check-out: entro le {formData.checkout_time}</p>
                  </div>
                </div>

                {/* Regole */}
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-2xl">{rule.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{rule.title}</h4>
                      <p className="text-gray-600 text-sm">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Airbnb */}
              {formData.show_airbnb_section && (
                <div className="mt-8 pt-8 border-t border-teal-200 text-center">
                  <p className="text-gray-600 mb-4">{formData.airbnb_text}</p>
                  <a 
                    href={formData.airbnb_link}
                    className="inline-flex items-center gap-2 bg-[#FF5A5F] text-white px-6 py-3 rounded-lg font-medium shadow-md"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
                      <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
                    </svg>
                    {formData.airbnb_button_text}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HouseRulesManager;
