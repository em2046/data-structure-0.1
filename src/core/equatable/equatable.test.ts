import { NovaFlags } from "../../shared";
import { equality, Equatable, inequality } from "./equatable";

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
});
