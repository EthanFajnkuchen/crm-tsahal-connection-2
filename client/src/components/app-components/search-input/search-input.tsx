import type React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-fuchsia-800 font-bold" />
      <Input {...props} className={`pl-8 ${className}`} />
    </div>
  );
}
