absolutely — here’s a clean, complete `idea.md` for your repo (`haukTUI/idea.md`). it’s written to give **coding agents (and future contributors)** full context of the project’s **vision, purpose, structure, and roadmap** — like a design + strategy doc.

---

````markdown
# 🦅 haukTUI — The Shadcn for Terminal UIs

> **Tagline:** razor-sharp, copy-paste-ready TUI components for the modern terminal.

---

## 🌱 The Core Idea

**haukTUI** is a new **TypeScript/JavaScript component library and toolkit for building terminal user interfaces (TUIs)** — inspired by **shadcn/ui** (for web GUIs) but designed entirely for **text-based interfaces** using frameworks like **Ink** (React for CLIs).

Instead of a compiled widget library, haukTUI lets you **copy the actual source code** of components into your project — giving you full ownership, editability, and control, just like `shadcn add button` does for web components.

This project aims to bring **beautiful developer experience (DX)**, **reusable design patterns**, and **structured composition** to the terminal world — where most libraries today are either monolithic, over-styled, or too low-level.

---

## 🎯 Mission Statement

> Build the **definitive open-source TUI component system** for Node.js and TypeScript — unstyled by default, composable, framework-agnostic (Ink-first), and developer-owned.

---

## 💡 Why It Exists

Modern devs spend half their time in terminals — yet most CLI tools still rely on brittle, ad-hoc prompts or dashboards.

There are incredible foundations (Ink, Blessed, BubbleTea, Ratatui, Textual), but what’s missing is a **DX-focused, unopinionated design system** for TUIs — one that you can import, extend, theme, or fork at will.

**haukTUI** fills that gap by doing for terminal UIs what **shadcn/ui** did for React GUIs:
- provides **unstyled, composable building blocks**
- uses **copy-into-project** architecture (no runtime dependency)
- emphasizes **DX, accessibility, and ownership**
- offers **CLI scaffolding + patterns**, not just widgets

---

## 🧩 Key Concepts

### 1. **Component Ownership**
Each component is copied directly into your app with:
```bash
npx @hauktui/cli add button select
````

→ generates local, editable TSX files under `src/tui/`.

No hidden runtime dependencies — just plain React Ink components you can modify freely.

---

### 2. **Unstyled by Default**

All components are **unstyled primitives** using Ink’s `Text` and `Box`.
Color, spacing, and borders come from a simple `tokens` system that adapts to:

* terminal color depth (16 / 256 / truecolor)
* user themes
* runtime capabilities (via env + supports-color)

---

### 3. **Composable Architecture**

Each primitive and component is React-based:

* `FocusRing` — handles keyboard focus borders
* `KeymapProvider` — centralized keybinding management
* `Button`, `Select`, `Checkbox`, `TextInput` — interactive widgets
* `Wizard`, `Form`, `Table`, `Progress` — higher-level patterns

Everything works seamlessly with Ink’s hooks (`useInput`, `useFocus`, etc).

---

### 4. **CLI Scaffolding**

A lightweight CLI `hauktui` provides commands like:

```bash
hauktui add button select
hauktui list
hauktui update all
```

Copies actual component code, similar to shadcn’s workflow.
Goal: let users **own the code** while benefiting from upstream updates.

---

### 5. **Theming & Tokens**

* Semantic tokens (`accent`, `muted`, `focus`, etc)
* Auto-detect color depth (16/256/24-bit)
* Optional theme overrides (dark/light/accented)
* Future: config-based themes via `hauktui theme init`

---

## 🏗️ Project Structure

```
hauktui/
├─ packages/
│  ├─ tokens/         → color & spacing tokens
│  ├─ primitives/     → FocusRing, KeymapProvider, etc
│  ├─ components/     → Button, Select, Checkbox, TextInput, etc
│  ├─ cli/            → hauktui add <component> (file copier)
├─ examples/
│  ├─ demo.tsx        → Ink showcase app
│  ├─ wizard-demo.tsx → step-based example (planned)
├─ idea.md            → this file
└─ README.md          → general documentation
```

---

## ⚙️ Tech Stack

| Layer        | Tool / Framework                           | Purpose                     |
| ------------ | ------------------------------------------ | --------------------------- |
| UI Framework | [Ink](https://github.com/vadimdemedes/ink) | React renderer for CLI apps |
| Language     | TypeScript                                 | Type-safe components        |
| CLI          | Node.js + CommonJS                         | lightweight file copier     |
| Build        | tsc + pnpm workspaces                      | monorepo-friendly           |
| Testing      | vitest + ink-testing-library (planned)     | snapshot + behavior tests   |

---

## 📦 Package Scopes

| Package               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `@hauktui/tokens`     | shared design tokens (colors, spacing, depth) |
| `@hauktui/primitives` | low-level TUI primitives                      |
| `@hauktui/components` | ready-to-use interactive components           |
| `@hauktui/cli`        | scaffolding tool (copy source files)          |

---

## 🧠 Example Usage

```tsx
import { render, Box } from "ink";
import { createDefaultTokens } from "@hauktui/tokens";
import { Button } from "@hauktui/components/Button";
import { Select } from "@hauktui/components/Select";

const tokens = createDefaultTokens();

render(
  <Box flexDirection="column">
    <Button tokens={tokens} onPress={() => console.log("Clicked!")}>Click Me</Button>
    <Select
      tokens={tokens}
      items={[{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }]}
      onChange={(v) => console.log("Selected:", v)}
    />
  </Box>
);
```

---

## 🧭 Roadmap

### Phase 1 — MVP

* [x] Tokens system (color depth detection)
* [x] Primitives: `FocusRing`, `KeymapProvider`
* [x] Components: `Button`, `Select`
* [x] CLI scaffolder (`hauktui add ...`)
* [ ] TextInput, Checkbox, Progress
* [ ] Snapshot tests (render-to-string)

### Phase 2 — UX + Patterns

* [ ] Wizard / Form pattern
* [ ] Table with paging + filter
* [ ] SplitPane + ScrollView
* [ ] Async job monitor + status indicators

### Phase 3 — Ecosystem

* [ ] Theming engine (`hauktui theme init`)
* [ ] Templates gallery (e.g. log viewer, repo browser)
* [ ] VS Code + Neovim devtools integrations
* [ ] Port adapters: BubbleTea (Go), Ratatui (Rust)

---

## 🦅 Branding Notes

* **Name meaning:**
  “**Hauk**” = “hawk” (Nordic spelling) → speed, focus, precision.
  “**TUI**” = Terminal User Interface.
  Together: *razor-sharp TUIs for developers with hawk-eye precision.*

* **Tagline ideas:**

  * “The shadcn for your terminal.”
  * “Own your UI, even in the CLI.”
  * “Build razor-sharp TUIs in TypeScript.”

* **Mascot:** minimal ASCII hawk head or wings banner.

---

## 🧰 For Coding Agents

When generating code or docs for this project:

* **Use the imports and structure shown above.**
* Assume Ink 4.x and React 18.
* Respect the modular package layout.
* New components should follow `tsx` composition style using Ink primitives.
* Keep components **unstyled by default**; styling via tokens only.
* Components should support keyboard navigation via `useInput` + `useFocus`.

---

## 💬 Summary

**haukTUI** is the missing piece between low-level TUI frameworks and high-level design systems — a **developer-owned, copy-paste component library for the terminal**.

Think:
🧱 composable primitives
🎨 token-based theming
⚡ shadcn-style DX
🦅 razor-sharp focus

> **Goal:** Make building beautiful, interactive terminal apps as fast, ergonomic, and extensible as building React web apps.

---

```

