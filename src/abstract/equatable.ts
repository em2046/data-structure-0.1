import { NovaFlags } from "./flags";

export interface Equatable {
  equality: (rhs: Equatable) => boolean;
  [NovaFlags.EQUATABLE]: true;
}

export function equality<T>(lhs: T, rhs: T): boolean {
  let lhsEquatable = lhs as unknown as Equatable;
  let rhsEquatable = rhs as unknown as Equatable;

  if (lhsEquatable[NovaFlags.EQUATABLE] && rhsEquatable[NovaFlags.EQUATABLE]) {
    return lhsEquatable.equality(rhsEquatable);
  }

  return lhs == rhs;
}
