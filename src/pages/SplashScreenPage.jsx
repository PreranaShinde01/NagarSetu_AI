import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SplashScreenPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const steps = [
    'Initializing Civic Intelligence System...',
    'Loading Governance Platform Configs...',
    'Connecting City Operations Mesh...',
    'Authenticating Telemetry Nodes...',
    'Ready',
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        navigate('/command-center');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/command-center');
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, steps.length]);

  const progressPct = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div 
      onClick={() => navigate('/command-center')}
      title="Click anywhere or press Enter to skip intro"
      className="h-screen w-screen bg-brand-deepCharcoal flex flex-col items-center justify-center p-6 select-none relative overflow-hidden font-sans cursor-pointer"
    >
      {/* Abstract Background City Nodes */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-md w-full z-10"
      >
        {/* Logo Reveal */}
        <div className="w-32 h-32 mb-6 relative flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-amber-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <img src="/assets/nagarsetu-logo.png" alt="NagarSetu AI" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-100 tracking-wider">
          NAGAR<span className="text-brand-amber">SETU</span> AI
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest mt-1 uppercase">
          Connecting Citizens • Empowering Governance
        </p>

        {/* Animated Amber Progress Line */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 mt-8 border border-slate-800 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_12px_#F59E0B]"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step Status Text */}
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-amber-400 mt-4 tracking-wide font-semibold"
        >
          {steps[stepIndex]}
        </motion.p>

        {/* Quick Skip Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/command-center');
          }}
          className="mt-6 px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Skip Intro &rarr; Enter Hub</span>
        </button>

        <span className="text-[10px] font-mono text-slate-600 mt-4">
          Enterprise Desktop Shell v1.0 • Multi-City Operations Hub
        </span>
      </motion.div>
    </div>
  );
}
