import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface ToggleProps {
  /** Whether the toggle is on (controlled) */
  value?: boolean;
  /** Default value (uncontrolled) */
  defaultValue?: boolean;
  /** Callback when value changes */
  onChange?: (value: boolean) => void;
  /** Toggle label */
  label?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** On label */
  onLabel?: string;
  /** Off label */
  offLabel?: string;
}

export function Toggle({
  value: controlledValue,
  defaultValue = false,
  onChange,
  label,
  disabled = false,
  tokens: propTokens,
  focusId,
  onLabel = "ON",
  offLabel = "OFF",
}: ToggleProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("toggle");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const isOn = isControlled ? controlledValue : internalValue;

  const toggle = useCallback(() => {
    if (disabled) return;
    const newValue = !isOn;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [disabled, isOn, isControlled, onChange]);

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;
      if (key.return || input === " ") {
        toggle();
      }
    },
    { isActive: isFocused }
  );

  const trackColor = disabled
    ? tokens.colors.disabled
    : isOn
    ? tokens.colors.success
    : tokens.colors.border;

  const thumbPosition = isOn ? "  ●" : "●  ";

  return React.createElement(
    Box,
    { gap: 1 },
    label
      ? React.createElement(
          Text,
          {
            color: disabled ? tokens.colors.disabled : tokens.colors.fg,
            bold: isFocused,
          },
          label
        )
      : null,
    React.createElement(
      Box,
      {
        borderStyle: "round",
        borderColor: isFocused ? tokens.colors.focus : trackColor,
        paddingX: 0,
      },
      React.createElement(
        Text,
        { color: trackColor, bold: true },
        thumbPosition
      )
    ),
    React.createElement(
      Text,
      {
        color: disabled
          ? tokens.colors.disabled
          : isOn
          ? tokens.colors.success
          : tokens.colors.muted,
        dimColor: disabled,
      },
      isOn ? onLabel : offLabel
    )
  );
}
