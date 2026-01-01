import React from "react";
import { Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface AvatarProps {
  /** Name to generate initials from */
  name?: string;
  /** Fallback character when no name is provided */
  fallback?: string;
  /** Size of the avatar */
  size?: "sm" | "md" | "lg";
  /** Custom tokens override */
  tokens?: Tokens;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]!.charAt(0).toUpperCase();
  }
  return (
    parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
  ).toUpperCase();
}

export function Avatar({
  name,
  fallback = "?",
  size = "md",
  tokens: propTokens,
}: AvatarProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const initials = name ? getInitials(name) : fallback;

  const sizeConfig = {
    sm: { padding: "" },
    md: { padding: " " },
    lg: { padding: "  " },
  };

  const config = sizeConfig[size];

  return React.createElement(
    Text,
    {
      backgroundColor: tokens.colors.accent,
      color: tokens.colors.bg,
      bold: true,
    },
    config.padding,
    initials,
    config.padding
  );
}
