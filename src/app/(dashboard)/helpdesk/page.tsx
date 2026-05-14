import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, MessageSquare, Headset } from "lucide-react";
import { NewTicketDialog } from "@/components/shared/new-ticket-dialog";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HelpdeskPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  const tickets = await prisma.maintenanceLog.findMany({
    where: { asset: { organizationId: session.user.orgId } },
    include: {
      asset: { select: { name: true, assetTag: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const assets = await prisma.asset.findMany({
    where: { organizationId: session.user.orgId },
    select: { id: true, name: true, assetTag: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Headset className="w-8 h-8 text-blue-700" /> IT Service Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage asset maintenance tickets.</p>
        </div>
        <NewTicketDialog assets={assets} />
      </div>
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No active tickets.</div>
          ) : (
            <div className="divide-y divide-slate-100/60">
              {tickets.map((ticket: any) => (
                <Link href={`/helpdesk/${ticket.id}`} key={ticket.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-blue-500">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{ticket.issue}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-medium">
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">{ticket.asset.assetTag}</span>
                        <span>{ticket.asset.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      {ticket.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" /> {ticket._count.comments}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
