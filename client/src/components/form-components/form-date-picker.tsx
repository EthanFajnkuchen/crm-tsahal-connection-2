import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  isLoading?: boolean;
}

// Separate component to handle the input logic with hooks
const DatePickerInput = ({
  field,
  formatDisplayDate,
  formatValueDate,
  parseInputDate,
  className,
  readOnly,
  fromYear,
  toYear,
}: {
  field: any;
  formatDisplayDate: (dateString: string) => string;
  formatValueDate: (date: Date) => string;
  parseInputDate: (inputValue: string) => Date | null;
  className?: string;
  readOnly: boolean;
  fromYear: number;
  toYear: number;
}) => {
  const [inputValue, setInputValue] = useState(
    field.value ? formatDisplayDate(field.value) : ""
  );
  const [isOpen, setIsOpen] = useState(false);

  // Update input when field value changes externally (e.g., form reset)
  useEffect(() => {
    if (field.value && field.value !== "") {
      setInputValue(formatDisplayDate(field.value));
    } else {
      setInputValue("");
    }
  }, [field.value, formatDisplayDate]);

  const formatInputWithMask = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Apply mask: dd/mm/yyyy
    let formatted = "";
    for (let i = 0; i < numbers.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        formatted += "/";
      }
      formatted += numbers[i];
    }

    return formatted;
  };

  const parseFormattedDate = (formattedValue: string): Date | null => {
    // Only try to parse if we have a complete date (dd/mm/yyyy format)
    if (formattedValue.length !== 10 || !formattedValue.includes("/")) {
      return null;
    }

    const parts = formattedValue.split("/");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Basic validation
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return null;
    }

    // Create date and validate it exists (handles February 29, etc.)
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // If user is deleting, allow it
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);

      // If the input becomes invalid after deletion, clear the field
      const parsedDate = parseFormattedDate(rawValue);
      if (!parsedDate && rawValue.length === 0) {
        field.onChange("");
      }
      return;
    }

    // Apply the mask
    const maskedValue = formatInputWithMask(rawValue);
    setInputValue(maskedValue);

    // Try to parse and update the field value
    const parsedDate = parseFormattedDate(maskedValue);
    if (parsedDate && isValid(parsedDate)) {
      const formattedDate = formatValueDate(parsedDate);
      field.onChange(formattedDate);
    }
  };

  const handleInputBlur = () => {
    // On blur, validate the complete date
    const parsedDate = parseFormattedDate(inputValue);
    if (parsedDate && isValid(parsedDate)) {
      const formattedDate = formatValueDate(parsedDate);
      field.onChange(formattedDate);
      // Keep the masked format for display
      setInputValue(formatInputWithMask(inputValue));
    } else if (inputValue.trim() === "") {
      // If input is empty, clear the field
      field.onChange("");
      setInputValue("");
    } else {
      // If input is invalid, revert to previous valid value or clear
      if (field.value) {
        setInputValue(formatDisplayDate(field.value));
      } else {
        setInputValue("");
        field.onChange("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation keys, backspace, delete, etc.
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Enter",
      "Escape",
    ];

    // Allow numbers
    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const selectedDateString = formatValueDate(date);
      // If the same date is clicked again, clear the field
      if (field.value === selectedDateString) {
        field.onChange("");
        setInputValue("");
      } else {
        field.onChange(selectedDateString);
        setInputValue(formatDisplayDate(selectedDateString));
      }
    } else {
      field.onChange("");
      setInputValue("");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="jj/mm/aaaa"
        maxLength={10}
        className={cn("pr-10", className)}
        disabled={readOnly}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            disabled={readOnly}
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            defaultMonth={field.value ? new Date(field.value) : undefined}
            fromYear={fromYear}
            toYear={toYear}
            onSelect={handleCalendarSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  className,
  mode = "EDIT",
  readOnly = false,
  hidden = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 40,
  required = false,
  isLoading = false,
}: FormDatePickerProps<T>) => {
  if (hidden) return null;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const formatDisplayDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
  };

  const formatValueDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const parseInputDate = (inputValue: string): Date | null => {
    // Remove any extra spaces and normalize
    const cleanValue = inputValue.trim();

    // Try different date formats
    const formats = [
      "dd/MM/yyyy",
      "d/M/yyyy",
      "dd/MM/yy",
      "d/M/yy",
      "dd-MM-yyyy",
      "d-M-yyyy",
      "yyyy-MM-dd",
    ];

    for (const formatStr of formats) {
      try {
        const parsedDate = parse(cleanValue, formatStr, new Date());
        if (isValid(parsedDate)) {
          // If year is 2-digit and less than 50, assume 20xx, otherwise 19xx
          if (formatStr.includes("yy") && !formatStr.includes("yyyy")) {
            const year = parsedDate.getFullYear();
            if (year < 50) {
              parsedDate.setFullYear(2000 + year);
            } else if (year < 100) {
              parsedDate.setFullYear(1900 + year);
            }
          }
          return parsedDate;
        }
      } catch {
        continue;
      }
    }

    return null;
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
          {mode === "EDIT" && required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>
      )}
      {mode === "EDIT" ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePickerInput
              field={field}
              formatDisplayDate={formatDisplayDate}
              formatValueDate={formatValueDate}
              parseInputDate={parseInputDate}
              className={className}
              readOnly={readOnly}
              fromYear={fromYear}
              toYear={toYear}
            />
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
