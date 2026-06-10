import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"

function SignOutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export default async function DashboardPage() {
  // Secure check: never trust the optimistic proxy redirect alone.
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { name, email, image } = session.user
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase()
  const firstName = name ? name.split(" ")[0] : null

  // Label the session by the provider the user actually signed in with
  // (persisted onto the JWT by the `jwt` / `session` callbacks in auth.ts).
  const PROVIDER_LABELS: Record<string, string> = {
    "microsoft-entra-id": "Microsoft",
    google: "Google",
    facebook: "Facebook",
  }
  const providerLabel = session.provider
    ? PROVIDER_LABELS[session.provider]
    : undefined

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        {/* Hero: avatar + greeting */}
        <div className="mb-8 flex flex-col items-center text-center">
          {image ? (
            // Providers return avatars from different hosts (Microsoft as a
            // base64 data URI, Facebook as a Graph URL); a plain <img> avoids
            // per-host next/image config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name ?? "Profile photo"}
              className="h-20 w-20 rounded-full object-cover shadow-sm ring-2 ring-black/[.06] dark:ring-white/[.12]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground text-2xl font-semibold text-background shadow-sm">
              {initial}
            </div>
          )}

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {firstName ? `Welcome, ${firstName}` : "Welcome back"}
          </h1>

          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {providerLabel ? `Signed in with ${providerLabel}` : "Signed in"}
          </span>
        </div>

        {/* Account details */}
        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {name ?? "—"}
              </dd>
            </div>
            <div className="h-px bg-black/[.06] dark:bg-white/[.1]" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Email
              </dt>
              <dd className="mt-1 break-all text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {email ?? "—"}
              </dd>
            </div>
          </dl>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-black/[.08] px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
            >
              <SignOutIcon />
              Sign out
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Secured by Auth.js
        </p>
      </div>
    </main>
  )
}
