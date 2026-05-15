// src/app/(dashboard)/assets/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop } from "lucide-react";
import { AddAssetDialog } from "@/components/forms/add-asset-dialog";
import { AssetActionMenu } from "@/components/shared/asset-action-menu";
import { ImportExportButtons } from "@/components/shared/import-export-buttons";
import { AssetStatusDetails } from "@/components/shared/asset-status-details";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const session = await auth();
  
  if (!session?.user?.orgId) {
    return <div className="p-10 text-center">Unauthorized</div>;
  }

  const assets = await prisma.asset.findMany({
    where: { 
      organizationId: session.user.orgId 
    },
    select: {
      id: true,
      name: true,
      assetTag: true,
      category: true,
      status: true,
      assignedAt: true,
      warrantyExpiry: true,
      assignedToId: true,
      createdAt: true,
      assignedTo: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { 
      createdAt: "desc" 
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Asset Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, track, and assign your enterprise devices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ImportExportButtons />
          <AddAssetDialog />
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {assets.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No assets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[11px] text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Asset Name</th>
                    <th className="px-6 py-4 font-semibold">Asset Tag</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Asset User</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Laptop className="w-4 h-4" />
                          </div>
                          {asset.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {asset.assetTag}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{asset.category}</td>
                      <td className="px-6 py-4">
                        <AssetStatusDetails
                          status={asset.status}
                          assignedAt={asset.assignedAt}
                          warrantyExpiry={asset.warrantyExpiry}
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {asset.assignedTo?.name ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {asset.assignedTo.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900">
                              {asset.assignedTo.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AssetActionMenu
                          assetId={asset.id}
                          assetName={asset.name}
                          status={asset.status}
                          userRole={session.user.role}
                        />
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