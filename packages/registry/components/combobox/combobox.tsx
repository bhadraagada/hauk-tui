import React, { useState, useCallback, useMemo } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId, clamp } from "@hauktui/core";

export interface ComboboxOption {
  /** Unique value */
  value: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
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
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Maximum visible items */
  maxItems?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Allow creating new values */
  allowCreate?: boolean;
}

export function Combobox({
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Search...",
  label,
  tokens: propTokens,
  focusId,
  maxItems = 5,
  emptyMessage = "No results found.",
  allowCreate = false,
}: ComboboxProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("combobox");
  const { isFocused } = useFocusable(id);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.value.toLowerCase().includes(lowerSearch) ||
        opt.description?.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  const visibleOptions = filteredOptions.slice(0, maxItems);

  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;
      if (!isControlled) {
        setInternalValue(option.value);
      }
      onChange?.(option.value);
      setSearch("");
      setIsOpen(false);
    },
    [isControlled, onChange]
  );

  useInput(
    (input, key) => {
      if (!isFocused) return;

      if (key.escape) {
        if (isOpen) {
          setIsOpen(false);
          setSearch("");
        }
        return;
      }

      if (key.return) {
        if (isOpen && visibleOptions[selectedIndex]) {
          handleSelect(visibleOptions[selectedIndex]!);
        } else if (!isOpen) {
          setIsOpen(true);
        } else if (
          allowCreate &&
          search.trim() &&
          filteredOptions.length === 0
        ) {
          // Create new value
          if (!isControlled) {
            setInternalValue(search);
          }
          onChange?.(search);
          setSearch("");
          setIsOpen(false);
        }
        return;
      }

      if (key.upArrow || input === "k") {
        if (isOpen) {
          setSelectedIndex((prev) =>
            clamp(prev - 1, 0, visibleOptions.length - 1)
          );
        }
        return;
      }

      if (key.downArrow || input === "j") {
        if (isOpen) {
          setSelectedIndex((prev) =>
            clamp(prev + 1, 0, visibleOptions.length - 1)
          );
        } else {
          setIsOpen(true);
        }
        return;
      }

      if (key.backspace || key.delete) {
        setSearch((prev) => prev.slice(0, -1));
        setIsOpen(true);
        setSelectedIndex(0);
        return;
      }

      // Regular character input
      if (input && input.length === 1 && !key.ctrl && !key.meta) {
        setSearch((prev) => prev + input);
        setIsOpen(true);
        setSelectedIndex(0);
      }
    },
    { isActive: isFocused }
  );

  const selectedOption = options.find((opt) => opt.value === currentValue);
  const displayValue = search || selectedOption?.label || "";

  return React.createElement(
    Box,
    { flexDirection: "column" },
    // Label
    label
      ? React.createElement(
          Box,
          { marginBottom: 0 },
          React.createElement(
            Text,
            { color: tokens.colors.fg, bold: true },
            label
          )
        )
      : null,
    // Input box
    React.createElement(
      Box,
      {
        borderStyle: "round",
        borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
        paddingX: 1,
        width: 30,
      },
      React.createElement(
        Text,
        { color: displayValue ? tokens.colors.fg : tokens.colors.muted },
        displayValue || placeholder
      ),
      React.createElement(
        Box,
        { flexGrow: 1, justifyContent: "flex-end" },
        React.createElement(
          Text,
          { color: tokens.colors.muted },
          isOpen ? "▲" : "▼"
        )
      )
    ),
    // Dropdown
    isOpen
      ? React.createElement(
          Box,
          {
            flexDirection: "column",
            borderStyle: "single",
            borderColor: tokens.colors.border,
            borderTop: false,
            width: 30,
            paddingY: 0,
          },
          visibleOptions.length > 0
            ? visibleOptions.map((option, index) => {
                const isSelected = index === selectedIndex;
                return React.createElement(
                  Box,
                  { key: option.value, paddingX: 1, gap: 1 },
                  React.createElement(
                    Text,
                    {
                      color: isSelected
                        ? tokens.colors.accent
                        : tokens.colors.muted,
                    },
                    isSelected ? "▸" : " "
                  ),
                  React.createElement(
                    Box,
                    { flexDirection: "column" },
                    React.createElement(
                      Text,
                      {
                        color: option.disabled
                          ? tokens.colors.muted
                          : isSelected
                            ? tokens.colors.fg
                            : tokens.colors.fg,
                        dimColor: option.disabled,
                        bold: isSelected,
                      },
                      option.label
                    ),
                    option.description
                      ? React.createElement(
                          Text,
                          { color: tokens.colors.muted, dimColor: true },
                          option.description
                        )
                      : null
                  )
                );
              })
            : React.createElement(
                Box,
                { paddingX: 1 },
                React.createElement(
                  Text,
                  { color: tokens.colors.muted, dimColor: true },
                  allowCreate && search.trim()
                    ? `Press Enter to create "${search}"`
                    : emptyMessage
                )
              )
        )
      : null
  );
}
