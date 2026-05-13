"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  const orgId = session.user.orgId;

  const [totalAssets, assignedAssets, totalEmployees] = await Promise.all([
    prisma.asset.count({ where: { organizationId: orgId } }),
    prisma.asset.count({ where: { organizationId: orgId, status: "ASSIGNED" } }),
    prisma.user.count({ where: { organizationId: orgId } }),
  ]);

  const recentAssets = await prisma.asset.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignedTo: { select: { name: true } } }
  });

  return {
    totalAssets,
    availableAssets: totalAssets - assignedAssets,
    assignedAssets,
    totalEmployees,
    recentAssets,
  };
}
