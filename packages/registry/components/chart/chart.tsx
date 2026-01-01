import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface ChartDataPoint {
  /** Label for the data point */
  label: string;
  /** Value */
  value: number;
  /** Optional color */
  color?: string;
}

export interface ChartProps {
  /** Chart data */
  data: ChartDataPoint[];
  /** Chart type */
  type?: "bar" | "horizontal-bar" | "sparkline";
  /** Chart title */
  title?: string;
  /** Maximum width for bars */
  maxWidth?: number;
  /** Show values */
  showValues?: boolean;
  /** Show labels */
  showLabels?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Height for sparkline */
  height?: number;
}

const SPARKLINE_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

export function Chart({
  data,
  type = "horizontal-bar",
  title,
  maxWidth = 30,
  showValues = true,
  showLabels = true,
  tokens: propTokens,
  height = 1,
}: ChartProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  if (type === "sparkline") {
    const range = maxValue - minValue || 1;
    const sparkline = data.map((point) => {
      const normalized = (point.value - minValue) / range;
      const charIndex = Math.floor(normalized * (SPARKLINE_CHARS.length - 1));
      return SPARKLINE_CHARS[charIndex];
    });

    return React.createElement(
      Box,
      { flexDirection: "column" },
      title
        ? React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            title
          )
        : null,
      React.createElement(
        Text,
        { color: tokens.colors.accent },
        sparkline.join("")
      ),
      showValues
        ? React.createElement(
            Box,
            { justifyContent: "space-between" },
            React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              minValue.toString()
            ),
            React.createElement(
              Text,
              { color: tokens.colors.muted, dimColor: true },
              maxValue.toString()
            )
          )
        : null
    );
  }

  if (type === "bar") {
    // Vertical bar chart
    const barHeight = 8;
    const rows: React.ReactElement[] = [];

    for (let row = barHeight; row >= 1; row--) {
      const cells = data.map((point, index) => {
        const barLevel = Math.ceil((point.value / maxValue) * barHeight);
        const filled = row <= barLevel;
        return React.createElement(
          Text,
          {
            key: `${point.label}-${row}`,
            color: filled
              ? point.color || tokens.colors.accent
              : tokens.colors.muted,
          },
          filled ? "█" : " ",
          " "
        );
      });

      rows.push(React.createElement(Box, { key: `row-${row}` }, ...cells));
    }

    return React.createElement(
      Box,
      { flexDirection: "column" },
      title
        ? React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            title
          )
        : null,
      ...rows,
      showLabels
        ? React.createElement(
            Box,
            null,
            ...data.map((point) =>
              React.createElement(
                Text,
                { key: point.label, color: tokens.colors.muted },
                point.label.charAt(0),
                " "
              )
            )
          )
        : null
    );
  }

  // Horizontal bar chart (default)
  const maxLabelLength = Math.max(...data.map((d) => d.label.length));

  return React.createElement(
    Box,
    { flexDirection: "column" },
    title
      ? React.createElement(
          Text,
          { bold: true, color: tokens.colors.fg, marginBottom: 1 },
          title
        )
      : null,
    ...data.map((point) => {
      const barWidth = Math.round((point.value / maxValue) * maxWidth);
      const bar = "█".repeat(barWidth) + "░".repeat(maxWidth - barWidth);

      return React.createElement(
        Box,
        { key: point.label, gap: 1 },
        showLabels
          ? React.createElement(
              Text,
              { color: tokens.colors.fg },
              point.label.padEnd(maxLabelLength)
            )
          : null,
        React.createElement(
          Text,
          { color: point.color || tokens.colors.accent },
          bar
        ),
        showValues
          ? React.createElement(
              Text,
              { color: tokens.colors.muted },
              point.value.toString()
            )
          : null
      );
    })
  );
}
