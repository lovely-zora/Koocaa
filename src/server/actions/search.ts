"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string) {
  const session = await auth();
  if (!session?.user?.orgId || query.length < 2) return { assets: [], employees: [] };

  const orgId = session.user.orgId;

  const [assets, employees] = await Promise.all([
    prisma.asset.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { assetTag: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
    prisma.user.findMany({
      where: {
        organizationId: orgId,
        name: { contains: query, mode: 'insensitive' },
      },
      take: 5,
    }),
  ]);

  return { assets, employees };
}
