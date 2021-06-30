import { LineSegment2d } from "../segment";
import { Point2d } from "../point";
import { BinaryHeap, Comparable, RedBlackTree } from "../../core";
import { assert, NovaFlags } from "../../shared";

let sweepLineBase: Point2d | null;
const intersectionSheet = new Map<string, Set<string>>();
const minValue = Math.pow(10, -15);

function intersectionWithSweepLine(segment: SegmentPlaneSweep): Point2d {
  assert(sweepLineBase !== null);

  const top = new Point2d(sweepLineBase.x, 0, "sweep-line-top");
  const bottom = new Point2d(sweepLineBase.x, 1, "sweep-line-bottom");
  const sweepSegment = new LineSegment2d(top, bottom, "sweep-line");
  const sweepSegmentPlaneSweep = new SegmentPlaneSweep(sweepSegment);

  return segmentIntersection(segment, sweepSegmentPlaneSweep);
}

function segmentIntersection(
  lhs: SegmentPlaneSweep,
  rhs: SegmentPlaneSweep
): Point2d {
  const lhsStart = lhs.leftEndPoint;
  const lhsEnd = lhs.rightEndPoint;
  const rhsStart = rhs.leftEndPoint;
  const rhsEnd = rhs.rightEndPoint;
  const [x, y] = lineLineIntersection(
    lhsStart.x,
    lhsStart.y,
    lhsEnd.x,
    lhsEnd.y,
    rhsStart.x,
    rhsStart.y,
    rhsEnd.x,
    rhsEnd.y
  );

  return new Point2d(x, y, "temp");
}

function lineLineIntersection(
  lhsStartX: number,
  lhsStartY: number,
  lhsEndX: number,
  lhsEndY: number,
  rhsStartX: number,
  rhsStartY: number,
  rhsEndX: number,
  rhsEndY: number
): [x: number, y: number] {
  const x =
    ((lhsStartX * lhsEndY - lhsStartY * lhsEndX) * (rhsStartX - rhsEndX) -
      (lhsStartX - lhsEndX) * (rhsStartX * rhsEndY - rhsStartY * rhsEndX)) /
    ((lhsStartX - lhsEndX) * (rhsStartY - rhsEndY) -
      (lhsStartY - lhsEndY) * (rhsStartX - rhsEndX));
  const y =
    ((lhsStartX * lhsEndY - lhsStartY * lhsEndX) * (rhsStartY - rhsEndY) -
      (lhsStartY - lhsEndY) * (rhsStartX * rhsEndY - rhsStartY * rhsEndX)) /
    ((lhsStartX - lhsEndX) * (rhsStartY - rhsEndY) -
      (lhsStartY - lhsEndY) * (rhsStartX - rhsEndX));

  return [x, y];
}

function isSegmentIntersection(
  lhs: SegmentPlaneSweep,
  rhs: SegmentPlaneSweep
): boolean {
  const lhsStart = lhs.leftEndPoint;
  const lhsEnd = lhs.rightEndPoint;
  const rhsStart = rhs.leftEndPoint;
  const rhsEnd = rhs.rightEndPoint;
  const rightBothSideOfLeft =
    toLeft(lhsStart, lhsEnd, rhsStart) !== toLeft(lhsStart, lhsEnd, rhsEnd);
  const leftBothSideOfRight =
    toLeft(rhsStart, rhsEnd, lhsStart) !== toLeft(rhsStart, rhsEnd, lhsEnd);

  return rightBothSideOfLeft && leftBothSideOfRight;
}

class SegmentPlaneSweep implements Comparable {
  readonly [NovaFlags.COMPARABLE] = true;
  readonly [NovaFlags.EQUATABLE] = true;

  id: string;
  leftEndPoint: Point2d;
  rightEndPoint: Point2d;

  constructor(segment: LineSegment2d) {
    const start = segment.start;
    const end = segment.end;

    this.id = segment.id;

    if (start.x === end.x) {
      if (start.y < end.y) {
        this.leftEndPoint = start;
        this.rightEndPoint = end;
      } else {
        this.leftEndPoint = end;
        this.rightEndPoint = start;
      }
    } else {
      if (start.x < end.x) {
        this.leftEndPoint = start;
        this.rightEndPoint = end;
      } else {
        this.leftEndPoint = end;
        this.rightEndPoint = start;
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

enum EndPointType {
  LEFT = "left",
  RIGHT = "right",
  INTERSECTION = "intersection",
}

class EndPoint implements Comparable {
  readonly [NovaFlags.COMPARABLE] = true;
  readonly [NovaFlags.EQUATABLE] = true;

  point: Point2d;
  segment: SegmentPlaneSweep | null = null;
  lhs: SegmentPlaneSweep | null = null;
  rhs: SegmentPlaneSweep | null = null;
  type: EndPointType;

  constructor(point: Point2d, segment: SegmentPlaneSweep, type: EndPointType);

  constructor(point: Point2d, lhs: SegmentPlaneSweep, rhs: SegmentPlaneSweep);

  constructor(arg1: Point2d, arg2: SegmentPlaneSweep, arg3: unknown) {
    this.point = arg1;

    if (arg3 instanceof SegmentPlaneSweep) {
      const lhs: SegmentPlaneSweep = arg2;
      const rhs: SegmentPlaneSweep = arg3;

      this.lhs = lhs;
      this.rhs = rhs;
      this.type = EndPointType.INTERSECTION;
    } else {
      const segment: SegmentPlaneSweep = arg2;
      const type: EndPointType = arg3 as EndPointType;

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

function toLeft(alpha: Point2d, beta: Point2d, gamma: Point2d) {
  return area2(alpha, beta, gamma) > 0;
}

export function planeSweep(segments: LineSegment2d[]): Point2d[] {
  sweepLineBase = null;

  intersectionSheet.clear();

  const segmentPlaneSweepList = segments.map((segment) => {
    return new SegmentPlaneSweep(segment);
  });
  const events: BinaryHeap<EndPoint> = new BinaryHeap();
  const sweepLineStatus: RedBlackTree<SegmentPlaneSweep> = new RedBlackTree();

  segmentPlaneSweepList.forEach((segment) => {
    const left = new EndPoint(segment.leftEndPoint, segment, EndPointType.LEFT);
    const right = new EndPoint(
      segment.rightEndPoint,
      segment,
      EndPointType.RIGHT
    );

    events.push(left);
    events.push(right);
  });

  const ret: Point2d[] = [];

  while (events.size > 0) {
    const endPoint = events.pop();

    assert(endPoint !== undefined);

    if (endPoint.type === EndPointType.INTERSECTION) {
      ret.push(endPoint.point);
    }

    handleEventPoint(endPoint, sweepLineStatus, events);
  }

  return ret;
}

function handleEventPoint(
  endPoint: EndPoint,
  sweepLineStatus: RedBlackTree<SegmentPlaneSweep>,
  events: BinaryHeap<EndPoint>
) {
  if (endPoint.type === EndPointType.RIGHT) {
    handleRight(endPoint, sweepLineStatus, events);
  } else if (endPoint.type === EndPointType.LEFT) {
    handleLeft(endPoint, sweepLineStatus, events);
  } else if (endPoint.type === EndPointType.INTERSECTION) {
    handleIntersection(endPoint, sweepLineStatus, events);
  }
}

function handleIntersection(
  endPoint: EndPoint,
  sweepLineStatus: RedBlackTree<SegmentPlaneSweep>,
  events: BinaryHeap<EndPoint>
) {
  const lhs = endPoint.lhs;
  const rhs = endPoint.rhs;

  assert(lhs !== null);
  assert(rhs !== null);

  const lhsNode = sweepLineStatus.unsafeGetNode(lhs);
  const rhsNode = sweepLineStatus.unsafeGetNode(rhs);

  assert(lhsNode !== null);
  assert(rhsNode !== null);

  const lhsNext = lhsNode.getNext();
  const rhsPrevious = rhsNode.getPrevious();

  sweepLineBase = new Point2d(
    endPoint.point.x - minValue,
    endPoint.point.y,
    endPoint.point.id
  );

  [lhsNode.element, rhsNode.element] = [rhsNode.element, lhsNode.element];

  if (lhsNext !== null) {
    testIntersection(lhsNext.element, lhsNode.element, events);
  }

  if (rhsPrevious !== null) {
    testIntersection(rhsNode.element, rhsPrevious.element, events);
  }
}

function handleLeft(
  endPoint: EndPoint,
  sweepLineStatus: RedBlackTree<SegmentPlaneSweep>,
  events: BinaryHeap<EndPoint>
) {
  sweepLineBase = endPoint.point;

  const segment = endPoint.segment;

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
  endPoint: EndPoint,
  sweepLineStatus: RedBlackTree<SegmentPlaneSweep>,
  events: BinaryHeap<EndPoint>
) {
  sweepLineBase = endPoint.point;

  const segment = endPoint.segment;

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
  lhs: SegmentPlaneSweep,
  rhs: SegmentPlaneSweep,
  events: BinaryHeap<EndPoint>
) {
  if (isSegmentIntersection(lhs, rhs)) {
    const intersection = segmentIntersection(lhs, rhs);
    const endPoint = new EndPoint(intersection, lhs, rhs);
    const lhsSet = intersectionSheet.get(lhs.id);

    if (lhsSet !== undefined) {
      if (lhsSet.has(rhs.id)) {
        return;
      }
    }

    events.push(endPoint);
    updateIntersectionSheet(endPoint);
  }
}

function updateIntersectionSheet(endPoint: EndPoint) {
  assert(endPoint.lhs !== null);
  assert(endPoint.rhs !== null);

  const lhsId = endPoint.lhs.id;
  const rhsId = endPoint.rhs.id;

  if (intersectionSheet.get(lhsId) === undefined) {
    intersectionSheet.set(lhsId, new Set([rhsId]));
  } else {
    intersectionSheet.get(lhsId)?.add(rhsId);
  }

  if (intersectionSheet.get(rhsId) === undefined) {
    intersectionSheet.set(rhsId, new Set([lhsId]));
  } else {
    intersectionSheet.get(rhsId)?.add(lhsId);
  }
}
