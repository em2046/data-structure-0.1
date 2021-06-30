import { LineSegment2d } from "../geometry";
import { pointList } from "./point-list";

export function getSegmentList(step = 5): LineSegment2d[] {
  const list: LineSegment2d[] = [];
  const len = pointList.length;

  for (let i = 0; i < len; i++) {
    if (i % step !== 0) {
      continue;
    }

    const start = pointList[i];
    const end = pointList[(i + 1) % len];
    const id = `${start.id}-${end.id}`;

    list.push(new LineSegment2d(start, end, id));
  }

  return list;
}

export const segmentList = getSegmentList();
