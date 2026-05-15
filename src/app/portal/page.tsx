import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package2, ShieldAlert } from "lucide-react";

export default async function UserPortalPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Package2 className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Portal</h1>
          <p className="text-slate-500 mt-2">
            Welcome back, <span className="font-medium text-slate-700">{session.user?.name}</span>.
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            The dedicated employee self-service portal is currently under construction. 
            <br/><br/>
            <strong>Note:</strong> You do not have permissions to access the Koocaa Administrator Console.
          </p>
        </div>
      </div>
    </div>
  );
}
