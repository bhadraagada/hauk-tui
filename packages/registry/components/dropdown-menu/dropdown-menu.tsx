import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface DropdownMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional keyboard shortcut */
  shortcut?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Whether this is a separator */
  separator?: boolean;
  /** Optional icon/prefix */
  icon?: string;
}

export interface DropdownMenuProps {
  /** Menu items */
  items: DropdownMenuItem[];
  /** Whether the menu is open */
  open: boolean;
  /** Callback when menu should close */
  onClose: () => void;
  /** Callback when an item is selected */
  onSelect: (item: DropdownMenuItem) => void;
  /** Menu title/trigger label */
  trigger?: string;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Menu width */
  width?: number;
}

export function DropdownMenu({
  items,
  open,
  onClose,
  onSelect,
  trigger,
  tokens: propTokens,
  focusId,
  width = 30,
}: DropdownMenuProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("dropdown-menu");
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

  const triggerElement = trigger
    ? React.createElement(
        Box,
        { marginBottom: open ? 0 : 0 },
        React.createElement(
          Text,
          { color: isFocused ? tokens.colors.focus : tokens.colors.fg },
          trigger,
          " ",
          open ? "▲" : "▼"
        )
      )
    : null;

  if (!open) {
    return triggerElement || React.createElement(Box, null);
  }

  let selectableIndex = 0;
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
    const currentSelectableIndex = selectableIndex;
    selectableIndex++;

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
    { flexDirection: "column" },
    triggerElement,
    React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        width,
        paddingY: 0,
      },
      ...menuItems
    )
  );
}
