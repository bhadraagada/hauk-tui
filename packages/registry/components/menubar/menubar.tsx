import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface MenubarItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional keyboard shortcut hint */
  shortcut?: string;
  /** Sub-items for dropdown */
  items?: MenubarSubItem[];
}

export interface MenubarSubItem {
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
}

export interface MenubarProps {
  /** Menu items */
  items: MenubarItem[];
  /** Callback when an item is selected */
  onSelect: (menuId: string, itemId: string) => void;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Menubar({
  items,
  onSelect,
  tokens: propTokens,
  focusId,
}: MenubarProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("menubar");
  const { isFocused } = useFocusable(id);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuIndex, setMenuIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  const activeMenuItem = items.find((item) => item.id === activeMenu);
  const selectableSubItems =
    activeMenuItem?.items?.filter(
      (item) => !item.separator && !item.disabled
    ) || [];

  const handleSelect = useCallback(() => {
    if (activeMenu && selectableSubItems[subIndex]) {
      onSelect(activeMenu, selectableSubItems[subIndex]!.id);
      setActiveMenu(null);
    }
  }, [activeMenu, selectableSubItems, subIndex, onSelect]);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.escape) {
        setActiveMenu(null);
        return;
      }

      if (!activeMenu) {
        // Top-level navigation
        if (key.leftArrow || input === "h") {
          setMenuIndex((prev) => clamp(prev - 1, 0, items.length - 1));
        } else if (key.rightArrow || input === "l") {
          setMenuIndex((prev) => clamp(prev + 1, 0, items.length - 1));
        } else if (key.return || key.downArrow) {
          setActiveMenu(items[menuIndex]?.id || null);
          setSubIndex(0);
        }
      } else {
        // Submenu navigation
        if (key.upArrow || input === "k") {
          setSubIndex((prev) =>
            clamp(prev - 1, 0, selectableSubItems.length - 1)
          );
        } else if (key.downArrow || input === "j") {
          setSubIndex((prev) =>
            clamp(prev + 1, 0, selectableSubItems.length - 1)
          );
        } else if (key.leftArrow || input === "h") {
          const newIndex = clamp(menuIndex - 1, 0, items.length - 1);
          setMenuIndex(newIndex);
          setActiveMenu(items[newIndex]?.id || null);
          setSubIndex(0);
        } else if (key.rightArrow || input === "l") {
          const newIndex = clamp(menuIndex + 1, 0, items.length - 1);
          setMenuIndex(newIndex);
          setActiveMenu(items[newIndex]?.id || null);
          setSubIndex(0);
        } else if (key.return) {
          handleSelect();
        }
      }
    },
    { isActive: isFocused }
  );

  return React.createElement(
    Box,
    { flexDirection: "column" },
    // Menu bar
    React.createElement(
      Box,
      {
        borderStyle: "single",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        borderBottom: true,
        borderTop: false,
        borderLeft: false,
        borderRight: false,
        paddingX: 1,
        gap: 2,
      },
      ...items.map((item, index) => {
        const isActive = index === menuIndex;
        const isOpen = activeMenu === item.id;

        return React.createElement(
          Text,
          {
            key: item.id,
            color: isOpen
              ? tokens.colors.accent
              : isActive
                ? tokens.colors.fg
                : tokens.colors.muted,
            bold: isOpen || isActive,
            inverse: isOpen,
          },
          ` ${item.label} `
        );
      })
    ),
    // Dropdown
    activeMenuItem?.items
      ? React.createElement(
          Box,
          {
            flexDirection: "column",
            borderStyle: "round",
            borderColor: tokens.colors.border,
            width: 25,
            marginLeft: menuIndex * 10,
          },
          ...activeMenuItem.items.map((item, index) => {
            if (item.separator) {
              return React.createElement(
                Box,
                { key: `sep-${index}`, paddingX: 1 },
                React.createElement(
                  Text,
                  { color: tokens.colors.border },
                  "─".repeat(21)
                )
              );
            }

            const isSelected = selectableSubItems[subIndex]?.id === item.id;

            return React.createElement(
              Box,
              { key: item.id, paddingX: 1, justifyContent: "space-between" },
              React.createElement(
                Box,
                { gap: 1 },
                React.createElement(
                  Text,
                  {
                    color: isSelected
                      ? tokens.colors.accent
                      : tokens.colors.muted,
                  },
                  isSelected ? "▸" : " "
                ),
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
                )
              ),
              item.shortcut
                ? React.createElement(
                    Text,
                    { color: tokens.colors.muted, dimColor: true },
                    item.shortcut
                  )
                : null
            );
          })
        )
      : null
  );
}
