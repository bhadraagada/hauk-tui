import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ResizableProps {
  /** Child panels */
  children: React.ReactNode[];
  /** Direction of resize */
  direction?: "horizontal" | "vertical";
  /** Initial sizes (percentages, should sum to 100) */
  defaultSizes?: number[];
  /** Minimum size for each panel */
  minSize?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Resizable({
  children,
  direction = "horizontal",
  defaultSizes,
  minSize = 10,
  tokens: propTokens,
  focusId,
}: ResizableProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("resizable");
  const { isFocused } = useFocusable(id);

  const panelCount = React.Children.count(children);
  const initialSizes = defaultSizes || Array(panelCount).fill(100 / panelCount);
  const [sizes, setSizes] = useState<number[]>(initialSizes);
  const [activeHandle, setActiveHandle] = useState(0);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      // Switch between handles
      if (key.tab) {
        setActiveHandle((prev) => (prev + 1) % (panelCount - 1));
        return;
      }

      const delta = 5;
      const newSizes = [...sizes];

      if (direction === "horizontal") {
        if (key.leftArrow || input === "h") {
          if (newSizes[activeHandle]! > minSize) {
            newSizes[activeHandle] = newSizes[activeHandle]! - delta;
            newSizes[activeHandle + 1] = newSizes[activeHandle + 1]! + delta;
          }
        } else if (key.rightArrow || input === "l") {
          if (newSizes[activeHandle + 1]! > minSize) {
            newSizes[activeHandle] = newSizes[activeHandle]! + delta;
            newSizes[activeHandle + 1] = newSizes[activeHandle + 1]! - delta;
          }
        }
      } else {
        if (key.upArrow || input === "k") {
          if (newSizes[activeHandle]! > minSize) {
            newSizes[activeHandle] = newSizes[activeHandle]! - delta;
            newSizes[activeHandle + 1] = newSizes[activeHandle + 1]! + delta;
          }
        } else if (key.downArrow || input === "j") {
          if (newSizes[activeHandle + 1]! > minSize) {
            newSizes[activeHandle] = newSizes[activeHandle]! + delta;
            newSizes[activeHandle + 1] = newSizes[activeHandle + 1]! - delta;
          }
        }
      }

      setSizes(newSizes);
    },
    { isActive: isFocused }
  );

  const panels: React.ReactElement[] = [];
  const childArray = React.Children.toArray(children);

  childArray.forEach((child, index) => {
    // Add panel
    panels.push(
      React.createElement(
        Box,
        {
          key: `panel-${index}`,
          flexDirection: "column",
          flexGrow: sizes[index],
          flexBasis: 0,
          borderStyle: "single",
          borderColor: tokens.colors.border,
        },
        child
      )
    );

    // Add resize handle between panels
    if (index < childArray.length - 1) {
      const isActive = activeHandle === index;
      panels.push(
        React.createElement(
          Box,
          {
            key: `handle-${index}`,
            flexDirection: direction === "horizontal" ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
          },
          React.createElement(
            Text,
            {
              color:
                isActive && isFocused
                  ? tokens.colors.accent
                  : tokens.colors.muted,
              bold: isActive && isFocused,
            },
            direction === "horizontal" ? "┃" : "━"
          )
        )
      );
    }
  });

  return React.createElement(
    Box,
    {
      flexDirection: direction === "horizontal" ? "row" : "column",
      borderStyle: isFocused ? "double" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    ...panels
  );
}
