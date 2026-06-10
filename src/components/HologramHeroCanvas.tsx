import React, { useEffect, useRef } from 'react';

interface TelemetryPoint {
  x: number;
  y: number;
  z: number;
  val: number;
  speed: number;
}

interface DataStream {
  x: number;
  y: number;
  txt: string;
  speed: number;
  opacity: number;
}

export const HologramHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    // Set fixed high resolution for high-end rendering
    let W = canvas.width = 1200;
    let H = canvas.height = 700;
    let raf: number;
    let frame = 0;

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial mock data arrays
    const dataSize = 18;
    const telemetryBars: TelemetryPoint[] = Array.from({ length: dataSize }, (_, i) => ({
      x: (i - dataSize / 2) * 25,
      y: 0,
      z: 0,
      val: Math.sin(i * 0.3) * 60 + 80 + Math.random() * 20,
      speed: 0.05 + Math.random() * 0.05,
    }));

    const codes = ['O(N LOG N)', 'QUICKSORT', 'MERGESORT', '0110101', 'COMPLEXITY: P', 'TELEMETRY', 'ACTIVE', 'O(1)', 'O(N²)', 'ORDER', 'CHAOS'];
    const streams: DataStream[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      txt: codes[Math.floor(Math.random() * codes.length)],
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.2 + 0.05,
    }));

    // Draw isometric 3D block
    const drawIsoBlock = (cx: number, cy: number, w: number, h: number, len: number, color: string, glow = false) => {
      // Isometric projection mathematics
      const angle = 22 * Math.PI / 180;
      
      const pt = (x: number, y: number, z: number) => {
        const rx = cx + (x - y) * Math.cos(angle);
        const ry = cy + (x + y) * Math.sin(angle) - z;
        return { x: rx, y: ry };
      };

      // Shading colors
      ctx.fillStyle = color; // Top
      ctx.strokeStyle = 'rgba(255,215,0,0.3)';
      ctx.lineWidth = 0.5;

      const top1 = pt(-w/2, -len/2, h);
      const top2 = pt(w/2, -len/2, h);
      const top3 = pt(w/2, len/2, h);
      const top4 = pt(-w/2, len/2, h);

      const bot1 = pt(-w/2, -len/2, 0);
      const bot3 = pt(w/2, len/2, 0);
      const bot4 = pt(-w/2, len/2, 0);

      if (glow) {
        ctx.shadowColor = 'rgba(255,215,0,0.6)';
        ctx.shadowBlur = 15;
      }

      // 1. Draw top face (Champagne Gold highlight)
      ctx.beginPath();
      ctx.moveTo(top1.x, top1.y);
      ctx.lineTo(top2.x, top2.y);
      ctx.lineTo(top3.x, top3.y);
      ctx.lineTo(top4.x, top4.y);
      ctx.closePath();
      const topGrad = ctx.createLinearGradient(top1.x, top1.y, top3.x, top3.y);
      topGrad.addColorStop(0, 'rgba(255,245,180,0.7)');
      topGrad.addColorStop(1, 'rgba(212,175,55,0.4)');
      ctx.fillStyle = topGrad;
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset glow

      // 2. Draw left face (medium bronze)
      ctx.beginPath();
      ctx.moveTo(top1.x, top1.y);
      ctx.lineTo(top4.x, top4.y);
      ctx.lineTo(bot4.x, bot4.y);
      ctx.lineTo(bot1.x, bot1.y);
      ctx.closePath();
      const leftGrad = ctx.createLinearGradient(top1.x, top1.y, bot4.x, bot4.y);
      leftGrad.addColorStop(0, 'rgba(184,134,11,0.5)');
      leftGrad.addColorStop(1, 'rgba(60,40,5,0.1)');
      ctx.fillStyle = leftGrad;
      ctx.fill();
      ctx.stroke();

      // 3. Draw right face (dark shadow gold)
      ctx.beginPath();
      ctx.moveTo(top4.x, top4.y);
      ctx.lineTo(top3.x, top3.y);
      ctx.lineTo(bot3.x, bot3.y);
      ctx.lineTo(bot4.x, bot4.y);
      ctx.closePath();
      const rightGrad = ctx.createLinearGradient(top4.x, top4.y, bot3.x, bot3.y);
      rightGrad.addColorStop(0, 'rgba(120,90,10,0.6)');
      rightGrad.addColorStop(1, 'rgba(30,20,0,0.2)');
      ctx.fillStyle = rightGrad;
      ctx.fill();
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Dampened mouse tracking
      const mouse = mouseRef.current;
      mouse.rx += (mouse.x - mouse.rx) * 0.05;
      mouse.ry += (mouse.y - mouse.ry) * 0.05;

      const cx = W / 2;
      const cy = H / 2 + 10;

      // 1. Cybernetic grid coordinates / lines (HUD style)
      ctx.strokeStyle = 'rgba(255,215,0,0.02)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= W; i += 60) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
      }
      for (let i = 0; i <= H; i += 60) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }

      // 2. Volumetric background glowing grid
      ctx.save();
      ctx.translate(cx, cy + 120);
      ctx.scale(1.8, 0.7);

      ctx.strokeStyle = 'rgba(255,215,0,0.04)';
      ctx.beginPath();
      for (let r = 80; r <= 380; r += 50) {
        ctx.arc(0, 0, r, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Concentric Holographic Complexity Rings
      const drawRing = (r: number, speed: number, alpha: number, dashed = false) => {
        ctx.save();
        ctx.translate(cx, cy + 80);
        ctx.scale(2.2, 0.85);

        // Magnetic distortion near cursor
        const dx = mouse.rx - cx;
        const dy = mouse.ry - (cy + 80);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const warp = (1 - dist / 300) * 8;
          ctx.translate(dx * warp * 0.01, dy * warp * 0.015);
        }

        ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
        ctx.lineWidth = dashed ? 0.8 : 1.2;
        if (dashed) {
          ctx.setLineDash([8, 18, 4, 12]);
        }
        ctx.beginPath();
        ctx.arc(0, 0, r, (frame * speed) * Math.PI / 180, (frame * speed + 360) * Math.PI / 180);
        ctx.stroke();

        // Add tick details
        if (!dashed && r === 220) {
          ctx.font = '7px Space Grotesk';
          ctx.fillStyle = 'rgba(255,215,0,0.4)';
          ctx.fillText('RADAR SCAN', r + 6, 0);
          ctx.fillText('O(N LOG N)', -r - 50, 0);
          
          // Small glowing scanner nodes
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10;
          ctx.beginPath();
          const nodeAngle = (frame * speed) * Math.PI / 180;
          ctx.arc(r * Math.cos(nodeAngle), r * Math.sin(nodeAngle), 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      };

      drawRing(140, 0.25, 0.04);
      drawRing(220, -0.18, 0.06, true);
      drawRing(290, 0.1, 0.02);

      // 4. Data strings floating through space
      ctx.font = '7px Space Grotesk';
      ctx.textAlign = 'center';
      for (const s of streams) {
        s.y -= s.speed;
        if (s.y < -50) {
          s.y = H + 50; s.x = Math.random() * W;
        }
        // Magnetic repulsion
        const dx = mouse.rx - s.x;
        const dy = mouse.ry - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offset = 0;
        if (dist < 150) {
          offset = (1 - dist / 150) * 20 * (dx > 0 ? -1 : 1);
        }
        
        ctx.fillStyle = `rgba(255,215,0,${s.opacity.toFixed(3)})`;
        ctx.fillText(s.txt, s.x + offset, s.y);
      }

      // 5. 3D Holographic Extruded Sorting Columns (centered in isometric projection)
      const baseIsoX = 0;
      const baseIsoY = 100;
      const bW = 8;
      const bL = 8;

      // Update values dynamically (simulating live sorting)
      if (frame % 80 === 0) {
        // Shuffle/sort simulation
        telemetryBars.forEach(b => {
          b.val = Math.random() * 90 + 35;
        });
      }

      for (let i = 0; i < telemetryBars.length; i++) {
        const b = telemetryBars[i];
        // Dynamic bouncing height
        const targetVal = b.val;
        const currentVal = targetVal + Math.sin(frame * 0.04 + i) * 6;
        
        const barX = baseIsoX + (i - dataSize / 2) * 16;
        const barY = baseIsoY;

        // Color based on index / state
        const hue = 35 + (i / dataSize) * 20; // range of golds
        const color = `hsla(${hue}, 85%, 45%, 0.22)`;
        const isCenter = Math.abs(i - dataSize / 2) < 2;

        drawIsoBlock(cx + barX, cy + barY, bW, currentVal, bL, color, isCenter);
      }

      // 6. Volumetric energy streams / laser arcs connecting panels
      ctx.strokeStyle = 'rgba(255,215,0,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 320, cy - 100);
      ctx.bezierCurveTo(cx - 150, cy - 200 + Math.sin(frame*0.03)*30, cx + 150, cy - 200 + Math.cos(frame*0.03)*30, cx + 320, cy - 100);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[700px] pointer-events-none z-0 opacity-80"
      style={{ filter: 'blur(0.3px)' }}
    />
  );
};
