"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // <-- Added the Input component
import { addAssetLog } from "@/server/actions/asset-history";
import { Loader2 } from "lucide-react";

export function AddAssetLogDialog({ 
  assetId, 
  assetName, 
  open, 
  onOpenChange 
}: { 
  assetId: string; 
  assetName: string; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [action, setAction] = useState("");
  const [customAction, setCustomAction] = useState(""); // <-- New state for "Other"
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // If "OTHER" is selected, we use whatever the user typed. Otherwise, we use the dropdown value.
    const finalAction = action === "OTHER" ? customAction : action;

    if (!finalAction || !notes) return;
    
    setLoading(true);
    try {
      await addAssetLog(assetId, finalAction, notes);
      
      // Reset the form
      setNotes("");
      setAction("");
      setCustomAction("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to log activity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prevent submission if "OTHER" is selected but the text box is empty
  const isSubmitDisabled = !action || (action === "OTHER" && !customAction) || !notes || loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 text-xl font-bold">Log Asset Activity</DialogTitle>
          <DialogDescription className="text-slate-500">
            Record hardware changes, movements, or maintenance for <strong className="text-slate-800">{assetName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Type of Change</label>
            <Select onValueChange={setAction} value={action} disabled={loading}>
              <SelectTrigger className="w-full border-slate-200">
                <SelectValue placeholder="Select activity type..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="HARDWARE_UPGRADE">Hardware Upgrade (RAM, Storage, etc.)</SelectItem>
                <SelectItem value="LOCATION_CHANGE">Movement / Location Change</SelectItem>
                <SelectItem value="ROUTINE_MAINTENANCE">Routine Maintenance</SelectItem>
                <SelectItem value="SOFTWARE_UPDATE">Software/OS Installation</SelectItem>
                <SelectItem value="AUDIT">Physical Audit / Verification</SelectItem>
                <SelectItem value="OTHER">Other Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* This input field magically appears ONLY when "OTHER" is selected */}
          {action === "OTHER" && (
            <div className="space-y-2 animate-in fade-in zoom-in duration-300">
              <label className="text-sm font-medium text-slate-700">Specify Custom Activity</label>
              <Input 
                placeholder="E.g., Screen Replacement, Warranty Claim..." 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                disabled={loading}
                className="border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Detailed Notes</label>
            <textarea
              className="w-full min-h-[120px] p-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 resize-none"
              placeholder="E.g., Upgraded RAM from 8GB to 16GB. Moved from HR office to IT storage..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-200 text-slate-700 hover:bg-slate-50">
            Cancel
          </Button>
          <Button 
            className="bg-blue-700 hover:bg-blue-800 text-white" 
            onClick={handleSubmit} 
            disabled={isSubmitDisabled}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Log Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}