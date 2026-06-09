import { auth } from "@/auth"
import { NextResponse } from "next/server"

/**
 * Proxy (this Next.js version's renamed Middleware) runs on the Node.js
 * runtime. It performs an *optimistic* auth check: unauthenticated requests to
 * protected routes are redirected to the sign-in page before the page renders.
 *
 * This is not the only line of defense — `app/dashboard/page.tsx` re-checks the
 * session with `auth()` close to where the data is used (secure check).
 */
export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  // Only run on protected routes.
  matcher: ["/dashboard/:path*"],
}
