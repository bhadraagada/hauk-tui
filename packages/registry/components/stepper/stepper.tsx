import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface Step {
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Optional icon */
  icon?: string;
  /** Whether this step is optional */
  optional?: boolean;
}

export interface StepperProps {
  /** Steps to display */
  steps: Step[];
  /** Current active step (0-indexed) */
  activeStep: number;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Allow clicking on steps to navigate */
  clickable?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepChange,
  orientation = "horizontal",
  clickable = false,
  tokens: propTokens,
  focusId,
}: StepperProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("stepper");
  const { isFocused } = useFocusable(id);

  const [focusedStep, setFocusedStep] = useState(activeStep);

  // Handle keyboard input
  useInput(
    (input, key) => {
      if (!isFocused || !clickable) return;

      if (orientation === "horizontal") {
        if (key.leftArrow || input === "h") {
          setFocusedStep((prev) => Math.max(0, prev - 1));
        } else if (key.rightArrow || input === "l") {
          setFocusedStep((prev) => Math.min(steps.length - 1, prev + 1));
        }
      } else {
        if (key.upArrow || input === "k") {
          setFocusedStep((prev) => Math.max(0, prev - 1));
        } else if (key.downArrow || input === "j") {
          setFocusedStep((prev) => Math.min(steps.length - 1, prev + 1));
        }
      }

      if (key.return || input === " ") {
        onStepChange?.(focusedStep);
      }
    },
    { isActive: isFocused && clickable }
  );

  // Get step status
  const getStepStatus = (
    index: number
  ): "completed" | "active" | "upcoming" => {
    if (index < activeStep) return "completed";
    if (index === activeStep) return "active";
    return "upcoming";
  };

  // Get step icon
  const getStepIcon = (step: Step, index: number): string => {
    if (step.icon) return step.icon;
    const status = getStepStatus(index);
    if (status === "completed") return "✓";
    return String(index + 1);
  };

  // Get step colors
  const getStepColors = (
    index: number,
    isFocusedItem: boolean
  ): { bg: string; fg: string; text: string } => {
    const status = getStepStatus(index);

    if (isFocusedItem && clickable) {
      return {
        bg: tokens.colors.accent,
        fg: tokens.colors.bg,
        text: tokens.colors.accent,
      };
    }

    switch (status) {
      case "completed":
        return {
          bg: tokens.colors.success,
          fg: tokens.colors.bg,
          text: tokens.colors.success,
        };
      case "active":
        return {
          bg: tokens.colors.accent,
          fg: tokens.colors.bg,
          text: tokens.colors.fg,
        };
      default:
        return {
          bg: tokens.colors.border,
          fg: tokens.colors.muted,
          text: tokens.colors.muted,
        };
    }
  };

  // Render step
  const renderStep = (step: Step, index: number) => {
    const status = getStepStatus(index);
    const isFocusedItem = isFocused && clickable && index === focusedStep;
    const colors = getStepColors(index, isFocusedItem);
    const icon = getStepIcon(step, index);
    const isLast = index === steps.length - 1;

    return React.createElement(
      Box,
      {
        key: index,
        flexDirection: orientation === "horizontal" ? "column" : "row",
        alignItems: orientation === "horizontal" ? "center" : "flex-start",
        gap: 1,
      },
      // Step indicator
      React.createElement(
        Box,
        {
          flexDirection: orientation === "horizontal" ? "row" : "column",
          alignItems: "center",
        },
        // Step circle
        React.createElement(
          Text,
          {
            backgroundColor: colors.bg,
            color: colors.fg,
            bold: status === "active",
          },
          ` ${icon} `
        ),
        // Connector line
        !isLast &&
          React.createElement(
            Text,
            {
              color:
                status === "completed"
                  ? tokens.colors.success
                  : tokens.colors.border,
            },
            orientation === "horizontal" ? "───" : "\n│\n│"
          )
      ),
      // Step content
      React.createElement(
        Box,
        {
          flexDirection: "column",
          alignItems: orientation === "horizontal" ? "center" : "flex-start",
        },
        React.createElement(
          Text,
          {
            color: colors.text,
            bold: status === "active",
          },
          step.title
        ),
        step.description &&
          React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            step.description
          ),
        step.optional &&
          React.createElement(
            Text,
            { color: tokens.colors.muted, italic: true },
            "(Optional)"
          )
      )
    );
  };

  return React.createElement(
    Box,
    {
      flexDirection: orientation === "horizontal" ? "row" : "column",
      borderStyle: isFocused && clickable ? "round" : undefined,
      borderColor: isFocused ? tokens.colors.focus : undefined,
      padding: isFocused && clickable ? 1 : 0,
      gap: orientation === "horizontal" ? 0 : 1,
    },
    steps.map(renderStep)
  );
}
