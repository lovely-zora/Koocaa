"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function performGlobalSearch(query: string) {
  const session = await auth();
  if (!session?.user?.orgId || !query || query.length < 2) return [];

  const orgId = session.user.orgId;
  const search = query.toLowerCase();

  try {
    // 1. Search Assets
    const assets = await prisma.asset.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { assetTag: { contains: search, mode: 'insensitive' } }
        ]
      },
      take: 4
    });

    // 2. Search Users
    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      take: 3
    });

    // 3. Search Tickets
    const tickets = await prisma.maintenanceLog.findMany({
      where: {
        asset: { organizationId: orgId },
        issue: { contains: search, mode: 'insensitive' }
      },
      take: 3,
      include: { asset: true }
    });

    const results: any[] = [];

    // FIX: Deep-link directly into the specific Asset Profile!
    assets.forEach(a => results.push({
      id: `asset-${a.id}`,
      name: `${a.name} (${a.assetTag})`,
      type: "Asset",
      iconName: "Laptop",
      path: `/assets/${a.id}`, // <-- This is the magic fix!
      color: "text-blue-500",
      bg: "bg-blue-50"
    }));

    users.forEach(u => results.push({
      id: `user-${u.id}`,
      name: u.name || u.email,
      type: "Employee",
      iconName: "Users",
      path: `/users`, // Jumps to directory (since individual profiles aren't built yet)
      color: "text-purple-500",
      bg: "bg-purple-50"
    }));

    // FIX: Deep-link directly into the specific Helpdesk Ticket!
    tickets.forEach(t => results.push({
      id: `ticket-${t.id}`,
      name: t.issue,
      type: "Ticket",
      iconName: "Headset",
      path: `/helpdesk/${t.id}`, // <-- Deep link to ticket!
      color: "text-amber-500",
      bg: "bg-amber-50"
    }));

    return results;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
