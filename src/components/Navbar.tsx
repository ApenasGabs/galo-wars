import React from 'react';
import { Heart, Coins, Swords, Syringe, Palette, Home, ShieldAlert, Sparkles } from 'lucide-react';
import type { GaloStats } from '../types/game.ts';

interface NavbarProps {
  activeTab: 'tamagotchi' | 'farmacia' | 'rinha' | 'studio';
  setActiveTab: (tab: 'tamagotchi' | 'farmacia' | 'rinha' | 'studio') => void;
  milhoCoins: number;
  galo: GaloStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  milhoCoins,
  galo
}) => {
  const bpmColor =
    galo.heartRateBpm > 180
      ? 'text-red-500 animate-ping'
      : galo.heartRateBpm > 130
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
            🐓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-lg text-amber-400 tracking-wider">GALO WARS</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-semibold uppercase">
                Arcade
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans-display flex items-center gap-1.5">
              <span>{galo.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">Nvl. {galo.level}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{galo.title}</span>
            </p>
          </div>
        </div>

        {/* Status Rápidos: MilhoCoins & Monitor Cardíaco */}
        <div className="flex items-center gap-3">
          {/* Cardíaco / Doping Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <Heart className={`w-4 h-4 ${bpmColor}`} />
            <span className="font-pixel text-[11px] text-slate-200">{galo.heartRateBpm} BPM</span>
            {galo.infarctRisk > 20 && (
              <span className="flex items-center gap-0.5 text-[10px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/50">
                <ShieldAlert className="w-3 h-3 text-red-400" />
                {galo.infarctRisk}% Risco
              </span>
            )}
          </div>

          {/* Saldo de MilhoCoins */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-pixel text-[12px]">{milhoCoins.toLocaleString()}</span>
            <span className="text-[10px] uppercase font-bold text-amber-500">$MILHO</span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('tamagotchi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tamagotchi'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Galinheiro</span>
          </button>

          <button
            onClick={() => setActiveTab('farmacia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'farmacia'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Farmácia (Bomba)</span>
          </button>

          <button
            onClick={() => setActiveTab('rinha')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'rinha'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Rinha & Bet</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Skin Studio</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
