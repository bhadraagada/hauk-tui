# haukTUI (Ink + TypeScript)

A shadcn-like TUI component library for Node.js/TypeScript using Ink. Components are unstyled primitives by default and can be copied into your app via a small CLI.

## Monorepo Layout
- `packages/tokens`: Color/spacing tokens with color depth detection.
- `packages/primitives`: Low-level primitives (`FocusRing`, `KeymapProvider`).
- `packages/components`: Reusable components (`Button`, `Select`).
- `packages/cli`: `hauktui` CLI that copies templates into your project.
- `examples`: Ink demo showcasing the basics.

## Getting Started
1. Install deps (pnpm recommended):
   - `pnpm install` (from repo root)
2. Build all packages:
   - `pnpm -r build`
3. Run the demo (from repo root):
   - `npm run demo`

## CLI (scaffolder)
- List templates: `node packages/cli/dist/index.js list`
- Add to current project: `node packages/cli/dist/index.js add button select -d src/tui`

This will copy tokens + primitives + selected components into `src/tui/`.

## Notes
- Requires Node 18+, Ink 4.x, React 18.
- Components focus on keyboard-first UX and unstyled primitives.
- Follow `idea.md` for roadmap and design principles.

