import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface CalendarProps {
  /** Selected date */
  value?: Date;
  /** Callback when date is selected */
  onChange?: (date: Date) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Show week numbers */
  showWeekNumbers?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  tokens: propTokens,
  focusId,
  showWeekNumbers = false,
}: CalendarProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("calendar");
  const { isFocused } = useFocusable(id);

  const today = new Date();
  const [viewDate, setViewDate] = useState(value || today);
  const [selectedDay, setSelectedDay] = useState(
    value?.getDate() || today.getDate()
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.leftArrow || input === "h") {
        if (selectedDay > 1) {
          setSelectedDay(selectedDay - 1);
        } else {
          // Go to previous month
          const prevMonth = new Date(year, month - 1, 1);
          setViewDate(prevMonth);
          setSelectedDay(
            getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth())
          );
        }
      } else if (key.rightArrow || input === "l") {
        if (selectedDay < daysInMonth) {
          setSelectedDay(selectedDay + 1);
        } else {
          // Go to next month
          setViewDate(new Date(year, month + 1, 1));
          setSelectedDay(1);
        }
      } else if (key.upArrow || input === "k") {
        if (selectedDay > 7) {
          setSelectedDay(selectedDay - 7);
        } else {
          const prevMonth = new Date(year, month - 1, 1);
          const prevDays = getDaysInMonth(
            prevMonth.getFullYear(),
            prevMonth.getMonth()
          );
          setViewDate(prevMonth);
          setSelectedDay(prevDays - (7 - selectedDay));
        }
      } else if (key.downArrow || input === "j") {
        if (selectedDay + 7 <= daysInMonth) {
          setSelectedDay(selectedDay + 7);
        } else {
          setViewDate(new Date(year, month + 1, 1));
          setSelectedDay(selectedDay + 7 - daysInMonth);
        }
      } else if (key.return) {
        const selected = new Date(year, month, selectedDay);
        if (minDate && selected < minDate) return;
        if (maxDate && selected > maxDate) return;
        onChange?.(selected);
      } else if (input === "[") {
        // Previous month
        setViewDate(new Date(year, month - 1, 1));
        setSelectedDay(1);
      } else if (input === "]") {
        // Next month
        setViewDate(new Date(year, month + 1, 1));
        setSelectedDay(1);
      }
    },
    { isActive: isFocused }
  );

  // Build calendar grid
  const weeks: React.ReactElement[] = [];

  // Header
  weeks.push(
    React.createElement(
      Box,
      { key: "header", gap: 1 },
      showWeekNumbers
        ? React.createElement(Text, { color: tokens.colors.muted }, "Wk")
        : null,
      ...DAYS.map((day) =>
        React.createElement(
          Text,
          { key: day, color: tokens.colors.muted, bold: true },
          day
        )
      )
    )
  );

  // Days
  let week: React.ReactElement[] = [];
  let weekNum = 1;

  // Add empty cells for days before first of month
  for (let i = 0; i < firstDay; i++) {
    week.push(React.createElement(Text, { key: `empty-${i}` }, "  "));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = day === selectedDay;
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const date = new Date(year, month, day);
    const isDisabled =
      (minDate && date < minDate) || (maxDate && date > maxDate);

    week.push(
      React.createElement(
        Text,
        {
          key: `day-${day}`,
          color: isDisabled
            ? tokens.colors.muted
            : isSelected
              ? tokens.colors.accent
              : isToday
                ? tokens.colors.warning
                : tokens.colors.fg,
          bold: isSelected || isToday,
          inverse: isSelected,
          dimColor: isDisabled,
        },
        day.toString().padStart(2, " ")
      )
    );

    if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
      // Fill remaining cells in last week
      while (week.length < 7 + (showWeekNumbers ? 1 : 0)) {
        week.push(
          React.createElement(Text, { key: `fill-${week.length}` }, "  ")
        );
      }

      weeks.push(
        React.createElement(
          Box,
          { key: `week-${weekNum}`, gap: 1 },
          showWeekNumbers
            ? React.createElement(
                Text,
                { color: tokens.colors.muted, dimColor: true },
                weekNum.toString().padStart(2, " ")
              )
            : null,
          ...week
        )
      );
      week = [];
      weekNum++;
    }
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
      paddingY: 0,
    },
    // Month/Year header
    React.createElement(
      Box,
      { justifyContent: "space-between", marginBottom: 0 },
      React.createElement(Text, { color: tokens.colors.muted }, "["),
      React.createElement(
        Text,
        { bold: true, color: tokens.colors.fg },
        `${MONTHS[month]} ${year}`
      ),
      React.createElement(Text, { color: tokens.colors.muted }, "]")
    ),
    // Calendar grid
    ...weeks,
    // Footer hint
    React.createElement(
      Text,
      { color: tokens.colors.muted, dimColor: true },
      "←↑↓→ navigate  [/] month  Enter select"
    )
  );
}
