/***
 * Reference:
 * https://github.com/apple/swift/blob/53fe241c0e8622ac4c62a9c147626d4eda9c0e6a/stdlib/public/core/Identifiable.swift
 */

/**
 * @public
 * A class of types whose instances hold the value of an entity with stable
 * identity.
 */
export interface Identifiable {
  /**
   * The stable identity of the entity associated with this instance.
   */
  readonly id: unknown;
}
