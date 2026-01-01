import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "./context";

// ============================================================================
// FocusRing - Visual focus indicator
// ============================================================================

export interface FocusRingProps {
  focusId: string;
  children: React.ReactNode;
  showRing?: boolean;
}

export function FocusRing({
  focusId,
  children,
  showRing = true,
}: FocusRingProps): React.ReactElement {
  const tokens = useTokens();
  const { isFocused } = useFocusable(focusId);

  return React.createElement(
    Box,
    {
      borderStyle: showRing && isFocused ? "round" : undefined,
      borderColor: isFocused ? tokens.colors.focus : undefined,
    },
    children
  );
}

// ============================================================================
// Panel - Bordered container
// ============================================================================

export interface PanelProps {
  title?: string;
  tokens?: Tokens;
  borderStyle?: "single" | "double" | "round" | "bold" | "classic" | "singleDouble" | "doubleSingle";
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: number;
}

export function Panel({
  title,
  tokens: propTokens,
  borderStyle = "round",
  children,
  width,
  height,
  padding = 1,
}: PanelProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle,
      borderColor: tokens.colors.border,
      width,
      height,
      paddingX: padding,
    },
    title
      ? React.createElement(
          Box,
          { marginBottom: 1 },
          React.createElement(Text, { bold: true, color: tokens.colors.accent }, title)
        )
      : null,
    children
  );
}

// ============================================================================
// Divider - Horizontal line separator
// ============================================================================

export interface DividerProps {
  char?: string;
  tokens?: Tokens;
  width?: number;
}

export function Divider({
  char = "─",
  tokens: propTokens,
  width = 40,
}: DividerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Text,
    { color: tokens.colors.border },
    char.repeat(width)
  );
}

// ============================================================================
// Spinner - Loading indicator
// ============================================================================

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export interface SpinnerProps {
  label?: string;
  tokens?: Tokens;
}

export function Spinner({ label, tokens: propTokens }: SpinnerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % spinnerFrames.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return React.createElement(
    Box,
    { gap: 1 },
    React.createElement(Text, { color: tokens.colors.accent }, spinnerFrames[frame]),
    label ? React.createElement(Text, { color: tokens.colors.muted }, label) : null
  );
}

// ============================================================================
// ProgressBar - Progress indicator
// ============================================================================

export interface ProgressBarProps {
  value: number;
  max?: number;
  width?: number;
  tokens?: Tokens;
  showPercentage?: boolean;
  filledChar?: string;
  emptyChar?: string;
}

export function ProgressBar({
  value,
  max = 100,
  width = 30,
  tokens: propTokens,
  showPercentage = false,
  filledChar = "█",
  emptyChar = "░",
}: ProgressBarProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const percentage = Math.min(Math.max(value / max, 0), 1);
  const filledWidth = Math.round(width * percentage);
  const emptyWidth = width - filledWidth;

  return React.createElement(
    Box,
    { gap: 1 },
    React.createElement(
      Text,
      null,
      React.createElement(Text, { color: tokens.colors.accent }, filledChar.repeat(filledWidth)),
      React.createElement(Text, { color: tokens.colors.border }, emptyChar.repeat(emptyWidth))
    ),
    showPercentage
      ? React.createElement(
          Text,
          { color: tokens.colors.muted },
          `${Math.round(percentage * 100)}%`
        )
      : null
  );
}

// ============================================================================
// ThemedText - Text with token-based coloring
// ============================================================================

export interface ThemedTextProps {
  color?: keyof Tokens["colors"];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  dimColor?: boolean;
  children: React.ReactNode;
}

export function ThemedText({
  color = "fg",
  bold,
  italic,
  underline,
  strikethrough,
  dimColor,
  children,
}: ThemedTextProps): React.ReactElement {
  const tokens = useTokens();

  const props: Record<string, unknown> = {
    color: tokens.colors[color],
  };
  
  if (bold !== undefined) props["bold"] = bold;
  if (italic !== undefined) props["italic"] = italic;
  if (underline !== undefined) props["underline"] = underline;
  if (strikethrough !== undefined) props["strikethrough"] = strikethrough;
  if (dimColor !== undefined) props["dimColor"] = dimColor;

  return React.createElement(Text, props, children);
}

// ============================================================================
// ThemedBox - Box with token-based styling
// ============================================================================

export interface ThemedBoxProps {
  borderColor?: keyof Tokens["colors"];
  borderStyle?: "single" | "double" | "round" | "bold" | "classic" | "singleDouble" | "doubleSingle";
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  margin?: number;
  marginX?: number;
  marginY?: number;
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  gap?: number;
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
}

export function ThemedBox({
  borderColor,
  borderStyle,
  children,
  ...props
}: ThemedBoxProps): React.ReactElement {
  const tokens = useTokens();

  return React.createElement(
    Box,
    {
      ...props,
      borderStyle,
      borderColor: borderColor ? tokens.colors[borderColor] : undefined,
    },
    children
  );
}
