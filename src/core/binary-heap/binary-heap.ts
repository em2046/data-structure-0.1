import { PriorityQueue } from "../priority-queue";
import { lessThan } from "../comparable";
import { assert, MAX_SAFE_COMPLETE_BINARY_TREE_HEIGHT } from "../../shared";

/***
 * Reference
 * https://github.com/rust-lang/rust/blob/53cb7b09b00cbea8754ffb78e7e3cb521cb8af4b/library/alloc/src/collections/binary_heap.rs
 */

function hasParent(index: number): boolean {
  return index > 0;
}

function hasLeftChild(len: number, index: number): boolean {
  return getLeftChildIndex(index) < len;
}

function hasRightChild(len: number, index: number): boolean {
  return getRightChildIndex(index) < len;
}

function getParentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

function getLeftChildIndex(index: number): number {
  return index * 2 + 1;
}

function getRightChildIndex(index: number): number {
  return (index + 1) * 2;
}

/**
 * @public
 * A priority queue implemented with a binary heap.
 *
 * This will be a min-heap.
 */
export class BinaryHeap<T> implements PriorityQueue<T> {
  private elements: T[] = [];

  /**
   * Get the length of the binary heap.
   */
  get size(): number {
    return this.elements.length;
  }

  /**
   * Drops all elements form the binary heap.
   */
  clear(): void {
    this.elements = [];
  }

  /**
   * Returns the minimum element in the binary heap,
   * or `undefined` if it is empty.
   */
  peek(): T | undefined {
    return this.elements[0];
  }

  /**
   * Pushes a new element onto the binary heap.
   *
   * @param newElement - The new element to push onto the binary heap.
   */
  push(newElement: T): this {
    const elements = this.elements;

    elements.push(newElement);
    this.percolateUp(elements.length - 1);

    return this;
  }

  /**
   * Removes the minimum element form the binary heap and returns it,
   * or `undefined` if it is empty.
   */
  pop(): T | undefined {
    const elements = this.elements;
    const first = elements[0];

    if (elements.length <= 0) {
      return undefined;
    }

    const element = elements.pop();

    assert(element !== undefined);

    if (elements.length <= 0) {
      return first;
    }

    elements[0] = element;
    this.percolateDown(elements.length, 0);

    return first;
  }

  private percolateUp(index: number): void {
    const elements = this.elements;

    while (hasParent(index)) {
      const parentIndex = getParentIndex(index);

      const current = elements[index];
      const parent = elements[parentIndex];

      if (!lessThan(current, parent)) {
        break;
      }

      [elements[index], elements[parentIndex]] = [
        elements[parentIndex],
        elements[index],
      ];
      index = parentIndex;
    }
  }

  private percolateDown(len: number, index: number): void {
    const elements = this.elements;

    for (let i = 0; i < MAX_SAFE_COMPLETE_BINARY_TREE_HEIGHT; i++) {
      let min = elements[index];
      let minIndex = index;

      if (hasLeftChild(len, index)) {
        const leftChildIndex = getLeftChildIndex(index);
        const leftChild = elements[leftChildIndex];

        if (lessThan(leftChild, min)) {
          min = leftChild;
          minIndex = leftChildIndex;
        }
      }
      if (hasRightChild(len, index)) {
        const rightChildIndex = getRightChildIndex(index);
        const rightChild = elements[rightChildIndex];

        if (lessThan(rightChild, min)) {
          min = rightChild;
          minIndex = rightChildIndex;
        }
      }

      if (minIndex === index) {
        break;
      }

      [elements[index], elements[minIndex]] = [
        elements[minIndex],
        elements[index],
      ];
      index = minIndex;
    }
  }
}
