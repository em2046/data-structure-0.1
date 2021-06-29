import { Point2d } from "../point";

export class Segment2d {
  readonly start: Point2d;
  readonly end: Point2d;

  constructor(start: Point2d, end: Point2d) {
    this.start = start;
    this.end = end;
  }
}
