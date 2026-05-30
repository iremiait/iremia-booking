import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContactInfo();
      setContactData(data);
    } catch (error) {
      console.error('Errore caricamento contatti:', error);
    }
    setLoading(false);
  };

  const formTitle = contactData?.form_title || 'Richiedi Informazioni';
  const infoTitle = contactData?.info_title || 'Contattaci';
  const email = contactData?.email || 'iremiait@gmail.com';
  const phone = contactData?.phone || '+39 347 416 0611';
  const whatsappLink = contactData?.whatsapp_link || 'https://wa.me/393474160611';
  const addressLine1 = contactData?.address_line1 || 'Via per Palagano 28';
  const addressLine2 = contactData?.address_line2 || 'Lama Mocogno (MO)';
  const addressLine3 = contactData?.address_line3 || '850 m s.l.m.';
  const mapEmbedUrl = contactData?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2844.147!2d10.7330137!3d44.3088135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132aa5bde3099f93%3A0x41ba2e28c8fb83b0!2sVia%20per%20Palagano%2C%2028%2C%2041040%20Lama%20Mocogno%20MO%2C%20Italy!5e0!3m2!1sit!2sus!4v1682681099904!5m2!1sit!2sus';
  const emailjsServiceId = contactData?.emailjs_service_id || 'service_7hmscff';
  const emailjsTemplateId = contactData?.emailjs_template_id || 'template_molmw8x';
  const emailjsPublicKey = contactData?.emailjs_public_key || 'GF7_kONoo8HL9IqWX';

  if (loading) {
    return (
      <div id="contatti" className="mt-20 max-w-6xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div id="contatti" className="mt-20 max-w-6xl mx-auto px-4">

      {/* Google Maps */}
      <div className="mb-8">
        <div className="rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid var(--color-primary-100)' }}>
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mappa Iremia Lama Mocogno"
          />
        </div>
      </div>

      {/* Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Form Contatto */}
        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
          <h3 className="text-2xl font-light mb-6" style={{ color: 'var(--color-text-primary)' }}>
            {formTitle}
          </h3>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const btn = form.querySelector('button[type="submit"]');
              const originalText = btn.textContent;
              btn.textContent = 'Invio in corso...';
              btn.disabled = true;
              window.emailjs
                .sendForm(emailjsServiceId, emailjsTemplateId, form, emailjsPublicKey)
                .then(() => {
                  alert('✅ Messaggio inviato con successo!');
                  form.reset();
                  btn.textContent = originalText;
                  btn.disabled = false;
                })
                .catch(() => {
                  alert("❌ Errore nell'invio. Riprova o contattaci via WhatsApp.");
                  btn.textContent = originalText;
                  btn.disabled = false;
                });
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Nome e Cognome
              </label>
              <input
                type="text"
                name="nome"
                required
                className="w-full px-4 py-2 border rounded-lg outline-none transition"
                style={{ borderColor: 'var(--color-primary-100)', color: 'var(--color-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-primary-100)'}
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border rounded-lg outline-none transition"
                style={{ borderColor: 'var(--color-primary-100)', color: 'var(--color-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-primary-100)'}
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Messaggio
              </label>
              <textarea
                name="messaggio"
                rows="4"
                required
                className="w-full px-4 py-2 border rounded-lg outline-none transition"
                style={{ borderColor: 'var(--color-primary-100)', color: 'var(--color-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-primary-100)'}
                placeholder="Scrivi qui la tua richiesta..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              Invia Richiesta
            </button>
          </form>
        </div>

        {/* Info Contatto */}
        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
          <h3 className="text-2xl font-light mb-6" style={{ color: 'var(--color-text-primary)' }}>
            {infoTitle}
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📧</div>
              <div>
                <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Email</div>
                <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)' }} className="hover:opacity-75 transition">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">📞</div>
              <div>
                <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Telefono / WhatsApp</div>
                <a href={`tel:${phone}`} style={{ color: 'var(--color-primary)' }} className="hover:opacity-75 transition block">
                  {phone}
                </a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary-light)' }}
                  className="text-sm hover:opacity-75 transition inline-flex items-center gap-1 mt-1">
                  💬 Scrivici su WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">📍</div>
              <div>
                <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Dove siamo</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {addressLine1}<br />
                  {addressLine2}<br />
                  {addressLine3}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
