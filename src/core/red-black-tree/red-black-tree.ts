import { assert } from "../../shared";
import {
  BinaryTreeNode,
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
} from "./binary-tree-node";
import { lessThan } from "../comparable";
import { MAX_SAFE_RED_BLACK_TREE_HEIGHT } from "../../constants";

/**
 * A kind of self-balancing binary search tree
 */
export class RedBlackTree<T> {
  private root: BinaryTreeNode<T> | null = null;
  private hot: BinaryTreeNode<T> | null = null;
  private direction: Direction = Direction.UNKNOWN;

  private _size = 0;

  /**
   * Get the size of the tree.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Adds the given element in the tree if it is not already present.
   * @param newElement
   */
  add(newElement: T): this {
    this.addNode(newElement);

    return this;
  }

  delete(element: T): boolean {
    const oldNode = this.getNode(element);

    if (oldNode === null) {
      return false;
    }

    const node = this.deleteNode(oldNode);

    this._size -= 1;

    if (this._size === 0) {
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

  get(element: T): T | undefined {
    const node = this.getNode(element);

    return node?.element;
  }

  getNext(element: T): T | undefined {
    const node = this.getNode(element);
    const next = node?.getNext();

    return next?.element;
  }

  levelTraversal(visit: (element: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.levelTraversal(visit);
    }
  }

  inorderTraversal(visit: (element: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.inorderTraversal(visit);
    }
  }

  private getNode(element: T): BinaryTreeNode<T> | null {
    const root = this.root;

    if (root === null) {
      this.hot = null;
      this.direction = Direction.UNKNOWN;

      return null;
    }

    if (element === root.element) {
      this.hot = null;
      this.direction = Direction.ROOT;

      return root;
    }

    this.hot = root;
    let current: BinaryTreeNode<T> | null = root;

    for (let i = 0; i < MAX_SAFE_RED_BLACK_TREE_HEIGHT; i++) {
      if (lessThan(element, current.element)) {
        this.direction = Direction.LEFT;
        current = current.leftChild;
      } else {
        this.direction = Direction.RIGHT;
        current = current.rightChild;
      }

      if (current === null) {
        return null;
      }

      if (element === current.element) {
        return current;
      }

      this.hot = current;
    }

    assert(false);
  }

  private addNode(element: T): BinaryTreeNode<T> {
    const oldNode = this.getNode(element);

    if (oldNode !== null) {
      return oldNode;
    }

    if (this.direction === Direction.UNKNOWN) {
      return this.addRoot(element);
    }

    const hot = this.hot;
    const node = new BinaryTreeNode(element, hot, null, null, -1);

    if (this.direction === Direction.LEFT) {
      assert(hot !== null);

      hot.leftChild = node;
    } else if (this.direction === Direction.RIGHT) {
      assert(hot !== null);

      hot.rightChild = node;
    }

    this._size += 1;
    this.solveDoubleRed(node);

    return node;
  }

  private addRoot(element: T): BinaryTreeNode<T> {
    this._size = 1;
    this.root = new BinaryTreeNode(
      element,
      null,
      null,
      null,
      0,
      NodeColor.BLACK
    );

    return this.root;
  }

  private updateHeight(node: BinaryTreeNode<T>): number {
    const leftHeight = getHeight(node.leftChild);
    const rightHeight = getHeight(node.rightChild);

    node.height = Math.max(leftHeight, rightHeight);

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }

  private rotate(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
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
    left: BinaryTreeNode<T>,
    center: BinaryTreeNode<T>,
    right: BinaryTreeNode<T>,
    leftOuter: BinaryTreeNode<T> | null,
    leftInner: BinaryTreeNode<T> | null,
    rightInner: BinaryTreeNode<T> | null,
    rightOuter: BinaryTreeNode<T> | null
  ): BinaryTreeNode<T> {
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

  private deleteNode(node: BinaryTreeNode<T>): BinaryTreeNode<T> | null {
    let element: BinaryTreeNode<T> | null = node;
    let current: BinaryTreeNode<T> | null = node;
    let next: BinaryTreeNode<T> | null;

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

      assert(element !== null);

      [current.element, element.element] = [element.element, current.element];
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

  private solveDoubleRed(node: BinaryTreeNode<T>): void {
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

  private solveDoubleBlack(node: BinaryTreeNode<T> | null): void {
    let parent: BinaryTreeNode<T> | null;

    if (node !== null) {
      parent = node.parent;
    } else {
      parent = this.hot;
    }

    if (parent === null) {
      return;
    }

    let sibling: BinaryTreeNode<T>;

    if (node === parent.leftChild) {
      assert(parent.rightChild !== null);

      sibling = parent.rightChild;
    } else {
      assert(parent.leftChild !== null);

      sibling = parent.leftChild;
    }

    if (isBlack(sibling)) {
      let siblingChild: BinaryTreeNode<T> | null = null;

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
    parent: BinaryTreeNode<T>,
    siblingChild: BinaryTreeNode<T>
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

  private blackBlackBeta(
    parent: BinaryTreeNode<T>,
    sibling: BinaryTreeNode<T>
  ): void {
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
    node: BinaryTreeNode<T> | null,
    parent: BinaryTreeNode<T>,
    sibling: BinaryTreeNode<T>
  ): void {
    sibling.color = NodeColor.BLACK;
    parent.color = NodeColor.RED;
    let siblingChild: BinaryTreeNode<T>;

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
