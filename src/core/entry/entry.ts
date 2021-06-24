import { Comparable } from "../comparable";
import { KeyValuePair } from "./key-value-pair";
import { NovaFlags } from "../../shared";

export class Entry<TKey, TValue>
  implements Comparable, KeyValuePair<TKey, TValue>
{
  readonly [NovaFlags.EQUATABLE]: true = true;
  readonly [NovaFlags.COMPARABLE]: true = true;

  private readonly _key: TKey;

  constructor({ key, value }: KeyValuePair<TKey, TValue>) {
    this._key = key;
    this._value = value;
  }

  private _value: TValue;

  get value(): TValue {
    return this._value;
  }

  set value(value: TValue) {
    this._value = value;
  }

  get key(): TKey {
    return this._key;
  }

  equality(rhs: Entry<TKey, TValue>): boolean {
    return this._key === rhs._key;
  }

  lessThan(rhs: Entry<TKey, TValue>): boolean {
    return this._key < rhs._key;
  }
}
