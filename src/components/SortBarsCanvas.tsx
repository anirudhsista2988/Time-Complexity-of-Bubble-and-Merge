import React, { useEffect, useRef } from 'react';

interface SortBarsCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  count?: number;
}

export const SortBarsCanvas: React.FC<SortBarsCanvasProps> = ({ className = '', count = 60 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let arr = Array.from({ length: count }, (_, i) => i + 1);
    let phase = 0;
    let i = 0, j = 0;
    let modeTimer = 0;

    const shuffle = (a: number[]) => {
      for (let k = a.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [a[k], a[r]] = [a[r], a[k]];
      }
    };

    const W = canvas.width, H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const bw = (W / count) - 0.5;
      const maxVal = count;

      for (let k = 0; k < arr.length; k++) {
        const bh = (arr[k] / maxVal) * (H * 0.92);
        const x = k * (bw + 0.5);
        const y = H - bh;

        const isCompare = (k === i || k === j);
        const isSwap = phase === 1 && isCompare;

        let color: CanvasGradient | string;
        if (isSwap) {
          const g = ctx.createLinearGradient(0, y, 0, H);
          g.addColorStop(0, '#FFB800'); g.addColorStop(1, '#664A00');
          color = g;
        } else if (isCompare) {
          const g = ctx.createLinearGradient(0, y, 0, H);
          g.addColorStop(0, '#FF4444'); g.addColorStop(1, '#660000');
          color = g;
        } else {
          const g = ctx.createLinearGradient(0, y, 0, H);
          g.addColorStop(0, '#FFD700'); g.addColorStop(1, '#3A2900');
          color = g;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(bw, 1), bh, [1, 1, 0, 0]);
        ctx.fill();

        if (isCompare) {
          ctx.shadowColor = isSwap ? '#FFB800' : '#FF4444';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Bubble sort step
      modeTimer++;
      if (modeTimer > 400) {
        shuffle(arr); i = 0; j = 0; phase = 0; modeTimer = 0;
      } else {
        if (j < arr.length - i - 1) {
          phase = arr[j] > arr[j + 1] ? 1 : 0;
          if (phase === 1) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          j++;
        } else {
          j = 0; i++;
        }
        if (i >= arr.length - 1) { i = 0; j = 0; }
      }

      raf = requestAnimationFrame(draw);
    };

    shuffle(arr);
    draw();
    return () => cancelAnimationFrame(raf);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={240}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
