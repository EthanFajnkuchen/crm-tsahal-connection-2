import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeRequestIndicator } from "@/components/app-components/change-request-indicator/change-request-indicator";
import { ChangeRequest } from "@/types/change-request";

// Updated to support pending changes for volunteer workflow

type Mode = "EDIT" | "VIEW";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  mode?: Mode;
  className?: string;
  hidden?: boolean;
  isLoading?: boolean;
  readOnly?: boolean;
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

const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  mode = "EDIT",
  hidden = false,
  isLoading = false,
  readOnly = false,
  // Admin change request props
  changeRequests = [],
  onApproveChangeRequest,
  onRejectChangeRequest,
  isAdmin = false,
  // Legacy pending change props
  pendingChange = false,
  pendingChangeDetails,
}: FormCheckboxProps<T>) => {
  if (hidden) return null;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-5" />
      </div>
    );
  }

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
                  className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2"
                >
                  <span>{label}</span>
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
              <div className="pt-4">
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
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
                  className="text-sm text-muted-foreground font-regular font-[Poppins] flex items-center gap-2"
                >
                  <span>{label}</span>
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
              <Checkbox id={name} checked={field.value} disabled />
            </div>
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

export { FormCheckbox };
