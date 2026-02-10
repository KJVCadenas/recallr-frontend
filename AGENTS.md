# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and route segments (e.g., `app/page.tsx`).
- `components/`: Reusable UI components (React/TSX).
- `hooks/`: Custom React hooks.
- `lib/`: Shared utilities, API helpers, and types.
- `public/`: Static assets served at the site root.
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands
Use `pnpm` (lockfile present). If you prefer npm, mirror the same scripts.
- `pnpm dev`: Run the Next.js dev server at `http://localhost:3000`.
- `pnpm build`: Create a production build.
- `pnpm start`: Run the production server from the build output.
- `pnpm lint`: Run ESLint across the project.

## Coding Style & Naming Conventions
- Language: TypeScript + React (TSX) with Next.js App Router.
- Indentation: 2 spaces; keep lines readable and prefer named exports for components.
- File naming: components in `PascalCase.tsx`, hooks in `useThing.ts`, utilities in `camelCase.ts`.
- Linting: `eslint` with `eslint-config-next`. Run `pnpm lint` before PRs.

## Testing Guidelines
- No automated test setup is currently present.
- If you add tests, keep them colocated with features (e.g., `components/Button.test.tsx`) and document the command in this file.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat: add review card shuffle`).
- PRs should include:
  - A brief summary and rationale.
  - Screenshots or short clips for UI changes.
  - Notes on any manual testing performed.

## Configuration & Security Notes
- Environment variables (if added) should be documented in a sample file (e.g., `.env.example`).
- Avoid committing secrets; keep API keys server-side where possible.
