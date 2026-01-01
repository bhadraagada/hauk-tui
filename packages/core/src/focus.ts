import type { FocusState, FocusContext } from "./types";

/**
 * Create initial focus state
 */
export function createFocusState(initialFocusId?: string): FocusState {
  return {
    focusedId: initialFocusId ?? null,
    isActive: true,
  };
}

/**
 * Focus manager for managing focus within a collection of elements
 */
export class FocusManager {
  private elements: string[] = [];
  private state: FocusState;
  private listeners: Set<(state: FocusState) => void> = new Set();
  private wrap: boolean;

  constructor(options: { wrap?: boolean; initialFocusId?: string } = {}) {
    this.wrap = options.wrap ?? true;
    this.state = createFocusState(options.initialFocusId);
  }

  /**
   * Get current focus state
   */
  getState(): FocusState {
    return { ...this.state };
  }

  /**
   * Subscribe to focus state changes
   */
  subscribe(listener: (state: FocusState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }

  /**
   * Register a focusable element
   */
  register(id: string): void {
    if (!this.elements.includes(id)) {
      this.elements.push(id);
      // Auto-focus first element if nothing is focused
      if (this.state.focusedId === null && this.elements.length === 1) {
        this.focus(id);
      }
    }
  }

  /**
   * Unregister a focusable element
   */
  unregister(id: string): void {
    const index = this.elements.indexOf(id);
    if (index !== -1) {
      this.elements.splice(index, 1);
      // If the unregistered element was focused, move focus
      if (this.state.focusedId === id) {
        if (this.elements.length > 0) {
          const newIndex = Math.min(index, this.elements.length - 1);
          this.focus(this.elements[newIndex]!);
        } else {
          this.state = { ...this.state, focusedId: null };
          this.notify();
        }
      }
    }
  }

  /**
   * Focus a specific element
   */
  focus(id: string): void {
    if (this.elements.includes(id) && this.state.focusedId !== id) {
      this.state = { ...this.state, focusedId: id };
      this.notify();
    }
  }

  /**
   * Move focus to the next element
   */
  focusNext(): void {
    if (this.elements.length === 0) return;

    const currentIndex = this.state.focusedId
      ? this.elements.indexOf(this.state.focusedId)
      : -1;

    let nextIndex: number;
    if (currentIndex === -1) {
      nextIndex = 0;
    } else if (currentIndex === this.elements.length - 1) {
      nextIndex = this.wrap ? 0 : currentIndex;
    } else {
      nextIndex = currentIndex + 1;
    }

    const nextId = this.elements[nextIndex];
    if (nextId) {
      this.focus(nextId);
    }
  }

  /**
   * Move focus to the previous element
   */
  focusPrev(): void {
    if (this.elements.length === 0) return;

    const currentIndex = this.state.focusedId
      ? this.elements.indexOf(this.state.focusedId)
      : -1;

    let prevIndex: number;
    if (currentIndex === -1) {
      prevIndex = this.elements.length - 1;
    } else if (currentIndex === 0) {
      prevIndex = this.wrap ? this.elements.length - 1 : 0;
    } else {
      prevIndex = currentIndex - 1;
    }

    const prevId = this.elements[prevIndex];
    if (prevId) {
      this.focus(prevId);
    }
  }

  /**
   * Check if an element is currently focused
   */
  isFocused(id: string): boolean {
    return this.state.focusedId === id;
  }

  /**
   * Set active state (focus ring visibility)
   */
  setActive(active: boolean): void {
    if (this.state.isActive !== active) {
      this.state = { ...this.state, isActive: active };
      this.notify();
    }
  }

  /**
   * Get the list of registered element IDs
   */
  getElements(): readonly string[] {
    return this.elements;
  }

  /**
   * Create a FocusContext object
   */
  toContext(): FocusContext {
    return {
      state: this.getState(),
      register: this.register.bind(this),
      unregister: this.unregister.bind(this),
      focus: this.focus.bind(this),
      focusNext: this.focusNext.bind(this),
      focusPrev: this.focusPrev.bind(this),
      isFocused: this.isFocused.bind(this),
    };
  }
}

/**
 * Create a focus manager instance
 */
export function createFocusManager(
  options?: { wrap?: boolean; initialFocusId?: string }
): FocusManager {
  return new FocusManager(options);
}
