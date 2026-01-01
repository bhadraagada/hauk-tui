import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface ButtonProps {
  /** Button label */
  children: React.ReactNode;
  /** Callback when button is activated */
  onPress?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button variant */
  variant?: "default" | "primary" | "danger" | "ghost";
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Button({
  children,
  onPress,
  disabled = false,
  variant = "default",
  tokens: propTokens,
  focusId,
}: ButtonProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("button");
  const { isFocused } = useFocusable(id);
  const [isPressed, setIsPressed] = useState(false);

  // Handle key input when focused
  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.return || input === " ") {
        setIsPressed(true);
        onPress?.();
        setTimeout(() => setIsPressed(false), 100);
      }
    },
    { isActive: isFocused }
  );

  // Determine colors based on state and variant
  const getColors = useCallback(() => {
    if (disabled) {
      return {
        bg: tokens.colors.disabled,
        fg: tokens.colors.muted,
        border: tokens.colors.disabled,
      };
    }

    if (isPressed) {
      return {
        bg: tokens.colors.accent,
        fg: tokens.colors.bg,
        border: tokens.colors.accent,
      };
    }

    switch (variant) {
      case "primary":
        return {
          bg: isFocused ? tokens.colors.accent : tokens.colors.border,
          fg: isFocused ? tokens.colors.bg : tokens.colors.fg,
          border: tokens.colors.accent,
        };
      case "danger":
        return {
          bg: isFocused ? tokens.colors.danger : tokens.colors.border,
          fg: isFocused ? tokens.colors.bg : tokens.colors.danger,
          border: tokens.colors.danger,
        };
      case "ghost":
        return {
          bg: undefined,
          fg: isFocused ? tokens.colors.accent : tokens.colors.fg,
          border: isFocused ? tokens.colors.focus : tokens.colors.border,
        };
      default:
        return {
          bg: isFocused ? tokens.colors.border : undefined,
          fg: isFocused ? tokens.colors.fg : tokens.colors.muted,
          border: isFocused ? tokens.colors.focus : tokens.colors.border,
        };
    }
  }, [disabled, isPressed, variant, isFocused, tokens]);

  const colors = getColors();

  return React.createElement(
    Box,
    {
      borderStyle: "round",
      borderColor: colors.border,
      paddingX: 1,
    },
    React.createElement(
      Text,
      {
        color: colors.fg,
        bold: isFocused,
      },
      children
    )
  );
}
