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
    <footer className="mt-20" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white' }}>
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
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {tagline}
            </p>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contatti</h4>
            <div className="space-y-2 text-sm">
              <a href={`mailto:${email}`} className="block transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.75)' }}>
                📧 {email}
              </a>
              <a href={`tel:${phone}`} className="block transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.75)' }}>
                📞 {phone}
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.75)' }}>
                💬 WhatsApp
              </a>
              <p className="pt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                📍 {addressLine1}, {addressLine2}
              </p>
            </div>
          </div>

          {/* Zona */}
          <div>
            <h4 className="text-lg font-medium mb-4">Zona</h4>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <p>⛷️ Piane di Mocogno</p>
              <p>🏔️ Cimone (30 min)</p>
              <p>🥾 Via Vandelli</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {copyrightYear} Iremia.it · Casa Vacanza Lama Mocogno
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            CIR: {cirCode} · CIN: {cinCode}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
