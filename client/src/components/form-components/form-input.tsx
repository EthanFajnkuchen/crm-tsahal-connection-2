import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeRequestIndicator } from "@/components/app-components/change-request-indicator/change-request-indicator";
import { ChangeRequest } from "@/types/change-request";

type Mode = "EDIT" | "VIEW";

interface FormInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  mode?: Mode;
  hidden?: boolean;
  className?: string;
  isLoading?: boolean;
  readOnly?: boolean;
  required?: boolean;
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

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  className,
  mode = "EDIT",
  hidden = false,
  isLoading = false,
  readOnly = false,
  required = false,
  // Admin change request props
  changeRequests = [],
  onApproveChangeRequest,
  onRejectChangeRequest,
  isAdmin = false,
  // Legacy pending change props
  pendingChange = false,
  pendingChangeDetails,
  ...props
}: FormInputProps<T>) => {
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

  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className={cn(
          "text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2"
        )}
      >
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
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
      {mode === "EDIT" ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Input
              {...field}
              {...props}
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500",
                className
              )}
              disabled={readOnly || (fieldChangeRequests.length > 0 && isAdmin)}
            />
          )}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <p className="text-sm font-medium font-[Poppins]">
              {field.value || "-"}
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
};

export { FormInput };
