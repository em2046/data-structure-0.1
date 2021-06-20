import { equality, Equatable } from "./equatable";
import { NovaFlags } from "../shared/flags";

export interface Comparable extends Equatable {
  readonly [NovaFlags.COMPARABLE]: true;

  lessThan: (rhs: this) => boolean;
  lessThanOrEqual?: (rhs: this) => boolean;
  greaterThan?: (rhs: this) => boolean;
  greaterThanOrEqual?: (rhs: this) => boolean;
}

interface ComparableWithLessThanOrEqual extends Comparable {
  lessThanOrEqual: (rhs: this) => boolean;
}

interface ComparableWithGreaterThan extends Comparable {
  greaterThan: (rhs: this) => boolean;
}

interface ComparableWithGreaterThanOrEqual extends Comparable {
  greaterThanOrEqual: (rhs: this) => boolean;
}

export function lessThan<T>(lhs: T, rhs: T): boolean {
  const lhsComparable = lhs as unknown as Comparable;
  const rhsComparable = rhs as unknown as Comparable;

  if (
    lhsComparable[NovaFlags.COMPARABLE] &&
    rhsComparable[NovaFlags.COMPARABLE]
  ) {
    return lhsComparable.lessThan(rhsComparable);
  }

  return lhs < rhs;
}

export function lessThanOrEqual<T>(lhs: T, rhs: T): boolean {
  const lx = lhs as unknown as ComparableWithLessThanOrEqual;
  const rx = rhs as unknown as ComparableWithLessThanOrEqual;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.lessThanOrEqual === "function") {
      return lx.lessThanOrEqual(rx);
    }

    return lessThan(lhs, rhs) || equality(lhs, rhs);
  }

  return lhs <= rhs;
}

export function greaterThan<T>(lhs: T, rhs: T): boolean {
  const lx = lhs as unknown as ComparableWithGreaterThan;
  const rx = rhs as unknown as ComparableWithGreaterThan;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.greaterThan === "function") {
      return lx.greaterThan(rx);
    }

    return !lessThanOrEqual(lhs, rhs);
  }

  return lhs > rhs;
}

export function greaterThanOrEqual<T>(lhs: T, rhs: T): boolean {
  const lx = lhs as unknown as ComparableWithGreaterThanOrEqual;
  const rx = rhs as unknown as ComparableWithGreaterThanOrEqual;

  if (lx[NovaFlags.COMPARABLE] && rx[NovaFlags.COMPARABLE]) {
    if (typeof lx.greaterThanOrEqual === "function") {
      return lx.greaterThanOrEqual(rx);
    }

    return !lessThan(lhs, rhs);
  }

  return lhs >= rhs;
}
