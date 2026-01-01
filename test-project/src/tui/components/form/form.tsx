import React, { createContext, useContext, useState, useCallback } from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string) => void;
  handleSubmit: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a Form");
  }
  return context;
}

export interface FormProps {
  /** Initial form values */
  defaultValues?: Record<string, unknown>;
  /** Callback when form is submitted */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Validation function */
  validate?: (values: Record<string, unknown>) => Record<string, string>;
  /** Form children */
  children: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Form({
  defaultValues = {},
  onSubmit,
  validate,
  children,
  tokens: propTokens,
}: FormProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const [values, setValues] = useState<Record<string, unknown>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when value changes
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setTouched = useCallback((name: string) => {
    setTouchedState((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(() => {
    // Validate if validator provided
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    onSubmit?.(values);
  }, [values, validate, onSubmit]);

  const contextValue: FormContextValue = {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    handleSubmit,
  };

  return React.createElement(
    FormContext.Provider,
    { value: contextValue },
    React.createElement(Box, { flexDirection: "column", gap: 1 }, children)
  );
}

export interface FormFieldProps {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Whether field is required */
  required?: boolean;
  /** Help text */
  description?: string;
  /** Field children (input component) */
  children: React.ReactElement;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function FormField({
  name,
  label,
  required,
  description,
  children,
  tokens: propTokens,
}: FormFieldProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const form = useFormContext();

  const error = form.errors[name];
  const isTouched = form.touched[name];

  return React.createElement(
    Box,
    { flexDirection: "column" },
    label
      ? React.createElement(
          Box,
          { gap: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.fg, bold: true },
            label
          ),
          required
            ? React.createElement(Text, { color: tokens.colors.danger }, "*")
            : null
        )
      : null,
    description
      ? React.createElement(
          Text,
          { color: tokens.colors.muted, dimColor: true },
          description
        )
      : null,
    children,
    error && isTouched
      ? React.createElement(Text, { color: tokens.colors.danger }, `✗ ${error}`)
      : null
  );
}

export interface FormMessageProps {
  /** Message type */
  type?: "error" | "success" | "info";
  /** Message content */
  children: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function FormMessage({
  type = "error",
  children,
  tokens: propTokens,
}: FormMessageProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const colors = {
    error: tokens.colors.danger,
    success: tokens.colors.success,
    info: tokens.colors.accent,
  };

  const icons = {
    error: "✗",
    success: "✓",
    info: "ℹ",
  };

  return React.createElement(
    Box,
    { gap: 1 },
    React.createElement(Text, { color: colors[type] }, icons[type]),
    React.createElement(Text, { color: colors[type] }, children)
  );
}
