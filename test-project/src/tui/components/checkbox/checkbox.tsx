import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface CheckboxProps {
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Checkbox label */
  label: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Custom checked indicator */
  checkedIndicator?: string;
  /** Custom unchecked indicator */
  uncheckedIndicator?: string;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  tokens: propTokens,
  focusId,
  checkedIndicator = "◉",
  uncheckedIndicator = "○",
}: CheckboxProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("checkbox");
  const { isFocused } = useFocusable(id);

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [disabled, isChecked, isControlled, onChange]);

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;
      if (key.return || input === " ") {
        toggle();
      }
    },
    { isActive: isFocused }
  );

  const indicatorColor = disabled
    ? tokens.colors.disabled
    : isChecked
    ? tokens.colors.accent
    : tokens.colors.muted;

  const labelColor = disabled
    ? tokens.colors.disabled
    : isFocused
    ? tokens.colors.fg
    : tokens.colors.muted;

  return React.createElement(
    Box,
    {
      paddingX: 1,
      borderStyle: isFocused ? "round" : undefined,
      borderColor: isFocused ? tokens.colors.focus : undefined,
    },
    React.createElement(
      Text,
      { color: indicatorColor },
      isChecked ? checkedIndicator : uncheckedIndicator
    ),
    React.createElement(Text, null, " "),
    React.createElement(
      Text,
      { color: labelColor, bold: isFocused },
      label
    )
  );
}
