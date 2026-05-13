import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, AlertTriangle, CheckCircle, Package, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  const orgId = session.user.orgId;

  // This is the "Backend" part - fetching the data
  const [totalAssets, availableAssets, maintenanceAssets, recentAssets] = await Promise.all([
    prisma.asset.count({ where: { organizationId: orgId } }),
    prisma.asset.count({ where: { organizationId: orgId, status: "AVAILABLE" } }),
    prisma.asset.count({ where: { organizationId: orgId, status: "IN_REPAIR" } }),
    prisma.asset.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignedTo: { select: { name: true } } }
    })
  ]);

  // Everything below here is the "Frontend" (HTML + CSS)
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time metrics for your enterprise assets.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total Assets</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalAssets}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Available & Ready</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{availableAssets}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">In Maintenance</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{maintenanceAssets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed (The visual list) */}
      <div className="mt-8">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1E40AF]" />
              <CardTitle className="text-lg text-slate-900">Recently Added Assets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentAssets.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No assets in the system yet. Head over to the Assets tab to add your first one!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{asset.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{asset.assetTag}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                      {asset.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
