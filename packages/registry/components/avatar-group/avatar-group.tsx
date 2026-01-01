import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface AvatarGroupProps {
  /** Avatar names or initials */
  avatars: string[];
  /** Maximum avatars to show */
  max?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom tokens override */
  tokens?: Tokens;
  /** Stacking direction */
  direction?: "left" | "right";
}

// Color palette for avatars
const AVATAR_COLORS = [
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
];

export function AvatarGroup({
  avatars,
  max = 5,
  size = "md",
  tokens: propTokens,
  direction = "right",
}: AvatarGroupProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Get avatar dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { width: 3, chars: 1 };
      case "lg":
        return { width: 5, chars: 2 };
      default:
        return { width: 4, chars: 2 };
    }
  };

  const dims = getDimensions();

  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, dims.chars).toUpperCase();
    }
    return parts
      .slice(0, dims.chars)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  // Get color for name (deterministic based on name)
  const getColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  };

  // Avatars to display
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  // Render single avatar
  const renderAvatar = (name: string, index: number) => {
    const initials = getInitials(name);
    const bgColor = getColor(name);
    const padding = " ".repeat(Math.floor((dims.width - initials.length) / 2));

    return React.createElement(
      Box,
      {
        key: index,
        marginLeft: index > 0 ? -1 : 0,
      },
      React.createElement(
        Text,
        {
          backgroundColor: bgColor,
          color: "#ffffff",
          bold: true,
        },
        `${padding}${initials}${padding}`
      )
    );
  };

  // Render overflow indicator
  const renderOverflow = () => {
    if (remaining <= 0) return null;

    const text = `+${remaining}`;
    const padding = " ".repeat(
      Math.max(0, Math.floor((dims.width - text.length) / 2))
    );

    return React.createElement(
      Box,
      { marginLeft: -1 },
      React.createElement(
        Text,
        {
          backgroundColor: tokens.colors.border,
          color: tokens.colors.fg,
        },
        `${padding}${text}${padding}`
      )
    );
  };

  const avatarElements =
    direction === "right" ? displayAvatars : displayAvatars.reverse();

  return React.createElement(
    Box,
    { flexDirection: "row" },
    avatarElements.map(renderAvatar),
    renderOverflow()
  );
}
