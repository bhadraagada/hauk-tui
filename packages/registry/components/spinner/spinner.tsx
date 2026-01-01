import React, { useState, useEffect } from "react";
import { Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type SpinnerVariant = "dots" | "line" | "arc" | "circle" | "bounce";

export interface SpinnerProps {
  /** Loading text to display */
  label?: string;
  /** Spinner variant */
  variant?: SpinnerVariant;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Spin speed in milliseconds */
  speed?: number;
}

const SPINNERS: Record<SpinnerVariant, string[]> = {
  dots: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  line: ["-", "\\", "|", "/"],
  arc: ["◜", "◠", "◝", "◞", "◡", "◟"],
  circle: ["◐", "◓", "◑", "◒"],
  bounce: ["⠁", "⠂", "⠄", "⠂"],
};

export function Spinner({
  label,
  variant = "dots",
  tokens: propTokens,
  speed = 80,
}: SpinnerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const frames = SPINNERS[variant];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, speed);
    return () => clearInterval(timer);
  }, [frames.length, speed]);

  return React.createElement(
    Text,
    null,
    React.createElement(
      Text,
      { color: tokens.colors.accent },
      frames[frameIndex]
    ),
    label
      ? React.createElement(Text, { color: tokens.colors.fg }, " ", label)
      : null
  );
}
