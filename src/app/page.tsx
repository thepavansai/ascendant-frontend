'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Target, Lightbulb, Hammer, ChevronRight, Menu, X } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-white selection:bg-purple/30">
      <PublicHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple-light text-sm font-semibold w-fit">
              <span className="w-2 h-2 rounded-full bg-purple" />
              For Ages 9–12
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight">
              Train Your Brain.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple via-purple-light to-teal">
                Level Up Your Life.
              </span>
            </h1>
            <p className="text-offwhite text-lg md:text-xl max-w-xl leading-relaxed">
              Mission-based thinking challenges that build critical thinking, decision-making and AI
              literacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/account/signup">
                <Button size="lg" className="btn-primary w-full sm:w-auto text-lg px-8 py-7">
                  Start Free <ChevronRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="btn-ghost w-full sm:w-auto text-lg px-8 py-7"
              >
                See How It Works
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 p-4 bg-surface/40 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Mock UI Preview */}
              <div className="aspect-[4/3] rounded-2xl bg-surface2 overflow-hidden flex flex-col p-6 border border-border/50">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center">
                      <Brain className="text-purple" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold">PSS</div>
                      <div className="text-xs text-muted">LEVEL 99 • GENIUS</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold flex items-center gap-1">
                      🔥 365
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs font-mono text-muted mb-2">
                    <span>XP PROGRESS</span>
                    <span>9990 / 10000 XP</span>
                  </div>
                  <div className="h-3 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-purple w-[99%] rounded-full" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center mb-6">
                  <div className="p-4 rounded-xl bg-purple/10 border border-purple/20 relative overflow-hidden group hover:bg-purple/20 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple" />
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Brain className="text-purple" size={16} /></div>
                      <div>
                        <div className="text-xs font-bold text-purple-light mb-1">AI MENTOR EVALUATION</div>
                        <p className="text-sm text-offwhite leading-relaxed italic">
                          "PSS demonstrates unparalleled cognitive architecture. Strategic foresight is at the 99.9th percentile. Ready for Quantum-level scenarios."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface/60 border border-border">
                    <div className="text-xs text-muted mb-1">INTELLECT</div>
                    <div className="text-xl font-mono text-purple">9.9/10</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface/60 border border-border">
                    <div className="text-xs text-muted mb-1">JUDGMENT</div>
                    <div className="text-xl font-mono text-amber">9.8/10</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal/20 rounded-full blur-[100px]" />
          </motion.div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: 'Mission-Based Learning',
              desc: 'Real scenarios, not textbooks. Solve problems that matter.',
              color: 'purple',
            },
            {
              icon: Brain,
              title: 'AI-Powered Evaluation',
              desc: 'Instant, personalized feedback on your reasoning quality.',
              color: 'teal',
            },
            {
              icon: Lightbulb,
              title: 'Track Your Growth',
              desc: 'Watch your thinking skills develop with advanced analytics.',
              color: 'amber',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-surface border-border hover:border-purple/50 transition-all duration-300 group">
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}/10 border border-${feature.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`text-${feature.color}`} size={24} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Identity Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Discover Your Thinking Identity
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Every child thinks differently. Our platform identifies your unique cognitive style and
            helps you master it.
          </p>
        </div>

        <div className="container mx-auto grid md:grid-cols-4 gap-6">
          {[
            {
              id: 'ANALYST',
              icon: Brain,
              color: 'purple',
              name: 'The Analyst',
              desc: 'Masters of data and patterns.',
            },
            {
              id: 'STRATEGIST',
              icon: Target,
              color: 'amber',
              name: 'The Strategist',
              desc: 'Masters of long-term planning.',
            },
            {
              id: 'CREATOR',
              icon: Lightbulb,
              color: 'teal',
              name: 'The Creator',
              desc: 'Masters of new perspectives.',
            },
            {
              id: 'BUILDER',
              icon: Hammer,
              color: 'green',
              name: 'The Builder',
              desc: 'Masters of practical execution.',
            },
          ].map((identity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl bg-surface border border-border text-center flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 shadow-lg`}
                style={{
                  backgroundColor: `${identity.color}20`,
                  border: `1px solid ${identity.color}40`,
                }}
              >
                <identity.icon size={32} style={{ color: identity.color }} />
              </div>
              <h4 className="text-xl font-heading font-bold mb-2">{identity.name}</h4>
              <p className="text-sm text-muted">{identity.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-surface2/30 relative">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-20 text-center">
            How It Works
          </h2>
          <div className="space-y-12 relative">
            <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-border hidden md:block" />

            {[
              {
                step: 1,
                title: 'Pick a Mission',
                desc: 'Choose from dozens of scenarios covering science, history, tech, and everyday life.',
                color: 'purple',
              },
              {
                step: 2,
                title: 'Write Your Thinking',
                desc: 'Explain your reasoning. Break down complex problems step by step.',
                color: 'teal',
              },
              {
                step: 3,
                title: 'Get Feedback',
                desc: 'Receive immediate evaluation from our AI mentor and level up your skills.',
                color: 'amber',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div
                  className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center font-heading text-2xl font-bold border-2 transition-all duration-500`}
                  style={{
                    borderColor: `${item.color}40`,
                    backgroundColor: '#0B0F1A',
                    color: item.color,
                  }}
                >
                  0{item.step}
                </div>
                <div className="pt-2">
                  <h4 className="text-2xl font-heading font-bold mb-3">{item.title}</h4>
                  <p className="text-offwhite text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-purple via-surface to-surface2 border border-purple/20 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="font-heading text-4xl md:text-6xl font-bold max-w-3xl">
                Ready to level up your thinking?
              </h2>
              <Link href="/account/signup">
                <Button
                  size="lg"
                  className="btn-primary text-xl px-12 py-8 rounded-2xl shadow-xl shadow-purple/30 hover:scale-105 transition-transform"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="text-purple" size={24} />
            <span className="font-heading font-bold">ASCENDANT INITIATIVE</span>
          </div>
          <div className="flex gap-8 text-sm text-muted">
            <Link href="#" className="hover:text-offwhite">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-offwhite">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-offwhite">
              Support
            </Link>
          </div>
          <div className="text-sm text-dimmed">
            &copy; {new Date().getFullYear()} Ascendant. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
