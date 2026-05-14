"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reportIssue(assetId: string, issue: string, priority: string = "MEDIUM") {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  await prisma.$transaction([
    prisma.asset.update({
      where: { id: assetId, organizationId: session.user.orgId },
      data: { status: "IN_REPAIR" },
    }),
    prisma.maintenanceLog.create({
      data: { assetId, issue, status: "OPEN", priority },
    }),
    prisma.assetHistory.create({
      data: {
        assetId,
        userId: session.user.id,
        action: "MAINTENANCE",
        notes: `Ticket opened: ${issue} (Priority: ${priority})`,
      },
    }),
  ]);

  revalidatePath("/assets");
  revalidatePath(`/assets/${assetId}`);
  revalidatePath("/helpdesk");
}
