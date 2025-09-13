import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SingleSelect({
  options,
  placeholder = "Sélectionner une option...",
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucun résultat trouvé.",
  value,
  onChange,
  className,
  disabled = false,
  isLoading = false,
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    value
  );

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? "" : currentValue;
    setSelectedValue(newValue);
    onChange?.(newValue);
    setOpen(false);
  };

  if (isLoading) {
    return <Skeleton className={cn("h-9 w-full", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
