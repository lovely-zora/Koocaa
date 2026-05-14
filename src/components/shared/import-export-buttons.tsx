"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { bulkImportAssets, getAssetsForExport } from "@/server/actions/bulk-assets";

export function ImportExportButtons() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to fetch and format data
  const generateData = async () => {
    const data = await getAssetsForExport();
    const ws = XLSX.utils.json_to_sheet(data.map(d => ({
      "Asset Name": d.name,
      "Asset Tag": d.assetTag,
      "Category": d.category,
      "Status": d.status,
      "Added Date": new Date(d.createdAt).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    return wb;
  };

  // 1. EXPORT EXCEL (.xlsx)
  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const wb = await generateData();
      XLSX.writeFile(wb, `Koocaa_Assets_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  // 2. EXPORT CSV (.csv)
  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      const wb = await generateData();
      XLSX.writeFile(wb, `Koocaa_Assets_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExportingCSV(false);
    }
  };

  // 3. IMPORT FEATURE
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Intelligently map Excel/CSV columns to our Database fields
        const formattedData = data.map((row: any) => ({
          name: row["Asset Name"] || row["Name"] || "Unknown Asset",
          assetTag: row["Asset Tag"] || row["Tag"] || `TAG-${Math.floor(Math.random() * 90000) + 10000}`,
          category: row["Category"] || row["Type"] || "Hardware",
        }));

        await bulkImportAssets(formattedData);
      } catch (error) {
        console.error("Import failed", error);
        alert("Failed to import. Please check your Excel/CSV format.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleImport} />

      {/* CSV Button - Blue Icon */}
      <Button variant="outline" onClick={handleExportCSV} disabled={isExportingCSV || isExportingExcel} className="bg-white border-slate-200 text-slate-700 shadow-sm h-9 px-3">
        {isExportingCSV ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <FileText className="w-4 h-4 mr-2 text-blue-600" />} 
        CSV
      </Button>

      {/* Excel Button - Green Icon */}
      <Button variant="outline" onClick={handleExportExcel} disabled={isExportingExcel || isExportingCSV} className="bg-white border-slate-200 text-slate-700 shadow-sm h-9 px-3">
        {isExportingExcel ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />} 
        Excel
      </Button>

      {/* Import Button */}
      <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm h-9 px-3">
        {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2 text-slate-500" />} 
        Import Data
      </Button>
    </div>
  );
}
