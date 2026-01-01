import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface CodeBlockProps {
  /** Code content */
  children: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Starting line number */
  startLine?: number;
  /** Highlight specific lines (1-indexed) */
  highlightLines?: number[];
  /** Title/filename to display */
  title?: string;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Maximum width */
  maxWidth?: number;
}

// Simple syntax highlighting patterns
const patterns: Record<string, { pattern: RegExp; color: string }[]> = {
  javascript: [
    { pattern: /(\/\/.*$)/gm, color: "comment" },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, color: "comment" },
    {
      pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      color: "string",
    },
    {
      pattern:
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|typeof|instanceof)\b/g,
      color: "keyword",
    },
    {
      pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
      color: "literal",
    },
    { pattern: /\b(\d+\.?\d*)\b/g, color: "number" },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, color: "type" },
  ],
  typescript: [
    { pattern: /(\/\/.*$)/gm, color: "comment" },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, color: "comment" },
    {
      pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      color: "string",
    },
    {
      pattern:
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|typeof|instanceof|interface|type|extends|implements)\b/g,
      color: "keyword",
    },
    {
      pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
      color: "literal",
    },
    { pattern: /\b(\d+\.?\d*)\b/g, color: "number" },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, color: "type" },
    { pattern: /:\s*([a-zA-Z]+)/g, color: "type" },
  ],
  python: [
    { pattern: /(#.*$)/gm, color: "comment" },
    { pattern: /("""[\s\S]*?"""|'''[\s\S]*?''')/g, color: "string" },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, color: "string" },
    {
      pattern:
        /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|raise|with|lambda|and|or|not|in|is|None|True|False)\b/g,
      color: "keyword",
    },
    { pattern: /\b(\d+\.?\d*)\b/g, color: "number" },
    { pattern: /@(\w+)/g, color: "decorator" },
  ],
  bash: [
    { pattern: /(#.*$)/gm, color: "comment" },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, color: "string" },
    {
      pattern:
        /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|export|source)\b/g,
      color: "keyword",
    },
    { pattern: /(\$\{?[a-zA-Z_][a-zA-Z0-9_]*\}?)/g, color: "variable" },
  ],
  json: [
    { pattern: /("(?:[^"\\]|\\.)*")\s*:/g, color: "key" },
    { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, color: "string" },
    { pattern: /\b(true|false|null)\b/g, color: "literal" },
    { pattern: /\b(-?\d+\.?\d*)\b/g, color: "number" },
  ],
};

export function CodeBlock({
  children,
  language = "text",
  showLineNumbers = true,
  startLine = 1,
  highlightLines = [],
  title,
  tokens: propTokens,
  maxWidth,
}: CodeBlockProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const lines = children.split("\n");
  const lineNumberWidth = String(startLine + lines.length - 1).length;

  // Get color for syntax type
  const getColor = (type: string): string => {
    switch (type) {
      case "comment":
        return tokens.colors.muted;
      case "string":
        return tokens.colors.success;
      case "keyword":
        return tokens.colors.accent;
      case "literal":
        return tokens.colors.warning;
      case "number":
        return tokens.colors.info;
      case "type":
        return tokens.colors.accent;
      case "variable":
        return tokens.colors.warning;
      case "key":
        return tokens.colors.accent;
      case "decorator":
        return tokens.colors.warning;
      default:
        return tokens.colors.fg;
    }
  };

  // Simple tokenizer (basic highlighting without complex parsing)
  const highlightCode = (code: string, lang: string): React.ReactNode[] => {
    // For simplicity, return plain text with basic coloring
    // A full implementation would tokenize and apply colors
    return [
      React.createElement(Text, { key: "code", color: tokens.colors.fg }, code),
    ];
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: tokens.colors.border,
      ...(maxWidth ? { width: maxWidth } : {}),
    },
    // Title bar
    title &&
      React.createElement(
        Box,
        {
          paddingX: 1,
          borderStyle: "single",
          borderTop: false,
          borderLeft: false,
          borderRight: false,
          borderColor: tokens.colors.border,
        },
        React.createElement(
          Text,
          { color: tokens.colors.muted, bold: true },
          title
        ),
        language !== "text" &&
          React.createElement(
            Text,
            { color: tokens.colors.accent },
            ` (${language})`
          )
      ),
    // Code content
    React.createElement(
      Box,
      { flexDirection: "column", paddingX: 1, paddingY: title ? 0 : 1 },
      lines.map((line, index) => {
        const lineNum = startLine + index;
        const isHighlighted = highlightLines.includes(lineNum);

        return React.createElement(
          Box,
          { key: index },
          // Line number
          showLineNumbers &&
            React.createElement(
              Text,
              {
                color: isHighlighted
                  ? tokens.colors.accent
                  : tokens.colors.muted,
              },
              String(lineNum).padStart(lineNumberWidth, " ") + " │ "
            ),
          // Code line
          React.createElement(
            Text,
            {
              color: tokens.colors.fg,
              backgroundColor: isHighlighted ? tokens.colors.border : undefined,
            },
            line || " "
          )
        );
      })
    )
  );
}
