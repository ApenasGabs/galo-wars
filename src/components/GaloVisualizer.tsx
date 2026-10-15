import { useEffect, useRef } from 'react';

interface GaloVisualizerProps {
  skinGrid: string[];
  steroidsLevel?: number;
  heartRateBpm?: number;
  size?: number; // Tamanho em px do canvas (ex: 200, 240)
  isAttacking?: boolean;
  isHit?: boolean;
  isDefeated?: boolean;
}

export function GaloVisualizer({
  skinGrid,
  steroidsLevel = 0,
  heartRateBpm = 80,
  size = 220,
  isAttacking = false,
  isHit = false,
  isDefeated = false
}: GaloVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Desabilitar anti-aliasing para manter o visual pixel art cristalino
    ctx.imageSmoothingEnabled = false;

    // Limpar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = 16;
    const pixelWidth = canvas.width / gridSize;
    const pixelHeight = canvas.height / gridSize;

    // Se estiver derrotado/desmaiado, desenha o galo deitado/girado
    if (isDefeated) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Desenhar pixels da matriz 16x16
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        const color = skinGrid[index];

        if (color && color.trim() !== '') {
          ctx.fillStyle = color;
          ctx.fillRect(col * pixelWidth, row * pixelHeight, pixelWidth, pixelHeight);

          // Efeito de sombra sutil na parte inferior de cada pixel para profundidade retrô
          ctx.fillStyle = 'rgba(0,0,0,0.15)';
          ctx.fillRect(col * pixelWidth, (row + 0.85) * pixelHeight, pixelWidth, pixelHeight * 0.15);
        }
      }
    }

    // Se tiver nível de bomba alto, desenha "aura/veias de anabolizante"
    if (steroidsLevel > 20) {
      const veinIntensity = Math.min(0.5, steroidsLevel / 200);
      ctx.fillStyle = `rgba(239, 68, 68, ${veinIntensity})`;
      // Desenha pulso nas esporas e crista
      ctx.fillRect(5 * pixelWidth, 13 * pixelHeight, 2 * pixelWidth, 2 * pixelHeight);
      ctx.fillRect(9 * pixelWidth, 13 * pixelHeight, 2 * pixelWidth, 2 * pixelHeight);
    }

    if (isDefeated) {
      ctx.restore();
    }
  }, [skinGrid, steroidsLevel, isDefeated]);

  // Taxa de animação do pulso do coração
  const pulseDuration = Math.max(0.3, 60 / heartRateBpm);

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Container com animações de combate e respiração */}
      <div
        className={`transition-transform duration-100 ${
          isAttacking ? 'translate-x-6 scale-110' : ''
        } ${isHit ? '-translate-x-4 brightness-150 rotate-[-8deg]' : ''} ${
          isDefeated ? 'opacity-70 grayscale' : 'animate-bounce'
        }`}
        style={{
          animationDuration: isDefeated ? '0s' : `${pulseDuration * 2}s`
        }}
      >
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="rounded-xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] [image-rendering:pixelated]"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>

      {/* Sombra no chão */}
      <div
        className="w-28 h-4 bg-black/60 rounded-full blur-xs mt-1 transition-all duration-300"
        style={{
          transform: isAttacking ? 'scaleX(1.3)' : isDefeated ? 'scaleX(0.5)' : 'scaleX(1)'
        }}
      />
    </div>
  );
}
