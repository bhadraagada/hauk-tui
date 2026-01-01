import React, { useState, useCallback, useMemo } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface CommandItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional keyboard shortcut */
  shortcut?: string;
  /** Optional icon/prefix */
  icon?: string;
  /** Optional group/category */
  group?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Keywords for search */
  keywords?: string[];
}

export interface CommandProps {
  /** Available command items */
  items: CommandItem[];
  /** Placeholder text for search input */
  placeholder?: string;
  /** Callback when an item is selected */
  onSelect: (item: CommandItem) => void;
  /** Callback when command palette should close */
  onClose?: () => void;
  /** Whether the command palette is open */
  open?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Maximum visible items */
  maxItems?: number;
  /** Title for the command palette */
  title?: string;
  /** Empty state message */
  emptyMessage?: string;
}

export function Command({
  items,
  placeholder = "Type to search...",
  onSelect,
  onClose,
  open = true,
  tokens: propTokens,
  focusId,
  maxItems = 8,
  title,
  emptyMessage = "No results found.",
}: CommandProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("command");
  const { isFocused } = useFocusable(id);

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const lowerSearch = search.toLowerCase();
    return items.filter((item) => {
      const labelMatch = item.label.toLowerCase().includes(lowerSearch);
      const descMatch = item.description?.toLowerCase().includes(lowerSearch);
      const keywordMatch = item.keywords?.some((k) =>
        k.toLowerCase().includes(lowerSearch)
      );
      return labelMatch || descMatch || keywordMatch;
    });
  }, [items, search]);

  // Group items
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    const ungrouped: CommandItem[] = [];

    for (const item of filteredItems) {
      if (item.group) {
        if (!groups[item.group]) {
          groups[item.group] = [];
        }
        groups[item.group]!.push(item);
      } else {
        ungrouped.push(item);
      }
    }

    return { groups, ungrouped };
  }, [filteredItems]);

  const selectItem = useCallback(
    (item: CommandItem) => {
      if (item.disabled) return;
      onSelect(item);
    },
    [onSelect]
  );

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.escape) {
        onClose?.();
        return;
      }

      if (key.upArrow) {
        setSelectedIndex((prev) =>
          clamp(prev - 1, 0, filteredItems.length - 1)
        );
      } else if (key.downArrow) {
        setSelectedIndex((prev) =>
          clamp(prev + 1, 0, filteredItems.length - 1)
        );
      } else if (key.return) {
        const selectedItem = filteredItems[selectedIndex];
        if (selectedItem) {
          selectItem(selectedItem);
        }
      } else if (key.backspace || key.delete) {
        setSearch((prev) => prev.slice(0, -1));
        setSelectedIndex(0);
      } else if (input && !key.ctrl && !key.meta) {
        setSearch((prev) => prev + input);
        setSelectedIndex(0);
      }
    },
    { isActive: isFocused }
  );

  if (!open) return null;

  // Flatten for display
  const visibleItems = filteredItems.slice(0, maxItems);

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      width: 50,
    },
    // Title
    title
      ? React.createElement(
          Box,
          { paddingX: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.fg, bold: true },
            title
          )
        )
      : null,
    // Search input
    React.createElement(
      Box,
      {
        paddingX: 1,
        borderStyle: "single",
        borderColor: tokens.colors.border,
        borderTop: false,
        borderLeft: false,
        borderRight: false,
      },
      React.createElement(Text, { color: tokens.colors.muted }, "> "),
      React.createElement(
        Text,
        { color: search ? tokens.colors.fg : tokens.colors.muted },
        search || placeholder
      ),
      React.createElement(Text, { inverse: true }, " ")
    ),
    // Results
    filteredItems.length === 0
      ? React.createElement(
          Box,
          { paddingX: 1, paddingY: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.muted },
            emptyMessage
          )
        )
      : React.createElement(
          Box,
          { flexDirection: "column", paddingX: 1 },
          // Render grouped items
          ...(
            Object.entries(groupedItems.groups) as [string, CommandItem[]][]
          ).flatMap(([group, groupItems]) => [
            React.createElement(
              Box,
              { key: `group-${group}`, marginTop: 1 },
              React.createElement(
                Text,
                { color: tokens.colors.muted, dimColor: true },
                group
              )
            ),
            ...groupItems
              .filter((item) => visibleItems.includes(item))
              .map((item) => renderItem(item, filteredItems.indexOf(item))),
          ]),
          // Render ungrouped items
          ...groupedItems.ungrouped
            .filter((item) => visibleItems.includes(item))
            .map((item) => renderItem(item, filteredItems.indexOf(item)))
        ),
    // Hint
    React.createElement(
      Box,
      {
        paddingX: 1,
        borderStyle: "single",
        borderColor: tokens.colors.border,
        borderBottom: false,
        borderLeft: false,
        borderRight: false,
      },
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        "↑↓ navigate • Enter select • Esc close"
      )
    )
  );

  function renderItem(item: CommandItem, index: number): React.ReactElement {
    const isSelected = index === selectedIndex;
    const isDisabled = item.disabled;

    return React.createElement(
      Box,
      {
        key: item.id,
        paddingX: 1,
        gap: 2,
      },
      // Selection indicator
      React.createElement(
        Text,
        { color: isSelected ? tokens.colors.accent : tokens.colors.fg },
        isSelected ? "›" : " "
      ),
      // Icon
      item.icon
        ? React.createElement(Text, { color: tokens.colors.muted }, item.icon)
        : null,
      // Label and description
      React.createElement(
        Box,
        { flexGrow: 1, gap: 1 },
        React.createElement(
          Text,
          {
            color: isDisabled
              ? tokens.colors.disabled
              : isSelected
                ? tokens.colors.accent
                : tokens.colors.fg,
            bold: isSelected,
            inverse: isSelected && isFocused,
          },
          item.label
        ),
        item.description
          ? React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              item.description
            )
          : null
      ),
      // Shortcut
      item.shortcut
        ? React.createElement(
            Text,
            {
              backgroundColor: tokens.colors.border,
              color: tokens.colors.fg,
            },
            " ",
            item.shortcut,
            " "
          )
        : null
    );
  }
}
