"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadAttachment(assetId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  // 1. Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Ensure the upload directory exists
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // 3. Save the file locally (Mock S3)
  const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  // 4. Create Database Record & History Log
  await prisma.$transaction([
    prisma.attachment.create({
      data: {
        assetId,
        fileName: file.name,
        fileUrl: `/uploads/${uniqueName}`,
        fileType: file.type || "application/octet-stream",
      }
    }),
    prisma.assetHistory.create({
      data: {
        assetId,
        userId: session.user.id,
        action: "CREATED",
        notes: `Attached document: ${file.name}`,
      }
    })
  ]);

  revalidatePath(`/assets/${assetId}`);
}
