import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useInput } from 'ink';

export type KeyHandler = () => void;
export type Keymap = Record<string, KeyHandler>;

interface KeymapContextValue {
  keymap: Keymap;
}

const KeymapContext = createContext<KeymapContextValue>({ keymap: {} });

export interface KeymapProviderProps {
  keymap?: Keymap;
}

export const KeymapProvider: React.FC<PropsWithChildren<KeymapProviderProps>> = ({
  keymap = {},
  children
}) => {
  const value = useMemo(() => ({ keymap }), [keymap]);

  useInput((input, key) => {
    const candidates: string[] = [];
    if (key.return) candidates.push('enter');
    if (key.space) candidates.push('space');
    if (key.leftArrow) candidates.push('left');
    if (key.rightArrow) candidates.push('right');
    if (key.upArrow) candidates.push('up');
    if (key.downArrow) candidates.push('down');
    if (key.escape) candidates.push('escape');
    if (key.tab) candidates.push('tab');
    if (input && input.length === 1) candidates.push(input);

    for (const name of candidates) {
      const handler = keymap[name];
      if (handler) {
        handler();
        break;
      }
    }
  });

  return <KeymapContext.Provider value={value}>{children}</KeymapContext.Provider>;
};

export function useKeymap() {
  return useContext(KeymapContext);
}

