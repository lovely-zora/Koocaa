"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { FileCode2, Loader2, TerminalSquare } from "lucide-react";
import { createTeledeployPackage } from "@/server/actions/teledeploy";

export function CreatePackageDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    osTarget: "LINUX",
    scriptType: "BASH",
    command: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await createTeledeployPackage(formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
      setFormData({ name: "", description: "", osTarget: "LINUX", scriptType: "BASH", command: "" });
    } else {
      alert(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <FileCode2 className="w-4 h-4" /> Create Package
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
            <TerminalSquare className="w-5 h-5 text-purple-600" />
            New Deployment Package
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Package Name</label>
              <input required type="text" className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" placeholder="e.g., Install HTOP" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Description</label>
              <input type="text" className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" placeholder="What does this script do?" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Target OS</label>
              <select className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" value={formData.osTarget} onChange={(e) => setFormData({...formData, osTarget: e.target.value})}>
                <option value="LINUX">Linux (Ubuntu/Debian)</option>
                <option value="WINDOWS">Windows</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Script Type</label>
              <select className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" value={formData.scriptType} onChange={(e) => setFormData({...formData, scriptType: e.target.value})}>
                <option value="BASH">Bash Shell</option>
                <option value="PYTHON">Python 3</option>
                <option value="POWERSHELL">PowerShell</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase">Command / Script</label>
            <textarea required rows={5} className="w-full border border-slate-200 rounded-md p-3 text-sm font-mono focus:ring-2 focus:ring-purple-500 outline-none bg-slate-900 text-emerald-400 shadow-inner" placeholder="# Write your script here..." value={formData.command} onChange={(e) => setFormData({...formData, command: e.target.value})} />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
