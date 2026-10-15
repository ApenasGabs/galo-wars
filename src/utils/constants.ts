import type { BombaItem, OpponentGalo } from '../types/game.ts';

// Grid 16x16 (256 pixels)
// Transparente = ''
export const createDefaultRoosterSkin = (): string[] => {
  const grid = new Array(256).fill('');

  const P = {
    RED: '#ef4444',     // Crista e barbela
    DARK_RED: '#b91c1c',
    ORANGE: '#f97316',  // Bico e patas
    YELLOW: '#eab308',  // Olho / Detalhe
    WHITE: '#f8fafc',   // Cabeça / penas
    GRAY: '#64748b',    // Sombra
    DARK_BLUE: '#1e3a8a', // Corpo
    GREEN: '#15803d',   // Asa
    BLACK: '#020617',   // Contorno / pupila
    PURPLE: '#6b21a8'   // Cauda
  };

  // Linhas 1-3: Crista do galo (vermelha)
  [20, 21, 22, 35, 36, 37, 38, 51, 52].forEach(i => grid[i] = P.RED);
  [19, 34].forEach(i => grid[i] = P.DARK_RED);

  // Linhas 3-6: Cabeça, Olho e Bico
  [53, 54, 67, 68, 69, 70, 83, 84, 85, 86].forEach(i => grid[i] = P.WHITE);
  grid[69] = P.BLACK; // Olho
  grid[68] = P.YELLOW; // Brilho olho
  // Bico (para a direita)
  [71, 72, 87].forEach(i => grid[i] = P.ORANGE);
  // Barbela
  [100, 101, 116].forEach(i => grid[i] = P.RED);

  // Linhas 6-10: Pescoço e Peito Musculoso
  [99, 102, 115, 117, 118, 131, 132, 133, 134, 147, 148, 149, 150].forEach(i => grid[i] = P.ORANGE);
  [98, 114, 130, 146].forEach(i => grid[i] = P.DARK_RED);

  // Tronco, Asa e Cauda
  [129, 145, 161, 162, 163, 164, 165, 177, 178, 179, 180, 181].forEach(i => grid[i] = P.DARK_BLUE);
  [163, 164, 179].forEach(i => grid[i] = P.GREEN);

  // Penas da Cauda alta (esquerda)
  [113, 128, 144, 160, 97, 112].forEach(i => grid[i] = P.PURPLE);

  // Pernas e Esporas Afiadas
  [194, 197, 210, 213].forEach(i => grid[i] = P.ORANGE);
  [225, 226, 227, 229, 230].forEach(i => grid[i] = P.ORANGE);
  grid[209] = '#cbd5e1'; // Espora esquerda prateada
  grid[212] = '#cbd5e1'; // Espora direita prateada

  return grid;
};

export const BOMBAS_CATALOG: BombaItem[] = [
  {
    id: 'creatina',
    name: 'Creatina de Galinheiro',
    subtitle: '100% Monohidratada de Granja',
    description: 'Misturada com farelo de milho. Dá aquele inchaço modesto no peito do frango.',
    cost: 50,
    strengthBoost: 6,
    speedBoost: 3,
    defenseBoost: 4,
    toxicity: 4,
    icon: '🌾',
    rarity: 'comum'
  },
  {
    id: 'potenay',
    name: 'Potenay 5000 Injetável',
    subtitle: 'Agropecuária Sem Receita',
    description: 'Estimulante vitamínico bovino. O galo fica bicando até a parede da baia.',
    cost: 130,
    strengthBoost: 16,
    speedBoost: 10,
    defenseBoost: 6,
    toxicity: 12,
    icon: '💉',
    rarity: 'proibido'
  },
  {
    id: 'trembo',
    name: 'Trembolona de Aviário',
    subtitle: 'Origem Clandestina Paraguaia',
    description: 'Anabolizante cavalar. As veias da crista saltam e o olhar fica puramente psicopata.',
    cost: 300,
    strengthBoost: 28,
    speedBoost: 18,
    defenseBoost: 14,
    toxicity: 22,
    icon: '🧪',
    rarity: 'subterraneo'
  },
  {
    id: 'energetico_uranio',
    name: 'Monster Césio-137',
    subtitle: 'Energético Radiativo',
    description: 'Taurina destilada em água pesada. A ave fica com 240 bpm e não dorme tem 5 dias.',
    cost: 500,
    strengthBoost: 42,
    speedBoost: 32,
    defenseBoost: 10,
    toxicity: 32,
    icon: '⚡',
    rarity: 'subterraneo'
  },
  {
    id: 'bico_nuclear',
    name: 'Elixir Bico de Adamantium',
    subtitle: 'Experimento Militar Top Secret',
    description: 'Proibido em 18 convenções de Genebra. Transforma a espora em lâmina de plasma.',
    cost: 950,
    strengthBoost: 65,
    speedBoost: 45,
    defenseBoost: 35,
    toxicity: 45,
    icon: '☢️',
    rarity: 'nuclear'
  }
];

export const OPPONENTS: OpponentGalo[] = [
  {
    id: 'sadia',
    name: 'Frango da Sadia Fugitivo',
    nickname: 'O Sobrevivente',
    quote: '"Eu vi coisas que nenhum nugget jamais deveria ver."',
    strength: 18,
    speed: 15,
    defense: 10,
    health: 90,
    maxHealth: 90,
    steroidsLevel: 5,
    odds: 1.35,
    reward: 75,
    skinColor: '#fef08a',
    featherColor: '#ffffff',
    combColor: '#f87171'
  },
  {
    id: 'bico_aco',
    name: 'Bico de Aço da Baixada',
    nickname: 'Veterano de 40 Rinhas',
    quote: '"Minha espora já desmanchou lenda."',
    strength: 32,
    speed: 25,
    defense: 22,
    health: 140,
    maxHealth: 140,
    steroidsLevel: 25,
    odds: 1.80,
    reward: 200,
    skinColor: '#78350f',
    featherColor: '#172554',
    combColor: '#b91c1c'
  },
  {
    id: 'carioca',
    name: 'Carioca Voador do Morro',
    nickname: 'O Rei do Giro',
    quote: '"Voadora no peito e bico no bico, pega nada!"',
    strength: 48,
    speed: 45,
    defense: 28,
    health: 180,
    maxHealth: 180,
    steroidsLevel: 45,
    odds: 2.40,
    reward: 420,
    skinColor: '#0f172a',
    featherColor: '#059669',
    combColor: '#dc2626'
  },
  {
    id: 'clonazepano',
    name: 'Galo Clonazepano Mutante',
    nickname: 'O Sem-Dor',
    quote: '"Ele não pisca. Ele não respira. Ele só bate."',
    strength: 75,
    speed: 55,
    defense: 50,
    health: 260,
    maxHealth: 260,
    steroidsLevel: 80,
    odds: 3.60,
    reward: 850,
    skinColor: '#581c87',
    featherColor: '#3b82f6',
    combColor: '#a855f7'
  },
  {
    id: 'cyber_boss',
    name: 'CYBER-GALO X-9000',
    nickname: 'A Máquina Suprema da Rinha',
    quote: '"SISTEMA ATIVADO: ANIQUILAÇÃO DE ESPORAS EM CURSO."',
    strength: 110,
    speed: 80,
    defense: 75,
    health: 380,
    maxHealth: 380,
    steroidsLevel: 98,
    odds: 5.50,
    reward: 2000,
    skinColor: '#0284c7',
    featherColor: '#0f172a',
    combColor: '#06b6d4'
  }
];

export const PRESET_SKINS: { name: string; description: string; colors: string[] }[] = [
  {
    name: 'Galo Clássico de Rinha',
    description: 'Cores tradicionais de galo de briga brasileiro com peito forte e crista rubra.',
    colors: createDefaultRoosterSkin()
  },
  {
    name: 'Galo Cyber Neon',
    description: 'Galo cibernético banhado em LED ciano, esporas laser e crista roxa.',
    colors: (() => {
      const base = createDefaultRoosterSkin();
      return base.map(c => {
        if (!c) return '';
        if (c === '#ef4444' || c === '#b91c1c') return '#ec4899'; // Rosa neon
        if (c === '#f8fafc' || c === '#64748b') return '#06b6d4'; // Ciano
        if (c === '#1e3a8a') return '#0f172a'; // Dark
        return '#38bdf8';
      });
    })()
  },
  {
    name: 'Galo Dourado dos Crias',
    description: 'Tingido no ouro maciço 24k com esporas cromadas.',
    colors: (() => {
      const base = createDefaultRoosterSkin();
      return base.map(c => {
        if (!c) return '';
        if (c === '#ef4444' || c === '#b91c1c') return '#f59e0b';
        return '#facc15';
      });
    })()
  }
];
