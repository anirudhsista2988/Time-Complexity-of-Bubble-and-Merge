import React, { useEffect, useRef } from 'react';

interface Bar3D {
  x: number;
  z: number;
  height: number;
  index: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
}

export const GlassSculptureCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    let W = canvas.width = 650;
    let H = canvas.height = 600;
    let raf: number;
    let frame = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Translate to relative center (-0.5 to 0.5)
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.x = mx;
      mouseRef.current.y = my;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 24 sorting bars in a spiral/circular wave representing sorting progression
    const numBars = 26;
    const bars: Bar3D[] = Array.from({ length: numBars }, (_, i) => {
      const angle = (i / numBars) * Math.PI * 2;
      const r = 130;
      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        // Heights form a wave indicating a sorting order
        height: 45 + (i / numBars) * 160 + Math.sin(i * 0.4) * 15,
        index: i
      };
    });

    // Initialize 60 floating golden stardust particles
    const particles: Particle3D[] = Array.from({ length: 65 }, () => ({
      x: (Math.random() - 0.5) * 350,
      y: (Math.random() - 0.5) * 250 - 50,
      z: (Math.random() - 0.5) * 350,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.2
    }));

    // Projection function
    const project = (x: number, y: number, z: number, cx: number, cy: number, rotY: number, rotX: number) => {
      // Rotation Y (yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotation X (pitch/tilt)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective scale
      const fov = 420;
      const scale = fov / (fov + z2);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
        depth: z2
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      const cx = W / 2;
      const cy = H / 2 + 50;

      // Update mouse values with dampening
      const m = mouseRef.current;
      m.rx += (m.x - m.rx) * 0.05;
      m.ry += (m.y - m.ry) * 0.05;

      // Rotation angles based on auto-rotation + mouse movement
      const rotY = frame * 0.003 + m.rx * 0.8;
      const rotX = 0.5 + m.ry * 0.5; // Baseline tilt ~30 deg

      // 1. Draw subtle base glowing platform reflection
      ctx.save();
      ctx.translate(cx, cy + 30);
      ctx.scale(2.2, 0.7);
      const platGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 160);
      platGlow.addColorStop(0, 'rgba(255,215,0,0.06)');
      platGlow.addColorStop(0.5, 'rgba(255,140,0,0.02)');
      platGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = platGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Orbiting Golden Rings (Perspective Ellipses)
      const drawOrbitRing = (yOffset: number, radius: number, speed: number, dash = false) => {
        const ringPoints = 80;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,215,0,0.08)';
        ctx.lineWidth = 0.8;
        if (dash) ctx.setLineDash([4, 8]);
        else ctx.setLineDash([]);

        for (let i = 0; i <= ringPoints; i++) {
          const angle = (i / ringPoints) * Math.PI * 2;
          const px = Math.cos(angle) * radius;
          const pz = Math.sin(angle) * radius;
          const pt = project(px, yOffset, pz, cx, cy, rotY, rotX);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Glowing orbital dot
        const dotAngle = (frame * speed) * Math.PI / 180;
        const dotX = Math.cos(dotAngle) * radius;
        const dotZ = Math.sin(dotAngle) * radius;
        const dotPt = project(dotX, yOffset, dotZ, cx, cy, rotY, rotX);
        
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(dotPt.x, dotPt.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      };

      drawOrbitRing(10, 170, 0.4);
      drawOrbitRing(-80, 150, -0.6, true);
      drawOrbitRing(-160, 120, 0.8);

      // 3. Render and animate Floating Particles (Stardust)
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -300) {
          p.y = 150;
          p.x = (Math.random() - 0.5) * 350;
          p.z = (Math.random() - 0.5) * 350;
        }

        const pt = project(p.x, p.y, p.z, cx, cy, rotY, rotX);
        if (pt.x > 0 && pt.x < W && pt.y > 0 && pt.y < H) {
          ctx.fillStyle = `rgba(255,215,0,${(p.opacity * pt.scale).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * pt.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw 3D Glass Columns (Sorted by depth using Painter's Algorithm)
      // Represent a bar as a list of faces
      interface Polys {
        pts: { x: number; y: number }[];
        depth: number;
        fill: string;
        stroke: string;
        isTop: boolean;
      }
      const polys: Polys[] = [];

      bars.forEach(bar => {
        const w = 7; // bar width
        const d = 7; // bar depth
        const h = bar.height;

        // Vertices of the 3D box
        const v = [
          { x: bar.x - w, y: 0,  z: bar.z - d }, // 0: bottom-back-left
          { x: bar.x + w, y: 0,  z: bar.z - d }, // 1: bottom-back-right
          { x: bar.x + w, y: 0,  z: bar.z + d }, // 2: bottom-front-right
          { x: bar.x - w, y: 0,  z: bar.z + d }, // 3: bottom-front-left
          { x: bar.x - w, y: -h, z: bar.z - d }, // 4: top-back-left
          { x: bar.x + w, y: -h, z: bar.z - d }, // 5: top-back-right
          { x: bar.x + w, y: -h, z: bar.z + d }, // 6: top-front-right
          { x: bar.x - w, y: -h, z: bar.z + d }, // 7: top-front-left
        ].map(pt => project(pt.x, pt.y, pt.z, cx, cy, rotY, rotX));

        // Average depth of the column for painter sorting
        const centerDepth = (v[0].depth + v[6].depth) / 2;

        const baseHue = 38; // Gold
        const strokeColor = 'rgba(255, 215, 0, 0.15)';

        // Side faces
        // 1. Front face (2, 3, 7, 6)
        polys.push({
          pts: [v[3], v[2], v[6], v[7]],
          depth: centerDepth - 2,
          fill: `hsla(${baseHue}, 80%, 35%, 0.04)`,
          stroke: strokeColor,
          isTop: false
        });

        // 2. Right face (1, 2, 6, 5)
        polys.push({
          pts: [v[2], v[1], v[5], v[6]],
          depth: centerDepth - 1,
          fill: `hsla(${baseHue}, 80%, 25%, 0.05)`,
          stroke: strokeColor,
          isTop: false
        });

        // 3. Left face (0, 3, 7, 4)
        polys.push({
          pts: [v[0], v[3], v[7], v[4]],
          depth: centerDepth + 1,
          fill: `hsla(${baseHue}, 80%, 40%, 0.03)`,
          stroke: strokeColor,
          isTop: false
        });

        // 4. Top face (4, 5, 6, 7) - shiny glass reflection
        polys.push({
          pts: [v[7], v[6], v[5], v[4]],
          depth: centerDepth - 4,
          fill: `rgba(255, 248, 210, 0.15)`, // specular reflection
          stroke: 'rgba(255, 230, 120, 0.4)',
          isTop: true
        });
      });

      // Sort polygons from back to front (descending depth)
      polys.sort((a, b) => b.depth - a.depth);

      // Render sorted polygons
      polys.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.pts[0].x, p.pts[0].y);
        for (let i = 1; i < p.pts.length; i++) {
          ctx.lineTo(p.pts[i].x, p.pts[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = p.fill;
        ctx.fill();
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = p.isTop ? 0.8 : 0.5;
        ctx.stroke();

        // Highlight glint on top-front edge
        if (p.isTop) {
          ctx.beginPath();
          ctx.moveTo(p.pts[0].x, p.pts[0].y); // top-front-left
          ctx.lineTo(p.pts[1].x, p.pts[1].y); // top-front-right
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

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
      className="w-full h-full max-w-[650px] max-h-[600px] pointer-events-none"
    />
  );
};
