import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface InputOTPProps {
  /** Number of OTP digits */
  length?: number;
  /** Controlled value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when all digits are filled */
  onComplete?: (value: string) => void;
  /** Whether to mask the input */
  mask?: boolean;
  /** Mask character */
  maskChar?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Label text */
  label?: string;
  /** Separator between groups */
  separator?: string;
  /** Group size (for visual grouping) */
  groupSize?: number;
}

export function InputOTP({
  length = 6,
  value: controlledValue,
  onChange,
  onComplete,
  mask = false,
  maskChar = "●",
  disabled = false,
  tokens: propTokens,
  focusId,
  label,
  separator = "-",
  groupSize = 3,
}: InputOTPProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("input-otp");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const updateValue = useCallback(
    (newValue: string) => {
      // Only allow digits
      const digits = newValue.replace(/\D/g, "").slice(0, length);

      if (!isControlled) {
        setInternalValue(digits);
      }
      onChange?.(digits);

      if (digits.length === length) {
        onComplete?.(digits);
      }
    },
    [isControlled, length, onChange, onComplete]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.backspace || key.delete) {
        updateValue(currentValue.slice(0, -1));
      } else if (/^\d$/.test(input)) {
        updateValue(currentValue + input);
      }
    },
    { isActive: isFocused }
  );

  // Render OTP boxes
  const renderBoxes = () => {
    const boxes: React.ReactElement[] = [];

    for (let i = 0; i < length; i++) {
      const char = currentValue[i];
      const isCursor = i === currentValue.length && isFocused;
      const isFilled = char !== undefined;

      // Add separator between groups
      if (i > 0 && groupSize > 0 && i % groupSize === 0) {
        boxes.push(
          React.createElement(
            Text,
            { key: `sep-${i}`, color: tokens.colors.muted },
            ` ${separator} `
          )
        );
      }

      const displayChar = isFilled
        ? mask
          ? maskChar
          : char
        : isCursor
          ? "▎"
          : " ";

      boxes.push(
        React.createElement(
          Box,
          {
            key: i,
            borderStyle: "single",
            borderColor: isCursor
              ? tokens.colors.focus
              : isFilled
                ? tokens.colors.accent
                : tokens.colors.border,
            paddingX: 1,
          },
          React.createElement(
            Text,
            {
              color: isCursor
                ? tokens.colors.focus
                : isFilled
                  ? tokens.colors.fg
                  : tokens.colors.muted,
              bold: isFilled,
            },
            displayChar
          )
        )
      );
    }

    return boxes;
  };

  return React.createElement(
    Box,
    { flexDirection: "column" },
    // Label
    label
      ? React.createElement(
          Text,
          { color: tokens.colors.fg, bold: true },
          label
        )
      : null,
    // OTP boxes
    React.createElement(
      Box,
      {
        gap: 0,
        borderStyle: isFocused ? "round" : undefined,
        borderColor: isFocused ? tokens.colors.focus : undefined,
        paddingX: isFocused ? 1 : 0,
      },
      ...renderBoxes()
    ),
    // Status
    React.createElement(
      Text,
      { color: tokens.colors.muted, dimColor: true },
      `${currentValue.length}/${length} digits`
    )
  );
}
