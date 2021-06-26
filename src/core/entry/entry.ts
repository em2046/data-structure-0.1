import { Comparable, lessThan } from "../comparable";
import { equality } from "../equatable";
import { KeyValuePair } from "./key-value-pair";
import { NovaFlags } from "../../shared";

/**
 * @public
 * A comparable container of key-value pair.
 */
export class Entry<Key, Value> implements Comparable, KeyValuePair<Key, Value> {
  /**
   * Equatable flag.
   */
  readonly [NovaFlags.EQUATABLE] = true;

  /**
   * Comparable flag.
   */
  readonly [NovaFlags.COMPARABLE] = true;

  private readonly _key: Key;

  /**
   * Initialization from an existing key-value pair.
   *
   * @param pair - A key-value pair.
   */
  constructor(pair: KeyValuePair<Key, Value>) {
    this._key = pair.key;
    this._value = pair.value;
  }

  private _value: Value;

  /**
   * Get / Set the value of the entry.
   */
  get value(): Value {
    return this._value;
  }

  set value(newValue: Value) {
    this._value = newValue;
  }

  /**
   * Get the key of the entry.
   */
  get key(): Key {
    return this._key;
  }

  /**
   * Returns a Boolean value indicating whether two entry are equal.
   *
   * @param rhs - Another entry to compare.
   */
  equality(rhs: Entry<Key, Value>): boolean {
    return equality(this.key, rhs.key);
  }

  /**
   * Returns a Boolean value indicating whether the entry of `this`
   * is less than of the first argument.
   *
   * @param rhs - Another entry to compare.
   */
  lessThan(rhs: Entry<Key, Value>): boolean {
    return lessThan(this.key, rhs.key);
  }
}
