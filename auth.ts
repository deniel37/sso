import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

/**
 * Auth.js (NextAuth v5) configuration — the single source of truth for auth.
 *
 * Exports consumed across the app:
 *   - `handlers`           → mounted by app/api/auth/[...nextauth]/route.ts
 *   - `auth`               → session checks in Server Components and proxy.ts
 *   - `signIn` / `signOut` → invoked from server actions
 *
 * No database adapter is configured, so sessions are stateless: the profile is
 * carried in an encrypted JWT cookie.
 */

// Facebook's default avatar is only 50x50. We request a 200x200 picture and
// reuse this exact endpoint for both the provider's `userinfo.url` and the
// custom fetch below, so the two can never drift out of sync.
const FACEBOOK_USERINFO_URL =
  "https://graph.facebook.com/me?fields=id,name,email,picture.width(200).height(200)"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      // The `common` authority (via AUTH_MICROSOFT_ENTRA_ID_ISSUER) admits ANY
      // Microsoft account — work, school, or personal. Point the issuer at a
      // tenant URL (…/<tenant-id>/v2.0) to restrict sign-in to one organization.
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      // Force the account picker on every sign-in. Without it, Microsoft's own
      // SSO session silently re-issues a token after we sign out, bouncing the
      // user straight back to the dashboard.
      authorization: { params: { prompt: "select_account" } },
    }),

    // Google is OIDC: the issuer (https://accounts.google.com) is built into the
    // provider, so there is no issuer env var, and the default profile mapping
    // already maps Google's durable `picture` URL to `image` — no userinfo /
    // profile override needed. `prompt: select_account` mirrors Microsoft above.
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),

    // Facebook is OAuth2 (not OIDC): no issuer. The default config fetches only a
    // 50x50 avatar, so we override `userinfo` to request the larger picture while
    // keeping the bearer token on the call.
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      userinfo: {
        url: FACEBOOK_USERINFO_URL,
        async request({ tokens }: { tokens: { access_token?: string } }) {
          const res = await fetch(FACEBOOK_USERINFO_URL, {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          })
          // Fail loud on a Graph error. Otherwise an error body (`{ error: … }`)
          // is accepted as the profile and a "ghost" session with an empty user
          // is minted, instead of the sign-in aborting.
          if (!res.ok) {
            throw new Error(`Facebook userinfo request failed (HTTP ${res.status})`)
          }
          return res.json()
        },
      },
      profile(profile) {
        // When the account has no photo Facebook returns a generic silhouette;
        // treat that as "no image" so the dashboard falls back to the initial.
        const picture = profile.picture?.data as
          | { url: string; is_silhouette?: boolean }
          | undefined
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: picture && !picture.is_silhouette ? picture.url : null,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Persist which provider the user signed in with onto the stateless JWT, so
    // the dashboard can label the session ("Signed in with …"). `account` is
    // only present on the initial sign-in.
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
