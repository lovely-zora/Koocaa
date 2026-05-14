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

  // 1. Fetch active tickets
  const tickets = await prisma.maintenanceLog.findMany({
    where: { asset: { organizationId: session.user.orgId } },
    include: {
      asset: { select: { name: true, assetTag: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  // 2. Fetch all organization assets to populate the "New Ticket" dropdown
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
          <p className="text-sm text-slate-500 mt-1">Manage asset maintenance tickets, priorities, and resolutions.</p>
        </div>
        <NewTicketDialog assets={assets} />
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No active tickets. Everything is running smoothly!</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <Link 
                  href={`/helpdesk/${ticket.id}`} 
                  key={ticket.id} 
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4 cursor-pointer block border-l-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${
                      ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-50 text-red-600' :
                      ticket.priority === 'LOW' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{ticket.issue}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">{ticket.asset.assetTag}</span>
                        <span>•</span>
                        <span>{ticket.asset.name}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:pr-4">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <MessageSquare className="w-3.5 h-3.5" /> {ticket._count.comments} Comments
                      </div>
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
