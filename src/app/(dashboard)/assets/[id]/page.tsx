import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Cpu, Network, MonitorSmartphone, Layers, Info, Wifi, History, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AssetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;

  const asset = await prisma.asset.findUnique({
    where: { id: id },
    include: {
      hardware: true,
      networks: true,
      software: { orderBy: { name: 'asc' } },
      history: { orderBy: { createdAt: 'desc' } }, // FETCH THE AUDIT LOG
      assignedTo: true,
    }
  });

  if (!asset) notFound();
  const isInventoried = !!asset.hardware;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Link href="/discovery/computers" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MonitorSmartphone className="w-6 h-6 text-blue-600" />
            {asset.name}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600">{asset.assetTag}</span>
            <span>•</span>
            <span className={asset.status === "ASSIGNED" ? "text-blue-600 font-medium" : "text-emerald-600 font-medium"}>{asset.status}</span>
            {isInventoried && (
              <><span>•</span><span className="text-slate-400">Last Sync: {asset.hardware?.lastSyncAt.toLocaleString()}</span></>
            )}
          </div>
        </div>
      </div>

      {!isInventoried ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
          <Info className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-semibold text-amber-800">No Telemetry Data</h3>
          <p className="text-sm text-amber-600 mt-1">This asset has not been synced by an endpoint agent yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><Cpu className="w-5 h-5 text-blue-600" /> Hardware</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="flex justify-between p-4"><span className="text-sm text-slate-500 font-medium">OS</span><span className="text-sm text-slate-900 font-semibold">{asset.hardware?.osName}</span></div>
                <div className="flex justify-between p-4"><span className="text-sm text-slate-500 font-medium">Version</span><span className="text-sm text-slate-900 font-mono">{asset.hardware?.osVersion || "N/A"}</span></div>
                <div className="flex flex-col gap-1 p-4"><span className="text-sm text-slate-500 font-medium">CPU</span><span className="text-sm text-slate-900 font-medium leading-relaxed">{asset.hardware?.cpuModel}</span></div>
                <div className="flex justify-between p-4"><span className="text-sm text-slate-500 font-medium">RAM</span><span className="text-sm text-slate-900 font-semibold">{(asset.hardware?.ramTotalMB || 0) / 1024} GB</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><Network className="w-5 h-5 text-emerald-600" /> Networks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {asset.networks.map((net) => (
                  <div key={net.id} className="p-4 flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0"><Wifi className="w-4 h-4" /></div>
                    <div className="flex-1">
                      <div className="flex justify-between"><span className="text-sm font-semibold text-slate-900">{net.ipAddress}</span><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">IPv4</span></div>
                      <div className="flex justify-between mt-1"><span className="text-xs text-slate-500">MAC</span><span className="text-xs font-mono text-slate-400 uppercase">{net.macAddress}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* NEW: SECURITY & AUDIT TIMELINE */}
          <Card className="bg-white border-slate-200 shadow-sm md:col-span-2">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <History className="w-5 h-5 text-indigo-600" /> Audit & Security History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {asset.history.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-4">No audit events recorded yet.</div>
              ) : (
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                  {asset.history.map((evt) => (
                    <div key={evt.id} className="relative pl-6">
                      {/* Timeline Dot Icon based on event type */}
                      <span className={`absolute -left-[11px] top-1 rounded-full ring-4 ring-white w-5 h-5 flex items-center justify-center
                        ${evt.action === 'AGENT_DEPLOYED' ? 'bg-blue-100 text-blue-600' : 
                          evt.action.includes('MODIFIED') ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {evt.action.includes('MODIFIED') ? <AlertTriangle className="w-3 h-3" /> : <ArrowUpCircle className="w-3 h-3" />}
                      </span>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{evt.action.replace(/_/g, ' ')}</h4>
                        <time className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {new Date(evt.createdAt).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-md border border-slate-100 mt-2">
                        {evt.notes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm md:col-span-2">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><Layers className="w-5 h-5 text-amber-600" /> Software Packages</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 bg-slate-50 uppercase tracking-wider sticky top-0 border-b border-slate-200 shadow-sm">
                  <tr><th className="px-6 py-3 font-semibold">Application Name</th><th className="px-6 py-3 font-semibold">Publisher</th><th className="px-6 py-3 font-semibold text-right">Version</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {asset.software.map((soft) => (
                    <tr key={soft.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-900">{soft.name}</td>
                      <td className="px-6 py-3 text-slate-500">{soft.publisher || "Unknown"}</td>
                      <td className="px-6 py-3 text-right"><span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{soft.version || "N/A"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
