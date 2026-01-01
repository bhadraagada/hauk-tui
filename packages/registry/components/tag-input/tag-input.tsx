import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface TagInputProps {
  /** Current tags */
  value: string[];
  /** Callback when tags change */
  onChange?: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of tags */
  maxTags?: number;
  /** Allowed tag separator characters */
  separators?: string[];
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Tag variant */
  variant?: "default" | "outline";
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tag...",
  maxTags,
  separators = [",", " ", "Enter"],
  tokens: propTokens,
  focusId,
  variant = "default",
}: TagInputProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("tag-input");
  const { isFocused } = useFocusable(id);

  const [inputValue, setInputValue] = useState("");
  const [focusedTagIndex, setFocusedTagIndex] = useState(-1); // -1 means input is focused

  // Add a tag
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    if (maxTags && value.length >= maxTags) return;

    onChange?.([...value, trimmed]);
    setInputValue("");
  };

  // Remove a tag
  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange?.(newTags);
    setFocusedTagIndex(-1);
  };

  // Handle keyboard input
  useInput(
    (input, key) => {
      if (!isFocused) return;

      // If we're focused on a tag
      if (focusedTagIndex >= 0) {
        if (key.leftArrow || input === "h") {
          setFocusedTagIndex((prev) => Math.max(0, prev - 1));
        } else if (key.rightArrow || input === "l") {
          if (focusedTagIndex < value.length - 1) {
            setFocusedTagIndex((prev) => prev + 1);
          } else {
            setFocusedTagIndex(-1); // Go to input
          }
        } else if (key.backspace || key.delete || input === "x") {
          removeTag(focusedTagIndex);
        } else if (key.escape) {
          setFocusedTagIndex(-1);
        }
        return;
      }

      // Input mode
      if (key.backspace) {
        if (inputValue === "" && value.length > 0) {
          setFocusedTagIndex(value.length - 1);
        } else {
          setInputValue((prev) => prev.slice(0, -1));
        }
      } else if (key.return || (separators.includes(input) && inputValue)) {
        addTag(inputValue);
      } else if (key.leftArrow && inputValue === "" && value.length > 0) {
        setFocusedTagIndex(value.length - 1);
      } else if (input && !key.ctrl && !key.meta) {
        if (!separators.includes(input)) {
          setInputValue((prev) => prev + input);
        }
      }
    },
    { isActive: isFocused }
  );

  // Render a tag
  const renderTag = (tag: string, index: number) => {
    const isFocusedTag = focusedTagIndex === index;

    return React.createElement(
      Box,
      {
        key: index,
        borderStyle: variant === "outline" ? "round" : undefined,
        borderColor: isFocusedTag ? tokens.colors.danger : tokens.colors.accent,
        paddingX: variant === "outline" ? 0 : undefined,
      },
      React.createElement(
        Text,
        {
          backgroundColor:
            variant === "default"
              ? isFocusedTag
                ? tokens.colors.danger
                : tokens.colors.accent
              : undefined,
          color:
            variant === "default"
              ? tokens.colors.bg
              : isFocusedTag
                ? tokens.colors.danger
                : tokens.colors.accent,
        },
        ` ${tag} `
      ),
      isFocusedTag &&
        React.createElement(Text, { color: tokens.colors.danger }, "×")
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 1,
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
      paddingY: 0,
    },
    // Existing tags
    ...value.map(renderTag),
    // Input
    React.createElement(
      Box,
      {},
      React.createElement(
        Text,
        {
          color:
            inputValue || focusedTagIndex === -1
              ? tokens.colors.fg
              : tokens.colors.muted,
        },
        inputValue || (focusedTagIndex === -1 ? placeholder : "")
      ),
      isFocused &&
        focusedTagIndex === -1 &&
        React.createElement(Text, { color: tokens.colors.accent }, "█")
    ),
    // Max tags indicator
    maxTags &&
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        ` (${value.length}/${maxTags})`
      )
  );
}
