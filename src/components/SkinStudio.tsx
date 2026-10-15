import React, { useState, useRef, useCallback } from 'react';
import { 
  Paintbrush, 
  PaintBucket, 
  Eraser, 
  Pipette, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Download, 
  Upload 
} from 'lucide-react';
import { GaloVisualizer } from './GaloVisualizer.tsx';
import { PRESET_SKINS, createDefaultRoosterSkin } from '../utils/constants.ts';

interface SkinStudioProps {
  currentSkin: string[];
  onSaveSkin: (newGrid: string[]) => void;
}

const PALETTE = [
  '#ef4444', // Vermelho crista
  '#b91c1c', // Vermelho escuro
  '#f97316', // Laranja bico
  '#eab308', // Amarelo ouro
  '#fef08a', // Amarelo claro
  '#22c55e', // Verde pena
  '#15803d', // Verde escuro
  '#06b6d4', // Ciano neon
  '#3b82f6', // Azul royal
  '#1e3a8a', // Azul escuro
  '#a855f7', // Roxo
  '#ec4899', // Rosa chiclete
  '#f8fafc', // Branco
  '#94a3b8', // Cinza aço
  '#475569', // Cinza escuro
  '#020617'  // Preto
];

export const SkinStudio: React.FC<SkinStudioProps> = ({
  currentSkin,
  onSaveSkin
}) => {
  const [grid, setGrid] = useState<string[]>(() => [...currentSkin]);
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [tool, setTool] = useState<'pencil' | 'bucket' | 'eraser' | 'picker'>('pencil');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Pintar um pixel individual
  const applyPixel = (index: number) => {
    if (tool === 'picker') {
      const color = grid[index];
      if (color) setSelectedColor(color);
      setTool('pencil');
      return;
    }

    if (tool === 'bucket') {
      // Flood Fill Algorithm para preenchimento de área
      const targetColor = grid[index] || '';
      const fillColor = selectedColor;
      if (targetColor === fillColor) return;

      const newGrid = [...grid];
      const queue: number[] = [index];
      const visited = new Set<number>();

      while (queue.length > 0) {
        const curr = queue.pop()!;
        if (visited.has(curr)) continue;
        visited.add(curr);

        if ((newGrid[curr] || '') === targetColor) {
          newGrid[curr] = fillColor;

          const row = Math.floor(curr / 16);
          const col = curr % 16;

          if (row > 0) queue.push(curr - 16);
          if (row < 15) queue.push(curr + 16);
          if (col > 0) queue.push(curr - 1);
          if (col < 15) queue.push(curr + 1);
        }
      }

      setGrid(newGrid);
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = tool === 'eraser' ? '' : selectedColor;
    setGrid(newGrid);
  };

  const handleMouseDown = (index: number) => {
    setIsMouseDown(true);
    applyPixel(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isMouseDown && tool !== 'bucket' && tool !== 'picker') {
      applyPixel(index);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Carregar preset
  const handleLoadPreset = (colors: string[]) => {
    setGrid([...colors]);
  };

  // Limpar tela
  const handleClear = () => {
    setGrid(new Array(256).fill(''));
  };

  return (
    <div
      className="max-w-6xl mx-auto space-y-6 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Banner Superior do Estúdio */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-pixel text-[10px]">
              CUSTOMIZAÇÃO TOTAL
            </span>
            <span className="text-xs text-purple-400 font-mono">CANVAS 16x16</span>
          </div>
          <h2 className="text-2xl font-bold font-sans-display text-white">
            Skin Studio do Galo
          </h2>
          <p className="text-sm text-slate-400">
            Desenhe na mão, pixel por pixel, a skin lendária do seu combatente ou aplique temas da comunidade!
          </p>
        </div>

        <button
          onClick={() => onSaveSkin(grid)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-pixel text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all active:scale-95"
        >
          <Check className="w-4 h-4" /> VESTIR NO MEU GALO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Área de Pintura do Grid */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center">
          {/* Barra de Ferramentas */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTool('pencil')}
                className={`p-2.5 rounded-xl transition-all ${
                  tool === 'pencil' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Lápis"
              >
                <Paintbrush className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTool('bucket')}
                className={`p-2.5 rounded-xl transition-all ${
                  tool === 'bucket' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Balde de Tinta (Preenchimento)"
              >
                <PaintBucket className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTool('eraser')}
                className={`p-2.5 rounded-xl transition-all ${
                  tool === 'eraser' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Borracha"
              >
                <Eraser className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTool('picker')}
                className={`p-2.5 rounded-xl transition-all ${
                  tool === 'picker' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Conta-Gotas"
              >
                <Pipette className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </button>
            </div>
          </div>

          {/* O Canvas Interativo em Grid (16x16) */}
          <div className="p-3 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl">
            <div
              className="grid grid-cols-16 gap-0 bg-slate-900/40 border border-slate-800 select-none touch-none"
              style={{
                width: '320px',
                height: '320px',
                gridTemplateColumns: 'repeat(16, minmax(0, 1fr))'
              }}
            >
              {grid.map((color, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => handleMouseDown(idx)}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  className="border-[0.5px] border-slate-800/40 cursor-crosshair transition-colors"
                  style={{
                    backgroundColor: color || 'transparent'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Paleta de Cores Retrô */}
          <div className="w-full mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Paleta de Cores:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono">Personalizada:</span>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
              {PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedColor(c);
                    if (tool === 'eraser') setTool('pencil');
                  }}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform active:scale-90 ${
                    selectedColor === c ? 'border-white scale-110 shadow-md' : 'border-slate-800'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Preview Dinâmico & Presets Prontos */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Preview em Tempo Real */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-sm font-pixel text-slate-300 mb-4">
              PREVIEW DO MODELO
            </h3>

            <div className="my-2">
              <GaloVisualizer skinGrid={grid} steroidsLevel={0} heartRateBpm={80} size={180} />
            </div>

            <p className="text-xs text-slate-400 mt-3 font-sans-display">
              Veja exatamente como sua arte fica animada antes de colocar na arena!
            </p>
          </div>

          {/* Modelos / Presets Prontos */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-pixel text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>SKINS PRONTAS</span>
            </h3>

            <div className="space-y-3">
              {PRESET_SKINS.map(preset => (
                <div
                  key={preset.name}
                  onClick={() => handleLoadPreset(preset.colors)}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer group"
                >
                  <h4 className="text-xs font-bold font-sans-display text-slate-200 group-hover:text-purple-400 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
