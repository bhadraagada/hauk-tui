import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast title */
  title?: string;
  /** Toast variant */
  variant?: ToastVariant;
  /** Duration in milliseconds (0 = persistent) */
  duration?: number;
  /** Callback when toast should be dismissed */
  onDismiss?: () => void;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Show icon */
  showIcon?: boolean;
}

const ICONS: Record<ToastVariant, string> = {
  default: "●",
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

export function Toast({
  message,
  title,
  variant = "default",
  duration = 3000,
  onDismiss,
  tokens: propTokens,
  showIcon = true,
}: ToastProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!visible) return null;

  const variantColors: Record<ToastVariant, string> = {
    default: tokens.colors.fg,
    success: tokens.colors.success,
    error: tokens.colors.danger,
    warning: tokens.colors.warning,
    info: tokens.colors.accent,
  };

  const color = variantColors[variant];
  const icon = ICONS[variant];

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: color,
      paddingX: 1,
    },
    React.createElement(
      Box,
      { gap: 1 },
      showIcon ? React.createElement(Text, { color }, icon) : null,
      title
        ? React.createElement(Text, { color, bold: true }, title)
        : React.createElement(Text, { color: tokens.colors.fg }, message)
    ),
    title
      ? React.createElement(
          Box,
          { paddingLeft: showIcon ? 2 : 0 },
          React.createElement(Text, { color: tokens.colors.fg }, message)
        )
      : null
  );
}
