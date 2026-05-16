import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, Headset, ShieldAlert, Package2, Folder, FileText } from "lucide-react"; 
import { GlobalSearch } from "@/components/shared/global-search";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !session.user?.orgId) redirect("/login");

  const role = session.user?.role as string;
  const isAuthorized = role === "SUPER_ADMIN" || role === "ADMIN" || role === "TECHNICIAN" || role === "IT_SUPPORT";
  
  if (!isAuthorized) {
    redirect("/portal");
  }

  const org = await prisma.organization.findUnique({
    where: { id: session.user.orgId as string },
    select: { activeModules: true }
  });

  const activeModules = org?.activeModules || ["DASHBOARD", "ASSETS", "DIRECTORS"];

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 relative pb-28">
      <header className="flex h-14 items-center gap-4 border-b border-slate-100 bg-white px-6 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-blue-800 text-lg mr-4 hover:scale-105 transition-transform cursor-pointer">
          <Package2 className="h-5 w-5" /> Achacho
        </div>
        <div className="hidden sm:block px-2 border-l border-slate-200">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
            <ShieldAlert className="w-3 h-3" /> {role} CONSOLE
          </span>
        </div>
        
        {/* INJECTED THE NEW GLOBAL SEARCH HERE */}
        <div className="w-full flex-1 ml-4 flex justify-center lg:justify-start">
          <GlobalSearch />
        </div>

        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
          {session.user?.name?.charAt(0) || "U"}
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex justify-around gap-4 items-center px-4 py-2 bg-black rounded-[20px] ring-1 ring-slate-700 shadow-2xl">
          
          {activeModules.includes("DASHBOARD") && (
            <Link href="/dashboard" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <LayoutDashboard className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Dashboard
              </div>
            </Link>
          )}

          {activeModules.includes("ASSETS") && (
            <Link href="/assets" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <Package className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Assets
              </div>
            </Link>
          )}

          {activeModules.includes("DIRECTORS") && (
            <Link href="/users" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <Users className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Director
              </div>
            </Link>
          )}

          {activeModules.includes("HELPDESK") && (
            <Link href="/helpdesk" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <Headset className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Service Desk
              </div>
            </Link>
          )}

          {activeModules.includes("CAPITALS") && (
            <Link href="/discovery" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <Folder className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Capitals
              </div>
            </Link>
          )}

          {activeModules.includes("FORMS") && (
            <Link href="/forms" className="relative group hover:cursor-pointer hover:bg-slate-800 p-2.5 rounded-full transition-all duration-500">
              <FileText className="w-5 h-5 text-white" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                Forms
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}
