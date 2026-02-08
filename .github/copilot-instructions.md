# Recallr Frontend - AI Coding Guidelines

## Project Overview

**Recallr** is a flashcard learning platform built with Next.js. The app allows users to create and review flashcard decks for spaced repetition learning. Key features include user authentication, deck management, and progress tracking.

- **Authentication**: Mock implementation using localStorage (not production-ready)
- **Route Structure**: Public routes in `(public)/`, protected routes in `(protected)/` with navigation
- **Data**: Currently uses mock data; future integration with backend API expected

## Architecture Overview

- **Framework**: Next.js 16 App Router with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables, shadcn/ui components using @base-ui/react primitives
- **Theming**: next-themes with light/dark/system modes, CSS custom properties for colors
- **Animations**: motion/react for interactive effects (e.g., 3D card flips in RecentDecksCard)
- **Package Manager**: pnpm with workspace configuration
- **Icons**: Lucide React icons

## Project Structure

- `app/`: Next.js App Router pages and layouts
  - `(public)/`: Unauthenticated routes (login)
  - `(protected)/`: Authenticated routes with Navigation component
- `components/`: Reusable React components
- `components/ui/`: shadcn/ui component library (auto-generated, style: "base-vega")
- `lib/`: Utility functions and shared code
- `hooks/`: Custom React hooks (e.g., useDebounce, useDebouncedHover)
- Path aliases: `@/*` maps to project root

## Component Patterns

- **Client Components**: Use `"use client"` directive for interactive components
- **UI Components**: Import from `@/components/ui/*`, built on @base-ui/react primitives
- **Button Component**: Does not support `asChild` prop. For links styled as buttons, use `Link` from `next/link` with button variant classes directly
- **DropdownMenu**: Uses `render` prop instead of `asChild` for trigger customization
- **Styling**: Use `cn()` utility from `@/lib/utils` for conditional class merging
- **Variants**: Define component variants with `class-variance-authority` (cva)
- **Data Attributes**: Use `data-slot` attributes for component identification (e.g., `data-slot="button"`)
- **Theme Integration**: Components automatically support light/dark themes via CSS variables
- **Animations**: Use motion/react for complex animations (e.g., `whileHover`, `initial` props)
- **Custom Hooks**: Use hooks from `@/hooks/*` for reusable logic (e.g., `useDebounce`, `useDebouncedHover`)

## Theming System

- **Provider**: `<ThemeProvider>` wraps app in `app/layout.tsx` with system theme detection
- **Toggle Component**: `ModeToggle` in `components/toggle-theme.tsx` provides light/dark/system options
- **CSS Variables**: All colors defined as CSS custom properties in `app/globals.css` using OKLCH color space
- **Dark Mode**: Uses Tailwind's `dark:` prefix and CSS `:is(.dark *)` selector

## Development Workflow

- **Start Dev Server**: `pnpm dev` (not `npm run dev`)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (ESLint with Next.js configs)
- **TypeScript**: Strict mode enabled, paths configured for `@/*` imports
- **Mock Authentication**: Login sets `localStorage.setItem("isAuthenticated", "true")` and redirects to `/home`

## Key Dependencies

- `@base-ui/react`: Headless UI primitives for shadcn components
- `class-variance-authority`: Type-safe component variants
- `next-themes`: Theme switching with system preference detection
- `motion/react`: Animation library for interactive effects
- `lucide-react`: Icon library
- `tailwind-merge`: Intelligent class merging

## Code Style Conventions

- **Imports**: Group React imports first, then external libraries, then internal imports
- **Component Props**: Use `React.ComponentProps<>` for extending primitive props
- **Accessibility**: Components include ARIA attributes and semantic HTML
- **Responsive Design**: Mobile-first with Tailwind responsive prefixes
- **Font Variables**: CSS custom properties for Geist and Inter fonts

## Example Patterns

```tsx
// Component with variants and theme support
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "bg-primary", outline: "border-border" } },
});

function Button({ variant, className, ...props }) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
```

```tsx
// Link styled as button (since Button doesn't support asChild)
import Link from "next/link";

<Link
  href="/path"
  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-2.5 transition-all hover:bg-primary/80"
>
  Click me
</Link>;
```

```tsx
// Animated component with motion/react
import { motion } from "motion/react";

<motion.div
  initial={{ rotateY: 0 }}
  whileHover={{ rotateY: 180 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  style={{ transformStyle: "preserve-3d" }}
>
  {/* Content */}
</motion.div>;
```

```tsx
// Debounced hover animation using custom hook
import { motion } from "motion/react";
import { useDebouncedHover } from "@/lib/hooks/useDebouncedHover";

function AnimatedCard() {
  const { debouncedHovered, onMouseEnter, onMouseLeave } =
    useDebouncedHover(100);

  return (
    <motion.div
      animate={{ rotateY: debouncedHovered ? 180 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Content */}
    </motion.div>
  );
}
```

```tsx
// Theme-aware component
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { setTheme } = useTheme();
  // Implementation uses next-themes API
}
```

```tsx
// Mock data pattern (temporary until backend integration)
const recentDecks = [
  {
    id: 1,
    name: "Spanish Vocabulary",
    lastReviewed: "2 hours ago",
    cards: 50,
    description: "Master essential Spanish words...",
  },
  // ... more decks
];
```

```

```
