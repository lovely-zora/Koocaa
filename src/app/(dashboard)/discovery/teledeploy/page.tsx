import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Rocket, TerminalSquare, Laptop } from "lucide-react";
import Link from "next/link";
import { CreatePackageDialog } from "@/components/discovery/create-package-dialog";
import { DeployPackageDialog } from "@/components/discovery/deploy-package-dialog";

export const dynamic = "force-dynamic";

export default async function TeledeployPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  const packages = await prisma.teledeployPackage.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { tasks: true } }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/discovery" className="text-slate-400 hover:text-purple-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Teledeploy Hub</h1>
          </div>
          <p className="text-sm text-slate-500 ml-7">Create, manage, and push execution packages to endpoints.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <CreatePackageDialog />
        </div>
      </div>

      {packages.length === 0 ? (
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <Rocket className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No Deployment Packages</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Create your first package to remotely execute scripts or install software on your endpoints.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="bg-white border-slate-200 shadow-sm hover:border-purple-300 transition-colors group cursor-pointer flex flex-col">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {pkg.osTarget === "WINDOWS" ? (
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TerminalSquare className="w-4 h-4" /></div>
                    ) : (
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Laptop className="w-4 h-4" /></div>
                    )}
                    <div>
                      <CardTitle className="text-base text-slate-800">{pkg.name}</CardTitle>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{pkg.scriptType}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {pkg._count.tasks} Tasks
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-2">{pkg.description || "No description provided."}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">{new Date(pkg.createdAt).toLocaleDateString()}</span>
                  
                  {/* INJECTED THE DEPLOY MODAL HERE */}
                  <DeployPackageDialog packageId={pkg.id} packageName={pkg.name} osTarget={pkg.osTarget} />
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
