import { PriorityQueue } from "../abstract/priority-queue";
import { lessThan } from "../abstract/comparable";

function hasParent(index: number) {
  return index > 0;
}

function hasLeftChild(len: number, index: number) {
  return getLeftChildIndex(index) < len;
}

function hasRightChild(len: number, index: number) {
  return getRightChildIndex(index) < len;
}

function getParentIndex(index: number) {
  return Math.floor((index - 1) / 2);
}

function getLeftChildIndex(index: number) {
  return index * 2 + 1;
}

function getRightChildIndex(index: number) {
  return (index + 1) * 2;
}

export class BinaryHeap<T> implements PriorityQueue<T> {
  elements: T[] = [];

  percolateUp(index: number) {
    let elements = this.elements;

    while (hasParent(index)) {
      let parentIndex = getParentIndex(index);

      let current = elements[index];
      let parent = elements[parentIndex];

      if (lessThan(current, parent)) {
        [elements[index], elements[parentIndex]] = [
          elements[parentIndex],
          elements[index],
        ];
      }

      index = parentIndex;
    }
  }

  percolateDown(len: number, index: number) {
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

      if (minIndex != index) {
        [elements[index], elements[minIndex]] = [
          elements[minIndex],
          elements[index],
        ];
      } else {
        break;
      }

      index = minIndex;
    }
  }

  clear(): void {
    this.elements = [];
  }

  peek(): T {
    return this.elements[0];
  }

  pop(): T {
    let elements = this.elements;
    let first = elements[0];

    elements[0] = elements.pop();
    this.percolateDown(elements.length, 0);

    return first;
  }

  push(value: T): void {
    let elements = this.elements;

    elements.push(value);
    this.percolateUp(elements.length - 1);
  }
}
