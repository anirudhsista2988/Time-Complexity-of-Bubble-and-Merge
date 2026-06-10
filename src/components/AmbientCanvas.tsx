import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  alphaDir: number;
  color: string;
}

interface FogOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const COLORS = ['rgba(255,215,0,', 'rgba(255,190,0,', 'rgba(240,165,10,'];
const FOG_COLORS = ['rgba(255,215,0,0.015)', 'rgba(255,140,0,0.01)', 'rgba(180,120,20,0.01)'];

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf: number;

    // Constellation particles (crisp foreground)
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.35 + 0.05,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    // Large blurry background fog circles (depth system)
    const fogOrbs: FogOrb[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.04,
      size: Math.random() * 160 + 60,
      alpha: Math.random() * 0.3 + 0.1,
      color: FOG_COLORS[Math.floor(Math.random() * FOG_COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'screen';

      // 1. Draw large blurry depth fog orbs
      for (const orb of fogOrbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Wrap around boundaries
        if (orb.x < -orb.size) orb.x = W + orb.size;
        if (orb.x > W + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = H + orb.size;
        if (orb.y > H + orb.size) orb.y = -orb.size;

        const radGrad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        );
        radGrad.addColorStop(0, orb.color);
        radGrad.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, '0.005)'));
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      // 2. Draw crisp constellation particles & lines
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += 0.0015 * p.alphaDir;
        if (p.alpha > 0.45 || p.alpha < 0.05) p.alphaDir *= -1;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha.toFixed(3) + ')';
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const opacity = 0.06 * (1 - d / 100);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,215,0,${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      
      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
