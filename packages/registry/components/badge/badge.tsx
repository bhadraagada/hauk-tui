import React from "react";
import { Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "muted";

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Badge({
  children,
  variant = "default",
  tokens: propTokens,
}: BadgeProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const variantColors: Record<BadgeVariant, { bg: string; fg: string }> = {
    default: { bg: tokens.colors.border, fg: tokens.colors.fg },
    primary: { bg: tokens.colors.accent, fg: tokens.colors.bg },
    success: { bg: tokens.colors.success, fg: tokens.colors.bg },
    warning: { bg: tokens.colors.warning, fg: tokens.colors.bg },
    danger: { bg: tokens.colors.danger, fg: tokens.colors.bg },
    muted: { bg: tokens.colors.muted, fg: tokens.colors.bg },
  };

  const colors = variantColors[variant];

  return React.createElement(
    Text,
    {
      backgroundColor: colors.bg,
      color: colors.fg,
    },
    " ",
    children,
    " "
  );
}
