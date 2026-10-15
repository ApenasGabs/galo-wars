import { useState, useEffect, useCallback } from 'react';
import type { GaloStats, BombaItem } from '../types/game.ts';
import { createDefaultRoosterSkin } from '../utils/constants.ts';
import { soundFX } from '../utils/audio.ts';

const STORAGE_KEY = 'galo_wars_v1_save';

const INITIAL_GALO: GaloStats = {
  name: 'Galo de Ouro',
  title: 'Pintinho Promissor',
  level: 1,
  xp: 0,
  hunger: 80,
  energy: 85,
  hygiene: 70,
  happiness: 75,
  strength: 15,
  speed: 12,
  defense: 10,
  health: 100,
  maxHealth: 100,
  steroidsLevel: 0,
  heartRateBpm: 80,
  infarctRisk: 2,
  victories: 0,
  defeats: 0,
  skinGrid: createDefaultRoosterSkin()
};

export function useGameState() {
  const [milhoCoins, setMilhoCoins] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_coins`);
    return saved ? Number(saved) : 300; // Começa com 300 $MILHO para poder brincar e apostar
  });

  const [galo, setGalo] = useState<GaloStats>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_galo`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.skinGrid && parsed.skinGrid.length === 256) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_GALO;
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // Salvar sempre que mudar moedas ou status do galo
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_coins`, String(milhoCoins));
  }, [milhoCoins]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_galo`, JSON.stringify(galo));
  }, [galo]);

  // Ciclo metabólico suave (diminui fome e energia bem devagar)
  useEffect(() => {
    const interval = setInterval(() => {
      setGalo(prev => {
        const newHunger = Math.max(0, prev.hunger - 1);
        const newEnergy = Math.max(0, prev.energy - 1);
        // Se a fome estiver crítica, a vida sofre
        const healthDecay = newHunger === 0 ? 2 : 0;
        const newHealth = Math.max(10, prev.health - healthDecay);

        return {
          ...prev,
          hunger: newHunger,
          energy: newEnergy,
          health: newHealth
        };
      });
    }, 20000); // A cada 20 segundos

    return () => clearInterval(interval);
  }, []);

  // Alimentar o Galo com Milho Selecionado
  const feedRooster = useCallback(() => {
    if (milhoCoins < 10) {
      showNotification('Você precisa de 10 $MILHO para comprar saco de milho premium!', 'error');
      return;
    }

    setMilhoCoins(c => c - 10);
    soundFX.playCoin();

    setGalo(prev => {
      const newHunger = Math.min(100, prev.hunger + 35);
      const newHappiness = Math.min(100, prev.happiness + 15);
      const newHealth = Math.min(prev.maxHealth, prev.health + 15);
      return {
        ...prev,
        hunger: newHunger,
        happiness: newHappiness,
        health: newHealth
      };
    });

    soundFX.playRooster();
    showNotification('Galo alimentado com milho selecionado! Fome saciada.', 'success');
  }, [milhoCoins, showNotification]);

  // Banho de Areia
  const cleanRooster = useCallback(() => {
    setGalo(prev => ({
      ...prev,
      hygiene: 100,
      happiness: Math.min(100, prev.happiness + 20)
    }));
    soundFX.playHit();
    showNotification('Banho de areia concluído! Penas brilhando e afiadas.', 'success');
  }, [showNotification]);

  // Treino na Esteira / Saco de Pancadas
  const trainRooster = useCallback(() => {
    if (galo.energy < 20) {
      showNotification('O galo está muito cansado para treinar! Deixe ele descansar primeiro.', 'warning');
      return;
    }
    if (galo.hunger < 15) {
      showNotification('O galo está faminto! Alimente-o antes de puxar ferro.', 'warning');
      return;
    }

    soundFX.playHit();
    setGalo(prev => {
      const nextXp = prev.xp + 25;
      const willLevelUp = nextXp >= prev.level * 100;
      const newLevel = willLevelUp ? prev.level + 1 : prev.level;
      const remainingXp = willLevelUp ? nextXp - (prev.level * 100) : nextXp;

      const strengthBonus = willLevelUp ? 4 : 2;
      const speedBonus = willLevelUp ? 3 : 1;
      const defenseBonus = willLevelUp ? 3 : 1;

      return {
        ...prev,
        level: newLevel,
        xp: remainingXp,
        energy: Math.max(0, prev.energy - 20),
        hunger: Math.max(0, prev.hunger - 15),
        strength: prev.strength + strengthBonus,
        speed: prev.speed + speedBonus,
        defense: prev.defense + defenseBonus,
        maxHealth: prev.maxHealth + (willLevelUp ? 20 : 5),
        health: Math.min(prev.maxHealth + (willLevelUp ? 20 : 5), prev.health + 10),
        happiness: Math.min(100, prev.happiness + 10)
      };
    });

    showNotification('Treino concluído! Esporas calibradas e força aumentada.', 'success');
  }, [galo.energy, galo.hunger, showNotification]);

  // Descanso no Poleiro
  const restRooster = useCallback(() => {
    setGalo(prev => {
      const newEnergy = 100;
      const heartRateRelief = Math.max(75, prev.heartRateBpm - 25);
      const infarctRelief = Math.max(2, prev.infarctRisk - 8);
      return {
        ...prev,
        energy: newEnergy,
        heartRateBpm: heartRateRelief,
        infarctRisk: infarctRelief,
        health: prev.maxHealth
      };
    });
    showNotification('Galo descansou no poleiro! Energia no máximo e batimentos normalizados.', 'success');
  }, [showNotification]);

  // Injetar / Tomar Bomba
  const applyBomba = useCallback((bomba: BombaItem) => {
    if (milhoCoins < bomba.cost) {
      showNotification(`Sem $MILHO suficiente! O ${bomba.name} custa ${bomba.cost} $MILHO.`, 'error');
      return;
    }

    setMilhoCoins(c => c - bomba.cost);
    soundFX.playInject();

    setGalo(prev => {
      const newSteroids = Math.min(100, prev.steroidsLevel + bomba.toxicity);
      const newBpm = Math.min(250, prev.heartRateBpm + Math.round(bomba.toxicity * 1.8));
      const newInfarctRisk = Math.min(95, prev.infarctRisk + bomba.toxicity);

      // Checagem de piripaque se passar de 70% de risco
      const rolledCrisis = Math.random() * 100 < newInfarctRisk * 0.35;
      if (rolledCrisis) {
        soundFX.playHeartbeat();
        showNotification(
          `⚠️ PIRIPAQUE DO DOPING! O ${prev.name} quase teve uma parada cardíaca com o ${bomba.name}! Descanse-o imediatamente!`,
          'warning'
        );
      } else {
        showNotification(
          `💉 ${bomba.name} aplicada com sucesso! Força +${bomba.strengthBoost}, Velocidade +${bomba.speedBoost}, Defesa +${bomba.defenseBoost}!`,
          'success'
        );
      }

      return {
        ...prev,
        strength: prev.strength + bomba.strengthBoost,
        speed: prev.speed + bomba.speedBoost,
        defense: prev.defense + bomba.defenseBoost,
        steroidsLevel: newSteroids,
        heartRateBpm: newBpm,
        infarctRisk: newInfarctRisk,
        happiness: Math.min(100, prev.happiness + 20)
      };
    });
  }, [milhoCoins, showNotification]);

  // Atualizar Skin Personalizada
  const updateSkin = useCallback((newGrid: string[]) => {
    setGalo(prev => ({
      ...prev,
      skinGrid: newGrid
    }));
    showNotification('Nova skin aplicada no galo com sucesso!', 'success');
  }, [showNotification]);

  // Renomear Galo
  const renameRooster = useCallback((name: string) => {
    if (!name.trim()) return;
    setGalo(prev => ({ ...prev, name: name.trim() }));
    showNotification(`Nome atualizado para "${name.trim()}"!`, 'success');
  }, [showNotification]);

  // Finalizar combate
  const registerBattleResult = useCallback((won: boolean, netCoins: number, xpGained: number, sufferedHeartAttack: boolean) => {
    setMilhoCoins(c => Math.max(0, c + netCoins));

    setGalo(prev => {
      const nextXp = prev.xp + xpGained;
      const willLevelUp = nextXp >= prev.level * 100;
      const newLevel = willLevelUp ? prev.level + 1 : prev.level;
      const remainingXp = willLevelUp ? nextXp - (prev.level * 100) : nextXp;

      return {
        ...prev,
        level: newLevel,
        xp: remainingXp,
        victories: won ? prev.victories + 1 : prev.victories,
        defeats: !won ? prev.defeats + 1 : prev.defeats,
        health: sufferedHeartAttack ? 15 : Math.max(20, won ? prev.health - 20 : 10),
        energy: Math.max(10, prev.energy - 35),
        hunger: Math.max(10, prev.hunger - 25),
        title: prev.victories >= 10 ? 'Campeão Clandestino' : prev.victories >= 5 ? 'Galo Pesado' : 'Galo de Rinha'
      };
    });
  }, []);

  // Reiniciar jogo
  const resetGame = useCallback(() => {
    setMilhoCoins(300);
    setGalo(INITIAL_GALO);
    localStorage.removeItem(`${STORAGE_KEY}_coins`);
    localStorage.removeItem(`${STORAGE_KEY}_galo`);
    showNotification('Jogo reiniciado! Novo galo pronto para treinar.', 'success');
  }, [showNotification]);

  return {
    milhoCoins,
    galo,
    notification,
    feedRooster,
    cleanRooster,
    trainRooster,
    restRooster,
    applyBomba,
    updateSkin,
    renameRooster,
    registerBattleResult,
    resetGame,
    showNotification
  };
}
