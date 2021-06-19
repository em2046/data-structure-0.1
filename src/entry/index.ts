import { Comparable } from "../abstract/comparable";
import { NovaFlags } from "../shared/flags";
import { KeyValuePair } from "./pair";

export class Entry<KeyType, ValueType>
  implements Comparable, KeyValuePair<KeyType, ValueType>
{
  readonly [NovaFlags.EQUATABLE]: true = true;
  readonly [NovaFlags.COMPARABLE]: true = true;

  private readonly _key: KeyType;

  constructor({ key, value }: KeyValuePair<KeyType, ValueType>) {
    this._key = key;
    this._value = value;
  }

  private _value: ValueType;

  get value(): ValueType {
    return this._value;
  }

  set value(value: ValueType) {
    this._value = value;
  }

  get key(): KeyType {
    return this._key;
  }

  equality(rhs: Entry<KeyType, ValueType>): boolean {
    return this._key === rhs._key;
  }

  lessThan(rhs: Entry<KeyType, ValueType>): boolean {
    return this._key < rhs._key;
  }
}
