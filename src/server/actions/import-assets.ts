"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function importAssets(data: any[]) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  // Filter and map the incoming CSV data to our Prisma model
  const assetsToCreate = data.map((item) => ({
    name: item.name,
    assetTag: item.assetTag,
    category: item.category || "GENERAL",
    brand: item.brand,
    model: item.model,
    serialNumber: item.serialNumber,
    purchasePrice: parseFloat(item.purchasePrice) || 0,
    organizationId: session.user.orgId,
    status: "AVAILABLE",
  }));

  const result = await prisma.asset.createMany({
    data: assetsToCreate,
    skipDuplicates: true,
  });

  revalidatePath("/assets");
  return { count: result.count };
}
