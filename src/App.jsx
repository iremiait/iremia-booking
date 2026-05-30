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

  const navLinks = [
    { href: '#appartamento', label: "L'Appartamento" },
    { href: '#galleria', label: 'Galleria' },
    { href: '#zona', label: 'La Zona' },
    { href: '#contatti', label: 'Contatti' },
  ];

  useEffect(() => {
    // Carica tutto in parallelo con Promise.all
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

        // Applica tema
        if (themeData) themeService.applyTheme(themeData);

        // Applica contatti
        if (contactData?.whatsapp_link) {
          setWhatsappLink(contactData.whatsapp_link + '?text=Ciao!%20Vorrei%20prenotare');
        }

        // Applica immagini
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

        // Applica recensioni
        setReviews(reviewsData);
        setReviewsLoading(false);

        // Applica sezioni
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
              <img src={logoImage} alt="Iremia" className="h-40" />
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
    </div>
  );
}

export default App;
