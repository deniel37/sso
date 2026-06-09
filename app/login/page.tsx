import { redirect } from "next/navigation"
import { auth, signIn } from "@/auth"

function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function MicrosoftLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
      />
    </svg>
  )
}

function ComingSoonBadge() {
  return (
    <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      Coming soon
    </span>
  )
}

export default async function LoginPage() {
  // Already signed in? Skip the login screen.
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
            <LockIcon />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Choose how you&apos;d like to sign in.
          </p>
        </div>

        {/* Sign-in options */}
        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
          {/* Microsoft — the live provider */}
          <form
            action={async () => {
              "use server"
              await signIn("microsoft-entra-id", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="flex h-11 w-full items-center gap-3 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <MicrosoftLogo />
              Continue with Microsoft
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
              more options
            </span>
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
          </div>

          {/* Google — not yet enabled */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="flex h-11 w-full cursor-not-allowed items-center gap-3 rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-700 opacity-60 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-300"
          >
            <GoogleLogo />
            Continue with Google
            <ComingSoonBadge />
          </button>

          {/* Facebook — not yet enabled */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="mt-3 flex h-11 w-full cursor-not-allowed items-center gap-3 rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-700 opacity-60 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-300"
          >
            <FacebookLogo />
            Continue with Facebook
            <ComingSoonBadge />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Secured by Microsoft Entra ID · Auth.js
        </p>
      </div>
    </main>
  )
}
