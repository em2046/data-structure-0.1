/***
 * Reference
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 */

/**
 * @public
 * Assertion function.
 *
 * That throw an error if something unexpected happened.
 * @param condition - Expected.
 * @param msg - Error message.
 */
export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
