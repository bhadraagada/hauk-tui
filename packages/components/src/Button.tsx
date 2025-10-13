import React, { PropsWithChildren } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import type { Tokens } from '@hauktui/tokens';
import { FocusRing } from '@hauktui/primitives';

export interface ButtonProps {
  tokens: Tokens;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  tokens,
  onPress,
  disabled,
  children
}) => {
  const { isFocused } = useFocus({ autoFocus: false });

  useInput((input: string, key: any) => {
    if (!isFocused || disabled) return;
    if (key.return || key.space) onPress?.();
  });

  const color = disabled
    ? tokens.color.mutedFg
    : isFocused
    ? tokens.color.focus
    : tokens.color.accent;

  return (
    <FocusRing tokens={tokens} isFocused={isFocused}>
      <Box>
        <Text color={color}>[{children}]</Text>
      </Box>
    </FocusRing>
  );
};

