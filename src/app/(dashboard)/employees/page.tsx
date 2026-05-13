import { getEmployees } from "@/server/actions/employees";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, ShieldCheck, HardDrive } from "lucide-react";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employee Directory</h1>
          <p className="text-muted-foreground text-lg">Manage team members and their asset assignments.</p>
        </div>
        <Button className="bg-[#1E40AF] hover:bg-[#1e3a8a]">
          <UserPlus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-600">Employee</TableHead>
              <TableHead className="font-semibold text-gray-600">Role</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center">Assigned Assets</TableHead>
              <TableHead className="font-semibold text-gray-600">Joined Date</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-gray-400">
                  No employees found in this organization.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{emp.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {emp.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 flex w-fit items-center gap-1 px-2 py-0.5">
                      <ShieldCheck className="w-3 h-3" /> {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-700">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{emp._count.assets}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
