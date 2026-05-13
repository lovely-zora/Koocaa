"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const assetTag = formData.get("assetTag") as string;
  const category = formData.get("category") as string;
  
  // 1. Create the Asset
  const asset = await prisma.asset.create({
    data: {
      name,
      assetTag,
      category,
      status: "AVAILABLE",
      organizationId: session.user.orgId,
    }
  });

  // 2. Create the Audit Trail
  await prisma.assetHistory.create({
    data: {
      assetId: asset.id,
      userId: session.user.id,
      action: "CREATED",
      notes: "Asset initialized and added to inventory."
    }
  });

  revalidatePath("/assets");
  revalidatePath("/dashboard");
}
