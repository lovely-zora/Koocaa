import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, CheckCircle, AlertTriangle, Package, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  // Fetch metrics in parallel for maximum speed
  const [total, available, repair, recent] = await Promise.all([
    prisma.asset.count({ where: { organizationId: session.user.orgId } }),
    prisma.asset.count({ where: { organizationId: session.user.orgId, status: "AVAILABLE" } }),
    prisma.asset.count({ where: { organizationId: session.user.orgId, status: "IN_REPAIR" } }),
    prisma.asset.findMany({
      where: { organizationId: session.user.orgId },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time metrics for your enterprise assets.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Assets</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-900">{total}</div></CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Available</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-900">{available}</div></CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Maintenance</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-900">{repair}</div></CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 py-3">
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
            <Activity className="h-4 w-4 text-blue-800" /> Recent Activity
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No assets found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((asset) => (
                <div key={asset.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{asset.assetTag}</p>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                    {asset.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}