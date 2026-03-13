import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Terminal, CheckCircle } from 'lucide-react';

interface TransmissionTerminalProps {
  show: boolean;
  onComplete?: () => void;
}

const terminalLines = [
  '> Initializing secure channel...',
  '> Encrypting message payload...',
  '> Establishing connection to gateway...',
  '> Transmitting data packets...',
  '> Verifying transmission integrity...',
  '> Awaiting server acknowledgment...',
  '> SUCCESS: Transmission complete',
];

export function TransmissionTerminal({ show, onComplete }: TransmissionTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!show) {
      setVisibleLines(0);
      return;
    }

    let currentLine = 0;
    const interval = setInterval(() => {
      currentLine++;
      setVisibleLines(currentLine);

      if (currentLine >= terminalLines.length) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-8"
        >
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-industrial-orange-bright animate-pulse" />
              <span className="font-mono text-sm uppercase tracking-wider text-industrial-orange-bright">
                Transmission Protocol Active
              </span>
            </div>

            <div className="border border-industrial-orange p-6 bg-black/50 font-mono text-sm">
              {terminalLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    index < visibleLines
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.2 }}
                  className={`mb-2 flex items-center gap-2 ${
                    index === terminalLines.length - 1
                      ? 'text-status-cyan-bright'
                      : 'text-industrial-orange'
                  }`}
                >
                  {index === terminalLines.length - 1 && index < visibleLines && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{line}</span>
                  {index < visibleLines && index !== terminalLines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {visibleLines >= terminalLines.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <p className="font-mono text-xs text-gray-400">
                  Message received. Response within 48 hours.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
