import { handlers } from "@/auth"

// Exposes the Auth.js endpoints (sign in, callback, session, sign out, …)
// under /api/auth/*. The Microsoft callback lands at
// /api/auth/callback/microsoft-entra-id.
export const { GET, POST } = handlers
