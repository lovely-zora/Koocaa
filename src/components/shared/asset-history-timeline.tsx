import { prisma } from "@/lib/prisma";
import { UserPlus, PackagePlus, Wrench, ArrowRightLeft } from "lucide-react";

export async function AssetHistoryTimeline({ assetId }: { assetId: string }) {
  const history = await prisma.assetHistory.findMany({
    where: { assetId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });

  const getIcon = (action: string) => {
    switch (action) {
      case "CREATED": return <PackagePlus className="w-4 h-4 text-emerald-600" />;
      case "ASSIGNED": return <UserPlus className="w-4 h-4 text-blue-600" />;
      case "MAINTENANCE": return <Wrench className="w-4 h-4 text-amber-600" />;
      default: return <ArrowRightLeft className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {history.map((log, index) => (
        <div key={log.id} className="relative flex gap-4">
          {/* Vertical Line */}
          {index !== history.length - 1 && (
            <div className="absolute left-4 top-10 bottom-[-24px] w-[2px] bg-slate-100" />
          )}
          
          {/* Icon Badge */}
          <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
            {getIcon(log.action)}
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-sm text-slate-900">{log.action.replace("_", " ")}</p>
              <span className="text-xs text-slate-400 font-medium">
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(log.createdAt)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{log.notes}</p>
            {log.user && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600">
                <span className="w-3 h-3 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[8px] font-bold">
                  {log.user.name?.charAt(0)}
                </span>
                {log.user.name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
