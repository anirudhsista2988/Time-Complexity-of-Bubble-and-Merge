import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { SortFrame, AlgorithmId } from '../types/sorting';
import { Trophy, Activity } from 'lucide-react';
import { genArray } from '../utils/array';

const RACE_ALGOS: AlgorithmId[] = ['bubble', 'insertion', 'merge', 'quick', 'heap', 'shell'];
const ALGO_COLORS: Record<AlgorithmId, string> = {
  bubble: '#FFD700', selection: '#FF9F0A', insertion: '#30D158',
  merge: '#0A84FF', quick: '#BF5AF2', heap: '#FF453A',
  counting: '#5AC8FA', radix: '#FF6B35', bucket: '#34C759', shell: '#AEAEB2',
};

const genArr = genArray;

const COMMENTARY: ((name: string) => string)[] = [
  n => `🔥 ${n} surging through the pack!`,
  n => `⚡ ${n} showing incredible efficiency`,
  n => `💨 ${n} leaves competitors behind`,
  n => `📊 ${n} making steady calculated progress`,
  n => `🎯 ${n} optimal pivot selection pays off`,
  n => `⚠️  ${n} struggling with this dataset`,
  n => `🏎️  ${n} taking the inside line`,
];

const Speedometer: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const angle = -135 + pct * 2.7;
  const r = 35, cx = 50, cy = 55;
  const startAngle = (-135 * Math.PI) / 180;
  const endAngle = (angle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
  const largeArc = pct > 50 ? 1 : 0;
  return (
    <svg viewBox="0 0 100 70" className="w-20 h-14">
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${cx + r * Math.cos((45 * Math.PI) / 180)} ${cy + r * Math.sin((45 * Math.PI) / 180)}`}
        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" fontFamily="monospace">
        {Math.round(pct)}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">
        PROGRESS
      </text>
    </svg>
  );
};

const MiniBars: React.FC<{ frame: SortFrame | null; color: string }> = ({ frame, color }) => {
  if (!frame) return <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">READY</div>;
  const max = Math.max(...frame.array, 100);
  return (
    <div className="flex items-end h-full gap-px w-full">
      {frame.array.map((v, i) => {
        const s = frame.states[i];
        const bg = s === 'sorted' ? '#00FF88' : s === 'swap' ? '#FFB800' : s === 'compare' ? '#FF4444' : color;
        return <div key={i} className="flex-1 rounded-t-sm transition-all duration-50" style={{ height: `${(v / max) * 100}%`, background: bg }} />;
      })}
    </div>
  );
};

// Countdown overlay
const CountdownOverlay: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [count, setCount] = useState(3);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 800);
      return () => clearTimeout(t);
    } else {
      setGo(true);
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [count, onDone]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={go ? 'go' : count}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {go ? (
            <p className="font-black text-8xl" style={{ color: '#00FF88', textShadow: '0 0 60px rgba(0,255,136,0.8)' }}>GO!</p>
          ) : (
            <>
              <p className="font-black text-9xl gold-text gold-glow">{count}</p>
              <p className="text-white/40 text-sm uppercase tracking-widest mt-2">Get Ready</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const RaceArena: React.FC = () => {
  const [selected, setSelected] = useState<Set<AlgorithmId>>(new Set(['bubble', 'merge', 'quick', 'heap']));
  const [size, setSize] = useState(70);
  const [allFrames, setAllFrames] = useState<Record<string, SortFrame[]>>({});
  const [indices, setIndices] = useState<Record<string, number>>({});
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [finished, setFinished] = useState<AlgorithmId[]>([]);
  const [commentary, setCommentary] = useState<string[]>(['Select algorithms and start the race.']);
  const [speed, setSpeed] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const commentaryRef = useRef<HTMLDivElement>(null);

  const toggle = (id: AlgorithmId) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) { if (n.size > 2) n.delete(id); }
      else if (n.size < 6) n.add(id);
      return n;
    });
  };

  const [loading, setLoading] = useState(false);

  const startRace = async () => {
    setLoading(true);
    setCommentary(['Requesting race telemetry from Python...']);
    const arr = genArr(size);
    const frames: Record<string, SortFrame[]> = {};
    const idx: Record<string, number> = {};

    try {
      const promises = Array.from(selected).map(async (id) => {
        const res = await fetch('/api/sort', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ algorithm: id, array: arr }),
        });
        if (!res.ok) throw new Error(`Failed to fetch ${id} frames`);
        const data = await res.json();
        frames[id] = data;
        idx[id] = 0;
      });
      await Promise.all(promises);

      setAllFrames(frames);
      setIndices(idx);
      setFinished([]);
      setCountdown(true);
      setCommentary(['Algorithms loaded. Starting in 3...']);
    } catch (err) {
      console.error("Failed to fetch race frames:", err);
      setCommentary(['Error loading algorithms. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const onCountdownDone = () => {
    setCountdown(false);
    setRunning(true);
  };

  const stopRace = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setIndices(prev => {
        const next = { ...prev };
        let allDone = true;
        const newFinished: AlgorithmId[] = [];
        for (const id of Object.keys(next) as AlgorithmId[]) {
          const max = allFrames[id]?.length ?? 0;
          if (next[id] < max - 1) {
            next[id]++;
            allDone = false;
          } else if (next[id] >= max - 1 && !finished.includes(id)) {
            newFinished.push(id);
          }
        }
        if (newFinished.length) setFinished(f => [...f, ...newFinished]);
        if (allDone) setRunning(false);
        return next;
      });

      if (Math.random() < 0.04) {
        const arr = [...selected];
        const rnd = arr[Math.floor(Math.random() * arr.length)];
        const fn = COMMENTARY[Math.floor(Math.random() * COMMENTARY.length)];
        setCommentary(prev => [fn(algorithmMeta[rnd].name), ...prev].slice(0, 8));
      }
    }, speed);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, speed, allFrames, selected]);

  const rankings = useMemo(() => {
    return [...selected].sort((a, b) => {
      const pa = allFrames[a] ? (indices[a] ?? 0) / ((allFrames[a].length - 1) || 1) : 0;
      const pb = allFrames[b] ? (indices[b] ?? 0) / ((allFrames[b].length - 1) || 1) : 0;
      return pb - pa;
    });
  }, [indices, allFrames, selected]);

  const winner = !running && finished.length > 0 ? finished[0] : null;

  return (
    <div className="min-h-screen pt-20 bg-[#020202] mesh-bg font-general">
      {/* Countdown overlay */}
      {countdown && <CountdownOverlay onDone={onCountdownDone} />}

      {/* Header */}
      <div className="border-b border-white/[0.05] px-6 py-4 flex items-center gap-4 flex-wrap relative z-20"
        style={{ background: 'rgba(5,5,5,0.45)', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.06)]">
            <Trophy size={18} className="text-[#FFD700]" />
          </div>
          <div>
            <p className="text-[10px] text-[#FFD700] font-bold uppercase tracking-[0.2em] font-space">Race Arena</p>
            <h1 className="text-2xl font-black text-white font-clash leading-none">ALGORITHM GRAND PRIX</h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 ml-auto flex-wrap items-center">
          <div className="flex gap-1.5 flex-wrap">
            {RACE_ALGOS.map(id => {
              const sel = selected.has(id);
              const color = ALGO_COLORS[id];
              return (
                <button key={id} onClick={() => toggle(id)}
                  className="px-3.5 py-2 text-[10px] rounded-lg font-black font-space border transition-all duration-300 uppercase"
                  style={{
                    background: sel ? `${color}15` : 'rgba(255,255,255,0.01)',
                    borderColor: sel ? `${color}45` : 'rgba(255,255,255,0.04)',
                    color: sel ? color : '#8E8E93',
                    boxShadow: sel ? `0 0 12px ${color}20` : 'none',
                  }}>
                  {algorithmMeta[id].name.replace(' Sort', '')}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/[0.04] bg-obsidian-200/50 text-[10px] font-space font-bold text-white/40 uppercase">
            Speed
            <input type="range" min={5} max={150} value={speed} onChange={e => setSpeed(+e.target.value)}
              className="w-20 h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-royal" />
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/[0.04] bg-obsidian-200/50 text-[10px] font-space font-bold text-white/40 uppercase">
            Size: {size}
            <input type="range" min={20} max={120} value={size} onChange={e => setSize(+e.target.value)}
              className="w-16 h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-royal" />
          </div>
          
          {running
            ? <button onClick={stopRace} className="px-5 py-2.5 rounded-full text-xs font-black tracking-widest bg-red-500/10 border border-red-500/22 text-red-400 hover:bg-red-500/20 transition-all font-space uppercase">STOP</button>
            : <button onClick={startRace} disabled={loading} className="btn-primary px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? '🏁 PREPARING...' : Object.keys(allFrames).length ? '🏁 RESTART' : '🏁 START RACE'}
              </button>
          }
        </div>
      </div>

      <div className="p-6 space-y-5 max-w-screen-xl mx-auto relative z-10">
        {/* Winner Banner */}
        <AnimatePresence>
          {winner && !running && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl p-6 flex items-center gap-6 border glass-ultra"
              style={{
                background: `linear-gradient(135deg, ${ALGO_COLORS[winner]}08, rgba(6,6,6,0.85))`,
                borderColor: `${ALGO_COLORS[winner]}45`,
                boxShadow: `0 0 40px ${ALGO_COLORS[winner]}15`,
              }}
            >
              <div className="text-5xl">🏆</div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest font-space mb-1">Race Winner</p>
                <h2 className="text-3xl font-black font-satoshi" style={{ color: ALGO_COLORS[winner] }}>{algorithmMeta[winner].name.toUpperCase()}</h2>
                <p className="text-white/40 text-sm mt-1.5 font-general">
                  {allFrames[winner]?.slice(-1)[0]?.comparisons.toLocaleString()} comparisons ·{' '}
                  {allFrames[winner]?.slice(-1)[0]?.swaps.toLocaleString()} swaps
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#FFD700] font-black text-4xl font-space">P1</p>
                <p className="text-white/30 text-xs font-space uppercase">Grand Prix Winner</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Race Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankings.map((id, rank) => {
            const m = algorithmMeta[id];
            const color = ALGO_COLORS[id];
            const frames = allFrames[id] ?? [];
            const fi = indices[id] ?? 0;
            const frame = frames[fi] ?? null;
            const pct = frames.length > 1 ? (fi / (frames.length - 1)) * 100 : 0;
            const isWinner = rank === 0 && !running && frames.length > 0;

            return (
              <motion.div key={id}
                layout
                className="rounded-2xl border overflow-hidden glass-ultra"
                style={{
                  borderColor: isWinner ? `${color}55` : 'rgba(255,255,255,0.05)',
                  boxShadow: isWinner ? `0 0 32px ${color}20` : 'none',
                }}>
                {/* Card header */}
                <div className="p-5 flex items-center gap-4 border-b border-white/[0.04] bg-black/10">
                  <div className="text-3xl font-black w-10 text-center font-space"
                    style={{ color: rank === 0 ? '#FFD700' : rank === 1 ? '#C0C0C0' : rank === 2 ? '#CD7F32' : 'rgba(255,255,255,0.25)' }}>
                    P{rank + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                      <p className="font-bold text-white text-base font-satoshi uppercase tracking-wide">{m.name}</p>
                    </div>
                    <p className="text-[10px] font-space mt-1 uppercase font-bold" style={{ color: `${color}cc` }}>{m.average}</p>
                  </div>
                  <Speedometer pct={pct} color={color} />
                  <div className="text-right ml-2">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-space font-bold">CMP</p>
                    <p className="text-lg font-black font-space text-white stat-number">{(frame?.comparisons ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-[2px] bg-white/[0.03]">
                  <div className="h-full transition-all duration-100 race-bar"
                    style={{ width: `${pct}%`, '--algo-color': color } as React.CSSProperties} />
                </div>

                {/* Mini visualizer */}
                <div className="h-20 overflow-hidden p-3 pt-2.5 bg-black/35">
                  <MiniBars frame={frame} color={color} />
                </div>

                <div className="px-5 py-2.5 flex justify-between text-[10px] text-white/30 border-t border-white/[0.03] font-space uppercase font-bold">
                  <span>{Math.round(pct)}% complete</span>
                  <span>{(frame?.swaps ?? 0).toLocaleString()} swaps</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Commentary Terminal */}
        <div className="rounded-2xl border border-white/[0.05] overflow-hidden glass-ultra">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05] bg-black/15">
            <Activity size={14} className="text-[#FFD700]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] font-space text-[#FFD700]/70">Live Race Commentary</p>
            <div className={`ml-auto flex items-center gap-1.5 text-[9px] font-black font-space ${running ? 'text-red-400' : 'text-white/20'}`}>
              {running && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
              {running ? 'LIVE' : 'IDLE'}
            </div>
          </div>
          <div ref={commentaryRef} className="p-5 space-y-1.5 max-h-32 overflow-hidden bg-black/10">
            {commentary.map((c, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="text-xs font-mono" style={{ color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}>
                <span className="text-[#FFD700]/30 mr-2.5">›</span>{c}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
