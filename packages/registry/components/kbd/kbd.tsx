import React from "react";
import { Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface KbdProps {
  /** Key or key combination to display */
  children: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Kbd({
  children,
  tokens: propTokens,
}: KbdProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Text,
    {
      backgroundColor: tokens.colors.border,
      color: tokens.colors.fg,
    },
    " ",
    children,
    " "
  );
}
