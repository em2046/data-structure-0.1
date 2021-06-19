import { MAX_SAFE_RED_BLACK_TREE_HEIGHT } from "../shared/constants";

export enum NodeColor {
  RED = "red",
  BLACK = "black",
}

export enum Direction {
  ROOT = "root",
  LEFT = "left",
  RIGHT = "right",
}

export function hasLeftChild<T>(node: TreeNode<T>): boolean {
  return node.leftChild !== null;
}

export function hasRightChild<T>(node: TreeNode<T>): boolean {
  return node.rightChild !== null;
}

export function isRoot<T>(node: TreeNode<T>): boolean {
  return node.parent === null;
}

export function isLeftChild<T>(node: TreeNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  if (parent === null) {
    throw new Error("The parent must exist");
  }

  return node === parent.leftChild;
}

export function isRightChild<T>(node: TreeNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  if (parent === null) {
    throw new Error("The parent must exist");
  }

  return node === parent.rightChild;
}

export function isBlack<T>(node: TreeNode<T> | null): boolean {
  if (node === null) {
    return true;
  }

  return node.color === NodeColor.BLACK;
}

export function isRed<T>(node: TreeNode<T> | null): boolean {
  return !isBlack(node);
}

export function getHeight<T>(node: TreeNode<T> | null): number {
  if (node !== null) {
    return node.height;
  }

  return -1;
}

export function getUncle<T>(node: TreeNode<T>): TreeNode<T> | null {
  const parent = node.parent;

  if (parent === null) {
    throw new Error("The parent must exist");
  }

  const grandparent = parent.parent;

  if (grandparent === null) {
    throw new Error("The grandparent must exist");
  }

  if (isLeftChild(parent)) {
    return grandparent.rightChild;
  } else {
    return grandparent.leftChild;
  }
}

export function getDirection<T>(node: TreeNode<T>): Direction {
  if (isRoot(node)) {
    return Direction.ROOT;
  }

  if (isLeftChild(node)) {
    return Direction.LEFT;
  } else {
    return Direction.RIGHT;
  }
}

export function balanced<T>(node: TreeNode<T>): boolean {
  const leftHeight = getHeight(node.leftChild);
  const rightHeight = getHeight(node.rightChild);

  return (
    leftHeight === rightHeight &&
    node.height === (isRed(node) ? leftHeight : leftHeight + 1)
  );
}

function saveLeftBranch<T>(
  node: TreeNode<T> | null,
  stack: Array<TreeNode<T>>
): void {
  while (node != null) {
    stack.push(node);
    node = node.leftChild;
  }
}

export class TreeNode<T> {
  data: T;
  parent: TreeNode<T> | null = null;
  leftChild: TreeNode<T> | null = null;
  rightChild: TreeNode<T> | null = null;
  height = 0;
  color: NodeColor = NodeColor.RED;

  constructor(
    value: T,
    parent: TreeNode<T> | null = null,
    leftChild: TreeNode<T> | null = null,
    rightChild: TreeNode<T> | null = null,
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

  traverseLevel(visit: (value: T) => void): void {
    const queue: Array<TreeNode<T>> = [];
    queue.push(this);

    while (queue.length > 0) {
      const node = queue.shift();

      if (node === undefined) {
        throw new Error("The node must exist");
      }

      visit(node.data);

      if (hasLeftChild(node)) {
        if (node.leftChild === null) {
          throw new Error("The left child must exist");
        }

        queue.push(node.leftChild);
      }

      if (hasRightChild(node)) {
        if (node.rightChild === null) {
          throw new Error("The right child must exist");
        }

        queue.push(node.rightChild);
      }
    }
  }

  getNext(): TreeNode<T> {
    let node: TreeNode<T>;

    if (this.rightChild !== null) {
      node = this.rightChild;

      while (hasLeftChild(node)) {
        if (node.leftChild === null) {
          throw new Error("The left child must exist");
        }

        node = node.leftChild;
      }
    } else {
      node = this;

      while (isRightChild(node)) {
        if (node.parent === null) {
          throw new Error("The parent must exist");
        }

        node = node.parent;
      }

      if (node.parent === null) {
        throw new Error("The parent must exist");
      }

      node = node.parent;
    }

    return node;
  }

  traverseIn(visit: (value: T) => void): void {
    let node: TreeNode<T> | null;
    const stack: Array<TreeNode<T>> = [];

    node = this;

    for (let i = 0; i < MAX_SAFE_RED_BLACK_TREE_HEIGHT; i++) {
      saveLeftBranch(node, stack);

      if (stack.length === 0) {
        break;
      }

      const element = stack.pop();

      if (element === undefined) {
        throw new Error("The element must exist");
      }

      node = element;
      visit(node.data);
      node = node.rightChild;
    }
  }
}
