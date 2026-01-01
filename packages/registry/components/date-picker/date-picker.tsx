import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface DatePickerProps {
  /** Selected date */
  value?: Date;
  /** Callback when date is selected */
  onChange?: (date: Date) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Date format */
  format?: "short" | "medium" | "long";
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Label */
  label?: string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(date: Date, format: "short" | "medium" | "long"): string {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  switch (format) {
    case "short":
      return `${month + 1}/${day}/${year}`;
    case "medium":
      return `${MONTHS[month]} ${day}, ${year}`;
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    default:
      return `${month + 1}/${day}/${year}`;
  }
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  format = "medium",
  minDate,
  maxDate,
  tokens: propTokens,
  focusId,
  label,
}: DatePickerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("date-picker");
  const { isFocused } = useFocusable(id);

  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());
  const [editField, setEditField] = useState<"month" | "day" | "year">("month");

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.return && !isOpen) {
        setIsOpen(true);
        setTempDate(value || new Date());
        return;
      }

      if (key.escape && isOpen) {
        setIsOpen(false);
        return;
      }

      if (isOpen) {
        const year = tempDate.getFullYear();
        const month = tempDate.getMonth();
        const day = tempDate.getDate();

        if (key.tab) {
          if (editField === "month") setEditField("day");
          else if (editField === "day") setEditField("year");
          else setEditField("month");
          return;
        }

        if (key.upArrow || input === "k") {
          if (editField === "month") {
            setTempDate(
              new Date(
                year,
                month + 1,
                Math.min(day, getDaysInMonth(year, month + 1))
              )
            );
          } else if (editField === "day") {
            const maxDay = getDaysInMonth(year, month);
            setTempDate(new Date(year, month, day < maxDay ? day + 1 : 1));
          } else {
            setTempDate(new Date(year + 1, month, day));
          }
        } else if (key.downArrow || input === "j") {
          if (editField === "month") {
            setTempDate(
              new Date(
                year,
                month - 1,
                Math.min(day, getDaysInMonth(year, month - 1))
              )
            );
          } else if (editField === "day") {
            const maxDay = getDaysInMonth(year, month);
            setTempDate(new Date(year, month, day > 1 ? day - 1 : maxDay));
          } else {
            setTempDate(new Date(year - 1, month, day));
          }
        } else if (key.return) {
          if (minDate && tempDate < minDate) return;
          if (maxDate && tempDate > maxDate) return;
          onChange?.(tempDate);
          setIsOpen(false);
        }
      }
    },
    { isActive: isFocused }
  );

  const displayValue = value ? formatDate(value, format) : placeholder;

  const picker = React.createElement(
    Box,
    {
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
      gap: 1,
    },
    React.createElement(
      Text,
      { color: value ? tokens.colors.fg : tokens.colors.muted },
      displayValue
    ),
    React.createElement(
      Text,
      { color: tokens.colors.muted },
      isOpen ? "▲" : "▼"
    )
  );

  if (!isOpen) {
    if (label) {
      return React.createElement(
        Box,
        { flexDirection: "column" },
        React.createElement(
          Text,
          { color: tokens.colors.fg, bold: true },
          label
        ),
        picker
      );
    }
    return picker;
  }

  // Expanded date picker
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
    picker,
    React.createElement(
      Box,
      {
        borderStyle: "round",
        borderColor: tokens.colors.border,
        paddingX: 1,
        gap: 2,
        marginTop: 0,
      },
      React.createElement(
        Box,
        { flexDirection: "column", alignItems: "center" },
        React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          "Month"
        ),
        React.createElement(
          Text,
          {
            color:
              editField === "month" ? tokens.colors.accent : tokens.colors.fg,
            bold: editField === "month",
            inverse: editField === "month",
          },
          ` ${MONTHS[tempDate.getMonth()]} `
        )
      ),
      React.createElement(
        Box,
        { flexDirection: "column", alignItems: "center" },
        React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          "Day"
        ),
        React.createElement(
          Text,
          {
            color:
              editField === "day" ? tokens.colors.accent : tokens.colors.fg,
            bold: editField === "day",
            inverse: editField === "day",
          },
          ` ${tempDate.getDate().toString().padStart(2, "0")} `
        )
      ),
      React.createElement(
        Box,
        { flexDirection: "column", alignItems: "center" },
        React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          "Year"
        ),
        React.createElement(
          Text,
          {
            color:
              editField === "year" ? tokens.colors.accent : tokens.colors.fg,
            bold: editField === "year",
            inverse: editField === "year",
          },
          ` ${tempDate.getFullYear()} `
        )
      )
    ),
    React.createElement(
      Text,
      { color: tokens.colors.muted, dimColor: true },
      "Tab switch field  ↑↓ adjust  Enter confirm  Esc cancel"
    )
  );
}
