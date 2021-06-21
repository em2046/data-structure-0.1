import { NovaFlags } from "../shared/flags";

export interface Equatable {
  readonly [NovaFlags.EQUATABLE]: true;

  equality(rhs: this): boolean;
}

export function equality<T>(lhs: T, rhs: T): boolean {
  const lhsEquatable = lhs as unknown as Equatable;
  const rhsEquatable = rhs as unknown as Equatable;

  if (lhsEquatable[NovaFlags.EQUATABLE] && rhsEquatable[NovaFlags.EQUATABLE]) {
    return lhsEquatable.equality(rhsEquatable);
  }

  return lhs === rhs;
}
