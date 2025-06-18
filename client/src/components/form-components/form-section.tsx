import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  mode?: "EDIT" | "VIEW";
  onModeChange?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  saveDisabled?: boolean;
}

interface FormSubSectionProps {
  title?: string;
  children: React.ReactNode;
  mode?: "EDIT" | "VIEW";
}

interface FormChildProps {
  mode?: "EDIT" | "VIEW";
}

const FormSubSection: React.FC<FormSubSectionProps> = ({
  title,
  children,
  mode,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-medium text-black font-[Poppins]">{title}</h4>
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormChildProps>(child)) {
            return React.cloneElement(child, { mode });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  mode = "VIEW",
  onModeChange,
  onSave,
  onCancel,
  isLoading = false,
  saveDisabled = false,
}) => {
  return (
    <div className="bg-white m-3 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold font-[Poppins] text-[#601886]">
          {title}
        </h3>
        <div className="flex gap-2">
          {mode === "VIEW" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onModeChange}
              className="h-8 border"
              type="button"
            >
              Modifier
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 border"
                type="button"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8 border bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
                type="submit"
                disabled={isLoading || saveDisabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormChildProps>(child)) {
            return React.cloneElement(child, { mode });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export { FormSection, FormSubSection };
