import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
      {title}
    </h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
      {children}
    </div>
  </div>
);

const Privacy = () => {
  const lastUpdate = '30 maggio 2026';

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, var(--color-primary-100), var(--color-primary-50))' }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-75"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={18} />
            Torna al sito
          </a>
          <span style={{ color: 'var(--color-primary-100)' }}>|</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Privacy Policy
          </span>
        </div>
      </header>

      {/* Contenuto */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="rounded-2xl shadow-sm p-8 sm:p-12"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-100)' }}
        >
          {/* Titolo */}
          <div className="mb-10 pb-6" style={{ borderBottom: '1px solid var(--color-primary-100)' }}>
            <h1 className="text-3xl font-light mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Ultimo aggiornamento: {lastUpdate}
            </p>
          </div>

          <Section title="1. Titolare del trattamento">
            <p>
              Il titolare del trattamento dei dati personali è:
            </p>
            <div
              className="rounded-lg p-4 mt-2"
              style={{ backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)' }}
            >
              <p><strong>Andrea Longo</strong></p>
              <p>Via per Palagano 28, 41023 Lama Mocogno (MO)</p>
              <p>Email: <a href="mailto:iremiait@gmail.com" style={{ color: 'var(--color-primary)' }}>iremiait@gmail.com</a></p>
              <p>Telefono: <a href="tel:+393474160611" style={{ color: 'var(--color-primary)' }}>+39 347 416 0611</a></p>
            </div>
          </Section>

          <Section title="2. Dati raccolti e finalità">
            <p>
              Il sito <strong>iremia.it</strong> raccoglie dati personali esclusivamente attraverso lo strumento
              di analisi statistica Google Analytics. Non vengono raccolti, memorizzati o trattati altri dati
              personali dei visitatori.
            </p>
            <p>
              <strong>Google Analytics</strong> raccoglie in modo anonimo informazioni sulla navigazione
              (pagine visitate, durata della visita, provenienza geografica approssimativa, tipo di dispositivo
              e browser) al solo scopo di migliorare l'esperienza del sito e comprendere il comportamento
              degli utenti in forma aggregata.
            </p>
            <p>
              L'indirizzo IP viene anonimizzato prima di qualsiasi elaborazione. Non vengono raccolti
              dati che permettano l'identificazione diretta del visitatore.
            </p>
            <p>
              Il form di contatto presente nel sito invia i messaggi direttamente via email al titolare
              tramite il servizio EmailJS. I dati inseriti (nome, email, messaggio) <strong>non vengono
              memorizzati</strong> in alcun database del sito e non sono soggetti a ulteriore trattamento.
            </p>
          </Section>

          <Section title="3. Base giuridica del trattamento">
            <p>
              Il trattamento tramite Google Analytics avviene esclusivamente previo consenso esplicito
              dell'utente, espresso attraverso il banner cookie presentato al primo accesso al sito,
              ai sensi dell'art. 6, par. 1, lett. a) del Regolamento UE 2016/679 (GDPR).
            </p>
            <p>
              In assenza di consenso, Google Analytics non viene attivato e nessun dato viene raccolto.
            </p>
          </Section>

          <Section title="4. Destinatari dei dati">
            <p>
              I dati raccolti tramite Google Analytics vengono trattati da Google LLC, con sede negli
              Stati Uniti, in qualità di responsabile del trattamento. Google aderisce al framework
              EU-US Data Privacy Framework, garantendo un livello adeguato di protezione dei dati
              ai sensi dell'art. 45 GDPR.
            </p>
            <p>
              I dati non vengono ceduti, venduti o comunicati ad altri soggetti terzi.
            </p>
          </Section>

          <Section title="5. Periodo di conservazione">
            <p>
              I dati statistici raccolti da Google Analytics vengono conservati per un periodo massimo
              di 26 mesi, dopodiché vengono eliminati automaticamente.
            </p>
            <p>
              I messaggi inviati tramite il form di contatto vengono conservati nella casella email
              del titolare per il tempo necessario a gestire la comunicazione.
            </p>
          </Section>

          <Section title="6. Diritti dell'interessato">
            <p>
              In conformità al GDPR, ogni visitatore ha il diritto di:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Accedere ai propri dati personali (art. 15)</li>
              <li>Richiederne la rettifica (art. 16)</li>
              <li>Richiederne la cancellazione (art. 17)</li>
              <li>Opporsi al trattamento (art. 21)</li>
              <li>Revocare il consenso in qualsiasi momento (art. 7, par. 3)</li>
              <li>Proporre reclamo all'Autorità Garante per la protezione dei dati personali</li>
            </ul>
            <p className="mt-3">
              Per esercitare questi diritti è possibile contattare il titolare all'indirizzo{' '}
              <a href="mailto:iremiait@gmail.com" style={{ color: 'var(--color-primary)' }}>
                iremiait@gmail.com
              </a>.
            </p>
            <p>
              Il consenso ai cookie analitici può essere revocato in qualsiasi momento cancellando
              i cookie dal proprio browser o utilizzando la{' '}
              <a href="/cookie" style={{ color: 'var(--color-primary)' }}>
                pagina di gestione cookie
              </a>.
            </p>
          </Section>

          <Section title="7. Cookie">
            <p>
              Per informazioni dettagliate sui cookie utilizzati da questo sito, consulta la nostra{' '}
              <a href="/cookie" style={{ color: 'var(--color-primary)' }}>
                Cookie Policy
              </a>.
            </p>
          </Section>

          <Section title="8. Sicurezza">
            <p>
              Il sito è ospitato su infrastruttura Vercel con connessione cifrata HTTPS. Il database
              dei contenuti è gestito tramite Supabase, che adotta misure di sicurezza conformi agli
              standard del settore. Nessun dato personale dei visitatori è memorizzato nel database.
            </p>
          </Section>

          <Section title="9. Modifiche alla presente policy">
            <p>
              Il titolare si riserva il diritto di modificare la presente Privacy Policy in qualsiasi
              momento. Le modifiche saranno pubblicate su questa pagina con aggiornamento della data
              in cima al documento.
            </p>
          </Section>

          {/* Footer documento */}
          <div
            className="mt-10 pt-6 text-xs"
            style={{ borderTop: '1px solid var(--color-primary-100)', color: 'var(--color-text-muted)' }}
          >
            <p>Titolare: Andrea Longo · iremiait@gmail.com · Lama Mocogno (MO)</p>
            <p className="mt-1">
              Autorità Garante:{' '}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)' }}
              >
                www.garanteprivacy.it
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
