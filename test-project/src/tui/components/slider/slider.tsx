import React, { useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface SliderProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Slider width in characters */
  width?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Show value label */
  showValue?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  width = 20,
  disabled = false,
  label,
  showValue = true,
  tokens: propTokens,
  focusId,
}: SliderProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("slider");
  const { isFocused } = useFocusable(id);

  const updateValue = useCallback(
    (delta: number) => {
      const newValue = clamp(value + delta, min, max);
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [value, min, max, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.leftArrow || input === "h") {
        updateValue(-step);
      } else if (key.rightArrow || input === "l") {
        updateValue(step);
      } else if (input === "0") {
        onChange(min);
      } else if (input === "$") {
        onChange(max);
      }
    },
    { isActive: isFocused }
  );

  // Calculate filled portion
  const percentage = ((value - min) / (max - min)) * 100;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  // Create slider track
  const track = "█".repeat(filled) + "░".repeat(empty);

  return React.createElement(
    Box,
    { flexDirection: "column" },
    label
      ? React.createElement(
          Text,
          { color: tokens.colors.fg, bold: true },
          label
        )
      : null,
    React.createElement(
      Box,
      {
        gap: 1,
        borderStyle: isFocused ? "round" : "single",
        borderColor: disabled
          ? tokens.colors.disabled
          : isFocused
            ? tokens.colors.focus
            : tokens.colors.border,
        paddingX: 1,
      },
      React.createElement(
        Text,
        { color: disabled ? tokens.colors.disabled : tokens.colors.accent },
        track
      ),
      showValue
        ? React.createElement(
            Text,
            { color: tokens.colors.muted },
            `${value}/${max}`
          )
        : null
    ),
    isFocused
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          "←/→ to adjust, 0/$ for min/max"
        )
      : null
  );
}
