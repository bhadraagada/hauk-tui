import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface StatProps {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Optional delta/change indicator */
  delta?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  /** Optional icon */
  icon?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Stat({
  label,
  value,
  delta,
  icon,
  size = "md",
  tokens: propTokens,
}: StatProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Get delta color and symbol
  const getDeltaStyle = () => {
    if (!delta) return null;

    switch (delta.type) {
      case "increase":
        return { color: tokens.colors.success, symbol: "↑" };
      case "decrease":
        return { color: tokens.colors.danger, symbol: "↓" };
      default:
        return { color: tokens.colors.muted, symbol: "→" };
    }
  };

  const deltaStyle = getDeltaStyle();

  // Get value size based on size prop
  const getValueSize = () => {
    switch (size) {
      case "sm":
        return false;
      case "lg":
        return true;
      default:
        return true;
    }
  };

  return React.createElement(
    Box,
    { flexDirection: "column" },
    // Label with optional icon
    React.createElement(
      Box,
      { gap: 1 },
      icon && React.createElement(Text, {}, icon),
      React.createElement(Text, { color: tokens.colors.muted }, label)
    ),
    // Value
    React.createElement(
      Box,
      { gap: 1, alignItems: "baseline" },
      React.createElement(
        Text,
        {
          bold: getValueSize(),
          color: tokens.colors.fg,
        },
        String(value)
      ),
      // Delta indicator
      delta &&
        deltaStyle &&
        React.createElement(
          Text,
          { color: deltaStyle.color },
          `${deltaStyle.symbol} ${delta.value}`
        )
    )
  );
}

export interface StatGroupProps {
  /** Stats to display */
  stats: StatProps[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Show dividers between stats */
  showDividers?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function StatGroup({
  stats,
  direction = "horizontal",
  showDividers = true,
  tokens: propTokens,
}: StatGroupProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Box,
    {
      flexDirection: direction === "horizontal" ? "row" : "column",
      gap: direction === "horizontal" ? 3 : 1,
    },
    stats.map((stat, index) =>
      React.createElement(
        React.Fragment,
        { key: index },
        index > 0 &&
          showDividers &&
          React.createElement(
            Text,
            { color: tokens.colors.border },
            direction === "horizontal" ? "│" : "───────────"
          ),
        React.createElement(Stat, { ...stat, tokens })
      )
    )
  );
}
