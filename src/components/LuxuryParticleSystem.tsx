import React, { useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM PARTICLE SYSTEM — Three-Layer Cinematic Depth Engine
//
// Layer 1 (Deep)  : 45 tiny distant particles — slow drift, near-invisible
// Layer 2 (Mid)   : 35 medium particles — gentle float, soft glow
// Layer 3 (Close) : 20 large foreground particles — bloom, subtle blur
//
// All layers react subtly to mouse parallax at different intensities.
// Color palette: metallic gold, champagne, warm amber — never neon.
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;       // current x
  y: number;       // current y
  baseX: number;   // home x (for parallax return)
  baseY: number;   // home y
  vx: number;      // velocity x
  vy: number;      // velocity y
  size: number;    // radius
  alpha: number;   // current opacity
  alphaTarget: number;
  alphaSpeed: number;
  layer: 1 | 2 | 3;
  parallaxFactor: number; // how much it shifts with mouse
  color: [number, number, number]; // r,g,b
  twinkleOffset: number;  // phase offset for sine wave pulsing
  trail: { x: number; y: number; a: number }[];
}

// Gold palette — all warm, no neon
// Dark mode  : bright gold family
// Light mode : champagne / dark-gold family
const DARK_COLORS: [number, number, number][] = [
  [255, 215, 0],    // pure gold
  [255, 200, 30],   // warm gold
  [240, 185, 15],   // amber gold
  [255, 228, 120],  // champagne
  [218, 165, 32],   // goldenrod
  [255, 193, 7],    // amber
];

const LIGHT_COLORS: [number, number, number][] = [
  [184, 134, 11],   // dark gold (visible on cream)
  [154, 111, 0],    // deep amber
  [174, 124, 6],    // metallic gold
  [140, 100, 0],    // warm bronze-gold
  [196, 150, 20],   // honey gold
  [165, 120, 10],   // rich amber
];

const LAYER_CONFIG = {
  1: { count: 45, sizeMin: 0.3, sizeMax: 0.9,  alphaMax: 0.18, speedMult: 0.12, parallax: 0.008, trailLen: 0 },
  2: { count: 35, sizeMin: 0.9, sizeMax: 2.0,  alphaMax: 0.32, speedMult: 0.22, parallax: 0.018, trailLen: 0 },
  3: { count: 20, sizeMin: 2.0, sizeMax: 4.0,  alphaMax: 0.20, speedMult: 0.10, parallax: 0.032, trailLen: 0 },
};

function createParticle(W: number, H: number, layer: 1 | 2 | 3, isDark: boolean): Particle {
  const cfg = LAYER_CONFIG[layer];
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const x = Math.random() * W;
  const y = Math.random() * H;

  // Organic drift angle — biased toward slow upward float
  const angle = Math.random() * Math.PI * 2;
  const speed = cfg.speedMult * (Math.random() * 0.6 + 0.4);

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.04, // slight upward bias
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    alpha: Math.random() * cfg.alphaMax * 0.5,
    alphaTarget: Math.random() * cfg.alphaMax,
    alphaSpeed: 0.002 + Math.random() * 0.006,
    layer,
    parallaxFactor: cfg.parallax,
    color: colors[Math.floor(Math.random() * colors.length)],
    twinkleOffset: Math.random() * Math.PI * 2,
    trail: [],
  };
}

interface Props {
  isDark?: boolean;
}

export const LuxuryParticleSystem: React.FC<Props> = ({ isDark = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const isDarkRef = useRef(isDark);

  // Update colors when theme changes without recreating canvas
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

    // ── Mouse tracking ───────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.vx = e.clientX - m.px;
      m.vy = e.clientY - m.py;
      m.px = m.x;
      m.py = m.y;
      m.x = e.clientX;
      m.y = e.clientY;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    // ── Draw loop ────────────────────────────────────────────────────
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      frameRef.current++;

      ctx.clearRect(0, 0, W, H);

      const f = frameRef.current;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current;

      // Dampen mouse velocity
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      const particles = particlesRef.current;
      const dark = isDarkRef.current;

      for (const p of particles) {
        // ── Organic drift with slow sine modulation ──────────────────
        const waveX = Math.sin(f * 0.0008 + p.twinkleOffset) * 0.08;
        const waveY = Math.cos(f * 0.0012 + p.twinkleOffset * 1.3) * 0.06;
        p.vx += waveX;
        p.vy += waveY;

        // Dampen velocity to prevent runaway
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = LAYER_CONFIG[p.layer].speedMult * 1.8;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // ── Mouse parallax ──────────────────────────────────────────
        // Gentle pull toward cursor offset from center
        const cx = W / 2, cy = H / 2;
        const mdx = (mouse.x - cx) * p.parallaxFactor;
        const mdy = (mouse.y - cy) * p.parallaxFactor;
        p.x += (p.baseX + mdx - p.x) * 0.003;
        p.y += (p.baseY + mdy - p.y) * 0.003;

        // ── Scroll parallax (layer-based) ───────────────────────────
        const scrollOffset = scroll * p.parallaxFactor * (p.layer === 1 ? 0.08 : p.layer === 2 ? 0.14 : 0.22);
        const renderY = p.y - scrollOffset;

        // ── Wrap boundaries with soft fade ──────────────────────────
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        // ── Twinkle: alpha breathes on sine ─────────────────────────
        const twinkle = Math.sin(f * 0.025 + p.twinkleOffset);
        p.alpha += (p.alphaTarget - p.alpha) * p.alphaSpeed;
        if (Math.random() < 0.004) {
          // Occasionally pick a new alpha target (shimmer)
          p.alphaTarget = Math.random() * LAYER_CONFIG[p.layer].alphaMax;
        }
        const displayAlpha = Math.max(0, p.alpha + twinkle * 0.04);

        // ── Render particle ──────────────────────────────────────────
        const [r, g, b] = p.color;

        if (p.layer === 3) {
          // Large foreground particles: soft radial glow + bloom
          const grd = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, p.size * 4);
          const outerAlpha = dark ? displayAlpha * 0.06 : displayAlpha * 0.08;
          grd.addColorStop(0,   `rgba(${r},${g},${b},${(displayAlpha * 0.85).toFixed(3)})`);
          grd.addColorStop(0.3, `rgba(${r},${g},${b},${(displayAlpha * 0.35).toFixed(3)})`);
          grd.addColorStop(0.7, `rgba(${r},${g},${b},${(outerAlpha).toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          // Hard bright core
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(displayAlpha * 1.6, 0.5).toFixed(3)})`;
          ctx.fill();

        } else if (p.layer === 2) {
          // Medium particles: inner glow + soft halo
          const grd = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, p.size * 2.5);
          grd.addColorStop(0,   `rgba(${r},${g},${b},${(displayAlpha * 0.9).toFixed(3)})`);
          grd.addColorStop(0.5, `rgba(${r},${g},${b},${(displayAlpha * 0.25).toFixed(3)})`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          // Crisp point center
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(displayAlpha * 1.4, 0.4).toFixed(3)})`;
          ctx.fill();

        } else {
          // Layer 1: tiny crisp distant dust
          ctx.beginPath();
          ctx.arc(p.x, renderY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${displayAlpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // ── Soft connection lines between nearby Layer 2 particles ──────
      // Only run every 2nd frame to save performance
      if (f % 2 === 0) {
        const midParticles = particles.filter(p => p.layer === 2);
        for (let i = 0; i < midParticles.length; i++) {
          for (let j = i + 1; j < midParticles.length; j++) {
            const a = midParticles[i], b = midParticles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const lineAlpha = (1 - dist / 90) * 0.045 * (dark ? 1 : 0.7);
              const [r, g, bc] = a.color;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${r},${g},${bc},${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.5;
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
