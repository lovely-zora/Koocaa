import { getAssetDetails } from "@/server/actions/get-asset-details";
import { AssetHistoryTimeline } from "@/components/shared/asset-history-timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, User, Calendar, ShieldCheck, ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  const asset = await getAssetDetails(params.id);

  if (!asset) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link href="/assets" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px] tracking-widest px-2 py-0.5 font-bold">
              {asset.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-mono text-sm uppercase tracking-tighter">{asset.assetTag}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-gray-50/50 py-4 px-6">
              <CardTitle className="text-md font-semibold flex items-center gap-2 text-gray-700">
                <Laptop className="w-4 h-4" /> Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 pt-8 px-6 pb-8">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Manufacturer</p>
                <p className="text-sm font-medium text-gray-900">{asset.brand || "Not Specified"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Model Name</p>
                <p className="text-sm font-medium text-gray-900">{asset.model || "Generic"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Asset Category</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{asset.category.toLowerCase()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Serial Identifier</p>
                <p className="text-sm font-mono text-gray-700">{asset.serialNumber || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Ownership Timeline
            </h2>
            <AssetHistoryTimeline history={asset.history} />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-blue-600 text-white">
            <CardHeader className="pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Currently Assigned To</p>
            </CardHeader>
            <CardContent>
              {asset.assignedTo ? (
                <div className="flex items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                    {asset.assignedTo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg leading-tight">{asset.assignedTo.name}</p>
                    <p className="text-xs text-blue-100">{asset.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                   <p className="text-sm text-blue-100 italic">Available for deployment</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Acquisition Date
                </span>
                <span className="font-semibold text-gray-900">
                  {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
