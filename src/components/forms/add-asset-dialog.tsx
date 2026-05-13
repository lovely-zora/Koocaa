"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { createAsset } from "@/server/actions/assets";
import { Plus, Loader2, Laptop } from "lucide-react";

export function AddAssetDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createAsset(formData);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-[#1E40AF]" /> Register New Asset
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new equipment. It will be marked as "Available".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" name="name" placeholder="e.g. MacBook Pro M3 16GB" required className="bg-gray-50/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetTag">Asset Tag</Label>
              <Input id="assetTag" name="assetTag" placeholder="e.g. KC-LAP-001" required className="bg-gray-50/50 uppercase" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g. Laptop" required className="bg-gray-50/50" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1e3a8a]" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
