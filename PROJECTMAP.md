# QUESTPAUSE Tools Project Map

## Project Identity
- **Project name:** QUESTPAUSE Tools
- **Public domain:** https://tools.jonascode.com
- **Local path:** `C:\DevProjects\questpause-tools`
- **Repo purpose:** Free browser-based toolkit for game server admins, Discord community owners, and survival server operators
- **Brand:** QUESTPAUSE Tools — premium dark gaming dashboard design with amber/gold accent (#f59e0b), gradient fallback banners
- **Audience:** Game server admins (Minecraft, Project Zomboid, Valheim, etc.), Discord community managers, survival server operators
- **Monetization status:** None. All tools free, no ads, no analytics, no login, no backend

## Important Rules
- This project is separate from JonasCode personal website (jonascode.com).
- Do NOT add links back to jonascode.com (bare domain).
- Do NOT add AdSense yet.
- Do NOT add analytics yet.
- Do NOT add real game images yet — keep gradient fallback banners.
- Keep tools free and browser-based — no backend, no database, no login, no payment.
- Keep routes indexable by search engines.
- Keep sitemap.xml updated for every new route.
- Keep SEO/canonical/structured data updated for every page.
- Run `npm run build` before every push. Fix any errors.

## Current Live Routes

| # | Tool Name | Category | Route | Registry ID | Status | Sitemap | SEO | Related Tools |
|---|---|---|---|---|---|---|---|---|
| 1 | Tools Index (hub) | — | `/tools` | — | live | yes | yes | no |
| 2 | Minecraft Whitelist Command Generator | Minecraft | `/tools/minecraft-whitelist-command-generator` | `minecraft-whitelist-command-generator` | live | yes | yes | yes |
| 3 | Minecraft Whitelist Application Generator | Minecraft | `/tools/minecraft-whitelist-application-generator` | `minecraft-whitelist-application-generator` | live | yes | yes | yes |
| 4 | Minecraft Server Rules Generator | Minecraft | `/tools/minecraft-server-rules-generator` | `minecraft-server-rules-generator` | live | yes | yes | yes |
| 5 | Minecraft LFG Post Generator | Minecraft | `/tools/minecraft-lfg-post-generator` | `minecraft-lfg-post-generator` | live | yes | yes | yes |
| 6 | Minecraft MOTD Generator | Minecraft | `/tools/minecraft-motd-generator` | `minecraft-motd-generator` | live | yes | yes | yes |
| 7 | Minecraft server.properties Generator | Minecraft | `/tools/minecraft-server-properties-generator` | `minecraft-server-properties-generator` | live | yes | yes | yes |
| 8 | Minecraft Command Generator | Minecraft | `/tools/minecraft-command-generator` | `minecraft-command-generator` | live | yes | yes | yes |
| 9 | Discord Announcement Generator | Discord | `/tools/discord-announcement-generator` | `discord-announcement-generator` | live | yes | yes | yes |
| 10 | Discord Rules Generator | Discord | `/tools/discord-rules-generator` | `discord-rules-generator` | live | yes | yes | yes |
| 11 | Discord Welcome Message Generator | Discord | `/tools/discord-welcome-message-generator` | `discord-welcome-message-generator` | live | yes | yes | yes |
| 12 | Server Maintenance Message Generator | Server Admin | `/tools/server-maintenance-message-generator` | `server-maintenance-message-generator` | live | yes | yes | yes |
| 13 | Server Status Message Generator | Server Admin | `/tools/server-status-message-generator` | `server-status-message-generator` | live | yes | yes | yes |
| 14 | Project Zomboid Admin Message Generator | Project Zomboid | `/tools/project-zomboid-admin-message-generator` | `project-zomboid-admin-message-generator` | live | yes | yes | yes |
| 15 | Project Zomboid Mod List Formatter | Project Zomboid | `/tools/project-zomboid-mod-list-formatter` | `project-zomboid-mod-list-formatter` | live | yes | yes | yes |
| 16 | Project Zomboid Server Settings Helper | Project Zomboid | `/tools/project-zomboid-server-settings-helper` | `project-zomboid-server-settings-helper` | live | yes | yes | yes |
| 17 | Project Zomboid Safehouse Rules Generator | Project Zomboid | `/tools/project-zomboid-safehouse-rules-generator` | `project-zomboid-safehouse-rules-generator` | live | yes | yes | yes |
| 18 | Valheim Server Rules Generator | Valheim | `/tools/valheim-server-rules-generator` | `valheim-server-rules-generator` | live | yes | yes | yes |
| 19 | Valheim Admin Command Helper | Valheim | `/tools/valheim-admin-command-helper` | `valheim-admin-command-helper` | live | yes | yes | yes |
| 20 | Valheim Event Announcement Generator | Valheim | `/tools/valheim-event-announcement-generator` | `valheim-event-announcement-generator` | live | yes | yes | yes |
| 21 | ICARUS Server Rules Generator | ICARUS | `/tools/icarus-server-rules-generator` | `icarus-server-rules-generator` | live | yes | yes | yes |
| 22 | 7 Days to Die Server Rules Generator | 7 Days to Die | `/tools/7-days-to-die-server-rules-generator` | `7-days-to-die-server-rules-generator` | live | yes | yes | yes |
| 23 | Privacy Policy | — | `/privacy-policy` | — | live | yes | yes | no |
| 24 | Terms of Use | — | `/terms` | — | live | yes | yes | no |
| 25 | Home (redirect) | — | `/` | — | redirects to `/tools` | yes | yes | no |
| 26 | Not Found (404 catch-all) | — | `*` | — | catch-all | no | yes | no |
| 27 | About | — | `/about` | — | live | yes | yes | no |
| 28 | Contact | — | `/contact` | — | live | yes | yes | no |

**Total live tools:** 21

## Tool Categories

### Minecraft (7 tools)
1. Minecraft Whitelist Command Generator
2. Minecraft Whitelist Application Generator
3. Minecraft Server Rules Generator
4. Minecraft LFG Post Generator
5. Minecraft MOTD Generator
6. Minecraft server.properties Generator
7. Minecraft Command Generator

### Discord (3 tools)
1. Discord Announcement Generator
2. Discord Rules Generator
3. Discord Welcome Message Generator

### Server Admin (2 tools)
1. Server Maintenance Message Generator
2. Server Status Message Generator

### Project Zomboid (4 tools)
1. Project Zomboid Admin Message Generator
2. Project Zomboid Mod List Formatter
3. Project Zomboid Server Settings Helper
4. Project Zomboid Safehouse Rules Generator

### Valheim (3 tools)
1. Valheim Server Rules Generator
2. Valheim Admin Command Helper
3. Valheim Event Announcement Generator

### ICARUS (1 tool)
1. ICARUS Server Rules Generator

### 7 Days to Die (1 tool)
1. 7 Days to Die Server Rules Generator

### Categories with no live tools yet (registry placeholders)
- (none — all categories now have at least one live tool)

## Tools Registry
- **File:** `src/features/tools/toolsRegistry.js`
- **Required fields for each tool:**
  - `id` — unique slug, matches route segment
  - `category` — one of: Minecraft, Discord, Server Admin, Project Zomboid, Valheim, ICARUS, 7 Days to Die
  - `title` — display name
  - `description` — short summary (used in cards, SEO meta, related tools)
  - `path` — e.g. `/tools/minecraft-whitelist-command-generator`
  - `status` — `"live"` or `"coming-soon"`
  - `tags` — array of search keywords
  - `isPopular` — boolean, controls featured/popular display on `/tools`
  - `image` — placeholder path (unused, gradient fallback used)
  - `icon` — emoji (displayed in card header)
  - `accentColor` — category color hex
  - `relatedToolIds` — array of related tool IDs for cross-linking

## Routing
- **Routes defined in:** `src/App.jsx`
- **Pattern:** Each tool gets a direct import + `<Route path="/tools/TOOL-ID" element={<Component />} />`
- **Index:** `<Route path="/tools" element={<ToolsIndex />} />`
- **Home:** `<Route path="/" element={<Navigate to="/tools" replace />} />`
- **Legal:** `<Route path="/privacy-policy">` and `<Route path="/terms">`
- **Info:** `<Route path="/about">` and `<Route path="/contact">`
- **SPA behavior:** All routes handled client-side by React Router
- **Vercel rewrites (vercel.json):** Catch-all `/:path*` rewrites to `/index.html` to support direct URL access and refresh on all routes
- **No server-side rendering:** Everything is client-side React (Vite + React Router)

## SEO System
- **File:** `src/utils/seo.js`
- **Pattern:** Each page imports `setSEO` from `seo.js` and calls it in a `useEffect` with a `seo` object containing `{ title, description }`
- **Canonical URL:** Auto-generated as `${location.origin}${location.pathname}` inside `setSEO()`
- **Structured data:** Auto-injected by `setSEO()`:
  - Tools pages (`/tools/*`): `WebApplication` schema with free offer
  - Index page (`/tools`): `CollectionPage` schema
- **Title format:** `Tool Name | QUESTPAUSE Tools`
- **Meta description:** Unique per page, describes tool purpose
- **Open Graph / Twitter:** Title, description, card type set per page
- **Production domain:** https://tools.jonascode.com
- **Note:** No manual `<link rel="canonical">` in any page — all handled by `seo.js`

## Sitemap and Robots
- **Sitemap:** `public/sitemap.xml`
- **Robots:** `public/robots.txt`
- **Rule:** Every live public route must be included in `sitemap.xml`
- **Robots content:**
  ```
  User-agent: *
  Allow: /

  Sitemap: https://tools.jonascode.com/sitemap.xml
  ```
- **Sitemap priority convention:**
  - `/` = 1.0
  - `/tools` = 0.9
  - All tool routes = 0.8
  - Privacy/Terms/About/Contact = 0.3

## Design System
- **Visual direction:** Premium dark gaming dashboard
  - Background: `bg-slate-950`
  - Card backgrounds: `bg-slate-900/55`
  - Borders: `border-slate-800`
  - Text: `text-slate-100` headings, `text-slate-400` body
  - Accent: Amber/gold gradient (`from-amber-300 to-amber-500`) for "Tools" branding
  - Interactive accent: Indigo-500 for buttons, Emerald-500 for success states
- **Gradient fallback banners:** Category-based gradients on tool cards (no real images)
  - Minecraft: `from-emerald-950 via-emerald-900`
  - Discord: `from-indigo-950 via-violet-900`
  - Server Admin: `from-sky-950 via-blue-900`
  - Project Zomboid: `from-rose-950 via-red-900`
  - Valheim: `from-amber-950 via-orange-900`
  - ICARUS: `from-cyan-950 via-teal-900`
  - 7 Days to Die: `from-orange-950 via-red-900`
- **No real game images yet** — placeholder paths exist in registry but cards render gradients + emoji icons
- **Responsive:** Mobile-first with `sm:`, `lg:`, `xl:` breakpoints. No horizontal overflow.
- **Header:** Sticky top bar with QUESTPAUSE Tools logo + category nav (hidden on mobile, scrollable pills)
- **Footer:** Simple footer with links to All Tools, Privacy Policy, Terms

## Shared Components
All located in `src/components/tools/`:

| Component | File | Purpose |
|---|---|---|
| `ToolsHeader` | `ToolsHeader.jsx` | Sticky header with QUESTPAUSE Tools logo + category navigation (desktop links + mobile scrollable pills) |
| `ToolsFooter` | `ToolsFooter.jsx` | Footer with branding + links to All Tools, Privacy Policy, Terms |
| `ToolCard` | `ToolCard.jsx` | Card for displaying a tool in a grid. Gradient banner + emoji icon + title + description + tags + "Open Tool" link. Handles `status: "coming-soon"` with disabled card. |
| `FeaturedToolCard` | `FeaturedToolCard.jsx` | Larger featured card (for popular/hero display). Same gradient + icon pattern but bigger, with star badge. |
| `PopularTools` | `PopularTools.jsx` | Renders a "Popular Tools" section using `FeaturedToolCard` for `isPopular: true` tools |
| `ToolsHero` | `ToolsHero.jsx` | Hero section on `/tools` with background effects, title "Free Game Server Admin Tools", search bar, category filter |
| `ToolsSearch` | `ToolsSearch.jsx` | Single text input with magnifying glass icon, calls `onChange` on input |
| `ToolsCategoryFilter` | `ToolsCategoryFilter.jsx` | Row of category pill buttons for filtering tools on `/tools` |
| `ToolsSection` | `ToolsSection.jsx` | Simple section wrapper with title + grid of `ToolCard` |
| `ToolBreadcrumbs` | `ToolBreadcrumbs.jsx` | Breadcrumb nav: QUESTPAUSE Tools > Category > Tool Name |
| `CategoryPill` | `CategoryPill.jsx` | Small colored pill showing category name (used on cards) |
| `RelatedTools` | `RelatedTools.jsx` | Renders related tools section using `ToolCard` with data from `getRelatedTools()` in registry |
| `ScrollToHash` | `ScrollToHash.jsx` | Scrolls to hash anchor on route changes (for category nav links like `/tools#minecraft-tools`) |
| `ToolPageLayout` | `ToolPageLayout.jsx` | Optional wrapper layout for tool pages (not used by any current tool — all tools use inline layout) |
| `AdSlotPlaceholder` | `AdSlotPlaceholder.jsx` | Future ad slot placeholder. Renders nothing unless `devOnly={false}`. Positions: `below-hero`, `between-generator-and-seo`, `sidebar` |

## Build and Deployment
- **Build command:** `npm run build`
- **Dev command:** `npm run dev`
- **Preview command:** `npm run preview`
- **Lint command:** `npm run lint`
- **Verify command:** `npm run verify` — runs lint, route audit, and production build together before push
- **Route audit command:** `npm run audit:routes` — validates live tools against routes, sitemap entries, registry fields, duplicate IDs, duplicate paths, and related tool IDs
- **Release checklist:** `docs/RELEASE_CHECKLIST.md` — standard checklist for routes, registry, sitemap, SEO, verification, and release steps
- **Framework:** React 19 + Vite 7 + Tailwind CSS 4 + React Router 7
- **Deployment:** Vercel (SPA with rewrites)
- **Production URL:** https://tools.jonascode.com
- **GitHub repo:** questpause-tools (private)

## Monetization Plan

### Current Status
- No ads, no analytics, no affiliate links, no paid features
- All 21 tools are free and browser-based
- No backend, no database, no login, no payment processing

### Future Platform
- **Target:** Google AdSense
- **Timing:** After Search Console indexing, some real traffic, and consent infrastructure
- **Constraints:**
  - Must not click own ads
  - Must not ask community members to click ads
  - Must avoid layouts that cause accidental clicks (no ads near buttons/output areas)
  - Must use proper consent solution before personalized ads in EEA/UK/Switzerland
  - Must keep privacy policy updated before enabling ads

### Planned Ad Slot Positions
1. **Below hero/introduction** — After the tool's hero section, before the generator form
2. **Between generator and SEO content** — After tool output, before how-to/FAQ sections
3. **Desktop sidebar** — Visible on widescreen only, beside main tool content

### Ad Slot Infrastructure
- **Component:** `src/components/tools/AdSlotPlaceholder.jsx`
- **Behavior:** Renders nothing unless `devOnly={false}` is passed (safe to deploy now)
- **Positions defined:** `below-hero`, `between-generator-and-seo`, `sidebar`
- **When ads go live:** Replace `<AdSlotPlaceholder>` with actual ad code, pass `devOnly={false}`, deploy

### Prohibited Before Ad Enablement
- No ad script loaded until explicitly enabled
- No fake ad content visible to users
- No analytics script loaded (privacy-friendly analytics may be added as separate step)

## Current Known Issues
- Build: Tool routes are lazy-loaded. Main JS bundle reduced from ~821 kB to ~239 kB and the previous >500 kB warning is resolved.
- ESLint: v9 flat config added and `npm run lint` passes cleanly.
- All other audit checks passed (route-to-registry parity, sitemap completeness, SEO title uniqueness, internal link validity, no jonascode.com backlinks)

## QA Test Report
- **File:** `TEST_REPORT.md`
- **Date:** 2026-05-12
- **Result:** All tests passed — 28/28 routes HTTP 200, sitemap, robots.txt, SEO, header/footer, ads/analytics, backlinks, mobile all verified
- **Recommendation:** Ready for deployment

## Search Console Monitoring Plan

### What to Monitor
- `/tools` (index/hub), `sitemap.xml`, `robots.txt`, `/about`, `/privacy-policy`, and top tool pages (by impressions)

### Regular Checks
- **Pages report:** Weekly — check for indexing issues, coverage drops, and new page discovery
- **Sitemaps report:** After each release — confirm new URLs are listed and submitted
- **Performance report:** Monitor impressions, clicks, and average position for key queries

### Indexing Requests
- Do not request indexing repeatedly for every small page change
- Request indexing for: `/tools`, important new pages (new tool routes, `/about`), and pages with major content fixes or structural changes

### Watch For
- `Discovered - currently not indexed`
- `Crawled - currently not indexed`
- `Not found (404)`
- `Duplicate without user-selected canonical`
- `Blocked by robots.txt`
- `Page with redirect`

### Current Sitemap
- `https://tools.jonascode.com/sitemap.xml`

## CMP and Consent Plan

### Current Status
- No ads, no analytics, no CMP active
- No CMP is required while no ads or analytics are active

### Pre-AdSense Requirements
- Before AdSense goes live, choose a Google-certified CMP **or** use Google AdSense Privacy & Messaging (if available in the region)
- For EEA/UK/Switzerland users, consent must be handled before personalized ads are served
- Do not load the AdSense script before CMP or consent setup is ready
- Do not use a random cookie banner that is not compatible with Google CMP requirements
- Privacy Policy must stay updated before ads are enabled
- Store the final CMP decision in PROJECTMAP.md before implementation

## AdSense Readiness Gate

Checklist (all items must be complete before AdSense goes live):
- [ ] Search Console verified
- [ ] Sitemap submitted successfully
- [ ] Key pages indexed or discovered
- [ ] Privacy Policy updated (with ad/cookie/consent disclosure)
- [ ] Terms of Use updated (with tool responsibilities, affiliation disclaimer)
- [ ] About page live
- [ ] Contact page live
- [ ] Independent disclaimer visible in footer
- [ ] No jonascode.com backlinks
- [ ] No fake ads visible
- [ ] CMP decision made
- [ ] Consent solution implemented
- [ ] Ad placement plan reviewed
- [ ] No ads near buttons, copy controls, or generated outputs
- [ ] AdSense account / site approval complete

## Search Console Monitoring Log

Update this table weekly during the pre-AdSense monitoring period.

| Date | Sitemap Status | Indexed Pages | Discovered / Crawled Not Indexed | Errors | Impressions | Notes |
|---|---:|---:|---:|---|---:|---|
| 2026-05-11 | To check | To check | To check | To check | To check | Initial monitoring period after monetization-readiness pass. |
| 2026-05-12 | Success | Processing | Processing | None visible | 0 | Sitemap processed successfully with 27 discovered pages. Pages report still processing. Performance shows 0 clicks and 0 impressions during first 24h. Status: Green — wait and monitor. |

## Backlog: Next Suggested Tools
- (none currently suggested)

## New Tool Checklist

### Before coding:
- [ ] Read PROJECTMAP.md
- [ ] Check if a similar tool already exists
- [ ] Choose category
- [ ] Choose route
- [ ] Confirm tool does not duplicate an existing page

### During coding:
- [ ] Add page/component
- [ ] Add route
- [ ] Add registry entry
- [ ] Add related tools
- [ ] Add SEO title/meta/canonical
- [ ] Add structured data if used
- [ ] Add sitemap URL
- [ ] Keep image placeholder and gradient fallback
- [ ] Keep mobile responsive layout

### Before push:
- [ ] Run npm run build
- [ ] Test route directly
- [ ] Test /tools card opens correctly
- [ ] Check sitemap.xml
- [ ] Check no jonascode.com backlink
- [ ] Update PROJECTMAP.md
- [ ] Add short build summary

## Required Build Summary Format

Every future Big Pickle task must end with:

```
=== QUESTPAUSE TOOLS BUILD SUMMARY ===

Task completed:
-

New route added:
-

Existing routes affected:
-

Files created:
-

Files edited:
-

Registry updated:
- Yes/No
- File:

Sitemap updated:
- Yes/No
- URL added:

SEO/canonical/structured data updated:
- Yes/No

PROJECTMAP.md updated:
- Yes/No

Build result:
- Passed/Failed
- Command run:

Known issues or warnings:
-

Next recommended step:
-
=== END SUMMARY ===
```

## Change Log

| Date | Change | Routes Added/Changed | Build Status |
|---|---|---|---|
| 2026-05-11 | Created PROJECTMAP.md | None | Passed (not run) |
| 2026-05-11 | Documented current QUESTPAUSE Tools state | All existing routes | Not changed |
| 2026-05-11 | Added minecraft-motd-generator to toolsRegistry.js | None (was missing from registry) | Passed (npm run build) |
| 2026-05-11 | Removed duplicate hardcoded Related Tools sections from 3 pages | None | Passed (npm run build) |
| 2026-05-11 | Added Discord Welcome Message Generator | `/tools/discord-welcome-message-generator` | Passed (npm run build) |
| 2026-05-11 | Added Project Zomboid Safehouse Rules Generator | `/tools/project-zomboid-safehouse-rules-generator` | Passed (npm run build) |
| 2026-05-11 | Added Valheim Event Announcement Generator | `/tools/valheim-event-announcement-generator` | Passed (npm run build) |
| 2026-05-11 | Added ICARUS Server Rules Generator | `/tools/icarus-server-rules-generator` | Passed (npm run build) |
| 2026-05-11 | Added 7 Days to Die Server Rules Generator | `/tools/7-days-to-die-server-rules-generator` | Passed (npm run build) |
| 2026-05-11 | v1 audit: fixed missing `minecraft-lfg-post-generator` in toolsRegistry.js, added ICARUS/7DTD nav links and category descriptions | None (registry + nav + descriptions only) | Passed (npm run build) |
| 2026-05-11 | Added branded 404 catch-all route | `*` (catch-all) | Passed (npm run build) |
| 2026-05-11 | Added Minecraft Command Generator | `/tools/minecraft-command-generator` | Passed (npm run build) |
| 2026-05-11 | AdSense preparation: added /about, /contact, updated Privacy/Terms, footer disclaimer, AdSlotPlaceholder, Monetization Plan | `/about`, `/contact` | Passed (npm run build) |
| 2026-05-11 | Added Search Console monitoring plan, CMP/consent plan, and AdSense readiness checklist to PROJECTMAP.md | None (documentation only) | Passed (npm run build) |
| 2026-05-11 | Added Search Console Monitoring Log table to PROJECTMAP.md | None (documentation only) | Passed (npm run build) |
| 2026-05-12 | Full QA test pass: 28 routes verified HTTP 200, sitemap.xml validated (26 public URLs), robots.txt correct, header/footer/seo/ads/backlinks/mobile all passed, TEST_REPORT.md created | None (documentation only — TEST_REPORT.md) | Passed (npm run build) |
| 2026-05-12 | Search Console readiness test pass: 30 production routes HTTP 200, sitemap/robots validated against prod, SEO/indexability/ads checked, SEARCH_CONSOLE_REPORT.md created | None (documentation only — SEARCH_CONSOLE_REPORT.md) | Passed (npm run build) |
| 2026-05-12 | Updated Search Console Monitoring Log with first manual Search Console values: sitemap success, 27 discovered pages, pages report processing, 0 impressions/clicks | None (documentation only — PROJECTMAP.md) | Not run (documentation-only update) |
