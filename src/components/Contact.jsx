import React from 'react';

const Contact = () => {
  return (
    <div id="contatti" className="mt-20 max-w-6xl mx-auto px-4">
      {/* Google Maps - Full Width sopra */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm overflow-hidden border border-teal-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2844.147!2d10.7330137!3d44.3088135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132aa5bde3099f93%3A0x41ba2e28c8fb83b0!2sVia%20per%20Palagano%2C%2028%2C%2041040%20Lama%20Mocogno%20MO%2C%20Italy!5e0!3m2!1sit!2sus!4v1682681099904!5m2!1sit!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mappa Iremia Lama Mocogno"
          ></iframe>
        </div>
      </div>

      {/* Form e Info sotto in 2 colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Contatto */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 border border-teal-100">
          <h3 className="text-2xl font-light text-gray-800 mb-6">
            Richiedi Informazioni
          </h3>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Invio in corso...';
            btn.disabled = true;
            
            window.emailjs.sendForm('service_7hmscff', 'template_molmw8x', form, 'GF7_kONoo8HL9IqWX')
              .then(() => {
                alert('✅ Messaggio inviato con successo!');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
              })
              .catch(() => {
                alert('❌ Errore nell\'invio. Riprova o contattaci via WhatsApp.');
                btn.textContent = originalText;
                btn.disabled = false;
              });
          }}>
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
            Contattaci
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">📧</div>
              <div>
                <div className="font-medium text-gray-800">Email</div>
                <a href="mailto:iremiait@gmail.com" className="text-teal-600 hover:text-teal-700">
                  iremiait@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">📞</div>
              <div>
                <div className="font-medium text-gray-800">Telefono / WhatsApp</div>
                <a href="tel:+393474160611" className="text-teal-600 hover:text-teal-700 block">
                  +39 347 416 0611
                </a>
                <a 
                  href="https://wa.me/393474160611" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-teal-500 hover:text-teal-600 inline-flex items-center gap-1 mt-1"
                >
                  💬 Scrivici su WhatsApp
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">📱</div>
              <div>
                <div className="font-medium text-gray-800">Instagram</div>
                <a 
                  href="https://www.instagram.com/iremiait/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700"
                >
                  @iremiait
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl text-teal-600">📍</div>
              <div>
                <div className="font-medium text-gray-800">Dove siamo</div>
                <div className="text-gray-600 text-sm">
                  Via per Palagano 28<br />
                  Lama Mocogno (MO)<br />
                  850 m s.l.m.
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
