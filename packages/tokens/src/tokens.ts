import type { Tokens, TokenOverrides, ColorTokens, SpaceTokens, BorderTokens } from "./types";

/**
 * Default color tokens
 */
const defaultColors: ColorTokens = {
  fg: "#e4e4e7",        // zinc-200
  bg: "#18181b",        // zinc-900
  muted: "#71717a",     // zinc-500
  accent: "#3b82f6",    // blue-500
  success: "#22c55e",   // green-500
  warning: "#f59e0b",   // amber-500
  danger: "#ef4444",    // red-500
  border: "#3f3f46",    // zinc-700
  focus: "#60a5fa",     // blue-400
  disabled: "#52525b",  // zinc-600
};

/**
 * Default spacing tokens (in terminal units/characters)
 */
const defaultSpace: SpaceTokens = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  "2xl": 12,
};

/**
 * Default border style tokens (box-drawing characters)
 */
const defaultBorders: BorderTokens = {
  none: "",
  single: "┌┐└┘─│",
  double: "╔╗╚╝═║",
  rounded: "╭╮╰╯─│",
  bold: "┏┓┗┛━┃",
  classic: "+-++-+|-",
};

/**
 * Create default tokens
 * @returns Complete token set with default values
 */
export function createDefaultTokens(): Tokens {
  return {
    colors: { ...defaultColors },
    space: { ...defaultSpace },
    borders: { ...defaultBorders },
  };
}

/**
 * Deep merge utility for tokens
 */
function deepMerge(
  base: Record<string, unknown>,
  overrides: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };

  for (const key in overrides) {
    const baseValue = base[key];
    const overrideValue = overrides[key];

    if (
      overrideValue !== undefined &&
      typeof baseValue === "object" &&
      baseValue !== null &&
      typeof overrideValue === "object" &&
      overrideValue !== null &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      );
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result;
}

/**
 * Merge base tokens with overrides
 * @param base - Base token set
 * @param overrides - Partial overrides to apply
 * @returns Merged token set
 */
export function mergeTokens(base: Tokens, overrides: TokenOverrides): Tokens {
  const merged = deepMerge(
    base as unknown as Record<string, unknown>,
    overrides as unknown as Record<string, unknown>
  );
  return merged as unknown as Tokens;
}

/**
 * Create tokens with custom overrides applied to defaults
 * @param overrides - Partial overrides to apply to default tokens
 * @returns Complete token set with overrides applied
 */
export function createTokens(overrides?: TokenOverrides): Tokens {
  if (!overrides) {
    return createDefaultTokens();
  }
  return mergeTokens(createDefaultTokens(), overrides);
}

/**
 * Light theme preset
 */
export const lightTheme: TokenOverrides = {
  colors: {
    fg: "#18181b",      // zinc-900
    bg: "#fafafa",      // zinc-50
    muted: "#71717a",   // zinc-500
    border: "#d4d4d8",  // zinc-300
    focus: "#2563eb",   // blue-600
    disabled: "#a1a1aa", // zinc-400
  },
};

/**
 * High contrast theme preset
 */
export const highContrastTheme: TokenOverrides = {
  colors: {
    fg: "#ffffff",
    bg: "#000000",
    muted: "#a3a3a3",
    accent: "#00d4ff",
    success: "#00ff00",
    warning: "#ffff00",
    danger: "#ff0000",
    border: "#ffffff",
    focus: "#00ffff",
    disabled: "#666666",
  },
};

/**
 * ASCII-only border preset for terminals without Unicode
 */
export const asciiBorders: TokenOverrides = {
  borders: {
    single: "+-++-+|-",
    double: "+-++-+|-",
    rounded: "+-++-+|-",
    bold: "+-++-+|-",
  },
};
