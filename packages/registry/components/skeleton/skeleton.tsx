import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface SkeletonProps {
  /** Width of the skeleton in characters */
  width?: number;
  /** Height (number of lines) */
  height?: number;
  /** Skeleton variant */
  variant?: "text" | "circular" | "rectangular";
  /** Whether to animate */
  animate?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Skeleton({
  width = 20,
  height = 1,
  variant = "text",
  animate = true,
  tokens: propTokens,
}: SkeletonProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 500);
    return () => clearInterval(timer);
  }, [animate]);

  const chars = ["░", "▒", "▓"];
  const char = animate ? chars[phase] : "░";

  if (variant === "circular") {
    return React.createElement(
      Text,
      { color: tokens.colors.border },
      "(",
      char!.repeat(Math.max(1, width - 2)),
      ")"
    );
  }

  const lines = Array.from({ length: height }, (_, i) => i);

  return React.createElement(
    Box,
    { flexDirection: "column" },
    lines.map((lineIndex) =>
      React.createElement(
        Text,
        { key: lineIndex, color: tokens.colors.border },
        char!.repeat(width)
      )
    )
  );
}
