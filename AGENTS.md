# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router segments: public marketing pages (`page.tsx`), protected areas (`app/(protected)`), API routes, and global styles/layouts.
- `components/` stores shared UI pieces and the query/recaptcha providers; keep components in PascalCase (e.g., `MyDecksView.tsx`).
- `hooks/` contains TanStack React Query helpers (`useDecks`, `useCards`, `useProfile`) and misc hooks.
- `lib/` splits client-side helpers (`frontend/validation.ts`, `utils.ts`) from backend services/controllers (`api/`).
- `public/` hosts static assets (images, video, sample PDF) referenced via `next/image` or `<Link>` downloads.

## Build, Test, and Development Commands
- `pnpm dev` — starts the Next.js dev server at `http://localhost:3000`.
- `pnpm build` — creates a production build; run before deploys and ensure fonts can be fetched or vendored.
- `pnpm lint` — runs ESLint per `eslint.config.mjs`; fix warnings/errors before merging.
- `pnpm start` — serves the production build locally (after `pnpm build`).

## Coding Style & Naming Conventions
- TypeScript + React with App Router; prefer named exports and functional components.
- Use 2-space indentation and keep line lengths readable; avoid `any` unless truly necessary.
- Components/UI files: PascalCase + `.tsx`, hooks `useThing.ts`, utils `camelCase.ts`.
- Shared styling leans on Tailwind classes, shadcn/ui primitives, and `cn()` for merging.
- `next/font` is configured in `app/layout.tsx` (Geist + Inter); guard offline builds by pinning fonts when possible.

## Testing Guidelines
- No automated tests currently; rely on manual smoke checks (auth flow, deck creation/review, profile updates).
- When adding tests, colocate them (e.g., `components/Button.test.tsx`) and describe how to run them in this doc.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (e.g., `feat: add review card shuffle`, `fix: handle missing deck`).
- PRs should include a short summary, rationale, screenshots of UI changes, and notes on manual testing executed locally.
- Mention relevant issue IDs in commit/PR descriptions when applicable.

## Security & Configuration Tips
- Keep secrets out of Git; document new env vars in `.env.example` (e.g., `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `JWT_SECRET`, `OPENROUTER_API_KEY`).
- The backend uses file-based JSON storage under `data/`; ensure write permissions exist when running locally.
- Recaptcha providers wrap the app in `app/layout.tsx`, so load failures block login/register—provide fallback tokens for demos if needed.
