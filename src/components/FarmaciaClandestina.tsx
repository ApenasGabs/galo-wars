import React from 'react';
import { Syringe, AlertOctagon, HeartCrack, Zap, Sword, Shield, Coins, Sparkles } from 'lucide-react';
import type { GaloStats, BombaItem } from '../types/game.ts';
import { BOMBAS_CATALOG } from '../utils/constants.ts';

interface FarmaciaProps {
  galo: GaloStats;
  milhoCoins: number;
  onApplyBomba: (bomba: BombaItem) => void;
}

export const FarmaciaClandestina: React.FC<FarmaciaProps> = ({
  galo,
  milhoCoins,
  onApplyBomba
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner de Aviso Clandestino */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border border-red-900/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-pixel text-[10px]">
              ACESSO RESTRITO
            </span>
            <span className="text-xs text-red-400 font-mono">LABORATÓRIO SUBTERRÂNEO</span>
          </div>
          <h2 className="text-2xl font-bold font-sans-display text-white">
            Farmácia Clandestina de Aviário
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mt-1">
            Suplementos veterinários, hormônios de procedência duvidosa e estimulantes proibidos.
            Seu galo ganha atributos insanos, mas o coração pode não aguentar a pressão na arena!
          </p>
        </div>

        {/* Monitor de Risco Cardíaco em Tempo Real */}
        <div className="flex items-center gap-4 bg-slate-950/90 p-4 rounded-2xl border border-red-900/60 shadow-inner">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-red-400 mb-0.5">
              <HeartCrack className={`w-5 h-5 ${galo.infarctRisk > 30 ? 'animate-bounce text-red-500' : ''}`} />
              <span className="font-pixel text-xs">RISCO DE INFARTO</span>
            </div>
            <div className="text-2xl font-pixel text-red-400">
              {galo.infarctRisk}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Pressão: {galo.heartRateBpm} BPM
            </div>
          </div>

          <div className="h-12 w-px bg-slate-800" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-0.5">
              <Syringe className="w-5 h-5" />
              <span className="font-pixel text-xs">DOPING TOTAL</span>
            </div>
            <div className="text-2xl font-pixel text-amber-400">
              {galo.steroidsLevel}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {galo.steroidsLevel > 70 ? 'MUTANTE' : galo.steroidsLevel > 30 ? 'ENVENENADO' : 'NATURAL'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Anabolizantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BOMBAS_CATALOG.map(bomba => {
          const canAfford = milhoCoins >= bomba.cost;

          return (
            <div
              key={bomba.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              {/* Tag de Raridade */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                  {bomba.icon}
                </span>
                <span
                  className={`text-[10px] font-pixel px-2 py-0.5 rounded-full border uppercase ${
                    bomba.rarity === 'nuclear'
                      ? 'bg-purple-950 text-purple-300 border-purple-700'
                      : bomba.rarity === 'subterraneo'
                      ? 'bg-red-950 text-red-300 border-red-700'
                      : bomba.rarity === 'proibido'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {bomba.rarity}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100 font-sans-display group-hover:text-amber-400 transition-colors">
                  {bomba.name}
                </h3>
                <p className="text-xs font-mono text-amber-500/80 mb-2">{bomba.subtitle}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{bomba.description}</p>
              </div>

              {/* Bônus de Atributos */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 mb-4 text-xs font-sans-display">
                <div className="flex items-center gap-1.5 text-red-400">
                  <Sword className="w-3.5 h-3.5" />
                  <span>Força: +{bomba.strengthBoost}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Velocidade: +{bomba.speedBoost}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Defesa: +{bomba.defenseBoost}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-500 font-bold">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Infarto: +{bomba.toxicity}%</span>
                </div>
              </div>

              {/* Preço e Botão de Injeção */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Coins className="w-4 h-4" />
                  <span className="font-pixel text-sm">{bomba.cost}</span>
                  <span className="text-[10px] text-amber-500/70 uppercase">$MILHO</span>
                </div>

                <button
                  onClick={() => onApplyBomba(bomba)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                    canAfford
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Syringe className="w-3.5 h-3.5" />
                  <span>Injetar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
