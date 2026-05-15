"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Calendar, ShieldCheck, ShieldAlert, Clock } from "lucide-react";

export function AssetStatusDetails({ 
  status, assignedAt, warrantyExpiry 
}: { 
  status: string; 
  assignedAt?: Date | null; 
  warrantyExpiry?: Date | null; 
}) {
  const isWarrantyValid = warrantyExpiry ? new Date(warrantyExpiry) > new Date() : false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:ring-2 hover:ring-offset-1 ${
          status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 hover:ring-emerald-200' :
          status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700 hover:ring-blue-200' :
          'bg-amber-100 text-amber-700 hover:ring-amber-200'
        }`}>
          {status}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white border-slate-200 shadow-lg">
        <DropdownMenuLabel className="text-xs text-slate-500">Asset Lifecycle Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-3">
          {/* Assignment Date */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Clock className="w-3.5 h-3.5" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned On</p>
              <p className="text-xs font-medium">{assignedAt ? new Date(assignedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {/* Warranty Status */}
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded ${isWarrantyValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isWarrantyValid ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Warranty</p>
              <p className={`text-xs font-medium ${isWarrantyValid ? 'text-emerald-700' : 'text-red-700'}`}>
                {isWarrantyValid ? 'Active' : 'Expired / No Data'}
              </p>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}