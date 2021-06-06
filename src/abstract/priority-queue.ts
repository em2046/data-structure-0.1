export interface PriorityQueue<T> {
  push: (value: T) => void;
  pop: () => T;
  peek: () => T;
  clear: () => void;
}
