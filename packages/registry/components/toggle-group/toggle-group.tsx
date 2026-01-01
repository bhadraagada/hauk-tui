import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ToggleGroupItem {
  /** Unique value */
  value: string;
  /** Display label */
  label: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /** Available toggle items */
  items: ToggleGroupItem[];
  /** Controlled selected value(s) */
  value?: string | string[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[];
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Whether the toggle group is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Variant style */
  variant?: "default" | "outline";
}

export function ToggleGroup({
  items,
  value: controlledValue,
  defaultValue = [],
  onChange,
  multiple = false,
  disabled = false,
  tokens: propTokens,
  focusId,
  orientation = "horizontal",
  variant = "default",
}: ToggleGroupProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("toggle-group");
  const { isFocused } = useFocusable(id);

  const normalizeValue = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [internalValue, setInternalValue] = useState<string[]>(
    normalizeValue(defaultValue)
  );
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const isControlled = controlledValue !== undefined;
  const currentValue = normalizeValue(
    isControlled ? controlledValue : internalValue
  );

  const toggleItem = useCallback(
    (itemValue: string) => {
      const item = items.find((i) => i.value === itemValue);
      if (!item || item.disabled || disabled) return;

      let newValue: string[];
      if (multiple) {
        if (currentValue.includes(itemValue)) {
          newValue = currentValue.filter((v) => v !== itemValue);
        } else {
          newValue = [...currentValue, itemValue];
        }
      } else {
        newValue = currentValue.includes(itemValue) ? [] : [itemValue];
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(multiple ? newValue : newValue[0] || "");
    },
    [items, currentValue, multiple, disabled, isControlled, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      const isHorizontal = orientation === "horizontal";

      if (
        (isHorizontal && key.leftArrow) ||
        (!isHorizontal && key.upArrow) ||
        input === "h" ||
        input === "k"
      ) {
        setHighlightedIndex((prev) => clamp(prev - 1, 0, items.length - 1));
      } else if (
        (isHorizontal && key.rightArrow) ||
        (!isHorizontal && key.downArrow) ||
        input === "l" ||
        input === "j"
      ) {
        setHighlightedIndex((prev) => clamp(prev + 1, 0, items.length - 1));
      } else if (key.return || input === " ") {
        const item = items[highlightedIndex];
        if (item) {
          toggleItem(item.value);
        }
      }
    },
    { isActive: isFocused }
  );

  return React.createElement(
    Box,
    {
      flexDirection: orientation === "horizontal" ? "row" : "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    items.map((item, index) => {
      const isSelected = currentValue.includes(item.value);
      const isHighlighted = index === highlightedIndex && isFocused;
      const isDisabled = item.disabled || disabled;

      let bgColor: string | undefined;
      let fgColor = tokens.colors.fg;

      if (isDisabled) {
        fgColor = tokens.colors.disabled;
      } else if (isSelected) {
        bgColor = tokens.colors.accent;
        fgColor = tokens.colors.bg;
      } else if (isHighlighted) {
        fgColor = tokens.colors.accent;
      }

      return React.createElement(
        Box,
        {
          key: item.value,
          paddingX: 1,
          borderStyle: variant === "outline" ? "single" : undefined,
          borderColor:
            variant === "outline"
              ? isSelected
                ? tokens.colors.accent
                : tokens.colors.border
              : undefined,
        },
        React.createElement(
          Text,
          {
            backgroundColor: bgColor,
            color: fgColor,
            bold: isSelected || isHighlighted,
            inverse: isHighlighted && !isSelected,
            dimColor: isDisabled,
          },
          item.label
        )
      );
    })
  );
}
