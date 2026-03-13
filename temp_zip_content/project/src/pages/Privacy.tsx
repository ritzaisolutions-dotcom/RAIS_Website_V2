import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
            <Logo size={32} className="text-industrial-orange-bright" />
            <span className="font-mono text-2xl font-bold tracking-wider text-gray-900">RAIS</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-industrial-orange-bright transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <article className="prose prose-gray max-w-none">
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
          <p className="text-sm text-gray-500 mb-8">Stand: 28.01.2026</p>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">1. VERANTWORTLICHER</h2>
            <div className="space-y-1 text-gray-700">
              <p>Kevin Ritz</p>
              <p>Von-Cohausenstrasse 9</p>
              <p>56076 Koblenz</p>
              <p className="mt-2">
                E-Mail:{' '}
                <a
                  href="mailto:ritzaisolutions@gmail.com"
                  className="text-industrial-orange-bright hover:underline"
                >
                  ritzaisolutions@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">2. HOSTING</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Diese Website wird gehostet bei:<br />
                <strong>StackBlitz Inc. (Bolt.new)</strong><br />
                USA, übermittelt unter EU-US Data Privacy Framework
              </p>
              <p>
                Der Hoster verarbeitet Daten ausschließlich nach unseren Weisungen und unter Einhaltung
                der DSGVO-Standards.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">3. EXTERNE TOOLS & DIENSTE</h2>
            <div className="text-gray-700 space-y-3">
              <p className="font-semibold">KI-Demonstrationen</p>
              <p>Für Funktionsdemonstrationen nutzen wir folgende KI-Tools:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>n8n (selbst gehostet):</strong> Workflow-Automatisierung. Keine personenbezogenen Daten.
                </li>
                <li>
                  <strong>Voiceflow (EU-Server):</strong> Chatbot-Demos. Anonymisierte Interaktionen.
                </li>
                <li>
                  <strong>OpenAI/Claude (EU-Region):</strong> AI-Modelle für Beispielanwendungen. Anonymisiert, keine Speicherung.
                </li>
              </ul>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Produktdemonstrationen).
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">4. ALLGEMEINE HINWEISE</h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <p className="font-semibold mb-2">Server-Log-Dateien</p>
                <p>
                  Bei jedem Zugriff auf diese Website werden automatisch Informationen erfasst: IP-Adresse,
                  Browser-Typ, Betriebssystem, Referrer-URL und Zugriffszeitpunkt.
                </p>
                <p className="mt-1">
                  <strong>Speicherdauer:</strong> 7 Tage
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
                  technischer Sicherheit und Optimierung)
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Cookies</p>
                <p>
                  Diese Website verwendet ausschließlich technisch notwendige Session-Cookies zur
                  Gewährleistung der Funktionalität. Eine Zustimmung ist nicht erforderlich.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">5. DATENERFASSUNG</h2>
            <div className="text-gray-700 space-y-2">
              <p className="font-semibold mb-2">Kontaktformular</p>
              <p>
                Wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren, werden Ihre Angaben
                (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert.
              </p>
              <p>
                <strong>Speicherdauer:</strong> 6 Monate
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">6. IHRE RECHTE</h2>
            <div className="text-gray-700 space-y-2">
              <p>Sie haben jederzeit das Recht auf:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Auskunft über Ihre gespeicherten Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung Ihrer Daten</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerspruch gegen die Verarbeitung</li>
              </ul>
              <p className="mt-4">
                Zur Ausübung Ihrer Rechte senden Sie bitte eine E-Mail an{' '}
                <a
                  href="mailto:ritzaisolutions@gmail.com"
                  className="text-industrial-orange-bright hover:underline"
                >
                  ritzaisolutions@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">Beschwerderecht</h2>
            <div className="text-gray-700">
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren:
              </p>
              <p className="mt-2">
                <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong><br />
                <a
                  href="https://www.lda.bayern.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-industrial-orange-bright hover:underline"
                >
                  www.lda.bayern.de
                </a>
              </p>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500 italic">
            <p>
              Diese Datenschutzerklärung wurde erstellt unter Berücksichtigung der
              Datenschutz-Grundverordnung (DSGVO) und des Telekommunikation-Telemedien-Datenschutz-Gesetzes (TTDSG).
            </p>
          </div>
        </article>
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>&copy; 2025 Ritz AI Solutions</p>
            <div className="flex gap-6">
              <Link to="/impressum" className="hover:text-industrial-orange-bright transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="hover:text-industrial-orange-bright transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
