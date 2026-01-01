import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface TreeNode {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon to display (emoji or character) */
  icon?: string;
  /** Child nodes */
  children?: TreeNode[];
  /** Whether the node is disabled */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Tree data structure */
  data: TreeNode[];
  /** Currently selected node ID */
  selectedId?: string;
  /** Callback when a node is selected */
  onSelect?: (node: TreeNode) => void;
  /** Initially expanded node IDs */
  defaultExpanded?: string[];
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Show connecting lines */
  showLines?: boolean;
  /** Indent size in characters */
  indentSize?: number;
}

interface FlatNode {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
  isLast: boolean;
  parentIsLast: boolean[];
}

export function TreeView({
  data,
  selectedId,
  onSelect,
  defaultExpanded = [],
  tokens: propTokens,
  focusId,
  showLines = true,
  indentSize = 2,
}: TreeViewProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("tree-view");
  const { isFocused } = useFocusable(id);

  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(defaultExpanded)
  );
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Flatten tree for rendering
  const flattenTree = useCallback(
    (
      nodes: TreeNode[],
      depth = 0,
      parentIsLast: boolean[] = []
    ): FlatNode[] => {
      const result: FlatNode[] = [];

      nodes.forEach((node, index) => {
        const isLast = index === nodes.length - 1;
        const hasChildren = !!node.children && node.children.length > 0;
        const isExpanded = expanded.has(node.id);

        result.push({
          node,
          depth,
          isExpanded,
          hasChildren,
          isLast,
          parentIsLast,
        });

        if (hasChildren && isExpanded) {
          result.push(
            ...flattenTree(node.children!, depth + 1, [...parentIsLast, isLast])
          );
        }
      });

      return result;
    },
    [expanded]
  );

  const flatNodes = flattenTree(data);

  // Handle keyboard input
  useInput(
    (input, key) => {
      if (!isFocused) return;

      const currentNode = flatNodes[focusedIndex];
      if (!currentNode) return;

      if (key.upArrow || input === "k") {
        setFocusedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow || input === "j") {
        setFocusedIndex((prev) => Math.min(flatNodes.length - 1, prev + 1));
      } else if (key.rightArrow || input === "l") {
        if (currentNode.hasChildren && !currentNode.isExpanded) {
          setExpanded((prev) => new Set([...prev, currentNode.node.id]));
        }
      } else if (key.leftArrow || input === "h") {
        if (currentNode.hasChildren && currentNode.isExpanded) {
          setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(currentNode.node.id);
            return next;
          });
        }
      } else if (key.return || input === " ") {
        if (!currentNode.node.disabled) {
          if (currentNode.hasChildren) {
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(currentNode.node.id)) {
                next.delete(currentNode.node.id);
              } else {
                next.add(currentNode.node.id);
              }
              return next;
            });
          }
          onSelect?.(currentNode.node);
        }
      } else if (input === "g") {
        setFocusedIndex(0);
      } else if (input === "G") {
        setFocusedIndex(flatNodes.length - 1);
      }
    },
    { isActive: isFocused }
  );

  // Build line prefix
  const buildPrefix = (flatNode: FlatNode): string => {
    if (!showLines) {
      return " ".repeat(flatNode.depth * indentSize);
    }

    let prefix = "";

    for (let i = 0; i < flatNode.depth; i++) {
      if (flatNode.parentIsLast[i]) {
        prefix += " ".repeat(indentSize);
      } else {
        prefix += "│" + " ".repeat(indentSize - 1);
      }
    }

    if (flatNode.depth > 0) {
      prefix = prefix.slice(0, -indentSize);
      prefix += flatNode.isLast
        ? "└" + "─".repeat(indentSize - 1)
        : "├" + "─".repeat(indentSize - 1);
    }

    return prefix;
  };

  // Get node icon
  const getIcon = (flatNode: FlatNode): string => {
    if (flatNode.node.icon) return flatNode.node.icon;
    if (flatNode.hasChildren) {
      return flatNode.isExpanded ? "▼" : "▶";
    }
    return "•";
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: isFocused ? "round" : "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
    },
    flatNodes.map((flatNode, index) => {
      const isSelected = selectedId === flatNode.node.id;
      const isFocusedItem = isFocused && index === focusedIndex;
      const prefix = buildPrefix(flatNode);
      const icon = getIcon(flatNode);

      return React.createElement(
        Box,
        { key: flatNode.node.id },
        React.createElement(
          Text,
          {
            color: flatNode.node.disabled
              ? tokens.colors.muted
              : isFocusedItem
                ? tokens.colors.accent
                : tokens.colors.border,
          },
          prefix
        ),
        React.createElement(
          Text,
          {
            color: flatNode.node.disabled
              ? tokens.colors.muted
              : isFocusedItem
                ? tokens.colors.accent
                : isSelected
                  ? tokens.colors.success
                  : tokens.colors.fg,
          },
          icon + " "
        ),
        React.createElement(
          Text,
          {
            color: flatNode.node.disabled
              ? tokens.colors.muted
              : isFocusedItem || isSelected
                ? tokens.colors.accent
                : tokens.colors.fg,
            bold: isFocusedItem || isSelected,
            dimColor: flatNode.node.disabled,
          },
          flatNode.node.label
        )
      );
    })
  );
}
