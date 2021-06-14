import { NovaFlags } from "./flags";

export interface Equatable {
  equality: (rhs: Equatable) => boolean;
  [NovaFlags.EQUATABLE]: true;
}

export function equality<T>(lhs: T, rhs: T): boolean {
  const lhsEquatable = lhs as unknown as Equatable;
  const rhsEquatable = rhs as unknown as Equatable;

  if (lhsEquatable[NovaFlags.EQUATABLE] && rhsEquatable[NovaFlags.EQUATABLE]) {
    return lhsEquatable.equality(rhsEquatable);
  }

  return lhs === rhs;
}
