import { equality, Equatable } from "./equatable";
import { NovaFlags } from "./flags";

export interface Comparable extends Equatable {
  lessThan: (rhs: Comparable) => boolean;
  lessThanOrEqual?: (rhs: Comparable) => boolean;
  greaterThan?: (rhs: Comparable) => boolean;
  greaterThanOrEqual?: (rhs: Comparable) => boolean;
  [NovaFlags.COMPARABLE]: true;
}

interface ComparableWithLessThanOrEqual extends Comparable {
  lessThanOrEqual: (rhs: Comparable) => boolean;
}

interface ComparableWithGreaterThan extends Comparable {
  greaterThan: (rhs: Comparable) => boolean;
}

interface ComparableWithGreaterThanOrEqual extends Comparable {
  greaterThanOrEqual: (rhs: Comparable) => boolean;
}

export function lessThan<T>(lhs: T, rhs: T): boolean {
  let lhsComparable = lhs as unknown as Comparable;
  let rhsComparable = rhs as unknown as Comparable;

  if (
    lhsComparable[NovaFlags.COMPARABLE] &&
    rhsComparable[NovaFlags.COMPARABLE]
  ) {
    return lhsComparable.lessThan(rhsComparable);
  }

  return lhs < rhs;
}

export function lessThanOrEqual<T>(lhs: T, rhs: T): boolean {
  let lx = lhs as unknown as ComparableWithLessThanOrEqual;
  let rx = rhs as unknown as ComparableWithLessThanOrEqual;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.lessThanOrEqual === "function") {
      return lx.lessThanOrEqual(rx);
    }

    return lessThan(lhs, rhs) || equality(lhs, rhs);
  }

  return lhs <= rhs;
}

export function greaterThan<T>(lhs: T, rhs: T): boolean {
  let lx = lhs as unknown as ComparableWithGreaterThan;
  let rx = rhs as unknown as ComparableWithGreaterThan;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.greaterThan === "function") {
      return lx.greaterThan(rx);
    }

    return !lessThanOrEqual(lhs, rhs);
  }

  return lhs > lhs;
}

export function greaterThanOrEqual<T>(lhs: T, rhs: T): boolean {
  let lx = lhs as unknown as ComparableWithGreaterThanOrEqual;
  let rx = rhs as unknown as ComparableWithGreaterThanOrEqual;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.greaterThanOrEqual === "function") {
      return lx.greaterThanOrEqual(rx);
    }

    return !lessThan(lhs, rhs);
  }

  return lhs >= rhs;
}
