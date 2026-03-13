import { Shield, Zap, DollarSign, Globe } from 'lucide-react';
import { CornerAccent } from './ui/corner-accent';

export default function WhyRais() {
  const capabilities = [
    {
      icon: Shield,
      id: 'CAP-001',
      title: 'Data Sovereignty',
      description: 'Your data never leaves the European legal framework. We build local-first automation systems compliant with strict German privacy standards (DSGVO).',
      metric: '100% GDPR'
    },
    {
      icon: Zap,
      id: 'CAP-002',
      title: 'Rapid Deployment',
      description: 'From concept to production in days, not months. Agile methodology with continuous integration.',
      metric: '<7d'
    },
    {
      icon: DollarSign,
      id: 'CAP-003',
      title: 'Cost Efficiency',
      description: 'Reduce operational costs by up to 70%. Pay only for what you use. Transparent pricing.',
      metric: '-70%'
    },
    {
      icon: Globe,
      id: 'CAP-004',
      title: 'Global Scale',
      description: 'Deploy anywhere. Multi-region support. 24/7 monitoring and support across all time zones.',
      metric: '24/7'
    }
  ];

  return (
    <section id="capabilities" className="py-24 relative">
      <div className="absolute inset-0 diagonal-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-ultra-wide text-industrial-orange-bright mb-4">
            [ Core Capabilities ]
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-foreground uppercase">
            Why RAIS
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="group relative border border-dashed border-border p-6 hover:border-industrial-orange transition-all duration-300 flex flex-col items-center text-center"
              >
                <CornerAccent className="group-hover:text-industrial-orange-bright transition-colors" />

                <div className="font-mono text-xs text-gray-500 mb-4">{cap.id}</div>

                <div className="font-mono text-5xl md:text-6xl font-bold text-industrial-orange-bright mb-6">
                  {cap.metric}
                </div>

                <Icon className="w-10 h-10 text-industrial-orange group-hover:text-industrial-orange-bright transition-colors mb-4" />

                <h3 className="font-mono text-xl font-bold text-foreground mb-3 uppercase">
                  {cap.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed font-sans">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
