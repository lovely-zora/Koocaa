import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddAssetDialog } from "@/components/forms/add-asset-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  const assets = await prisma.asset.findMany({
    where: { organizationId: session.user.orgId },
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { name: true } } }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Asset Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, track, and assign your corporate equipment.</p>
        </div>
        <AddAssetDialog />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name, tag, or category..." className="pl-9 bg-white border-gray-200 shadow-sm" />
          </div>
        </div>

        {/* Data Table */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <PackageOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No assets found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              You haven't added any equipment to your organization yet. Click "Add Asset" to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600">Asset Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Asset Tag</TableHead>
                <TableHead className="font-semibold text-gray-600">Category</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{asset.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                      {asset.assetTag}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{asset.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-semibold border-none ${
                      asset.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' :
                      asset.status === 'IN_REPAIR' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {asset.assignedTo?.name || <span className="text-gray-400 italic">Unassigned</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
