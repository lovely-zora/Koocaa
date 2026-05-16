"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, Loader2, MonitorSmartphone } from "lucide-react";
import { getEligibleEndpoints, deployPackageToEndpoint } from "@/server/actions/deploy-task";

export function DeployPackageDialog({ packageId, packageName, osTarget }: { packageId: string, packageName: string, osTarget: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");

  useEffect(() => {
    if (open) {
      getEligibleEndpoints(osTarget).then(res => {
        if (res.success) setEndpoints(res.endpoints);
      });
    }
  }, [open, osTarget]);

  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssetId) return;
    
    setLoading(true);
    const res = await deployPackageToEndpoint(packageId, selectedAssetId);
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      setSelectedAssetId("");
    } else {
      alert(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 transition-colors">
          Deploy <Rocket className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
            <Rocket className="w-5 h-5 text-purple-600" />
            Deploy {packageName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleDeploy} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase">Select Target Endpoint</label>
            <div className="relative">
              <MonitorSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                required 
                className="w-full border border-slate-200 rounded-md pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50 appearance-none"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
              >
                <option value="" disabled>-- Select a {osTarget === 'WINDOWS' ? 'Windows' : 'Linux'} machine --</option>
                {endpoints.map((ep) => (
                  <option key={ep.asset.id} value={ep.asset.id}>
                    {ep.asset.name} ({ep.asset.assetTag})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-slate-500">Only showing devices matching the package target OS ({osTarget}).</p>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || !selectedAssetId} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Pushing...</> : "Push to Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
