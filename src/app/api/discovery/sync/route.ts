import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const hostname = data.hardware?.hostname || `UNK-${Date.now()}`;
    
    // Find first org for the agent
    const org = await prisma.organization.findFirst();
    if (!org) return NextResponse.json({ error: "No org" }, { status: 400 });

    const asset = await prisma.asset.upsert({
      where: { assetTag: hostname },
      update: {
        isDiscovered: true, // KEEP IT IN QUARANTINE
        hardware: {
          upsert: {
            create: { osName: data.hardware?.os, cpuModel: data.hardware?.cpu },
            update: { osName: data.hardware?.os, cpuModel: data.hardware?.cpu, lastSyncAt: new Date() }
          }
        }
      },
      create: {
        name: hostname,
        assetTag: hostname,
        category: "Scanned Device",
        isDiscovered: true, // FLAG AS UNKNOWN/DISCOVERED
        organizationId: org.id,
        hardware: {
          create: { osName: data.hardware?.os, cpuModel: data.hardware?.cpu }
        }
      }
    });

    return NextResponse.json({ success: true, assetId: asset.id });
  } catch (error) {
    console.error("Telemetry Error:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
