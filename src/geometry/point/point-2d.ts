import { Identifiable } from "../../core";

/**
 * @public
 * A point in two-dimensional Euclidean space.
 */
export class Point2d implements Identifiable {
  /**
   * represents the horizontal
   */
  readonly x: number;

  /**
   * represents the vertical
   */
  readonly y: number;

  /**
   * The stable identity of the point associated with this instance.
   */
  readonly id: string;

  constructor(x: number, y: number, id: string) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}
