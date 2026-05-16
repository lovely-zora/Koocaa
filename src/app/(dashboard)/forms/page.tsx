import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, Search, File, MoreVertical, ShieldCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadDocumentDialog } from "@/components/forms/upload-document-dialog";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  const session = await auth();
  if (!session?.user?.orgId) redirect("/login");

  const documents = [
    { id: 1, name: "Q3_Enterprise_Software_License.pdf", type: "Contract", date: "Oct 24, 2026", size: "2.4 MB" },
    { id: 2, name: "Employee_Equipment_Agreement_v2.docx", type: "Policy", date: "Oct 22, 2026", size: "1.1 MB" },
    { id: 3, name: "Dell_Server_Invoice_INV-9921.pdf", type: "Invoice", date: "Oct 15, 2026", size: "850 KB" },
    { id: 4, name: "Annual_Security_Compliance_Audit.pdf", type: "Compliance", date: "Oct 10, 2026", size: "5.2 MB" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            Document Vault
          </h1>
          <p className="text-sm text-slate-500 mt-1">Securely manage contracts, invoices, and compliance forms.</p>
        </div>
        
        {/* HERE IS YOUR NEW SMART UPLOAD BUTTON */}
        <UploadDocumentDialog />
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Documents</p>
              <h3 className="text-2xl font-bold text-slate-900">1,284</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Compliance Status</p>
              <h3 className="text-2xl font-bold text-slate-900">100% Valid</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Signatures</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search documents by name or type..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Document Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date Uploaded</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="font-medium text-slate-700">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">{doc.type}</span></td>
                  <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-200"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
