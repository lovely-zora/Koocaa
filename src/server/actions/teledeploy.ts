"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeledeployPackage(data: {
  name: string;
  description: string;
  osTarget: string;
  scriptType: string;
  command: string;
}) {
  try {
    await prisma.teledeployPackage.create({
      data: {
        name: data.name,
        description: data.description,
        osTarget: data.osTarget,
        scriptType: data.scriptType,
        command: data.command,
      }
    });
    
    // Instantly refresh the page to show the new package
    revalidatePath("/discovery/teledeploy");
    return { success: true, message: "Deployment package created!" };
  } catch (error: any) {
    return { error: error.message || "Failed to create package." };
  }
}
