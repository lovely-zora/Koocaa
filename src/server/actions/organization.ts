"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrganization(formData: FormData) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const currency = formData.get("currency") as string;

  await prisma.organization.update({
    where: { id: session.user.orgId },
    data: { name, address, currency }
  });

  revalidatePath("/settings");
}
