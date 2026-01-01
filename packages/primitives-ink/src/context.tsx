import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { createDefaultTokens, mergeTokens } from "@hauktui/tokens";
import type {
  Keymap,
  KeyInput,
  FocusContext as FocusContextType,
} from "@hauktui/core";
import { defaultKeymap, getAction, createFocusManager } from "@hauktui/core";

// ============================================================================
// Token Context
// ============================================================================

const TokenContext = createContext<Tokens>(createDefaultTokens());

export interface TokenProviderProps {
  tokens?: Partial<Tokens>;
  children: React.ReactNode;
}

export function TokenProvider({
  tokens,
  children,
}: TokenProviderProps): React.ReactElement {
  const parentTokens = useContext(TokenContext);
  const mergedTokens = useMemo(
    () => (tokens ? mergeTokens(parentTokens, tokens) : parentTokens),
    [parentTokens, tokens]
  );

  return React.createElement(
    TokenContext.Provider,
    { value: mergedTokens },
    children
  );
}

export function useTokens(): Tokens {
  return useContext(TokenContext);
}

// ============================================================================
// Keymap Context
// ============================================================================

interface KeymapContextValue {
  keymap: Keymap;
  handleInput: (input: string, key: KeyInput) => void;
}

const KeymapContext = createContext<KeymapContextValue>({
  keymap: defaultKeymap,
  handleInput: () => {},
});

export interface KeymapProviderProps {
  keymap?: Keymap;
  onAction?: (action: string, input: KeyInput) => void;
  children: React.ReactNode;
}

export function KeymapProvider({
  keymap = defaultKeymap,
  onAction,
  children,
}: KeymapProviderProps): React.ReactElement {
  const handleInput = useCallback(
    (_input: string, key: KeyInput) => {
      const action = getAction(key, keymap);
      if (action && onAction) {
        onAction(action, key);
      }
    },
    [keymap, onAction]
  );

  useInput((input, key) => {
    handleInput(input, {
      name: key.return
        ? "return"
        : key.escape
          ? "escape"
          : key.tab
            ? "tab"
            : input,
      ctrl: key.ctrl,
      meta: key.meta,
      shift: key.shift,
      alt: false,
    });
  });

  const value = useMemo(() => ({ keymap, handleInput }), [keymap, handleInput]);

  return React.createElement(KeymapContext.Provider, { value }, children);
}

export function useKeymap(): KeymapContextValue {
  return useContext(KeymapContext);
}

// ============================================================================
// Focus Context
// ============================================================================

// Separate context for stable methods (doesn't change) vs state (changes on focus)
interface FocusMethodsContextValue {
  register: (id: string) => void;
  unregister: (id: string) => void;
  focus: (id: string) => void;
  focusNext: () => void;
  focusPrev: () => void;
  isFocused: (id: string) => boolean;
}

interface FocusStateContextValue {
  focusedId: string | null;
}

const FocusMethodsContext = createContext<FocusMethodsContextValue | null>(
  null
);
const FocusStateContext = createContext<FocusStateContextValue>({
  focusedId: null,
});

// Legacy context for backwards compatibility
const FocusContext = createContext<FocusContextType | null>(null);

export interface FocusGroupProps {
  wrap?: boolean;
  initialFocusId?: string;
  children: React.ReactNode;
}

export function FocusGroup({
  wrap = true,
  initialFocusId,
  children,
}: FocusGroupProps): React.ReactElement {
  const [manager] = useState(() => {
    const options: { wrap?: boolean; initialFocusId?: string } = { wrap };
    if (initialFocusId !== undefined) {
      options.initialFocusId = initialFocusId;
    }
    return createFocusManager(options);
  });
  const [state, setState] = useState(manager.getState());

  useEffect(() => {
    return manager.subscribe(setState);
  }, [manager]);

  // Stable methods context - never changes after mount
  const methodsValue = useRef<FocusMethodsContextValue>({
    register: manager.register.bind(manager),
    unregister: manager.unregister.bind(manager),
    focus: manager.focus.bind(manager),
    focusNext: manager.focusNext.bind(manager),
    focusPrev: manager.focusPrev.bind(manager),
    isFocused: manager.isFocused.bind(manager),
  }).current;

  // State context - changes when focus changes
  const stateValue = useMemo(
    (): FocusStateContextValue => ({ focusedId: state.focusedId }),
    [state.focusedId]
  );

  // Legacy context value for backwards compatibility
  const legacyContextValue = useMemo(
    (): FocusContextType => ({
      state,
      register: manager.register.bind(manager),
      unregister: manager.unregister.bind(manager),
      focus: manager.focus.bind(manager),
      focusNext: manager.focusNext.bind(manager),
      focusPrev: manager.focusPrev.bind(manager),
      isFocused: manager.isFocused.bind(manager),
    }),
    [state, manager]
  );

  // Handle keyboard navigation between focusable elements
  // Only use Tab for focus navigation - arrow keys are reserved for component-internal use
  // (e.g., List uses up/down arrows to navigate items, Tabs uses left/right arrows)
  useInput((_input, key) => {
    if (key.tab && !key.shift) {
      manager.focusNext();
    } else if (key.tab && key.shift) {
      manager.focusPrev();
    }
  });

  return React.createElement(
    FocusMethodsContext.Provider,
    { value: methodsValue },
    React.createElement(
      FocusStateContext.Provider,
      { value: stateValue },
      React.createElement(
        FocusContext.Provider,
        { value: legacyContextValue },
        children
      )
    )
  );
}

export function useFocus(): FocusContextType | null {
  return useContext(FocusContext);
}

export function useFocusable(id: string): {
  isFocused: boolean;
  focus: () => void;
} {
  const methods = useContext(FocusMethodsContext);
  const stateCtx = useContext(FocusStateContext);

  // Register on mount, unregister on unmount
  // methods is stable and never changes, so this only runs once per id
  useEffect(() => {
    methods?.register(id);
    return () => methods?.unregister(id);
  }, [methods, id]);

  return {
    isFocused: stateCtx.focusedId === id,
    focus: () => methods?.focus(id),
  };
}
