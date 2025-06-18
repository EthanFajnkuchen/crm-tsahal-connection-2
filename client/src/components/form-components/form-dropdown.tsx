import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelect } from "@/components/ui/single-select";
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
            <SingleSelect
              options={options}
              value={field.value}
              onChange={field.onChange}
              placeholder="Sélectionner"
              className={className}
            />
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
