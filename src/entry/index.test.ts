import { Entry } from "./index";
import {
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
} from "../abstract/comparable";

describe("entry", () => {
  test("init", () => {
    type EntryNumber = Entry<number, unknown>;

    const alpha: EntryNumber = new Entry({
      key: 1,
      value: {
        foo: "bar",
      },
    });
    const beta: EntryNumber = new Entry({
      key: 2,
      value: 100n,
    });
    const gamma: EntryNumber = new Entry({
      key: 3,
      value: Symbol("text"),
    });

    expect(lessThan(alpha, beta)).toBeTruthy();
    expect(lessThan(beta, gamma)).toBeTruthy();
    expect(lessThanOrEqual(beta, beta)).toBeTruthy();
    expect(lessThanOrEqual(beta, gamma)).toBeTruthy();

    expect(greaterThan(gamma, alpha)).toBeTruthy();
    expect(greaterThanOrEqual(alpha, alpha)).toBeTruthy();
    expect(greaterThanOrEqual(gamma, alpha)).toBeTruthy();
  });
});
