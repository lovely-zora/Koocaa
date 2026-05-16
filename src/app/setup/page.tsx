"use client";

import { useState } from "react";
import { Box, Laptop, FileText, Building2, CheckCircle2, ArrowRight, Hexagon } from "lucide-react";
import { configureWorkspace } from "@/server/actions/setup";
import { Zen_Dots } from "next/font/google";

const zenDots = Zen_Dots({ weight: "400", subsets: ["latin"] });

const businessTypes = [
  {
    id: "retail",
    title: "Standard Inventory",
    description: "Perfect for managing physical goods, retail stock, tools, and basic employee assignments.",
    icon: Box,
    modules: ["DASHBOARD", "ASSETS", "DIRECTORS"],
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200"
  },
  {
    id: "it",
    title: "IT & Digital Infrastructure",
    description: "For tech teams managing laptops, network discovery, software licenses, and IT support tickets.",
    icon: Laptop,
    modules: ["DASHBOARD", "ASSETS", "DIRECTORS", "HELPDESK", "CAPITALS"],
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200"
  },
  {
    id: "finance",
    title: "Finance & Administration",
    description: "Focused on compliance, contracts, bills, document vaulting, and depreciation.",
    icon: FileText,
    modules: ["DASHBOARD", "ASSETS", "DIRECTORS", "FORMS"],
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200"
  },
  {
    id: "enterprise",
    title: "The Complete Enterprise",
    description: "The ultimate suite. Unlock every single module to manage a massive organization.",
    icon: Building2,
    modules: ["DASHBOARD", "ASSETS", "DIRECTORS", "HELPDESK", "CAPITALS", "FORMS"],
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-200"
  }
];

export default function SetupPage() {
  const [selected, setSelected] = useState(businessTypes[1]); // Default to IT
  const [isLoading, setIsLoading] = useState(false);

  async function handleComplete() {
    setIsLoading(true);
    await configureWorkspace(selected.modules);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-12">
          <Hexagon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h1 className={`text-3xl text-slate-900 mb-2 ${zenDots.className}`}>Achacho Setup</h1>
          <p className="text-slate-500">How will you be using your workspace?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selected.id === type.id;
            return (
              <div 
                key={type.id}
                onClick={() => setSelected(type)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? `${type.bg} shadow-md scale-[1.02]` 
                    : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className={`w-6 h-6 ${type.color}`} />
                  </div>
                )}
                <Icon className={`w-8 h-8 mb-4 ${isSelected ? type.color : "text-slate-400"}`} />
                <h3 className="text-lg font-bold text-slate-800 mb-2">{type.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{type.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {type.modules.map(mod => (
                    <span key={mod} className="text-[10px] font-bold bg-white/60 border border-slate-200 px-2 py-1 rounded text-slate-600">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleComplete}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? "Configuring Workspace..." : "Launch My Workspace"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
