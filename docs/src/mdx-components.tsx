import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

/* ============================================
   Terminal Window Component
   A sexy terminal-style code/command block
   ============================================ */
interface TerminalProps {
  title?: string;
  children: ReactNode;
}

function Terminal({ title = "terminal", children }: TerminalProps) {
  return (
    <div className="terminal-window my-6">
      <div className="terminal-window-header">
        <div className="terminal-window-dots">
          <span className="terminal-window-dot terminal-window-dot-red" />
          <span className="terminal-window-dot terminal-window-dot-yellow" />
          <span className="terminal-window-dot terminal-window-dot-green" />
        </div>
        <span className="terminal-window-title">{title}</span>
        <div className="w-12" />
      </div>
      <div className="terminal-window-content">{children}</div>
    </div>
  );
}

/* ============================================
   TerminalLine Component
   Individual command line with prompt
   ============================================ */
interface TerminalLineProps {
  prompt?: string;
  command: string;
  output?: string;
  outputColor?: "default" | "success" | "error" | "muted";
}

function TerminalLine({
  prompt = "$",
  command,
  output,
  outputColor = "default",
}: TerminalLineProps) {
  const outputColorClass = {
    default: "text-fd-foreground",
    success: "text-emerald-400",
    error: "text-rose-400",
    muted: "text-fd-muted-foreground",
  }[outputColor];

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <span className="text-accent select-none font-semibold">{prompt}</span>
        <span className="text-fd-foreground">{command}</span>
      </div>
      {output && <p className={`text-xs pl-4 ${outputColorClass}`}>{output}</p>}
    </div>
  );
}

/* ============================================
   Kbd Component
   Styled keyboard key
   ============================================ */
interface KbdProps {
  children: ReactNode;
}

function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-0.5 font-mono text-xs font-medium bg-fd-muted border border-fd-border rounded shadow-sm">
      {children}
    </kbd>
  );
}

/* ============================================
   Keymap Component
   Display keyboard shortcuts in a table format
   ============================================ */
interface KeymapItem {
  keys: string[];
  description: string;
}

interface KeymapProps {
  items: KeymapItem[];
  title?: string;
}

function Keymap({ items, title }: KeymapProps) {
  return (
    <div className="my-6 rounded-xl border border-fd-border/60 bg-fd-card/50 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-fd-muted/40 border-b border-fd-border/40">
          <h4 className="text-sm font-semibold text-fd-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
            {title}
          </h4>
        </div>
      )}
      <div className="divide-y divide-fd-border/30">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 hover:bg-fd-muted/20 transition-colors"
          >
            <span className="text-sm text-fd-muted-foreground">
              {item.description}
            </span>
            <div className="flex items-center gap-1.5">
              {item.keys.map((key, keyIndex) => (
                <span key={keyIndex}>
                  <Kbd>{key}</Kbd>
                  {keyIndex < item.keys.length - 1 && (
                    <span className="text-fd-muted-foreground mx-1 text-xs">
                      +
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Callout Component
   Info/Warning/Error/Success boxes
   ============================================ */
interface CalloutProps {
  type?: "info" | "warning" | "error" | "success";
  title?: string;
  children: ReactNode;
}

function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = {
    info: {
      container: "callout callout-info",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      defaultTitle: "Info",
    },
    warning: {
      container: "callout callout-warning",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      defaultTitle: "Warning",
    },
    error: {
      container: "callout callout-error",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      defaultTitle: "Error",
    },
    success: {
      container: "callout callout-success",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      defaultTitle: "Success",
    },
  };

  const { container, icon, defaultTitle } = styles[type];

  return (
    <div className={container}>
      <div className="flex items-start gap-3">
        <div className="callout-title mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="callout-title font-semibold text-sm mb-1">{title}</p>
          )}
          <div className="text-sm text-fd-foreground/90 [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Props Table Component
   Clean table for component props
   ============================================ */
interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  items: PropItem[];
}

function PropsTable({ items }: PropsTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border/50">
            <th className="text-left py-3 px-4 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wider">
              Prop
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wider">
              Type
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wider">
              Default
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fd-border/30">
          {items.map((prop, index) => (
            <tr key={index} className="hover:bg-fd-muted/20 transition-colors">
              <td className="py-3 px-4">
                <code className="text-accent text-xs font-medium">
                  {prop.name}
                  {prop.required && (
                    <span className="text-rose-400 ml-0.5">*</span>
                  )}
                </code>
              </td>
              <td className="py-3 px-4">
                <code className="text-xs text-fd-muted-foreground bg-fd-muted/50 px-1.5 py-0.5 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4 text-fd-muted-foreground text-xs">
                {prop.default || "—"}
              </td>
              <td className="py-3 px-4 text-fd-foreground/90 text-xs">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================
   Step Component
   For step-by-step instructions
   ============================================ */
interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 my-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
        <span className="text-sm font-bold text-accent">{number}</span>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-base font-semibold mb-2">{title}</h4>
        <div className="text-fd-muted-foreground text-sm [&>p]:mb-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Install Command Component
   Quick copy-paste install block
   ============================================ */
interface InstallCommandProps {
  package: string;
  dev?: boolean;
}

function InstallCommand({ package: pkg, dev = false }: InstallCommandProps) {
  const commands = {
    npm: `npm install ${dev ? "-D " : ""}${pkg}`,
    pnpm: `pnpm add ${dev ? "-D " : ""}${pkg}`,
    yarn: `yarn add ${dev ? "-D " : ""}${pkg}`,
    bun: `bun add ${dev ? "-d " : ""}${pkg}`,
  };

  return (
    <div className="terminal-window my-6">
      <div className="terminal-window-header">
        <div className="terminal-window-dots">
          <span className="terminal-window-dot terminal-window-dot-red" />
          <span className="terminal-window-dot terminal-window-dot-yellow" />
          <span className="terminal-window-dot terminal-window-dot-green" />
        </div>
        <span className="terminal-window-title">install</span>
        <div className="w-12" />
      </div>
      <div className="terminal-window-content space-y-2">
        {Object.entries(commands).map(([manager, cmd]) => (
          <div key={manager} className="flex items-center gap-3 text-xs">
            <span className="w-10 text-fd-muted-foreground">{manager}</span>
            <code className="text-fd-foreground">{cmd}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Export MDX Components
   ============================================ */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Custom components
    Terminal,
    TerminalLine,
    Kbd,
    Keymap,
    Callout,
    PropsTable,
    Step,
    InstallCommand,
    // Override default elements if needed
    ...components,
  };
}
