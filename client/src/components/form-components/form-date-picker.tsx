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
  disabled?: boolean;
  hidden?: boolean;
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  isLoading?: boolean;
  allowFuture?: boolean;
  maxFutureYears?: number;
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
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 40,
  allowFuture = false,
  maxFutureYears = 0,
}: {
  field: any;
  formatDisplayDate: (dateString: string) => string;
  formatValueDate: (date: Date) => string;
  parseInputDate: (input: string) => Date | null;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  allowFuture?: boolean;
  maxFutureYears?: number;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [calendarKey, _setCalendarKey] = useState(0);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  // Update input when field value changes
  useEffect(() => {
    if (field.value) {
      setInputValue(formatDisplayDate(field.value));
    } else {
      setInputValue("");
    }
  }, [field.value]);

  // Function to auto-format date input with slashes
  const autoFormatDateInput = (value: string): string => {
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, "");

    // Apply formatting based on length
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length <= 8) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(
        2,
        4
      )}/${numbersOnly.slice(4, 8)}`;
    } else {
      // Limit to 8 digits max (ddmmyyyy)
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(
        2,
        4
      )}/${numbersOnly.slice(4, 8)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Close the calendar popup when user starts typing
    setIsOpen(false);

    // Auto-format the input with slashes
    const formattedValue = autoFormatDateInput(value);
    setInputValue(formattedValue);

    // If we have a complete date (dd/mm/yyyy format), try to validate and update immediately
    if (formattedValue.length === 10 && formattedValue.includes("/")) {
      const parsedDate = parseInputDate(formattedValue);
      if (parsedDate) {
        const formattedDateValue = formatValueDate(parsedDate);
        field.onChange(formattedDateValue);
      }
    } else if (formattedValue === "") {
      // If input is cleared, clear the field value
      field.onChange("");
    }
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

  const handleInputFocus = () => {
    if (!readOnly && !disabled) {
      setIsInputFocused(true);
      // Small delay to avoid immediate close
      setTimeout(() => {
        if (!isOpen) {
          setIsOpen(true);
        }
      }, 100);
    }
  };

  const handleInputBlurDelayed = () => {
    setIsInputFocused(false);
    // Delay the blur handling to allow calendar interactions
    setTimeout(() => {
      if (!isInputFocused) {
        handleInputBlur();
      }
    }, 150);
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
    ];

    if (allowedKeys.includes(e.key)) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleInputBlur();
        setIsOpen(false);
      }
      return;
    }

    // Allow only numbers for date input
    if (!/[0-9]/.test(e.key)) {
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

  // Calculate date limits
  const today = new Date();
  const minDate = new Date(`${fromYear}-01-01`);
  const maxDate = allowFuture
    ? new Date(
        today.getFullYear() + maxFutureYears,
        today.getMonth(),
        today.getDate()
      )
    : today;

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
            disabled={readOnly || disabled}
            onClick={(e) => {
              e.preventDefault();
              if (!readOnly && !disabled) {
                setIsOpen(!isOpen);
              }
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlurDelayed}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onClick={(e) => {
                e.stopPropagation();
                handleInputFocus();
              }}
              placeholder="jj/mm/aaaa"
              className="border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0"
              readOnly={readOnly}
              disabled={disabled}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onPointerDownOutside={(e) => {
            // Don't close if clicking on the input
            const target = e.target as HTMLElement;
            if (target.closest("input")) {
              e.preventDefault();
            }
          }}
        >
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            disabled={(date) => date > maxDate || date < minDate}
            fromYear={fromYear}
            toYear={toYear}
            locale={fr}
            initialFocus
            captionLayout="dropdown-buttons"
            month={displayMonth}
            onMonthChange={setDisplayMonth}
            key={`${field.value || "empty"}-${calendarKey}`}
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
      disabled = false,
      hidden = false,
      fromYear = 1900,
      toYear = new Date().getFullYear() + 40,
      required = false,
      isLoading = false,
      allowFuture = false,
      maxFutureYears = 0,
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
    const fieldChangeRequests = changeRequests.filter(
      (request) => request.fieldChanged === name
    );

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
                allowFuture={allowFuture}
                maxFutureYears={maxFutureYears}
                disabled={
                  disabled || (fieldChangeRequests.length > 0 && isAdmin)
                }
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
