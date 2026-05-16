"use server";

import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

async function getArpTable(): Promise<Map<string, string>> {
  const arpMap = new Map<string, string>();
  try {
    const isWindows = os.platform() === 'win32';
    let stdout = "";

    if (isWindows) {
      const res = await execAsync("arp -a");
      stdout = res.stdout;
    } else {
      try {
        const res = await execAsync("ip neigh");
        stdout = res.stdout;
      } catch (e) {
        const res = await execAsync("arp -a");
        stdout = res.stdout;
      }
    }

    const lines = stdout.split('\n');
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
    const macRegex = /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/;

    for (const line of lines) {
      const ipMatch = line.match(ipRegex);
      const macMatch = line.match(macRegex);
      
      if (ipMatch && macMatch) {
        const mac = macMatch[0].replace(/-/g, ':').toUpperCase();
        arpMap.set(ipMatch[0], mac);
      }
    }
  } catch (e) {
    console.error("Failed to read Network Neighbor/ARP table", e);
  }
  return arpMap;
}

export async function scanSubnet(subnetInput: string) {
  try {
    const baseIpMatch = subnetInput.match(/^(\d+\.\d+\.\d+)\./);
    if (!baseIpMatch) return { error: "Invalid subnet format. Example: 192.168.1.0/24" };

    const baseIp = baseIpMatch[1];
    const isWindows = os.platform() === 'win32';
    const activeIps: string[] = [];

    // UPGRADED: Now scanning the FULL 254 IP address range instead of just 30!
    // We scan in chunks of 50 so we don't overwhelm the Node.js process limits
    const allIps = Array.from({ length: 254 }, (_, i) => `${baseIp}.${i + 1}`);
    
    // Process in chunks
    const chunkSize = 50;
    for (let i = 0; i < allIps.length; i += chunkSize) {
      const chunk = allIps.slice(i, i + chunkSize);
      const promises = chunk.map(ip => {
        // Fast ping: 1 packet, 1 second timeout maximum
        const cmd = isWindows ? `ping -n 1 -w 1000 ${ip}` : `ping -c 1 -W 1 ${ip}`;
        return execAsync(cmd).then(() => ip).catch(() => null);
      });
      
      const results = await Promise.all(promises);
      results.forEach(ip => { if (ip) activeIps.push(ip); });
    }

    if (activeIps.length === 0) {
        return { success: true, message: "No active devices found in this range. Note: Mobile hotspots often use AP Isolation to block ping requests." };
    }

    const org = await prisma.organization.findFirst();
    if (!org) return { error: "No organization found." };

    const arpTable = await getArpTable();
    let newDevices = 0;

    for (const ip of activeIps) {
      const existing = await prisma.networkInterface.findFirst({ where: { ipAddress: ip }});
      
      if (!existing) {
        newDevices++;
        const discoveredMac = arpTable.get(ip) || "UNKNOWN_MAC";
        
        const asset = await prisma.asset.create({
          data: {
            name: `Unmanaged Device (${ip})`,
            assetTag: `NET-${ip.replace(/\./g, '')}`,
            category: "NETWORK_DEVICE",
            status: "AVAILABLE",
            organizationId: org.id
          }
        });
        
        await prisma.networkInterface.create({
          data: {
            assetId: asset.id,
            macAddress: discoveredMac,
            ipAddress: ip
          }
        });
      }
    }

    return {
        success: true,
        message: `Scanned full subnet (254 IPs). Found ${activeIps.length} active devices (${newDevices} new).`
    };

  } catch (error: any) {
    return { error: error.message || "Failed to execute network scan." };
  }
}
