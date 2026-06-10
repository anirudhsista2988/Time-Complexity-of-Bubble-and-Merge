import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortPlayer } from '../hooks/useSortPlayer';
import { algorithmMeta, algorithmRunners } from '../features/sorting/sortEngine';
import type { SortFrame, AlgorithmId } from '../types/sorting';
import { Pause, Play, RefreshCcw, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { genArray } from '../utils/array';

type VisMode = 'bars' | 'skyline' | 'circular' | 'particle' | 'matrix';
const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

// ──── BAR MODE ─────────────────────────────────────────────────────
const BarsMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const max = Math.max(...frame.array, 100);
  return (
    <div className="flex items-end h-full gap-px w-full px-1">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const cls = s === 'sorted' ? 'bar-sorted' : s === 'swap' ? 'bar-swap' : s === 'compare' ? 'bar-compare' : s === 'pivot' ? 'bar-pivot' : s === 'merge' ? 'bar-merge' : 'bar-default';
        return (
          <div key={i}
            className={`flex-1 rounded-t-sm transition-all duration-75 ${cls}`}
            style={{ height: `${(v / max) * 96}%`, minWidth: 1 }}
          />
        );
      })}
    </div>
  );
};

// ──── SKYLINE MODE ─────────────────────────────────────────────────
const SkylineMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const max = Math.max(...frame.array, 100);
  return (
    <div className="flex items-end h-full gap-0.5 w-full px-2">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const h = (v / max) * 92;
        const baseColor = s === 'sorted' ? '#00FF88' : s === 'swap' ? '#FFB800' : s === 'compare' ? '#FF4444' : s === 'pivot' ? '#CC88FF' : '#2A1800';
        const glowColor = s !== 'default' ? baseColor : 'transparent';
        return (
          <div key={i} className="flex-1 relative transition-all duration-100 rounded-t"
            style={{ height: `${h}%`, background: `linear-gradient(180deg, ${baseColor} 0%, rgba(0,0,0,0.8) 100%)`, boxShadow: `0 0 ${s !== 'default' ? '10px' : '0'} ${glowColor}` }}>
            {/* Floors */}
            {v > 25 && [0.25, 0.5, 0.75].map(p => (
              <div key={p} className="absolute left-0 right-0" style={{ bottom: `${p * 100}%`, height: 1, background: 'rgba(255,215,0,0.1)' }} />
            ))}
            {/* Windows */}
            {v > 40 && (
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-yellow-300/60" />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ──── CIRCULAR MODE ──────────────────────────────────────────────
const CircularMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = frame.array.length;
  const max = Math.max(...frame.array, 100);
  const cx = 200, cy = 200, minR = 55, maxR = 155;
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <circle cx={cx} cy={cy} r={minR - 8} fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={maxR + 8} fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth="1" />
      {frame.array.map((v, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const r = minR + (v / max) * (maxR - minR);
        const x1 = cx + (minR - 4) * Math.cos(angle);
        const y1 = cy + (minR - 4) * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const s = frame.states[i];
        const c = s === 'sorted' ? '#00FF88' : s === 'swap' ? '#FFB800' : s === 'compare' ? '#FF4444' : s === 'pivot' ? '#CC88FF' : '#FFD700';
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={s !== 'default' ? 2.5 : 1.5} strokeLinecap="round" opacity={s !== 'default' ? 1 : 0.6} />
            {s !== 'default' && <circle cx={x2} cy={y2} r={2} fill={c} />}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={6} fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
    </svg>
  );
};

// ──── PARTICLE MODE ──────────────────────────────────────────────
const ParticleMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = frame.array.length;
  const max = Math.max(...frame.array, 100);
  const W = 400, H = 300;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const x = (i / (n - 1)) * (W - 20) + 10;
        const y = H - (v / max) * (H - 20) - 10;
        const c = s === 'sorted' ? '#00FF88' : s === 'swap' ? '#FFB800' : s === 'compare' ? '#FF4444' : s === 'pivot' ? '#CC88FF' : '#FFD700';
        const r = s !== 'default' ? 5 : 3;
        return (
          <g key={i}>
            {s !== 'default' && <circle cx={x} cy={y} r={r + 6} fill={c} opacity={0.15} />}
            <circle cx={x} cy={y} r={r} fill={c} opacity={s !== 'default' ? 1 : 0.5} />
            {i > 0 && (
              <line x1={(( i - 1) / (n - 1)) * (W - 20) + 10} y1={H - (frame.array[i-1] / max) * (H - 20) - 10}
                x2={x} y2={y} stroke="rgba(255,215,0,0.1)" strokeWidth="0.5" />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ──── MATRIX MODE ──────────────────────────────────────────────
const MatrixMode: React.FC<{ frame: SortFrame }> = ({ frame }) => {
  const n = Math.min(frame.array.length, 50);
  const max = Math.max(...frame.array, 100);
  const cols = Math.ceil(Math.sqrt(n * 1.5));
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: '100%', maxWidth: 400 }}>
        {frame.array.slice(0, n).map((v, i) => {
          const s = frame.states[i];
          const intensity = v / max;
          const baseColor = s === 'sorted' ? `rgba(0,255,136,${0.3 + intensity * 0.7})` : s === 'compare' ? `rgba(255,68,68,${0.5 + intensity * 0.5})` : s === 'swap' ? `rgba(255,184,0,${0.5 + intensity * 0.5})` : s === 'pivot' ? `rgba(200,136,255,0.8)` : `rgba(255,215,0,${0.1 + intensity * 0.5})`;
          return (
            <div key={i}
              className="aspect-square rounded-sm flex items-center justify-center transition-all duration-75 text-[8px] font-mono font-bold"
              style={{ background: baseColor, color: s !== 'default' ? '#fff' : 'rgba(255,215,0,0.6)', boxShadow: s !== 'default' ? `0 0 8px ${baseColor}` : 'none' }}>
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VIS_MODES: { id: VisMode; label: string; emoji: string }[] = [
  { id: 'bars',     label: 'Bars',     emoji: '▐' },
  { id: 'skyline',  label: 'Skyline',  emoji: '🏙' },
  { id: 'circular', label: 'Circular', emoji: '◎' },
  { id: 'particle', label: 'Particle', emoji: '✦' },
  { id: 'matrix',   label: 'Matrix',   emoji: '⊞' },
];

export const SortLab: React.FC = () => {
  const [algoId, setAlgoId] = useState<AlgorithmId>('bubble');
  const [size, setSize] = useState(40);
  const [initArr, setInitArr] = useState(() => genArray(40));
  const [visMode, setVisMode] = useState<VisMode>('bars');
  const [aiExplain, setAiExplain] = useState(true);
  const [showPseudo, setShowPseudo] = useState(true);

  const frames = useMemo(() => {
    if (!initArr.length) return [];
    return algorithmRunners[algoId]([...initArr]);
  }, [algoId, initArr]);

  const { frame, idx, total, playing, speed, setSpeed, play, pause, stepFwd, stepBwd, reset } = useSortPlayer(frames, 60);
  const meta = algorithmMeta[algoId];
  const progress = total > 1 ? (idx / (total - 1)) * 100 : 0;

  const shuffle = () => { reset(); setInitArr(genArray(size)); };
  const changeSize = (s: number) => { setSize(s); reset(); setInitArr(genArray(s)); };
  const changeAlgo = (id: AlgorithmId) => { reset(); setAlgoId(id); setInitArr(genArray(size)); };

  return (
    <div className="min-h-screen pt-14 flex flex-col bg-[#030303] mesh-bg">
      {/* Top Algorithm Selector Bar */}
      <div className="border-b border-white/[0.05] bg-black/40 backdrop-blur-xl px-4 py-2 flex items-center gap-2 flex-wrap shrink-0">
        {ALGO_IDS.map(id => {
          const m = algorithmMeta[id];
          const active = algoId === id;
          return (
            <button key={id} onClick={() => changeAlgo(id)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 whitespace-nowrap"
              style={{
                background: active ? `${m.color}18` : 'transparent',
                border: `1px solid ${active ? m.color + '50' : 'rgba(255,255,255,0.05)'}`,
                color: active ? m.color : '#636366',
                boxShadow: active ? `0 0 12px ${m.color}30` : 'none',
              }}>
              {m.name.replace(' Sort', '')}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {/* Vis mode selector */}
          {VIS_MODES.map(m => (
            <button key={m.id} onClick={() => setVisMode(m.id)}
              className="px-2.5 py-1.5 text-[11px] rounded-lg font-medium transition-all duration-200"
              style={{
                background: visMode === m.id ? 'rgba(255,215,0,0.1)' : 'transparent',
                border: `1px solid ${visMode === m.id ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}`,
                color: visMode === m.id ? '#FFD700' : '#636366',
              }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ── Main visualizer area ── */}
        <div className="flex-1 flex flex-col p-4 gap-3 min-w-0">
          {/* Progress bar */}
          <div className="h-px bg-white/[0.04] rounded-full overflow-hidden shrink-0">
            <div className="h-full transition-all duration-100 rounded-full"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${meta.color}80, ${meta.color})`, boxShadow: `0 0 8px ${meta.color}60` }} />
          </div>

          {/* Canvas */}
          <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[200px] border border-white/[0.04]"
            style={{ background: 'rgba(5,5,5,0.9)', boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)` }}>
            <div className="absolute inset-0">
              {frame ? (
                <AnimatePresence mode="wait">
                  <motion.div key={visMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-4">
                    {visMode === 'bars'     && <BarsMode frame={frame} />}
                    {visMode === 'skyline'  && <SkylineMode frame={frame} />}
                    {visMode === 'circular' && <CircularMode frame={frame} />}
                    {visMode === 'particle' && <ParticleMode frame={frame} />}
                    {visMode === 'matrix'   && <MatrixMode frame={frame} />}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
                  No data — click Shuffle to generate an array
                </div>
              )}
              {/* Overlay grid */}
              <div className="absolute inset-0 pointer-events-none grid-lines opacity-30" />
            </div>
          </div>

          {/* AI Explain strip */}
          {aiExplain && frame && (
            <div className="shrink-0 rounded-xl px-4 py-2.5 flex items-center gap-3 border"
              style={{ background: 'rgba(5,5,5,0.8)', borderColor: `${meta.color}20`, boxShadow: `0 0 20px ${meta.color}08` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: meta.color }} />
              <p className="text-[12px] text-white/70 font-mono">{frame.description}</p>
              <div className="ml-auto flex gap-3 text-xs font-mono text-white/30 shrink-0">
                <span>CMP: <span className="text-white/60">{frame.comparisons}</span></span>
                <span>SWP: <span className="text-white/60">{frame.swaps}</span></span>
                <span className="text-white/20">|</span>
                <span>{idx + 1}/{total}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="shrink-0 rounded-2xl p-4 border border-white/[0.04]"
            style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Playback */}
              <div className="flex items-center gap-2">
                <button onClick={stepBwd} className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <SkipBack size={13} />
                </button>
                <button onClick={playing ? pause : play}
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`, boxShadow: `0 0 24px ${meta.color}50` }}>
                  {playing ? <Pause size={15} className="text-black" /> : <Play size={15} className="text-black ml-0.5" />}
                </button>
                <button onClick={stepFwd} className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <SkipForward size={13} />
                </button>
                <button onClick={shuffle} className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#FFD700] hover:border-[rgba(255,215,0,0.3)] transition-all">
                  <Shuffle size={13} />
                </button>
                <button onClick={() => { reset(); setInitArr(genArray(size)); }} className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <RefreshCcw size={13} />
                </button>
              </div>

              {/* Sliders */}
              <div className="flex gap-4 items-center flex-1 justify-center">
                <div className="flex flex-col gap-1 w-28">
                  <span className="text-[10px] text-white/30 font-medium flex justify-between"><span>Speed</span><span className="text-white/50 font-mono">{speed}ms</span></span>
                  <input type="range" min={10} max={500} step={10} value={speed} onChange={e => setSpeed(+e.target.value)} className="w-full h-0.5 accent-yellow-400" />
                </div>
                <div className="flex flex-col gap-1 w-28">
                  <span className="text-[10px] text-white/30 font-medium flex justify-between"><span>Size</span><span className="text-white/50 font-mono">{size}</span></span>
                  <input type="range" min={8} max={100} value={size} onChange={e => changeSize(+e.target.value)} className="w-full h-0.5 accent-yellow-400" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-2">
                <button onClick={() => setAiExplain(v => !v)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${aiExplain ? 'border-[rgba(255,215,0,0.3)] text-[#FFD700] bg-[rgba(255,215,0,0.06)]' : 'border-white/[0.08] text-white/30'}`}>
                  AI Explain
                </button>
                <button onClick={() => setShowPseudo(v => !v)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${showPseudo ? 'border-[rgba(255,215,0,0.3)] text-[#FFD700] bg-[rgba(255,215,0,0.06)]' : 'border-white/[0.08] text-white/30'}`}>
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-64 shrink-0 border-l border-white/[0.05] flex flex-col overflow-y-auto no-scrollbar"
          style={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)' }}>
          {/* Algorithm header */}
          <div className="p-4 border-b border-white/[0.05]">
            <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }} />
            <h2 className="text-lg font-black text-white mb-1">{meta.name}</h2>
            <p className="text-[11px] text-white/40 leading-relaxed">{meta.description}</p>
          </div>

          {/* Live Stats */}
          <div className="p-4 border-b border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">Live Statistics</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Comparisons', v: frame?.comparisons ?? 0 },
                { l: 'Swaps', v: frame?.swaps ?? 0 },
              ].map(({ l, v }) => (
                <div key={l} className="p-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                  <p className="text-[9px] text-white/30 uppercase tracking-wider">{l}</p>
                  <p className="text-xl font-black font-mono mt-1" style={{ color: meta.color }}>{v.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div className="p-4 border-b border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">Complexity</p>
            <div className="space-y-2">
              {[
                { l: 'Best',    v: meta.best,    c: '#30D158' },
                { l: 'Average', v: meta.average, c: '#FFD700' },
                { l: 'Worst',   v: meta.worst,   c: '#FF453A' },
                { l: 'Space',   v: meta.space,   c: '#5AC8FA' },
              ].map(({ l, v, c }) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-[11px] text-white/30">{l}</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: `${c}10`, border: `1px solid ${c}20`, color: c }}>
                    {v}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-white/30">Stable</span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${meta.stable ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
                  {meta.stable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Pseudocode */}
          {showPseudo && (
            <div className="p-4">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">Pseudocode</p>
              <div className="space-y-0.5">
                {meta.pseudocode.map((line, i) => (
                  <div key={i}
                    className="px-2.5 py-1.5 rounded-md text-[11px] font-mono transition-all duration-200"
                    style={frame?.activeLine === i ? {
                      background: `${meta.color}15`,
                      color: meta.color,
                      borderLeft: `2px solid ${meta.color}`,
                      boxShadow: `0 0 12px ${meta.color}20`,
                    } : { color: 'rgba(255,255,255,0.3)', borderLeft: '2px solid transparent' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Legend */}
          <div className="p-4 mt-auto border-t border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-3">Legend</p>
            <div className="space-y-1.5">
              {[
                { c: '#FFD700', l: 'Default' },
                { c: '#FF4444', l: 'Comparing' },
                { c: '#FFB800', l: 'Swapping' },
                { c: '#00FF88', l: 'Sorted' },
                { c: '#CC88FF', l: 'Pivot' },
              ].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c, boxShadow: `0 0 4px ${c}60` }} />
                  <span className="text-[11px] text-white/40">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
