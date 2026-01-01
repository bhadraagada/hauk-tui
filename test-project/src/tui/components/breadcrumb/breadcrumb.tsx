import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface BreadcrumbItem {
  /** Item label */
  label: string;
  /** Whether this is the current/active item */
  active?: boolean;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator between items */
  separator?: string;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Breadcrumb({
  items,
  separator = " / ",
  tokens: propTokens,
}: BreadcrumbProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Box,
    null,
    items.map((item, index) => {
      const isLast = index === items.length - 1;
      const isActive = item.active || isLast;

      return React.createElement(
        React.Fragment,
        { key: index },
        React.createElement(
          Text,
          {
            color: isActive ? tokens.colors.fg : tokens.colors.muted,
            bold: isActive,
          },
          item.label
        ),
        !isLast
          ? React.createElement(
              Text,
              { color: tokens.colors.border },
              separator
            )
          : null
      );
    })
  );
}
