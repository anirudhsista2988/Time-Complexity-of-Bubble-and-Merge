import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown } from 'lucide-react';

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe', 'Apple'];

const QA: { q: string; a: string; company: string[]; difficulty: 'Easy' | 'Medium' | 'Hard' }[] = [
  { q: 'Why is Quick Sort preferred over Merge Sort in practice despite having O(n²) worst case?', a: 'Quick Sort has better cache performance due to in-place partitioning. It accesses contiguous memory blocks, making it CPU-cache friendly. Additionally, with random pivot selection, worst case is extremely rare. In practice, its constant factor is much smaller than Merge Sort.', company:['Google','Microsoft'], difficulty:'Hard' },
  { q: 'When would you use Merge Sort over Quick Sort?', a: 'Use Merge Sort when: (1) Stability is required — Merge Sort preserves relative order. (2) Sorting linked lists — no random access needed. (3) External sorting — data too large for memory. (4) Parallel sorting — easily parallelizable. (5) Guaranteed O(n log n) is critical — no worst case.', company:['Amazon','Meta'], difficulty:'Medium' },
  { q: 'What is the best sorting algorithm for nearly-sorted data?', a: 'Insertion Sort achieves O(n+k) for nearly-sorted data where k is the number of inversions. It is the best choice because it only performs local swaps and terminates early when no shifts are needed. Python\'s Timsort uses Insertion Sort for small runs for exactly this reason.', company:['Adobe','Google'], difficulty:'Medium' },
  { q: 'Explain why Counting Sort is not always faster than O(n log n) sorts.', a: 'Counting Sort is O(n + k) where k is the range of values. When k >> n (e.g., sorting 10 numbers in range 0 to 10^9), the space and time for the count array becomes O(k) which is far worse than O(n log n). It is only efficient when k = O(n).', company:['Microsoft','Amazon'], difficulty:'Hard' },
  { q: 'How does Heap Sort work and what are its trade-offs?', a: 'Heap Sort builds a max-heap in O(n), then repeatedly extracts the maximum in O(log n), giving O(n log n) total. Trade-offs: (1) Guaranteed O(n log n) — no worst case. (2) In-place — O(1) space. (3) Not stable. (4) Poor cache performance due to random memory access patterns in heapify.', company:['Google','Apple'], difficulty:'Medium' },
  { q: 'What is the time complexity of sorting a million integers each in range [0, 100]?', a: 'Use Counting Sort: O(n + k) = O(1,000,000 + 100) = O(n). Since k (100) is much smaller than n (1,000,000), Counting Sort is optimal. Building the count array is O(k), filling it is O(n), and reconstructing is O(n+k). Total: linear.', company:['Amazon','Meta','Adobe'], difficulty:'Easy' },
  { q: 'How does Radix Sort achieve better than O(n log n)?', a: 'Radix Sort is not comparison-based, so it bypasses the O(n log n) lower bound that applies only to comparison sorts. It processes d digits with O(n) counting sort each, giving O(dn). For fixed-length integers (32-bit), d is constant, making it effectively O(n).', company:['Google','Microsoft'], difficulty:'Hard' },
  { q: 'What sorting algorithm does Python\'s sorted() use?', a: 'Python uses Timsort — a hybrid of Merge Sort and Insertion Sort. It identifies natural runs (already-sorted sequences) in the data, uses Insertion Sort for small runs (< 64 elements), then merges them with Merge Sort. It achieves O(n) on real-world nearly-sorted data and O(n log n) worst case.', company:['All'], difficulty:'Medium' },
];

const CHEATSHEET = [
  { algo: 'Bubble Sort',    best: 'O(n)',      avg: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',    stable: true,  when: 'Never in production. Teaching only.' },
  { algo: 'Selection Sort', best: 'O(n²)',     avg: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',    stable: false, when: 'Min writes needed (n-1 swaps guaranteed).' },
  { algo: 'Insertion Sort', best: 'O(n)',      avg: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',    stable: true,  when: 'Nearly sorted. Small n. Embedded systems.' },
  { algo: 'Merge Sort',     best: 'O(n log n)',avg: 'O(n log n)',worst: 'O(n log n)',space: 'O(n)',   stable: true,  when: 'Stable required. Linked lists. External sort.' },
  { algo: 'Quick Sort',     best: 'O(n log n)',avg: 'O(n log n)',worst: 'O(n²)',     space: 'O(log n)',stable: false, when: 'General purpose. Best practical performance.' },
  { algo: 'Heap Sort',      best: 'O(n log n)',avg: 'O(n log n)',worst: 'O(n log n)',space: 'O(1)',   stable: false, when: 'Guaranteed n log n + in-place required.' },
  { algo: 'Counting Sort',  best: 'O(n+k)',    avg: 'O(n+k)',    worst: 'O(n+k)',    space: 'O(k)',   stable: true,  when: 'Integers with small range k ≤ O(n).' },
  { algo: 'Radix Sort',     best: 'O(nk)',     avg: 'O(nk)',     worst: 'O(nk)',     space: 'O(n+k)', stable: true,  when: 'Fixed-length integers or strings.' },
];

function QACard({item, idx}: {item:typeof QA[0], idx:number}) {
  const [open, setOpen] = useState(false);
  const diffColor = item.difficulty==='Easy'?'#30D158':item.difficulty==='Medium'?'#FF9F0A':'#FF453A';
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.04}}
      className="glass rounded-xl overflow-hidden border border-white/5">
      <button className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-white/[0.02] transition-colors" onClick={() => setOpen(v=>!v)}>
        <span className="text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 font-medium" style={{borderColor:`${diffColor}30`,color:diffColor,background:`${diffColor}10`}}>
          {item.difficulty}
        </span>
        <div className="flex-1">
          <p className="text-sm text-white font-medium leading-relaxed">{item.q}</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {item.company.map(c => <span key={c} className="text-xs text-titanium border border-white/10 px-2 py-0.5 rounded">{c}</span>)}
          </div>
        </div>
        <ChevronDown size={15} className={`text-titanium mt-0.5 shrink-0 transition-transform ${open?'rotate-180':''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
            <div className="px-5 pb-4 pt-0">
              <div className="p-4 bg-black/40 rounded-lg border border-gold-royal/10">
                <p className="text-sm text-white/75 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const InterviewMaster: React.FC = () => {
  const [company, setCompany] = useState<string|null>(null);
  const filtered = company ? QA.filter(q => q.company.includes(company) || q.company.includes('All')) : QA;

  return (
    <div className="min-h-screen pt-14 p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs text-gold-royal font-bold uppercase tracking-widest mb-1">Interview Master</p>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap size={22} className="text-gold-royal" />
          FAANG Interview Preparation
        </h1>
        <p className="text-titanium text-sm mt-1">Sorting algorithms from a senior engineer's perspective</p>
      </div>

      {/* Complexity Cheatsheet */}
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Complexity Cheat Sheet</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Algorithm','Best','Average','Worst','Space','Stable','When to Use'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-titanium font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHEATSHEET.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{row.algo}</td>
                  <td className="px-4 py-3 font-mono text-green-400">{row.best}</td>
                  <td className="px-4 py-3 font-mono text-gold-royal">{row.avg}</td>
                  <td className="px-4 py-3 font-mono text-red-400">{row.worst}</td>
                  <td className="px-4 py-3 font-mono text-titanium">{row.space}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${row.stable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {row.stable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-titanium max-w-[200px]">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setCompany(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${!company ? 'bg-gold-royal/15 border-gold-royal/40 text-gold-royal' : 'border-white/10 text-titanium hover:text-white'}`}>
          All Companies
        </button>
        {COMPANIES.map(c => (
          <button key={c} onClick={() => setCompany(company===c?null:c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${company===c ? 'bg-gold-royal/15 border-gold-royal/40 text-gold-royal' : 'border-white/10 text-titanium hover:text-white'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Q&A */}
      <div className="space-y-3">
        {filtered.map((item, i) => <QACard key={i} item={item} idx={i} />)}
      </div>
    </div>
  );
};
