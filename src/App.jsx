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

function App() {
  // Stati per immagini dinamiche da Supabase
  const [heroImage, setHeroImage] = useState('/images/lama.jpg');
  const [logoImage, setLogoImage] = useState('/logo.png');
  const [galleryImages, setGalleryImages] = useState([
    { src: '/images/soggiorno.jpg', alt: 'Soggiorno' },
    { src: '/images/camera.jpg', alt: 'Camera' },
    { src: '/images/balcone.jpg', alt: 'Balcone' },
    { src: '/images/cucina.jpg', alt: 'Cucina' },
    { src: '/images/cimone.jpg', alt: 'Cimone' },
    { src: '/images/vandelli.jpg', alt: 'Via Vandelli' },
    { src: '/images/bagno.jpg', alt: 'Bagno' },
    { src: '/images/pontedeldiavolo.jpg', alt: 'Ponte del Diavolo' }
  ]);

  // Stati per recensioni dinamiche
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Stati per sezioni dinamiche
  const [dynamicSections, setDynamicSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // Mappa dei componenti dinamici
  const sectionComponents = {
    'about': About,
    'activities': Activities,
    'restaurants': Restaurants,
    'poi': POI,
    'faqs': FAQs
  };

  // Carica immagini da Supabase all'avvio
  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Errore caricamento immagini:', error);
          return;
        }

        if (data) {
          if (data.hero_url) {
            setHeroImage(data.hero_url);
          }
          if (data.logo_url) {
            setLogoImage(data.logo_url);
          }
          if (data.gallery_urls && data.gallery_urls.length > 0) {
            const dynamicGallery = data.gallery_urls.map((url, index) => ({
              src: url,
              alt: `Foto ${index + 1}`
            }));
            setGalleryImages(dynamicGallery);
          }
        }
      } catch (error) {
        console.error('Errore nel caricamento immagini:', error);
      }
    };

    loadImages();
  }, []);

  // Carica recensioni da Supabase
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

  // Carica sezioni dinamiche visibili
  useEffect(() => {
    const loadDynamicSections = async () => {
      setSectionsLoading(true);
      try {
        const sections = await contentService.getSectionVisibility();
        
        // Filtra solo sezioni visibili e ordina per order_position
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

      {/* MAIN CONTENT */}
      <main>
        <Hero heroImage={heroImage} />
        <Apartment />
        <HouseRules />
        
        {/* SEZIONI DINAMICHE - Riordinabili dalla Dashboard */}
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
