/***
 * Reference
 * https://github.com/rust-lang/rust/blob/53cb7b09b00cbea8754ffb78e7e3cb521cb8af4b/library/alloc/src/collections/binary_heap.rs
 */

/**
 * @public
 */
export interface PriorityQueue<T> {
  /**
   * Pushes an item onto the priority queue.
   *
   * @param value - The new item to push onto the priority queue.
   */
  push(value: T): this;

  /**
   * Removes the minimum item form the priority queue and returns it,
   * or `undefined` if it is empty.
   */
  pop(): T | undefined;

  /**
   * Returns the minimum item in the priority queue,
   * or `undefined` if it is empty.
   */
  peek(): T | undefined;

  /**
   * Drops all items form the priority queue.
   */
  clear(): void;

  /**
   * Indicate the length of the priority queue.
   */
  size: number;
}
