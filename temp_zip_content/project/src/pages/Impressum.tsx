import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export default function Impressum() {
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
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-8">Impressum</h1>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-1 text-gray-700">
              <p>Kevin Ritz</p>
              <p>Von-Cohausenstrasse 9</p>
              <p>56076 Koblenz</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">Kontakt</h2>
            <div className="space-y-1 text-gray-700">
              <p>
                E-Mail:{' '}
                <a
                  href="mailto:ritzaisolutions@gmail.com"
                  className="text-industrial-orange-bright hover:underline"
                >
                  ritzaisolutions@gmail.com
                </a>
              </p>
              <p>
                Telefon:{' '}
                <a
                  href="tel:+4915129755134"
                  className="text-industrial-orange-bright hover:underline"
                >
                  +49 151 29755134
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">Steuernummer</h2>
            <p className="text-gray-700">Beantragt (Kleinunternehmer § 19 UStG)</p>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">
              Verantwortlich gemäß § 55 Abs. 2 RStV
            </h2>
            <div className="space-y-1 text-gray-700">
              <p>Kevin Ritz</p>
              <p>Von-Cohausenstrasse 9</p>
              <p>56076 Koblenz</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-mono text-xl font-semibold text-gray-900 mb-4">Haftungsausschluss</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Haftung für Inhalte</h3>
                <p className="leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                  nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                  Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                  Tätigkeit hinweisen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Haftung für Links</h3>
                <p className="leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                  Seiten verantwortlich.
                </p>
              </div>
            </div>
          </section>
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
