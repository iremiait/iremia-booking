import React from 'react';

const Reviews = ({ reviews, loading }) => {
  return (
    <>
      {/* Recensioni Google - DINAMICHE DA SUPABASE */}
      <div className="mt-20 max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-light text-gray-800 mb-4 text-center">
          Cosa dicono i nostri ospiti
        </h3>
        <p className="text-center text-gray-600 mb-8">
          Le recensioni dei nostri ospiti su Google
        </p>
        
        {/* Grid Recensioni */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Caricamento recensioni...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nessuna recensione disponibile al momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">{review.time_ago}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{review.review_text}"
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {review.author_initials}
                  </div>
                  <span className="text-gray-600 font-medium">{review.author_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Link Google Business */}
        <div className="mt-8 text-center">
          <a 
            href="https://maps.app.goo.gl/oZV9f4zYBXhmq1fr9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Vedi tutte le recensioni su Google
          </a>
        </div>
      </div>

      {/* CTA Button - Sotto le recensioni */}
      <div className="mt-12 text-center">
        <a 
          href="https://wa.me/393474160611?text=Ciao!%20Vorrei%20prenotare%20un%20soggiorno%20a%20Iremia" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          Prenota il tuo soggiorno
        </a>
        <p className="text-gray-500 text-sm mt-4">
          Sempre a vostra disposizione
        </p>
      </div>

      {/* La Zona */}
      <div id="zona" className="mt-20 bg-gradient-to-br from-teal-100 to-teal-50 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-200">
        <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
          La Zona
        </h3>
        <div className="text-gray-600 leading-relaxed space-y-4">
          <p>
            Lama Mocogno è un piccolo paese dell'Appennino Modenese a 850 m s.l.m., ideale per sfuggire al caldo della pianura nei periodi estivi e per passare qualche giornata sulla neve d'inverno.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-3">⛷️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Piste da Sci</h4>
              <p className="text-sm text-gray-600">
                Vicinissimi alle Piane di Mocogno e a 30' dal comprensorio del Cimone
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h4 className="font-semibold text-gray-800 mb-2">Via Vandelli</h4>
              <p className="text-sm text-gray-600">
                Sulla storica Via Vandelli del 1738, da Modena a Massa
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏔️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Frignano</h4>
              <p className="text-sm text-gray-600">
                Nel cuore del territorio del Frignano, tra natura e tradizione
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
