import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ContextMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional keyboard shortcut */
  shortcut?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Whether this is a separator */
  separator?: boolean;
  /** Optional icon/prefix */
  icon?: string;
  /** Danger/destructive action */
  danger?: boolean;
}

export interface ContextMenuProps {
  /** Menu items */
  items: ContextMenuItem[];
  /** Whether the menu is open */
  open: boolean;
  /** Callback when menu should close */
  onClose: () => void;
  /** Callback when an item is selected */
  onSelect: (item: ContextMenuItem) => void;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Menu width */
  width?: number;
  /** Menu title */
  title?: string;
}

export function ContextMenu({
  items,
  open,
  onClose,
  onSelect,
  tokens: propTokens,
  focusId,
  width = 25,
  title,
}: ContextMenuProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("context-menu");
  const { isFocused } = useFocusable(id);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectableItems = items.filter(
    (item) => !item.separator && !item.disabled
  );

  const handleSelect = useCallback(() => {
    const item = selectableItems[selectedIndex];
    if (item && !item.disabled) {
      onSelect(item);
      onClose();
    }
  }, [selectableItems, selectedIndex, onSelect, onClose]);

  useInput(
    (input, key) => {
      if (!open || !isFocused) return;

      if (key.escape || input === "q") {
        onClose();
        return;
      }

      if (key.upArrow || input === "k") {
        setSelectedIndex((prev) =>
          clamp(prev - 1, 0, selectableItems.length - 1)
        );
      } else if (key.downArrow || input === "j") {
        setSelectedIndex((prev) =>
          clamp(prev + 1, 0, selectableItems.length - 1)
        );
      } else if (key.return) {
        handleSelect();
      }
    },
    { isActive: open && isFocused }
  );

  if (!open) return null;

  const menuItems = items.map((item, index) => {
    if (item.separator) {
      return React.createElement(
        Box,
        { key: `sep-${index}`, paddingX: 1 },
        React.createElement(
          Text,
          { color: tokens.colors.border },
          "─".repeat(width - 4)
        )
      );
    }

    const isSelected = selectableItems[selectedIndex]?.id === item.id;

    return React.createElement(
      Box,
      {
        key: item.id,
        paddingX: 1,
        gap: 1,
      },
      React.createElement(
        Text,
        { color: isSelected ? tokens.colors.accent : tokens.colors.muted },
        isSelected ? "▸" : " "
      ),
      item.icon ? React.createElement(Text, null, item.icon) : null,
      React.createElement(
        Text,
        {
          color: item.disabled
            ? tokens.colors.muted
            : item.danger
              ? tokens.colors.danger
              : isSelected
                ? tokens.colors.fg
                : tokens.colors.fg,
          dimColor: item.disabled,
          bold: isSelected,
        },
        item.label
      ),
      item.shortcut
        ? React.createElement(
            Box,
            { flexGrow: 1, justifyContent: "flex-end" },
            React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              item.shortcut
            )
          )
        : null
    );
  });

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      width,
      paddingY: 0,
    },
    title
      ? React.createElement(
          Box,
          { paddingX: 1, marginBottom: 0 },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.muted },
            title
          )
        )
      : null,
    title
      ? React.createElement(
          Box,
          { paddingX: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.border },
            "─".repeat(width - 4)
          )
        )
      : null,
    ...menuItems
  );
}
