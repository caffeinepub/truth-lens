# Truth-Lens

## Current State
Fresh rebuild — no existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Full Truth-Lens AI-powered phishing/fraud detection web app
- Motoko backend with on-chain storage: user profiles, scan results (url, verdict, trust score, scan date), admin records, site config
- Phishing detection logic ported from Python: IP-based URL detection (-40), phishing keywords (-10 each: login, verify, update, secure, bank), long URL >75 chars (-20), trust score 0-100, verdict: Safe (70+), Suspicious (40-69), Phishing (<40)
- Authorization with role-based access control (admin/user/guest)
- Backend functions: scanUrlOrText, getCallerUserProfile, saveCallerUserProfile, getAllScanResults, deleteScanResult, listUsers, banUser, removeUser, saveConfigValue, readConfigValue, adminLogin, adminLogout
- Frontend pages: LandingPage (with tabs: Features, Scanner, How It Works, About), ScanDashboard, ResultsPage, UserLoginPage (/login), UserRegisterPage (/register), UserProfilePage (/profile), AdminLoginPage (/admin/login), AdminDashboard (/admin/dashboard)
- Admin credentials hardcoded: username KiranManvi@2023, password Kirankumar@2004
- After user login/register, redirect to /profile
- Homepage shows Admin Dashboard link/button
- Header: guests see Login + Register; logged-in users see Logout
- Cybersecurity dark theme: dark matrix/circuit board background, glowing cyan neon accents, consistent across all pages
- Custom logo (large, prominent), hero banner, feature icons
- Feature cards with expandable details on click
- Admin Dashboard: stats cards, user management (search, ban, remove), submission moderation (bulk delete, CSV export, verdict filter, edit verdict/trust score), site configuration, analytics tab with charts, audit log tab
- Multi-API scan results display (Google Safe Browsing, VirusTotal, PhishTank — simulated)

### Modify
- N/A (fresh build)

### Remove
- N/A

## Implementation Plan
1. Select components: authorization, blob-storage, http-outcalls
2. Generate Motoko backend with all scan, user, and admin functions
3. Generate cybersecurity images: logo, hero-bg, feature icons, background texture
4. Build all frontend pages and components with consistent cybersecurity theme
5. Wire backend API to frontend via hooks
6. Deploy
