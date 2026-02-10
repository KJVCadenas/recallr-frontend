# My Profile Page Implementation Plan

## Overview
This document outlines the implementation plan for completing the My Profile page in the Recallr frontend application. The feature allows authenticated users to view their email, set/update a username, and change their password after verifying their current password. The implementation follows the existing architecture: file-based JSON storage, JWT authentication, Next.js App Router, and shadcn/ui components.

## Architecture Context
- **Backend**: API routes in `app/api/`, controllers/services in `lib/api/`, file storage in `data/`.
- **Frontend**: Client components in `app/(protected)/`, hooks in `hooks/`, UI components in `components/ui/`.
- **Authentication**: JWT-based with cookie storage, protected routes via middleware.
- **Data Storage**: JSON files managed by `FileStorageService`.
- **Validation**: Zod schemas for input validation.
- **UI**: Tailwind CSS + shadcn/ui on @base-ui/react.

## Backend Implementation

### 1. Update User Data Model
**File**: `lib/api/models/types.ts`
- Add `username?: string` to the `User` interface.
- Rationale: Username is optional to avoid breaking existing users; can be set/updated later.

**Changes**:
```typescript
export interface User {
  id: string;
  email: string;
  username?: string; // Optional username field
  password: string; // hashed
  createdAt: string;
}
```

### 2. Add Profile Validation Schemas
**File**: `lib/api/models/schemas.ts`
- Add `profileUpdateSchema` for username and password changes.
- Include validation for password confirmation and current password verification.
- Export inferred types.

**Changes**:
```typescript
export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
```

### 3. Enhance Auth Service
**File**: `lib/api/services/authService.ts`
- Update `createUser` to accept optional username.
- Add `updateUserProfile` method to handle username updates and password changes (with current password verification).
- Ensure username uniqueness (check against existing users to prevent duplicates).
- Use existing `hashPassword` and `verifyPassword` methods.

**Key Methods**:
- `updateUserProfile(userId: string, updates: ProfileUpdateInput): Promise<User>`
  - Fetch user by ID.
  - If updating password, verify current password.
  - Hash new password if provided.
  - Update username if provided (check uniqueness).
  - Save to storage.

### 4. Add Profile API Routes
**Files**: `app/api/auth/profile/route.ts` (GET and PUT)
- **GET**: Fetch current user's profile (id, email, username).
- **PUT**: Update profile using `profileUpdateSchema`.
- Use `authMiddleware` to ensure authenticated requests.
- Return updated user data on success.

**Route Structure**:
- `GET /api/auth/profile`: Returns `{ id, email, username }`
- `PUT /api/auth/profile`: Accepts `ProfileUpdateInput`, returns updated user.

**Error Handling**: Consistent with existing API (400 for validation, 401 for auth, 500 for server errors).

## Frontend Implementation

### 5. Create Profile Page Component
**File**: `app/(protected)/profile/page.tsx`
- Client component (`"use client"`).
- Fetch user profile on load using a new hook or direct fetch.
- Form with fields: Email (read-only display), Username (input), Password Change section (current, new, confirm).
- Use `useForm` from react-hook-form + Zod resolver for validation.
- Submit to PUT `/api/auth/profile`.
- Show success/error messages.

**UI Components**:
- `Card` for layout.
- `Input`, `Textarea` (if needed), `Button` for form.
- `AlertDialog` for confirmations if needed.
- Follow existing patterns (e.g., `cn()` for classes).

**State Management**: Use SWR or a custom hook for profile data fetching/updates.

### 6. Add Profile Fetch/Update Hook
**File**: `hooks/useProfile.ts`
- `useProfile`: Query for fetching profile data.
- `useUpdateProfile`: Mutation for updating profile.
- Integrate with existing query client (if using TanStack Query).
- Use native form handling with Zod validation on the client-side, following existing patterns in the codebase (e.g., similar to `LoginForm.tsx`).

### 7. Update Navigation (if needed)
**File**: `components/Navigation.tsx`
- Ensure "Profile" link routes to `/profile`.
- No changes likely needed if the route is added.

## Dependencies and Testing
- **Dependencies**: No new packages needed; leverages existing (zod, bcryptjs, etc.).
- **Testing**: 
  - Backend: Unit tests for service methods (if test setup exists).
  - Frontend: Manual testing for form submission and API integration.
  - Validate password change flow and username updates.
- **Edge Cases**: Handle optional username, password mismatch, invalid current password, unique username conflicts.

## Rollout and Migration
- Existing users: Username will be undefined; they can set it on the profile page.
- Data Migration: No migration needed since adding optional field.
- Deployment: Standard build/test/deploy process.

## Additional Considerations and Edge Cases
- **Username Uniqueness**: Enforced in `updateUserProfile` to prevent conflicts; return appropriate error if username is taken.
- **Password Change Security**: After password update, JWT remains valid until expiry; no forced logout, but consider user education.
- **Form Handling**: Use native forms with client-side Zod validation, state management via React hooks, and error display (e.g., via `useState` for messages).
- **Loading and Error States**: Implement loading indicators and error messages in the UI for better UX.
- **Accessibility**: Ensure form fields have proper labels, ARIA attributes, and keyboard navigation, following shadcn/ui patterns.
- **Session Handling**: Profile updates don't affect active sessions; if password changes, inform user to re-login if needed.
- **Data Consistency**: Ensure file storage updates are atomic; handle concurrent updates if possible (though file-based storage limits this).
- **Testing Edge Cases**: Test with invalid inputs, network errors, duplicate usernames, password mismatches, and empty optional fields.

This plan ensures a clean, maintainable implementation aligned with the codebase's patterns.