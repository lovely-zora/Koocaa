import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  Package2 
} from "lucide-react";

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
      {/* 1. Left Sidebar */}
      <div className="hidden border-r border-slate-200 bg-white md:block shadow-sm z-10">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-slate-100 px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="bg-[#1E40AF] p-1.5 rounded-lg text-white">
                <Package2 className="h-5 w-5" />
              </div>
              <span className="text-xl tracking-tight text-slate-900 font-bold">Koocaa</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-3 text-sm font-medium space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-slate-600 transition-all hover:text-[#1E40AF] hover:bg-blue-50">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link href="/assets" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-slate-600 transition-all hover:text-[#1E40AF] hover:bg-blue-50">
                <Package className="h-4 w-4" />
                Asset Inventory
              </Link>
              <Link href="/users" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-slate-600 transition-all hover:text-[#1E40AF] hover:bg-blue-50">
                <Users className="h-4 w-4" />
                Directory
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="flex flex-col w-full overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:h-[60px] lg:px-6 z-10 shadow-sm">
          <div className="w-full flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search assets..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-10 py-2 text-sm outline-none transition-colors focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#1E40AF] to-blue-400 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white cursor-pointer">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* 3. Page Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}