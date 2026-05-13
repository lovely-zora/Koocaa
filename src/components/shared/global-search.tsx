"use client";

import * as React from "react";
import { Search, Laptop, User, Command as CommandIcon } from "lucide-react";
import { globalSearch } from "@/server/actions/search";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState({ assets: [], employees: [] });
  const router = useRouter();

  // Keyboard shortcut Ctrl+K or Cmd+K to open search instantly
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch fuzzy search results from the server as the user types
  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 1) {
        const data = await globalSearch(query);
        setResults(data);
      } else {
        setResults({ assets: [], employees: [] });
      }
    };

    const timer = setTimeout(fetchResults, 200); // Debounce to save server resources
    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Visual Search Trigger (The bar seen in the header) */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center w-full max-w-sm px-4 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all group"
      >
        <Search className="w-4 h-4 mr-2 group-hover:text-blue-500 transition-colors" />
        <span className="flex-1 text-left">Search assets or staff...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-gray-400 bg-white border rounded">
          <CommandIcon className="w-3 h-3" />K
        </kbd>
      </button>

      {/* The Command Palette Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type an asset tag, name, or brand..." 
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found for "{query}".</CommandEmpty>
          
          {results.assets.length > 0 && (
            <CommandGroup heading="Assets">
              {results.assets.map((asset: any) => (
                <CommandItem 
                  key={asset.id} 
                  onSelect={() => onSelect(`/assets/${asset.id}`)}
                  className="cursor-pointer"
                >
                  <Laptop className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{asset.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">{asset.assetTag}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.employees.length > 0 && (
            <CommandGroup heading="Employees">
              {results.employees.map((emp: any) => (
                <CommandItem 
                  key={emp.id} 
                  onSelect={() => onSelect(`/employees/${emp.id}`)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-purple-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{emp.name}</span>
                    <span className="text-[10px] text-gray-400">{emp.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
