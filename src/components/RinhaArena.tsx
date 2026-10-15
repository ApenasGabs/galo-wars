import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Coins, 
  ShieldAlert, 
  Trophy, 
  Skull, 
  Flame, 
  Volume2, 
  RefreshCw,
  Heart,
  Zap,
  Shield
} from 'lucide-react';
import type { GaloStats, OpponentGalo, CombatLog } from '../types/game.ts';
import { OPPONENTS } from '../utils/constants.ts';
import { GaloVisualizer } from './GaloVisualizer.tsx';
import { soundFX } from '../utils/audio.ts';

interface RinhaArenaProps {
  galo: GaloStats;
  milhoCoins: number;
  onBattleEnd: (won: boolean, netCoins: number, xpGained: number, sufferedHeartAttack: boolean) => void;
}

export const RinhaArena: React.FC<RinhaArenaProps> = ({
  galo,
  milhoCoins,
  onBattleEnd
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentGalo>(OPPONENTS[0]);
  const [betAmount, setBetAmount] = useState<number>(() => (milhoCoins >= 50 ? 50 : milhoCoins >= 20 ? 20 : 0));
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [fightFinished, setFightFinished] = useState<boolean>(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  // Status dinâmicos da luta
  const [playerHp, setPlayerHp] = useState<number>(galo.health);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(galo.maxHealth);
  const [opponentHp, setOpponentHp] = useState<number>(selectedOpponent.health);
  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);

  // Estados de animação visual
  const [playerAttacking, setPlayerAttacking] = useState<boolean>(false);
  const [opponentAttacking, setOpponentAttacking] = useState<boolean>(false);
  const [playerHit, setPlayerHit] = useState<boolean>(false);
  const [opponentHit, setOpponentHit] = useState<boolean>(false);
  const [playerDefeated, setPlayerDefeated] = useState<boolean>(false);
  const [opponentDefeated, setOpponentDefeated] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Sincronizar HP ao trocar oponente
  useEffect(() => {
    if (!isFighting && !fightFinished) {
      setOpponentHp(selectedOpponent.health);
      setPlayerHp(galo.health);
      setPlayerMaxHp(galo.maxHealth);
    }
  }, [selectedOpponent, galo.health, galo.maxHealth, isFighting, fightFinished]);

  // Auto-scroll nos logs da arena
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatLogs]);

  // Gerar grid simples para o oponente
  const opponentSkinGrid = React.useMemo(() => {
    const grid = new Array(256).fill('');
    const c = selectedOpponent;
    // Crista
    [20, 21, 22, 35, 36, 37, 38].forEach(i => grid[i] = c.combColor);
    // Cabeça
    [53, 54, 67, 68, 69, 70, 83, 84, 85].forEach(i => grid[i] = c.skinColor);
    grid[68] = '#000000'; // Olho
    grid[71] = '#ea580c'; // Bico
    grid[72] = '#ea580c';
    // Corpo
    [99, 102, 115, 117, 118, 131, 132, 133, 147, 148, 149].forEach(i => grid[i] = c.skinColor);
    // Asas
    [161, 162, 163, 164, 177, 178, 179].forEach(i => grid[i] = c.featherColor);
    // Pernas e esporas
    [194, 197, 210, 213, 225, 226, 229, 230].forEach(i => grid[i] = '#d97706');
    grid[209] = '#94a3b8';
    grid[212] = '#94a3b8';
    return grid;
  }, [selectedOpponent]);

  // Iniciar a Rinha!
  const startFight = () => {
    if (betAmount > 0 && milhoCoins < betAmount) return;
    if (galo.health < 25) return;

    soundFX.playBell();
    setIsFighting(true);
    setFightFinished(false);
    setWinner(null);
    setPlayerDefeated(false);
    setOpponentDefeated(false);
    setCombatLogs([]);

    let curPlayerHp = galo.health;
    let curOppHp = selectedOpponent.health;
    setPlayerHp(curPlayerHp);
    setOpponentHp(curOppHp);

    let round = 1;
    let ended = false;

    // Checagem de Infarto Pré-Luta ou Taquicardia Crítica
    const rollPreFightInfarct = Math.random() * 100 < galo.infarctRisk * 0.4;

    const interval = setInterval(() => {
      if (ended) {
        clearInterval(interval);
        return;
      }

      // 1. Possibilidade de Taquicardia / Infarto pelo Doping
      if (rollPreFightInfarct && round === 2) {
        ended = true;
        clearInterval(interval);
        soundFX.playHeartbeat();
        setPlayerDefeated(true);
        setWinner('opponent');
        setIsFighting(false);
        setFightFinished(true);

        setCombatLogs(prev => [
          ...prev,
          {
            id: `infarct-${Date.now()}`,
            round,
            attacker: galo.name,
            action: 'PARADA CARDÍACA',
            damage: curPlayerHp,
            isCritical: true,
            isHeartAttack: true,
            message: `🚨 PIRIPAQUE FULMINANTE! O coração de ${galo.name} não aguentou o anabolizante e a pressão da rinha! Ele desmaiou na arena!`
          }
        ]);

        onBattleEnd(false, -betAmount, 10, true);
        return;
      }

      // Turno do Jogador vs Turno do Oponente
      const playerTurn = round % 2 !== 0;

      if (playerTurn) {
        // Jogador ataca
        setPlayerAttacking(true);
        setOpponentHit(true);
        soundFX.playHit();

        setTimeout(() => {
          setPlayerAttacking(false);
          setOpponentHit(false);
        }, 220);

        const isCrit = Math.random() < 0.25;
        const baseDmg = Math.max(8, galo.strength - Math.round(selectedOpponent.defense * 0.4));
        const variance = Math.floor(Math.random() * 8) - 4;
        const totalDmg = Math.max(5, Math.round((baseDmg + variance) * (isCrit ? 1.6 : 1.0)));

        curOppHp = Math.max(0, curOppHp - totalDmg);
        setOpponentHp(curOppHp);

        const attackMoves = [
          'Voadora de Espora Dupla',
          'Bicada Perfurante no Olho',
          'Giro da Asa Dilacerante',
          'Esporada no Peito'
        ];
        const move = attackMoves[Math.floor(Math.random() * attackMoves.length)];

        setCombatLogs(prev => [
          ...prev,
          {
            id: `p-${round}-${Date.now()}`,
            round,
            attacker: galo.name,
            action: move,
            damage: totalDmg,
            isCritical: isCrit,
            message: `${galo.name} desferiu ${move} causando ${totalDmg} de dano! ${isCrit ? '💥 CRÍTICO BRUTAL!' : ''}`
          }
        ]);

        if (curOppHp <= 0) {
          ended = true;
          clearInterval(interval);
          setOpponentDefeated(true);
          setWinner('player');
          setIsFighting(false);
          setFightFinished(true);
          soundFX.playRooster();
          soundFX.playCoin();

          // Chuva de confete no triunfo
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          const prize = betAmount === 0 ? 25 : Math.round(betAmount * selectedOpponent.odds);
          const netWin = betAmount === 0 ? 25 : prize - betAmount;
          onBattleEnd(true, netWin, selectedOpponent.reward, false);
          return;
        }
      } else {
        // Oponente ataca
        setOpponentAttacking(true);
        setPlayerHit(true);
        soundFX.playHit();

        setTimeout(() => {
          setOpponentAttacking(false);
          setPlayerHit(false);
        }, 220);

        const isCrit = Math.random() < 0.2;
        const baseDmg = Math.max(6, selectedOpponent.strength - Math.round(galo.defense * 0.4));
        const variance = Math.floor(Math.random() * 6) - 3;
        const totalDmg = Math.max(4, Math.round((baseDmg + variance) * (isCrit ? 1.5 : 1.0)));

        curPlayerHp = Math.max(0, curPlayerHp - totalDmg);
        setPlayerHp(curPlayerHp);

        setCombatLogs(prev => [
          ...prev,
          {
            id: `o-${round}-${Date.now()}`,
            round,
            attacker: selectedOpponent.name,
            action: 'Golpe de Rinha',
            damage: totalDmg,
            isCritical: isCrit,
            message: `${selectedOpponent.name} acertou uma bicada rápida em ${galo.name} por ${totalDmg} de dano!`
          }
        ]);

        if (curPlayerHp <= 0) {
          ended = true;
          clearInterval(interval);
          setPlayerDefeated(true);
          setWinner('opponent');
          setIsFighting(false);
          setFightFinished(true);
          onBattleEnd(false, -betAmount, 15, false);
          return;
        }
      }

      round++;
    }, 800);
  };

  const potentialWin = betAmount === 0 ? 25 : Math.round(betAmount * selectedOpponent.odds);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ARENA DE COMBATE (OCTÓGONO DO SUBTERRÂNEO) */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-red-950 shadow-2xl relative overflow-hidden scanline">
        {/* Banner do Torneio */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="font-pixel text-xs text-red-500 uppercase tracking-widest">
              AO VIVO • COLISEU CLANDESTINO
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>ODDS DO CONFRONTO:</span>
            <span className="text-amber-400 font-pixel">{selectedOpponent.odds.toFixed(2)}x</span>
          </div>
        </div>

        {/* Luta Lado a Lado: Jogador vs Oponente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4 relative">
          {/* Lado Esquerdo: Seu Galo */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-full flex items-center justify-between text-xs mb-2">
              <span className="font-pixel text-amber-400">{galo.name} (VOCÊ)</span>
              <span className="font-mono text-slate-300">
                {playerHp} / {playerMaxHp} HP
              </span>
            </div>

            {/* Barra de Vida Jogador */}
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
              />
            </div>

            <GaloVisualizer
              skinGrid={galo.skinGrid}
              steroidsLevel={galo.steroidsLevel}
              heartRateBpm={galo.heartRateBpm}
              size={200}
              isAttacking={playerAttacking}
              isHit={playerHit}
              isDefeated={playerDefeated}
            />

            <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-red-400">
                <Swords className="w-3.5 h-3.5" /> {galo.strength} ATQ
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <Shield className="w-3.5 h-3.5" /> {galo.defense} DEF
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5" /> {galo.speed} VEL
              </span>
            </div>
          </div>

          {/* Divisor "VS" no Centro */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-600 border-4 border-slate-950 flex items-center justify-center font-pixel text-xs text-white shadow-xl shadow-red-950 animate-pulse">
              VS
            </div>
          </div>

          {/* Lado Direito: Oponente */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-full flex items-center justify-between text-xs mb-2">
              <span className="font-pixel text-red-400">{selectedOpponent.name}</span>
              <span className="font-mono text-slate-300">
                {opponentHp} / {selectedOpponent.maxHealth} HP
              </span>
            </div>

            {/* Barra de Vida Oponente */}
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, (opponentHp / selectedOpponent.maxHealth) * 100)}%` }}
              />
            </div>

            <GaloVisualizer
              skinGrid={opponentSkinGrid}
              steroidsLevel={selectedOpponent.steroidsLevel}
              heartRateBpm={120}
              size={200}
              isAttacking={opponentAttacking}
              isHit={opponentHit}
              isDefeated={opponentDefeated}
            />

            <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-red-400">
                <Swords className="w-3.5 h-3.5" /> {selectedOpponent.strength} ATQ
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <Shield className="w-3.5 h-3.5" /> {selectedOpponent.defense} DEF
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5" /> {selectedOpponent.speed} VEL
              </span>
            </div>
          </div>
        </div>

        {/* Mensagem de Vencedor / Resultado */}
        {fightFinished && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center animate-fade-in">
            {winner === 'player' ? (
              <div>
                <h3 className="font-pixel text-lg text-emerald-400 mb-1 flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" /> VITÓRIA MAGNÍFICA!
                </h3>
                <p className="text-sm text-slate-300">
                  {galo.name} faturou a rinha e você lucrou{' '}
                  <strong className="text-amber-400 font-pixel">
                    +{potentialWin - betAmount} $MILHO
                  </strong>
                  !
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-pixel text-lg text-red-500 mb-1 flex items-center justify-center gap-2">
                  <Skull className="w-5 h-5" /> DERROTA NA ARENA
                </h3>
                <p className="text-sm text-slate-300">
                  Você perdeu a aposta de{' '}
                  <strong className="text-red-400 font-pixel">{betAmount} $MILHO</strong>. Cuide do
                  seu galo no galinheiro antes da próxima!
                </p>
              </div>
            )}
          </div>
        )}

        {/* LOGS DE COMBATE AO VIVO */}
        {combatLogs.length > 0 && (
          <div className="mt-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto space-y-2 font-mono text-xs">
            {combatLogs.map(log => (
              <div
                key={log.id}
                className={`p-2 rounded-lg ${
                  log.isHeartAttack
                    ? 'bg-red-950 text-red-300 border border-red-800 font-bold'
                    : log.attacker === galo.name
                    ? 'bg-amber-950/30 text-amber-200'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                <span className="text-slate-500 mr-2">[Rnd {log.round}]</span>
                {log.message}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* PAINEL DE APOSTAS & SELEÇÃO DE ADVERSÁRIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de Galos Oponentes */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-pixel text-slate-200 mb-4 flex items-center justify-between">
            <span>SELECIONE O ADVERSÁRIO</span>
            <span className="text-xs font-sans-display text-slate-400 font-normal">
              Odds calculadas por cartel
            </span>
          </h3>

          <div className="space-y-3">
            {OPPONENTS.map(opp => {
              const isSelected = selectedOpponent.id === opp.id;

              return (
                <div
                  key={opp.id}
                  onClick={() => !isFighting && setSelectedOpponent(opp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  } ${isFighting ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-700"
                      style={{ backgroundColor: opp.skinColor }}
                    >
                      🐓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-sans-display">
                        {opp.name}
                      </h4>
                      <p className="text-xs text-slate-400 italic font-mono">{opp.nickname}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-pixel text-amber-400 text-sm">
                      {opp.odds.toFixed(2)}x
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">Odd da Casa</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Casa de Apostas: GaloBet */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-pixel text-amber-400 flex items-center gap-2">
                <Coins className="w-4 h-4" /> GALOBET
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                MOEDA FICTÍCIA
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Defina o valor da aposta em <strong>$MILHO</strong> no seu galo. Se ele vencer a rinha,
              você recolhe a bolada calculada pelas odds da mesa!
            </p>

            {/* Controle de Valor da Aposta */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Valor da Aposta:</span>
                <span className="font-pixel text-amber-400 text-sm">{betAmount} $MILHO</span>
              </div>

              {/* Botões rápidos de aposta */}
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 20, 50, 100, 250].map(val => (
                  <button
                    key={val}
                    type="button"
                    disabled={isFighting || (val > 0 && milhoCoins < val)}
                    onClick={() => setBetAmount(val)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      betAmount === val
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : val === 0
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    } disabled:opacity-30`}
                  >
                    {val === 0 ? 'Grátis' : val}
                  </button>
                ))}
              </div>

              {/* Retorno Estimado */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Retorno Potencial:</span>
                <span className="text-emerald-400 font-pixel text-sm">+{potentialWin} $MILHO</span>
              </div>
            </div>
          </div>

          {/* Botão de Entrar na Rinha */}
          <button
            onClick={startFight}
            disabled={isFighting || (betAmount > 0 && milhoCoins < betAmount) || galo.health < 25}
            className={`w-full py-4 rounded-2xl font-pixel text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
              isFighting
                ? 'bg-slate-800 text-slate-500 cursor-wait'
                : (betAmount > 0 && milhoCoins < betAmount)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : galo.health < 25
                ? 'bg-red-950 text-red-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-950/60'
            }`}
          >
            {isFighting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> RINHANDO...
              </>
            ) : galo.health < 25 ? (
              'GALO MUITO FERIDO (CUIDE NO GALINHEIRO)'
            ) : (
              <>
                <Swords className="w-4 h-4" /> {betAmount === 0 ? 'LUTAR GRÁTIS (TREINO)' : 'APOSTAR & LUTAR!'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
