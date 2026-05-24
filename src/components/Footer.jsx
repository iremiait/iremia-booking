import React, { useState, useEffect } from 'react';
import { contentService } from '../lib/contentService';

const Footer = ({ logoImage }) => {
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
      console.error('Errore caricamento contatti footer:', error);
    }
    setLoading(false);
  };

  // Fallback ai valori di default
  const tagline = contactData?.tagline || 'Il tuo rifugio di pace a Lama Mocogno';
  const email = contactData?.email || 'iremiait@gmail.com';
  const phone = contactData?.phone || '+39 347 416 0611';
  const whatsappLink = contactData?.whatsapp_link || 'https://wa.me/393474160611';
  const addressLine1 = contactData?.address_line1 || 'Via per Palagano 28';
  const addressLine2 = contactData?.address_line2 || 'Lama Mocogno (MO)';
  const copyrightYear = contactData?.copyright_year || new Date().getFullYear();
  const cirCode = contactData?.cir_code || '036018-AT-00002';
  const cinCode = contactData?.cin_code || 'IT036018C2UE6SRL2D';

  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div>
            <img 
              src={logoImage} 
              alt="Iremia" 
              loading="lazy" 
              className="h-24 mb-4 brightness-0 invert" 
            />
            <p className="text-gray-400 text-xs mt-2">
              {tagline}
            </p>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contatti</h4>
            <div className="space-y-2 text-sm">
              <a 
                href={`mailto:${email}`} 
                className="text-gray-300 hover:text-teal-400 block"
              >
                📧 {email}
              </a>
              <a 
                href={`tel:${phone}`} 
                className="text-gray-300 hover:text-teal-400 block"
              >
                📞 {phone}
              </a>
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-teal-400 block"
              >
                💬 WhatsApp
              </a>
              <p className="text-gray-400 pt-2">
                📍 {addressLine1}, {addressLine2}
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
            © {copyrightYear} Iremia.it · Casa Vacanza Lama Mocogno
          </p>
          <p className="text-gray-500 text-xs mt-2">
            CIR: {cirCode} · CIN: {cinCode}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
