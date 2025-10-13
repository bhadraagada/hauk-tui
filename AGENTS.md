# Repository Guidelines

This repository currently contains `idea.md`. As you add code, use the structure and practices below to keep the project consistent and easy to maintain.

## Project Structure & Module Organization
- `src/`: Application code (group by feature; e.g., `src/auth/`, `src/utils/`).
- `tests/`: Mirrors `src/` (e.g., `tests/auth/` for `src/auth/`).
- `scripts/`: Dev/CI helper scripts (PowerShell/Bash).
- `docs/`: Architecture notes, ADRs, and diagrams.
- `assets/`: Static files (images, sample data).

Example:
```
src/
  core/
tests/
  core/
scripts/
docs/
assets/
```

## Build, Test, and Development Commands
- `make setup` (or `scripts/setup.*`): Install dependencies and bootstrap env.
- `make dev` (or `scripts/dev.*`): Run the app locally.
- `make test` (or `scripts/test.*`): Run the test suite.
- `make lint` / `make format`: Run linters/formatters.

If using Python: `python -m venv .venv && pip install -r requirements.txt`; tests via `pytest -q`.
If using Node: `npm ci`; dev via `npm run dev`; tests via `npm test`.

## Coding Style & Naming Conventions
- Indentation: 4 spaces (Python); 2 spaces (JS/TS).
- Python: `snake_case` for files/functions, `PascalCase` for classes.
- JS/TS: `camelCase` for vars/functions, `PascalCase` for classes.
- Keep modules small, cohesive; prefer feature folders over giant util files.
- Tools: Prettier/ESLint (JS/TS), Black/Ruff (Python). Commit formatted code only.

## Testing Guidelines
- Place tests under `tests/` mirroring `src/`.
- Naming: Python `test_*.py`; JS/TS `*.spec.ts` or `*.test.ts`.
- Target ≥80% coverage for changed code; include edge cases and error paths.
- Run tests locally before opening a PR.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(scope): brief summary`.
- PRs: clear description, linked issues (`Fixes #123`), test evidence (logs/screenshots), and notes on risks/rollbacks.
- Keep PRs small and focused; update `docs/` when behavior or interfaces change.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local` and provide `.env.example` with placeholders.
- Prefer parameterized configs; validate required env vars in a `scripts/verify-env.*` script.
