# QUESTPAUSE Tools Release Checklist

Use this checklist before publishing any new QUESTPAUSE Tools update.

## 1. Start Clean

Commands:

git status
git pull origin main
git switch -c feature/your-upgrade-name

Work only from a clean main branch.

## 2. New Tool Page Checklist

For a new tool, update or create:

- src/pages/tools/.../NewToolPage.jsx
- src/features/tools/toolsRegistry.js
- src/App.jsx
- public/sitemap.xml
- PROJECTMAP.md

## 3. Route Checklist

In src/App.jsx:

- Add the tool page as a lazy import.
- Add a Route entry.
- Confirm the route matches the registry path.

## 4. Registry Checklist

In src/features/tools/toolsRegistry.js, confirm the tool has:

- id
- category
- title
- description
- path
- status
- tags
- isPopular
- image
- icon
- accentColor
- relatedToolIds

## 5. SEO Checklist

Every public page should call setSEO().

Confirm:

- Unique page title.
- Unique meta description.
- Correct page language.
- Useful intro/help content for search engines.

## 6. Sitemap Checklist

Update public/sitemap.xml.

Confirm every new live route is listed.

Tool routes normally use priority 0.8.

## 7. UI Checklist

Check:

- Mobile layout.
- Desktop layout.
- No horizontal overflow.
- Copy buttons work.
- Generated output is readable.
- Empty states are clear.
- No broken internal links.

## 8. Privacy and Monetization Checklist

Do not add without explicit decision:

- Analytics
- AdSense
- Tracking scripts
- Login
- Backend
- Payment flow

Current project rule:

- Tools stay free.
- Browser-based only.
- No backend.
- No analytics.
- No ads yet.

## 9. Verification

Before every commit or push, run:

npm run verify

For route, registry, sitemap, and related-tool checks only, run:

npm run audit:routes

This runs lint, route audit, and production build together.

Both must pass before pushing.

## 10. Commit Message Examples

Examples:

git commit -m "feat: add valheim event planner"
git commit -m "fix: correct minecraft command output"
git commit -m "docs: update project map"
git commit -m "chore: update release checklist"

## 11. After Release

Check:

- Vercel deployment succeeded.
- Public URL loads.
- New route works on refresh.
- Sitemap is accessible.
- Search Console can discover the new URL.
- PROJECTMAP.md reflects the new state.
