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
  Node,
  NodeColor,
} from "./binary-tree-node";
import { lessThan } from "../comparable";
import { MAX_SAFE_RED_BLACK_TREE_HEIGHT } from "../../constants";

/***
 * Reference:
 * https://en.wikipedia.org/wiki/Tree_traversal
 */

/**
 * @public
 * A kind of self-balancing binary search tree.
 */
export class RedBlackTree<T> {
  private root: Node<T> | null = null;
  private hot: Node<T> | null = null;
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
   *
   * @param newElement - An element to add into the tree.
   */
  add(newElement: T): this {
    this.addNode(newElement);

    return this;
  }

  /**
   * Deletes the specified element from the tree.
   *
   * @param element - The element to delete from the tree.
   */
  delete(element: T): boolean {
    const target = this.getNode(element);

    if (target === null) {
      return false;
    }

    const node = this.deleteNode(target);

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

  /**
   * Finds the next element of the current element and returns it,
   * or `undefined` if no next element exists.
   *
   * @param element - Current element
   */
  getNext(element: T): T | undefined {
    const node = this.getNode(element);
    const next = node?.getNext();

    return next?.element;
  }

  /**
   * Visit every node on a level before going to a lower level.
   *
   * This search is referred to as breadth-first search,
   * as the search tree is broadened as much as possible on
   * each depth before going to the next depth.
   *
   * Reference:
   * https://en.wikipedia.org/wiki/Tree_traversal#Breadth-first_search,_or_level_order
   *
   * @param visit - Visit callback
   */
  levelTraversal(visit: (element: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.levelTraversal(visit);
    }
  }

  /**
   * Traverse the left subtree by recursively calling the in-order function.
   *
   * Access the data part of the current node.
   *
   * Traverse the right subtree by recursively calling the in-order function.
   *
   * Reference:
   * https://en.wikipedia.org/wiki/Tree_traversal#In-order,_LNR
   *
   * @param visit - Visit callback
   */
  inorderTraversal(visit: (element: T) => void): void {
    const root = this.root;

    if (root !== null) {
      root.inorderTraversal(visit);
    }
  }

  private getNode(element: T): Node<T> | null {
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
    let current: Node<T> | null = root;

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

  private addNode(element: T): Node<T> {
    const target = this.getNode(element);

    if (target !== null) {
      return target;
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

  private addRoot(element: T): Node<T> {
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

  private updateHeight(node: Node<T>): number {
    const leftHeight = getHeight(node.leftChild);
    const rightHeight = getHeight(node.rightChild);

    node.height = Math.max(leftHeight, rightHeight);

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }

  private rotate(node: Node<T>): Node<T> {
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
    left: Node<T>,
    center: Node<T>,
    right: Node<T>,
    leftOuter: Node<T> | null,
    leftInner: Node<T> | null,
    rightInner: Node<T> | null,
    rightOuter: Node<T> | null
  ): Node<T> {
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

  private deleteNode(node: Node<T>): Node<T> | null {
    let target: Node<T> | null = node;
    let next: Node<T> | null;

    if (!hasLeftChild(node)) {
      next = node.rightChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = next;
          break;
        case Direction.LEFT:
          assert(this.hot !== null);

          this.hot.leftChild = next;
          break;
        case Direction.RIGHT:
          assert(this.hot !== null);

          this.hot.rightChild = next;
          break;
      }
    } else if (!hasRightChild(node)) {
      next = node.leftChild;

      switch (this.direction) {
        case Direction.ROOT:
          this.root = next;
          break;
        case Direction.LEFT:
          assert(this.hot !== null);

          this.hot.leftChild = next;
          break;
        case Direction.RIGHT:
          assert(this.hot !== null);

          this.hot.rightChild = next;
          break;
      }
    } else {
      target = target.getNext();

      assert(target !== null);

      [node.element, target.element] = [target.element, node.element];
      const parent = target.parent;

      next = target.rightChild;

      assert(parent !== null);

      if (parent === node) {
        parent.rightChild = next;
      } else {
        parent.leftChild = next;
      }
    }

    this.hot = target.parent;
    this.direction = Direction.UNKNOWN;

    if (next !== null) {
      next.parent = this.hot;
    }

    return next;
  }

  private solveDoubleRed(node: Node<T>): void {
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

  private solveDoubleBlack(node: Node<T> | null): void {
    let parent: Node<T> | null;

    if (node !== null) {
      parent = node.parent;
    } else {
      parent = this.hot;
    }

    if (parent === null) {
      return;
    }

    let sibling: Node<T>;

    if (node === parent.leftChild) {
      assert(parent.rightChild !== null);

      sibling = parent.rightChild;
    } else {
      assert(parent.leftChild !== null);

      sibling = parent.leftChild;
    }

    if (isBlack(sibling)) {
      let siblingChild: Node<T> | null = null;

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

  private blackBlackAlpha(parent: Node<T>, siblingChild: Node<T>): void {
    const cachedColor = parent.color;
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

    if (hasLeftChild(handle)) {
      const leftChild = handle.leftChild;

      assert(leftChild !== null);

      leftChild.color = NodeColor.BLACK;
      this.updateHeight(leftChild);
    }

    if (hasRightChild(handle)) {
      const rightChild = handle.rightChild;

      assert(rightChild !== null);

      rightChild.color = NodeColor.BLACK;
      this.updateHeight(rightChild);
    }

    handle.color = cachedColor;
    this.updateHeight(handle);
  }

  private blackBlackBeta(parent: Node<T>, sibling: Node<T>): void {
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
    node: Node<T> | null,
    parent: Node<T>,
    sibling: Node<T>
  ): void {
    sibling.color = NodeColor.BLACK;
    parent.color = NodeColor.RED;
    let siblingChild: Node<T>;

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
