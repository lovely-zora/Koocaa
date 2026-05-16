"use client";

import { useState } from "react";
import { Activity, Search, Server, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { scanSubnet } from "@/server/actions/scan";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function IpScanner() {
  const [subnet, setSubnet] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const router = useRouter();

  async function handleScan() {
    if (!subnet) return;
    setIsScanning(true);
    setResult(null);

    const res = await scanSubnet(subnet);
    setResult(res);
    setIsScanning(false);
    
    // Refresh the page data so the "Recently Inventoried" card updates!
    if (res?.success) {
      router.refresh();
    }
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/80">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
          <Activity className="w-5 h-5 text-indigo-600" /> IPDiscover Module
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Live Agentless Network Scan</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Enter an IP range or Subnet (e.g., 192.168.1.0/24) to execute an ICMP ping sweep. Found devices will be automatically added to the topology map.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={subnet}
              onChange={(e) => setSubnet(e.target.value)}
              placeholder="e.g., 192.168.1.0/24"
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white"
              disabled={isScanning}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning || !subnet}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 min-w-[150px] justify-center"
          >
            {isScanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
            ) : (
              "Initialize Scan"
            )}
          </button>
        </div>

        {isScanning && (
          <div className="mt-6 space-y-2 animate-in fade-in duration-300">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Executing cross-platform ICMP Sweep...</span>
              <span className="text-indigo-600 animate-pulse font-bold">Running</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-indigo-600 w-1/3 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            </div>
          </div>
        )}

        {result && !isScanning && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${result.error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
            {result.error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <div>
              <h4 className="font-semibold text-sm">{result.error ? "Scan Failed" : "Scan Complete"}</h4>
              <p className="text-xs mt-1 opacity-90">{result.error || result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
