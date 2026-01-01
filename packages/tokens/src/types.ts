/**
 * Terminal color depth capabilities
 */
export type ColorDepth = "truecolor" | "256" | "16" | "none";

/**
 * Terminal capabilities detected at runtime
 */
export interface TerminalCapabilities {
  /** Color depth supported by the terminal */
  colorDepth: ColorDepth;
  /** Whether the terminal supports Unicode */
  unicode: boolean;
  /** Whether the terminal supports hyperlinks */
  hyperlinks: boolean;
  /** Number of columns in the terminal */
  columns: number;
  /** Number of rows in the terminal */
  rows: number;
  /** Whether running in a CI environment */
  isCI: boolean;
  /** Whether the terminal is interactive (has TTY) */
  isInteractive: boolean;
}

/**
 * Spacing scale tokens
 */
export interface SpaceTokens {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

/**
 * Color tokens for semantic styling
 */
export interface ColorTokens {
  /** Primary foreground color */
  fg: string;
  /** Primary background color */
  bg: string;
  /** Muted/secondary text color */
  muted: string;
  /** Accent color for highlights */
  accent: string;
  /** Success state color */
  success: string;
  /** Warning state color */
  warning: string;
  /** Danger/error state color */
  danger: string;
  /** Border color */
  border: string;
  /** Focus ring/indicator color */
  focus: string;
  /** Disabled state color */
  disabled: string;
}

/**
 * Border style tokens
 */
export interface BorderTokens {
  /** No border */
  none: string;
  /** Single line border */
  single: string;
  /** Double line border */
  double: string;
  /** Rounded border (single with rounded corners) */
  rounded: string;
  /** Bold/thick border */
  bold: string;
  /** Classic ASCII border */
  classic: string;
}

/**
 * Complete token set for theming
 */
export interface Tokens {
  colors: ColorTokens;
  space: SpaceTokens;
  borders: BorderTokens;
}

/**
 * Deep partial type for token overrides
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Token overrides type
 */
export type TokenOverrides = DeepPartial<Tokens>;
