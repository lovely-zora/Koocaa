"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAssetLog(assetId: string, actionType: string, notes: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.assetHistory.create({
    data: {
      assetId,
      userId: session.user.id,
      action: actionType,
      notes: notes,
    }
  });

  revalidatePath("/assets");
  revalidatePath(`/assets/${assetId}`);
}
