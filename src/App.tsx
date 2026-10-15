import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState.ts';
import { Navbar } from './components/Navbar.tsx';
import { GaloGotchi } from './components/GaloGotchi.tsx';
import { FarmaciaClandestina } from './components/FarmaciaClandestina.tsx';
import { RinhaArena } from './components/RinhaArena.tsx';
import { SkinStudio } from './components/SkinStudio.tsx';
import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tamagotchi' | 'farmacia' | 'rinha' | 'studio'>('tamagotchi');

  const {
    milhoCoins,
    galo,
    notification,
    feedRooster,
    cleanRooster,
    trainRooster,
    restRooster,
    forageCorn,
    claimBolsaMilho,
    applyBomba,
    updateSkin,
    renameRooster,
    registerBattleResult,
    resetGame
  } = useGameState();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-display selection:bg-amber-500 selection:text-black">
      {/* Toast de Notificação */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold ${
              notification.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-800'
                : notification.type === 'warning'
                ? 'bg-amber-950/90 text-amber-200 border-amber-800'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : notification.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        milhoCoins={milhoCoins}
        galo={galo}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'tamagotchi' && (
          <GaloGotchi
            galo={galo}
            onFeed={feedRooster}
            onClean={cleanRooster}
            onTrain={trainRooster}
            onRest={restRooster}
            onForage={forageCorn}
            onClaimBolsaMilho={claimBolsaMilho}
            onRename={renameRooster}
            milhoCoins={milhoCoins}
          />
        )}

        {activeTab === 'farmacia' && (
          <FarmaciaClandestina
            galo={galo}
            milhoCoins={milhoCoins}
            onApplyBomba={applyBomba}
          />
        )}

        {activeTab === 'rinha' && (
          <RinhaArena
            galo={galo}
            milhoCoins={milhoCoins}
            onBattleEnd={registerBattleResult}
          />
        )}

        {activeTab === 'studio' && (
          <SkinStudio
            currentSkin={galo.skinGrid}
            onSaveSkin={updateSkin}
          />
        )}
      </main>

      {/* Rodapé Retrô com Créditos e Botão de Reset */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>🐓 Galo Wars v1.0.0</span>
            <span>•</span>
            <span>Feito com zoeira e engenharia para navegadores</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente resetar o jogo e começar com um novo galo?')) {
                  resetGame();
                }
              }}
              className="flex items-center gap-1.5 text-slate-600 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar Savegame</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">
              Desenvolvido por <strong>@ApenasGabs</strong> & <strong>Kraken</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
