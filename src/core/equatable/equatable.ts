import { NovaFlags } from "../../shared";

/***
 * Reference
 * https://github.com/apple/swift/blob/53fe241c0e8622ac4c62a9c147626d4eda9c0e6a/stdlib/public/core/Equatable.swift
 */

/**
 * @public
 * A type that can be compared for value equality.
 */
export interface Equatable {
  /**
   * Equatable flag.
   */
  readonly [NovaFlags.EQUATABLE]: true;

  /**
   * Returns a Boolean value indicating whether two values are equal.
   *
   * @param rhs - Another value to compare.
   */
  equality(rhs: this): boolean;

  /**
   * Returns a Boolean value indicating whether two values are not equal.
   *
   * @param rhs - Another value to compare
   */
  inequality?(rhs: this): boolean;
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

interface EquatableWithInequality extends Equatable {
  inequality(rhs: this): boolean;
}

/**
 * @public
 * Returns a Boolean value indicating whether two value are not equal.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
export function inequality<T>(lhs: T, rhs: T): boolean {
  const lx = lhs as unknown as EquatableWithInequality;
  const rx = rhs as unknown as EquatableWithInequality;

  if (lx[NovaFlags.EQUATABLE] && rx[NovaFlags.EQUATABLE]) {
    if (typeof lx.inequality === "function") {
      return lx.inequality(rx);
    }

    return !equality(lhs, rhs);
  }

  return lhs !== rhs;
}
