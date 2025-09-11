import React from "react";
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
import { ChangeRequestIndicator } from "@/components/app-components/change-request-indicator/change-request-indicator";
import { ChangeRequest } from "@/types/change-request";

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
  // Admin change request functionality
  changeRequests?: ChangeRequest[];
  onApproveChangeRequest?: (changeRequestId: number) => void;
  onRejectChangeRequest?: (changeRequestId: number) => void;
  isAdmin?: boolean;
  // Legacy pending change (for volunteers)
  pendingChange?: boolean;
  pendingChangeDetails?: {
    oldValue: string;
    newValue: string;
  };
}

// Separate component to handle the input logic with hooks
const DatePickerInput = ({
  field,
  formatDisplayDate,
  formatValueDate,
  parseInputDate,
  className,
  readOnly = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 40,
}: {
  field: any;
  formatDisplayDate: (dateString: string) => string;
  formatValueDate: (date: Date) => string;
  parseInputDate: (input: string) => Date | null;
  className?: string;
  readOnly?: boolean;
  fromYear?: number;
  toYear?: number;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Update input when field value changes
  useEffect(() => {
    if (field.value) {
      setInputValue(formatDisplayDate(field.value));
    } else {
      setInputValue("");
    }
  }, [field.value, formatDisplayDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Don't validate while typing, only on blur
  };

  const handleInputBlur = () => {
    if (!inputValue.trim()) {
      // If input is empty, clear the field
      field.onChange("");
      setInputValue("");
      return;
    }

    const parsedDate = parseInputDate(inputValue);

    if (parsedDate) {
      // Valid date parsed
      const formattedValue = formatValueDate(parsedDate);
      field.onChange(formattedValue);
      setInputValue(formatDisplayDate(formattedValue));
    } else if (!field.value) {
      // Invalid input and no existing value, clear
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
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow numbers and common date separators
    if (!/[0-9\/\-\.]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedValue = formatValueDate(date);
      field.onChange(formattedValue);
      setInputValue(formatDisplayDate(formattedValue));
    }
    setIsOpen(false);
  };

  const currentDate = field.value ? parseISO(field.value) : undefined;

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onFocus={() => !readOnly && setIsOpen(true)}
              placeholder="jj/mm/aaaa"
              className="border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0"
              readOnly={readOnly}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date(`${fromYear}-01-01`)
            }
            fromYear={fromYear}
            toYear={toYear}
            locale={fr}
            initialFocus
            captionLayout="dropdown-buttons"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const FormDatePicker = React.forwardRef(
  <T extends FieldValues>(
    {
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
      // Admin change request props
      changeRequests = [],
      onApproveChangeRequest,
      onRejectChangeRequest,
      isAdmin = false,
      // Legacy pending change props
      pendingChange = false,
      pendingChangeDetails,
    }: FormDatePickerProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
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
      try {
        if (!dateString) return "";
        const date = parseISO(dateString);
        if (!isValid(date)) return "";
        return format(date, "dd/MM/yyyy");
      } catch {
        return "";
      }
    };

    const formatValueDate = (date: Date) => {
      try {
        if (!isValid(date)) return "";
        return format(date, "yyyy-MM-dd");
      } catch {
        return "";
      }
    };

    const parseInputDate = (input: string): Date | null => {
      if (!input || input.trim() === "") {
        return null;
      }

      const cleanValue = input.trim();

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
      <div ref={ref} className="space-y-2">
        {label && (
          <Label
            htmlFor={name}
            className={cn(
              "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2",
              mode === "VIEW" ? "text-muted-foreground" : "text-gray-500"
            )}
          >
            <span>
              {label}
              {mode === "EDIT" && required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </span>
            {isAdmin &&
              changeRequests.length > 0 &&
              onApproveChangeRequest &&
              onRejectChangeRequest && (
                <ChangeRequestIndicator
                  changeRequests={changeRequests}
                  fieldName={name}
                  label={label || name}
                  onApprove={onApproveChangeRequest}
                  onReject={onRejectChangeRequest}
                />
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
        {pendingChange && (
          <p className="text-xs text-orange-600 flex items-center gap-1">
            ⏳ Modification en attente
            {pendingChangeDetails && (
              <span className="ml-1 font-mono">
                → "{pendingChangeDetails.newValue}"
              </span>
            )}
          </p>
        )}
      </div>
    );
  }
);

FormDatePicker.displayName = "FormDatePicker";

export { FormDatePicker };
