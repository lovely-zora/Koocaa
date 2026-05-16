"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, ScanLine, Loader2, CheckCircle2, File } from "lucide-react";
import Tesseract from "tesseract.js";

export function UploadDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Form Data
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Contract");
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileIsImage = selectedFile.type.startsWith('image/');
    setIsImage(fileIsImage);
    setFile(selectedFile);
    setDocName(selectedFile.name);
    
    // Auto-categorize based on file extension
    if (selectedFile.name.includes('.pdf')) setDocType("Policy");
    if (selectedFile.name.includes('.xls') || selectedFile.name.includes('invoice')) setDocType("Invoice");
    
    setIsScanning(true);
    setScanProgress(0);

    if (fileIsImage) {
      setPreview(URL.createObjectURL(selectedFile));
      // Run Tesseract OCR for Images
      try {
        const result = await Tesseract.recognize(selectedFile, 'eng', { 
          logger: m => {
            if (m.status === 'recognizing text') setScanProgress(Math.round(m.progress * 100));
          }
        });
        setExtractedText(result.data.text);
      } catch (error) {
        setExtractedText("Failed to extract text. Please enter manually.");
      } finally {
        setIsScanning(false);
      }
    } else {
      // For PDFs, Word, Excel, etc.
      setPreview("document");
      
      // Simulate a server-side AI extraction for the prototype
      let mockProgress = 0;
      const interval = setInterval(() => {
        mockProgress += 20;
        setScanProgress(mockProgress);
        if (mockProgress >= 100) {
          clearInterval(interval);
          setExtractedText("Document parsed successfully.\n\n[Note: Real text extraction for PDFs and MS Office files would be processed by the Next.js server via libraries like pdf-parse or mammoth.js]");
          setIsScanning(false);
        }
      }, 400);
    }
  };

  const handleSave = () => {
    alert(`Saved ${docName} to the Vault!`);
    setOpen(false);
    setFile(null); setPreview(null); setExtractedText(""); setDocName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 hover:shadow-emerald-600/20 hover:-translate-y-0.5">
          <ScanLine className="w-4 h-4" /> Upload Document
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
            <ScanLine className="w-5 h-5 text-emerald-600" />
            Smart Document Vault
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* LEFT SIDE: Upload & Preview */}
          <div className="space-y-4">
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 mb-3 transition-colors" />
                <p className="text-sm font-medium text-slate-600">Drag & Drop any file</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, PNG, JPG</p>
                {/* UPGRADED ACCEPT ATTRIBUTE */}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" 
                  onChange={handleFileChange} 
                />
              </label>
            ) : (
              <div className="relative w-full h-64 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center">
                
                {/* DYNAMIC RENDER: Image vs Document Icon */}
                {isImage && preview !== "document" ? (
                  <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain opacity-80" />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="w-20 h-20 text-emerald-500 mb-4 opacity-80" />
                    <p className="text-white font-mono text-xs">{docName}</p>
                  </div>
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <ScanLine className="w-10 h-10 text-emerald-400 animate-pulse mb-3" />
                    <p className="text-emerald-400 font-medium text-sm">Processing... {scanProgress}%</p>
                    <div className="w-3/4 h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Extracted Data */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Document Name</label>
              <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Category</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50">
                <option value="Invoice">Invoice / Receipt</option>
                <option value="Contract">Contract</option>
                <option value="Policy">Policy / Compliance</option>
              </select>
            </div>

            <div className="space-y-1 flex-1">
              <label className="text-xs font-semibold text-slate-600 uppercase flex justify-between">
                <span>Extracted Content</span>
                {extractedText && !isScanning && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Processed</span>}
              </label>
              <textarea 
                rows={7} 
                value={extractedText} 
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder={isScanning ? "Processing document..." : "Extracted data will appear here..."}
                className={`w-full border rounded-md p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-colors ${isScanning ? 'bg-slate-100 border-emerald-200 text-slate-400 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`} 
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Cancel</button>
          <button type="button" onClick={handleSave} disabled={isScanning || !file} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
            {isScanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Save to Vault"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
