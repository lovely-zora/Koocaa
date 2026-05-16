"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Laptop, FileText, Headset, Folder, Users, LayoutDashboard, ChevronRight, Loader2 } from "lucide-react";
import { performGlobalSearch } from "@/server/actions/search";

// Icon mapping dictionary
const IconMap: any = {
  Laptop, Users, Headset, FileText, Folder
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Listen for Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Database Search Hook with Debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const dbResults = await performGlobalSearch(query);
      setResults(dbResults);
      setIsSearching(false);
    }, 300); // Waits 300ms after you stop typing before hitting the database

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(path);
  };

  return (
    <>
      <div className="relative w-full max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        <button 
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between rounded-full bg-slate-50 pl-10 pr-3 py-2 text-sm border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all text-slate-500"
        >
          <span>Search assets, tickets, employees...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-200 text-slate-600">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center border-b border-slate-100 px-4">
              <Search className="w-6 h-6 text-blue-500 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Find anything..." 
                className="w-full py-5 text-lg outline-none bg-transparent placeholder:text-slate-400 text-slate-800"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isSearching && <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-3" />}
              <button onClick={() => setOpen(false)} className="text-[10px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 transition-colors">
                ESC
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              
              {!query && (
                <div className="mb-4 mt-2">
                  <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Navigation</p>
                  <div className="space-y-1">
                    {[
                      { name: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard },
                      { name: "Asset Inventory", path: "/assets", icon: Laptop },
                      { name: "Document Vault", path: "/forms", icon: FileText },
                    ].map((link) => (
                      <button key={link.name} onClick={() => handleSelect(link.path)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 group transition-colors">
                        <div className="flex items-center gap-3">
                          <link.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          <span className="text-sm font-medium text-slate-700">{link.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length >= 2 && results.length > 0 && (
                <div className="mt-2">
                  <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Top Results</p>
                  <div className="space-y-1">
                    {results.map((result) => {
                      const IconComponent = IconMap[result.iconName] || Laptop;
                      return (
                        <button key={result.id} onClick={() => handleSelect(result.path)} className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${result.bg} ${result.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-slate-800">{result.name}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{result.type}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all">Jump to →</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {query.length >= 2 && !isSearching && results.length === 0 && (
                <div className="py-14 text-center">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-900">No results found for "{query}"</p>
                  <p className="text-xs text-slate-500 mt-1">Check your spelling or try another keyword.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
