import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Mode = "EDIT" | "VIEW";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  mode?: Mode;
  className?: string;
  readOnly?: boolean;
  hidden?: boolean;
}

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  className,
  mode = "EDIT",
  readOnly = false,
  hidden = false,
}: FormDatePickerProps<T>) => {
  if (hidden) return null;

  const formatDisplayDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
  };

  const formatValueDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                  disabled={readOnly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    formatDisplayDate(field.value)
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  defaultMonth={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const selectedDateString = formatValueDate(date);
                      // If the same date is clicked again, clear the field
                      if (field.value === selectedDateString) {
                        field.onChange("");
                      } else {
                        field.onChange(selectedDateString);
                      }
                    } else {
                      field.onChange("");
                    }
                  }}
                  initialFocus
                />
                {field.value && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => field.onChange("")}
                    >
                      Effacer la date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <p className="text-sm font-medium font-[Poppins]">
              {field.value ? formatDisplayDate(field.value) : "-"}
            </p>
          )}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { FormDatePicker };
