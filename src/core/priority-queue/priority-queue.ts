/***
 * Reference:
 * https://github.com/rust-lang/rust/blob/53cb7b09b00cbea8754ffb78e7e3cb521cb8af4b/library/alloc/src/collections/binary_heap.rs
 */

/**
 * @public
 * A partial ordered, minimum-access collection.
 */
export interface PriorityQueue<T> {
  /**
   * Indicating the length of the priority queue.
   */
  size: number;

  /**
   * Drops all elements form the priority queue.
   */
  clear(): void;

  /**
   * Returns the minimum element in the priority queue,
   * or `undefined` if it is empty.
   */
  peek(): T | undefined;

  /**
   * Pushes a new element onto the priority queue.
   *
   * @param newElement - The new element to push onto the priority queue.
   */
  push(newElement: T): this;

  /**
   * Removes the minimum element form the priority queue and returns it,
   * or `undefined` if it is empty.
   */
  pop(): T | undefined;
}
