import { PriorityQueue } from "../abstract/priority-queue";
import { lessThan } from "../abstract/comparable";

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

  clear(): void {
    this.elements = [];
  }

  peek(): T | undefined {
    return this.elements[0];
  }

  pop(): T | undefined {
    let elements = this.elements;
    let first = elements[0];

    if (!elements.length) {
      return undefined;
    }

    elements[0] = elements.pop()!;
    this.percolateDown(elements.length, 0);

    return first;
  }

  push(value: T): void {
    let elements = this.elements;

    elements.push(value);
    this.percolateUp(elements.length - 1);
  }

  len(): number {
    return this.elements.length;
  }

  private percolateUp(index: number): void {
    let elements = this.elements;

    while (hasParent(index)) {
      let parentIndex = getParentIndex(index);

      let current = elements[index];
      let parent = elements[parentIndex];

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
    let elements = this.elements;

    while (true) {
      let min = elements[index];
      let minIndex = index;

      if (hasLeftChild(len, index)) {
        let leftChildIndex = getLeftChildIndex(index);
        let leftChild = elements[leftChildIndex];

        if (lessThan(leftChild, min)) {
          min = leftChild;
          minIndex = leftChildIndex;
        }
      }
      if (hasRightChild(len, index)) {
        let rightChildIndex = getRightChildIndex(index);
        let rightChild = elements[rightChildIndex];

        if (lessThan(rightChild, min)) {
          min = rightChild;
          minIndex = rightChildIndex;
        }
      }

      if (minIndex == index) {
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
