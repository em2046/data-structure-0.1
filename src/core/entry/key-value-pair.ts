/**
 * @public
 * A lightweight type of key-value pair.
 */
export interface KeyValuePair<Key, Value> {
  /**
   * Key.
   */
  key: Key;
  /**
   * Value.
   */
  value: Value;
}
