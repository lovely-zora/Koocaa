"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function returnAsset(assetId: string) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  await prisma.$transaction([
    prisma.asset.update({
      where: { id: assetId, organizationId: session.user.orgId },
      data: {
        assignedToId: null,
        status: "AVAILABLE",
      },
    }),
    prisma.assetHistory.create({
      data: {
        assetId: assetId,
        action: "RETURNED",
        notes: `Asset returned to inventory by ${session.user.name}`,
      },
    }),
  ]);

  revalidatePath("/assets");
  revalidatePath(`/assets/${assetId}`);
}
