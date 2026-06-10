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
      labels: { color: 'rgba(255,255,255,0.4)', font: { size: 10, family: 'JetBrains Mono' }, boxWidth: 12, padding: 16 },
    },
    tooltip: {
      backgroundColor: 'rgba(10,10,10,0.95)',
      borderColor: 'rgba(255,215,0,0.2)',
      borderWidth: 1,
      titleColor: '#FFD700',
      bodyColor: 'rgba(255,255,255,0.7)',
      padding: 10,
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 10, family: 'JetBrains Mono' } },
      grid: { color: 'rgba(255,255,255,0.03)' },
      border: { color: 'rgba(255,255,255,0.05)' },
    },
    y: {
      ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 10, family: 'JetBrains Mono' } },
      grid: { color: 'rgba(255,255,255,0.03)' },
      border: { color: 'rgba(255,255,255,0.05)' },
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
    <div className="heatmap-cell aspect-square rounded-lg border flex items-center justify-center cursor-default"
      style={{ background: bg, borderColor: border, boxShadow: pct > 0.7 ? `0 0 10px ${bg}` : 'none' }}
      title={label}>
      <span className="text-[10px] font-mono font-bold text-white/70">
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
      backgroundColor: `${COLORS[i]}10`,
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
      label: `${metric} at n=${SIZES[SIZES.length - 1]}`,
      data: ALGOS.map(id => results.find(r => r.algoId === id && r.size === SIZES[SIZES.length - 1])?.[metric] ?? 0),
      backgroundColor: ALGOS.map((_, i) => `${COLORS[i]}40`),
      borderColor: COLORS,
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  // Heatmap: algos × sizes for comparisons
  const heatMax = results.reduce((m, r) => Math.max(m, r.comparisons), 0);

  return (
    <div className="min-h-screen pt-14 bg-[#030303] mesh-bg">
      {/* Header */}
      <div className="border-b border-white/[0.05] px-6 py-4 flex items-center gap-4 flex-wrap"
        style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-blue-500/20 bg-blue-500/08">
            <BarChart2 size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-blue-400/50 font-bold uppercase tracking-[0.15em]">Analytics Terminal</p>
            <h1 className="text-lg font-black text-white">Performance Benchmark Suite</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Metric toggle */}
          <div className="flex gap-1">
            {(['time', 'comparisons', 'swaps'] as Metric[]).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className="px-3 py-1.5 text-[11px] rounded-lg font-bold capitalize border transition-all"
                style={{
                  background: metric === m ? 'rgba(255,215,0,0.1)' : 'transparent',
                  borderColor: metric === m ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)',
                  color: metric === m ? '#FFD700' : '#636366',
                }}>
                {m === 'time' ? 'Time (ms)' : m}
              </button>
            ))}
          </div>
          <button onClick={run} disabled={loading}
            className="btn-primary px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50 inline-flex items-center gap-2">
            {loading ? <><Loader2 size={13} className="animate-spin" /> Benchmarking {progress}%</> : '▶ Run Suite'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
        {loading && (
          <div className="rounded-2xl border border-white/[0.05] p-5" style={{ background: 'rgba(8,8,8,0.9)' }}>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/60 font-mono">Running benchmark suite…</span>
              <span className="font-black font-mono" style={{ color: '#FFD700' }}>{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full loading-bar rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
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
                  { label: 'Fastest (1k)', val: algorithmMeta[fastest].name, sub: `${results.find(r => r.algoId === fastest && r.size === last)?.time}ms` },
                  { label: 'Fewest Comparisons', val: algorithmMeta[fewest].name, sub: results.find(r => r.algoId === fewest && r.size === last)?.comparisons.toLocaleString() ?? '' },
                  { label: 'Algorithms Tested', val: ALGOS.length.toString(), sub: 'fully benchmarked' },
                  { label: 'Input Sizes', val: SIZES.length.toString(), sub: `${SIZES[0]} → ${SIZES[SIZES.length - 1]}` },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="p-4 rounded-2xl border border-white/[0.05]"
                    style={{ background: 'rgba(8,8,8,0.9)' }}>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-xl font-black text-[#FFD700]">{val}</p>
                    <p className="text-[11px] text-white/30 font-mono mt-1">{sub}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Line Chart */}
            <div className="rounded-2xl border border-white/[0.05] p-5"
              style={{ background: 'rgba(8,8,8,0.9)', height: 360 }}>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">Growth Rate — {metric}</p>
              <div style={{ height: 300 }}>
                <Line data={lineData} options={chartOptions as any} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Bar Chart at max n */}
              <div className="rounded-2xl border border-white/[0.05] p-5"
                style={{ background: 'rgba(8,8,8,0.9)', height: 280 }}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">Comparison at n={SIZES[SIZES.length - 1]}</p>
                <div style={{ height: 220 }}>
                  <Bar data={barData} options={chartOptions as any} />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-2xl border border-white/[0.05] p-5"
                style={{ background: 'rgba(8,8,8,0.9)' }}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">Comparison Heatmap</p>
                <div className="flex gap-2 mb-2">
                  <div className="w-28 shrink-0" />
                  {SIZES.map(s => (
                    <div key={s} className="flex-1 text-center text-[9px] text-white/25 font-mono">{s}</div>
                  ))}
                </div>
                {ALGOS.map((id, i) => (
                  <div key={id} className="flex gap-2 mb-1.5 items-center">
                    <div className="w-28 text-[10px] text-white/40 font-medium shrink-0 truncate"
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
            <div className="rounded-2xl border border-white/[0.05] overflow-hidden"
              style={{ background: 'rgba(8,8,8,0.9)' }}>
              <div className="px-5 py-3 border-b border-white/[0.04]">
                <p className="text-[11px] font-semibold text-white">Full Results — n={SIZES[SIZES.length - 1]}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {['Algorithm', 'Time (ms)', 'Comparisons', 'Swaps', 'Avg Complexity', 'Stable'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] text-white/25 font-medium uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALGOS.map((id, i) => {
                      const r = results.find(r => r.algoId === id && r.size === SIZES[SIZES.length - 1]);
                      const m = algorithmMeta[id];
                      return r ? (
                        <tr key={id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                              <span className="text-white font-medium">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-[#FFD700] font-bold">{r.time}</td>
                          <td className="px-5 py-3 font-mono text-white/70">{r.comparisons.toLocaleString()}</td>
                          <td className="px-5 py-3 font-mono text-white/70">{r.swaps.toLocaleString()}</td>
                          <td className="px-5 py-3 font-mono text-white/40">{m.average}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.stable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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
          <div className="rounded-2xl border border-white/[0.05] p-20 flex flex-col items-center text-center"
            style={{ background: 'rgba(8,8,8,0.9)' }}>
            <BarChart2 size={48} className="text-[#FFD700]/15 mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Analytics Terminal Ready</h2>
            <p className="text-white/30 text-sm mb-8 max-w-sm">Run the full benchmark suite to generate Bloomberg-grade performance data across all algorithms and input sizes.</p>
            <button onClick={run} className="btn-primary px-8 py-3 rounded-full text-sm font-bold">▶ Run Benchmark Suite</button>
          </div>
        )}
      </div>
    </div>
  );
};
