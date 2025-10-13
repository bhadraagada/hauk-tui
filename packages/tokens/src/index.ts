export type ColorDepth = 4 | 8 | 24;

export interface ColorTokens {
  fg: string;
  bg: string;
  mutedFg: string;
  border: string;
  focus: string;
  accent: string;
  success: string;
  warn: string;
  error: string;
}

export interface SpacingTokens {
  gap: number;
  padX: number;
  padY: number;
}

export interface Tokens {
  depth: ColorDepth;
  color: ColorTokens;
  spacing: SpacingTokens;
}

export function detectColorDepth(): ColorDepth {
  try {
    const depth = typeof process.stdout?.getColorDepth === 'function' ? process.stdout.getColorDepth() : 8;
    if (depth >= 24) return 24;
    if (depth >= 8) return 8;
    return 4;
  } catch {
    return 8;
  }
}

export function createDefaultTokens(overrides?: Partial<Tokens>): Tokens {
  const depth = overrides?.depth ?? detectColorDepth();
  const color: ColorTokens = depth === 24
    ? {
        fg: '#e6e6e6',
        bg: '#111111',
        mutedFg: '#8a8a8a',
        border: '#2a2a2a',
        focus: '#9b87f5',
        accent: '#7c3aed',
        success: '#22c55e',
        warn: '#f59e0b',
        error: '#ef4444'
      }
    : depth === 8
    ? {
        fg: 'white',
        bg: 'black',
        mutedFg: 'gray',
        border: 'gray',
        focus: 'magentaBright',
        accent: 'magenta',
        success: 'green',
        warn: 'yellow',
        error: 'red'
      }
    : {
        fg: 'white',
        bg: 'black',
        mutedFg: 'white',
        border: 'white',
        focus: 'magenta',
        accent: 'magenta',
        success: 'green',
        warn: 'yellow',
        error: 'red'
      };

  const spacing: SpacingTokens = {
    gap: 1,
    padX: 1,
    padY: 0
  };

  return {
    depth,
    color: { ...color },
    spacing: { ...spacing },
    ...overrides
  } as Tokens;
}

