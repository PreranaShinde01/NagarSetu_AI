import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useMunicipality } from '../context/MunicipalityContext';
import { useLanguage } from '../context/LanguageContext';
import CityNetworkGraphic from '../components/graphics/CityNetworkGraphic';
import Button from '../components/common/Button';
import { Lock, Mail, Building, ShieldCheck, ArrowRight, Languages } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('controller@nagarsetu.demo');
  const [password, setPassword] = useState('Demo@1234');
  const { loginUser, loginAsRole, demoUsers } = useAuth();
  const { activeMunicipality, municipalities, switchMunicipality } = useMunicipality();
  const { isMarathi, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
    navigate('/command-center');
  };

  const handleQuickDemo = async (role) => {
    await loginAsRole(role);
    navigate('/command-center');
  };

  return (
    <div className="h-screen w-screen bg-brand-deepCharcoal flex overflow-hidden select-none font-sans">
      {/* Left Panel: NagarSetu Visual Identity */}
      <div className="hidden lg:flex flex-1 bg-brand-charcoal border-r border-slate-800 p-10 flex-col justify-between relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Branding Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-2.5">
            <img src="/assets/nagarsetu-logo.png" alt="NagarSetu AI" className="h-14 w-14 rounded-full object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.25)]" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-slate-100 font-sans">
                NAGAR<span className="text-amber-400">SETU</span> <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black ml-1">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                Connecting Citizens • Empowering Governance
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            DEMO ENVIRONMENT • SYNTHETIC DATA
          </span>
        </div>

        {/* Animated City Network Graphic */}
        <div className="relative z-10 my-auto">
          <CityNetworkGraphic className="h-72" />
          <div className="text-center mt-4">
            <h2 className="text-lg font-bold text-slate-100">One Platform for Smarter Civic Governance</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Bridging citizen grievances, AI triage, municipal departments, and verified proof of work in a single closed-loop operations platform.
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Pilot Municipality: Ichalkaranji Municipal Corporation (IMC)</span>
          <span>NagarSetu AI Core v1.0</span>
        </div>
      </div>

      {/* Right Panel: Login Form & Demo Selector */}
      <div className="w-full lg:w-[480px] p-8 flex flex-col justify-center bg-brand-deepCharcoal z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Branding Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <img src="/assets/nagarsetu-logo.png" alt="NagarSetu AI" className="h-10 w-10 rounded-full object-contain drop-shadow-sm" />
            <div>
              <h1 className="text-lg font-bold text-slate-100 font-sans">
                NAGAR<span className="text-amber-400">SETU</span> AI
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Civic Intelligence Platform</p>
            </div>
          </div>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {isMarathi ? 'महानगरपालिका प्रणाली लॉगिन' : 'MUNICIPAL TELEMETRY LOGIN'}
              </span>
              <h2 className="text-2xl font-bold text-slate-100 mt-2">
                {isMarathi ? 'नियंत्रण कक्ष प्रवेश' : 'Command Center Access'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isMarathi ? 'अधिकृत मनपा खात्याद्वारे लॉगिन करा' : 'Sign in with authorized municipal credentials'}
              </p>
            </div>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all text-xs font-mono font-bold"
              title={isMarathi ? "Switch to English" : "मराठी भाषेत रूपांतरित करा"}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'मराठी' : 'EN'}</span>
            </button>
          </div>

          {/* Dedicated Pilot Municipality Badge */}
          <div className="mb-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMarathi ? 'कार्यक्षेत्र महानगरपालिका:' : 'Pilot Municipality Jurisdiction:'}</span>
            </label>
            <div className="w-full bg-slate-900 border border-amber-500/30 rounded-lg p-2 text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>{isMarathi ? 'इचलकरंजी महानगरपालिका' : 'Ichalkaranji Municipal Corporation'}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">IMC</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isMarathi ? 'अधिकृत ईमेल' : 'Municipal Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-charcoal border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isMarathi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-charcoal border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" icon={ArrowRight}>
              {isMarathi ? 'प्रणालीमध्ये प्रवेश करा' : 'Sign In to Command Center'}
            </Button>
          </form>

          {/* Quick Demo Role Selector Panel */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>One-Click Demo Account Switcher</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Password: Demo@1234</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickDemo(user.role)}
                  className="p-2 rounded-lg bg-brand-charcoal border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{user.avatar}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{user.role.replace('_', ' ')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
