"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAssetDetails(assetId: string) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  return await prisma.asset.findUnique({
    where: { 
      id: assetId,
      organizationId: session.user.orgId 
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      history: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}
