import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ScrollAreaProps {
  /** Content to scroll */
  children: React.ReactNode;
  /** Maximum visible height (in lines) */
  height: number;
  /** Whether to show scrollbar */
  showScrollbar?: boolean;
  /** Whether the scroll area is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Scroll step (lines per scroll) */
  scrollStep?: number;
}

export function ScrollArea({
  children,
  height,
  showScrollbar = true,
  disabled = false,
  tokens: propTokens,
  focusId,
  scrollStep = 1,
}: ScrollAreaProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("scroll-area");
  const { isFocused } = useFocusable(id);

  const [scrollOffset, setScrollOffset] = useState(0);

  // Convert children to array of lines for rendering
  const childArray = React.Children.toArray(children);
  const totalLines = childArray.length;
  const maxScroll = Math.max(0, totalLines - height);

  const scroll = useCallback(
    (delta: number) => {
      setScrollOffset((prev) => clamp(prev + delta, 0, maxScroll));
    },
    [maxScroll]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.upArrow || input === "k") {
        scroll(-scrollStep);
      } else if (key.downArrow || input === "j") {
        scroll(scrollStep);
      } else if (key.pageUp || (key.ctrl && input === "u")) {
        scroll(-height);
      } else if (key.pageDown || (key.ctrl && input === "d")) {
        scroll(height);
      } else if (input === "g") {
        setScrollOffset(0);
      } else if (input === "G") {
        setScrollOffset(maxScroll);
      }
    },
    { isActive: isFocused }
  );

  // Get visible content
  const visibleChildren = childArray.slice(scrollOffset, scrollOffset + height);

  // Render scrollbar
  const renderScrollbar = () => {
    if (!showScrollbar || totalLines <= height) return null;

    const scrollbarHeight = height;
    const thumbHeight = Math.max(
      1,
      Math.floor((height / totalLines) * scrollbarHeight)
    );
    const thumbPosition = Math.floor(
      (scrollOffset / maxScroll) * (scrollbarHeight - thumbHeight)
    );

    const scrollbar: React.ReactElement[] = [];
    for (let i = 0; i < scrollbarHeight; i++) {
      const isThumb = i >= thumbPosition && i < thumbPosition + thumbHeight;
      scrollbar.push(
        React.createElement(
          Text,
          {
            key: i,
            color: isThumb ? tokens.colors.accent : tokens.colors.border,
          },
          isThumb ? "█" : "░"
        )
      );
    }

    return React.createElement(
      Box,
      { flexDirection: "column", marginLeft: 1 },
      scrollbar
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: "row",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
    },
    // Content area
    React.createElement(
      Box,
      {
        flexDirection: "column",
        flexGrow: 1,
        paddingX: 1,
        height,
        overflow: "hidden",
      },
      ...visibleChildren
    ),
    // Scrollbar
    renderScrollbar()
  );
}
