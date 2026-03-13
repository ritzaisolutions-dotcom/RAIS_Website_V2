import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StatusBadge } from './ui/status-badge';
import { Logo } from './ui/Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-dashed border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <Logo size={32} className="text-industrial-orange-bright animate-pulse-slow drop-shadow-[0_0_12px_rgba(255,107,0,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(255,107,0,0.9)] transition-all duration-300" />
              <div className="absolute inset-0 bg-industrial-orange-bright/20 blur-xl rounded-full animate-pulse-slow" />
            </div>
            <span className="font-mono text-xl font-bold tracking-wider text-industrial-orange-bright">RAIS</span>
            <span className="hidden md:block text-xs text-gray-500 font-mono">v2.0.1</span>
          </Link>

          {isHome && (
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
                Services
              </a>
              <a href="#capabilities" className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
                Capabilities
              </a>
              <a href="#tech" className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
                Tech Stack
              </a>
              <a href="#contact" className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
                Contact
              </a>
            </nav>
          )}

          {isHome && (
            <>
              <div className="hidden md:block">
                <StatusBadge label="System" status="Online" />
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-industrial-orange-bright"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {isHome && isMenuOpen && (
        <div className="md:hidden border-t border-dashed border-border bg-background">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
              Services
            </a>
            <a href="#capabilities" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
              Capabilities
            </a>
            <a href="#tech" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
              Tech Stack
            </a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-industrial-orange-bright transition-colors">
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
