import { assert } from "../../shared";

export type Node<T> = BinaryTreeNode<T>;

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

export function hasLeftChild<T>(node: Node<T>): boolean {
  return node.leftChild !== null;
}

export function hasRightChild<T>(node: Node<T>): boolean {
  return node.rightChild !== null;
}

export function isRoot<T>(node: Node<T>): boolean {
  return node.parent === null;
}

export function isLeftChild<T>(node: Node<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.leftChild;
}

export function isRightChild<T>(node: Node<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.rightChild;
}

export function isBlack<T>(node: Node<T> | null): boolean {
  if (node === null) {
    return true;
  }

  return node.color === NodeColor.BLACK;
}

export function isRed<T>(node: Node<T> | null): boolean {
  return !isBlack(node);
}

export function getUncle<T>(node: Node<T>): Node<T> | null {
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

export function getDirection<T>(node: Node<T>): Direction {
  if (isRoot(node)) {
    return Direction.ROOT;
  }

  if (isLeftChild(node)) {
    return Direction.LEFT;
  } else {
    return Direction.RIGHT;
  }
}

export function getHeight<T>(node: Node<T> | null): number {
  if (node !== null) {
    return node.height;
  }

  return -1;
}

export function isBalanced<T>(node: Node<T>): boolean {
  const leftHeight = getHeight(node.leftChild);
  const rightHeight = getHeight(node.rightChild);
  const expectHeight = isRed(node) ? leftHeight : leftHeight + 1;

  return leftHeight === rightHeight && node.height === expectHeight;
}

function saveLeftBranch<T>(node: Node<T> | null, stack: Array<Node<T>>): void {
  while (node !== null) {
    stack.push(node);
    node = node.leftChild;
  }
}

export class BinaryTreeNode<T> {
  element: T;
  parent: Node<T> | null = null;
  leftChild: Node<T> | null = null;
  rightChild: Node<T> | null = null;
  height = 0;
  color: NodeColor = NodeColor.RED;

  constructor(
    element: T,
    parent: Node<T> | null = null,
    leftChild: Node<T> | null = null,
    rightChild: Node<T> | null = null,
    height = 0,
    color = NodeColor.RED
  ) {
    this.element = element;
    this.parent = parent;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.height = height;
    this.color = color;
  }

  getNext(): Node<T> | null {
    let node: Node<T> | null;

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

  levelTraversal(visit: (element: T) => void): void {
    const queue: Array<Node<T>> = [];

    queue.push(this);

    while (queue.length > 0) {
      const node = queue.shift();

      assert(node !== undefined);

      visit(node.element);

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

  inorderTraversal(visit: (element: T) => void): void {
    let node: Node<T> | null;
    const stack: Array<Node<T>> = [];

    node = this;

    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      saveLeftBranch(node, stack);

      if (stack.length === 0) {
        break;
      }

      const element = stack.pop();

      assert(element !== undefined);

      node = element;
      visit(node.element);
      node = node.rightChild;
    }
  }
}
