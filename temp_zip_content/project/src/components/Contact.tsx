import { useState } from 'react';
import { Send, Terminal, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CornerAccent } from './ui/corner-accent';
import { StatusBadge } from './ui/status-badge';
import { TransmissionTerminal } from './ui/transmission-terminal';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    gdprConsent: false
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showTerminal, setShowTerminal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gdprConsent) {
      setErrorMessage('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    setStatus('sending');
    setShowTerminal(true);
    setErrorMessage('');

    try {
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            gdpr_consent: formData.gdprConsent
          }
        ]);

      if (dbError) throw dbError;

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-notification`;
      await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          gdpr_consent: formData.gdprConsent
        })
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      setShowTerminal(false);
      return;
    }
  };

  const handleTransmissionComplete = () => {
    setStatus('sent');
    setFormData({ name: '', email: '', subject: '', message: '', gdprConsent: false });
    setTimeout(() => {
      setStatus('idle');
      setShowTerminal(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setFormData({
      ...formData,
      [target.name]: value
    });
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 diagonal-grid opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-ultra-wide text-industrial-orange-bright mb-4">
            [ Secure Channel ]
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-foreground uppercase mb-4">
            Message Gateway
          </h2>
          <p className="text-gray-400 text-lg font-sans max-w-2xl">
            Initialize contact protocol. All transmissions are encrypted and monitored.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative border-2 border-dashed border-border p-8">
              <CornerAccent />

              <TransmissionTerminal
                show={showTerminal}
                onComplete={handleTransmissionComplete}
              />

              <div className="mb-6">
                <StatusBadge
                  label="Gateway"
                  status={
                    status === 'sending' ? 'Transmitting' :
                    status === 'sent' ? 'Sent' :
                    status === 'error' ? 'Error' :
                    'Ready'
                  }
                />
              </div>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                animate={{ opacity: showTerminal ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Operator Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === 'sending'}
                      className="terminal-input w-full px-4 py-3 bg-transparent border border-border font-mono text-sm text-industrial-orange-bright focus:border-industrial-orange focus:outline-none transition-colors disabled:opacity-50"
                      style={{ borderRightWidth: '3px' }}
                      placeholder="ENTER_NAME"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status === 'sending'}
                      className="terminal-input w-full px-4 py-3 bg-transparent border border-border font-mono text-sm text-industrial-orange-bright focus:border-industrial-orange focus:outline-none transition-colors disabled:opacity-50"
                      style={{ borderRightWidth: '3px' }}
                      placeholder="user@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={status === 'sending'}
                    className="terminal-input w-full px-4 py-3 bg-transparent border border-border font-mono text-sm text-industrial-orange-bright focus:border-industrial-orange focus:outline-none transition-colors disabled:opacity-50"
                    style={{ borderRightWidth: '3px' }}
                    placeholder="SUBJECT_LINE"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Message Content
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    disabled={status === 'sending'}
                    className="terminal-input w-full px-4 py-3 bg-transparent border border-border font-mono text-sm text-industrial-orange-bright focus:border-industrial-orange focus:outline-none transition-colors resize-none disabled:opacity-50"
                    style={{ borderRightWidth: '3px' }}
                    placeholder="BEGIN_TRANSMISSION..."
                  />
                </div>

                <div className="flex items-start gap-3 border border-border p-4">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    name="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={handleChange}
                    required
                    disabled={status === 'sending'}
                    className="mt-1 w-4 h-4 border-2 border-industrial-orange bg-transparent checked:bg-industrial-orange focus:ring-industrial-orange focus:ring-2 cursor-pointer disabled:opacity-50"
                  />
                  <label htmlFor="gdprConsent" className="font-mono text-xs text-gray-400 leading-relaxed">
                    Ich habe die{' '}
                    <Link to="/datenschutz" className="text-industrial-orange-bright hover:text-industrial-orange underline">
                      Datenschutzerklärung
                    </Link>
                    {' '}gelesen und akzeptiere diese.
                  </label>
                </div>

                {errorMessage && (
                  <div className="border-2 border-red-500 bg-red-500/10 p-4">
                    <p className="font-mono text-sm text-red-400">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || !formData.gdprConsent}
                  className="w-full px-8 py-4 border-2 border-industrial-orange font-mono text-sm uppercase tracking-wider text-industrial-orange-bright hover:bg-industrial-orange/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {status === 'sending' ? (
                    <>
                      <Terminal className="w-5 h-5 animate-pulse" />
                      <span>Transmitting...</span>
                    </>
                  ) : status === 'sent' ? (
                    <>
                      <span>Transmission Complete</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </motion.form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative border border-dashed border-border p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">
                Contact Info
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-industrial-orange-bright flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-mono text-xs text-gray-500 mb-1">EMAIL</div>
                    <a
                      href="mailto:ritzaisolutions@gmail.com"
                      className="font-mono text-sm text-industrial-orange-bright hover:text-industrial-orange transition-colors"
                    >
                      ritzaisolutions@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-industrial-orange-bright flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-mono text-xs text-gray-500 mb-1">LOCATION</div>
                    <div className="font-mono text-sm text-foreground">Remote Operations</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border border-dashed border-border p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">
                Response Time
              </div>
              <div className="font-mono text-3xl font-bold text-industrial-orange-bright mb-2">
                &lt;48h
              </div>
              <div className="font-mono text-xs text-gray-500">
                Average response protocol
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
