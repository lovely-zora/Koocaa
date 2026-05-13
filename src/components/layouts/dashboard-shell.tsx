"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Laptop, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  ChevronLeft,
  CreditCard,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/shared/global-search";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Assets", href: "/assets", icon: Laptop },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1E40AF] text-white transition-all duration-300 shadow-xl",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-blue-800/50">
          {!isCollapsed && <span className="text-xl font-bold tracking-tight">Koocaa</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-blue-800 text-blue-100"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                pathname === item.href 
                  ? "bg-white text-[#1E40AF] shadow-md" 
                  : "text-blue-100 hover:bg-blue-800"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800/50">
          <Button variant="ghost" className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white">
            <LogOut className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
          <GlobalSearch />
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300" />
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
