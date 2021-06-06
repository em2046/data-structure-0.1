import { BinaryHeap } from "./index";

describe("binary-heap", () => {
  test("init", () => {
    let origin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let binaryHeap = new BinaryHeap();
    expect(binaryHeap.peek()).toBeUndefined();

    origin.forEach((value) => {
      binaryHeap.push(value);
    });

    let len = origin.length;
    for (let i = 0; i < len; i++) {
      expect(binaryHeap.pop()).toEqual(result[i]);
    }
  });

  test("random", () => {
    let origin = [
      18, 73, 67, 64, 58, 71, 76, 5, 61, 27, 96, 95, 4, 32, 99, 72, 37, 87, 90,
      48, 70, 56, 57, 28, 74, 3, 41, 39, 59, 38, 94, 13, 35, 89, 7, 85, 81, 10,
      83, 49, 12, 97, 21, 15, 50, 65, 40, 55, 98, 86, 2, 100, 63, 75, 14, 9, 62,
      43, 69, 19, 0, 53, 80, 33, 47, 44,
    ];
    let result = [...origin].sort((a, b) => {
      return a - b;
    });

    let binaryHeap = new BinaryHeap();

    origin.forEach((value) => {
      binaryHeap.push(value);
    });

    let len = origin.length;
    for (let i = 0; i < len; i++) {
      expect(binaryHeap.pop()).toEqual(result[i]);
    }
  });
});