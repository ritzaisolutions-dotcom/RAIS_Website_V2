import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'de' | 'en';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Translations = {
  'hero.headline': {
    de: 'KI-Automatisierung für Ihr Unternehmen',
    en: 'AI Automation for Your Business'
  },
  'hero.subheadline': {
    de: 'Wir automatisieren Prozesse, entwickeln intelligente Chat-Agenten und beraten Sie bei Ihrer KI-Strategie',
    en: 'We automate processes, develop intelligent chat agents, and advise you on your AI strategy'
  },
  'hero.cta.primary': {
    de: 'Beratung buchen',
    en: 'Book Consultation'
  },
  'hero.cta.secondary': {
    de: 'Services entdecken',
    en: 'Discover Services'
  },
  'services.title': {
    de: 'Unsere Services',
    en: 'Our Services'
  },
  'services.automation.title': {
    de: 'AI Automatisierung',
    en: 'AI Automation'
  },
  'services.automation.description': {
    de: 'Workflow-Automatisierungen mit n8n, Make und Voiceflow. Sparen Sie Zeit durch intelligente Prozessoptimierung und nahtlose Systemintegrationen.',
    en: 'Workflow automations with n8n, Make, and Voiceflow. Save time through intelligent process optimization and seamless system integrations.'
  },
  'services.chat.title': {
    de: 'Chat Agents',
    en: 'Chat Agents'
  },
  'services.chat.description': {
    de: '24/7 KI-Chat-Agenten für Kundenservice, Lead-Generierung und Support. Automatisierte Antworten auf Kundenanfragen in Echtzeit.',
    en: '24/7 AI chat agents for customer service, lead generation, and support. Automated responses to customer inquiries in real-time.'
  },
  'services.consulting.title': {
    de: 'KI-Beratung',
    en: 'AI Consulting'
  },
  'services.consulting.description': {
    de: 'Strategische KI-Beratung für Ihr Unternehmen. Wir analysieren Ihre Prozesse und entwickeln maßgeschneiderte Automatisierungslösungen.',
    en: 'Strategic AI consulting for your business. We analyze your processes and develop customized automation solutions.'
  },
  'why.title': {
    de: 'Warum RAIS?',
    en: 'Why RAIS?'
  },
  'why.expertise.title': {
    de: 'No-Code/Low-Code Expertise',
    en: 'No-Code/Low-Code Expertise'
  },
  'why.expertise.description': {
    de: 'Professionelle Automatisierung mit Voiceflow, n8n und Make.com',
    en: 'Professional automation with Voiceflow, n8n, and Make.com'
  },
  'why.fast.title': {
    de: 'Schnelle Umsetzung',
    en: 'Fast Implementation'
  },
  'why.fast.description': {
    de: 'Rapid MVP-Entwicklung und agile Projektdurchführung',
    en: 'Rapid MVP development and agile project execution'
  },
  'why.cost.title': {
    de: 'Kosteneffiziente Lösungen',
    en: 'Cost-Efficient Solutions'
  },
  'why.cost.description': {
    de: 'Optimiert für KMUs mit transparenter Preisgestaltung',
    en: 'Optimized for SMEs with transparent pricing'
  },
  'why.local.title': {
    de: 'Lokaler Partner',
    en: 'Local Partner'
  },
  'why.local.description': {
    de: 'Standort Koblenz mit deutscher & englischer Betreuung',
    en: 'Based in Koblenz with German & English support'
  },
  'tech.title': {
    de: 'Unsere Technologien',
    en: 'Our Technologies'
  },
  'tech.subtitle': {
    de: 'Moderne No-Code & Low-Code Tools für maximale Effizienz',
    en: 'Modern No-Code & Low-Code Tools for Maximum Efficiency'
  },
  'cta.title': {
    de: 'Bereit für KI-Automatisierung?',
    en: 'Ready for AI Automation?'
  },
  'cta.subtitle': {
    de: 'Buchen Sie ein kostenloses Erstgespräch und entdecken Sie Ihr Automatisierungspotenzial',
    en: 'Book a free initial consultation and discover your automation potential'
  },
  'contact.name': {
    de: 'Name',
    en: 'Name'
  },
  'contact.email': {
    de: 'E-Mail',
    en: 'Email'
  },
  'contact.company': {
    de: 'Unternehmen',
    en: 'Company'
  },
  'contact.message': {
    de: 'Nachricht',
    en: 'Message'
  },
  'contact.submit': {
    de: 'Anfrage senden',
    en: 'Send Request'
  },
  'contact.info.title': {
    de: 'Kontakt',
    en: 'Contact'
  },
  'contact.info.location': {
    de: 'Koblenz, Deutschland',
    en: 'Koblenz, Germany'
  },
  'contact.info.availability': {
    de: 'Termine nach Vereinbarung',
    en: 'Appointments by arrangement'
  },
  'footer.impressum': {
    de: 'Impressum',
    en: 'Imprint'
  },
  'footer.privacy': {
    de: 'Datenschutz',
    en: 'Privacy'
  },
  'footer.copyright': {
    de: '© 2026 RAIS – Ritz AI Solutions',
    en: '© 2026 RAIS – Ritz AI Solutions'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
