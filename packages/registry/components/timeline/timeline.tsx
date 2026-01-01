import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface TimelineItem {
  /** Unique identifier */
  id: string;
  /** Item title */
  title: string;
  /** Item description */
  description?: string;
  /** Timestamp or date label */
  date?: string;
  /** Status of this item */
  status?: "completed" | "current" | "upcoming" | "error";
  /** Custom icon */
  icon?: string;
}

export interface TimelineProps {
  /** Timeline items */
  items: TimelineItem[];
  /** Orientation */
  orientation?: "vertical" | "horizontal";
  /** Show connecting lines */
  showLines?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Timeline({
  items,
  orientation = "vertical",
  showLines = true,
  tokens: propTokens,
}: TimelineProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Get icon and color for status
  const getStatusStyle = (
    status: TimelineItem["status"]
  ): { icon: string; color: string } => {
    switch (status) {
      case "completed":
        return { icon: "✓", color: tokens.colors.success };
      case "current":
        return { icon: "●", color: tokens.colors.accent };
      case "error":
        return { icon: "✗", color: tokens.colors.danger };
      case "upcoming":
      default:
        return { icon: "○", color: tokens.colors.muted };
    }
  };

  if (orientation === "horizontal") {
    return React.createElement(
      Box,
      { flexDirection: "row", gap: 1 },
      items.map((item, index) => {
        const style = getStatusStyle(item.status);
        const isLast = index === items.length - 1;

        return React.createElement(
          Box,
          { key: item.id, flexDirection: "column", alignItems: "center" },
          // Icon and line
          React.createElement(
            Box,
            { gap: 0 },
            React.createElement(
              Text,
              { color: style.color, bold: item.status === "current" },
              item.icon ?? style.icon
            ),
            showLines &&
              !isLast &&
              React.createElement(Text, { color: tokens.colors.border }, "───")
          ),
          // Content
          React.createElement(
            Box,
            { flexDirection: "column", alignItems: "center", marginTop: 1 },
            item.date &&
              React.createElement(
                Text,
                { color: tokens.colors.muted, dimColor: true },
                item.date
              ),
            React.createElement(
              Text,
              {
                color:
                  item.status === "current"
                    ? tokens.colors.accent
                    : tokens.colors.fg,
                bold: item.status === "current",
              },
              item.title
            )
          )
        );
      })
    );
  }

  // Vertical timeline
  return React.createElement(
    Box,
    { flexDirection: "column" },
    items.map((item, index) => {
      const style = getStatusStyle(item.status);
      const isLast = index === items.length - 1;

      return React.createElement(
        Box,
        { key: item.id, flexDirection: "row" },
        // Icon column
        React.createElement(
          Box,
          { flexDirection: "column", alignItems: "center", marginRight: 1 },
          React.createElement(
            Text,
            { color: style.color, bold: item.status === "current" },
            item.icon ?? style.icon
          ),
          showLines &&
            !isLast &&
            React.createElement(Text, { color: tokens.colors.border }, "│")
        ),
        // Content column
        React.createElement(
          Box,
          { flexDirection: "column", marginBottom: isLast ? 0 : 1 },
          // Date
          item.date &&
            React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              item.date
            ),
          // Title
          React.createElement(
            Text,
            {
              color:
                item.status === "current"
                  ? tokens.colors.accent
                  : tokens.colors.fg,
              bold: item.status === "current",
            },
            item.title
          ),
          // Description
          item.description &&
            React.createElement(
              Text,
              { color: tokens.colors.muted },
              item.description
            )
        )
      );
    })
  );
}
