import { equality, Equatable } from "./equatable";
import { NovaFlags } from "../shared/flags";

/***
 * Reference
 * https://github.com/apple/swift/blob/53fe241c0e8622ac4c62a9c147626d4eda9c0e6a/stdlib/public/core/Comparable.swift
 */

/**
 * @public
 * A type that can be compared using the relational operators
 * `<`, `<=`, `>`, and `>=`.
 */
export interface Comparable extends Equatable {
  readonly [NovaFlags.COMPARABLE]: true;

  /**
   * Returns a Boolean value indicating whether the value of `this`
   * is less than of the first argument.
   *
   * @param rhs - Another value to compare.
   */
  lessThan(rhs: this): boolean;

  /**
   * Returns a Boolean value indicating whether the value of `this`
   * is less than or equal to that of the first argument.
   *
   * @param rhs - Another value to compare.
   */
  lessThanOrEqual?(rhs: this): boolean;

  /**
   * Returns a Boolean value indicating whether the value of the `this`
   * is greater than that of the first argument.
   *
   * @param rhs - Another value to compare.
   */
  greaterThan?(rhs: this): boolean;

  /**
   * Returns a boolean value indicating whether the value of the `this`
   * is greater than or equal to that of the first argument
   *
   * @param rhs - Another value to compare.
   */
  greaterThanOrEqual?(rhs: this): boolean;
}

interface ComparableWithLessThanOrEqual extends Comparable {
  lessThanOrEqual(rhs: this): boolean;
}

interface ComparableWithGreaterThan extends Comparable {
  greaterThan(rhs: this): boolean;
}

interface ComparableWithGreaterThanOrEqual extends Comparable {
  greaterThanOrEqual(rhs: this): boolean;
}

/**
 * @public
 * Returns a Boolean value indicating whether the value of the first
 * argument is less than that of the second argument.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
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

/**
 * @public
 * Returns of Boolean value indicating whether the value of the first
 * argument is less than or equal to that of the second argument.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
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

/**
 * @public
 * Returns a Boolean value indicating whether the value of the first
 * argument is greater than that of the second argument.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
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

/**
 * @public
 * Returns a Boolean value indicating whether the value of the first
 * argument is greater than or equal to that of the second argument.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
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
