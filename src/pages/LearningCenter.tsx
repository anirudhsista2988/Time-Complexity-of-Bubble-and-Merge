import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';
import { ChevronDown } from 'lucide-react';

const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

const LEARN_CONTENT: Record<AlgorithmId, { theory: string; working: string[]; useCases: string[]; mistakes: string[]; tips: string[] }> = {
  bubble: {
    theory: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping adjacent elements that are in the wrong order. The name comes from the way smaller elements "bubble" to the top of the list.',
    working: ['Start from the first element.','Compare adjacent pairs and swap if out of order.','After each pass, the largest unsorted element settles at the end.','Repeat until no swaps are needed — the array is sorted.'],
    useCases: ['Teaching purposes','Nearly sorted arrays (O(n) best case)','Embedded systems with tiny datasets'],
    mistakes: ['Using on large datasets (O(n²) is very slow)','Not implementing the early-exit optimization'],
    tips: ['Implement the "swapped" flag for O(n) best case','Never use for n > 1000 in production','Bubble Sort is rarely used in industry — great for interviews to discuss why'],
  },
  selection: {
    theory: 'Selection Sort divides the input list into two parts: the sorted portion at the front and the unsorted portion at the back. It repeatedly selects the smallest element from the unsorted portion and moves it to the sorted portion.',
    working: ['Find the minimum element in the unsorted array.','Swap it with the first unsorted element.','Move the boundary between sorted and unsorted one element to the right.','Repeat until the entire array is sorted.'],
    useCases: ['Small datasets','When memory writes are expensive (only n-1 swaps)','Systems with limited memory'],
    mistakes: ['Forgetting it is NOT stable by default','Using when the number of comparisons matters more than writes'],
    tips: ['Performs exactly n-1 swaps — good when write cost dominates','O(n²) always — no best case improvement','Can be made stable with careful implementation'],
  },
  insertion: {
    theory: 'Insertion Sort builds the sorted array one element at a time. For each element, it finds the correct position in the already-sorted prefix and inserts it there by shifting larger elements right.',
    working: ['Start with the second element as the "key".','Compare with elements to its left.','Shift larger elements one position right.','Insert the key in the correct position.','Repeat for all elements.'],
    useCases: ['Small arrays (< 20 elements)','Nearly sorted data — very fast O(n+k)','Hybrid sorts use it for small subarrays (e.g., Timsort)'],
    mistakes: ['Ignoring its superiority over Bubble/Selection for nearly-sorted data','Not using it as the base case in recursive sorts'],
    tips: ['Used in Timsort (Python/Java default sort) for small runs','Stable and in-place','O(n) for already sorted input — best case among simple sorts'],
  },
  merge: {
    theory: 'Merge Sort uses the divide-and-conquer paradigm. It recursively divides the array in half, sorts each half, then merges the two sorted halves into one sorted array.',
    working: ['Divide: split array at the midpoint.','Conquer: recursively sort each half.','Merge: combine two sorted halves into one sorted array using two pointers.'],
    useCases: ['External sorting (data too large for memory)','Linked list sorting (no random access needed)','When stability is required','Parallel sorting'],
    mistakes: ['Forgetting the O(n) space requirement','Not recognizing its consistency — always O(n log n)'],
    tips: ['Guaranteed O(n log n) — no worst case degradation','Stable sort — preserves relative order','Used for external sorting and linked lists where QuickSort can not be applied'],
  },
  quick: {
    theory: 'Quick Sort picks a "pivot" element and partitions the array so all elements less than the pivot are on the left and all greater are on the right. Then it recursively sorts both partitions.',
    working: ['Select a pivot (last, first, or random element).','Partition: rearrange so elements < pivot are on the left.','Recursively apply to both partitions.'],
    useCases: ['General-purpose sorting (cache-friendly)','Large datasets in practice','Language standard library sorts (often hybrid Introsort)'],
    mistakes: ['Using last element as pivot on already-sorted data → O(n²)','Not using randomized pivot selection'],
    tips: ['Average O(n log n) but O(n²) worst case with bad pivot','Use random pivot or median-of-three to avoid worst case','In-place — very cache friendly, often faster than Merge Sort in practice'],
  },
  heap: {
    theory: 'Heap Sort uses a binary max-heap data structure. It first builds a max-heap from the input, then repeatedly extracts the maximum element and places it at the end.',
    working: ['Build max-heap: rearrange array into heap structure.','Extract: swap root (max) with last element.','Reduce heap size by 1.','Restore heap property (heapify).','Repeat until heap is empty.'],
    useCases: ['Systems where O(n log n) worst case must be guaranteed','Memory-limited systems (in-place)','Priority queues'],
    mistakes: ['Expecting it to be as fast as QuickSort — cache-unfriendly','Misunderstanding heapify vs buildHeap complexity'],
    tips: ['Guaranteed O(n log n) — no worst case','Not stable — relative order not preserved','In-place but poor cache performance due to random access patterns'],
  },
  counting: {
    theory: 'Counting Sort counts the occurrences of each distinct element and reconstructs the sorted output. It is not comparison-based, achieving O(n+k) where k is the range of values.',
    working: ['Find the range [min, max] of the input.','Count occurrences of each value.','Compute prefix sums (cumulative counts).','Build output array using counts.'],
    useCases: ['Integer sorting with small range','Age, grade, score sorting','As a subroutine in Radix Sort'],
    mistakes: ['Using with large ranges — O(n+k) with huge k is impractical','Using with floating point numbers'],
    tips: ['Not comparison-based — beats O(n log n) lower bound','Linear O(n+k) time and space','Only works for discrete, bounded integer ranges'],
  },
  radix: {
    theory: 'Radix Sort sorts integers digit by digit, from the least significant to the most significant digit, using a stable sub-sort (usually Counting Sort) at each digit position.',
    working: ['For each digit position (units, tens, hundreds…)','Apply a stable sort by that digit position.','After all digit positions are processed, the array is sorted.'],
    useCases: ['Large collections of integers or strings','Fixed-length integer sorting','Phone numbers, IP addresses, zip codes'],
    mistakes: ['Assuming it works for arbitrary data — only for fixed-length keys','Forgetting it requires a stable sub-sort'],
    tips: ['O(nk) where k is number of digits — effectively O(n) for fixed-length integers','Not comparison-based','Stable if the sub-sort is stable'],
  },
  bucket: {
    theory: 'Bucket Sort distributes elements into a number of buckets, sorts each bucket individually (often with Insertion Sort), then concatenates the results.',
    working: ['Create n empty buckets.','Distribute elements into buckets based on value range.','Sort each individual bucket.','Concatenate all buckets.'],
    useCases: ['Uniformly distributed floating point numbers [0,1)','Scatter-gather parallelism','External sorting'],
    mistakes: ['Using with non-uniform distributions — performance degrades to O(n²)','Choosing too few or too many buckets'],
    tips: ['O(n+k) average for uniform distributions','Worst case O(n²) when all elements fall in one bucket','Effective for floating point numbers in a known range'],
  },
  shell: {
    theory: 'Shell Sort is a generalization of Insertion Sort that first sorts elements far apart, then progressively reduces the gap. This reduces the total number of shifts needed.',
    working: ['Start with a large gap (usually n/2).','Apply gap-Insertion Sort: sort elements spaced "gap" apart.','Halve the gap and repeat.','When gap=1 this is a standard Insertion Sort on nearly-sorted data.'],
    useCases: ['Medium-sized datasets','Embedded systems','When Quicksort is unavailable'],
    mistakes: ['Using a poor gap sequence — performance depends heavily on gap choice','Thinking it is O(n log n) — depends on gap sequence'],
    tips: ['Gap sequence determines performance — Hibbard gap gives O(n^1.5)','Better than Insertion Sort for larger inputs','In-place, not stable'],
  },
};

export const LearningCenter: React.FC = () => {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmId>('bubble');
  const [openSection, setOpenSection] = useState<string|null>('theory');

  const meta = algorithmMeta[activeAlgo];
  const content = LEARN_CONTENT[activeAlgo];

  const sections = [
    { id:'theory',   label:'Theory',            content: <p className="text-white/70 leading-relaxed">{content.theory}</p> },
    { id:'working',  label:'How It Works',      content: <ol className="space-y-2">{content.working.map((s,i)=><li key={i} className="flex gap-3"><span className="text-gold-royal font-bold font-mono text-sm w-5 shrink-0">{i+1}.</span><span className="text-white/70 text-sm">{s}</span></li>)}</ol> },
    { id:'usecases', label:'Real-world Use Cases', content: <ul className="space-y-1">{content.useCases.map((s,i)=><li key={i} className="text-white/70 text-sm flex items-start gap-2"><span className="text-gold-royal mt-0.5">▸</span>{s}</li>)}</ul> },
    { id:'mistakes', label:'Common Mistakes',   content: <ul className="space-y-1">{content.mistakes.map((s,i)=><li key={i} className="text-red-400/80 text-sm flex items-start gap-2"><span className="mt-0.5">⚠</span>{s}</li>)}</ul> },
    { id:'tips',     label:'Interview Tips',    content: <ul className="space-y-1">{content.tips.map((s,i)=><li key={i} className="text-green-400/80 text-sm flex items-start gap-2"><span className="mt-0.5">✓</span>{s}</li>)}</ul> },
    { id:'pseudo',   label:'Pseudocode',        content: <div className="space-y-1">{meta.pseudocode.map((l,i)=><div key={i} className="px-3 py-1.5 rounded text-xs font-mono bg-black/40 text-gold-royal border-l-2 border-gold-royal/20">{l}</div>)}</div> },
    { id:'complexity',label:'Complexity Analysis', content: (
      <div className="grid grid-cols-2 gap-3">
        {[{l:'Best Case',v:meta.best},{l:'Average',v:meta.average},{l:'Worst Case',v:meta.worst},{l:'Space',v:meta.space}].map(({l,v})=>(
          <div key={l} className="p-3 rounded-lg bg-black/40 border border-white/5">
            <p className="text-xs text-titanium mb-1">{l}</p>
            <p className="text-sm font-mono font-bold text-gold-royal">{v}</p>
          </div>
        ))}
      </div>
    )},
  ];

  return (
    <div className="min-h-screen pt-14 flex">
      {/* Left: Algorithm List */}
      <div className="w-56 border-r border-white/5 glass shrink-0 overflow-y-auto no-scrollbar">
        <div className="p-4 border-b border-white/5">
          <p className="text-xs text-gold-royal font-bold uppercase tracking-widest">Learning Center</p>
        </div>
        <div className="p-2">
          {ALGO_IDS.map(id => {
            const m = algorithmMeta[id];
            return (
              <button key={id} onClick={() => { setActiveAlgo(id); setOpenSection('theory'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 flex items-center gap-2
                  ${activeAlgo===id ? 'text-white' : 'text-titanium hover:text-white hover:bg-white/5'}`}
                style={activeAlgo===id ? {background:`${m.color}15`, borderLeft:`2px solid ${m.color}`} : {}}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{background:m.color}} />
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div key={activeAlgo} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
          <div className="flex items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{meta.name}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-titanium">Avg: {meta.average}</span>
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-titanium">Space: {meta.space}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${meta.stable ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {meta.stable ? 'Stable' : 'Unstable'}
                </span>
                <span className="text-xs px-2 py-1 rounded font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {meta.inPlace ? 'In-Place' : 'Extra Space'}
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-3">
            {sections.map(({id, label, content}) => (
              <div key={id} className="glass rounded-2xl overflow-hidden border border-white/5">
                <button
                  onClick={() => setOpenSection(openSection===id ? null : id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{label}</span>
                  <ChevronDown size={16} className={`text-titanium transition-transform ${openSection===id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection===id && (
                    <motion.div
                      initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:0.25}}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">{content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
