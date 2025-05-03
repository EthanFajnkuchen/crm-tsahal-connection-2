import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Mode = "EDIT" | "VIEW";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  mode?: Mode;
  className?: string;
}

const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  mode = "EDIT",
}: FormCheckboxProps<T>) => {
  return (
    <div className="space-y-2">
      {mode === "EDIT" ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div className="space-y-2 flex flex-col">
              {label && (
                <Label
                  htmlFor={name}
                  className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                >
                  {label}
                </Label>
              )}
              <div className="pt-4">
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </div>
          )}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div className="space-y-2 flex flex-col">
              {label && (
                <Label
                  htmlFor={name}
                  className="text-sm text-muted-foreground font-semibold"
                >
                  {label}
                </Label>
              )}
              <Checkbox id={name} checked={field.value} disabled />
            </div>
          )}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { FormCheckbox };
