// Module augmentation: expose which OAuth provider the user signed in with.
// Populated by the `jwt` / `session` callbacks in `auth.ts` so the dashboard
// can render the correct "Signed in with …" label across multiple providers.

declare module "next-auth" {
  interface Session {
    provider?: string
  }
}

// Augment where `JWT` is actually declared. `next-auth/jwt` only re-exports
// (`export *`) from `@auth/core/jwt`, so augmenting that re-export does NOT
// merge into the interface the callbacks see — it must target the source module.
declare module "@auth/core/jwt" {
  interface JWT {
    provider?: string
  }
}

export {}
