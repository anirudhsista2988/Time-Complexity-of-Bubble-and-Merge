import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; alphaDir: number; color: string;
}

const COLORS = ['rgba(255,215,0,', 'rgba(255,180,0,', 'rgba(200,160,0,'];

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf: number;

    const particles: Particle[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.35 + 0.05,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    // Light streaks
    const streaks = Array.from({ length: 6 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: Math.random() * 200 + 80,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.04 + 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw streaks
      for (const s of streaks) {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x < -300 || s.x > W + 300 || s.y < -300 || s.y > H + 300) {
          s.x = Math.random() * W; s.y = Math.random() * H;
        }
        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x + Math.cos(s.angle) * s.len,
          s.y + Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(255,215,0,0)`);
        grad.addColorStop(0.5, `rgba(255,215,0,${s.alpha})`);
        grad.addColorStop(1, `rgba(255,215,0,0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + Math.cos(s.angle) * s.len, s.y + Math.sin(s.angle) * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        p.alpha += 0.002 * p.alphaDir;
        if (p.alpha > 0.4 || p.alpha < 0.03) p.alphaDir *= -1;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,215,0,${0.07 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
