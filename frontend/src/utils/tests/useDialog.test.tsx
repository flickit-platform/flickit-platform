import { act, renderHook } from "@testing-library/react";
import useDialog from "../useDialog";
import { describe, expect, it } from "vitest";

describe("useDialog hook", () => {
  it("should change open state to true", () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.openDialog({});
    });
    expect(result.current.open).toBe(true);
  });
  it("should not set context item", () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.openDialog({ item: "test" });
    });
    expect(result.current.context).toBe(undefined);
  });
  it("should set context to {type:'test'}", () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.openDialog({ type: "test" });
    });
    expect(result.current.context).toEqual({ type: "test" });
  });
  it("should change open state to false", () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.onClose();
    });
    expect(result.current.open).toBe(false);
  });
});
