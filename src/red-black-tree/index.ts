import {
  blackHeightUpdated,
  Direction,
  findUncle,
  fromParentTo,
  hasLeftChild,
  hasRightChild,
  isBlack,
  isLeftChild,
  isRed,
  isRoot,
  NodeColor,
  stature,
  TreeNode,
} from "./node";
import { lessThan } from "../abstract/comparable";

export class RedBlackTree<T> {
  private root: TreeNode<T> | null = null;
  private size: number = 0;
  private hot: TreeNode<T> | null = null;
  private direction: Direction = Direction.ROOT;

  insert(value: T): TreeNode<T> {
    let node = this.find(value);

    if (node !== null) {
      return node;
    }

    if (this.direction === Direction.ROOT) {
      return this.insertAsRoot(value);
    }

    let newNode = new TreeNode(value, this.hot, null, null, -1);
    if (this.direction === Direction.LEFT) {
      this.hot.leftChild = newNode;
    } else if (this.direction === Direction.RIGHT) {
      this.hot.rightChild = newNode;
    }

    this.size += 1;
    let cacheNode = newNode;
    this.solveDoubleRed(newNode);
    return cacheNode;
  }

  remove(value: T): boolean {
    let target = this.find(value);
    if (target === null) {
      return false;
    }

    let node = this.removeAt(target);
    this.size -= 1;

    if (this.size === 0) {
      return true;
    }

    if (this.hot === null) {
      this.root.color = NodeColor.BLACK;
      this.updateHeight(this.root);
      return true;
    }

    if (blackHeightUpdated(this.hot)) {
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

  find(value: T) {
    if (this.root === null || value === this.root.data) {
      this.hot = null;
      this.direction = Direction.ROOT;
      return this.root;
    }

    this.hot = this.root;
    let current = this.root;

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
    if (this.root !== null) {
      this.root.traverseLevel(visit);
    }
  }

  traverseIn(visit: (value: T) => void) {
    if (this.root !== null) {
      this.root.traverseIn(visit);
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
    let direction = fromParentTo(parent);
    let grandparent = parent.parent;
    let node = this.rotateAt(siblingChild);
    switch (direction) {
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

    let grandparent = parent.parent;
    let direction = fromParentTo(parent);
    let newNode = this.rotateAt(siblingChild);
    switch (direction) {
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

  private removeAt(node: TreeNode<T>): TreeNode<T> {
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
      cache = cache.succ();
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
    let uncle = findUncle(node);

    if (isBlack(uncle)) {
      if (isLeftChild(node) === isLeftChild(parent)) {
        parent.color = NodeColor.BLACK;
      } else {
        node.color = NodeColor.BLACK;
      }

      grandparent.color = NodeColor.RED;
      let grandGrandparent = grandparent.parent;
      let direction = fromParentTo(grandparent);
      let newNode = this.rotateAt(node);

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

  private rotateAt(node: TreeNode<T>) {
    let parent = node.parent;
    let grandparent = parent.parent;

    if (isLeftChild(parent)) {
      if (isLeftChild(node)) {
        parent.parent = grandparent.parent;
        return this.connect34(
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
        return this.connect34(
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
        return this.connect34(
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
        return this.connect34(
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

  private connect34(
    alpha: TreeNode<T>,
    beta: TreeNode<T>,
    gamma: TreeNode<T>,
    leftOuter: TreeNode<T>,
    leftInner: TreeNode<T>,
    rightInner: TreeNode<T>,
    rightOuter: TreeNode<T>
  ) {
    alpha.leftChild = leftOuter;
    if (leftOuter !== null) {
      leftOuter.parent = alpha;
    }

    alpha.rightChild = leftInner;
    if (leftInner !== null) {
      leftInner.parent = alpha;
    }

    this.updateHeight(alpha);

    gamma.leftChild = rightInner;
    if (rightInner !== null) {
      rightInner.parent = gamma;
    }

    gamma.rightChild = rightOuter;
    if (rightOuter !== null) {
      rightOuter.parent = gamma;
    }

    this.updateHeight(gamma);

    beta.leftChild = alpha;
    alpha.parent = beta;
    beta.rightChild = gamma;
    gamma.parent = beta;
    this.updateHeight(beta);

    return beta;
  }

  private updateHeight(node: TreeNode<T>) {
    node.height = Math.max(stature(node.leftChild), stature(node.rightChild));

    if (isBlack(node)) {
      node.height += 1;
    }

    return node.height;
  }
}
