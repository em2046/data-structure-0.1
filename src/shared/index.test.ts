import { assert } from "./assert";

describe("shared", () => {
  test("assert", () => {
    expect(() => {
      assert(false);
    }).toThrow();
  });
});
