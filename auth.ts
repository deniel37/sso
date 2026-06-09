import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Single source of truth: exports the `handlers` for the route handler,
 * and `auth` / `signIn` / `signOut` for use in Server Components, Server
 * Actions, and `proxy.ts`.
 *
 * No database adapter is configured, so sessions are stored as a stateless,
 * encrypted JWT cookie.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      // The `common` authority (set via AUTH_MICROSOFT_ENTRA_ID_ISSUER) lets
      // ANY Microsoft account sign in — work, school, or personal. To restrict
      // sign-in to a single organization, point the issuer at a tenant-specific
      // URL: https://login.microsoftonline.com/<tenant-id>/v2.0
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      // Force Microsoft to show the account picker on every sign-in. Without
      // this, Microsoft's own SSO session silently re-issues a token after we
      // sign out — bouncing the user straight back to the dashboard. With
      // `select_account`, the user always sees "Pick an account" and can switch.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
})
