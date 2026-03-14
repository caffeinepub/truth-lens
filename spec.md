# Truth-Lens

## Current State
- App has Internet Identity-based login (no username/password for users)
- No user registration page
- No dedicated user login page
- Admin login at `/admin/login` with username `KiranManvi@2023` / password `Kirankumar@2004`
- Homepage has a hero section, features grid, and CTA but no admin login link
- Header shows a single Login/Logout button using Internet Identity

## Requested Changes (Diff)

### Add
- `/login` page -- user login form (username + password stored in localStorage)
- `/register` page -- user registration form (username, password, full name)
- Admin Login button/link on the homepage (visible in the hero/CTA section)
- Header navigation: show `Login` and `Register` links for guests, `Logout` for logged-in users
- User auth context using localStorage to persist session

### Modify
- `Header.tsx` -- replace Internet Identity login with links to `/login` and `/register` for guests
- `LandingPage.tsx` -- add Admin Login button in the bottom CTA section
- `App.tsx` -- add routes for `/login` and `/register`
- `ScanDashboard.tsx` -- check local user auth instead of Internet Identity

### Remove
- Internet Identity login flow from the user-facing header/scan dashboard (admin still uses II indirectly via Motoko, but user-facing auth is now username/password)

## Implementation Plan
1. Create `src/frontend/src/utils/userAuth.ts` -- helpers for register/login/logout using localStorage
2. Create `src/frontend/src/pages/UserLoginPage.tsx` -- login form with username + password
3. Create `src/frontend/src/pages/UserRegisterPage.tsx` -- registration form with name, username, password
4. Update `Header.tsx` -- show Login/Register for guests, username + Logout for logged-in users
5. Update `LandingPage.tsx` -- add Admin Login link in CTA section
6. Update `App.tsx` -- add `/login` and `/register` routes
7. Update `ScanDashboard.tsx` -- use local user auth check
