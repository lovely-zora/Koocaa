"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { reportIssue } from "@/server/actions/maintenance";
import { Loader2, Plus, AlertTriangle } from "lucide-react";

export function NewTicketDialog({ assets }: { assets: { id: string, name: string, assetTag: string }[] }) {
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!assetId || !issue.trim()) return;
    setLoading(true);
    try {
      await reportIssue(assetId, issue, priority);
      setOpen(false);
      setIssue("");
      setAssetId("");
      setPriority("MEDIUM");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" /> Create Support Ticket
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Submit a new maintenance request directly from the helpdesk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Asset</label>
            <select
              className="w-full p-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              disabled={loading}
            >
              <option value="" disabled>Choose an asset...</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority Level</label>
            <select
              className="w-full p-2.5 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Issue Description</label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Describe the problem..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="border-slate-200">
            Cancel
          </Button>
          <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={handleSubmit} disabled={!assetId || !issue.trim() || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
