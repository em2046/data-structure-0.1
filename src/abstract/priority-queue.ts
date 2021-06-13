export interface PriorityQueue<T> {
  push: (value: T) => void;
  pop: () => T | undefined;
  peek: () => T | undefined;
  clear: () => void;
  len: () => number;
}
