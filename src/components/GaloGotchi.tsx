import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Dumbbell, 
  Moon, 
  Heart, 
  Zap, 
  Shield, 
  Sword, 
  AlertTriangle, 
  Edit3, 
  Trophy, 
  Skull,
  Wheat,
  Coins
} from 'lucide-react';
import type { GaloStats } from '../types/game.ts';
import { GaloVisualizer } from './GaloVisualizer.tsx';

interface GaloGotchiProps {
  galo: GaloStats;
  onFeed: () => void;
  onClean: () => void;
  onTrain: () => void;
  onRest: () => void;
  onForage: () => void;
  onClaimBolsaMilho: () => void;
  onRename: (name: string) => void;
  milhoCoins: number;
}

export const GaloGotchi: React.FC<GaloGotchiProps> = ({
  galo,
  onFeed,
  onClean,
  onTrain,
  onRest,
  onForage,
  onClaimBolsaMilho,
  onRename,
  milhoCoins
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(galo.name);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onRename(tempName);
      setIsEditingName(false);
    }
  };

  const xpProgress = Math.min(100, (galo.xp / (galo.level * 100)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Coluna Central: Galo & Galinheiro */}
      <div className="lg:col-span-7 flex flex-col items-center justify-between p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[460px]">
        {/* Luz de fundo do terreiro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header do Galo: Nome e Título editável */}
        <div className="w-full flex items-center justify-between z-10">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="px-3 py-1 bg-slate-800 border border-amber-500 rounded-lg text-sm text-amber-300 font-pixel focus:outline-none"
                autoFocus
                maxLength={20}
              />
              <button
                type="submit"
                className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold font-sans-display"
              >
                Salvar
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-sans-display text-slate-100 flex items-center gap-2">
                {galo.name}
                <button
                  onClick={() => {
                    setTempName(galo.name);
                    setIsEditingName(true);
                  }}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  title="Renomear Galo"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </h2>
            </div>
          )}

          {/* Placar de Vitórias */}
          <div className="flex items-center gap-3 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Trophy className="w-3.5 h-3.5" /> {galo.victories}V
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <Skull className="w-3.5 h-3.5" /> {galo.defeats}D
            </span>
          </div>
        </div>

        {/* Visualizador do Galo (Sprite Canvas) */}
        <div className="my-8 z-10 flex flex-col items-center">
          <GaloVisualizer
            skinGrid={galo.skinGrid}
            steroidsLevel={galo.steroidsLevel}
            heartRateBpm={galo.heartRateBpm}
            size={240}
          />

          {/* Doping Badge */}
          {galo.steroidsLevel > 0 && (
            <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-pixel shadow-lg shadow-red-900/20">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>DOPING: {galo.steroidsLevel}%</span>
            </div>
          )}
        </div>

        {/* Barra de XP */}
        <div className="w-full z-10 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-pixel text-[10px] text-amber-400">NÍVEL {galo.level}</span>
            <span>{galo.xp} / {galo.level * 100} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Banner de Emergência Anti-Falência: Bolsa Milho */}
        {milhoCoins < 20 && (
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-2 border-red-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 z-10 animate-pulse">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">🚨</span>
              <div>
                <h4 className="text-xs font-pixel text-red-300">ACABOU O MILHO! (TEM CRIANÇA CHORANDO)</h4>
                <p className="text-[11px] text-amber-200/90 font-sans-display">
                  Seu galo está sem fundos! Resgate o auxílio emergencial do sindicato da granja.
                </p>
              </div>
            </div>
            <button
              onClick={onClaimBolsaMilho}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-[10px] tracking-wider font-bold shadow-lg shadow-amber-950 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              🏛️ RESGATAR BOLSA MILHO (+75 $MILHO)
            </button>
          </div>
        )}

        {/* Botões de Ações do Tamagotchi */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full mt-4 z-10">
          <button
            onClick={onFeed}
            disabled={milhoCoins < 10}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed group active:scale-95"
          >
            <Utensils className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Dar Milho</span>
            <span className="text-[10px] text-amber-500/70">10 $MILHO</span>
          </button>

          <button
            onClick={onForage}
            disabled={galo.energy < 5}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed group active:scale-95"
            title="Ciscar no terreiro para encontrar milho no chão"
          >
            <Wheat className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Ciscar Chão</span>
            <span className="text-[10px] text-emerald-400/90 font-bold">+15~25 $MILHO</span>
          </button>

          <button
            onClick={onClean}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all group active:scale-95"
          >
            <Sparkles className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Banho de Areia</span>
            <span className="text-[10px] text-cyan-500/70">Grátis</span>
          </button>

          <button
            onClick={onTrain}
            disabled={galo.energy < 20 || galo.hunger < 15}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed group active:scale-95"
          >
            <Dumbbell className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Treinar Espora</span>
            <span className="text-[10px] text-orange-500/70">-20 Energia</span>
          </button>

          <button
            onClick={onRest}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all group active:scale-95"
          >
            <Moon className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Descansar</span>
            <span className="text-[10px] text-indigo-500/70">Alivia BPM</span>
          </button>
        </div>
      </div>

      {/* Coluna Lateral: Barras de Status Vitais e Atributos de Combate */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Painel de Necessidades Básicas */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-pixel text-slate-300 mb-4 flex items-center gap-2">
            <span>STATUS VITAIS</span>
          </h3>

          <div className="space-y-4">
            {/* Saúde */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-sans-display">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Heart className="w-3.5 h-3.5" /> Vida / Vigor
                </span>
                <span>{galo.health} / {galo.maxHealth}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(galo.health / galo.maxHealth) * 100}%` }}
                />
              </div>
            </div>

            {/* Fome */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-sans-display">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Utensils className="w-3.5 h-3.5" /> Fome
                </span>
                <span>{galo.hunger}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    galo.hunger < 20 ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${galo.hunger}%` }}
                />
              </div>
            </div>

            {/* Energia */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-sans-display">
                <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> Energia
                </span>
                <span>{galo.energy}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    galo.energy < 20 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${galo.energy}%` }}
                />
              </div>
            </div>

            {/* Higiene */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-sans-display">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Higiene
                </span>
                <span>{galo.hygiene}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${galo.hygiene}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Atributos de Rinha */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-pixel text-slate-300 mb-4 flex items-center justify-between">
            <span>ESPORAS & COMBATE</span>
            <span className="text-[10px] text-amber-400 font-sans-display font-normal">Base + Doping</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Força */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center">
              <Sword className="w-5 h-5 text-red-400 mb-1" />
              <span className="text-[11px] text-slate-400 font-semibold">Força</span>
              <span className="text-lg font-pixel text-slate-100">{galo.strength}</span>
            </div>

            {/* Velocidade */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] text-slate-400 font-semibold">Velocidade</span>
              <span className="text-lg font-pixel text-slate-100">{galo.speed}</span>
            </div>

            {/* Defesa */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center">
              <Shield className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-[11px] text-slate-400 font-semibold">Defesa</span>
              <span className="text-lg font-pixel text-slate-100">{galo.defense}</span>
            </div>
          </div>

          {/* Dica do Treinador */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 font-sans-display flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <p>
              Quanto mais anabolizante você injetar na aba <strong>Farmácia</strong>, mais forte seu galo fica, mas o risco de infarto em combate sobe drasticamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
