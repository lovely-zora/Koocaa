"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignAsset(assetId: string, employeeId: string) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  // We use a "Transaction" to ensure both the assignment and history happen together
  await prisma.$transaction([
    // 1. Update the Asset
    prisma.asset.update({
      where: { id: assetId, organizationId: session.user.orgId },
      data: {
        assignedToId: employeeId,
        status: "ASSIGNED",
      },
    }),
    // 2. Create the History Log
    prisma.assetHistory.create({
      data: {
        assetId: assetId,
        userId: employeeId,
        action: "ASSIGNED",
        notes: `Assigned by ${session.user.name}`,
      },
    }),
  ]);

  revalidatePath("/assets");
}
