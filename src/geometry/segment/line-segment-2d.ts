import { Point2d } from "../point";
import { Identifiable } from "../../core";

/**
 * @public
 * A line segment in two-dimensional Euclidean space.
 */
export class LineSegment2d implements Identifiable {
  /**
   * An end point
   */
  readonly start: Point2d;

  /**
   * Another end point
   */
  readonly end: Point2d;

  /**
   * The stable identity of the line segment associated with this instance.
   */
  readonly id: string;

  constructor(start: Point2d, end: Point2d, id: string) {
    this.start = start;
    this.end = end;
    this.id = id;
  }
}
