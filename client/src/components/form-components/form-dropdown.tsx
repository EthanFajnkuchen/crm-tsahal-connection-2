import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelect } from "@/components/ui/single-select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  pendingChange?: boolean;
  pendingChangeDetails?: {
    oldValue: string;
    newValue: string;
  };
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
  required = false,
  isLoading = false,
  disabled = false,
  pendingChange = false,
  pendingChangeDetails,
}: FormDropdownProps<T>) => {
  if (hidden) return null;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

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
          {mode === "EDIT" && required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>
      )}
      {mode === "EDIT" ? (
        <div>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <SingleSelect
                options={options}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner"
                className={className}
                disabled={disabled}
              />
            )}
          />
        </div>
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
      {pendingChange && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          ⏳ Modification en attente
          {pendingChangeDetails && (
            <span className="ml-1 font-mono">
              → {pendingChangeDetails.newValue}
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export { FormDropdown };
