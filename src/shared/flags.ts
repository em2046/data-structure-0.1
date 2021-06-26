/***
 * Reference:
 * https://github.com/vuejs/vue-next/blob/870f2a7ba35245fd8c008d2ff666ea130a7e4704/packages/reactivity/src/reactive.ts
 */

/**
 * @public
 * Indicating abilities.
 */
export const enum NovaFlags {
  /**
   * Indicating equatable.
   */
  EQUATABLE = "__nova_equatable",

  /**
   * Indicating comparable.
   */
  COMPARABLE = "__nova_comparable",
}
