import type { BarState, SortFrame, AlgorithmId, AlgorithmMeta } from '../../types/sorting';

const makeStates = (n: number, fill: BarState = 'default'): BarState[] => Array(n).fill(fill);

export const algorithmMeta: Record<AlgorithmId, AlgorithmMeta> = {
  bubble:    { id:'bubble',    name:'Bubble Sort',    best:'O(n)',      average:'O(n²)',     worst:'O(n²)',     space:'O(1)', stable:true,  inPlace:true,  color:'#FFD700', description:'Repeatedly swaps adjacent elements if they are in the wrong order.', pseudocode:['for i = 0 to n-1','  for j = 0 to n-i-2','    if arr[j] > arr[j+1]','      swap(arr[j], arr[j+1])','  mark arr[n-i-1] as sorted'] },
  selection: { id:'selection', name:'Selection Sort', best:'O(n²)',     average:'O(n²)',     worst:'O(n²)',     space:'O(1)', stable:false, inPlace:true,  color:'#FF9F0A', description:'Finds the minimum element and places it at the beginning each pass.', pseudocode:['for i = 0 to n-1','  minIdx = i','  for j = i+1 to n','    if arr[j] < arr[minIdx]','      minIdx = j','  swap(arr[i], arr[minIdx])'] },
  insertion: { id:'insertion', name:'Insertion Sort', best:'O(n)',      average:'O(n²)',     worst:'O(n²)',     space:'O(1)', stable:true,  inPlace:true,  color:'#30D158', description:'Builds the sorted array one item at a time by inserting each element.', pseudocode:['for i = 1 to n','  key = arr[i]','  j = i - 1','  while j >= 0 and arr[j] > key','    arr[j+1] = arr[j]','    j--','  arr[j+1] = key'] },
  merge:     { id:'merge',     name:'Merge Sort',     best:'O(n log n)',average:'O(n log n)',worst:'O(n log n)',space:'O(n)', stable:true,  inPlace:false, color:'#0A84FF', description:'Divides the array in half, sorts each half, then merges them.', pseudocode:['mergeSort(arr, l, r)','  if l < r','    m = (l+r)/2','    mergeSort(arr, l, m)','    mergeSort(arr, m+1, r)','    merge(arr, l, m, r)'] },
  quick:     { id:'quick',     name:'Quick Sort',     best:'O(n log n)',average:'O(n log n)',worst:'O(n²)',     space:'O(log n)', stable:false, inPlace:true, color:'#BF5AF2', description:'Picks a pivot and partitions the array around it recursively.', pseudocode:['quickSort(arr, lo, hi)','  if lo < hi','    p = partition(arr, lo, hi)','    quickSort(arr, lo, p-1)','    quickSort(arr, p+1, hi)','partition: place pivot correctly'] },
  heap:      { id:'heap',      name:'Heap Sort',      best:'O(n log n)',average:'O(n log n)',worst:'O(n log n)',space:'O(1)', stable:false, inPlace:true,  color:'#FF453A', description:'Builds a max-heap then extracts the maximum element repeatedly.', pseudocode:['buildMaxHeap(arr)','for i = n-1 downto 1','  swap(arr[0], arr[i])','  heapify(arr, i, 0)','heapify: restore heap property'] },
  counting:  { id:'counting',  name:'Counting Sort',  best:'O(n+k)',    average:'O(n+k)',    worst:'O(n+k)',    space:'O(k)', stable:true,  inPlace:false, color:'#5AC8FA', description:'Counts occurrences of each element and reconstructs the sorted array.', pseudocode:['count = array[0..k]','for each element x in arr','  count[x]++','for i=1 to k','  count[i] += count[i-1]','build output from count'] },
  radix:     { id:'radix',     name:'Radix Sort',     best:'O(nk)',     average:'O(nk)',     worst:'O(nk)',     space:'O(n+k)', stable:true, inPlace:false, color:'#FF6B35', description:'Sorts numbers digit by digit from least to most significant.', pseudocode:['for each digit position d','  stableSort(arr) by digit d','  (using counting sort)','repeat for all digits'] },
  bucket:    { id:'bucket',    name:'Bucket Sort',    best:'O(n+k)',    average:'O(n+k)',    worst:'O(n²)',     space:'O(n)', stable:true,  inPlace:false, color:'#34C759', description:'Distributes elements into buckets then sorts each bucket.', pseudocode:['for each element x','  bucket[floor(n*x)]+=x','for each bucket','  insertionSort(bucket)','concatenate all buckets'] },
  shell:     { id:'shell',     name:'Shell Sort',     best:'O(n log n)',average:'O(n log²n)',worst:'O(n²)',     space:'O(1)', stable:false, inPlace:true,  color:'#AEAEB2', description:'An optimized insertion sort that compares elements far apart.', pseudocode:['gap = n/2','while gap > 0','  for i = gap to n','    temp = arr[i]','    j = i','    while j>=gap and arr[j-gap]>temp','      arr[j]=arr[j-gap]; j-=gap','  gap /= 2'] },
};

// ────────────────── ALGORITHMS ──────────────────

export function runBubbleSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;

  const push = (states: BarState[], desc: string, line?: number, pass?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line, pass });

  push(makeStates(n), 'Starting Bubble Sort', 0);
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const s = makeStates(n);
      sorted.forEach(k => { s[k] = 'sorted'; });
      s[j] = 'compare'; s[j+1] = 'compare';
      comparisons++;
      push(s, `Comparing ${arr[j]} and ${arr[j+1]}`, 1, i+1);
      if (arr[j] > arr[j+1]) {
        const s2 = makeStates(n);
        sorted.forEach(k => { s2[k] = 'sorted'; });
        s2[j] = 'swap'; s2[j+1] = 'swap';
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swaps++; swapped = true;
        push(s2, `Swapping ${arr[j+1]} ↔ ${arr[j]}`, 3, i+1);
      }
    }
    sorted.push(n - i - 1);
    if (!swapped) break;
  }
  for (let i = 0; i < n; i++) if (!sorted.includes(i)) sorted.push(i);
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 4);
  return frames;
}

export function runSelectionSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], desc: string, line?: number, pass?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line, pass });

  push(makeStates(n), 'Starting Selection Sort', 0);
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      const s = makeStates(n);
      for (let k = 0; k < i; k++) s[k] = 'sorted';
      s[minIdx] = 'pivot'; s[j] = 'compare';
      comparisons++;
      push(s, `Comparing ${arr[j]} with current min ${arr[minIdx]}`, 2, i+1);
      if (arr[j] < arr[minIdx]) { minIdx = j; }
    }
    if (minIdx !== i) {
      const s = makeStates(n);
      for (let k = 0; k < i; k++) s[k] = 'sorted';
      s[i] = 'swap'; s[minIdx] = 'swap';
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      push(s, `Placing minimum ${arr[i]} at position ${i}`, 5, i+1);
    }
  }
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 5);
  return frames;
}

export function runInsertionSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], desc: string, line?: number, pass?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line, pass });

  push(makeStates(n), 'Starting Insertion Sort', 0);
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    const s0 = makeStates(n);
    for (let k = 0; k < i; k++) s0[k] = 'sorted';
    s0[i] = 'pivot';
    push(s0, `Inserting key: ${key}`, 1, i);
    while (j >= 0 && arr[j] > key) {
      const s = makeStates(n);
      s[j] = 'compare'; s[j+1] = 'swap';
      comparisons++; swaps++;
      arr[j + 1] = arr[j]; j--;
      push(s, `Moving ${arr[j+1]} right to make room for ${key}`, 3, i);
    }
    arr[j + 1] = key;
    const sPost = makeStates(n);
    for (let k = 0; k <= i; k++) sPost[k] = 'sorted';
    push(sPost, `Inserted key ${key} at position ${j + 1}`, 6, i);
  }
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 6);
  return frames;
}

export function runMergeSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], desc: string, line?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line });

  push(makeStates(n), 'Starting Merge Sort', 0);

  function merge(l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      comparisons++;
      const s = makeStates(n);
      s[l + i] = 'compare'; s[m + 1 + j] = 'compare';
      push(s, `Merging: comparing ${left[i]} and ${right[j]}`, 5);
      if (left[i] <= right[j]) { arr[k++] = left[i++]; }
      else { arr[k++] = right[j++]; swaps++; }
      const s2 = makeStates(n);
      for (let x = l; x <= k - 1; x++) s2[x] = 'merge';
      push(s2, `Placed ${arr[k-1]} at position ${k-1}`, 5);
    }
    while (i < left.length) {
      arr[k++] = left[i++];
      const s2 = makeStates(n);
      for (let x = l; x <= k - 1; x++) s2[x] = 'merge';
      push(s2, `Placed remaining left element ${arr[k-1]} at position ${k-1}`, 5);
    }
    while (j < right.length) {
      arr[k++] = right[j++];
      const s2 = makeStates(n);
      for (let x = l; x <= k - 1; x++) s2[x] = 'merge';
      push(s2, `Placed remaining right element ${arr[k-1]} at position ${k-1}`, 5);
    }
    const s = makeStates(n);
    for (let x = l; x <= r; x++) s[x] = 'sorted';
    push(s, `Subarray [${l}..${r}] merged`, 5);
  }

  function mergeSort(l: number, r: number) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      const s = makeStates(n);
      for (let x = l; x <= m; x++) s[x] = 'compare';
      for (let x = m+1; x <= r; x++) s[x] = 'pivot';
      push(s, `Dividing [${l}..${r}] at midpoint ${m}`, 2);
      mergeSort(l, m);
      mergeSort(m + 1, r);
      merge(l, m, r);
    }
  }

  mergeSort(0, n - 1);
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 5);
  return frames;
}

export function runQuickSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], desc: string, line?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line });

  push(makeStates(n), 'Starting Quick Sort', 0);

  function partition(lo: number, hi: number): number {
    const pivotVal = arr[hi];
    let i = lo - 1;
    const s0 = makeStates(n);
    s0[hi] = 'pivot';
    push(s0, `Pivot selected: ${pivotVal} at index ${hi}`, 5);
    for (let j = lo; j < hi; j++) {
      comparisons++;
      const s = makeStates(n);
      s[hi] = 'pivot'; s[j] = 'compare';
      push(s, `Comparing ${arr[j]} with pivot ${pivotVal}`, 2);
      if (arr[j] <= pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]]; swaps++;
        const s2 = makeStates(n);
        s2[hi] = 'pivot'; s2[i] = 'swap'; s2[j] = 'swap';
        push(s2, `${arr[i]} ≤ pivot → swapping to left side`, 3);
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]; swaps++;
    const s3 = makeStates(n);
    s3[i + 1] = 'sorted';
    push(s3, `Pivot ${arr[i+1]} placed at final position ${i+1}`, 5);
    return i + 1;
  }

  function quickSort(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      quickSort(lo, p - 1);
      quickSort(p + 1, hi);
    }
  }

  quickSort(0, n - 1);
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 5);
  return frames;
}

export function runHeapSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const sortedFrom: Set<number> = new Set();
  const push = (states: BarState[], desc: string, line?: number) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, activeLine: line });

  push(makeStates(n), 'Starting Heap Sort', 0);

  function heapify(size: number, root: number) {
    let largest = root, l = 2*root+1, r = 2*root+2;
    if (l < size) { comparisons++; if (arr[l] > arr[largest]) largest = l; }
    if (r < size) { comparisons++; if (arr[r] > arr[largest]) largest = r; }
    if (largest !== root) {
      const s = makeStates(n);
      sortedFrom.forEach(i => { s[i] = 'sorted'; });
      s[root] = 'compare'; s[largest] = 'swap';
      [arr[root], arr[largest]] = [arr[largest], arr[root]]; swaps++;
      push(s, `Heapify: swapping ${arr[largest]} ↔ ${arr[root]}`, 4);
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n/2)-1; i >= 0; i--) {
    const s = makeStates(n);
    s[i] = 'pivot';
    push(s, `Building max-heap at node ${i}`, 0);
    heapify(n, i);
  }

  for (let i = n-1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; swaps++;
    sortedFrom.add(i);
    const s = makeStates(n);
    sortedFrom.forEach(k => { s[k] = 'sorted'; });
    s[0] = 'swap';
    push(s, `Extracted max ${arr[i]}, placed at position ${i}`, 2);
    heapify(i, 0);
  }
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓', 4);
  return frames;
}

export function runCountingSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], a: number[], desc: string) =>
    frames.push({ array: [...a], states, comparisons, swaps, description: desc });

  push(makeStates(n), arr, 'Starting Counting Sort');
  const max = Math.max(...arr);
  const count = Array(max + 1).fill(0);
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    const s = makeStates(n); s[i] = 'compare';
    push(s, arr, `Counting element ${arr[i]} at index ${i}`);
  }
  const output: number[] = [];
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j < count[i]; j++) output.push(i);
  }
  for (let i = 0; i < n; i++) {
    arr[i] = output[i]; swaps++;
    const s = makeStates(n);
    for (let k = 0; k <= i; k++) s[k] = 'sorted';
    s[i] = 'swap';
    push(s, arr, `Placing ${arr[i]} at position ${i}`);
  }
  push(makeStates(n, 'sorted'), arr, 'Array fully sorted! ✓');
  return frames;
}

export function runRadixSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], a: number[], desc: string, pass?: number) =>
    frames.push({ array: [...a], states, comparisons, swaps, description: desc, pass });

  push(makeStates(n), arr, 'Starting Radix Sort');
  const max = Math.max(...arr);

  function countingSortByDigit(exp: number, pass: number) {
    const output = Array(n).fill(0);
    const count = Array(10).fill(0);
    for (let i = 0; i < n; i++) { count[Math.floor(arr[i]/exp)%10]++; comparisons++; }
    for (let i = 1; i < 10; i++) count[i] += count[i-1];
    for (let i = n-1; i >= 0; i--) { output[--count[Math.floor(arr[i]/exp)%10]] = arr[i]; swaps++; }
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      const s = makeStates(n); s[i] = 'merge';
      push(s, [...arr], `Digit pass ${pass}: placing ${arr[i]}`, pass);
    }
  }

  let pass = 1;
  for (let exp = 1; Math.floor(max/exp) > 0; exp *= 10) {
    countingSortByDigit(exp, pass++);
  }
  push(makeStates(n, 'sorted'), arr, 'Array fully sorted! ✓');
  return frames;
}

export function runBucketSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const push = (states: BarState[], a: number[], desc: string) =>
    frames.push({ array: [...a], states, comparisons, swaps, description: desc });

  push(makeStates(n), arr, 'Starting Bucket Sort');
  const max = Math.max(...arr), min = Math.min(...arr);
  const range = max - min + 1;
  const bucketCount = Math.ceil(Math.sqrt(n));
  const buckets: number[][] = Array.from({length: bucketCount}, () => []);

  for (let i = 0; i < n; i++) {
    const bi = Math.min(Math.floor(((arr[i]-min)/range)*bucketCount), bucketCount-1);
    buckets[bi].push(arr[i]);
    const s = makeStates(n); s[i] = 'compare';
    push(s, arr, `Placing ${arr[i]} into bucket ${bi}`);
  }

  let idx = 0;
  for (let b = 0; b < bucketCount; b++) {
    buckets[b].sort((a,z) => { comparisons++; return a-z; });
    for (const val of buckets[b]) {
      arr[idx] = val; swaps++;
      const s = makeStates(n);
      for (let k = 0; k < idx; k++) s[k] = 'sorted';
      s[idx] = 'swap';
      push(s, [...arr], `Placing ${val} from bucket ${b} at position ${idx}`);
      idx++;
    }
  }
  push(makeStates(n, 'sorted'), arr, 'Array fully sorted! ✓');
  return frames;
}

export function runShellSort(input: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  let pass = 0;
  const push = (states: BarState[], desc: string) =>
    frames.push({ array: [...arr], states, comparisons, swaps, description: desc, pass });

  push(makeStates(n), 'Starting Shell Sort');
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    pass++;
    for (let i = gap; i < n; i++) {
      const temp = arr[i]; let j = i;
      while (j >= gap && arr[j-gap] > temp) {
        comparisons++;
        const s = makeStates(n); s[j] = 'compare'; s[j-gap] = 'swap';
        arr[j] = arr[j-gap]; swaps++;
        push(s, `Gap=${gap}: moving ${arr[j]} right`);
        j -= gap;
      }
      arr[j] = temp;
      const s = makeStates(n); s[j] = 'sorted';
      push(s, `Gap=${gap}: inserted ${temp} at position ${j}`);
    }
  }
  push(makeStates(n, 'sorted'), 'Array fully sorted! ✓');
  return frames;
}

export const algorithmRunners: Record<AlgorithmId, (arr: number[]) => SortFrame[]> = {
  bubble: runBubbleSort,
  selection: runSelectionSort,
  insertion: runInsertionSort,
  merge: runMergeSort,
  quick: runQuickSort,
  heap: runHeapSort,
  counting: runCountingSort,
  radix: runRadixSort,
  bucket: runBucketSort,
  shell: runShellSort,
};
