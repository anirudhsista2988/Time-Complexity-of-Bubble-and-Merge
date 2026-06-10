import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';

const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

type Lang = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'c';

const CODE: Partial<Record<AlgorithmId, Partial<Record<Lang, string>>>> = {
  bubble: {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  merge: {
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
public static void merge(int[] arr, int l, int m, int r) {
    int[] tmp = Arrays.copyOfRange(arr, l, r + 1);
    int i = 0, j = m - l + 1, k = l;
    while (i <= m - l && j <= r - l)
        arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= m - l) arr[k++] = tmp[i++];
    while (j <= r - l) arr[k++] = tmp[j++];
}`,
    cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> tmp(arr.begin()+l, arr.begin()+r+1);
    int i=0, j=m-l+1, k=l;
    while(i<=m-l && j<=r-l)
        arr[k++] = tmp[i]<=tmp[j] ? tmp[i++] : tmp[j++];
    while(i<=m-l) arr[k++]=tmp[i++];
    while(j<=r-l) arr[k++]=tmp[j++];
}
void mergeSort(vector<int>& arr, int l, int r) {
    if(l<r) { int m=(l+r)/2; mergeSort(arr,l,m); mergeSort(arr,m+1,r); merge(arr,l,m,r); }
}`,
    c: `void merge(int arr[], int l, int m, int r) {
    int n1=m-l+1, n2=r-m;
    int L[n1], R[n2];
    for(int i=0;i<n1;i++) L[i]=arr[l+i];
    for(int j=0;j<n2;j++) R[j]=arr[m+1+j];
    int i=0,j=0,k=l;
    while(i<n1&&j<n2) arr[k++]= L[i]<=R[j]?L[i++]:R[j++];
    while(i<n1) arr[k++]=L[i++];
    while(j<n2) arr[k++]=R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if(l<r){int m=(l+r)/2;mergeSort(arr,l,m);mergeSort(arr,m+1,r);merge(arr,l,m,r);}
}`,
  },
  quick: {
    python: `import random

def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot_idx = random.randint(lo, hi)
    arr[pivot_idx], arr[hi] = arr[hi], arr[pivot_idx]
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`,
    javascript: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}

function partition(arr, lo, hi) {
  const pivotIdx = Math.floor(Math.random()*(hi-lo+1))+lo;
  [arr[pivotIdx], arr[hi]] = [arr[hi], arr[pivotIdx]];
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) { i++; [arr[i],arr[j]]=[arr[j],arr[i]]; }
  }
  [arr[i+1],arr[hi]]=[arr[hi],arr[i+1]];
  return i + 1;
}`,
    typescript: `function quickSort(arr: number[], lo = 0, hi = arr.length-1): number[] {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}
function partition(arr: number[], lo: number, hi: number): number {
  const pivot = arr[hi]; let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) { i++; [arr[i],arr[j]]=[arr[j],arr[i]]; }
  }
  [arr[i+1],arr[hi]]=[arr[hi],arr[i+1]];
  return i + 1;
}`,
    java: `public static void quickSort(int[] arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}
static int partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) { i++; int t=arr[i];arr[i]=arr[j];arr[j]=t; }
    }
    int t=arr[i+1];arr[i+1]=arr[hi];arr[hi]=t;
    return i + 1;
}`,
    cpp: `int partition(vector<int>& arr, int lo, int hi) {
    int pivot=arr[hi], i=lo-1;
    for(int j=lo;j<hi;j++) if(arr[j]<=pivot) swap(arr[++i],arr[j]);
    swap(arr[i+1],arr[hi]);
    return i+1;
}
void quickSort(vector<int>& arr, int lo, int hi) {
    if(lo<hi){int p=partition(arr,lo,hi);quickSort(arr,lo,p-1);quickSort(arr,p+1,hi);}
}`,
    c: `int partition(int arr[], int lo, int hi) {
    int pivot=arr[hi], i=lo-1, t;
    for(int j=lo;j<hi;j++) if(arr[j]<=pivot){i++;t=arr[i];arr[i]=arr[j];arr[j]=t;}
    t=arr[i+1];arr[i+1]=arr[hi];arr[hi]=t;
    return i+1;
}
void quickSort(int arr[], int lo, int hi) {
    if(lo<hi){int p=partition(arr,lo,hi);quickSort(arr,lo,p-1);quickSort(arr,p+1,hi);}
}`,
  },
};

// Fill remaining algos with Python placeholder for brevity
(Object.keys(algorithmMeta) as AlgorithmId[]).forEach(id => {
  if (!CODE[id]) {
    CODE[id] = {
      python: `# ${algorithmMeta[id].name}\n# See Learning Center for full explanation\n\ndef ${id.replace('-','_')}_sort(arr):\n    # Implementation here\n    pass`,
      javascript: `// ${algorithmMeta[id].name}\nfunction ${id}Sort(arr) {\n  // Implementation\n  return arr;\n}`,
      typescript: `// ${algorithmMeta[id].name}\nfunction ${id}Sort(arr: number[]): number[] {\n  // Implementation\n  return arr;\n}`,
      java: `// ${algorithmMeta[id].name}\npublic static void ${id}Sort(int[] arr) {\n    // Implementation\n}`,
      cpp: `// ${algorithmMeta[id].name}\nvoid ${id}Sort(vector<int>& arr) {\n    // Implementation\n}`,
      c: `/* ${algorithmMeta[id].name} */\nvoid ${id}_sort(int arr[], int n) {\n    /* Implementation */\n}`,
    };
  }
});

const LANGS: { id: Lang; label: string }[] = [
  { id:'python',     label:'Python'     },
  { id:'javascript', label:'JavaScript' },
  { id:'typescript', label:'TypeScript' },
  { id:'java',       label:'Java'       },
  { id:'cpp',        label:'C++'        },
  { id:'c',          label:'C'          },
];

function CopyButton({text}: {text:string}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-titanium hover:text-white hover:border-white/20 transition-all">
      {copied ? <><Check size={12} className="text-green-400" />Copied!</> : <><Copy size={12} />Copy</>}
    </button>
  );
}

export const CodeStudio: React.FC = () => {
  const [algo, setAlgo] = useState<AlgorithmId>('bubble');
  const [lang, setLang] = useState<Lang>('python');

  const code = CODE[algo]?.[lang] ?? '// Code not available for this combination.';

  return (
    <div className="min-h-screen pt-14 flex">
      {/* Algo sidebar */}
      <div className="w-52 border-r border-white/5 glass shrink-0 overflow-y-auto no-scrollbar">
        <div className="p-4 border-b border-white/5">
          <p className="text-xs text-gold-royal font-bold uppercase tracking-widest">Code Studio</p>
        </div>
        <div className="p-2">
          {ALGO_IDS.map(id => {
            const m = algorithmMeta[id];
            return (
              <button key={id} onClick={() => setAlgo(id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1 flex items-center gap-2
                  ${algo===id ? 'text-white' : 'text-titanium hover:text-white hover:bg-white/5'}`}
                style={algo===id ? {background:`${m.color}15`, borderLeft:`2px solid ${m.color}`} : {}}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{background:m.color}} />
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="glass border-b border-white/5 px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-gold-royal" />
            <span className="text-white font-semibold">{algorithmMeta[algo].name}</span>
          </div>
          <div className="flex gap-1 ml-4">
            {LANGS.map(({id, label}) => (
              <button key={id} onClick={() => setLang(id)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${lang===id ? 'bg-gold-royal/15 text-gold-royal border border-gold-royal/30' : 'text-titanium hover:text-white hover:bg-white/5'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <CopyButton text={code} />
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language={lang === 'cpp' ? 'cpp' : lang === 'c' ? 'c' : lang}
            style={atomDark}
            showLineNumbers
            lineNumberStyle={{ color: '#3A3A3C', fontSize: '11px', paddingRight: '16px' }}
            customStyle={{
              margin: 0, padding: '24px', background: '#080808',
              fontSize: '13px', lineHeight: '1.7', height: '100%',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
