import { redirect } from "next/navigation"
import { auth } from "@/auth"

// Entry point: send signed-in users to their dashboard, everyone else to login.
export default async function Home() {
  const session = await auth()
  redirect(session?.user ? "/dashboard" : "/login")
}
