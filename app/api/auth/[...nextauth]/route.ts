import { handlers } from "@/auth"

// Mounts the Auth.js endpoints (sign-in, callback, session, sign-out, …) under
// /api/auth/*. Each provider's callback lands at /api/auth/callback/<provider-id>
// — e.g. .../microsoft-entra-id, .../google, .../facebook.
export const { GET, POST } = handlers
