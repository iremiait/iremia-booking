import React, { useState } from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import ImageManager from './ImageManager';
import ReviewManager from './ReviewManager';
import AboutManager from './AboutManager';
import ActivityManager from './ActivityManager';
import RestaurantManager from './RestaurantManager';
import POIManager from './POIManager';
import FAQManager from './FAQManager';
import ContentVisibilityManager from './ContentVisibilityManager';
import HouseRulesManager from './HouseRulesManager';
import ContactInfoManager from './ContactInfoManager';
import HeroSectionManager from './HeroSectionManager';
import PopupManager from './PopupManager';
import ThemeManager from './ThemeManager';
import ApartmentManager from './ApartmentManager';
import ZoneManager from './ZoneManager';

const PopupDashboard = ({ onLogout }) => {
  const tabs = [
    { id: 'images', label: 'Immagini', icon: '🖼️', component: ImageManager },
    { id: 'reviews', label: 'Recensioni', icon: '⭐', component: ReviewManager },
    { id: 'hero', label: 'Hero Section', icon: '🎯', component: HeroSectionManager },
    { id: 'apartment', label: 'Appartamento', icon: '🏠', component: ApartmentManager },
    { id: 'zone', label: 'La Zona', icon: '🗺️', component: ZoneManager },
    { id: 'about', label: 'Chi Siamo', icon: 'ℹ️', component: AboutManager },
    { id: 'houseRules', label: 'Regole Casa', icon: '📋', component: HouseRulesManager },
    { id: 'contact', label: 'Contatti', icon: '📧', component: ContactInfoManager },
    { id: 'activities', label: 'Attività', icon: '🎿', component: ActivityManager },
    { id: 'restaurants', label: 'Ristoranti', icon: '🍽️', component: RestaurantManager },
    { id: 'poi', label: 'POI', icon: '📍', component: POIManager },
    { id: 'faq', label: 'FAQ', icon: '❓', component: FAQManager },
    { id: 'popup', label: 'Popup', icon: '💬', component: PopupManager },
    { id: 'visibility', label: 'Visibilità', icon: '👁️', component: ContentVisibilityManager },
    { id: 'theme', label: 'Tema', icon: '🎨', component: ThemeManager },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  const handleLogout = async () => {
    if (confirm('Sei sicuro di voler uscire?')) {
      await onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard Admin</h1>
            <p className="text-gray-600">Gestisci tutti i contenuti del sito Iremia</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm font-medium"
            >
              <ExternalLink size={18} />
              Vai al sito
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm font-medium"
            >
              <LogOut size={18} />
              Esci
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-x-auto">
          <div className="flex gap-2 p-4 min-w-min">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-700 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {ActiveComponent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">{activeTabData.icon}</span>
                {activeTabData.label}
              </h2>
              <ActiveComponent />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Componente non trovato</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Iremia Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default PopupDashboard;
