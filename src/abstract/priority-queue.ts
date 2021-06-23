export interface PriorityQueue<T> {
  push(value: T): this;

  pop(): T | undefined;

  peek(): T | undefined;

  clear(): void;

  size: number;
}
