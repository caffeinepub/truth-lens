# Specification

## Summary
**Goal:** Remove all third-party watermarks/branding from the Truth-Lens UI and add a full admin panel with user management, submission moderation, and site configuration.

**Planned changes:**
- Remove all Caffeine branding, logos, and watermarks from every UI surface (landing page, scan dashboard, results page, header, footer)
- Footer updated to display only Truth-Lens copyright and tagline
- Add backend admin-only functions: `getAllUsers`, `banUser`, `deleteUser`, `getAllSubmissions`, `deleteSubmission`, `getSiteConfig`, `setSiteConfig` — all enforcing role-based access control
- Persist site configuration in stable storage
- Build an admin dashboard UI (accessible only to admin users) with three tabs:
  - **User Management**: sortable table of users with name, principal ID, scan count, ban/delete actions
  - **Submission Moderation**: table of all scan submissions with verdict badges, confidence scores, timestamps, and delete action
  - **Site Configuration**: form to edit and save config values (e.g., max scans per user, feature toggles)
- Update admin login page with a clear "Admin Access" heading, an "Access Denied" message with logout/retry option for non-admin users, and redirect to dashboard on successful login
- Non-admin users are redirected away from the admin dashboard
- Admin dashboard matches the existing cyberpunk/dark theme

**User-visible outcome:** The app no longer shows any Caffeine branding. Admin users can log in to a dedicated dashboard to manage users, moderate scan submissions, and configure site settings, while non-admin users are blocked from accessing admin pages.
