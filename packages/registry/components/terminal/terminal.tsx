import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface TerminalLine {
  /** Line content */
  content: string;
  /** Line type */
  type?: "command" | "output" | "error" | "success" | "info" | "warning";
  /** Optional prefix/prompt */
  prefix?: string;
  /** Timestamp */
  timestamp?: Date;
}

export interface TerminalProps {
  /** Terminal lines */
  lines: TerminalLine[];
  /** Terminal title */
  title?: string;
  /** Default prompt prefix */
  prompt?: string;
  /** Show timestamps */
  showTimestamps?: boolean;
  /** Maximum lines to display (scrollable) */
  maxLines?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Terminal width */
  width?: number;
}

export function Terminal({
  lines,
  title = "Terminal",
  prompt = "$ ",
  showTimestamps = false,
  maxLines,
  tokens: propTokens,
  width,
}: TerminalProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Limit lines if maxLines is set
  const displayLines = maxLines ? lines.slice(-maxLines) : lines;

  // Get color for line type
  const getLineColor = (type: TerminalLine["type"]): string => {
    switch (type) {
      case "command":
        return tokens.colors.accent;
      case "error":
        return tokens.colors.danger;
      case "success":
        return tokens.colors.success;
      case "info":
        return tokens.colors.info;
      case "warning":
        return tokens.colors.warning;
      case "output":
      default:
        return tokens.colors.fg;
    }
  };

  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: tokens.colors.border,
      ...(width ? { width } : {}),
    },
    // Title bar
    React.createElement(
      Box,
      {
        paddingX: 1,
        justifyContent: "space-between",
        borderStyle: "single",
        borderTop: false,
        borderLeft: false,
        borderRight: false,
        borderColor: tokens.colors.border,
      },
      React.createElement(
        Box,
        { gap: 1 },
        React.createElement(Text, { color: tokens.colors.danger }, "●"),
        React.createElement(Text, { color: tokens.colors.warning }, "●"),
        React.createElement(Text, { color: tokens.colors.success }, "●")
      ),
      React.createElement(
        Text,
        { color: tokens.colors.muted, bold: true },
        title
      ),
      React.createElement(Text, {}, "   ") // Spacer for symmetry
    ),
    // Terminal content
    React.createElement(
      Box,
      { flexDirection: "column", paddingX: 1, paddingY: 1 },
      displayLines.length === 0
        ? React.createElement(
            Text,
            { color: tokens.colors.muted },
            prompt + "█"
          )
        : displayLines.map((line, index) => {
            const prefix =
              line.type === "command"
                ? (line.prefix ?? prompt)
                : (line.prefix ?? "");

            return React.createElement(
              Box,
              { key: index, gap: 1 },
              // Timestamp
              showTimestamps &&
                line.timestamp &&
                React.createElement(
                  Text,
                  { color: tokens.colors.muted },
                  "[" + formatTimestamp(line.timestamp) + "]"
                ),
              // Prefix/prompt
              prefix &&
                React.createElement(
                  Text,
                  {
                    color:
                      line.type === "command"
                        ? tokens.colors.success
                        : tokens.colors.muted,
                    bold: line.type === "command",
                  },
                  prefix
                ),
              // Content
              React.createElement(
                Text,
                { color: getLineColor(line.type) },
                line.content
              )
            );
          })
    )
  );
}
