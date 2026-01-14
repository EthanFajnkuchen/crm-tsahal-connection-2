import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelect } from "@/components/ui/single-select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeRequestIndicator } from "@/components/app-components/change-request-indicator/change-request-indicator";
import { ChangeRequest } from "@/types/change-request";

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
  passDisplayName?: boolean;
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
  passDisplayName = false,
  // Admin change request props
  changeRequests = [],
  onApproveChangeRequest,
  onRejectChangeRequest,
  isAdmin = false,
  // Legacy pending change props
  pendingChange = false,
  pendingChangeDetails,
}: FormDropdownProps<T>) => {
  if (hidden) return null;
  // Filter change requests for this specific field
  // Use trim() to handle any whitespace issues
  const fieldChangeRequests = changeRequests.filter(
    (request) => request.fieldChanged?.trim() === name?.trim()
  );
  
  // Determine if there's a pending change
  // For volunteers: check both pendingChange prop AND fieldChangeRequests
  // For admins: only check pendingChange prop (they see ChangeRequestIndicator instead)
  // Note: pendingChange comes from getFieldProps() which uses hasFieldPendingChanges()
  // But we also check fieldChangeRequests directly as a fallback for volunteers
  // This ensures the message displays even if pendingChange prop is not correctly passed
  const hasPendingChange = Boolean(pendingChange) || (fieldChangeRequests.length > 0 && !isAdmin);
  
  // Get the new value to display - prefer pendingChangeDetails, fallback to fieldChangeRequests
  const displayNewValue = pendingChangeDetails?.newValue || 
    (fieldChangeRequests.length > 0 ? fieldChangeRequests[0].newValue : null);
  
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
                onApprove={onApproveChangeRequest}
                onReject={onRejectChangeRequest}
                label={label}
              />
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
                disabled={
                  disabled || (fieldChangeRequests.length > 0 && isAdmin)
                }
                displayLabel={passDisplayName}
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
              {passDisplayName
                ? options.find((opt) => opt.value === field.value)?.label || "-"
                : options.find((opt) => opt.value === field.value)?.value ||
                  "-"}
            </p>
          )}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hasPendingChange && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          ⏳ Modification en attente
          {displayNewValue && (
            <span className="ml-1 font-mono">→ "{displayNewValue}"</span>
          )}
        </p>
      )}
    </div>
  );
};

export { FormDropdown };
