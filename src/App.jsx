import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="Iremia" className="h-40" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-light text-gray-800 mb-4">
            Il tuo rifugio di pace
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            a Lama Mocogno
          </p>
          <div className="mt-8 inline-block">
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded">
              <p className="text-lg text-gray-700 italic">
                <span className="font-semibold text-teal-700">Iremía</span> (ηρεμία)
              </p>
              <p className="text-gray-600 mt-2">
                calma · serenità · tranquillità
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
            Benvenuti a Iremia
          </h3>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Iremia è una locazione turistica a Lama Mocogno gestita a livello familiare da Andrea e Iza.
            </p>
            <p>
              Il nostro è un piccolo paese dell'appennino modenese a 850 m s.l.m., ideale per sfuggire al caldo della pianura nei periodi estivi e per passare qualche giornata sulla neve d'inverno.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">🏠</div>
                <div className="font-semibold text-gray-800">55 m²</div>
                <div className="text-sm text-gray-500">Appartamento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">👥</div>
                <div className="font-semibold text-gray-800">Max 3 persone</div>
                <div className="text-sm text-gray-500">Ospiti</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-600 mb-2">⛰️</div>
                <div className="font-semibold text-gray-800">850 m</div>
                <div className="text-sm text-gray-500">Sul livello del mare</div>
              </div>
            </div>
          </div>
        </div>

        {/* Galleria Foto */}
        <div className="mt-20">
          <h3 className="text-3xl font-light text-gray-800 mb-8 text-center">
            Scopri gli spazi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/soggiorno.jpg" alt="Soggiorno" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/camera.jpg" alt="Camera" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/balcone.jpg" alt="Balcone" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/cucina.jpg" alt="Cucina" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/cimone.jpg" alt="Cimone" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/vandelli.jpg" alt="Via Vandelli" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/bagno.jpg" alt="Bagno" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src="/images/pontedeldiavolo.jpg" alt="Ponte del Diavolo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* L'Appartamento - Dettaglio */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
            L'Appartamento
          </h3>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              L'appartamento di 55 m² si trova al primo piano di una palazzina di due piani e offre tutto il comfort per un soggiorno rigenerante.
            </p>
            <p>
              Gli spazi includono un ampio soggiorno con cucinotto, una camera matrimoniale, un bagno completo e un balcone con vista sul tranquillo giardino condominiale interno.
            </p>
            <p>
              Vi forniamo tutto il necessario per il vostro soggiorno, così non dovrete "traslocare" quando verrete a trovarci. Possiamo ospitare al massimo 3 persone: due nella camera matrimoniale e forniamo un letto singolo che mettiamo nel soggiorno.
            </p>
            <p className="text-sm italic text-teal-700">
              I bimbi sotto i due anni non pagano e possono dormire nel lettone con i genitori. Su richiesta possiamo fornire un lettino (dovrete portare lenzuoline e cuscini).
            </p>
          </div>
        </div>

        {/* Servizi */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-light text-gray-800 mb-8 text-center">
            Cosa troverai
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Internet Detox */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🌲</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Internet Detox</h4>
                  <p className="text-gray-600 text-sm">
                    Niente WiFi per una vera pausa digitale. Riscopri il piacere della disconnessione
                  </p>
                </div>
              </div>
            </div>

            {/* Cucina */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🍳</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cucina Attrezzata</h4>
                  <p className="text-gray-600 text-sm">
                    Tutto il necessario per preparare i tuoi pasti in autonomia
                  </p>
                </div>
              </div>
            </div>

            {/* Balcone */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🌅</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Balcone Privato</h4>
                  <p className="text-gray-600 text-sm">
                    Vista sul tranquillo giardino condominiale interno
                  </p>
                </div>
              </div>
            </div>

            {/* Zona Silenziosa */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🤫</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Zona Silenziosa</h4>
                  <p className="text-gray-600 text-sm">
                    Tranquillità garantita per un riposo rigenerante
                  </p>
                </div>
              </div>
            </div>

            {/* Parcheggio */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-600 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🚗</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Parcheggio Comodo</h4>
                  <p className="text-gray-600 text-sm">
                    Parcheggio gratuito + garage privato disponibile su richiesta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* La Zona */}
        <div className="mt-20 bg-gradient-to-br from-teal-50 to-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
            La Zona
          </h3>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              Lama Mocogno è un piccolo paese dell'Appennino Modenese a 850 m s.l.m., ideale per sfuggire al caldo della pianura nei periodi estivi e per passare qualche giornata sulla neve d'inverno.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-3">⛷️</div>
                <h4 className="font-semibold text-gray-800 mb-2">Piste da Sci</h4>
                <p className="text-sm text-gray-600">
                  Vicinissimi alle Piane di Mocogno e a 30' dal comprensorio del Cimone
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🥾</div>
                <h4 className="font-semibold text-gray-800 mb-2">Via Vandelli</h4>
                <p className="text-sm text-gray-600">
                  Sulla storica Via Vandelli del 1738, da Modena a Massa
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏔️</div>
                <h4 className="font-semibold text-gray-800 mb-2">Frignano</h4>
                <p className="text-sm text-gray-600">
                  Nel cuore del territorio del Frignano, tra natura e tradizione
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contatti & Form */}
        <div className="mt-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Contatto */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-light text-gray-800 mb-6">
              Richiedi Informazioni
            </h3>
            <form className="space-y-4" action="https://formspree.io/f/xanykjeo" method="POST">
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

          {/* Info Contatto & Mappa */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
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
                      Lama Mocogno (MO)<br />
                      Appennino Modenese, 850 m s.l.m.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11333.876947948766!2d10.662933!3d44.2849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477fd0e0e0e0e0e0%3A0x0!2sLama%20Mocogno%2C%20MO!5e0!3m2!1sit!2sit!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Lama Mocogno"
              ></iframe>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <a 
            href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Prenota il tuo soggiorno
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Gestito con cura da Andrea e Iza · Sempre a vostra disposizione
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info */}
            <div>
              <h4 className="text-xl font-serif text-teal-400 mb-4">IREMIA</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Il tuo rifugio di pace a Lama Mocogno. Gestito con cura da Andrea e Iza.
              </p>
            </div>
            
            {/* Contatti */}
            <div>
              <h4 className="text-lg font-medium mb-4">Contatti</h4>
              <div className="space-y-2 text-sm">
                <a href="mailto:iremiait@gmail.com" className="text-gray-300 hover:text-teal-400 block">
                  📧 iremiait@gmail.com
                </a>
                <a href="tel:+393474160611" className="text-gray-300 hover:text-teal-400 block">
                  📞 +39 347 416 0611
                </a>
                <a href="https://wa.me/393474160611" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-teal-400 block">
                  💬 WhatsApp
                </a>
                <a href="https://www.instagram.com/iremiait/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-teal-400 block">
                  📱 @iremiait
                </a>
                <p className="text-gray-400 pt-2">
                  📍 Lama Mocogno (MO) · 850 m s.l.m.
                </p>
              </div>
            </div>
            
            {/* Link Utili */}
            <div>
              <h4 className="text-lg font-medium mb-4">Zona</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>⛷️ Piane di Mocogno</p>
                <p>🏔️ Cimone (30 min)</p>
                <p>🥾 Via Vandelli</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Iremia.it · Casa Vacanza Lama Mocogno
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
