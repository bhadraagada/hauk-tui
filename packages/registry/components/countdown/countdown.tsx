import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface CountdownProps {
  /** Target date/time */
  target: Date;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
  /** Format to display */
  format?: "full" | "compact" | "minimal";
  /** Show labels */
  showLabels?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Update interval in ms */
  interval?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function Countdown({
  target,
  onComplete,
  format = "full",
  showLabels = true,
  tokens: propTokens,
  interval = 1000,
}: CountdownProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const calculateTimeLeft = (): TimeLeft => {
    const difference = target.getTime() - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !completed) {
        setCompleted(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, completed, interval]);

  // Pad number with zeros
  const pad = (n: number, digits = 2): string => {
    return String(n).padStart(digits, "0");
  };

  // Render based on format
  const renderCountdown = () => {
    if (completed) {
      return React.createElement(
        Text,
        { color: tokens.colors.success, bold: true },
        "Completed!"
      );
    }

    switch (format) {
      case "minimal":
        return React.createElement(
          Text,
          { color: tokens.colors.fg },
          `${pad(timeLeft.hours + timeLeft.days * 24)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`
        );

      case "compact":
        return React.createElement(
          Box,
          { gap: 1 },
          timeLeft.days > 0 &&
            React.createElement(
              Text,
              { color: tokens.colors.accent, bold: true },
              `${timeLeft.days}d`
            ),
          React.createElement(
            Text,
            { color: tokens.colors.accent, bold: true },
            `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`
          )
        );

      case "full":
      default:
        const units = [
          { value: timeLeft.days, label: "days", show: timeLeft.days > 0 },
          { value: timeLeft.hours, label: "hours", show: true },
          { value: timeLeft.minutes, label: "mins", show: true },
          { value: timeLeft.seconds, label: "secs", show: true },
        ].filter((u) => u.show);

        return React.createElement(
          Box,
          { gap: 2 },
          ...units.map((unit, index) =>
            React.createElement(
              Box,
              {
                key: index,
                flexDirection: "column",
                alignItems: "center",
              },
              React.createElement(
                Text,
                {
                  color: tokens.colors.accent,
                  bold: true,
                },
                pad(unit.value)
              ),
              showLabels &&
                React.createElement(
                  Text,
                  { color: tokens.colors.muted, dimColor: true },
                  unit.label
                )
            )
          )
        );
    }
  };

  return React.createElement(
    Box,
    {
      borderStyle: "round",
      borderColor: completed ? tokens.colors.success : tokens.colors.border,
      paddingX: 1,
    },
    renderCountdown()
  );
}
