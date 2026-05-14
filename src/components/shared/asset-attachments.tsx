"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadAttachment } from "@/server/actions/attachments";
import { Paperclip, Upload, FileText, Loader2, Download } from "lucide-react";
import Link from "next/link";

export function AssetAttachments({ 
  assetId, 
  attachments 
}: { 
  assetId: string; 
  attachments: { id: string, fileName: string, fileUrl: string, uploadedAt: Date }[] 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAttachment(assetId, formData);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-white shadow-sm border-slate-200 mt-6">
      <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-blue-600" /> Document Vault
        </CardTitle>
        <div>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="h-8 text-xs bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1.5" />}
            Upload File
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {attachments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No documents attached. Upload invoices or warranties here.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attachments.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{doc.fileName}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link href={doc.fileUrl} target="_blank" download>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
