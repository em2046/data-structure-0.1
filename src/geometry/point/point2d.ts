import { Identifiable } from "../../core";

export class Point2d implements Identifiable {
  readonly x: number;
  readonly y: number;
  readonly id: string;

  constructor(x: number, y: number, id: string) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}
