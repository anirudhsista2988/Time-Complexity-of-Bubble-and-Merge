import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';
import { BarChart2, Loader2, Copy, Check } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const SIZES = [100, 500, 1000, 5000, 10000];
const ALGOS: AlgorithmId[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'radix', 'shell'];

interface BenchResult {
  algoId: AlgorithmId;
  size: number;
  time: number;
  comparisons: number;
  swaps: number;
  memory: number; // Peak memory in KB
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
        {value > 999 ? `${(value / 1000).toFixed(0)}k` : (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1))}
      </span>
    </div>
  );
};

type Metric = 'time' | 'comparisons' | 'swaps' | 'memory';

export const Analytics: React.FC = () => {
  const [results, setResults] = useState<BenchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metric, setMetric] = useState<Metric>('time');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    setProgress(0);
    setResults([]);
    const total = ALGOS.length * SIZES.length;
    let done = 0;
    
    for (const id of ALGOS) {
      for (const s of SIZES) {
        try {
          const res = await fetch('/api/benchmark/single', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ algorithm: id, size: s })
          });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          // Append to results state incrementally for real-time visualization updates
          setResults(prev => [...prev, data]);
        } catch (err) {
          console.error("Failed to run benchmark for", id, s, err);
          setResults(prev => [...prev, { algoId: id, size: s, time: 0, comparisons: 0, swaps: 0, memory: 0 }]);
        }
        done++;
        setProgress(Math.round((done / total) * 100));
        // Yield thread execution briefly to keep UI smooth
        await new Promise(r => setTimeout(r, 1));
      }
    }
    setLoading(false);
  };

  const lineData = {
    labels: SIZES.map(String),
    datasets: ALGOS.map((id) => ({
      label: algorithmMeta[id].name,
      data: SIZES.map(s => results.find(r => r.algoId === id && r.size === s)?.[metric] ?? null),
      borderColor: algorithmMeta[id].color,
      backgroundColor: `${algorithmMeta[id].color}05`,
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
      backgroundColor: ALGOS.map(id => `${algorithmMeta[id].color}30`),
      borderColor: ALGOS.map(id => algorithmMeta[id].color),
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  const heatMax = results.reduce((m, r) => Math.max(m, r[metric] ?? 0), 0);

  const generateMarkdownReport = () => {
    const lastSize = SIZES[SIZES.length - 1];
    const sortedAlgos = [...ALGOS].map(id => {
      const sizeResults = results.filter(r => r.algoId === id);
      const r = sizeResults.find(res => res.size === lastSize) || sizeResults[sizeResults.length - 1];
      return { id, r };
    }).sort((a, b) => (a.r?.time ?? Infinity) - (b.r?.time ?? Infinity));

    let md = `# RRR SORTING ALGORITHM BENCHMARK REPORT\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
    md += `## Telemetry Metrics at Size N = ${lastSize}\n\n`;
    md += `| Rank | Algorithm | Time (ms) | Comparisons | Swaps | Peak Memory (KB) | Average Complexity | Stable |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    
    sortedAlgos.forEach((item, index) => {
      const m = algorithmMeta[item.id];
      const r = item.r;
      if (r) {
        md += `| ${index + 1} | ${m.name} | ${r.time.toFixed(3)} ms | ${r.comparisons.toLocaleString()} | ${r.swaps.toLocaleString()} | ${r.memory ? r.memory.toFixed(2) + ' KB' : 'N/A'} | ${m.average} | ${m.stable ? 'Yes' : 'No'} |\n`;
      }
    });
    
    md += `\n## Diagnostics Analysis\n\n`;
    const fastest = sortedAlgos[0];
    const slowest = sortedAlgos[sortedAlgos.length - 1];
    if (fastest?.r && slowest?.r) {
      const ratio = (slowest.r.time / (fastest.r.time || 1)).toFixed(1);
      md += `- **Fastest Algorithm**: ${algorithmMeta[fastest.id].name} (${fastest.r.time.toFixed(3)} ms)\n`;
      md += `- **Slowest Algorithm**: ${algorithmMeta[slowest.id].name} (${slowest.r.time.toFixed(3)} ms)\n`;
      md += `- **Speed Gap**: ${algorithmMeta[fastest.id].name} is **${ratio}x** faster than ${algorithmMeta[slowest.id].name}.\n`;
    }
    
    md += `\n*End of diagnostics report.*`;
    return md;
  };

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
            {(['time', 'comparisons', 'swaps', 'memory'] as Metric[]).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className="px-3.5 py-1.5 text-[10px] rounded-lg font-bold font-space uppercase transition-all duration-300"
                style={{
                  background: metric === m ? 'rgba(255,215,0,0.1)' : 'transparent',
                  border: `1px solid ${metric === m ? 'rgba(255,215,0,0.22)' : 'transparent'}`,
                  color: metric === m ? '#FFD700' : '#8E8E93',
                }}>
                {m === 'time' ? 'TIME (ms)' : m === 'memory' ? 'MEMORY (KB)' : m}
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
                const completedAlgos = ALGOS.filter(id => results.some(r => r.algoId === id));
                
                const fastest = completedAlgos.reduce((best, id) => {
                  const r = results.find(res => res.algoId === id && res.size === last);
                  const br = results.find(res => res.algoId === best && res.size === last);
                  return r && br && r.time < br.time ? id : best;
                }, completedAlgos[0] || ALGOS[0]);

                const slowest = completedAlgos.reduce((worst, id) => {
                  const r = results.find(res => res.algoId === id && res.size === last);
                  const wr = results.find(res => res.algoId === worst && res.size === last);
                  return r && wr && r.time > wr.time ? id : worst;
                }, completedAlgos[0] || ALGOS[0]);

                const fewComparisons = completedAlgos.reduce((best, id) => {
                  const r = results.find(res => res.algoId === id && res.size === last);
                  const br = results.find(res => res.algoId === best && res.size === last);
                  return r && br && r.comparisons < br.comparisons ? id : best;
                }, completedAlgos[0] || ALGOS[0]);

                const fastestRes = results.find(r => r.algoId === fastest && r.size === last);
                const slowestRes = results.find(r => r.algoId === slowest && r.size === last);
                const fewRes = results.find(r => r.algoId === fewComparisons && r.size === last);

                return [
                  { label: `Fastest (n=${last})`, val: algorithmMeta[fastest].name.replace(' Sort', ''), sub: fastestRes ? `${fastestRes.time.toFixed(2)}ms` : 'N/A' },
                  { label: `Slowest (n=${last})`, val: algorithmMeta[slowest].name.replace(' Sort', ''), sub: slowestRes ? `${slowestRes.time.toFixed(2)}ms` : 'N/A' },
                  { label: 'Fewest Comparisons', val: algorithmMeta[fewComparisons].name.replace(' Sort', ''), sub: fewRes ? fewRes.comparisons.toLocaleString() : 'N/A' },
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
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-4">Performance Comparison (n={SIZES[SIZES.length - 1]})</p>
                <div style={{ height: 230 }}>
                  <Bar data={barData} options={chartOptions as any} />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-space font-bold mb-4">{metric.toUpperCase()} HEATMAP</p>
                <div className="flex gap-2 mb-3">
                  <div className="w-28 shrink-0" />
                  {SIZES.map(s => (
                    <div key={s} className="flex-1 text-center text-[10px] text-white/35 font-space font-bold">{s}</div>
                  ))}
                </div>
                {ALGOS.map((id) => (
                  <div key={id} className="flex gap-2 mb-2 items-center">
                    <div className="w-28 text-[11px] text-white/50 font-satoshi font-bold shrink-0 truncate uppercase"
                      style={{ color: algorithmMeta[id].color }}>{algorithmMeta[id].name.replace(' Sort', '')}</div>
                    {SIZES.map(s => {
                      const r = results.find(r => r.algoId === id && r.size === s);
                      const val = r?.[metric] ?? 0;
                      return (
                        <div key={s} className="flex-1">
                          <HeatCell value={val} max={heatMax} label={`${algorithmMeta[id].name} n=${s}: ${val.toLocaleString()} ${metric}`} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard & Markdown Report */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboard Table (2/3 width) */}
              <div className="lg:col-span-2 rounded-2xl border border-white/[0.05] overflow-hidden glass-ultra">
                <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space">Real-time Leaderboard</p>
                    <h2 className="text-base font-bold text-white font-satoshi uppercase tracking-wider">Algorithm Ranking (n={SIZES[SIZES.length - 1]})</h2>
                  </div>
                  <span className="text-[10px] bg-gold-royal/10 border border-gold-royal/20 text-gold-royal font-black font-space px-2 py-0.5 rounded">
                    SORTED BY SPEED
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-black/15">
                        {['Rank', 'Algorithm', 'Time (ms)', 'Speed Factor', 'Comparisons', 'Swaps', 'Memory', 'Complexity', 'Stable'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] text-white/30 font-space font-black uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const lastSize = SIZES[SIZES.length - 1];
                        const sorted = [...ALGOS].map(id => {
                          const r = results.find(res => res.algoId === id && res.size === lastSize);
                          return { id, time: r?.time ?? Infinity, r };
                        }).sort((a, b) => a.time - b.time);

                        const fastestTime = sorted[0]?.time || 1;

                        return sorted.map((item, idx) => {
                          const m = algorithmMeta[item.id];
                          const r = item.r;
                          const factor = r && r.time !== Infinity ? (r.time / fastestTime).toFixed(1) : 'N/A';
                          
                          let rankStyle = "bg-white/5 text-white/70";
                          if (idx === 0) {
                            rankStyle = "bg-amber-400/20 text-amber-300 border border-amber-400/30";
                          } else if (idx === 1) {
                            rankStyle = "bg-slate-300/20 text-slate-300 border border-slate-300/30";
                          } else if (idx === 2) {
                            rankStyle = "bg-amber-600/20 text-amber-500 border border-amber-600/30";
                          }

                          return (
                            <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                              <td className="px-4 py-3.5">
                                <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-space font-black text-[10px] ${rankStyle}`}>
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color }} />
                                  <span className="text-white font-bold font-satoshi uppercase tracking-wide">{m.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-gold-royal font-black text-xs">
                                {r ? `${r.time.toFixed(2)}` : 'N/A'}
                              </td>
                              <td className="px-4 py-3.5 font-space font-bold">
                                {idx === 0 ? (
                                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-black">FASTEST</span>
                                ) : r && r.time !== Infinity ? (
                                  <span className="text-red-400 font-mono text-[10.5px]">{factor}x slower</span>
                                ) : (
                                  <span className="text-white/20">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-white/80 font-medium">
                                {r ? r.comparisons.toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-white/80 font-medium">
                                {r ? r.swaps.toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-white/60">
                                {r ? `${r.memory.toFixed(1)} KB` : 'N/A'}
                              </td>
                              <td className="px-4 py-3.5 font-space text-white/40 font-bold uppercase">
                                {m.average}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-space font-black uppercase ${m.stable ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {m.stable ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Benchmark Diagnostic Report (1/3 width) */}
              <div className="rounded-2xl border border-white/[0.05] p-5 glass-ultra flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] font-space">Laboratory output</p>
                  <h2 className="text-base font-bold text-white font-satoshi uppercase tracking-wider mb-4">Diagnostics Report</h2>
                  
                  <div className="bg-black/45 rounded-xl border border-white/[0.04] p-3 text-[10px] font-mono text-white/60 h-80 overflow-y-auto whitespace-pre-wrap select-all scrollbar-thin">
                    {generateMarkdownReport()}
                  </div>
                </div>

                <div className="mt-4">
                  <button onClick={() => {
                    navigator.clipboard.writeText(generateMarkdownReport());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full btn-primary py-2.5 rounded-xl text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2">
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        COPIED TO CLIPBOARD
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        COPY MARKDOWN REPORT
                      </>
                    )}
                  </button>
                </div>
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
