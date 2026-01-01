import type { KeyAction, KeyInput, Keymap, KeyPattern } from "./types";

/**
 * Default keymap for standard actions
 */
export const defaultKeymap: Keymap = {
  submit: [
    { key: "return" },
    { key: "enter" },
  ],
  cancel: [
    { key: "escape" },
    { key: "c", ctrl: true },
  ],
  next: [
    { key: "tab" },
    { key: "n", ctrl: true },
  ],
  prev: [
    { key: "tab", shift: true },
    { key: "p", ctrl: true },
  ],
  up: [
    { key: "up" },
    { key: "k" },
    { key: "p", ctrl: true },
  ],
  down: [
    { key: "down" },
    { key: "j" },
    { key: "n", ctrl: true },
  ],
  left: [
    { key: "left" },
    { key: "h" },
  ],
  right: [
    { key: "right" },
    { key: "l" },
  ],
  tab: [
    { key: "tab" },
  ],
  backtab: [
    { key: "tab", shift: true },
  ],
  delete: [
    { key: "delete" },
    { key: "d", ctrl: true },
  ],
  backspace: [
    { key: "backspace" },
  ],
  home: [
    { key: "home" },
    { key: "a", ctrl: true },
  ],
  end: [
    { key: "end" },
    { key: "e", ctrl: true },
  ],
  pageUp: [
    { key: "pageup" },
    { key: "u", ctrl: true },
  ],
  pageDown: [
    { key: "pagedown" },
    { key: "d", ctrl: true },
  ],
  space: [
    { key: "space" },
    { key: " " },
  ],
  escape: [
    { key: "escape" },
  ],
};

/**
 * Check if a key input matches a pattern
 */
export function matchesPattern(input: KeyInput, pattern: KeyPattern): boolean {
  if (input.name.toLowerCase() !== pattern.key.toLowerCase()) {
    return false;
  }

  if (pattern.ctrl !== undefined && input.ctrl !== pattern.ctrl) {
    return false;
  }

  if (pattern.meta !== undefined && input.meta !== pattern.meta) {
    return false;
  }

  if (pattern.shift !== undefined && input.shift !== pattern.shift) {
    return false;
  }

  if (pattern.alt !== undefined && input.alt !== pattern.alt) {
    return false;
  }

  return true;
}

/**
 * Get the action for a key input based on a keymap
 */
export function getAction(input: KeyInput, keymap: Keymap = defaultKeymap): KeyAction | null {
  for (const [action, patterns] of Object.entries(keymap)) {
    if (!patterns) continue;
    
    for (const pattern of patterns) {
      if (matchesPattern(input, pattern)) {
        return action as KeyAction;
      }
    }
  }
  return null;
}

/**
 * Merge keymaps, with later keymaps taking precedence
 */
export function mergeKeymaps(...keymaps: Keymap[]): Keymap {
  const result: Keymap = {};

  for (const keymap of keymaps) {
    for (const [action, patterns] of Object.entries(keymap)) {
      if (patterns) {
        result[action as KeyAction] = patterns;
      }
    }
  }

  return result;
}

/**
 * Create a partial keymap override
 */
export function createKeymap(overrides: Partial<Keymap>): Keymap {
  return mergeKeymaps(defaultKeymap, overrides);
}

/**
 * Check if an input matches a specific action
 */
export function isAction(
  input: KeyInput,
  action: KeyAction,
  keymap: Keymap = defaultKeymap
): boolean {
  const patterns = keymap[action];
  if (!patterns) return false;

  return patterns.some((pattern) => matchesPattern(input, pattern));
}

/**
 * Parse a key string into KeyInput (for testing/utilities)
 * Format: "ctrl+shift+a", "return", "escape"
 */
export function parseKeyString(keyString: string): KeyInput {
  const parts = keyString.toLowerCase().split("+");
  const key = parts.pop() ?? "";

  return {
    name: key,
    ctrl: parts.includes("ctrl"),
    meta: parts.includes("meta") || parts.includes("cmd"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt") || parts.includes("option"),
  };
}
