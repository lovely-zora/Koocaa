"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch endpoints that match the target OS of the package
export async function getEligibleEndpoints(osTarget: string) {
  try {
    const endpoints = await prisma.hardwareSpec.findMany({
      where: {
        osName: {
          contains: osTarget === "WINDOWS" ? "Windows" : "Ubuntu",
          mode: "insensitive"
        }
      },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } }
      }
    });
    return { success: true, endpoints };
  } catch (error: any) {
    return { error: "Failed to fetch endpoints." };
  }
}

// Create a PENDING task for the agent to pick up
export async function deployPackageToEndpoint(packageId: string, assetId: string) {
  try {
    await prisma.teledeployTask.create({
      data: {
        packageId,
        assetId,
        status: "PENDING"
      }
    });
    
    revalidatePath("/discovery/teledeploy");
    return { success: true, message: "Package deployed! Agent will execute it shortly." };
  } catch (error: any) {
    return { error: "Failed to deploy package." };
  }
}
