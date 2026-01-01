import React, { useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onChange: (page: number) => void;
  /** Whether the pagination is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Show first/last buttons */
  showBoundaryButtons?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  disabled = false,
  tokens: propTokens,
  focusId,
  siblingCount = 1,
  showBoundaryButtons = true,
}: PaginationProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("pagination");
  const { isFocused } = useFocusable(id);

  const goToPage = useCallback(
    (newPage: number) => {
      const clampedPage = clamp(newPage, 1, totalPages);
      if (clampedPage !== page) {
        onChange(clampedPage);
      }
    },
    [page, totalPages, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.leftArrow || input === "h") {
        goToPage(page - 1);
      } else if (key.rightArrow || input === "l") {
        goToPage(page + 1);
      } else if (input === "g" && !key.shift) {
        goToPage(1);
      } else if (input === "G") {
        goToPage(totalPages);
      } else {
        const num = parseInt(input, 10);
        if (num >= 1 && num <= 9 && num <= totalPages) {
          goToPage(num);
        }
      }
    },
    { isActive: isFocused }
  );

  // Calculate visible page numbers
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    if (showBoundaryButtons && leftSibling > 1) {
      pages.push(1);
      if (showLeftEllipsis) pages.push("...");
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (showBoundaryButtons && rightSibling < totalPages) {
      if (showRightEllipsis) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return React.createElement(
    Box,
    {
      gap: 1,
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
    },
    // Previous button
    React.createElement(
      Text,
      {
        color: page > 1 ? tokens.colors.accent : tokens.colors.disabled,
        dimColor: page <= 1,
      },
      "←"
    ),
    // Page numbers
    ...pageNumbers.map((pageNum, index) => {
      if (pageNum === "...") {
        return React.createElement(
          Text,
          { key: `ellipsis-${index}`, color: tokens.colors.muted },
          "..."
        );
      }

      const isCurrent = pageNum === page;
      return React.createElement(
        Text,
        {
          key: pageNum,
          color: isCurrent ? tokens.colors.accent : tokens.colors.fg,
          bold: isCurrent,
          inverse: isCurrent && isFocused,
        },
        String(pageNum)
      );
    }),
    // Next button
    React.createElement(
      Text,
      {
        color:
          page < totalPages ? tokens.colors.accent : tokens.colors.disabled,
        dimColor: page >= totalPages,
      },
      "→"
    ),
    // Page indicator
    React.createElement(
      Text,
      { color: tokens.colors.muted, dimColor: true },
      `(${page}/${totalPages})`
    )
  );
}
