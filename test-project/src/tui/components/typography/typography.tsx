import React from "react";
import { Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "small"
  | "code"
  | "quote"
  | "lead";

export interface TypographyProps {
  /** Text content */
  children: React.ReactNode;
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text color (token name or hex) */
  color?: "fg" | "muted" | "accent" | "success" | "warning" | "danger" | string;
  /** Bold text */
  bold?: boolean;
  /** Italic text (dimmed in terminal) */
  italic?: boolean;
  /** Underline text */
  underline?: boolean;
  /** Strikethrough text */
  strikethrough?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Text alignment hint (for parent containers) */
  align?: "left" | "center" | "right";
}

export function Typography({
  children,
  variant = "body",
  color,
  bold,
  italic,
  underline,
  strikethrough,
  tokens: propTokens,
}: TypographyProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Variant styles
  const variantStyles: Record<
    TypographyVariant,
    {
      bold?: boolean;
      dimColor?: boolean;
      color?: string;
      prefix?: string;
      suffix?: string;
    }
  > = {
    h1: { bold: true, color: tokens.colors.fg },
    h2: { bold: true, color: tokens.colors.fg },
    h3: { bold: true, color: tokens.colors.fg },
    h4: { bold: true, color: tokens.colors.muted },
    body: { color: tokens.colors.fg },
    small: { dimColor: true, color: tokens.colors.muted },
    code: { color: tokens.colors.accent },
    quote: { dimColor: true, color: tokens.colors.muted, prefix: "│ " },
    lead: { color: tokens.colors.fg },
  };

  const style = variantStyles[variant];

  // Resolve color
  let resolvedColor = style.color;
  if (color) {
    if (color in tokens.colors) {
      resolvedColor = tokens.colors[color as keyof typeof tokens.colors];
    } else {
      resolvedColor = color;
    }
  }

  // Build content with prefix/suffix
  const content = React.createElement(
    React.Fragment,
    null,
    style.prefix || null,
    children,
    style.suffix || null
  );

  return React.createElement(
    Text,
    {
      color: resolvedColor,
      bold: bold ?? style.bold,
      dimColor: italic ?? style.dimColor,
      underline,
      strikethrough,
    },
    content
  );
}

// Convenience components
export function H1(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "h1" });
}

export function H2(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "h2" });
}

export function H3(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "h3" });
}

export function H4(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "h4" });
}

export function Code(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "code" });
}

export function Quote(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "quote" });
}

export function Small(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "small" });
}

export function Lead(
  props: Omit<TypographyProps, "variant">
): React.ReactElement {
  return React.createElement(Typography, { ...props, variant: "lead" });
}
