import { assert } from "../shared/assert";

export enum Direction {
  UNKNOWN = "unknown",
  ROOT = "root",
  LEFT = "left",
  RIGHT = "right",
}

export enum NodeColor {
  RED = "red",
  BLACK = "black",
}

export function hasLeftChild<T>(node: BinaryTreeNode<T>): boolean {
  return node.leftChild !== null;
}

export function hasRightChild<T>(node: BinaryTreeNode<T>): boolean {
  return node.rightChild !== null;
}

export function isRoot<T>(node: BinaryTreeNode<T>): boolean {
  return node.parent === null;
}

export function isLeftChild<T>(node: BinaryTreeNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.leftChild;
}

export function isRightChild<T>(node: BinaryTreeNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.rightChild;
}

export function isBlack<T>(node: BinaryTreeNode<T> | null): boolean {
  if (node === null) {
    return true;
  }

  return node.color === NodeColor.BLACK;
}

export function isRed<T>(node: BinaryTreeNode<T> | null): boolean {
  return !isBlack(node);
}

export function getUncle<T>(node: BinaryTreeNode<T>): BinaryTreeNode<T> | null {
  const parent = node.parent;

  assert(parent !== null);

  const grandparent = parent.parent;

  assert(grandparent !== null);

  if (isLeftChild(parent)) {
    return grandparent.rightChild;
  } else {
    return grandparent.leftChild;
  }
}

export function getDirection<T>(node: BinaryTreeNode<T>): Direction {
  if (isRoot(node)) {
    return Direction.ROOT;
  }

  if (isLeftChild(node)) {
    return Direction.LEFT;
  } else {
    return Direction.RIGHT;
  }
}

export function getHeight<T>(node: BinaryTreeNode<T> | null): number {
  if (node !== null) {
    return node.height;
  }

  return -1;
}

export function isBalanced<T>(node: BinaryTreeNode<T>): boolean {
  const leftHeight = getHeight(node.leftChild);
  const rightHeight = getHeight(node.rightChild);

  return (
    leftHeight === rightHeight &&
    node.height === (isRed(node) ? leftHeight : leftHeight + 1)
  );
}

function saveLeftBranch<T>(
  node: BinaryTreeNode<T> | null,
  stack: Array<BinaryTreeNode<T>>
): void {
  while (node !== null) {
    stack.push(node);
    node = node.leftChild;
  }
}

export class BinaryTreeNode<T> {
  data: T;
  parent: BinaryTreeNode<T> | null = null;
  leftChild: BinaryTreeNode<T> | null = null;
  rightChild: BinaryTreeNode<T> | null = null;
  height = 0;
  color: NodeColor = NodeColor.RED;

  constructor(
    value: T,
    parent: BinaryTreeNode<T> | null = null,
    leftChild: BinaryTreeNode<T> | null = null,
    rightChild: BinaryTreeNode<T> | null = null,
    height = 0,
    color = NodeColor.RED
  ) {
    this.data = value;
    this.parent = parent;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.height = height;
    this.color = color;
  }

  getNext(): BinaryTreeNode<T> | null {
    let node: BinaryTreeNode<T> | null;

    if (this.rightChild !== null) {
      node = this.rightChild;

      while (hasLeftChild(node)) {
        assert(node.leftChild !== null);

        node = node.leftChild;
      }
    } else {
      node = this;

      while (isRightChild(node)) {
        assert(node.parent !== null);

        node = node.parent;
      }

      node = node.parent;
    }

    return node;
  }

  traverseLevel(visit: (value: T) => void): void {
    const queue: Array<BinaryTreeNode<T>> = [];
    queue.push(this);

    while (queue.length > 0) {
      const node = queue.shift();

      assert(node !== undefined);

      visit(node.data);

      if (hasLeftChild(node)) {
        assert(node.leftChild !== null);

        queue.push(node.leftChild);
      }

      if (hasRightChild(node)) {
        assert(node.rightChild !== null);

        queue.push(node.rightChild);
      }
    }
  }

  traverseIn(visit: (value: T) => void): void {
    let node: BinaryTreeNode<T> | null;
    const stack: Array<BinaryTreeNode<T>> = [];

    node = this;

    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      saveLeftBranch(node, stack);

      if (stack.length === 0) {
        break;
      }

      const element = stack.pop();

      assert(element !== undefined);

      node = element;
      visit(node.data);
      node = node.rightChild;
    }
  }
}
