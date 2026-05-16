"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function configureWorkspace(activeModules: string[]) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  // 1. Save the selected modules to the database
  await prisma.organization.update({
    where: { id: session.user.orgId },
    data: { activeModules }
  });

  // 2. Safely trigger the Next.js redirect mechanism
  redirect("/dashboard");
}
