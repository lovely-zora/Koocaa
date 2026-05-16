import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MonitorSmartphone, Search, ChevronLeft, Cpu } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AllComputersPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  const computers = await prisma.hardwareSpec.findMany({
    orderBy: { lastSyncAt: "desc" },
    include: { 
      asset: {
        select: { name: true, assetTag: true, status: true }
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/discovery" className="text-slate-400 hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventoried Endpoints</h1>
          </div>
          <p className="text-sm text-slate-500 ml-7">Deep hardware telemetry collected from endpoint agents.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search PCs..." 
              className="w-full sm:w-64 rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
            />
          </div>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {computers.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100 m-4 rounded-xl">
              <MonitorSmartphone className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No telemetry data yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Once your Endpoint Agents are deployed, the hardware specifications for Windows and Mac computers will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Computer Name</th>
                    <th className="px-6 py-4 font-semibold">Operating System</th>
                    <th className="px-6 py-4 font-semibold">Processor (CPU)</th>
                    <th className="px-6 py-4 font-semibold">Memory (RAM)</th>
                    <th className="px-6 py-4 font-semibold">Last Sync</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computers.map((pc: any) => (
                    <tr key={pc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MonitorSmartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{pc.asset.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pc.asset.assetTag}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{pc.osName || "Unknown OS"}</span>
                        {pc.osVersion && <div className="text-[10px] text-slate-400 mt-0.5">{pc.osVersion}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Cpu className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px]" title={pc.cpuModel || "Unknown"}>
                            {pc.cpuModel || "Unknown CPU"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {(pc.ramTotalMB ? (pc.ramTotalMB / 1024).toFixed(1) : 0)} GB
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                          {new Date(pc.lastSyncAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/assets/${pc.assetId}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                        >
                          View Specs
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
