import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Star, Utensils } from 'lucide-react';
import { contentService } from '../lib/contentService';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => { loadRestaurants(); }, []);

  const loadRestaurants = async () => {
    try {
      const data = await contentService.getRestaurants();
      setRestaurants(data.filter(r => r.is_active));
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

  const getCategoryLabel = (cat) => categories.find(c => c.value === cat)?.label || cat;
  const getCategoryIcon = (cat) => categories.find(c => c.value === cat)?.icon || '🍽️';
  const filteredRestaurants = selectedCategory === 'all' ? restaurants : restaurants.filter(r => r.category === selectedCategory);

  if (loading) return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </section>
  );

  if (restaurants.length === 0) return null;

  return (
    <section id="restaurants" className="py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Ristoranti & Locali
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            I nostri consigli per mangiare bene
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 border-2"
              style={selectedCategory === category.value
                ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                : { backgroundColor: 'white', color: 'var(--color-text-secondary)', borderColor: 'var(--color-primary-100)' }
              }
            >
              <span>{category.icon}</span>{category.label}
            </button>
          ))}
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-muted)' }}>Nessun locale disponibile in questa categoria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
                {restaurant.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                        {getCategoryIcon(restaurant.category)} {getCategoryLabel(restaurant.category)}
                      </span>
                    </div>
                    {restaurant.rating && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded-full">
                        <Star size={14} className="fill-yellow-600 text-yellow-600" />
                        <span className="text-xs font-semibold text-yellow-900">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="mb-4 line-clamp-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{restaurant.description}</p>
                  )}
                  <div className="space-y-2 text-sm mb-4">
                    {restaurant.address && (
                      <div className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <MapPin size={16} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0 mt-0.5" />
                        <span>{restaurant.address}</span>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                        <a href={`tel:${restaurant.phone}`} className="hover:opacity-75">{restaurant.phone}</a>
                      </div>
                    )}
                    {restaurant.cuisine && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Utensils size={16} style={{ color: 'var(--color-primary)' }} />
                        <span>{restaurant.cuisine}</span>
                      </div>
                    )}
                    {restaurant.price_range && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>€</span>
                        <span>{restaurant.price_range}</span>
                      </div>
                    )}
                  </div>
                  {restaurant.website && (
                    <div className="pt-4" style={{ borderTop: '1px solid var(--color-primary-100)' }}>
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-sm hover:opacity-75 transition" style={{ color: 'var(--color-primary)' }}>
                        <Globe size={16} />Visita il sito →
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
