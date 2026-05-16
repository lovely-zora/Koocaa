import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Laptop, ShieldAlert, CheckCircle2, Plus, ArrowRight, Search, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  // Fetch ONLY manually added assets
  const manualAssets = await prisma.asset.findMany({
    where: { organizationId: session.user.orgId, isDiscovered: false },
    orderBy: { createdAt: "desc" }
  });

  // Count the unknown/quarantined assets
  const unknownCount = await prisma.asset.count({
    where: { organizationId: session.user.orgId, isDiscovered: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Laptop className="w-8 h-8 text-blue-600" />
            Official Assets
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your verified, manually added inventory.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 hover:shadow-blue-600/20 hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {/* The Overview Cards you requested! */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Official Inventory */}
        <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-24 h-24" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-slate-900">Your Official Assets</h3>
            </div>
            <p className="text-4xl font-extrabold text-slate-900">{manualAssets.length}</p>
            <p className="text-sm font-medium text-emerald-600 mt-2">Verified & Managed</p>
          </CardContent>
        </Card>

        {/* Card 2: Unknown Scanned Devices (Quarantine) */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-amber-500">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-amber-900">Unknown / Scanned Devices</h3>
              </div>
              <p className="text-4xl font-extrabold text-amber-900">{unknownCount}</p>
              <p className="text-sm font-medium text-amber-700 mt-2">Discovered by Telemetry. Not in official inventory.</p>
            </div>
            
            <div className="mt-4">
              <Link href="/discovery" className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors">
                View in Capitals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Official Assets Data Table */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search official assets..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </div>
        
        {manualAssets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Monitor className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium text-slate-700">No official assets found.</p>
            <p className="text-sm">Click "Add Asset" to start building your manual inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Asset Tag</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manualAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <Link href={`/assets/${asset.id}`} className="hover:text-blue-600 transition-colors">
                        {asset.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{asset.assetTag}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">{asset.category}</span></td>
                    <td className="px-6 py-4 text-emerald-600 font-medium text-xs uppercase tracking-wider">{asset.status}</td>
                    <td className="px-6 py-4 text-right">
                       <Link href={`/assets/${asset.id}`} className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                         View
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}
