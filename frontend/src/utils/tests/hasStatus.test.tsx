import { assert, expect, test } from "vitest";
import hasStatus from "../hasStatus";

test("has status must return boolean", () => {
  expect(hasStatus("GOOD")).toBe(true);
});
