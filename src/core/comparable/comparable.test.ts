import {
  Comparable,
  greaterThan,
  greaterThanOrEqual,
  lessThanOrEqual,
} from "./comparable";
import { NovaFlags } from "../../shared";

class Wrap implements Comparable {
  readonly [NovaFlags.EQUATABLE] = true;
  readonly [NovaFlags.COMPARABLE] = true;

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

  lessThan(rhs: this): boolean {
    return this.value < rhs.value;
  }

  lessThanOrEqual(rhs: this): boolean {
    return this.value <= rhs.value;
  }

  greaterThan(rhs: this): boolean {
    return this.value > rhs.value;
  }

  greaterThanOrEqual(rhs: this): boolean {
    return this.value >= rhs.value;
  }
}

describe("comparable", () => {
  test("basic", () => {
    expect(lessThanOrEqual(1, 2)).toBeTruthy();
    expect(lessThanOrEqual(2, 2)).toBeTruthy();

    expect(greaterThan(2, 1)).toBeTruthy();
    expect(greaterThanOrEqual(2, 1)).toBeTruthy();
    expect(greaterThanOrEqual(2, 2)).toBeTruthy();

    const one = new Wrap(1);
    const two = new Wrap(2);

    expect(lessThanOrEqual(one, two)).toBeTruthy();
    expect(lessThanOrEqual(two, two)).toBeTruthy();

    expect(greaterThan(two, one)).toBeTruthy();
    expect(greaterThanOrEqual(two, one)).toBeTruthy();
    expect(greaterThanOrEqual(two, two)).toBeTruthy();
  });
});
