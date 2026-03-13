import { Cpu, Cloud, Lock, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const techStack = [
    { category: 'AI/ML', items: ['OpenAI GPT-4', 'Claude', 'TensorFlow', 'PyTorch'] },
    { category: 'Cloud', items: ['AWS', 'Google Cloud', 'Azure', 'Vercel'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
    { category: 'Orchestration', items: ['n8n', 'Make.com', 'Voiceflow', 'Zapier'] }
  ];

  const icons = [Cpu, Cloud, Lock, Zap];

  return (
    <section id="tech" className="py-24 relative border-y border-dashed border-border">
      <div className="absolute inset-0 diagonal-grid opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="font-mono text-xs uppercase tracking-ultra-wide text-industrial-orange-bright mb-4">
            [ Technology Stack ]
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-foreground uppercase">
            Arsenal
          </h2>
        </div>

        <div ref={ref} className="grid md:grid-cols-4 gap-6">
          {techStack.map((stack, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="relative border border-dashed border-border p-6 hover:border-industrial-orange transition-all duration-300 group"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={isInView ? {
                    scale: [1, 1.3, 1]
                  } : { scale: 1 }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.6,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-8 h-8 text-industrial-orange group-hover:text-industrial-orange-bright transition-colors mb-4" />
                </motion.div>

                <div className="font-mono text-sm uppercase tracking-wider text-industrial-orange-bright mb-4">
                  {stack.category}
                </div>

                <ul className="space-y-2">
                  {stack.items.map((item, i) => (
                    <li key={i} className="font-mono text-xs text-gray-400 flex items-center gap-2">
                      <span className="w-1 h-1 bg-industrial-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
