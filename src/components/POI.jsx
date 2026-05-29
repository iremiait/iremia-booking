import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, ExternalLink } from 'lucide-react';
import { contentService } from '../lib/contentService';

const POI = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => { loadPOIs(); }, []);

  const loadPOIs = async () => {
    try {
      const data = await contentService.getPOIs();
      setPois(data.filter(p => p.is_active));
    } catch (error) {
      console.error('Errore caricamento POI:', error);
    }
    setLoading(false);
  };

  const types = [
    { value: 'all', label: 'Tutti i luoghi', icon: '🗺️' },
    { value: 'natura', label: 'Natura', icon: '🌲' },
    { value: 'cultura', label: 'Cultura', icon: '🏛️' },
    { value: 'sport', label: 'Sport', icon: '⛷️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'benessere', label: 'Benessere', icon: '💆' },
    { value: 'altro', label: 'Altro', icon: '📍' }
  ];

  const getTypeIcon = (type) => types.find(t => t.value === type)?.icon || '📍';
  const getTypeLabel = (type) => types.find(t => t.value === type)?.label || type;
  const filteredPOIs = selectedType === 'all' ? pois : pois.filter(p => p.type === selectedType);

  if (loading) return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </section>
  );

  if (pois.length === 0) return null;

  return (
    <section id="poi" className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Punti di Interesse
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Luoghi da visitare nei dintorni
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {types.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 border-2"
              style={selectedType === type.value
                ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                : { backgroundColor: 'white', color: 'var(--color-text-secondary)', borderColor: 'var(--color-primary-100)' }
              }
            >
              <span>{type.icon}</span>{type.label}
            </button>
          ))}
        </div>

        {filteredPOIs.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-muted)' }}>Nessun punto di interesse in questa categoria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPOIs.map((poi) => (
              <div key={poi.id} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
                {poi.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img src={poi.image_url} alt={poi.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                        {getTypeIcon(poi.type)} {getTypeLabel(poi.type)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{poi.name}</h3>
                  {poi.description && (
                    <p className="mb-4 line-clamp-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{poi.description}</p>
                  )}
                  <div className="space-y-2 text-sm mb-4">
                    {poi.location && (
                      <div className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <MapPin size={16} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0 mt-0.5" />
                        <span>{poi.location}</span>
                      </div>
                    )}
                    {poi.distance && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Car size={16} style={{ color: 'var(--color-primary)' }} />
                        <span>{poi.distance}</span>
                      </div>
                    )}
                    {poi.opening_hours && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                        <span>{poi.opening_hours}</span>
                      </div>
                    )}
                    {poi.price && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>€</span>
                        <span>{poi.price}</span>
                      </div>
                    )}
                  </div>
                  {poi.link && (
                    <div className="pt-4" style={{ borderTop: '1px solid var(--color-primary-100)' }}>
                      <a href={poi.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-sm hover:opacity-75 transition" style={{ color: 'var(--color-primary)' }}>
                        <ExternalLink size={16} />Maggiori informazioni →
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

export default POI;
