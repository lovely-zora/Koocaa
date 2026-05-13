import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, CheckCircle, AlertTriangle, Activity, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Real-time enterprise metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{available}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">In Repair</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repair}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader className="border-b bg-slate-50/50 py-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Activity className="h-4 w-4 text-blue-800" /> Recent Activity
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No assets found.</div>
          ) : (
            recent.map((asset) => (
              <div key={asset.id} className="p-4 border-b last:border-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{asset.assetTag}</p>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                  {asset.status}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}