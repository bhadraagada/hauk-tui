import React, { useState, useEffect } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import type { Tokens } from '@hauktui/tokens';
import { FocusRing } from '@hauktui/primitives';

export interface SelectItem<T = string> {
  label: string;
  value: T;
}

export interface SelectProps<T = string> {
  tokens: Tokens;
  items: SelectItem<T>[];
  initialIndex?: number;
  onChange?: (value: T) => void;
}

export function Select<T = string>({ tokens, items, initialIndex = 0, onChange }: SelectProps<T>): React.ReactElement {
  const { isFocused } = useFocus({ autoFocus: false });
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    onChange?.(items[index]?.value);
  }, [index]);

  useInput((input: string, key: any) => {
    if (!isFocused) return;
    if (key.upArrow) setIndex((i) => (i - 1 + items.length) % items.length);
    if (key.downArrow) setIndex((i) => (i + 1) % items.length);
    if (key.return) onChange?.(items[index]?.value);
  });

  return (
    <FocusRing tokens={tokens} isFocused={isFocused}>
      <Box flexDirection="column">
        {items.map((item, i) => (
          <Box key={String(item.value)}>
            <Text color={i === index ? tokens.color.focus : tokens.color.fg}>
              {i === index ? '• ' : '  '}
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>
    </FocusRing>
  );
}

