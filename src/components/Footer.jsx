import React from 'react';

const Footer = ({ logoImage }) => {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div>
            <img src={logoImage} alt="Iremia" loading="lazy" className="h-24 mb-4 brightness-0 invert" />
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
  );
};

export default Footer;
