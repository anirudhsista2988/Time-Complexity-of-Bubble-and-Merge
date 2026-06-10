export const genArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
