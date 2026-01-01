import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createFocusState,
  FocusManager,
  createFocusManager,
} from "./focus";

describe("createFocusState", () => {
  it("should create default focus state", () => {
    const state = createFocusState();
    expect(state.focusedId).toBeNull();
    expect(state.isActive).toBe(true);
  });

  it("should create focus state with initial focus", () => {
    const state = createFocusState("element-1");
    expect(state.focusedId).toBe("element-1");
    expect(state.isActive).toBe(true);
  });
});

describe("FocusManager", () => {
  let manager: FocusManager;

  beforeEach(() => {
    manager = new FocusManager();
  });

  describe("register", () => {
    it("should register elements", () => {
      manager.register("a");
      manager.register("b");
      expect(manager.getElements()).toContain("a");
      expect(manager.getElements()).toContain("b");
    });

    it("should auto-focus first registered element", () => {
      manager.register("first");
      expect(manager.getState().focusedId).toBe("first");
    });

    it("should not duplicate elements", () => {
      manager.register("a");
      manager.register("a");
      expect(manager.getElements().length).toBe(1);
    });

    it("should not change focus when registering additional elements", () => {
      manager.register("first");
      manager.register("second");
      expect(manager.getState().focusedId).toBe("first");
    });
  });

  describe("unregister", () => {
    it("should remove element", () => {
      manager.register("a");
      manager.register("b");
      manager.unregister("a");
      expect(manager.getElements()).not.toContain("a");
      expect(manager.getElements()).toContain("b");
    });

    it("should move focus when focused element is unregistered", () => {
      manager.register("a");
      manager.register("b");
      manager.focus("a");
      manager.unregister("a");
      expect(manager.getState().focusedId).toBe("b");
    });

    it("should set focus to null when last element is unregistered", () => {
      manager.register("a");
      manager.unregister("a");
      expect(manager.getState().focusedId).toBeNull();
    });

    it("should handle unregistering non-existent element", () => {
      manager.register("a");
      manager.unregister("non-existent");
      expect(manager.getElements()).toContain("a");
    });
  });

  describe("focus", () => {
    it("should focus registered element", () => {
      manager.register("a");
      manager.register("b");
      manager.focus("b");
      expect(manager.getState().focusedId).toBe("b");
    });

    it("should not focus unregistered element", () => {
      manager.register("a");
      manager.focus("non-existent");
      expect(manager.getState().focusedId).toBe("a");
    });

    it("should notify listeners on focus change", () => {
      const listener = vi.fn();
      manager.register("a");
      manager.register("b");
      manager.subscribe(listener);
      
      listener.mockClear(); // Clear the subscription notification
      manager.focus("b");
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ focusedId: "b" }));
    });

    it("should not notify when focusing already focused element", () => {
      manager.register("a");
      const listener = vi.fn();
      manager.subscribe(listener);
      
      listener.mockClear();
      manager.focus("a"); // Already focused
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("focusNext", () => {
    it("should move to next element", () => {
      manager.register("a");
      manager.register("b");
      manager.register("c");
      manager.focus("a");
      
      manager.focusNext();
      expect(manager.getState().focusedId).toBe("b");
    });

    it("should wrap to first element by default", () => {
      manager.register("a");
      manager.register("b");
      manager.focus("b");
      
      manager.focusNext();
      expect(manager.getState().focusedId).toBe("a");
    });

    it("should not wrap when wrap is false", () => {
      const noWrapManager = new FocusManager({ wrap: false });
      noWrapManager.register("a");
      noWrapManager.register("b");
      noWrapManager.focus("b");
      
      noWrapManager.focusNext();
      expect(noWrapManager.getState().focusedId).toBe("b");
    });

    it("should handle empty elements", () => {
      manager.focusNext();
      expect(manager.getState().focusedId).toBeNull();
    });

    it("should focus first element when nothing is focused", () => {
      const freshManager = new FocusManager();
      freshManager.register("a");
      freshManager.register("b");
      // Manually clear focus for testing
      (freshManager as any).state.focusedId = null;
      
      freshManager.focusNext();
      expect(freshManager.getState().focusedId).toBe("a");
    });
  });

  describe("focusPrev", () => {
    it("should move to previous element", () => {
      manager.register("a");
      manager.register("b");
      manager.register("c");
      manager.focus("c");
      
      manager.focusPrev();
      expect(manager.getState().focusedId).toBe("b");
    });

    it("should wrap to last element by default", () => {
      manager.register("a");
      manager.register("b");
      manager.focus("a");
      
      manager.focusPrev();
      expect(manager.getState().focusedId).toBe("b");
    });

    it("should not wrap when wrap is false", () => {
      const noWrapManager = new FocusManager({ wrap: false });
      noWrapManager.register("a");
      noWrapManager.register("b");
      noWrapManager.focus("a");
      
      noWrapManager.focusPrev();
      expect(noWrapManager.getState().focusedId).toBe("a");
    });

    it("should handle empty elements", () => {
      manager.focusPrev();
      expect(manager.getState().focusedId).toBeNull();
    });

    it("should focus last element when nothing is focused", () => {
      const freshManager = new FocusManager();
      freshManager.register("a");
      freshManager.register("b");
      // Manually clear focus for testing
      (freshManager as any).state.focusedId = null;
      
      freshManager.focusPrev();
      expect(freshManager.getState().focusedId).toBe("b");
    });
  });

  describe("isFocused", () => {
    it("should return true for focused element", () => {
      manager.register("a");
      expect(manager.isFocused("a")).toBe(true);
    });

    it("should return false for non-focused element", () => {
      manager.register("a");
      manager.register("b");
      expect(manager.isFocused("b")).toBe(false);
    });

    it("should return false for unregistered element", () => {
      expect(manager.isFocused("non-existent")).toBe(false);
    });
  });

  describe("setActive", () => {
    it("should set active state", () => {
      expect(manager.getState().isActive).toBe(true);
      
      manager.setActive(false);
      expect(manager.getState().isActive).toBe(false);
    });

    it("should notify listeners on active change", () => {
      const listener = vi.fn();
      manager.subscribe(listener);
      
      listener.mockClear();
      manager.setActive(false);
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
    });

    it("should not notify when setting same active state", () => {
      const listener = vi.fn();
      manager.subscribe(listener);
      
      listener.mockClear();
      manager.setActive(true); // Already true
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("subscribe", () => {
    it("should add listener", () => {
      const listener = vi.fn();
      manager.subscribe(listener);
      manager.register("a");
      
      expect(listener).toHaveBeenCalled();
    });

    it("should return unsubscribe function", () => {
      const listener = vi.fn();
      const unsubscribe = manager.subscribe(listener);
      
      listener.mockClear();
      unsubscribe();
      manager.register("b");
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("toContext", () => {
    it("should return focus context object", () => {
      const context = manager.toContext();
      
      expect(context.state).toBeDefined();
      expect(context.register).toBeInstanceOf(Function);
      expect(context.unregister).toBeInstanceOf(Function);
      expect(context.focus).toBeInstanceOf(Function);
      expect(context.focusNext).toBeInstanceOf(Function);
      expect(context.focusPrev).toBeInstanceOf(Function);
      expect(context.isFocused).toBeInstanceOf(Function);
    });

    it("should have bound methods", () => {
      const context = manager.toContext();
      
      context.register("a");
      expect(manager.getElements()).toContain("a");
      
      context.register("b");
      context.focusNext();
      expect(context.isFocused("b")).toBe(true);
    });
  });
});

describe("createFocusManager", () => {
  it("should create a FocusManager instance", () => {
    const manager = createFocusManager();
    expect(manager).toBeInstanceOf(FocusManager);
  });

  it("should pass options to FocusManager", () => {
    const manager = createFocusManager({ wrap: false, initialFocusId: "initial" });
    expect(manager.getState().focusedId).toBe("initial");
  });
});

describe("FocusManager with initial focus", () => {
  it("should start with specified initial focus", () => {
    const manager = new FocusManager({ initialFocusId: "preset" });
    expect(manager.getState().focusedId).toBe("preset");
  });

  it("should keep initial focus when registering elements", () => {
    const manager = new FocusManager({ initialFocusId: "preset" });
    // Initial focus is kept even if not registered (allows setting focus before registration)
    expect(manager.getState().focusedId).toBe("preset");
    
    // But auto-focus only happens if focusedId is null
    manager.register("a");
    manager.register("b");
    // Since focusedId was already set, registering doesn't change it
    expect(manager.getState().focusedId).toBe("preset");
  });
});
