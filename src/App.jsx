import React, { useState, useEffect } from 'react';
import Popup from './components/Popup';
import CookieBanner from './components/CookieBanner';
import Hero from './components/Hero';
import Apartment from './components/Apartment';
import HouseRules from './components/HouseRules';
import About from './components/About';
import Activities from './components/Activities';
import Restaurants from './components/Restaurants';
import POI from './components/POI';
import FAQs from './components/FAQs';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';
import { reviewService } from './lib/reviewService';
import { contentService } from './lib/contentService';
import { themeService } from './lib/themeService';

const SECTION_COMPONENTS = {
  about: About,
  activities: Activities,
  restaurants: Restaurants,
  poi: POI,
  faqs: FAQs,
};

const NavLink = ({ href, children, onClick, style, onMouseEnter, onMouseLeave, className }) => {
  return React.createElement('a', { href, onClick, style, onMouseEnter, onMouseLeave, className }, children);
};

const ExtLink = ({ href, children, onClick, style, onMouseEnter, onMouseLeave, className }) => {
  return React.createElement('a', { href, target: '_blank', rel: 'noopener noreferrer', onClick, style, onMouseEnter, onMouseLeave, className }, children);
};

function App() {
  const [heroImage, setHeroImage] = useState('/images/lama.jpg');
  const [logoImage, setLogoImage] = useState('/logo.png');
  const [galleryImages, setGalleryImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [dynamicSections, setDynamicSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare');
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  const navLinks = [
    { href: '#appartamento', label: "L'Appartamento" },
    { href: '#galleria', label: 'Galleria' },
    { href: '#zona', label: 'La Zona' },
    { href: '#contatti', label: 'Contatti' },
  ];

  useEffect(() => {
    const handleScroll = () => setShowWhatsapp(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          themeData,
          contactData,
          imagesData,
          reviewsData,
          sectionsData,
        ] = await Promise.all([
          themeService.getTheme().catch(() => null),
          contentService.getContactInfo().catch(() => null),
          supabase.from('site_images').select('*').maybeSingle().then(r => r.data).catch(() => null),
          reviewService.getActiveReviews().catch(() => []),
          contentService.getSectionVisibility().catch(() => []),
        ]);

        if (themeData) themeService.applyTheme(themeData);

        if (contactData?.whatsapp_link) {
          setWhatsappLink(contactData.whatsapp_link + '?text=Ciao!%20Vorrei%20prenotare');
        }

        if (imagesData) {
          if (imagesData.hero_url) setHeroImage(imagesData.hero_url);
          if (imagesData.logo_url) setLogoImage(imagesData.logo_url);
          if (imagesData.gallery_urls?.length > 0) {
            setGalleryImages(
              imagesData.gallery_urls.map((item, index) =>
                typeof item === 'string'
                  ? { src: item, alt: `Foto ${index + 1}` }
                  : { src: item.url, alt: item.alt || `Foto ${index + 1}` }
              )
            );
          }
        }

        setReviews(reviewsData);
        setReviewsLoading(false);

        setDynamicSections(
          sectionsData
            .filter(s => s.is_visible && SECTION_COMPONENTS[s.section_name])
            .sort((a, b) => (a.order_position || 0) - (b.order_position || 0))
        );
        setSectionsLoading(false);

      } catch (error) {
        console.error('Errore caricamento dati:', error);
        setReviewsLoading(false);
        setSectionsLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, var(--color-primary-100), var(--color-primary-50), var(--color-primary-100))' }}
    >
      <Popup />
      <CookieBanner />

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <NavLink href="#top" className="cursor-pointer">
              {/* FIX: logo più compatto, testo più visibile su entrambi mobile e desktop */}
              <img src={logoImage} alt="Iremia" className="h-10 md:h-20" />
            </NavLink>

            <nav className="hidden md:flex gap-6 items-center">
              {navLinks.map(link => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  className="font-medium transition-colors text-gray-700"
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#374151'}
                >
                  {link.label}
                </NavLink>
              ))}
              <ExtLink
                href={whatsappLink}
                className="text-white px-4 py-2 rounded-lg transition-all font-medium"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
              >
                Prenota
              </ExtLink>
            </nav>

            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: mobileMenuOpen ? 'var(--color-primary)' : undefined }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map(link => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    className="font-medium transition-colors py-2 text-gray-700"
                    style={{ borderBottom: '1px solid var(--color-primary-100)' }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#374151'}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <ExtLink
                  href={whatsappLink}
                  className="text-white px-4 py-3 rounded-lg text-center font-medium transition-all"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Prenota su WhatsApp
                </ExtLink>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <Hero heroImage={heroImage} />
        <Apartment />
        <HouseRules />

        {!sectionsLoading && dynamicSections.map(section => {
          const SectionComponent = SECTION_COMPONENTS[section.section_name];
          return SectionComponent ? <SectionComponent key={section.section_name} /> : null;
        })}

        <Gallery galleryImages={galleryImages} />
        <Reviews reviews={reviews} loading={reviewsLoading} />
        <Contact />
      </main>

      <Footer logoImage={logoImage} />

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattaci su WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        style={{
          backgroundColor: '#25D366',
          opacity: showWhatsapp ? 1 : 0,
          pointerEvents: showWhatsapp ? 'auto' : 'none',
          transform: showWhatsapp ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        }}
      >
        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">Prenota su WhatsApp</span>
      </a>
    </div>
  );
}

export default App;
