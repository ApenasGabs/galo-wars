export type GridColor = string; // hex ou rgba

export interface GaloStats {
  name: string;
  title: string;
  level: number;
  xp: number;
  hunger: number; // 0 (faminto) a 100 (cheio)
  energy: number; // 0 (exausto) a 100 (disposto)
  hygiene: number; // 0 (sujo) a 100 (limpo)
  happiness: number; // 0 (deprimido) a 100 (em fúria)
  strength: number; // poder de ataque da espora
  speed: number; // velocidade da voadora
  defense: number; // resistência a bicadas
  health: number;
  maxHealth: number;
  steroidsLevel: number; // 0 a 100 (nível de doping acumulado)
  heartRateBpm: number; // 70 a 240 bpm
  infarctRisk: number; // % chance de ataque cardíaco na luta
  victories: number;
  defeats: number;
  skinGrid: GridColor[]; // Array de 256 cores (16x16)
}

export interface BombaItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  cost: number;
  strengthBoost: number;
  speedBoost: number;
  defenseBoost: number;
  toxicity: number; // Aumento no risco de infarto
  icon: string;
  rarity: 'comum' | 'proibido' | 'subterraneo' | 'nuclear';
}

export interface OpponentGalo {
  id: string;
  name: string;
  nickname: string;
  quote: string;
  strength: number;
  speed: number;
  defense: number;
  health: number;
  maxHealth: number;
  steroidsLevel: number;
  odds: number; // ex: 1.85, 3.20
  reward: number; // MilhoCoins de prêmio base
  skinColor: string;
  featherColor: string;
  combColor: string;
}

export interface CombatLog {
  id: string;
  round: number;
  attacker: string;
  action: string;
  damage: number;
  isCritical: boolean;
  isHeartAttack?: boolean;
  message: string;
}
