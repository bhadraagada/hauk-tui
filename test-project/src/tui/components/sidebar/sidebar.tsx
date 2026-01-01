import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface SidebarItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Child items for nested navigation */
  children?: SidebarItem[];
  /** Whether this is a section header */
  section?: boolean;
}

export interface SidebarProps {
  /** Navigation items */
  items: SidebarItem[];
  /** Selected item ID */
  value?: string;
  /** Callback when selection changes */
  onChange?: (id: string) => void;
  /** Sidebar title/header */
  title?: string;
  /** Sidebar width */
  width?: number;
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Footer content */
  footer?: React.ReactNode;
}

export function Sidebar({
  items,
  value,
  onChange,
  title,
  width = 25,
  collapsed = false,
  tokens: propTokens,
  focusId,
  footer,
}: SidebarProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("sidebar");
  const { isFocused } = useFocusable(id);

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Flatten items for navigation
  const flatItems = items.reduce<SidebarItem[]>((acc, item) => {
    if (!item.section && !item.disabled) {
      acc.push(item);
    }
    if (item.children) {
      acc.push(...item.children.filter((c) => !c.disabled));
    }
    return acc;
  }, []);

  const handleSelect = useCallback(
    (item: SidebarItem) => {
      if (item.disabled || item.section) return;
      onChange?.(item.id);
    },
    [onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.upArrow || input === "k") {
        setHighlightedIndex((prev) => clamp(prev - 1, 0, flatItems.length - 1));
      } else if (key.downArrow || input === "j") {
        setHighlightedIndex((prev) => clamp(prev + 1, 0, flatItems.length - 1));
      } else if (key.return) {
        const item = flatItems[highlightedIndex];
        if (item) handleSelect(item);
      }
    },
    { isActive: isFocused }
  );

  if (collapsed) {
    return React.createElement(
      Box,
      {
        flexDirection: "column",
        width: 4,
        borderStyle: "single",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        borderLeft: false,
        borderTop: false,
        borderBottom: false,
        paddingY: 1,
      },
      items.map((item) =>
        item.section
          ? null
          : React.createElement(
              Box,
              { key: item.id, justifyContent: "center" },
              React.createElement(
                Text,
                {
                  color:
                    value === item.id
                      ? tokens.colors.accent
                      : tokens.colors.muted,
                },
                item.icon || item.label.charAt(0)
              )
            )
      )
    );
  }

  let flatIndex = 0;
  const renderItem = (
    item: SidebarItem,
    depth = 0
  ): React.ReactElement | null => {
    if (item.section) {
      return React.createElement(
        Box,
        { key: item.id, marginTop: depth === 0 ? 1 : 0, paddingX: 1 },
        React.createElement(
          Text,
          { color: tokens.colors.muted, bold: true, dimColor: true },
          item.label.toUpperCase()
        )
      );
    }

    const currentIndex = flatIndex;
    flatIndex++;
    const isHighlighted = currentIndex === highlightedIndex;
    const isSelected = value === item.id;

    return React.createElement(
      Box,
      { key: item.id, flexDirection: "column" },
      React.createElement(
        Box,
        { paddingX: 1, paddingLeft: 1 + depth * 2, gap: 1 },
        React.createElement(
          Text,
          {
            color: isHighlighted ? tokens.colors.accent : tokens.colors.muted,
          },
          isHighlighted ? "▸" : " "
        ),
        item.icon ? React.createElement(Text, null, item.icon) : null,
        React.createElement(
          Text,
          {
            color: item.disabled
              ? tokens.colors.muted
              : isSelected
                ? tokens.colors.accent
                : tokens.colors.fg,
            dimColor: item.disabled,
            bold: isSelected,
          },
          item.label
        )
      ),
      item.children
        ? React.createElement(
            Box,
            { flexDirection: "column" },
            ...item.children.map((child) => renderItem(child, depth + 1))
          )
        : null
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      width,
      borderStyle: "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      borderLeft: false,
      borderTop: false,
      borderBottom: false,
      paddingY: 1,
    },
    // Title
    title
      ? React.createElement(
          Box,
          { paddingX: 1, marginBottom: 1 },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            title
          )
        )
      : null,
    // Items
    ...items.map((item) => renderItem(item)),
    // Footer
    footer
      ? React.createElement(
          Box,
          { marginTop: 1, paddingX: 1, flexGrow: 1, alignItems: "flex-end" },
          footer
        )
      : null
  );
}
