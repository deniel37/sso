import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import Facebook from "next-auth/providers/facebook"

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
    // Facebook is OAuth2 (not OIDC): no issuer. `clientId`/`clientSecret` are
    // also auto-inferred from AUTH_FACEBOOK_ID / AUTH_FACEBOOK_SECRET, but we
    // pass them explicitly to mirror the Microsoft provider above.
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Persist which provider the user signed in with onto the stateless JWT so
    // the dashboard can label the session ("Signed in with Microsoft" / "…with
    // Facebook"). `account` is only present on the initial sign-in.
    jwt({ token, account }) {
      if (account) token.provider = account.provider
      return token
    },
    session({ session, token }) {
      session.provider = token.provider
      return session
    },
  },
})
