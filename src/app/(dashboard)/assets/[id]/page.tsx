import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetHistoryTimeline } from "@/components/shared/asset-history-timeline";
import { AssetAttachments } from "@/components/shared/asset-attachments"; // <-- Import added
import { ArrowLeft, Laptop } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AssetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  // Next.js 15 requires awaiting dynamic params
  const { id } = await params;

  const asset = await prisma.asset.findUnique({
    where: { id: id, organizationId: session.user.orgId },
    include: { 
      assignedTo: { select: { name: true, email: true } },
      attachments: { orderBy: { uploadedAt: "desc" } } // <-- Attachments fetched
    }
  });

  if (!asset) return notFound();

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/assets" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {asset.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-mono">{asset.assetTag}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-6">
        {/* Left Column: Asset Info & Vault */}
        <div className="space-y-6">
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" /> Hardware Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                  {asset.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Category</p>
                <p className="text-sm font-medium text-slate-900">{asset.category}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Current Owner</p>
                {asset.assignedTo ? (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {asset.assignedTo.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{asset.assignedTo.name}</p>
                      <p className="text-xs text-slate-500">{asset.assignedTo.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Unassigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* DOCUMENT VAULT UI COMPONENT INJECTED HERE */}
          <AssetAttachments assetId={asset.id} attachments={asset.attachments} />
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pl-1">Audit Trail</h3>
          <AssetHistoryTimeline assetId={asset.id} />
        </div>
      </div>
    </div>
  );
}