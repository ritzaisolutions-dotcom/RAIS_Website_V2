import { Mail, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export default function Footer() {
  return (
    <footer className="relative border-t border-dashed border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={24} className="text-industrial-orange-bright" />
              <span className="font-mono text-xl font-bold tracking-wider text-industrial-orange-bright">RAIS</span>
            </div>
            <p className="text-gray-400 text-sm font-sans max-w-md mb-4">
              Ritz AI Solutions - Automating destiny through intelligent systems.
              AI solutions for financial and location freedom.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-cyan-bright animate-pulse" />
              <span className="font-mono text-xs text-gray-500">System Status: Operational</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">
              Quick Access
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors">
                  &gt; Services
                </a>
              </li>
              <li>
                <a href="#capabilities" className="font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors">
                  &gt; Capabilities
                </a>
              </li>
              <li>
                <a href="#tech" className="font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors">
                  &gt; Tech Stack
                </a>
              </li>
              <li>
                <a href="#contact" className="font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors">
                  &gt; Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">
              Connect
            </div>
            <div className="space-y-3">
              <a
                href="mailto:ritzaisolutions@gmail.com"
                className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-industrial-orange-bright transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-dashed border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-gray-500">
              &copy; 2025 Ritz AI Solutions. All systems operational.
            </p>
            <div className="flex gap-6">
              <Link to="/impressum" className="font-mono text-xs text-gray-500 hover:text-industrial-orange-bright transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="font-mono text-xs text-gray-500 hover:text-industrial-orange-bright transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
