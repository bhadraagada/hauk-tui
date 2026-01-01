import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface Tab {
  /** Tab key/identifier */
  key: string;
  /** Tab label */
  label: string;
  /** Whether this tab is disabled */
  disabled?: boolean;
}

export interface TabsProps {
  /** Available tabs */
  tabs: Tab[];
  /** Controlled active tab key */
  activeKey?: string;
  /** Default active tab for uncontrolled mode */
  defaultActiveKey?: string;
  /** Callback when tab changes */
  onChange?: (key: string) => void;
  /** Whether the tabs component is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Tab orientation */
  orientation?: "horizontal" | "vertical";
  /** Tab style variant */
  variant?: "default" | "boxed" | "underline";
}

export function Tabs({
  tabs,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  disabled = false,
  tokens: propTokens,
  focusId,
  orientation = "horizontal",
  variant = "default",
}: TabsProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("tabs");
  const { isFocused } = useFocusable(id);

  // Internal state for uncontrolled mode
  const defaultKey = defaultActiveKey ?? tabs[0]?.key;
  const [internalActiveKey, setInternalActiveKey] = useState<string | undefined>(defaultKey);
  const isControlled = controlledActiveKey !== undefined;
  const currentActiveKey = isControlled ? controlledActiveKey : internalActiveKey;

  const activeIndex = tabs.findIndex((t) => t.key === currentActiveKey);

  const selectTab = useCallback(
    (key: string) => {
      const tab = tabs.find((t) => t.key === key);
      if (!tab || tab.disabled) return;

      if (!isControlled) {
        setInternalActiveKey(key);
      }
      onChange?.(key);
    },
    [tabs, isControlled, onChange]
  );

  const navigateTo = useCallback(
    (direction: 1 | -1) => {
      let nextIndex = activeIndex + direction;

      // Skip disabled tabs
      while (
        nextIndex >= 0 &&
        nextIndex < tabs.length &&
        tabs[nextIndex]?.disabled
      ) {
        nextIndex += direction;
      }

      nextIndex = clamp(nextIndex, 0, tabs.length - 1);
      const nextTab = tabs[nextIndex];
      if (nextTab && !nextTab.disabled) {
        selectTab(nextTab.key);
      }
    },
    [activeIndex, tabs, selectTab]
  );

  // Handle keyboard navigation
  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      const isHorizontal = orientation === "horizontal";

      if (isHorizontal) {
        if (key.leftArrow || input === "h") {
          navigateTo(-1);
        } else if (key.rightArrow || input === "l") {
          navigateTo(1);
        }
      } else {
        if (key.upArrow || input === "k") {
          navigateTo(-1);
        } else if (key.downArrow || input === "j") {
          navigateTo(1);
        }
      }

      // Number keys for quick access (1-9)
      const num = parseInt(input, 10);
      if (num >= 1 && num <= 9 && num <= tabs.length) {
        const tab = tabs[num - 1];
        if (tab && !tab.disabled) {
          selectTab(tab.key);
        }
      }

      // Home/End
      if (input === "g" && key.shift === false) {
        // Go to first tab
        const firstEnabled = tabs.find((t) => !t.disabled);
        if (firstEnabled) selectTab(firstEnabled.key);
      } else if (input === "G") {
        // Go to last tab
        const lastEnabled = [...tabs].reverse().find((t) => !t.disabled);
        if (lastEnabled) selectTab(lastEnabled.key);
      }
    },
    { isActive: isFocused }
  );

  // Render a single tab
  const renderTab = (tab: Tab, index: number) => {
    const isActive = tab.key === currentActiveKey;
    const isDisabled = tab.disabled;

    let color = tokens.colors.fg;
    if (isDisabled) {
      color = tokens.colors.disabled;
    } else if (isActive) {
      color = tokens.colors.accent;
    }

    // Different styles based on variant
    let prefix = "";
    let suffix = "";

    if (variant === "boxed") {
      prefix = isActive ? "[" : " ";
      suffix = isActive ? "]" : " ";
    } else if (variant === "underline") {
      suffix = isActive ? "─" : " ";
    } else {
      prefix = isActive ? "● " : "○ ";
    }

    const tabNumber = index + 1 <= 9 ? `${index + 1}.` : "  ";

    return React.createElement(
      Box,
      {
        key: tab.key,
        paddingX: orientation === "horizontal" ? 1 : 0,
        paddingY: orientation === "vertical" ? 0 : 0,
      },
      React.createElement(
        Text,
        {
          color,
          bold: isActive && isFocused,
          dimColor: isDisabled,
          inverse: isActive && isFocused && variant !== "underline",
        },
        prefix,
        React.createElement(Text, { color: tokens.colors.muted }, tabNumber, " "),
        tab.label,
        suffix
      )
    );
  };

  // Render underline for underline variant
  const renderUnderline = () => {
    if (variant !== "underline" || orientation !== "horizontal") return null;

    return React.createElement(
      Box,
      null,
      tabs.map((tab) => {
        const isActive = tab.key === currentActiveKey;
        const width = tab.label.length + 5; // account for number prefix and padding

        return React.createElement(
          Box,
          { key: tab.key, paddingX: 1 },
          React.createElement(
            Text,
            { color: isActive ? tokens.colors.accent : tokens.colors.border },
            isActive ? "─".repeat(width) : " ".repeat(width)
          )
        );
      })
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
    },
    React.createElement(
      Box,
      {
        flexDirection: orientation === "horizontal" ? "row" : "column",
        gap: orientation === "horizontal" ? 0 : 0,
      },
      tabs.map(renderTab)
    ),
    renderUnderline(),
    // Hint
    isFocused
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          orientation === "horizontal" ? "←/→ or 1-9" : "↑/↓ or 1-9"
        )
      : null
  );
}
