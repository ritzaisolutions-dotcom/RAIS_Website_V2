import { Workflow, Bot, Database, CheckSquare } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CornerAccent } from './ui/corner-accent';

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const services = [
    {
      icon: Workflow,
      id: 'MODULE-A',
      title: 'WORKFLOW ORCHESTRATION',
      subtitle: 'Eliminate Operational Friction',
      missionBrief: 'Manual data entry is a security risk and a resource drain. We deploy \'invisible\' logic layers that connect your fragmented software ecosystems. From student enrollment processing to inventory synchronization, our bots work in the background, error-free.',
      capabilities: [
        'Cross-platform API Bridging (n8n/Make)',
        'Automated Invoicing & Compliance',
        'Zero-Touch Lead Routing'
      ],
      caseStudy: 'TARGET: Regional Consulting Firm // OUTCOME: Reduced admin overhead by 65% in Week 1.',
      status: 'Active'
    },
    {
      icon: Bot,
      id: 'MODULE-B',
      title: 'AUTONOMOUS VOICE & CHAT',
      subtitle: '24/7 Frontline Defense',
      missionBrief: 'Human staff should not answer the same question twice. We engineer AI agents capable of natural, voice-based negotiation and complex problem solving. Whether handling restaurant reservations during peak hours or guiding students through application forms, our agents never sleep.',
      capabilities: [
        'Multi-Turn Voice Conversations (Voiceflow)',
        'Instant Knowledge Base Retrieval (RAG)',
        'Omni-channel Deployment (Web/SMS/Phone)'
      ],
      caseStudy: 'TARGET: Hospitality Sector // OUTCOME: 100% call answer rate. Zero missed reservations.',
      status: 'Active'
    },
    {
      icon: Database,
      id: 'MODULE-C',
      title: 'PREDICTIVE INTELLIGENCE',
      subtitle: 'Weaponize Your Data',
      missionBrief: 'Stop driving blind. We transform dormant spreadsheets into live, tactical dashboards. By visualizing cash flow, customer churn, and operational bottlenecks in real-time, you gain the foresight needed to pivot before the market does.',
      capabilities: [
        'Live P&L & KPI Dashboards',
        'Customer Behavior Forecasting',
        'Automated Weekly Intelligence Briefs'
      ],
      caseStudy: 'TARGET: E-Commerce Operations // OUTCOME: Identified 20% wasted ad spend via automated audit.',
      status: 'Active'
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 diagonal-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-ultra-wide text-accent-purple-bright mb-4">
            [ Available Systems ]
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-foreground uppercase">
            Service Modules
          </h2>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="group relative border-2 border-dashed p-6 hover:border-industrial-orange transition-all duration-300 bg-background/50 backdrop-blur-sm"
                initial={{
                  opacity: 0,
                  borderColor: 'rgb(55, 65, 81)'
                }}
                animate={isInView ? {
                  opacity: 1,
                  borderColor: [
                    'rgb(55, 65, 81)',
                    'rgb(255, 127, 36)',
                    'rgb(55, 65, 81)'
                  ]
                } : {}}
                transition={{
                  delay: index * 0.12,
                  duration: 0.5,
                  borderColor: {
                    duration: 0.3,
                    delay: index * 0.12 + 0.2,
                    times: [0, 0.5, 1]
                  }
                }}
              >
                <CornerAccent className="group-hover:text-industrial-orange-bright transition-colors" />

                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-xs text-gray-500">{service.id}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-purple-bright animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-wider text-accent-purple-bright">
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 1 }}
                    animate={isInView ? {
                      scale: [1, 1.2, 1]
                    } : { scale: 1 }}
                    transition={{
                      delay: index * 0.12 + 0.3,
                      duration: 0.6,
                      times: [0, 0.5, 1],
                      ease: "easeInOut"
                    }}
                    className="mb-4"
                  >
                    <Icon className="w-10 h-10 text-industrial-orange group-hover:text-industrial-orange-bright transition-colors" />
                  </motion.div>

                  <h3 className="font-mono text-lg font-bold text-foreground mb-2 uppercase leading-tight">
                    {service.title}
                  </h3>

                  <div className="font-mono text-xs text-industrial-orange-bright uppercase tracking-wider mb-4">
                    {service.subtitle}
                  </div>
                </div>

                {/* Mission Brief */}
                <div className="mb-5">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">Mission Brief:</div>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">
                    {service.missionBrief}
                  </p>
                </div>

                {/* Capabilities */}
                <div className="mb-5">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-3">Capabilities:</div>
                  <div className="space-y-2">
                    {service.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckSquare className="w-3 h-3 text-accent-purple-bright flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400 text-xs font-sans leading-snug">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Case Study Log */}
                <div className="pt-5 border-t border-dashed border-border">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">Case Study Log:</div>
                  <div className="bg-background/80 border border-accent-purple/30 p-3 font-mono text-xs text-accent-purple-bright leading-relaxed">
                    {service.caseStudy}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
