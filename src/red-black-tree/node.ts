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

  return node === node.parent.leftChild;
}

export function isRightChild<T>(node: TreeNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  return node === node.parent.rightChild;
}

export function isBlack<T>(node: TreeNode<T>): boolean {
  if (node === null) {
    return true;
  }

  return node.color === NodeColor.BLACK;
}

export function isRed<T>(node: TreeNode<T>): boolean {
  return !isBlack(node);
}

export function getHeight<T>(node: TreeNode<T>): number {
  if (node !== null) {
    return node.height;
  }

  return -1;
}

export function getUncle<T>(node: TreeNode<T>): TreeNode<T> {
  let parent = node.parent;
  let grandparent = parent.parent;

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
  let leftHeight = getHeight(node.leftChild);
  let rightHeight = getHeight(node.rightChild);

  return (
    leftHeight === rightHeight &&
    node.height === (isRed(node) ? leftHeight : leftHeight + 1)
  );
}

function saveLeftBranch<T>(node: TreeNode<T>, stack: Array<TreeNode<T>>) {
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
  height: number = 0;
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

  traverseLevel(visit: (value: T) => void) {
    let queue: Array<TreeNode<T>> = [];
    queue.push(this);

    while (queue.length) {
      let node = queue.shift();
      visit(node.data);

      if (hasLeftChild(node)) {
        queue.push(node.leftChild);
      }

      if (hasRightChild(node)) {
        queue.push(node.rightChild);
      }
    }
  }

  getNext() {
    let node: TreeNode<T> = this;

    if (this.rightChild !== null) {
      node = this.rightChild;

      while (hasLeftChild(node)) {
        node = node.leftChild;
      }
    } else {
      while (isRightChild(node)) {
        node = node.parent;
      }

      node = node.parent;
    }

    return node;
  }

  traverseIn(visit: (value: T) => void) {
    let node: TreeNode<T> = this;
    let stack: Array<TreeNode<T>> = [];

    while (true) {
      saveLeftBranch(node, stack);

      if (stack.length === 0) {
        break;
      }

      node = stack.pop();
      visit(node.data);
      node = node.rightChild;
    }
  }
}
