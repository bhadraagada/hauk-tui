import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface ColorPickerProps {
  /** Current color value (hex) */
  value: string;
  /** Callback when color changes */
  onChange?: (color: string) => void;
  /** Preset colors */
  presets?: string[];
  /** Show color preview */
  showPreview?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

// Default preset colors
const DEFAULT_PRESETS = [
  "#ff0000",
  "#ff7700",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#7700ff",
  "#ff00ff",
  "#ffffff",
  "#888888",
  "#000000",
  "#ff5555",
  "#ffaa55",
  "#ffff55",
  "#55ff55",
  "#55ffff",
  "#5555ff",
  "#aa55ff",
  "#ff55ff",
  "#aaaaaa",
];

// Terminal color names
const TERMINAL_COLORS: Record<string, string> = {
  "#ff0000": "red",
  "#00ff00": "green",
  "#0000ff": "blue",
  "#ffff00": "yellow",
  "#ff00ff": "magenta",
  "#00ffff": "cyan",
  "#ffffff": "white",
  "#000000": "black",
};

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  showPreview = true,
  tokens: propTokens,
  focusId,
}: ColorPickerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("color-picker");
  const { isFocused } = useFocusable(id);

  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(0, presets.indexOf(value))
  );

  // Grid dimensions
  const cols = 5;
  const rows = Math.ceil(presets.length / cols);

  // Handle keyboard input
  useInput(
    (input, key) => {
      if (!isFocused) return;

      const currentRow = Math.floor(selectedIndex / cols);
      const currentCol = selectedIndex % cols;

      if (key.leftArrow || input === "h") {
        if (currentCol > 0) {
          setSelectedIndex((prev) => prev - 1);
        }
      } else if (key.rightArrow || input === "l") {
        if (currentCol < cols - 1 && selectedIndex < presets.length - 1) {
          setSelectedIndex((prev) => prev + 1);
        }
      } else if (key.upArrow || input === "k") {
        if (currentRow > 0) {
          setSelectedIndex((prev) => prev - cols);
        }
      } else if (key.downArrow || input === "j") {
        const newIndex = selectedIndex + cols;
        if (newIndex < presets.length) {
          setSelectedIndex(newIndex);
        }
      } else if (key.return || input === " ") {
        onChange?.(presets[selectedIndex]);
      }
    },
    { isActive: isFocused }
  );

  // Render color swatch
  const renderSwatch = (color: string, index: number) => {
    const isSelected = color === value;
    const isFocusedItem = isFocused && index === selectedIndex;

    return React.createElement(
      Text,
      {
        key: index,
        backgroundColor: color,
        color: getLuminance(color) > 0.5 ? "#000000" : "#ffffff",
      },
      isFocusedItem ? "[■]" : isSelected ? " ● " : "   "
    );
  };

  // Calculate relative luminance
  function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Convert hex to RGB
  function hexToRgb(hex: string): number[] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }

  // Build grid rows
  const gridRows: React.ReactElement[] = [];
  for (let row = 0; row < rows; row++) {
    const rowColors = presets.slice(row * cols, (row + 1) * cols);
    gridRows.push(
      React.createElement(
        Box,
        { key: row },
        rowColors.map((color, i) => renderSwatch(color, row * cols + i))
      )
    );
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      padding: 1,
    },
    // Title
    React.createElement(
      Text,
      { color: tokens.colors.muted, marginBottom: 1 },
      "Color Picker"
    ),
    // Preview
    showPreview &&
      React.createElement(
        Box,
        { marginBottom: 1 },
        React.createElement(
          Text,
          {
            backgroundColor: value,
            color: getLuminance(value) > 0.5 ? "#000000" : "#ffffff",
          },
          `  ${value}  `
        ),
        TERMINAL_COLORS[value.toLowerCase()] &&
          React.createElement(
            Text,
            { color: tokens.colors.muted },
            ` (${TERMINAL_COLORS[value.toLowerCase()]})`
          )
      ),
    // Color grid
    React.createElement(Box, { flexDirection: "column" }, ...gridRows),
    // Instructions
    isFocused &&
      React.createElement(
        Box,
        { marginTop: 1 },
        React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          "Arrow keys to move, Enter to select"
        )
      )
  );
}
