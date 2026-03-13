import { Terminal, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CornerAccent } from './ui/corner-accent';
import { StatusBadge } from './ui/status-badge';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 diagonal-grid opacity-50" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative border-2 border-dashed border-border p-8 md:p-12">
          <CornerAccent />

          <div className="mb-8">
            <StatusBadge label="Mission Control" status="Ready" />
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Terminal className="w-8 h-8 text-industrial-orange-bright" />
              <span className="font-mono text-xs uppercase tracking-ultra-wide text-gray-500">
                Ritz AI Solutions
              </span>
            </div>

            <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground uppercase leading-tight" style={{ textShadow: '0 0 20px rgba(255, 127, 36, 0.5)' }}>
              Automating<br />
              <span className="text-industrial-orange-bright">Destiny.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-sans">
              AI solutions engineered to reclaim time and multiply workforce productivity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <motion.a
              href="#contact"
              className="group relative px-8 py-4 border-2 border-industrial-orange font-mono text-sm uppercase tracking-wider text-industrial-orange-bright flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.02,
                borderColor: 'rgb(255, 153, 71)',
                boxShadow: '0 0 20px rgba(255, 127, 36, 0.3)',
                textShadow: '0 0 10px rgba(255, 127, 36, 0.8)'
              }}
              whileTap={{
                scale: 0.98,
                opacity: 0.8
              }}
              transition={{ duration: 0.2 }}
              style={{
                textShadow: '0 0 5px rgba(255, 127, 36, 0.4)'
              }}
            >
              <span>Initiate Contact</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="#services"
              className="group relative px-8 py-4 border border-dashed border-border font-mono text-sm uppercase tracking-wider text-gray-400 flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.02,
                borderColor: 'rgb(255, 127, 36)',
                color: 'rgb(255, 127, 36)',
                boxShadow: '0 0 20px rgba(255, 127, 36, 0.3)',
                textShadow: '0 0 10px rgba(255, 127, 36, 0.8)'
              }}
              whileTap={{
                scale: 0.98,
                opacity: 0.8
              }}
              transition={{ duration: 0.2 }}
            >
              <span>View Systems</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { metric: '50+', label: 'Systems Deployed' },
              { metric: '24/7', label: 'Uptime Protocol' },
              { metric: '100%', label: 'AI Powered' },
              { metric: '<48h', label: 'Response Time' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative border border-dashed border-border p-4"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderColor: [
                    'rgb(55, 65, 81)', // border-border
                    'rgb(255, 127, 36)', // orange flash
                    'rgb(55, 65, 81)'
                  ]
                }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  borderColor: {
                    duration: 0.3,
                    delay: index * 0.15 + 0.3,
                    times: [0, 0.5, 1]
                  }
                }}
              >
                <div className="font-mono text-3xl md:text-4xl font-bold text-industrial-orange-bright mb-1">
                  {stat.metric}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
