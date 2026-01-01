import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface RadioOption<T = string> {
  /** Display label */
  label: string;
  /** Option value */
  value: T;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface RadioGroupProps<T = string> {
  /** Available options */
  options: RadioOption<T>[];
  /** Controlled value */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Callback when selection changes */
  onChange?: (value: T) => void;
  /** Group label */
  label?: string;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Layout direction */
  direction?: "vertical" | "horizontal";
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function RadioGroup<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  disabled = false,
  direction = "vertical",
  tokens: propTokens,
  focusId,
}: RadioGroupProps<T>): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("radio-group");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    const currentValue = controlledValue ?? defaultValue;
    if (currentValue !== undefined) {
      const idx = options.findIndex((o) => o.value === currentValue);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled || disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }
      onChange?.(option.value);
    },
    [options, isControlled, disabled, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      const isVertical = direction === "vertical";
      const prevKey = isVertical ? key.upArrow : key.leftArrow;
      const nextKey = isVertical ? key.downArrow : key.rightArrow;

      if (prevKey) {
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next]?.disabled) {
            next--;
          }
          return clamp(next, 0, options.length - 1);
        });
      } else if (nextKey) {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
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

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : undefined,
      borderColor: isFocused ? tokens.colors.focus : undefined,
      paddingX: isFocused ? 1 : 0,
    },
    label
      ? React.createElement(
          Box,
          { marginBottom: 1 },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            label
          )
        )
      : null,
    React.createElement(
      Box,
      {
        flexDirection: direction === "vertical" ? "column" : "row",
        gap: direction === "vertical" ? 0 : 2,
      },
      options.map((option, index) => {
        const isSelected = option.value === currentValue;
        const isHighlighted = index === highlightedIndex;
        const isDisabled = option.disabled ?? disabled;

        let color = tokens.colors.fg;
        if (isDisabled) {
          color = tokens.colors.disabled;
        } else if (isHighlighted && isFocused) {
          color = tokens.colors.accent;
        }

        const indicator = isSelected ? "●" : "○";

        return React.createElement(
          Box,
          { key: index },
          React.createElement(
            Text,
            {
              color: isSelected ? tokens.colors.accent : color,
              bold: isHighlighted && isFocused,
              dimColor: isDisabled,
            },
            indicator,
            " ",
            option.label
          )
        );
      })
    )
  );
}
