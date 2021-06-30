import { planeSweep } from "./plane-sweep";
import { segmentList } from "../../data/segment-list";

describe("plane-sweep", () => {
  test("basic", () => {
    const points = planeSweep(segmentList);

    expect(points.length).toEqual(66);
  });
});
