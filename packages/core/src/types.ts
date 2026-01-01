import type { Tokens } from "@hauktui/tokens";

/**
 * Standard keyboard actions used across components
 */
export type KeyAction =
  | "submit"
  | "cancel"
  | "next"
  | "prev"
  | "up"
  | "down"
  | "left"
  | "right"
  | "tab"
  | "backtab"
  | "delete"
  | "backspace"
  | "home"
  | "end"
  | "pageUp"
  | "pageDown"
  | "space"
  | "escape";

/**
 * Key input representation
 */
export interface KeyInput {
  /** Key name (e.g., 'return', 'escape', 'a') */
  name: string;
  /** Whether Ctrl was held */
  ctrl: boolean;
  /** Whether Meta/Cmd was held */
  meta: boolean;
  /** Whether Shift was held */
  shift: boolean;
  /** Whether Alt/Option was held */
  alt: boolean;
}

/**
 * Keymap definition - maps key patterns to actions
 */
export type Keymap = {
  [K in KeyAction]?: KeyPattern[];
};

/**
 * Pattern for matching key inputs
 */
export interface KeyPattern {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

/**
 * Focus state for a focusable element
 */
export interface FocusState {
  /** Unique ID of the focused element */
  focusedId: string | null;
  /** Whether focus is active (vs blurred) */
  isActive: boolean;
}

/**
 * Focus context for managing focus within a group
 */
export interface FocusContext {
  /** Current focus state */
  state: FocusState;
  /** Register a focusable element */
  register: (id: string) => void;
  /** Unregister a focusable element */
  unregister: (id: string) => void;
  /** Focus a specific element by ID */
  focus: (id: string) => void;
  /** Move focus to next element */
  focusNext: () => void;
  /** Move focus to previous element */
  focusPrev: () => void;
  /** Check if an element is focused */
  isFocused: (id: string) => boolean;
}

/**
 * Accessibility metadata for components
 */
export interface A11yProps {
  /** Accessible label for the component */
  label?: string;
  /** Extended description */
  description?: string;
  /** Role hint (button, listbox, etc.) */
  role?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is hidden from accessibility */
  hidden?: boolean;
}

/**
 * Base props that all haukTUI components accept
 */
export interface BaseComponentProps {
  /** Token set for styling */
  tokens?: Tokens;
  /** Accessibility properties */
  a11y?: A11yProps;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Controlled component props pattern
 */
export interface ControlledProps<T> {
  /** Controlled value */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Callback when value changes */
  onChange?: (value: T) => void;
}

/**
 * Focusable component props
 */
export interface FocusableProps {
  /** Unique focus ID */
  focusId?: string;
  /** Whether this element can receive focus */
  focusable?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Callback when focused */
  onFocus?: () => void;
  /** Callback when blurred */
  onBlur?: () => void;
}

/**
 * Combined props for interactive components
 */
export type InteractiveProps<T> = BaseComponentProps &
  ControlledProps<T> &
  FocusableProps;
