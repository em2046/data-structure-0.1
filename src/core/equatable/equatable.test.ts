import { equality, Equatable, inequality } from "./equatable";
import { NovaFlags } from "../../shared";

class Wrap implements Equatable {
  readonly [NovaFlags.EQUATABLE] = true;

  value: number;

  constructor(value: number) {
    this.value = value;
  }

  equality(rhs: this): boolean {
    return this.value === rhs.value;
  }

  inequality(rhs: this): boolean {
    return this.value !== rhs.value;
  }
}

class Point implements Equatable {
  readonly [NovaFlags.EQUATABLE] = true;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equality(rhs: this): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }
}

describe("equatable", () => {
  test("basic", () => {
    expect(equality(1 + 1, 2)).toBeTruthy();
    expect(inequality(1, 2)).toBeTruthy();
    expect(inequality(1 + 1, 2)).toBeFalsy();

    const one = new Wrap(1);
    const two = new Wrap(2);

    expect(equality(one, two)).toBeFalsy();
    expect(inequality(one, two)).toBeTruthy();
    expect(inequality(one, one)).toBeFalsy();
  });

  test("point", () => {
    const a = new Point(1, 2);
    const b = new Point(2, 3);

    expect(inequality(a, b)).toBeTruthy();
  });
});
