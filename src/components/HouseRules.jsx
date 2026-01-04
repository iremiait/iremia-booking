import React from 'react';

const HouseRules = () => {
  return (
    <div className="mt-16 bg-white/80 backdrop-blur rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-teal-100">
      <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
        Regole della Casa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🕐</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Check-in / Check-out</h4>
            <p className="text-gray-600 text-sm">Check-in: 16:00 - 21:00</p>
            <p className="text-gray-600 text-sm">Check-out: entro le 11:00</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🚭</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Vietato fumare</h4>
            <p className="text-gray-600 text-sm">È vietato fumare all'interno dell'appartamento</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🐾</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Animali non ammessi</h4>
            <p className="text-gray-600 text-sm">Spiacenti, non possiamo accettare animali domestici</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Feste ed eventi</h4>
            <p className="text-gray-600 text-sm">Non sono permesse feste o eventi</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤫</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Silenzio notturno</h4>
            <p className="text-gray-600 text-sm">Rispetto della quiete dopo le 23:00</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-2xl">♻️</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Gestione rifiuti</h4>
            <p className="text-gray-600 text-sm">Da gestire personalmente secondo le indicazioni fornite</p>
          </div>
        </div>
      </div>
      
      {/* Pulsante Airbnb */}
      <div className="mt-8 pt-8 border-t border-teal-200 text-center">
        <p className="text-gray-600 mb-4">Preferisci prenotare tramite Airbnb?</p>
        <a 
          href="https://airbnb.it/h/iremia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#E14348] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
            <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
          </svg>
          Prenota su Airbnb
        </a>
      </div>
    </div>
  );
};

export default HouseRules;
