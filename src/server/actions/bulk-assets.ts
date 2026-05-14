"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Action 1: Import thousands of assets securely
export async function bulkImportAssets(assets: { name: string, assetTag: string, category: string }[]) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  const orgId = session.user.orgId;
  const userId = session.user.id;

  // We use a massive transaction to ensure either ALL import, or NONE do.
  await prisma.$transaction(
    assets.map(asset => prisma.asset.create({
      data: {
        name: asset.name,
        assetTag: asset.assetTag,
        category: asset.category,
        status: "AVAILABLE",
        organizationId: orgId,
        history: {
          create: {
            userId: userId,
            action: "CREATED",
            notes: "Imported via Bulk Excel Upload"
          }
        }
      }
    }))
  );

  revalidatePath("/assets");
  revalidatePath("/dashboard");
}

// Action 2: Fetch all assets for a clean Excel Export
export async function getAssetsForExport() {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");
  
  return await prisma.asset.findMany({
    where: { organizationId: session.user.orgId },
    select: { name: true, assetTag: true, category: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
}
