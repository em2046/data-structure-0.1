export const enum NovaFlags {
  EQUATABLE = "__nova_equatable",
  COMPARABLE = "__nova_comparable",
}

export interface Equatable {
  equality: (rhs) => boolean;
  [NovaFlags.EQUATABLE]: true;
}

export function equality<T>(lhs: T, rhs: T) {
  if (lhs[NovaFlags.EQUATABLE] && rhs[NovaFlags.EQUATABLE]) {
    let lhsEquatable = lhs as unknown as Equatable;
    let rhsEquatable = rhs as unknown as Equatable;
    return lhsEquatable.equality(rhsEquatable);
  }

  return lhs == rhs;
}

export interface Comparable extends Equatable {
  lessThan: (rhs) => boolean;
  lessThanOrEqual?: (rhs) => boolean;
  greaterThan?: (rhs) => boolean;
  greaterThanOrEqual?: (rhs) => boolean;
  [NovaFlags.COMPARABLE]: true;
}

interface ComparableWithLessThanOrEqual extends Comparable {
  lessThanOrEqual: (rhs) => boolean;
}

interface ComparableWithGreaterThan extends Comparable {
  greaterThan: (rhs) => boolean;
}

interface ComparableWithGreaterThanOrEqual extends Comparable {
  greaterThanOrEqual: (rhs) => boolean;
}

export function lessThan<T>(lhs: T, rhs: T) {
  if (lhs[NovaFlags.COMPARABLE] && rhs[NovaFlags.COMPARABLE]) {
    let lhsComparable = lhs as unknown as Comparable;
    let rhsComparable = rhs as unknown as Comparable;
    return lhsComparable.lessThan(rhsComparable);
  }

  return lhs < rhs;
}

export function lessThanOrEqual<T>(lhs: T, rhs: T) {
  if (lhs[NovaFlags.COMPARABLE] && rhs[NovaFlags.COMPARABLE]) {
    let lx = lhs as unknown as ComparableWithLessThanOrEqual;
    let rx = rhs as unknown as ComparableWithLessThanOrEqual;

    if (typeof lx.lessThanOrEqual === "function") {
      return lx.lessThanOrEqual(rx);
    }

    return lessThan(lhs, rhs) || equality(lhs, rhs);
  }

  return lhs <= rhs;
}

export function greaterThan<T>(lhs: T, rhs: T) {
  if (lhs[NovaFlags.COMPARABLE] && rhs[NovaFlags.COMPARABLE]) {
    let lx = lhs as unknown as ComparableWithGreaterThan;
    let rx = rhs as unknown as ComparableWithGreaterThan;

    if (typeof lx.greaterThan === "function") {
      return lx.greaterThan(rx);
    }

    return !lessThanOrEqual(lhs, rhs);
  }

  return lhs > lhs;
}

export function greaterThanOrEqual<T>(lhs: T, rhs: T) {
  if (lhs[NovaFlags.COMPARABLE] && rhs[NovaFlags.COMPARABLE]) {
    let lx = lhs as unknown as ComparableWithGreaterThanOrEqual;
    let rx = rhs as unknown as ComparableWithGreaterThanOrEqual;

    if (typeof lx.greaterThanOrEqual === "function") {
      return lx.greaterThanOrEqual(rx);
    }

    return !lessThan(lhs, rhs);
  }

  return lhs >= rhs;
}
