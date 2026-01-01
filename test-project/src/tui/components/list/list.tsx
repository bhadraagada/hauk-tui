import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ListItem<T = string> {
  /** Display label */
  label: string;
  /** Item value */
  value: T;
  /** Secondary text/description */
  description?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface ListProps<T = string> {
  /** List items */
  items: ListItem<T>[];
  /** Controlled selected value */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Callback when selection changes */
  onChange?: (value: T) => void;
  /** Callback when Enter is pressed on selected item */
  onSelect?: (value: T) => void;
  /** Whether the list is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Maximum visible items before scrolling */
  maxHeight?: number;
  /** Show item descriptions */
  showDescriptions?: boolean;
  /** Show scroll indicators */
  showScrollIndicators?: boolean;
}

export function List<T = string>({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  onSelect,
  disabled = false,
  tokens: propTokens,
  focusId,
  maxHeight = 10,
  showDescriptions = false,
  showScrollIndicators = true,
}: ListProps<T>): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("list");
  const { isFocused } = useFocusable(id);

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Highlighted index for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    if (currentValue !== undefined) {
      const idx = items.findIndex((item) => item.value === currentValue);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // Scroll offset
  const [scrollOffset, setScrollOffset] = useState(0);

  // Update highlighted index when value changes externally
  useEffect(() => {
    if (currentValue !== undefined) {
      const idx = items.findIndex((item) => item.value === currentValue);
      if (idx >= 0) {
        setHighlightedIndex(idx);
      }
    }
  }, [currentValue, items]);

  // Ensure scroll keeps highlighted item visible
  useEffect(() => {
    if (highlightedIndex < scrollOffset) {
      setScrollOffset(highlightedIndex);
    } else if (highlightedIndex >= scrollOffset + maxHeight) {
      setScrollOffset(highlightedIndex - maxHeight + 1);
    }
  }, [highlightedIndex, scrollOffset, maxHeight]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item || item.disabled) return;

      if (!isControlled) {
        setInternalValue(item.value);
      }
      onChange?.(item.value);
    },
    [items, isControlled, onChange]
  );

  // Handle keyboard navigation
  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.upArrow || input === "k") {
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          // Skip disabled items
          while (next >= 0 && items[next]?.disabled) {
            next--;
          }
          return clamp(next, 0, items.length - 1);
        });
      } else if (key.downArrow || input === "j") {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          // Skip disabled items
          while (next < items.length && items[next]?.disabled) {
            next++;
          }
          return clamp(next, 0, items.length - 1);
        });
      } else if (key.return || input === " ") {
        selectItem(highlightedIndex);
        const item = items[highlightedIndex];
        if (item && !item.disabled) {
          onSelect?.(item.value);
        }
      } else if (input === "g") {
        // Go to top
        setHighlightedIndex(0);
        setScrollOffset(0);
      } else if (input === "G") {
        // Go to bottom
        setHighlightedIndex(items.length - 1);
      } else if (key.pageUp) {
        setHighlightedIndex((prev) => clamp(prev - maxHeight, 0, items.length - 1));
      } else if (key.pageDown) {
        setHighlightedIndex((prev) => clamp(prev + maxHeight, 0, items.length - 1));
      }
    },
    { isActive: isFocused }
  );

  // Calculate visible items
  const visibleItems = useMemo(() => {
    return items.slice(scrollOffset, scrollOffset + maxHeight);
  }, [items, scrollOffset, maxHeight]);

  // Check if we need scroll indicators
  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset + maxHeight < items.length;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    // Scroll up indicator
    showScrollIndicators && canScrollUp
      ? React.createElement(
          Box,
          { justifyContent: "center" },
          React.createElement(Text, { color: tokens.colors.muted }, "▲ more")
        )
      : null,
    // List items
    visibleItems.map((item, visibleIndex) => {
      const actualIndex = scrollOffset + visibleIndex;
      const isSelected = item.value === currentValue;
      const isHighlighted = actualIndex === highlightedIndex;
      const isDisabled = item.disabled;

      let color = tokens.colors.fg;
      if (isDisabled) {
        color = tokens.colors.disabled;
      } else if (isHighlighted) {
        color = tokens.colors.accent;
      }

      const prefix = isSelected ? "● " : "  ";
      const highlight = isHighlighted && isFocused;

      return React.createElement(
        Box,
        {
          key: actualIndex,
          flexDirection: "column",
          paddingX: 1,
        },
        React.createElement(
          Box,
          null,
          React.createElement(
            Text,
            {
              color,
              bold: highlight,
              dimColor: isDisabled,
              inverse: highlight,
            },
            prefix,
            item.label
          )
        ),
        showDescriptions && item.description
          ? React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              "   ",
              item.description
            )
          : null
      );
    }),
    // Scroll down indicator
    showScrollIndicators && canScrollDown
      ? React.createElement(
          Box,
          { justifyContent: "center" },
          React.createElement(Text, { color: tokens.colors.muted }, "▼ more")
        )
      : null,
    // Item count indicator
    React.createElement(
      Box,
      { justifyContent: "flex-end", paddingX: 1 },
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        `${highlightedIndex + 1}/${items.length}`
      )
    )
  );
}
