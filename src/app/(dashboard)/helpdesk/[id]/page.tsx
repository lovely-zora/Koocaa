import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, AlertTriangle, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketReplyBox, TicketStatusDropdown } from "@/components/shared/ticket-actions";

export const dynamic = "force-dynamic";

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.orgId) return null;
  const { id } = await params;

  const ticket = await prisma.maintenanceLog.findUnique({
    where: { id: id },
    include: {
      asset: { select: { name: true, assetTag: true, category: true } },
      comments: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: "asc" } }
    }
  });

  if (!ticket) return notFound();

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/helpdesk" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ticket #{ticket.id.slice(-6).toUpperCase()}</h1>
            <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <TicketStatusDropdown ticketId={ticket.id} currentStatus={ticket.status} />
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        {/* Left Column: Issue & Conversation */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Reported Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-800 whitespace-pre-wrap">{ticket.issue}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Discussion Thread
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {ticket.comments.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to reply.</p>
                ) : (
                  ticket.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {comment.user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-semibold text-slate-900">{comment.user.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-blue-600 font-medium mb-1">{comment.user.role}</p>
                        <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100">
                          {comment.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <TicketReplyBox ticketId={ticket.id} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Asset Details & Properties */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-slate-500" /> Associated Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Asset Name</p>
                <p className="text-sm font-medium text-slate-900">{ticket.asset.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Asset Tag</p>
                <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{ticket.asset.assetTag}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Priority</p>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-100' :
                  ticket.priority === 'LOW' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <Link href={`/assets/${ticket.assetId}`} className="block w-full text-center mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View Full Asset Profile &rarr;
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
