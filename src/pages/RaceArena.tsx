import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { SortFrame, AlgorithmId } from '../types/sorting';
import { Trophy, Activity, GitCompare } from 'lucide-react';
import { genArray } from '../utils/array';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RACE_ALGOS: AlgorithmId[] = ['bubble', 'insertion', 'merge', 'quick', 'heap', 'shell'];

interface RaceOutcome {
  algorithm: string;
  algoId: AlgorithmId;
  executionTime: number;
  comparisons: number;
  swaps: number;
}

const ALGO_MESSAGES: Record<AlgorithmId, { start: string; mid: string; end: string }> = {
  bubble: {
    start: "Consecutive swaps detected. Swapping adjacent elements.",
    mid: "Multiple passes required. Gradually bubbled elements to the end.",
    end: "Pass completed. Large values locked in sorted positions."
  },
  selection: {
    start: "Scan initialized. Minimum element identified in the remaining partition.",
    mid: "Selection phase completed. Swapping smallest elements to the front.",
    end: "Remaining elements sorted. Selection scan boundary moved."
  },
  insertion: {
    start: "Key element picked. Comparing with sorted prefix.",
    mid: "Shifting elements to make room for insertion key.",
    end: "Key inserted successfully in its sorted position."
  },
  merge: {
    start: "Subarrays divided. Recursively splitting array halves.",
    mid: "Subarrays combined efficiently. Sorting subsegment groups.",
    end: "Merge operation completed. Subarrays merged back in sorted order."
  },
  quick: {
    start: "Pivot selection improves partition efficiency.",
    mid: "Balanced partitions detected. Reordering elements around pivot.",
    end: "Partition finalized. Pivot locked in its correct index."
  },
  heap: {
    start: "Heap construction completed. Building max heap tree structure.",
    mid: "Max heap extraction in progress. Re-heapifying remaining nodes.",
    end: "Heap extraction complete. Sorted elements finalized."
  },
  shell: {
    start: "Shell gap sequence initialized. Starting interval comparisons.",
    mid: "Shrinking interval search sweeps. Insertion sort with gap interval.",
    end: "Interval gap reduced to 1. Finalizing insertion pass."
  },
  counting: {
    start: "Frequency array generated. Counting element occurrences.",
    mid: "Calculating cumulative sums of frequencies.",
    end: "Output array reconstructed from frequency counts."
  },
  radix: {
    start: "LSD radix pass starting. Sorting by current digit.",
    mid: "Stable sort partition applied by digit significance.",
    end: "Radix pass completed. Moving to next significant digit."
  },
  bucket: {
    start: "Mapping elements to uniform buckets.",
    mid: "Sorting individual bucket items using insertion sort.",
    end: "Concatenating bucket segments back to array."
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(5,5,5,0.95)',
      borderColor: 'rgba(255,215,0,0.22)',
      borderWidth: 1,
      titleColor: '#FFD700',
      bodyColor: 'rgba(255,255,255,0.8)',
      padding: 10,
      titleFont: { family: 'Space Grotesk', weight: 'bold' },
      bodyFont: { family: 'General Sans' }
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9, family: 'Space Grotesk' } },
      grid: { color: 'rgba(255,215,0,0.015)' },
      border: { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9, family: 'Space Grotesk' } },
      grid: { color: 'rgba(255,215,0,0.015)' },
      border: { color: 'rgba(255,255,255,0.04)' },
    },
  },
};

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

const MiniBars: React.FC<{ frame: SortFrame | null; initialArray?: number[] | null; color: string }> = ({ frame, initialArray, color }) => {
  const arrayToRender = frame ? frame.array : initialArray;
  if (!arrayToRender || arrayToRender.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-white/20 text-[9px] font-space font-black uppercase tracking-widest">READY</div>;
  }
  const max = Math.max(...arrayToRender, 100);
  return (
    <div className="flex items-end h-full gap-px w-full">
      {arrayToRender.map((v, i) => {
        const s = frame ? frame.states[i] : 'default';
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
  const [currentArr, setCurrentArr] = useState<number[]>(() => genArray(70));
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [allFrames, setAllFrames] = useState<Record<string, SortFrame[]>>({});
  const [indices, setIndices] = useState<Record<string, number>>({});
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [finished, setFinished] = useState<AlgorithmId[]>([]);
  const [raceResults, setRaceResults] = useState<RaceOutcome[]>([]);
  const [commentary, setCommentary] = useState<string[]>(['Select algorithms and start the race.']);
  const [speed, setSpeed] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const commentaryRef = useRef<HTMLDivElement>(null);
  const commentedMilestones = useRef<Record<string, Set<string>>>({});

  const toggle = (id: AlgorithmId) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) { if (n.size > 2) n.delete(id); }
      else if (n.size < 6) n.add(id);
      return n;
    });
    setAllFrames({});
    setRaceResults([]);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setAllFrames({});
    setRaceResults([]);
    setCurrentArr(genArray(newSize));
  };

  const handleLoadCustomArray = () => {
    setInputError(null);
    if (!customInput.trim()) {
      setInputError('Please enter some numbers.');
      return;
    }
    const parts = customInput.split(',');
    const parsed: number[] = [];
    for (let part of parts) {
      const trimmed = part.trim();
      if (trimmed === '') continue;
      const num = Number(trimmed);
      if (isNaN(num)) {
        setInputError(`Invalid value: "${trimmed}". Only numbers are allowed.`);
        return;
      }
      if (num < 1 || num > 1000) {
        setInputError(`Number "${trimmed}" must be between 1 and 1000 for proper visualization.`);
        return;
      }
      parsed.push(Math.round(num));
    }

    if (parsed.length < 2) {
      setInputError('Array must contain at least 2 numbers.');
      return;
    }
    if (parsed.length > 500) {
      setInputError('Array size cannot exceed 500 elements.');
      return;
    }

    stopRace();
    setSize(parsed.length);
    setCurrentArr(parsed);
    setAllFrames({});
    setRaceResults([]);
  };

  const [loading, setLoading] = useState(false);

  const startRace = async () => {
    setLoading(true);
    setCommentary(['Requesting race telemetry from Python...']);
    setRaceResults([]);
    commentedMilestones.current = {};
    const arr = currentArr;
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

      // Construct results array (single source of truth for stats/podium/winner)
      const outcomes: RaceOutcome[] = Array.from(selected).map(id => {
        const fList = frames[id];
        const lastFrame = fList[fList.length - 1];
        return {
          algorithm: algorithmMeta[id].name,
          algoId: id,
          executionTime: lastFrame.executionTime ?? 0,
          comparisons: lastFrame.comparisons,
          swaps: lastFrame.swaps
        };
      });

      setAllFrames(frames);
      setIndices(idx);
      setFinished([]);
      setRaceResults(outcomes);
      setCountdown(true);
      setCommentary(['Race telemetry loaded. Starting engine...']);
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
        
        // Generate commentary based on visual progress of each track
        const activeIds = Object.keys(next) as AlgorithmId[];
        activeIds.forEach(id => {
          const fList = allFrames[id] ?? [];
          const fi = next[id] ?? 0;
          const pct = fList.length > 1 ? (fi / (fList.length - 1)) * 100 : 0;
          
          if (!commentedMilestones.current[id]) {
            commentedMilestones.current[id] = new Set();
          }
          
          const set = commentedMilestones.current[id];
          let milestone: 'start' | 'mid' | 'end' | null = null;
          if (pct >= 85 && !set.has('end')) {
            milestone = 'end';
          } else if (pct >= 45 && pct < 85 && !set.has('mid')) {
            milestone = 'mid';
          } else if (pct >= 15 && pct < 45 && !set.has('start')) {
            milestone = 'start';
          }

          if (milestone) {
            set.add(milestone);
            const text = ALGO_MESSAGES[id]?.[milestone] || `Running at ${Math.round(pct)}%`;
            const comment = `🏎️ ${algorithmMeta[id].name}: ${text}`;
            setCommentary(prev => [comment, ...prev].slice(0, 8));
          }
        });

        if (newFinished.length) {
          setFinished(f => [...f, ...newFinished]);
        }
        
        if (allDone) {
          setRunning(false);
          // Append final completed message using single source of truth results
          if (raceResults.length > 0) {
            const sortedOutcomes = [...raceResults].sort((a, b) => a.executionTime - b.executionTime);
            const winAlgo = sortedOutcomes[0];
            if (winAlgo) {
              const finalComment = `🏆 Grand Prix Complete! ${winAlgo.algorithm} takes P1 in ${winAlgo.executionTime.toFixed(3)} ms.`;
              setCommentary(prev => [finalComment, ...prev].slice(0, 8));
            }
          }
        }
        return next;
      });
    }, speed);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, speed, allFrames, finished, raceResults]);

  const raceCompleted = useMemo(() => {
    return !running && Object.keys(allFrames).length > 0 && Object.keys(indices).every(id => {
      const fList = allFrames[id];
      const idx = indices[id];
      return fList && idx >= fList.length - 1;
    });
  }, [running, allFrames, indices]);

  // Sort rankings: during active race sort by progress %; when finished, sort strictly by actual executionTime
  const rankings = useMemo(() => {
    if (raceCompleted && raceResults.length === selected.size) {
      return [...raceResults]
        .sort((a, b) => a.executionTime - b.executionTime)
        .map(r => r.algoId);
    }
    return [...selected].sort((a, b) => {
      const pa = allFrames[a] ? (indices[a] ?? 0) / ((allFrames[a].length - 1) || 1) : 0;
      const pb = allFrames[b] ? (indices[b] ?? 0) / ((allFrames[b].length - 1) || 1) : 0;
      if (pb === pa) {
        const resA = raceResults.find(r => r.algoId === a);
        const resB = raceResults.find(r => r.algoId === b);
        if (resA && resB) {
          return resA.executionTime - resB.executionTime;
        }
      }
      return pb - pa;
    });
  }, [indices, allFrames, selected, running, raceCompleted, raceResults]);

  const winnerInfo = useMemo(() => {
    if (!raceCompleted || raceResults.length === 0) return null;
    const minTime = Math.min(...raceResults.map(r => r.executionTime));
    const winners = raceResults.filter(r => r.executionTime === minTime).map(r => r.algoId);
    return {
      winners,
      isTie: winners.length > 1,
      minTime
    };
  }, [raceCompleted, raceResults]);

  // Chart data for final statistics
  const chartData = {
    labels: rankings.map(id => algorithmMeta[id].name.replace(' Sort', '')),
    datasets: [{
      label: 'Execution Time (ms)',
      data: rankings.map(id => raceResults.find(r => r.algoId === id)?.executionTime ?? 0),
      backgroundColor: rankings.map(id => `${algorithmMeta[id].color}30`),
      borderColor: rankings.map(id => algorithmMeta[id].color),
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

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
              const color = algorithmMeta[id].color;
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
            <input type="range" min={Math.min(20, size)} max={Math.max(120, size)} value={size} onChange={e => handleSizeChange(+e.target.value)}
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

      <div className="p-6 space-y-6 max-w-screen-xl mx-auto relative z-10">
        {/* Custom Array Input */}
        <div className="rounded-2xl p-5 border border-white/[0.05] glass-ultra">
          <p className="text-[10px] text-white/35 font-black uppercase tracking-wider font-space mb-2">Custom Array Input</p>
          <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="e.g. 45, 12, 89, 23, 7, 56, 34"
                value={customInput}
                onChange={e => {
                  setCustomInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                className="w-full px-4 py-2 bg-obsidian-200/50 border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700]/50 transition-all"
              />
              {inputError && (
                <p className="text-[10px] text-red-400 mt-1 font-space uppercase font-bold">{inputError}</p>
              )}
            </div>
            <button
              onClick={handleLoadCustomArray}
              className="px-5 py-2 bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.22)] rounded-xl text-xs font-black font-space text-[#FFD700] hover:bg-[rgba(255,215,0,0.15)] transition-all uppercase shrink-0"
            >
              Load Array
            </button>
          </div>
        </div>

        {/* Winner Banner */}
        <AnimatePresence>
          {raceCompleted && winnerInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl p-6 flex items-center gap-6 border glass-ultra"
              style={{
                background: winnerInfo.isTie
                  ? `linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,6,6,0.85))`
                  : `linear-gradient(135deg, ${algorithmMeta[winnerInfo.winners[0]].color}08, rgba(6,6,6,0.85))`,
                borderColor: winnerInfo.isTie
                  ? `rgba(59,130,246,0.45)`
                  : `${algorithmMeta[winnerInfo.winners[0]].color}45`,
                boxShadow: winnerInfo.isTie
                  ? `0 0 40px rgba(59,130,246,0.15)`
                  : `0 0 40px ${algorithmMeta[winnerInfo.winners[0]].color}15`,
              }}
            >
              <div className="text-5xl">🏆</div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest font-space mb-1">
                  {winnerInfo.isTie ? 'Race Tie' : 'Race Winner'}
                </p>
                <h2 className="text-3xl font-black font-satoshi">
                  {winnerInfo.isTie
                    ? 'IT\'S A TIE!'
                    : algorithmMeta[winnerInfo.winners[0]].name.toUpperCase()}
                </h2>
                <p className="text-white/40 text-sm mt-1.5 font-general">
                  {winnerInfo.isTie ? (
                    `Tied algorithms finished in ${winnerInfo.minTime.toFixed(3)} ms`
                  ) : (
                    `${raceResults.find(r => r.algoId === winnerInfo.winners[0])?.executionTime.toFixed(3)} ms · ${raceResults.find(r => r.algoId === winnerInfo.winners[0])?.comparisons.toLocaleString()} comparisons · ${raceResults.find(r => r.algoId === winnerInfo.winners[0])?.swaps.toLocaleString()} swaps`
                  )}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#FFD700] font-black text-4xl font-space">
                  {winnerInfo.isTie ? 'TIE' : 'P1'}
                </p>
                <p className="text-white/30 text-xs font-space uppercase">
                  {winnerInfo.isTie ? 'No single winner' : 'Grand Prix Winner'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Race Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(selected).map((id) => {
            const rank = rankings.indexOf(id);
            const m = algorithmMeta[id];
            const color = algorithmMeta[id].color;
            const frames = allFrames[id] ?? [];
            const fi = indices[id] ?? 0;
            const frame = frames[fi] ?? null;
            const pct = frames.length > 1 ? (fi / (frames.length - 1)) * 100 : 0;
            const isWinner = raceCompleted && winnerInfo && winnerInfo.winners.includes(id);
            const isTie = winnerInfo?.isTie;

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
                      <p className="font-bold text-white text-base font-satoshi uppercase tracking-wide truncate">{m.name}</p>
                      {isWinner && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-space shrink-0 ${isTie ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
                          {isTie ? 'Tie' : 'Winner'}
                        </span>
                      )}
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
                  <MiniBars frame={frame} initialArray={currentArr} color={color} />
                </div>

                <div className="px-5 py-2.5 flex justify-between text-[10px] text-white/30 border-t border-white/[0.03] font-space uppercase font-bold">
                  <span>{Math.round(pct)}% complete</span>
                  <span>{(frame?.swaps ?? 0).toLocaleString()} swaps</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Race Summary Panel */}
        {raceCompleted && raceResults.length === selected.size && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="rounded-2xl border p-6 glass-ultra relative overflow-hidden"
            style={{ borderColor: 'rgba(255,215,0,0.12)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[rgba(255,215,0,0.03)] to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[rgba(255,215,0,0.22)] bg-[rgba(255,215,0,0.06)]">
                <Trophy size={18} className="text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-clash leading-none">RACE SUMMARY</h2>
                <p className="text-[10px] text-white/30 font-space uppercase">Official Benchmarking Report</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-space font-bold mb-1.5 block">Original Array</span>
                <div className="p-3.5 rounded-xl border border-white/[0.04] bg-black/30 text-xs font-mono text-white/70 break-all max-h-24 overflow-y-auto no-scrollbar">
                  [{currentArr.join(', ')}]
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-space font-bold mb-1.5 block">Sorted Output</span>
                <div className="p-3.5 rounded-xl border border-white/[0.04] bg-black/30 text-xs font-mono text-[#30D158] break-all max-h-24 overflow-y-auto no-scrollbar">
                  [{(() => {
                    const firstAlgoId = raceResults[0]?.algoId;
                    const frames = allFrames[firstAlgoId];
                    return frames ? frames[frames.length - 1]?.array.join(', ') : '';
                  })()}]
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-space font-bold block mb-1">Winner</span>
                <div className="flex items-center gap-2">
                  {winnerInfo?.isTie ? (
                    <>
                      <span className="text-xl">🏆</span>
                      <span className="text-lg font-black text-blue-400 font-space uppercase">🏆 TIE</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🏆</span>
                      <span className="text-lg font-black font-satoshi uppercase" style={{ color: winnerInfo ? algorithmMeta[winnerInfo.winners[0]].color : undefined }}>
                        {winnerInfo ? algorithmMeta[winnerInfo.winners[0]].name : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-6">
                {raceResults.map(r => {
                  const m = algorithmMeta[r.algoId];
                  const isWinning = winnerInfo?.winners.includes(r.algoId);
                  return (
                    <div key={r.algoId} className="text-right">
                      <span className="text-[9px] text-white/30 uppercase tracking-wider font-space font-bold block" style={{ color: isWinning ? m.color : undefined }}>
                        {m.name.replace(' Sort', '')}
                      </span>
                      <span className="text-sm font-black font-mono text-white mt-0.5 block">{r.executionTime.toFixed(1)} ms</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/10">
                <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-wider font-space block mb-3">Execution Times</span>
                <div className="space-y-2.5">
                  {raceResults.map(r => {
                    const m = algorithmMeta[r.algoId];
                    return (
                      <div key={r.algoId} className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold">{m.name}</span>
                        <span className="font-mono text-gold-royal font-black">{r.executionTime.toFixed(2)} ms</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/10">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-space block mb-3">Comparisons</span>
                <div className="space-y-2.5">
                  {raceResults.map(r => {
                    const m = algorithmMeta[r.algoId];
                    return (
                      <div key={r.algoId} className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold">{m.name}</span>
                        <span className="font-mono text-white font-black">{r.comparisons.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.04] bg-black/10">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-space block mb-3">Swaps</span>
                <div className="space-y-2.5">
                  {raceResults.map(r => {
                    const m = algorithmMeta[r.algoId];
                    return (
                      <div key={r.algoId} className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-semibold">{m.name}</span>
                        <span className="font-mono text-white font-black">{r.swaps.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Podium and Final Stats */}
        {raceCompleted && raceResults.length === selected.size && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Podium Component */}
            <div className="lg:col-span-1 rounded-2xl border border-white/[0.05] p-5 glass-ultra flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space mb-1">Official Podium</p>
                <h3 className="text-base font-bold text-white font-satoshi uppercase tracking-wider mb-6">Race Finishers</h3>
                
                <div className="flex flex-col gap-4">
                  {rankings.slice(0, 3).map((id, index) => {
                    const m = algorithmMeta[id];
                    const res = raceResults.find(r => r.algoId === id);
                    const rankStyle = index === 0 
                      ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' 
                      : index === 1 
                      ? 'border-slate-300/30 bg-slate-300/10 text-slate-300' 
                      : 'border-amber-600/30 bg-amber-600/10 text-amber-500';
                    const trophyColor = index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉';
                    return (
                      <div key={id} className={`flex items-center gap-3 p-3 rounded-xl border ${rankStyle}`}>
                        <div className="text-2xl">{trophyColor}</div>
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest text-white/40 font-space font-black">Rank P{index + 1}</p>
                          <h4 className="text-sm font-black font-satoshi text-white uppercase">{m.name}</h4>
                          <p className="text-[10px] font-mono text-white/50">{res ? `${res.executionTime.toFixed(3)} ms` : 'N/A'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Final Statistics Comparison Table */}
            <div className="lg:col-span-1 rounded-2xl border border-white/[0.05] overflow-hidden glass-ultra">
              <div className="px-5 py-4 border-b border-white/[0.04]">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space">Diagnostics Telemetry</p>
                <h3 className="text-base font-bold text-white font-satoshi uppercase tracking-wider">Race Statistics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04] bg-black/15">
                      {['Rank', 'Algorithm', 'Time', 'Margin'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] text-white/30 font-space font-black uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const sortedRankings = rankings.map(id => ({ id, res: raceResults.find(r => r.algoId === id) }));
                      const baseTime = sortedRankings[0]?.res?.executionTime || 1;
                      return sortedRankings.map(({ id, res }, index) => {
                        const m = algorithmMeta[id];
                        const timeStr = res ? `${res.executionTime.toFixed(2)} ms` : 'N/A';
                        const margin = index === 0 ? 'Baseline' : res ? `+${(res.executionTime - baseTime).toFixed(2)} ms` : '—';
                        return (
                          <tr key={id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                            <td className="px-4 py-3.5 font-space font-black text-white/50">P{index + 1}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                                <span className="text-white font-bold font-satoshi uppercase truncate max-w-[80px]">{m.name.replace(' Sort', '')}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-gold-royal font-black">{timeStr}</td>
                            <td className="px-4 py-3.5 font-space font-bold text-white/40 text-[10px]">{margin}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Bar Chart */}
            <div className="lg:col-span-1 rounded-2xl border border-white/[0.05] p-5 glass-ultra flex flex-col justify-between" style={{ minHeight: 250 }}>
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space mb-1">Visual Telemetry</p>
                <h3 className="text-base font-bold text-white font-satoshi uppercase tracking-wider mb-4">Execution Speed (ms)</h3>
              </div>
              <div className="flex-1 min-h-[140px] h-[140px]">
                <Bar data={chartData} options={chartOptions as any} />
              </div>
            </div>
          </div>

          {/* Complexity & Theoretical Profile Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/[0.05] p-6 glass-ultra mt-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[rgba(255,215,0,0.22)] bg-[rgba(255,215,0,0.06)]">
                <GitCompare size={18} className="text-[#FFD700]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-satoshi uppercase tracking-wider">Complexity & Theoretical Comparison</h3>
                <p className="text-[10px] text-white/30 font-space uppercase">Theory meets real-world execution telemetry</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-black/25">
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Algorithm</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Best Case</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Average Case</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Worst Case</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Space Complexity</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Stability</th>
                    <th className="px-4 py-3 text-[10px] text-white/30 font-space font-black uppercase tracking-wider">Memory Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(selected).map(id => {
                    const m = algorithmMeta[id];
                    return (
                      <tr key={id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                        <td className="px-4 py-3.5 flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                          <span className="text-white font-bold font-satoshi uppercase">{m.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-green-400 font-mono font-semibold">{m.best}</td>
                        <td className="px-4 py-3.5 text-gold-royal font-mono font-semibold">{m.average}</td>
                        <td className="px-4 py-3.5 text-red-400 font-mono font-semibold">{m.worst}</td>
                        <td className="px-4 py-3.5 text-blue-400 font-mono font-semibold">{m.space}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-space ${m.stable ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {m.stable ? 'Stable' : 'Unstable'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-space ${m.inPlace ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                            {m.inPlace ? 'In-Place' : 'Out-of-Place'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

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
