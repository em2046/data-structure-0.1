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

    if (oldNode !== null) {
      return oldNode;
    }

    if (this.direction === Direction.ROOT) {
      return this.insertAsRoot(value);
    }

    let hot = this.hot;
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

    if (oldNode === null) {
      return false;
    }

    let node = this.deleteImpl(oldNode);
    this.size -= 1;

    if (this.size === 0) {
      return true;
    }

    let hot = this.hot;

    if (hot === null) {
      this.root.color = NodeColor.BLACK;
      this.updateHeight(this.root);
      return true;
    }

    if (balanced(hot)) {
      return true;
    }

    if (isRed(node)) {
      node.color = NodeColor.BLACK;
      node.height += 1;
      return true;
    }

    this.solveDoubleBlack(node);

    return true;
  }

  get(value: T): TreeNode<T> {
    let root = this.root;

    if (root === null || value === root.data) {
      this.hot = null;
      this.direction = Direction.ROOT;
      return root;
    }

    this.hot = root;
    let current = root;

    while (true) {
      if (lessThan(value, current.data)) {
        this.direction = Direction.LEFT;
        current = current.leftChild;
      } else {
        this.direction = Direction.RIGHT;
        current = current.rightChild;
      }

      if (current === null || value === current.data) {
        return current;
      }

      this.hot = current;
    }
  }

  traverseLevel(visit: (value: T) => void) {
    let root = this.root;

    if (root !== null) {
      root.traverseLevel(visit);
    }
  }

  traverseIn(visit: (value: T) => void) {
    let root = this.root;

    if (root !== null) {
      root.traverseIn(visit);
    }
  }

  len() {
    return this.size;
  }

  private solveDoubleBlack(node: TreeNode<T>) {
    let parent: TreeNode<T>;

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
      sibling = parent.rightChild;
    } else {
      sibling = parent.leftChild;
    }

    if (isBlack(sibling)) {
      let siblingChild: TreeNode<T> = null;

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

  private bb1(parent: TreeNode<T>, siblingChild: TreeNode<T>) {
    let oldColor = parent.color;
    let parentDirection = getDirection(parent);
    let grandparent = parent.parent;
    let node = this.rotate(siblingChild);

    switch (parentDirection) {
      case Direction.ROOT:
        this.root = node;
        break;
      case Direction.LEFT:
        grandparent.leftChild = node;
        break;
      case Direction.RIGHT:
        grandparent.rightChild = node;
        break;
    }

    if (hasLeftChild(node)) {
      node.leftChild.color = NodeColor.BLACK;
      this.updateHeight(node.leftChild);
    }

    if (hasRightChild(node)) {
      node.rightChild.color = NodeColor.BLACK;
      this.updateHeight(node.rightChild);
    }

    node.color = oldColor;
    this.updateHeight(node);
  }

  private bb2(parent: TreeNode<T>, sibling: TreeNode<T>) {
    sibling.color = NodeColor.RED;
    sibling.height -= 1;

    if (isRed(parent)) {
      parent.color = NodeColor.BLACK;
    } else {
      parent.height -= 1;
      this.solveDoubleBlack(parent);
    }
  }

  private bb3(node: TreeNode<T>, parent: TreeNode<T>, sibling: TreeNode<T>) {
    sibling.color = NodeColor.BLACK;
    parent.color = NodeColor.RED;
    let siblingChild: TreeNode<T>;

    if (isLeftChild(sibling)) {
      siblingChild = sibling.leftChild;
    } else {
      siblingChild = sibling.rightChild;
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
        grandparent.leftChild = newNode;
        break;
      case Direction.RIGHT:
        grandparent.rightChild = newNode;
        break;
    }

    this.solveDoubleBlack(node);
  }

  private deleteImpl(node: TreeNode<T>): TreeNode<T> {
    let cache = node;
    let next: TreeNode<T>;

    if (!hasLeftChild(node)) {
      node = node.rightChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = node;
          break;
        case Direction.LEFT:
          this.hot.leftChild = node;
          break;
        case Direction.RIGHT:
          this.hot.rightChild = node;
      }

      next = node;
    } else if (!hasRightChild(node)) {
      node = node.leftChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = node;
          break;
        case Direction.LEFT:
          this.hot.leftChild = node;
          break;
        case Direction.RIGHT:
          this.hot.rightChild = node;
          break;
      }

      next = node;
    } else {
      cache = cache.getNext();
      [node.data, cache.data] = [cache.data, node.data];
      let parent = cache.parent;
      next = cache.rightChild;

      if (parent === node) {
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

  private isRightChild(node: TreeNode<T>): boolean {
    if (isRoot(node)) {
      return false;
    }

    return node === node.parent.rightChild;
  }

  private solveDoubleRed(node: TreeNode<T>) {
    if (isRoot(node)) {
      this.root.color = NodeColor.BLACK;
      this.root.height += 1;

      return;
    }

    let parent = node.parent;

    if (isBlack(parent)) {
      return;
    }

    let grandparent = parent.parent;
    let uncle = getUncle(node);

    if (isBlack(uncle)) {
      if (isLeftChild(node) === isLeftChild(parent)) {
        parent.color = NodeColor.BLACK;
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
          grandGrandparent.leftChild = newNode;
          break;
        case Direction.RIGHT:
          grandGrandparent.rightChild = newNode;
          break;
      }

      newNode.parent = grandGrandparent;
    } else {
      parent.color = NodeColor.BLACK;
      parent.height += 1;
      uncle.color = NodeColor.BLACK;
      uncle.height += 1;

      if (!isRoot(grandparent)) {
        grandparent.color = NodeColor.RED;
      }

      this.solveDoubleRed(grandparent);
    }
  }

  private rotate(node: TreeNode<T>) {
    let parent = node.parent;
    let grandparent = parent.parent;

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
      if (this.isRightChild(node)) {
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
    leftOuter: TreeNode<T>,
    leftInner: TreeNode<T>,
    rightInner: TreeNode<T>,
    rightOuter: TreeNode<T>
  ) {
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

  private updateHeight(node: TreeNode<T>) {
    let leftHeight = getHeight(node.leftChild);
    let rightHeight = getHeight(node.rightChild);
    node.height = Math.max(leftHeight, rightHeight);

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }
}
