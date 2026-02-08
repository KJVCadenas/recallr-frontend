# Recallr Frontend - AI Coding Guidelines

## Project Overview

**Recallr** is a flashcard learning platform built with Next.js. The app allows users to create and review flashcard decks for spaced repetition learning.

- **Authentication**: Mock implementation using localStorage (`isAuthenticated`, `userName`)
- **Route Structure**: Public routes in `(public)/` (login), protected routes in `(protected)/` with Navigation wrapper
- **Data Storage**: localStorage for decks (JSON serialized) and cards (keyed by `deck-{id}-cards`)
- **Status**: MVP with mock data; backend integration expected later

## Architecture Overview

- **Framework**: Next.js 16.1.6 App Router with React 19.2.3 and TypeScript 5 (strict mode)
- **UI**: Tailwind CSS v4 + shadcn/ui ("base-vega" style) on @base-ui/react primitives
- **Theming**: next-themes with light/dark/system modes; OKLCH color space CSS variables in `globals.css`
- **Animations**: motion/react v12 for 3D transforms and hover effects
- **Package Manager**: pnpm
- **Icons**: lucide-react

## Project Structure

````
app/
  layout.tsx - Root layout with ThemeProvider, fonts (Geist, Inter, Sans)
  globals.css - Tailwind config, theme variables (OKLCH color space), CSS imports
  (public)/login/ - LoginForm component, public route (no auth guard)
  (protected)/
    layout.tsx - Wraps children with Navigation, sets main height (calc(100vh-72px))
    home/ - RecentDecksCard grid, CreateDeckCard, displays `decks` from localStorage
    my-decks/ - (Empty - template for deck listing)
    create-deck/ - Form to create deck: name, description, card array (front/back)
components/ - Reusable components
  /ui - shadcn Components using @base-ui/react (base-vega style)
    button.tsx - Variants: default, outline, ghost, destructive, link, secondary; sizes: xs, sm, default, lg, icon
    card.tsx - Card, CardHeader, CardTitle, CardContent with data-slot attributes
    input.tsx, textarea.tsx, label.tsx - Form inputs
  /ui (continued)
    badge.tsx, select.tsx, combobox.tsx, dropdown-menu.tsx, alert-dialog.tsx, separator.tsx
  RecentDecksCard.tsx - Client component: motion 3D flip animation (rotateY), useDebouncedHover(100)
  DraftFlashCard.tsx - Form card for editing individual flashcards (front/back with Textarea)
  LoginForm.tsx - Login form: sets localStorage and redirects to /home
  Navigation.tsx - Static header with nav links (Home, My Decks, Profile, Settings)
  FloatingNavigationButtons.tsx - (Used in create-deck page)
  LogoutButton.tsx - Clears auth and decks from localStorage
lib/
  utils.ts - cn() utility: clsx + tailwind-merge for class composition
hooks/
  useDebounce.ts - Simple debounce hook
  useDebouncedHover.ts - Returns { debouncedHovered, onMouseEnter, onMouseLeave }
Path aliases: `@/*` maps to project root (tsconfig.json)

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

## Data Flow & Storage Patterns

**Authentication (localStorage-based mock)**
- Login: `LoginForm` → `handleSubmit` → sets `localStorage.isAuthenticated="true"`, `localStorage.userName=email` → `useRouter().push("/home")`
- Logout: `LogoutButton` → clears `isAuthenticated`, `userName`, and `decks` → redirects to `/login`
- Protected routes: No middleware guard; reliance on client-side cookies/localStorage check (to be replaced with real auth)

**Deck Storage (localStorage JSON)**
- Create: `CreateDeckPage` → `saveDeck()` → `JSON.stringify()` → `localStorage.setItem("decks", ...)`
- Structure: `{ id (Date.now()), name, description, cards (count), lastReviewed }`
- Read: `useEffect()` → `localStorage.getItem("decks")` → `JSON.parse()` → `setRecentDecks()`

**Card Storage (keyed by deckId)**
- Create: `localStorage.setItem(`deck-${newDeck.id}-cards`, JSON.stringify(cards))`
- Cards format: `{ front: string, back: string }[]`
- Retrieve: `localStorage.getItem(`deck-${deckId}-cards`)` (used in review/edit flows)

**Pattern**: All state hydration happens in `useEffect()` with dependency `[]` (one-time on mount, after client hydration)

## Critical Architecture Patterns

**Route Groups & Protected Routes**
- `(public)` and `(protected)` are route groups that do NOT enforce middleware validation
- Protected routes rely on client-side localStorage checks; add explicit page-level guards if needed
- Navigation layout for `(protected)/*` is 100vh with overflow handling

**3D Card Animations with motion/react**
- `RecentDecksCard` uses `motion.div` with `rotate` style `preserve-3d` and `backface-hidden` CSS classes
- Debounced hover state via custom `useDebouncedHover` hook prevents animation jank on rapid hover
- Pattern: `animate={{ rotateY: debouncedHovered ? 180 : 0 }}` with `transition={{ duration: 0.6 }}`

**Custom Hooks Pattern (useDebounce, useDebouncedHover)**
- `useDebounce` delays state updates by N milliseconds; used by `useDebouncedHover` for smooth animations
- Return objects expose handlers (`onMouseEnter`, `onMouseLeave`) and state (`debouncedHovered`)
- Hooks live in `@/hooks/*` and are imported by client components

**localStorage Hydration Pattern**
- Read localStorage only in `useEffect(() => { ... }, [])` to avoid hydration mismatches
- Server-side pages should not access localStorage directly; wrap in client-side `useEffect`
- Example: `const [recentDecks, setRecentDecks] = useState<Deck[]>([]); useEffect(() => { setRecentDecks(JSON.parse(localStorage.getItem("decks") || "[]")); }, [])`

**localStorage Keys**
- `isAuthenticated`: Boolean string ("true" / "false")
- `userName`: Email/username string
- `decks`: JSON array of deck metadata
- `deck-${deckId}-cards`: JSON array of { front, back } card objects for that deck

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

**Common Issues**:
- Auth guard missing: Protected routes don't validate `isAuthenticated`; browser back-navigation bypasses login
- Storage persistence: localStorage data sync issues across tabs (use storage events if multipage editing needed)
- Theme flickering: Resolved with `suppressHydrationWarning` in root `<html>` element

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
- **"use client" placement**: Only add when component uses hooks or interactivity; pages/layouts can be server components
- **Naming**: Hooks start with `use*` (e.g., `useDebouncedHover`); UI components capitalized exports

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
````

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
