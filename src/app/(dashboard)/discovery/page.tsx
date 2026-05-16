import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Network, MonitorSmartphone, Layers, Database, ChevronRight, Rocket } from "lucide-react";
import Link from "next/link";
import { IpScanner } from "@/components/discovery/ip-scanner";

export const dynamic = "force-dynamic";

export default async function DiscoveryDashboard() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  const totalHardware = await prisma.hardwareSpec.count();
  const totalSoftware = await prisma.installedSoftware.count();
  const totalNetworks = await prisma.networkInterface.count();

  const recentComputers = await prisma.hardwareSpec.findMany({
    take: 5,
    orderBy: { lastSyncAt: "desc" },
    include: { asset: true }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Network & Discovery</h1>
        <p className="text-sm text-slate-500 mt-1">Automated endpoint telemetry, software auditing, and IP discovery.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/discovery/computers">
          <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-wider group-hover:text-blue-700">Endpoints</CardTitle>
              <Cpu className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-slate-900">{totalHardware}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/discovery/software">
          <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-wider group-hover:text-amber-700">Software</CardTitle>
              <Layers className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-slate-900">{totalSoftware}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/discovery/networks">
          <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-wider group-hover:text-emerald-700">Networks</CardTitle>
              <Network className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-slate-900">{totalNetworks}</div>
            </CardContent>
          </Card>
        </Link>

        {/* NEW TELEDEPLOY LINK */}
        <Link href="/discovery/teledeploy">
          <Card className="bg-purple-600 border-purple-700 shadow-md relative overflow-hidden group hover:bg-purple-700 transition-colors cursor-pointer h-full text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-xs font-bold text-purple-100 uppercase tracking-wider">Teledeploy</CardTitle>
              <Rocket className="h-4 w-4 text-purple-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold">Deploy</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <IpScanner />

        <Card className="bg-white border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-100 bg-slate-50/80 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <MonitorSmartphone className="w-5 h-5 text-blue-600" /> Recently Inventoried
            </CardTitle>
            <Link href="/discovery/computers" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {recentComputers.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-700">Waiting for Agents</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                  Deploy the Koocaa tracking agent to your devices.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentComputers.map((pc: any) => (
                  <div key={pc.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{pc.asset.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{pc.osName} • {pc.ramTotalMB}MB RAM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {pc.cpuModel?.substring(0, 15)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
