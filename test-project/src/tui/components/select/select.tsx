import React, { useState, useCallback, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface SelectOption<T = string> {
  /** Display label */
  label: string;
  /** Option value */
  value: T;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  /** Available options */
  options: SelectOption<T>[];
  /** Controlled value */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Callback when selection changes */
  onChange?: (value: T) => void;
  /** Placeholder when no selection */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Show options in expanded list view */
  expanded?: boolean;
}

export function Select<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  tokens: propTokens,
  focusId,
  expanded = false,
}: SelectProps<T>): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("select");
  const { isFocused } = useFocusable(id);

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Highlighted index for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    if (currentValue !== undefined) {
      const idx = options.findIndex((o) => o.value === currentValue);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // Update highlighted index when value changes externally
  useEffect(() => {
    if (currentValue !== undefined) {
      const idx = options.findIndex((o) => o.value === currentValue);
      if (idx >= 0) setHighlightedIndex(idx);
    }
  }, [currentValue, options]);

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }
      onChange?.(option.value);
    },
    [options, isControlled, onChange]
  );

  // Handle keyboard navigation
  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.upArrow) {
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          // Skip disabled options
          while (next >= 0 && options[next]?.disabled) {
            next--;
          }
          return clamp(next, 0, options.length - 1);
        });
      } else if (key.downArrow) {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          // Skip disabled options
          while (next < options.length && options[next]?.disabled) {
            next++;
          }
          return clamp(next, 0, options.length - 1);
        });
      } else if (key.return || input === " ") {
        selectOption(highlightedIndex);
      }
    },
    { isActive: isFocused }
  );

  // Find the selected option
  const selectedOption = options.find((o) => o.value === currentValue);

  // Render collapsed view (single line)
  if (!expanded) {
    return React.createElement(
      Box,
      {
        borderStyle: isFocused ? "round" : "single",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        paddingX: 1,
      },
      React.createElement(
        Text,
        {
          color: selectedOption
            ? tokens.colors.fg
            : tokens.colors.muted,
        },
        selectedOption?.label ?? placeholder
      ),
      React.createElement(
        Text,
        { color: tokens.colors.muted },
        " ▼"
      )
    );
  }

  // Render expanded view (list)
  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    options.map((option, index) => {
      const isSelected = option.value === currentValue;
      const isHighlighted = index === highlightedIndex;
      const isDisabled = option.disabled;

      let color = tokens.colors.fg;
      if (isDisabled) {
        color = tokens.colors.disabled;
      } else if (isHighlighted) {
        color = tokens.colors.accent;
      }

      const prefix = isSelected ? "● " : "○ ";

      return React.createElement(
        Box,
        { key: index, paddingX: 1 },
        React.createElement(
          Text,
          {
            color,
            bold: isHighlighted,
            dimColor: isDisabled,
          },
          prefix,
          option.label
        )
      );
    })
  );
}
