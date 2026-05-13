"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reportMaintenance(assetId: string, issue: string, description?: string) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  await prisma.$transaction([
    // 1. Update Asset status
    prisma.asset.update({
      where: { id: assetId, organizationId: session.user.orgId },
      data: { status: "IN_REPAIR" }
    }),
    // 2. Create Maintenance Log
    prisma.maintenanceLog.create({
      data: {
        assetId: assetId,
        issue: issue,
        description: description,
        status: "IN_PROGRESS"
      }
    }),
    // 3. Log to History
    prisma.assetHistory.create({
      data: {
        assetId: assetId,
        action: "MAINTENANCE_STARTED",
        notes: `Issue: ${issue}. Reported by ${session.user.name}`
      }
    })
  ]);

  revalidatePath(`/assets/${assetId}`);
  revalidatePath("/dashboard");
}
