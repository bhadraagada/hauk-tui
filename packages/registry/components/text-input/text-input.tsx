import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface TextInputProps {
  /** Current input value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when Enter is pressed */
  onSubmit?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Input label */
  label?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Maximum input length */
  maxLength?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Mask character for password inputs */
  mask?: string;
}

export function TextInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "",
  label,
  disabled = false,
  maxLength,
  tokens: propTokens,
  focusId,
  mask,
}: TextInputProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("text-input");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [cursorPosition, setCursorPosition] = useState(defaultValue.length);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const updateValue = useCallback(
    (newValue: string) => {
      if (maxLength !== undefined && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, maxLength, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.return) {
        onSubmit?.(currentValue);
        return;
      }

      if (key.backspace || key.delete) {
        if (cursorPosition > 0) {
          const newValue =
            currentValue.slice(0, cursorPosition - 1) +
            currentValue.slice(cursorPosition);
          updateValue(newValue);
          setCursorPosition(Math.max(0, cursorPosition - 1));
        }
        return;
      }

      if (key.leftArrow) {
        setCursorPosition(Math.max(0, cursorPosition - 1));
        return;
      }

      if (key.rightArrow) {
        setCursorPosition(Math.min(currentValue.length, cursorPosition + 1));
        return;
      }

      // Home key
      if (key.ctrl && input === "a") {
        setCursorPosition(0);
        return;
      }

      // End key
      if (key.ctrl && input === "e") {
        setCursorPosition(currentValue.length);
        return;
      }

      // Regular character input
      if (input && !key.ctrl && !key.meta) {
        const newValue =
          currentValue.slice(0, cursorPosition) +
          input +
          currentValue.slice(cursorPosition);
        updateValue(newValue);
        setCursorPosition(cursorPosition + input.length);
      }
    },
    { isActive: isFocused }
  );

  // Display value (masked if needed)
  const displayValue = mask
    ? mask.repeat(currentValue.length)
    : currentValue;

  // Render with cursor
  const renderValue = () => {
    if (!isFocused) {
      if (displayValue.length === 0) {
        return React.createElement(Text, { color: tokens.colors.muted }, placeholder);
      }
      return React.createElement(Text, { color: tokens.colors.fg }, displayValue);
    }

    const before = displayValue.slice(0, cursorPosition);
    const cursor = displayValue[cursorPosition] ?? " ";
    const after = displayValue.slice(cursorPosition + 1);

    return React.createElement(
      Text,
      null,
      React.createElement(Text, { color: tokens.colors.fg }, before),
      React.createElement(
        Text,
        { backgroundColor: tokens.colors.accent, color: tokens.colors.bg },
        cursor
      ),
      React.createElement(Text, { color: tokens.colors.fg }, after)
    );
  };

  return React.createElement(
    Box,
    { flexDirection: "column" },
    label
      ? React.createElement(
          Text,
          { color: isFocused ? tokens.colors.accent : tokens.colors.muted },
          label
        )
      : null,
    React.createElement(
      Box,
      {
        borderStyle: "round",
        borderColor: disabled
          ? tokens.colors.disabled
          : isFocused
          ? tokens.colors.focus
          : tokens.colors.border,
        paddingX: 1,
      },
      renderValue()
    )
  );
}
