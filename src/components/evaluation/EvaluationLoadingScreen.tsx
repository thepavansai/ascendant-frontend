'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tips = [
  'Looking for logical connectors...',
  'Checking reasoning depth...',
  'Measuring idea clarity...',
  'Analysing evidence usage...',
  'Evaluating alternative perspectives...',
  'Almost there...',
];

interface EvaluationLoadingScreenProps {
  status: 'PENDING' | 'DONE' | 'FAILED';
}

export default function EvaluationLoadingScreen({ status }: EvaluationLoadingScreenProps) {
  const [step, setStep] = useState(1);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (status === 'DONE') {
      setStep(4);
      return;
    }

    const stepTimers = [
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 3500),
      setTimeout(() => setStep(4), 5500),
    ];

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(tipInterval);
    };
  }, [status]);

  const steps = [
    { id: 1, text: 'Response received', status: step >= 1 ? 'done' : 'waiting' },
    {
      id: 2,
      text: 'Checking reasoning structure...',
      status: step >= 2 ? (step > 2 || status === 'DONE' ? 'done' : 'loading') : 'waiting',
    },
    {
      id: 3,
      text: 'AI evaluating quality...',
      status: step >= 3 ? (step > 3 || status === 'DONE' ? 'done' : 'loading') : 'waiting',
    },
    {
      id: 4,
      text: 'Calculating your score...',
      status: step >= 4 ? (status === 'DONE' ? 'done' : 'loading') : 'waiting',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-24 h-24 bg-purple/10 rounded-[2rem] border-2 border-purple/30 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-12"
      >
        <Brain className="text-purple" size={48} />
      </motion.div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold mb-2 text-white">
          Analysing Your Thinking...
        </h2>
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-muted text-sm font-medium"
            >
              {tips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full space-y-4">
        {steps.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border transition-all"
          >
            <span
              className={cn(
                'text-sm font-medium',
                s.status === 'done'
                  ? 'text-white'
                  : s.status === 'loading'
                    ? 'text-purple-light'
                    : 'text-dimmed'
              )}
            >
              {s.text}
            </span>
            {s.status === 'done' ? (
              <CheckCircle2 className="text-green" size={20} />
            ) : s.status === 'loading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="text-purple" size={20} />
              </motion.div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border" />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-dimmed mt-8 italic">Usually takes 5–8 seconds</p>
    </div>
  );
}
