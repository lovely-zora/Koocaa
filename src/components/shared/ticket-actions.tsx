"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addTicketComment, updateTicketStatus } from "@/server/actions/tickets";
import { Send, Loader2, CheckCircle } from "lucide-react";

export function TicketReplyBox({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    await addTicketComment(ticketId, message);
    setMessage("");
    setIsSending(false);
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <textarea
        className="w-full min-h-[80px] p-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        placeholder="Type your reply or internal note here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSending}
      />
      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={!message.trim() || isSending} className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm h-8 px-4">
          {isSending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-2" />}
          Reply
        </Button>
      </div>
    </div>
  );
}

export function TicketStatusDropdown({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    await updateTicketStatus(ticketId, e.target.value);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isUpdating && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
      <select
        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
          currentStatus === "OPEN" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
          currentStatus === "IN_PROGRESS" ? "bg-blue-50 border-blue-200 text-blue-700" :
          "bg-slate-100 border-slate-200 text-slate-700"
        }`}
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
      >
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  );
}
