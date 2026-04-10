
<summary>Build an admin role system with inline edit buttons on school/job pages and a dedicated admin dashboard for bulk management.</summary>

## Plan: Admin Editing System

### How It Works

You'll be the only admin. When you're logged in, edit icons will appear on school profiles and job listings. You can click any section to edit it inline via a modal. You'll also get a full admin dashboard at `/admin` with tables for managing all schools and jobs.

### Implementation Steps

**1. Create admin role system**
- Create a `user_roles` table with your user ID assigned the `admin` role
- Create a `has_role()` security definer function to check roles without RLS recursion
- Add RLS policies on `schools` and `jobs` tables allowing admin users to INSERT, UPDATE, and DELETE

**2. Create admin hook**
- `useIsAdmin()` hook that checks the `user_roles` table for the current user
- Returns a boolean; used to conditionally show edit UI throughout the app

**3. Add inline editing to School Profile**
- When admin is logged in, a small pencil icon appears on each section (Overview, Fleet, Programs, Partnerships, Financing, etc.)
- Clicking opens a dialog/modal pre-filled with current data
- Each section gets its own edit modal with appropriate form fields (text inputs, toggles, number inputs for costs, checkboxes for partnerships)
- Saving writes directly to Supabase `schools` table and refreshes the query

**4. Add inline editing to School Cards (list page)**
- Quick-edit button on each card (visible to admin only) opens an edit modal

**5. Build Admin Dashboard (`/admin`)**
- Protected route (admin only)
- **Schools tab**: Searchable table of all schools with columns for name, state, Part type, cost range, status. Click a row to open a full edit form. "Add New School" button at top.
- **Jobs tab**: Same pattern — table of all jobs, click to edit, add new.
- Uses the same edit forms/modals as inline editing for consistency

**6. Add "Add New School" and "Add New Job" forms**
- Full-page forms accessible from the admin dashboard
- All fields from the schools/jobs schema grouped into logical sections (Basic Info, Location, Costs, Fleet, Partnerships, etc.)

### Technical Details

- **Role table migration**: `user_roles` table + `has_role()` function + RLS policy updates on `schools` and `jobs`
- **Admin assignment**: After you sign up, we'll insert your user ID into `user_roles` with role `admin`
- **No client-side role checks for security** — all write operations are protected by RLS policies that call `has_role()`
- **Edit modals** reuse existing shadcn Dialog, Form, Input, Select, Switch, and Textarea components
- **Route**: `/admin` wrapped in both `ProtectedRoute` and an `AdminRoute` guard

### File Changes

| File | Change |
|------|--------|
| Migration SQL | `user_roles` table, `has_role()`, RLS updates on schools/jobs |
| `src/hooks/useIsAdmin.ts` | New hook |
| `src/components/admin/AdminRoute.tsx` | Admin guard component |
| `src/components/admin/SchoolEditModal.tsx` | Inline edit modal for schools |
| `src/components/admin/JobEditModal.tsx` | Inline edit modal for jobs |
| `src/pages/Admin.tsx` | Admin dashboard with schools/jobs tables |
| `src/pages/AdminSchoolForm.tsx` | Full add/edit school form |
| `src/components/school-profile/SchoolHero.tsx` | Add edit button (admin only) |
| `src/components/school-profile/SchoolOverview.tsx` | Add edit button (admin only) |
| Other school-profile components | Add edit buttons |
| `src/App.tsx` | Add `/admin` route |
