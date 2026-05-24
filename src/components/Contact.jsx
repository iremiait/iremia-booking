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

  // Fallback ai valori di default se non ci sono dati
  const formTitle =
    contactData?.form_title || 'Richiedi Informazioni';

  const infoTitle =
    contactData?.info_title || 'Contattaci';

  const email =
    contactData?.email || 'iremiait@gmail.com';

  const phone =
    contactData?.phone || '+39 347 416 0611';

  const whatsappLink =
    contactData?.whatsapp_link ||
    'https://wa.me/393474160611';

  const addressLine1 =
    contactData?.address_line1 || 'Via per Palagano 28';

  const addressLine2 =
    contactData?.address_line2 || 'Lama Mocogno (MO)';

  const addressLine3 =
    contactData?.address_line3 || '850 m s.l.m.';

  const mapEmbedUrl =
    contactData?.map_embed_url ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2844.147!2d10.7330137!3d44.3088135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132aa5bde3099f93%3A0x41ba2e28c8fb83b0!2sVia%20per%20Palagano%2C%2028%2C%2041040%20Lama%20Mocogno%20MO%2C%20Italy!5e0!3m2!1sit!2sus!4v1682681099904!5m2!1sit!2sus';

  // EmailJS config
  const emailjsServiceId =
    contactData?.emailjs_service_id || 'service_7hmscff';

  const emailjsTemplateId =
    contactData?.emailjs_template_id || 'template_molmw8x';

  const emailjsPublicKey =
    contactData?.emailjs_public_key || 'GF7_kONoo8HL9IqWX';

  if (loading) {
    return (
      <div
        id="contatti"
        className="mt-20 max-w-6xl mx-auto px-4"
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="contatti"
      className="mt-20 max-w-6xl mx-auto px-4"
    >
      {/* Google Maps */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm overflow-hidden border border-teal-100">
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
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 border border-teal-100">
          <h3 className="text-2xl font-light text-gray-800 mb-6">
            {formTitle}
          </h3>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target;

              const btn = form.querySelector(
                'button[type="submit"]'
              );

              const originalText = btn.textContent;

              btn.textContent = 'Invio in corso...';
              btn.disabled = true;

              window.emailjs
                .sendForm(
                  emailjsServiceId,
                  emailjsTemplateId,
                  form,
                  emailjsPublicKey
                )
                .then(() => {
                  alert('✅ Messaggio inviato con successo!');
                  form.reset();

                  btn.textContent = originalText;
                  btn.disabled = false;
                })
                .catch(() => {
                  alert(
                    "❌ Errore nell'invio. Riprova o contattaci via WhatsApp."
                  );

                  btn.textContent = originalText;
                  btn.disabled = false;
                });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome e Cognome
              </label>

              <input
                type="text"
                name="nome"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Messaggio
              </label>

              <textarea
                name="messaggio"
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Scrivi qui la tua richiesta..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Invia Richiesta
            </button>
          </form>
        </div>

        {/* Info Contatto */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 border border-teal-100">
          <h3 className="text-2xl font-light text-gray-800 mb-6">
            {infoTitle}
          </h3>

          <div className="space-y-4">

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">
                📧
              </div>

              <div>
                <div className="font-medium text-gray-800">
                  Email
                </div>

                <a
                  href={`mailto:${email}`}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Telefono */}
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">
                📞
              </div>

              <div>
                <div className="font-medium text-gray-800">
                  Telefono / WhatsApp
                </div>

                <a
                  href={`tel:${phone}`}
                  className="text-teal-600 hover:text-teal-700 block"
                >
                  {phone}
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-500 hover:text-teal-600 inline-flex items-center gap-1 mt-1"
                >
                  💬 Scrivici su WhatsApp
                </a>
              </div>
            </div>

            {/* Indirizzo */}
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">
                📍
              </div>

              <div>
                <div className="font-medium text-gray-800">
                  Dove siamo
                </div>

                <div className="text-gray-600 text-sm">
                  {addressLine1}
                  <br />
                  {addressLine2}
                  <br />
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
