# haukTUI — Project Plan (Production-Ready)

> A shadcn-like workflow for Terminal UIs: a registry + CLI that copies editable component source into user projects.

## Goals

- **Copy-into-project ownership**: users run `hauktui add <component>` and get editable TS/TSX files.
- **Unstyled by default**: styling comes from tokens + optional local overrides.
- **Ink-first, not Ink-locked**: components are authored for Ink, while core contracts stay renderer-agnostic.
- **OSS-ready + npm-ready**: monorepo, CI, versioning, changelogs, and automated publishing.

## Non-goals (initially)

- No heavy runtime UI framework with opaque internals.
- No “theme that can’t be escaped”.
- No monolithic dependency tree for apps that only want a few components.

## Architecture Overview

haukTUI is composed of:

1) **Runtime libraries** (published packages)
- Tokens + core contracts + Ink primitives.

2) **Component registry** (source-of-truth)
- Canonical component source files and metadata that the CLI uses.

3) **CLI** (developer workflow)
- Initializes config, installs deps, copies component sources, supports diff/update.

## Repo Layout (pnpm workspaces)

```
hauktui/
├─ packages/
│  ├─ tokens/            # @hauktui/tokens
│  ├─ core/              # @hauktui/core
│  ├─ primitives-ink/     # @hauktui/primitives-ink
│  ├─ registry/           # @hauktui/registry (metadata + source templates)
│  └─ cli/                # @hauktui/cli
├─ examples/
│  ├─ demo-basic/
│  └─ demo-wizard/
├─ configs/               # shared tsconfig/eslint/vitest/etc
├─ .github/workflows/
├─ README.md
├─ CONTRIBUTING.md
├─ CODE_OF_CONDUCT.md
├─ SECURITY.md
└─ LICENSE
```

## Package Responsibilities

### `@hauktui/tokens`
- Detect terminal capabilities (color depth, unicode support where possible).
- Provide semantic tokens: `accent`, `muted`, `danger`, `focus`, `border`, `bg`, `fg`, `space.*`.
- Keep **renderer-agnostic** (no Ink imports).

Exports:
- `createDefaultTokens()`
- `mergeTokens(base, overrides)`
- `detectTerminalCapabilities()`

### `@hauktui/core`
- Shared types and contracts:
  - key actions + keymaps
  - focus model contracts
  - accessibility-ish metadata (labels, descriptions)
  - utilities (clamp, memo, stable ids)

### `@hauktui/primitives-ink`
- Ink-specific implementations:
  - `KeymapProvider`
  - `FocusRing`, `FocusGroup`
  - `ScrollView` (if feasible)
  - `Text`/`Box` wrappers that accept tokens

### `@hauktui/registry`
- Holds canonical component source (templates) + manifest.

Suggested structure:
```
packages/registry/
├─ registry.json
└─ components/
   ├─ button/
   │  ├─ index.ts
   │  └─ button.tsx
   ├─ select/
   └─ ...
```

Each entry in `registry.json` describes:
- files to copy
- required npm deps
- required haukTUI deps
- post-install notes

### `@hauktui/cli`
Commands:
- `hauktui init`:
  - creates `hauk.config.json`
  - installs baseline deps
  - adds folder structure (`src/tui/...`)
- `hauktui add <name...>`:
  - fetches registry (remote + cache)
  - copies component files
  - updates `hauk.lock.json` with version + file hashes
- `hauktui list/search/view`:
  - discovery + preview
- `hauktui diff <name>`:
  - shows local vs upstream differences
- `hauktui update <name|all>`:
  - safe updates (prefer 3-way merge; fallback to “new file + manual review”)

Config files:
- `hauk.config.json`: paths, registry url, token defaults
- `hauk.lock.json`: installed components, versions, file hashes

## Contracts (must be consistent everywhere)

### Tokens
- All components accept `{ tokens }`.
- Components may accept optional `{ styles }` overrides but must work without them.

### Controlled/uncontrolled
For inputs/select-like widgets:
- `value?: T`
- `defaultValue?: T`
- `onChange?: (value: T) => void`

### Keyboard + focus
- Standard actions: `submit`, `cancel`, `next`, `prev`, `up`, `down`, `left`, `right`, `tab`, `backtab`.
- Provide a common `KeymapProvider` and allow per-component overrides.

## Component Roadmap

### Foundation (ship first)
- Primitives: `FocusRing`, `FocusGroup`, `KeymapProvider`, `Panel`, `Divider`, `Spinner`, `ProgressBar`.
- Core components: `Button`, `Select`.

### Inputs
- `TextInput` (single line)
- `PasswordInput`
- `Checkbox`, `RadioGroup`, `Toggle`

### Patterns
- `Form` (validation + error rendering)
- `Wizard` (step flow)
- `Table` (paging later)
- `CommandPalette` (fuzzy search)

## Testing Strategy

- Unit tests for token logic in `@hauktui/tokens`.
- Snapshot tests for Ink render output for primitives/components.
- Input simulation tests for keyboard navigation and selection.

## Tooling & Standards

- TypeScript, strict mode, project references.
- ESLint + Prettier.
- Vitest.
- Changesets for versioning + changelogs.

## CI/CD (GitHub Actions)

Workflows:
- `ci.yml`: lint, typecheck, test, build.
- `release.yml`: Changesets action creates release PR; merges trigger publish to npm.

Secrets:
- `NPM_TOKEN`

## NPM Publishing Model

- Publish runtime packages: `@hauktui/tokens`, `@hauktui/core`, `@hauktui/primitives-ink`, `@hauktui/cli`.
- Registry can be published (optional) but primarily served as a static JSON + source directory via GitHub.

## First Milestone Checklist (MVP)

- [ ] Monorepo scaffolding + shared configs
- [ ] `@hauktui/tokens` with capability detection + semantic tokens
- [ ] `@hauktui/core` keymap + focus contracts
- [ ] `@hauktui/primitives-ink` FocusRing + KeymapProvider
- [ ] Registry with Button + Select
- [ ] CLI: init/add/list/view
- [ ] Example app demonstrating the flow
- [ ] CI running on PRs
- [ ] Changesets release pipeline
