import React, { useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM PARTICLE SYSTEM — Three-Layer Cinematic Depth Engine
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  alphaTarget: number;
  alphaSpeed: number;
  layer: 1 | 2 | 3;
  parallaxFactor: number;
  color: [number, number, number];
  twinkleOffset: number;
}

const DARK_COLORS: [number, number, number][] = [
  [255, 220, 80],   // bright gold
  [255, 205, 50],   // warm gold
  [255, 185, 25],   // vibrant amber gold
  [255, 235, 150],  // champagne
  [230, 175, 40],   // goldenrod
  [255, 198, 20],   // amber
];

const LIGHT_COLORS: [number, number, number][] = [
  [204, 154, 31],   // prominent dark gold
  [184, 131, 10],   // deep amber
  [194, 144, 16],   // metallic gold
  [160, 110, 5],    // warm bronze-gold
  [216, 170, 40],   // honey gold
  [185, 130, 20],   // rich amber
];

// Massively increased density and alpha limits
const LAYER_CONFIG = {
  1: { count: 80, sizeMin: 0.8, sizeMax: 1.5, alphaMax: 0.50, speedMult: 0.15, parallax: 0.012 },
  2: { count: 60, sizeMin: 1.8, sizeMax: 3.5, alphaMax: 0.80, speedMult: 0.28, parallax: 0.025 },
  3: { count: 30, sizeMin: 3.5, sizeMax: 6.5, alphaMax: 0.65, speedMult: 0.12, parallax: 0.045 },
};

function createParticle(W: number, H: number, layer: 1 | 2 | 3, isDark: boolean): Particle {
  const cfg = LAYER_CONFIG[layer];
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  
  // Hero clustering: 40% of particles bias towards the center-top (hero section)
  const isHeroCluster = Math.random() < 0.4;
  const x = isHeroCluster ? W / 2 + (Math.random() - 0.5) * W * 0.7 : Math.random() * W;
  const y = isHeroCluster ? H * 0.35 + (Math.random() - 0.5) * H * 0.6 : Math.random() * H;

  const angle = Math.random() * Math.PI * 2;
  const speed = cfg.speedMult * (Math.random() * 0.6 + 0.4);

  return {
    x, y, baseX: x, baseY: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.05,
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    alpha: Math.random() * cfg.alphaMax * 0.5,
    alphaTarget: Math.random() * cfg.alphaMax,
    alphaSpeed: 0.003 + Math.random() * 0.008,
    layer,
    parallaxFactor: cfg.parallax,
    color: colors[Math.floor(Math.random() * colors.length)],
    twinkleOffset: Math.random() * Math.PI * 2,
  };
}

interface Props {
  isDark?: boolean;
}

export const LuxuryParticleSystem: React.FC<Props> = ({ isDark = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
    const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
    particlesRef.current.forEach(p => {
      p.color = colors[Math.floor(Math.random() * colors.length)];
    });
  }, [isDark]);

  const init = useCallback((W: number, H: number) => {
    const particles: Particle[] = [];
    const dark = isDarkRef.current;
    ([1, 2, 3] as const).forEach(layer => {
      const { count } = LAYER_CONFIG[layer];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(W, H, layer, dark));
      }
    });
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init(W, H);
    };
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.px = m.x; m.py = m.y;
      m.x = e.clientX; m.y = e.clientY;
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      frameRef.current++;
      ctx.clearRect(0, 0, W, H);

      const f = frameRef.current;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current;
      const particles = particlesRef.current;
      const dark = isDarkRef.current;
      const cx = W / 2, cy = H / 2;

      for (const p of particles) {
        const waveX = Math.sin(f * 0.001 + p.twinkleOffset) * 0.12;
        const waveY = Math.cos(f * 0.0015 + p.twinkleOffset * 1.3) * 0.08;
        p.vx += waveX; p.vy += waveY;
        p.vx *= 0.98; p.vy *= 0.98;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = LAYER_CONFIG[p.layer].speedMult * 2.2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx; p.y += p.vy;

        const mdx = (mouse.x - cx) * p.parallaxFactor;
        const mdy = (mouse.y - cy) * p.parallaxFactor;
        p.x += (p.baseX + mdx - p.x) * 0.008;
        p.y += (p.baseY + mdy - p.y) * 0.008;

        const scrollOffset = scroll * p.parallaxFactor * (p.layer === 1 ? 0.1 : p.layer === 2 ? 0.18 : 0.3);
        const renderY = p.y - scrollOffset;

        if (p.x < -40) p.x = W + 40;
        if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        if (p.y > H + 40) p.y = -40;

        const twinkle = Math.sin(f * 0.03 + p.twinkleOffset);
        p.alpha += (p.alphaTarget - p.alpha) * p.alphaSpeed;
        if (Math.random() < 0.008) p.alphaTarget = Math.random() * LAYER_CONFIG[p.layer].alphaMax;
        
        // Massive visibility boost
        const displayAlpha = Math.max(0, p.alpha + twinkle * 0.1);
        const [r, g, b] = p.color;

        if (p.layer === 3) {
          const grd = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, p.size * 5);
          const outerAlpha = dark ? displayAlpha * 0.15 : displayAlpha * 0.18;
          grd.addColorStop(0,   `rgba(${r},${g},${b},${Math.min(1, displayAlpha * 1.5).toFixed(3)})`);
          grd.addColorStop(0.3, `rgba(${r},${g},${b},${(displayAlpha * 0.6).toFixed(3)})`);
          grd.addColorStop(0.7, `rgba(${r},${g},${b},${outerAlpha.toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, displayAlpha * 2.5).toFixed(3)})`;
          ctx.fill();
        } else if (p.layer === 2) {
          const grd = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, p.size * 3.5);
          grd.addColorStop(0,   `rgba(${r},${g},${b},${Math.min(1, displayAlpha * 1.8).toFixed(3)})`);
          grd.addColorStop(0.5, `rgba(${r},${g},${b},${(displayAlpha * 0.4).toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, displayAlpha * 2.0).toFixed(3)})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, displayAlpha * 1.5).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (f % 2 === 0) {
        const midParticles = particles.filter(p => p.layer === 2);
        for (let i = 0; i < midParticles.length; i++) {
          for (let j = i + 1; j < midParticles.length; j++) {
            const a = midParticles[i], b = midParticles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Increased connection distance and visibility
            if (dist < 140) {
              const lineAlpha = (1 - dist / 140) * 0.15 * (dark ? 1 : 0.8);
              const [r, g, bc] = a.color;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y - scroll * a.parallaxFactor * 0.18);
              ctx.lineTo(b.x, b.y - scroll * b.parallaxFactor * 0.18);
              ctx.strokeStyle = `rgba(${r},${g},${bc},${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
