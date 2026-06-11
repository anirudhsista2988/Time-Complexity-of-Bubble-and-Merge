import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortPlayer } from '../hooks/useSortPlayer';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { SortFrame, AlgorithmId } from '../types/sorting';
import { Pause, Play, RefreshCcw, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { genArray } from '../utils/array';

type VisMode = 'bars' | 'skyline' | 'circular' | 'particle' | 'matrix' | 'isometric';
const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

// ──── BAR MODE (Luxury Glass Pillars) ───────────────────────────────
const BarsMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const max = Math.max(...frame.array, 100);
  return (
    <div className="flex items-end h-full gap-1 w-full px-1">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const cls = s === 'sorted' ? 'bar-sorted' : s === 'swap' ? 'bar-swap' : s === 'compare' ? 'bar-compare' : s === 'pivot' ? 'bar-pivot' : s === 'merge' ? 'bar-merge' : 'bar-default';
        const isAction = s !== 'default';
        return (
          <div key={i}
            className="flex-1 relative transition-all duration-75 group"
            style={{ height: `${(v / max) * 92}%`, minWidth: 2 }}
          >
            {isAction && (
              <div className="absolute inset-0 blur-md opacity-50 rounded-t"
                style={{
                  background: s === 'sorted' ? '#30D158' : s === 'swap' ? '#FF9F0A' : s === 'compare' ? '#FF453A' : s === 'pivot' ? '#BF5AF2' : '#0A84FF'
                }}
              />
            )}
            <div className={`w-full h-full rounded-t border-t border-l border-r border-white/10 transition-all duration-75 ${cls} relative overflow-hidden`}
              style={{
                boxShadow: isAction ? '0 -4px 16px rgba(255,215,0,0.1)' : 'none'
              }}>
              {/* Glass reflection glaze */}
              <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-white/15 to-transparent pointer-events-none" />
              {/* Top face bevel */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-white/20 pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ──── SKYLINE MODE (Cyberpunk Towers) ───────────────────────────────
const SkylineMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const max = Math.max(...frame.array, 100);
  return (
    <div className="flex items-end h-full gap-1 w-full px-2">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const h = (v / max) * 92;
        const baseColor = s === 'sorted' ? '#30D158' : s === 'swap' ? '#FF9F0A' : s === 'compare' ? '#FF453A' : s === 'pivot' ? '#BF5AF2' : s === 'merge' ? '#0A84FF' : '#FFD700';
        return (
          <div key={i} className="flex-1 relative transition-all duration-100 rounded-t border border-white/5 overflow-hidden"
            style={{
              height: `${h}%`,
              background: s === 'default'
                ? 'linear-gradient(180deg, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
                : `linear-gradient(180deg, ${baseColor} 0%, rgba(0,0,0,0.9) 100%)`,
              boxShadow: s !== 'default' ? `0 0 16px ${baseColor}30, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none'
            }}
          >
            {/* Embedded grid windows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_5px] pointer-events-none" />
            {/* Edge glow tip */}
            <div className="absolute top-0 inset-x-0 h-1 pointer-events-none"
              style={{ background: baseColor, boxShadow: `0 0 6px ${baseColor}` }} />
          </div>
        );
      })}
    </div>
  );
};

// ──── CIRCULAR MODE (Holographic Concentric Circles) ─────────────────
const CircularMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = frame.array.length;
  const max = Math.max(...frame.array, 100);
  const cx = 200, cy = 200, minR = 55, maxR = 155;
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full max-h-[480px]">
      <defs>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#030303" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Outer telemetry ticks */}
      <circle cx={cx} cy={cy} r={minR - 8} fill="url(#hub-glow)" />
      <circle cx={cx} cy={cy} r={minR - 10} fill="none" stroke="rgba(255,215,0,0.08)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={cx} cy={cy} r={maxR + 10} fill="none" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
      
      {/* Polar coordinate ticks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angleDeg => {
        const rad = (angleDeg * Math.PI) / 180;
        const tx1 = cx + (maxR + 14) * Math.cos(rad);
        const ty1 = cy + (maxR + 14) * Math.sin(rad);
        const tx2 = cx + (maxR + 20) * Math.cos(rad);
        const ty2 = cy + (maxR + 20) * Math.sin(rad);
        return (
          <line key={angleDeg} x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="rgba(255,215,0,0.15)" strokeWidth="1.2" />
        );
      })}

      {frame.array.map((v, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const r = minR + (v / max) * (maxR - minR);
        const x1 = cx + (minR - 2) * Math.cos(angle);
        const y1 = cy + (minR - 2) * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const s = frame.states[i];
        const c = s === 'sorted' ? '#30D158' : s === 'swap' ? '#FF9F0A' : s === 'compare' ? '#FF453A' : s === 'pivot' ? '#BF5AF2' : s === 'merge' ? '#0A84FF' : '#FFD700';
        return (
          <g key={i}>
            {s !== 'default' && (
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={4} strokeLinecap="round" opacity={0.25} />
            )}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={s !== 'default' ? 2.5 : 1.5} strokeLinecap="round" opacity={s !== 'default' ? 1 : 0.5} />
            {s !== 'default' && <circle cx={x2} cy={y2} r={3} fill={c} className="gold-glow" />}
          </g>
        );
      })}
      
      {/* Central hologram core */}
      <circle cx={cx} cy={cy} r={8} fill="#030303" stroke="rgba(255,215,0,0.3)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={3} fill="#FFD700" className="animate-pulse" />
    </svg>
  );
};

// ──── PARTICLE MODE (Vector Networks) ───────────────────────────────
const ParticleMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = frame.array.length;
  const max = Math.max(...frame.array, 100);
  const W = 400, H = 300;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="area-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,215,0,0)" />
          <stop offset="100%" stopColor="rgba(255,215,0,0.05)" />
        </linearGradient>
      </defs>
      
      {/* Constellation shaded area */}
      <path d={`M 10 ${H - 10} ` + frame.array.map((v, i) => {
        const x = (i / (n - 1)) * (W - 20) + 10;
        const y = H - (v / max) * (H - 20) - 10;
        return `L ${x} ${y}`;
      }).join(' ') + ` L ${W - 10} ${H - 10} Z`} fill="url(#area-grad)" />

      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const x = (i / (n - 1)) * (W - 20) + 10;
        const y = H - (v / max) * (H - 20) - 10;
        const c = s === 'sorted' ? '#30D158' : s === 'swap' ? '#FF9F0A' : s === 'compare' ? '#FF453A' : s === 'pivot' ? '#BF5AF2' : s === 'merge' ? '#0A84FF' : '#FFD700';
        const r = s !== 'default' ? 6 : 3.5;
        return (
          <g key={i}>
            {s !== 'default' && <circle cx={x} cy={y} r={r + 8} fill={c} opacity={0.2} />}
            <circle cx={x} cy={y} r={r} fill={c} opacity={s !== 'default' ? 1 : 0.65} />
            {i > 0 && (
              <line x1={((i - 1) / (n - 1)) * (W - 20) + 10} y1={H - (frame.array[i-1] / max) * (H - 20) - 10}
                x2={x} y2={y} stroke="rgba(255,215,0,0.18)" strokeWidth="1.2" />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ──── MATRIX MODE (Grid Blocks) ────────────────────────────────────
const MatrixMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = Math.min(frame.array.length, 50);
  const max = Math.max(...frame.array, 100);
  const cols = Math.ceil(Math.sqrt(n * 1.5));
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: '100%', maxWidth: 400 }}>
        {frame.array.slice(0, n).map((v, i) => {
          const s = frame.states[i];
          const intensity = v / max;
          const baseColor = s === 'sorted' ? `rgba(48,209,88,${0.3 + intensity * 0.7})` : s === 'compare' ? `rgba(255,69,58,${0.5 + intensity * 0.5})` : s === 'swap' ? `rgba(255,159,10,${0.5 + intensity * 0.5})` : s === 'pivot' ? `rgba(191,90,242,0.85)` : `rgba(255,215,0,${0.1 + intensity * 0.4})`;
          const borderC = s === 'sorted' ? '#30D158' : s === 'compare' ? '#FF453A' : s === 'swap' ? '#FF9F0A' : s === 'pivot' ? '#BF5AF2' : 'rgba(255,215,0,0.15)';
          return (
            <div key={i}
              className="aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-75 text-[10px] font-space font-black border"
              style={{
                background: s === 'default'
                  ? `linear-gradient(135deg, rgba(255,215,0,${0.02 + intensity * 0.15}) 0%, rgba(255,215,0,0.01) 100%)`
                  : baseColor,
                borderColor: borderC,
                color: s !== 'default' ? '#030303' : 'rgba(255,215,0,0.85)',
                boxShadow: s !== 'default' ? `0 0 16px ${borderC}` : 'none'
              }}>
              <span className="opacity-30 text-[7px] font-bold">#{i}</span>
              <span className="leading-none mt-0.5">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ──── 3D ISOMETRIC TELEMETRY MODE ──────────────────────────────────
const IsometricMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    
    const array = frame.array;
    const states = frame.states;
    const n = array.length;
    const max = Math.max(...array, 100);
    
    ctx.strokeStyle = 'rgba(255,215,0,0.02)';
    ctx.lineWidth = 1;
    for (let j = 0; j <= 8; j++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.7 + j * 12);
      ctx.lineTo(w * 0.9, h * 0.3 + j * 12);
      ctx.stroke();
    }
    
    const colWidth = Math.min((w * 0.5) / n, 22);
    const colDepth = colWidth * 1.5;
    const spacing = colWidth * 1.35;
    
    const startX = w / 2 - (n * spacing) / 2 + colDepth / 2;
    const startY = h / 2 + (h * 0.25);
    
    for (let i = 0; i < n; i++) {
      const v = array[i];
      const s = states[i];
      const valHeight = (v / max) * (h * 0.45);
      
      const px = startX + i * spacing;
      const py = startY - i * (spacing * 0.25);
      
      let topColor = '#FFEFA0';
      let leftColor = '#FFD700';
      let rightColor = '#AA8010';
      let shadowColor = 'rgba(255,215,0,0.06)';
      
      if (s === 'sorted') {
        topColor = '#A7FFD0';
        leftColor = '#34C759';
        rightColor = '#006622';
        shadowColor = 'rgba(52,199,89,0.25)';
      } else if (s === 'swap') {
        topColor = '#FFDF9E';
        leftColor = '#FF9500';
        rightColor = '#804000';
        shadowColor = 'rgba(255,149,0,0.25)';
      } else if (s === 'compare') {
        topColor = '#FF9E9E';
        leftColor = '#FF3B30';
        rightColor = '#800000';
        shadowColor = 'rgba(255,59,48,0.25)';
      } else if (s === 'pivot') {
        topColor = '#E5C3FF';
        leftColor = '#AF52DE';
        rightColor = '#5B0080';
        shadowColor = 'rgba(175,82,222,0.25)';
      } else if (s === 'merge') {
        topColor = '#C2E2FF';
        leftColor = '#0A84FF';
        rightColor = '#003F80';
        shadowColor = 'rgba(10,132,255,0.25)';
      } else {
        topColor = '#FFF5CC';
        leftColor = '#D4AF37';
        rightColor = '#8C6D11';
        shadowColor = 'rgba(212,175,55,0.04)';
      }
      
      const drawIsoColumn = (x: number, y: number, cw: number, cd: number, ch: number) => {
        const x0 = x;
        const y0 = y;
        
        const rx = cw * Math.cos(Math.PI / 6);
        const ry = cw * Math.sin(Math.PI / 6);
        
        const lx = -cd * Math.cos(Math.PI / 6);
        const ly = cd * Math.sin(Math.PI / 6);
        
        ctx.fillStyle = shadowColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + rx, y0 + ry);
        ctx.lineTo(x0 + rx + lx, y0 + ry + ly);
        ctx.lineTo(x0 + lx, y0 + ly);
        ctx.closePath();
        ctx.fill();
        
        if (s !== 'default') {
          ctx.shadowColor = leftColor;
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowBlur = 0;
        }

        // Left Face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + lx, y0 + ly);
        ctx.lineTo(x0 + lx, y0 + ly - ch);
        ctx.lineTo(x0, y0 - ch);
        ctx.closePath();
        ctx.fill();
        
        // Right Face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + rx, y0 + ry);
        ctx.lineTo(x0 + rx, y0 + ry - ch);
        ctx.lineTo(x0, y0 - ch);
        ctx.closePath();
        ctx.fill();
        
        // Top Face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(x0, y0 - ch);
        ctx.lineTo(x0 + rx, y0 + ry - ch);
        ctx.lineTo(x0 + rx + lx, y0 + ry + ly - ch);
        ctx.lineTo(x0 + lx, y0 + ly - ch);
        ctx.closePath();
        ctx.fill();
        
        if (s !== 'default') {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x0, y0 - ch);
          ctx.lineTo(x0 + rx, y0 + ry - ch);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(x0, y0 - ch);
          ctx.lineTo(x0 + lx, y0 + ly - ch);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      };
      
      drawIsoColumn(px, py, colWidth, colDepth, valHeight);
    }
  }, [frame]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const VIS_MODES: { id: VisMode; label: string; emoji: string }[] = [
  { id: 'bars',      label: 'Bars',      emoji: '▐' },
  { id: 'skyline',   label: 'Skyline',   emoji: '🏙' },
  { id: 'circular',  label: 'Circular',  emoji: '◎' },
  { id: 'particle',  label: 'Particle',  emoji: '✦' },
  { id: 'matrix',    label: 'Matrix',    emoji: '⊞' },
  { id: 'isometric', label: '3D Telemetry', emoji: '📐' },
];

export const SortLab: React.FC = () => {
  const [algoId, setAlgoId] = useState<AlgorithmId>('bubble');
  const [size, setSize] = useState(40);
  const [initArr, setInitArr] = useState(() => genArray(40));
  const [visMode, setVisMode] = useState<VisMode>('bars');
  const [aiExplain, setAiExplain] = useState(true);
  const [showPseudo, setShowPseudo] = useState(true);

  const [frames, setFrames] = useState<SortFrame[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initArr.length) return;
    setLoading(true);
    fetch('/api/sort', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm: algoId, array: initArr }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setFrames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch sort frames:', err);
        setLoading(false);
      });
  }, [algoId, initArr]);

  const { frame, idx, total, playing, speed, setSpeed, play, pause, stepFwd, stepBwd, reset } = useSortPlayer(frames, 60);
  const meta = algorithmMeta[algoId];
  const progress = total > 1 ? (idx / (total - 1)) * 100 : 0;

  const shuffle = () => { reset(); setInitArr(genArray(size)); };
  const changeSize = (s: number) => { setSize(s); reset(); setInitArr(genArray(s)); };
  const changeAlgo = (id: AlgorithmId) => { reset(); setAlgoId(id); setInitArr(genArray(size)); };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#020202] mesh-bg font-general">
      {/* Top Algorithm Selector Bar */}
      <div className="border-b border-white/[0.05] bg-black/45 backdrop-blur-2xl px-6 py-3.5 flex items-center gap-2 flex-wrap shrink-0 relative z-20">
        <div className="flex gap-1.5 flex-wrap">
          {ALGO_IDS.map(id => {
            const m = algorithmMeta[id];
            const active = algoId === id;
            return (
              <button key={id} onClick={() => changeAlgo(id)}
                className="px-3.5 py-2 rounded-lg text-[10px] font-black tracking-widest font-space transition-all duration-300 uppercase"
                style={{
                  background: active ? `${m.color}15` : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${active ? m.color + '45' : 'rgba(255,255,255,0.04)'}`,
                  color: active ? m.color : '#8E8E93',
                  boxShadow: active ? `0 0 16px ${m.color}25` : 'none',
                }}>
                {m.name.replace(' Sort', '')}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1.5 bg-obsidian-200/50 p-1 rounded-xl border border-white/[0.04]">
          {/* Vis mode selector */}
          {VIS_MODES.map(m => (
            <button key={m.id} onClick={() => setVisMode(m.id)}
              className="px-3 py-1.5 text-[10px] rounded-lg font-bold font-space transition-all duration-300 uppercase"
              style={{
                background: visMode === m.id ? 'rgba(255,215,0,0.1)' : 'transparent',
                border: `1px solid ${visMode === m.id ? 'rgba(255,215,0,0.22)' : 'transparent'}`,
                color: visMode === m.id ? '#FFD700' : '#8E8E93',
              }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 relative z-10">
        {/* ── Main visualizer area ── */}
        <div className="flex-1 flex flex-col p-6 gap-4 min-w-0">
          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.04] rounded-full overflow-hidden shrink-0">
            <div className="h-full transition-all duration-100 rounded-full"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${meta.color}80, ${meta.color})`, boxShadow: `0 0 8px ${meta.color}60` }} />
          </div>

          {/* Canvas Container */}
          <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[220px] border border-white/[0.05] glass-ultra">
            <div className="absolute inset-0">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30 text-sm font-satoshi">
                  <div className="w-8 h-8 rounded-full border-2 border-gold-royal/20 border-t-[#FFD700] animate-spin" />
                  <span className="text-[11px] uppercase tracking-widest font-space text-[#FFD700]/70">Fetching Sort Telemetry...</span>
                </div>
              ) : frame ? (
                <AnimatePresence mode="wait">
                  <motion.div key={visMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-5">
                    {visMode === 'bars'       && <BarsMode frame={frame} />}
                    {visMode === 'skyline'    && <SkylineMode frame={frame} />}
                    {visMode === 'circular'   && <CircularMode frame={frame} />}
                    {visMode === 'particle'   && <ParticleMode frame={frame} />}
                    {visMode === 'matrix'     && <MatrixMode frame={frame} />}
                    {visMode === 'isometric'  && <IsometricMode frame={frame} />}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-satoshi">
                  NO DATA — SHUFFLE ARRAY TO BEGIN
                </div>
              )}
              {/* Overlay grid */}
              <div className="absolute inset-0 pointer-events-none grid-lines opacity-20" />
            </div>
          </div>

          {/* AI Explain strip */}
          {aiExplain && frame && (
            <div className="shrink-0 rounded-xl px-5 py-3 flex items-center gap-3 border glass-ultra"
              style={{ borderColor: `${meta.color}25`, boxShadow: `0 0 24px ${meta.color}06` }}>
              <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: meta.color }} />
              <p className="text-[12px] text-white/80 font-mono tracking-tight">{frame.description}</p>
              <div className="ml-auto flex gap-4 text-xs font-space text-white/30 shrink-0 uppercase">
                <span>CMP: <span className="text-white/70 font-mono font-bold">{frame.comparisons}</span></span>
                <span>SWP: <span className="text-white/70 font-mono font-bold">{frame.swaps}</span></span>
                <span className="text-white/10">|</span>
                <span>{idx + 1} / {total}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="shrink-0 rounded-2xl p-4 border border-white/[0.05] glass-ultra">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Playback controls */}
              <div className="flex items-center gap-2">
                <button onClick={stepBwd} className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all bg-obsidian-200/50">
                  <SkipBack size={14} />
                </button>
                <button onClick={playing ? pause : play}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)`, boxShadow: `0 0 24px ${meta.color}40` }}>
                  {playing ? <Pause size={16} className="text-black" /> : <Play size={16} className="text-black ml-0.5" />}
                </button>
                <button onClick={stepFwd} className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all bg-obsidian-200/50">
                  <SkipForward size={14} />
                </button>
                <button onClick={shuffle} className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-[#FFD700] hover:border-[rgba(255,215,0,0.3)] transition-all bg-obsidian-200/50">
                  <Shuffle size={14} />
                </button>
                <button onClick={() => { reset(); setInitArr(genArray(size)); }} className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all bg-obsidian-200/50">
                  <RefreshCcw size={14} />
                </button>
              </div>

              {/* Sliders */}
              <div className="flex gap-6 items-center flex-1 justify-center max-w-md">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-[10px] text-white/35 font-black uppercase tracking-wider font-space flex justify-between">
                    <span>Speed</span>
                    <span className="text-white/60 font-mono">{speed}ms</span>
                  </span>
                  <input type="range" min={10} max={500} step={10} value={speed} onChange={e => setSpeed(+e.target.value)} className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-royal" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-[10px] text-white/35 font-black uppercase tracking-wider font-space flex justify-between">
                    <span>Array Size</span>
                    <span className="text-white/60 font-mono">{size}</span>
                  </span>
                  <input type="range" min={8} max={100} value={size} onChange={e => changeSize(+e.target.value)} className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-royal" />
                </div>
              </div>

              {/* Toggle panels */}
              <div className="flex gap-2 font-space">
                <button onClick={() => setAiExplain(v => !v)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${aiExplain ? 'border-[rgba(255,215,0,0.3)] text-[#FFD700] bg-[rgba(255,215,0,0.06)]' : 'border-white/[0.06] text-white/30 bg-transparent'}`}>
                  Telemetry Feed
                </button>
                <button onClick={() => setShowPseudo(v => !v)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${showPseudo ? 'border-[rgba(255,215,0,0.3)] text-[#FFD700] bg-[rgba(255,215,0,0.06)]' : 'border-white/[0.06] text-white/30 bg-transparent'}`}>
                  PSEUDOCODE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-72 shrink-0 border-l border-white/[0.05] flex flex-col overflow-y-auto no-scrollbar glass-ultra relative z-20">
          {/* Algorithm metadata */}
          <div className="p-5 border-b border-white/[0.05]">
            <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}aa, transparent)` }} />
            <h2 className="text-2xl font-black text-white mb-2 font-clash leading-none tracking-tight">{meta.name.toUpperCase()}</h2>
            <p className="text-[12px] text-white/50 leading-relaxed font-general">{meta.description}</p>
          </div>

          {/* Live Telemetry Stats */}
          <div className="p-5 border-b border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-[0.2em] font-black font-space text-white/30 mb-3">Live Telemetry</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Comparisons', v: frame?.comparisons ?? 0 },
                { l: 'Swaps', v: frame?.swaps ?? 0 },
              ].map(({ l, v }) => (
                <div key={l} className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <p className="text-[9px] text-white/44 uppercase tracking-wider font-space font-bold">{l}</p>
                  <p className="text-2xl font-black font-space mt-1 stat-number" style={{ color: meta.color }}>{v.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity analysis metrics */}
          <div className="p-5 border-b border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-[0.2em] font-black font-space text-white/30 mb-3 font-bold">Complexity metrics</p>
            <div className="space-y-2.5">
              {[
                { l: 'Best Case',   v: meta.best,    c: '#30D158' },
                { l: 'Average',     v: meta.average, c: '#FFD700' },
                { l: 'Worst Case',  v: meta.worst,   c: '#FF453A' },
                { l: 'Space Complex',v: meta.space,  c: '#5AC8FA' },
              ].map(({ l, v, c }) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-[11px] text-white/40 font-satoshi font-semibold">{l}</span>
                  <span className="text-[10px] font-space font-black px-2 py-0.5 rounded uppercase"
                    style={{ background: `${c}10`, border: `1px solid ${c}25`, color: c }}>
                    {v}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-white/40 font-satoshi font-semibold">Stable Sorting</span>
                <span className={`text-[10px] font-space font-black px-2 py-0.5 rounded uppercase ${meta.stable ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
                  {meta.stable ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Pseudocode execution tracer */}
          {showPseudo && (
            <div className="p-5">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black font-space text-white/30 mb-3">Execution Tracer</p>
              <div className="space-y-1">
                {meta.pseudocode.map((line, i) => (
                  <div key={i}
                    className="px-3 py-2 rounded-md text-[10px] font-mono transition-all duration-300 leading-normal"
                    style={frame?.activeLine === i ? {
                      background: `${meta.color}18`,
                      color: meta.color,
                      borderLeft: `2.5px solid ${meta.color}`,
                      boxShadow: `0 0 16px ${meta.color}15`,
                    } : { color: 'rgba(255,255,255,0.25)', borderLeft: '2.5px solid transparent' }}>
                    {line.replace(/ /g, '\u00a0')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="p-5 mt-auto border-t border-white/[0.05] bg-black/15">
            <p className="text-[9px] uppercase tracking-[0.2em] font-black font-space text-white/30 mb-3">Legend</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { c: '#FFD700', l: 'Default' },
                { c: '#FF453A', l: 'Comparing' },
                { c: '#FF9F0A', l: 'Swapping' },
                { c: '#30D158', l: 'Sorted' },
                { c: '#BF5AF2', l: 'Pivot' },
                { c: '#0A84FF', l: 'Merge' },
              ].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c, boxShadow: `0 0 6px ${c}50` }} />
                  <span className="text-[10px] font-space font-bold text-white/45 uppercase">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
