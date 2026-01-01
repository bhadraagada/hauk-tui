import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface FieldProps {
  /** Field label */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Help text/description */
  description?: string;
  /** The input element */
  children: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Label position */
  labelPosition?: "top" | "left";
  /** Label width (for left position) */
  labelWidth?: number;
}

export function Field({
  label,
  required = false,
  error,
  description,
  children,
  tokens: propTokens,
  labelPosition = "top",
  labelWidth = 15,
}: FieldProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const labelElement = React.createElement(
    Box,
    {
      width: labelPosition === "left" ? labelWidth : undefined,
      marginBottom: labelPosition === "top" ? 0 : 0,
    },
    React.createElement(Text, { color: tokens.colors.fg, bold: true }, label),
    required
      ? React.createElement(Text, { color: tokens.colors.danger }, " *")
      : null
  );

  const inputElement = React.createElement(
    Box,
    { flexDirection: "column", flexGrow: 1 },
    children,
    // Description
    description && !error
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          description
        )
      : null,
    // Error
    error
      ? React.createElement(Text, { color: tokens.colors.danger }, "⚠ ", error)
      : null
  );

  if (labelPosition === "left") {
    return React.createElement(
      Box,
      { gap: 1, alignItems: "flex-start" },
      labelElement,
      inputElement
    );
  }

  return React.createElement(
    Box,
    { flexDirection: "column", gap: 0 },
    labelElement,
    inputElement
  );
}
