"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { reportMaintenance } from "@/server/actions/maintenance";
import { Wrench, Loader2 } from "lucide-react";

export function ReportIssueDialog({ 
  assetId, 
  open, 
  onOpenChange 
}: { 
  assetId: string; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await reportMaintenance(
        assetId, 
        formData.get("issue") as string, 
        formData.get("description") as string
      );
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-500" /> Report Maintenance Issue
          </DialogTitle>
          <DialogDescription>
            Detail the problem. This will mark the asset as "In Repair" and notify IT.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Short Issue Title</label>
            <Input name="issue" placeholder="e.g., Cracked screen, Battery failing" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <Textarea name="description" placeholder="Provide more context for the technician..." rows={3} />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Maintenance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
