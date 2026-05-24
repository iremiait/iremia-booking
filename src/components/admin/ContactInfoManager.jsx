import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Code } from 'lucide-react';
import { contentService } from '../../lib/contentService';

const ContactInfoManager = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    form_title: 'Richiedi Informazioni',
    info_title: 'Contattaci',
    email: 'iremiait@gmail.com',
    phone: '+39 347 416 0611',
    whatsapp_number: '393474160611',
    whatsapp_link: 'https://wa.me/393474160611',
    address_line1: 'Via per Palagano 28',
    address_line2: 'Lama Mocogno (MO)',
    address_line3: '850 m s.l.m.',
    map_embed_url: '',
    emailjs_service_id: 'service_7hmscff',
    emailjs_template_id: 'template_molmw8x',
    emailjs_public_key: 'GF7_kONoo8HL9IqWX',
    tagline: 'Il tuo rifugio di pace a Lama Mocogno',
    copyright_year: new Date().getFullYear(),
    cir_code: '036018-AT-00002',
    cin_code: 'IT036018C2UE6SRL2D'
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContactInfo();
      if (data) {
        setContactData(data);
        setFormData({
          form_title: data.form_title || 'Richiedi Informazioni',
          info_title: data.info_title || 'Contattaci',
          email: data.email || 'iremiait@gmail.com',
          phone: data.phone || '+39 347 416 0611',
          whatsapp_number: data.whatsapp_number || '393474160611',
          whatsapp_link: data.whatsapp_link || 'https://wa.me/393474160611',
          address_line1: data.address_line1 || 'Via per Palagano 28',
          address_line2: data.address_line2 || 'Lama Mocogno (MO)',
          address_line3: data.address_line3 || '850 m s.l.m.',
          map_embed_url: data.map_embed_url || '',
          emailjs_service_id: data.emailjs_service_id || 'service_7hmscff',
          emailjs_template_id: data.emailjs_template_id || 'template_molmw8x',
          emailjs_public_key: data.emailjs_public_key || 'GF7_kONoo8HL9IqWX',
          tagline: data.tagline || 'Il tuo rifugio di pace a Lama Mocogno',
          copyright_year: data.copyright_year || new Date().getFullYear(),
          cir_code: data.cir_code || '036018-AT-00002',
          cin_code: data.cin_code || 'IT036018C2UE6SRL2D'
        });
      }
    } catch (error) {
      console.error('Errore caricamento contact info:', error);
      alert('❌ Errore nel caricamento');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (contactData) {
        await contentService.updateContactInfo(contactData.id, formData);
      }
      await loadContactInfo();
      alert('✅ Informazioni contatto salvate con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
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
      <div>
        <h3 className="text-2xl font-light text-gray-900 mb-2">
          Gestione Info Contatto
        </h3>
        <p className="text-sm text-gray-600">
          Personalizza email, telefono, indirizzo e configurazioni
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titoli Sezioni */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Titoli Sezioni
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo Form Contatto
              </label>
              <input
                type="text"
                value={formData.form_title}
                onChange={(e) => updateField('form_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Richiedi Informazioni"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo Info Contatto
              </label>
              <input
                type="text"
                value={formData.info_title}
                onChange={(e) => updateField('info_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Contattaci"
              />
            </div>
          </div>
        </div>

        {/* Contatti Principali */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Mail size={20} className="text-teal-600" />
            Contatti Principali
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="iremiait@gmail.com"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+39 347 416 0611"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numero WhatsApp (solo numeri)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_number}
                  onChange={(e) => updateField('whatsapp_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="393474160611"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link WhatsApp Completo
              </label>
              <input
                type="url"
                value={formData.whatsapp_link}
                onChange={(e) => updateField('whatsapp_link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://wa.me/393474160611"
              />
            </div>
          </div>
        </div>

        {/* Indirizzo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-teal-600" />
            Indirizzo
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo - Linea 1
              </label>
              <input
                type="text"
                value={formData.address_line1}
                onChange={(e) => updateField('address_line1', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Via per Palagano 28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo - Linea 2
              </label>
              <input
                type="text"
                value={formData.address_line2}
                onChange={(e) => updateField('address_line2', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Lama Mocogno (MO)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo - Linea 3
              </label>
              <input
                type="text"
                value={formData.address_line3}
                onChange={(e) => updateField('address_line3', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="850 m s.l.m."
              />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Google Maps Embed
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Embed Google Maps
            </label>
            <textarea
              value={formData.map_embed_url}
              onChange={(e) => updateField('map_embed_url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24 font-mono text-xs"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Vai su Google Maps → Condividi → Incorpora mappa → Copia HTML
            </p>
          </div>
        </div>

        {/* EmailJS Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Code size={20} className="text-teal-600" />
            Configurazione EmailJS
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service ID
              </label>
              <input
                type="text"
                value={formData.emailjs_service_id}
                onChange={(e) => updateField('emailjs_service_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                placeholder="service_xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template ID
              </label>
              <input
                type="text"
                value={formData.emailjs_template_id}
                onChange={(e) => updateField('emailjs_template_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                placeholder="template_xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <input
                type="text"
                value={formData.emailjs_public_key}
                onChange={(e) => updateField('emailjs_public_key', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                placeholder="xxxxxxxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Informazioni Footer
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Il tuo rifugio di pace a Lama Mocogno"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anno Copyright
                </label>
                <input
                  type="number"
                  value={formData.copyright_year}
                  onChange={(e) => updateField('copyright_year', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="2026"
                  min="2020"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Codice CIR
                </label>
                <input
                  type="text"
                  value={formData.cir_code}
                  onChange={(e) => updateField('cir_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="036018-AT-00002"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Codice CIN
                </label>
                <input
                  type="text"
                  value={formData.cin_code}
                  onChange={(e) => updateField('cin_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="IT036018C2UE6SRL2D"
                />
              </div>
            </div>
          </div>
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
            <p className="text-sm text-gray-600 mb-6 text-center">Anteprima Info Contatto</p>
            
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100 max-w-md mx-auto">
              <h3 className="text-xl font-light text-gray-800 mb-4">
                {formData.info_title}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-xl text-teal-600">📧</div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Email</div>
                    <a href={`mailto:${formData.email}`} className="text-teal-600 text-sm">
                      {formData.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl text-teal-600">📞</div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Telefono / WhatsApp</div>
                    <a href={`tel:${formData.phone}`} className="text-teal-600 text-sm block">
                      {formData.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl text-teal-600">📍</div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Dove siamo</div>
                    <div className="text-gray-600 text-xs">
                      {formData.address_line1}<br />
                      {formData.address_line2}<br />
                      {formData.address_line3}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-800 text-white rounded-lg p-6 max-w-md mx-auto">
              <p className="text-xs text-gray-400 mb-2">Footer Preview:</p>
              <p className="text-xs mb-2">{formData.tagline}</p>
              <p className="text-xs text-gray-400">
                © {formData.copyright_year} Iremia.it
              </p>
              <p className="text-xs text-gray-500 mt-1">
                CIR: {formData.cir_code} · CIN: {formData.cin_code}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactInfoManager;
