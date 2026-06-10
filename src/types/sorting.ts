export type BarState = 'default' | 'compare' | 'swap' | 'sorted' | 'pivot' | 'merge';

export interface SortFrame {
  array: number[];
  states: BarState[];
  comparisons: number;
  swaps: number;
  description: string;
  pass?: number;
  activeLine?: number;
}

export type AlgorithmId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'counting' | 'radix' | 'bucket' | 'shell';

export interface AlgorithmMeta {
  id: AlgorithmId;
  name: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  color: string;
  description: string;
  pseudocode: string[];
}
