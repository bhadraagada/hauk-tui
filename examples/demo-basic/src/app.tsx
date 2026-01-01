import React, { useState } from "react";
import { render, Box, Text, useInput } from "ink";
import { createTokens } from "@hauktui/tokens";
import {
  TokenProvider,
  FocusGroup,
  Panel,
  Spinner,
  ProgressBar,
  Divider,
  ThemedText,
} from "@hauktui/primitives-ink";

// For this demo, we're importing the component source directly
// In a real project, components would be copied via `hauktui add`

// Since registry exports component metadata, not the components themselves,
// we'll reference the patterns from the registry components

// Custom tokens with violet accent
const tokens = createTokens({
  colors: {
    accent: "#8b5cf6",
    focus: "#a78bfa",
  },
});

type DemoScreen = "home" | "inputs" | "list" | "tabs";

function App() {
  const [screen, setScreen] = useState<DemoScreen>("home");
  const [progress, setProgress] = useState(0);

  // Simulate progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Navigation
  useInput((input, key) => {
    if (key.escape) {
      setScreen("home");
    }
    if (screen === "home") {
      if (input === "1") setScreen("inputs");
      if (input === "2") setScreen("list");
      if (input === "3") setScreen("tabs");
    }
  });

  if (screen === "inputs") {
    return (
      <TokenProvider tokens={tokens}>
        <InputsDemo />
      </TokenProvider>
    );
  }

  if (screen === "list") {
    return (
      <TokenProvider tokens={tokens}>
        <ListDemo />
      </TokenProvider>
    );
  }

  if (screen === "tabs") {
    return (
      <TokenProvider tokens={tokens}>
        <TabsDemo />
      </TokenProvider>
    );
  }

  return (
    <TokenProvider tokens={tokens}>
      <Box flexDirection="column" padding={1}>
        <Panel title="haukTUI Component Demo" borderStyle="round">
          <Box flexDirection="column" gap={1}>
            <ThemedText color="accent" bold>
              Welcome to haukTUI!
            </ThemedText>

            <ThemedText color="muted">
              A shadcn-like workflow for Terminal UIs
            </ThemedText>

            <Divider width={50} />

            <Box gap={2}>
              <Spinner label="Loading..." />
            </Box>

            <Box flexDirection="column" gap={1}>
              <Text>Progress:</Text>
              <ProgressBar value={progress} width={40} showPercentage />
            </Box>

            <Divider width={50} />

            <Box flexDirection="column">
              <ThemedText bold color="fg">Select a demo:</ThemedText>
              <Box paddingLeft={2} flexDirection="column">
                <Text>[1] Input Components (TextInput, Password, Checkbox, Toggle)</Text>
                <Text>[2] List Component (with keyboard navigation)</Text>
                <Text>[3] Tabs Component</Text>
              </Box>
            </Box>

            <Divider width={50} />

            <Box flexDirection="column">
              <ThemedText color="muted">
                Press number keys to navigate, ESC to go back
              </ThemedText>
              <ThemedText color="muted">
                Press Ctrl+C to exit
              </ThemedText>
            </Box>

            <Divider width={50} />

            <Box flexDirection="column">
              <ThemedText bold color="fg">Available Registry Components (v0.0.1):</ThemedText>
              <Box flexDirection="column" paddingLeft={2}>
                <Text color="#71717a">• button - Focusable button with keyboard activation</Text>
                <Text color="#71717a">• text-input - Single-line text input with cursor</Text>
                <Text color="#71717a">• password-input - Secure password input with reveal</Text>
                <Text color="#71717a">• checkbox - Toggleable checkbox</Text>
                <Text color="#71717a">• radio-group - Radio button group</Text>
                <Text color="#71717a">• toggle - Switch component</Text>
                <Text color="#71717a">• select - Dropdown with keyboard nav</Text>
                <Text color="#71717a">• list - Scrollable list with selection</Text>
                <Text color="#71717a">• tabs - Tab navigation</Text>
                <Text color="#71717a">• table - Data table with scrolling</Text>
                <Text color="#71717a">• confirm-dialog - Yes/No dialog</Text>
              </Box>
            </Box>
          </Box>
        </Panel>
      </Box>
    </TokenProvider>
  );
}

// Inputs Demo - showcases the input component patterns
function InputsDemo() {
  const [textValue, setTextValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [focusedField, setFocusedField] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);

  useInput((input, key) => {
    if (key.tab) {
      setFocusedField((p) => (p + 1) % 4);
      return;
    }

    // Text input handling
    if (focusedField === 0) {
      if (key.backspace && cursorPos > 0) {
        setTextValue((v) => v.slice(0, cursorPos - 1) + v.slice(cursorPos));
        setCursorPos((p) => p - 1);
      } else if (key.leftArrow) {
        setCursorPos((p) => Math.max(0, p - 1));
      } else if (key.rightArrow) {
        setCursorPos((p) => Math.min(textValue.length, p + 1));
      } else if (input && !key.ctrl && !key.meta) {
        setTextValue((v) => v.slice(0, cursorPos) + input + v.slice(cursorPos));
        setCursorPos((p) => p + input.length);
      }
    }

    // Password input handling  
    if (focusedField === 1) {
      if (key.ctrl && input === "r") {
        setShowPassword((p) => !p);
      } else if (key.backspace && passwordValue.length > 0) {
        setPasswordValue((v) => v.slice(0, -1));
      } else if (input && !key.ctrl && !key.meta) {
        setPasswordValue((v) => v + input);
      }
    }

    // Checkbox toggle
    if (focusedField === 2 && (key.return || input === " ")) {
      setChecked((p) => !p);
    }

    // Toggle switch
    if (focusedField === 3 && (key.return || input === " ")) {
      setToggleValue((p) => !p);
    }
  });

  // Render text with cursor
  const renderTextWithCursor = (text: string, pos: number) => {
    const before = text.slice(0, pos);
    const cursor = text[pos] ?? " ";
    const after = text.slice(pos + 1);
    return (
      <Text>
        <Text color={tokens.colors.fg}>{before}</Text>
        <Text backgroundColor={tokens.colors.accent} color={tokens.colors.bg}>
          {cursor}
        </Text>
        <Text color={tokens.colors.fg}>{after}</Text>
      </Text>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Input Components Demo" borderStyle="round">
        <Box flexDirection="column" gap={1}>
          <FocusGroup>
            <Box flexDirection="column" gap={1}>
              {/* Text Input */}
              <Box flexDirection="column">
                <Text color={focusedField === 0 ? tokens.colors.accent : tokens.colors.muted}>
                  Text Input
                </Text>
                <Box
                  borderStyle="round"
                  borderColor={focusedField === 0 ? tokens.colors.focus : tokens.colors.border}
                  paddingX={1}
                >
                  {focusedField === 0 ? (
                    textValue.length > 0 ? renderTextWithCursor(textValue, cursorPos) : (
                      <Text>
                        <Text backgroundColor={tokens.colors.accent} color={tokens.colors.bg}> </Text>
                      </Text>
                    )
                  ) : (
                    <Text color={textValue ? tokens.colors.fg : tokens.colors.muted}>
                      {textValue || "Enter text..."}
                    </Text>
                  )}
                </Box>
              </Box>

              <Divider width={40} />

              {/* Password Input */}
              <Box flexDirection="column">
                <Text color={focusedField === 1 ? tokens.colors.accent : tokens.colors.muted}>
                  Password Input
                </Text>
                <Box
                  borderStyle="round"
                  borderColor={focusedField === 1 ? tokens.colors.focus : tokens.colors.border}
                  paddingX={1}
                >
                  <Text color={tokens.colors.muted}>{showPassword ? "* " : "  "}</Text>
                  <Text color={passwordValue ? tokens.colors.fg : tokens.colors.muted}>
                    {passwordValue
                      ? showPassword
                        ? passwordValue
                        : "*".repeat(passwordValue.length)
                      : "Enter password..."}
                  </Text>
                </Box>
                {focusedField === 1 && (
                  <Text color={tokens.colors.muted} dimColor>
                    Ctrl+R to {showPassword ? "hide" : "reveal"}
                  </Text>
                )}
              </Box>

              <Divider width={40} />

              {/* Checkbox */}
              <Box flexDirection="column">
                <Text color={focusedField === 2 ? tokens.colors.accent : tokens.colors.muted}>
                  Checkbox
                </Text>
                <Box paddingX={1}>
                  <Text
                    color={focusedField === 2 ? tokens.colors.focus : undefined}
                    bold={focusedField === 2}
                  >
                    {checked ? "☑ " : "☐ "}Accept terms and conditions
                  </Text>
                </Box>
              </Box>

              <Divider width={40} />

              {/* Toggle */}
              <Box flexDirection="column">
                <Text color={focusedField === 3 ? tokens.colors.accent : tokens.colors.muted}>
                  Toggle
                </Text>
                <Box gap={1} paddingX={1}>
                  <Text>Dark Mode</Text>
                  <Box
                    borderStyle="round"
                    borderColor={focusedField === 3 ? tokens.colors.focus : tokens.colors.border}
                  >
                    <Text color={toggleValue ? tokens.colors.success : "#3f3f46"} bold>
                      {toggleValue ? "  ●" : "●  "}
                    </Text>
                  </Box>
                  <Text color={toggleValue ? tokens.colors.success : tokens.colors.muted}>
                    {toggleValue ? "ON" : "OFF"}
                  </Text>
                </Box>
              </Box>
            </Box>
          </FocusGroup>

          <Divider width={40} />
          <ThemedText color="muted">Press TAB to switch fields, ESC to go back</ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

// List Demo - showcases the list component pattern
function ListDemo() {
  const items = [
    { label: "Introduction", value: "intro", description: "Getting started with haukTUI" },
    { label: "Installation", value: "install", description: "How to install the CLI" },
    { label: "Configuration", value: "config", description: "Setting up hauk.config.json" },
    { label: "Components", value: "components", description: "Available UI components" },
    { label: "Tokens", value: "tokens", description: "Theming and design tokens" },
    { label: "Primitives", value: "primitives", description: "Low-level building blocks" },
    { label: "Keyboard Navigation", value: "keyboard", description: "Focus and keymap system" },
    { label: "Examples", value: "examples", description: "Sample applications" },
    { label: "API Reference", value: "api", description: "Complete API documentation" },
    { label: "Contributing", value: "contrib", description: "How to contribute" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisible = 5;

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedIndex((p) => Math.max(0, p - 1));
    } else if (key.downArrow || input === "j") {
      setSelectedIndex((p) => Math.min(items.length - 1, p + 1));
    } else if (input === "g") {
      setSelectedIndex(0);
    } else if (input === "G") {
      setSelectedIndex(items.length - 1);
    }
  });

  // Adjust scroll offset to keep selected item visible
  React.useEffect(() => {
    if (selectedIndex < scrollOffset) {
      setScrollOffset(selectedIndex);
    } else if (selectedIndex >= scrollOffset + maxVisible) {
      setScrollOffset(selectedIndex - maxVisible + 1);
    }
  }, [selectedIndex]);

  const visibleItems = items.slice(scrollOffset, scrollOffset + maxVisible);
  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset + maxVisible < items.length;

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="List Component Demo" borderStyle="round">
        <Box flexDirection="column" gap={1}>
          <ThemedText bold color="accent">Documentation Sections</ThemedText>

          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={tokens.colors.focus}
          >
            {/* Scroll up indicator */}
            {canScrollUp && (
              <Box justifyContent="center">
                <Text color={tokens.colors.muted}>▲ more</Text>
              </Box>
            )}

            {/* List items */}
            {visibleItems.map((item, visibleIndex) => {
              const actualIndex = scrollOffset + visibleIndex;
              const isSelected = actualIndex === selectedIndex;

              return (
                <Box
                  key={item.value}
                  flexDirection="column"
                  paddingX={1}
                >
                  <Text
                    color={isSelected ? tokens.colors.accent : tokens.colors.fg}
                    bold={isSelected}
                    inverse={isSelected}
                  >
                    {isSelected ? "● " : "  "}
                    {item.label}
                  </Text>
                  <Text color={tokens.colors.muted} dimColor>
                    {"   "}
                    {item.description}
                  </Text>
                </Box>
              );
            })}

            {/* Scroll down indicator */}
            {canScrollDown && (
              <Box justifyContent="center">
                <Text color={tokens.colors.muted}>▼ more</Text>
              </Box>
            )}

            {/* Item count */}
            <Box justifyContent="flex-end" paddingX={1}>
              <Text color={tokens.colors.muted} dimColor>
                {selectedIndex + 1}/{items.length}
              </Text>
            </Box>
          </Box>

          <Divider width={50} />
          <ThemedText color="muted">↑/↓ or j/k to navigate, g/G for top/bottom</ThemedText>
          <ThemedText color="muted">Press ESC to go back</ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

// Tabs Demo - showcases the tabs component pattern
function TabsDemo() {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "features", label: "Features" },
    { key: "install", label: "Installation" },
    { key: "usage", label: "Usage" },
  ];

  const [activeTab, setActiveTab] = useState("overview");

  useInput((input, key) => {
    const currentIndex = tabs.findIndex((t) => t.key === activeTab);

    if (key.leftArrow || input === "h") {
      const prevIndex = Math.max(0, currentIndex - 1);
      setActiveTab(tabs[prevIndex].key);
    } else if (key.rightArrow || input === "l") {
      const nextIndex = Math.min(tabs.length - 1, currentIndex + 1);
      setActiveTab(tabs[nextIndex].key);
    }

    // Number keys for quick access
    const num = parseInt(input, 10);
    if (num >= 1 && num <= tabs.length) {
      setActiveTab(tabs[num - 1].key);
    }
  });

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Box flexDirection="column" gap={1}>
            <ThemedText bold color="accent">haukTUI Overview</ThemedText>
            <Text>
              haukTUI is a component registry for Terminal UIs, inspired by shadcn/ui.
            </Text>
            <Text color={tokens.colors.muted}>
              Copy components directly into your project and customize freely.
            </Text>
          </Box>
        );
      case "features":
        return (
          <Box flexDirection="column" gap={1}>
            <ThemedText bold color="accent">Features</ThemedText>
            <Box flexDirection="column" paddingLeft={2}>
              <Text>• Design tokens for consistent theming</Text>
              <Text>• Terminal capability detection</Text>
              <Text>• Vim-style keyboard navigation</Text>
              <Text>• Focus management system</Text>
              <Text>• 11+ ready-to-use components</Text>
            </Box>
          </Box>
        );
      case "install":
        return (
          <Box flexDirection="column" gap={1}>
            <ThemedText bold color="accent">Installation</ThemedText>
            <Text color={tokens.colors.muted}>$ npm install -g @hauktui/cli</Text>
            <Text color={tokens.colors.muted}>$ hauktui init</Text>
            <Text color={tokens.colors.muted}>$ hauktui add button text-input</Text>
          </Box>
        );
      case "usage":
        return (
          <Box flexDirection="column" gap={1}>
            <ThemedText bold color="accent">Usage</ThemedText>
            <Text>Components are copied to your project's component directory.</Text>
            <Text>You can freely modify the source code to fit your needs.</Text>
            <Text color={tokens.colors.muted}>
              Use `hauktui diff` to check for updates.
            </Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Tabs Component Demo" borderStyle="round">
        <Box flexDirection="column" gap={1}>
          {/* Tabs */}
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={tokens.colors.focus}
            paddingX={1}
          >
            <Box flexDirection="row">
              {tabs.map((tab, index) => {
                const isActive = tab.key === activeTab;
                return (
                  <Box key={tab.key} paddingX={1}>
                    <Text
                      color={isActive ? tokens.colors.accent : tokens.colors.fg}
                      bold={isActive}
                      inverse={isActive}
                    >
                      {isActive ? "● " : "○ "}
                      <Text color={tokens.colors.muted}>{index + 1}.</Text> {tab.label}
                    </Text>
                  </Box>
                );
              })}
            </Box>
            <Text color={tokens.colors.muted} dimColor>
              ←/→ or 1-4
            </Text>
          </Box>

          <Divider width={50} />

          {/* Content */}
          <Box paddingX={1}>
            {renderContent()}
          </Box>

          <Divider width={50} />
          <ThemedText color="muted">Press ESC to go back</ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

render(<App />);
