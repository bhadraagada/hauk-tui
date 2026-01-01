import React from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface SwitchProps {
  /** Whether the switch is on */
  checked: boolean;
  /** Callback when switch is toggled */
  onCheckedChange: (checked: boolean) => void;
  /** Label for the switch */
  label?: string;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Size of the switch */
  size?: "sm" | "md" | "lg";
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  size = "md",
  tokens: propTokens,
  focusId,
}: SwitchProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("switch");
  const { isFocused } = useFocusable(id);

  useInput(
    (input, key) => {
      if (disabled) return;
      if (input === " " || key.return) {
        onCheckedChange(!checked);
      }
    },
    { isActive: isFocused }
  );

  const sizes = {
    sm: { width: 4, thumb: 1 },
    md: { width: 6, thumb: 2 },
    lg: { width: 8, thumb: 3 },
  };

  const { width, thumb } = sizes[size];

  const trackColor = checked ? tokens.colors.accent : tokens.colors.muted;

  const thumbPosition = checked ? width - thumb - 2 : 0;

  const track = React.createElement(
    Box,
    {
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : trackColor,
      paddingX: 0,
    },
    React.createElement(
      Box,
      { width, justifyContent: checked ? "flex-end" : "flex-start" },
      React.createElement(
        Text,
        {
          backgroundColor: checked ? tokens.colors.accent : tokens.colors.muted,
          color: tokens.colors.bg,
        },
        checked ? " ON " : " OFF"
      )
    )
  );

  if (!label) {
    return track;
  }

  return React.createElement(
    Box,
    {
      gap: 2,
      alignItems: "center",
      opacity: disabled ? 0.5 : 1,
    },
    track,
    React.createElement(
      Text,
      {
        color: disabled ? tokens.colors.muted : tokens.colors.fg,
        dimColor: disabled,
      },
      label
    )
  );
}
