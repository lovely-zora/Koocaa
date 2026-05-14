"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { reportIssue } from "@/server/actions/maintenance";
import { Loader2, AlertTriangle } from "lucide-react";

export function ReportIssueDialog({ 
  assetId, assetName, open, onOpenChange 
}: { 
  assetId: string; assetName: string; open: boolean; onOpenChange: (open: boolean) => void;
}) {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issue.trim()) return;
    setLoading(true);
    try {
      await reportIssue(assetId, issue);
      onOpenChange(false);
      setIssue("");
    } catch (error) {
      console.error("Failed to report issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Report Issue
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Describe the problem with <strong className="text-slate-800">{assetName}</strong>. This will move it to Maintenance.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <textarea
            className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            placeholder="E.g., Screen is flickering, battery won't hold charge..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={loading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-200">
            Cancel
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSubmit} disabled={!issue.trim() || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
