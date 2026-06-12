import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Images } from 'lucide-react';
import { popupService } from '../../lib/supabase';

const CLOUD_NAME = 'ddxyxcanp';
const UPLOAD_PRESET = 'ml_default';

// Carica lo script Cloudinary Upload Widget una sola volta
const loadCloudinaryScript = () => {
  return new Promise((resolve) => {
    if (window.cloudinary) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

const PopupManager = () => {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const widgetRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    button_text: '',
    button_link: '',
    image_url: '',
    bg_color: '#1B7B7E',
    text_color: '#FFFFFF',
    is_active: false,
    delay_seconds: 3,
    show_frequency_days: 7,
    start_date: '',
    end_date: ''
  });

  useEffect(() => { loadPopups(); }, []);

  const loadPopups = async () => {
    setLoading(true);
    try {
      const data = await popupService.getAllPopups();
      setPopups(data);
    } catch (error) {
      console.error('Errore caricamento popup:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const cleaned = String(dateString).slice(0, 10);
    const [year, month, day] = cleaned.split('-');
    if (!year || !month || !day) return '—';
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      .toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Apre il widget Cloudinary (upload + media library)
  const openCloudinaryWidget = async () => {
    await loadCloudinaryScript();

    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFileSize: 10000000,
        resourceType: 'image',
        language: 'it',
        text: {
          it: {
            or: 'oppure',
            back: 'Indietro',
            advanced: 'Avanzate',
            close: 'Chiudi',
            no_results: 'Nessun risultato',
            search_placeholder: 'Cerca file...',
            about_uw: 'Widget di upload',
            menu: { files: 'File', web: 'Web', camera: 'Fotocamera' },
            selection_counter: { file: 'file', files: 'file' },
            actions: { upload: 'Carica', next: 'Avanti', cancel: 'Annulla' },
            local: {
              browse: 'Sfoglia',
              dd_title_single: 'Trascina un\'immagine qui',
              dd_title_multi: 'Trascina le immagini qui',
              drop_title_single: 'Rilascia il file per caricarlo',
              drop_title_multi: 'Rilascia i file per caricarli',
            },
          },
        },
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#1B7B7E',
            menuIcons: '#6B7280',
            textDark: '#111827',
            textLight: '#FFFFFF',
            link: '#1B7B7E',
            action: '#1B7B7E',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#1B7B7E',
            complete: '#10B981',
            sourceBg: '#F9FAFB',
          },
          frame: { background: 'rgba(0,0,0,0.5)' },
        },
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary widget error:', error);
          return;
        }
        if (result.event === 'success') {
          const url = result.info.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
          updateField('image_url', url);
          widgetRef.current = null; // reset per prossima apertura
        }
      }
    );

    widgetRef.current.open();
  };

  const openModal = (popup = null) => {
    widgetRef.current = null;
    if (popup) {
      setEditingPopup(popup);
      setFormData({
        title: popup.title || '',
        message: popup.message || '',
        button_text: popup.button_text || '',
        button_link: popup.button_link || '',
        image_url: popup.image_url || '',
        bg_color: popup.bg_color || '#1B7B7E',
        text_color: popup.text_color || '#FFFFFF',
        is_active: popup.is_active || false,
        delay_seconds: popup.delay_seconds || 3,
        show_frequency_days: popup.show_frequency_days || 7,
        start_date: popup.start_date ? String(popup.start_date).slice(0, 10) : '',
        end_date: popup.end_date ? String(popup.end_date).slice(0, 10) : ''
      });
    } else {
      setEditingPopup(null);
      setFormData({
        title: '',
        message: '',
        button_text: '',
        button_link: '',
        image_url: '',
        bg_color: '#1B7B7E',
        text_color: '#FFFFFF',
        is_active: false,
        delay_seconds: 3,
        show_frequency_days: 7,
        start_date: '',
        end_date: ''
      });
    }
    setShowPreview(false);
    setShowModal(true);
  };

  const closeModal = () => {
    if (widgetRef.current) {
      try { widgetRef.current.close(); } catch {}
      widgetRef.current = null;
    }
    setShowModal(false);
    setEditingPopup(null);
    setShowPreview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };
      if (dataToSave.is_active) {
        for (const popup of popups) {
          if (popup.id !== editingPopup?.id && popup.is_active) {
            await popupService.updatePopup(popup.id, { is_active: false });
          }
        }
      }
      if (editingPopup) {
        await popupService.updatePopup(editingPopup.id, dataToSave);
      } else {
        await popupService.createPopup(dataToSave);
      }
      await loadPopups();
      closeModal();
      alert('✅ Popup salvato con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (popup) => {
    if (!confirm('Sei sicuro di voler eliminare questo popup?')) return;
    try {
      await popupService.deletePopup(popup.id);
      await loadPopups();
      alert('✅ Popup eliminato!');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore nell\'eliminazione');
    }
  };

  const toggleActive = async (popup) => {
    try {
      if (!popup.is_active) {
        for (const p of popups) {
          if (p.id !== popup.id && p.is_active) {
            await popupService.updatePopup(p.id, { is_active: false });
          }
        }
      }
      await popupService.updatePopup(popup.id, { is_active: !popup.is_active });
      await loadPopups();
    } catch (error) {
      console.error('Errore toggle:', error);
      alert('❌ Errore nel cambio stato');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-light text-gray-900">Gestione Popup ({popups.length})</h3>
          <p className="text-sm text-gray-600 mt-1">Solo un popup può essere attivo alla volta</p>
        </div>
        <button onClick={() => openModal()} className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow-md">
          <Plus size={20} />Nuovo Popup
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div className="text-sm text-blue-800">
            Il popup appare ai visitatori dopo il ritardo impostato. Viene mostrato di nuovo solo dopo il numero di giorni configurato.
          </div>
        </div>
      </div>

      {popups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-6">Nessun popup configurato</p>
          <button onClick={() => openModal()} className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition inline-flex items-center gap-2">
            <Plus size={20} />Crea Popup
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {popups.map((popup) => (
            <div key={popup.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="flex items-stretch">
                <div className="w-3 flex-shrink-0" style={{ backgroundColor: popup.bg_color || '#1B7B7E' }} />
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{popup.title || '(nessun titolo)'}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${popup.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {popup.is_active ? '🟢 Attivo' : '⚫ Inattivo'}
                        </span>
                      </div>
                      {popup.message && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{popup.message}</p>}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>⏱️ Ritardo: {popup.delay_seconds || 3}s</span>
                        <span>🔁 Ogni {popup.show_frequency_days || 7} giorni</span>
                        {popup.start_date && formatDate(popup.start_date) !== '—' && (
                          <span>📅 Dal {formatDate(popup.start_date)}</span>
                        )}
                        {popup.end_date && formatDate(popup.end_date) !== '—' && (
                          <span>📅 Al {formatDate(popup.end_date)}</span>
                        )}
                        {popup.button_text && <span>🔘 Pulsante: "{popup.button_text}"</span>}
                      </div>
                    </div>
                    {popup.image_url && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={popup.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => toggleActive(popup)} className={`px-4 py-2 rounded-lg transition text-sm font-medium flex items-center gap-2 ${popup.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {popup.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      {popup.is_active ? 'Disattiva' : 'Attiva'}
                    </button>
                    <button onClick={() => openModal(popup)} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition text-sm font-medium flex items-center gap-2">
                      <Edit2 size={16} />Modifica
                    </button>
                    <button onClick={() => handleDelete(popup)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium flex items-center gap-2">
                      <Trash2 size={16} />Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-light text-gray-900">{editingPopup ? 'Modifica Popup' : 'Nuovo Popup'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* Contenuto */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Contenuto</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                  <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Es: Offerta Speciale Estate 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Messaggio</label>
                  <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24" placeholder="Es: Prenota entro il 30 giugno e ottieni il 10% di sconto!" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Testo Pulsante</label>
                    <input type="text" value={formData.button_text} onChange={(e) => updateField('button_text', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Es: Prenota ora" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Pulsante</label>
                    <input type="url" value={formData.button_link} onChange={(e) => updateField('button_link', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="https://wa.me/..." />
                  </div>
                </div>
              </div>

              {/* Immagine */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Immagine (opzionale)</h4>

                {/* Bottone Cloudinary widget */}
                <button
                  type="button"
                  onClick={openCloudinaryWidget}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-dashed border-teal-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition group"
                >
                  <Images size={22} className="text-teal-500 group-hover:text-teal-700 transition" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-teal-700">Scegli o carica immagine</p>
                    <p className="text-xs text-teal-500">Apre la libreria Cloudinary — sfoglia immagini esistenti o caricane una nuova</p>
                  </div>
                </button>

                {/* Anteprima immagine selezionata */}
                {formData.image_url && (
                  <div className="relative group">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-xl bg-gray-50 border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => updateField('image_url', '')}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      ✅ Immagine selezionata
                    </div>
                  </div>
                )}

                {/* Fallback URL manuale */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">oppure incolla un URL direttamente</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
              </div>

              {/* Stile */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Stile</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colore Sfondo</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={formData.bg_color} onChange={(e) => updateField('bg_color', e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-gray-300" />
                      <input type="text" value={formData.bg_color} onChange={(e) => updateField('bg_color', e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colore Testo</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={formData.text_color} onChange={(e) => updateField('text_color', e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-gray-300" />
                      <input type="text" value={formData.text_color} onChange={(e) => updateField('text_color', e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Impostazioni */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Impostazioni</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ritardo comparsa (secondi)</label>
                    <input type="number" value={formData.delay_seconds} onChange={(e) => updateField('delay_seconds', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" min="0" max="60" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mostra ogni X giorni</label>
                    <input type="number" value={formData.show_frequency_days} onChange={(e) => updateField('show_frequency_days', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" min="1" max="365" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data inizio (opzionale)</label>
                    <input type="date" value={formData.start_date} onChange={(e) => updateField('start_date', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data fine (opzionale)</label>
                    <input type="date" value={formData.end_date} onChange={(e) => updateField('end_date', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => updateField('is_active', e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    <span className="text-sm font-medium text-gray-700">Attiva subito questo popup</span>
                  </label>
                  {formData.is_active && <p className="text-xs text-amber-600 mt-1 ml-7">⚠️ Gli altri popup attivi verranno disattivati automaticamente</p>}
                </div>
              </div>

              {/* Anteprima */}
              <div className="space-y-4">
                <button type="button" onClick={() => setShowPreview(!showPreview)} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                  {showPreview ? '🙈 Nascondi Anteprima' : '👁️ Mostra Anteprima'}
                </button>
                {showPreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <div className="bg-black/50 p-8 flex items-center justify-center">
                      <div className="rounded-2xl shadow-2xl w-full overflow-hidden" style={{ maxWidth: '560px', backgroundColor: formData.bg_color }}>
                        {formData.image_url && (
                          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.08)' }}>
                            <img src={formData.image_url} alt="Preview" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block' }} />
                          </div>
                        )}
                        <div className="p-6 text-center" style={{ color: formData.text_color }}>
                          {formData.title && <h3 className="text-2xl font-light mb-3">{formData.title}</h3>}
                          {formData.message && <p className="text-base mb-5 opacity-90">{formData.message}</p>}
                          {formData.button_text && (
                            <button className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'white', color: formData.bg_color }}>
                              {formData.button_text}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Annulla</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50">
                  {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Salvataggio...</> : <><Save size={18} />Salva Popup</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupManager;
