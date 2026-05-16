import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
// Fixed: Added ChevronRight to the import list below
import { Search, ChevronLeft, Network, MonitorSmartphone, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NetworkTopologyPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  // Fetch all networks that have an IP address
  const allInterfaces = await prisma.networkInterface.findMany({
    where: { ipAddress: { not: null } },
    include: {
      asset: {
        select: { id: true, name: true, assetTag: true }
      }
    },
    orderBy: { ipAddress: 'asc' }
  });

  // Group the interfaces by their IP Series (Subnet)
  const subnets: Record<string, typeof allInterfaces> = {};
  
  allInterfaces.forEach((net) => {
    if (!net.ipAddress) return;
    const parts = net.ipAddress.split('.');
    if (parts.length === 4) {
      const subnetName = `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
      if (!subnets[subnetName]) subnets[subnetName] = [];
      subnets[subnetName].push(net);
    }
  });

  // Sort subnets by the number of connected devices (largest first)
  const sortedSubnets = Object.entries(subnets).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/discovery" className="text-slate-400 hover:text-emerald-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Network Topology</h1>
          </div>
          <p className="text-sm text-slate-500 ml-7">Global overview of IP series and connected endpoints.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search IP or MAC..." 
              className="w-full sm:w-64 rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" 
            />
          </div>
        </div>
      </div>

      {sortedSubnets.length === 0 ? (
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <Network className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No network data yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Deploy endpoint agents to start mapping your network subnets automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSubnets.map(([subnet, interfaces]) => (
            
            /* COLLAPSIBLE ACCORDION CONTAINER */
            <details key={subnet} className="group bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden transition-all">
              
              {/* CLICKABLE HEADER */}
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-emerald-50/40 hover:bg-emerald-50 transition-colors list-none [&::-webkit-details-marker]:hidden select-none">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-700 shadow-sm">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 font-mono tracking-tight">{subnet}</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      Click to expand connected systems
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold bg-emerald-200/80 text-emerald-800 px-3 py-1.5 rounded-full shadow-sm">
                    {interfaces.length} Devices Connected
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-emerald-100 group-hover:border-emerald-300 transition-colors">
                    {/* ICON ROTATES 180 DEGREES WHEN CLICKED */}
                    <ChevronDown className="w-4 h-4 text-emerald-600 transition-transform duration-300 group-open:-rotate-180" />
                  </div>
                </div>
              </summary>
              
              {/* EXPANDABLE CONTENT (THE TABLE) */}
              <div className="border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Device Name</th>
                        <th className="px-6 py-3 font-semibold">IPv4 Address</th>
                        <th className="px-6 py-3 font-semibold">MAC Address</th>
                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {interfaces.map((net) => (
                        <tr key={net.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                              <div>
                                <div className="font-medium text-slate-900">{net.asset.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{net.asset.assetTag}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100">
                              {net.ipAddress}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-mono text-slate-500 text-xs uppercase">{net.macAddress}</span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Link href={`/assets/${net.assetId}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline flex items-center justify-end gap-1">
                              View Specs <ChevronRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
