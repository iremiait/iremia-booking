import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { contentService } from '../lib/contentService';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await contentService.getActivities();
      setActivities(data.filter(activity => activity.is_active));
    } catch (error) {
      console.error('Errore caricamento attività:', error);
    }
    setLoading(false);
  };

  const seasons = [
    { value: 'all', label: 'Tutto l\'anno', icon: '🌍', color: 'gray' },
    { value: 'estate', label: 'Estate', icon: '☀️', color: 'yellow' },
    { value: 'inverno', label: 'Inverno', icon: '❄️', color: 'blue' },
    { value: 'primavera', label: 'Primavera', icon: '🌸', color: 'pink' },
    { value: 'autunno', label: 'Autunno', icon: '🍂', color: 'orange' }
  ];

  const getSeasonColor = (season) => {
    const colors = {
      estate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      inverno: 'bg-blue-100 text-blue-700 border-blue-200',
      primavera: 'bg-pink-100 text-pink-700 border-pink-200',
      autunno: 'bg-orange-100 text-orange-700 border-orange-200',
      all: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[season] || colors.all;
  };

  const getSeasonIcon = (season) => {
    const seasonData = seasons.find(s => s.value === season);
    return seasonData ? seasonData.icon : '🌍';
  };

  const filteredActivities = selectedSeason === 'all' 
    ? activities 
    : activities.filter(activity => activity.season === selectedSeason);

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

  if (activities.length === 0) {
    return null;
  }

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Attività & Esperienze
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri cosa fare durante il tuo soggiorno
          </p>
        </div>

        {/* Filtri Stagione */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasons.map(season => (
            <button
              key={season.value}
              onClick={() => setSelectedSeason(season.value)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition flex items-center gap-2 border-2 ${
                selectedSeason === season.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-600'
              }`}
            >
              <span>{season.icon}</span>
              {season.label}
            </button>
          ))}
        </div>

        {/* Lista Attività */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nessuna attività disponibile per questa stagione
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition group"
              >
                {/* Immagine */}
                {activity.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Badge Stagione */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 backdrop-blur-sm ${getSeasonColor(activity.season)}`}>
                        {getSeasonIcon(activity.season)} {seasons.find(s => s.value === activity.season)?.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contenuto */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {activity.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {activity.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    {activity.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} className="text-teal-600 flex-shrink-0" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.duration && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-teal-600 flex-shrink-0" />
                        <span>{activity.duration}</span>
                      </div>
                    )}

                    {activity.price && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-teal-600 font-semibold">€</span>
                        <span>{activity.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  {activity.link && (
                    <div className="mt-6">
                      
                        href={activity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Scopri di più →
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

export default Activities;
