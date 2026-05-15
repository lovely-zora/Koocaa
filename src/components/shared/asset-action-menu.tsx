"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AssignAssetDialog } from "@/components/shared/assign-asset-dialog";
import { ReportIssueDialog } from "@/components/shared/report-issue-dialog";
import { returnAsset } from "@/server/actions/return-asset";
import { UserPlus, Eye, RotateCcw, Wrench, Loader2 } from "lucide-react";
import Link from "next/link";

export function AssetActionMenu({ 
  assetId, assetName, status, userRole 
}: { 
  assetId: string; assetName: string; status: string; userRole: string; 
}) {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleReturn = async () => {
    setIsReturning(true);
    await returnAsset(assetId);
    setIsReturning(false);
  };

  const canAssign = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "AVAILABLE" && canAssign && (
        <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(true)} className="text-blue-700 border-blue-200 hover:bg-blue-50 h-8 px-3">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Assign
        </Button>
      )}

      {status === "ASSIGNED" && (
        <Button variant="outline" size="sm" onClick={handleReturn} disabled={isReturning} className="text-slate-700 border-slate-200 hover:bg-slate-50 h-8 px-3">
          {isReturning ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 mr-1.5" />} Return
        </Button>
      )}

      {status !== "IN_REPAIR" && (
        <Button variant="outline" size="sm" onClick={() => setIsIssueOpen(true)} className="text-amber-700 border-amber-200 hover:bg-amber-50 h-8 px-3">
          <Wrench className="w-3.5 h-3.5 mr-1.5" /> Reports
        </Button>
      )}

      {/* CORRECTED: Use asChild so the Link is the actual element, not wrapped by a button */}
      <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3">
        <Link href={`/assets/${assetId}`}>
          <Eye className="w-3.5 h-3.5 mr-1.5" /> View
        </Link>
      </Button>

      <AssignAssetDialog assetId={assetId} assetName={assetName} open={isAssignOpen} onOpenChange={setIsAssignOpen} />
      <ReportIssueDialog assetId={assetId} assetName={assetName} open={isIssueOpen} onOpenChange={setIsIssueOpen} />
    </div>
  );
}
