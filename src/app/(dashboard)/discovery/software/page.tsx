import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SoftwareDictionaryPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  // We group identical software together and count how many PCs have it installed
  const softwareGroups = await prisma.installedSoftware.groupBy({
    by: ['name', 'publisher', 'version'],
    _count: {
      assetId: true,
    },
    orderBy: {
      _count: {
        assetId: 'desc'
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/discovery" className="text-slate-400 hover:text-amber-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Software Dictionary</h1>
          </div>
          <p className="text-sm text-slate-500 ml-7">Global audit of all installed applications across your network.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search software..." 
              className="w-full sm:w-64 rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" 
            />
          </div>
        </div>
      </div>

      {/* The OCS-Style Software Table */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {softwareGroups.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100 m-4 rounded-xl">
              <Layers className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No software data yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Once your Endpoint Agents run their first software audit, the results will be aggregated here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 bg-slate-50/80 uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Software Name</th>
                    <th className="px-6 py-4 font-semibold">Publisher</th>
                    <th className="px-6 py-4 font-semibold">Version</th>
                    <th className="px-6 py-4 font-semibold text-right">Installations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {softwareGroups.map((soft, index) => (
                    <tr key={index} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-slate-900 max-w-md truncate" title={soft.name}>
                            {soft.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {soft.publisher || <span className="text-slate-400 italic">Unknown</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {soft.version || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          {soft._count.assetId}
                        </span>
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
