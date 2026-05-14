"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getEmployees() {
  const session = await auth();
  if (!session?.user?.orgId) return [];

  return await prisma.user.findMany({
    where: { organizationId: session.user.orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });
}
