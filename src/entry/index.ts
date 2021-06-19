import { Comparable } from "../abstract/comparable";
import { NovaFlags } from "../shared/flags";
import { KeyValuePair } from "./pair";

export class Entry<T, U> implements Comparable, KeyValuePair<T, U> {
  key: T;
  value: U;

  [NovaFlags.EQUATABLE]: true = true;
  [NovaFlags.COMPARABLE]: true = true;

  constructor({ key, value }: KeyValuePair<T, U>) {
    this.key = key;
    this.value = value;
  }

  equality(rhs: Entry<T, U>): boolean {
    return this.key === rhs.key;
  }

  lessThan(rhs: Entry<T, U>): boolean {
    return this.key < rhs.key;
  }
}
