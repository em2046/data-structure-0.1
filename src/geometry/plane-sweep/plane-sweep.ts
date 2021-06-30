import { LineSegment2d } from "../segment";
import { Point2d } from "../point";
import { BinaryHeap, Comparable, RedBlackTree } from "../../core";
import { assert, NovaFlags } from "../../shared";

let sweepLineBase: Point2d | null;
const intersectionCache = new Map<string, Set<string>>();
const minValue = Math.pow(10, -15);

function intersectionWithSweepLine(segment: StateSegment): Point2d {
  assert(sweepLineBase !== null);

  const top = new Point2d(sweepLineBase.x, 0, "sweep-line-top");
  const bottom = new Point2d(sweepLineBase.x, 1, "sweep-line-bottom");
  const sweepLine = new LineSegment2d(top, bottom, "sweep-line");
  const stateSegment = new StateSegment(sweepLine);

  return segmentIntersection(segment, stateSegment);
}

function segmentIntersection(lhs: StateSegment, rhs: StateSegment): Point2d {
  const lhsLeft = lhs.leftEvent;
  const lhsRight = lhs.rightEvent;
  const rhsLeft = rhs.leftEvent;
  const rhsRight = rhs.rightEvent;
  const [x, y] = lineLineIntersection(
    lhsLeft.x,
    lhsLeft.y,
    lhsRight.x,
    lhsRight.y,
    rhsLeft.x,
    rhsLeft.y,
    rhsRight.x,
    rhsRight.y
  );

  return new Point2d(x, y, `${lhs.id}x${rhs.id}`);
}

/**
 * Reference:
 * https://en.wikipedia.org/wiki/Line–line_intersection
 */
function lineLineIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): [x: number, y: number] {
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const x =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;
  const y =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;

  return [x, y];
}

function hasIntersection(lhs: StateSegment, rhs: StateSegment): boolean {
  const lhsLeft = lhs.leftEvent;
  const lhsRight = lhs.rightEvent;
  const rhsLeft = rhs.leftEvent;
  const rhsRight = rhs.rightEvent;
  const rightBothSideOfLeft =
    isToLeft(lhsLeft, lhsRight, rhsLeft) !==
    isToLeft(lhsLeft, lhsRight, rhsRight);
  const leftBothSideOfRight =
    isToLeft(rhsLeft, rhsRight, lhsLeft) !==
    isToLeft(rhsLeft, rhsRight, lhsRight);

  return rightBothSideOfLeft && leftBothSideOfRight;
}

class StateSegment implements Comparable {
  readonly [NovaFlags.COMPARABLE] = true;
  readonly [NovaFlags.EQUATABLE] = true;

  id: string;
  leftEvent: Point2d;
  rightEvent: Point2d;

  constructor(segment: LineSegment2d) {
    const start = segment.start;
    const end = segment.end;

    this.id = segment.id;

    if (start.x === end.x) {
      if (start.y < end.y) {
        this.leftEvent = start;
        this.rightEvent = end;
      } else {
        this.leftEvent = end;
        this.rightEvent = start;
      }
    } else {
      if (start.x < end.x) {
        this.leftEvent = start;
        this.rightEvent = end;
      } else {
        this.leftEvent = end;
        this.rightEvent = start;
      }
    }
  }

  equality(rhs: this): boolean {
    const lhsIntersection = intersectionWithSweepLine(this);
    const rhsIntersection = intersectionWithSweepLine(rhs);

    return lhsIntersection.y === rhsIntersection.y;
  }

  lessThan(rhs: this): boolean {
    const lhsIntersection = intersectionWithSweepLine(this);
    const rhsIntersection = intersectionWithSweepLine(rhs);

    return lhsIntersection.y < rhsIntersection.y;
  }
}

enum EventPointType {
  LEFT = "left",
  RIGHT = "right",
  INTERSECTION = "intersection",
}

class EventPoint implements Comparable {
  readonly [NovaFlags.COMPARABLE] = true;
  readonly [NovaFlags.EQUATABLE] = true;

  point: Point2d;
  segment: StateSegment | null = null;
  lhs: StateSegment | null = null;
  rhs: StateSegment | null = null;
  type: EventPointType;

  constructor(endPoint: Point2d, state: StateSegment, type: EventPointType);

  constructor(intersectionPoint: Point2d, lhs: StateSegment, rhs: StateSegment);

  constructor(point: Point2d, arg2: StateSegment, arg3: unknown) {
    this.point = point;

    if (arg3 instanceof StateSegment) {
      const lhs: StateSegment = arg2;
      const rhs: StateSegment = arg3;

      this.lhs = lhs;
      this.rhs = rhs;
      this.type = EventPointType.INTERSECTION;
    } else {
      const segment: StateSegment = arg2;
      const type: EventPointType = arg3 as EventPointType;

      this.segment = segment;
      this.type = type;
    }
  }

  equality(rhs: this): boolean {
    return this.point.x === rhs.point.x;
  }

  lessThan(rhs: this): boolean {
    if (this.point.x === rhs.point.x) {
      return this.point.y > rhs.point.y;
    } else {
      return this.point.x > rhs.point.x;
    }
  }
}

function area2(alpha: Point2d, beta: Point2d, gamma: Point2d) {
  return (
    alpha.x * beta.y -
    alpha.y * beta.x +
    beta.x * gamma.y -
    beta.y * gamma.x +
    gamma.x * alpha.y -
    gamma.y * alpha.x
  );
}

function isToLeft(alpha: Point2d, beta: Point2d, gamma: Point2d) {
  return area2(alpha, beta, gamma) > 0;
}

/**
 * @public
 * Bentley–Ottmann algorithm.
 *
 * It finds the intersection points of line segments.
 *
 * Reference:
 * https://en.wikipedia.org/wiki/Multiple_line_segment_intersection
 *
 * @param segments - Line segments
 */
export function planeSweep(segments: LineSegment2d[]): Point2d[] {
  sweepLineBase = null;

  intersectionCache.clear();

  const stateSegments = segments.map((segment) => {
    return new StateSegment(segment);
  });
  const events: BinaryHeap<EventPoint> = new BinaryHeap();
  const sweepLineStatus: RedBlackTree<StateSegment> = new RedBlackTree();

  stateSegments.forEach((stateSegment) => {
    const left = new EventPoint(
      stateSegment.leftEvent,
      stateSegment,
      EventPointType.LEFT
    );
    const right = new EventPoint(
      stateSegment.rightEvent,
      stateSegment,
      EventPointType.RIGHT
    );

    events.push(left);
    events.push(right);
  });

  const intersections: Point2d[] = [];

  while (events.size > 0) {
    const event = events.pop();

    assert(event !== undefined);

    if (event.type === EventPointType.INTERSECTION) {
      intersections.push(event.point);
    }

    handleEventPoint(event, sweepLineStatus, events);
  }

  return intersections;
}

function handleEventPoint(
  event: EventPoint,
  sweepLineStatus: RedBlackTree<StateSegment>,
  events: BinaryHeap<EventPoint>
) {
  if (event.type === EventPointType.RIGHT) {
    handleRight(event, sweepLineStatus, events);
  } else if (event.type === EventPointType.LEFT) {
    handleLeft(event, sweepLineStatus, events);
  } else if (event.type === EventPointType.INTERSECTION) {
    handleIntersection(event, sweepLineStatus, events);
  }
}

function handleIntersection(
  event: EventPoint,
  sweepLineStatus: RedBlackTree<StateSegment>,
  events: BinaryHeap<EventPoint>
) {
  const lhs = event.lhs;
  const rhs = event.rhs;

  assert(lhs !== null);
  assert(rhs !== null);

  const lhsNode = sweepLineStatus.unsafeGetNode(lhs);
  const rhsNode = sweepLineStatus.unsafeGetNode(rhs);

  assert(lhsNode !== null);
  assert(rhsNode !== null);

  const lhsNext = lhsNode.getNext();
  const rhsPrevious = rhsNode.getPrevious();
  const point = event.point;

  sweepLineBase = new Point2d(point.x - minValue, point.y, point.id);

  [lhsNode.element, rhsNode.element] = [rhsNode.element, lhsNode.element];

  if (lhsNext !== null) {
    testIntersection(lhsNext.element, lhsNode.element, events);
  }

  if (rhsPrevious !== null) {
    testIntersection(rhsNode.element, rhsPrevious.element, events);
  }
}

function handleLeft(
  event: EventPoint,
  sweepLineStatus: RedBlackTree<StateSegment>,
  events: BinaryHeap<EventPoint>
) {
  sweepLineBase = event.point;

  const segment = event.segment;

  assert(segment !== null);
  const node = sweepLineStatus.unsafeGetNode(segment);

  assert(node !== null);

  const next = node.getNext();
  const previous = node.getPrevious();

  if (next !== null && previous !== null) {
    const nextSegment = next.element;
    const previousSegment = previous.element;

    sweepLineStatus.delete(segment);

    testIntersection(nextSegment, previousSegment, events);
  } else {
    sweepLineStatus.delete(segment);
  }
}

function handleRight(
  event: EventPoint,
  sweepLineStatus: RedBlackTree<StateSegment>,
  events: BinaryHeap<EventPoint>
) {
  sweepLineBase = event.point;

  const segment = event.segment;

  assert(segment !== null);
  sweepLineStatus.add(segment);

  const node = sweepLineStatus.unsafeGetNode(segment);

  assert(node !== null);

  const next = node.getNext();

  if (next !== null) {
    const nextSegment = next.element;

    testIntersection(nextSegment, segment, events);
  }

  const previous = node.getPrevious();

  if (previous !== null) {
    const previousSegment = previous.element;

    testIntersection(segment, previousSegment, events);
  }
}

function testIntersection(
  lhs: StateSegment,
  rhs: StateSegment,
  events: BinaryHeap<EventPoint>
) {
  if (hasIntersection(lhs, rhs)) {
    const intersection = segmentIntersection(lhs, rhs);
    const event = new EventPoint(intersection, lhs, rhs);
    const lhsSet = intersectionCache.get(lhs.id);

    if (lhsSet !== undefined) {
      if (lhsSet.has(rhs.id)) {
        return;
      }
    }

    events.push(event);
    updateIntersectionCache(event);
  }
}

function updateIntersectionCache(event: EventPoint) {
  assert(event.lhs !== null);
  assert(event.rhs !== null);

  const lhsId = event.lhs.id;
  const rhsId = event.rhs.id;

  if (intersectionCache.get(lhsId) === undefined) {
    intersectionCache.set(lhsId, new Set([rhsId]));
  } else {
    intersectionCache.get(lhsId)?.add(rhsId);
  }

  if (intersectionCache.get(rhsId) === undefined) {
    intersectionCache.set(rhsId, new Set([lhsId]));
  } else {
    intersectionCache.get(rhsId)?.add(lhsId);
  }
}
