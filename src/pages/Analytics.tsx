import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { algorithmMeta, algorithmRunners } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';
import { BarChart2, Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const SIZES = [10, 50, 100, 250, 500, 1000];
const ALGOS: AlgorithmId[] = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'heap', 'shell'];
const COLORS = ['#FFD700', '#FF9F0A', '#30D158', '#0A84FF', '#BF5AF2', '#FF453A', '#AEAEB2'];

interface BenchResult { algoId: AlgorithmId; size: number; time: number; comparisons: number; swaps: number; }

function bench(id: AlgorithmId, size: number): BenchResult {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1);
  const t0 = performance.now();
  const frames = algorithmRunners[id]([...arr]);
  const t1 = performance.now();
  const last = frames[frames.length - 1];
  return { algoId: id, size, time: +(t1 - t0).toFixed(3), comparisons: last.comparisons, swaps: last.swaps };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(255,255,255,0.4)', font: { size: 10, family: 'Space Grotesk' }, boxWidth: 12, padding: 16 },
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

// Heatmap cell
const HeatCell: React.FC<{ value: number; max: number; label: string }> = ({ value, max, label }) => {
  const pct = max > 0 ? value / max : 0;
  const hue = (1 - pct) * 120;
  const bg = `hsla(${hue}, 80%, 40%, ${0.15 + pct * 0.7})`;
  const border = `hsla(${hue}, 80%, 40%, ${0.3 + pct * 0.5})`;
  return (
    <div className="heatmap-cell aspect-square rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      style={{ background: bg, borderColor: border, boxShadow: pct > 0.7 ? `0 0 10px ${bg}` : 'none' }}
      title={label}>
      <span className="text-[10px] font-space font-black text-white/95">
        {value > 999 ? `${(value / 1000).toFixed(0)}k` : value}
      </span>
    </div>
  );
};

type Metric = 'time' | 'comparisons' | 'swaps';

export const Analytics: React.FC = () => {
  const [results, setResults] = useState<BenchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metric, setMetric] = useState<Metric>('comparisons');

  const run = async () => {
    setLoading(true);
    const allResults: BenchResult[] = [];
    const total = ALGOS.length * SIZES.length;
    let done = 0;
    for (const id of ALGOS) {
      for (const s of SIZES) {
        allResults.push(bench(id, s));
        done++;
        setProgress(Math.round((done / total) * 100));
        await new Promise(r => setTimeout(r, 1));
      }
    }
    setResults(allResults);
    setLoading(false);
  };

  const lineData = {
    labels: SIZES.map(String),
    datasets: ALGOS.map((id, i) => ({
      label: algorithmMeta[id].name,
      data: SIZES.map(s => results.find(r => r.algoId === id && r.size === s)?.[metric] ?? null),
      borderColor: COLORS[i],
      backgroundColor: `${COLORS[i]}05`,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2,
    })),
  };

  const barData = {
    labels: ALGOS.map(id => algorithmMeta[id].name.replace(' Sort', '')),
    datasets: [{
      label: `${metric.toUpperCase()} AT N=${SIZES[SIZES.length - 1]}`,
      data: ALGOS.map(id => results.find(r => r.algoId === id && r.size === SIZES[SIZES.length - 1])?.[metric] ?? 0),
      backgroundColor: ALGOS.map((_, i) => `${COLORS[i]}30`),
      borderColor: COLORS,
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  // Heatmap: algos × sizes for comparisons
  const heatMax = results.reduce((m, r) => Math.max(m, r.comparisons), 0);

  return (
    <div className="min-h-screen pt-20 bg-[#020202] mesh-bg font-general">
      {/* Header */}
      <div className="border-b border-white/[0.05] px-6 py-4 flex items-center gap-4 flex-wrap relative z-20"
        style={{ background: 'rgba(5,5,5,0.45)', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-blue-500/20 bg-blue-500/10">
            <BarChart2 size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space">Analytics Terminal</p>
            <h1 className="text-2xl font-black text-white font-clash leading-none">PERFORMANCE SUITE</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Metric toggle */}
          <div className="flex gap-1.5 bg-obsidian-200/50 p-1 rounded-xl border border-white/[0.04]">
            {(['time', 'comparisons', 'swaps'] as Metric[]).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className="px-3.5 py-1.5 text-[10px] rounded-lg font-bold font-space uppercase transition-all duration-300"
                style={{
                  background: metric === m ? 'rgba(255,215,0,0.1)' : 'transparent',
                  border: `1px solid ${metric === m ? 'rgba(255,215,0,0.22)' : 'transparent'}`,
                  color: metric === m ? '#FFD700' : '#8E8E93',
                }}>
                {m === 'time' ? 'TIME (ms)' : m}
              </button>
            ))}
          </div>
          <button onClick={run} disabled={loading}
            className="btn-primary px-6 py-2.5 rounded-full text-xs font-black tracking-widest leading-none disabled:opacity-50 inline-flex items-center gap-2">
            {loading ? <><Loader2 size={13} className="animate-spin" /> BENCHMARKING {progress}%</> : '▶ RUN SUITE'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-screen-xl mx-auto relative z-10">
        {loading && (
          <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra">
            <div className="flex justify-between text-xs mb-3 font-space uppercase">
              <span className="text-white/60">Running benchmark suite…</span>
              <span className="font-black text-gold-royal font-mono">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-100" style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(255,215,0,0.5)' }} />
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const last = SIZES[SIZES.length - 1];
                const fastest = ALGOS.reduce((best, id) => {
                  const r = results.find(r => r.algoId === id && r.size === last);
                  const br = results.find(r => r.algoId === best && r.size === last);
                  return r && br && r.time < br.time ? id : best;
                }, ALGOS[0]);
                const fewest = ALGOS.reduce((best, id) => {
                  const r = results.find(r => r.algoId === id && r.size === last);
                  const br = results.find(r => r.algoId === best && r.size === last);
                  return r && br && r.comparisons < br.comparisons ? id : best;
                }, ALGOS[0]);
                return [
                  { label: 'Fastest (1k)', val: algorithmMeta[fastest].name.replace(' Sort', ''), sub: `${results.find(r => r.algoId === fastest && r.size === last)?.time}ms` },
                  { label: 'Fewest Comparisons', val: algorithmMeta[fewest].name.replace(' Sort', ''), sub: results.find(r => r.algoId === fewest && r.size === last)?.comparisons.toLocaleString() ?? '' },
                  { label: 'Algorithms Tested', val: ALGOS.length.toString(), sub: 'fully benchmarked' },
                  { label: 'Input Sizes', val: SIZES.length.toString(), sub: `${SIZES[0]} → ${SIZES[SIZES.length - 1]}` },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="p-5 rounded-2xl border border-white/[0.05] glass-ultra hover:border-gold-royal/30 transition-all duration-300">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-2">{label}</p>
                    <p className="text-xl font-black gold-text font-satoshi leading-tight">{val}</p>
                    <p className="text-[11px] text-white/40 font-space uppercase mt-1.5">{sub}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Line Chart */}
            <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra" style={{ height: 380 }}>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-4">Growth Rate — {metric.toUpperCase()}</p>
              <div style={{ height: 300 }}>
                <Line data={lineData} options={chartOptions as any} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart at max n */}
              <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra" style={{ height: 300 }}>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-4">Comparison at n={SIZES[SIZES.length - 1]}</p>
                <div style={{ height: 230 }}>
                  <Bar data={barData} options={chartOptions as any} />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-4">Comparison Heatmap</p>
                <div className="flex gap-2 mb-3">
                  <div className="w-28 shrink-0" />
                  {SIZES.map(s => (
                    <div key={s} className="flex-1 text-center text-[10px] text-white/35 font-space font-bold">{s}</div>
                  ))}
                </div>
                {ALGOS.map((id, i) => (
                  <div key={id} className="flex gap-2 mb-2 items-center">
                    <div className="w-28 text-[11px] text-white/50 font-satoshi font-bold shrink-0 truncate uppercase"
                      style={{ color: COLORS[i] }}>{algorithmMeta[id].name.replace(' Sort', '')}</div>
                    {SIZES.map(s => {
                      const r = results.find(r => r.algoId === id && r.size === s);
                      return (
                        <div key={s} className="flex-1">
                          <HeatCell value={r?.comparisons ?? 0} max={heatMax} label={`${algorithmMeta[id].name} n=${s}: ${r?.comparisons?.toLocaleString() ?? 0} comparisons`} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Table */}
            <div className="rounded-2xl border border-white/[0.05] overflow-hidden glass-ultra">
              <div className="px-5 py-4 border-b border-white/[0.04]">
                <p className="text-sm font-bold text-white font-satoshi uppercase tracking-wider">Full Results — n={SIZES[SIZES.length - 1]}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04] bg-black/15">
                      {['Algorithm', 'Time (ms)', 'Comparisons', 'Swaps', 'Avg Complexity', 'Stable'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-[10px] text-white/30 font-space font-black uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALGOS.map((id, i) => {
                      const r = results.find(r => r.algoId === id && r.size === SIZES[SIZES.length - 1]);
                      const m = algorithmMeta[id];
                      return r ? (
                        <tr key={id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                              <span className="text-white font-bold font-satoshi uppercase tracking-wide">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-gold-royal font-black text-sm">{r.time}</td>
                          <td className="px-5 py-4 font-mono text-white/80 font-medium">{r.comparisons.toLocaleString()}</td>
                          <td className="px-5 py-4 font-mono text-white/80 font-medium">{r.swaps.toLocaleString()}</td>
                          <td className="px-5 py-4 font-space text-white/40 font-bold uppercase">{m.average}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-space font-black uppercase ${m.stable ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              {m.stable ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : !loading && (
          <div className="rounded-2xl border border-white/[0.05] p-20 flex flex-col items-center text-center glass-ultra">
            <BarChart2 size={48} className="text-[#FFD700]/15 mb-6" />
            <h2 className="text-xl font-bold text-white mb-2 font-satoshi uppercase tracking-wide">Analytics Terminal Ready</h2>
            <p className="text-white/40 text-sm mb-8 max-w-sm font-general">Run the full benchmark suite to generate Bloomberg-grade performance data across all algorithms and input sizes.</p>
            <button onClick={run} className="btn-primary px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase">▶ Run Benchmark Suite</button>
          </div>
        )}
      </div>
    </div>
  );
};
