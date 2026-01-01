import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface AccordionItem {
  /** Unique key for the item */
  key: string;
  /** Item title */
  title: string;
  /** Item content */
  content: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Allow multiple items to be expanded */
  multiple?: boolean;
  /** Controlled expanded keys */
  expandedKeys?: string[];
  /** Default expanded keys for uncontrolled mode */
  defaultExpandedKeys?: string[];
  /** Callback when expansion changes */
  onChange?: (keys: string[]) => void;
  /** Whether the accordion is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Accordion({
  items,
  multiple = false,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys = [],
  onChange,
  disabled = false,
  tokens: propTokens,
  focusId,
}: AccordionProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("accordion");
  const { isFocused } = useFocusable(id);

  const [internalExpandedKeys, setInternalExpandedKeys] =
    useState<string[]>(defaultExpandedKeys);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const isControlled = controlledExpandedKeys !== undefined;
  const expandedKeys = isControlled
    ? controlledExpandedKeys
    : internalExpandedKeys;

  const toggleItem = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (!item || item.disabled) return;

      let newKeys: string[];
      if (expandedKeys.includes(key)) {
        newKeys = expandedKeys.filter((k) => k !== key);
      } else {
        newKeys = multiple ? [...expandedKeys, key] : [key];
      }

      if (!isControlled) {
        setInternalExpandedKeys(newKeys);
      }
      onChange?.(newKeys);
    },
    [items, expandedKeys, multiple, isControlled, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.upArrow || input === "k") {
        setHighlightedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow || input === "j") {
        setHighlightedIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (key.return || input === " ") {
        const item = items[highlightedIndex];
        if (item) {
          toggleItem(item.key);
        }
      }
    },
    { isActive: isFocused }
  );

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    items.map((item, index) => {
      const isExpanded = expandedKeys.includes(item.key);
      const isHighlighted = index === highlightedIndex && isFocused;
      const isDisabled = item.disabled || disabled;

      const icon = isExpanded ? "▼" : "▶";

      return React.createElement(
        Box,
        { key: item.key, flexDirection: "column", paddingX: 1 },
        React.createElement(
          Text,
          {
            color: isDisabled
              ? tokens.colors.disabled
              : isHighlighted
                ? tokens.colors.accent
                : tokens.colors.fg,
            bold: isHighlighted,
            inverse: isHighlighted,
            dimColor: isDisabled,
          },
          icon,
          " ",
          item.title
        ),
        isExpanded
          ? React.createElement(
              Box,
              { paddingLeft: 2, paddingY: 0 },
              React.createElement(
                Text,
                { color: tokens.colors.muted },
                item.content
              )
            )
          : null
      );
    })
  );
}
