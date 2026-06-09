# Microsoft SSO via Auth.js — Design Spec

**Date:** 2026-06-09
**Status:** Approved, implementing

## Goal

Install Auth.js (NextAuth) professionally in this Next.js 16 App Router project so a user can "Sign in with Microsoft," view their profile on a protected page, and sign out. Minimal, production-shaped, YAGNI.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Library | NextAuth v5 / Auth.js | Official App-Router-native auth (`auth()`, `signIn`, `signOut`, route handlers). This is "install auth.js." |
| Session strategy | JWT (stateless) | No database in scope. Profile data carried in the encrypted JWT cookie. |
| Provider | Microsoft Entra ID | `next-auth/providers/microsoft-entra-id`. |
| Audience | Any Microsoft account | Authority = `common` (work/school **and** personal). App registration must use "Accounts in any org directory and personal Microsoft accounts." |
| Route protection | `proxy.ts` (Node.js runtime) | This Next.js version renames `middleware.ts` → `proxy.ts` and runs it on Node, so the full `auth` wrapper works without the Edge-runtime split-config workaround standard v5 tutorials need. |

## File plan (as built)

- `auth.ts` (root) — single `NextAuth({...})`, exports `{ handlers, auth, signIn, signOut }`, JWT strategy, `pages.signIn = /login`.
- `app/api/auth/[...nextauth]/route.ts` — `export const { GET, POST } = handlers`.
- `proxy.ts` (root) — `export default auth((req) => …)`; protects `/dashboard`, redirects unauthenticated users to `/login`.
- `app/login/page.tsx` — "Sign in with Microsoft" button (server action → `signIn`); redirects to dashboard if already signed in.
- `app/dashboard/page.tsx` — protected; `await auth()` (secure check), renders avatar/name/email + sign-out.
- `app/page.tsx` — entry redirect (→ `/dashboard` or `/login`).
- `.env.local` (real values, gitignored) + `.env.example` (committed via `!.env.example` gitignore rule).

### Refinements made during build (vs. original design)

- **Dropped the `auth.config.ts` split.** The split exists to keep middleware Edge-compatible; this Next.js runs `proxy` on the **Node.js runtime**, so a single `auth.ts` is simpler and equally correct. Verified against the installed `next-auth` middleware internals.
- **Dropped `types/next-auth.d.ts`.** The demo only reads default session fields (name/email/image); an empty augmentation would be cargo-culting.
- Verified empirically: `next-auth@5.0.0-beta.31` peer-supports `next@16` + `react@19`; `MicrosoftEntraID` auto-infers the `AUTH_MICROSOFT_ENTRA_ID_*` env vars and defaults the issuer to the `common` authority.

## Environment variables

- `AUTH_SECRET` — generated.
- `AUTH_MICROSOFT_ENTRA_ID_ID`, `AUTH_MICROSOFT_ENTRA_ID_SECRET` — from Azure app registration.
- `AUTH_MICROSOFT_ENTRA_ID_ISSUER` — `https://login.microsoftonline.com/common/v2.0` (the `common` authority).

Exact env-var names + provider signature to be **verified against the installed package**, not assumed.

## Risks handled during build (not assumed away)

1. **Peer-dep compatibility** with Next 16 / React 19 — next-auth v5 is beta; inspect the installed package's peer range and pin a working version/flags.
2. **API drift** — verify real exports + `microsoft-entra-id` provider signature from `node_modules`.

## Azure setup the user must do

- Redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id` (dev).
- Supported account types: any org directory + personal Microsoft accounts.

## Verification

- `next build` — passes (TypeScript + lint + compile); `proxy.ts` registered as Proxy/Middleware.
- Runtime smoke test — `/login` renders the sign-in button; `/dashboard` and `/` redirect unauthenticated visitors to `/login`.
- Adversarial review (4 lenses: security, Auth.js correctness, Next 16 conventions, Entra OAuth; each finding skeptic-verified) — **0 code defects**. One doc nit fixed: `.env.example` now lists the Azure redirect-URI + supported-account-types prerequisites.

## Out of scope (YAGNI)

Database/adapter, multiple providers, roles/permissions, account linking, custom error pages.
