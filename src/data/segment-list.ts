import { Segment2d } from "../geometry";
import { pointList } from "./point-list";

function getList() {
  const list: Segment2d[] = [];
  const len = pointList.length;

  for (let i = 0; i < len; i++) {
    if (i % 5 !== 0) {
      continue;
    }

    const start = pointList[i];
    const end = pointList[(i + 1) % len];

    list.push(new Segment2d(start, end, `${start.id}-${end.id}`));
  }

  return list;
}

export const segmentList = getList();
