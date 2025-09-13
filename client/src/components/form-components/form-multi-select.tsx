import { useMemo, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface FormMultiSelectOption {
  value: string;
  label: string;
}

interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: FormMultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  loadingText?: string;
  emptyText?: string;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormMultiSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Sélectionner des éléments",
  searchPlaceholder,
  loadingText = "Chargement...",
  emptyText = "Aucun élément trouvé",
  isLoading = false,
  className,
  disabled = false,
}: FormMultiSelectProps<TFieldValues>) {
  const [search, setSearch] = useState("");

  // Memoized filtered options based on search
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Generate search placeholder
  const finalSearchPlaceholder =
    searchPlaceholder || `Rechercher parmi ${options.length} éléments...`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        // Sort filtered options: selected first, then unselected
        const sortedFilteredOptions = [...filteredOptions].sort((a, b) => {
          const aIsSelected = selectedValues.includes(a.value);
          const bIsSelected = selectedValues.includes(b.value);

          // If both selected or both not selected, maintain alphabetical order
          if (aIsSelected === bIsSelected) {
            return a.label.localeCompare(b.label);
          }

          // Selected options come first
          return aIsSelected ? -1 : 1;
        });

        const toggleOption = (value: string) => {
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter((v: string) => v !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        const getDisplayText = () => {
          if (selectedValues.length > 0) {
            return `${selectedValues.length} sélectionné(s)`;
          }
          return placeholder;
        };

        if (isLoading) {
          return (
            <FormItem className={className}>
              <FormLabel>{label}</FormLabel>
              <Skeleton className="h-9 w-full" />
              <FormMessage />
            </FormItem>
          );
        }

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between text-left font-medium"
                    disabled={disabled}
                  >
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder={finalSearchPlaceholder}
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? loadingText : emptyText}
                    </CommandEmpty>
                    <CommandGroup>
                      {sortedFilteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => toggleOption(option.value)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              checked={selectedValues.includes(option.value)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            {option.label}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormMultiSelect;
