/**
 * @public
 * A lightweight type of key-value pair.
 */
export interface KeyValuePair<Key, Value> {
  /**
   * Key of the key-value pair.
   */
  key: Key;

  /**
   * Value of the key-value pair.
   */
  value: Value;
}
