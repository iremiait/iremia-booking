import React, { useState, useEffect } from 'react';
import Popup from './components/Popup';
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

function App() {
  const [heroImage, setHeroImage] = useState('/images/lama.jpg');
  const [logoImage, setLogoImage] = useState('/logo.png');
  const [galleryImages, setGalleryImages] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [dynamicSections, setDynamicSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  const sectionComponents = {
    'about': About,
    'activities': Activities,
    'restaurants': Restaurants,
    'poi': POI,
    'faqs': FAQs
  };

  // Carica tema dinamico da Supabase e inietta CSS override
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await themeService.getTheme();
        themeService.applyTheme(theme);
        injectThemeOverrides(theme);
      } catch (error) {
        console.error('Errore caricamento tema:', error);
      }
    };
    loadTheme();
  }, []);

  // Inietta un <style> tag che sovrascrive le classi Tailwind teal/amber
  const injectThemeOverrides = (theme) => {
    const existingStyle = document.getElementById('iremia-theme-overrides');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement('style');
    style.id = 'iremia-theme-overrides';
    style.innerHTML = `
      /* Sfondi principali */
      .bg-teal-600 { background-color: ${theme.color_primary} !important; }
      .bg-teal-700 { background-color: ${theme.color_primary_dark} !important; }
      .bg-teal-500 { background-color: ${theme.color_primary} !important; }
      .bg-teal-100 { background-color: ${theme.color_primary_100} !important; }
      .bg-teal-50  { background-color: ${theme.color_primary_50} !important; }

      /* Testi teal */
      .text-teal-600 { color: ${theme.color_primary} !important; }
      .text-teal-700 { color: ${theme.color_primary_dark} !important; }
      .text-teal-500 { color: ${theme.color_primary} !important; }
      .text-teal-400 { color: ${theme.color_primary_light} !important; }

      /* Bordi teal */
      .border-teal-600 { border-color: ${theme.color_primary} !important; }
      .border-teal-500 { border-color: ${theme.color_primary} !important; }
      .border-teal-200 { border-color: ${theme.color_primary_100} !important; }
      .border-teal-100 { border-color: ${theme.color_primary_50} !important; }

      /* Hover teal */
      .hover\\:bg-teal-700:hover { background-color: ${theme.color_primary_dark} !important; }
      .hover\\:bg-teal-600:hover { background-color: ${theme.color_primary} !important; }
      .hover\\:text-teal-600:hover { color: ${theme.color_primary} !important; }
      .hover\\:text-teal-700:hover { color: ${theme.color_primary_dark} !important; }
      .hover\\:border-teal-600:hover { border-color: ${theme.color_primary} !important; }

      /* Gradient sfondo pagina */
      .from-teal-100 { --tw-gradient-from: ${theme.color_primary_100} !important; }
      .via-teal-50   { --tw-gradient-via: ${theme.color_primary_50} !important; }
      .to-teal-100   { --tw-gradient-to: ${theme.color_primary_100} !important; }
      .from-teal-50  { --tw-gradient-from: ${theme.color_primary_50} !important; }
      .to-teal-50    { --tw-gradient-to: ${theme.color_primary_50} !important; }

      /* Gradient sezioni (es. About) */
      .from-teal-600 { --tw-gradient-from: ${theme.color_primary} !important; }
      .to-teal-700   { --tw-gradient-to: ${theme.color_primary_dark} !important; }

      /* Accent hero (amber) */
      .bg-amber-700 { background-color: ${theme.color_accent} !important; }
      .bg-amber-800 { background-color: ${theme.color_accent_dark} !important; }
      .hover\\:bg-amber-800:hover { background-color: ${theme.color_accent_dark} !important; }
      .hover\\:bg-amber-700:hover { background-color: ${theme.color_accent} !important; }
      .text-amber-100 { color: ${theme.color_accent_light} !important; }
      .text-amber-50  { color: ${theme.color_accent_light} !important; }

      /* Ring focus */
      .focus\\:ring-teal-500:focus { --tw-ring-color: ${theme.color_primary} !important; }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('*')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Errore caricamento immagini:', error);
          return;
        }

        if (data) {
          if (data.hero_url) setHeroImage(data.hero_url);
          if (data.logo_url) setLogoImage(data.logo_url);
          if (data.gallery_urls && data.gallery_urls.length > 0) {
            const normalized = data.gallery_urls.map((item, index) =>
              typeof item === 'string'
                ? { src: item, alt: `Foto ${index + 1}` }
                : { src: item.url, alt: item.alt || `Foto ${index + 1}` }
            );
            setGalleryImages(normalized);
          }
        }
      } catch (error) {
        console.error('Errore nel caricamento immagini:', error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await reviewService.getActiveReviews();
        setReviews(data);
      } catch (error) {
        console.error('Errore caricamento recensioni:', error);
      }
      setReviewsLoading(false);
    };

    loadReviews();
  }, []);

  useEffect(() => {
    const loadDynamicSections = async () => {
      setSectionsLoading(true);
      try {
        const sections = await contentService.getSectionVisibility();
        const visibleSections = sections
          .filter(section => section.is_visible && sectionComponents[section.section_name])
          .sort((a, b) => (a.order_position || 0) - (b.order_position || 0));
        setDynamicSections(visibleSections);
      } catch (error) {
        console.error('Errore caricamento sezioni dinamiche:', error);
      }
      setSectionsLoading(false);
    };

    loadDynamicSections();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-teal-100 via-teal-50 to-teal-100">
      <Popup />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="#top" className="cursor-pointer">
              <img src={logoImage} alt="Iremia" className="h-40" />
            </a>
            
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#appartamento" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">L'Appartamento</a>
              <a href="#galleria" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Galleria</a>
              <a href="#zona" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">La Zona</a>
              <a href="#contatti" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Contatti</a>
              <a href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare" target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Prenota</a>
            </nav>

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

          <div id="mobile-menu" className="hidden md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <a href="#appartamento" className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>L'Appartamento</a>
              <a href="#galleria" className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Galleria</a>
              <a href="#zona" className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>La Zona</a>
              <a href="#contatti" className="text-gray-700 hover:text-teal-600 font-medium transition-colors py-2 border-b border-gray-200" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Contatti</a>
              <a href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare" target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 transition-colors text-center font-medium">Prenota su WhatsApp</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Hero heroImage={heroImage} />
        <Apartment />
        <HouseRules />
        
        {!sectionsLoading && dynamicSections.map((section) => {
          const SectionComponent = sectionComponents[section.section_name];
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
