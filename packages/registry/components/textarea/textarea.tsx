import React, { useState, useCallback, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface TextareaProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Number of visible rows */
  rows?: number;
  /** Maximum length */
  maxLength?: number;
}

export function Textarea({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "",
  label,
  disabled = false,
  tokens: propTokens,
  focusId,
  rows = 3,
  maxLength,
}: TextareaProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("textarea");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [cursorRow, setCursorRow] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const lines = currentValue.split("\n");

  const updateValue = useCallback(
    (newValue: string) => {
      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange, maxLength]
  );

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.return) {
        // Insert newline
        const before = lines.slice(0, cursorRow).join("\n");
        const currentLine = lines[cursorRow] || "";
        const lineStart = currentLine.slice(0, cursorCol);
        const lineEnd = currentLine.slice(cursorCol);
        const after = lines.slice(cursorRow + 1).join("\n");

        let newValue = before ? before + "\n" : "";
        newValue += lineStart + "\n" + lineEnd;
        if (after) newValue += "\n" + after;

        updateValue(newValue);
        setCursorRow(cursorRow + 1);
        setCursorCol(0);
      } else if (key.backspace || key.delete) {
        if (cursorCol > 0) {
          const currentLine = lines[cursorRow] || "";
          const newLine =
            currentLine.slice(0, cursorCol - 1) + currentLine.slice(cursorCol);
          lines[cursorRow] = newLine;
          updateValue(lines.join("\n"));
          setCursorCol(cursorCol - 1);
        } else if (cursorRow > 0) {
          const prevLine = lines[cursorRow - 1] || "";
          const currentLine = lines[cursorRow] || "";
          lines[cursorRow - 1] = prevLine + currentLine;
          lines.splice(cursorRow, 1);
          updateValue(lines.join("\n"));
          setCursorRow(cursorRow - 1);
          setCursorCol(prevLine.length);
        }
      } else if (key.upArrow) {
        if (cursorRow > 0) {
          setCursorRow(cursorRow - 1);
          const prevLineLen = (lines[cursorRow - 1] || "").length;
          setCursorCol(Math.min(cursorCol, prevLineLen));
        }
      } else if (key.downArrow) {
        if (cursorRow < lines.length - 1) {
          setCursorRow(cursorRow + 1);
          const nextLineLen = (lines[cursorRow + 1] || "").length;
          setCursorCol(Math.min(cursorCol, nextLineLen));
        }
      } else if (key.leftArrow) {
        if (cursorCol > 0) {
          setCursorCol(cursorCol - 1);
        } else if (cursorRow > 0) {
          setCursorRow(cursorRow - 1);
          setCursorCol((lines[cursorRow - 1] || "").length);
        }
      } else if (key.rightArrow) {
        const lineLen = (lines[cursorRow] || "").length;
        if (cursorCol < lineLen) {
          setCursorCol(cursorCol + 1);
        } else if (cursorRow < lines.length - 1) {
          setCursorRow(cursorRow + 1);
          setCursorCol(0);
        }
      } else if (input && !key.ctrl && !key.meta) {
        const currentLine = lines[cursorRow] || "";
        const newLine =
          currentLine.slice(0, cursorCol) +
          input +
          currentLine.slice(cursorCol);
        lines[cursorRow] = newLine;
        updateValue(lines.join("\n"));
        setCursorCol(cursorCol + input.length);
      }
    },
    { isActive: isFocused }
  );

  const isEmpty = currentValue.length === 0;
  const displayLines = isEmpty ? [placeholder] : lines;

  return React.createElement(
    Box,
    { flexDirection: "column" },
    label
      ? React.createElement(
          Text,
          { color: tokens.colors.fg, bold: true },
          label
        )
      : null,
    React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: isFocused ? "round" : "single",
        borderColor: disabled
          ? tokens.colors.disabled
          : isFocused
            ? tokens.colors.focus
            : tokens.colors.border,
        paddingX: 1,
      },
      displayLines.slice(0, rows).map((line, rowIndex) => {
        const isCurrentRow = rowIndex === cursorRow && isFocused && !isEmpty;

        if (isCurrentRow) {
          const before = line.slice(0, cursorCol);
          const cursor = line[cursorCol] || " ";
          const after = line.slice(cursorCol + 1);

          return React.createElement(
            Text,
            { key: rowIndex, color: tokens.colors.fg },
            before,
            React.createElement(Text, { inverse: true }, cursor),
            after
          );
        }

        return React.createElement(
          Text,
          {
            key: rowIndex,
            color: isEmpty ? tokens.colors.muted : tokens.colors.fg,
            dimColor: isEmpty,
          },
          line || " "
        );
      })
    ),
    maxLength
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          `${currentValue.length}/${maxLength}`
        )
      : null
  );
}
