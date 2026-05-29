import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { contentService } from '../lib/contentService';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('all');

  useEffect(() => { loadActivities(); }, []);

  const loadActivities = async () => {
    try {
      const data = await contentService.getActivities();
      setActivities(data.filter(a => a.is_active));
    } catch (error) {
      console.error('Errore caricamento attività:', error);
    }
    setLoading(false);
  };

  const seasons = [
    { value: 'all', label: 'Tutto l\'anno', icon: '🌍' },
    { value: 'estate', label: 'Estate', icon: '☀️' },
    { value: 'inverno', label: 'Inverno', icon: '❄️' },
    { value: 'primavera', label: 'Primavera', icon: '🌸' },
    { value: 'autunno', label: 'Autunno', icon: '🍂' }
  ];

  const filteredActivities = selectedSeason === 'all' ? activities : activities.filter(a => a.season === selectedSeason);

  if (loading) return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </section>
  );

  if (activities.length === 0) return null;

  return (
    <section id="activities" className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Attività & Esperienze
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Scopri cosa fare durante il tuo soggiorno
          </p>
        </div>

        {/* Filtri */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasons.map(season => (
            <button
              key={season.value}
              onClick={() => setSelectedSeason(season.value)}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 border-2"
              style={selectedSeason === season.value
                ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                : { backgroundColor: 'white', color: 'var(--color-text-secondary)', borderColor: 'var(--color-primary-100)' }
              }
            >
              <span>{season.icon}</span>{season.label}
            </button>
          ))}
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-muted)' }}>Nessuna attività disponibile per questa stagione</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}>
                {activity.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{activity.title}</h3>
                  <p className="mb-4 line-clamp-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{activity.description}</p>
                  <div className="space-y-2 text-sm">
                    {activity.location && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <MapPin size={16} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    {activity.duration && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Clock size={16} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0" />
                        <span>{activity.duration}</span>
                      </div>
                    )}
                    {activity.price && (
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>€</span>
                        <span>{activity.price}</span>
                      </div>
                    )}
                  </div>
                  {activity.link && (
                    <div className="mt-6">
                      <a href={activity.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-75 transition" style={{ color: 'var(--color-primary)' }}>
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
