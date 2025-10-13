import React, { PropsWithChildren } from 'react';
import { Box, Text, useFocus } from 'ink';
import type { Tokens } from '../tokens';

export interface FocusRingProps {
  tokens: Tokens;
  isFocused?: boolean;
  prefix?: string;
}

export const FocusRing: React.FC<PropsWithChildren<FocusRingProps>> = ({
  tokens,
  isFocused: controlledFocused,
  prefix = '› ',
  children
}) => {
  const { isFocused: hookFocused } = useFocus({ autoFocus: false });
  const isFocused = controlledFocused ?? hookFocused;
  return (
    <Box>
      <Text color={isFocused ? tokens.color.focus : tokens.color.border}>
        {isFocused ? prefix : '  '}
      </Text>
      <Box>{children}</Box>
    </Box>
  );
};

