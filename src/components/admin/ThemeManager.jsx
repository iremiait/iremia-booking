import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Palette, Eye } from 'lucide-react';
import { themeService, DEFAULT_THEME, PRESET_THEMES } from '../../lib/themeService';

const COLOR_FIELDS = [
  {
    group: 'Colore Principale',
    description: 'Usato per header, pulsanti, bordi, icone',
    fields: [
      { key: 'color_primary', label: 'Principale', hint: 'Colore dominante del sito' },
      { key: 'color_primary_dark', label: 'Scuro', hint: 'Hover su pulsanti, testi enfatici' },
      { key: 'color_primary_light', label: 'Chiaro', hint: 'Elementi secondari, badge' },
      { key: 'color_primary_50', label: 'Sfondo tenue', hint: 'Sfondi sezioni alternate' },
      { key: 'color_primary_100', label: 'Sfondo leggero', hint: 'Card highlights, bordi' },
    ],
  },
  {
    group: 'Colore Accent',
    description: 'Usato per la hero section e pulsanti CTA principali',
    fields: [
      { key: 'color_accent', label: 'Accent', hint: 'Bottone "Scopri di più" nella hero' },
      { key: 'color_accent_dark', label: 'Accent scuro', hint: 'Hover su bottoni accent' },
      { key: 'color_accent_light', label: 'Accent chiaro', hint: 'Testi accent nella hero' },
    ],
  },
  {
    group: 'Testi',
    description: 'Colori per i testi del sito',
    fields: [
      { key: 'color_text_primary', label: 'Testo principale', hint: 'Titoli e testi principali' },
      { key: 'color_text_secondary', label: 'Testo secondario', hint: 'Descrizioni e sottotitoli' },
      { key: 'color_text_muted', label: 'Testo tenue', hint: 'Note, placeholder, metadati' },
    ],
  },
  {
    group: 'Sfondi',
    description: 'Colori di sfondo delle sezioni',
    fields: [
      { key: 'color_bg_primary', label: 'Sfondo pagina', hint: 'Sfondo gradient principale' },
      { key: 'color_bg_secondary', label: 'Sfondo secondario', hint: 'Sezioni alternate' },
      { key: 'color_bg_card', label: 'Sfondo card', hint: 'Card, modal, pannelli' },
    ],
  },
];

const ColorInput = ({ value, onChange, label, hint }) => {
  const [inputVal, setInputVal] = useState(value);

  useEffect(() => {
    setInputVal(value);
  }, [value]);

  const handleHexChange = (e) => {
    const v = e.target.value;
    setInputVal(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition group">
      {/* Color picker */}
      <div className="relative flex-shrink-0">
        <input
          type="color"
          value={value}
          onChange={(e) => { onChange(e.target.value); setInputVal(e.target.value); }}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-300 p-0.5"
          title={label}
        />
      </div>

      {/* Info + hex input */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-800 truncate">{label}</span>
          <input
            type="text"
            value={inputVal}
            onChange={handleHexChange}
            maxLength={7}
            className="w-24 text-xs font-mono px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-transparent text-center"
            placeholder="#000000"
          />
        </div>
        {hint && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{hint}</p>
        )}
      </div>

      {/* Color swatch preview */}
      <div
        className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 shadow-inner"
        style={{ backgroundColor: value }}
      />
    </div>
  );
};

const ThemePreview = ({ colors }) => (
  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
    <p className="text-xs text-center text-gray-500 py-2 bg-gray-50 border-b">
      Anteprima Live
    </p>

    {/* Finto header */}
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="w-16 h-6 rounded" style={{ backgroundColor: colors.color_primary_50 }} />
      <div className="flex gap-2">
        {['link','link','link'].map((_, i) => (
          <div key={i} className="w-12 h-3 rounded-full" style={{ backgroundColor: colors.color_primary_100 }} />
        ))}
        <div className="w-16 h-6 rounded-lg" style={{ backgroundColor: colors.color_primary }} />
      </div>
    </div>

    {/* Finto hero */}
    <div className="px-6 py-8 text-center" style={{ backgroundColor: colors.color_primary }}>
      <div className="w-48 h-5 rounded mx-auto mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
      <div className="w-32 h-3 rounded mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      <div className="inline-block px-5 py-2 rounded-lg text-xs font-semibold text-white"
        style={{ backgroundColor: colors.color_accent }}>
        Prenota →
      </div>
    </div>

    {/* Finte card */}
    <div className="grid grid-cols-3 gap-2 p-4" style={{ backgroundColor: colors.color_bg_primary }}>
      {[1,2,3].map(i => (
        <div key={i} className="rounded-lg p-3 border" style={{ backgroundColor: colors.color_bg_card, borderColor: colors.color_primary_100 }}>
          <div className="w-full h-2 rounded mb-1" style={{ backgroundColor: colors.color_primary_100 }} />
          <div className="w-3/4 h-2 rounded mb-2" style={{ backgroundColor: colors.color_primary_50 }} />
          <div className="w-full h-5 rounded-md" style={{ backgroundColor: colors.color_primary + '22' }} />
        </div>
      ))}
    </div>

    {/* Finto footer */}
    <div className="px-4 py-3 flex justify-between items-center" style={{ backgroundColor: colors.color_primary_dark }}>
      <div className="w-20 h-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      <div className="w-12 h-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
    </div>
  </div>
);

const ThemeManager = () => {
  const [themeData, setThemeData] = useState(null);
  const [formColors, setFormColors] = useState({ ...DEFAULT_THEME });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setLoading(true);
    try {
      const data = await themeService.getTheme();
      setThemeData(data);
      setFormColors({ ...data });
    } catch (error) {
      console.error('Errore caricamento tema:', error);
    }
    setLoading(false);
  };

  const handleColorChange = (key, value) => {
    setFormColors(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset) => {
    setFormColors(prev => ({ ...prev, ...preset.colors, theme_name: preset.name }));
  };

  const handleSave = async () => {
    if (!themeData?.id) {
      alert('❌ ID tema non trovato. Assicurati di aver eseguito il SQL.');
      return;
    }
    setSaving(true);
    try {
      await themeService.updateTheme(themeData.id, formColors);
      themeService.applyTheme(formColors);
      setThemeData(prev => ({ ...prev, ...formColors }));
      alert('✅ Tema salvato! Le modifiche sono visibili sul sito.');
    } catch (error) {
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!confirm('Ripristinare i colori salvati (annullando le modifiche non salvate)?')) return;
    setFormColors({ ...themeData });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const currentGroup = COLOR_FIELDS[activeGroup];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-1 flex items-center gap-2">
            <Palette size={24} className="text-teal-600" />
            Editor Palette Colori
          </h3>
          <p className="text-sm text-gray-600">
            Modifica i colori del sito in tempo reale. Le modifiche vengono applicate immediatamente dopo il salvataggio.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            <Eye size={16} />
            {showPreview ? 'Nascondi' : 'Mostra'} Anteprima
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            <RotateCcw size={16} />
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Salvataggio...' : 'Salva Tema'}
          </button>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <span className="text-amber-600 text-xl flex-shrink-0">⚠️</span>
        <div className="text-sm text-amber-800">
          <strong>Come funziona:</strong> I colori vengono salvati su Supabase e applicati come variabili CSS al caricamento della pagina.
          Per far funzionare tutto, aggiungi <code className="bg-amber-100 px-1 rounded">themeService</code> in <code className="bg-amber-100 px-1 rounded">App.jsx</code> (vedi istruzioni sotto) e sostituisci le classi Tailwind con variabili CSS dove necessario.
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Colonna sinistra: editor */}
        <div className="space-y-6">

          {/* Preset temi */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              🎨 Temi Preimpostati
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition text-left group"
                >
                  {/* Palette swatches */}
                  <div className="flex gap-1 flex-shrink-0">
                    {[preset.colors.color_primary, preset.colors.color_accent, preset.colors.color_primary_light].map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-teal-700">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Nome tema */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Tema
            </label>
            <input
              type="text"
              value={formColors.theme_name || ''}
              onChange={(e) => handleColorChange('theme_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Es: Estate 2025"
            />
          </div>

          {/* Gruppi colori */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tab gruppi */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {COLOR_FIELDS.map((group, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGroup(idx)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition border-b-2 ${
                    activeGroup === idx
                      ? 'border-teal-600 text-teal-700 bg-teal-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {group.group}
                </button>
              ))}
            </div>

            {/* Colori del gruppo attivo */}
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-4">{currentGroup.description}</p>
              <div className="space-y-3">
                {currentGroup.fields.map((field) => (
                  <ColorInput
                    key={field.key}
                    value={formColors[field.key] || '#000000'}
                    onChange={(val) => handleColorChange(field.key, val)}
                    label={field.label}
                    hint={field.hint}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonna destra: anteprima */}
        {showPreview && (
          <div className="space-y-4">
            <ThemePreview colors={formColors} />

            {/* Palette compatta */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Tutti i colori
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(formColors)
                  .filter(([k]) => k.startsWith('color_'))
                  .map(([key, val]) => (
                    <div key={key} className="group relative">
                      <div
                        className="w-full aspect-square rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                        style={{ backgroundColor: val }}
                        title={key.replace('color_', '').replace(/_/g, ' ')}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                        {key.replace('color_', '')}
                        <br />{val}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Istruzioni integrazione */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">
          📋 Istruzioni per attivare il tema dinamico in App.jsx
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <p className="text-gray-500 mb-2">// In App.jsx, aggiungi in cima agli import:</p>
            <p className="text-blue-700">{'import { themeService } from \'./lib/themeService\';'}</p>
            <br />
            <p className="text-gray-500">// Nel componente App(), aggiungi questo useEffect:</p>
            <p>{'useEffect(() => {'}</p>
            <p className="pl-4">{'const loadTheme = async () => {'}</p>
            <p className="pl-8">{'const theme = await themeService.getTheme();'}</p>
            <p className="pl-8">{'themeService.applyTheme(theme);'}</p>
            <p className="pl-4">{'};'}</p>
            <p className="pl-4">{'loadTheme();'}</p>
            <p>{'}, []);'}</p>
          </div>
          <p className="text-gray-600">
            Questo carica il tema da Supabase ad ogni avvio e applica le variabili CSS al documento.
            Le classi Tailwind esistenti continueranno a funzionare, ma potrai anche usare
            <code className="bg-gray-100 px-1 rounded mx-1">var(--color-primary)</code>
            direttamente nei tuoi stili inline o CSS per override dinamici.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;
