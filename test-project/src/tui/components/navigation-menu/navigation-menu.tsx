import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface NavigationMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional href/path */
  href?: string;
  /** Child items for dropdown */
  children?: NavigationMenuChild[];
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface NavigationMenuChild {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Description text */
  description?: string;
  /** Optional href/path */
  href?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface NavigationMenuProps {
  /** Menu items */
  items: NavigationMenuItem[];
  /** Callback when an item is selected */
  onSelect?: (item: NavigationMenuItem | NavigationMenuChild) => void;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
}

export function NavigationMenu({
  items,
  onSelect,
  tokens: propTokens,
  focusId,
  orientation = "horizontal",
}: NavigationMenuProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("navigation-menu");
  const { isFocused } = useFocusable(id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [childIndex, setChildIndex] = useState(0);

  const activeItem = items.find((item) => item.id === openMenu);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.escape) {
        setOpenMenu(null);
        return;
      }

      if (!openMenu) {
        // Top level navigation
        if (orientation === "horizontal") {
          if (key.leftArrow || input === "h") {
            setActiveIndex((prev) => clamp(prev - 1, 0, items.length - 1));
          } else if (key.rightArrow || input === "l") {
            setActiveIndex((prev) => clamp(prev + 1, 0, items.length - 1));
          }
        } else {
          if (key.upArrow || input === "k") {
            setActiveIndex((prev) => clamp(prev - 1, 0, items.length - 1));
          } else if (key.downArrow || input === "j") {
            setActiveIndex((prev) => clamp(prev + 1, 0, items.length - 1));
          }
        }

        if (key.return || key.downArrow) {
          const item = items[activeIndex];
          if (item?.children && item.children.length > 0) {
            setOpenMenu(item.id);
            setChildIndex(0);
          } else if (item) {
            onSelect?.(item);
          }
        }
      } else {
        // Child navigation
        const children = activeItem?.children || [];
        if (key.upArrow || input === "k") {
          setChildIndex((prev) => clamp(prev - 1, 0, children.length - 1));
        } else if (key.downArrow || input === "j") {
          setChildIndex((prev) => clamp(prev + 1, 0, children.length - 1));
        } else if (key.return) {
          const child = children[childIndex];
          if (child && !child.disabled) {
            onSelect?.(child);
            setOpenMenu(null);
          }
        }
      }
    },
    { isActive: isFocused }
  );

  const menuItems = items.map((item, index) => {
    const isActive = index === activeIndex;
    const isOpen = openMenu === item.id;

    return React.createElement(
      Text,
      {
        key: item.id,
        color: item.disabled
          ? tokens.colors.muted
          : isActive || isOpen
            ? tokens.colors.accent
            : tokens.colors.fg,
        bold: isActive || isOpen,
        dimColor: item.disabled,
      },
      ` ${item.label} `,
      item.children ? "▾" : ""
    );
  });

  const dropdown = activeItem?.children
    ? React.createElement(
        Box,
        {
          flexDirection: "column",
          borderStyle: "round",
          borderColor: tokens.colors.border,
          marginTop: 0,
          width: 35,
          paddingY: 0,
        },
        ...activeItem.children.map((child, index) => {
          const isSelected = index === childIndex;
          return React.createElement(
            Box,
            {
              key: child.id,
              flexDirection: "column",
              paddingX: 1,
            },
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
                  color: child.disabled
                    ? tokens.colors.muted
                    : isSelected
                      ? tokens.colors.fg
                      : tokens.colors.fg,
                  bold: isSelected,
                  dimColor: child.disabled,
                },
                child.label
              )
            ),
            child.description
              ? React.createElement(
                  Text,
                  { color: tokens.colors.muted, dimColor: true },
                  "  ",
                  child.description
                )
              : null
          );
        })
      )
    : null;

  return React.createElement(
    Box,
    { flexDirection: "column" },
    React.createElement(
      Box,
      {
        flexDirection: orientation === "horizontal" ? "row" : "column",
        borderStyle: "single",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        borderBottom: orientation === "horizontal",
        borderRight: orientation === "vertical",
        borderTop: false,
        borderLeft: false,
        gap: orientation === "horizontal" ? 1 : 0,
      },
      ...menuItems
    ),
    dropdown
  );
}
