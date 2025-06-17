import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Mode = "EDIT" | "VIEW";

interface FormDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  mode?: Mode;
  className?: string;
  options: { value: string; label: string }[];
  hidden?: boolean;
}

const FormDropdown = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  className,
  mode = "EDIT",
  options,
  hidden = false,
}: FormDropdownProps<T>) => {
  if (hidden) return null;

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins]",
            mode === "VIEW" ? "text-muted-foreground" : "text-gray-500"
          )}
        >
          {label}
        </Label>
      )}
      {mode === "EDIT" ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={mode !== "EDIT"}
            >
              <SelectTrigger id={name} className={className}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <p className="text-sm font-medium font-[Poppins]">
              {options.find((opt) => opt.value === field.value)?.value || "-"}
            </p>
          )}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { FormDropdown };
