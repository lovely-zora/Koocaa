"use client";

import { useState, useEffect } from "react";
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
import { getEmployees } from "@/server/actions/employees";
import { assignAsset } from "@/server/actions/assign-asset";
import { User, Loader2 } from "lucide-react";

interface Employee {
  id: string;
  name: string | null;
}

export function AssignAssetDialog({ 
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open) {
      setFetching(true);
      getEmployees()
        .then((data) => setEmployees(data))
        .finally(() => setFetching(false));
    }
  }, [open]);

  const handleAssign = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      await assignAsset(assetId, selectedEmployee);
      onOpenChange(false);
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 text-xl font-bold">Assign Asset</DialogTitle>
          <DialogDescription className="text-slate-500">
            Choose a team member to take responsibility for <strong className="text-slate-800">{assetName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Select Employee</label>
            <Select onValueChange={setSelectedEmployee} disabled={fetching || loading}>
              <SelectTrigger className="w-full border-slate-200">
                <SelectValue placeholder={fetching ? "Loading employees..." : "Search by name..."} />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 font-medium">{emp.name || "Unnamed User"}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-200 text-slate-700 hover:bg-slate-50">
            Cancel
          </Button>
          <Button 
            className="bg-blue-700 hover:bg-blue-800 text-white" 
            onClick={handleAssign} 
            disabled={!selectedEmployee || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
