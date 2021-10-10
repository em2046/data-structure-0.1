/**
 * Represents a single event in the sweep-line algorithm
 */
export default class SweepEvent {
  point: any;
  from: any[];

  /**
   * Creates new sweep event of a given kind.
   */
  constructor(point, segment) {
    this.point = point;
    if (segment) {
      this.from = [segment];
    }
  }
}
