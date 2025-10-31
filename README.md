# 🏠 Iremia - Casa Vacanza Booking System

Casa vacanza a Lama Mocogno con sistema di prenotazione integrato.

## 📋 Struttura del Progetto
```
iremia-booking/
├── public/
│   ├── logo.png              # Logo Iremia (da aggiungere)
│   └── images/               # Galleria foto (da aggiungere)
│       ├── soggiorno.jpg
│       ├── camera.jpg
│       ├── balcone.jpg
│       └── ...
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Componente principale
│   └── index.css             # Stili globali
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Setup Locale

### 1. Clona il repository
```bash
git clone https://github.com/iremiait/iremia-booking.git
cd iremia-booking
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Aggiungi il logo e le foto
- Inserisci il logo in `public/logo.png`
- Inserisci le foto in `public/images/`

### 4. Avvia il server di sviluppo
```bash
npm run dev
```

Il sito sarà disponibile su `http://localhost:3000`

## 📦 Deploy su Vercel

### 1. Crea un account su Vercel
Vai su [vercel.com](https://vercel.com) e registrati con GitHub

### 2. Importa il progetto
- Clicca su "New Project"
- Seleziona il repository `iremiait/iremia-booking`
- Vercel rileverà automaticamente che è un progetto Vite

### 3. Configura il build
Le impostazioni dovrebbero essere automatiche:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Deploy!
Clicca su "Deploy" e attendi qualche minuto

### 5. Collega il dominio iremia.it
- Vai su Settings > Domains
- Aggiungi `iremia.it` e `www.iremia.it`
- Segui le istruzioni per configurare i DNS

## 🎨 Personalizzazione

### Modificare i colori
Modifica `tailwind.config.js`:
```javascript
colors: {
  teal: {
    600: '#TUO_COLORE',
  }
}
```

### Aggiungere foto vere
Sostituisci i placeholder in `src/App.jsx`:
```jsx
<img src="/images/soggiorno.jpg" alt="Soggiorno" className="w-full h-full object-cover rounded-lg" />
```

### Modificare testi
Modifica direttamente `src/App.jsx`

## 🔧 Comandi Utili
```bash
npm run dev      # Avvia il server di sviluppo
npm run build    # Crea la build di produzione
npm run preview  # Anteprima della build
```

## 📱 Prossimi Step

- [ ] Aggiungere logo e foto
- [ ] Setup Supabase per database
- [ ] Creare sistema di prenotazione
- [ ] Aggiungere dashboard admin
- [ ] Integrare pagamenti Stripe

## 📞 Contatti

**Email**: iremiait@gmail.com  
**Telefono/WhatsApp**: +39 347 416 0611  
**Instagram**: [@iremiait](https://instagram.com/iremiait)

---

Sviluppato con ❤️ per Andrea e Iza
