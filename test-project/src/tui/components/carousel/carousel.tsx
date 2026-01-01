import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface CarouselItem {
  /** Unique identifier */
  id: string;
  /** Content to display */
  content: React.ReactNode;
  /** Optional label */
  label?: string;
}

export interface CarouselProps {
  /** Carousel items */
  items: CarouselItem[];
  /** Current active index */
  activeIndex?: number;
  /** Callback when active item changes */
  onChange?: (index: number) => void;
  /** Auto-play interval in ms (0 to disable) */
  autoPlay?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dots indicator */
  showDots?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
}

export function Carousel({
  items,
  activeIndex: controlledIndex,
  onChange,
  autoPlay = 0,
  showArrows = true,
  showDots = true,
  tokens: propTokens,
  focusId,
  orientation = "horizontal",
}: CarouselProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("carousel");
  const { isFocused } = useFocusable(id);

  const [internalIndex, setInternalIndex] = useState(0);
  const activeIdx = controlledIndex ?? internalIndex;

  const setIndex = (index: number) => {
    const newIndex = clamp(index, 0, items.length - 1);
    setInternalIndex(newIndex);
    onChange?.(newIndex);
  };

  useEffect(() => {
    if (autoPlay > 0 && !isFocused) {
      const timer = setInterval(() => {
        setIndex((activeIdx + 1) % items.length);
      }, autoPlay);
      return () => clearInterval(timer);
    }
  }, [autoPlay, activeIdx, items.length, isFocused]);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (orientation === "horizontal") {
        if (key.leftArrow || input === "h") {
          setIndex(activeIdx > 0 ? activeIdx - 1 : items.length - 1);
        } else if (key.rightArrow || input === "l") {
          setIndex(activeIdx < items.length - 1 ? activeIdx + 1 : 0);
        }
      } else {
        if (key.upArrow || input === "k") {
          setIndex(activeIdx > 0 ? activeIdx - 1 : items.length - 1);
        } else if (key.downArrow || input === "j") {
          setIndex(activeIdx < items.length - 1 ? activeIdx + 1 : 0);
        }
      }

      // Number keys for direct access
      const num = parseInt(input, 10);
      if (num >= 1 && num <= items.length) {
        setIndex(num - 1);
      }
    },
    { isActive: isFocused }
  );

  const currentItem = items[activeIdx];

  const leftArrow = showArrows
    ? React.createElement(
        Text,
        {
          color: isFocused ? tokens.colors.accent : tokens.colors.muted,
          bold: isFocused,
        },
        orientation === "horizontal" ? "◀" : "▲"
      )
    : null;

  const rightArrow = showArrows
    ? React.createElement(
        Text,
        {
          color: isFocused ? tokens.colors.accent : tokens.colors.muted,
          bold: isFocused,
        },
        orientation === "horizontal" ? "▶" : "▼"
      )
    : null;

  const dots = showDots
    ? React.createElement(
        Box,
        { gap: 1, justifyContent: "center" },
        ...items.map((item, index) =>
          React.createElement(
            Text,
            {
              key: item.id,
              color:
                index === activeIdx
                  ? tokens.colors.accent
                  : tokens.colors.muted,
            },
            index === activeIdx ? "●" : "○"
          )
        )
      )
    : null;

  const content = React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 2,
      paddingY: 1,
      flexGrow: 1,
    },
    currentItem?.label
      ? React.createElement(
          Text,
          { bold: true, color: tokens.colors.fg },
          currentItem.label
        )
      : null,
    currentItem?.content
  );

  if (orientation === "horizontal") {
    return React.createElement(
      Box,
      { flexDirection: "column", gap: 0 },
      React.createElement(
        Box,
        { alignItems: "center", gap: 1 },
        leftArrow,
        content,
        rightArrow
      ),
      dots
    );
  }

  return React.createElement(
    Box,
    { flexDirection: "column", alignItems: "center", gap: 0 },
    leftArrow,
    content,
    rightArrow,
    dots
  );
}
