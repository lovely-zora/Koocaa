import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const session = await auth();

  // If no session exists, send to login
  if (!session) {
    redirect("/login");
  }

  // If authenticated, go to dashboard
  redirect("/dashboard");
}