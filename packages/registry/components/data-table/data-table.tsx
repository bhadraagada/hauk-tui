import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface DataTableColumn<T> {
  /** Column header */
  header: string;
  /** Key to access data */
  accessor: keyof T;
  /** Column width */
  width?: number;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Custom render function */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Data rows */
  data: T[];
  /** Callback when row is selected */
  onSelect?: (row: T, index: number) => void;
  /** Maximum visible rows */
  maxRows?: number;
  /** Whether rows are selectable */
  selectable?: boolean;
  /** Show row numbers */
  showRowNumbers?: boolean;
  /** Enable sorting */
  sortable?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Striped rows */
  striped?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSelect,
  maxRows = 10,
  selectable = true,
  showRowNumbers = false,
  sortable = true,
  tokens: propTokens,
  focusId,
  striped = true,
}: DataTableProps<T>): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("data-table");
  const { isFocused } = useFocusable(id);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortAsc]);

  const visibleData = sortedData.slice(scrollOffset, scrollOffset + maxRows);

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.upArrow || input === "k") {
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
          if (selectedIndex - 1 < scrollOffset) {
            setScrollOffset(scrollOffset - 1);
          }
        }
      } else if (key.downArrow || input === "j") {
        if (selectedIndex < sortedData.length - 1) {
          setSelectedIndex(selectedIndex + 1);
          if (selectedIndex + 1 >= scrollOffset + maxRows) {
            setScrollOffset(scrollOffset + 1);
          }
        }
      } else if (input === "g") {
        setSelectedIndex(0);
        setScrollOffset(0);
      } else if (input === "G") {
        setSelectedIndex(sortedData.length - 1);
        setScrollOffset(Math.max(0, sortedData.length - maxRows));
      } else if (key.return && selectable) {
        onSelect?.(sortedData[selectedIndex]!, selectedIndex);
      } else if (sortable && input === "s") {
        // Cycle through columns for sorting
        const currentColIndex = sortColumn
          ? columns.findIndex((c) => c.accessor === sortColumn)
          : -1;
        const nextColIndex = (currentColIndex + 1) % columns.length;
        const nextCol = columns[nextColIndex]!.accessor;
        if (nextCol === sortColumn) {
          setSortAsc(!sortAsc);
        } else {
          setSortColumn(nextCol);
          setSortAsc(true);
        }
      }
    },
    { isActive: isFocused }
  );

  const getColumnWidth = (col: DataTableColumn<T>): number => {
    if (col.width) return col.width;
    const headerLen = col.header.length;
    const maxDataLen = Math.max(
      ...data.map((row) => String(row[col.accessor] ?? "").length)
    );
    return Math.max(headerLen, maxDataLen) + 2;
  };

  // Header row
  const headerRow = React.createElement(
    Box,
    { gap: 0 },
    showRowNumbers
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, bold: true },
          "#".padEnd(4)
        )
      : null,
    ...columns.map((col) => {
      const width = getColumnWidth(col);
      const isSorted = sortColumn === col.accessor;
      const sortIndicator = isSorted ? (sortAsc ? " ▲" : " ▼") : "";

      return React.createElement(
        Text,
        {
          key: String(col.accessor),
          color: tokens.colors.fg,
          bold: true,
        },
        (col.header + sortIndicator).padEnd(width)
      );
    })
  );

  // Separator
  const totalWidth =
    columns.reduce((sum, col) => sum + getColumnWidth(col), 0) +
    (showRowNumbers ? 4 : 0);
  const separator = React.createElement(
    Text,
    { color: tokens.colors.border },
    "─".repeat(totalWidth)
  );

  // Data rows
  const dataRows = visibleData.map((row, visibleIdx) => {
    const actualIndex = scrollOffset + visibleIdx;
    const isSelected = actualIndex === selectedIndex;
    const isStriped = striped && visibleIdx % 2 === 1;

    return React.createElement(
      Box,
      { key: actualIndex, gap: 0 },
      showRowNumbers
        ? React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            (actualIndex + 1).toString().padEnd(4)
          )
        : null,
      ...columns.map((col) => {
        const width = getColumnWidth(col);
        const value = row[col.accessor];
        const displayValue = col.render
          ? col.render(value, row)
          : String(value ?? "");

        let text = String(displayValue);
        if (col.align === "right") {
          text = text.padStart(width);
        } else if (col.align === "center") {
          const pad = Math.floor((width - text.length) / 2);
          text = " ".repeat(pad) + text + " ".repeat(width - pad - text.length);
        } else {
          text = text.padEnd(width);
        }

        return React.createElement(
          Text,
          {
            key: String(col.accessor),
            color:
              isSelected && isFocused ? tokens.colors.accent : tokens.colors.fg,
            bold: isSelected && isFocused,
            backgroundColor:
              isSelected && isFocused
                ? undefined
                : isStriped
                  ? tokens.colors.muted + "20"
                  : undefined,
          },
          text
        );
      })
    );
  });

  // Scroll indicator
  const showScrollIndicator = sortedData.length > maxRows;
  const scrollInfo = showScrollIndicator
    ? React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        `${selectedIndex + 1}/${sortedData.length}`
      )
    : null;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
    },
    headerRow,
    separator,
    ...dataRows,
    showScrollIndicator
      ? React.createElement(
          Box,
          { justifyContent: "space-between", marginTop: 0 },
          React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            "j/k navigate  g/G top/bottom  s sort"
          ),
          scrollInfo
        )
      : null
  );
}
