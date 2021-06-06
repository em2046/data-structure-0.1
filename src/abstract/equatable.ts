import { NovaFlags } from "./flags";

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
