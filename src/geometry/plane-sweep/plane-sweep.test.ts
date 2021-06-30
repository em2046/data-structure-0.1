import { planeSweep } from "./plane-sweep";
import { segmentList } from "../../data/segment-list";

describe("plane-sweep", () => {
  test("basic", () => {
    const point2ds = planeSweep(segmentList);

    expect(point2ds.length).toEqual(66);
  });
});
