"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getEmployees() {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  return await prisma.user.findMany({
    where: {
      organizationId: session.user.orgId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { assets: true } // Shows how many assets each person has
      }
    },
    orderBy: {
      name: 'asc',
    },
  });
}
