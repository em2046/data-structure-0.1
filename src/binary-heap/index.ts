import { PriorityQueue } from "../abstract/priority-queue";
import { lessThan } from "../abstract/comparable";
import { MAX_SAFE_COMPLETE_BINARY_TREE_HEIGHT } from "../shared/constants";
import { assert } from "../shared/assert";

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

export class BinaryHeap<T> implements PriorityQueue<T> {
  private elements: T[] = [];

  len(): number {
    return this.elements.length;
  }

  clear(): void {
    this.elements = [];
  }

  peek(): T | undefined {
    return this.elements[0];
  }

  push(value: T): void {
    const elements = this.elements;

    elements.push(value);
    this.percolateUp(elements.length - 1);
  }

  pop(): T | undefined {
    const elements = this.elements;
    const first = elements[0];

    if (elements.length <= 0) {
      return undefined;
    }

    const element = elements.pop();

    assert(element !== undefined);

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
