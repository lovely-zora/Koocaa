"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTicketComment(ticketId: string, message: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.ticketComment.create({
    data: {
      maintenanceLogId: ticketId,
      userId: session.user.id,
      message,
    },
  });

  revalidatePath(`/helpdesk/${ticketId}`);
  revalidatePath("/helpdesk");
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const session = await auth();
  if (!session?.user?.orgId) throw new Error("Unauthorized");

  await prisma.maintenanceLog.update({
    where: { id: ticketId },
    data: { status },
  });

  // If closed/resolved, we could automatically make the asset available again here
  if (status === "RESOLVED" || status === "CLOSED") {
    const ticket = await prisma.maintenanceLog.findUnique({ where: { id: ticketId }});
    if (ticket) {
      await prisma.asset.update({
        where: { id: ticket.assetId },
        data: { status: "AVAILABLE" }
      });
    }
  }

  revalidatePath(`/helpdesk/${ticketId}`);
  revalidatePath("/helpdesk");
  revalidatePath("/assets");
}
