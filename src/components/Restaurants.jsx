import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Star, Utensils } from 'lucide-react';
import { contentService } from '../lib/contentService';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await contentService.getRestaurants();
      setRestaurants(data.filter(restaurant => restaurant.is_active));
    } catch (error) {
      console.error('Errore caricamento ristoranti:', error);
    }
    setLoading(false);
  };

  const categories = [
    { value: 'all', label: 'Tutti', icon: '🍽️' },
    { value: 'ristorante', label: 'Ristoranti', icon: '🍝' },
    { value: 'pizzeria', label: 'Pizzerie', icon: '🍕' },
    { value: 'bar', label: 'Bar & Caffè', icon: '☕' },
    { value: 'trattoria', label: 'Trattorie', icon: '🏠' },
    { value: 'altro', label: 'Altro', icon: '🍴' }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '🍽️';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const filteredRestaurants = selectedCategory === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <section id="restaurants" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Ristoranti & Locali
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I nostri consigli per mangiare bene
          </p>
        </div>

        {/* Filtri Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition flex items-center gap-2 border-2 ${
                selectedCategory === category.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Lista Ristoranti */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nessun locale disponibile in questa categoria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition group"
              >
                {/* Immagine */}
                {restaurant.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Badge Categoria */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                        {getCategoryIcon(restaurant.category)} {getCategoryLabel(restaurant.category)}
                      </span>
                    </div>

                    {/* Rating */}
                    {restaurant.rating && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded-full">
                        <Star size={14} className="fill-yellow-600 text-yellow-600" />
                        <span className="text-xs font-semibold text-yellow-900">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Contenuto */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  
                  {restaurant.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {restaurant.description}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-2 text-sm mb-4">
                    {restaurant.address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{restaurant.address}</span>
                      </div>
                    )}
                    
                    {restaurant.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-teal-600 flex-shrink-0" />
                        <a href={`tel:${restaurant.phone}`} className="hover:text-teal-600">
                          {restaurant.phone}
                        </a>
                      </div>
                    )}

                    {restaurant.cuisine && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Utensils size={16} className="text-teal-600 flex-shrink-0" />
                        <span>{restaurant.cuisine}</span>
                      </div>
                    )}

                    {restaurant.price_range && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-teal-600 font-semibold">€</span>
                        <span>{restaurant.price_range}</span>
                      </div>
                    )}
                  </div>

                  {/* Link Sito Web */}
                  {restaurant.website && (
                    <div className="pt-4 border-t border-gray-100">
                      
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                      >
                        <Globe size={16} />
                        Visita il sito →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Restaurants;
