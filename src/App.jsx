import React from 'react';
import Popup from './components/Popup';

function App() {
  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-teal-100 via-teal-50 to-teal-100">
      <Popup />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="#top" className="cursor-pointer">
              <img src="/logo.png" alt="Iremia" className="h-40" />
            </a>
            
            {/* Menu Desktop - nascosto su mobile */}
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#appartamento" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">L'Appartamento</a>
              <a href="#galleria" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Galleria</a>
              <a href="#zona" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">La Zona</a>
              <a href="#contatti" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Contatti</a>
              <a href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare" target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Prenota</a>
            </nav>

            {/* Hamburger Button - visibile solo su mobile */}
            <button 
              id="mobile-menu-button"
              className="md:hidden text-gray-700 hover:text-teal-600 focus:outline-none"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu.classList.toggle('hidden');
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu Mobile - dropdown */}
          <div id="mobile-menu" className="hidden md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#appartamento" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200"
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                L'Appartamento
              </a>
              <a 
                href="#galleria" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200"
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                Galleria
              </a>
              <a 
                href="#zona" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200"
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                La Zona
              </a>
              <a 
                href="#contatti" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200"
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                Contatti
              </a>
              <a 
                href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 transition-colors text-center font-medium"
              >
                Prenota su WhatsApp
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT STARTS */}
      <main>
        {/* Hero Section con Background */}
        <div className="relative -mt-16 pt-16">
          {/* Background Image */}
          <div className="relative h-[600px] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/lama.jpg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
            </div>
            
            {/* Hero Content */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl">
                <h2 className="text-6xl md:text-7xl font-light text-white mb-6 drop-shadow-2xl">
                  Il tuo rifugio di pace
                </h2>
                <p className="text-2xl md:text-3xl text-white/90 mb-8">
                  a Lama Mocogno
                </p>
                <div className="inline-block bg-white/95 backdrop-blur border-l-4 border-teal-600 p-6 rounded-lg shadow-2xl">
                  <p className="text-xl text-gray-700 italic">
                    <span className="font-semibold text-teal-700">Iremía</span> (ηρεμία)
                  </p>
                  <p className="text-gray-600 mt-2">
                    calma · serenità · tranquillità
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box - Sotto l'immagine */}
          <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 max-w-3xl mx-auto border border-teal-100">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-teal-200">
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
          </div>
        </div>

        {/* L'Appartamento - Dettaglio */}
        <div id="appartamento" className="mt-20 bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
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
              Vi forniamo tutto il necessario per il vostro soggiorno, così non dovrete "traslocare" quando verrete a trovarci. Possiamo ospitare al massimo 3 persone: due nella camera matrimoniale e uno nel divano letto in soggiorno.
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
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
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
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
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
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
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
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
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
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
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
            {/* Biancheria fornita */}
            <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 border-l-4 border-teal-600">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🛏️</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tutto Incluso</h4>
                  <p className="text-gray-600 text-sm">
                    Lenzuola, asciugamani e tutto il necessario per il tuo comfort
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regole della Casa */}
        <div className="mt-16 bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
          <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
            Regole della Casa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🕐</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Check-in / Check-out</h4>
                <p className="text-gray-600 text-sm">Check-in: 16:00 - 21:00</p>
                <p className="text-gray-600 text-sm">Check-out: entro le 11:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚭</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Vietato fumare</h4>
                <p className="text-gray-600 text-sm">È vietato fumare all'interno dell'appartamento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🐾</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Animali non ammessi</h4>
                <p className="text-gray-600 text-sm">Spiacenti, non possiamo accettare animali domestici</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Feste ed eventi</h4>
                <p className="text-gray-600 text-sm">Non sono permesse feste o eventi</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤫</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Silenzio notturno</h4>
                <p className="text-gray-600 text-sm">Rispetto della quiete dopo le 23:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">♻️</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Gestione rifiuti</h4>
                <p className="text-gray-600 text-sm">Da gestire personalmente secondo le indicazioni fornite</p>
              </div>
            </div>
          </div>
          
          {/* Pulsante Airbnb */}
          <div className="mt-8 pt-8 border-t border-teal-200 text-center">
            <p className="text-gray-600 mb-4">Preferisci prenotare tramite Airbnb?</p>
            <a 
              href="https://airbnb.it/h/iremia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#E14348] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
                <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>
              Prenota su Airbnb
            </a>
          </div>
        </div>

        {/* Galleria Foto con Lightbox e Lazy Loading */}
        <div id="galleria" className="mt-20 max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-light text-gray-800 mb-8 text-center">
            Scopri gli spazi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/images/soggiorno.jpg', alt: 'Soggiorno' },
              { src: '/images/camera.jpg', alt: 'Camera' },
              { src: '/images/balcone.jpg', alt: 'Balcone' },
              { src: '/images/cucina.jpg', alt: 'Cucina' },
              { src: '/images/cimone.jpg', alt: 'Cimone' },
              { src: '/images/vandelli.jpg', alt: 'Via Vandelli' },
              { src: '/images/bagno.jpg', alt: 'Bagno' },
              { src: '/images/pontedeldiavolo.jpg', alt: 'Ponte del Diavolo' }
            ].map((image, index) => (
              <div 
                key={index}
                className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  const images = [
                    { src: '/images/soggiorno.jpg', alt: 'Soggiorno' },
                    { src: '/images/camera.jpg', alt: 'Camera' },
                    { src: '/images/balcone.jpg', alt: 'Balcone' },
                    { src: '/images/cucina.jpg', alt: 'Cucina' },
                    { src: '/images/cimone.jpg', alt: 'Cimone' },
                    { src: '/images/vandelli.jpg', alt: 'Via Vandelli' },
                    { src: '/images/bagno.jpg', alt: 'Bagno' },
                    { src: '/images/pontedeldiavolo.jpg', alt: 'Ponte del Diavolo' }
                  ];
                  
                  let currentIndex = index;
                  
                  const showImage = (idx) => {
                    const lightboxImg = document.getElementById('lightbox-img');
                    const counter = document.getElementById('lightbox-counter');
                    lightboxImg.src = images[idx].src;
                    lightboxImg.alt = images[idx].alt;
                    counter.textContent = `${idx + 1} / ${images.length}`;
                  };
                  
                  showImage(currentIndex);
                  
                  document.getElementById('lightbox-prev').onclick = () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    showImage(currentIndex);
                  };
                  
                  document.getElementById('lightbox-next').onclick = () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    showImage(currentIndex);
                  };
                  
                  document.getElementById('lightbox').classList.remove('hidden');
                }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox con navigazione */}
        <div 
          id="lightbox" 
          className="hidden fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target.id === 'lightbox') {
              document.getElementById('lightbox').classList.add('hidden');
            }
          }}
        >
          {/* Bottone Chiudi */}
          <button 
            id="lightbox-close"
            onClick={() => document.getElementById('lightbox').classList.add('hidden')}
            className="absolute top-4 right-4 text-white text-4xl hover:text-teal-400 transition-colors z-10"
          >
            ×
          </button>
          
          {/* Freccia Sinistra */}
          <button 
            id="lightbox-prev"
            className="absolute left-4 text-white text-5xl hover:text-teal-400 transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ‹
          </button>
          
          {/* Immagine */}
          <img 
            id="lightbox-img" 
            src="" 
            alt="" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          
          {/* Freccia Destra */}
          <button 
            id="lightbox-next"
            className="absolute right-4 text-white text-5xl hover:text-teal-400 transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ›
          </button>
          
          {/* Contatore */}
          <div className="absolute bottom-4 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            <span id="lightbox-counter">1 / 8</span>
          </div>
        </div>

        {/* Recensioni Google */}
        <div className="mt-20 max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-light text-gray-800 mb-4 text-center">
            Cosa dicono i nostri ospiti
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Le recensioni dei nostri ospiti su Google
          </p>
          
          {/* Grid Recensioni */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Recensione 1 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">5 mesi fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Ogni volta che torno in questo luogo mi sembra di essere a casa. La casa è molto accogliente. Non gli manca nulla. Il paesaggio è rilassante come tutta la pace che circonda la casa."
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  CG
                </div>
                <span className="text-gray-600 font-medium">C.G.</span>
              </div>
            </div>

            {/* Recensione 2 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">4 mesi fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Appartamento pulitissimo, dotato di tutto il necessario. Andrea è una persona gentile e disponibile. Ci siamo trovati bene. Lo consiglio vivamente!"
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  EV
                </div>
                <span className="text-gray-600 font-medium">E.V.</span>
              </div>
            </div>

            {/* Recensione 3 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">5 mesi fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Casa accogliente, pulita e zona tranquilla. Ci siamo stati più volte e penso che ci tornerò ancora! Andrea è affabile e simpatico. Consiglio vivamente il posto."
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  GS
                </div>
                <span className="text-gray-600 font-medium">G.S.</span>
              </div>
            </div>

            {/* Recensione 4 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">2 anni fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Sono stata più volte a casa Iremia e sicuramente tornerò perché mi sono trovata benissimo. Andrea è davvero gentile e sempre disponibile e l'appartamento è spazioso e luminoso."
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  FL
                </div>
                <span className="text-gray-600 font-medium">F.L.</span>
              </div>
            </div>

            {/* Recensione 5 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">2 anni fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Il nostro cammino sulla Via Vandelli si è fermato a Lama Mocogno da Iremia dove abbiamo trovato: un appartamento delizioso, curato e pulito, un host cordiale, attento e premuroso."
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  FP
                </div>
                <span className="text-gray-600 font-medium">F.P.</span>
              </div>
            </div>

            {/* Recensione 6 */}
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
                <span className="text-sm text-gray-500">2 anni fa</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Appartamento molto ben tenuto e dotato di ogni comfort. Andrea (e sua moglie) gentilissimo e pronto ad aiutarti. Super consigliato!"
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                  RT
                </div>
                <span className="text-gray-600 font-medium">R.T.</span>
              </div>
            </div>

          </div>

          {/* Link Google Business */}
          <div className="mt-8 text-center">
            <a 
              href="https://maps.app.goo.gl/oZV9f4zYBXhmq1fr9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Vedi tutte le recensioni su Google
            </a>
          </div>
        </div>

        {/* CTA Button - Sotto le foto */}
        <div className="mt-12 text-center">
          <a 
            href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Prenota il tuo soggiorno
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Sempre a vostra disposizione
          </p>
        </div>

        {/* La Zona */}
        <div id="zona" className="mt-20 bg-gradient-to-br from-teal-100 to-teal-50 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-200">
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
      </main>
      {/* MAIN CONTENT ENDS */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo */}
            <div>
              <img src="/logo.png" alt="Iremia" loading="lazy" className="h-24 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-xs mt-2">
                Il tuo rifugio di pace a Lama Mocogno
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
                  📍 Via per Palagano 28, Lama Mocogno (MO)
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
          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Iremia.it · Casa Vacanza Lama Mocogno
            </p>
            <p className="text-gray-500 text-xs mt-2">
              CIR: 036018-AT-00002 · CIN: IT036018C2UE6SRL2D
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
