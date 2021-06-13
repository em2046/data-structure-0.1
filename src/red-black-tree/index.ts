import {
  balanced,
  Direction,
  getDirection,
  getHeight,
  getUncle,
  hasLeftChild,
  hasRightChild,
  isBlack,
  isLeftChild,
  isRed,
  isRightChild,
  isRoot,
  NodeColor,
  TreeNode,
} from "./node";
import { lessThan } from "../abstract/comparable";

export class RedBlackTree<T> {
  private root: TreeNode<T> | null = null;
  private size: number = 0;
  private hot: TreeNode<T> | null = null;
  private direction: Direction = Direction.ROOT;

  add(value: T): TreeNode<T> {
    let oldNode = this.get(value);

    if (oldNode) {
      return oldNode;
    }

    if (this.direction === Direction.ROOT) {
      return this.insertAsRoot(value);
    }

    let hot = this.hot!;
    let node = new TreeNode(value, hot, null, null, -1);

    if (this.direction === Direction.LEFT) {
      hot.leftChild = node;
    } else if (this.direction === Direction.RIGHT) {
      hot.rightChild = node;
    }

    this.size += 1;
    this.solveDoubleRed(node);

    return node;
  }

  delete(value: T): boolean {
    let oldNode = this.get(value);

    if (!oldNode) {
      return false;
    }

    let node = this.deleteImpl(oldNode);
    this.size -= 1;

    if (this.size === 0) {
      return true;
    }

    let hot = this.hot;

    if (hot === null) {
      let root = this.root!;
      root.color = NodeColor.BLACK;
      this.updateHeight(root);
      return true;
    }

    if (balanced(hot)) {
      return true;
    }

    if (isRed(node)) {
      node!.color = NodeColor.BLACK;
      node!.height += 1;
      return true;
    }

    this.solveDoubleBlack(node);

    return true;
  }

  get(value: T): TreeNode<T> | undefined {
    let root = this.root;

    if (root === null || value === root.data) {
      this.hot = null;
      this.direction = Direction.ROOT;

      if (root === null) {
        return undefined;
      }

      return root;
    }

    this.hot = root;
    let current: TreeNode<T> | null = root;

    while (true) {
      if (lessThan(value, current.data)) {
        this.direction = Direction.LEFT;
        current = current.leftChild;
      } else {
        this.direction = Direction.RIGHT;
        current = current.rightChild;
      }

      if (current === null) {
        return undefined;
      }

      if (value === current.data) {
        return current;
      }

      this.hot = current;
    }
  }

  traverseLevel(visit: (value: T) => void): void {
    let root = this.root;

    if (root !== null) {
      root.traverseLevel(visit);
    }
  }

  traverseIn(visit: (value: T) => void): void {
    let root = this.root;

    if (root !== null) {
      root.traverseIn(visit);
    }
  }

  len(): number {
    return this.size;
  }

  private solveDoubleBlack(node: TreeNode<T> | null): void {
    let parent: TreeNode<T> | null;

    if (node !== null) {
      parent = node.parent;
    } else {
      parent = this.hot;
    }

    if (parent === null) {
      return;
    }

    let sibling: TreeNode<T>;

    if (node === parent.leftChild) {
      sibling = parent.rightChild!;
    } else {
      sibling = parent.leftChild!;
    }

    if (isBlack(sibling)) {
      let siblingChild: TreeNode<T> | null = null;

      if (isRed(sibling.rightChild)) {
        siblingChild = sibling.rightChild;
      }

      if (isRed(sibling.leftChild)) {
        siblingChild = sibling.leftChild;
      }

      if (siblingChild !== null) {
        this.bb1(parent, siblingChild);
      } else {
        this.bb2(parent, sibling);
      }
    } else {
      this.bb3(node, parent, sibling);
    }
  }

  private bb1(parent: TreeNode<T>, siblingChild: TreeNode<T>): void {
    let oldColor = parent.color;
    let parentDirection = getDirection(parent);
    let grandparent = parent.parent;
    let node = this.rotate(siblingChild);

    switch (parentDirection) {
      case Direction.ROOT:
        this.root = node;
        break;
      case Direction.LEFT:
        grandparent!.leftChild = node;
        break;
      case Direction.RIGHT:
        grandparent!.rightChild = node;
        break;
    }

    if (hasLeftChild(node)) {
      let leftNode = node.leftChild!;
      leftNode.color = NodeColor.BLACK;
      this.updateHeight(leftNode);
    }

    if (hasRightChild(node)) {
      let rightNode = node.rightChild!;
      rightNode.color = NodeColor.BLACK;
      this.updateHeight(rightNode);
    }

    node.color = oldColor;
    this.updateHeight(node);
  }

  private bb2(parent: TreeNode<T>, sibling: TreeNode<T>): void {
    sibling.color = NodeColor.RED;
    sibling.height -= 1;

    if (isRed(parent)) {
      parent.color = NodeColor.BLACK;
    } else {
      parent.height -= 1;
      this.solveDoubleBlack(parent);
    }
  }

  private bb3(
    node: TreeNode<T> | null,
    parent: TreeNode<T>,
    sibling: TreeNode<T>
  ): void {
    sibling.color = NodeColor.BLACK;
    parent.color = NodeColor.RED;
    let siblingChild: TreeNode<T>;

    if (isLeftChild(sibling)) {
      siblingChild = sibling.leftChild!;
    } else if (isRightChild(sibling)) {
      siblingChild = sibling.rightChild!;
    } else {
      throw new Error("The sibling node can not be a root");
    }

    this.hot = parent;

    let parentDirection = getDirection(parent);
    let grandparent = parent.parent;
    let newNode = this.rotate(siblingChild);

    switch (parentDirection) {
      case Direction.ROOT:
        this.root = newNode;
        break;
      case Direction.LEFT:
        grandparent!.leftChild = newNode;
        break;
      case Direction.RIGHT:
        grandparent!.rightChild = newNode;
        break;
    }

    this.solveDoubleBlack(node);
  }

  private deleteImpl(node: TreeNode<T>): TreeNode<T> | null {
    let cache = node;
    let current: TreeNode<T> | null = node;
    let next: TreeNode<T> | null;

    if (!hasLeftChild(current)) {
      current = current.rightChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = current;
          break;
        case Direction.LEFT:
          this.hot!.leftChild = current;
          break;
        case Direction.RIGHT:
          this.hot!.rightChild = current;
      }

      next = current;
    } else if (!hasRightChild(current)) {
      current = current.leftChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = current;
          break;
        case Direction.LEFT:
          this.hot!.leftChild = current;
          break;
        case Direction.RIGHT:
          this.hot!.rightChild = current;
          break;
      }

      next = current;
    } else {
      cache = cache.getNext();
      [current.data, cache.data] = [cache.data, current.data];
      let parent = cache.parent!;
      next = cache.rightChild;

      if (parent === current) {
        parent.rightChild = next;
      } else {
        parent.leftChild = next;
      }
    }

    this.hot = cache.parent;

    if (isLeftChild(cache)) {
      this.direction = Direction.LEFT;
    } else {
      this.direction = Direction.RIGHT;
    }

    if (next !== null) {
      next.parent = this.hot;
    }

    return next;
  }

  private insertAsRoot(value: T): TreeNode<T> {
    this.size = 1;
    this.root = new TreeNode(value, null, null, null, 0, NodeColor.BLACK);

    return this.root;
  }

  private solveDoubleRed(node: TreeNode<T>): void {
    if (isRoot(node)) {
      let root = this.root!;
      root.color = NodeColor.BLACK;
      root.height += 1;

      return;
    }

    let parent = node.parent;

    if (isBlack(parent)) {
      return;
    }

    let redParent = parent as TreeNode<T>;

    let grandparent = redParent.parent!;
    let uncle = getUncle(node);

    if (isBlack(uncle)) {
      if (isLeftChild(node) === isLeftChild(redParent)) {
        redParent.color = NodeColor.BLACK;
      } else {
        node.color = NodeColor.BLACK;
      }

      grandparent.color = NodeColor.RED;
      let grandGrandparent = grandparent.parent;
      let direction = getDirection(grandparent);
      let newNode = this.rotate(node);

      switch (direction) {
        case Direction.ROOT:
          this.root = newNode;
          break;
        case Direction.LEFT:
          grandGrandparent!.leftChild = newNode;
          break;
        case Direction.RIGHT:
          grandGrandparent!.rightChild = newNode;
          break;
      }

      newNode.parent = grandGrandparent;
    } else {
      redParent.color = NodeColor.BLACK;
      redParent.height += 1;
      uncle.color = NodeColor.BLACK;
      uncle.height += 1;

      if (!isRoot(grandparent)) {
        grandparent.color = NodeColor.RED;
      }

      this.solveDoubleRed(grandparent);
    }
  }

  private rotate(node: TreeNode<T>): TreeNode<T> {
    let parent = node.parent!;
    let grandparent = parent.parent!;

    if (isLeftChild(parent)) {
      if (isLeftChild(node)) {
        parent.parent = grandparent.parent;

        return this.refactor(
          node,
          parent,
          grandparent,
          node.leftChild,
          node.rightChild,
          parent.rightChild,
          grandparent.rightChild
        );
      } else {
        node.parent = grandparent.parent;

        return this.refactor(
          parent,
          node,
          grandparent,
          parent.leftChild,
          node.leftChild,
          node.rightChild,
          grandparent.rightChild
        );
      }
    } else {
      if (isRightChild(node)) {
        parent.parent = grandparent.parent;

        return this.refactor(
          grandparent,
          parent,
          node,
          grandparent.leftChild,
          parent.leftChild,
          node.leftChild,
          node.rightChild
        );
      } else {
        node.parent = grandparent.parent;

        return this.refactor(
          grandparent,
          node,
          parent,
          grandparent.leftChild,
          node.leftChild,
          node.rightChild,
          parent.rightChild
        );
      }
    }
  }

  private refactor(
    left: TreeNode<T>,
    center: TreeNode<T>,
    right: TreeNode<T>,
    leftOuter: TreeNode<T> | null,
    leftInner: TreeNode<T> | null,
    rightInner: TreeNode<T> | null,
    rightOuter: TreeNode<T> | null
  ): TreeNode<T> {
    left.leftChild = leftOuter;

    if (leftOuter !== null) {
      leftOuter.parent = left;
    }

    left.rightChild = leftInner;

    if (leftInner !== null) {
      leftInner.parent = left;
    }

    this.updateHeight(left);

    right.leftChild = rightInner;

    if (rightInner !== null) {
      rightInner.parent = right;
    }

    right.rightChild = rightOuter;

    if (rightOuter !== null) {
      rightOuter.parent = right;
    }

    this.updateHeight(right);

    center.leftChild = left;
    left.parent = center;
    center.rightChild = right;
    right.parent = center;
    this.updateHeight(center);

    return center;
  }

  private updateHeight(node: TreeNode<T>): number {
    let leftHeight = getHeight(node.leftChild);
    let rightHeight = getHeight(node.rightChild);
    node.height = Math.max(leftHeight, rightHeight);

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }
}
