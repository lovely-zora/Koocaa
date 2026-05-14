import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Mail, Shield, Laptop } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const session = await auth();
  if (!session?.user?.orgId) return null;

  // Fetch all users in your organization AND count how many assets they hold
  const employees = await prisma.user.findMany({
    where: { organizationId: session.user.orgId },
    include: {
      _count: {
        select: { assets: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your team and track their assigned devices.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm">
          <UserPlus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {/* Directory List */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {employees.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No employees found in directory.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <div key={employee.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                  
                  {/* Profile Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700">
                      {employee.name ? employee.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{employee.name || "Unnamed User"}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{employee.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats & Role */}
                  <div className="flex items-center gap-8 sm:pr-4">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {employee.role === "SUPER_ADMIN" ? (
                          <Shield className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span className="text-xs font-medium text-slate-700">
                          {employee.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end w-16">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assets</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Laptop className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          {employee._count.assets}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
