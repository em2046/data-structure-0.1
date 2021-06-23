import { NovaFlags } from "../shared/flags";

/***
 * Reference
 * https://github.com/apple/swift/blob/53fe241c0e8622ac4c62a9c147626d4eda9c0e6a/stdlib/public/core/Equatable.swift
 */

/**
 * @public
 * A type that can be compared for value equality.
 */
export interface Equatable {
  readonly [NovaFlags.EQUATABLE]: true;

  /**
   * Returns a Boolean value indicating whether two values are equal.
   *
   * @param rhs - Another value to compare.
   */
  equality(rhs: this): boolean;
}

/**
 * @public
 * Returns a Boolean value indicating whether two values are equal.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
export function equality<T>(lhs: T, rhs: T): boolean {
  const lhsEquatable = lhs as unknown as Equatable;
  const rhsEquatable = rhs as unknown as Equatable;

  if (lhsEquatable[NovaFlags.EQUATABLE] && rhsEquatable[NovaFlags.EQUATABLE]) {
    return lhsEquatable.equality(rhsEquatable);
  }

  return lhs === rhs;
}
