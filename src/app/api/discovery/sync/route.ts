import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { device, networks, software } = payload;

    if (!device || !device.name) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const org = await prisma.organization.findFirst();
    if (!org) return NextResponse.json({ error: "No org found" }, { status: 500 });

    const assetTag = `SYS-${device.name.toUpperCase()}`;
    
    // 1. Fetch the EXISTING data before we overwrite it (The Auditor)
    const existingAsset = await prisma.asset.findUnique({
      where: { assetTag },
      include: { hardware: true, software: true }
    });

    // 2. Upsert the Base Asset
    const asset = await prisma.asset.upsert({
      where: { assetTag },
      update: { name: device.name, updatedAt: new Date() },
      create: { name: device.name, assetTag, category: "COMPUTER", status: "ASSIGNED", organizationId: org.id }
    });

    // 3. Run the Audit Checks!
    if (!existingAsset?.hardware) {
      // First time this PC has ever been scanned
      await prisma.assetHistory.create({
        data: { assetId: asset.id, action: "AGENT_DEPLOYED", notes: "Endpoint tracking agent installed and initialized." }
      });
    } else {
      // Check for Stolen/Upgraded RAM
      if (existingAsset.hardware.ramTotalMB !== device.ramTotalMB) {
        const diff = (device.ramTotalMB || 0) > (existingAsset.hardware.ramTotalMB || 0) ? "UPGRADED" : "DEGRADED (POSSIBLE THEFT)";
        await prisma.assetHistory.create({
          data: { 
            assetId: asset.id, 
            action: "HARDWARE_MODIFIED", 
            notes: `Physical Memory (RAM) ${diff}: Changed from ${existingAsset.hardware.ramTotalMB}MB to ${device.ramTotalMB}MB.` 
          }
        });
      }
      
      // Check for OS Upgrades (e.g., Windows 10 to Windows 11)
      if (existingAsset.hardware.osName !== device.osName || existingAsset.hardware.osVersion !== device.osVersion) {
        await prisma.assetHistory.create({
          data: { 
            assetId: asset.id, 
            action: "OS_UPDATED", 
            notes: `Operating System updated from ${existingAsset.hardware.osName} to ${device.osName} (${device.osVersion}).` 
          }
        });
      }
    }

    // 4. Update the Hardware
    await prisma.hardwareSpec.upsert({
      where: { assetId: asset.id },
      update: { osName: device.osName, osVersion: device.osVersion, cpuModel: device.cpuModel, ramTotalMB: device.ramTotalMB, lastSyncAt: new Date() },
      create: { assetId: asset.id, osName: device.osName, osVersion: device.osVersion, cpuModel: device.cpuModel, ramTotalMB: device.ramTotalMB }
    });

    // 5. Update Networks & Software silently
    if (networks) {
      await prisma.networkInterface.deleteMany({ where: { assetId: asset.id } });
      await prisma.networkInterface.createMany({
        data: networks.map((net: any) => ({ assetId: asset.id, macAddress: net.macAddress || "UNKNOWN", ipAddress: net.ipAddress }))
      });
    }
    if (software) {
      await prisma.installedSoftware.deleteMany({ where: { assetId: asset.id } });
      await prisma.installedSoftware.createMany({
        data: software.map((soft: any) => ({ assetId: asset.id, name: soft.name, publisher: soft.publisher, version: soft.version })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, message: `Inventoried & Audited ${device.name}` });

  } catch (error) {
    console.error("Telemetry Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
