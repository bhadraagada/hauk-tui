import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  clamp,
  stableId,
  resetIdCounter,
  memo,
  deepEqual,
  debounce,
  throttle,
  wrapIndex,
  range,
  truncate,
  pad,
  noop,
} from "./utils";

describe("clamp", () => {
  it("should return value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("should return min when value is below", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("should return max when value is above", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("should handle equal min and max", () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(3, 5, 5)).toBe(5);
    expect(clamp(7, 5, 5)).toBe(5);
  });

  it("should handle negative ranges", () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-15, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });
});

describe("stableId", () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it("should generate unique IDs", () => {
    const id1 = stableId();
    const id2 = stableId();
    expect(id1).not.toBe(id2);
  });

  it("should use default prefix", () => {
    const id = stableId();
    expect(id.startsWith("hauk-")).toBe(true);
  });

  it("should use custom prefix", () => {
    const id = stableId("custom");
    expect(id.startsWith("custom-")).toBe(true);
  });

  it("should increment counter", () => {
    const id1 = stableId();
    const id2 = stableId();
    expect(id1).toBe("hauk-1");
    expect(id2).toBe("hauk-2");
  });
});

describe("resetIdCounter", () => {
  it("should reset the ID counter", () => {
    stableId();
    stableId();
    resetIdCounter();
    const id = stableId();
    expect(id).toBe("hauk-1");
  });
});

describe("memo", () => {
  it("should cache results", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memo(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should cache different arguments separately", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memo(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should work with string arguments", () => {
    const fn = vi.fn((s: string) => s.toUpperCase());
    const memoized = memo(fn);

    expect(memoized("hello")).toBe("HELLO");
    expect(memoized("hello")).toBe("HELLO");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("deepEqual", () => {
  it("should return true for identical primitives", () => {
    expect(deepEqual(5, 5)).toBe(true);
    expect(deepEqual("hello", "hello")).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it("should return false for different primitives", () => {
    expect(deepEqual(5, 10)).toBe(false);
    expect(deepEqual("hello", "world")).toBe(false);
  });

  it("should compare arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("should compare objects", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("should compare nested structures", () => {
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 3] } })).toBe(false);
  });

  it("should handle null", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });

  it("should handle mixed types", () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should delay execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should reset timer on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("arg1", "arg2");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("arg1", "arg2");
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should execute immediately on first call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should throttle subsequent calls", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should allow calls after throttle period", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("wrapIndex", () => {
  it("should wrap positive overflow", () => {
    expect(wrapIndex(5, 3)).toBe(2);
    expect(wrapIndex(3, 3)).toBe(0);
  });

  it("should wrap negative underflow", () => {
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(-2, 3)).toBe(1);
  });

  it("should return 0 for empty length", () => {
    expect(wrapIndex(5, 0)).toBe(0);
    expect(wrapIndex(-1, 0)).toBe(0);
  });

  it("should handle index within bounds", () => {
    expect(wrapIndex(0, 5)).toBe(0);
    expect(wrapIndex(2, 5)).toBe(2);
    expect(wrapIndex(4, 5)).toBe(4);
  });
});

describe("range", () => {
  it("should generate ascending range", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("should handle custom step", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it("should generate descending range", () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
  });

  it("should return empty array for invalid range", () => {
    expect(range(5, 0, 1)).toEqual([]);
    expect(range(0, 5, -1)).toEqual([]);
  });

  it("should handle single element range", () => {
    expect(range(0, 1)).toEqual([0]);
  });
});

describe("truncate", () => {
  it("should not truncate short text", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate long text with ellipsis", () => {
    expect(truncate("hello world", 8)).toBe("hello w…");
  });

  it("should use custom ellipsis", () => {
    expect(truncate("hello world", 8, "...")).toBe("hello...");
  });

  it("should handle exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("should handle very short max length", () => {
    expect(truncate("hello", 2)).toBe("h…");
  });
});

describe("pad", () => {
  it("should pad left by default", () => {
    expect(pad("hi", 5)).toBe("hi   ");
  });

  it("should pad right", () => {
    expect(pad("hi", 5, "right")).toBe("   hi");
  });

  it("should pad center", () => {
    expect(pad("hi", 6, "center")).toBe("  hi  ");
    expect(pad("hi", 5, "center")).toBe(" hi  ");
  });

  it("should use custom character", () => {
    expect(pad("hi", 5, "left", "-")).toBe("hi---");
  });

  it("should not pad if text is already long enough", () => {
    expect(pad("hello", 3)).toBe("hello");
  });
});

describe("noop", () => {
  it("should do nothing and return undefined", () => {
    expect(noop()).toBeUndefined();
  });
});
