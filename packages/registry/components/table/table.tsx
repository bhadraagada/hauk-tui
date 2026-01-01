import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp, truncate } from "@hauktui/core";

export interface TableColumn<T> {
  /** Column header */
  header: string;
  /** Key or accessor function */
  accessor: keyof T | ((row: T) => string);
  /** Column width */
  width?: number;
  /** Text alignment */
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Callback when row is selected */
  onSelect?: (row: T, index: number) => void;
  /** Whether rows are selectable */
  selectable?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Maximum visible rows (for scrolling) */
  maxRows?: number;
  /** Show row numbers */
  showRowNumbers?: boolean;
}

export function Table<T>({
  data,
  columns,
  onSelect,
  selectable = true,
  tokens: propTokens,
  focusId,
  maxRows = 10,
  showRowNumbers = false,
}: TableProps<T>): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("table");
  const { isFocused } = useFocusable(id);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const getCellValue = useCallback(
    (row: T, column: TableColumn<T>): string => {
      if (typeof column.accessor === "function") {
        return column.accessor(row);
      }
      const value = row[column.accessor];
      return String(value ?? "");
    },
    []
  );

  useInput(
    (input, key) => {
      if (!isFocused || !selectable) return;

      if (key.upArrow) {
        setSelectedIndex((prev) => {
          const next = Math.max(0, prev - 1);
          if (next < scrollOffset) {
            setScrollOffset(next);
          }
          return next;
        });
      } else if (key.downArrow) {
        setSelectedIndex((prev) => {
          const next = Math.min(data.length - 1, prev + 1);
          if (next >= scrollOffset + maxRows) {
            setScrollOffset(next - maxRows + 1);
          }
          return next;
        });
      } else if (key.return) {
        const selectedRow = data[selectedIndex];
        if (selectedRow) {
          onSelect?.(selectedRow, selectedIndex);
        }
      } else if (key.pageUp || (key.ctrl && input === "u")) {
        setSelectedIndex((prev) => {
          const next = Math.max(0, prev - maxRows);
          setScrollOffset(Math.max(0, scrollOffset - maxRows));
          return next;
        });
      } else if (key.pageDown || (key.ctrl && input === "d")) {
        setSelectedIndex((prev) => {
          const next = Math.min(data.length - 1, prev + maxRows);
          setScrollOffset(Math.min(data.length - maxRows, scrollOffset + maxRows));
          return next;
        });
      }
    },
    { isActive: isFocused }
  );

  const visibleData = data.slice(scrollOffset, scrollOffset + maxRows);
  const defaultWidth = 15;

  // Render header
  const renderHeader = () => {
    const cells: React.ReactElement[] = [];
    
    if (showRowNumbers) {
      cells.push(
        React.createElement(
          Box,
          { key: "rownum", width: 4 },
          React.createElement(Text, { bold: true, color: tokens.colors.muted }, "#")
        )
      );
    }

    for (const column of columns) {
      const width = column.width ?? defaultWidth;
      cells.push(
        React.createElement(
          Box,
          { key: column.header, width },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.accent },
            truncate(column.header, width)
          )
        )
      );
    }

    return React.createElement(Box, { gap: 1 }, ...cells);
  };

  // Render rows
  const renderRows = () => {
    return visibleData.map((row, visibleIndex) => {
      const actualIndex = scrollOffset + visibleIndex;
      const isSelected = actualIndex === selectedIndex;
      const cells: React.ReactElement[] = [];

      if (showRowNumbers) {
        cells.push(
          React.createElement(
            Box,
            { key: "rownum", width: 4 },
            React.createElement(
              Text,
              { color: tokens.colors.muted },
              String(actualIndex + 1)
            )
          )
        );
      }

      for (const column of columns) {
        const width = column.width ?? defaultWidth;
        const value = getCellValue(row, column);
        
        cells.push(
          React.createElement(
            Box,
            { key: column.header, width },
            React.createElement(
              Text,
              {
                color: isSelected && isFocused
                  ? tokens.colors.accent
                  : tokens.colors.fg,
                bold: isSelected && isFocused,
              },
              truncate(value, width)
            )
          )
        );
      }

      return React.createElement(
        Box,
        {
          key: actualIndex,
          gap: 1,
          paddingLeft: isSelected && isFocused ? 0 : 1,
        },
        isSelected && isFocused
          ? React.createElement(Text, { color: tokens.colors.accent }, "›")
          : null,
        ...cells
      );
    });
  };

  // Render scroll indicator
  const renderScrollIndicator = () => {
    if (data.length <= maxRows) return null;
    
    const showUp = scrollOffset > 0;
    const showDown = scrollOffset + maxRows < data.length;
    
    return React.createElement(
      Box,
      { justifyContent: "flex-end", paddingRight: 1 },
      React.createElement(
        Text,
        { color: tokens.colors.muted },
        showUp ? "↑" : " ",
        ` ${scrollOffset + 1}-${Math.min(scrollOffset + maxRows, data.length)}/${data.length} `,
        showDown ? "↓" : " "
      )
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
    },
    renderHeader(),
    React.createElement(
      Box,
      { marginY: 0 },
      React.createElement(
        Text,
        { color: tokens.colors.border },
        "─".repeat(columns.reduce((sum, c) => sum + (c.width ?? defaultWidth) + 1, showRowNumbers ? 5 : 0))
      )
    ),
    React.createElement(Box, { flexDirection: "column" }, ...renderRows()),
    renderScrollIndicator()
  );
}
