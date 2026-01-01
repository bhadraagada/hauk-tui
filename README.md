<p align="center">
  <img src="https://raw.githubusercontent.com/hauktui/hauktui/main/docs/public/logo.png" alt="haukTUI" width="120" />
</p>

<h1 align="center">haukTUI</h1>

<p align="center">
  <strong>Beautiful Terminal UI components for React Ink</strong>
</p>

<p align="center">
  A shadcn/ui inspired component registry for building stunning terminal applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@hauktui/cli"><img src="https://img.shields.io/npm/v/@hauktui/cli?style=flat-square&color=00d9ff" alt="npm version" /></a>
  <a href="https://github.com/hauktui/hauktui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
  <a href="https://github.com/hauktui/hauktui/stargazers"><img src="https://img.shields.io/github/stars/hauktui/hauktui?style=flat-square&color=yellow" alt="stars" /></a>
</p>

<p align="center">
  <a href="https://hauktui.dev">Documentation</a> •
  <a href="#installation">Installation</a> •
  <a href="#components">Components</a> •
  <a href="#quick-start">Quick Start</a>
</p>

---

## Why haukTUI?

Unlike traditional component libraries, haukTUI gives you **ownership of your code**. Components are copied directly into your project — customize, extend, or rewrite them however you want.

<table>
<tr>
<td width="33%" valign="top">

### 🎨 Beautifully Designed
67 components crafted for terminal UIs with consistent styling and theming support.

</td>
<td width="33%" valign="top">

### ⌨️ Keyboard First
Full keyboard navigation with vim-style bindings. Tab, arrows, hjkl — it all works.

</td>
<td width="33%" valign="top">

### 🔧 Fully Customizable
Components live in your codebase. No black boxes, no overrides, just your code.

</td>
</tr>
</table>

---

## Installation

```bash
# Install the CLI globally
npm install -g @hauktui/cli

# Initialize in your project
hauk init

# Add components you need
hauk add button select table
```

That's it. Components are now in your project ready to use and customize.

---

## Components

**67 components** across 6 categories — everything you need to build professional terminal apps.

<details>
<summary><strong>🧱 Primitives</strong> — Basic building blocks</summary>

<br>

| Component | Description |
|-----------|-------------|
| `button` | Focusable button with keyboard activation |
| `badge` | Status indicator labels |
| `avatar` | User avatar with auto-generated initials |
| `avatar-group` | Stacked avatars with overflow |
| `kbd` | Keyboard shortcut display |
| `label` | Form labels with required indicator |
| `typography` | Text styling variants |

</details>

<details>
<summary><strong>📝 Inputs</strong> — Form controls and user input</summary>

<br>

| Component | Description |
|-----------|-------------|
| `text-input` | Single-line text input |
| `textarea` | Multi-line text input |
| `password-input` | Secure password entry with reveal |
| `checkbox` | Toggle checkbox |
| `toggle` | Boolean toggle switch |
| `switch` | iOS-style switch |
| `radio-group` | Single selection from options |
| `select` | Dropdown selection |
| `combobox` | Searchable select with autocomplete |
| `slider` | Range value selector |
| `calendar` | Date calendar picker |
| `date-picker` | Date input with dropdown |
| `input-otp` | OTP/PIN code input |
| `color-picker` | Color selection grid |
| `tag-input` | Multi-tag entry |
| `command` | Command palette with search |
| `field` | Form field wrapper |
| `form` | Form container with validation |
| `toggle-group` | Button group selection |

</details>

<details>
<summary><strong>📐 Layout</strong> — Structure and organization</summary>

<br>

| Component | Description |
|-----------|-------------|
| `card` | Container with header/footer |
| `accordion` | Collapsible content sections |
| `collapsible` | Expandable content |
| `table` | Data table with selection |
| `data-table` | Advanced table with sorting |
| `list` | Scrollable list with navigation |
| `separator` | Visual divider |
| `scroll-area` | Scrollable container |
| `resizable` | Resizable panel layout |

</details>

<details>
<summary><strong>🧭 Navigation</strong> — Moving around your app</summary>

<br>

| Component | Description |
|-----------|-------------|
| `tabs` | Tab navigation |
| `breadcrumb` | Navigation trail |
| `pagination` | Page navigation |
| `stepper` | Wizard step indicator |
| `sidebar` | Application sidebar |
| `menubar` | Horizontal menu bar |
| `navigation-menu` | Navigation with dropdowns |
| `dropdown-menu` | Dropdown menu |
| `context-menu` | Right-click context menu |

</details>

<details>
<summary><strong>💬 Feedback</strong> — User communication</summary>

<br>

| Component | Description |
|-----------|-------------|
| `alert` | Alert messages |
| `dialog` | Modal dialog |
| `alert-dialog` | Confirmation dialog |
| `confirm-dialog` | Yes/No prompt |
| `toast` | Temporary notifications |
| `progress` | Progress bar |
| `spinner` | Loading spinner |
| `skeleton` | Loading placeholder |
| `empty` | Empty state display |
| `drawer` | Slide-out panel |
| `sheet` | Modal sheet |
| `popover` | Floating content |
| `tooltip` | Hover hints |
| `hover-card` | Hover card popup |

</details>

<details>
<summary><strong>📊 Display</strong> — Data visualization</summary>

<br>

| Component | Description |
|-----------|-------------|
| `banner` | ASCII art banner |
| `chart` | ASCII charts |
| `carousel` | Content carousel |
| `code-block` | Syntax highlighted code |
| `countdown` | Countdown timer |
| `stat` | Statistics display |
| `terminal` | Terminal output display |
| `timeline` | Event timeline |
| `tree-view` | File tree explorer |

</details>

---

## Quick Start

```tsx
import React from "react";
import { render } from "ink";
import { TokenProvider } from "@hauktui/primitives-ink";
import { FocusProvider } from "@hauktui/core";
import { Button } from "./tui/components/button";
import { Card } from "./tui/components/card";

function App() {
  return (
    <TokenProvider>
      <FocusProvider>
        <Card title="Welcome" description="Get started with haukTUI">
          <Button onPress={() => console.log("Hello!")}>
            Press Me
          </Button>
        </Card>
      </FocusProvider>
    </TokenProvider>
  );
}

render(<App />);
```

**Output:**
```
╭─ Welcome ────────────────────╮
│  Get started with haukTUI    │
│                              │
│  [ Press Me ]                │
│                              │
╰──────────────────────────────╯
```

---

## Keyboard Navigation

Every component supports full keyboard navigation out of the box.

| Key | Action |
|:---:|--------|
| `Tab` | Next focusable element |
| `Shift+Tab` | Previous focusable element |
| `↑` `↓` `←` `→` | Navigate within component |
| `Enter` | Activate / Select |
| `Space` | Toggle / Activate |
| `Escape` | Close / Cancel |
| `j` `k` | Vim: Down / Up |
| `h` `l` | Vim: Left / Right |
| `g` `G` | Vim: First / Last |

---

## Theming

Customize the look with your own color tokens:

```tsx
import { TokenProvider } from "@hauktui/primitives-ink";

const myTheme = {
  colors: {
    bg: "#0a0a0a",
    fg: "#fafafa",
    accent: "#22c55e",
    muted: "#71717a",
    border: "#27272a",
    focus: "#3b82f6",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    info: "#3b82f6",
  },
};

<TokenProvider tokens={myTheme}>
  <App />
</TokenProvider>
```

---

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@hauktui/cli` | CLI for adding components | ![npm](https://img.shields.io/npm/v/@hauktui/cli?style=flat-square&label=) |
| `@hauktui/core` | Focus management & keyboard handling | ![npm](https://img.shields.io/npm/v/@hauktui/core?style=flat-square&label=) |
| `@hauktui/tokens` | Theme tokens & colors | ![npm](https://img.shields.io/npm/v/@hauktui/tokens?style=flat-square&label=) |
| `@hauktui/primitives-ink` | Low-level Ink primitives | ![npm](https://img.shields.io/npm/v/@hauktui/primitives-ink?style=flat-square&label=) |

---

## Development

```bash
# Clone & install
git clone https://github.com/hauktui/hauktui.git
cd hauktui && pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start docs site
cd docs && pnpm dev
```

<details>
<summary>Project Structure</summary>

```
hauktui/
├── packages/
│   ├── cli/                # hauk CLI tool
│   ├── core/               # Focus & keyboard management
│   ├── tokens/             # Theme system
│   ├── primitives-ink/     # Ink primitives
│   └── registry/           # Component registry
│       └── components/     # All 67 components
├── docs/                   # Documentation (Next.js)
├── examples/               # Example projects
└── test-project/           # Dev sandbox
```

</details>

---

## Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create your branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome`)
5. Open a Pull Request

---

## License

MIT © [haukTUI](https://github.com/hauktui/hauktui)

---

<p align="center">
  <sub>Built with ❤️ for the terminal</sub>
</p>
