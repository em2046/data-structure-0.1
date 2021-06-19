export function assert(
  value: boolean,
  message?: string | Error
): asserts value {
  if (!value) {
    throw message ?? new Error();
  }
}
