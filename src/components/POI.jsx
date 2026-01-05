import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, ExternalLink } from 'lucide-react';
import { contentService } from '../lib/contentService';

const POI = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    try {
      const data = await contentService.getPOIs();
      setPois(data.filter(poi => poi.is_active));
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

  const getTypeIcon = (type) => {
    const typeData = types.find(t => t.value === type);
    return typeData ? typeData.icon : '📍';
  };

  const getTypeLabel = (type) => {
    const typeData = types.find(t => t.value === type);
    return typeData ? typeData.label : type;
  };

  const filteredPOIs = selectedType === 'all' 
    ? pois 
    : pois.filter(poi => poi.type === selectedType);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (pois.length === 0) {
    return null;
  }

  return (
    <section id="poi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Punti di Interesse
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Luoghi da visitare nei dintorni
          </p>
        </div>

        {/* Filtri Tipo */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {types.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition flex items-center gap-2 border-2 ${
                selectedType === type.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-600'
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Lista POI */}
        {filteredPOIs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nessun punto di interesse in questa categoria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition group"
              >
                {/* Immagine */}
                {poi.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={poi.image_url}
                      alt={poi.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Badge Tipo */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                        {getTypeIcon(poi.type)} {getTypeLabel(poi.type)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contenuto */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {poi.name}
                  </h3>
                  
                  {poi.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {poi.description}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-2 text-sm mb-4">
                    {poi.location && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{poi.location}</span>
                      </div>
                    )}
                    
                    {poi.distance && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Car size={16} className="text-teal-600 flex-shrink-0" />
                        <span>{poi.distance}</span>
                      </div>
                    )}

                    {poi.opening_hours && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-teal-600 flex-shrink-0" />
                        <span>{poi.opening_hours}</span>
                      </div>
                    )}

                    {poi.price && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-teal-600 font-semibold">€</span>
                        <span>{poi.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  {poi.link && (
                    <div className="pt-4 border-t border-gray-100">
                      <a
                        href={poi.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                      >
                        <ExternalLink size={16} />
                        Maggiori informazioni →
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
