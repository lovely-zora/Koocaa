import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, Package2, Search, Headset } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r bg-white md:block shadow-sm">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-blue-800 text-xl">
              <Package2 className="h-6 w-6" /> Koocaa
            </Link>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium pt-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </Link>
            <Link href="/assets" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              <Package className="h-4 w-4" /> Assets
            </Link>
            <Link href="/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              <Users className="h-4 w-4" /> Employees
            </Link>
            <Link href="/helpdesk" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
              <Headset className="h-4 w-4" /> Service Desk
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex flex-col bg-slate-50">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm">
          <div className="w-full flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="search" placeholder="Search..." className="w-full rounded-full bg-slate-50 pl-10 pr-4 py-1.5 text-sm border focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase">
            {session.user?.name?.charAt(0) || "U"}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
