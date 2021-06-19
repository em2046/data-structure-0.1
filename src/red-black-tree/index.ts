import {
  Direction,
  getDirection,
  getHeight,
  getUncle,
  hasLeftChild,
  hasRightChild,
  isBalanced,
  isBlack,
  isLeftChild,
  isRed,
  isRightChild,
  isRoot,
  NodeColor,
  TreeNode,
} from "./node";
import { lessThan } from "../abstract/comparable";
import { MAX_SAFE_RED_BLACK_TREE_HEIGHT } from "../shared/constants";
import { assert } from "../shared/assert";

export class RedBlackTree<T> {
  private root: TreeNode<T> | null = null;
  private size = 0;
  private hot: TreeNode<T> | null = null;
  private direction: Direction = Direction.UNKNOWN;

  len(): number {
    return this.size;
  }

  add(value: T): void {
    this.insert(value);
  }

  delete(value: T): boolean {
    const oldNode = this.search(value);

    if (oldNode === null) {
      return false;
    }

    const node = this.deleteImpl(oldNode);
    this.size -= 1;

    if (this.size === 0) {
      return true;
    }

    const hot = this.hot;

    if (hot === null) {
      const root = this.root;

      assert(root !== null);

      root.color = NodeColor.BLACK;
      this.updateHeight(root);
      return true;
    }

    if (isBalanced(hot)) {
      return true;
    }

    if (isRed(node)) {
      assert(node !== null);

      node.color = NodeColor.BLACK;
      node.height += 1;
      return true;
    }

    this.solveDoubleBlack(node);

    return true;
  }

  get(value: T): T | undefined {
    return this.search(value)?.data;
  }

  traverseLevel(visit: (value: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.traverseLevel(visit);
    }
  }

  traverseIn(visit: (value: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.traverseIn(visit);
    }
  }

  private insert(value: T): TreeNode<T> {
    const oldNode = this.search(value);

    if (oldNode !== null) {
      return oldNode;
    }

    if (this.direction === Direction.ROOT) {
      return this.insertAsRoot(value);
    }

    const hot = this.hot;
    const node = new TreeNode(value, hot, null, null, -1);

    if (this.direction === Direction.LEFT) {
      assert(hot !== null);

      hot.leftChild = node;
    } else if (this.direction === Direction.RIGHT) {
      assert(hot !== null);

      hot.rightChild = node;
    }

    this.size += 1;
    this.solveDoubleRed(node);

    return node;
  }

  private insertAsRoot(value: T): TreeNode<T> {
    this.size = 1;
    this.root = new TreeNode(value, null, null, null, 0, NodeColor.BLACK);

    return this.root;
  }

  private search(value: T): TreeNode<T> | null {
    const root = this.root;

    if (root === null || value === root.data) {
      this.hot = null;
      this.direction = Direction.ROOT;

      return root;
    }

    this.hot = root;
    let current: TreeNode<T> | null = root;

    for (let i = 0; i < MAX_SAFE_RED_BLACK_TREE_HEIGHT; i++) {
      if (lessThan(value, current.data)) {
        this.direction = Direction.LEFT;
        current = current.leftChild;
      } else {
        this.direction = Direction.RIGHT;
        current = current.rightChild;
      }

      if (current === null) {
        return null;
      }

      if (value === current.data) {
        return current;
      }

      this.hot = current;
    }

    throw new Error("Tree size overflow");
  }

  private updateHeight(node: TreeNode<T>): number {
    const leftHeight = getHeight(node.leftChild);
    const rightHeight = getHeight(node.rightChild);
    node.height = Math.max(leftHeight, rightHeight);

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }

  private rotate(node: TreeNode<T>): TreeNode<T> {
    const parent = node.parent;

    assert(parent !== null);

    const grandparent = parent.parent;

    assert(grandparent !== null);

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

  private deleteImpl(node: TreeNode<T>): TreeNode<T> | null {
    let element = node;
    let current: TreeNode<T> | null = node;
    let next: TreeNode<T> | null;

    if (!hasLeftChild(current)) {
      current = current.rightChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = current;
          break;
        case Direction.LEFT:
          assert(this.hot !== null);

          this.hot.leftChild = current;
          break;
        case Direction.RIGHT:
          assert(this.hot !== null);

          this.hot.rightChild = current;
      }

      next = current;
    } else if (!hasRightChild(current)) {
      current = current.leftChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = current;
          break;
        case Direction.LEFT:
          assert(this.hot !== null);

          this.hot.leftChild = current;
          break;
        case Direction.RIGHT:
          assert(this.hot !== null);

          this.hot.rightChild = current;
          break;
      }

      next = current;
    } else {
      element = element.getNext();
      [current.data, element.data] = [element.data, current.data];
      const parent = element.parent;
      next = element.rightChild;

      assert(parent !== null);

      if (parent === current) {
        parent.rightChild = next;
      } else {
        parent.leftChild = next;
      }
    }

    this.hot = element.parent;
    this.direction = Direction.UNKNOWN;

    if (next !== null) {
      next.parent = this.hot;
    }

    return next;
  }

  private solveDoubleRed(node: TreeNode<T>): void {
    if (isRoot(node)) {
      const root = this.root;

      assert(root !== null);

      root.color = NodeColor.BLACK;
      root.height += 1;

      return;
    }

    const parent = node.parent;

    assert(parent !== null);

    if (isBlack(parent)) {
      return;
    }

    const grandparent = parent.parent;
    const uncle = getUncle(node);

    assert(grandparent !== null);

    if (isBlack(uncle)) {
      if (isLeftChild(node) === isLeftChild(parent)) {
        parent.color = NodeColor.BLACK;
      } else {
        node.color = NodeColor.BLACK;
      }

      grandparent.color = NodeColor.RED;
      const greatGrandparent = grandparent.parent;
      const direction = getDirection(grandparent);
      const handle = this.rotate(node);

      switch (direction) {
        case Direction.ROOT:
          this.root = handle;
          break;
        case Direction.LEFT:
          assert(greatGrandparent !== null);

          greatGrandparent.leftChild = handle;
          break;
        case Direction.RIGHT:
          assert(greatGrandparent !== null);

          greatGrandparent.rightChild = handle;
          break;
      }
    } else {
      assert(uncle !== null);

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
      assert(parent.rightChild !== null);

      sibling = parent.rightChild;
    } else {
      assert(parent.leftChild !== null);

      sibling = parent.leftChild;
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
        this.blackBlackAlpha(parent, siblingChild);
      } else {
        this.blackBlackBeta(parent, sibling);
      }
    } else {
      this.blackBlackGamma(node, parent, sibling);
    }
  }

  private blackBlackAlpha(
    parent: TreeNode<T>,
    siblingChild: TreeNode<T>
  ): void {
    const oldColor = parent.color;
    const parentDirection = getDirection(parent);
    const grandparent = parent.parent;
    const node = this.rotate(siblingChild);

    switch (parentDirection) {
      case Direction.ROOT:
        this.root = node;
        break;
      case Direction.LEFT:
        assert(grandparent !== null);

        grandparent.leftChild = node;
        break;
      case Direction.RIGHT:
        assert(grandparent !== null);

        grandparent.rightChild = node;
        break;
    }

    if (hasLeftChild(node)) {
      const leftNode = node.leftChild;

      assert(leftNode !== null);

      leftNode.color = NodeColor.BLACK;
      this.updateHeight(leftNode);
    }

    if (hasRightChild(node)) {
      const rightNode = node.rightChild;

      assert(rightNode !== null);

      rightNode.color = NodeColor.BLACK;
      this.updateHeight(rightNode);
    }

    node.color = oldColor;
    this.updateHeight(node);
  }

  private blackBlackBeta(parent: TreeNode<T>, sibling: TreeNode<T>): void {
    sibling.color = NodeColor.RED;
    sibling.height -= 1;

    if (isRed(parent)) {
      parent.color = NodeColor.BLACK;
    } else {
      parent.height -= 1;
      this.solveDoubleBlack(parent);
    }
  }

  private blackBlackGamma(
    node: TreeNode<T> | null,
    parent: TreeNode<T>,
    sibling: TreeNode<T>
  ): void {
    sibling.color = NodeColor.BLACK;
    parent.color = NodeColor.RED;
    let siblingChild: TreeNode<T>;

    if (isLeftChild(sibling)) {
      assert(sibling.leftChild !== null);

      siblingChild = sibling.leftChild;
    } else if (isRightChild(sibling)) {
      assert(sibling.rightChild !== null);

      siblingChild = sibling.rightChild;
    } else {
      assert(false);
    }

    this.hot = parent;

    const parentDirection = getDirection(parent);
    const grandparent = parent.parent;
    const handle = this.rotate(siblingChild);

    switch (parentDirection) {
      case Direction.ROOT:
        this.root = handle;
        break;
      case Direction.LEFT:
        assert(grandparent !== null);

        grandparent.leftChild = handle;
        break;
      case Direction.RIGHT:
        assert(grandparent !== null);

        grandparent.rightChild = handle;
        break;
    }

    this.solveDoubleBlack(node);
  }
}
