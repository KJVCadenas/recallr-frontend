# Recallr Frontend - AI Coding Guidelines

## Architecture Overview

- **Framework**: Next.js 16 App Router with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables, shadcn/ui components using @base-ui/react primitives
- **Theming**: next-themes with light/dark/system modes, CSS custom properties for colors
- **Package Manager**: pnpm with workspace configuration
- **Icons**: Lucide React icons

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable React components
- `components/ui/`: shadcn/ui component library (auto-generated)
- `lib/`: Utility functions and shared code
- Path aliases: `@/*` maps to project root

## Component Patterns

- **Client Components**: Use `"use client"` directive for interactive components
- **UI Components**: Import from `@/components/ui/*`, built on @base-ui/react primitives
- **Button Component**: Does not support `asChild` prop. For links styled as buttons, use `Link` from `next/link` with button variant classes directly
- **Styling**: Use `cn()` utility from `@/lib/utils` for conditional class merging
- **Variants**: Define component variants with `class-variance-authority` (cva)
- **Data Attributes**: Use `data-slot` attributes for component identification (e.g., `data-slot="button"`)
- **Theme Integration**: Components automatically support light/dark themes via CSS variables

## Theming System

- **Provider**: `<ThemeProvider>` wraps app in `app/layout.tsx` with system theme detection
- **Toggle Component**: `ModeToggle` in `components/toggle-theme.tsx` provides light/dark/system options
- **CSS Variables**: All colors defined as CSS custom properties in `app/globals.css`
- **Dark Mode**: Uses Tailwind's `dark:` prefix and CSS `:is(.dark *)` selector

## Development Workflow

- **Start Dev Server**: `pnpm dev` (not `npm run dev`)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (ESLint with Next.js configs)
- **TypeScript**: Strict mode enabled, paths configured for `@/*` imports

## Key Dependencies

- `@base-ui/react`: Headless UI primitives for shadcn components
- `class-variance-authority`: Type-safe component variants
- `next-themes`: Theme switching with system preference detection
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
// Theme-aware component
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { setTheme } = useTheme();
  // Implementation uses next-themes API
}
```

```

```
