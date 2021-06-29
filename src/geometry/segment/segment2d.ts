import { Point2d } from "../point";
import { Identifiable } from "../../core";

export class Segment2d implements Identifiable {
  readonly start: Point2d;
  readonly end: Point2d;
  readonly id: string;

  constructor(start: Point2d, end: Point2d, id: string) {
    this.start = start;
    this.end = end;
    this.id = id;
  }
}
